// 実在するギター・ボイシングを、既存フォームを残したまま追加する参照パック。
// ランダム生成は行わず、教則資料の「ルート弦別ボイシング」の考え方を明示的に定義して全ルートへ移調する。
(() => {
  const originalGetForms = getForms;
  const fretKey = frets => frets.map(String).join('|');

  const ROOT_PC = Object.fromEntries(roots.map((n,i)=>[n,i]));
  // 6弦→1弦: E A D G B E
  const STRING_PC = { E6:4, A5:9, D4:2, G3:7, B2:11, E1:4 };

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

  // --------------------------------------------------
  // 通常コード: ボイシング資料の「ルート弦別」体系を反映
  // --------------------------------------------------
  const standardVoicings = {
    major: [
      {name:'定番・6弦Root Eフォーム', string:'E6', offsets:[0,2,2,1,0,0]},
      {name:'省略・6弦Root 3音', string:'E6', offsets:[0,'x','x',1,0,'x']},
      {name:'定番・5弦Root Aフォーム', string:'A5', offsets:['x',0,2,2,2,0]},
      {name:'省略・5弦Root 3音', string:'A5', offsets:['x',0,'x',2,2,'x']},
      {name:'定番・4弦Root Dフォーム', string:'D4', offsets:['x','x',0,2,3,2]},
      {name:'省略・4弦Root 3音', string:'D4', offsets:['x','x',0,'x',3,2]},
      {name:'トライアド・3弦Root', string:'G3', offsets:['x','x','x',0,0,-2]},
      {name:'トライアド・2弦Root', string:'B2', offsets:['x','x','x',1,0,-1]},
      {name:'トライアド・1弦Root', string:'E1', offsets:['x','x','x',1,1,0]}
    ],
    minor: [
      {name:'定番・6弦Root Emフォーム', string:'E6', offsets:[0,2,2,0,0,0]},
      {name:'省略・6弦Root 3音', string:'E6', offsets:[0,'x','x',0,0,'x']},
      {name:'定番・5弦Root Amフォーム', string:'A5', offsets:['x',0,2,2,1,0]},
      {name:'省略・5弦Root 3音', string:'A5', offsets:['x',0,'x',2,1,'x']},
      {name:'定番・4弦Root Dmフォーム', string:'D4', offsets:['x','x',0,2,3,1]},
      {name:'省略・4弦Root 3音', string:'D4', offsets:['x','x',0,'x',3,1]},
      {name:'トライアド・3弦Root', string:'G3', offsets:['x','x','x',0,-1,-2]},
      {name:'トライアド・2弦Root', string:'B2', offsets:['x','x','x',0,0,-1]},
      {name:'トライアド・1弦Root', string:'E1', offsets:['x','x','x',0,1,0]}
    ],
    sus4: [
      {name:'定番・6弦Root sus4', string:'E6', offsets:[0,2,2,2,0,0]},
      {name:'省略・6弦Root 3音', string:'E6', offsets:[0,'x','x',2,0,'x']},
      {name:'定番・5弦Root sus4', string:'A5', offsets:['x',0,2,2,3,0]},
      {name:'省略・5弦Root 3音', string:'A5', offsets:['x',0,'x',2,3,'x']},
      {name:'定番・4弦Root sus4', string:'D4', offsets:['x','x',0,2,3,3]},
      {name:'省略・4弦Root 3音', string:'D4', offsets:['x','x',0,'x',3,3]},
      {name:'トライアド・3弦Root', string:'G3', offsets:['x','x','x',0,1,-2]},
      {name:'トライアド・2弦Root', string:'B2', offsets:['x','x','x',2,0,-1]},
      {name:'トライアド・1弦Root', string:'E1', offsets:['x','x','x',2,1,0]}
    ],
    aug: [
      {name:'定番・6弦Root aug', string:'E6', offsets:[0,'x',2,1,1,'x']},
      {name:'定番・5弦Root aug', string:'A5', offsets:['x',0,3,2,2,'x']},
      {name:'定番・4弦Root aug', string:'D4', offsets:['x','x',0,3,3,2]},
      {name:'トライアド・3弦Root aug', string:'G3', offsets:['x','x','x',0,1,-1]},
      {name:'トライアド・2弦Root aug', string:'B2', offsets:['x','x','x',1,0,0]},
      {name:'トライアド・1弦Root aug', string:'E1', offsets:['x','x','x',1,2,0]}
    ],
    dim: [
      {name:'定番・6弦Root dim', string:'E6', offsets:[0,'x',1,0,1,'x']},
      {name:'定番・5弦Root dim', string:'A5', offsets:['x',0,1,2,1,'x']},
      {name:'定番・4弦Root dim', string:'D4', offsets:['x','x',0,1,0,1]},
      {name:'トライアド・3弦Root dim', string:'G3', offsets:['x','x','x',0,-1,-1]},
      {name:'トライアド・2弦Root dim', string:'B2', offsets:['x','x','x',0,0,-2]},
      {name:'トライアド・1弦Root dim', string:'E1', offsets:['x','x','x',0,1,-1]}
    ]
  };

  // --------------------------------------------------
  // 4和音: ルート弦別の定番 / ジャズ実用ボイシング
  // --------------------------------------------------
  const fourNote = {
    maj7: [
      {name:'Jazz Basic・6弦Root', string:'E6', offsets:[0,'x',1,1,0,'x']},
      {name:'Jazz Basic・5弦Root', string:'A5', offsets:['x',0,2,1,2,'x']},
      {name:'Jazz Basic・4弦Root', string:'D4', offsets:['x','x',0,2,2,2]},
      {name:'Full Voicing・6弦Root', string:'E6', offsets:[0,2,1,1,0,0]},
      {name:'High・3弦Root maj7', string:'G3', offsets:['x','x','x',0,0,-1]}
    ],
    '7': [
      {name:'Jazz Basic・6弦Root', string:'E6', offsets:[0,'x',0,1,0,'x']},
      {name:'Jazz Basic・5弦Root', string:'A5', offsets:['x',0,2,0,2,'x']},
      {name:'Jazz Basic・4弦Root', string:'D4', offsets:['x','x',0,2,1,2]},
      {name:'Full Voicing・6弦Root', string:'E6', offsets:[0,2,0,1,0,0]},
      {name:'Full Voicing・5弦Root', string:'A5', offsets:['x',0,2,0,2,0]},
      {name:'High・3弦Root 7', string:'G3', offsets:['x','x','x',0,0,-2]}
    ],
    m7: [
      {name:'Jazz Basic・6弦Root', string:'E6', offsets:[0,'x',0,0,0,'x']},
      {name:'Jazz Basic・5弦Root', string:'A5', offsets:['x',0,2,0,1,'x']},
      {name:'Jazz Basic・4弦Root', string:'D4', offsets:['x','x',0,2,1,1]},
      {name:'Full Voicing・6弦Root', string:'E6', offsets:[0,2,0,0,0,0]},
      {name:'Full Voicing・5弦Root', string:'A5', offsets:['x',0,2,0,1,0]},
      {name:'High・3弦Root m7', string:'G3', offsets:['x','x','x',0,-1,-2]}
    ],
    mMaj7: [
      {name:'mMaj7・6弦Root', string:'E6', offsets:[0,2,1,0,0,0]},
      {name:'mMaj7・5弦Root', string:'A5', offsets:['x',0,2,1,1,0]},
      {name:'mMaj7・4弦Root', string:'D4', offsets:['x','x',0,2,2,1]}
    ],
    '6': [
      {name:'6th・6弦Root', string:'E6', offsets:[0,2,2,1,2,0]},
      {name:'6th・5弦Root', string:'A5', offsets:['x',0,2,2,2,2]},
      {name:'6th・4弦Root', string:'D4', offsets:['x','x',0,2,0,2]}
    ],
    m6: [
      {name:'m6・6弦Root', string:'E6', offsets:[0,2,2,0,2,0]},
      {name:'m6・5弦Root', string:'A5', offsets:['x',0,2,2,1,2]},
      {name:'m6・4弦Root', string:'D4', offsets:['x','x',0,2,0,1]}
    ],
    m7b5: [
      {name:'Jazz Basic・6弦Root', string:'E6', offsets:[0,'x',0,0,-1,'x']},
      {name:'Jazz Basic・5弦Root', string:'A5', offsets:['x',0,1,0,1,'x']},
      {name:'Jazz Basic・4弦Root', string:'D4', offsets:['x','x',0,1,1,1]}
    ],
    dim7: [
      {name:'Jazz Basic・6弦Root', string:'E6', offsets:[0,'x',-1,0,-1,'x']},
      {name:'Jazz Basic・5弦Root', string:'A5', offsets:['x',0,1,-1,1,'x']},
      {name:'Jazz Basic・4弦Root', string:'D4', offsets:['x','x',0,1,0,1]}
    ]
  };

  // Shell voicings (guide tones): 1-3-7 / 1-7-3
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

    (standardVoicings[type] || []).forEach(v => add(v.name, v.string, v.offsets));
    (fourNote[type] || []).forEach(v => add(v.name, v.string, v.offsets));

    add('Jazz Shell 1-3-7・6弦Root','E6',shell137E[type]);
    add('Jazz Shell 1-7-3・6弦Root','E6',shell173E[type]);
    add('Jazz Shell 1-3-7・5弦Root','A5',shell137A[type]);
    add('Jazz Shell 1-7-3・5弦Root','A5',shell173A[type]);
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
      shape:`📘 ${f.shape}`,
      frets:f.frets,
      barres:f.barres
    }));

    return [...forms, ...unique];
  };

  selectedFormIndex = 0;
  render();
})();
