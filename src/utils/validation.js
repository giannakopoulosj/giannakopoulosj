// validation.js

/**
 * Validates if a value is a positive number (float).
 * If not, or if it's less than 0, it returns a defaultValue.
 * @param {string|number} value - The value to validate.
 * @param {number} defaultValue - The default value to return if validation fails.
 * @returns {number} The validated positive float or the defaultValue.
 */
export function validatePositiveNumber(value, defaultValue = 0) {
    const parsed = parseFloat(value);
    return isNaN(parsed) || parsed < 0 ? defaultValue : parsed;
}

/**
 * Validates if a value is a positive integer.
 * If not, or if it's less than 0, it returns a defaultValue.
 * @param {string|number} value - The value to validate.
 * @param {number} defaultValue - The default value to return if validation fails.
 * @returns {number} The validated positive integer or the defaultValue.
 */
export function validatePositiveInteger(value, defaultValue = 0) {
    // parseInt(value, 10) ensures base-10 parsing
    const parsed = parseInt(value, 10);
    return isNaN(parsed) || parsed < 0 ? defaultValue : parsed;
}