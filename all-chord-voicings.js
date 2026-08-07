// 全コードの押さえ方をCメジャー基準の数まで追加する拡張。
// 既存フォームは一切削除・上書きせず、typeDataの構成音だけを使って重複しない実用ボイシングを追加する。
(() => {
  const originalGetForms = getForms;
  const TARGET_FORM_COUNT = originalGetForms('C', 'major', 'none').length;
  const MAX_FRET = 17;

  const fretKey = frets => frets.map(String).join('|');
  const pc = n => ((n % 12) + 12) % 12;

  function chordPitchClasses(root, type) {
    const rootPc = roots.indexOf(root);
    const intervals = typeData[type]?.intervals || [0, 4, 7];
    return new Set(intervals.map(interval => pc(rootPc + interval)));
  }

  function requiredPitchClasses(root, type) {
    const rootPc = roots.indexOf(root);
    const intervals = typeData[type]?.intervals || [0, 4, 7];
    const required = new Set([rootPc]);
    // 3rdがあるコードは長短を決める音を優先。
    const third = intervals.find(i => i === 3 || i === 4);
    if (third !== undefined) required.add(pc(rootPc + third));
    // 7thがあるコードは機能感を保つため優先。
    const seventh = intervals.find(i => i === 10 || i === 11);
    if (seventh !== undefined) required.add(pc(rootPc + seventh));
    return required;
  }

  function notePcOnString(stringIndex, fret) {
    return pc(tuning[stringIndex] + fret);
  }

  function candidateFrets(stringIndex, allowed, low, high) {
    const out = [];
    for (let fret = Math.max(0, low); fret <= Math.min(MAX_FRET, high); fret++) {
      if (allowed.has(notePcOnString(stringIndex, fret))) out.push(fret);
    }
    return out;
  }

  function pickNearest(values, target, rank = 0) {
    if (!values.length) return null;
    const sorted = [...values].sort((a, b) => Math.abs(a - target) - Math.abs(b - target) || a - b);
    return sorted[Math.min(rank, sorted.length - 1)];
  }

  function validVoicing(frets, allowed, required) {
    const played = frets.map((f, s) => ({ f, s })).filter(x => typeof x.f === 'number');
    if (played.length < 3) return false;

    const pcs = new Set(played.map(x => notePcOnString(x.s, x.f)));
    for (const p of pcs) if (!allowed.has(p)) return false;
    for (const p of required) if (!pcs.has(p)) return false;

    const stopped = played.map(x => x.f).filter(f => f > 0);
    if (stopped.length) {
      const min = Math.min(...stopped), max = Math.max(...stopped);
      if (max - min > 5) return false;
    }
    return true;
  }

  function categoryFor(frets) {
    const played = frets.filter(f => typeof f === 'number');
    const stopped = played.filter(f => f > 0);
    const top = stopped.length ? Math.max(...stopped) : 0;
    const count = played.length;
    if (top >= 12) return 'High Position';
    if (count === 3) return 'Triad / Compact';
    if (count === 4) return 'Compact Voicing';
    if (count >= 5) return 'Full Voicing';
    return '追加ボイシング';
  }

  function generateVoicings(root, type, existingKeys, needed) {
    const allowed = chordPitchClasses(root, type);
    const required = requiredPitchClasses(root, type);
    const generated = [];
    const seen = new Set(existingKeys);

    // 6弦→1弦の使用パターン。低音寄り・中音寄り・高音寄りを混ぜる。
    const masks = [
      [0,1,2,3,4,5], [0,1,2,3,4], [1,2,3,4,5],
      [0,1,2,3], [1,2,3,4], [2,3,4,5],
      [0,1,2], [1,2,3], [2,3,4], [3,4,5],
      [0,2,3,5], [1,2,4,5], [0,1,3,4], [2,3,5]
    ];
    const centers = [1,3,5,7,9,11,13,15];
    const widths = [3,4,5];
    const ranks = [0,1];

    outer:
    for (const width of widths) {
      for (const center of centers) {
        const low = Math.max(0, center - Math.floor(width / 2));
        const high = Math.min(MAX_FRET, low + width);
        for (const mask of masks) {
          for (const rank of ranks) {
            const frets = Array(6).fill('x');
            mask.forEach((stringIndex, order) => {
              const candidates = candidateFrets(stringIndex, allowed, low, high);
              // 弦ごとに少し狙い位置をずらして同一音の過密を避ける。
              const target = center + ((order % 3) - 1);
              const picked = pickNearest(candidates, target, rank);
              if (picked !== null) frets[stringIndex] = picked;
            });

            if (!validVoicing(frets, allowed, required)) continue;
            const key = fretKey(frets);
            if (seen.has(key)) continue;
            seen.add(key);
            generated.push({
              shape: `${categoryFor(frets)}・自動生成${generated.length + 1}`,
              frets,
              barres: []
            });
            if (generated.length >= needed) break outer;
          }
        }
      }
    }

    // 上の探索だけで足りない特殊コード用。構成音のみで3〜6弦のコンパクト形を追加探索。
    if (generated.length < needed) {
      for (let low = 0; low <= 14 && generated.length < needed; low++) {
        const high = Math.min(MAX_FRET, low + 5);
        for (const mask of masks) {
          if (generated.length >= needed) break;
          const options = mask.map(s => candidateFrets(s, allowed, low, high).slice(0, 3));
          if (options.some(o => !o.length)) continue;

          // 3^nの全探索は避け、選択位置を回して複数候補を作る。
          for (let variant = 0; variant < 3 && generated.length < needed; variant++) {
            const frets = Array(6).fill('x');
            mask.forEach((s, i) => {
              const list = options[i];
              frets[s] = list[(variant + i) % list.length];
            });
            if (!validVoicing(frets, allowed, required)) continue;
            const key = fretKey(frets);
            if (seen.has(key)) continue;
            seen.add(key);
            generated.push({
              shape: `${categoryFor(frets)}・自動生成${generated.length + 1}`,
              frets,
              barres: []
            });
          }
        }
      }
    }

    return generated;
  }

  getForms = function(root, type, bass) {
    const forms = originalGetForms(root, type, bass) || [];

    // 既存オンコードは最低音指定を壊さないため、そのまま維持。
    if (bass !== 'none') return forms;
    // Cメジャーは基準データなので変更しない。
    if (root === 'C' && type === 'major') return forms;
    // 既にC基準以上あるコードは絶対に削らない。
    if (forms.length >= TARGET_FORM_COUNT) return forms;

    const existingKeys = new Set(forms.map(form => fretKey(form.frets || [])));
    const needed = TARGET_FORM_COUNT - forms.length;
    const additions = generateVoicings(root, type, existingKeys, needed)
      .map((form, index) => ({
        label: `フォーム${forms.length + index + 1}`,
        shape: form.shape,
        frets: form.frets,
        barres: form.barres
      }));

    return [...forms, ...additions];
  };

  selectedFormIndex = 0;
  render();
})();
