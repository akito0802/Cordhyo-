(() => {
  const svgNS = 'http://www.w3.org/2000/svg';
  const openStringMidi = [40, 45, 50, 55, 59, 64];

  function highlightLowestRoot() {
    const svg = document.querySelector('#selectedChord .chord-diagram');
    if (!svg || svg.dataset.rootHighlighted === 'true') return;

    const root = rootSelect?.value;
    const type = typeSelect?.value;
    const bass = bassSelect?.value || 'none';
    const forms = getForms(root, type, bass);
    const form = forms[selectedFormIndex] || forms[0];
    if (!form) return;

    const frets = form.frets;
    const rootPc = roots.indexOf(root);
    const rootCandidates = frets
      .map((value, stringIndex) => {
        if (value === 'x') return null;
        const fret = Number(value);
        const pitchClass = (tuning[stringIndex] + fret) % 12;
        if (pitchClass !== rootPc) return null;
        return { stringIndex, value, midi: openStringMidi[stringIndex] + fret };
      })
      .filter(Boolean)
      .sort((a, b) => a.midi - b.midi);

    const target = rootCandidates[0];
    if (!target) {
      svg.dataset.rootHighlighted = 'true';
      return;
    }

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

    if (target.value === 0) {
      const mark = [...svg.querySelectorAll('text.open-mark')].find(item =>
        Math.abs(Number(item.getAttribute('x')) - (x0 + target.stringIndex * stringWidth)) < 1
      );
      mark?.classList.add('root-open-mark');
    } else {
      const isCoveredByBarre = form.barres?.some(barre =>
        barre.fret === target.value && target.stringIndex >= barre.start && target.stringIndex <= barre.end
      );

      if (isCoveredByBarre) {
        const displayFret = target.value - base + 1;
        if (displayFret >= 1 && displayFret <= count) {
          const circle = document.createElementNS(svgNS, 'circle');
          circle.setAttribute('class', 'dot root-dot root-dot-overlay');
          circle.setAttribute('cx', String(x0 + target.stringIndex * stringWidth));
          circle.setAttribute('cy', String(y0 + (displayFret - 0.5) * fretHeight));
          circle.setAttribute('r', '9');
          svg.appendChild(circle);
        }
      } else {
        let dotIndex = 0;
        for (let stringIndex = 0; stringIndex < frets.length; stringIndex++) {
          const value = frets[stringIndex];
          if (value === 'x' || value === 0) continue;
          const covered = form.barres?.some(barre =>
            barre.fret === value && stringIndex >= barre.start && stringIndex <= barre.end
          );
          if (covered) continue;
          if (stringIndex === target.stringIndex) {
            [...svg.querySelectorAll('circle.dot')][dotIndex]?.classList.add('root-dot');
            break;
          }
          dotIndex++;
        }
      }
    }

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
  if (target) new MutationObserver(highlightLowestRoot).observe(target, { childList:true, subtree:true });
  highlightLowestRoot();
})();