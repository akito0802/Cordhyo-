// Source-only open chord voicings transcribed from Super Guitar Chords PDF, pp.55-58.
// These are key-specific open-string shapes from the source; they are NOT transposed.
(() => {
  if (typeof getForms !== 'function' || typeof typeData === 'undefined' || typeof typeSelect === 'undefined') return;

  const previous = getForms;

  function addType(id, label, suffix, intervals, groupLabel='9・11・13系') {
    if (!typeData[id]) typeData[id] = {suffix,label,intervals,mood:'PDF掲載のオープンコード',use:'資料掲載キー専用のオープンボイシング。'};
    if (typeSelect.querySelector(`option[value="${id}"]`)) return;
    const group = [...typeSelect.querySelectorAll('optgroup')].find(g => g.label === groupLabel) || typeSelect;
    const opt = document.createElement('option');
    opt.value = id; opt.textContent = label;
    group.appendChild(opt);
  }

  addType('m11b6','m11(♭6)','m11(♭6)',[0,3,5,7,8,10]);
  addType('m7b5add11','m7♭5(add11)','m7♭5(add11)',[0,3,5,6,10],'ディミニッシュ・オーギュメント');

  const FIXED = {
    'E:maj9': [
      ['📘 PDF p55・Emaj9 Open', [0,'x',4,4,4,0]]
    ],
    'E:m9': [
      ['📘 PDF p55・Em9 Open A', [0,7,5,7,0,0]],
      ['📘 PDF p55・Em9 Open B', [0,'x',4,0,3,0]]
    ],
    'A:maj7': [
      ['📘 PDF p56・Amaj7 Open', ['x',0,6,6,5,0]]
    ],
    'A:add9': [
      ['📘 PDF p56・A(add9) Open', ['x',0,7,6,0,0]]
    ],
    'A:m7': [
      ['📘 PDF p56・Am7 Open', ['x',0,5,5,0,0]]
    ],
    'A:minor': [
      ['📘 PDF p56・Am Open', ['x',0,7,5,0,0]]
    ],
    'D:madd9': [
      ['📘 PDF p57・Dm(add9) Open A', ['x','x',0,7,6,0]],
      ['📘 PDF p57・Dm(add9) Open B', ['x','x',0,9,10,0]]
    ],
    'B:m11b6': [
      ['📘 PDF p57・Bm11(♭6) = Gmaj7(add6)/B Open', ['x',2,4,0,3,0]]
    ],
    'B:m7b5add11': [
      ['📘 PDF p57・Bm7♭5(add11) Open', ['x',2,3,2,3,0]]
    ],
    'A#:maj7s11': [
      ['📘 PDF p58・B♭maj7♯11 Open', ['x',1,3,2,3,0]]
    ],
    'C:maj7': [
      ['📘 PDF p58・Cmaj7/G Open', [3,3,2,0,0,0]]
    ]
  };

  getForms = function(root,type,bass) {
    const base = previous(root,type,bass) || [];
    if (bass !== 'none') return base;
    const defs = FIXED[`${root}:${type}`] || [];
    if (!defs.length) return base;
    const existingShapes = new Set(base.map(f => f.shape));
    const add = [];
    defs.forEach(([shape,frets]) => {
      if (existingShapes.has(shape)) return;
      existingShapes.add(shape);
      add.push({shape,frets:[...frets],barres:[]});
    });
    return base.concat(add);
  };

  window.__PDF_OPEN_CHORDS_LOADED__ = true;
  if (typeof updateBassOptions === 'function') updateBassOptions();
  if (typeof render === 'function') render();
})();
