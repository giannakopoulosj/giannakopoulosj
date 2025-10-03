document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const errorContainer = document.getElementById('error-container');
    const coinListEl = document.getElementById('coin-list');
    const silverPriceTozEl = document.getElementById('silver-price-toz');
    const silverPriceGramEl = document.getElementById('silver-price-gram');
    const clearAllBtn = document.getElementById('clear-all-btn');
    const searchInput = document.getElementById('search-input');
    const themeToggle = document.getElementById('theme-toggle');

    // Data
    let groupedCoins = {};
    const TROY_OUNCE_IN_GRAMS = 31.1034768;
    const STORAGE_KEY = 'coinQuantities';

    // --- Theme Management (RESTORED) ---
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
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (savedTheme) {
            applyTheme(savedTheme);
        } else if (systemPrefersDark) {
            applyTheme('dark');
        } else {
            applyTheme('light');
        }
    }

    // --- Search Functionality (UPGRADED) ---
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        const searchWords = query.split(' ').filter(word => word.length > 0); // Split query into individual words

        document.querySelectorAll('.country-group').forEach(group => {
            const countryName = group.querySelector('.country-title').textContent.toLowerCase();
            let hasVisibleCoins = false;

            group.querySelectorAll('.coin-item').forEach(item => {
                const coinText = item.querySelector('span:first-child').textContent.toLowerCase();
                // Combine country and coin info for a complete search target
                const searchableText = `${countryName} ${coinText}`;

                // Check if the combined text includes EVERY word from the search query
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

            // If the search bar is cleared, collapse all groups
            if (query === '') {
                group.open = false;
            }
        });
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

    // --- Price Synchronization & VALIDATION ---
    function updateGramFromToz() {
        let tozPrice = parseFloat(silverPriceTozEl.value) || 0;
        // NEW: Validate for negative values
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
        // NEW: Validate for negative values
        if (gramPrice < 0) {
            gramPrice = 0;
            silverPriceGramEl.value = '0';
        }
        silverPriceTozEl.value = (gramPrice * TROY_OUNCE_IN_GRAMS).toFixed(2);
        calculateTotals();
    });

    // --- Core Functions (Implement the full functions from your working file) ---
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
            let quantity = parseInt(input.value) || 0;
            
            // NEW: Validate for negative quantities
            if (quantity < 0) {
                quantity = 0;
                input.value = '0';
            }

            if (input.offsetParent === null) return;
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

            // Using the robust parser from before
            const values = [];
            // (Your robust parsing logic to populate 'values' goes here)
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

                // --- NEW VALIDATION LOGIC ---
                const weightString = coinObject.silverWeight || '';
                const weight = parseFloat(weightString);
                const decimalPart = weightString.split('.')[1] || '';

                if (isNaN(weight) || weight < 0) {
                    errors.push(`Line ${lineNumber}: Invalid silver weight for coin "${coinObject.name}". Value: "${weightString}". Skipping.`);
                    continue; // Skip due to invalid number
                }
                
                if (decimalPart.length < 6) {
                    errors.push(`Line ${lineNumber}: Invalid precision for coin "${coinObject.name}". Weight must have at least 6 decimal places (e.g., 0.123456). Skipping.`);
                    continue; // Skip due to insufficient precision
                }
                
                data.push(coinObject);
            } else {
                errors.push(`Line ${lineNumber}: Incorrect number of columns. Skipping.`);
            }
        }
        return { data, errors };
    }

    // UPDATED: No changes here, but it will now display the new precision errors
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

    // NOTE: Make sure to copy the full, working functions for sections marked as unchanged
});