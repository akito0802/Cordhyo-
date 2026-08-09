// Source-only minor-family voicings transcribed from the uploaded Super Guitar Chords PDF, pp.31-34.
// No theory-generated shapes. Existing forms are preserved.
(() => {
  if (typeof getForms !== 'function' || typeof roots === 'undefined' || typeof typeData === 'undefined') return;
  const previous = getForms;
  const PC = Object.fromEntries(roots.map((n,i)=>[n,i]));
  const OPEN = [4,9,2,7,11,4];
  const key = f => f.join('|');

  const C_FORMS = {
    m6: [
      ['PDF p31・Cm6 6弦Root', [8,'x',7,8,8,'x']],
      ['PDF p31・Cm6 5弦Root Wide', ['x',3,5,2,4,'x']],
      ['PDF p31・Cm6 5弦Root Compact', ['x',3,1,2,1,'x']]
    ],
    m9: [
      ['PDF p32・Cm9 6弦Root Full', [8,'x',8,8,8,10]],
      ['PDF p32・Cm9 5弦Root', ['x',3,1,3,3,'x']],
      ['PDF p32・Cm9 4弦Root High', ['x','x',10,8,11,10]]
    ],
    m11: [
      ['PDF p32・Cm11 6弦Root Compact', [8,'x',8,8,6,'x']],
      ['PDF p32・Cm11 5弦Root', ['x',3,'x',3,4,1]]
    ],
    mMaj7: [
      ['PDF p33・CmMaj7 6弦Root', [8,'x',9,8,8,'x']],
      ['PDF p33・CmMaj7 5弦Root', ['x',3,5,4,4,'x']],
      ['PDF p33・CmMaj7 5弦Root Full', ['x',3,5,4,4,3]],
      ['PDF p33・CmMaj7 4弦Root High', ['x','x',10,8,8,7]]
    ],
    mMaj9: [
      ['PDF p34・CmMaj9 6弦Root', [8,'x',9,8,8,10]],
      ['PDF p34・CmMaj9 5弦Root', ['x',3,1,4,3,'x']]
    ]
  };

  const REQUIRED = {
    m6:[0,3,9], m9:[0,2,3,10], m11:[0,3,5,10],
    mMaj7:[0,3,11], mMaj9:[0,2,3,11]
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

  function tones(root, frets) {
    const r = PC[root];
    return frets.map((f,i)=>f==='x'?null:(OPEN[i]+f-r+24)%12).filter(v=>v!==null);
  }

  function sourceValid(root,type,frets) {
    const allowed = new Set(typeData[type]?.intervals || []);
    const t = tones(root,frets);
    if (!t.length || t.some(v=>!allowed.has(v))) return false;
    const have = new Set(t);
    return (REQUIRED[type] || [0]).every(v=>have.has(v));
  }

  getForms = function(root,type,bass) {
    const base = previous(root,type,bass) || [];
    if (bass !== 'none' || !C_FORMS[type]) return base;
    const seen = new Set(base.map(f=>key(f.frets || [])));
    const add = [];
    C_FORMS[type].forEach(([shape,cFrets]) => {
      const frets = transposeNearest(cFrets,root);
      if (!frets || !sourceValid(root,type,frets) || seen.has(key(frets))) return;
      seen.add(key(frets));
      add.push({shape,frets,barres:[]});
    });
    return base.concat(add);
  };

  window.__PDF_MINOR_EXTENSIONS_LOADED__ = true;
  if (typeof render === 'function') render();
})();
