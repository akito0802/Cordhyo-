(() => {
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
    const lowChord = [...new Set(chordIntervals.map(interval => 48 + rootPc + interval))];

    if (bass === 'none') {
      // ルート音は既存の再生ですでに低音として鳴るため、ほかの構成音を追加する。
      return lowChord.filter(note => note % 12 !== rootPc);
    }

    const bassPc = roots.indexOf(bass);
    // オンコードでは最低音をさらに1オクターブ下に置き、低域にもコード構成音を加える。
    return [36 + bassPc, ...lowChord.filter(note => note % 12 !== bassPc)];
  }

  document.addEventListener('click', event => {
    const chordButton = event.target.closest('.play-chord-button');
    const arpeggioButton = event.target.closest('.play-arpeggio-button');
    if (!chordButton && !arpeggioButton) return;

    const ctx = getContext();
    const now = ctx.currentTime + 0.03;
    const isArpeggio = Boolean(arpeggioButton);

    getLowerOctaveNotes().forEach((midi, index) => {
      playLowTone(
        midi,
        now + (isArpeggio ? index * 0.16 : index * 0.018),
        isArpeggio ? 2.3 : 1.9
      );
    });
  });
})();