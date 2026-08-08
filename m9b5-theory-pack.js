// m9b5 (minor 9 flat 5) theory-derived voicing pack.
// The uploaded references contain m7b5 families but no standalone m9b5 section.
// These shapes extend the verified m7b5 root-position geometry by adding the natural 9th.
// They are intentionally labelled Theory Derived, not PDF/Bossa source forms.
(() => {
  if (typeof getForms !== 'function' || typeof roots === 'undefined') return;

  const previous = getForms;
  const PC = Object.fromEntries(roots.map((n,i)=>[n,i]));
  const OPEN = [4,9,2,7,11,4]; // 6E 5A 4D 3G 2B 1E
  const REQUIRED = [0,2,3,6,10]; // 1, 9, b3, b5, b7
  const key = f => f.join('|');

  function rootFret(root, openPc, minOffset, maxOffset) {
    let r = (PC[root] - openPc + 12) % 12;
    while (r + minOffset < 0) r += 12;
    if (r + maxOffset > 21) return null;
    return r;
  }

  function playedPcs(frets) {
    return new Set(frets.map((f,i)=>f==='x'?null:(OPEN[i]+f)%12).filter(v=>v!==null));
  }

  function isExactM9b5(root, frets) {
    const have = playedPcs(frets), r = PC[root];
    return REQUIRED.every(i => have.has((r+i)%12));
  }

  function playable(frets) {
    return frets.every(v => v === 'x' || (Number.isInteger(v) && v >= 0 && v <= 21));
  }

  function theoryForms(root) {
    const out = [];

    // C example: 8-x-8-8-7-10 = C, Bb, Eb, Gb, D.
    const e = rootFret(root, 4, -1, 2);
    if (e !== null) out.push(['Theory Derived・6弦Root m9♭5', [e,'x',e,e,e-1,e+2]]);

    // C example: x-3-1-3-3-2 = C, Eb, Bb, D, Gb.
    const a = rootFret(root, 9, -2, 0);
    if (a !== null) out.push(['Theory Derived・5弦Root m9♭5 Compact', ['x',a,a-2,a,a,a-1]]);

    // C example: x-9-10-8-11-10 = Gb, C, Eb, Bb, D; root on 4th string.
    const d = rootFret(root, 2, -2, 1);
    if (d !== null) out.push(['Theory Derived・4弦Root m9♭5 Wide', ['x',d-1,d,d-2,d+1,d]]);

    return out;
  }

  getForms = function(root,type,bass) {
    const base = previous(root,type,bass) || [];
    if (bass !== 'none' || type !== 'm9b5') return base;

    const seen = new Set(base.map(f=>key(f.frets)));
    const add = [];
    theoryForms(root).forEach(([shape,frets]) => {
      if (!playable(frets) || !isExactM9b5(root,frets) || seen.has(key(frets))) return;
      seen.add(key(frets));
      add.push({shape,frets:[...frets],barres:[]});
    });
    return base.concat(add);
  };

  window.__M9B5_THEORY_PACK_LOADED__ = true;
  if (typeof render === 'function') render();
})();
