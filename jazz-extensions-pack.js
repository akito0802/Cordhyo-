// Super Guitar Chords PDF reference pack.
// Existing forms are preserved. Fixed C-reference voicings are transposed to all roots.
(() => {
  const prev = getForms;
  const ROOT = Object.fromEntries(roots.map((n,i)=>[n,i]));
  const key = f => f.join('|');
  const transpose = (root,c) => c.map(v=>typeof v==='number'?v+ROOT[root]:'x');
  const valid = f => f.every(v=>v==='x'||(v>=0&&v<=21));

  const altered={
    '7s11':[['PDF・7♯11 low',['x',8,8,9,7,'x']],['PDF・7♯11 mid',[8,8,8,9,10,'x']],['PDF・7♯11 high',['x',3,4,3,5,'x']]],
    '7b13':[['PDF・7♭13 low',['x',8,8,9,9,8]],['PDF・7♭13 mid',['x',3,3,3,4,'x']],['PDF・7♭13 high',['x',15,17,15,17,'x']]],
    '13b9':[['PDF・13♭9 low',['x',8,8,9,8,10]],['PDF・13♭9 compact',['x',3,2,3,3,5]]],
    '13s9':[['PDF・13♯9',[8,8,8,9,10,11]]],
    '7b5b9':[['PDF・7♭5(♭9) low',['x',8,8,9,7,9]],['PDF・7♭5(♭9) compact',['x',3,2,3,2,2]]],
    '7b5s9':[['PDF・7♭5(♯9) low',['x',8,8,9,7,11]],['PDF・7♭5(♯9) compact',['x',3,2,3,4,2]]],
    '7s5b9':[['PDF・7♯5(♭9) low',['x',8,8,9,9,9]],['PDF・7♯5(♭9) compact',['x',3,2,3,2,4]]],
    '7s5s9':[['PDF・7♯5(♯9) low',[8,8,8,9,9,11]],['PDF・7♯5(♯9) compact',['x',3,2,3,4,4]]]
  };

  // Drop 2: four adjacent upper strings, A- and D-string bass sets.
  const drop2={
    maj7:[
      ['PDF Drop2・A弦 Root',['x',3,5,4,5,'x']],['PDF Drop2・A弦 3rd',['x',7,9,5,8,'x']],['PDF Drop2・A弦 5th',['x',10,10,9,12,'x']],['PDF Drop2・A弦 7th',['x',14,14,12,13,'x']],
      ['PDF Drop2・D弦 Root',['x','x',10,12,12,12]],['PDF Drop2・D弦 3rd',['x','x',2,4,5,3]],['PDF Drop2・D弦 5th',['x','x',5,5,5,7]],['PDF Drop2・D弦 7th',['x','x',9,9,8,8]]
    ],
    '7':[
      ['PDF Drop2・A弦 Root',['x',3,5,3,5,'x']],['PDF Drop2・A弦 3rd',['x',7,8,5,8,'x']],['PDF Drop2・A弦 5th',['x',10,10,9,11,'x']],['PDF Drop2・A弦 ♭7th',['x',13,14,12,13,'x']],
      ['PDF Drop2・D弦 Root',['x','x',10,12,11,12]],['PDF Drop2・D弦 3rd',['x','x',2,3,5,3]],['PDF Drop2・D弦 5th',['x','x',5,5,5,6]],['PDF Drop2・D弦 ♭7th',['x','x',8,9,8,8]]
    ],
    m7:[
      ['PDF Drop2・A弦 Root',['x',3,5,3,4,'x']],['PDF Drop2・A弦 ♭3rd',['x',6,8,5,8,'x']],['PDF Drop2・A弦 5th',['x',10,10,8,11,'x']],['PDF Drop2・A弦 ♭7th',['x',13,13,12,13,'x']],
      ['PDF Drop2・D弦 Root',['x','x',10,12,11,11]],['PDF Drop2・D弦 ♭3rd',['x','x',1,3,4,3]],['PDF Drop2・D弦 5th',['x','x',5,5,4,6]],['PDF Drop2・D弦 ♭7th',['x','x',8,8,8,8]]
    ],
    m7b5:[
      ['PDF Drop2・A弦 Root',['x',3,4,3,4,'x']],['PDF Drop2・A弦 ♭3rd',['x',6,8,4,8,'x']],['PDF Drop2・A弦 ♭5th',['x',9,10,8,11,'x']],['PDF Drop2・A弦 ♭7th',['x',13,13,11,13,'x']],
      ['PDF Drop2・D弦 Root',['x','x',10,11,11,11]],['PDF Drop2・D弦 ♭3rd',['x','x',1,3,4,2]],['PDF Drop2・D弦 ♭5th',['x','x',4,5,4,6]],['PDF Drop2・D弦 ♭7th',['x','x',8,8,7,8]]
    ]
  };

  // Drop 3: one skipped string between bass and upper three-note structure.
  const drop3={
    maj7:[['PDF Drop3・6弦 Root',[8,'x',9,9,8,'x']],['PDF Drop3・6弦 3rd',[12,'x',14,12,13,'x']],['PDF Drop3・6弦 5th',[3,'x',5,4,5,'x']],['PDF Drop3・6弦 7th',[7,'x',9,9,8,'x']],['PDF Drop3・5弦 Root',['x',3,'x',4,5,3]],['PDF Drop3・5弦 3rd',['x',7,'x',9,8,8]],['PDF Drop3・5弦 5th',['x',10,'x',12,12,12]],['PDF Drop3・5弦 7th',['x',14,'x',16,13,15]]],
    '7':[['PDF Drop3・6弦 Root',[8,'x',8,9,8,'x']],['PDF Drop3・6弦 3rd',[12,'x',14,12,11,'x']],['PDF Drop3・6弦 5th',[3,'x',5,3,5,'x']],['PDF Drop3・6弦 ♭7th',[6,'x',8,9,8,'x']],['PDF Drop3・5弦 Root',['x',3,'x',3,5,3]],['PDF Drop3・5弦 3rd',['x',7,'x',8,8,8]],['PDF Drop3・5弦 5th',['x',10,'x',12,11,12]],['PDF Drop3・5弦 ♭7th',['x',13,'x',15,13,15]]],
    m7:[['PDF Drop3・6弦 Root',[8,'x',8,8,8,'x']],['PDF Drop3・6弦 ♭3rd',[11,'x',13,12,11,'x']],['PDF Drop3・6弦 5th',[3,'x',5,3,4,'x']],['PDF Drop3・6弦 ♭7th',[6,'x',8,8,8,'x']],['PDF Drop3・5弦 Root',['x',3,'x',3,4,3]],['PDF Drop3・5弦 ♭3rd',['x',6,'x',8,8,8]],['PDF Drop3・5弦 5th',['x',10,'x',12,11,11]],['PDF Drop3・5弦 ♭7th',['x',13,'x',15,13,14]]],
    m7b5:[['PDF Drop3・6弦 Root',[8,'x',8,8,7,'x']],['PDF Drop3・6弦 ♭3rd',[11,'x',12,12,11,'x']],['PDF Drop3・6弦 ♭5th',[2,'x',4,3,4,'x']],['PDF Drop3・6弦 ♭7th',[6,'x',8,8,7,'x']],['PDF Drop3・5弦 Root',['x',3,'x',3,4,2]],['PDF Drop3・5弦 ♭3rd',['x',6,'x',8,7,8]],['PDF Drop3・5弦 ♭5th',['x',9,'x',11,11,11]],['PDF Drop3・5弦 ♭7th',['x',13,'x',15,13,13]]]
  };

  // Open-string forms are key-specific in the source, so they are NOT transposed.
  const openSpecific={
    'E:maj9':[['PDF Open・Emaj9',[0,'x',4,4,4,0]]],
    'E:m9':[['PDF Open・Em9 A',[0,7,5,7,0,0]],['PDF Open・Em9 B',[0,'x',4,0,3,0]]],
    'A:maj7':[['PDF Open・Amaj7',['x',0,6,6,5,0]]],
    'A:add9':[['PDF Open・A(add9)',['x',0,7,6,0,0]]],
    'A:m7':[['PDF Open・Am7',['x',0,5,5,0,0]]],
    'A:minor':[['PDF Open・Am',['x',0,7,5,0,0]]],
    'D:madd9':[['PDF Open・Dm(add9) A',['x','x',0,7,6,0]],['PDF Open・Dm(add9) B',['x','x',0,9,10,0]]],
    'C:maj7':[['PDF Open・Cmaj7/G',[3,3,2,0,0,0]]]
  };

  getForms=function(root,type,bass){
    const base=prev(root,type,bass)||[];
    if(bass!=='none') return base;
    let defs=[];
    if(altered[type]) defs=defs.concat(altered[type]);
    if(drop2[type]) defs=defs.concat(drop2[type]);
    if(drop3[type]) defs=defs.concat(drop3[type]);
    const fixed=openSpecific[`${root}:${type}`]||[];
    const seen=new Set(base.map(x=>key(x.frets))), add=[];
    defs.forEach(([name,c])=>{const f=transpose(root,c);if(valid(f)&&!seen.has(key(f))){seen.add(key(f));add.push({shape:name,frets:f,barres:[]});}});
    fixed.forEach(([name,f])=>{if(!seen.has(key(f))){seen.add(key(f));add.push({shape:name,frets:f,barres:[]});}});
    return base.concat(add);
  };
})();
