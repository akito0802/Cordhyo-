// Source-only voicings transcribed from Super Guitar Chords PDF pp.26-30.
// Dominant 9 / 13 / 7sus4 / 9sus4 / 13sus4. No theory-generated shapes.
(() => {
  if (typeof getForms !== 'function' || typeof roots === 'undefined' || typeof typeData === 'undefined') return;
  const previous = getForms;
  const PC = Object.fromEntries(roots.map((n,i)=>[n,i]));
  const OPEN = [4,9,2,7,11,4];
  const key = f => f.join('|');

  const C_FORMS = {
    '9': [
      ['PDF p26・C9 6弦Root Low', [8,'x',8,7,5,'x']],
      ['PDF p26・C9 6弦Root Full', [8,'x',8,9,8,10]],
      ['PDF p26・C9 5弦Root Full', ['x',3,2,3,3,3]],
      ['PDF p26・C9 4弦Root High', ['x','x',10,9,11,10]],
      ['PDF p26・C9 omit3 6弦Root', [8,'x',8,7,8,'x']]
    ],
    '13': [
      ['PDF p27・C13 6弦Root Compact', [8,'x',8,9,10,'x']],
      ['PDF p27・C13 6弦Root Full', [8,'x',8,9,10,10]],
      ['PDF p27・C13 5弦Root', ['x',3,2,3,3,5]],
      ['PDF p27・C13/B♭', ['x',1,2,2,1,'x']]
    ],
    '7sus4': [
      ['PDF p28・C7sus4 5弦Root', ['x',3,5,3,6,'x']],
      ['PDF p28・C7sus4 6弦Root', [8,'x',8,10,8,'x']],
      ['PDF p28・C7sus4 4弦Root High', ['x','x',10,12,11,13]]
    ],
    '9sus4': [
      ['PDF p29・C9sus4 6弦Root Low', [8,'x',8,7,6,'x']],
      ['PDF p29・C9sus4 5弦Root Compact', ['x',3,3,3,3,'x']],
      ['PDF p29・C9sus4 4弦Root High', ['x','x',10,15,15,13]],
      ['PDF p29・C9sus4 4弦Root Compact', ['x','x',10,10,11,10]],
      ['PDF p29・C9sus4 6弦Root Wide', [8,'x',8,10,8,10]]
    ],
    '13sus4': [
      ['PDF p30・C13sus4 6弦Root RootTop', [8,'x',8,10,10,8]],
      ['PDF p30・C13sus4 6弦Root Full', [8,'x',8,10,10,10]],
      ['PDF p30・C13sus4 5弦Root', ['x',3,3,3,3,5]]
    ]
  };

  const REQUIRED = {
    '9':[0,2,4,10],
    '13':[0,4,9,10],
    '7sus4':[0,5,10],
    '9sus4':[0,2,5,10],
    '13sus4':[0,5,9,10]
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

  window.__PDF_SOURCE_DOMINANT_SUS_LOADED__ = true;
  if (typeof render === 'function') render();
})();
