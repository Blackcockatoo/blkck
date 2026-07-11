(() => {
  const pageNumbers = [1, 2, 4, 5, 6];
  const audioParts = ['part-000.bin', 'part-001.bin', 'part-002.bin', 'part-003.bin', 'part-004.bin', 'part-005.bin', 'part-006.bin', 'part-007.bin', 'part-008.bin', 'part-009.bin', 'part-010.bin', 'part-011.bin', 'part-012.bin', 'part-013.bin', 'part-014.bin', 'part-015.bin', 'part-016.bin', 'part-017.bin', 'part-018.bin', 'part-019.bin', 'part-020.bin', 'part-021.bin', 'part-022.bin'];
  const decode = text => {
    const raw = atob(text.trim());
    const bytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i += 1) bytes[i] = raw.charCodeAt(i);
    return bytes;
  };
  const read = async path => {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Media failed: ${path}`);
    return decode(await response.text());
  };
  const loadPages = Promise.all(pageNumbers.map(async page => {
    const key = String(page).padStart(2, "0");
    const bytes = await read(`assets/pages-b64/page-${key}.b64`);
    return [page, URL.createObjectURL(new Blob([bytes], {type: "image/webp"}))];
  })).then(entries => Object.fromEntries(entries));
  const loadAudio = Promise.all(audioParts.map(name => read(`assets/audio-parts/${name.replace('.bin','.b64')}`))).then(parts => {
    const total = parts.reduce((sum, part) => sum + part.length, 0);
    const joined = new Uint8Array(total);
    let offset = 0;
    for (const part of parts) { joined.set(part, offset); offset += part.length; }
    return URL.createObjectURL(new Blob([joined], {type: "audio/ogg; codecs=opus"}));
  });
  Promise.all([loadPages, loadAudio]).then(([pages, audioUrl]) => {
    window.IRAN_PAGE_URLS = pages;
    const cover = document.getElementById("coverPage");
    if (cover) cover.src = pages[1];
    const audio = document.getElementById("audio");
    audio.src = audioUrl;
    audio.load();
    document.querySelectorAll("[data-media-gated]").forEach(button => { button.disabled = false; });
    const script = document.createElement("script");
    script.src = "app.js";
    document.body.appendChild(script);
  }).catch(error => {
    console.error(error);
    document.querySelectorAll("[data-media-gated]").forEach(button => { button.textContent = "PREVIEW UNAVAILABLE"; });
  });
})();
