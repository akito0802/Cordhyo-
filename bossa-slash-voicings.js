// Bossa Nova slash/on-bass voicings from the uploaded reference, pp.100-103.
// Additive only. Existing chord/form data is preserved.
(() => {
  if (typeof getForms !== 'function' || typeof roots === 'undefined' || typeof typeData === 'undefined') return;

  const previous = getForms;
  const pc = Object.fromEntries(roots.map((n,i)=>[n,i]));
  const customSlash = new Map();

  function transposeShape(sourceRoot, targetRoot, frets) {
    const shift = (pc[targetRoot] - pc[sourceRoot] + 12) % 12;
    let out = frets.map(v => typeof v === 'number' ? v + shift : 'x');
    const nums = () => out.filter(v => typeof v === 'number');
    while (Math.max(...nums()) > 21 && Math.min(...nums()) >= 12) {
      out = out.map(v => typeof v === 'number' ? v - 12 : v);
    }
    return out;
  }

  function bassFor(root, interval) {
    return roots[(pc[root] + interval) % 12];
  }

  function chordName(root, type) {
    return root + (typeData[type]?.suffix || '');
  }

  function registerFamily({sourceRoot, type, bassInterval, frets, label}) {
    if (!typeData[type]) return;
    roots.forEach(root => {
      const bass = bassFor(root, bassInterval);
      const shape = transposeShape(sourceRoot, root, frets);
      if (!shape.every(v => v === 'x' || (Number.isInteger(v) && v >= 0 && v <= 21))) return;
      const slashName = `${chordName(root,type)}/${bass}`;
      if (typeof slashShapes !== 'undefined' && !slashShapes[slashName]) slashShapes[slashName] = shape;
      customSlash.set(`${root}|${type}|${bass}`, {shape:`Bossa Slash・${label}`, frets:shape});
    });
  }

  registerFamily({sourceRoot:'C', type:'maj7', bassInterval:7, frets:['x','x',5,5,5,7], label:'maj7 / 5th Bass'});
  registerFamily({sourceRoot:'C', type:'6',    bassInterval:7, frets:['x','x',5,5,5,5], label:'6 / 5th Bass'});
  registerFamily({sourceRoot:'D', type:'m9', bassInterval:10, frets:['x','x',10,10,10,12], label:'m9 / ♭7 Bass'});
  registerFamily({sourceRoot:'D', type:'m7', bassInterval:10, frets:['x','x',10,10,10,10], label:'m7 / ♭7 Bass'});
  registerFamily({sourceRoot:'G', type:'7b13',   bassInterval:10, frets:['x','x',3,4,4,3], label:'7♭13 / ♭7 Bass'});
  registerFamily({sourceRoot:'G', type:'7b9b13', bassInterval:10, frets:['x','x',3,4,4,4], label:'7(♭9,♭13) / ♭7 Bass'});
  registerFamily({sourceRoot:'D', type:'9',    bassInterval:4,  frets:['x','x',4,5,5,5], label:'9 / 3rd Bass'});
  registerFamily({sourceRoot:'D', type:'13',   bassInterval:10, frets:['x','x',10,11,12,12], label:'13 / ♭7 Bass'});
  registerFamily({sourceRoot:'D', type:'13b9', bassInterval:10, frets:['x','x',10,11,12,11], label:'13♭9 / ♭7 Bass'});
  registerFamily({sourceRoot:'E', type:'7b5',     bassInterval:6, frets:[6,'x',6,7,5,'x'], label:'7♭5 / ♭5 Bass'});
  registerFamily({sourceRoot:'E', type:'7b9b13',  bassInterval:4, frets:['x','x',6,7,6,8], label:'7(♭9,♭13) / 3rd Bass'});
  registerFamily({sourceRoot:'G', type:'69', bassInterval:4, frets:['x','x',9,9,10,10], label:'6/9 / 3rd Bass'});
  registerFamily({sourceRoot:'A', type:'m9', bassInterval:10, frets:['x','x',5,5,5,7], label:'m9 / ♭7 Bass Compact'});

  const eRoot = root => ((pc[root] - 4 + 12) % 12) || 12;
  getForms = function(root,type,bass) {
    if (bass !== 'none') {
      const special = customSlash.get(`${root}|${type}|${bass}`);
      if (special) return [{label:'フォーム1',shape:special.shape,frets:[...special.frets],barres:[]}];
      return previous(root,type,bass) || [];
    }

    const base = previous(root,type,bass) || [];
    if (type !== 'maj9') return base;
    const r = eRoot(root);
    const frets = [r,'x',r+1,r+1,r,r+2];
    if (!frets.every(v => v === 'x' || (Number.isInteger(v) && v >= 0 && v <= 21))) return base;
    if (base.some(f => f.shape === 'Bossa・6弦Root maj9 Wide')) return base;
    return base.concat([{shape:'Bossa・6弦Root maj9 Wide',frets,barres:[]}]);
  };

  window.__BOSSA_SLASH_VOICINGS_LOADED__ = true;
  if (typeof updateBassOptions === 'function') updateBassOptions();
  if (typeof render === 'function') render();
})();

// Continue into the source's final "6 arrangement methods" section.
(() => {
  if (window.__BOSSA_ARRANGEMENT_LOADER__) return;
  window.__BOSSA_ARRANGEMENT_LOADER__ = true;
  const script = document.createElement('script');
  script.src = 'bossa-arrangement-rules.js?v=20260809-1';
  script.async = false;
  document.head.appendChild(script);
})();
