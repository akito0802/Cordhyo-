// Source-only altered dominant voicings transcribed from the uploaded Super Guitar Chords PDF, pp.37-44.
// No theory-generated voicings. Existing forms are preserved and exact duplicates are skipped.
(() => {
  if (typeof getForms !== 'function' || typeof roots === 'undefined' || typeof typeData === 'undefined') return;

  const previous = getForms;
  const PC = Object.fromEntries(roots.map((n,i)=>[n,i]));
  const OPEN = [4,9,2,7,11,4];
  const key = f => f.join('|');

  function addType(id, suffix, label, intervals, mood, use, afterValue='7sus4b9') {
    if (typeData[id]) return;
    typeData[id] = {suffix,label,intervals,mood,use};
    const group = Array.from(typeSelect?.querySelectorAll('optgroup') || []).find(g => g.label === '装飾・サスコード' || g.label === 'オルタード');
    if (!group || typeSelect.querySelector(`option[value="${id}"]`)) return;
    const opt=document.createElement('option'); opt.value=id; opt.textContent=label;
    const after=group.querySelector(`option[value="${afterValue}"]`);
    if (after) after.insertAdjacentElement('afterend',opt); else group.appendChild(opt);
  }

  addType('13sus4b9','13sus4♭9','13sus4♭9',[0,1,5,7,9,10],'厚いサス響きに♭9の緊張感','ジャズのマイナー解決前に。','7sus4b9');
  addType('7sus4b9b13','7sus4(♭9,♭13)','7sus4(♭9,♭13)',[0,1,5,7,8,10],'非常に濃いサス・ドミナント','マイナーキーの強い緊張に。','13sus4b9');
  if (!typeData['13s11']) {
    typeData['13s11']={suffix:'13♯11',label:'13♯11',intervals:[0,2,4,6,7,9,10],mood:'明るく鋭いリディアン・ドミナント',use:'ジャズの代理ドミナントに。'};
    const g=Array.from(typeSelect?.querySelectorAll('optgroup')||[]).find(x=>x.label==='9・11・13系');
    if(g&&!typeSelect.querySelector('option[value="13s11"]')){const o=document.createElement('option');o.value='13s11';o.textContent='13♯11';const a=g.querySelector('option[value="13"]');a?a.insertAdjacentElement('afterend',o):g.appendChild(o);}
  }

  // C-reference shapes from the diagrams. Labels retain source page and chord spelling.
  const C_FORMS = {
    '7b9':[
      ['PDF p37・C7♭9 6弦Root',[8,'x',8,9,8,9]],
      ['PDF p37・C7♭9 5弦Root',['x',3,2,3,2,'x']],
      ['PDF p37・C7♭9 4弦Root',['x','x',10,9,11,9]]
    ],
    '7sus4b9':[
      ['PDF p38・C7sus4(♭9) 5弦Root',['x',3,3,3,2,'x']]
    ],
    '13sus4b9':[
      ['PDF p38・C13sus4(♭9) 6弦Root',[8,'x',8,10,10,9]]
    ],
    '7sus4b9b13':[
      ['PDF p38・C7sus4(♭9,♭13) 6弦Root',[8,'x',8,10,9,9]]
    ],
    '13b9':[
      ['PDF p39・C13♭9 6弦Root',[8,'x',8,9,10,9]],
      ['PDF p39・C13♭9 5弦Root',['x',3,2,3,2,5]]
    ],
    '13s9':[
      ['PDF p39・C13♯9 6弦Root',[8,'x',8,9,10,11]]
    ],
    '7s9':[
      ['PDF p40・C7♯9 6弦Root',[8,'x',8,9,8,11]],
      ['PDF p40・C7♯9 5弦Root',['x',3,2,3,4,'x']],
      ['PDF p40・C7♯9 4弦Root',['x','x',10,9,11,11]]
    ],
    '7s11':[
      ['PDF p41・C7♯11 6弦Root',[8,'x',8,9,7,'x']],
      ['PDF p41・C7♯11 5弦Root',['x',3,4,3,5,'x']]
    ],
    '13s11':[
      ['PDF p41・C13♯11 5弦Root',['x',3,2,3,5,7]]
    ],
    '7b13':[
      ['PDF p42・C7♭13 6弦Root',[8,'x',8,9,9,8]],
      ['PDF p42・C7♭13 5弦Root',['x',3,3,3,4,'x']],
      ['PDF p42・C7♭13 4弦Root',['x','x',10,9,11,8]]
    ],
    '7b5b9':[
      ['PDF p43・C7♭5(♭9) 6弦Root',[8,'x',8,9,7,9]],
      ['PDF p43・C7♭5(♭9) 5弦Root',['x',3,2,3,2,2]]
    ],
    '7b5s9':[
      ['PDF p43・C7♭5(♯9) 6弦Root',[8,'x',8,9,7,11]],
      ['PDF p43・C7♭5(♯9) 5弦Root',['x',3,2,3,4,2]]
    ],
    '7s5b9':[
      ['PDF p44・C7♯5(♭9) 6弦Root',[8,'x',8,9,9,9]],
      ['PDF p44・C7♯5(♭9) 5弦Root',['x',3,2,3,2,4]]
    ],
    '7s5s9':[
      ['PDF p44・C7♯5(♯9) 6弦Root',[8,'x',8,9,9,11]],
      ['PDF p44・C7♯5(♯9) 5弦Root',['x',3,2,3,4,4]]
    ]
  };

  const REQUIRED={
    '7b9':[0,1,4,10], '7sus4b9':[0,1,5,10], '13sus4b9':[0,1,5,9,10], '7sus4b9b13':[0,1,5,8,10],
    '13b9':[0,1,4,9,10], '13s9':[0,3,4,9,10], '7s9':[0,3,4,10], '7s11':[0,4,6,10], '13s11':[0,4,6,9,10],
    '7b13':[0,4,8,10], '7b5b9':[0,1,4,6,10], '7b5s9':[0,3,4,6,10], '7s5b9':[0,1,4,8,10], '7s5s9':[0,3,4,8,10]
  };

  function transposeNearest(cFrets,root){
    const p=PC[root];
    for(const s of [p,p-12,p+12]){
      const f=cFrets.map(v=>typeof v==='number'?v+s:'x');
      const n=f.filter(v=>typeof v==='number');
      if(n.length&&Math.min(...n)>=0&&Math.max(...n)<=21)return f;
    }
    return null;
  }
  function tones(root,frets){const r=PC[root];return frets.map((f,i)=>f==='x'?null:(OPEN[i]+f-r+24)%12).filter(v=>v!==null);}
  function valid(root,type,frets){const allowed=new Set(typeData[type]?.intervals||[]);const t=tones(root,frets);if(!t.length||t.some(v=>!allowed.has(v)))return false;const h=new Set(t);return (REQUIRED[type]||[0]).every(v=>h.has(v));}

  getForms=function(root,type,bass){
    const base=previous(root,type,bass)||[];
    if(bass!=='none'||!C_FORMS[type])return base;
    const seen=new Set(base.map(f=>key(f.frets||[]))), add=[];
    for(const [shape,c] of C_FORMS[type]){
      const frets=transposeNearest(c,root);
      if(!frets||!valid(root,type,frets)||seen.has(key(frets)))continue;
      seen.add(key(frets)); add.push({shape,frets,barres:[]});
    }
    return base.concat(add);
  };

  window.__PDF_ALTERED_SOURCE_PACK_LOADED__=true;
  if(typeof updateBassOptions==='function')updateBassOptions();
  if(typeof render==='function')render();
})();
