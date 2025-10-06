// uiRenderer.js
import { coinListEl } from './domElements.js';
import { getGroupedCoins } from '../core/dataManager.js';

export function renderCoins() {
    coinListEl.innerHTML = ''; // Clear existing content
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

            const silverGrams = parseFloat(coin.silverWeight_grams);
            const silverTOz = parseFloat(coin.silverWeight_tOz);
            const purityValue = parseFloat(coin.purity);

            let coinInfoText = `${coin.name} ${coin.date} - `;
            coinInfoText += `(${isNaN(purityValue) ? 'N/A' : purityValue.toFixed(0)}‰ / `;
            coinInfoText += `${isNaN(silverGrams) ? 'N/A' : silverGrams.toFixed(4)} g / `;
            coinInfoText += `${isNaN(silverTOz) ? 'N/A' : silverTOz.toFixed(4)} tOz)`;

            let coinNameHtml;
            if (coin.numistaUrl && coin.numistaUrl.trim() !== '') {
                coinNameHtml = `
                    <a href="${coin.numistaUrl}" target="_blank" rel="noopener noreferrer" class="coin-name-link">
                        ${coinInfoText}
                    </a>
                `;
            } else {
                coinNameHtml = `<span>${coinInfoText}</span>`;
            }

            const dataSilverWeightValue = isNaN(silverTOz) ? '0' : silverTOz.toString();

            coinItem.innerHTML = `
                ${coinNameHtml}
                <input type="number" class="coin-quantity" 
                       data-key="${coinKey}" 
                       data-silver-weight="${dataSilverWeightValue}"
                       min="0" 
                       value="0" />
                <span class="coin-subtotal">€0.00</span>
            `;

            detailsEl.appendChild(coinItem);
        });
        coinListEl.appendChild(detailsEl);
    });
}

// Reverted: Individual listeners are added here (not delegated to parent)
export function setupCoinQuantityListeners(calculateTotalsCallback) {
    if (coinListEl) {
        coinListEl.querySelectorAll('.coin-quantity').forEach(input => {
            input.addEventListener('input', calculateTotalsCallback);
        });
    } else {
        console.error("coinListEl is null, cannot set up quantity listeners.");
    }
}