// background.js
// 🧠 Chalamandra Core: Dialectical Orchestrator & Resilient Proxy
// Version: 1.0.0 (English Edition)

// --- 1. THE PERSONALITY MATRIX ---
const PERSONALITIES = {
    'CHOLA': {
        role: 'Thesis',
        name: 'CHOLA 😈',
        systemPrompt: "You are CHOLA. Tone: Wise, street-smart, historical, grounded. Use slang like 'simón', 'trucha'. Objective: Provide foundational wisdom and historical patterns. Analyze what has worked before and why the text is valid."
    },
    'MALANDRA': {
        role: 'Antithesis',
        name: 'MALANDRA 🌪️',
        systemPrompt: "You are MALANDRA. Tone: Chaotic, skeptical, disruptive, aggressive. Use slang like 'chale', 'fierro', 'fake news'. Objective: Identify risks, scams, logical fallacies, and hidden flaws. Break the assumptions."
    },
    'FRESA': {
        role: 'Synthesis',
        name: 'FRESA 🍓',
        systemPrompt: "You are FRESA. Tone: Corporate, aesthetic, efficient, Spanglish ('o sea', 'literally', 'ASAP'). Objective: Resolve the conflict. Optimize the message for maximum impact and actionability. Combine the wisdom of the past with risk awareness."
    }
};

// --- 2. ORCHESTRATION LAYER ---

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "chalamandra-analyze",
        title: "🦎 Analyze with Chalamandra",
        contexts: ["selection"]
    });
    console.log("🦎 Chalamandra: Neural Pathways Online.");
});

// Handle Context Menu Clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "chalamandra-analyze" && info.selectionText) {
        // Save text to storage so the popup can read it
        chrome.storage.local.set({ selectedText: info.selectionText }, () => {
             // Optional: Add a visual indicator badge
             chrome.action.setBadgeText({ text: "!" });
             chrome.action.setBadgeBackgroundColor({ color: "#F97316" });
        });
    }
});

// Handle Messages from Popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "runDialecticalAnalysis") {
        const { text, personality } = request;
        
        // Execute Resilient Proxy
        resilientAPIProxy(text, personality)
            .then(result => {
                sendResponse({ 
                    success: true, 
                    persona: PERSONALITIES[personality].name,
                    role: PERSONALITIES[personality].role,
                    synthesis: result.output,
                    source: result.source // Returns 'Nano ⚡' or 'Cloud ☁️'
                });
            })
            .catch(error => {
                console.error("Quantum Collapse Error:", error);
                sendResponse({ 
                    error: true, 
                    persona: personality, 
                    synthesis: error.message 
                });
            });

        return true; // Keep channel open for async response
    }
});

// --- 3. RESILIENT API PROXY (Local First -> Cloud Fallback) ---

async function resilientAPIProxy(inputText, personalityKey) {
    const config = PERSONALITIES[personalityKey];
    
    // STEP 1: Attempt Local (Gemini Nano)
    try {
        console.log("Attempting Local Processing (Gemini Nano)...");
        const localResult = await tryLocalGeneration(inputText, config.systemPrompt);
        return { output: localResult, source: "Nano ⚡ (Local)" };
    } catch (localError) {
        console.warn("⚠️ Local AI Unavailable/Failed:", localError.message);
        console.log("🔄 Falling back to Cloud API...");
        
        // STEP 2: Fallback to Cloud (Gemini Pro API)
        try {
            const cloudResult = await tryCloudGeneration(inputText, config.systemPrompt);
            return { output: cloudResult, source: "Cloud ☁️ (API)" };
        } catch (cloudError) {
            console.error("❌ Cloud Fallback Failed:", cloudError);
            throw new Error(`System Failure. Local: ${localError.message}. Cloud: ${cloudError.message}`);
        }
    }
}

// --- 4. ENGINE A: GEMINI NANO (Local) ---
// Uses Chrome's experimental Prompt API

async function tryLocalGeneration(inputText, systemPrompt) {
    // Check if 'ai' or 'window.ai' exists
    const ai = self.ai || window.ai;

    if (!ai || !ai.languageModel) {
        throw new Error("Gemini Nano not supported or enabled in this browser.");
    }

    const capabilities = await ai.languageModel.capabilities();
    if (capabilities.available === "no") {
        throw new Error("Gemini Nano model is not downloaded or available.");
    }

    // Create session
    const session = await ai.languageModel.create({
        systemPrompt: systemPrompt
    });

    // Generate
    const result = await session.prompt(inputText);
    
    // Cleanup
    session.destroy();
    
    return result;
}

// --- 5. ENGINE B: GEMINI PRO (Cloud) ---
// Uses the User's API Key

async function tryCloudGeneration(inputText, systemPrompt) {
    // 1. Get Secure API Key
    const data = await chrome.storage.sync.get(['geminiApiKey']);
    if (!data.geminiApiKey) {
        throw new Error("No Cloud API Key found. Please configure it in the extension popup.");
    }

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${data.geminiApiKey}`;
    
    // Combine prompt structure for the API
    const fullPrompt = `${systemPrompt}\n\n--- USER INPUT ---\n${inputText}`;

    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: fullPrompt }] }]
        })
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || "Cloud API Error");
    }

    const json = await response.json();
    return json.candidates[0].content.parts[0].text;
}
