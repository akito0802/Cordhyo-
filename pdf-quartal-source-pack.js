// PDF source-only Quartal Chords pack — Super Guitar Chords pp.59-60.
// The source explicitly presents quartal voicings based on C Dorian, so these are kept C-specific.
(() => {
  if (typeof getForms !== 'function' || typeof typeData === 'undefined' || typeof typeSelect === 'undefined') return;

  const TYPE = 'quartalCDorian';
  if (!typeData[TYPE]) {
    typeData[TYPE] = {
      suffix:' 4th(C Dorian)',
      label:'4度堆積（C Dorian）',
      intervals:[0,2,3,5,7,9,10],
      mood:'4度を重ねたオープンでモダンな響き',
      use:'資料p59-60のC Dorian上Quartal Chords。コンピングやモーダルなソロに。'
    };
  }

  if (!typeSelect.querySelector(`option[value="${TYPE}"]`)) {
    const group = document.createElement('optgroup');
    group.label = 'モーダル・4度堆積';
    const opt = document.createElement('option');
    opt.value = TYPE;
    opt.textContent = '4度堆積（C Dorian）';
    group.appendChild(opt);
    typeSelect.appendChild(group);
  }

  // Seven diatonic quartal structures from C Dorian.
  // String-set 2-3-4-5 (5th→2nd strings): C-F-Bb-Eb, D-G-C-F, Eb-A-D-G, F-Bb-Eb-A, G-C-F-Bb, A-D-G-C, Bb-Eb-A-D.
  // String-set 1-2-3-4 (4th→1st strings): the same seven structures in the upper-string register.
  const FORMS = [
    ['📘 PDF p60・Quartal 2-3-4-5・C-F-B♭-E♭', ['x',3,3,3,4,'x']],
    ['📘 PDF p60・Quartal 2-3-4-5・D-G-C-F', ['x',5,5,5,6,'x']],
    ['📘 PDF p60・Quartal 2-3-4-5・E♭-A-D-G', ['x',6,7,7,8,'x']],
    ['📘 PDF p60・Quartal 2-3-4-5・F-B♭-E♭-A', ['x',8,8,8,10,'x']],
    ['📘 PDF p60・Quartal 2-3-4-5・G-C-F-B♭', ['x',10,10,10,11,'x']],
    ['📘 PDF p60・Quartal 2-3-4-5・A-D-G-C', ['x',12,12,12,13,'x']],
    ['📘 PDF p60・Quartal 2-3-4-5・B♭-E♭-A-D', ['x',13,13,14,15,'x']],

    ['📘 PDF p60・Quartal 1-2-3-4・E♭-A-D-G', ['x','x',1,2,3,3]],
    ['📘 PDF p60・Quartal 1-2-3-4・F-B♭-E♭-A', ['x','x',3,3,4,5]],
    ['📘 PDF p60・Quartal 1-2-3-4・G-C-F-B♭', ['x','x',5,5,6,6]],
    ['📘 PDF p60・Quartal 1-2-3-4・A-D-G-C', ['x','x',7,7,8,8]],
    ['📘 PDF p60・Quartal 1-2-3-4・B♭-E♭-A-D', ['x','x',8,8,10,10]],
    ['📘 PDF p60・Quartal 1-2-3-4・C-F-B♭-E♭', ['x','x',10,10,11,11]],
    ['📘 PDF p60・Quartal 1-2-3-4・D-G-C-F', ['x','x',12,12,13,13]]
  ];

  const previous = getForms;
  getForms = function(root,type,bass) {
    const base = previous(root,type,bass) || [];
    if (bass !== 'none' || type !== TYPE || root !== 'C') return base;
    const names = new Set(base.map(f => f.shape));
    const add = FORMS.filter(([shape]) => !names.has(shape)).map(([shape,frets]) => ({shape,frets:[...frets],barres:[]}));
    return base.concat(add);
  };

  window.__PDF_QUARTAL_SOURCE_LOADED__ = true;
  if (typeof updateBassOptions === 'function') updateBassOptions();
  if (typeof render === 'function') render();
})();
