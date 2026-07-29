(() => {
  const svgNS = 'http://www.w3.org/2000/svg';

  function highlightRoots() {
    const svg = document.querySelector('#selectedChord .chord-diagram');
    if (!svg || svg.dataset.rootHighlighted === 'true') return;

    const root = rootSelect?.value;
    const type = typeSelect?.value;
    const bass = bassSelect?.value || 'none';
    const forms = getForms(root, type, bass);
    const form = forms[selectedFormIndex] || forms[0];
    if (!form) return;

    const frets = form.frets;
    const numericFrets = frets.filter(value => typeof value === 'number' && value > 0);
    const min = numericFrets.length ? Math.min(...numericFrets) : 1;
    const max = numericFrets.length ? Math.max(...numericFrets) : 1;
    const base = min > 4 ? min : 1;
    const count = Math.max(4, max - base + 1);
    const x0 = 42;
    const y0 = 38;
    const stringWidth = 24;
    const boardHeight = 150;
    const fretHeight = boardHeight / count;
    const rootPc = roots.indexOf(root);

    const dots = [...svg.querySelectorAll('circle.dot')];
    let dotIndex = 0;

    frets.forEach((value, stringIndex) => {
      if (value === 'x') return;
      const pitchClass = (tuning[stringIndex] + Number(value)) % 12;
      const isRoot = pitchClass === rootPc;

      if (value === 0) {
        const openMarks = [...svg.querySelectorAll('text.open-mark')];
        const mark = openMarks.find(item => Math.abs(Number(item.getAttribute('x')) - (x0 + stringIndex * stringWidth)) < 1);
        if (mark && isRoot) mark.classList.add('root-open-mark');
        return;
      }

      const isCoveredByBarre = form.barres?.some(barre =>
        barre.fret === value && stringIndex >= barre.start && stringIndex <= barre.end
      );

      if (!isCoveredByBarre) {
        const dot = dots[dotIndex++];
        if (dot && isRoot) dot.classList.add('root-dot');
      } else if (isRoot) {
        const displayFret = value - base + 1;
        if (displayFret >= 1 && displayFret <= count) {
          const circle = document.createElementNS(svgNS, 'circle');
          circle.setAttribute('class', 'dot root-dot root-dot-overlay');
          circle.setAttribute('cx', String(x0 + stringIndex * stringWidth));
          circle.setAttribute('cy', String(y0 + (displayFret - 0.5) * fretHeight));
          circle.setAttribute('r', '9');
          svg.appendChild(circle);
        }
      }
    });

    svg.dataset.rootHighlighted = 'true';
  }

  const style = document.createElement('style');
  style.textContent = `
    .chord-diagram .root-dot{fill:#d95f59!important;stroke:#8f2f2b!important;stroke-width:2.5}
    .chord-diagram .root-open-mark{fill:#d95f59!important;font-weight:900}
    .chord-diagram .root-dot-overlay{pointer-events:none}
  `;
  document.head.appendChild(style);

  const target = document.querySelector('#selectedChord');
  if (target) new MutationObserver(highlightRoots).observe(target, { childList:true, subtree:true });
  highlightRoots();
})();
