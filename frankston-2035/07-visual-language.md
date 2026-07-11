# Visual Language
## Frankston 2035 — Diagram & Information Design System

---

### Philosophy

Replace text with diagrams wherever possible.
Replace diagrams with understanding wherever possible.

Every diagram in this project should be able to be read in 10 seconds. If it takes longer, redesign it.

---

## 1 — System Diagrams

### 1.1 — The Civic Creativity Loop

**Purpose:** Show how creativity circulates through Frankston's institutions.
**Use:** Publication opener, Council presentation, community meetings.

**Diagram concept:**
```
         COMMUNITY
              ↑
    creates belonging
              │
  ARTIST ──→ ARTWORK ──→ SCHOOL
     ↑                      │
  is paid               teaches from
     │                      │
  COUNCIL ←── funds ←── LIBRARY ←── hosts
```

**Rendered as:** A circular flow diagram. Five nodes (Community, Artist, Artwork, School, Library, Council) arranged in a hexagon. Arrows showing the direction of value. Each arrow labelled with a single verb. No colour needed — weight of line carries hierarchy.

**Design spec:**
- Node size: equal
- Node shape: rounded rectangle
- Line weight: 2pt for primary flows, 1pt for secondary
- Label typeface: body type, 9pt, uppercase tracking
- No icons inside nodes — text only
- Background: white

---

### 1.2 — The Project Architecture

**Purpose:** Show how all documents and pilots relate to the Constitution.
**Use:** Internal reference, partner briefings.

**Diagram concept:**
```
              [CONSTITUTION]
                    │
         ┌──────────┼──────────┐
    [STRATEGIES]  [CHARTERS]  [PROTOCOLS]
         │                        │
    [PILOTS]                [REGISTERS]
         │                        │
    [PLAYBOOK] ────────── [ROADMAP]
```

**Rendered as:** A tree diagram radiating from the Constitution. The Constitution is visually larger/heavier. Lines show dependency, not hierarchy of value. All documents shown by name.

---

## 2 — Process Diagrams

### 2.1 — The Mural Process

**Purpose:** Show how a Living Mural moves from idea to installation to curriculum.
**Use:** School briefings, artist onboarding, community presentations.

**Stages (left to right):**

```
BRIEF → CO-DESIGN → ARTIST SELECTION → PRODUCTION → INSTALLATION → CURRICULUM
  4wk      8wk           2wk              12wk           1wk           ongoing
```

**Key design decisions:**
- Horizontal timeline (not flowchart)
- Each stage has a participant icon below it (who is involved)
- Duration shown as proportional bar width
- Colour: one accent colour marks "community involvement" stages
- Output: a deliverable label appears above the line at each stage

---

### 2.2 — The Technology Evaluation Process

**Purpose:** Show how a technology is evaluated against the Healthy Technology Charter before entering a program.
**Use:** Partner onboarding, Library, schools.

**Decision tree:**

```
PROPOSED TECHNOLOGY
        │
Does it serve the child, not the corporation?
   YES ─────────────────────────────→
   NO ──→ REJECTED. Document reason.
        │
Does it work without an account?
   YES ─────────────────────────────→
   NO ──→ REJECTED. Document reason.
        │
Does it work offline, or can it?
   YES ─────────────────────────────→
   NO ──→ REFER TO CREATIVE DIRECTOR FOR REVIEW
        │
        ↓
    APPROVED
    Document in Asset Register
```

**Design spec:** Vertical decision tree. Green for YES paths. Red for REJECTED. Amber for REFER. Simple rectangle nodes. No gradients.

---

### 2.3 — The First Nations Permission Pathway

**Purpose:** Show the sequence of relationship → permission → collaboration. Prevent bypassing steps.
**Use:** Internal team, Council, funders.

**Stages (sequential — not skippable):**

```
1. Research ──→ 2. Intermediary ──→ 3. First Contact ──→ 4. Listening
                                                                │
8. Review ←── 7. Document ←── 6. Collaborate ←── 5. Permission granted
```

Each stage shows:
- Who initiates
- What happens
- What must NOT happen
- Exit condition (what stops the process advancing)

**Design note:** This diagram must make it visually clear that no stage can be skipped. Use a lock icon at each stage gate.

---

## 3 — Pilot Flowcharts

### 3.1 — Pilot 01: Living Mural
### 3.2 — Pilot 02: Healthy Tech Library
### 3.3 — Pilot 03: QR Art Walk

Each pilot flowchart shows:
- Start state (what exists before)
- Key decision points
- Parallel workstreams (community, artist, institution)
- End state (what permanently exists after)
- Resource requirements at each stage

*Detailed flowcharts to be produced as SVG files in `/frankston-2035/assets/diagrams/` when pilots are formally scoped.*

---

## 4 — Roadmap Diagram

**Purpose:** Show the three-horizon timeline visually.
**Use:** Publication, Council presentations, grant applications.

**Concept:**

```
2026 ────────────────── 2027 ────────── 2030 ──────────────── 2035
│                              │                              │
│ HORIZON 1: PROVE             │ HORIZON 2: BUILD             │ HORIZON 3: REPLICATE
│ Three pilots                 │ Five schools                 │ National model
│ One partnership              │ Library network              │ Three other councils
│                              │ First residents              │ BSS steps back
```

**Design spec:**
- Horizontal timeline
- Three horizontal bands (one per horizon) in progressively lighter shades
- Milestones as dots on the line, labelled above
- Years marked at top
- No decorative elements

---

## 5 — Community Ecosystem Diagram

**Purpose:** Show every participant in the Frankston 2035 ecosystem and how they relate.
**Use:** Community meetings, publication chapter openers.

**Nodes and connections:**

Centre: **FRANKSTON**

Inner ring: Community, Schools, Library, Council, Artists

Outer ring: Students, Teachers, Volunteers, Families, Local Businesses, Cultural Organisations, Government Funders

Lines connect based on direct relationships, not aspirational ones.

**Design spec:** Concentric circle layout. Centre is the largest node. Inner ring slightly smaller. Outer ring smallest. Line thickness shows strength of relationship. This is a real ecosystem map — it should look lived-in, not perfect.

---

## 6 — QR Journey Diagram

**Purpose:** Show how a person encounters and navigates a QR-linked experience.
**Use:** Pilot 03 documentation, partner briefings, community explainers.

**The journey:**

```
Person sees QR code on wall
        │
Opens phone camera / QR reader
        │
Lands on static webpage
        │
        ├──→ Reads / listens / watches
        │
        ├──→ Sees nearby stops
        │
        └──→ Continues walk or exits
```

**Key design notes:**
- Show that no account is required at any step
- Show that no data is collected at any step
- Show that the experience works offline after first load
- Use a simplified phone icon at each step showing what the screen shows

---

## Design Rules for All Diagrams

| Rule | Why |
|---|---|
| Maximum 7 nodes per diagram | More than 7 and the eye doesn't know where to start |
| One sentence per label | Diagrams fail when labels become paragraphs |
| Arrows carry meaning | Every arrow needs a label or must be self-evident |
| White backgrounds only | Diagrams are for printing and screens equally |
| No drop shadows, gradients, or 3D effects | They add visual noise without meaning |
| Colour is functional | Only use colour when it carries information |
| Every diagram has a title and a date | So it can be extracted from any context |

---

*Visual Language v1.0 — June 2026*
*Diagrams to be executed as SVG by a designer working from these specifications*
