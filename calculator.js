import { silverPriceTozEl, totalSilverWeightEl, totalMeltValueEl, coinListEl } from './domElements.js';
import { saveQuantities } from './quantityManager.js';

export function calculateTotals() {
    let grandTotalWeight = 0;
    const currentSilverPriceToz = parseFloat(silverPriceTozEl.value) || 0;

    coinListEl.querySelectorAll('.coin-quantity').forEach(input => {
        const coinItem = input.closest('.coin-item');
        
        if (coinItem && coinItem.style.display === 'none') {
            const subtotalEl = input.nextElementSibling;
            if (subtotalEl) {
                subtotalEl.textContent = `€0.00`;
            }
            return; // Skip hidden inputs for grand totals
        }

        let quantity = parseInt(input.value) || 0;
        if (quantity < 0) {
            quantity = 0;
            input.value = '0';
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