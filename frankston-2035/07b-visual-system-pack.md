# Visual System Pack
## Frankston 2035 — Complete Diagram Specifications

*This document specifies every diagram in the publication.*
*Each specification is complete enough for a designer to execute without further briefing.*
*SVG source files live in `/frankston-2035/assets/diagrams/` as they are produced.*

---

## Section A — The Frankston Creative Operating System

### A1 — System Architecture Overview

**File:** `creative-os-architecture.svg`
**Size:** 297 × 210mm (A4 landscape)
**Purpose:** Show the five-layer infrastructure model as a single visual.

**Layout:**

Five horizontal bands, stacked top to bottom, labelled left, content right.

```
┌─────────────────────────────────────────────────────────┐
│  LAYER 5 — CULTURE           civic identity · belonging  │  ← lightest band
├─────────────────────────────────────────────────────────┤
│  LAYER 4 — PROGRAMMING       workshops · walks · events  │
├─────────────────────────────────────────────────────────┤
│  LAYER 3 — SPACE             schools · library · streets │
├─────────────────────────────────────────────────────────┤
│  LAYER 2 — TOOLS             technology · materials      │
├─────────────────────────────────────────────────────────┤
│  LAYER 1 — RELATIONSHIPS     community · artists · trust │  ← darkest band
└─────────────────────────────────────────────────────────┘
```

**Design decisions:**
- Layers 1–2 fill in Frankston Blue at 15% and 20% opacity respectively — the foundation is most visible
- A vertical bracket on the right side labels LAYERS 1–2 as "DURABLE WORK" and LAYERS 3–5 as "VISIBLE WORK"
- A note at the bottom: "Programmes built only at layers 3–5 do not last."
- Label font: 9pt, uppercase tracking, IBM Plex Mono
- No icons, no illustrations, no decorative elements

---

### A2 — The Civic Creativity Loop

**File:** `civic-creativity-loop.svg`
**Size:** 210 × 210mm (square)
**Purpose:** Show how value circulates through the six primary actors.

**Layout:** Six nodes arranged as a hexagon, clockwise from top:

```
                  COMMUNITY
                 /          \
              ARTIST        COUNCIL
              |                  |
              ARTWORK       LIBRARY
                 \          /
                  SCHOOL
```

**Arrows and labels (clockwise, outer ring):**

- COMMUNITY → ARTIST: `commissions`
- ARTIST → ARTWORK: `creates`
- ARTWORK → SCHOOL: `teaches from`
- SCHOOL → LIBRARY: `visits`
- LIBRARY → COUNCIL: `reports to`
- COUNCIL → COMMUNITY: `funds for`

**Inner arrows (cross-connections):**
- COUNCIL → ARTIST: `pays`
- ARTWORK → COMMUNITY: `belongs to`

**Design decisions:**
- Primary circle arrows: 2pt, Frankston Blue
- Secondary inner arrows: 1pt, Coastal Sand
- Node labels: 11pt Canela, centred
- Arrow labels: 8pt IBM Plex Mono, uppercase
- No node fill — text only inside a hairline rectangle

---

### A3 — Community Ecosystem Map

**File:** `community-ecosystem.svg`
**Size:** 250 × 250mm (square, bleed)
**Purpose:** Show every participant and the density of their relationships.

**Three rings:**

**Centre:** FRANKSTON (large, 40mm diameter circle, Deep Ink fill, white text)

**Inner ring** (six nodes, 30mm each, lighter fill):
Community · Schools · Library · Council · Artists · BSS

**Outer ring** (twelve nodes, 20mm each, lightest fill):
Students · Teachers · Volunteers · Families · Local Business · Cultural Orgs · Government Funders · First Nations Advisors · Media · Health Services · Disability Arts · Sister Cities

**Connection lines:**
- Centre to inner: always present (2pt)
- Inner to inner: only where direct relationship exists (1pt)
- Inner to outer: only where direct relationship exists (0.5pt)
- Outer to outer: only the most significant (0.5pt, dashed)

**Design note:** Line weight is the data. Thick lines = strong existing relationship. Thin lines = emerging or potential. This map should look real — not every outer node connects to every inner node. It is honest about what exists now vs. what may develop.

---

### A4 — The Seven Journeys (Individual Diagrams)

Each journey is a separate diagram, same format, same size: 200 × 80mm horizontal strip.

**Format for each:**

```
[Entry point]  →  [First encounter]  →  [Participation]  →  [Identity]  →  [Contribution]
```

Five stages, connected by arrows, each stage containing:
- Top: stage name (8pt, uppercase, Plex Mono)
- Middle: what happens (10pt Canela, 2-line max)
- Bottom: what the person feels or gains (8pt, italic, Canela)

**Journey 01 — The Citizen**
Entry: `sees something in the street`
Stages: DISCOVERS → ENCOUNTERS → PARTICIPATES → IDENTIFIES → ADVOCATES

