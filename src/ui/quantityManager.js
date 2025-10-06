import { STORAGE_KEY } from '../core/constants.js';
import { coinListEl, clearAllBtn } from './domElements.js';

export function saveQuantities() {
    const quantities = {};
    coinListEl.querySelectorAll('.coin-quantity').forEach(input => {
        const key = input.dataset.key;
        const quantity = input.value;
        if (quantity && parseInt(quantity) > 0) {
            quantities[key] = quantity;
        }
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quantities));
}

export function loadQuantities() {
    const savedQuantities = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    coinListEl.querySelectorAll('.coin-quantity').forEach(input => {
        const key = input.dataset.key;
        if (savedQuantities[key]) {
            input.value = savedQuantities[key];
        }
    });
}

export function setupClearAllButton(calculateTotalsCallback) {
    clearAllBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all coin quantities?')) {
            coinListEl.querySelectorAll('.coin-quantity').forEach(input => {
                input.value = '0';
            });
            localStorage.removeItem(STORAGE_KEY);
            calculateTotalsCallback(); // Recalculate everything after clearing
        }
    });
}