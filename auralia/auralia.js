(() => {
  'use strict';

  const root = document.querySelector('[data-auralia-root]');
  if (!root) return;

  const edition = root.dataset.edition || '01';
  const editionBase = `/auralia/edition-${edition}`;
  const archiveName = root.dataset.archive || `Auralia_Edition_${edition}_Phone_Theme.zip`;

  const elements = {
    imageA: document.getElementById('wallpaper-image-a'),
    imageB: document.getElementById('wallpaper-image-b'),
    phoneStage: document.getElementById('phone-preview'),
    themeIndex: document.getElementById('theme-index'),
    themeTotal: document.getElementById('theme-total'),
    themeTitle: document.getElementById('theme-title'),
    themeFocal: document.getElementById('theme-focal'),
    modeCopy: document.getElementById('mode-copy'),
    currentDownload: document.getElementById('current-download'),
    currentDownloadLabel: document.getElementById('current-download-label'),
    pairDownload: document.getElementById('pair-download'),
    completeDownload: document.getElementById('complete-download'),
    previous: document.getElementById('previous-theme'),
    next: document.getElementById('next-theme'),
    dots: document.getElementById('theme-dots'),
    galleryError: document.getElementById('gallery-error'),
    toast: document.getElementById('download-toast')
  };

  const modeDescriptions = {
    lock: 'The dramatic version, composed around the clock and notifications.',
    home: 'The calmer version, composed behind app icons and widgets.'
  };

  let manifest = null;
  let themes = [];
  let themeIndex = 0;
  let mode = 'lock';
  let device = 'ios';
  let currentImage = elements.imageA;
  let currentPreviewPath = elements.imageA.getAttribute('src');
  let requestedPreviewPath = currentPreviewPath;
  let imageTransition = 0;
  let toastTimer = 0;
  let pointerStart = null;

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function fileName(path) {
    return String(path || '').split('/').pop();
  }

  function assetUrl(path) {
    return `${editionBase}/${String(path || '').replace(/^\/+/, '')}`;
  }

  function previewUrl(theme, selectedMode) {
    return assetUrl(`03_Previews/${pad(theme.id)}_${theme.slug}_${selectedMode.toUpperCase()}_preview.jpg`);
  }

  function pairUrl(theme) {
    return assetUrl(`05_Pairs/${pad(theme.id)}_Auralia_${theme.slug}_PAIR.zip`);
  }

  function pairFileName(theme) {
    return `${pad(theme.id)}_Auralia_${theme.slug}_PAIR.zip`;
  }

  function prettyResolution(value) {
    return String(value || '1440×2560').replace(/\s*×\s*/, ' × ');
  }

  function detectDevice() {
    const userAgent = navigator.userAgent || '';
    const isTouchMac = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
    if (/Android/i.test(userAgent)) return 'android';
    if (/iPhone|iPad|iPod/i.test(userAgent) || isTouchMac) return 'ios';
    return 'ios';
  }

  function setDevice(nextDevice, shouldAnnounce = false) {
    device = nextDevice === 'android' ? 'android' : 'ios';
    root.dataset.device = device;
    document.documentElement.dataset.device = device;

    document.querySelectorAll('[data-device-choice]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.deviceChoice === device));
    });
    document.querySelectorAll('[data-device-guide]').forEach((guide) => {
      guide.hidden = guide.dataset.deviceGuide !== device;
    });

    if (shouldAnnounce) {
      showToast(`${device === 'ios' ? 'iPhone' : 'Android'} instructions selected.`);
    }
  }

  function validateManifest(candidate) {
    if (!candidate || !Array.isArray(candidate.wallpapers) || !candidate.wallpapers.length) {
      throw new Error('Auralia manifest has no wallpapers.');
    }

    const valid = candidate.wallpapers.every((theme) => (
      theme && theme.id != null && theme.title && theme.slug && theme.lock && theme.home
    ));
    if (!valid) throw new Error('Auralia manifest is missing required wallpaper fields.');
    return candidate;
  }

  function buildDots() {
    elements.dots.replaceChildren();
    themes.forEach((theme, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.themeIndex = String(index);
      button.setAttribute('aria-label', `Theme ${index + 1}: ${theme.title}`);
      elements.dots.appendChild(button);
    });
  }

  function showPreview(path) {
    if (!path || requestedPreviewPath === path) return;

    requestedPreviewPath = path;
    if (currentPreviewPath === path) {
      imageTransition += 1;
      const inactive = currentImage === elements.imageA ? elements.imageB : elements.imageA;
      inactive.classList.remove('is-visible');
      currentImage.classList.add('is-visible');
      return;
    }

    const incoming = currentImage === elements.imageA ? elements.imageB : elements.imageA;
    const transition = ++imageTransition;

    incoming.classList.remove('is-visible');
    incoming.removeAttribute('src');

    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      const decode = typeof incoming.decode === 'function'
        ? incoming.decode().catch(() => undefined)
        : Promise.resolve();

      decode.then(() => {
        if (transition !== imageTransition) return;
        incoming.classList.add('is-visible');
        currentImage.classList.remove('is-visible');
        currentImage = incoming;
        currentPreviewPath = path;
      });
    };

    incoming.addEventListener('load', reveal, { once: true });
    incoming.addEventListener('error', () => {
      if (transition === imageTransition) showToast('That preview could not load. Try the next theme.');
    }, { once: true });
    incoming.src = path;
    if (incoming.complete && incoming.naturalWidth) reveal();
  }

  function prefetchNearby() {
    if (themes.length < 2) return;
    const indexes = [
      (themeIndex + 1) % themes.length,
      (themeIndex - 1 + themes.length) % themes.length
    ];

    const preload = () => {
      indexes.forEach((index) => {
        ['lock', 'home'].forEach((selectedMode) => {
          const image = new Image();
          image.src = previewUrl(themes[index], selectedMode);
        });
      });
    };

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(preload, { timeout: 700 });
    } else {
      window.setTimeout(preload, 120);
    }
  }

  function render() {
    if (!themes.length) return;
    const theme = themes[themeIndex];
    const selectedPath = theme[mode];
    const selectedFile = fileName(selectedPath);
    const modeName = mode === 'lock' ? 'Lock' : 'Home';

    root.dataset.mode = mode;
    elements.themeIndex.textContent = pad(themeIndex + 1);
    elements.themeTotal.textContent = pad(themes.length);
    elements.themeTitle.textContent = theme.title;
    elements.themeFocal.textContent = String(theme.focal || '').replace(/\s*\/\s*/g, ' · ');
    elements.modeCopy.textContent = modeDescriptions[mode];
    elements.currentDownload.href = assetUrl(selectedPath);
    elements.currentDownload.download = selectedFile;
    elements.currentDownload.setAttribute('aria-label', `Download ${theme.title} ${modeName} wallpaper`);
    elements.currentDownloadLabel.textContent = `${modeName} · ${prettyResolution(manifest.resolution)} JPG`;
    elements.pairDownload.href = pairUrl(theme);
    elements.pairDownload.download = pairFileName(theme);
    elements.pairDownload.setAttribute('aria-label', `Download ${theme.title} Lock and Home pair`);
    elements.phoneStage.setAttribute(
      'aria-label',
      `${theme.title} ${modeName} Screen wallpaper preview, theme ${themeIndex + 1} of ${themes.length}. Use the left and right arrow keys or swipe to change theme.`
    );

    document.querySelectorAll('[data-mode-choice]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.modeChoice === mode));
    });
    elements.dots.querySelectorAll('[data-theme-index]').forEach((button, index) => {
      const active = index === themeIndex;
      button.classList.toggle('is-active', active);
      if (active) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });

    showPreview(previewUrl(theme, mode));
    prefetchNearby();
  }

  function goToTheme(nextIndex) {
    if (!themes.length) return;
    themeIndex = (nextIndex + themes.length) % themes.length;
    render();
  }

  function setMode(nextMode) {
    if (nextMode !== 'lock' && nextMode !== 'home') return;
    if (mode === nextMode) return;
    mode = nextMode;
    render();
  }

  function showToast(message) {
    window.clearTimeout(toastTimer);
    elements.toast.textContent = message;
    elements.toast.classList.add('is-visible');
    toastTimer = window.setTimeout(() => {
      elements.toast.classList.remove('is-visible');
    }, 2800);
  }

  function downloadMessage(kind) {
    if (kind === 'complete') return 'Complete Edition 01 download started.';
    if (kind === 'pair') return 'Lock + Home pair download started.';
    if (device === 'ios') return 'Wallpaper ready. If it opens, touch and hold to save it.';
    return 'Wallpaper download started. Find it in Downloads.';
  }

  function bindInteractions() {
    document.querySelectorAll('[data-mode-choice]').forEach((button) => {
      button.addEventListener('click', () => setMode(button.dataset.modeChoice));
    });

    document.querySelectorAll('[data-device-choice]').forEach((button) => {
      button.addEventListener('click', () => setDevice(button.dataset.deviceChoice, true));
    });

    elements.previous.addEventListener('click', () => goToTheme(themeIndex - 1));
    elements.next.addEventListener('click', () => goToTheme(themeIndex + 1));

    elements.dots.addEventListener('click', (event) => {
      const button = event.target.closest('[data-theme-index]');
      if (!button) return;
      goToTheme(Number(button.dataset.themeIndex));
    });

    elements.phoneStage.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToTheme(themeIndex - 1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goToTheme(themeIndex + 1);
      }
    });

    elements.phoneStage.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      pointerStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
    });

    elements.phoneStage.addEventListener('pointercancel', () => {
      pointerStart = null;
    });

    elements.phoneStage.addEventListener('pointerup', (event) => {
      if (!pointerStart || event.pointerId !== pointerStart.id) return;
      const deltaX = event.clientX - pointerStart.x;
      const deltaY = event.clientY - pointerStart.y;
      pointerStart = null;

      if (Math.abs(deltaX) < 44 || Math.abs(deltaX) <= Math.abs(deltaY) * 1.15) return;
      goToTheme(deltaX < 0 ? themeIndex + 1 : themeIndex - 1);
    });

    document.querySelectorAll('[data-download-kind]').forEach((link) => {
      link.addEventListener('click', () => showToast(downloadMessage(link.dataset.downloadKind)));
    });
  }

  async function loadEdition() {
    try {
      const response = await fetch(assetUrl('manifest.json'), {
        credentials: 'same-origin',
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) throw new Error(`Auralia manifest returned ${response.status}.`);

      manifest = validateManifest(await response.json());
      themes = manifest.wallpapers;
      elements.completeDownload.href = assetUrl(archiveName);
      elements.completeDownload.download = archiveName;
      buildDots();
      render();
      root.dataset.state = 'ready';
      root.setAttribute('aria-busy', 'false');
    } catch (error) {
      root.dataset.state = 'error';
      root.setAttribute('aria-busy', 'false');
      elements.galleryError.hidden = false;
      elements.previous.disabled = true;
      elements.next.disabled = true;
    }
  }

  setDevice(detectDevice());
  bindInteractions();
  loadEdition();
})();
