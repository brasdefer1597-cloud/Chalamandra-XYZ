console.log("🦎 Chalamandra Brain: ONLINE");

// Analytics Class
class DialectAnalyzer {
    constructor() {
        this.metrics = { total: 0 };
    }
    record() {
        this.metrics.total++;
        console.log(`📈 Analysis Recorded. Total: ${this.metrics.total}`);
    }
}
const analyzer = new DialectAnalyzer();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "runDashboardAnalysis") {
        const { text, thesisStyle, antithesisStyle } = request;
        
        handleAnalysis(text, thesisStyle, antithesisStyle)
            .then(response => {
                analyzer.record();
                sendResponse(response);
            })
            .catch(error => {
                sendResponse({ error: true, errorMsg: error.message });
            });
        return true; 
    }
});

async function handleAnalysis(text, tStyle, aStyle) {
    const data = await chrome.storage.sync.get(['geminiApiKey']);
    if (!data.geminiApiKey) throw new Error("No API Key found.");

    const PROMPTS = {
        'CHOLA': "Tone: Wise, street slang ('simón'). Focus: History/Truth.",
        'MALANDRA': "Tone: Disruptive slang ('chale'). Focus: Risks/Flaws.",
        'FRESA': "Tone: Corporate Spanglish ('o sea'). Focus: Optimization."
    };

    const prompt = `
    Role: Dialectical AI. Input: "${text}"
    1. THESIS (${tStyle}): ${PROMPTS[tStyle]} (Max 30 words)
    2. ANTITHESIS (${aStyle}): ${PROMPTS[aStyle]} (Max 30 words)
    3. SYNTHESIS (Actionable): Resolve conflict. (Max 40 words)
    
    FORMAT: Separate parts with "|||". Example: Thesis... ||| Antithesis... ||| Synthesis...
    `;

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${data.geminiApiKey}`;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const json = await response.json();
        if (!response.ok) throw new Error(json.error?.message || "API Error");
        
        const rawText = json.candidates[0].content.parts[0].text;
        const parts = rawText.split('|||');
        
        return {
            thesis: parts[0] ? parts[0].trim() : "Error",
            antithesis: parts[1] ? parts[1].trim() : "Error",
            synthesis: parts[2] ? parts[2].trim() : rawText,
            source: "Cloud ☁️"
        };
    } catch (e) { throw e; }
}

