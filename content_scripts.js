document.addEventListener('selectionchange', () => {
    const sel = window.getSelection().toString().trim();
    if (sel) chrome.storage.local.set({ 'selectedText': sel });
});

