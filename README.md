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
    %% --- DEFINICIONES DE ESTILO ---
    classDef input fill:#1e293b,stroke:#94a3b8,stroke-width:2px,color:#fff;
    classDef brain fill:#ea580c,stroke:#fff,stroke-width:4px,color:#fff;
    classDef thesis fill:#b91c1c,stroke:#fca5a5,stroke-width:2px,color:#fff;
    classDef anti fill:#1d4ed8,stroke:#93c5fd,stroke-width:2px,color:#fff;
    classDef synth fill:#7e22ce,stroke:#d8b4fe,stroke-width:2px,color:#fff;
    classDef infra fill:#0f766e,stroke:#2dd4bf,stroke-width:2px,color:#fff;
    classDef result fill:#0f172a,stroke:#8b5cf6,stroke-width:2px,color:#a78bfa;

    %% --- NODOS ---
    User("👤 User Context (Input)"):::input

    subgraph CoreSystem ["🧠 Chalamandra Extension"]
        direction TB
        Orchestrator{{"⚙️ Dialectical Orchestrator"}}:::brain
        
        subgraph Personalities ["Quantum Personality Matrix"]
            direction LR
            C("🔥 CHOLA (Thesis)"):::thesis
            M("🌪️ MALANDRA (Antithesis)"):::anti
            F("🍓 FRESA (Synthesis)"):::synth
        end
        
        Proxy("🚦 Resilient Proxy (Logic)"):::input
    end

    subgraph AIInfra ["⚡ Hybrid AI Engine"]
        Nano("⚡ Gemini Nano (Local)"):::infra
        Cloud("☁️ Google Cloud API"):::infra
    end

    Output("✨ Actionable Insight"):::result

    %% --- CONEXIONES ---
    User ==> Orchestrator
    Orchestrator --> C
    Orchestrator --> M
    Orchestrator --> F
    
    C --> Proxy
    M --> Proxy
    F --> Proxy
    
    Proxy -.-> Nano
    Proxy -.-> Cloud
    
    Nano --> Output
    Cloud --> Output
    Output ==> User

