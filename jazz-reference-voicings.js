// Jazz Guitar Chord Dictionary の実用フォームを参考にした手動定義パック。
// ランダム生成は行わず、C基準の実在する movable shape を全ルートへ移調する。
(() => {
  const originalGetForms = getForms;
  const fretKey = frets => frets.map(String).join('|');

  const ROOT_PC = Object.fromEntries(roots.map((n,i)=>[n,i]));
  const STRING_PC = { E:4, A:9 };

  function rootFret(root, stringName, minOffset=0, maxOffset=0) {
    const target = ROOT_PC[root];
    let fret = (target - STRING_PC[stringName] + 12) % 12;
    while (fret + minOffset < 0 || fret + maxOffset > 17) fret += 12;
    return fret <= 17 ? fret : null;
  }

  function shapeFromOffsets(root, stringName, offsets) {
    const nums = offsets.filter(v => typeof v === 'number');
    const min = Math.min(...nums), max = Math.max(...nums);
    const r = rootFret(root, stringName, min, max);
    if (r === null) return null;
    return offsets.map(v => typeof v === 'number' ? r + v : 'x');
  }

  // 6弦root / 5弦rootの4音Basic。
  // C基準: maj7=8x998x / x3545x, 7=8x898x / x3535x,
  // m7=8x888x / x3534x, m7b5=8x887x / x3434x, dim7=8x787x / x3424x.
  const basic4 = {
    maj7: [
      {name:'Jazz Basic・6弦Root', string:'E', offsets:[0,'x',1,1,0,'x']},
      {name:'Jazz Basic・5弦Root', string:'A', offsets:['x',0,2,1,2,'x']}
    ],
    '7': [
      {name:'Jazz Basic・6弦Root', string:'E', offsets:[0,'x',0,1,0,'x']},
      {name:'Jazz Basic・5弦Root', string:'A', offsets:['x',0,2,0,2,'x']}
    ],
    m7: [
      {name:'Jazz Basic・6弦Root', string:'E', offsets:[0,'x',0,0,0,'x']},
      {name:'Jazz Basic・5弦Root', string:'A', offsets:['x',0,2,0,1,'x']}
    ],
    m7b5: [
      {name:'Jazz Basic・6弦Root', string:'E', offsets:[0,'x',0,0,-1,'x']},
      {name:'Jazz Basic・5弦Root', string:'A', offsets:['x',0,1,0,1,'x']}
    ],
    dim7: [
      {name:'Jazz Basic・6弦Root', string:'E', offsets:[0,'x',-1,0,-1,'x']},
      {name:'Jazz Basic・5弦Root', string:'A', offsets:['x',0,1,-1,1,'x']}
    ]
  };

  // Shell voicings: 1-3-7 / 1-7-3, E-string root / A-string root。
  // 資料どおり、m7b5 shell は5度を省くので m7 と同形。
  const shell137E = {
    maj7:[0,-1,1,'x','x','x'],
    '7':[0,-1,0,'x','x','x'],
    m7:[0,-2,0,'x','x','x'],
    m7b5:[0,-2,0,'x','x','x'],
    '6':[0,-1,-1,'x','x','x'],
    m6:[0,-2,-1,'x','x','x']
  };
  const shell173E = {
    maj7:[0,'x',1,1,'x','x'],
    '7':[0,'x',0,1,'x','x'],
    m7:[0,'x',0,0,'x','x'],
    m7b5:[0,'x',0,0,'x','x'],
    '6':[0,'x',-1,1,'x','x'],
    m6:[0,'x',-1,0,'x','x']
  };
  const shell137A = {
    maj7:['x',0,-1,1,'x','x'],
    '7':['x',0,-1,0,'x','x'],
    m7:['x',0,-2,0,'x','x'],
    m7b5:['x',0,-2,0,'x','x'],
    '6':['x',0,-1,-1,'x','x'],
    m6:['x',0,-2,-1,'x','x']
  };
  const shell173A = {
    maj7:['x',0,'x',1,2,'x'],
    '7':['x',0,'x',0,2,'x'],
    m7:['x',0,'x',0,1,'x'],
    m7b5:['x',0,'x',0,1,'x'],
    '6':['x',0,'x',-1,2,'x'],
    m6:['x',0,'x',-1,1,'x']
  };

  function buildJazzForms(root, type) {
    const out = [];
    const add = (name, string, offsets) => {
      if (!offsets) return;
      const frets = shapeFromOffsets(root, string, offsets);
      if (frets) out.push({shape:name, frets, barres:[]});
    };

    (basic4[type] || []).forEach(v => add(v.name, v.string, v.offsets));
    add('Jazz Shell 1-3-7・6弦Root','E',shell137E[type]);
    add('Jazz Shell 1-7-3・6弦Root','E',shell173E[type]);
    add('Jazz Shell 1-3-7・5弦Root','A',shell137A[type]);
    add('Jazz Shell 1-7-3・5弦Root','A',shell173A[type]);
    return out;
  }

  getForms = function(root, type, bass) {
    const forms = originalGetForms(root, type, bass) || [];
    if (bass !== 'none') return forms;

    const additions = buildJazzForms(root, type);
    if (!additions.length) return forms;

    const seen = new Set(forms.map(f => fretKey(f.frets || [])));
    const unique = additions.filter(f => {
      const key = fretKey(f.frets);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).map((f,i)=>({
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
