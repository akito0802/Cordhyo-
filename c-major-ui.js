// 全ギターコード共通のコンパクトなフォーム切替UI。
// コード定義・フォーム定義・オンコード定義には一切触れず、既存getForms()の結果をそのまま選択UIに載せる。
(() => {
  function shortLabel(shape='', index=0) {
    if (shape === 'オープンコード') return 'Open';
    if (shape === 'オンコード') return 'オンコード';
    if (shape === '6弦ルート') return '6弦ルート';
    if (shape === '5弦ルート') return '5弦ルート';
    if (shape.includes('6弦ルート')) return shape.replace('6弦ルート・','6弦 ');
    if (shape.includes('5弦ルート')) return shape.replace('5弦ルート・','5弦 ');
    if (shape.includes('4弦ルート')) return shape.replace('4弦ルート・','4弦 ');
    if (shape.includes('3弦ルート')) return shape.replace('3弦ルート・','3弦 ');
    if (shape.includes('初心者')) return '初心者';
    if (shape.includes('オープン・1弦')) return 'Open 省略';
    if (shape.includes('オープン・トップG')) return 'Open +G';
    if (shape.includes('CAGED・A')) return 'CAGED A';
    if (shape.includes('CAGED・G')) return 'CAGED G';
    if (shape.includes('CAGED・E')) return 'CAGED E';
    if (shape.includes('3弦トライアド')) return 'Triad 3弦';
    if (shape.includes('4弦トライアド')) return 'Triad 4弦';
    if (shape.includes('カッティング')) return 'Cutting';
    if (shape.includes('ジャズ')) return 'Jazz';
    if (shape.includes('ワイド')) return 'Wide';
    if (shape.includes('ハイポジション')) return 'High';
    return shape || `フォーム${index + 1}`;
  }

  function difficulty(shape='') {
    if (shape === 'オンコード') return '指定ベース';
    if (shape.includes('初心者') || shape.includes('オープン')) return '初心者向け';
    if (shape.includes('トライアド') || shape.includes('カッティング')) return '初級';
    if (shape.includes('CAGED') || shape.includes('ジャズ')) return '中級';
    if (shape.includes('ハイポジション') || shape.includes('ワイド')) return '上級';
    if (shape.includes('省略')) return '実用省略';
    return '定番';
  }

  function mount() {
    const host = document.querySelector('#selectedChord');
    if (!host || !window.getForms && typeof getForms !== 'function') return;

    const oldTabs = host.querySelector('.form-tabs');
    if (oldTabs) oldTabs.style.display = 'none';
    host.querySelector('.all-chords-compact-ui')?.remove();

    const root = rootSelect?.value;
    const type = typeSelect?.value;
    const bass = bassSelect?.value || 'none';
    if (!root || !type) return;

    const forms = getForms(root, type, bass) || [];
    if (!forms.length) return;

    if (selectedFormIndex >= forms.length) selectedFormIndex = 0;
    const currentIndex = Math.min(selectedFormIndex, forms.length - 1);
    const current = forms[currentIndex];

    const ui = document.createElement('div');
    ui.className = 'all-chords-compact-ui';
    ui.innerHTML = `
      <label class="all-chords-select-label">
        <span>押さえ方</span>
        <select class="allChordsFormSelect" aria-label="${root}コードの押さえ方を選択">
          ${forms.map((form,index) => `<option value="${index}" ${index===currentIndex?'selected':''}>${shortLabel(form.shape,index)}｜${difficulty(form.shape)}</option>`).join('')}
        </select>
      </label>
      <div class="all-chords-current">
        <strong>${shortLabel(current.shape,currentIndex)}</strong>
        <span>${difficulty(current.shape)} ・ ${currentIndex + 1}/${forms.length}</span>
      </div>`;

    const card = host.querySelector('.selected-card');
    const heading = host.querySelector('.selected-heading');
    if (card && heading) heading.insertAdjacentElement('afterend', ui);
    else host.prepend(ui);

    ui.querySelector('.allChordsFormSelect')?.addEventListener('change', event => {
      selectedFormIndex = Number(event.target.value) || 0;
      render();
    });
  }

  const style = document.createElement('style');
  style.textContent = `
    .all-chords-compact-ui{display:flex;align-items:end;gap:12px;margin:12px 0 14px;padding:12px;border:1px solid #ded6c9;border-radius:14px;background:#fffaf2}
    .all-chords-select-label{display:flex;flex:1;min-width:0;flex-direction:column;gap:6px;font-weight:800;color:#332b22}
    .all-chords-select-label>span{font-size:.82rem;color:#6b6256}
    .all-chords-select-label select{width:100%;min-width:0;padding:11px 38px 11px 12px;border:1px solid #d7c9b5;border-radius:11px;background:#fff;color:#2f2922;font:inherit;font-weight:750}
    .all-chords-current{display:flex;flex-direction:column;gap:3px;min-width:120px;text-align:right}
    .all-chords-current strong{font-size:.9rem}.all-chords-current span{font-size:.76rem;color:#756a5d}
    .selected-card .form-tabs{display:none!important}
    @media(max-width:560px){
      .all-chords-compact-ui{display:block;margin:10px 0 12px;padding:10px}
      .all-chords-current{display:none}
    }
  `;
  document.head.appendChild(style);

  const target = document.querySelector('#selectedChord');
  if (target) new MutationObserver(() => requestAnimationFrame(mount)).observe(target,{childList:true,subtree:true});
  document.addEventListener('change', () => requestAnimationFrame(mount));
  mount();
})();
