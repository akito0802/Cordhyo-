// 未対応コードにも最低2種類のオンコード候補を追加する。
(() => {
  const originalGetForms = getForms;

  function bassCandidates(root, type) {
    const baseName = chordBaseName(root, type);
    const existing = Object.keys(slashShapes)
      .filter(name => name.startsWith(`${baseName}/`))
      .map(name => name.split('/')[1]);

    const rootPc = roots.indexOf(root);
    const chordTones = [...new Set((typeData[type]?.intervals || [0,4,7])
      .filter(interval => interval !== 0)
      .map(interval => roots[(rootPc + interval) % 12]))];

    const fallback = [2, 5, 9, 10]
      .map(interval => roots[(rootPc + interval) % 12]);

    return [...new Set([...existing, ...chordTones, ...fallback])]
      .filter(note => note !== root)
      .slice(0, Math.max(2, existing.length));
  }

  function generatedSlashShape(root, type, bass) {
    const rootPc = roots.indexOf(root);
    const bassPc = roots.indexOf(bass);
    const tones = new Set((typeData[type]?.intervals || [0,4,7]).map(n => (rootPc + n) % 12));
    const frets = Array(6).fill('x');

    const lowChoices = [0, 1].map(string => {
      let fret = (bassPc - tuning[string] + 12) % 12;
      if (fret === 0 && string === 0) fret = 12;
      return { string, fret };
    }).sort((a, b) => a.fret - b.fret);

    const low = lowChoices[0];
    frets[low.string] = low.fret;
    const anchor = low.fret;

    for (let string = low.string + 1; string < 6; string++) {
      const choices = [];
      for (let fret = Math.max(0, anchor - 2); fret <= anchor + 4; fret++) {
        const pc = (tuning[string] + fret) % 12;
        if (tones.has(pc)) choices.push({ fret, distance: Math.abs(fret - anchor) });
      }
      choices.sort((a, b) => a.distance - b.distance || a.fret - b.fret);
      if (choices[0]) frets[string] = choices[0].fret;
    }

    return frets;
  }

  updateBassOptions = function () {
    const root = rootSelect.value;
    const type = typeSelect.value;
    const baseName = chordBaseName(root, type);
    const available = bassCandidates(root, type);
    const previous = bassSelect.value;

    bassSelect.innerHTML = '<option value="none">なし</option>' + available
      .map(bass => `<option value="${bass}">${baseName}/${bass}</option>`)
      .join('');

    bassSelect.value = available.includes(previous) ? previous : 'none';
    bassSelect.disabled = false;
  };

  getForms = function (root, type, bass) {
    if (bass === 'none') return originalGetForms(root, type, bass);

    const base = chordBaseName(root, type);
    const slash = `${base}/${bass}`;
    if (slashShapes[slash]) return originalGetForms(root, type, bass);

    const shapeA = generatedSlashShape(root, type, bass);
    const shifted = shapeA.map(value => typeof value === 'number' && value > 0 ? value + 12 : value);

    return [
      { label: 'フォーム1', shape: 'オンコード・自動生成', frets: shapeA, barres: [] },
      { label: 'フォーム2', shape: 'オンコード・高音域', frets: shifted, barres: [] }
    ];
  };

  selectedFormIndex = 0;
  updateBassOptions();
  render();
})();
