<div align="center">

  <img
    src="https://capsule-render.vercel.app/api?type=waving&amp;color=0f172a&amp;height=300&amp;section=header&amp;text=Profiley&amp;fontSize=88&amp;fontColor=38bdf8&amp;fontAlignY=40&amp;desc=The%20Architect%20of%20Professional%20Identity&amp;descAlignY=65&amp;descSize=22"
    alt="Profiley Banner"
    width="100%"
  />

  <br />

  <a href="https://react.dev/">
    <img src="https://img.shields.io/badge/CORE-REACT_19-61dafb?style=for-the-badge&amp;logo=react&amp;logoColor=black" alt="React" />
  </a>
  <a href="https://tailwindcss.com/">
    <img src="https://img.shields.io/badge/UI-TAILWIND_CSS-38bdf8?style=for-the-badge&amp;logo=tailwindcss&amp;logoColor=white" alt="Tailwind" />
  </a>
  <a href="https://vitejs.dev/">
    <img src="https://img.shields.io/badge/SPEED-VITE-646cff?style=for-the-badge&amp;logo=vite&amp;logoColor=white" alt="Vite" />
  </a>
  <a href="https://firebase.google.com/">
    <img src="https://img.shields.io/badge/CLOUD-FIREBASE-ffca28?style=for-the-badge&amp;logo=firebase&amp;logoColor=black" alt="Firebase" />
  </a>
  <img src="https://img.shields.io/badge/STATUS-MVP_COMPLETE-00e676?style=for-the-badge" alt="Status" />

</div>

<br /><br />

# 🧬 INTRODUCTION

> **Profiley** is not just a resume builder — it is a **reactive design engine** for professional documentation.

Built on the bleeding edge of the React ecosystem, Profiley transforms structured JSON data into **print-ready, typographically precise A4 documents** in real time. It bridges structured data entry with free-form creative design, delivering a true **WYSIWYG** experience with zero-latency feedback.

Whether you are a developer crafting a minimalist technical resume, an executive building a polished sidebar layout, or a creative seeking a unique visual identity, Profiley adapts instantly without sacrificing performance or export fidelity.

---

# ⚡ EXPERIENCE PHILOSOPHY

### 01 · Live-Render Core
Every keystroke triggers an immediate DOM update in the preview engine. There is no compile step — the feedback loop is effectively zero-latency, powered by React’s reconciliation algorithm.

### 02 · Fluid State Orchestration
Complex local state management handles **content**, **visual configuration**, and **history (undo/redo)** simultaneously, ensuring stability even during aggressive iteration.

### 03 · Cinematic UI
The editor itself is a product — featuring a warm light and dark theme that follows your system, a floating zoom control, keyboard shortcuts, and a calm, paper-first interface that keeps attention on your resume.

---

# 🔥 FEATURE SYSTEM

