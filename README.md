<div align="center">

# 🌊 HR Workflow Designer

**A production-ready, interactive Directed Acyclic Graph (DAG) builder for Human Resources.**

[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React Flow](https://img.shields.io/badge/react--flow-%23FF0072.svg?style=for-the-badge&logo=react&logoColor=white)](https://reactflow.dev/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

<br />

> **The Problem:** Designing business logic, like Employee Onboarding or Hardware Requests, is traditionally abstracted into code and separated from the people actually running the HR lifecycle.
> 
> **The Solution:** A browser-based visual tool that significantly lowers the technical barrier for HR staff. Build strict execution paths using drag-and-drop mechanics while maintaining robust underlying validation that developers can parse seamlessly.

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| **🕹️ Visual Node Placement** | A drag-and-drop (and click-to-add) library supporting distinct stages like Start, Request, Approval, Automated Action, and End contexts. |
| **⚡ Live Form Binding** | Selecting a node instantly summons a specialized side-panel form. Every keystroke syncs deeply with the node's internal state bounding. |
| **🛡️ Real-Time Graph Validation** | A specialized BFS algorithm combs the execution tree upon any change ensuring no disconnected islands, isolated events, or illegal node relationships exist. |
| **🌐 Topological Simulation** | Generating synthetic latency and execution logs using Kahn's Topological Sort to validate the entire operational sequence visually. |
| **💾 Local JSON Storage** | Export your active workflows to local JSON architectures, or pull previous mapping operations into the canvas seamlessly. |

---

## 🏗️ Architecture & Tech Stack

Our stack prioritizes a highly reactive front-end with completely deterministic state flow:

* **Framework:** **React 18** paired with the phenomenal speed of **Vite** for optimized HMR.
* **Language:** **TypeScript 5**, clamping down on execution boundaries and data validation interfaces.
* **Core Engine:** `@xyflow/react` v12 governs the canvas math, spatial routing, and view boundaries.
* **State Management:** `Zustand` provides an incredibly lightweight, immutable state tree, bypassing massive React Context rendering waves.
* **Styling Ecosystem:** **Tailwind CSS v3** manages an immersive, bespoke dark-mode palette, utilizing `lucide-react` for beautifully clean iconography.

---

## 🚀 Getting Started

To get the workflow designer running locally on your machine, follow these steps:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed previously.

### Installation

1. **Clone the repository** (if applicable) and navigate to the root directory.
2. **Install all dependencies:**
   ```bash
   npm install
   ```
3. **Boot the Vite Development Server:**
   ```bash
   npm run dev
   ```
4. **Open your local environment:**
   Navigate in your browser to the URL printed in the terminal (commonly `http://localhost:5173` or `http://localhost:5175`).

---

## 📖 Usage Guide

<details>
<summary><strong>Click here to view detailed usage instructions</strong></summary>

1. **Populate the Canvas:** Grab any module from the left-hand **Node Library** and pull it into the dark grid. Alternatively, just **click** an item in the sidebar to spawn it dynamically at the center of the viewport.
2. **Setup Boundaries:** A healthy execution tree must contain *exactly one* `Start Event` and *at least one* terminal `End Event`.
3. **Configure Modules:** Choose any floating block to slide open the **Configuration Panel**. Define roles, parameters, and action IDs there.
4. **Wire It Up:** Connect the node anchors using cables to define the sequential logic flow.
5. **Verify Context:** Keep an eye firmly on the top-right toolbar. An ongoing script validates your structure dynamically!
6. **Deploy / Simulate:** Click the bright **Run Workflow** switch to watch the topological system calculate, sequence, and execute your model.

</details>

---

## 📁 Repository Structure

```text
/src
 ├── /api           # Mock synthetic backend fetching pipelines & algorithms 
 ├── /components
 │    ├── /forms    # Zustand-bound form slices 
 │    └── /nodes    # The custom React Flow SVG/DOM module wrappers
 ├── /hooks         # Global `useWorkflowStore` engine
 ├── /types         # Strict TypeScript definitions for Node operations
 └── /utils         # JSON parsers and BFS validation utilities
```

<br />

<div align="center">
  <p>Built with ❤️ utilizing the <a href="https://reactflow.dev/" target="_blank">React Flow Library</a>.</p>
</div>
