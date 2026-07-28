const rootSelect = document.querySelector('#rootSelect');
const typeSelect = document.querySelector('#typeSelect');
const selectedChord = document.querySelector('#selectedChord');

const roots = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const noteNames = roots;
let selectedFormIndex = 0;

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
  'C:major':['x',3,2,0,1,0], 'D:major':['x','x',0,2,3,2], 'E:major':[0,2,2,1,0,0], 'G:major':[3,2,0,0,0,3], 'A:major':['x',0,2,2,2,0],
  'A:minor':['x',0,2,2,1,0], 'D:minor':['x','x',0,2,3,1], 'E:minor':[0,2,2,0,0,0],
  'A:7':['x',0,2,0,2,0], 'B:7':['x',2,1,2,0,2], 'C:7':['x',3,2,3,1,0], 'D:7':['x','x',0,2,1,2], 'E:7':[0,2,0,1,0,0], 'G:7':[3,2,0,0,0,1],
  'C:maj7':['x',3,2,0,0,0], 'F:maj7':['x','x',3,2,1,0], 'A:maj7':['x',0,2,1,2,0],
  'A:m7':['x',0,2,0,1,0], 'D:m7':['x','x',0,2,1,1], 'E:m7':[0,2,0,0,0,0],
  'D:sus2':['x','x',0,2,3,0], 'E:sus2':[0,2,4,4,0,0], 'A:sus2':['x',0,2,2,0,0],
  'D:sus4':['x','x',0,2,3,3], 'E:sus4':[0,2,2,2,0,0], 'A:sus4':['x',0,2,2,3,0],
  'C:add9':['x',3,2,0,3,0], 'D:add9':['x','x',0,2,3,0], 'E:add9':[0,2,4,1,0,0], 'G:add9':[3,2,0,2,0,3], 'A:add9':['x',0,2,4,2,0]
};

const eShapes = {
  major:r=>[r,r+2,r+2,r+1,r,r], minor:r=>[r,r+2,r+2,r,r,r], '7':r=>[r,r+2,r,r+1,r,r],
  maj7:r=>[r,r+2,r+1,r+1,r,r], m7:r=>[r,r+2,r,r,r,r], sus2:r=>[r,r+2,r+4,r+4,r,r],
  sus4:r=>[r,r+2,r+2,r+2,r,r], add9:r=>[r,r+2,r+2,r+1,r,r+2]
};
const aShapes = {
  major:r=>['x',r,r+2,r+2,r+2,r], minor:r=>['x',r,r+2,r+2,r+1,r], '7':r=>['x',r,r+2,r,r+2,r],
  maj7:r=>['x',r,r+2,r+1,r+2,r], m7:r=>['x',r,r+2,r,r+1,r], sus2:r=>['x',r,r+2,r+2,r,r],
  sus4:r=>['x',r,r+2,r+2,r+3,r], add9:r=>['x',r,r+2,r+4,r,r]
};

function chordName(root, type) { return root + typeData[type].suffix; }
function notesFor(root, type) {
  const rootIndex = roots.indexOf(root);
  return [...new Set(typeData[type].intervals.map(i => noteNames[(rootIndex + i) % 12]))].join('・');
}
function lowestFret(frets) {
  const nums = frets.filter(v => typeof v === 'number' && v > 0);
  return nums.length ? Math.min(...nums) : 0;
}

function getForms(root, type) {
  const rootIndex = roots.indexOf(root);
  const eRoot = (rootIndex - 4 + 12) % 12 || 12;
  const aRoot = (rootIndex - 9 + 12) % 12 || 12;
  const eForm = fret => ({ shape:'6弦ルート', frets:eShapes[type](fret), barres:[{fret,start:0,end:5}] });
  const aForm = fret => ({ shape:'5弦ルート', frets:aShapes[type](fret), barres:[{fret,start:1,end:5}] });
  const movable = [
    eForm(eRoot),
    aForm(aRoot),
    eRoot <= aRoot ? {...eForm(eRoot + 12), shape:'6弦ルート・ハイ'} : {...aForm(aRoot + 12), shape:'5弦ルート・ハイ'}
  ].sort((a,b) => lowestFret(a.frets) - lowestFret(b.frets));
  const open = openShapes[`${root}:${type}`];
  const forms = open ? [{ shape:'オープンコード', frets:open, barres:[] }, ...movable.slice(0,2)] : movable;
  return forms.map((form,index) => ({ ...form, label:`フォーム${index + 1}` }));
}

