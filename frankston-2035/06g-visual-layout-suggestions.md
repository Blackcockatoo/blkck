# Visual Layout Suggestions
## First Nations Protocol — Frankston 2035 — Chunk 06

*Design direction for producing the protocol as a standalone designed document.*
*All specifications align with the publication design guide (document 09).*
*Diagrams to be produced as SVG files in `/frankston-2035/assets/diagrams/06/`*

---

## Document Identity

This protocol sits outside the main publication. It is an internal working document with a specific audience and a specific status (unreviewed, not for external use). Its design must communicate that status visually while still feeling part of the Frankston 2035 system.

**The visual signal for "internal / not yet reviewed":**
A diagonal banner in Caution Amber (`#C97D1A`) across the top-right corner of the cover and the footer of every page:

```
INTERNAL WORKING DOCUMENT
NOT FOR EXTERNAL USE
```

This is removed when the document has been reviewed and approved by a cultural safety advisor.

---

## Cover Design

**Format:** A4 portrait
**Background:** Warm White (`#F8F6F1`)

**Cover layout (top to bottom):**

```
[20mm top margin]

FRANKSTON 2035                          ← 9pt, Plex Mono, uppercase, letter-spaced
[8mm]
First Nations Protocol                  ← 36pt, Canela Light
[4mm]
A pathway for listening,                ← 14pt, Neue Haas Grotesk, italic
relationship, permission, and process.
[12mm]
────────────────────────────────        ← 0.5pt hairline, Coastal Sand (#D4C4A0)
[8mm]
This document does not speak            ← 9pt, Neue Haas Grotesk, Data Grey
for any First Nations community.        (#6B6B6B), ragged right
It describes how Blue Snake Studio
will conduct itself.
[8mm]
Not for external use until reviewed     ← 9pt, Plex Mono, Caution Amber (#C97D1A)
by an independent cultural safety
advisor. That review has not
yet occurred.
[fill]
Version 2.0 — June 2026                ← 8pt, Plex Mono, Data Grey, bottom left
```

**No imagery on the cover.** Text only. The restraint is the message.

---

## Part Opener Pages

Each of the nine parts opens with a dedicated layout:

```
[Top of page]

PART [NUMBER]                           ← 9pt, Plex Mono, uppercase, Coastal Sand
[12mm]
[Part title]                            ← 28pt, Canela Light, max 2 lines
[8mm]
[One sentence — the core principle      ← 14pt, Neue Haas Grotesk, ragged right
of this part]
[20mm]
[Body text begins]                      ← 10pt, Neue Haas Grotesk, 16pt leading
```

The part number and title sit on the left column. A thin vertical rule (0.5pt, Frankston Blue) runs the full height of the text area on the left margin — present on every page, a constant reminder that this is one document with structural integrity.

---

## Key Diagrams

### Diagram 1 — The Sequence (Part 3)

**File:** `06-relationship-sequence.svg`
**Size:** Full text column width, 60mm tall
**Purpose:** Make the non-reversibility of the sequence visually unmistakable.

```
RESEARCH → INTERMEDIARY → FIRST CONTACT → LISTENING → TIME
                                                        │
                                                  RELATIONSHIP
                                                        │
                                                    (only then)
                                                      PROJECT
```

Design: The arrow from TIME to RELATIONSHIP is vertical, dropping down the page — visually reinforcing that this is not a lateral step but a descent to a deeper level. The word PROJECT appears at the bottom, smaller, beneath a thin horizontal rule.

Between each step, a small lock icon. The lock is unlocked only when the prior step is complete. Text beneath each lock: the exit condition.

---

### Diagram 2 — Permission Is Specific (Part 5)

**File:** `06-permission-specificity.svg`
**Size:** Full text column width, 80mm tall
**Purpose:** Show the precise distinction between types of permission. Stop the "but they agreed to one thing" conflation.

**Layout:** A 2×4 grid of statements, each with a NOT EQUAL TO sign in the centre:

