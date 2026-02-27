# Stock Search API ddd

Flask app that looks up stock info by ticker symbol using the Tiingo API.

## How to run the project

**1. Put your Tiingo API key in a `.env` file in the project root:**

```
TIINGO_API_KEY=your_api_key_here
```

Get a free key at: https://www.tiingo.com/account/api/token

**2. Install dependencies and run the app.** Copy and paste the block below into your terminal (from the project folder):

```
cd /Users/luisangelureno/Desktop/STOCKAPI
python3 -m venv venv
source venv/bin/activate
pip install flask flask-cors python-dotenv requests
python application.py
```

**3. Open in the browser:** http://127.0.0.1:5000

---

## All-in-one copy-paste (run from project folder)

```
cd /Users/luisangelureno/Desktop/STOCKAPI && python3 -m venv venv && source venv/bin/activate && pip install flask flask-cors python-dotenv requests && echo "Add TIINGO_API_KEY=your_key to .env if you haven't" && python application.py
```

*(Create a `.env` file with `TIINGO_API_KEY=your_key` in the project root before running, or the search will fail.)*
