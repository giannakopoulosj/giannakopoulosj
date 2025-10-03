import { coinListEl } from './domElements.js';
import { getGroupedCoins } from './dataManager.js';

export function renderCoins() {
    coinListEl.innerHTML = '';
    const groupedCoins = getGroupedCoins();
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
}

export function setupCoinQuantityListeners(calculateTotalsCallback) {
    coinListEl.querySelectorAll('.coin-quantity').forEach(input => {
        input.addEventListener('input', calculateTotalsCallback);
    });
}