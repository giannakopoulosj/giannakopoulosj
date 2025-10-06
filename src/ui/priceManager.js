import { silverPriceTozEl, silverPriceGramEl } from './domElements.js';
import { TROY_OUNCE_IN_GRAMS } from '../core/constants.js';
import { validatePositiveNumber } from '../utils/validation.js'; // Import utility

export function updateGramFromToz() {
    const rawValue = silverPriceTozEl.value;
    const tozPrice = validatePositiveNumber(rawValue);
    
    // Only update the input if validation changed the value (or if it was initially empty)
    if (rawValue === '' || parseFloat(rawValue) !== tozPrice) {
        silverPriceTozEl.value = tozPrice;
    }
    
    silverPriceGramEl.value = (tozPrice / TROY_OUNCE_IN_GRAMS).toFixed(4);
}

export function setupPriceListeners(calculateTotalsCallback) {
    silverPriceTozEl.addEventListener('input', () => {
        updateGramFromToz();
        calculateTotalsCallback();
    });

    silverPriceGramEl.addEventListener('input', () => {
        const rawValue = silverPriceGramEl.value;
        const gramPrice = validatePositiveNumber(rawValue);
        
        // Only update the input if validation changed the value (or if it was initially empty)
        if (rawValue === '' || parseFloat(rawValue) !== gramPrice) {
            silverPriceGramEl.value = gramPrice;
        }
        
        silverPriceTozEl.value = (gramPrice * TROY_OUNCE_IN_GRAMS).toFixed(2);
        calculateTotalsCallback();
    });
}