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
      note.textContent = form.dataset.msgNoteFallback || 'Online sign-up opens soon. Until then, joining sends one short email to the studio — no spam, leave any time.';
    }
    form.addEventListener('submit', function (event) {
      if (!input.value || !input.checkValidity()) return;
      if (live) {
        if (status) status.textContent = form.dataset.msgStatusLive || 'Signal received. Check your inbox to confirm.';
        setTimeout(function () { form.reset(); }, 400);
        return;
      }
      event.preventDefault();
      var to = signal.fallbackEmail || 'bluesssnakestudio@gmail.com';
      var href = 'mailto:' + to + '?subject=' + encodeURIComponent('Join the Civilian Signal') +
        '&body=' + encodeURIComponent('Please add ' + input.value + ' to the Civilian Signal list.\n\nSent from ' + location.href);
      window.location.href = href;
      if (status) status.textContent = form.dataset.msgStatusMail || 'Your email app is opening — press send and you’re on the list.';
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
    var labelPlay = root.dataset.labelPlay || 'Play', labelPause = root.dataset.labelPause || 'Pause';
    audio.addEventListener('play', function () { root.classList.add('is-playing'); play.textContent = '❚❚'; play.setAttribute('aria-label', labelPause); });
    audio.addEventListener('pause', function () { root.classList.remove('is-playing'); play.textContent = '►'; play.setAttribute('aria-label', labelPlay); });
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
      var label = btn.dataset.buyLabel || p.buyLabel || 'Buy now';
      btn.innerHTML = label + ' &#8594;';
      btn.setAttribute('aria-label', label + ': ' + p.title + (btn.dataset.buyLabel ? '' : ' (secure checkout, opens in a new tab)'));
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

  /* ── Languages: remember the choice; offer ja/hi to matching browsers ── */
  var LANG_OFFER = {
    ja: { text: 'このサイトは日本語でもご覧いただけます。', go: '日本語で見る', close: '閉じる' },
    hi: { text: 'यह साइट हिन्दी में भी उपलब्ध है।', go: 'हिन्दी में देखें', close: 'बंद करें' }
  };
  function store(key, value) { try { if (value === undefined) return localStorage.getItem(key); localStorage.setItem(key, value); } catch (e) { return null; } }
  function initLang() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[data-bss-lang]');
      if (a) store('bss-lang', a.dataset.bssLang);
    });
    var pageLang = (document.documentElement.lang || 'en').slice(0, 2);
    if (pageLang !== 'en' || store('bss-lang') || store('bss-lang-dismissed')) return;
    var prefs = (navigator.languages || [navigator.language || '']).map(function (l) { return String(l).slice(0, 2).toLowerCase(); });
    var want = null;
    for (var i = 0; i < prefs.length && !want; i++) { if (prefs[i] === 'en') return; if (LANG_OFFER[prefs[i]]) want = prefs[i]; }
    var alt = want && document.querySelector('link[rel="alternate"][hreflang="' + want + '"]');
    var href = alt ? new URL(alt.href).pathname : (want ? '/' + want + '/' : null);
    if (!want || !href) return;
    var o = LANG_OFFER[want];
    var toast = document.createElement('div');
    toast.className = 'bss-lang-toast'; toast.lang = want; toast.setAttribute('role', 'region'); toast.setAttribute('aria-label', o.text);
    toast.innerHTML = '<span></span><a data-bss-lang="' + want + '" hreflang="' + want + '"></a><button type="button">×</button>';
    toast.querySelector('span').textContent = o.text;
    toast.querySelector('a').textContent = o.go;
    toast.querySelector('a').href = href;
    toast.querySelector('button').setAttribute('aria-label', o.close);
    toast.querySelector('button').addEventListener('click', function () { store('bss-lang-dismissed', '1'); toast.remove(); });
    document.body.appendChild(toast);
  }

  /* Globe menu: <details> does the open/close; this adds outside click, Escape, arrow keys and aria-expanded. */
  function initLangMenus() {
    var menus = [].slice.call(document.querySelectorAll('details[data-bss-langmenu]'));
    if (!menus.length) return;
    function sync(d) { var s = d.querySelector('summary'); if (s) s.setAttribute('aria-expanded', d.open ? 'true' : 'false'); }
    function close(d, focus) { if (!d.open) return; d.open = false; sync(d); if (focus) { var s = d.querySelector('summary'); if (s) s.focus(); } }
    menus.forEach(function (d) {
      var summary = d.querySelector('summary');
      var links = function () { return [].slice.call(d.querySelectorAll('a[data-bss-lang]')); };
      d.addEventListener('toggle', function () {
        sync(d);
        if (d.open) {
          menus.forEach(function (o) { if (o !== d) close(o); });
          if (d._kbd) { var cur = d.querySelector('a[aria-current]') || links()[0]; if (cur) cur.focus(); }
        }
        d._kbd = false;
      });
      summary.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') d._kbd = true;
        if (e.key === 'ArrowDown' && !d.open) { e.preventDefault(); d._kbd = true; d.open = true; }
      });
      d.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && d.open) { e.preventDefault(); e.stopPropagation(); close(d, true); return; }
        if (!d.open || (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Home' && e.key !== 'End')) return;
        var l = links(); var i = l.indexOf(document.activeElement);
        if (i < 0 && document.activeElement !== summary) return;
        e.preventDefault();
        var n = e.key === 'Home' ? 0 : e.key === 'End' ? l.length - 1 : e.key === 'ArrowDown' ? (i + 1) % l.length : (i <= 0 ? l.length - 1 : i - 1);
        l[n].focus();
      });
      d.addEventListener('focusout', function (e) { if (d.open && e.relatedTarget && !d.contains(e.relatedTarget)) close(d); });
      d.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('a[data-bss-lang]')) close(d); });
      sync(d);
    });
    // Hand-written pages keep their own header: give it room on the right so the pinned globe never covers a link.
    var float = document.querySelector('details.bss-langmenu-float');
    if (float) {
      var bars = [].slice.call(document.querySelectorAll('header, nav.masthead, .masthead'));
      for (var k = 0; k < bars.length; k++) {
        var bar = bars[k];
        if (float.contains(bar) || bar.closest('.bss-embed, footer')) continue;
        var r = bar.getBoundingClientRect();
        if (r.top > 80 || r.width < window.innerWidth * 0.6) continue;
        var pad = parseFloat(getComputedStyle(bar).paddingRight) || 0;
        bar.style.paddingRight = Math.max(pad, 0) + 52 + 'px';
        bar.setAttribute('data-bss-langroom', '');
        break;
      }
    }
    document.addEventListener('click', function (e) { menus.forEach(function (d) { if (d.open && !d.contains(e.target)) close(d); }); });
    // Coming back via the back/forward cache must not show a stale open menu.
    window.addEventListener('pageshow', function () { menus.forEach(function (d) { close(d); }); });
  }

  function init(scope) {
    scope = scope || document;
    scope.querySelectorAll('form[data-bss-signal]').forEach(initSignal);
    scope.querySelectorAll('[data-bss-player]').forEach(initPlayer);
    initReveal(scope);
  }
  window.BSS_COMPONENTS = { init: init };
  function boot() { init(document); initStore(); initLang(); initLangMenus(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
