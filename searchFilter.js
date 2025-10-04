// searchFilter.js
import { searchInput, clearSearchBtn, coinListEl, totalsSection, filteredIndicator } from './domElements.js';
import { calculateTotals } from './calculator.js';

/**
 * Filters the list of coins based on the current search input.
 * - Shows/hides individual coin items.
 * - Shows/hides country groups.
 * - Auto-expands country groups with matching coins.
 * - Toggles visual indicators for filtered totals.
 * - Triggers recalculation of totals.
 */
export function filterCoins() {
if (!searchInput) {
        console.error("searchInput is null in filterCoins. Search functionality is broken.");
        return; // Fail fast - don't pretend to filter when you can't
    }
    // Safely get the search query; returns empty string if searchInput is null
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const searchWords = query.split(' ').filter(word => word.length > 0);

    // Toggle visibility and state of the clear search button and filtered totals indicator
    if (clearSearchBtn) {
        clearSearchBtn.style.display = query.length > 0 ? 'block' : 'none';
    }
    
    if (totalsSection) {
        totalsSection.classList.toggle('filtered-active', query.length > 0);
    }
    
    if (filteredIndicator) {
        filteredIndicator.style.display = query.length > 0 ? 'inline' : 'none';
    }

    // Critical check: if coinListEl is null, we can't proceed with filtering the list
    if (!coinListEl) {
        console.error("coinListEl is null in filterCoins. Cannot proceed with filtering.");
        return;
    }

    // Iterate through each country group (details element)
    coinListEl.querySelectorAll('.country-group').forEach(group => {
        // Safely get country name; returns empty string if countryTitleEl is null
        const countryTitleEl = group.querySelector('.country-title');
        const countryName = countryTitleEl ? countryTitleEl.textContent.toLowerCase() : '';
        
        let hasVisibleCoins = false; // Flag to track if this group has any visible coins

        // Iterate through each coin item within the current group
        group.querySelectorAll('.coin-item').forEach(item => {
            // Safely get the coin's display text (either from <a> or <span>)
            const coinTextEl = item.querySelector('.coin-name-link, span'); 
            const coinText = coinTextEl ? coinTextEl.textContent.toLowerCase() : '';
            
            // Combine country name and coin text for a comprehensive search target
            const searchableText = `${countryName} ${coinText}`;

            // Check if the combined text includes EVERY word from the search query
            const isMatch = searchWords.every(word => searchableText.includes(word));

            if (isMatch) {
                item.style.display = 'flex'; // Show the coin item
                hasVisibleCoins = true;     // Mark that this group has visible coins
            } else {
                item.style.display = 'none'; // Hide the coin item
            }
        });

        // Toggle visibility and open state of the country group itself
        if (hasVisibleCoins) {
            group.style.display = 'block'; // Show the country group container
            group.open = true;             // Auto-expand the group
        } else {
            group.style.display = 'none';  // Hide the country group container
        }
        
        // When the search bar is cleared, collapse all groups but keep their containers visible
        if (query === '') {
            group.open = false;
            group.style.display = 'block'; // Ensure group container is visible even if collapsed
        }
    });

    // Recalculate totals after filtering to reflect only visible coins
    calculateTotals();
}

/**
 * Sets up event listeners for the search input and clear search button.
 * Includes defensive checks for DOM element existence.
 */
export function setupSearchListeners() {
    // Attach listener to search input if it exists
    if (searchInput) {
        searchInput.addEventListener('input', filterCoins);
    } else {
        console.error("Search input element not found. Search functionality will not work.");
    }

    // Attach listener to clear search button if it exists
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            // Check searchInput again before modifying its value
            if (searchInput) {
                searchInput.value = ''; // Clear the input field
                filterCoins();          // Re-run the filter to show all coins and hide the button
                searchInput.focus();    // Put focus back on the search input for convenience
            } else {
                console.error("Search input is null when clear button clicked, cannot clear or focus.");
            }
        });
    } else {
        console.error("Clear search button element not found.");
    }
}