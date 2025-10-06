// calculator.js
import { silverPriceTozEl, totalSilverWeightEl, totalMeltValueEl, coinListEl } from '../ui/domElements.js';
import { saveQuantities } from '../ui/quantityManager.js';
// NEW: Import both validation utilities
import { validatePositiveNumber, validatePositiveInteger } from '../utils/validation.js'; 

export function calculateTotals() {
    let grandTotalWeight = 0;
    // UPDATED: Use validatePositiveNumber for currentSilverPriceToz
    const currentSilverPriceToz = validatePositiveNumber(silverPriceTozEl.value); 

    coinListEl.querySelectorAll('.coin-quantity').forEach(input => {
        const coinItem = input.closest('.coin-item');
        
        if (coinItem && coinItem.style.display === 'none') {
            const subtotalEl = input.nextElementSibling;
            if (subtotalEl) {
                subtotalEl.textContent = `€0.00`;
            }
            return;
        }

        const rawValue = input.value;
        // UPDATED: Use validatePositiveInteger for quantity
        let quantity = validatePositiveInteger(rawValue); 
        
        // Only update the input if the original value was invalid or changed by validation
        if (rawValue === '' || parseInt(rawValue, 10) !== quantity) {
            input.value = quantity.toString();
        }

        const silverWeight = parseFloat(input.dataset.silverWeight);
        const coinTotalWeight = silverWeight * quantity;
        const coinMeltValue = coinTotalWeight * currentSilverPriceToz;
        grandTotalWeight += coinTotalWeight;

        const subtotalEl = input.nextElementSibling;
        if (subtotalEl) {
            subtotalEl.textContent = `€${coinMeltValue.toFixed(2)}`;
        }
    });

    const grandMeltValue = grandTotalWeight * currentSilverPriceToz;

    if (totalSilverWeightEl) totalSilverWeightEl.textContent = grandTotalWeight.toFixed(3);
    if (totalMeltValueEl) totalMeltValueEl.textContent = grandMeltValue.toFixed(2);
    
    saveQuantities();
}