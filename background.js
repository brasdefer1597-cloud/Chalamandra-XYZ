// Archivo background.js - El Service Worker (Cerebro Discreto)

// Constantes de las personalidades
const PERSONALITIES = {
    CHOLA: { name: "CHOLA (Thesis)", model: "ai.summarizer", role: "Foundational insight and historical context." },
    MALANDRA: { name: "MALANDRA (Antithesis)", model: "ai.proofreader", role: "Critical analysis and disruptive alternatives." },
    FRESA: { name: "FRESA (Synthesis)", model: "ai.writer", role: "Optimal pathfinding and synthesis refinement." }
};

// Función simulada para la Orquestación Dialéctica
async function dialecticalOrchestrator(text, personality) {
    console.log(`[Orchestrator] Iniciando análisis para: ${personality.name}`);
    
    // --- SIMULACIÓN DEL QuantumCollapse & ResilientAPIProxy ---
    // En una implementación real, aquí se llamaría a Gemini Nano (local) o Vercel Serverless (cloud).

    // Esperar para simular el procesamiento (el "Quantum Collapse")
    await new Promise(resolve => setTimeout(resolve, 2000)); 

    let result = {
        synthesis: "ERROR: No se pudo realizar la síntesis.",
        persona: personality.name,
        role: personality.role
    };

    if (text.length < 10) {
         result.synthesis = `Texto demasiado corto. ${personality.name} necesita más contexto para un análisis dialectico.`;
    } else {
        // Simular la respuesta basada en la personalidad
        if (personality === PERSONALITIES.CHOLA) {
            result.synthesis = `[CHOLA]: Basado en el patrón histórico, la tesis es: "${text.substring(0, 50)}..." se alinea con los éxitos pasados.`;
        } else if (personality === PERSONALITIES.MALANDRA) {
            result.synthesis = `[MALANDRA]: Alerta de disrupción. La antítesis es: "${text.substring(0, 50)}..." ignora el riesgo emergente Z.`;
        } else if (personality === PERSONALITIES.FRESA) {
            result.synthesis = `[FRESA]: Síntesis Óptima: El camino es combinar la estabilidad de la tesis con la innovación de la antítesis. Acción: Revisa ${text.substring(0, 50)}...`;
        }
    }

    return result;
}

// Escucha mensajes del popup.js y content_scripts.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "runDialecticalAnalysis") {
        const personalityKey = request.personality;
        const text = request.text;
        const personality = PERSONALITIES[personalityKey];

        if (!personality) {
            sendResponse({ error: "Personalidad no válida." });
            return true;
        }

        dialecticalOrchestrator(text, personality)
            .then(result => sendResponse(result))
            .catch(error => sendResponse({ error: error.message }));
            
        // Indica que la respuesta se enviará de forma asíncrona
        return true; 
    }
});

// Crea un menú contextual para el análisis rápido (opcional)
chrome.contextMenus.create({
    id: "chalamandraQuickAnalyze",
    title: "Chalamandra: Quick Analyze Selection",
    contexts: ["selection"]
});

// Maneja el clic en el menú contextual
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "chalamandraQuickAnalyze" && info.selectionText) {
        // Ejecuta un script para abrir el popup con el texto seleccionado, o envia a background para análisis
        chrome.tabs.sendMessage(tab.id, {
            action: "contextMenuTextSelected",
            text: info.selectionText
        });
    }
});
