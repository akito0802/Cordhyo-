// Bossa Nova "6 arrangement methods" pack from the uploaded source, pp.104-113.
// Methods 1-4 become source-derived movable voicings. Method 5 (V7 -> bII7)
// is exposed in the existing compact selector. Existing valid forms are preserved.
(() => {
  if (typeof getForms !== 'function' || typeof roots === 'undefined') return;

  const previous = getForms;
  const pc = Object.fromEntries(roots.map((n,i)=>[n,i]));
  const OPEN = [4,9,2,7,11,4]; // E A D G B E
  const key = f => f.join('|');

  const eRoot = root => ((pc[root] - 4 + 12) % 12) || 12; // 6th-string root
  const aRoot = root => ((pc[root] - 9 + 12) % 12) || 12; // 5th-string root

  function playedPcs(frets) {
    return new Set(frets.map((f,i)=>f==='x'?null:(OPEN[i]+f)%12).filter(v=>v!==null));
  }
  function contains(root, frets, intervals) {
    const have = playedPcs(frets), r = pc[root];
    return intervals.every(i => have.has((r+i)%12));
  }
  function playable(frets) {
    return frets.every(v => v === 'x' || (Number.isInteger(v) && v >= 0 && v <= 21));
  }

  function sourceDerived(root,type) {
    const er=eRoot(root), ar=aRoot(root), out=[];

    // ① Major chord -> maj7 / maj9 / 6 / 6(9)
    if (type === 'maj7') out.push(['Bossa Arrange①・6弦Root maj7', [er,'x',er+1,er+1,er,'x'], [0,4,7,11]]);
    if (type === 'maj9') out.push(['Bossa Arrange①・6弦Root maj9', [er,'x',er+1,er+1,er,er+2], [0,2,4,7,11]]);
    if (type === '6')    out.push(['Bossa Arrange①・6弦Root 6', [er,'x',er-1,er+1,er,'x'], [0,4,7,9]]);
    if (type === '69')   out.push(['Bossa Arrange①・6弦Root 6/9', [er,'x',er-1,er+1,er,er+2], [0,2,4,7,9]]);

    // ② Minor chord -> m7 / m9 (source also notes m6 as an option)
    if (type === 'm7') out.push(['Bossa Arrange②・6弦Root m7', [er,'x',er,er,er,'x'], [0,3,7,10]]);
    if (type === 'm9') out.push(['Bossa Arrange②・6弦Root m9', [er,'x',er,er,er,er+2], [0,2,3,7,10]]);
    if (type === 'm6') out.push(['Bossa Arrange②・6弦Root m6', [er,'x',er-1,er,er,'x'], [0,3,7,9]]);

    // ③ Dominant 7 -> brighter 9 / 13
    if (type === '9')  out.push(['Bossa Arrange③・5弦Root 9', ['x',ar,ar-1,ar,ar,'x'], [0,2,4,10]]);
    if (type === '13') out.push(['Bossa Arrange③・6弦Root 13', [er,'x',er,er+1,er+2,'x'], [0,4,9,10]]);

    // ④ Dominant 7 -> darker b9 / b13
    if (type === '7b9')  out.push(['Bossa Arrange④・5弦Root 7♭9', ['x',ar,ar-1,ar,ar-1,'x'], [0,1,4,10]]);
    if (type === '7b13') out.push(['Bossa Arrange④・6弦Root 7♭13', [er,'x',er,er+1,er+1,'x'], [0,4,8,10]]);

    return out;
  }

  getForms = function(root,type,bass) {
    let base = previous(root,type,bass) || [];

    // Correct one earlier transcription error from our own Bossa pack only:
    // A7(13) must be 6th-string-root 5-x-5-6-7-x, not x-5-5-6-7-x.
    if (root === 'A' && type === '13' && bass === 'none') {
      base = base.filter(f => !(f.shape === 'Bossa・A7(13) 実例' && key(f.frets) === 'x|5|5|6|7|x'));
    }

    if (bass !== 'none') return base;
    const seen = new Set(base.map(f=>key(f.frets)));
    const add=[];
    sourceDerived(root,type).forEach(([shape,frets,required])=>{
      if (!playable(frets) || !contains(root,frets,required) || seen.has(key(frets))) return;
      seen.add(key(frets));
      add.push({shape,frets:[...frets],barres:[]});
    });
    return base.concat(add);
  };

  // ⑤ V7 -> bII7 = tritone substitution. For a selected dominant root,
  // the substitute dominant root is six semitones away (E7 -> Bb7, etc.).
  window.bossaTritoneSubstitution = function(root) {
    return roots[(pc[root] + 6) % 12];
  };

  // Keep the current compact UI. Add only one extra optgroup when plain 7 is selected.
  function injectSubstitutionOption() {
    if (typeof rootSelect === 'undefined' || typeof typeSelect === 'undefined' || typeof bassSelect === 'undefined') return;
    const select = document.querySelector('.allChordsFormSelect');
    if (!select) return;
    select.querySelector('optgroup[data-bossa-tritone]')?.remove();
    if (typeSelect.value !== '7' || (bassSelect.value || 'none') !== 'none') return;
    const sub = window.bossaTritoneSubstitution(rootSelect.value);
    if (!sub) return;
    const group = document.createElement('optgroup');
    group.label = '🌴 6大アレンジ法⑤';
    group.dataset.bossaTritone = '1';
    const option = document.createElement('option');
    option.value = '__bossa_tritone__';
    option.textContent = `🔁 ♭II7代理へ：${sub}7`;
    group.appendChild(option);
    select.appendChild(group);
  }

  if (!window.__BOSSA_TRITONE_CAPTURE__) {
    window.__BOSSA_TRITONE_CAPTURE__ = true;
    document.addEventListener('change', e => {
      const target = e.target;
      if (!(target instanceof HTMLSelectElement) || !target.classList.contains('allChordsFormSelect')) return;
      if (target.value !== '__bossa_tritone__') return;
      e.preventDefault();
      e.stopImmediatePropagation();
      const sub = window.bossaTritoneSubstitution(rootSelect.value);
      if (!sub) return;
      rootSelect.value = sub;
      typeSelect.value = '7';
      if (typeof updateBassOptions === 'function') updateBassOptions();
      bassSelect.value = 'none';
      if (typeof selectedFormIndex !== 'undefined') selectedFormIndex = 0;
      if (typeof render === 'function') render();
      requestAnimationFrame(injectSubstitutionOption);
    }, true);
  }

  const host = document.querySelector('#selectedChord');
  if (host && !window.__BOSSA_ARRANGE_UI_OBSERVER__) {
    window.__BOSSA_ARRANGE_UI_OBSERVER__ = new MutationObserver(()=>requestAnimationFrame(injectSubstitutionOption));
    window.__BOSSA_ARRANGE_UI_OBSERVER__.observe(host,{childList:true,subtree:true});
  }
  [typeof rootSelect!=='undefined'?rootSelect:null, typeof typeSelect!=='undefined'?typeSelect:null, typeof bassSelect!=='undefined'?bassSelect:null]
    .filter(Boolean).forEach(el=>el.addEventListener('change',()=>requestAnimationFrame(injectSubstitutionOption)));

  window.__BOSSA_ARRANGEMENT_RULES_LOADED__ = true;
  if (typeof updateBassOptions === 'function') updateBassOptions();
  if (typeof render === 'function') render();
  requestAnimationFrame(injectSubstitutionOption);
})();
