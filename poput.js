// popup.js
document.addEventListener('DOMContentLoaded', () => {

    // --- UI References ---
    const analysisText = document.getElementById('analysis-text');
    const analyzeButton = document.getElementById('analyze-button');
    const personalityButtons = document.querySelectorAll('.personality-btn');
    const selectionStatus = document.getElementById('selection-status');
    const resultContainer = document.getElementById('result-container');
    const resultText = document.getElementById('result-text');
    const errorMsg = document.getElementById('error-message');
    const buttonText = document.getElementById('button-text');
    const loadingSpinner = document.getElementById('loading-spinner');
    const apiKeyInput = document.getElementById('api-key-input');

    let selectedPersonality = null;

    // --- 1. Initialization & Storage ---

    // Load API Key
    chrome.storage.sync.get(['geminiApiKey'], (result) => {
        if (result.geminiApiKey) {
            apiKeyInput.value = result.geminiApiKey;
        }
    });

    // Save API Key on input
    apiKeyInput.addEventListener('input', (e) => {
        const key = e.target.value.trim();
        chrome.storage.sync.set({ geminiApiKey: key });
    });

    // Check for selected text from storage (saved by content_scripts or background)
    chrome.storage.local.get(['selectedText'], (data) => {
        const text = data.selectedText || '';
        if (text) {
            analysisText.value = text;
            updateReadyState();
            // Clear badge
            chrome.action.setBadgeText({ text: "" });
            // Clear storage to prevent stale data
            chrome.storage.local.remove('selectedText');
        }
    });

    // --- 2. Event Listeners ---

    analysisText.addEventListener('input', updateReadyState);

    personalityButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Visual Toggle
            personalityButtons.forEach(btn => {
                btn.classList.remove('ring-2', 'ring-white', 'bg-slate-700');
                btn.classList.add('opacity-60');
            });
            button.classList.add('ring-2', 'ring-white', 'bg-slate-700');
            button.classList.remove('opacity-60');

            selectedPersonality = button.dataset.personality;
            updateReadyState();
            
            // Hide previous results
            resultContainer.classList.add('hidden');
            errorMsg.classList.add('hidden');
        });
    });

    // --- 3. Core Logic ---

    function updateReadyState() {
        const hasText = analysisText.value.trim().length > 5;
        const hasPersona = !!selectedPersonality;

        if (hasText) {
            selectionStatus.innerHTML = `<span class="text-green-400">✅ Input ready (${analysisText.value.length} chars)</span>`;
        } else {
            selectionStatus.innerHTML = `<span class="text-slate-500">Waiting for text input...</span>`;
        }

        if (hasText && hasPersona) {
            analyzeButton.disabled = false;
        } else {
            analyzeButton.disabled = true;
        }
    }

    analyzeButton.addEventListener('click', () => {
        const textToAnalyze = analysisText.value.trim();
        
        if (!textToAnalyze || !selectedPersonality) return;

        // UI Loading
        setLoading(true);
        resultContainer.classList.add('hidden');
        errorMsg.classList.add('hidden');

        // Send to Background
        chrome.runtime.sendMessage({
            action: "runDialecticalAnalysis",
            text: textToAnalyze,
            personality: selectedPersonality
        }, (response) => {
            setLoading(false);

            if (chrome.runtime.lastError) {
                showError("Communication Error: " + chrome.runtime.lastError.message);
                return;
            }

            if (response.error) {
                showError(`Analysis Failed: ${response.synthesis}`);
            } else {
                // Render Success
                const sourceBadge = response.source.includes("Nano") 
                    ? `<span class="text-[10px] bg-green-900 text-green-300 px-1.5 py-0.5 rounded ml-2 border border-green-700 tracking-wider font-mono">${response.source}</span>`
                    : `<span class="text-[10px] bg-blue-900 text-blue-300 px-1.5 py-0.5 rounded ml-2 border border-blue-700 tracking-wider font-mono">${response.source}</span>`;

                resultText.innerHTML = `
                    <div class="flex justify-between items-center border-b border-slate-700 pb-2 mb-3">
                        <span class="font-bold text-orange-400">${response.role}</span>
                        ${sourceBadge}
                    </div>
                    <div class="prose prose-invert prose-sm max-w-none">
                        ${response.synthesis}
                    </div>
                `;
                resultContainer.classList.remove('hidden');
            }
        });
    });

    function setLoading(isLoading) {
        if (isLoading) {
            buttonText.textContent = 'Collapsing Quantum Waves...';
            loadingSpinner.classList.remove('hidden');
            analyzeButton.disabled = true;
        } else {
            buttonText.textContent = 'Start Dialectical Analysis';
            loadingSpinner.classList.add('hidden');
            analyzeButton.disabled = false;
        }
    }

    function showError(msg) {
        errorMsg.textContent = msg;
        errorMsg.classList.remove('hidden');
    }
});
