import { silverPriceTozEl, silverPriceGramEl } from './domElements.js';
import { TROY_OUNCE_IN_GRAMS } from './constants.js';

export function updateGramFromToz() {
    let tozPrice = parseFloat(silverPriceTozEl.value) || 0;
    if (tozPrice < 0) {
        tozPrice = 0;
        silverPriceTozEl.value = '0';
    }
    silverPriceGramEl.value = (tozPrice / TROY_OUNCE_IN_GRAMS).toFixed(4);
}

export function setupPriceListeners(calculateTotalsCallback) {
    silverPriceTozEl.addEventListener('input', () => {
        updateGramFromToz();
        calculateTotalsCallback();
    });

    silverPriceGramEl.addEventListener('input', () => {
        let gramPrice = parseFloat(silverPriceGramEl.value) || 0;
        if (gramPrice < 0) {
            gramPrice = 0;
            silverPriceGramEl.value = '0';
        }
        silverPriceTozEl.value = (gramPrice * TROY_OUNCE_IN_GRAMS).toFixed(2);
        calculateTotalsCallback();
    });
}