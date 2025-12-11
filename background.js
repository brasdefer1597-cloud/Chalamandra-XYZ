// background.js - Producción
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "runDashboardAnalysis") {
        handleAnalysis(request)
            .then(sendResponse)
            .catch(err => sendResponse({ error: true, errorMsg: err.message }));
        return true; // Mantiene el canal abierto
    }
});

async function handleAnalysis({ text, thesisStyle, antithesisStyle }) {
    // 1. Obtener API Key
    const data = await chrome.storage.sync.get(['geminiApiKey']);
    if (!data.geminiApiKey) throw new Error("Falta la API Key. Configúrala en el popup.");

    // 2. Construir Prompt
    const prompt = `
    Actua como un Motor Dialéctico IA. Analiza este texto: "${text}"
    
    1. Genera una TESIS (${thesisStyle}). Máximo 30 palabras. Tono sabio/histórico.
    2. Genera una ANTÍTESIS (${antithesisStyle}). Máximo 30 palabras. Tono disruptivo/crítico.
    3. Genera una SÍNTESIS. Máximo 40 palabras. Solución accionable y equilibrada.

    FORMATO DE SALIDA OBLIGATORIO (Usa separadores |||):
    Contenido Tesis... ||| Contenido Antítesis... ||| Contenido Síntesis...
    `;

    // 3. Llamar a Google Gemini
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${data.geminiApiKey}`;
    
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || "Error de API Google");
    }

    const json = await response.json();
    const rawText = json.candidates[0].content.parts[0].text;
    const parts = rawText.split('|||');

    return {
        thesis: parts[0] ? parts[0].trim() : "Error en Tesis",
        antithesis: parts[1] ? parts[1].trim() : "Error en Antítesis",
        synthesis: parts[2] ? parts[2].trim() : rawText
    };
}


