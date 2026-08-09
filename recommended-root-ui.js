// Recommended-form hero + 12-note root pad. UI-only enhancement.
(() => {
  const roots=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  const rootSel=document.querySelector('#rootSelect');
  const typeSel=document.querySelector('#typeSelect');
  const bassSel=document.querySelector('#bassSelect');
  const controls=document.querySelector('.selection-filters');
  const host=document.querySelector('#selectedChord');
  if(!rootSel||!typeSel||!bassSel||!controls||!host) return;

  const esc=s=>String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const isPdf=s=>/PDF|資料/.test(s||'');
  const isBossa=s=>/Bossa/.test(s||'');
  const isJazz=s=>/Jazz|Shell|Drop2|Drop3|Voicing/.test(s||'');
  const isEasy=s=>/初心者|オープンコード|Open|簡易/.test(s||'');
  const score=(f,i)=>{
    const s=f?.shape||'';
    let n=100-i;
    if(isEasy(s)) n+=80;
    if(/定番|CAGED|6弦ルート|5弦ルート/.test(s)) n+=55;
    if(isPdf(s)) n-=10;
    if(isBossa(s)||isJazz(s)) n-=15;
    if(/Drop|転回|Quartal|4度堆積|特殊/.test(s)) n-=30;
    return n;
  };
  const badge=s=>isEasy(s)?'🔰 弾きやすい':isBossa(s)?'🌴 Bossa':isJazz(s)?'🎷 Jazz':isPdf(s)?'📘 資料':'🎸 おすすめ';

  let rootPad=document.querySelector('.root-note-pad');
  if(!rootPad){
    rootPad=document.createElement('div'); rootPad.className='root-note-pad';
    rootPad.innerHTML=`<div class="root-note-pad-head"><b>ルート音</b><span>1タップで切替</span></div><div class="root-note-buttons">${roots.map(r=>`<button type="button" data-root="${r}">${r}</button>`).join('')}</div>`;
    controls.parentNode.insertBefore(rootPad,controls);
    rootPad.addEventListener('click',e=>{
      const b=e.target.closest('button[data-root]'); if(!b) return;
      rootSel.value=b.dataset.root;
      rootSel.dispatchEvent(new Event('change',{bubbles:true}));
      syncRoot();
    });
  }
  function syncRoot(){ rootPad.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.root===rootSel.value)); }
  rootSel.addEventListener('change',syncRoot); syncRoot();

  function mountHero(){
    if(typeof getForms!=='function') return;
    const forms=getForms(rootSel.value,typeSel.value,bassSel.value||'none')||[];
    if(!forms.length) return;
    const ranked=forms.map((f,i)=>({f,i,n:score(f,i)})).sort((a,b)=>b.n-a.n);
    const best=ranked[0];
    let hero=host.querySelector('.recommended-form-hero');
    if(!hero){ hero=document.createElement('div'); hero.className='recommended-form-hero'; host.prepend(hero); }
    const shape=best.f.shape||`フォーム${best.i+1}`;
    hero.innerHTML=`<div class="recommended-copy"><span class="recommended-kicker">${badge(shape)}</span><b>まずはこの押さえ方</b><small>${esc(shape)}</small></div><button type="button" class="recommended-use" data-index="${best.i}">このフォームを表示</button>`;
    hero.querySelector('.recommended-use').onclick=()=>{
      window.selectedFormIndex=best.i;
      if(typeof render==='function') render();
      requestAnimationFrame(()=>document.querySelector('.allChordsFormSelect')?.dispatchEvent(new Event('focus')));
    };
  }

  const obs=new MutationObserver(()=>requestAnimationFrame(mountHero));
  obs.observe(host,{childList:true,subtree:true});
  [rootSel,typeSel,bassSel].forEach(el=>el.addEventListener('change',()=>requestAnimationFrame(mountHero)));

  const st=document.createElement('style'); st.id='recommended-root-ui-style'; st.textContent=`
    .root-note-pad{margin:0 0 12px;padding:11px 12px;border:1px solid #ded6c9;border-radius:14px;background:#fffaf2}
    .root-note-pad-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;color:#4f463c}.root-note-pad-head span{font-size:.72rem;color:#8b8073}
    .root-note-buttons{display:grid;grid-template-columns:repeat(6,1fr);gap:6px}.root-note-buttons button{min-height:38px;border:1px solid #d7c9b5;border-radius:10px;background:#fff;color:#3d352d;font-weight:850;font-size:.92rem;touch-action:manipulation}.root-note-buttons button.active{background:#3f382f;color:#fff;border-color:#3f382f;box-shadow:0 3px 9px rgba(63,56,47,.16)}
    .selection-filters label:first-child{display:none!important}
    .recommended-form-hero{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:0 0 10px;padding:12px 13px;border:1px solid #d7c9b5;border-radius:15px;background:#fffaf2;box-shadow:0 5px 16px rgba(75,61,44,.07)}
    .recommended-copy{display:flex;flex-direction:column;gap:3px;min-width:0}.recommended-copy b{font-size:.98rem;color:#332b22}.recommended-copy small{color:#756a5d;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:52vw}.recommended-kicker{width:max-content;font-size:.69rem;font-weight:850;padding:3px 7px;border-radius:999px;background:#efe8dc;color:#625747}
    .recommended-use{flex:0 0 auto;border:0;border-radius:10px;background:#3f382f;color:#fff;padding:9px 10px;font-weight:800;font-size:.76rem;touch-action:manipulation}
    @media(min-width:700px){.root-note-buttons{grid-template-columns:repeat(12,1fr)}.recommended-copy small{max-width:520px}}
  `; document.head.appendChild(st);
  requestAnimationFrame(mountHero);
})();