```
┌─────────────────────┬───┬─────────────────────┐
│ Conversation        │ ≠ │ Use of material      │
├─────────────────────┼───┼─────────────────────┤
│ One project         │ ≠ │ Next project         │
├─────────────────────┼───┼─────────────────────┤
│ One person's yes    │ ≠ │ Community permission │
├─────────────────────┼───┼─────────────────────┤
│ Verbal              │ ≠ │ Written (public use) │
└─────────────────────┴───┴─────────────────────┘
```

Left column: Deep Ink on white. Centre column: Frankston Blue, large ≠. Right column: Deep Ink on white.

---

### Diagram 3 — The Refusal Protocol (Part 6)

**File:** `06-refusal-protocol.svg`
**Size:** Full text column width, 100mm tall
**Purpose:** Make the correct response to refusal absolutely clear — including the branches that are NOT acceptable.

```
PERMISSION NOT GRANTED
         │
         ▼
    ┌─────────────────────────────────────┐
    │ 1. Thank. Do not probe for reasons. │
    │ 2. Do not express disappointment.   │
    │ 3. Document the decision.           │
    │ 4. Remove from scope immediately.   │
    │ 5. Do not resurface it.             │
    └─────────────────────────────────────┘
         │
         ▼
      [CLOSED]

                        ╳ NOT ACCEPTABLE ╳
         ┌──────────────────────────────────────┐
         │ Reframe the ask                      │
         │ Ask a different person               │
         │ Proceed with a reduced version       │
         │ Wait for deadline pressure to help   │
         │ Disclose why permission was declined │
         └──────────────────────────────────────┘
```

The CLOSED box is in Approval Green — the correct outcome.
The NOT ACCEPTABLE box is in Stop Red. Each item has an ✕ prefix.

---

### Diagram 4 — The Accountability Loop (Part 9)

**File:** `06-accountability-loop.svg`
**Size:** 120 × 120mm (square)
**Purpose:** Show that accountability is not a one-time review but an ongoing cycle.

**Circular layout, three stages:**

```
      [OPERATE]
     ↗           ↘
[REVIEW]  ←←←  [DOCUMENT]
```

- OPERATE: follow the protocol in practice
- DOCUMENT: log every decision as it happens
- REVIEW: annual review, advisor review, end-of-pilot review

Arrows are continuous — the loop never ends for as long as the project runs.

Centre of circle: `"Did we keep our word?"`

---

## Pull Quotes

Three pull quotes deserve typographic treatment as full-page or half-page spreads:

**1.** (After Part 1)
> "The first step is not content creation.
> The first step is respectful process."

**2.** (After Part 6)
> "No means no.
> It does not mean try again differently."

**3.** (At document close)
> "The quality of our First Nations relationships is not measured by this document. It is measured by whether First Nations people in Frankston, over time, describe Blue Snake Studio as an organisation that kept its word."

**Typography for pull quotes:**
- Background: Coastal Sand block (`#D4C4A0`), full column width
- Text: 20pt Canela Light, left-aligned, Deep Ink
- No quotation marks — the typographic treatment is the signal
- Attribution (for quote 3): 9pt Neue Haas Grotesk, italic

---

## Page Footer

Every page carries, in the footer:

```
[Left] First Nations Protocol — Frankston 2035    [Right] [Page number]
[Full width beneath] INTERNAL — NOT FOR EXTERNAL USE UNTIL REVIEWED ← 7pt, Caution Amber
```

---

## Print Specifications

- Paper: 100gsm uncoated (or equivalent)
- Binding: Saddle-stitch or perfect-bound depending on final page count
- Cover: 200gsm, uncoated
- No laminate on cover — the document should feel like a document, not a product
- Printed in two colours only: Deep Ink + Frankston Blue (with Coastal Sand achieved as a tint)

---

*Visual Layout Suggestions v1.0 — June 2026*
*Execute in InDesign or Affinity Publisher using specifications from document 09*
