<div align="center">

  <img src="https://capsule-render.vercel.app/api?type=waving&color=0f172a&height=300&section=header&text=Profiley&fontSize=90&animation=fadeIn&fontAlignYW=50&desc=The%20Architect%20of%20Professional%20Identity&descAlign=50&descAlignY=51&fontColor=38bdf8" alt="Profiley Banner" width="100%" />

  <br />

  <a href="https://react.dev/">
    <img src="https://img.shields.io/badge/CORE-REACT_19-61dafb?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  </a>
  <a href="https://tailwindcss.com/">
    <img src="https://img.shields.io/badge/Pf-TAILWIND_CSS-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  </a>
  <a href="https://vitejs.dev/">
    <img src="https://img.shields.io/badge/SPEED-VITE-646cff?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  </a>
  <a href="https://firebase.google.com/">
    <img src="https://img.shields.io/badge/CLOUD-FIREBASE-ffca28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/STATUS-mvp_complete-00e676?style=for-the-badge" alt="Status" />
  </a>

</div>

<br />
<br />

# KX · INTRODUCTION

> **Profiley** is not just a resume builder; it is a **reactive design engine** for professional documentation. 

Built on the bleeding edge of the React ecosystem, Profiley transforms JSON data into print-ready, typographically stunning A4 documents in real-time. It bridges the gap between structured data entry and free-form creative design, offering a "What You See Is What You Get" (WYSIWYG) experience that feels instantaneous and fluid.

Whether you are a developer seeking a minimalist tech resume, an executive needing a polished sidebar layout, or a creative requiring a unique visual identity, Profiley's atomic design system adapts to your needs without compromising on performance or export quality.

---

# ⚡ · EXPERIENCE PHILOSOPHY

### 01. The "Live-Render" Core
Every keystroke triggers an immediate update in the DOM-based preview engine. There is no "compile" button; the feedback loop is zero-latency, powered by React's efficient reconciliation algorithm.

### 02. Fluid State Management
Utilizing complex local state orchestration, the application manages configuration (fonts, colors, layout), content (experience, skills, education), and history (undo/redo) simultaneously.

### 03. Cinematic UI
The editor interface itself is a product of modern design—featuring dark mode, smooth transitions using `lucide-react` iconography, and a glassmorphism-inspired aesthetic that keeps the focus on creation.

---

# gf · FEATURE SYSTEM

<table>
  <tr>
    <td width="50%">
      <h3 align="center">🎨 Dynamic Template Engine</h3>
      <p align="center">
        Switch between <b>10+ distinct architectural layouts</b> (Modern, Minimal, Glitch, ATS, Leafy, etc.) instantly. The data model is decoupled from the view layer, allowing content to flow into any geometry.
      </p>
    </td>
    <td width="50%">
      <h3 align="center">Tb Real-Time Customization</h3>
      <p align="center">
        Fine-tune every pixel. Control <b>color palettes, font families (Inter, Merriweather, Mono), spacing scales, and element visibility</b>. Toggle photos, icons, and section headers with a single click.
      </p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3 align="center">☁️ Cloud &amp; Local Persistence</h3>
      <p align="center">
        Never lose work. Features <b>auto-saving to LocalStorage</b> and deep integration with <b>Firebase Firestore</b> to generate permanent, shareable URLs for your resume.
      </p>
    </td>
    <td width="50%">
      <h3 align="center">qp High-Fidelity Export</h3>
      <p align="center">
        Powered by <code>html2pdf.js</code>, Profiley generates <b>vector-quality PDFs</b>. Choose between "Screen" (fast) and "Print" (300 DPI) rendering modes for crisp text and images.
      </p>
    </td>
  </tr>
</table>

---

# 🏗️ · ARCHITECTURE &amp; STRUCTURE

The project follows a **Fractal Component Architecture**, ensuring scalability and isolation of concerns.

```bash
src/
├── components/
│   ├── Editor/           # The Control Center
│   │   ├── EditorPanel   # Main controller &amp; layout wrapper
│   │   ├── ContentTab    # Data entry forms (Personal, Exp, Edu)
│   │   ├── DesignTab     # Visual config (Templates, Colors, Fonts)
│   │   └── ExportTab     # PDF generation &amp; Cloud sharing
│   ├── Preview/          # The Rendering Engine
│   │   └── PreviewPanel  # Dynamic A4 renderer based on config
│   └── UI/               # Atomic Design Elements
│       └── FormElements  # Reusable inputs, toggles, and buttons
├── data/
│   └── constants.js      # Template definitions, initial state, themes
├── assets/               # Static resources
└── firebase.js           # BaaS connection (Firestore logic)

# 🧠 · DATA-DRIVEN DESIGN

Profiley operates on a strictly typed JSON schema. The entire state of the resume is serialized into three core objects:

1. **`data`**: The raw content (strings, arrays of objects for history).
2. **`config`**: The visual settings (theme string, booleans for UI elements).
3. **`sectionOrder`**: An array determining the vertical rhythm and visibility of sections.

This separation allows for:
* **Drag-and-Drop Reordering**: Simply mutating the `sectionOrder` array.
* **Theme Injection**: Applying a new `config` object overlays a completely new CSS strategy.
* **Serialization**: Easy storage in Firestore or LocalStorage.

---

# 🚀 · PERFORMANCE & OPTIMIZATION

* **Vite Build Tooling**: Instant server start and HMR (Hot Module Replacement) ensure a developer experience that matches the speed of the app.
* **Debounced Auto-Save**: Prevents local storage thrashing by batching write operations.
* **Conditional Rendering**: The Preview Panel only mounts DOM elements required by the active template, reducing memory footprint.
* **CSS-in-JS / Tailwind**: Utility-first CSS eliminates dead code, keeping the bundle size minimal.

---

# 🛠️ · TECH STACK

<div align="center">

| Core | Styling | State/Logic | Backend | Tools |
| :---: | :---: | :---: | :---: | :---: |
| **React 19** | **Tailwind CSS** | **Hooks API** | **Firebase** | **Vite** |
| **JSX** | **PostCSS** | **Context** | **Firestore** | **ESLint** |

</div>

---

# cd · INSTALLATION

Initialize the forge.

```bash
# 1. Clone the repository
git clone [https://github.com/thereallaksh/profiley-resume-builder.git](https://github.com/thereallaksh/profiley-resume-builder.git)

# 2. Navigate to the project core
cd profiley-resume-builder

# 3. Install dependencies
npm install

# 4. Ignite the development server
npm run dev