// content_scripts.js
let selectedText = '';

// Captura selección automática
document.addEventListener('selectionchange', () => {
    const sel = window.getSelection().toString().trim();
    if (sel) {
        selectedText = sel;
        chrome.storage.local.set({ selectedText: sel });
    }
});

// Responde a peticiones del popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "runHybridAnalysis") {
        runHybridAnalysis(request).then(sendResponse).catch(e => sendResponse({ error: true, errorMsg: e.message }));
        return true;
    }
});

async function runHybridAnalysis({ text, thesisStyle, antithesisStyle }) {
    const prompt = `Actúa como IA Dialéctica. Input: "${text}"
1. THESIS (${thesisStyle}): Máx 30 palabras.
2. ANTITHESIS (${antithesisStyle}): Máx 30 palabras.
3. SYNTHESIS: Solución accionable. Máx 40 palabras.

Responde SOLO con JSON exacto: {"thesis":"...", "antithesis":"...", "synthesis":"..."}`;

    // 1. Gemini Nano local (si está disponible)
    if (typeof window.ai !== 'undefined') {
        const can = await window.ai.canCreateTextSession();
        if (can === "readily" || can === "after-download") {
            try {
                const session = await window.ai.createTextSession();
                const raw = await session.prompt(prompt);
                return parseToJSON(raw);
            } catch (e) {
                console.warn("Nano falló:", e);
            }
        }
    }

    // 2. Fallback cloud Gemini Flash
    const { geminiApiKey } = await chrome.storage.sync.get(['geminiApiKey']);
    if (!geminiApiKey) throw new Error("Falta API Key de Gemini.");

    const res = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] })
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || "Error en API Gemini");
    }

    const data = await res.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return parseToJSON(raw);
}

function parseToJSON(text) {
    try {
        const clean = text.trim().replace(/```json|```/g, '');
        const json = JSON.parse(clean);
        return {
            thesis: json.thesis?.trim() || "Error en tesis",
            antithesis: json.antithesis?.trim() || "Error en antítesis",
            synthesis: json.synthesis?.trim() || "Error en síntesis"
        };
    } catch (e) {
        // Fallback simple si el modelo no dio JSON
        const parts = text.split('|||');
        return {
            thesis: parts[0]?.trim() || "Error",
            antithesis: parts[1]?.trim() || "Error",
            synthesis: parts[2]?.trim() || "Error"
        };
    }
}
