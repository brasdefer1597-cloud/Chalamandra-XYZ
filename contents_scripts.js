/ content_scripts.js file - The Eyes and Hands

// Listens for messages from the Service Worker (background.js)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // If the Service Worker sends a message with selected text
    if (request.action === "contextMenuTextSelected" && request.text) {
        // Stores the selected text so the popup can retrieve it
        chrome.storage.local.set({ selectedText: request.text }, () => {
            console.log("Selected text stored for popup.");
        });
    }
});

// Function to get selected text from the DOM
function getSelectedText() {
    return window.getSelection().toString().trim();
}

// Adds a listener for the 'mouseup' event to detect selection
document.addEventListener('mouseup', () => {
    const selectedText = getSelectedText();
    if (selectedText) {
        // Stores the text in local storage so the popup can access it when opened
        chrome.storage.local.set({ selectedText: selectedText }, () => {
            // No need to send a message to the background here, the popup will read it upon opening.
        });
    }
});
