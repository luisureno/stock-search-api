from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import requests
import os

application = Flask(__name__)
CORS(application)
load_dotenv()

TIINGO_API_KEY = os.getenv("TIINGO_API_KEY")

@application.route('/')
def index():
    return render_template('index.html')

@application.route('/search', methods=['GET'])
def search_stock():
    stock_symbol = request.args.get('stock_symbol')
    
    if not stock_symbol:
        return jsonify({'error': 'Please provide a valid stock symbol'}), 400

    try:
        company_outlook_data = fetch_company_outlook_data(stock_symbol)
        stock_summary_data = fetch_stock_summary_data(stock_symbol)

        last = stock_summary_data.get('last') or 0
        prev = stock_summary_data.get('prevClose') or 0


        last_f = float(last)
        prev_f = float(prev)
        # Simple subtraction
        change = last_f - prev_f
        if prev_f != 0:
            # Math logic: (New - Old) / Old * 100
            change_percent = (change / prev_f) * 100
        else:
            change_percent = 0

        result_data = {
            'company_outlook': {
                'name': company_outlook_data.get('name', ''),
                'ticker': company_outlook_data.get('ticker', ''),
                'exchangeCode': company_outlook_data.get('exchangeCode', ''),
                'startDate': company_outlook_data.get('startDate', ''),
                'description': company_outlook_data.get('description', ''),
            },
            'stock_summary': {
                'ticker': stock_summary_data.get('ticker', ''),
                'timestamp': stock_summary_data.get('timestamp', ''),
                'prevClose': stock_summary_data.get('prevClose', ''),
                'open': stock_summary_data.get('open', ''),
                'high': stock_summary_data.get('high', ''),
                'low': stock_summary_data.get('low', ''),
                'last': stock_summary_data.get('last', ''),
                'change': change,
                'changePercent': change_percent,
                'volume': stock_summary_data.get('volume', ''),
            },
            'charts': {},
            'latest_news': {}
        }
        
        return jsonify(result_data)
    
    except ValueError as e:
        return jsonify({'error': str(e)}), 500

def fetch_company_outlook_data(stock_symbol):
    company_outlook_url = f'https://api.tiingo.com/tiingo/daily/{stock_symbol.lower()}?token={TIINGO_API_KEY}'
    company_outlook_response = requests.get(company_outlook_url)
    
    if company_outlook_response.status_code != 200:
        raise ValueError('Error retrieving Company Outlook data')

    return company_outlook_response.json()

def fetch_stock_summary_data(stock_symbol):
    stock_summary_url = f'https://api.tiingo.com/iex/{stock_symbol}?token={TIINGO_API_KEY}'
    stock_summary_response = requests.get(stock_summary_url)
    
    if stock_summary_response.status_code != 200:
        raise ValueError('Error retrieving Stock Summary data')

    stock_summary_data = stock_summary_response.json()

    if isinstance(stock_summary_data, list) and stock_summary_data:
        return stock_summary_data[0]
    else:
        raise ValueError('Invalid Stock Summary data format')

if __name__ == '__main__':
    application.run(debug=True)
