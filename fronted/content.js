chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getContent') {
        // Clone to avoid modifying the live page
        const clone = document.body.cloneNode(true);
        
        // Remove noise elements
        const noise = ['nav', 'footer', 'header', 'aside', 'script', 'style', 'iframe', 'noscript', '[role="alert"]', '.ad', '.menu'];
        clone.querySelectorAll(noise.join(',')).forEach(el => el.remove());

        // Get clean text
        const text = clone.innerText.replace(/\s+/g, ' ').trim();
        const wordCount = text.split(' ').length;
        
        // Cap at 15k chars to prevent token overflow in API
        sendResponse({ 
            content: text.substring(0, 15000), 
            wordCount,
            title: document.title 
        });
    }
    return true;
});
