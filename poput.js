// popup.js file - Panel Control Logic

document.addEventListener('DOMContentLoaded', () => {
    // --- UI Elements ---
    const analysisText = document.getElementById('analysis-text');
    const analyzeButton = document.getElementById('analyze-button');
    const personalityButtons = document.querySelectorAll('.personality-btn');
    const selectionStatus = document.getElementById('selection-status');
    const resultContainer = document.getElementById('result-container');
    const resultText = document.getElementById('result-text');
    const errorMsg = document.getElementById('error-message');
    const buttonText = document.getElementById('button-text');
    const loadingSpinner = document.getElementById('loading-spinner');

    let selectedPersonality = 'FRESA'; // Fresa is the default synthesis

    // Function to show/hide loading state
    function setLoading(isLoading) {
        analyzeButton.disabled = isLoading;
        if (isLoading) {
            buttonText.textContent = 'Analyzing...';
            loadingSpinner.classList.remove('hidden');
            resultContainer.classList.add('hidden');
            errorMsg.classList.add('hidden');
        } else {
            buttonText.textContent = 'Start Dialectical Analysis';
            loadingSpinner.classList.add('hidden');
        }
    }

    // Function to update the UI status based on text length
    function updateUI(text) {
        if (text.length >= 20) { // Matches minimum length check in background.js
            selectionStatus.innerHTML = `<span class="text-green-400">✅ Text of ${text.length} characters loaded.</span>`;
            analyzeButton.disabled = false;
        } else {
            selectionStatus.innerHTML = `<span class="text-yellow-400">⚠️ Select text (min 20 chars) or type it in.</span>`;
            analyzeButton.disabled = true;
        }
    }

    // 1. Load selected text (from content_scripts.js)
    chrome.storage.local.get(['selectedText'], (data) => {
        const text = data.selectedText || '';
        analysisText.value = text;
        updateUI(text);

        // Clear after use to prevent stale data
        if (text) {
            chrome.storage.local.remove('selectedText');
        }
    });

    // Listener for text area changes
    analysisText.addEventListener('input', (e) => {
        updateUI(e.target.value.trim());
    });

    // Listener for personality buttons (Style management)
    personalityButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Deselect all
            personalityButtons.forEach(btn => {
                btn.classList.remove('ring-2', 'ring-offset-2', 'ring-offset-slate-950');
            });

            // Select the current one
            selectedPersonality = button.dataset.personality;
            button.classList.add('ring-2', 'ring-offset-2', 'ring-offset-slate-950');
            
            errorMsg.classList.add('hidden');
            resultContainer.classList.add('hidden');
        });
        
        // Initialize the default button (FRESA) style
        if (button.dataset.personality === selectedPersonality) {
            button.classList.add('ring-2', 'ring-offset-2', 'ring-offset-slate-950');
        }
    });

    // 2. Handle the analyze button click
    analyzeButton.addEventListener('click', () => {
        const textToAnalyze = analysisText.value.trim();
        if (!textToAnalyze || !selectedPersonality) {
            return;
        }

        setLoading(true);
        
        // Send message to the Service Worker (background.js)
        chrome.runtime.sendMessage({
            action: "runDialecticalAnalysis",
            text: textToAnalyze,
            personality: selectedPersonality
        }, (response) => {
            setLoading(false);
            
            // Handle communication errors (e.g., service worker terminated)
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                errorMsg.textContent = "Communication Error: Could not reach the background service worker.";
                errorMsg.classList.remove('hidden');
                return;
            }

            // Handle functional errors returned by the orchestrator
            if (response.error) {
                // Display the error message returned from the background script
                errorMsg.textContent = `Analysis Error (${response.persona}): ${response.synthesis}`;
                errorMsg.classList.remove('hidden');
            } else {
                // Display successful result
                resultText.innerHTML = `<strong>${response.persona} - ${response.role}:</strong><br>${response.synthesis}`;
                resultContainer.classList.remove('hidden');
            }
        });
    });
});
