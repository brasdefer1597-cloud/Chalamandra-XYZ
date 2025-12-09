// Archivo content_scripts.js - Los Ojos y las Manos

// Escucha mensajes del Service Worker (background.js)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Si el Service Worker envía un mensaje con texto seleccionado
    if (request.action === "contextMenuTextSelected" && request.text) {
        // Almacena el texto seleccionado para que el popup lo pueda recuperar
        chrome.storage.local.set({ selectedText: request.text }, () => {
            console.log("Texto seleccionado almacenado para el popup.");
        });
    }
});

// Función para obtener texto seleccionado del DOM
function getSelectedText() {
    return window.getSelection().toString().trim();
}

// Agrega un listener para el evento 'mouseup' para detectar la selección
document.addEventListener('mouseup', () => {
    const selectedText = getSelectedText();
    if (selectedText) {
        // Almacena el texto en el almacenamiento local para que el popup lo acceda cuando se abra
        chrome.storage.local.set({ selectedText: selectedText }, () => {
            // No hay necesidad de enviar un mensaje al background aquí, el popup lo leerá al abrirse.
        });
    }
});
