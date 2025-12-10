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

3.  🍓 **FRESA (Synthesis - The Optimal Orc

graph TD
    %% --- DEFINICIÓN DE ESTILOS (The Cool Stuff) ---
    classDef input fill:#1e293b,stroke:#94a3b8,stroke-width:2px,color:#fff,stroke-dasharray: 5 5;
    classDef brain fill:#f97316,stroke:#fff,stroke-width:4px,color:#fff,font-weight:bold;
    classDef thesis fill:#b91c1c,stroke:#fca5a5,stroke-width:2px,color:#fff;
    classDef anti fill:#1d4ed8,stroke:#93c5fd,stroke-width:2px,color:#fff;
    classDef synth fill:#7e22ce,stroke:#d8b4fe,stroke-width:2px,color:#fff;
    classDef local fill:#15803d,stroke:#4ade80,stroke-width:2px,color:#fff,shape:hexagon;
    classDef cloud fill:#0369a1,stroke:#38bdf8,stroke-width:2px,color:#fff,shape:hexagon;
    classDef result fill:#0f172a,stroke:#8b5cf6,stroke-width:3px,color:#a78bfa,stroke-dasharray: 0;

    %% --- NODOS DEL SISTEMA ---
    
    User("👤 User Context (DOM Selection)"):::input
    
    subgraph Extension Core [ "🧠 Chalamandra Extension" ]
        direction TB
        Orchestrator{{"⚙️ Dialectical Orchestrator"}}:::brain
        
        subgraph Matrix [ "Quantum Personality Field" ]
            direction LR
            C("🔥 CHOLA<br/>(Thesis)"):::thesis
            M("🌪️ MALANDRA<br/>(Antithesis)"):::anti
            F("🍓 FRESA<br/>(Synthesis)"):::synth
        end
        
        Proxy("🚦 Resilient Proxy<br/>(Decision Logic)"):::input
    end

    subgraph Engines [ "⚡ Hybrid AI Engine" ]
        Nano("⚡ Gemini Nano<br/>(Offline/Local)"):::local
        API("☁️ Google Gemini API<br/>(Cloud Direct)"):::cloud
    end

    Output("✨ Quantum Synthesis<br/>(Actionable Insight)"):::result

    %% --- CONEXIONES ---
    User ==> Orchestrator
    Orchestrator --> C & M & F
    
    C --> Proxy
    M --> Proxy
    F --> Proxy
    
    Proxy -- "Primary Path (Fast/Priv)" --> Nano
    Proxy -- "Fallback Path (Complex)" --> API
    
    Nano -.-> Output
    API -.-> Output
    Output ==> User
