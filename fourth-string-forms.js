// 全コードに4弦ルートフォームを追加する拡張。
(() => {
  const originalGetForms = getForms;

  // Dフォームを基準にした、実際によく使う4弦ルートフォーム。
  // 配列は6弦→1弦。rは4弦上のルート位置。
  const practicalFourthShapes = {
    major: r => ({ frets:['x','x',r,r+2,r+3,r+2], barres:[] }),
    minor: r => ({ frets:['x','x',r,r+2,r+3,r+1], barres:[] }),
    '7': r => ({ frets:['x','x',r,r+2,r+1,r+2], barres:[] }),
    maj7: r => ({ frets:['x','x',r,r+2,r+2,r+2], barres:[{fret:r+2,start:3,end:5}] }),
    m7: r => ({ frets:['x','x',r,r+2,r+1,r+1], barres:[{fret:r+1,start:4,end:5}] }),
    sus2: r => ({ frets:['x','x',r,r+2,r+3,r], barres:[] }),
    sus4: r => ({ frets:['x','x',r,r+2,r+3,r+3], barres:[{fret:r+3,start:4,end:5}] }),
    add9: r => ({ frets:['x','x',r,r+2,r+3,r], barres:[] }),
    '6': r => ({ frets:['x','x',r,r+2,r,r+2], barres:[] }),
    m6: r => ({ frets:['x','x',r,r+2,r,r+1], barres:[] }),
    dim: r => ({ frets:['x','x',r,r+1,r+3,r+1], barres:[] }),
    aug: r => ({ frets:['x','x',r,r+3,r+3,r+2], barres:[{fret:r+3,start:3,end:4}] })
  };

  function fourthRootFret(root) {
    const rootPc = roots.indexOf(root);
    // 4弦開放音はD（pitch class 2）。0フレットもそのまま使う。
    return (rootPc - tuning[2] + 12) % 12;
  }

  function fourthStringForm(root, type) {
    const r = fourthRootFret(root);
    const builder = practicalFourthShapes[type];
    if (builder) {
      const shape = builder(r);
      return {
        shape: '4弦ルート・実用Dフォーム',
        frets: shape.frets,
        barres: shape.barres
      };
    }
    return {
      shape: '4弦ルート・省略',
      frets: generatedShape(root, type, 2),
      barres: []
    };
  }

  getForms = function(root, type, bass) {
    const forms = originalGetForms(root, type, bass);

    // オンコードは指定ベース音を最低音にするため、通常コード時のみ追加。
    if (bass !== 'none') return forms;
    if (forms.some(form => form.shape?.startsWith('4弦ルート'))) return forms;

    const fourth = fourthStringForm(root, type);
    return [
      ...forms,
      {
        label: `フォーム${forms.length + 1}`,
        shape: fourth.shape,
        frets: fourth.frets,
        barres: fourth.barres
      }
    ];
  };

  selectedFormIndex = 0;
  render();
})();