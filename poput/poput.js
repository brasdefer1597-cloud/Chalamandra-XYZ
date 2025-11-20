const UI = {
    btnAnalyze: document.getElementById('btn-analyze'),
    btnSummarize: document.getElementById('btn-summarize'),
    statusPill: document.getElementById('status-pill'),
    loader: document.getElementById('loader'),
    results: document.getElementById('results'),
    summaryResult: document.getElementById('summary-result'),
    error: document.getElementById('error-msg'),
    metaWords: document.getElementById('meta-words'),
    metaStrategy: document.getElementById('meta-strategy'),
    outputs: {
        chola: document.getElementById('out-chola'),
        malandra: document.getElementById('out-malandra'),
        fresa: document.getElementById('out-fresa'),
        summary: document.getElementById('out-summary')
    }
};

// Simple Markdown Parser to avoid external deps
const formatMD = (text) => {
    if (!text) return '';
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\*(.*?)\*/g, '<em>$1</em>')             // Italic
        .replace(/^- (.*)$/gm, '<li>$1</li>')             // List items
        .replace(/\n/g, '<br>');                          // Line breaks
};

const setStatus = (status) => {
    UI.statusPill.className = 'status-pill';
    if (status === 'NANO_READY') {
        UI.statusPill.textContent = '⚡ Nano Ready';
        UI.statusPill.classList.add('status-ready');
    } else if (status === 'CLOUD_READY') {
        UI.statusPill.textContent = '☁️ Cloud Ready';
        UI.statusPill.classList.add('status-ready');
    } else {
        UI.statusPill.textContent = '⚠️ Setup Needed';
        UI.statusPill.classList.add('status-warn');
        UI.statusPill.style.cursor = 'pointer';
        UI.statusPill.onclick = () => chrome.runtime.openOptionsPage();
        // Keep buttons enabled but they might trigger auth flow/error
    }
};

const init = async () => {
    try {
        const res = await chrome.runtime.sendMessage({ action: 'getApiStatus' });
        if (res && res.success) setStatus(res.data.status);
    } catch (e) {
        console.error("Init error", e);
    }
};

const runAnalysis = async () => {
    resetUI();
    UI.loader.classList.remove('hidden');
    
    try {
        // 1. Get Metadata for UI
        const meta = await chrome.runtime.sendMessage({ action: 'getPageMetadata' });
        if (meta.success) {
            UI.metaWords.textContent = meta.data.wordCount;
            UI.metaStrategy.textContent = UI.statusPill.textContent.includes('Nano') ? 'On-Device (Privacy)' : 'Cloud (Power)';
        }

        // 2. Run Analysis
        const res = await chrome.runtime.sendMessage({ action: 'analyzePage' });
        
        UI.loader.classList.add('hidden');
        if (res.success) {
            UI.outputs.chola.innerHTML = formatMD(res.data.chola);
            UI.outputs.malandra.innerHTML = formatMD(res.data.malandra);
            UI.outputs.fresa.innerHTML = formatMD(res.data.fresa);
            UI.results.classList.remove('hidden');
        } else {
            throw new Error(res.error || "Unknown error during analysis");
        }
    } catch (e) {
        UI.loader.classList.add('hidden');
        UI.error.textContent = e.message || "Could not analyze. Refresh the page and try again.";
        UI.error.classList.remove('hidden');
    }
};

const runSummarize = async () => {
    resetUI();
    UI.loader.classList.remove('hidden');
    UI.metaStrategy.textContent = "Summarization";
    
    try {
        const res = await chrome.runtime.sendMessage({ action: 'summarizePage' });
        UI.loader.classList.add('hidden');
        if (res.success) {
            UI.outputs.summary.innerHTML = formatMD(res.data);
            UI.summaryResult.classList.remove('hidden');
        } else {
            throw new Error(res.error || "Unknown error during summarization");
        }
    } catch (e) {
        UI.loader.classList.add('hidden');
        UI.error.textContent = e.message || "Could not summarize. Refresh the page and try again.";
        UI.error.classList.remove('hidden');
    }
};

const resetUI = () => {
    UI.results.classList.add('hidden');
    UI.summaryResult.classList.add('hidden');
    UI.error.classList.add('hidden');
};

UI.btnAnalyze.addEventListener('click', runAnalysis);
UI.btnSummarize.addEventListener('click', runSummarize);

init();
