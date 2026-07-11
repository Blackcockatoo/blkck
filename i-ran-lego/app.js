(() => {
  const T = window.IRAN_TIMING;
  const C = window.IRAN_CAMERA;
  const CFG = window.IRAN_CONFIG;
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));
  const ease = t => t<.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;
  const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(Math.floor(s%60)).padStart(2,"0")}`;

  const state = {
    entitled: false,
    preview: true,
    currentCue: null,
    currentPage: null,
    activeImg: 0,
    explore: false,
    exploreX: .5,
    exploreY: .5,
    exploreZoom: 1.15,
    dragging: false,
    dragStart: null,
    lastTime: 0
  };

  const audio = $("#audio");
  const shell = $("#playerShell");
  const seek = $("#seek");
  const time = $("#time");
  const play = $("#play");
  const pageImgs = [$("#pageA"), $("#pageB")];
  const stage = $("#stage");
  const lyrics = $("#lyrics");
  const dot = $("#dot");
  const chapterChip = $("#chapterChip");
  const progress = $("#lyricProgress");
  const lockOverlay = $("#lockOverlay");
  const pageTurn = $("#pageTurn");
  const chapterSelect = $("#chapterSelect");
  const modal = $("#purchaseModal");
  const toast = $("#toast");

  const chapters = [];
  for (const cue of T.cues) {
    if (!chapters.some(c=>c.name===cue.section)) chapters.push({name:cue.section,start:cue.start,page:cue.page});
  }
  chapters.unshift({name:"THE PROGRAMME OPENS",start:0,page:1});
  chapters.push({name:"PREVIEW END",start:65.2,page:6});

  chapterSelect.innerHTML = chapters.map((c,i)=>`<option value="${i}">${c.name}</option>`).join("");

  function showToast(text){
    toast.textContent=text; toast.classList.add("show");
    clearTimeout(showToast.t); showToast.t=setTimeout(()=>toast.classList.remove("show"),2200);
  }

  function entitlement(on=true){
    state.entitled=on;
    if(on) localStorage.setItem("iran-lego-entitlement","full");
    else localStorage.removeItem("iran-lego-entitlement");
    lockOverlay.classList.remove("show");
    updateAccessUI();
  }
  function updateAccessUI(){
    $$("[data-access-state]").forEach(el=>el.textContent="OPEN PREVIEW");
  }

  function openPlayer(){
    state.preview = true;
    shell.classList.add("open"); document.body.classList.add("no-scroll");
    audio.currentTime = 0;
    seek.max = T.duration;
    lockOverlay.classList.remove("show");
    render(true);
  }
  function closePlayer(){
    audio.pause(); shell.classList.remove("open"); document.body.classList.remove("no-scroll");
  }

  function openPurchase(type){
    const product=CFG.products[type]||CFG.products.digital;
    $("#purchaseName").textContent=product.label;
    $("#purchasePrice").textContent=product.priceLabel;
    $("#purchaseAction").dataset.type=type;
    modal.classList.add("open");
  }
  function closeModal(){ modal.classList.remove("open"); }

  function currentShot(t){
    let lo=0,hi=C.shots.length-1,ans=C.shots[0];
    while(lo<=hi){const mid=(lo+hi)>>1,s=C.shots[mid];if(s.start<=t){ans=s;lo=mid+1}else hi=mid-1}
    return ans;
  }
  function currentCue(t){
    let lo=0,hi=T.cues.length-1,ans=null;
    while(lo<=hi){const mid=(lo+hi)>>1,c=T.cues[mid];if(c.start<=t){ans=c;lo=mid+1}else hi=mid-1}
    return ans && t<=ans.end+.8 ? ans : null;
  }
  function currentChapterIndex(t){
    let idx=0;
    chapters.forEach((c,i)=>{if(c.start<=t) idx=i});
    return idx;
  }

  function pageSrc(page){return window.IRAN_PAGE_URLS?.[page] || ""}
  function setPage(page, force=false){
    if(page===state.currentPage && !force) return;
    const next=1-state.activeImg, old=state.activeImg;
    const img=pageImgs[next];
    img.src=pageSrc(page); img.alt=`Book page ${page}`;
    img.onload=()=>{ img.style.opacity="1"; pageImgs[old].style.opacity="0"; };
    state.activeImg=next; state.currentPage=page;
    pageTurn.classList.remove("go"); void pageTurn.offsetWidth; pageTurn.classList.add("go");
  }

  function placeImage(img, x, y, zoom){
    const sw=stage.clientWidth, sh=stage.clientHeight;
    const naturalRatio=(img.naturalWidth||1273)/(img.naturalHeight||1600);
    let h=sh*zoom, w=h*naturalRatio;
    if(w<sw*1.02 && zoom<=1.2){w=sw*1.02;h=w/naturalRatio}
    img.style.width=`${w}px`; img.style.height=`${h}px`;
    img.style.left=`${sw/2-x*w}px`; img.style.top=`${sh/2-y*h}px`;
  }

  function renderCue(cue,t){
    if(!cue){
      if(state.currentCue!==null){lyrics.innerHTML="";lyrics.className="lyrics";dot.style.opacity=0;chapterChip.textContent=t<8.06?"THE PROGRAMME OPENS":"B$S STORYBOOK TELEVISION";state.currentCue=null}
      return;
    }
    if(state.currentCue!==cue.cue_id){
      state.currentCue=cue.cue_id;
      chapterChip.textContent=cue.section;
      const density = cue.text.length > 46 || cue.words.length > 8 ? "dense" : cue.text.length > 30 || cue.words.length > 5 ? "compact" : "sparse";
      lyrics.className = `lyrics ${density}`;
      lyrics.innerHTML=cue.words.map((w,i)=>`<span class="word" data-i="${i}">${escapeHtml(w.word)}</span>`).join(" ");
    }
    let active=-1;
    cue.words.forEach((w,i)=>{if(t>=w.start) active=i});
    $$(".word",lyrics).forEach((el,i)=>el.className=`word${i<active?" done":i===active?" active":""}`);
    const activeEl=$(`.word[data-i="${active}"]`,lyrics);
    if(activeEl){
      const pr=$(".lyric-panel").getBoundingClientRect(), wr=activeEl.getBoundingClientRect();
      const cx=wr.left-pr.left+wr.width/2-10;
      const base=wr.bottom-pr.top+9;
      const w=cue.words[active];
      const local=clamp((t-w.start)/Math.max(.12,w.end-w.start),0,1);
      const bounce=-Math.sin(local*Math.PI)*12;
      dot.style.opacity=1;
      dot.style.transform=`translate3d(${cx}px,${base+bounce}px,0)`;
    }else dot.style.opacity=0;
  }
  function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

  function render(force=false){
    const t=audio.currentTime||0;
    seek.value=t; time.textContent=`${fmt(t)} / ${fmt(T.duration)}`;
    progress.style.width=`${(t/T.duration)*100}%`;
    play.textContent=audio.paused?"▶":"❚❚";
    const ci=currentChapterIndex(t); chapterSelect.value=String(ci);

    const shot=currentShot(t);
    setPage(shot.page,force);
    const img=pageImgs[state.activeImg];
    if(img.complete){
      if(state.explore){
        placeImage(img,state.exploreX,state.exploreY,state.exploreZoom);
      }else{
        const moveEnd=Math.max(shot.start+.05,shot.move_end);
        const p=ease(clamp((t-shot.start)/(moveEnd-shot.start),0,1));
        const x=shot.from_x+(shot.to_x-shot.from_x)*p;
        const y=shot.from_y+(shot.to_y-shot.from_y)*p;
        const z=shot.from_zoom+(shot.to_zoom-shot.from_zoom)*p;
        placeImage(img,x,y,z);
      }
    }
    renderCue(currentCue(t),t);

    if(state.preview && !state.entitled && t>=CFG.previewSeconds){
      audio.pause(); lockOverlay.classList.add("show");
    }
    state.lastTime=t;
    requestAnimationFrame(()=>render(false));
  }

  function togglePlay(){
    if(state.explore) toggleExplore(false);
    if(audio.paused) audio.play().catch(()=>showToast("Tap play once more to start audio")); else audio.pause();
  }
  function seekTo(v){audio.currentTime=clamp(Number(v),0,T.duration);render(true)}
  function toggleExplore(force){
    state.explore=typeof force==="boolean"?force:!state.explore;
    if(state.explore){
      audio.pause();
      const shot=currentShot(audio.currentTime);
      state.exploreX=shot.to_x;state.exploreY=shot.to_y;state.exploreZoom=Math.max(1.15,shot.to_zoom);
      stage.classList.add("explore");$("#explore").textContent="EXIT EXPLORE";
    }else{stage.classList.remove("explore");$("#explore").textContent="EXPLORE PAGE"}
  }

  $$("[data-open-player]").forEach(b=>b.addEventListener("click",()=>openPlayer()));
  $$("[data-buy]").forEach(b=>b.addEventListener("click",()=>openPurchase(b.dataset.buy)));
  $("#closePlayer").addEventListener("click",closePlayer);
  $("#closeModal").addEventListener("click",closeModal);
  modal.addEventListener("click",e=>{if(e.target===modal)closeModal()});
  play.addEventListener("click",togglePlay);
  seek.addEventListener("input",e=>seekTo(e.target.value));
  chapterSelect.addEventListener("change",e=>seekTo(chapters[Number(e.target.value)].start));
  $("#backChapter").addEventListener("click",()=>seekTo(chapters[Math.max(0,currentChapterIndex(audio.currentTime)-1)].start));
  $("#nextChapter").addEventListener("click",()=>seekTo(chapters[Math.min(chapters.length-1,currentChapterIndex(audio.currentTime)+1)].start));
  $("#fullscreen").addEventListener("click",()=>shell.requestFullscreen?.());
  $("#lyricsToggle").addEventListener("change",e=>$(".lyric-panel").style.visibility=e.target.checked?"visible":"hidden");
  $("#explore").addEventListener("click",()=>toggleExplore());
  $("#unlockFromLock").addEventListener("click",()=>openPurchase("digital"));
  $("#keepPreviewing").addEventListener("click",()=>{lockOverlay.classList.remove("show");audio.currentTime=0});
  $("#purchaseAction").addEventListener("click",()=>{
    const type=$("#purchaseAction").dataset.type;
    const url=CFG.products[type]?.checkoutUrl;
    if(url){location.href=url;return}
    showToast("Edition enquiry is not configured yet.");
  });
  $("#demoUnlock")?.addEventListener("click",()=>{entitlement(true);closeModal();openPlayer()});
  $("#resetAccess")?.addEventListener("click",()=>entitlement(false));

  stage.addEventListener("pointerdown",e=>{
    if(!state.explore)return;state.dragging=true;stage.setPointerCapture(e.pointerId);
    state.dragStart={x:e.clientX,y:e.clientY,px:state.exploreX,py:state.exploreY}
  });
  stage.addEventListener("pointermove",e=>{
    if(!state.dragging||!state.explore)return;
    const img=pageImgs[state.activeImg];
    const w=parseFloat(img.style.width)||stage.clientWidth,h=parseFloat(img.style.height)||stage.clientHeight;
    state.exploreX=clamp(state.dragStart.px-(e.clientX-state.dragStart.x)/w,0,1);
    state.exploreY=clamp(state.dragStart.py-(e.clientY-state.dragStart.y)/h,0,1);
  });
  stage.addEventListener("pointerup",()=>state.dragging=false);
  stage.addEventListener("wheel",e=>{
    if(!state.explore)return;e.preventDefault();
    state.exploreZoom=clamp(state.exploreZoom*(e.deltaY>0?.92:1.08),1,4);
  },{passive:false});

  document.addEventListener("keydown",e=>{
    if(!shell.classList.contains("open"))return;
    if(e.code==="Space"){e.preventDefault();togglePlay()}
    if(e.code==="Escape"&&!document.fullscreenElement)closePlayer();
    if(e.code==="ArrowRight")seekTo(audio.currentTime+5);
    if(e.code==="ArrowLeft")seekTo(audio.currentTime-5);
  });

  updateAccessUI();
  seek.max=T.duration;
  render(true);
})();
