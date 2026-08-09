// Source-only chord inversion voicings transcribed from uploaded Super Guitar Chords PDF, pp.46-53.
// Existing forms are preserved. PDF labels remain visible even when fret layouts duplicate generic forms.
(() => {
  if (typeof getForms !== 'function' || typeof roots === 'undefined') return;
  const previous = getForms;
  const PC = Object.fromEntries(roots.map((n,i)=>[n,i]));
  const playable = f => f.every(v=>v==='x'||(Number.isInteger(v)&&v>=0&&v<=21));

  const FORMS = {
    maj7: [
      ['📘 PDF p46 Drop2・A弦Bass Root',['x',3,5,4,5,'x']],
      ['📘 PDF p46 Drop2・A弦Bass 3rd',['x',7,9,5,8,'x']],
      ['📘 PDF p46 Drop2・A弦Bass 5th',['x',10,10,9,12,'x']],
      ['📘 PDF p46 Drop2・A弦Bass 7th',['x',14,14,12,13,'x']],
      ['📘 PDF p46 Drop2・D弦Bass Root',['x','x',10,12,12,12]],
      ['📘 PDF p46 Drop2・D弦Bass 3rd',['x','x',2,4,5,3]],
      ['📘 PDF p46 Drop2・D弦Bass 5th',['x','x',5,5,5,7]],
      ['📘 PDF p46 Drop2・D弦Bass 7th',['x','x',9,9,8,8]],
      ['📘 PDF p47 Drop3・E弦Bass Root',[8,'x',9,9,8,'x']],
      ['📘 PDF p47 Drop3・E弦Bass 3rd',[12,'x',14,12,13,'x']],
      ['📘 PDF p47 Drop3・E弦Bass 5th',[3,'x',5,4,5,'x']],
      ['📘 PDF p47 Drop3・E弦Bass 7th',[7,'x',9,9,8,'x']],
      ['📘 PDF p47 Drop3・A弦Bass Root',['x',3,'x',4,5,3]],
      ['📘 PDF p47 Drop3・A弦Bass 3rd',['x',7,'x',9,8,8]],
      ['📘 PDF p47 Drop3・A弦Bass 5th',['x',10,'x',12,12,12]],
      ['📘 PDF p47 Drop3・A弦Bass 7th',['x',14,'x',16,13,15]]
    ],
    '7': [
      ['📘 PDF p48 Drop2・A弦Bass Root',['x',3,5,3,5,'x']],
      ['📘 PDF p48 Drop2・A弦Bass 3rd',['x',7,8,5,8,'x']],
      ['📘 PDF p48 Drop2・A弦Bass 5th',['x',10,10,9,11,'x']],
      ['📘 PDF p48 Drop2・A弦Bass ♭7th',['x',13,14,12,13,'x']],
      ['📘 PDF p48 Drop2・D弦Bass Root',['x','x',10,12,11,12]],
      ['📘 PDF p48 Drop2・D弦Bass 3rd',['x','x',2,3,5,3]],
      ['📘 PDF p48 Drop2・D弦Bass 5th',['x','x',5,5,5,6]],
      ['📘 PDF p48 Drop2・D弦Bass ♭7th',['x','x',8,9,8,8]],
      ['📘 PDF p49 Drop3・E弦Bass Root',[8,'x',8,9,8,'x']],
      ['📘 PDF p49 Drop3・E弦Bass 3rd',[12,'x',14,12,11,'x']],
      ['📘 PDF p49 Drop3・E弦Bass 5th',[3,'x',5,3,5,'x']],
      ['📘 PDF p49 Drop3・E弦Bass ♭7th',[6,'x',8,9,8,'x']],
      ['📘 PDF p49 Drop3・A弦Bass Root',['x',3,'x',3,5,3]],
      ['📘 PDF p49 Drop3・A弦Bass 3rd',['x',7,'x',8,8,8]],
      ['📘 PDF p49 Drop3・A弦Bass 5th',['x',10,'x',12,11,12]],
      ['📘 PDF p49 Drop3・A弦Bass ♭7th',['x',13,'x',15,13,15]]
    ],
    m7: [
      ['📘 PDF p50 Drop2・A弦Bass Root',['x',3,5,3,4,'x']],
      ['📘 PDF p50 Drop2・A弦Bass ♭3rd',['x',6,8,5,8,'x']],
      ['📘 PDF p50 Drop2・A弦Bass 5th',['x',10,10,8,11,'x']],
      ['📘 PDF p50 Drop2・A弦Bass ♭7th',['x',13,13,12,13,'x']],
      ['📘 PDF p50 Drop2・D弦Bass Root',['x','x',10,12,11,11]],
      ['📘 PDF p50 Drop2・D弦Bass ♭3rd',['x','x',1,3,4,3]],
      ['📘 PDF p50 Drop2・D弦Bass 5th',['x','x',5,5,4,6]],
      ['📘 PDF p50 Drop2・D弦Bass ♭7th',['x','x',8,8,8,8]],
      ['📘 PDF p51 Drop3・E弦Bass Root',[8,'x',8,8,8,'x']],
      ['📘 PDF p51 Drop3・E弦Bass ♭3rd',[11,'x',13,12,11,'x']],
      ['📘 PDF p51 Drop3・E弦Bass 5th',[3,'x',5,3,4,'x']],
      ['📘 PDF p51 Drop3・E弦Bass ♭7th',[6,'x',8,8,8,'x']],
      ['📘 PDF p51 Drop3・A弦Bass Root',['x',3,'x',3,4,3]],
      ['📘 PDF p51 Drop3・A弦Bass ♭3rd',['x',6,'x',8,8,8]],
      ['📘 PDF p51 Drop3・A弦Bass 5th',['x',10,'x',12,11,11]],
      ['📘 PDF p51 Drop3・A弦Bass ♭7th',['x',13,'x',15,13,14]]
    ],
    m7b5: [
      ['📘 PDF p52 Drop2・A弦Bass Root',['x',3,4,3,4,'x']],
      ['📘 PDF p52 Drop2・A弦Bass ♭3rd',['x',6,8,4,8,'x']],
      ['📘 PDF p52 Drop2・A弦Bass ♭5th',['x',9,10,8,11,'x']],
      ['📘 PDF p52 Drop2・A弦Bass ♭7th',['x',13,13,11,13,'x']],
      ['📘 PDF p52 Drop2・D弦Bass Root',['x','x',10,11,11,11]],
      ['📘 PDF p52 Drop2・D弦Bass ♭3rd',['x','x',1,3,4,2]],
      ['📘 PDF p52 Drop2・D弦Bass ♭5th',['x','x',4,5,4,6]],
      ['📘 PDF p52 Drop2・D弦Bass ♭7th',['x','x',8,8,7,8]],
      ['📘 PDF p53 Drop3・E弦Bass Root',[8,'x',8,8,7,'x']],
      ['📘 PDF p53 Drop3・E弦Bass ♭3rd',[11,'x',12,12,11,'x']],
      ['📘 PDF p53 Drop3・E弦Bass ♭5th',[2,'x',4,3,4,'x']],
      ['📘 PDF p53 Drop3・E弦Bass ♭7th',[6,'x',8,8,7,'x']],
      ['📘 PDF p53 Drop3・A弦Bass Root',['x',3,'x',3,4,2]],
      ['📘 PDF p53 Drop3・A弦Bass ♭3rd',['x',6,'x',8,7,8]],
      ['📘 PDF p53 Drop3・A弦Bass ♭5th',['x',9,'x',11,11,11]],
      ['📘 PDF p53 Drop3・A弦Bass ♭7th',['x',13,'x',15,13,13]]
    ]
  };

  function transposeNearest(cFrets, root) {
    const shift = PC[root];
    const tries=[shift,shift-12,shift+12];
    for(const s of tries){
      const f=cFrets.map(v=>typeof v==='number'?v+s:'x');
      if(playable(f)) return f;
    }
    return null;
  }

  getForms = function(root,type,bass){
    const base=previous(root,type,bass)||[];
    if(bass!=='none'||!FORMS[type]) return base;
    const names=new Set(base.map(f=>f.shape));
    const add=[];
    FORMS[type].forEach(([shape,cFrets])=>{
      if(names.has(shape)) return;
      const frets=transposeNearest(cFrets,root);
      if(!frets) return;
      names.add(shape);
      add.push({shape,frets,barres:[]});
    });
    return base.concat(add);
  };

  window.__PDF_INVERSIONS_SOURCE_LOADED__=true;
  if(typeof render==='function') render();
})();
