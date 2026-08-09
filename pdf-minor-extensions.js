// Source-only minor-family voicings transcribed from the uploaded Super Guitar Chords PDF, pp.31-34.
// No theory-generated shapes. Existing forms are preserved.
(() => {
  if (typeof getForms !== 'function' || typeof roots === 'undefined') return;
  const previous = getForms;
  const PC = Object.fromEntries(roots.map((n,i)=>[n,i]));

  const C_FORMS = {
    m6: [
      ['📘 PDF p31・m6 6弦Root', [8,'x',7,8,8,'x']],
      ['📘 PDF p31・m6 5弦Root Wide', ['x',3,5,2,4,'x']],
      ['📘 PDF p31・m6 5弦Root Compact', ['x',3,1,2,1,'x']]
    ],
    m9: [
      ['📘 PDF p32・m9 6弦Root Full', [8,'x',8,8,8,10]],
      ['📘 PDF p32・m9 5弦Root', ['x',3,1,3,3,'x']],
      ['📘 PDF p32・m9 4弦Root High', ['x','x',10,8,11,10]]
    ],
    m11: [
      ['📘 PDF p32・m11 6弦Root Compact', [8,'x',8,8,6,'x']],
      ['📘 PDF p32・m11 5弦Root', ['x',3,'x',3,4,1]]
    ],
    mMaj7: [
      ['📘 PDF p33・mMaj7 6弦Root', [8,'x',9,8,8,'x']],
      ['📘 PDF p33・mMaj7 5弦Root', ['x',3,5,4,4,'x']],
      ['📘 PDF p33・mMaj7 5弦Root Full', ['x',3,5,4,4,3]],
      ['📘 PDF p33・mMaj7 4弦Root High', ['x','x',10,8,8,7]]
    ],
    mMaj9: [
      ['📘 PDF p34・mMaj9 6弦Root', [8,'x',9,8,8,10]],
      ['📘 PDF p34・mMaj9 5弦Root', ['x',3,1,4,3,'x']]
    ]
  };

  function transposeNearest(cFrets, root) {
    const base = PC[root];
    const shifts = [base, base-12, base+12].sort((a,b)=>Math.abs(a)-Math.abs(b));
    for (const shift of shifts) {
      const f = cFrets.map(v => typeof v === 'number' ? v + shift : 'x');
      const nums = f.filter(v=>typeof v==='number');
      if (nums.length && Math.min(...nums) >= 0 && Math.max(...nums) <= 21) return f;
    }
    return null;
  }

  getForms = function(root,type,bass) {
    const base = previous(root,type,bass) || [];
    if (bass !== 'none' || !C_FORMS[type]) return base;
    const existingShapes = new Set(base.map(f=>f.shape));
    const add=[];
    C_FORMS[type].forEach(([shape,cFrets])=>{
      if(existingShapes.has(shape)) return;
      const frets=transposeNearest(cFrets,root);
      if(!frets) return;
      existingShapes.add(shape);
      add.push({shape,frets,barres:[]});
    });
    return base.concat(add);
  };

  window.__PDF_MINOR_EXTENSIONS_LOADED__ = true;
  window.__PDF_MINOR_EXTENSION_COUNT__ = Object.fromEntries(Object.entries(C_FORMS).map(([k,v])=>[k,v.length]));
  if (typeof updateBassOptions === 'function') updateBassOptions();
  if (typeof render === 'function') render();
})();
