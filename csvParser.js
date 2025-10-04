// csvParser.js
import { displayAppError } from './errorHandler.js';

export function parseCSV(text) {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return { data: [], errors: ["CSV file is empty or only contains headers."] };

    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];
    const errors = [];

    const requiredHeaders = ['country', 'name', 'date', 'grossWeight', 'purity'];
    const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
    if (missingHeaders.length > 0) {
        errors.push(`Missing required headers in CSV: ${missingHeaders.join(', ')}. Please check your CSV file.`);
        return { data: [], errors }; // Stop parsing if essential headers are missing
    }

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

            // --- Validate grossWeight and purity ---
            const grossWeightString = coinObject.grossWeight || '';
            const grossWeight = parseFloat(grossWeightString);
            if (isNaN(grossWeight) || grossWeight <= 0) { // Must be positive
                errors.push(`Line ${lineNumber}: Invalid gross weight for coin "${coinObject.name}". Value: "${grossWeightString}". Skipping.`);
                continue;
            }
            coinObject.grossWeight = grossWeight; // Store as number

            const purityString = coinObject.purity || '';
            const purity = parseFloat(purityString);
            if (isNaN(purity) || purity <= 0 || purity > 1000) { // Purity 0-1000
                errors.push(`Line ${lineNumber}: Invalid purity for coin "${coinObject.name}". Value: "${purityString}". Purity should be a positive number (e.g., 900 for 90%). Skipping.`);
                continue;
            }
            coinObject.purity = purity; // Store as number
            // --- End of validation ---
            
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