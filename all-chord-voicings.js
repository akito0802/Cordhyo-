// 全コードの押さえ方をCメジャー基準の数・カテゴリ感まで追加する拡張。
// 既存フォームは一切削除・上書きせず、typeDataの構成音だけを使って正しい音だけのフォームを追加する。
(() => {
  const originalGetForms = getForms;
  const TARGET_FORM_COUNT = originalGetForms('C', 'major', 'none').length;
  const MAX_FRET = 17;

  const fretKey = frets => frets.map(String).join('|');
  const pc = n => ((n % 12) + 12) % 12;

  function chordPitchClasses(root, type) {
    const rootPc = roots.indexOf(root);
    const intervals = typeData[type]?.intervals || [0,4,7];
    return new Set(intervals.map(i => pc(rootPc + i)));
  }

  function requiredPitchClasses(root, type) {
    const rootPc = roots.indexOf(root);
    const intervals = typeData[type]?.intervals || [0,4,7];
    const required = new Set([rootPc]);
    const third = intervals.find(i => i === 3 || i === 4);
    if (third !== undefined) required.add(pc(rootPc + third));
    const seventh = intervals.find(i => i === 10 || i === 11);
    if (seventh !== undefined) required.add(pc(rootPc + seventh));
    return required;
  }

  function notePcOnString(stringIndex, fret) {
    return pc(tuning[stringIndex] + fret);
  }

  function candidateFrets(stringIndex, allowed, low, high) {
    const out=[];
    for (let fret=Math.max(0,low); fret<=Math.min(MAX_FRET,high); fret++) {
      if (allowed.has(notePcOnString(stringIndex,fret))) out.push(fret);
    }
    return out;
  }

  function nearest(values,target,rank=0) {
    if (!values.length) return null;
    const sorted=[...values].sort((a,b)=>Math.abs(a-target)-Math.abs(b-target)||a-b);
    return sorted[Math.min(rank,sorted.length-1)];
  }

  function playedPcs(frets) {
    return new Set(frets.map((f,s)=>typeof f==='number'?notePcOnString(s,f):null).filter(v=>v!==null));
  }

  function validVoicing(frets, allowed, required) {
    const played=frets.map((f,s)=>({f,s})).filter(x=>typeof x.f==='number');
    if (played.length<3) return false;
    const pcs=new Set(played.map(x=>notePcOnString(x.s,x.f)));
    for (const p of pcs) if (!allowed.has(p)) return false;
    for (const p of required) if (!pcs.has(p)) return false;
    const stopped=played.map(x=>x.f).filter(f=>f>0);
    if (stopped.length && Math.max(...stopped)-Math.min(...stopped)>5) return false;
    return true;
  }

  function buildCandidate(root,type,mask,center,width,rank=0) {
    const allowed=chordPitchClasses(root,type);
    const low=Math.max(0,center-Math.floor(width/2));
    const high=Math.min(MAX_FRET,low+width);
    const frets=Array(6).fill('x');
    mask.forEach((s,i)=>{
      const list=candidateFrets(s,allowed,low,high);
      const picked=nearest(list,center+((i%3)-1),rank);
      if (picked!==null) frets[s]=picked;
    });
    return frets;
  }

  function findVoicing(root,type,config,seen) {
    const allowed=chordPitchClasses(root,type);
    const required=requiredPitchClasses(root,type);
    for (const center of config.centers) {
      for (const width of config.widths) {
        for (const mask of config.masks) {
          for (const rank of [0,1,2]) {
            const frets=buildCandidate(root,type,mask,center,width,rank);
            if (!validVoicing(frets,allowed,required)) continue;
            const key=fretKey(frets);
            if (seen.has(key)) continue;
            seen.add(key);
            return frets;
          }
        }
      }
    }
    return null;
  }

  const categoryConfigs = [
    {
      shape:'初心者・コンパクト',
      centers:[1,2,3,4], widths:[3,4],
      masks:[[1,2,3,4,5],[2,3,4,5],[1,2,3,4],[2,3,4],[3,4,5]]
    },
    {
      shape:'Open系・低ポジション',
      centers:[1,2,3,4], widths:[4,5],
      masks:[[0,1,2,3,4,5],[1,2,3,4,5],[0,1,2,3,4]]
    },
    {
      shape:'CAGED・6弦ルート',
      centers:[3,5,7,8,10], widths:[4,5],
      masks:[[0,1,2,3,4,5],[0,1,2,3,4]]
    },
    {
      shape:'CAGED・5弦ルート',
      centers:[3,5,7,9,10,12], widths:[4,5],
      masks:[[1,2,3,4,5],[1,2,3,4]]
    },
    {
      shape:'Triad・高音3弦',
      centers:[3,5,7,9,10,12], widths:[3,4],
      masks:[[3,4,5],[2,3,4]]
    },
    {
      shape:'Triad・中音3弦',
      centers:[3,5,7,9,10,12], widths:[3,4],
      masks:[[2,3,4],[1,2,3]]
    },
    {
      shape:'Cutting・コンパクト',
      centers:[5,7,9,10,12], widths:[3,4],
      masks:[[2,3,4,5],[1,2,3,4],[2,3,4]]
    },
    {
      shape:'Jazz・4音ボイシング',
      centers:[3,5,7,9,10,12], widths:[4,5],
      masks:[[1,2,3,4],[2,3,4,5],[0,2,3,4],[1,2,4,5]]
    },
    {
      shape:'Wide・ワイドボイシング',
      centers:[5,7,9,10,12], widths:[5],
      masks:[[0,2,3,5],[1,2,4,5],[0,1,3,5],[0,2,4,5]]
    },
    {
      shape:'High・ハイポジション',
      centers:[12,13,14,15,16], widths:[4,5],
      masks:[[0,1,2,3,4,5],[1,2,3,4,5],[2,3,4,5],[1,2,3,4]]
    }
  ];

  function fallbackVoicings(root,type,seen,needed) {
    const out=[];
    const allowed=chordPitchClasses(root,type);
    const required=requiredPitchClasses(root,type);
    const masks=[[0,1,2,3,4,5],[1,2,3,4,5],[0,1,2,3],[1,2,3,4],[2,3,4,5],[0,2,3,5],[1,2,4,5],[0,1,3,4]];
    for (let low=0; low<=14 && out.length<needed; low++) {
      const high=Math.min(MAX_FRET,low+5);
      for (const mask of masks) {
        if (out.length>=needed) break;
        for (let variant=0; variant<3 && out.length<needed; variant++) {
          const frets=Array(6).fill('x');
          let ok=true;
          mask.forEach((s,i)=>{
            const list=candidateFrets(s,allowed,low,high).slice(0,4);
            if (!list.length) { ok=false; return; }
            frets[s]=list[(variant+i)%list.length];
          });
          if (!ok || !validVoicing(frets,allowed,required)) continue;
          const key=fretKey(frets);
          if (seen.has(key)) continue;
          seen.add(key);
          out.push({shape:`実用ボイシング${out.length+1}`,frets,barres:[]});
        }
      }
    }
    return out;
  }

  getForms = function(root,type,bass) {
    const forms=originalGetForms(root,type,bass)||[];
    if (bass!=='none') return forms;
    if (root==='C' && type==='major') return forms;
    if (forms.length>=TARGET_FORM_COUNT) return forms;

    const seen=new Set(forms.map(f=>fretKey(f.frets||[])));
    const additions=[];

    for (const config of categoryConfigs) {
      if (forms.length+additions.length>=TARGET_FORM_COUNT) break;
      const frets=findVoicing(root,type,config,seen);
      if (!frets) continue;
      additions.push({
        label:`フォーム${forms.length+additions.length+1}`,
        shape:config.shape,
        frets,
        barres:[]
      });
    }

    if (forms.length+additions.length<TARGET_FORM_COUNT) {
      const needed=TARGET_FORM_COUNT-(forms.length+additions.length);
      fallbackVoicings(root,type,seen,needed).forEach(form=>{
        additions.push({
          label:`フォーム${forms.length+additions.length+1}`,
          shape:form.shape,
          frets:form.frets,
          barres:form.barres
        });
      });
    }

    return [...forms,...additions];
  };

  selectedFormIndex=0;
  render();
})();
