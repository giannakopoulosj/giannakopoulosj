// main.js
import { CSV_FILE_PATH } from './constants.js';
import { fetchAndParseCSV } from './csvParser.js';
import { groupCoinsByCountry } from './dataManager.js';
import { renderCoins, setupCoinQuantityListeners } from './uiRenderer.js';
import { loadQuantities, setupClearAllButton } from './quantityManager.js';
import { setupPriceListeners, updateGramFromToz } from './priceManager.js';
import { calculateTotals } from './calculator.js';
import { setupSearchListeners, filterCoins } from './searchFilter.js';
import { displayErrors, displayAppError } from './errorHandler.js';
import { loadTheme, setupThemeToggle } from './theme.js';
import { initializeDOMElements } from './domElements.js'; // NEW: Import the initializer function

export async function initApp() {
    try {
        // CRITICAL FIX: Initialize DOM elements FIRST, within the DOMContentLoaded scope
        initializeDOMElements(); 

        // 1. Setup Theme
        loadTheme();
        setupThemeToggle(); // This now uses the initialized themeToggle from domElements

        // 2. Setup Price Listeners (and initial sync)
        setupPriceListeners(calculateTotals);
        updateGramFromToz(); // This now uses the initialized price elements

        // 3. Setup Clear All Quantities Button
        setupClearAllButton(calculateTotals);

        // 4. Setup Search Listeners
        setupSearchListeners(filterCoins);

        // 5. Load and Render Coin Data
        const { data, errors } = await fetchAndParseCSV(CSV_FILE_PATH);
        displayErrors(errors); // This uses the initialized errorContainer

        groupCoinsByCountry(data);
        renderCoins();
        setupCoinQuantityListeners(calculateTotals);
        loadQuantities();
        
        calculateTotals();
        filterCoins();
    } catch (error) {
        displayAppError(`Failed to initialize application: ${error.message}`);
    }
}