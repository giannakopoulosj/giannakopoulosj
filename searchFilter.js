// searchFilter.js
import { searchInput, clearSearchBtn, coinListEl, totalsSection, filteredIndicator } from './domElements.js';
import { calculateTotals } from './calculator.js';

export function filterCoins() {
    const query = searchInput.value.toLowerCase().trim();
    const searchWords = query.split(' ').filter(word => word.length > 0);

    // Defensive checks for clearSearchBtn, totalsSection, filteredIndicator
    // These should already be initialized by initializeDOMElements, but good practice for safety
    if (clearSearchBtn) {
        if (query.length > 0) {
            clearSearchBtn.style.display = 'block';
        } else {
            clearSearchBtn.style.display = 'none';
        }
    }
    
    if (totalsSection) {
        if (query.length > 0) {
            totalsSection.classList.add('filtered-active');
        } else {
            totalsSection.classList.remove('filtered-active');
        }
    }
    
    if (filteredIndicator) {
        if (query.length > 0) {
            filteredIndicator.style.display = 'inline';
        } else {
            filteredIndicator.style.display = 'none';
        }
    }


    // Ensure coinListEl is present before querying its children
    if (!coinListEl) {
        console.error("coinListEl is null in filterCoins. Cannot proceed with filtering.");
        return;
    }

    coinListEl.querySelectorAll('.country-group').forEach(group => {
        // --- CRITICAL FIX: Add defensive check for countryTitleEl ---
        const countryTitleEl = group.querySelector('.country-title');
        const countryName = countryTitleEl ? countryTitleEl.textContent.toLowerCase() : '';
        
        let hasVisibleCoins = false;

        group.querySelectorAll('.coin-item').forEach(item => {
            // --- CRITICAL FIX: Add defensive check for coinTextEl ---
            const coinTextEl = item.querySelector('span:first-child');
            const coinText = coinTextEl ? coinTextEl.textContent.toLowerCase() : '';
            
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

export function setupSearchListeners() {
    // Defensive check before adding listener
    if (searchInput) {
        searchInput.addEventListener('input', filterCoins);
    } else {
        console.error("Search input element not found. Search functionality will not work.");
    }

    // Defensive check before adding listener
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            filterCoins();
            searchInput.focus();
        });
    } else {
        console.error("Clear search button element not found.");
    }
}