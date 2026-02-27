function searchStock() {
    var stockSymbol = document.getElementById('stockSymbol').value;
    
    if (!stockSymbol) {
        showError('Please provide a stock symbol');
        return;
    }

    fetch(`/search?stock_symbol=${stockSymbol}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            clearResults();
            hideError();

            // Check if 'error' property exists in the response
            if (data.error) {
                showError('Error: No record has been found, please enter a valid symbol');
            } else {
                if (data.company_outlook) {
                    // Create tables for each property in company_outlook in a specific order
                    createTable('Company Name', data.company_outlook.name, 'results-company-outlook');
                    createTable('Stock Ticker Symbol', data.company_outlook.ticker, 'results-company-outlook');
                    createTable('Stock Exchange Code', data.company_outlook.exchangeCode, 'results-company-outlook');
                    createTable('Company Start Date', data.company_outlook.startDate, 'results-company-outlook');
                    createTable('Description', data.company_outlook.description, 'results-company-outlook');
                } else {
                    showError('Company outlook data not available');
                }

                if (data.stock_summary) {
                    // Create tables for each property in stock_summary in a specific order
                    createTable('Stock Ticker Symbol', data.stock_summary.ticker, 'results-stock-summary');
                    createTable('Trading Day', data.stock_summary.timestamp, 'results-stock-summary');
                    createTable('Previous Closing Price', data.stock_summary.prevClose, 'results-stock-summary');
                    createTable('Opening Price', data.stock_summary.open, 'results-stock-summary');
                    createTable('High Price', data.stock_summary.high, 'results-stock-summary');
                    createTable('Low Price', data.stock_summary.low, 'results-stock-summary');
                    createTable('Last Price', data.stock_summary.last, 'results-stock-summary');
                    createTable('Change', calculateChange(data.stock_summary.last, data.stock_summary.prevClose), 'results-stock-summary');
                    createTable('Change Percent', typeof data.stock_summary.changePercent === 'number' ? data.stock_summary.changePercent.toFixed(2) + '%' : data.stock_summary.changePercent, 'results-stock-summary');
                    createTable('Number of Shares Traded', data.stock_summary.volume, 'results-stock-summary');
                } else {
                    showError('Stock summary data not available');
                }

                showTab('company-outlook');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError(`An error occurred while fetching data: ${error.message}`);
        });
}

function calculateChange(last, prevClose) {
    const change = last - prevClose;
    return `${change} ${change > 0 ? '' : ''}`;
}

function calculateChangePercent(last, prevClose) {
    const changePercent = ((last - prevClose) / prevClose) * 100;
    return `${changePercent.toFixed(2)}% ${changePercent > 0 ? '' : ''}`;
}

function createTable(propertyName, propertyValue, resultId) {
    const table = document.createElement('table');
    const tbody = table.createTBody();
    const row = tbody.insertRow();
    const cellLabel = row.insertCell(0);
    const cellValue = row.insertCell(1);
    cellLabel.textContent = propertyName;
    cellValue.textContent = propertyValue != null && propertyValue !== '' ? propertyValue : '—';
    document.getElementById(resultId).appendChild(table);
}

function clearResults() {
    document.getElementById('results-company-outlook').innerHTML = '';
    document.getElementById('results-stock-summary').innerHTML = '';
}

function showError(message) {
    var errorMessageElement = document.getElementById('error-message');
    if (errorMessageElement) {
        errorMessageElement.innerText = message;
    }
}

function hideError() {
    var errorMessageElement = document.getElementById('error-message');
    if (errorMessageElement) {
        errorMessageElement.innerText = '';
    }
}

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active-tab');
    });
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
    });
    var panel = document.getElementById(tabId);
    if (panel) panel.classList.add('active-tab');
    var btn = document.querySelector('.tab-button[data-tab="' + tabId + '"]');
    if (btn) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
    }
}
