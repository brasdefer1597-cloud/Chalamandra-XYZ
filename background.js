// --- background.js (Código ROBUSTO) ---

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "runDashboardAnalysis") {
        // Devuelve true para usar sendResponse de forma asíncrona
        handleAnalysis(request).then(sendResponse).catch(e => sendResponse({error: true, errorMsg: e.message}));
        return true; 
    }
});

async function handleAnalysis({ text, thesisStyle, antithesisStyle }) {
    const data = await chrome.storage.sync.get(['geminiApiKey']);
    if (!data.geminiApiKey) throw new Error("Falta API Key. Pégala en el popup.");

    const prompt = `Act as Dialectical AI. Input: "${text}"
    1. THESIS (${thesisStyle}): Max 30 words.
    2. ANTITHESIS (${antithesisStyle}): Max 30 words.
    3. SYNTHESIS: Actionable solution. Max 40 words.
    FORMAT: Thesis... ||| Antithesis... ||| Synthesis...`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${data.geminiApiKey}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const json = await res.json();
    
    // 1. Manejo de error de respuesta HTTP
    if (!res.ok) throw new Error(json.error?.message || "Error desconocido de la API de Gemini.");
    
    // 2. Manejo de error de respuesta de contenido (e.g., contenido bloqueado)
    const responseText = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!responseText) {
        const finishReason = json.candidates?.[0]?.finishReason;
        throw new Error(`Respuesta de la API incompleta o bloqueada. Razón: ${finishReason || 'Desconocida'}.`);
    }

    const parts = responseText.split('|||');
    
    // 3. Manejo de error de formato
    if (parts.length < 3) {
        throw new Error("El modelo no siguió el formato Tesis ||| Antítesis ||| Síntesis.");
    }
    
    return { 
        thesis: parts[0].trim() || "Err", 
        antithesis: parts[1].trim() || "Err", 
        synthesis: parts[2].trim() || "Err" 
    };
}
