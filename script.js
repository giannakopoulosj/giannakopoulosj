document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const errorContainer = document.getElementById('error-container');
    const coinListEl = document.getElementById('coin-list');
    const silverPriceTozEl = document.getElementById('silver-price-toz');
    const silverPriceGramEl = document.getElementById('silver-price-gram');
    const clearAllBtn = document.getElementById('clear-all-btn');
    const searchInput = document.getElementById('search-input');
    const clearSearchBtn = document.getElementById('clear-search-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const totalsSection = document.getElementById('totals-section'); // NEW: Get the totals section
    const filteredIndicator = document.getElementById('filtered-indicator'); // NEW: Get the filtered text indicator

    // Data
    let groupedCoins = {};
    const TROY_OUNCE_IN_GRAMS = 31.1034768;
    const STORAGE_KEY = 'coinQuantities';

    // --- Theme Management ---
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.checked = true;
        } else {
            document.body.classList.remove('dark-mode');
            themeToggle.checked = false;
        }
    }
    
    function saveTheme(theme) {
        localStorage.setItem('theme', theme);
    }

    themeToggle.addEventListener('change', () => {
        const newTheme = themeToggle.checked ? 'dark' : 'light';
        applyTheme(newTheme);
        saveTheme(newTheme);
    });

    function loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            applyTheme(savedTheme);
        } else {
            applyTheme('dark');
        }
    }

    // --- Search Functionality (UPDATED for visual distinction) ---
    function filterCoins() {
        const query = searchInput.value.toLowerCase().trim();
        const searchWords = query.split(' ').filter(word => word.length > 0);

        // Show/hide clear search button
        if (query.length > 0) {
            clearSearchBtn.style.display = 'block';
            // NEW: Add filtered class and show indicator when search is active
            totalsSection.classList.add('filtered-active');
            filteredIndicator.style.display = 'inline';
        } else {
            clearSearchBtn.style.display = 'none';
            // NEW: Remove filtered class and hide indicator when search is cleared
            totalsSection.classList.remove('filtered-active');
            filteredIndicator.style.display = 'none';
        }

        document.querySelectorAll('.country-group').forEach(group => {
            const countryName = group.querySelector('.country-title').textContent.toLowerCase();
            let hasVisibleCoins = false;

            group.querySelectorAll('.coin-item').forEach(item => {
                const coinText = item.querySelector('span:first-child').textContent.toLowerCase();
                const searchableText = `${countryName} ${coinText}`;

                const isMatch = searchWords.every(word => searchableText.includes(word));

                if (isMatch) {
                    item.style.display = 'flex';
                    hasVisibleCoins = true;
                } else {
                    item.style.display = 'none';
                }
            });

            if (hasVisibleCoins) {
                group.style.display = 'block';
                group.open = true;
            } else {
                group.style.display = 'none';
            }
            
            if (query === '') {
                group.open = false;
                group.style.display = 'block';
            }
        });
        calculateTotals();
    }

    searchInput.addEventListener('input', filterCoins);

    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        filterCoins();
        searchInput.focus();
    });

    // --- Save, Load, and Clear Functions ---
    function saveQuantities() {
        const quantities = {};
        document.querySelectorAll('.coin-quantity').forEach(input => {
            const key = input.dataset.key;
            const quantity = input.value;
            if (quantity && parseInt(quantity) > 0) {
                quantities[key] = quantity;
            }
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(quantities));
    }

    function loadQuantities() {
        const savedQuantities = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        document.querySelectorAll('.coin-quantity').forEach(input => {
            const key = input.dataset.key;
            if (savedQuantities[key]) {
                input.value = savedQuantities[key];
            }
        });
    }

    clearAllBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all coin quantities?')) {
            document.querySelectorAll('.coin-quantity').forEach(input => {
                input.value = '0';
            });
            localStorage.removeItem(STORAGE_KEY);
            calculateTotals();
        }
    });

    // --- Price Synchronization & Validation ---
    function updateGramFromToz() {
        let tozPrice = parseFloat(silverPriceTozEl.value) || 0;
        if (tozPrice < 0) {
            tozPrice = 0;
            silverPriceTozEl.value = '0';
        }
        silverPriceGramEl.value = (tozPrice / TROY_OUNCE_IN_GRAMS).toFixed(4);
    }
    silverPriceTozEl.addEventListener('input', () => {
        updateGramFromToz();
        calculateTotals();
    });
    silverPriceGramEl.addEventListener('input', () => {
        let gramPrice = parseFloat(silverPriceGramEl.value) || 0;
        if (gramPrice < 0) {
            gramPrice = 0;
            silverPriceGramEl.value = '0';
        }
        silverPriceTozEl.value = (gramPrice * TROY_OUNCE_IN_GRAMS).toFixed(2);
        calculateTotals();
    });

    // --- Core Functions ---
    function groupCoinsByCountry(flatCoinList) {
        const groups = {};
        flatCoinList.forEach(coin => {
            const country = coin.country;
            if (!country) return;
            if (!groups[country]) groups[country] = [];
            groups[country].push(coin);
        });
        return groups;
    }

    function renderCoins() {
        coinListEl.innerHTML = '';
        const countries = Object.keys(groupedCoins).sort();
        countries.forEach(country => {
            const detailsEl = document.createElement('details');
            detailsEl.className = 'country-group';
            const summaryEl = document.createElement('summary');
            summaryEl.className = 'country-title';
            summaryEl.textContent = country;
            detailsEl.appendChild(summaryEl);
            groupedCoins[country].forEach(coin => {
                const coinKey = `${coin.country}-${coin.name}-${coin.date}`.replace(/\s/g, '_');
                const coinItem = document.createElement('div');
                coinItem.className = 'coin-item';
                coinItem.innerHTML = `
                    <span>${coin.name} ${coin.date} - (${coin.silverWeight} tOz)</span>
                    <input type="number" class="coin-quantity" 
                           data-key="${coinKey}" 
                           data-silver-weight="${coin.silverWeight}"
                           min="0" value="0">
                    <span class="coin-subtotal">€0.00</span>
                `;
                detailsEl.appendChild(coinItem);
            });
            coinListEl.appendChild(detailsEl);
        });
        document.querySelectorAll('.coin-quantity').forEach(input => {
            input.addEventListener('input', calculateTotals);
        });
    }

    function calculateTotals() {
        const totalSilverWeightEl = document.querySelector('.total-silver-weight');
        const totalMeltValueEl = document.querySelector('.total-melt-value');
        let grandTotalWeight = 0;
        const currentSilverPriceToz = parseFloat(silverPriceTozEl.value) || 0;

        document.querySelectorAll('.coin-quantity').forEach(input => {
            const coinItem = input.closest('.coin-item');
            if (coinItem && coinItem.style.display === 'none') {
                const subtotalEl = input.nextElementSibling;
                if (subtotalEl) {
                    subtotalEl.textContent = `€0.00`;
                }
                return;
            }

            let quantity = parseInt(input.value) || 0;
            if (quantity < 0) {
                quantity = 0;
                input.value = '0';
            }

            const silverWeight = parseFloat(input.dataset.silverWeight);
            const coinTotalWeight = silverWeight * quantity;
            const coinMeltValue = coinTotalWeight * currentSilverPriceToz;
            grandTotalWeight += coinTotalWeight;

            const subtotalEl = input.nextElementSibling;
            if (subtotalEl) {
                subtotalEl.textContent = `€${coinMeltValue.toFixed(2)}`;
            }
        });

        const grandMeltValue = grandTotalWeight * currentSilverPriceToz;
        if (totalSilverWeightEl) totalSilverWeightEl.textContent = grandTotalWeight.toFixed(3);
        if (totalMeltValueEl) totalMeltValueEl.textContent = grandMeltValue.toFixed(2);
        
        saveQuantities();
    }

    function parseCSV(text) {
        const lines = text.trim().split('\n');
        if (lines.length < 2) return { data: [], errors: [] };
        const headers = lines[0].split(',').map(h => h.trim());
        const data = [];
        const errors = [];
        for (let i = 1; i < lines.length; i++) {
            const lineNumber = i + 1;
            if (lines[i].trim() === '') continue;
            const values = [];
            let currentField = '', inQuotes = false;
            for (const char of lines[i]) {
                if (char === '"' && inQuotes && lines[i][lines[i].indexOf(char) + 1] === '"') {
                    currentField += '"'; continue;
                }
                if (char === '"') { inQuotes = !inQuotes; continue; }
                if (char === ',' && !inQuotes) {
                    values.push(currentField.trim()); currentField = '';
                } else {
                    currentField += char;
                }
            }
            values.push(currentField.trim());
            if (values.length === headers.length) {
                const coinObject = {};
                headers.forEach((header, index) => {
                    let value = values[index];
                    if (value.startsWith('"') && value.endsWith('"')) { value = value.slice(1, -1); }
                    coinObject[header] = value;
                });
                const weightString = coinObject.silverWeight || '';
                const weight = parseFloat(weightString);
                const decimalPart = weightString.split('.')[1] || '';
                if (isNaN(weight) || weight < 0) {
                    errors.push(`Line ${lineNumber}: Invalid silver weight for coin "${coinObject.name}". Value: "${weightString}". Skipping.`);
                    continue;
                }
                if (decimalPart.length < 6) {
                    errors.push(`Line ${lineNumber}: Invalid precision for coin "${coinObject.name}". Weight must have at least 6 decimal places (e.g., 0.123456). Skipping.`);
                    continue;
                }
                data.push(coinObject);
            } else {
                errors.push(`Line ${lineNumber}: Incorrect number of columns. Skipping.`);
            }
        }
        return { data, errors };
    }

    async function loadApp() {
        try {
            const response = await fetch('coins.csv');
            if (!response.ok) throw new Error(`Could not find coins.csv: ${response.statusText}`);
            const csvText = await response.text();
            const result = parseCSV(csvText);
            if (result.errors.length > 0) {
                errorContainer.style.display = 'block';
                let errorHTML = '<h3>Warning: Issues found in coins.csv</h3><ul>';
                result.errors.forEach(err => { errorHTML += `<li>${err}</li>`; });
                errorHTML += '</ul>';
                errorContainer.innerHTML = errorHTML;
            } else {
                errorContainer.style.display = 'none';
            }
            groupedCoins = groupCoinsByCountry(result.data);
            renderCoins();
            loadQuantities();
            calculateTotals();
            filterCoins(); // Ensure initial state reflects if search input has default text
        } catch (error) {
            console.error('Error loading application:', error);
            errorContainer.style.display = 'block';
            errorContainer.innerHTML = `<h3>Application Error</h3><p>${error.message}</p>`;
        }
    }

    // --- Initial Load ---
    loadTheme();
    updateGramFromToz();
    loadApp();
});