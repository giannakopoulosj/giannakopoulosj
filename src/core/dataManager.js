// dataManager.js
import { TROY_OUNCE_IN_GRAMS } from './constants.js';

let groupedCoins = {};

export function groupCoinsByCountry(flatCoinList) {
    const groups = {};
    flatCoinList.forEach(coin => {
        // --- NEW: Calculate actual silver weight ---
        const grossWeight = coin.grossWeight; // Already parsed as number by csvParser
        const purity = coin.purity;           // Already parsed as number by csvParser

        let effectivePurity;
        if (purity >= 1 && purity <= 1000) { // Assume per mille (e.g., 900 for 90%)
            effectivePurity = purity / 1000;
        } else if (purity > 0 && purity < 1) { // Assume decimal (e.g., 0.9 for 90%)
            effectivePurity = purity;
        } else {
            // This case should ideally be caught by csvParser validation,
            // but as a fallback, we can set to 0 to prevent NaN in calculations.
            effectivePurity = 0; 
        }

        const silverWeight_grams = grossWeight * effectivePurity;
        const silverWeight_tOz = silverWeight_grams / TROY_OUNCE_IN_GRAMS;

        coin.silverWeight_grams = silverWeight_grams;
        coin.silverWeight_tOz = silverWeight_tOz;

        const country = coin.country;
        if (!country) return;
        if (!groups[country]) {
            groups[country] = [];
        }
        groups[country].push(coin);
    });
    groupedCoins = groups; // Store the grouped coins internally
    return groups;
}

export function getGroupedCoins() {
    return groupedCoins;
}   