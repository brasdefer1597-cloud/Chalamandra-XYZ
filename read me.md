# 🧠 XYZ 369 Dialectic Decoder

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-yellow.svg)
![AI Powered](https://img.shields.io/badge/AI-Hybrid-green.svg)
![Gemini Nano](https://img.shields.io/badge/Gemini-Nano-8e44ad.svg)

**Transform web content into strategic dialectic synthesis using Hybrid AI.**

*Thesis (Chola) → Antithesis (Malandra) → Synthesis (Fresa)*

</div>

---

## 📖 Overview

**XYZ 369 Dialectic Decoder** is a sophisticated Chrome Extension that applies the Hegelian Dialectic method to analyze web content. It leverages a **Hybrid AI Architecture**, prioritizing **Google Gemini Nano** (Chrome's built-in on-device AI) for privacy and zero latency, while seamlessly falling back to **Gemini Cloud API** when local resources are unavailable.

The engine follows the **369 Pattern** to deconstruct information into three distinct cultural personas:

1.  **CHOLA (The Thesis):** Grounded reality, historical context, facts, and "street wisdom".
2.  **MALANDRA (The Antithesis):** Critical analysis, risk detection, skepticism, and disruptive thinking.
3.  **FRESA (The Synthesis):** Strategic integration, aspirational solutions, elegance, and polished execution.

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **⚡ Hybrid AI Engine** | Automatically detects if `Gemini Nano` is available. If not, switches to Cloud API. |
| **🔒 Privacy First** | When using Nano, your data never leaves your device. |
| **🧠 369 Pattern** | Strict prompt engineering ensures a balanced 3-step cognitive process. |
| **📝 Smart Summarizer** | Instantly condenses long articles using specific Markdown formatting. |
| **🎨 Terminal UI** | A clean, hacker-aesthetic interface with real-time processing feedback. |

## 🚀 Installation & Setup

### Prerequisites
- **Google Chrome** (Version 128+ recommended).
- **Developer Mode** enabled in Chrome Extensions.

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/xyz-369-dialectic-decoder.git
cd xyz-369-dialectic-decoder
```

### 2. Enable On-Device AI (Gemini Nano)
To use the local, privacy-focused mode, you must enable specific Chrome flags:

1.  Open `chrome://flags`.
2.  Enable **"Enables optimization guide on device"**: `Enabled BypassPerfRequirement`.
3.  Enable **"Prompt API for Gemini Nano"**: `Enabled`.
4.  Enable **"Summarization API for Gemini Nano"**: `Enabled`.
5.  **Relaunch Chrome**.
6.  *Note: It may take a few minutes for Chrome to download the model component in the background.*

### 3. Load into Chrome
1.  Navigate to `chrome://extensions`.
2.  Toggle **Developer mode** (top right).
3.  Click **Load unpacked**.
4.  Select the root folder of this project.

### 4. (Optional) Cloud Fallback Setup
If you cannot run Gemini Nano, configure the Cloud API:
1.  Right-click the extension icon and select **Options**.
2.  Enter your [Google Gemini API Key](https://aistudio.google.com/app/apikey).
3.  Click **Save**.

## 🎮 Usage

1.  Navigate to any article or webpage you wish to analyze.
2.  Click the **XYZ 369** extension icon.
3.  Observe the **Status Indicator**:
    - `⚡ Nano Ready`: Fully local, private, fast.
    - `☁️ Cloud Ready`: Using API key.
    - `⚠️ Setup Needed`: Configuration required.
4.  Click **Decode (369)** for deep analysis or **Summarize** for a quick overview.

## 🏗️ Architecture

The project follows a clean **Manifest V3** architecture:

```
xyz-369-dialectic-decoder/
├── manifest.json           # Extension configuration
├── backend/
│   ├── background/         # Service Worker & Message Bus
│   └── utils/              # AI Orchestrator (Nano/Cloud Logic)
├── frontend/
│   ├── popup/              # Main UI (HTML/CSS/JS)
│   ├── options/            # API Key Settings
│   └── content.js          # DOM Extraction Script
└── assets/                 # Icons & Resources
```

### The Logic Flow (`apiClient.js`)
1.  **Check Capabilities:** Queries `window.ai` to see if the browser has the model loaded.
2.  **Extraction:** `content.js` scrapes the page text, cleaning noise (ads, navs).
3.  **Orchestration:**
    - If **Nano**: Chains 3 distinct sessions (Thesis -> Antithesis -> Synthesis) using the prompt API.
    - If **Cloud**: Sends a single structured prompt to Gemini Flash/Pro via `@google/genai`.
4.  **Rendering:** Returns Markdown which is parsed locally in the Popup.

## 🛠️ Development

### Stack
- **Core:** Vanilla JavaScript (ES Modules).
- **Styling:** CSS Variables (Terminal Theme).
- **AI SDK:** `@google/genai` (Dynamic Import) + Chrome Built-in AI APIs.

### Adding a New Persona
Modify `backend/utils/apiClient.js`:
```javascript
// Example: Adding a 'GURU' persona
async generateGuru(synthesis) {
    // ... session.prompt(...)
}
```

## 🤝 Contributing

Contributions are welcome! Please adhere to the "Chola-Malandra-Fresa" coding style:
1.  **Chola:** Code must be solid, functional, and grounded (Type checks, Error handling).
2.  **Malandra:** Find clever optimizations and hacks to reduce latency.
3.  **Fresa:** Make the UI look amazing and the code readable.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

*"The truth arises from the conflict of ideas."*

**XYZ 369**

</div>
