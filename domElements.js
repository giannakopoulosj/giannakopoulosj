// domElements.js

// Declare variables here, but initialize to null
// The actual DOM retrieval will happen in main.js after DOMContentLoaded
export let errorContainer = null;
export let coinListEl = null;
export let silverPriceTozEl = null;
export let silverPriceGramEl = null;
export let clearAllBtn = null;
export let searchInput = null;
export let clearSearchBtn = null;
export let themeToggle = null;
export let totalsSection = null;
export let filteredIndicator = null;
export let totalSilverWeightEl = null;
export let totalMeltValueEl = null;

// This function will be called from main.js ONLY after the DOM is fully loaded.
export function initializeDOMElements() {
    errorContainer = document.getElementById('error-container');
    coinListEl = document.getElementById('coin-list');
    silverPriceTozEl = document.getElementById('silver-price-toz');
    silverPriceGramEl = document.getElementById('silver-price-gram');
    clearAllBtn = document.getElementById('clear-all-btn');
    searchInput = document.getElementById('search-input');
    clearSearchBtn = document.getElementById('clear-search-btn');
    themeToggle = document.getElementById('theme-toggle');
    totalsSection = document.getElementById('totals-section');
    filteredIndicator = document.getElementById('filtered-indicator');
    totalSilverWeightEl = document.querySelector('.total-silver-weight');
    totalMeltValueEl = document.querySelector('.total-melt-value');

    // Add checks to ensure critical elements are found, providing clearer error feedback
    if (!errorContainer || !coinListEl || !silverPriceTozEl || !totalMeltValueEl || !themeToggle) {
        console.error("CRITICAL ERROR: One or more essential DOM elements were not found.");
        console.error("Please verify your index.html file for correct IDs and classes.");
        // Display a user-friendly message directly on the page if critical elements are missing
        document.body.innerHTML = "<h1 style='color: red; text-align: center; margin-top: 50px;'>Application Error: Page elements missing.</h1><p style='text-align: center;'>Please check your HTML file (`index.html`) for errors and refer to the browser console (F12) for more details.</p>";
        // Throw an error to stop further script execution and prevent cascading 'null' errors
        throw new Error("Critical DOM elements missing from HTML.");
    }
}