// 教則資料を基準にしたテンション系・実用ボイシング追加パック。
// ランダム生成は行わず、検証済みのC基準movable shapeだけを全12ルートへ移調する。
(() => {
  const originalGetForms = getForms;
  const tuningPc = [4,9,2,7,11,4]; // 6弦→1弦 E A D G B E
  const rootPc = Object.fromEntries(roots.map((n,i)=>[n,i]));
  const fretKey = frets => frets.map(String).join('|');

  // C基準の実用フォーム。資料の9th/11th/13th/altered系を参考にし、
  // 実際に押さえられる定番フォームのみを固定登録する。
  const C_FORMS = {
    maj9: [
      {shape:'📘 Major 9・5弦Root Compact', frets:['x',3,2,4,3,'x']}, // C E B D
    ],
    m9: [
      {shape:'📘 Minor 9・5弦Root Compact', frets:['x',3,1,3,3,'x']}, // C Eb Bb D
    ],
    m11: [
      {shape:'📘 Minor 11・6弦Root Compact', frets:[8,'x',8,8,6,'x']}, // C Bb Eb F
    ],
    mMaj9: [
      {shape:'📘 mMaj9・5弦Root Compact', frets:['x',3,1,4,3,'x']}, // C Eb B D
    ],
    '9': [
      {shape:'📘 Dominant 9・5弦Root 定番', frets:['x',3,2,3,3,'x']}, // C E Bb D
      {shape:'📘 Dominant 9・6弦Root Compact', frets:[8,'x',8,7,8,'x']}, // C Bb D G
    ],
    '13': [
      {shape:'📘 Dominant 13・6弦Root 定番', frets:[8,'x',8,9,10,'x']}, // C Bb E A
    ],
    '7b9': [
      {shape:'📘 Dominant 7♭9・5弦Root 定番', frets:['x',3,2,3,2,'x']}, // C E Bb Db
    ],
    '7s9': [
      {shape:'📘 Dominant 7♯9・5弦Root 定番', frets:['x',3,2,3,4,'x']}, // C E Bb D#
    ],
    '9sus4': [
      {shape:'📘 9sus4・5弦Root Compact', frets:['x',3,3,3,3,'x']}, // C F Bb D
    ],
  };

  const REQUIRED = {
    maj9:[0,4,11,2],
    m9:[0,3,10,2],
    m11:[0,3,10,5],
    mMaj9:[0,3,11,2],
    '9':[0,4,10,2],
    '13':[0,4,10,9],
    '7b9':[0,4,10,1],
    '7s9':[0,4,10,3],
    '9sus4':[0,5,10,2],
  };

  function transposeShape(baseFrets, semitones) {
    let out = baseFrets.map(v => typeof v === 'number' ? v + semitones : v);
    let nums = out.filter(v => typeof v === 'number');
    // ハイポジションが17Fを超える場合は1オクターブ下へ移す。
    if (nums.length && Math.max(...nums) > 17 && Math.min(...nums) >= 12) {
      out = out.map(v => typeof v === 'number' ? v - 12 : v);
    }
    nums = out.filter(v => typeof v === 'number');
    if (!nums.length || Math.min(...nums) < 0 || Math.max(...nums) > 17) return null;
    return out;
  }

  function intervalsForFrets(root, frets) {
    const rp = rootPc[root];
    return frets.map((f,i) => {
      if (typeof f !== 'number') return null;
      return (tuningPc[i] + f - rp + 24) % 12;
    }).filter(v => v !== null);
  }

  function isValid(root, type, frets) {
    const allowed = new Set(typeData[type]?.intervals || []);
    const tones = intervalsForFrets(root, frets);
    if (!tones.length || tones.some(v => !allowed.has(v))) return false;
    const present = new Set(tones);
    return (REQUIRED[type] || []).every(v => present.has(v));
  }

  function build(root, type) {
    const base = C_FORMS[type] || [];
    if (!base.length) return [];
    const semitones = rootPc[root];
    return base.map(v => {
      const frets = transposeShape(v.frets, semitones);
      if (!frets || !isValid(root, type, frets)) return null;
      return {shape:v.shape, frets, barres:[]};
    }).filter(Boolean);
  }

  getForms = function(root, type, bass) {
    const forms = originalGetForms(root, type, bass) || [];
    if (bass !== 'none') return forms;
    const additions = build(root, type);
    if (!additions.length) return forms;

    const seen = new Set(forms.map(f => fretKey(f.frets || [])));
    const unique = additions.filter(f => {
      const key = fretKey(f.frets);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).map((f,i) => ({
      label:`フォーム${forms.length+i+1}`,
      shape:f.shape,
      frets:f.frets,
      barres:f.barres
    }));
    return [...forms, ...unique];
  };

  selectedFormIndex = 0;
  render();
})();
