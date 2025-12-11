chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req.action === "runDashboardAnalysis") {
        handleAnalysis(req).then(sendResponse).catch(e => sendResponse({error: true, errorMsg: e.message}));
        return true; 
    }
});

async function handleAnalysis({ text, thesisStyle, antithesisStyle }) {
    const data = await chrome.storage.sync.get(['geminiApiKey']);
    if (!data.geminiApiKey) throw new Error("No API Key");

    const prompt = `Act as Dialectical AI. 
    1. THESIS (${thesisStyle}): Max 30 words.
    2. ANTITHESIS (${antithesisStyle}): Max 30 words.
    3. SYNTHESIS: Actionable solution. Max 40 words.
    FORMAT: Thesis... ||| Antithesis... ||| Synthesis...`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${data.geminiApiKey}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt + "\nINPUT: " + text }] }] })
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || "API Error");
    
    const parts = json.candidates[0].content.parts[0].text.split('|||');
    return { thesis: parts[0]||"Err", antithesis: parts[1]||"Err", synthesis: parts[2]||"Err" };
}

