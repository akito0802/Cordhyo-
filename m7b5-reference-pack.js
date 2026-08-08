// m7b5 / half-diminished focused expansion.
// Source-backed only: Bossa demo + Super Guitar Chords basic m7b5 page.
// Existing forms are preserved.
(() => {
  if (typeof getForms !== 'function' || typeof roots === 'undefined') return;

  const previous = getForms;
  const PC = Object.fromEntries(roots.map((n,i)=>[n,i]));
  const OPEN = [4,9,2,7,11,4]; // 6E 5A 4D 3G 2B 1E
  const fretKey = f => f.join('|');

  function playedPcs(frets) {
    return new Set(frets.map((f,i)=>f==='x'?null:(OPEN[i]+f)%12).filter(v=>v!==null));
  }
  function isM7b5(root, frets) {
    const have = playedPcs(frets), r = PC[root];
    return [0,3,6,10].every(i => have.has((r+i)%12));
  }
  function playable(frets) {
    return frets.every(v => v === 'x' || (Number.isInteger(v) && v >= 0 && v <= 21));
  }

  // Bossa source demo: G#m7(b5) = 4-x-4-4-3-x.
  // Treat it as a movable 6th-string-root family.
  function bossa6Root(root) {
    let r = (PC[root] - 4 + 12) % 12;
    if (r - 1 < 0) r += 12;
    return [r,'x',r,r,r-1,'x'];
  }

  // Super Guitar Chords basic m7b5 page includes an upper-string compact inversion:
  // Cm7b5 = x-x-1-3-1-2 (Eb-Bb-C-Gb = b3-b7-root-b5).
  function upperCompact(root) {
    const shift = PC[root]; // C reference -> target root
    return ['x','x',1+shift,3+shift,1+shift,2+shift];
  }

  getForms = function(root,type,bass) {
    const base = previous(root,type,bass) || [];
    if (bass !== 'none' || type !== 'm7b5') return base;

    const add = [];
    const shapeNames = new Set(base.map(f=>f.shape));
    const fretsSeen = new Set(base.map(f=>fretKey(f.frets)));

    const bossa = bossa6Root(root);
    if (!shapeNames.has('Bossa・6弦Root m7♭5 デモ実例') && playable(bossa) && isM7b5(root,bossa)) {
      // Keep the Bossa-labelled source form even if an identical generic Jazz Basic form exists.
      add.push({shape:'Bossa・6弦Root m7♭5 デモ実例', frets:bossa, barres:[]});
      shapeNames.add('Bossa・6弦Root m7♭5 デモ実例');
    }

    const compact = upperCompact(root);
    if (playable(compact) && isM7b5(root,compact) && !fretsSeen.has(fretKey(compact))) {
      add.push({shape:'PDF Basic・上4弦 Compact転回', frets:compact, barres:[]});
      fretsSeen.add(fretKey(compact));
    }

    return base.concat(add);
  };

  window.__M7B5_REFERENCE_PACK_LOADED__ = true;
  if (typeof render === 'function') render();
})();
