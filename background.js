// background.js (Mejora)
// ...
const json = await res.json();
if (!res.ok) throw new Error(json.error?.message || "Error desconocido de la API");

// Nueva validación para asegurar que haya una respuesta utilizable
const responseText = json.candidates?.[0]?.content?.parts?.[0]?.text;
if (!responseText) throw new Error("Respuesta de la API incompleta o bloqueada.");

const parts = responseText.split('|||');
// Asegurar que parts tenga al menos 3 elementos.
if (parts.length < 3) throw new Error("La respuesta de la API no siguió el formato esperado.");

return { 
    thesis: parts[0].trim() || "Err", 
    antithesis: parts[1].trim() || "Err", 
    synthesis: parts[2].trim() || "Err" 
};
// ...

