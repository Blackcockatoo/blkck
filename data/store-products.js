/* ─────────────────────────────────────────────────────────────────────────
   B$S store — one entry per product card on store.html (matched by id).
   To switch a product to real checkout, paste its payment link into paymentLink:
     • Stripe:  Dashboard → Payment Links → Create → copy  https://buy.stripe.com/…
     • Gumroad: product → Share → copy  https://<you>.gumroad.com/l/…
     • Any other hosted checkout URL works too.
   Empty paymentLink = the button stays as the current email order (nothing breaks).
   Optional: buyLabel: 'Buy digital — $8' to change the button text.
   ───────────────────────────────────────────────────────────────────────── */
(function (root) {
  var products = [
  {
    "id": "the-ledger-the-witness-old-vic-state",
    "title": "The Ledger & The Witness — Old Vic State",
    "price": "From $18 AUD",
    "paymentLink": ""
  },
  {
    "id": "auralia-cockatoo-snake",
    "title": "Auralia — Cockatoo & Snake",
    "price": "From $8 AUD",
    "paymentLink": ""
  },
  {
    "id": "black-birds-dream-the-omen",
    "title": "Black Birds Dream — The Omen",
    "price": "From $8 AUD",
    "paymentLink": ""
  },
  {
    "id": "the-sign-dreams-the-seer",
    "title": "The Sign Dreams the Seer",
    "price": "From $8 AUD",
    "paymentLink": ""
  },
  {
    "id": "black-birds-dream-moon-omen",
    "title": "Black Birds Dream — Moon & Omen",
    "price": "From $8 AUD",
    "paymentLink": ""
  },
  {
    "id": "auralia-blue-gold-halo",
    "title": "Auralia Blue — Gold Halo",
    "price": "From $8 AUD",
    "paymentLink": ""
  },
  {
    "id": "auralia-clock-compass-torii",
    "title": "Auralia — Clock, Compass & Torii",
    "price": "From $8 AUD",
    "paymentLink": ""
  },
  {
    "id": "auralia-silhouette-landscape",
    "title": "Auralia Silhouette — Landscape",
    "price": "From $8 AUD",
    "paymentLink": ""
  },
  {
    "id": "ouroboros-golden-fire",
    "title": "Ouroboros — Golden Fire",
    "price": "From $8 AUD",
    "paymentLink": ""
  },
  {
    "id": "auralia-blue-portrait",
    "title": "Auralia — Blue Portrait",
    "price": "From $8 AUD",
    "paymentLink": ""
  },
  {
    "id": "blue-snake-studios-two-voices",
    "title": "Blue $nake Studios — Two Voices",
    "price": "From $8 AUD",
    "paymentLink": ""
  },
  {
    "id": "auralia-dark-minimal-gold",
    "title": "Auralia — Dark Minimal Gold",
    "price": "From $8 AUD",
    "paymentLink": ""
  }
];
  if (typeof module !== 'undefined' && module.exports) module.exports = products; else root.BSS_STORE_PRODUCTS = products;
})(typeof window !== 'undefined' ? window : this);
