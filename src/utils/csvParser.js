// csvParser.js
import { displayAppError } from './errorHandler.js';

const MAX_FIELD_LENGTH = 2000;
const MAX_LINE_LENGTH = 10000;
const MAX_ERRORS = 100; // Limit total errors displayed

export function parseCSV(text) {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return { data: [], errors: ["CSV file is empty or only contains headers."] };

    const data = [];
    const errors = [];

    function parseLine(line, lineNumber) {
        const result = [];
        let current = '';
        let inQuotes = false;
        let fieldTruncated = false; // Flag to prevent duplicate field length errors for a single field
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];
            
            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    current += '"';
                    i++; // Skip next quote
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
                fieldTruncated = false; // Reset for next field
            } else {
                // Character is accumulated only if within the max length
                if (current.length < MAX_FIELD_LENGTH) {
                    current += char;
                } else { 
                    // Field has exceeded max length - truncate it
                    if (!fieldTruncated) { // Push error only once for this field
                        errors.push(`Line ${lineNumber}: Field exceeded max length (${MAX_FIELD_LENGTH} chars). Field truncated.`);
                        fieldTruncated = true;
                    }
                    // Character is intentionally not added to 'current' here, effectively truncating the field.
                }
            }
        }
        result.push(current.trim());
        return result;
    }

    const headers = parseLine(lines[0], 1); // Line 1 for headers
    
    const requiredHeaders = ['country', 'name', 'date', 'grossWeight', 'purity'];
    const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
    if (missingHeaders.length > 0) {
        errors.push(`Missing required headers in CSV: ${missingHeaders.join(', ')}. Please check your CSV file.`);
        return { data: [], errors }; // Early return for critical missing headers
    }

    for (let i = 1; i < lines.length; i++) {
        // NEW: Total error limit check
        if (errors.length >= MAX_ERRORS) {
            errors.push(`Too many errors (${MAX_ERRORS}+). Remaining lines skipped.`); // Conciser message
            break; // Exit the loop if too many errors are found
        }

        const lineNumber = i + 1;
        const line = lines[i].trim();
        if (line === '') continue;

        if (line.length > MAX_LINE_LENGTH) {
            errors.push(`Line ${lineNumber}: Line too long (${line.length} chars, max ${MAX_LINE_LENGTH}). Possible formatting error. Skipping.`);
            continue;
        }

        const values = parseLine(line, lineNumber);
        
        if (values.length !== headers.length) {
            errors.push(`Line ${lineNumber}: Column count mismatch (${values.length} found, ${headers.length} expected). Skipping this line.`);
            continue;
        }

        const coinObject = {};
        headers.forEach((header, index) => {
            coinObject[header] = values[index];
        });

        // --- Data Type and Value Validation ---
        
        const grossWeight = parseFloat(coinObject.grossWeight);
        if (isNaN(grossWeight) || grossWeight <= 0) {
            errors.push(`Line ${lineNumber}: Invalid gross weight "${coinObject.grossWeight}" for "${coinObject.name}". Must be a positive number. Skipping.`);
            continue;
        }
        coinObject.grossWeight = grossWeight;

        const purity = parseFloat(coinObject.purity);
        if (isNaN(purity) || purity <= 0 || purity > 1000) {
            errors.push(`Line ${lineNumber}: Invalid purity "${coinObject.purity}" for "${coinObject.name}". Must be between 1 and 1000. Skipping.`);
            continue;
        }
        coinObject.purity = purity;

        if (coinObject.numistaUrl && coinObject.numistaUrl.trim() !== '') {
            try {
                const url = new URL(coinObject.numistaUrl);
                if (url.protocol !== 'http:' && url.protocol !== 'https:') {
                    errors.push(`Line ${lineNumber}: Invalid URL protocol for "${coinObject.name}". Only http/https allowed. URL will be ignored.`);
                    coinObject.numistaUrl = '';
                }
            } catch (e) {
                errors.push(`Line ${lineNumber}: Malformed URL for "${coinObject.name}". URL will be ignored.`);
                coinObject.numistaUrl = '';
            }
        }
        
        data.push(coinObject);
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