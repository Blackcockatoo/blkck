# Folder Architecture
## Frankston 2035 — Document & Asset Structure

---

### Repository Location

`github.com/Blackcockatoo/blkck`
Branch: `claude/frankston-2035-creative-direction-kpduob`
Project folder: `/frankston-2035/`

---

### Document Structure

```
frankston-2035/
│
├── 00-constitution.md              ← Source of truth. Do not contradict.
│
├── 01-executive-summary.md         ← What, why, who, when
├── 02-blue-snake-studio.md         ← Who BSS is, what we bring, what we don't do
│
├── 03-pilot-projects.md            ← Three pilots: Living Mural, Healthy Tech, QR Walk
│
├── 04-healthy-technology-charter.md ← Rules for technology near children
│
├── 05-risk-register.md             ← Strategic, operational, cultural, financial risks
├── 05b-asset-register.md           ← IP, digital, physical, relational assets
├── 05c-council-ask.md              ← What we need from Council, what they receive
├── 05d-governance.md               ← Who decides what
├── 05e-folder-architecture.md      ← This file
├── 05f-roadmap.md                  ← Timeline 2026–2035
├── 05g-handoff.md                  ← For the next person
│
├── 06-first-nations-protocol.md    ← 9-part protocol for listening & permission
│
├── 07-visual-language.md           ← Diagram system, graphic specifications
├── 08-creative-operating-system.md ← All journeys, how they intersect
├── 09-publication-design.md        ← Style guide: typography, colour, grid
│
└── 10-playbook.md                  ← The Frankston Playbook (scaffold + chapters)
```

---

### File Naming Rules

- Use lowercase, hyphen-separated names
- Prefix with chunk number for sortability
- No spaces in filenames
- Version in the document header, not the filename
- Draft documents: no special suffix — version noted internally

---

### Asset Subfolders (To Be Created as Pilots Progress)

```
frankston-2035/
│
├── assets/
│   ├── diagrams/        ← SVG/PNG exports of visual language diagrams
│   ├── photography/     ← Project documentation photography
│   ├── illustrations/   ← Commissioned illustrations
│   └── print/           ← Publication-ready PDFs
│
├── pilots/
│   ├── pilot-01-living-mural/
│   ├── pilot-02-healthy-tech-library/
│   └── pilot-03-qr-art-walk/
│
└── reports/
    ├── council-reports/
    └── funder-reports/
```

---

### Working Conventions

- All documents are Markdown (`.md`) unless otherwise specified
- Git is the version control system — commit often, message clearly
- No file is ever deleted — deprecated files move to an `/archive/` subfolder
- Images are stored in `/assets/` not embedded in documents
- The Constitution is never renamed, moved, or merged into another document

---

*Folder Architecture v1.0 — June 2026*
