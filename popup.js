// --- popup.js (Código faltante) ---

const apiKeyInput = document.getElementById('api-key-input');
const analysisTextarea = document.getElementById('analysis-text');
const thesisSelect = document.getElementById('thesis-select');
const antithesisSelect = document.getElementById('antithesis-select');
const analyzeButton = document.getElementById('analyze-button');
const errorMessageDiv = document.getElementById('error-message');
const resultContainer = document.getElementById('result-container');

// 1. Manejo del API Key (Cargar al abrir, Guardar al cambiar)
chrome.storage.sync.get(['geminiApiKey'], (data) => {
    if (data.geminiApiKey) {
        apiKeyInput.value = data.geminiApiKey;
    }
});

apiKeyInput.addEventListener('change', () => {
    chrome.storage.sync.set({ 'geminiApiKey': apiKeyInput.value.trim() });
});

// 2. Cargar texto seleccionado (desde content_scripts.js)
chrome.storage.local.get(['selectedText'], (data) => {
    if (data.selectedText) {
        analysisTextarea.value = data.selectedText;
        // Limpiar después de usar para no persistir la selección pasada
        chrome.storage.local.remove(['selectedText']); 
    }
});

// 3. Función de Utilidad para Mostrar/Ocultar
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

// 4. Lógica del Botón de Análisis
analyzeButton.addEventListener('click', () => {
    const text = analysisTextarea.value.trim();
    const thesisStyle = thesisSelect.value;
    const antithesisStyle = antithesisSelect.value;
    
    // Validación mínima
    if (!text) return displayError("El campo de ANÁLISIS no puede estar vacío.");

    analyzeButton.disabled = true;
    analyzeButton.textContent = "GENERATING... (Wait)";

    // Llamar al service worker (background.js)
    chrome.runtime.sendMessage({
        action: "runDashboardAnalysis",
        text: text,
        thesisStyle: thesisStyle,
        antithesisStyle: antithesisStyle
    }, (response) => {
        analyzeButton.disabled = false;
        analyzeButton.textContent = "GENERATE SYNTHESIS";

        if (response.error) {
            displayError(response.errorMsg);
        } else {
            displayResult(response);
        }
    });
});
