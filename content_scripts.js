document.addEventListener('selectionchange', () => {
    const sel = window.getSelection().toString().trim();
    if (sel.length > 0) {
        chrome.storage.local.set({ 'selectedText': sel });
    }
});
