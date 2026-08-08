// Super Guitar Chords PDF reference pack: altered dominant + Drop 2 maj7 inversions.
// Existing forms are preserved; these are additive reference voicings transposed to all roots.
(() => {
  const prev = getForms;
  const ROOT = Object.fromEntries(roots.map((n,i)=>[n,i]));
  const OPEN = [4,9,2,7,11,4]; // 6E 5A 4D 3G 2B 1E
  const key = f => f.join('|');

  function transposeCShape(root, cFrets) {
    const shift = ROOT[root];
    return cFrets.map(v => typeof v === 'number' ? v + shift : 'x');
  }
  function valid(frets) { return frets.every(v => v === 'x' || (v >= 0 && v <= 21)); }
  function pcs(frets) {
    return new Set(frets.map((f,i)=>f==='x'?null:(OPEN[i]+f)%12).filter(v=>v!==null));
  }
  const required = {
    '7s11':[0,4,10,6], '7b13':[0,4,10,8], '13b9':[0,4,10,1,9], '13s9':[0,4,10,3,9],
    '7b5b9':[0,4,10,6,1], '7b5s9':[0,4,10,6,3], '7s5b9':[0,4,10,8,1], '7s5s9':[0,4,10,8,3]
  };
  function chordValid(root,type,frets) {
    const req=required[type]; if(!req) return true;
    const have=pcs(frets), r=ROOT[root];
    return req.every(x=>have.has((r+x)%12));
  }

  // C reference shapes read from the PDF diagrams; x = muted string.
  const altered = {
    '7s11':[
      ['PDF・7♯11 low', ['x',8,8,9,7,'x']],
      ['PDF・7♯11 mid', [8,8,8,9,10,'x']],
      ['PDF・7♯11 high', ['x',3,4,3,5,'x']]
    ],
    '7b13':[
      ['PDF・7♭13 low', ['x',8,8,9,9,8]],
      ['PDF・7♭13 mid', ['x',3,3,3,4,'x']],
      ['PDF・7♭13 high', ['x',15,17,15,17,'x']]
    ],
    '13b9':[
      ['PDF・13♭9 low', ['x',8,8,9,8,10]],
      ['PDF・13♭9 compact', ['x',3,2,3,3,5]]
    ],
    '13s9':[
      ['PDF・13♯9', [8,8,8,9,10,11]]
    ],
    '7b5b9':[
      ['PDF・7♭5(♭9) low', ['x',8,8,9,7,9]],
      ['PDF・7♭5(♭9) compact', ['x',3,2,3,2,2]]
    ],
    '7b5s9':[
      ['PDF・7♭5(♯9) low', ['x',8,8,9,7,11]],
      ['PDF・7♭5(♯9) compact', ['x',3,2,3,4,2]]
    ],
    '7s5b9':[
      ['PDF・7♯5(♭9) low', ['x',8,8,9,9,9]],
      ['PDF・7♯5(♭9) compact', ['x',3,2,3,2,4]]
    ],
    '7s5s9':[
      ['PDF・7♯5(♯9) low', [8,8,8,9,9,11]],
      ['PDF・7♯5(♯9) compact', ['x',3,2,3,4,4]]
    ]
  };

  // Major 7 Drop 2 inversions from the PDF: A-string and D-string bass-note sets.
  const drop2Maj7 = [
    ['PDF Drop2・A弦Bass Root', ['x',3,5,4,5,'x']],
    ['PDF Drop2・A弦Bass 3rd', ['x',7,9,5,8,'x']],
    ['PDF Drop2・A弦Bass 5th', ['x',10,10,9,12,'x']],
    ['PDF Drop2・A弦Bass 7th', ['x',14,14,12,13,'x']],
    ['PDF Drop2・D弦Bass Root', ['x','x',10,12,12,12]],
    ['PDF Drop2・D弦Bass 3rd', ['x','x',2,4,5,3]],
    ['PDF Drop2・D弦Bass 5th', ['x','x',5,5,5,7]],
    ['PDF Drop2・D弦Bass 7th', ['x','x',9,9,8,8]]
  ];

  getForms = function(root,type,bass) {
    const base=prev(root,type,bass)||[];
    if(bass!=='none') return base;
    let defs=[];
    if(altered[type]) defs=altered[type];
    if(type==='maj7') defs=defs.concat(drop2Maj7);
    if(!defs.length) return base;
    const seen=new Set(base.map(x=>key(x.frets)));
    const add=[];
    defs.forEach(([name,c])=>{
      const f=transposeCShape(root,c);
      if(valid(f)&&chordValid(root,type,f)&&!seen.has(key(f))){seen.add(key(f));add.push({shape:name,frets:f,barres:[]});}
    });
    return base.concat(add);
  };
})();
