const chords = [
  { name:'C', type:'major', label:'メジャー', difficulty:1, frets:['x',3,2,0,1,0], fingers:[0,3,2,0,1,0], notes:'C・E・G', mood:'明るく安定した響き', use:'Cキーの主役。初心者の定番コード。' },
  { name:'D', type:'major', label:'メジャー', difficulty:1, frets:['x','x',0,2,3,2], fingers:[0,0,0,1,3,2], notes:'D・F#・A', mood:'明るく抜けのよい響き', use:'GキーやDキーでよく使う。' },
  { name:'E', type:'major', label:'メジャー', difficulty:1, frets:[0,2,2,1,0,0], fingers:[0,2,3,1,0,0], notes:'E・G#・B', mood:'力強く開放的な響き', use:'ロックやブルースでも頻出。' },
  { name:'F', type:'major', label:'メジャー', difficulty:3, frets:[1,3,3,2,1,1], fingers:[1,3,4,2,1,1], notes:'F・A・C', mood:'芯のある明るい響き', use:'セーハの基本。Cキーで重要。' },
  { name:'G', type:'major', label:'メジャー', difficulty:1, frets:[3,2,0,0,0,3], fingers:[2,1,0,0,0,3], notes:'G・B・D', mood:'広がりのある明るい響き', use:'弾き語りで特によく使う。' },
  { name:'A', type:'major', label:'メジャー', difficulty:1, frets:['x',0,2,2,2,0], fingers:[0,0,1,2,3,0], notes:'A・C#・E', mood:'明るく厚みのある響き', use:'DキーやAキーで頻出。' },
  { name:'Am', type:'minor', label:'マイナー', difficulty:1, frets:['x',0,2,2,1,0], fingers:[0,0,2,3,1,0], notes:'A・C・E', mood:'切なく落ち着いた響き', use:'Cキーの定番マイナー。' },
  { name:'Dm', type:'minor', label:'マイナー', difficulty:1, frets:['x','x',0,2,3,1], fingers:[0,0,0,2,3,1], notes:'D・F・A', mood:'繊細で少し暗い響き', use:'Cキーのサブドミナントマイナー。' },
  { name:'Em', type:'minor', label:'マイナー', difficulty:1, frets:[0,2,2,0,0,0], fingers:[0,2,3,0,0,0], notes:'E・G・B', mood:'哀愁があり広がる響き', use:'最も押さえやすい基本コードの一つ。' },
  { name:'A7', type:'7th', label:'7th', difficulty:1, frets:['x',0,2,0,2,0], fingers:[0,0,1,0,2,0], notes:'A・C#・E・G', mood:'ブルージーで次へ進みたくなる響き', use:'Dへ解決する進行で定番。' },
  { name:'D7', type:'7th', label:'7th', difficulty:1, frets:['x','x',0,2,1,2], fingers:[0,0,0,2,1,3], notes:'D・F#・A・C', mood:'緊張感とブルース感', use:'Gへ進む直前によく使う。' },
  { name:'E7', type:'7th', label:'7th', difficulty:1, frets:[0,2,0,1,0,0], fingers:[0,2,0,1,0,0], notes:'E・G#・B・D', mood:'荒々しくブルージー', use:'AやAmへ向かう進行で頻出。' },
  { name:'G7', type:'7th', label:'7th', difficulty:1, frets:[3,2,0,0,0,1], fingers:[3,2,0,0,0,1], notes:'G・B・D・F', mood:'強くCへ戻りたくなる響き', use:'Cキーの王道ドミナント。' },
  { name:'Cmaj7', type:'maj7', label:'maj7', difficulty:1, frets:['x',3,2,0,0,0], fingers:[0,3,2,0,0,0], notes:'C・E・G・B', mood:'都会的で少し切ない響き', use:'シティポップやジャズで定番。' },
  { name:'Fmaj7', type:'maj7', label:'maj7', difficulty:2, frets:['x','x',3,2,1,0], fingers:[0,0,3,2,1,0], notes:'F・A・C・E', mood:'柔らかく浮遊感のある響き', use:'難しいFの代用としても便利。' },
  { name:'Am7', type:'m7', label:'m7', difficulty:1, frets:['x',0,2,0,1,0], fingers:[0,0,2,0,1,0], notes:'A・C・E・G', mood:'落ち着いた切なさ', use:'ポップス、R&B、ジャズで幅広く使う。' },
  { name:'Dm7', type:'m7', label:'m7', difficulty:2, frets:['x','x',0,2,1,1], fingers:[0,0,0,2,1,1], notes:'D・F・A・C', mood:'大人っぽく柔らかい響き', use:'Dmより都会的な印象。' },
  { name:'Em7', type:'m7', label:'m7', difficulty:1, frets:[0,2,0,0,0,0], fingers:[0,2,0,0,0,0], notes:'E・G・B・D', mood:'透明感のある暗さ', use:'弾き語りやバラードで頻出。' },
  { name:'Dsus4', type:'sus', label:'sus4', difficulty:1, frets:['x','x',0,2,3,3], fingers:[0,0,0,1,2,3], notes:'D・G・A', mood:'解決前の爽やかな緊張感', use:'Dとの行き来が定番。' },
  { name:'Asus4', type:'sus', label:'sus4', difficulty:1, frets:['x',0,2,2,3,0], fingers:[0,0,1,2,3,0], notes:'A・D・E', mood:'広がりのある緊張感', use:'Aコードの装飾に便利。' },
  { name:'Cadd9', type:'add', label:'add9', difficulty:1, frets:['x',3,2,0,3,0], fingers:[0,2,1,0,3,0], notes:'C・E・G・D', mood:'爽やかで広がりのある響き', use:'GやDと組み合わせやすい。' },
  { name:'Gadd9', type:'add', label:'add9', difficulty:2, frets:[3,0,0,2,0,3], fingers:[2,0,0,1,0,3], notes:'G・B・D・A', mood:'透明感のある明るい響き', use:'アコギのアルペジオに合う。' }
];

