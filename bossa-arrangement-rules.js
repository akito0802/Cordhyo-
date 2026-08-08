// Bossa Nova "6 arrangement methods" pack from the uploaded source, pp.104-113.
// Methods 1-4 become source-derived movable voicings. Method 5 (V7 -> bII7)
// is exposed as substitution data for the compact selector UI. Existing forms are preserved.
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

    // ② Minor chord -> m7 / m9 (source notes m6 is also a usable option)
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
    const base = previous(root,type,bass) || [];
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
  // the substitute dominant root is six semitones away.
  window.bossaTritoneSubstitution = function(root) {
    return roots[(pc[root] + 6) % 12];
  };
  window.__BOSSA_ARRANGEMENT_RULES_LOADED__ = true;

  if (typeof updateBassOptions === 'function') updateBassOptions();
  if (typeof render === 'function') render();
})();
