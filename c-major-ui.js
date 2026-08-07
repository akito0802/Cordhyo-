// Cメジャー専用のフォームUI補助。既存描画は壊さず、表示後にナビUIだけ追加する。
(() => {
  const GROUPS = [
    ['all','全部'],
    ['beginner','初心者'],
    ['open','Open'],
    ['caged','CAGED'],
    ['triad','Triad'],
    ['jazz','Jazz'],
    ['cutting','カッティング'],
    ['high','High']
  ];

  function formCategory(shape='') {
    if (shape.includes('初心者')) return 'beginner';
    if (shape.includes('オープン')) return 'open';
    if (shape.includes('CAGED')) return 'caged';
    if (shape.includes('トライアド')) return 'triad';
    if (shape.includes('ジャズ')) return 'jazz';
    if (shape.includes('カッティング')) return 'cutting';
    if (shape.includes('ハイポジション')) return 'high';
    return 'all';
  }

  function difficulty(shape='') {
    if (shape.includes('初心者') || shape.includes('オープン')) return ['★','初心者'];
    if (shape.includes('トライアド') || shape.includes('カッティング')) return ['★★','初級'];
    if (shape.includes('CAGED')) return ['★★★','中級'];
    if (shape.includes('ジャズ')) return ['★★★','中級'];
    if (shape.includes('ハイポジション') || shape.includes('ワイド')) return ['★★★★','上級'];
    return ['★★','定番'];
  }

  function mount() {
    if (rootSelect?.value !== 'C' || typeSelect?.value !== 'major' || bassSelect?.value !== 'none') return;
    const host = document.querySelector('#selectedChord');
    if (!host || host.querySelector('.c-major-ui')) return;

    const forms = getForms('C','major','none');
    const current = forms[selectedFormIndex] || forms[0];
    if (!current) return;

    const ui = document.createElement('section');
    ui.className = 'c-major-ui';
    const [stars, level] = difficulty(current.shape || '');
    ui.innerHTML = `
      <div class="c-major-summary">
        <div>
          <strong>${current.shape || current.label || 'Cフォーム'}</strong>
          <span>${stars} ${level}</span>
        </div>
        <span class="c-major-count">${selectedFormIndex + 1} / ${forms.length}</span>
      </div>
      <div class="c-major-chips" role="tablist" aria-label="Cコードのフォーム分類">
        ${GROUPS.map(([key,label]) => `<button type="button" data-c-major-filter="${key}">${label}</button>`).join('')}
      </div>
      <div class="c-major-form-strip" aria-label="Cコードのフォーム一覧">
        ${forms.map((form,index)=>`<button type="button" data-c-major-index="${index}" class="${index===selectedFormIndex?'active':''}"><span>${form.shape || form.label || `フォーム${index+1}`}</span><small>${difficulty(form.shape||'')[1]}</small></button>`).join('')}
      </div>`;

    host.prepend(ui);

    ui.addEventListener('click', event => {
      const jump = event.target.closest('[data-c-major-index]');
      if (jump) {
        selectedFormIndex = Number(jump.dataset.cMajorIndex) || 0;
        render();
        return;
      }
      const filter = event.target.closest('[data-c-major-filter]');
      if (!filter) return;
      const key = filter.dataset.cMajorFilter;
      ui.querySelectorAll('[data-c-major-filter]').forEach(btn => btn.classList.toggle('active', btn===filter));
      ui.querySelectorAll('[data-c-major-index]').forEach((btn,index) => {
        const cat = formCategory(forms[index]?.shape || '');
        btn.hidden = key !== 'all' && cat !== key;
      });
    });
  }

  const style = document.createElement('style');
  style.textContent = `
    .c-major-ui{margin:0 0 18px;padding:14px;border:1px solid #ded6c9;border-radius:18px;background:#fffaf2}
    .c-major-summary{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px}
    .c-major-summary>div{display:flex;flex-direction:column;gap:3px}.c-major-summary strong{font-size:1rem}.c-major-summary span{font-size:.82rem;color:#6b6256}.c-major-count{white-space:nowrap}
    .c-major-chips,.c-major-form-strip{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;scrollbar-width:thin}
    .c-major-chips{margin-bottom:10px}.c-major-chips button{flex:0 0 auto;border:1px solid #d7c9b5;border-radius:999px;background:#fff;color:#5a4731;padding:7px 11px;font-weight:700}.c-major-chips button.active{background:#8b6f47;color:#fff;border-color:#8b6f47}
    .c-major-form-strip button{flex:0 0 min(210px,72vw);text-align:left;border:1px solid #dfd4c4;border-radius:14px;background:#fff;padding:11px 12px;color:#2f2922}.c-major-form-strip button.active{outline:2px solid #8b6f47;border-color:#8b6f47}.c-major-form-strip span{display:block;font-weight:800;white-space:normal}.c-major-form-strip small{display:block;margin-top:4px;color:#7a6d5e}
    @media(max-width:560px){.c-major-ui{margin-left:-2px;margin-right:-2px;padding:12px}.c-major-summary{align-items:flex-start}.c-major-form-strip button{flex-basis:78vw}}
  `;
  document.head.appendChild(style);

  const observer = new MutationObserver(() => requestAnimationFrame(mount));
  const target = document.querySelector('#selectedChord');
  if (target) observer.observe(target,{childList:true,subtree:true});
  ['change','input'].forEach(evt => document.addEventListener(evt, () => requestAnimationFrame(mount)));
  mount();
})();
