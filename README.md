# Jonathan Politzki - Personal Website (2026)

## Overview
A "Living Archive" that serves as a digital extension of my mind. It is designed to be minimal in aesthetic but maximal in functionality, acting as a hub for my writing, work, and philosophy.

## Tech Stack
*   **Framework:** Next.js 15 (App Router)
*   **Styling:** Tailwind CSS
*   **Animation:** Framer Motion
*   **Typeface:** Geist Sans/Mono, Ruslan Display, Courier Prime, Italianno, Homemade Apple

## Architecture

### 1. Home (`/`)
*   **Concept:** Atmospheric Entry.
*   **Visuals:** Reactive "Storm" visualization (Framer Motion) + Courier Prime text.
*   **Navigation:** "Palantir-style" side drawer.

### 2. Credo (`/credo`)
*   **Purpose:** The "Why". My guiding axioms and philosophy.
*   **Features:**
    *   **Irreverence:** Defined as "authentic independence" rather than disrespect.
    *   **Quotes:** Foundational quotes from Nietzsche and Goethe with a translation toggle.
    *   **Visualizations:**
        *   **Creative Destruction:** A geometric animation showing a triangle decomposing and reforming into a crystal structure.
        *   **Unlikely Truth:** A large fractal cloud representing "known distribution" with a vector pointing to an "unknown" outlier.

### 3. Writing Engine (`/writing`)
A universe of sub-pages for exploring my corpus.
*   **Overview:** Directory of the writing tools.
*   **Library (`/writing/read`):** The reading interface with all 54+ migrated Substack essays.
*   **The Graph (`/writing/graph`):** High-dimensionality clustering visualization using seeded random coordinates (mock embedding).
*   **Dashboard (`/writing/dashboard`):** Meta-analysis of themes.
*   **Chat (`/writing/chat`):** A conversational interface to query the corpus.
*   **Laboratory (`/writing/compare`):** Experimental comparative analysis tools.

### 4. Interests (`/interests`)
*   **Concept:** A deep dive into technical and academic curiosities.
*   **Features:** A "Simple | Technical" toggle that completely rewrites the page content.
*   **Topics:** Context & Memory, Latent Representations, and the shift from Narrow ML to Generalized Intelligence.

### 5. Work (`/work`)
*   **Focus:** Irreverent Capital & Jean Memory.
*   **Style:** Professional overview of ventures.

### 6. Connect (`/connect`)
*   **Hub:** Centralized links for Email, Twitter, LinkedIn, GitHub.

## Recent Updates (Jan 2026)
*   **Substack Migration:** Successfully migrated ~50 essays from HTML export to local MDX content.
*   **Visual Overhaul:** Switched to a strict Black/White/Grey palette with "Wireframe/Engineer" aesthetics.
*   **New Visualizations:** Implemented custom Canvas-based generative art for the Credo page.
*   **Interests Page:** Built a dual-mode (Layman/Technical) explanation of research interests.

## Future Experiments (To Build)
*   **Real Embeddings:** Replace mock graph coordinates with actual vector embeddings (OpenAI/Cohere).
*   **RAG Integration:** Connect the Chat interface to a real vector database for Q&A.
*   **Graph Implementation:** Upgrade to d3/Three.js for large-scale node visualization.
