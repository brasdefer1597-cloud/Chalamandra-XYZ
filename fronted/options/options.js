const saveBtn = document.getElementById('save');
const input = document.getElementById('apiKey');
const status = document.getElementById('status');

chrome.storage.sync.get('apiKey', (data) => {
    if(data.apiKey) input.value = data.apiKey;
});

saveBtn.onclick = () => {
    const key = input.value.trim();
    if(!key) return;
    
    chrome.storage.sync.set({ apiKey: key }, () => {
        status.classList.remove('hidden');
        setTimeout(() => status.classList.add('hidden'), 2000);
    });
};
