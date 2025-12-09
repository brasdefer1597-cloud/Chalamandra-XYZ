🦎 Chalamandra QuantumMind XYZThe Chrome extension that brings the power of Dialectical AI to your browser.Chalamandra QuantumMind XYZ isn't just a tool; it's a thinking partner that enhances human clarity through structured processes of thesis, antithesis, and synthesis.🚀 Key FeaturesOur extension integrates a hybrid multimodal approach, combining the speed of local AI with the power of the cloud.FeatureDescriptionBase TechnologyContextual AnalysisDirect injection into the web page to read selected text and analyze the context.content_scripts.jsTriple PersonalityThree distinct AI voices (CHOLA, MALANDRA, FRESA) debate simultaneously to offer a 360° view.DialecticalOrchestrator.jsQuantum CollapseInternal process that resolves the tension between thesis and antithesis to produce an actionable and aligned synthesis.QuantumCollapse.jsLocal-First (Privacy)Instant, private, and offline analysis powered by Gemini Nano.background.js / Gemini Nano🧠 The Personality MatrixThe heart of Chalamandra is its dialectical system, where each personality brings a unique perspective:CHOLA (Thesis - The Core of Wisdom): Provides foundational knowledge, patterns, and history. What has worked before?MALANDRA (Antithesis - The Engine of Disruption): Challenges assumptions, identifies risks, and proposes chaotic alternatives. What are the hidden flaws?FRESA (Synthesis - The Optimal Orchestrator): Combines elements from CHOLA and MALANDRA to refine the message and make it immediately actionable. What is the clearest and most impactful path?🏛️ Professional Architecture Diagram (Mermaid)This architecture defines how the discrete brain (background.js) manages the information flow, utilizing both local AI (Gemini Nano) and the cloud (Vercel).graph TD
    A["Popup/Content Script (User Input)"] --> B(background.js - Dialectical Orchestrator);
    
    subgraph Quantum Superposition (Parallel AI Processing)
        B --> C1(CHOLA: Thesis);
        B --> C2(MALANDRA: Antithesis);
        B --> C3(FRESA: Synthesis);
    end
    
    subgraph Resilient API Proxy (Local-First Fallback)
        C1 --> D1["Gemini Nano (Local/Offline)"];
        C2 --> D1;
        C3 --> D1;
        
        C1 --> D2{"Vercel Serverless (Cloud API)"};
        C2 --> D2;
        C3 --> D2;
    end
    
    D1 --> E(QuantumCollapse.js);
    D2 --> E;

    E --> F["Synthesized Result (Actionable Output)"];
    F --> A;
    
    style B fill:#f93,stroke:#333,stroke-width:2px,color:#fff
    style E fill:#90f,stroke:#333,stroke-width:2px,color:#fff
    style D1 fill:#228B22,stroke:#333,stroke-width:1px,color:#fff
    style D2 fill:#0077b6,stroke:#333,stroke-width:1px,color:#fff
Technical ComponentsFileRoleDescriptionmanifest.jsonConfigurationDefines the V3 structure, permissions (storage, scripting), and icons.background.jsBrain (Service Worker)Houses the DialecticalOrchestrator and QuantumCollapse. Manages network logic via ResilientAPIProxy.content_scripts.jsEyes and HandsInjects into all pages to read selected text from the DOM.popup.html / .jsControls (UI)The simple user interface for selecting personalities and initiating the analysis./assetsStatic ResourcesContains all icons and the primary logo.LICENSE.mdLegalSpecifies the MIT License for open-source use.🛠️ Installation (Developer Mode)To load the extension in your Chrome browser:Clone the Repository:git clone [https://github.com/your_username/chalamandra-quantum-mind-xyz.git](https://github.com/your_username/chalamandra-quantum-mind-xyz.git)


Open Chrome: Navigate to chrome://extensions.Enable Developer Mode: Turn on the toggle in the upper right corner.Load Unpacked: Click the "Load unpacked" button.Select Folder: Choose the chalamandra-quantum-mind-xyz/ directory you just cloned.The Chalamandra extension will appear in your toolbar.Made with 🔥 at the heart of disruption.
