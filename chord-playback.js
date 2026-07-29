(() => {
  const roots = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  const intervals = {
    major:[0,4,7], minor:[0,3,7], '5':[0,7], '5add9':[0,2,7], no3:[0,7], no5:[0,4],
    '6':[0,4,7,9], m6:[0,3,7,9], '7':[0,4,7,10], maj7:[0,4,7,11], m7:[0,3,7,10], mMaj7:[0,3,7,11],
    sus2:[0,2,7], sus4:[0,5,7], add2:[0,2,4,7], add4:[0,4,5,7], add9:[0,2,4,7], madd9:[0,2,3,7],
    mAdd2:[0,2,3,7], mAdd4:[0,3,5,7], madd11:[0,3,5,7], madd13:[0,3,7,9], add11:[0,4,5,7],
    '6sus2':[0,2,7,9], '6sus4':[0,5,7,9], '7sus2':[0,2,7,10], '7sus4':[0,5,7,10],
    '7sus4b9':[0,1,5,7,10], '7sus2b9':[0,1,2,7,10], '7sus2s9':[0,2,3,7,10],
    '9sus2':[0,2,7,10], '9sus4':[0,2,5,7,10], '13sus2':[0,2,7,9,10], '13sus4':[0,5,7,9,10],
    sus2add9:[0,2,7], sus4add9:[0,2,5,7],
    maj7b5:[0,4,6,11], maj7s5:[0,4,8,11], maj9b5:[0,2,4,6,11], maj9s5:[0,2,4,8,11], maj13b5:[0,2,4,6,9,11],
    m7s5:[0,3,8,10], m9s5:[0,2,3,8,10], m11s5:[0,2,3,5,8,10], mMaj7s11:[0,3,6,7,11], mMaj9s11:[0,2,3,6,7,11],
    '9':[0,2,4,7,10], m9:[0,2,3,7,10], maj9:[0,2,4,7,11], mMaj9:[0,2,3,7,11], '69':[0,2,4,7,9], m69:[0,2,3,7,9],
    '11':[0,2,4,5,7,10], m11:[0,2,3,5,7,10], maj11:[0,2,4,5,7,11], maj7s11:[0,4,6,7,11], maj9s11:[0,2,4,6,7,11],
    '13':[0,2,4,7,9,10], m13:[0,2,3,7,9,10], maj13:[0,2,4,7,9,11], maj13s11:[0,2,4,6,7,9,11], mMaj13:[0,2,3,7,9,11],
    '13b5':[0,2,4,6,9,10], '13s5':[0,2,4,8,9,10], '13b9s11':[0,1,4,6,7,9,10], '13s9b13':[0,3,4,7,8,10],
    '7b5':[0,4,6,10], '7s5':[0,4,8,10], '7b9':[0,1,4,7,10], '7s9':[0,3,4,7,10], '7b13':[0,4,7,8,10], '7s11':[0,4,6,7,10],
    '7b9b13':[0,1,4,7,8,10], '7s9b13':[0,3,4,7,8,10], '7b9s11':[0,1,4,6,7,10], '7s9s11':[0,3,4,6,7,10],
    '7b5b9':[0,1,4,6,10], '7b5s9':[0,3,4,6,10], '7s5b9':[0,1,4,8,10], '7s5s9':[0,3,4,8,10],
    '9b5':[0,2,4,6,10], '9s5':[0,2,4,8,10], '13b9':[0,1,4,7,9,10], '13s9':[0,3,4,7,9,10],
    m7b5:[0,3,6,10], m9b5:[0,2,3,6,10], m11b5:[0,2,3,5,6,10],
    dim:[0,3,6], dim7:[0,3,6,9], dimMaj7:[0,3,6,11], dim9:[0,2,3,6,9], dimb9:[0,1,3,6,9], dims9:[0,3,6,9], dimadd9:[0,2,3,6], dim7add11:[0,3,5,6,9],
    aug:[0,4,8], aug7:[0,4,8,10], augmaj7:[0,4,8,11], aug9:[0,2,4,8,10], augs11:[0,4,6,8], augMaj9:[0,2,4,8,11], aug13:[0,2,4,8,9,10]
  };

  let context;
  function getContext() {
    context ||= new (window.AudioContext || window.webkitAudioContext)();
    if (context.state === 'suspended') context.resume();
    return context;
  }

  function pianoTone(midi, start, duration = 1.8, volume = 0.12) {
    const ctx = getContext();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2800, start);
    filter.frequency.exponentialRampToValueAtTime(900, start + duration);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    gain.connect(filter).connect(ctx.destination);
    [1, 2, 3].forEach((harmonic, index) => {
      const osc = ctx.createOscillator();
      osc.type = index === 0 ? 'triangle' : 'sine';
      osc.frequency.value = 440 * Math.pow(2, (midi - 69) / 12) * harmonic;
      const partial = ctx.createGain();
      partial.gain.value = index === 0 ? 1 : 0.18 / harmonic;
      osc.connect(partial).connect(gain);
      osc.start(start);
      osc.stop(start + duration + 0.05);
    });
  }

  function currentNotes() {
    const root = document.querySelector('#rootSelect')?.value || 'C';
    const type = document.querySelector('#typeSelect')?.value || 'major';
    const bass = document.querySelector('#bassSelect')?.value || 'none';
    const rootPc = roots.indexOf(root);
    const chordIntervals = intervals[type] || [0,4,7];
    let notes = chordIntervals.map((value, index) => 60 + rootPc + value + (index > 3 ? 12 : 0));
    if (bass !== 'none') {
      const bassPc = roots.indexOf(bass);
      notes = [48 + bassPc, ...notes.filter(note => note % 12 !== bassPc)];
    } else {
      notes.unshift(48 + rootPc);
    }
    return [...new Set(notes)].slice(0, 7);
  }

  function playChord(arpeggio = false) {
    const ctx = getContext();
    const now = ctx.currentTime + 0.03;
    currentNotes().forEach((midi, index) => {
      pianoTone(midi, now + (arpeggio ? index * 0.16 : index * 0.018), arpeggio ? 2.2 : 1.8, 0.11);
    });
  }

  function mountControls() {
    const card = document.querySelector('#selectedChord .selected-card');
    if (!card || card.querySelector('.playback-controls')) return;
    const controls = document.createElement('div');
    controls.className = 'playback-controls';
    controls.innerHTML = '<button type="button" class="play-chord-button">▶ 再生</button><button type="button" class="play-arpeggio-button">🎼 アルペジオ</button><small>ピアノ音で響きを確認</small>';
    const content = card.querySelector('.selected-content');
    card.insertBefore(controls, content || null);
    controls.querySelector('.play-chord-button').addEventListener('click', () => playChord(false));
    controls.querySelector('.play-arpeggio-button').addEventListener('click', () => playChord(true));
  }

  const style = document.createElement('style');
  style.textContent = '.playback-controls{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:14px 0 18px;padding:12px;border:1px solid rgba(93,75,52,.16);border-radius:14px;background:rgba(255,255,255,.72)}.playback-controls button{min-height:44px;padding:10px 16px;border:1px solid #cfc2af;border-radius:12px;background:#fffdf8;color:#332b22;font:inherit;font-weight:800;cursor:pointer;box-shadow:0 2px 7px rgba(64,45,25,.08)}.playback-controls button:active{transform:translateY(1px);box-shadow:none}.playback-controls small{color:#746858}@media(max-width:560px){.playback-controls button{flex:1;min-width:130px}.playback-controls small{width:100%;text-align:center}}';
  document.head.appendChild(style);

  const target = document.querySelector('#selectedChord');
  if (target) new MutationObserver(mountControls).observe(target, { childList:true, subtree:true });
  mountControls();
})();
