// Bossa Nova chord-transformation pack from the uploaded reference (Chord Solo chapter).
// Adds verified movable/fixed shapes without removing any existing forms.
(() => {
  if (typeof getForms !== 'function' || typeof roots === 'undefined') return;

  // New chord type appearing in the source: 7(9,#11), shown as E7(9,#11).
  if (typeof typeData !== 'undefined' && !typeData['9s11']) {
    typeData['9s11'] = {
      suffix:'9♯11', label:'9♯11', intervals:[0,2,4,6,7,10],
      mood:'9thの柔らかさに♯11の浮遊感を加えた響き',
      use:'ボサノヴァやジャズのドミナントをメロディックに動かす時に。'
    };
  }
  if (typeof typeSelect !== 'undefined' && !typeSelect.querySelector('option[value="9s11"]')) {
    const option = document.createElement('option');
    option.value = '9s11';
    option.textContent = '9♯11';
    const group = [...typeSelect.querySelectorAll('optgroup')].find(g => /9・11・13/.test(g.label));
    (group || typeSelect).appendChild(option);
  }

  const previous = getForms;
  const pc = Object.fromEntries(roots.map((n,i)=>[n,i]));
  const playable = frets => frets.every(v => v === 'x' || (Number.isInteger(v) && v >= 0 && v <= 21));

  const eRoot = root => ((pc[root] - 4 + 12) % 12) || 12; // 6th-string root
  const aRoot = root => ((pc[root] - 9 + 12) % 12) || 12; // 5th-string root
  const dRoot = root => ((pc[root] - 2 + 12) % 12);       // 4th-string root; D may stay open

  function liftIfNeeded(frets) {
    const nums = frets.filter(v => typeof v === 'number');
    if (!nums.length || Math.min(...nums) >= 0) return frets;
    return frets.map(v => typeof v === 'number' ? v + 12 : v);
  }

  function formsFor(root,type) {
    const out = [];
    const er = eRoot(root), ar = aRoot(root), dr = dRoot(root);

    // Source: Dmaj9 -> Dmaj7 -> D6 -> Dmaj7. 4th-string-root family.
    if (type === 'maj7') out.push(['Bossa・4弦Root maj7 コード変形', ['x','x',dr,dr+2,dr+2,dr+2]]);
    if (type === '6')    out.push(['Bossa・4弦Root 6 コード変形',    ['x','x',dr,dr+2,dr,dr+2]]);

    // Source: E9 -> E7 -> E9 -> E7(9,#11). 5th-string-root family.
    if (type === '7')    out.push(['Bossa・5弦Root 7 コード変形', liftIfNeeded(['x',ar,ar-1,ar,ar-2,'x'])]);
    if (type === '9s11') out.push(['Bossa・5弦Root 7(9,♯11) コード変形', liftIfNeeded(['x',ar,'x',ar,ar,ar-1])]);

    // Source: Em9 -> Em7 (top voice F#->G). 5th-string-root m7 variant.
    if (type === 'm7')   out.push(['Bossa・5弦Root m7 上声変形', liftIfNeeded(['x',ar,ar-2,ar,ar+1,'x'])]);

    // Source lecture phrase: 5th-string-root dominant b9.
    if (type === '7b9')  out.push(['Bossa・5弦Root 7(♭9) 定番', liftIfNeeded(['x',ar,ar-1,ar,ar-1,'x'])]);

    // Source: A13 -> A7(b13) -> A7(b5) -> A7. Only the 2nd-string top voice moves.
    if (type === '7b13') out.push(['Bossa・6弦Root 7(♭13) 上声変形', liftIfNeeded([er,'x',er,er+1,er+1,'x'])]);
    if (type === '7b5')  out.push(['Bossa・6弦Root 7(♭5) 上声変形',  liftIfNeeded([er,'x',er,er+1,er-1,'x'])]);
    if (type === '7')    out.push(['Bossa・6弦Root 7 上声変形',      liftIfNeeded([er,'x',er,er+1,er,'x'])]);

    return out;
  }

  getForms = function(root,type,bass) {
    const base = previous(root,type,bass) || [];
    if (bass !== 'none') return base;
    const names = new Set(base.map(f => f.shape));
    const add = [];
    formsFor(root,type).forEach(([shape,frets]) => {
      if (names.has(shape) || !playable(frets)) return;
      names.add(shape);
      add.push({shape, frets:[...frets], barres:[]});
    });
    return base.concat(add);
  };
})();