**Journey 02 — The Student**
Entry: `mural appears at their school`
Stages: SEES → LEARNS → MAKES → CONNECTS → CARRIES

**Journey 03 — The Teacher**
Entry: `hears from a colleague`
Stages: HEARS → INVESTIGATES → PARTNERS → FACILITATES → LEADS

**Journey 04 — The Artist**
Entry: `open call or direct approach`
Stages: APPLIES → CO-DESIGNS → CREATES → IS CREDITED → RETURNS

**Journey 05 — The Library**
Entry: `receives proposal`
Stages: BRIEFED → SCOPED → TRAINED → RUNS → OWNS

**Journey 06 — The Volunteer**
Entry: `attends an event`
Stages: ENCOUNTERS → TRAINS → FACILITATES → DEEPENS → TRAINS OTHERS

**Journey 07 — The Council**
Entry: `receives Executive Summary`
Stages: BRIEFED → MEETS → AGREES → FACILITATES → CELEBRATES

**Design decisions:**
- All seven journeys on one double-page spread in the publication
- Each strip uses the same horizontal template
- Colour coding: accent colour per journey (drawn from the secondary palette)
- Entry point shown as a small pill/tag to the left of the first arrow

---

### A5 — Journey Intersection Map

**File:** `journey-intersections.svg`
**Size:** 210 × 297mm (A4 portrait)
**Purpose:** Show where the seven journeys meet and what happens at each intersection.

**Layout:** A matrix grid.

Rows: Seven journeys (Citizen, Student, Teacher, Artist, Library, Volunteer, Council)
Columns: Same seven journeys
Diagonal: blank (a journey does not intersect with itself)

**Each cell:**
If the two journeys intersect, the cell contains:
- The name of the intersection context (e.g., "Community co-design workshop")
- A small dot in Frankston Blue

If they do not directly intersect, the cell is empty.

**The resulting matrix shows:**
- Which journey has the most connections (richest role in the system)
- Which journeys rarely touch each other (potential for development)
- The density of connections across the system

**Design note:** This is a heat map of relationship, not a calendar. The denser the row, the more important that participant is to system health.

---

### A6 — The Three Horizons Roadmap

**File:** `three-horizons-roadmap.svg`
**Size:** 420 × 100mm (A3 landscape strip)
**Purpose:** Show the 2026–2035 timeline as a navigable visual.

**Layout:**

A single horizontal timeline, 2026 to 2035, divided into three coloured bands:

```
2026 ──────────── 2027 ──────── 2030 ─────────────────── 2035
│    HORIZON 1   │              │    HORIZON 2           │         HORIZON 3         │
│    PROVE       │              │    BUILD               │         REPLICATE         │
│    #1B4F8A     │              │    #4B7DB8             │         #8BAFD6           │
│    (full)      │              │    (medium)            │         (light)           │
```

**Milestones** shown as dots on the timeline, labelled above the line.

H1 milestones (above line): Council agreement · Pilot 01 artist selected · Pilot 02 library scoped · Pilot 03 mapped · All pilots complete · H1 review

H2 milestones (above line): 5 schools · Library expansion · Residency program · First interstate inquiry · 20 artworks · Playbook published

H3 milestones (above line): National presentation · First replication · 40 artworks · Model packaged · 50 artworks · BSS transitions to advisory

**Design decisions:**
- Years at top, milestones above the line, horizon names below
- Horizon colours: Frankston Blue → lighter versions → lightest
- Milestone dots: filled circle, 4mm diameter
- Milestone labels: 8pt, IBM Plex Mono, angled 45° to avoid overlap

---

## Section B — Process Diagrams

### B1 — The Mural Process

**File:** `pilot-01-mural-process.svg`
**Size:** 297 × 120mm
**Purpose:** Show the Living Mural from brief to curriculum.

**Stages (horizontal, proportional to time):**

```
│ BRIEF │──── CO-DESIGN ────│─── PRODUCTION ───│ INSTALL │──── CURRICULUM ────→
  4wk          8wk                12wk             1wk           ongoing
```

**Three participant tracks run below each stage (small icons):**

| Stage | BSS | School/Teacher | Artist | Community |
|---|---|---|---|---|
| Brief | ● | ● | | |
| Co-design | ● | ● | ● | ● |
| Production | | | ● | |
| Install | ● | ● | ● | ● |
| Curriculum | | ● | ● | |

**Deliverables** appear above each stage as a small tag:
Brief: `scope document` · Co-design: `concept approved` · Production: `artwork ready` · Install: `mural permanent` · Curriculum: `resource pack`

---

### B2 — The Healthy Technology Evaluation

**File:** `tech-evaluation-tree.svg`
**Size:** 150 × 200mm (portrait)
**Purpose:** Decision tree for technology entering any program.

