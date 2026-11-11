/* B$S shared components: Civilian Signal sign-up, Signal Radio player, store checkout
   buttons and scroll reveals. Every component is plain HTML first and works without
   this file; this script only upgrades it. Config lives in data/site-config.js and
   data/store-products.js. */
(function () {
  'use strict';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var config = window.BSS_SITE_CONFIG || {};

  /* ── Join the Civilian Signal ─────────────────────────────────────── */
  function initSignal(form) {
    if (form.dataset.bssReady) return;
    form.dataset.bssReady = '1';
    var signal = config.signal || {};
    var status = form.parentNode.querySelector('.bss-signal-status');
    var note = form.parentNode.querySelector('.bss-signal-note');
    var input = form.querySelector('input[type=email]');
    var live = Boolean(signal.action);
    if (live) {
      form.action = signal.action;
      form.method = 'post';
      form.removeAttribute('enctype');
      form.target = '_blank';
      input.name = signal.emailField || 'email';
      Object.keys(signal.hiddenFields || {}).forEach(function (key) {
        var hidden = document.createElement('input');
        hidden.type = 'hidden'; hidden.name = key; hidden.value = signal.hiddenFields[key];
        form.appendChild(hidden);
      });
    } else if (note) {
      note.textContent = 'Online sign-up opens soon. Until then, joining sends one short email to the studio — no spam, leave any time.';
    }
    form.addEventListener('submit', function (event) {
      if (!input.value || !input.checkValidity()) return;
      if (live) {
        if (status) status.textContent = 'Signal received. Check your inbox to confirm.';
        setTimeout(function () { form.reset(); }, 400);
        return;
      }
      event.preventDefault();
      var to = signal.fallbackEmail || 'bluesssnakestudio@gmail.com';
      var href = 'mailto:' + to + '?subject=' + encodeURIComponent('Join the Civilian Signal') +
        '&body=' + encodeURIComponent('Please add ' + input.value + ' to the Civilian Signal list.\n\nSent from ' + location.href);
      window.location.href = href;
      if (status) status.textContent = 'Your email app is opening — press send and you’re on the list.';
    });
  }

  /* ── Signal Radio ─────────────────────────────────────────────────── */
  function fmt(t) {
    if (!isFinite(t)) return '0:00';
    var m = Math.floor(t / 60), s = Math.floor(t % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }
  function initPlayer(root) {
    if (root.dataset.bssReady) return;
    root.dataset.bssReady = '1';
    var links = Array.prototype.slice.call(root.querySelectorAll('.bss-tracklist a[data-src]'));
    if (!links.length) return;
    var audio = root.querySelector('audio');
    var controls = root.querySelector('.bss-player-controls');
    var title = root.querySelector('.bss-player-title');
    var meta = root.querySelector('.bss-player-meta');
    var cover = root.querySelector('.bss-player-cover');
    var play = root.querySelector('.bss-play');
    var seek = root.querySelector('.bss-seek');
    var cur = root.querySelector('.bss-cur');
    var dur = root.querySelector('.bss-dur');
    var index = 0;
    audio.removeAttribute('controls');
    audio.hidden = true;
    controls.hidden = false;

    function load(i, autoplay) {
      index = (i + links.length) % links.length;
      var a = links[index];
      links.forEach(function (l) { l.setAttribute('aria-current', l === a ? 'true' : 'false'); });
      audio.src = a.dataset.src;
      title.textContent = a.dataset.title;
      meta.textContent = a.dataset.meta;
      if (a.dataset.cover) cover.style.backgroundImage = 'url("' + a.dataset.cover + '")';
      seek.value = 0; cur.textContent = '0:00'; dur.textContent = '0:00';
      if ('mediaSession' in navigator && window.MediaMetadata) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: a.dataset.title, artist: a.dataset.artist || 'Black Wing Crew', album: a.dataset.album || '',
          artwork: a.dataset.cover ? [{ src: a.dataset.cover, sizes: '512x512', type: 'image/jpeg' }] : []
        });
      }
      if (autoplay) audio.play().catch(function () {});
    }
    links.forEach(function (a, i) {
      a.addEventListener('click', function (e) { e.preventDefault(); load(i, true); });
    });
    play.addEventListener('click', function () {
      if (!audio.src) load(index, false);
      if (audio.paused) audio.play().catch(function () {}); else audio.pause();
    });
    root.querySelector('.bss-prev').addEventListener('click', function () { load(index - 1, true); });
    root.querySelector('.bss-next-track').addEventListener('click', function () { load(index + 1, true); });
    audio.addEventListener('play', function () { root.classList.add('is-playing'); play.textContent = '❚❚'; play.setAttribute('aria-label', 'Pause'); });
    audio.addEventListener('pause', function () { root.classList.remove('is-playing'); play.textContent = '►'; play.setAttribute('aria-label', 'Play'); });
    audio.addEventListener('ended', function () { load(index + 1, true); });
    audio.addEventListener('loadedmetadata', function () { dur.textContent = fmt(audio.duration); });
    audio.addEventListener('timeupdate', function () {
      if (audio.duration) seek.value = (audio.currentTime / audio.duration) * 1000;
      cur.textContent = fmt(audio.currentTime);
    });
    seek.addEventListener('input', function () { if (audio.duration) audio.currentTime = (seek.value / 1000) * audio.duration; });
    if ('mediaSession' in navigator) {
      try {
        navigator.mediaSession.setActionHandler('previoustrack', function () { load(index - 1, true); });
        navigator.mediaSession.setActionHandler('nexttrack', function () { load(index + 1, true); });
      } catch (e) {}
    }
    // Show the first track without fetching any audio (preload="none").
    var first = links[0];
    links[0].setAttribute('aria-current', 'true');
    title.textContent = first.dataset.title; meta.textContent = first.dataset.meta;
    audio.removeAttribute('src');
  }

  /* ── Store: payment links, falling back to the email order ────────── */
  function initStore() {
    var products = window.BSS_STORE_PRODUCTS || [];
    if (!products.length) return;
    var byId = {};
    products.forEach(function (p) { byId[p.id] = p; });
    document.querySelectorAll('a[data-product]').forEach(function (btn) {
      var p = byId[btn.dataset.product];
      if (!p || !p.paymentLink) return;            // no link yet → keep the email order
      btn.href = p.paymentLink;
      btn.target = '_blank';
      btn.rel = 'noopener';
      btn.classList.add('is-checkout');
      btn.innerHTML = (p.buyLabel || 'Buy now') + ' &#8594;';
      btn.setAttribute('aria-label', (p.buyLabel || 'Buy now') + ': ' + p.title + ' (secure checkout, opens in a new tab)');
    });
  }

  /* ── Scroll reveal ────────────────────────────────────────────────── */
  function initReveal(scope) {
    if (reduce || !('IntersectionObserver' in window)) return;
    var els = (scope || document).querySelectorAll('[data-bss-reveal]:not(.bss-reveal)');
    if (!els.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { el.classList.add('bss-reveal'); io.observe(el); });
  }

  function init(scope) {
    scope = scope || document;
    scope.querySelectorAll('form[data-bss-signal]').forEach(initSignal);
    scope.querySelectorAll('[data-bss-player]').forEach(initPlayer);
    initReveal(scope);
  }
  window.BSS_COMPONENTS = { init: init };
  function boot() { init(document); initStore(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
