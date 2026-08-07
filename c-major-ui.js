// Cメジャー専用のコンパクトなフォーム切替UI。
// 既存のフォームデータはそのまま使い、縦長のフォーム一覧だけ隠して上部選択で切り替える。
(() => {
  function shortLabel(shape='', index=0) {
    if (shape === 'オープンコード') return 'Open';
    if (shape === '6弦ルート') return '6弦ルート';
    if (shape === '5弦ルート') return '5弦ルート';
    if (shape.includes('4弦ルート')) return '4弦ルート';
    if (shape.includes('3弦ルート')) return '3弦ルート';
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
    if (shape.includes('初心者') || shape.includes('オープン')) return '初心者向け';
    if (shape.includes('トライアド') || shape.includes('カッティング')) return '初級';
    if (shape.includes('CAGED') || shape.includes('ジャズ')) return '中級';
    if (shape.includes('ハイポジション') || shape.includes('ワイド')) return '上級';
    return '定番';
  }

  function mount() {
    const host = document.querySelector('#selectedChord');
    if (!host) return;

    const isC = rootSelect?.value === 'C' && typeSelect?.value === 'major' && bassSelect?.value === 'none';
    const oldTabs = host.querySelector('.form-tabs');
    if (!isC) {
      if (oldTabs) oldTabs.style.display = '';
      host.querySelector('.c-major-compact-ui')?.remove();
      return;
    }

    if (oldTabs) oldTabs.style.display = 'none';
    if (host.querySelector('.c-major-compact-ui')) return;

    const forms = getForms('C','major','none');
    if (!forms.length) return;
    const currentIndex = Math.min(selectedFormIndex, forms.length - 1);
    const current = forms[currentIndex];

    const ui = document.createElement('div');
    ui.className = 'c-major-compact-ui';
    ui.innerHTML = `
      <label class="c-major-select-label" for="cMajorFormSelect">
        <span>押さえ方</span>
        <select id="cMajorFormSelect" aria-label="Cコードの押さえ方を選択">
          ${forms.map((form,index) => `<option value="${index}" ${index===currentIndex?'selected':''}>${shortLabel(form.shape,index)}｜${difficulty(form.shape)}</option>`).join('')}
        </select>
      </label>
      <div class="c-major-current">
        <strong>${shortLabel(current.shape,currentIndex)}</strong>
        <span>${difficulty(current.shape)} ・ ${currentIndex + 1}/${forms.length}</span>
      </div>`;

    const card = host.querySelector('.selected-card');
    const heading = host.querySelector('.selected-heading');
    if (card && heading) heading.insertAdjacentElement('afterend', ui);
    else host.prepend(ui);

    ui.querySelector('#cMajorFormSelect')?.addEventListener('change', event => {
      selectedFormIndex = Number(event.target.value) || 0;
      render();
    });
  }

  const style = document.createElement('style');
  style.textContent = `
    .c-major-compact-ui{display:flex;align-items:end;gap:12px;margin:12px 0 14px;padding:12px;border:1px solid #ded6c9;border-radius:14px;background:#fffaf2}
    .c-major-select-label{display:flex;flex:1;min-width:0;flex-direction:column;gap:6px;font-weight:800;color:#332b22}
    .c-major-select-label>span{font-size:.82rem;color:#6b6256}
    .c-major-select-label select{width:100%;min-width:0;padding:11px 38px 11px 12px;border:1px solid #d7c9b5;border-radius:11px;background:#fff;color:#2f2922;font:inherit;font-weight:750}
    .c-major-current{display:flex;flex-direction:column;gap:3px;min-width:120px;text-align:right}
    .c-major-current strong{font-size:.9rem}.c-major-current span{font-size:.76rem;color:#756a5d}
    @media(max-width:560px){
      .c-major-compact-ui{display:block;margin:10px 0 12px;padding:10px}
      .c-major-current{display:none}
      .selected-card .form-tabs{display:none!important}
    }
  `;
  document.head.appendChild(style);

  const target = document.querySelector('#selectedChord');
  if (target) new MutationObserver(() => requestAnimationFrame(mount)).observe(target,{childList:true,subtree:true});
  document.addEventListener('change', () => requestAnimationFrame(mount));
  mount();
})();
