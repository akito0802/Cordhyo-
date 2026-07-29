(() => {
  const roots = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  let audioContext;

  function chordName(root, type, bass = 'none') {
    const base = root + (typeData[type]?.suffix || '');
    return bass === 'none' ? base : `${base}/${bass}`;
  }

  function slashPurpose(root, type, bass) {
    if (bass === 'none') return '通常のルート音を最低音にした、最も安定した基本形。';
    const rootPc = roots.indexOf(root);
    const bassPc = roots.indexOf(bass);
    const interval = (bassPc - rootPc + 12) % 12;
    const labels = {
      2: '2度のベース音で、次のコードへ滑らかにつなぐ経過的な響き。',
      3: '短3度を最低音にした第1転回形。マイナー感を保ちながらベースを滑らかにできる。',
      4: '長3度を最低音にした第1転回形。ルート感を弱めて、上向き・下向きのベース進行を作りやすい。',
      5: '4度のベース音で、サス感やペダルポイントのような浮遊感を加える。',
      7: '5度を最低音にした第2転回形。安定感を残しつつ、厚みのある低音にできる。',
      9: '6度を最低音にして、柔らかく歌うようなベースラインを作る。',
      10: '短7度を最低音にして、次のコードへ強く進みたくなる動きを作る。',
      11: '長7度を最低音にして、半音進行の緊張感を強く出す。'
    };
    return labels[interval] || `${bass}を最低音にして、通常形とは違うベースラインと響きを作るオンコード。`;
  }

  function recommendSlash(root, type, prevRoot, nextRoot) {
    const options = [...document.querySelectorAll('#bassSelect option')]
      .map(option => option.value)
      .filter(value => value !== 'none');
    if (!options.length) return [];
    const rootPc = roots.indexOf(root);
    const prevPc = roots.indexOf(prevRoot);
    const nextPc = roots.indexOf(nextRoot);
    return options.map(bass => {
      const bassPc = roots.indexOf(bass);
      const prevDistance = Math.min((bassPc - prevPc + 12) % 12, (prevPc - bassPc + 12) % 12);
      const nextDistance = Math.min((bassPc - nextPc + 12) % 12, (nextPc - bassPc + 12) % 12);
      const chordToneBonus = typeData[type]?.intervals?.some(i => (rootPc + i) % 12 === bassPc) ? -1 : 1;
      return { bass, score: prevDistance + nextDistance + chordToneBonus };
    }).sort((a,b) => a.score - b.score).slice(0,3);
  }

  function getContext() {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') audioContext.resume();
    return audioContext;
  }

  function playTone(midi, start, duration = 1.55, volume = 0.1, bassTone = false) {
    const ctx = getContext();
    const gain = ctx.createGain();
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    osc.type = bassTone ? 'sine' : 'triangle';
    osc.frequency.value = 440 * Math.pow(2, (midi - 69) / 12);
    filter.type = 'lowpass';
    filter.frequency.value = bassTone ? 700 : 2200;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(bassTone ? 0.22 : volume, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(filter).connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + duration + 0.05);
  }

  function chordVoicing(root, type, bass = 'none') {
    const rootPc = roots.indexOf(root);
    const bassPc = bass === 'none' ? rootPc : roots.indexOf(bass);
    const intervals = typeData[type]?.intervals || [0,4,7];
    const upper = intervals
      .map(interval => 60 + rootPc + interval)
      .filter(note => note % 12 !== bassPc)
      .map((note, index) => note + (index > 2 ? 12 : 0));
    return { bass: 36 + bassPc, upper: [...new Set(upper)].slice(0,6) };
  }

  function playVoicing(root, type, bass, start) {
    const voicing = chordVoicing(root, type, bass);
    playTone(voicing.bass, start, 1.65, 0.1, true);
    voicing.upper.forEach((note, index) => playTone(note, start + 0.09 + index * 0.018, 1.5, 0.085));
  }

  function playComparison(root, type, bass) {
    const ctx = getContext();
    const start = ctx.currentTime + 0.05;
    playVoicing(root, type, 'none', start);
    playVoicing(root, type, bass, start + 2.05);
  }

  function renderEnhancements() {
    const card = document.querySelector('#selectedChord .selected-card');
    if (!card || card.querySelector('.slash-enhancements')) return;
    const root = document.querySelector('#rootSelect')?.value || 'C';
    const type = document.querySelector('#typeSelect')?.value || 'major';
    const bass = document.querySelector('#bassSelect')?.value || 'none';
    const baseName = chordName(root, type);
    const currentName = chordName(root, type, bass);

    const panel = document.createElement('section');
    panel.className = 'slash-enhancements';
    panel.innerHTML = `
      <div class="slash-feature-card">
        <h3>オンコードの使いどころ</h3>
        <p>${slashPurpose(root, type, bass)}</p>
      </div>
      <div class="slash-feature-card slash-recommend-card">
        <h3>前後コードからおすすめ</h3>
        <div class="slash-context-inputs">
          <label>前のコード<select class="slash-prev-root">${roots.map(r => `<option${r === root ? ' selected' : ''}>${r}</option>`).join('')}</select></label>
          <label>次のコード<select class="slash-next-root">${roots.map(r => `<option${r === roots[(roots.indexOf(root)+9)%12] ? ' selected' : ''}>${r}</option>`).join('')}</select></label>
        </div>
        <div class="slash-recommend-result"></div>
      </div>
      <div class="slash-feature-card slash-compare-card">
        <h3>通常コードと聴き比べ</h3>
        <p>${bass === 'none' ? 'オンコードを選ぶと通常形との違いを聴き比べできるよ。' : `${baseName} → ${currentName} の順に、最低音を強調して再生するよ。`}</p>
        <button type="button" class="slash-compare-button" ${bass === 'none' ? 'disabled' : ''}>🎧 聴き比べ</button>
      </div>`;

    card.appendChild(panel);

    const prev = panel.querySelector('.slash-prev-root');
    const next = panel.querySelector('.slash-next-root');
    const result = panel.querySelector('.slash-recommend-result');
    const updateRecommendations = () => {
      const items = recommendSlash(root, type, prev.value, next.value);
      result.innerHTML = items.length
        ? items.map(({bass}, index) => `<button type="button" data-recommended-bass="${bass}"><strong>${index + 1}位</strong>${chordName(root,type,bass)}</button>`).join('')
        : '<small>このコードではおすすめ候補がまだないよ。</small>';
    };
    prev.addEventListener('change', updateRecommendations);
    next.addEventListener('change', updateRecommendations);
    result.addEventListener('click', event => {
      const button = event.target.closest('[data-recommended-bass]');
      if (!button) return;
      const select = document.querySelector('#bassSelect');
      select.value = button.dataset.recommendedBass;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });
    panel.querySelector('.slash-compare-button')?.addEventListener('click', () => playComparison(root, type, bass));
    updateRecommendations();
  }

  const style = document.createElement('style');
  style.textContent = `
    .slash-enhancements{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin:18px 0 0}
    .slash-feature-card{padding:16px;border:1px solid rgba(93,75,52,.16);border-radius:16px;background:rgba(255,255,255,.76)}
    .slash-feature-card h3{margin:0 0 8px;font-size:1rem}.slash-feature-card p{margin:0;line-height:1.65;color:#5f5548}
    .slash-context-inputs{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0}.slash-context-inputs label{font-size:.78rem;font-weight:800;color:#746858}.slash-context-inputs select{width:100%;min-height:40px;margin-top:4px;border:1px solid #cfc2af;border-radius:10px;background:#fff;padding:6px}
    .slash-recommend-result{display:grid;gap:7px}.slash-recommend-result button,.slash-compare-button{min-height:42px;border:1px solid #cfc2af;border-radius:11px;background:#fffdf8;color:#332b22;font:inherit;font-weight:800;cursor:pointer}.slash-recommend-result button strong{margin-right:7px;font-size:.72rem;color:#8a7455}.slash-compare-button{width:100%;margin-top:12px}.slash-compare-button:disabled{opacity:.45;cursor:not-allowed}
    @media(max-width:850px){.slash-enhancements{grid-template-columns:1fr}}`;
  document.head.appendChild(style);

  const target = document.querySelector('#selectedChord');
  if (target) new MutationObserver(renderEnhancements).observe(target, { childList:true, subtree:true });
  renderEnhancements();
})();