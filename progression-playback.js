(() => {
  const roots = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  const intervals = {
    major:[0,4,7], minor:[0,3,7], '5':[0,7], '7':[0,4,7,10], maj7:[0,4,7,11], m7:[0,3,7,10],
    '9':[0,2,4,7,10], maj9:[0,2,4,7,11], m9:[0,2,3,7,10], sus2:[0,2,7], sus4:[0,5,7],
    add9:[0,2,4,7], dim:[0,3,6], dim7:[0,3,6,9], m7b5:[0,3,6,10]
  };

  let audioContext;
  let playbackId = 0;
  let activeCard = null;
  let activeTimers = [];

  function getContext() {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') audioContext.resume();
    return audioContext;
  }

  function pianoTone(midi, start, duration = 1.3, volume = 0.09) {
    const ctx = getContext();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2800, start);
    filter.frequency.exponentialRampToValueAtTime(850, start + duration);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    gain.connect(filter).connect(ctx.destination);

    [1, 2, 3].forEach((harmonic, index) => {
      const osc = ctx.createOscillator();
      const partial = ctx.createGain();
      osc.type = index === 0 ? 'triangle' : 'sine';
      osc.frequency.value = 440 * Math.pow(2, (midi - 69) / 12) * harmonic;
      partial.gain.value = index === 0 ? 1 : 0.16 / harmonic;
      osc.connect(partial).connect(gain);
      osc.start(start);
      osc.stop(start + duration + 0.05);
    });
  }

  function notesFor(root, type) {
    const rootPc = roots.indexOf(root);
    const chordIntervals = intervals[type] || intervals.major;
    const notes = chordIntervals.map((interval, index) => 60 + rootPc + interval + (index > 3 ? 12 : 0));
    notes.unshift(48 + rootPc);
    return [...new Set(notes)].slice(0, 7);
  }

  function clearTimers() {
    activeTimers.forEach(clearTimeout);
    activeTimers = [];
  }

  function stopPlayback() {
    playbackId += 1;
    clearTimers();
    document.querySelectorAll('.progression-chord.is-playing').forEach(el => el.classList.remove('is-playing'));
    document.querySelectorAll('.progression-play-button.is-playing').forEach(el => {
      el.classList.remove('is-playing');
      el.textContent = '▶ 再生';
    });
    activeCard = null;
    if (audioContext) {
      audioContext.close();
      audioContext = null;
    }
  }

  function playCard(card) {
    stopPlayback();
    const chordButtons = [...card.querySelectorAll('.progression-chord')];
    if (!chordButtons.length) return;

    activeCard = card;
    const id = ++playbackId;
    const bpmInput = card.querySelector('.progression-bpm');
    const loopInput = card.querySelector('.progression-loop');
    const bpm = Math.max(40, Math.min(240, Number(bpmInput?.value) || 100));
    const beatMs = 60000 / bpm;
    const chordMs = beatMs * 4;
    const playButton = card.querySelector('.progression-play-button');
    if (playButton) {
      playButton.classList.add('is-playing');
      playButton.textContent = '⏸ 再生中';
    }

    function runCycle() {
      if (id !== playbackId) return;
      chordButtons.forEach((button, index) => {
        const timer = setTimeout(() => {
          if (id !== playbackId) return;
          chordButtons.forEach(el => el.classList.remove('is-playing'));
          button.classList.add('is-playing');
          const ctx = getContext();
          const start = ctx.currentTime + 0.025;
          notesFor(button.dataset.root, button.dataset.type).forEach((midi, noteIndex) => {
            pianoTone(midi, start + noteIndex * 0.012, Math.max(0.7, chordMs / 1000 * 0.88), 0.085);
          });
        }, index * chordMs);
        activeTimers.push(timer);
      });

      const endTimer = setTimeout(() => {
        if (id !== playbackId) return;
        chordButtons.forEach(el => el.classList.remove('is-playing'));
        if (loopInput?.checked) {
          clearTimers();
          runCycle();
        } else {
          if (playButton) {
            playButton.classList.remove('is-playing');
            playButton.textContent = '▶ 再生';
          }
          activeCard = null;
        }
      }, chordButtons.length * chordMs);
      activeTimers.push(endTimer);
    }

    runCycle();
  }

  function addControls() {
    document.querySelectorAll('.progression-card').forEach(card => {
      if (card.querySelector('.progression-player')) return;
      const player = document.createElement('div');
      player.className = 'progression-player';
      player.innerHTML = `
        <button type="button" class="progression-play-button">▶ 再生</button>
        <button type="button" class="progression-stop-button">■ 停止</button>
        <label class="progression-loop-label"><input type="checkbox" class="progression-loop"> 🔁 ループ</label>
        <label class="progression-bpm-label">BPM <input type="number" class="progression-bpm" min="40" max="240" value="100" inputmode="numeric"></label>`;
      const sequence = card.querySelector('.chord-sequence');
      sequence?.insertAdjacentElement('afterend', player);
    });
  }

  document.addEventListener('click', event => {
    const playButton = event.target.closest('.progression-play-button');
    if (playButton) {
      event.preventDefault();
      event.stopPropagation();
      const card = playButton.closest('.progression-card');
      if (activeCard === card) stopPlayback();
      else playCard(card);
      return;
    }

    if (event.target.closest('.progression-stop-button')) {
      event.preventDefault();
      event.stopPropagation();
      stopPlayback();
    }
  }, true);

  ['progressionKey', 'progressionSearch'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', stopPlayback);
    document.getElementById(id)?.addEventListener('change', stopPlayback);
  });
  document.getElementById('progressionTabs')?.addEventListener('click', stopPlayback);

  const style = document.createElement('style');
  style.textContent = `
    .progression-player{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:12px 0 4px;padding:11px;border:1px solid rgba(93,75,52,.16);border-radius:13px;background:rgba(255,255,255,.7)}
    .progression-player button{min-height:40px;padding:8px 13px;border:1px solid #cfc2af;border-radius:10px;background:#fffdf8;color:#332b22;font:inherit;font-weight:800;cursor:pointer}
    .progression-player button:active{transform:scale(.97)}
    .progression-play-button.is-playing{background:#332b22;color:#fff}
    .progression-loop-label,.progression-bpm-label{display:flex;align-items:center;gap:5px;font-size:.88rem;font-weight:700;color:#5f5549}
    .progression-bpm{width:72px;min-height:36px;padding:5px 7px;border:1px solid #cfc2af;border-radius:9px;background:#fff;font:inherit}
    .progression-chord.is-playing{background:#332b22!important;color:#fff!important;transform:translateY(-2px);box-shadow:0 5px 14px rgba(51,43,34,.22)}
    @media(max-width:560px){.progression-player button{flex:1}.progression-loop-label,.progression-bpm-label{flex:1;justify-content:center}}
  `;
  document.head.appendChild(style);

  const cards = document.getElementById('progressionCards');
  if (cards) new MutationObserver(() => { stopPlayback(); addControls(); }).observe(cards, { childList:true, subtree:true });
  addControls();
})();