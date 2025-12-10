// content_scripts.js
// Responsible for reading DOM selection and saving it to storage

console.log("🦎 Chalamandra: Content Observer Active");

let debounceTimer = null;

// Helper to debounce storage writes (prevents performance issues)
function debouncedSave(text) {
    if (debounceTimer) clearTimeout(debounceTimer);
    
    debounceTimer = setTimeout(() => {
        chrome.storage.local.set({ 'selectedText': text }, () => {
            // Debug log
            // console.log("Text saved to storage.");
        });
    }, 500);
}

// Listen for selection changes
document.addEventListener('selectionchange', () => {
    const selection = window.getSelection().toString().trim();
    if (selection.length > 0) {
        debouncedSave(selection);
    }
});

// Capture right-clicks immediately
document.addEventListener('contextmenu', () => {
    const selection = window.getSelection().toString().trim();
    if (selection.length > 0) {
        chrome.storage.local.set({ 'selectedText': selec
