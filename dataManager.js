let groupedCoins = {};

export function groupCoinsByCountry(flatCoinList) {
    const groups = {};
    flatCoinList.forEach(coin => {
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