function diagram(name, frets, barres = []) {
  const numeric = frets.filter(v => typeof v === 'number' && v > 0);
  const minFret = numeric.length ? Math.min(...numeric) : 1;
  const maxFret = numeric.length ? Math.max(...numeric) : 1;
  const baseFret = minFret > 4 ? minFret : 1;
  const fretCount = Math.max(4, maxFret - baseFret + 1);
  const x0 = 42, y0 = 38, stringWidth = 24, boardHeight = 150;
  const fretHeight = boardHeight / fretCount;
  let svg = `<svg class="chord-diagram large-diagram" viewBox="0 0 190 210" role="img" aria-label="${name}のコード図">`;
  for (let s=0; s<6; s++) svg += `<line class="string" x1="${x0+s*stringWidth}" y1="${y0}" x2="${x0+s*stringWidth}" y2="${y0+boardHeight}"/>`;
  for (let f=0; f<=fretCount; f++) svg += `<line class="${f===0 && baseFret===1?'nut':'fret'}" x1="${x0}" y1="${y0+f*fretHeight}" x2="${x0+5*stringWidth}" y2="${y0+f*fretHeight}"/>`;
  if (baseFret > 1) svg += `<text class="fret-label" x="22" y="${y0+fretHeight*.65}">${baseFret}fr</text>`;

  const covered = new Set();
  barres.forEach(barre => {
    const displayFret = barre.fret - baseFret + 1;
    if (displayFret < 1 || displayFret > fretCount) return;
    const y = y0 + (displayFret - .5) * fretHeight;
    const x1 = x0 + barre.start * stringWidth;
    const x2 = x0 + barre.end * stringWidth;
    svg += `<line class="barre" x1="${x1}" y1="${y}" x2="${x2}" y2="${y}"/>`;
    for (let s=barre.start; s<=barre.end; s++) if (frets[s] === barre.fret) covered.add(`${s}:${barre.fret}`);
  });

  frets.forEach((value, string) => {
    const x = x0 + string * stringWidth;
    if (value === 'x') svg += `<text class="mute-mark" x="${x}" y="22">×</text>`;
    else if (value === 0) svg += `<text class="open-mark" x="${x}" y="22">○</text>`;
    else if (!covered.has(`${string}:${value}`)) {
      const displayFret = value - baseFret + 1;
      const y = y0 + (displayFret - .5) * fretHeight;
      if (displayFret >= 1 && displayFret <= fretCount) svg += `<circle class="dot" cx="${x}" cy="${y}" r="9"/>`;
    }
  });
  return svg + '</svg>';
}

function render() {
  const root = rootSelect.value;
  const type = typeSelect.value;
  const data = typeData[type];
  const name = chordName(root, type);
  const forms = getForms(root, type);
  const form = forms[selectedFormIndex] || forms[0];
  const low = lowestFret(form.frets);
  selectedChord.innerHTML = `
    <article class="selected-card">
      <div class="selected-heading"><p class="selected-label">選択中のコード</p><h2 class="selected-name">${name}</h2><div class="meta"><span class="badge">${data.label}</span><span class="badge">${form.shape}</span></div></div>
      <div class="form-tabs" role="tablist" aria-label="コードフォーム切替">${forms.map((item,index)=>`<button class="form-tab ${index===selectedFormIndex?'active':''}" data-form="${index}" type="button">${item.label}<small>${item.shape}</small></button>`).join('')}</div>
      <div class="selected-content">
        <div class="diagram-panel"><div class="diagram-wrap">${diagram(name, form.frets, form.barres)}</div></div>
        <div class="info-list"><div class="info-box"><strong>構成音</strong>${notesFor(root, type)}</div><div class="info-box"><strong>ポジション</strong>${form.shape === 'オープンコード' ? 'オープンポジション' : `${low}フレット付近`}</div><div class="info-box"><strong>響き</strong>${data.mood}</div><div class="info-box"><strong>使い方</strong>${data.use}</div></div>
      </div>
    </article>`;
}

rootSelect.addEventListener('change', () => { selectedFormIndex = 0; render(); });
typeSelect.addEventListener('change', () => { selectedFormIndex = 0; render(); });
selectedChord.addEventListener('click', event => {
  const button = event.target.closest('[data-form]');
  if (!button) return;
  selectedFormIndex = Number(button.dataset.form);
  render();
});
render();