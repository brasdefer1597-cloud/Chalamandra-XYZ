// background.js
// 🧠 Chalamandra Core: Dialectical Orchestrator & Resilient Proxy
// Version: 1.0.0 (Hybrid: Local First -> Cloud Fallback)

// --- 1. THE PERSONALITY MATRIX ---
const PERSONALITIES = {
    'CHOLA': {
        role: 'Thesis',
        name: 'CHOLA 😈',
        systemPrompt: "You are CHOLA. Tone: Wise, street-smart, historical. Use slang like 'simón', 'trucha'. Objective: Provide foundational wisdom and historical patterns. What has worked before?"
    },
    'MALANDRA': {
        role: 'Antithesis',
        name: 'MALANDRA 🌪️',
        systemPrompt: "You are MALANDRA. Tone: Chaotic, skeptical, disruptive. Use slang like 'chale', 'ya te la sabes'. Objective: Identify risks, scams, and hidden flaws. Break the assumptions."
    },
    'FRESA': {
        role: 'Synthesis',
        name: 'FRESA 🍓',
        systemPrompt: "You are FRESA. Tone: Corporate, aesthetic, efficient, Spanglish ('o sea', 'literally'). Objective: Optimize the conflict between wisdom and risk. Provide a clean, actionable path forward."
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

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "chalamandra-analyze" && info.selectionText) {
        // Guarda texto y notifica al usuario (podrías abrir el popup aquí si Chrome lo permitiera fácilmente)
        chrome.storage.local.set({ selectedText: info.selectionText }, () => {
             chrome.action.setBadgeText({ text: "!" });
             chrome.action.setBadgeBackgroundColor({ color: "#F97316" });
        });
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "runDialecticalAnalysis") {
        const { text, personality } = request;
        
        // Ejecutar el Proxy Resiliente
        resilientAPIProxy(text, personality)
            .then(result => {
                sendResponse({ 
                    success: true, 
                    persona: PERSONALITIES[personality].name,
                    role: PERSONALITIES[personality].role,
                    synthesis: result.output,
                    source: result.source // 'Nano ⚡' o 'Cloud ☁️'
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

        return true; // Mantiene el canal abierto para async
    }
});

// --- 3. RESILIENT API PROXY (The Core Innovation) ---

async function resilientAPIProxy(inputText, personalityKey) {
    const config = PERSONALITIES[personalityKey];
    
    // PASO 1: Intentar Local (Gemini Nano)
    try {
        console.log("Attempting Local Processing (Gemini Nano)...");
        const localResult = await tryLocalGeneration(inputText, config.systemPrompt);
        return { output: localResult, source: "Nano ⚡ (Local)" };
    } catch (localError) {
        console.warn("⚠️ Local AI Unavailable/Failed:", localError.message);
        console.log("🔄 Falling back to Cloud API...");
        
        // PASO 2: Fallback a Cloud (Gemini Pro API)
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
// Utiliza la API experimental `window.ai` de Chrome

async function tryLocalGeneration(inputText, systemPrompt) {
    // Verificar si la API existe en el navegador
    // Nota: 'self.ai' o 'ai' debe estar disponible en el Service Worker en versiones recientes de Canary
    const ai = self.ai || window.ai;

    if (!ai || !ai.languageModel) {
        throw new Error("Gemini Nano not supported or enabled in this browser.");
    }

    const capabilities = await ai.languageModel.capabilities();
    if (capabilities.available === "no") {
        throw new Error("Gemini Nano model is not downloaded or available.");
    }

    // Crear sesión con el System Prompt
    const session = await ai.languageModel.create({
        systemPrompt: systemPrompt
    });

    // Generar
    const result = await session.prompt(inputText);
    
    // Limpieza
    session.destroy();
    
    return result;
}

// --- 5. ENGINE B: GEMINI PRO (Cloud) ---
// Utiliza la API Key almacenada por el usuario

async function tryCloudGeneration(inputText, systemPrompt) {
    // 1. Obtener API Key segura
    const data = await chrome.storage.sync.get(['geminiApiKey']);
    if (!data.geminiApiKey) {
        throw new Error("No Cloud API Key found. Configure it in the extension.");
    }

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${data.geminiApiKey}`;
    
    const prompt = `${systemPrompt}\n\n--- INPUT TEXT ---\n${inputText}`;

    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
        })
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || "Cloud API Error");
    }

    const json = await response.json();
    return json.candidates[0].content.parts[0].text;
}