const typeFilter = document.querySelector('#typeFilter');
const chordSelect = document.querySelector('#chordSelect');
const selectedChord = document.querySelector('#selectedChord');

function stars(n) {
  return '★'.repeat(n) + '☆'.repeat(3 - n);
}

function diagram(chord) {
  const x0 = 35, y0 = 34, stringWidth = 22, fretHeight = 27;
  let svg = `<svg class="chord-diagram large-diagram" viewBox="0 0 170 190" role="img" aria-label="${chord.name}のコード図">`;

  for (let string = 0; string < 6; string++) {
    svg += `<line class="string" x1="${x0 + string * stringWidth}" y1="${y0}" x2="${x0 + string * stringWidth}" y2="${y0 + 4 * fretHeight}"/>`;
  }

  for (let fret = 0; fret <= 4; fret++) {
    svg += `<line class="${fret === 0 ? 'nut' : 'fret'}" x1="${x0}" y1="${y0 + fret * fretHeight}" x2="${x0 + 5 * stringWidth}" y2="${y0 + fret * fretHeight}"/>`;
  }

  chord.frets.forEach((fret, string) => {
    const x = x0 + string * stringWidth;
    if (fret === 'x') {
      svg += `<text class="mute-mark" x="${x}" y="18">×</text>`;
    } else if (fret === 0) {
      svg += `<text class="open-mark" x="${x}" y="18">○</text>`;
    } else {
      const y = y0 + (fret - 0.5) * fretHeight;
      svg += `<circle class="dot" cx="${x}" cy="${y}" r="9"/>`;
      if (chord.fingers[string]) {
        svg += `<text class="finger-label" x="${x}" y="${y}">${chord.fingers[string]}</text>`;
      }
    }
  });

  return svg + '</svg>';
}

function getAvailableChords() {
  return typeFilter.value === 'all'
    ? chords
    : chords.filter(chord => chord.type === typeFilter.value);
}

function updateChordOptions() {
  const available = getAvailableChords();
  chordSelect.innerHTML = available
    .map(chord => `<option value="${chord.name}">${chord.name}（${chord.label}）</option>`)
    .join('');
  renderSelectedChord();
}

function renderSelectedChord() {
  const chord = chords.find(item => item.name === chordSelect.value) || getAvailableChords()[0];

  if (!chord) {
    selectedChord.innerHTML = '<div class="empty">表示できるコードがないよ。</div>';
    return;
  }

  selectedChord.innerHTML = `
    <article class="selected-card">
      <div class="selected-heading">
        <div>
          <p class="selected-label">選択中のコード</p>
          <h2 class="selected-name">${chord.name}</h2>
          <div class="meta">
            <span class="badge">${chord.label}</span>
            <span class="badge">難易度 ${stars(chord.difficulty)}</span>
          </div>
        </div>
      </div>
      <div class="selected-content">
        <div class="diagram-wrap">${diagram(chord)}</div>
        <div class="info-list">
          <div class="info-box"><strong>構成音</strong>${chord.notes}</div>
          <div class="info-box"><strong>響き</strong>${chord.mood}</div>
          <div class="info-box"><strong>使い方</strong>${chord.use}</div>
        </div>
      </div>
    </article>`;
}

typeFilter.addEventListener('change', updateChordOptions);
chordSelect.addEventListener('change', renderSelectedChord);

updateChordOptions();