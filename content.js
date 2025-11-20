chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getContent') {
        const clone = document.body.cloneNode(true);
        
        // Remove noise
        const noise = ['nav', 'footer', 'header', 'aside', 'script', 'style', 'iframe', 'noscript', '[role="alert"]', '.ad', '.menu'];
        clone.querySelectorAll(noise.join(',')).forEach(el => el.remove());

        const text = clone.innerText.replace(/\s+/g, ' ').trim();
        const wordCount = text.split(' ').length;
        
        // Cap at 15k chars to prevent token overflow
        sendResponse({ 
            content: text.substring(0, 15000), 
            wordCount,
            title: document.title 
        });
    }
    return true;
});
