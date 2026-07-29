// 全コードに4弦ルートフォームを追加する拡張。
(() => {
  const originalGetForms = getForms;

  function fourthStringShape(root, type) {
    return generatedShape(root, type, 2);
  }

  getForms = function(root, type, bass) {
    const forms = originalGetForms(root, type, bass);

    // オンコードは指定ベース音を最低音にするため、通常コード時のみ4弦ルートを追加。
    if (bass !== 'none') return forms;

    const alreadyHasFourthRoot = forms.some(form => form.shape?.startsWith('4弦ルート'));
    if (alreadyHasFourthRoot) return forms;

    return [
      ...forms,
      {
        label: `フォーム${forms.length + 1}`,
        shape: '4弦ルート・省略',
        frets: fourthStringShape(root, type),
        barres: []
      }
    ];
  };

  selectedFormIndex = 0;
  render();
})();
