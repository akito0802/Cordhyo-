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

const eShapes = {
  major:r=>[r,r+2,r+2,r+1,r,r],
  minor:r=>[r,r+2,r+2,r,r,r],
  '7':r=>[r,r+2,r,r+1,r,r],
  maj7:r=>[r,r+2,r+1,r+1,r,r],
  m7:r=>[r,r+2,r,r,r,r],
  sus2:r=>[r,r+2,r+4,r+4,r,r],
  sus4:r=>[r,r+2,r+2,r+2,r,r],
  add9:r=>[r,r+2,r+2,r+1,r,r+2]
};

const aShapes = {
  major:r=>['x',r,r+2,r+2,r+2,r],
  minor:r=>['x',r,r+2,r+2,r+1,r],
  '7':r=>['x',r,r+2,r,r+2,r],
  maj7:r=>['x',r,r+2,r+1,r+2,r],
  m7:r=>['x',r,r+2,r,r+1,r],
  sus2:r=>['x',r,r+2,r+2,r,r],
  sus4:r=>['x',r,r+2,r+2,r+3,r],
  add9:r=>['x',r,r+2,r+4,r,r]
};

function chordName(root, type) { return root + typeData[type].suffix; }

function notesFor(root, type) {
  const rootIndex = roots.indexOf(root);
  return [...new Set(typeData[type].intervals.map(i => noteNames[(rootIndex + i) % 12]))].join('・');
}

function getForms(root, type) {
  const rootIndex = roots.indexOf(root);
  const eRoot = (rootIndex - 4 + 12) % 12;
  const aRoot = (rootIndex - 9 + 12) % 12;
  const candidates = [
    { label:'フォーム1', shape:'6弦ルート', frets:eShapes[type](eRoot) },
    { label:'フォーム2', shape:'5弦ルート', frets:aShapes[type](aRoot) },
    { label:'フォーム3', shape:eRoot <= aRoot ? '6弦ルート・ハイ' : '5弦ルート・ハイ', frets:(eRoot <= aRoot ? eShapes[type](eRoot + 12) : aShapes[type](aRoot + 12)) }
  ];
  return candidates.sort((a,b) => lowestFret(a.frets) - lowestFret(b.frets));
}

function lowestFret(frets) {
  const nums = frets.filter(v => typeof v === 'number' && v > 0);
  return nums.length ? Math.min(...nums) : 0;
}

function diagram(name, frets) {
  const x0 = 35, y0 = 34, stringWidth = 22, fretHeight = 27;
  const numeric = frets.filter(v => typeof v === 'number' && v > 0);
  const minFret = numeric.length ? Math.min(...numeric) : 1;
  const baseFret = minFret > 4 ? minFret : 1;
  let svg = `<svg class="chord-diagram large-diagram" viewBox="0 0 170 190" role="img" aria-label="${name}のコード図">`;
  for (let s=0; s<6; s++) svg += `<line class="string" x1="${x0+s*stringWidth}" y1="${y0}" x2="${x0+s*stringWidth}" y2="${y0+4*fretHeight}"/>`;
  for (let f=0; f<=4; f++) svg += `<line class="${f===0 && baseFret===1?'nut':'fret'}" x1="${x0}" y1="${y0+f*fretHeight}" x2="${x0+5*stringWidth}" y2="${y0+f*fretHeight}"/>`;
  if (baseFret > 1) svg += `<text class="fret-label" x="17" y="${y0+18}">${baseFret}fr</text>`;
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
  const forms = getForms(root, type);
  const form = forms[selectedFormIndex] || forms[0];

  selectedChord.innerHTML = `
    <article class="selected-card">
      <div class="selected-heading">
        <div>
          <p class="selected-label">選択中のコード</p>
          <h2 class="selected-name">${name}</h2>
          <div class="meta"><span class="badge">${data.label}</span><span class="badge">${form.shape}</span></div>
        </div>
      </div>
      <div class="form-tabs" role="tablist" aria-label="コードフォーム切替">
        ${forms.map((item,index)=>`<button class="form-tab ${index===selectedFormIndex?'active':''}" data-form="${index}" type="button">${item.label}<small>${item.shape}</small></button>`).join('')}
      </div>
      <div class="selected-content">
        <div class="diagram-wrap">${diagram(name, form.frets)}</div>
        <div class="info-list">
          <div class="info-box"><strong>構成音</strong>${notesFor(root, type)}</div>
          <div class="info-box"><strong>ポジション</strong>${lowestFret(form.frets) === 0 ? 'オープンポジション' : `${lowestFret(form.frets)}フレット付近`}</div>
          <div class="info-box"><strong>響き</strong>${data.mood}</div>
          <div class="info-box"><strong>使い方</strong>${data.use}</div>
        </div>
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