import { errorContainer } from '../ui/domElements.js';

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
        // Defensive check - if DOM isn't initialized, we can't display in the UI
    if (!errorContainer) {
        console.error('Error container not available - DOM may not be initialized');
        return;
    }
    errorContainer.style.display = 'block';
    errorContainer.innerHTML = `<h3>Application Error</h3><p>${message}</p>`;
}