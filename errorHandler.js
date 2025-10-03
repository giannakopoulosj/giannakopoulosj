import { errorContainer } from './domElements.js';

export function displayErrors(errors) {
    if (errors.length > 0) {
        errorContainer.style.display = 'block';
        let errorHTML = '<h3>Warning: Issues found in coins.csv</h3><ul>';
        errors.forEach(err => { errorHTML += `<li>${err}</li>`; });
        errorHTML += '</ul>';
        errorContainer.innerHTML = errorHTML;
    } else {
        errorContainer.style.display = 'none';
    }
}

export function displayAppError(message) {
    console.error('Application Error:', message);
    errorContainer.style.display = 'block';
    errorContainer.innerHTML = `<h3>Application Error</h3><p>${message}</p>`;
}