// 全コードに3弦ルートフォームを追加する拡張。
(() => {
  const originalGetForms = getForms;

  // 3弦ルートの高音域・実用ミニコード。
  // 配列は6弦→1弦。rは3弦上のルート位置。
  const practicalThirdShapes = {
    major: r => ({ frets:['x','x','x',r,r,r+3], barres:[] }),
    minor: r => ({ frets:['x','x','x',r,r-1,r+3], barres:[] }),
    '7': r => ({ frets:['x','x','x',r,r,r+1], barres:[] }),
    maj7: r => ({ frets:['x','x','x',r,r,r+2], barres:[] }),
    m7: r => ({ frets:['x','x','x',r,r-1,r+1], barres:[] }),
    '6': r => ({ frets:['x','x','x',r,r,r], barres:[{fret:r,start:3,end:5}] }),
    m6: r => ({ frets:['x','x','x',r,r-1,r], barres:[] }),
    sus2: r => ({ frets:['x','x','x',r,r-2,r+3], barres:[] }),
    sus4: r => ({ frets:['x','x','x',r,r+1,r+3], barres:[] }),
    add9: r => ({ frets:['x','x','x',r,r,r+5], barres:[] }),
    dim: r => ({ frets:['x','x','x',r,r-1,r-3], barres:[] }),
    aug: r => ({ frets:['x','x','x',r,r,r-1], barres:[] })
  };

  function thirdRootFret(root) {
    const rootPc = roots.indexOf(root);
    let fret = (rootPc - tuning[3] + 12) % 12;
    // 実用フォームでマイナス位置が出ないよう、低い位置は1オクターブ上へ。
    if (fret < 3) fret += 12;
    return fret;
  }

  function thirdStringForm(root, type) {
    const r = thirdRootFret(root);
    const builder = practicalThirdShapes[type];
    if (builder) {
      const shape = builder(r);
      return {
        shape: '3弦ルート・実用ミニフォーム',
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
