# Image Library Structure

```text
BSS_IMAGE_LIBRARY/
├── 01_Auralia/
├── 02_Insidious_Rhythms/
├── 03_Black_Wing_Crew/
├── 04_Neon_Venom/
├── 05_Original_Paintings/
├── 06_Branding_Logos/
├── 07_MOSS60_Geometry/
├── 08_References/
├── 09_Mood_Textures/
└── 10_Video_Source/
```

## Naming rule

Use:

```text
CATEGORY_subject_style_version.ext
```

Examples:

```text
POSTER_insidious-rhythms_blue-lyric_v2.png
STICKER_neon-venom_qr_enter-the-dream_v1.png
PAINTING_auralia_spiral-listener_canvas_v1.jpg
LOGO_bss_cockatoo_flat_v1.png
REF_cockatoo_tail-yellow_reference_01.jpg
```

## Recommended workflow

1. Drop new files into `10_Unsorted_New` first.
2. Pick the correct collection.
3. Rename the file using the naming rule.
4. Add a gallery entry in `data/gallery-items.js`.
5. Add a label in `content/GALLERY_LABELS.md`.
6. Commit changes to GitHub.
