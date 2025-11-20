/**
 * XYZ 369 Dialectic Engine
 * Integrates Gemini Nano (Local) and Gemini Flash (Cloud via REST)
 * No external dependencies required.
 */
class AIClient {
    constructor() {
        this.capabilities = null;
    }

    /**
     * Check if Gemini Nano is available on the device
     */
    async checkNanoCapabilities() {
        const caps = {
            summarizer: false,
            textSession: false,
            available: false
        };

        if (typeof self.ai === 'undefined') return caps;

        try {
            if (self.ai.summarizer) {
                const summarizerCaps = await self.ai.summarizer.capabilities();
                if (summarizerCaps.available !== 'no') caps.summarizer = true;
            }
            
            if (self.ai.languageModel) {
                const modelCaps = await self.ai.languageModel.capabilities();
                if (modelCaps.available !== 'no') caps.textSession = true;
            }
            
            caps.available = caps.summarizer && caps.textSession;
        } catch (e) {
            console.warn("Nano check failed:", e);
        }
        this.capabilities = caps;
        return caps;
    }

    /**
     * Step 1: CHOLA (Thesis) - Grounded, Historical, Direct
     */
    async generateThesis(text) {
        if (this.capabilities?.summarizer) {
            try {
                const summarizer = await self.ai.summarizer.create({
                    type: 'key-points',
                    format: 'markdown',
                    length: 'medium'
                });
                const result = await summarizer.summarize(text, { context: "Analyze the core facts and reality of this content." });
                summarizer.destroy();
                return `**CHOLA (The Reality):**\n\n${result}`;
            } catch(e) { console.warn("Nano Thesis failed", e); }
        }
        return null;
    }

    /**
     * Step 2: MALANDRA (Antithesis) - Critical, Street-smart, Disruptive
     */
    async generateAntithesis(thesis) {
        if (this.capabilities?.textSession) {
            try {
                const session = await self.ai.languageModel.create({
                    systemPrompt: "You are MALANDRA. You are a critical thinker, street-smart, and skeptical. Your job is to find flaws, contradictions, and hidden risks. Challenge the thesis."
                });
                const result = await session.prompt(`Here is the Thesis:\n${thesis}\n\nDestroy this arguments nicely. Find the blind spots. Be constructive but sharp.`);
                session.destroy();
                return `**MALANDRA (The Critique):**\n\n${result}`;
            } catch(e) { console.warn("Nano Antithesis failed", e); }
        }
        return null;
    }

    /**
     * Step 3: FRESA (Synthesis) - Integrative, Strategic, Polished
     */
    async generateSynthesis(thesis, antithesis) {
        if (this.capabilities?.textSession) {
            try {
                const session = await self.ai.languageModel.create({
                    systemPrompt: "You are FRESA. You are sophisticated, strategic, and solution-oriented. You integrate conflicting ideas into a higher-level innovation."
                });
                const result = await session.prompt(`Thesis: ${thesis}\n\nAntithesis: ${antithesis}\n\nCreate a Synthesis (Pattern 369). Integrate the reality and the critique into a brilliant solution.`);
                session.destroy();
                return `**FRESA (The Vision):**\n\n${result}`;
            } catch(e) { console.warn("Nano Synthesis failed", e); }
        }
        return null;
    }

    /**
     * Main Process Orchestrator
     */
    async processDialecticFlow(text) {
        await this.checkNanoCapabilities();

        try {
            // Try Nano Flow first
            if (this.capabilities.available) {
                console.log("🚀 Starting Nano Flow");
                const thesis = await this.generateThesis(text);
                if (thesis) {
                    const antithesis = await this.generateAntithesis(thesis);
                    const synthesis = await this.generateSynthesis(thesis, antithesis);

                    if (thesis && antithesis && synthesis) {
                        return {
                            chola: thesis,
                            malandra: antithesis,
                            fresa: synthesis,
                            metrics: { source: 'gemini-nano', time: Date.now() }
                        };
                    }
                }
            }
            
            // Fallback to Cloud
            console.log("☁️ Falling back to Cloud");
            return await this.processWithCloudFallback(text);

        } catch (error) {
            throw new Error(`Dialectic process failed: ${error.message}`);
        }
    }

    /**
     * Cloud Fallback using Raw REST API (Fetch) to avoid SDK bundle issues
     */
    async processWithCloudFallback(text) {
        const storage = await chrome.storage.sync.get('apiKey');
        const apiKey = storage.apiKey;
        
        if (!apiKey) throw new Error("Nano unavailable and no API Key found. Please configure in Options.");

        const prompt = `
        Analyze the following text using the Dialectic Method (Hegel) but with these personas:
        
        1. **CHOLA (Thesis)**: Grounded, factual, historical context. What is the bare reality?
        2. **MALANDRA (Antithesis)**: Critical, skeptical, challenging. What are the risks and contradictions?
        3. **FRESA (Synthesis)**: Strategic, aspirational, integrative. What is the optimal path forward?

        Return ONLY a JSON object with keys: "chola", "malandra", "fresa".
        Do not include Markdown formatting block inside the response.
        
        Text to analyze: "${text.substring(0, 8000)}"
        `;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: "application/json"
                }
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || 'Cloud API Error');
        }

        const data = await response.json();
        const resultText = data.candidates[0].content.parts[0].text;
        
        try {
            const result = JSON.parse(resultText);
            return { ...result, metrics: { source: 'gemini-cloud' } };
        } catch (e) {
            throw new Error("Failed to parse Cloud JSON response.");
        }
    }

    async summarize(text) {
        await this.checkNanoCapabilities();
        
        // Nano
        if (this.capabilities.summarizer) {
             const summarizer = await self.ai.summarizer.create({format: 'markdown'});
             const result = await summarizer.summarize(text);
             summarizer.destroy();
             return result;
        }
        
        // Cloud Fallback
        const storage = await chrome.storage.sync.get('apiKey');
        const apiKey = storage.apiKey;

        if (!apiKey) throw new Error("No AI available (Nano disabled, No API Key).");
        
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Summarize this concisely in markdown bullet points: ${text.substring(0, 5000)}` }] }]
            })
        });

        if (!response.ok) throw new Error('Summarize failed');
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }
}

export default new AIClient();