```
         PROPOSED TECHNOLOGY
                  │
     ┌────────────▼────────────┐
     │ Serves child, not       │
     │ corporation?            │
     └────────────────────────┘
          │            │
         YES           NO
          │             └──→ [REJECTED]
          │                  Document reason
     ┌────▼────────────────┐
     │ Works without an    │
     │ account?            │
     └────────────────────┘
          │            │
         YES           NO
          │             └──→ [REJECTED]
          │                  Document reason
     ┌────▼────────────────┐
     │ Works offline,      │
     │ or can it?          │
     └────────────────────┘
          │            │
         YES          MAYBE
          │             └──→ [REFER TO CD]
          │                  Document & decide
     ┌────▼────────────────┐
     │    APPROVED         │
     │ Add to Asset Reg.   │
     └────────────────────┘
```

**Colour:** YES paths → Approval Green · NO paths → Stop Red · MAYBE → Caution Amber

---

### B3 — The First Nations Permission Pathway

**File:** `first-nations-permission-pathway.svg`
**Size:** 297 × 120mm
**Purpose:** Show the eight-stage sequence from research to review. Make visible that no stage can be skipped.

**Layout:** Eight stages in a loop (stages 1–4 left-to-right, stages 5–8 right-to-left beneath).

```
1. RESEARCH ──→ 2. INTERMEDIARY ──→ 3. FIRST CONTACT ──→ 4. LISTENING
                                                                 │
8. REVIEW ←── 7. DOCUMENT ←── 6. COLLABORATE ←── 5. PERMISSION GRANTED
```

**Stage gates:** A lock icon sits between each stage. The lock is closed until the exit condition for the prior stage is met.

**Each stage has three sub-labels (small, beneath the stage name):**
- WHO: who is responsible at this stage
- WHAT: what must happen
- STOP: what stops progress (exit condition not met)

**At stage 5 — Permission:** A branch arrow exits downward: `PERMISSION NOT GRANTED → STOP. Document. Remove from scope.`

**Visual weight:** The STOP exit at stage 5 is given as much visual weight as the forward path. Both outcomes are designed as valid.

---

## Section C — Pilot Diagrams

### C1 — Pilot 01: Living Mural Flowchart

**File:** `pilot-01-flowchart.svg`
**Size:** 200 × 280mm (portrait)

**Three parallel tracks (vertical):**
- Left: BSS
- Centre: School / Teacher
- Right: Artist / Community

Each track shows activities as horizontal bars at the relevant time period. Dotted lines connect activities that depend on each other across tracks.

**Start state (top):** "School wall is blank. No curriculum link. No community story."
**End state (bottom):** "Permanent mural. Curriculum resource pack. Community story embedded."

---

### C2 — Pilot 02: Healthy Tech Library Flowchart

**File:** `pilot-02-flowchart.svg`
**Size:** 200 × 280mm

**Three parallel tracks:**
- Left: BSS
- Centre: Library Service
- Right: Community / Participants

**Key decision point** visible in Library track: "Do staff feel confident with tools?" → YES → Launch · NO → More training

**Start state:** "Library has standard computer terminals. No healthy tech offering."
**End state:** "Dedicated creative technology space. Trained facilitators. Ongoing programming. Community owned."

---

### C3 — Pilot 03: QR Art Walk Flowchart

**File:** `pilot-03-flowchart.svg`
**Size:** 200 × 280mm

**Three parallel tracks:**
- Left: BSS
- Centre: Community / Artists
- Right: Technical (web, QR)

**Key note visible in Community track:** "Community nominates sites — BSS does not decide unilaterally."

**Start state:** "City has public spaces. No connected creative journey."
**End state:** "10–15 active QR stops. Printed map. Static web pages. Expandable by community."

---

## Section D — Publication Page Layouts

### D1 — Chapter Opener Grid Application

```
[20mm margin]

Line 1: Chapter number — 9pt Plex Mono, uppercase, letter-spaced 200%
Line 2: [16mm gap]
Line 3: Chapter title — 48pt Canela Light, max 2 lines
Line 4: [8mm gap]
Line 5: Chapter description — 16pt Neue Haas Grotesk, 1 sentence, ragged right
Line 6: [40mm gap or illustration occupying remaining space]
```

### D2 — Body Text Grid Application

```
Left margin: 20mm
Text column: 10 of 12 columns (total ~160mm)
Right margin: 25mm (includes binding margin)

Section heading: flush left
Body: flush left, ragged right
Image: centred within text column
Caption: 4 columns wide, flush right, below image
```

### D3 — Data/Table Grid Application

```
Table occupies 10 of 12 columns (centred)
Table background: Warm White (#F8F6F1), within 1pt Deep Ink hairline border
Header row: Coastal Sand fill, 9pt Plex Mono uppercase
Body rows: alternating white / Warm White at 50% for readability
Cell padding: 4mm top/bottom, 6mm left/right
```

---

*Visual System Pack v1.0 — June 2026*
*All diagrams to be executed as SVG and exported as PDF/PNG for publication use*
*Diagram files: `/frankston-2035/assets/diagrams/`*
