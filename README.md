# HR Workflow Designer

A production-ready, browser-based visual tool engineered to allow human resources teams and administrators to map out, configure, and simulate complex employment lifecycles (like Employee Onboarding, Offboarding, and Hardware Requests) via an intuitive drag-and-drop interface. 

By taking an otherwise abstracted task (defining business logic) and moving it to a visual Directed Acyclic Graph (DAG), the application significantly lowers the technical barrier for HR staff to design systems while maintaining strict underlying logic that developers can parse and execute.

## Key Features

- **Visual Node Placement:** Drag-and-drop library (or click-to-add fallback mechanism for tight environments) implementing Start, Request, Approval, Automated Action, and End states.
- **Live Form Binding:** Interacting with a node summons a specialized side-panel form. Edits automatically sync to node properties and visuals.
- **Real-Time Strict Graph Validation:** A BFS algorithm constantly combs the graph during any user mutation to check for disconnected components, illegal edges (e.g. End Node attempting to fire a task), or duplicated Start sequences.
- **Topological Simulation:** Generates synthetic backend latency via Kahn's Topological Sort algorithm to step through the flowchart and validate the execution path, displaying animated logs representing success/failure.
- **JSON Import / Export:** Download your workflow configuration to disk as a JSON file and upload it instantly later.

## Tech Stack

- **Framework:** React 18, utilizing Vite for fast, robust bundling.
- **Language:** TypeScript 5, ensuring robust type safety for all internal definitions.
- **Core Library:** `@xyflow/react` (React Flow v12) for orchestrating the canvas math, edge routing, and node interactions.
- **State Management:** `Zustand`. Extremely lightweight, hook-based, immutable state transitions bypassing traditional prop drilling.
- **Styling:** Tailwind CSS v3 with a dynamic dark-mode palette and `lucide-react` for iconography.

## Getting Started

1. **Install dependencies:**
   Ensure you have Node.js installed, then run:
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open the browser:**
   Navigate to the URL mapped in your terminal (usually `http://localhost:5173` or `http://localhost:5175`).

## Usage Guide

1. Drag nodes from the left-hand **Node Library** into the center canvas, or simply **click** the node in the sidebar to have it spawn exactly in the middle of your screen.
2. Ensure every workflow has exactly **one** `Start Event` and at least **one** `End Event`.
3. Select any node you drop to reveal the dynamic **Configuration Panel** on the right side of your screen. Fill out assignments, thresholds, and parameters there.
4. Draw connection wires between the colored connection anchors. 
5. Ensure the indicator in the top right states **Valid Graph**.
6. Click **Run Workflow** to see the system compile the pathing tree and run a fully animated execution simulation!

## Folder Structure

- `/src/components/nodes/`: Custom, reactive SVG node components displaying data live.
- `/src/components/forms/`: Dynamic input parameters mapped directly to Zustand bindings.
- `/src/hooks/`: Houses the foundational stores (`useWorkflowStore`) and sub-services (`useSimulation`).
- `/src/api/`: Replaces genuine HTTP requests to remote databases with localized Promise arrays simulating server response lag and sorting topologies.
