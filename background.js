// background.js file - The Service Worker (Discrete Brain)

// IMPORTANT: The API_KEY is automatically provided by the environment during the fetch call.
const API_KEY = ""; 
const MODEL_NAME = "gemini-2.5-flash-preview-09-2025";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;
const MAX_RETRIES = 3;

// 1. Personality configuration with specific System Instructions for the AI model
const PERSONALITIES = {
    CHOLA: { 
        name: "CHOLA (Thesis)", 
        role: "Foundational insight and historical context.",
        systemInstruction: "Act as CHOLA (The Core of Wisdom). Your role is to provide foundational knowledge, identify historical patterns, and establish the main thesis based on the user's text. Respond only with the synthesized analysis. Use a firm, authoritative, and structured tone. Do not use any markdown formatting like lists or headers."
    },
    MALANDRA: { 
        name: "MALANDRA (Antithesis)", 
        role: "Critical analysis and disruptive alternatives.",
        systemInstruction: "Act as MALANDRA (The Engine of Disruption). Your role is to challenge assumptions, identify hidden risks and flaws, and propose chaotic or disruptive alternatives to the user's text. Respond only with the synthesized analysis. Use a provocative, skeptical, and slightly rebellious tone. Do not use any markdown formatting like lists or headers."
    },
    FRESA: { 
        name: "FRESA (Synthesis)", 
        role: "Optimal pathfinding and synthesis refinement.",
        systemInstruction: "Act as FRESA (The Optimal Orchestrator). Your role is to combine the stability of a thesis and the innovation of an antithesis to create an actionable, refined, and immediately impactful synthesis of the user's text. Respond only with the synthesized analysis. Use a clear, polished, and result-oriented tone. Do not use any markdown formatting like lists or headers."
    }
};

// 2. Helper function to handle API calls with exponential backoff
async function exponentialBackoffFetch(url, options, retries = 0) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            // Throw error to trigger retry logic
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        if (retries < MAX_RETRIES) {
            const delay = Math.pow(2, retries) * 1000; // 1s, 2s, 4s
            console.warn(`[API] Retrying in ${delay}ms... Attempt ${retries + 1}/${MAX_RETRIES}`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return exponentialBackoffFetch(url, options, retries + 1);
        }
        throw new Error(`Failed to fetch content after ${MAX_RETRIES} attempts: ${error.message}`);
    }
}

// 3. Main function for dialectical analysis using the Gemini API
async function dialecticalOrchestrator(text, personality) {
    console.log(`[Orchestrator] Starting Gemini analysis for: ${personality.name}`);
    
    if (text.length < 20) {
        return {
            synthesis: `Text is too short. ${personality.name} requires more context for a meaningful dialectical analysis.`,
            persona: personality.name,
            role: personality.role,
            error: null
        };
    }

    const payload = {
        contents: [{ parts: [{ text: `Analyze the following text based on your assigned personality: "${text}"` }] }],
        systemInstruction: { parts: [{ text: personality.systemInstruction }] },
    };

    try {
        const response = await exponentialBackoffFetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const candidate = response.candidates?.[0];
        const synthesisText = candidate?.content?.parts?.[0]?.text;

        if (synthesisText) {
            return {
                synthesis: synthesisText,
                persona: personality.name,
                role: personality.role,
                error: null
            };
        } else {
            console.error("Gemini response lacked content:", response);
             return {
                synthesis: "Gemini did not return a valid analysis. Check the console for details.",
                persona: personality.name,
                role: personality.role,
                error: "API response empty."
            };
        }

    } catch (error) {
        console.error("Full analysis error:", error);
        return {
            synthesis: "The Quantum Collapse failed due to a network or API error.",
            persona: personality.name,
            role: personality.role,
            error: error.message
        };
    }
}

// 4. Listens for messages from popup.js and content_scripts.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "runDialecticalAnalysis") {
        const personalityKey = request.personality;
        const text = request.text;
        const personality = PERSONALITIES[personalityKey];

        if (!personality) {
            sendResponse({ error: "Invalid personality selected." });
            return true;
        }

        dialecticalOrchestrator(text, personality)
            .then(result => sendResponse(result))
            .catch(error => sendResponse({ error: error.message }));
            
        // Indicates that the response will be sent asynchronously
        return true; 
    }
});

// 5. Creates a context menu item for quick analysis
chrome.contextMenus.create({
    id: "chalamandraQuickAnalyze",
    title: "Chalamandra: Quick Analyze Selection",
    contexts: ["selection"]
});

// 6. Handles the context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "chalamandraQuickAnalyze" && info.selectionText) {
        // Stores the selected text and opens the popup
        chrome.storage.local.set({ selectedText: info.selectionText }, () => {
            // No need to send a message, the popup will read the storage when opened.
        });
    }
});
