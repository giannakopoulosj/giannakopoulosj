import { searchInput, clearSearchBtn, coinListEl, totalsSection, filteredIndicator } from './domElements.js';
import { calculateTotals } from './calculator.js';

export function filterCoins() {
    const query = searchInput.value.toLowerCase().trim();
    const searchWords = query.split(' ').filter(word => word.length > 0);

    if (query.length > 0) {
        clearSearchBtn.style.display = 'block';
        totalsSection.classList.add('filtered-active');
        filteredIndicator.style.display = 'inline';
    } else {
        clearSearchBtn.style.display = 'none';
        totalsSection.classList.remove('filtered-active');
        filteredIndicator.style.display = 'none';
    }

    coinListEl.querySelectorAll('.country-group').forEach(group => {
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

export function setupSearchListeners() {
    searchInput.addEventListener('input', filterCoins);

    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        filterCoins();
        searchInput.focus();
    });
}