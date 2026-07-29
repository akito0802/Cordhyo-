// 全コードに3弦ルートフォームを追加する拡張。
(() => {
  const originalGetForms = getForms;

  // 教則本でよく扱う、3弦をルートにしたコンパクトな定番ボイシング。
  // 配列は6弦→1弦。rは3弦上のルート位置。
  // 基本形は2〜4弦または1〜4弦を使い、バンドでも濁りにくい形にしている。
  const standardThirdShapes = {
    major: r => ({ frets:['x','x','x',r,r,r+3], barres:[] }),
    minor: r => ({ frets:['x','x','x',r,r-1,r+3], barres:[] }),
    '7': r => ({ frets:['x','x',r,r,r,r+1], barres:[{fret:r,start:2,end:4}] }),
    maj7: r => ({ frets:['x','x',r,r,r,r+2], barres:[{fret:r,start:2,end:4}] }),
    m7: r => ({ frets:['x','x',r,r,r-1,r+1], barres:[{fret:r,start:2,end:3}] }),
    '6': r => ({ frets:['x','x',r+2,r,r,r+3], barres:[{fret:r,start:3,end:4}] }),
    m6: r => ({ frets:['x','x',r+2,r,r-1,r+3], barres:[] }),
    sus2: r => ({ frets:['x','x',r,r,r-2,r+3], barres:[{fret:r,start:2,end:3}] }),
    sus4: r => ({ frets:['x','x',r,r,r+1,r+3], barres:[{fret:r,start:2,end:3}] }),
    add9: r => ({ frets:['x','x',r,r,r,r+5], barres:[{fret:r,start:2,end:4}] }),
    dim: r => ({ frets:['x','x',r-1,r,r-1,r+3], barres:[] }),
    aug: r => ({ frets:['x','x',r+1,r,r,r+3], barres:[{fret:r,start:3,end:4}] })
  };

  function thirdRootFret(root) {
    const rootPc = roots.indexOf(root);
    let fret = (rootPc - tuning[3] + 12) % 12;
    // マイナスの相対フレットが出る形があるため、低い位置は1オクターブ上へ。
    if (fret < 2) fret += 12;
    return fret;
  }

  function thirdStringForm(root, type) {
    const r = thirdRootFret(root);
    const builder = standardThirdShapes[type];
    if (builder) {
      const shape = builder(r);
      return {
        shape: '3弦ルート・定番フォーム',
        frets: shape.frets,
        barres: shape.barres
      };
    }
    return {
      shape: '3弦ルート・省略',
      frets: generatedShape(root, type, 3),
      barres: []
    };
  }

  getForms = function(root, type, bass) {
    const forms = originalGetForms(root, type, bass);

    // オンコードでは指定ベース音を優先するため、通常コード時のみ追加。
    if (bass !== 'none') return forms;
    if (forms.some(form => form.shape?.startsWith('3弦ルート'))) return forms;

    const third = thirdStringForm(root, type);
    return [
      ...forms,
      {
        label: `フォーム${forms.length + 1}`,
        shape: third.shape,
        frets: third.frets,
        barres: third.barres
      }
    ];
  };

  selectedFormIndex = 0;
  render();
})();