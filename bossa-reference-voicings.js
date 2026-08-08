// Bossa Nova reference voicings from uploaded source.
// Fixed practical shapes; existing forms are preserved.
(() => {
  const prev = getForms;
  const key = f => f.join('|');
  const fixed = {
    'D:maj9': [['Bossa・D△7(9) 5弦ルート',['x',5,4,6,5,'x']]],
    'E:9': [['Bossa・E7(9) 5弦ルート',['x',7,6,7,7,'x']]],
    'E:m9': [['Bossa・Em7(9) 5弦ルート',['x',7,5,7,7,'x']]],
    'D#:9': [['Bossa・E♭7(9) 5弦ルート',['x',6,5,6,6,'x']]],
    'B:13': [['Bossa・B7(13) 6弦ルート',[7,'x',7,8,9,'x']]],
    'A:13': [['Bossa・A7(13) 5弦ルート',['x',5,5,6,7,'x']]],
    'F:dim7': [['Bossa・Fdim 進行用',['x',8,9,7,9,'x']]],
    'F#:m7': [['Bossa・F♯m7 進行用',['x',9,11,9,10,'x']]],

    // Chapter 4: 6th-string-root family (same theoretical progression, wider register)
    'A:maj7': [['Bossa・6弦ルート A△7',[5,'x',6,6,5,'x']]],
    'B:m7': [['Bossa・6弦ルート Bm7',[7,'x',7,7,7,'x']]],
    'A#:13': [['Bossa・6弦ルート B♭7(13)',[6,'x',6,7,8,'x']]],
    'F#:9': [['Bossa・6弦ルート F♯7(9)',[2,'x',2,3,3,'x']]],
    'C:dim7': [['Bossa・6弦ルート進行 Cdim',['x',3,4,2,4,'x']]],
    'C#:m7': [['Bossa・平行移動 C♯m7',[9,'x',9,9,9,'x']]]
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
