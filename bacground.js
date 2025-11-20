mport aiClient from '../utils/apiClient.js';

// Configuration for Error Logging
const LOG_CONFIG = {
    ENABLE_REMOTE_LOGGING: false, // Set to true when you have a valid endpoint
    REMOTE_ENDPOINT: 'https://api.xyz369-analytics.com/v1/errors',
    MAX_LOCAL_LOGS: 50
};

/**
 * Robust Logger Utility
 * Handles local persistence and remote transmission of non-sensitive error data.
 */
const Logger = {
    async error(context, error) {
        try {
            // 1. Gather Metadata (Non-sensitive)
            const manifest = chrome.runtime.getManifest();
            const caps = await aiClient.checkNanoCapabilities();
            
            const errorReport = {
                id: crypto.randomUUID(),
                timestamp: new Date().toISOString(),
                version: manifest.version,
                context: context, // The action being performed (e.g., 'analyzePage')
                message: error.message || 'Unknown error',
                stack: error.stack,
                aiMode: caps.available ? 'NANO' : 'CLOUD', // Debug context
                userAgent: navigator.userAgent
            };

            // 2. Console Output (for immediate dev debugging)
            console.error(`[${context}] 🛑`, errorReport);

            // 3. Local Persistence (Store last N errors for inspection)
            const { errorLogs = [] } = await chrome.storage.local.get('errorLogs');
            const updatedLogs = [errorReport, ...errorLogs].slice(0, LOG_CONFIG.MAX_LOCAL_LOGS);
            await chrome.storage.local.set({ errorLogs: updatedLogs });

            // 4. Remote Logging (If enabled)
            if (LOG_CONFIG.ENABLE_REMOTE_LOGGING) {
                this.sendRemoteLog(errorReport);
            }

        } catch (loggingError) {
            // Fallback if the logger itself fails
            console.error("Logger Failure:", loggingError);
        }
    },

    async sendRemoteLog(report) {
        try {
            await fetch(LOG_CONFIG.REMOTE_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(report)
            });
        } catch (e) {
            console.warn("Failed to send remote log", e);
        }
    }
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    
    const handleRequest = async () => {
        try {
            // --- Admin/Debug Routes ---
            if (request.action === 'getLogs') {
                const { errorLogs = [] } = await chrome.storage.local.get('errorLogs');
                return errorLogs;
            }

            // --- Core Application Routes ---
            if (request.action === 'getApiStatus') {
                const caps = await aiClient.checkNanoCapabilities();
                const storage = await chrome.storage.sync.get('apiKey');
                
                if (caps.available) return { status: 'NANO_READY' };
                if (storage.apiKey) return { status: 'CLOUD_READY' };
                return { status: 'NEEDS_CONFIG' };
            }

            if (request.action === 'getPageMetadata') {
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                if (!tab?.id) throw new Error("No active tab found");
                
                // Use try/catch block specifically for tab communication
                try {
                    return await chrome.tabs.sendMessage(tab.id, { action: 'getContent' });
                } catch (e) {
                    throw new Error("Could not communicate with page. Try reloading the tab.");
                }
            }

            if (request.action === 'analyzePage') {
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                if (!tab?.id) throw new Error("No active tab found");
                
                const pageData = await chrome.tabs.sendMessage(tab.id, { action: 'getContent' });
                
                if (!pageData || !pageData.content) {
                    throw new Error("No text content found on this page.");
                }

                return await aiClient.processDialecticFlow(pageData.content);
            }

            if (request.action === 'summarizePage') {
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                if (!tab?.id) throw new Error("No active tab found");
                
                const pageData = await chrome.tabs.sendMessage(tab.id, { action: 'getContent' });
                
                if (!pageData || !pageData.content) {
                    throw new Error("No text content found on this page.");
                }

                return await aiClient.summarize(pageData.content);
            }

            throw new Error(`Unknown action: ${request.action}`);

        } catch (error) {
            // Log the robust error details
            await Logger.error(request.action || 'unknown_action', error);
            
            // Re-throw so the catch block below sends the user-facing error
            throw error;
        }
    };

    handleRequest()
        .then(data => sendResponse({ success: true, data }))
        .catch(err => {
            // Return a clean error message to the UI
            sendResponse({ 
                success: false, 
                error: err.message || "An unexpected error occurred." 
            });
        });

    return true; // Keep channel open for async response
});
