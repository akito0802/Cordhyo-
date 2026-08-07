// Cメジャー専用の追加ギターフォーム。
// 既存データや既存getFormsの結果は変更せず、重複しないフォームだけ後ろへ追加する。
(() => {
  const originalGetForms = getForms;

  const cMajorVariations = [
    { shape:'初心者・2フィンガー簡易', frets:['x',3,'x',0,1,0], barres:[] },
    { shape:'オープン・1弦ミュート', frets:['x',3,2,0,1,'x'], barres:[] },
    { shape:'オープン・トップG', frets:['x',3,2,0,1,3], barres:[] },
    { shape:'CAGED・Aフォーム', frets:['x',3,5,5,5,3], barres:[] },
    { shape:'CAGED・Gフォーム', frets:[8,7,5,5,5,8], barres:[] },
    { shape:'CAGED・Eフォーム', frets:[8,10,10,9,8,8], barres:[] },
    { shape:'コンパクト・3弦トライアド', frets:['x','x','x',5,5,3], barres:[] },
    { shape:'コンパクト・4弦トライアド', frets:['x','x',10,9,8,'x'], barres:[] },
    { shape:'カッティング・高音4弦', frets:['x','x',10,9,8,8], barres:[] },
    { shape:'ジャズ・シェル(no5)', frets:['x',3,'x',5,'x',5], barres:[] },
    { shape:'ワイド・トップC', frets:['x',3,5,5,5,8], barres:[] },
    { shape:'ハイポジション・12F上', frets:['x',15,14,12,13,12], barres:[] }
  ];

  const fretKey = frets => frets.map(String).join('|');

  getForms = function(root, type, bass) {
    const forms = originalGetForms(root, type, bass);
    if (root !== 'C' || type !== 'major' || bass !== 'none') return forms;

    const seen = new Set(forms.map(form => fretKey(form.frets || [])));
    const additions = cMajorVariations
      .filter(form => !seen.has(fretKey(form.frets)))
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
