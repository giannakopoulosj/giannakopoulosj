// theme.js
import { themeToggle } from './domElements.js';

const THEME_STORAGE_KEY = 'theme';
const THEME_DARK = 'dark';
const THEME_LIGHT = 'light';

/**
 * Applies the theme to the document and syncs the toggle state.
 * @param {string} theme - Either 'dark' or 'light'
 */
export function applyTheme(theme) {
    const isDark = theme === THEME_DARK;
    
    // Apply CSS class to the body
    document.body.classList.toggle('dark-mode', isDark);
    
    // Sync toggle state if element exists
    if (themeToggle) {
        themeToggle.checked = isDark;
    }
}

/**
 * Saves the theme preference to localStorage.
 * @param {string} theme - The theme to save
 */
export function saveTheme(theme) {
    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
        console.warn('Failed to save theme preference:', e);
    }
}

/**
 * Gets the saved theme from localStorage, or system preference if none saved.
 * @returns {string} Either 'dark' or 'light'
 */
function getSavedOrPreferredTheme() {
    try {
        const saved = localStorage.getItem(THEME_STORAGE_KEY);
        if (saved === THEME_DARK || saved === THEME_LIGHT) {
            return saved;
        }
    } catch (e) {
        console.warn('Failed to read theme preference:', e);
    }
    
    // Fall back to system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return THEME_DARK;
    }
    
    return THEME_LIGHT; // Ultimate fallback
}

/**
 * Sets up the theme toggle event listener and system theme change listener.
 */
export function setupThemeToggle() {
    if (!themeToggle) {
        console.error('Theme toggle element not found.');
        return;
    }
    
    themeToggle.addEventListener('change', () => {
        const newTheme = themeToggle.checked ? THEME_DARK : THEME_LIGHT;
        applyTheme(newTheme);
        saveTheme(newTheme);
    });
    
    // Listen for system theme changes for enhanced UX
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            // Only auto-switch if user hasn't set a manual preference in our app
            // (i.e., there's no 'theme' item in localStorage)
            try {
                if (!localStorage.getItem(THEME_STORAGE_KEY)) {
                    applyTheme(e.matches ? THEME_DARK : THEME_LIGHT);
                }
            } catch (err) {
                // Ignore localStorage access errors during system theme change
                console.warn('Error checking saved theme during system theme change:', err);
            }
        });
    }
}

/**
 * Loads and applies the initial theme on page load.
 */
export function loadTheme() {
    const theme = getSavedOrPreferredTheme();
    applyTheme(theme);
}