// 全コードの押さえ方を、既存データを残したまま理論ベースで補完する。
// Jazz はランダム生成せず Shell / Drop 2 / Drop 3 を基本にする。
(() => {
  const originalGetForms = getForms;
  const TARGET_FORM_COUNT = originalGetForms('C', 'major', 'none').length;
  const OPEN_MIDI = [40,45,50,55,59,64]; // 6弦→1弦
  const MAX_FRET = 17;
  const fretKey = frets => frets.map(String).join('|');
  const pc = n => ((n % 12) + 12) % 12;

  function chordIntervals(type) {
    return [...new Set(typeData[type]?.intervals || [0,4,7])];
  }

  function pitchClasses(root, type) {
    const r = roots.indexOf(root);
    return chordIntervals(type).map(i => pc(r + i));
  }

  function importantIntervals(type) {
    const ints = chordIntervals(type);
    const out = [0];
    const third = ints.find(i => i === 3 || i === 4);
    const seventh = ints.find(i => i === 9 || i === 10 || i === 11);
    const fifth = ints.find(i => i === 6 || i === 7 || i === 8);
    if (third !== undefined) out.push(third);
    if (seventh !== undefined) out.push(seventh);
    if (fifth !== undefined && out.length < 4) out.push(fifth);
    for (const i of ints) if (!out.includes(i) && out.length < 4) out.push(i);
    return out;
  }

  function candidatesForPc(stringIndex, wantedPc) {
    const out = [];
    for (let fret=0; fret<=MAX_FRET; fret++) {
      const midi = OPEN_MIDI[stringIndex] + fret;
      if (pc(midi) === wantedPc) out.push({fret,midi});
    }
    return out;
  }

  function placeOrder(orderPcs, strings, preferredCenter=7, maxSpan=6) {
    if (orderPcs.length !== strings.length) return null;
    const lists = strings.map((s,i) => candidatesForPc(s, orderPcs[i]));
    let best = null;
    function walk(i, chosen) {
      if (i === lists.length) {
        for (let j=1;j<chosen.length;j++) if (chosen[j].midi <= chosen[j-1].midi) return;
        const stopped = chosen.map(x=>x.fret).filter(f=>f>0);
        const span = stopped.length ? Math.max(...stopped)-Math.min(...stopped) : 0;
        if (span > maxSpan) return;
        const avg = chosen.reduce((a,x)=>a+x.fret,0)/chosen.length;
        const score = span*2 + Math.abs(avg-preferredCenter);
        if (!best || score < best.score) best = {chosen:[...chosen],score};
        return;
      }
      for (const item of lists[i]) {
        if (chosen.length && item.midi <= chosen[chosen.length-1].midi) continue;
        chosen.push(item); walk(i+1,chosen); chosen.pop();
      }
    }
    walk(0,[]);
    if (!best) return null;
    const frets = Array(6).fill('x');
    strings.forEach((s,i)=>frets[s]=best.chosen[i].fret);
    return frets;
  }

  const rotations = arr => arr.map((_,i)=>[...arr.slice(i),...arr.slice(0,i)]);

  function pushUnique(out, seen, shape, frets) {
    if (!frets) return;
    const key = fretKey(frets);
    if (seen.has(key)) return;
    seen.add(key);
    out.push({shape,frets,barres:[]});
  }

  function triadVoicings(root,type,seen) {
    const r = roots.indexOf(root), ints = chordIntervals(type);
    const thirdLike = ints.find(i=>[2,3,4,5].includes(i));
    const fifthLike = ints.find(i=>[6,7,8].includes(i));
    if (thirdLike===undefined || fifthLike===undefined) return [];
    const triad=[pc(r),pc(r+thirdLike),pc(r+fifthLike)], out=[];
    const sets=[[1,2,3],[2,3,4],[3,4,5]];
    rotations(triad).forEach((order,inv)=>sets.forEach((set,si)=>{
      pushUnique(out,seen,`Triad・${inv===0?'Root':inv===1?'1st Inv':'2nd Inv'}・${si===0?'Middle':si===1?'Upper':'High'}`,
        placeOrder(order,set,si===2?9:7,5));
    }));
    return out;
  }

  function shellVoicings(root,type,seen) {
    const r=roots.indexOf(root), ints=chordIntervals(type);
    const third=ints.find(i=>i===3||i===4);
    const seventh=ints.find(i=>i===9||i===10||i===11);
    if (third===undefined || seventh===undefined) return [];
    const R=pc(r), T=pc(r+third), S=pc(r+seventh), out=[];
    const specs=[
      {order:[R,S,T],strings:[0,2,3],name:'Jazz Shell・6弦Root R-7-3'},
      {order:[R,T,S],strings:[0,3,4],name:'Jazz Shell・6弦Root R-3-7'},
      {order:[R,S,T],strings:[1,3,4],name:'Jazz Shell・5弦Root R-7-3'},
      {order:[R,T,S],strings:[1,4,5],name:'Jazz Shell・5弦Root R-3-7'}
    ];
    specs.forEach((s,i)=>pushUnique(out,seen,s.name,placeOrder(s.order,s.strings,i<2?6:7,6)));
    return out;
  }

  function fourNoteCore(root,type) {
    const r=roots.indexOf(root), ints=importantIntervals(type);
    if (ints.length<4) return null;
    return ints.slice(0,4).map(i=>pc(r+i));
  }

  function drop2Voicings(root,type,seen) {
    const core=fourNoteCore(root,type); if(!core) return [];
    const out=[], sets=[[0,1,2,3],[1,2,3,4],[2,3,4,5]];
    rotations(core).forEach((close,inv)=>{
      const order=[close[2],close[0],close[1],close[3]];
      sets.forEach((set,si)=>pushUnique(out,seen,
        `Jazz Drop2・${inv===0?'Root':`Inv ${inv}`}・${si===0?'Low':si===1?'Middle':'High'}`,
        placeOrder(order,set,si===0?7:9,6)));
    });
    return out;
  }

  function drop3Voicings(root,type,seen) {
    const core=fourNoteCore(root,type); if(!core) return [];
    const out=[], sets=[[0,1,3,4],[0,2,3,5],[1,2,4,5]];
    rotations(core).forEach((close,inv)=>{
      const order=[close[1],close[0],close[2],close[3]];
      sets.forEach((set,si)=>pushUnique(out,seen,
        `Jazz Drop3・${inv===0?'Root':`Inv ${inv}`}・${si===2?'5弦Bass':'6弦Bass'}`,
        placeOrder(order,set,si===2?8:6,7)));
    });
    return out;
  }

  function compactExtensionVoicings(root,type,seen) {
    const pcs=pitchClasses(root,type), out=[];
    if (pcs.length<4) return out;
    const combos=[
      pcs.slice(0,4),
      [pcs[0],pcs[1],pcs[pcs.length-2],pcs[pcs.length-1]],
      [pcs[0],pcs[2]||pcs[1],pcs[pcs.length-1],pcs[1]]
    ];
    const sets=[[1,2,3,4],[2,3,4,5]];
    combos.forEach((order,ci)=>sets.forEach((set,si)=>pushUnique(out,seen,
      `${ci===0?'Compact':'Tension'} Voicing・${si===0?'Middle':'High'}`,
      placeOrder(order,set,8+si*2,6))));
    return out;
  }

  function highVariants(forms,seen) {
    const out=[];
    for (const form of forms) {
      const shifted=form.frets.map(f=>typeof f==='number'?f+12:f);
      if (shifted.some(f=>typeof f==='number'&&f>MAX_FRET)) continue;
      pushUnique(out,seen,'High Position・12F上',shifted);
      if (out.length>=3) break;
    }
    return out;
  }

  function generateFamilies(root,type,existingKeys) {
    const seen=new Set(existingKeys), out=[];
    const add=list=>list.forEach(x=>out.push(x));
    add(triadVoicings(root,type,seen));
    add(shellVoicings(root,type,seen));
    add(drop2Voicings(root,type,seen));
    add(drop3Voicings(root,type,seen));
    add(compactExtensionVoicings(root,type,seen));
    add(highVariants(out,seen));
    return out;
  }

  getForms=function(root,type,bass){
    const forms=originalGetForms(root,type,bass)||[];
    if (bass!=='none') return forms;
    if (root==='C'&&type==='major') return forms;
    if (forms.length>=TARGET_FORM_COUNT) return forms;
    const existing=new Set(forms.map(f=>fretKey(f.frets||[])));
    const needed=TARGET_FORM_COUNT-forms.length;
    const additions=generateFamilies(root,type,existing).slice(0,needed).map((f,i)=>({
      label:`フォーム${forms.length+i+1}`,
      shape:f.shape,
      frets:f.frets,
      barres:f.barres
    }));
    return [...forms,...additions];
  };

  selectedFormIndex=0;
  render();
})();
