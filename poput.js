document.addEventListener('DOMContentLoaded', () => {
    const keyInput = document.getElementById('api-key-input');
    const textInput = document.getElementById('analysis-text');
    const btn = document.getElementById('analyze-button');
    const resBox = document.getElementById('result-container');
    const errorMsg = document.getElementById('error-message');

    // Cargar Key guardada
    chrome.storage.sync.get(['geminiApiKey'], (r) => { if(r.geminiApiKey) keyInput.value = r.geminiApiKey; });
    // Cargar texto seleccionado
    chrome.storage.local.get(['selectedText'], (r) => { if(r.selectedText) { textInput.value = r.selectedText; chrome.storage.local.remove('selectedText'); } });

    keyInput.addEventListener('input', (e) => chrome.storage.sync.set({ geminiApiKey: e.target.value.trim() }));

    btn.addEventListener('click', () => {
        const text = textInput.value.trim();
        const key = keyInput.value.trim();
        
        if(!key) { errorMsg.textContent = "⚠️ Missing API Key"; errorMsg.classList.remove('hidden'); return; }
        if(!text) { errorMsg.textContent = "⚠️ Enter text to analyze"; errorMsg.classList.remove('hidden'); return; }

        btn.disabled = true;
        btn.textContent = "COMPUTING...";
        resBox.classList.add('hidden');
        errorMsg.classList.add('hidden');

        chrome.runtime.sendMessage({
            action: "runDashboardAnalysis",
            text: text,
            thesisStyle: document.getElementById('thesis-select').value,
            antithesisStyle: document.getElementById('antithesis-select').value
        }, (response) => {
            btn.disabled = false;
            btn.textContent = "GENERATE SYNTHESIS";

            if (chrome.runtime.lastError || response.error) {
                errorMsg.textContent = "⚠️ Error: " + (response?.errorMsg || "Connection failed");
                errorMsg.classList.remove('hidden');
            } else {
                document.getElementById('res-thesis-text').textContent = response.thesis;
                document.getElementById('res-antithesis-text').textContent = response.antithesis;
                document.getElementById('res-synthesis-text').textContent = response.synthesis;
                resBox.classList.remove('hidden');
            }
        });
    });
});
