// Bossa Nova chord-solo voicings from the uploaded reference, pp. 92-97.
// Additive only: existing chord types/forms are preserved.
(() => {
  if (typeof getForms !== 'function' || typeof roots === 'undefined') return;

  const previous = getForms;
  const pc = Object.fromEntries(roots.map((n,i)=>[n,i]));
  const eRoot = root => ((pc[root] - 4 + 12) % 12) || 12;
  const aRoot = root => ((pc[root] - 9 + 12) % 12) || 12;
  const dRoot = root => ((pc[root] - 2 + 12) % 12) || 12;
  const playable = frets => frets.every(v => v === 'x' || (Number.isInteger(v) && v >= 0 && v <= 21));

  function sourceForms(root,type) {
    const er = eRoot(root), ar = aRoot(root), dr = dRoot(root), r = pc[root];
    const out = [];

    if (type === 'maj7') {
      out.push(['Bossa Solo・6弦Root maj7', [er,'x',er+1,er+1,er,'x']]);
      out.push(['Bossa Solo・6弦Root maj7 高音移動', [er,'x','x',er+1,er,er-1]]);
    }
    if (type === '6') out.push(['Bossa Solo・6弦Root 6', [er,'x',er-1,er+1,er,'x']]);
    if (type === '7s11') out.push(['Bossa Solo・6弦Root 7(♯11)', [er,'x',er,er+1,er-1,'x']]);
    if (type === '9') out.push(['Bossa Solo・5弦Root 7(9)', ['x',ar,ar-1,ar,ar,'x']]);
    if (type === '9s11') out.push(['Bossa Solo・5弦Root 7(9,♯11)', ['x',ar,ar-1,ar,ar,ar-1]]);
    if (type === 'm7') out.push(['Bossa Solo・6弦Root m7 Full', [er,er+2,er,er,er,er]]);
    if (type === 'm9') out.push(['Bossa Solo・6弦Root m7(9) Full', [er,er+2,er,er,er,er+2]]);
    if (type === 'm11') out.push(['Bossa Solo・4弦Root m7(11)', ['x','x',dr,dr+2,dr+1,dr+3]]);
    if (type === '7b9') out.push(['Bossa Solo・5弦Root 7(♭9)', ['x',ar,ar-1,ar,ar-1,'x']]);
    if (type === '13b9') out.push(['Bossa Solo・13(♭9) 3rdベース転回', ['x','x',r+2,r+3,r+2,r+5]]);

    return out;
  }

  getForms = function(root,type,bass) {
    const base = previous(root,type,bass) || [];
    if (bass !== 'none') return base;
    const names = new Set(base.map(f => f.shape));
    const add = [];
    sourceForms(root,type).forEach(([shape,frets]) => {
      if (names.has(shape) || !playable(frets)) return;
      names.add(shape);
      add.push({shape, frets:[...frets], barres:[]});
    });
    return base.concat(add);
  };
})();

// Load the next source-backed expansion pack from a file already guaranteed to run on the live page.
(() => {
  if (window.__BOSSA_SLASH_LOADER__) return;
  window.__BOSSA_SLASH_LOADER__ = true;
  const script = document.createElement('script');
  script.src = 'bossa-slash-voicings.js?v=20260809-2';
  script.async = false;
  document.head.appendChild(script);
})();
