// Bossa Nova reference voicings from uploaded source.
// Fixed practical 4-note shapes; existing forms are preserved.
(() => {
  const prev = getForms;
  const key = f => f.join('|');
  const fixed = {
    'D:maj9': [['Bossa・D△7(9) 基本',['x',5,4,6,5,'x']]],
    'E:9': [['Bossa・E7(9) 基本',['x',7,6,7,7,'x']]],
    'E:m9': [['Bossa・Em7(9) 基本',['x',7,5,7,7,'x']]],
    'D#:9': [['Bossa・E♭7(9) 基本',['x',6,5,6,6,'x']]],
    'B:13': [['Bossa・B7(13) 基本',[7,'x',7,8,9,'x']]],
    'A:13': [['Bossa・A7(13) 基本',[5,'x',5,6,7,'x']]],
    'F:dim7': [['Bossa・Fdim 基本',['x',8,9,7,9,'x']]],
    'F#:m7': [['Bossa・F♯m7 基本',['x',9,11,9,10,'x']]]
  };

  getForms = function(root,type,bass){
    const base = prev(root,type,bass) || [];
    if (bass !== 'none') return base;
    const defs = fixed[`${root}:${type}`] || [];
    if (!defs.length) return base;
    const seen = new Set(base.map(x=>key(x.frets)));
    const add = [];
    defs.forEach(([name,frets])=>{
      if(!seen.has(key(frets))){seen.add(key(frets));add.push({shape:name,frets,barres:[]});}
    });
    return base.concat(add);
  };
})();
