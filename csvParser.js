// csvParser.js
import { displayAppError } from './errorHandler.js'; // Still needed for fetchAndParseCSV's catch block

export function parseCSV(text) {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return { data: [], errors: ["CSV file is empty or only contains headers."] };

    const data = [];
    const errors = [];

    // Helper function to parse a single CSV line reliably
    function parseLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1]; // Look ahead for escaped quotes
            
            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    // This is an escaped quote (e.g., "a""b")
                    current += '"';
                    i++; // Skip the next quote as it's part of the escape sequence
                } else {
                    // Toggle quote mode
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                // End of a field if not inside quotes
                result.push(current.trim());
                current = '';
            } else {
                // Accumulate character for the current field
                current += char;
            }
        }
        result.push(current.trim()); // Add the last field after the loop finishes
        return result;
    }

    const headers = parseLine(lines[0]); // Parse the header line
    
    // --- Header Validation ---
    const requiredHeaders = ['country', 'name', 'date', 'grossWeight', 'purity'];
    const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
    if (missingHeaders.length > 0) {
        errors.push(`Missing required headers in CSV: ${missingHeaders.join(', ')}. Please check your CSV file.`);
        return { data: [], errors };
    }

    // --- Data Line Parsing and Validation ---
    for (let i = 1; i < lines.length; i++) {
        const lineNumber = i + 1;
        const line = lines[i].trim();
        if (line === '') continue; // Skip empty lines

        const values = parseLine(line); // Parse the data line
        
        if (values.length !== headers.length) {
            errors.push(`Line ${lineNumber}: Column count mismatch (${values.length} found, ${headers.length} expected). Skipping this line.`);
            continue; // Skip this line if column count doesn't match headers
        }

        const coinObject = {};
        headers.forEach((header, index) => {
            coinObject[header] = values[index];
        });

        // --- Data Type and Value Validation ---
        
        // grossWeight Validation
        const grossWeight = parseFloat(coinObject.grossWeight);
        if (isNaN(grossWeight) || grossWeight <= 0) {
            errors.push(`Line ${lineNumber}: Invalid gross weight "${coinObject.grossWeight}" for "${coinObject.name}". Must be a positive number. Skipping.`);
            continue;
        }
        coinObject.grossWeight = grossWeight; // Store as number

        // purity Validation
        const purity = parseFloat(coinObject.purity);
        if (isNaN(purity) || purity <= 0 || purity > 1000) { // Purity should be between 1 and 1000 (per mille)
            errors.push(`Line ${lineNumber}: Invalid purity "${coinObject.purity}" for "${coinObject.name}". Must be between 1 and 1000. Skipping.`);
            continue;
        }
        coinObject.purity = purity; // Store as number
        
        data.push(coinObject); // Add valid coin to data
    }
    
    return { data, errors }; // Return both parsed data and any collected errors
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