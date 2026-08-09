// Bossa Nova voicings v2 — standalone additive pack.
// Source-backed bossa labels are preserved even when fret layouts duplicate generic forms.
(() => {
  if (typeof getForms !== 'function' || typeof roots === 'undefined') return;
  const previousGetForms = getForms;
  const rootIndex = Object.fromEntries(roots.map((n,i)=>[n,i]));
  const shiftFromC = (root, shape) => shape.map(v => typeof v === 'number' ? v + rootIndex[root] : 'x');
  const playable = f => f.every(v => v === 'x' || (Number.isInteger(v) && v >= 0 && v <= 21));

  const movable = {
    maj9: [['Bossa・5弦Root △7(9) 基本形',['x',3,2,4,3,'x']]],
    '9': [['Bossa・5弦Root 7(9) 基本形',['x',3,2,3,3,'x']]],
    m9: [['Bossa・5弦Root m7(9) 基本形',['x',3,1,3,3,'x']]],
    maj7: [['Bossa・6弦Root △7 基本形',[8,'x',9,9,8,'x']]],
    m7: [['Bossa・6弦Root m7 基本形',[8,'x',8,8,8,'x']]],
    '13': [['Bossa・6弦Root 7(13) 基本形',[8,'x',8,9,10,'x']]]
  };

  const fixed = {
    'D:maj9': [['Bossa・D△7(9) 実例',['x',5,4,6,5,'x']]],
    'E:9': [['Bossa・E7(9) 実例',['x',7,6,7,7,'x']]],
    'E:m9': [['Bossa・Em7(9) 実例',['x',7,5,7,7,'x']]],
    'D#:9': [['Bossa・E♭7(9) 実例',['x',6,5,6,6,'x']]],
    'B:13': [['Bossa・B7(13) 実例',[7,'x',7,8,9,'x']]],
    'A:13': [['Bossa・A7(13) 実例',[5,'x',5,6,7,'x']]],
    'F:dim7': [['Bossa・Fdim 実例',['x',8,9,7,9,'x']]],
    'F#:m7': [['Bossa・F♯m7 実例',['x',9,11,9,10,'x']]]
  };

  getForms = function(root,type,bass) {
    const base = previousGetForms(root,type,bass) || [];
    if (bass !== 'none') return base;

    // Keep Bossa source labels even when the exact fret layout already exists
    // as a generic/Jazz/PDF form. Only de-duplicate identical Bossa labels.
    const existingNames = new Set(base.map(f => f.shape));
    const additions = [];
    const push = (name, frets) => {
      if (!playable(frets) || existingNames.has(name)) return;
      existingNames.add(name);
      additions.push({shape:name, frets:[...frets], barres:[]});
    };

    (fixed[`${root}:${type}`] || []).forEach(([name,frets]) => push(name,frets));
    (movable[type] || []).forEach(([name,cShape]) => push(name,shiftFromC(root,cShape)));
    return base.concat(additions);
  };

  window.__BOSSA_V2_LOADED__ = true;
  if (typeof updateBassOptions === 'function') updateBassOptions();
  if (typeof render === 'function') render();
})();
