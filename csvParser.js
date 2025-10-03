import { displayAppError } from './errorHandler.js';

export function parseCSV(text) {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return { data: [], errors: ["CSV file is empty or only contains headers."] };

    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];
    const errors = [];

    for (let i = 1; i < lines.length; i++) {
        const lineNumber = i + 1;
        if (lines[i].trim() === '') continue;

        const values = [];
        let currentField = '', inQuotes = false;
        for (const char of lines[i]) {
            if (char === '"' && inQuotes && lines[i][lines[i].indexOf(char) + 1] === '"') {
                currentField += '"'; continue;
            }
            if (char === '"') { inQuotes = !inQuotes; continue; }
            if (char === ',' && !inQuotes) {
                values.push(currentField.trim()); currentField = '';
            } else {
                currentField += char;
            }
        }
        values.push(currentField.trim());

        if (values.length === headers.length) {
            const coinObject = {};
            headers.forEach((header, index) => {
                let value = values[index];
                if (value.startsWith('"') && value.endsWith('"')) { value = value.slice(1, -1); }
                coinObject[header] = value;
            });

            const weightString = coinObject.silverWeight || '';
            const weight = parseFloat(weightString);
            const decimalPart = weightString.split('.')[1] || '';

            if (isNaN(weight) || weight < 0) {
                errors.push(`Line ${lineNumber}: Invalid silver weight for coin "${coinObject.name}". Value: "${weightString}". Skipping.`);
                continue;
            }
            
            if (decimalPart.length < 6) {
                errors.push(`Line ${lineNumber}: Invalid precision for coin "${coinObject.name}". Weight must have at least 6 decimal places (e.g., 0.123456). Skipping.`);
                continue;
            }
            
            data.push(coinObject);
        } else {
            errors.push(`Line ${lineNumber}: Incorrect number of columns. Skipping.`);
        }
    }
    return { data, errors };
}

export async function fetchAndParseCSV(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Could not find CSV file: ${response.statusText}`);
        const csvText = await response.text();
        return parseCSV(csvText);
    } catch (error) {
        displayAppError(`Failed to load CSV: ${error.message}`);
        return { data: [], errors: [`Failed to load CSV: ${error.message}`] };
    }
}