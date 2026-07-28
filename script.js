const rootSelect = document.querySelector('#rootSelect');
const typeSelect = document.querySelector('#typeSelect');
const selectedChord = document.querySelector('#selectedChord');

const roots = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const noteNames = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

const typeData = {
  major: { suffix:'', label:'メジャー', intervals:[0,4,7], mood:'明るく安定した響き', use:'ポップスや弾き語りの基本。' },
  minor: { suffix:'m', label:'マイナー', intervals:[0,3,7], mood:'切なく落ち着いた響き', use:'バラードや哀愁のある進行で定番。' },
  '7': { suffix:'7', label:'7th', intervals:[0,4,7,10], mood:'ブルージーで次へ進みたくなる響き', use:'ドミナントとして次のコードへつなぐ。' },
  maj7: { suffix:'maj7', label:'maj7', intervals:[0,4,7,11], mood:'都会的で柔らかな響き', use:'シティポップやジャズでよく使う。' },
  m7: { suffix:'m7', label:'m7', intervals:[0,3,7,10], mood:'大人っぽく落ち着いた響き', use:'R&B、ジャズ、バラードで活躍。' },
  sus2: { suffix:'sus2', label:'sus2', intervals:[0,2,7], mood:'透明感と浮遊感のある響き', use:'メジャーコードの代わりに爽やかさを出せる。' },
  sus4: { suffix:'sus4', label:'sus4', intervals:[0,5,7], mood:'解決前の緊張感がある響き', use:'メジャーコードとの行き来が定番。' },
  add9: { suffix:'add9', label:'add9', intervals:[0,4,7,14], mood:'広がりのある爽やかな響き', use:'アコギのアルペジオや弾き語りに合う。' }
};

const openShapes = {
  Cmajor:['x',3,2,0,1,0], Dmajor:['x','x',0,2,3,2], Emajor:[0,2,2,1,0,0], Gmajor:[3,2,0,0,0,3], Amajor:['x',0,2,2,2,0],
  Aminor:['x',0,2,2,1,0], Dminor:['x','x',0,2,3,1], Eminor:[0,2,2,0,0,0],
  A7:['x',0,2,0,2,0], D7:['x','x',0,2,1,2], E7:[0,2,0,1,0,0], G7:[3,2,0,0,0,1],
  Cmaj7:['x',3,2,0,0,0], Fmaj7:['x','x',3,2,1,0],
  Am7:['x',0,2,0,1,0], Dm7:['x','x',0,2,1,1], Em7:[0,2,0,0,0,0],
  Dsus4:['x','x',0,2,3,3], Asus4:['x',0,2,2,3,0],
  Cadd9:['x',3,2,0,3,0], Gadd9:[3,2,0,2,0,3]
};

function chordName(root, type) {
  return root + typeData[type].suffix;
}

function notesFor(root, type) {
  const rootIndex = roots.indexOf(root);
  return typeData[type].intervals.map(i => noteNames[(rootIndex + i) % 12]).join('・');
}

function fallbackShape(root, type) {
  const rootIndex = roots.indexOf(root);
  const fret = Math.max(1, (rootIndex + 8) % 12);
  const patterns = {
    major:[fret,fret+2,fret+2,fret+1,fret,fret],
    minor:[fret,fret+2,fret+2,fret,fret,fret],
    '7':[fret,fret+2,fret,fret+1,fret,fret],
    maj7:[fret,fret+2,fret+1,fret+1,fret,fret],
    m7:[fret,fret+2,fret,fret,fret,fret],
    sus2:[fret,fret+2,fret+2,fret,fret,fret+2],
    sus4:[fret,fret+2,fret+2,fret+2,fret,fret],
    add9:[fret,fret+2,fret+2,fret+1,fret,fret+2]
  };
  return patterns[type];
}

function getShape(root, type) {
  return openShapes[`${root}${type}`] || fallbackShape(root, type);
}

function diagram(name, frets) {
  const x0 = 35, y0 = 34, stringWidth = 22, fretHeight = 27;
  const numeric = frets.filter(v => typeof v === 'number' && v > 0);
  const minFret = numeric.length ? Math.min(...numeric) : 1;
  const baseFret = minFret > 4 ? minFret : 1;
  let svg = `<svg class="chord-diagram large-diagram" viewBox="0 0 170 190" role="img" aria-label="${name}のコード図">`;
  for (let s=0; s<6; s++) svg += `<line class="string" x1="${x0+s*stringWidth}" y1="${y0}" x2="${x0+s*stringWidth}" y2="${y0+4*fretHeight}"/>`;
  for (let f=0; f<=4; f++) svg += `<line class="${f===0?'nut':'fret'}" x1="${x0}" y1="${y0+f*fretHeight}" x2="${x0+5*stringWidth}" y2="${y0+f*fretHeight}"/>`;
  if (baseFret > 1) svg += `<text class="fret-label" x="18" y="${y0+18}">${baseFret}fr</text>`;
  frets.forEach((value, string) => {
    const x = x0 + string * stringWidth;
    if (value === 'x') svg += `<text class="mute-mark" x="${x}" y="18">×</text>`;
    else if (value === 0) svg += `<text class="open-mark" x="${x}" y="18">○</text>`;
    else {
      const displayFret = value - baseFret + 1;
      const y = y0 + (displayFret - .5) * fretHeight;
      svg += `<circle class="dot" cx="${x}" cy="${y}" r="9"/>`;
    }
  });
  return svg + '</svg>';
}

function render() {
  const root = rootSelect.value;
  const type = typeSelect.value;
  const data = typeData[type];
  const name = chordName(root, type);
  const frets = getShape(root, type);
  selectedChord.innerHTML = `
    <article class="selected-card">
      <div class="selected-heading">
        <div>
          <p class="selected-label">選択中のコード</p>
          <h2 class="selected-name">${name}</h2>
          <div class="meta"><span class="badge">${data.label}</span></div>
        </div>
      </div>
      <div class="selected-content">
        <div class="diagram-wrap">${diagram(name, frets)}</div>
        <div class="info-list">
          <div class="info-box"><strong>構成音</strong>${notesFor(root, type)}</div>
          <div class="info-box"><strong>響き</strong>${data.mood}</div>
          <div class="info-box"><strong>使い方</strong>${data.use}</div>
        </div>
      </div>
    </article>`;
}

rootSelect.addEventListener('change', render);
typeSelect.addEventListener('change', render);
render();