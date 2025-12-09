// Archivo popup.js - Lógica del Panel de Control

document.addEventListener('DOMContentLoaded', () => {
    const analysisText = document.getElementById('analysis-text');
    const analyzeButton = document.getElementById('analyze-button');
    const personalityButtons = document.querySelectorAll('.personality-btn');
    const selectionStatus = document.getElementById('selection-status');
    const resultContainer = document.getElementById('result-container');
    const resultText = document.getElementById('result-text');
    const errorMsg = document.getElementById('error-message');
    const buttonText = document.getElementById('button-text');
    const loadingSpinner = document.getElementById('loading-spinner');

    let selectedPersonality = 'FRESA'; // Fresa es la síntesis por defecto

    // 1. Cargar el texto seleccionado (desde content_scripts.js)
    chrome.storage.local.get(['selectedText'], (data) => {
        const text = data.selectedText || '';
        analysisText.value = text;
        updateUI(text);

        // Limpiar después de usar
        if (text) {
            chrome.storage.local.remove('selectedText');
        }
    });

    // Función para actualizar el estado del UI
    function updateUI(text) {
        if (text.length > 5) {
            selectionStatus.innerHTML = `<span class="text-green-400">✅ Texto de ${text.length} caracteres cargado.</span>`;
            analyzeButton.disabled = false;
        } else {
            selectionStatus.innerHTML = `<span class="text-yellow-400">⚠️ Selecciona texto en la página o escríbelo.</span>`;
            analyzeButton.disabled = true;
        }
    }

    // Listener para cambios en el área de texto
    analysisText.addEventListener('input', (e) => {
        updateUI(e.target.value.trim());
    });

    // Listener para los botones de personalidad
    personalityButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Deseleccionar todos
            personalityButtons.forEach(btn => {
                btn.classList.remove('ring-2', 'ring-offset-2', 'ring-offset-slate-950');
            });

            // Seleccionar el actual
            selectedPersonality = button.dataset.personality;
            button.classList.add('ring-2', 'ring-offset-2', 'ring-offset-slate-950');
            
            errorMsg.classList.add('hidden');
            resultContainer.classList.add('hidden');
        });
        
        // Inicializar el botón por defecto (FRESA)
        if (button.dataset.personality === selectedPersonality) {
            button.classList.add('ring-2', 'ring-offset-2', 'ring-offset-slate-950');
        }
    });

    // 2. Manejar el clic del botón de análisis
    analyzeButton.addEventListener('click', () => {
        const textToAnalyze = analysisText.value.trim();
        if (!textToAnalyze || !selectedPersonality) {
            // Esto no debería suceder si el botón está deshabilitado correctamente, pero es una protección.
            return;
        }

        // Mostrar estado de carga
        analyzeButton.disabled = true;
        buttonText.textContent = 'Analizando...';
        loadingSpinner.classList.remove('hidden');
        resultContainer.classList.add('hidden');
        errorMsg.classList.add('hidden');
        
        // Enviar mensaje al Service Worker (background.js)
        chrome.runtime.sendMessage({
            action: "runDialecticalAnalysis",
            text: textToAnalyze,
            personality: selectedPersonality
        }, (response) => {
            // Ocultar estado de carga
            analyzeButton.disabled = false;
            buttonText.textContent = 'Iniciar Análisis Dialéctico';
            loadingSpinner.classList.add('hidden');
            
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                errorMsg.textContent = "Error de comunicación: " + chrome.runtime.lastError.message;
                errorMsg.classList.remove('hidden');
                return;
            }

            if (response.error) {
                errorMsg.textContent = "Error en el análisis: " + response.error;
                errorMsg.classList.remove('hidden');
            } else {
                // Mostrar resultado
                resultText.innerHTML = `<strong>${response.persona}:</strong><br>${response.synthesis}`;
                resultContainer.classList.remove('hidden');
            }
        });
    });
});
