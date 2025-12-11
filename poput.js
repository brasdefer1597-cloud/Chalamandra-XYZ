console.log("🚀 Chalamandra Popup iniciando...");

document.addEventListener('DOMContentLoaded', () => {
    
    // UI Elements
    const apiKeyInput = document.getElementById('api-key-input');
    const analysisText = document.getElementById('analysis-text');
    const analyzeButton = document.getElementById('analyze-button');
    const thesisSelect = document.getElementById('thesis-select');
    const antithesisSelect = document.getElementById('antithesis-select');
    const resultContainer = document.getElementById('result-container');
    const errorMsg = document.getElementById('error-message');
    const spinner = document.getElementById('loading-spinner');
    const btnText = document.getElementById('button-text');
    const resThesis = document.getElementById('res-thesis-text');
    const resAnti = document.getElementById('res-antithesis-text');
    const resSynth = document.getElementById('res-synthesis-text');

    // FORCE BUTTON ENABLE
    if (analyzeButton) {
        analyzeButton.disabled = false;
    }

    // Load Key
    chrome.storage.sync.get(['geminiApiKey'], (res) => {
        if(res.geminiApiKey && apiKeyInput) apiKeyInput.value = res.geminiApiKey;
    });

    if (apiKeyInput) {
        apiKeyInput.addEventListener('input', (e) => {
            chrome.storage.sync.set({ geminiApiKey: e.target.value.trim() });
        });
    }

    // CLICK HANDLER
    if (analyzeButton) {
        analyzeButton.addEventListener('click', () => {
            const text = analysisText.value.trim();
            const key = apiKeyInput.value.trim();

            if (!key) { showError("Paste Google API Key first"); return; }
            if (!text) { showError("Enter text to analyze"); return; }

            setLoading(true);
            hideError();
            resultContainer.classList.add('hidden');

            chrome.runtime.sendMessage({
                action: "runDashboardAnalysis",
                text: text,
                thesisStyle: thesisSelect.value,
                antithesisStyle: antithesisSelect.value
            }, (response) => {
                setLoading(false);

                if (chrome.runtime.lastError) {
                    showError("Connection error. Reload extension.");
                    return;
                }
                if (response && response.error) {
                    showError(response.errorMsg || "AI Error");
                } else if (response) {
                    resThesis.textContent = response.thesis;
                    resAnti.textContent = response.antithesis;
                    resSynth.textContent = response.synthesis;
                    resultContainer.classList.remove('hidden');
                }
            });
        });
    }

    function setLoading(loading) {
        if(loading) {
            analyzeButton.disabled = true;
            btnText.textContent = "PROCESSING...";
            spinner.classList.remove('hidden');
        } else {
            analyzeButton.disabled = false;
            btnText.textContent = "GENERATE SYNTHESIS";
            spinner.classList.add('hidden');
        }
    }

    function showError(msg) {
        errorMsg.textContent = "⚠️ " + msg;
        errorMsg.classList.remove('hidden');
    }
    function hideError() { errorMsg.classList.add('hidden'); }
});
