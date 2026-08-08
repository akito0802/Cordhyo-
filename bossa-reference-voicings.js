// Bossa Nova reference voicings from uploaded source.
// Practical shapes from the book's "shape" chapter; existing forms are preserved.
(() => {
  const prev = getForms;
  const key = f => f.join('|');
  const ROOT = Object.fromEntries(roots.map((n,i)=>[n,i]));
  const move = (root, cShape) => cShape.map(v => typeof v === 'number' ? v + ROOT[root] : 'x');
  const valid = f => f.every(v => v === 'x' || (v >= 0 && v <= 21));

  const fixed = {
    'D:maj9': [['Bossa・D△7(9) 5弦ルート',['x',5,4,6,5,'x']]],
    'E:9': [['Bossa・E7(9) 5弦ルート',['x',7,6,7,7,'x']]],
    'E:m9': [['Bossa・Em7(9) 5弦ルート',['x',7,5,7,7,'x']]],
    'D#:9': [['Bossa・E♭7(9) 5弦ルート',['x',6,5,6,6,'x']]],
    'B:13': [['Bossa・B7(13) 6弦ルート',[7,'x',7,8,9,'x']]],
    'A:13': [['Bossa・A7(13) 5弦ルート',['x',5,5,6,7,'x']]],
    'F:dim7': [['Bossa・Fdim 進行用',['x',8,9,7,9,'x']]],
    'F#:m7': [['Bossa・F♯m7 進行用',['x',9,11,9,10,'x']]],
    'A:maj7': [['Bossa・6弦ルート A△7',[5,'x',6,6,5,'x']]],
    'B:m7': [['Bossa・6弦ルート Bm7',[7,'x',7,7,7,'x']]],
    'A#:13': [['Bossa・6弦ルート B♭7(13)',[6,'x',6,7,8,'x']]],
    'F#:9': [['Bossa・6弦ルート F♯7(9)',[2,'x',2,3,3,'x']]],
    'C:dim7': [['Bossa・6弦ルート進行 Cdim',['x',3,4,2,4,'x']]],
    'C#:m7': [['Bossa・平行移動 C♯m7',[9,'x',9,9,9,'x']]]
  };

  // Chapter 6: "形で覚えるボサ・ノヴァ・コード".
  // The book treats these as movable families: 5th-root 9th forms and 6th-root 7th/13th forms.
  // C-based references are transposed to all 12 roots.
  const movable = {
    maj9: [
      ['Bossa・5弦Root △7(9) 基本形', ['x',3,2,4,3,'x']]
    ],
    '9': [
      ['Bossa・5弦Root 7(9) 基本形', ['x',3,2,3,3,'x']]
    ],
    m9: [
      ['Bossa・5弦Root m7(9) 基本形', ['x',3,1,3,3,'x']]
    ],
    maj7: [
      ['Bossa・6弦Root △7 基本形', [8,'x',9,9,8,'x']]
    ],
    m7: [
      ['Bossa・6弦Root m7 基本形', [8,'x',8,8,8,'x']]
    ],
    '13': [
      ['Bossa・6弦Root 7(13) 基本形', [8,'x',8,9,10,'x']]
    ]
  };

  getForms = function(root,type,bass){
    const base = prev(root,type,bass) || [];
    if (bass !== 'none') return base;
    const seen = new Set(base.map(x=>key(x.frets)));
    const add = [];

    (fixed[`${root}:${type}`] || []).forEach(([name,frets])=>{
      if(!seen.has(key(frets))){seen.add(key(frets));add.push({shape:name,frets,barres:[]});}
    });

    (movable[type] || []).forEach(([name,cShape])=>{
      const frets = move(root,cShape);
      if(valid(frets) && !seen.has(key(frets))){
        seen.add(key(frets));
        add.push({shape:name,frets,barres:[]});
      }
    });

    return base.concat(add);
  };
})();
