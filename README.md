# 🦎 Chalamandra QuantumMind XYZ

**The Chrome extension that embeds the power of Dialectical AI into your browser.**

> **Chalamandra QuantumMind XYZ** is not just a tool; it is a cognitive partner that enhances human clarity through a structured dialectical process. It connects the **Wisdom of the Past (Thesis)**, the **Disruption of the Future (Antithesis)**, and the **Optimization of the Now (Synthesis)**.

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![Version](https://img.shields.io/badge/version-1.0.0--beta-green) ![Architecture](https://img.shields.io/badge/Architecture-Hybrid_Local_%2B_Cloud-blueviolet) ![AI Engine](https://img.shields.io/badge/AI-Gemini_Nano_%2F_Flash-orange)

---

## 🚀 Key Features

Our extension utilizes a **Hybrid Multimodal** architecture, fusing the privacy and speed of on-device AI with the extensive power of the cloud.

| Feature | Description | Core Technology |
| :--- | :--- | :--- |
| **Contextual Analysis** | Direct injection into the DOM to read selected text and analyze semantic context. | `content_scripts.js` |
| **Triple Personality** | Three distinct AI personas (CHOLA, MALANDRA, FRESA) debate simultaneously to provide a 360° perspective. | `DialecticalOrchestrator.js` |
| **Resilient Proxy** | An intelligent router that attempts **Local Processing (Nano)** first, and falls back to **Cloud API** only if necessary. | `background.js` |
| **Local-First (Privacy)** | Instant, private, and *offline* analysis capability via Chrome's built-in AI. | `window.ai` / Gemini Nano |

## 🧠 The Personality Matrix

The core of Chalamandra is its dialectical system. Each personality represents a critical node in the reasoning process:

1.  😈 **CHOLA (Thesis - The Core of Wisdom):**
    *   *Role:* Provides foundational knowledge, historical patterns, and street smarts.
    *   *Focus:* "What has worked before? Respect the history and the fundamentals."

2.  🌪️ **MALANDRA (Antithesis - The Engine of Disruption):**
    *   *Role:* Challenges assumptions, identifies security risks, and proposes chaotic alternatives.
    *   *Focus:* "Where are the hidden flaws? Let's break this to see what it's made of."

3.  🍓 **FRESA (Synthesis - The Optimal Orchestrator):**
    *   *Role:* Merges elements from CHOLA and MALANDRA to refine the message into a polished, actionable output.
    *   *Focus:* "What is the clearest, most aesthetic, and high-impact path forward? Let's optimize."

## 🏛️ System Architecture

This architecture illustrates the **Resilient Hybrid Flow**. The system prioritizes local processing via **Gemini Nano** for maximum privacy and zero latency, automatically falling back to the **Google Gemini API** (Cloud) only when complex reasoning exceeds local capabilities.

The discrete brain (`background.js`) orchestrates this entire process without exposing keys or logic to the client-side DOM.
graph TD
    %% --- Nodos ---
    A["👤 User Context"]
    B("⚙️ Dialectical Orchestrator")
    
    %% --- Matriz ---
    C("🔥 CHOLA (Thesis)")
    D("🌪️ MALANDRA (Antithesis)")
    E("🍓 FRESA (Synthesis)")
    
    F{"🚦 Resilient Proxy"}
    
    %% --- Motores ---
    G("⚡ Gemini Nano (Local)")
    H("☁️ Google Gemini API")
    
    I["✨ Quantum Synthesis"]

    %% --- Conexiones ---
    A -->|Input| B
    B --> C
    B --> D
    B --> E
    
    C --> F
    D --> F
    E --> F
    
    F -.->|Primary| G
    F -.->|Fallback| H
    
    G --> I
    H --> I
    I -->|Actionable Output| A

    %% --- Estilos (Simplificados) ---
    style A fill:#1e293b,stroke:#fff,color:#fff
    style B fill:#f97316,stroke:#fff,stroke-width:2px,color:#fff
    style C fill:#b91c1c,stroke:none,color:#fff
    style D fill:#1d4ed8,stroke:none,color:#fff
    style E fill:#7e22ce,stroke:none,color:#fff
    style F fill:#0f766e,stroke:#fff,color:#fff
    style G fill:#15803d,stroke:#fff,color:#fff
    style H fill:#0369a1,stroke:#fff,color:#fff
    style I fill:#0f172a,stroke:#8b5cf6,stroke-width:2px,color:#a78bfa
