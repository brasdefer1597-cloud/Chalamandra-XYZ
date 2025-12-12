const apiKeyInput = document.getElementById('api-key-input');
const analysisTextarea = document.getElementById('analysis-text');
const thesisSelect = document.getElementById('thesis-select');
const antithesisSelect = document.getElementById('antithesis-select');
const analyzeButton = document.getElementById('analyze-button');
const errorMessageDiv = document.getElementById('error-message');
const resultContainer = document.getElementById('result-container');

function displayResult({ thesis, antithesis, synthesis }) {
    document.getElementById('res-thesis-text').textContent = thesis;
    document.getElementById('res-antithesis-text').textContent = antithesis;
    document.getElementById('res-synthesis-text').textContent = synthesis;
    resultContainer.classList.remove('hidden');
    errorMessageDiv.classList.add('hidden');
}

function displayError(msg) {
    errorMessageDiv.textContent = 'Error: ' + msg;
    errorMessageDiv.classList.remove('hidden');
    resultContainer.classList.add('hidden');
}

// Cargar API Key
chrome.storage.sync.get(['geminiApiKey'], (data) => {
    if (data.geminiApiKey) apiKeyInput.value = data.geminiApiKey;
});
apiKeyInput.addEventListener('change', () => {
    chrome.storage.sync.set({ geminiApiKey: apiKeyInput.value.trim() });
});

// Cargar texto seleccionado
chrome.storage.local.get(['selectedText'], (data) => {
    if (data.selectedText) {
        analysisTextarea.value = data.selectedText;
        chrome.storage.local.remove(['selectedText']);
    }
});

// Análisis
analyzeButton.addEventListener('click', () => {
    const text = analysisTextarea.value.trim();
    if (!text) return displayError("Ingresa o selecciona texto para analizar.");

    analyzeButton.disabled = true;
    analyzeButton.textContent = "GENERANDO SÍNTESIS...";

    chrome.runtime.sendMessage({
        action: "runDashboardAnalysis",
        text,
        thesisStyle: thesisSelect.value,
        antithesisStyle: antithesisSelect.value
    }, (response) => {
        analyzeButton.disabled = false;
        analyzeButton.textContent = "GENERAR SÍNTESIS";
        if (response?.error) {
            displayError(response.errorMsg);
        } else {
            displayResult(response);
        }
    });
});
