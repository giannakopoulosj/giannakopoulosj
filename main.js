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

export async function initApp() {
    // 1. Setup Theme
    loadTheme();
    setupThemeToggle();

    // 2. Setup Price Listeners (and initial sync)
    setupPriceListeners(calculateTotals); // Pass calculateTotals as callback
    updateGramFromToz(); // Initial sync after setup

    // 3. Setup Clear All Quantities Button
    setupClearAllButton(calculateTotals);

    // 4. Setup Search Listeners
    setupSearchListeners(filterCoins); // Pass filterCoins as callback

    // 5. Load and Render Coin Data
    try {
        const { data, errors } = await fetchAndParseCSV(CSV_FILE_PATH);
        displayErrors(errors); // Display any CSV parsing/validation errors

        groupCoinsByCountry(data);
        renderCoins(); // Render the coin list initially
        setupCoinQuantityListeners(calculateTotals); // Attach listeners AFTER rendering
        loadQuantities(); // Load saved quantities into the rendered inputs
        
        calculateTotals(); // Perform an initial calculation after all inputs are set
        filterCoins();     // Apply any initial search filter (e.g., if user navigated back)
    } catch (error) {
        displayAppError(`Failed to initialize application: ${error.message}`);
    }
}