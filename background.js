// background.js - Solo reenvía al content script activo
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "runDashboardAnalysis") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: "runHybridAnalysis",
                    text: request.text,
                    thesisStyle: request.thesisStyle,
                    antithesisStyle: request.antithesisStyle
                }, sendResponse);
            }
        });
        return true; // Asíncrono
    }
});