<table>
  <tr>
    <td width="50%">
      <h3 align="center">🎨 Dynamic Template Engine</h3>
      <p align="center">
        Instantly switch between <b>16 templates</b> (Modern, Nordic, Atlas, Swiss, Poster, Elegant, ATS, and more), each previewed with your own content.  
        The data model is fully decoupled from presentation, allowing content to flow into any layout geometry.
      </p>
    </td>
    <td width="50%">
      <h3 align="center">🧩 Real-Time Customization</h3>
      <p align="center">
        Control <b>color palettes, font pairings, spacing, section and entry styles, skill displays, page frames, and visibility</b>.  
        Toggle photos, icons, and section headers with a single interaction.
      </p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3 align="center">☁️ Cloud &amp; Local Persistence</h3>
      <p align="center">
        Automatic LocalStorage persistence paired with <b>Firebase Firestore</b> enables permanent, shareable resume URLs without manual saves.
      </p>
    </td>
    <td width="50%">
      <h3 align="center">📄 High-Fidelity Export</h3>
      <p align="center">
        Download an exact-design PDF (rendered with <code>html2pdf.js</code>), or print to a <b>text PDF with selectable text</b> that applicant tracking systems can read.  
        Both options use A4 and keep colours and backgrounds.
      </p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3 align="center">🎯 Tailor to a Job</h3>
      <p align="center">
        Paste a job description and Claude suggests rewrites for your summary, roles and skills, with keyword gaps and a match score.  
        You accept or dismiss each suggestion; contact details and photo are never sent.
      </p>
    </td>
    <td width="50%">
      <h3 align="center">🤖 ATS Check</h3>
      <p align="center">
        See roughly what an applicant tracking system reads: reading order, columns, headings, dates, bullets and links, scored with fixes.
      </p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3 align="center">✏️ Click to Edit</h3>
      <p align="center">
        Click any text on the page to edit it in place (name, summary, roles, bullets, skills, section titles). Everything is undoable.
      </p>
    </td>
    <td width="50%">
      <h3 align="center">📥 Import &amp; Backup</h3>
      <p align="center">
        Import a PDF or pasted text (read by AI, or by a basic on-device reader without a key), a Profiley backup, or JSON Resume. Export both formats back out.
      </p>
    </td>
  </tr>
</table>

### AI setup (optional)

The AI features need an Anthropic key. Either set `ANTHROPIC_API_KEY` in the Vercel project environment (the app then calls `/api/ai`; optional `ANTHROPIC_MODEL`, and `AI_RATE_LIMIT_PER_HOUR`, default 8 per IP, an in-memory best-effort limit), or let each user paste their own key under Review, which is kept in their browser and sent straight to Anthropic. Without either, Job match still works for free: copy the prompt, run it in your own Claude chat, and paste the reply back. Everything else works without AI.

---

# 🏗️ ARCHITECTURE &amp; STRUCTURE

Profiley follows a **Fractal Component Architecture**, ensuring isolation of concerns and long-term scalability.

```bash
src/
├── components/
│   ├── Editor/            # Control Center
│   │   ├── EditorPanel    # Layout controller
│   │   ├── ContentTab     # Resume data input
│   │   ├── DesignTab      # Fonts, colors, templates
│   │   └── ExportTab      # PDF generation &amp; sharing
│   ├── Preview/           # Rendering engine
│   │   └── PreviewPanel   # Dynamic A4 renderer
│   └── UI/                # Atomic UI components
│       └── FormElements   # Inputs, toggles, buttons
├── data/
│   └── constants.js       # Templates, themes, defaults
├── assets/                # Static assets
└── firebase.js            # Firestore integration
```

---

# 🧠 DATA-DRIVEN DESIGN

Profiley operates on a strict JSON schema composed of:

1. **`data`** — resume content  
2. **`config`** — visual configuration  
3. **`sectionOrder`** — layout sequencing  

This enables:
- Drag-and-drop section reordering  
- Instant theme injection  
- Seamless serialization to Firestore or LocalStorage  

---

# 🚀 PERFORMANCE &amp; OPTIMIZATION

- **Vite tooling** for instant HMR and fast builds  
- **Debounced autosave** to prevent storage thrashing  
- **Conditional rendering** to minimize DOM complexity  
- **Tailwind utility CSS** for minimal bundle size  

---

# 🛠️ TECH STACK

<div align="center">

| Core | Styling | State &amp; Logic | Backend | Tooling |
|:---:|:---:|:---:|:---:|:---:|
| React 19 | Tailwind CSS | Hooks API | Firebase | Vite |
| JSX | PostCSS | Context API | Firestore | ESLint |

</div>

---

# 🚀 INSTALLATION

```bash
# Clone the repository
git clone https://github.com/thereallaksh/profiley-resume-builder.git

# Navigate into the project
cd profiley-resume-builder

# Install dependencies
npm install

# Start the development server
npm run dev
```

---

**Status:** MVP Complete  
**Design Philosophy:** Precision over templates  
**Audience:** Developers, professionals, creatives
