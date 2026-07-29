(() => {
  const MODE_KEY = 'chord-playback-octave-mode';
  window.chordPlaybackMode = localStorage.getItem(MODE_KEY) || 'combined';
  let context;

  function getContext() {
    context ||= new (window.AudioContext || window.webkitAudioContext)();
    if (context.state === 'suspended') context.resume();
    return context;
  }

  function playLowTone(midi, start, duration = 1.9, volume = 0.055) {
    const ctx = getContext();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1500, start);
    filter.frequency.exponentialRampToValueAtTime(500, start + duration);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    gain.connect(filter).connect(ctx.destination);

    const fundamental = ctx.createOscillator();
    fundamental.type = 'triangle';
    fundamental.frequency.value = 440 * Math.pow(2, (midi - 69) / 12);
    fundamental.connect(gain);
    fundamental.start(start);
    fundamental.stop(start + duration + 0.05);

    const overtone = ctx.createOscillator();
    const overtoneGain = ctx.createGain();
    overtone.type = 'sine';
    overtone.frequency.value = fundamental.frequency.value * 2;
    overtoneGain.gain.value = 0.12;
    overtone.connect(overtoneGain).connect(gain);
    overtone.start(start);
    overtone.stop(start + duration + 0.05);
  }

  function getLowerOctaveNotes() {
    const root = document.querySelector('#rootSelect')?.value || 'C';
    const type = document.querySelector('#typeSelect')?.value || 'major';
    const bass = document.querySelector('#bassSelect')?.value || 'none';
    const rootPc = roots.indexOf(root);
    const chordIntervals = typeData[type]?.intervals || [0, 4, 7];
    let notes = [...new Set(chordIntervals.map(interval => 48 + rootPc + interval))];
    if (bass !== 'none') {
      const bassPc = roots.indexOf(bass);
      notes = [36 + bassPc, ...notes.filter(note => note % 12 !== bassPc)];
    }
    return notes;
  }

  function mountModeSelector() {
    const controls = document.querySelector('.playback-controls');
    if (!controls || controls.querySelector('.octave-mode-selector')) return;
    const selector = document.createElement('fieldset');
    selector.className = 'octave-mode-selector';
    selector.innerHTML = '<legend>再生モード</legend>' +
      [['normal','通常'],['lower','オク下'],['combined','同時']].map(([value,label]) =>
        `<label><input type="radio" name="octavePlaybackMode" value="${value}" ${window.chordPlaybackMode===value?'checked':''}>${label}</label>`
      ).join('');
    controls.prepend(selector);
    selector.addEventListener('change', event => {
      if (!event.target.matches('input[name="octavePlaybackMode"]')) return;
      window.chordPlaybackMode = event.target.value;
      localStorage.setItem(MODE_KEY, window.chordPlaybackMode);
    });
  }

  document.addEventListener('click', event => {
    const chordButton = event.target.closest('.play-chord-button');
    const arpeggioButton = event.target.closest('.play-arpeggio-button');
    if (!chordButton && !arpeggioButton) return;
    if (window.chordPlaybackMode === 'normal') return;

    const ctx = getContext();
    const now = ctx.currentTime + 0.03;
    const isArpeggio = Boolean(arpeggioButton);
    getLowerOctaveNotes().forEach((midi, index) => {
      playLowTone(midi, now + (isArpeggio ? index * 0.16 : index * 0.018), isArpeggio ? 2.3 : 1.9);
    });
  });

  const style = document.createElement('style');
  style.textContent = '.octave-mode-selector{display:flex;align-items:center;gap:10px;flex-wrap:wrap;width:100%;margin:0 0 2px;padding:0;border:0}.octave-mode-selector legend{font-weight:800;margin-right:4px}.octave-mode-selector label{display:flex;align-items:center;gap:5px;padding:7px 10px;border:1px solid #d8cdbc;border-radius:999px;background:#fff}.octave-mode-selector input{accent-color:#7b6548}@media(max-width:560px){.octave-mode-selector{justify-content:center}.octave-mode-selector legend{width:100%;text-align:center}}';
  document.head.appendChild(style);

  const target = document.querySelector('#selectedChord');
  if (target) new MutationObserver(mountModeSelector).observe(target, { childList:true, subtree:true });
  mountModeSelector();
})();