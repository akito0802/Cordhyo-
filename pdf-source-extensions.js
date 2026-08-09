// Source-only extension voicings transcribed from the uploaded Super Guitar Chords PDF, pp.20-25.
// No theory-generated shapes. Existing forms are preserved.
(() => {
  if (typeof getForms !== 'function' || typeof roots === 'undefined' || typeof typeData === 'undefined') return;

  const previous = getForms;
  const PC = Object.fromEntries(roots.map((n,i)=>[n,i]));
  const OPEN = [4,9,2,7,11,4]; // 6E 5A 4D 3G 2B 1E
  const key = f => f.join('|');

  if (!typeData['69s11']) {
    typeData['69s11'] = {
      suffix:'6/9♯11', label:'6/9♯11', intervals:[0,2,4,6,7,9],
      mood:'明るくモダンなリディアン系6/9', use:'ジャズやボサノヴァの色付けに。'
    };
    const group = Array.from(typeSelect?.querySelectorAll('optgroup') || []).find(g => g.label === '9・11・13系');
    if (group && !typeSelect.querySelector('option[value="69s11"]')) {
      const opt = document.createElement('option');
      opt.value = '69s11'; opt.textContent = '6/9♯11';
      const m69 = group.querySelector('option[value="m69"]');
      if (m69) m69.insertAdjacentElement('afterend', opt); else group.appendChild(opt);
    }
  }

  const C_FORMS = {
    '6': [
      ['PDF p20・C6 6弦Root', [8,'x',7,9,8,'x']],
      ['PDF p20・C6 5弦Root Wide', ['x',3,5,2,5,'x']],
      ['PDF p20・C6 5弦Root Compact', ['x',3,2,2,1,'x']],
      ['PDF p20・C6 4弦Root High', ['x','x',10,12,10,12]]
    ],
    '69': [
      ['PDF p21・C6(9) 6弦Root', [8,'x',7,7,8,'x']],
      ['PDF p21・C6(9) 5弦Root', ['x',3,2,2,3,'x']],
      ['PDF p21・C6(9) 4弦Root High', ['x','x',10,9,10,10]]
    ],
    maj9: [
      ['PDF p22・Cmaj9 6弦Root Full', [8,'x',9,9,8,10]],
      ['PDF p22・Cmaj9 6弦Root Low', [8,7,9,7,'x','x']],
      ['PDF p22・Cmaj9 5弦Root', ['x',3,2,4,3,'x']],
      ['PDF p22・Cmaj9 omit3 6弦Root', [8,'x',9,7,8,'x']],
      ['PDF p22・Cmaj9 omit3 5弦Root', ['x',3,5,4,3,3]],
      ['PDF p22・Cmaj9 omit3 4弦Root', ['x','x',10,12,12,10]]
    ],
    maj13: [
      ['PDF p23・Cmaj13 6弦Root Compact', [8,'x',9,9,10,'x']],
      ['PDF p23・Cmaj13 6弦Root Full', [8,7,7,7,8,7]],
      ['PDF p23・Cmaj13 5弦Root', ['x',3,'x',4,5,5]],
      ['PDF p23・Cmaj13 5弦Root High', ['x',15,14,14,12,'x']]
    ],
    maj13s11: [['PDF p23・Cmaj13♯11 Full', [8,7,7,7,7,7]]],
    maj7s11: [
      ['PDF p24・Cmaj7♯11 6弦Root', [8,'x',9,9,7,'x']],
      ['PDF p24・Cmaj7♯11 4弦Root', ['x','x',10,9,7,7]],
      ['PDF p24・Cmaj7♯11 5弦Root', ['x',3,'x',4,5,2]]
    ],
    maj9s11: [['PDF p24・Cmaj9♯11 5弦Root', ['x',3,2,4,3,2]]],
    '69s11': [['PDF p24・C6(9,♯11) 5弦Root', ['x',3,2,2,3,2]]],
    maj7s5: [
      ['PDF p25・Cmaj7♯5 6弦Root', [8,'x',9,9,9,'x']],
      ['PDF p25・Cmaj7♯5 5弦Root High', ['x',15,14,13,12,'x']],
      ['PDF p25・Cmaj7♯5 5弦Root Wide', ['x',3,6,4,5,'x']],
      ['PDF p25・Cmaj7♯5 5弦Root Compact', ['x',3,'x',4,5,4]],
      ['PDF p25・Cmaj7♯5 4弦Root', ['x','x',10,9,9,7]]
    ]
  };

  const REQUIRED = {
    '6':[0,9], '69':[0,2,9], maj9:[0,2,11], maj13:[0,9,11],
    maj13s11:[0,6,9,11], maj7s11:[0,6,11], maj9s11:[0,2,6,11],
    '69s11':[0,2,6,9], maj7s5:[0,8,11]
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

  window.__PDF_SOURCE_EXTENSIONS_LOADED__ = true;
  if (typeof updateBassOptions === 'function') updateBassOptions();
  if (typeof render === 'function') render();
})();

// Load the next source-only minor-family pack from the same PDF series.
(() => {
  if (!window.__PDF_MINOR_EXTENSIONS_LOADED__ && !document.querySelector('script[data-pdf-minor-pack]')) {
    const s = document.createElement('script');
    s.src = 'pdf-minor-extensions.js?v=20260809-1';
    s.dataset.pdfMinorPack = '1';
    document.head.appendChild(s);
  }
})();

// Load the source-only altered-dominant pack (PDF pp.37-44).
(() => {
  if (!window.__PDF_ALTERED_SOURCE_PACK_LOADED__ && !document.querySelector('script[data-pdf-altered-pack]')) {
    const s = document.createElement('script');
    s.src = 'pdf-altered-source-pack.js?v=20260809-1';
    s.dataset.pdfAlteredPack = '1';
    document.head.appendChild(s);
  }
})();
