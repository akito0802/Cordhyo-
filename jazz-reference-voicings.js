// 実在するギター・ボイシングを、既存フォームを残したまま追加する参照パック。
// ランダム生成は行わず、教則資料の「ルート弦別ボイシング」の考え方と、
// 標準的な movable shape / compact triad を明示的に定義して全ルートへ移調する。
(() => {
  const originalGetForms = getForms;
  const fretKey = frets => frets.map(String).join('|');

  const ROOT_PC = Object.fromEntries(roots.map((n,i)=>[n,i]));
  // script.js の tuning は 6弦→1弦。ここでは各ルート弦の開放音PCを固定。
  const STRING_PC = { E:4, A:9, D:2, G:7 };

  function rootFret(root, stringName, minOffset=0, maxOffset=0) {
    const target = ROOT_PC[root];
    let fret = (target - STRING_PC[stringName] + 12) % 12;
    while (fret + minOffset < 0) fret += 12;
    if (fret + maxOffset > 17) return null;
    return fret;
  }

  function shapeFromOffsets(root, stringName, offsets) {
    if (!offsets) return null;
    const nums = offsets.filter(v => typeof v === 'number');
    if (!nums.length) return null;
    const min = Math.min(...nums), max = Math.max(...nums);
    const r = rootFret(root, stringName, min, max);
    if (r === null) return null;
    return offsets.map(v => typeof v === 'number' ? r + v : 'x');
  }

  // ------------------------------
  // Triad / basic movable voicings
  // ------------------------------
  // 6弦Root = Eフォーム、5弦Root = Aフォーム、4弦Root = Dフォーム。
  // さらに高音3弦のコンパクトな root-position triad を追加。
  const basicTriads = {
    major: [
      {name:'Standard・6弦Root Eフォーム', string:'E', offsets:[0,2,2,1,0,0]},
      {name:'Standard・5弦Root Aフォーム', string:'A', offsets:['x',0,2,2,2,0]},
      {name:'Standard・4弦Root Dフォーム', string:'D', offsets:['x','x',0,2,3,2]},
      {name:'Triad Compact・3弦Root R-3-5', string:'G', offsets:['x','x','x',0,0,-2]},
      {name:'Triad Compact・4弦Root R-3-5', string:'D', offsets:['x','x',0,-1,-2,'x']}
    ],
    minor: [
      {name:'Standard・6弦Root Emフォーム', string:'E', offsets:[0,2,2,0,0,0]},
      {name:'Standard・5弦Root Amフォーム', string:'A', offsets:['x',0,2,2,1,0]},
      {name:'Standard・4弦Root Dmフォーム', string:'D', offsets:['x','x',0,2,3,1]},
      {name:'Triad Compact・3弦Root R-b3-5', string:'G', offsets:['x','x','x',0,-1,-2]},
      {name:'Triad Compact・4弦Root R-b3-5', string:'D', offsets:['x','x',0,-2,-2,'x']}
    ],
    sus4: [
      {name:'Standard・6弦Root sus4', string:'E', offsets:[0,2,2,2,0,0]},
      {name:'Standard・5弦Root sus4', string:'A', offsets:['x',0,2,2,3,0]},
      {name:'Standard・4弦Root sus4', string:'D', offsets:['x','x',0,2,3,3]},
      {name:'Triad Compact・3弦Root R-4-5', string:'G', offsets:['x','x','x',0,1,-2]}
    ]
  };

  // ---------------------------------
  // Four-note / 6th movable voicings
  // ---------------------------------
  // 6弦・5弦・4弦ルートの定番フォーム。
  const fourNote = {
    maj7: [
      {name:'Jazz Basic・6弦Root', string:'E', offsets:[0,'x',1,1,0,'x']},
      {name:'Jazz Basic・5弦Root', string:'A', offsets:['x',0,2,1,2,'x']},
      {name:'Jazz Basic・4弦Root', string:'D', offsets:['x','x',0,2,2,2]},
      {name:'Full Voicing・6弦Root', string:'E', offsets:[0,2,1,1,0,0]}
    ],
    '7': [
      {name:'Jazz Basic・6弦Root', string:'E', offsets:[0,'x',0,1,0,'x']},
      {name:'Jazz Basic・5弦Root', string:'A', offsets:['x',0,2,0,2,'x']},
      {name:'Jazz Basic・4弦Root', string:'D', offsets:['x','x',0,2,1,2]},
      {name:'Full Voicing・6弦Root', string:'E', offsets:[0,2,0,1,0,0]},
      {name:'Full Voicing・5弦Root', string:'A', offsets:['x',0,2,0,2,0]}
    ],
    m7: [
      {name:'Jazz Basic・6弦Root', string:'E', offsets:[0,'x',0,0,0,'x']},
      {name:'Jazz Basic・5弦Root', string:'A', offsets:['x',0,2,0,1,'x']},
      {name:'Jazz Basic・4弦Root', string:'D', offsets:['x','x',0,2,1,1]},
      {name:'Full Voicing・6弦Root', string:'E', offsets:[0,2,0,0,0,0]},
      {name:'Full Voicing・5弦Root', string:'A', offsets:['x',0,2,0,1,0]}
    ],
    mMaj7: [
      {name:'mMaj7・6弦Root', string:'E', offsets:[0,2,1,0,0,0]},
      {name:'mMaj7・5弦Root', string:'A', offsets:['x',0,2,1,1,0]},
      {name:'mMaj7・4弦Root', string:'D', offsets:['x','x',0,2,2,1]}
    ],
    '6': [
      {name:'6th・6弦Root', string:'E', offsets:[0,2,2,1,2,0]},
      {name:'6th・5弦Root', string:'A', offsets:['x',0,2,2,2,2]},
      {name:'6th・4弦Root', string:'D', offsets:['x','x',0,2,0,2]}
    ],
    m6: [
      {name:'m6・6弦Root', string:'E', offsets:[0,2,2,0,2,0]},
      {name:'m6・5弦Root', string:'A', offsets:['x',0,2,2,1,2]},
      {name:'m6・4弦Root', string:'D', offsets:['x','x',0,2,0,1]}
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

  // ---------------------------------
  // Shell voicings (guide tones)
  // ---------------------------------
  // 1-3-7 / 1-7-3。m7b5 shell は5度を省略するため m7 と同形。
  const shell137E = {
    maj7:[0,-1,1,'x','x','x'], '7':[0,-1,0,'x','x','x'],
    m7:[0,-2,0,'x','x','x'], m7b5:[0,-2,0,'x','x','x'],
    '6':[0,-1,-1,'x','x','x'], m6:[0,-2,-1,'x','x','x']
  };
  const shell173E = {
    maj7:[0,'x',1,1,'x','x'], '7':[0,'x',0,1,'x','x'],
    m7:[0,'x',0,0,'x','x'], m7b5:[0,'x',0,0,'x','x'],
    '6':[0,'x',-1,1,'x','x'], m6:[0,'x',-1,0,'x','x']
  };
  const shell137A = {
    maj7:['x',0,-1,1,'x','x'], '7':['x',0,-1,0,'x','x'],
    m7:['x',0,-2,0,'x','x'], m7b5:['x',0,-2,0,'x','x'],
    '6':['x',0,-1,-1,'x','x'], m6:['x',0,-2,-1,'x','x']
  };
  const shell173A = {
    maj7:['x',0,'x',1,2,'x'], '7':['x',0,'x',0,2,'x'],
    m7:['x',0,'x',0,1,'x'], m7b5:['x',0,'x',0,1,'x'],
    '6':['x',0,'x',-1,2,'x'], m6:['x',0,'x',-1,1,'x']
  };

  function buildReferenceForms(root, type) {
    const out = [];
    const add = (name, string, offsets) => {
      const frets = shapeFromOffsets(root, string, offsets);
      if (frets) out.push({shape:name, frets, barres:[]});
    };

    (basicTriads[type] || []).forEach(v => add(v.name, v.string, v.offsets));
    (fourNote[type] || []).forEach(v => add(v.name, v.string, v.offsets));

    add('Jazz Shell 1-3-7・6弦Root','E',shell137E[type]);
    add('Jazz Shell 1-7-3・6弦Root','E',shell173E[type]);
    add('Jazz Shell 1-3-7・5弦Root','A',shell137A[type]);
    add('Jazz Shell 1-7-3・5弦Root','A',shell173A[type]);
    return out;
  }

  getForms = function(root, type, bass) {
    const forms = originalGetForms(root, type, bass) || [];
    if (bass !== 'none') return forms;

    const additions = buildReferenceForms(root, type);
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
