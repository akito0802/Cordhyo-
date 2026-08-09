// Category filter layer for the universal guitar form selector.
// UI-only: never mutates chord/form source data.
(() => {
  if (typeof getForms !== 'function') return;

  const FILTERS = [
    ['all','すべて'],
    ['beginner','🔰 初心者'],
    ['standard','🎸 定番'],
    ['reference','📘 資料'],
    ['bossa','🌴 Bossa'],
    ['jazz','🎷 Jazz'],
    ['drop','🔀 Drop'],
    ['special','✨ 特殊']
  ];

  let active = 'all';
  let lock = false;

  const esc = (v='') => String(v)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');

  function category(shape='') {
    const s = String(shape);
    if (/Bossa/i.test(s)) return 'bossa';
    if (/Drop\s*2|Drop\s*3|Drop2|Drop3|転回|Inversion/i.test(s)) return 'drop';
    if (/Quartal|4度|Open特殊|PDF Open|オープン.*特殊/i.test(s)) return 'special';
    if (/Jazz|Shell|Voicing|Standard/i.test(s)) return 'jazz';
    if (/PDF|資料|📘/i.test(s)) return 'reference';
    if (/初心者|オープンコード|Open|簡易|省略|2フィンガー/i.test(s)) return 'beginner';
    return 'standard';
  }

  function matches(shape, filter) {
    if (filter === 'all') return true;
    return category(shape) === filter;
  }

  function countByCategory(forms) {
    const counts = Object.fromEntries(FILTERS.map(([id])=>[id,0]));
    counts.all = forms.length;
    forms.forEach(f => { counts[category(f.shape)] = (counts[category(f.shape)] || 0) + 1; });
    return counts;
  }

  function displayLabel(shape='', index=0) {
    const s = String(shape || `フォーム${index+1}`);
    if (/Bossa/i.test(s)) return s.startsWith('🌴') ? s : `🌴 ${s}`;
    if (/PDF|資料|📘/i.test(s)) return s.startsWith('📘') ? s : `📘 ${s}`;
    if (/Drop\s*2|Drop\s*3|Drop2|Drop3|転回|Inversion/i.test(s)) return s.startsWith('🔀') ? s : `🔀 ${s}`;
    if (/Jazz|Shell|Voicing|Standard/i.test(s)) return s.startsWith('🎷') ? s : `🎷 ${s}`;
    if (/Quartal|4度|Open特殊/i.test(s)) return s.startsWith('✨') ? s : `✨ ${s}`;
    if (/初心者|オープンコード|Open|簡易|省略|2フィンガー/i.test(s)) return s.startsWith('🔰') ? s : `🔰 ${s}`;
    return s.startsWith('🎸') ? s : `🎸 ${s}`;
  }

  function sync(force=false) {
    if (lock || typeof rootSelect === 'undefined' || typeof typeSelect === 'undefined' || typeof bassSelect === 'undefined') return;
    const ui = document.querySelector('#selectedChord .all-chords-compact-ui');
    const select = ui?.querySelector('.allChordsFormSelect');
    if (!ui || !select) return;

    const root = rootSelect.value;
    const type = typeSelect.value;
    const bass = bassSelect.value || 'none';
    const forms = getForms(root,type,bass) || [];
    if (!forms.length) return;

    lock = true;
    let bar = ui.querySelector('.form-category-filter');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'form-category-filter';
      select.closest('.all-chords-select-label')?.insertBefore(bar, select);
    }

    const counts = countByCategory(forms);
    bar.innerHTML = FILTERS.map(([id,label]) => {
      const count = counts[id] || 0;
      return `<button type="button" class="form-filter-chip${active===id?' active':''}" data-filter="${id}" ${id!=='all' && !count?'disabled':''}>${esc(label)}<span>${count}</span></button>`;
    }).join('');

    bar.querySelectorAll('.form-filter-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        active = btn.dataset.filter || 'all';
        sync(true);
      });
    });

    const currentIndex = typeof selectedFormIndex === 'number' ? selectedFormIndex : 0;
    const visible = forms.map((form,index)=>({form,index})).filter(x=>matches(x.form.shape,active));
    const list = visible.length ? visible : forms.map((form,index)=>({form,index}));
    if (!visible.length && active !== 'all') active = 'all';

    select.innerHTML = list.map(({form,index}) => `<option value="${index}" ${index===currentIndex?'selected':''}>${esc(displayLabel(form.shape,index))}</option>`).join('');

    if (!list.some(x=>x.index===currentIndex)) {
      selectedFormIndex = list[0].index;
      select.value = String(list[0].index);
      if (force && typeof render === 'function') render();
    } else {
      select.value = String(currentIndex);
    }

    const info = ui.querySelector('.form-filter-result') || document.createElement('div');
    info.className = 'form-filter-result';
    info.textContent = active === 'all' ? `全${forms.length}フォーム表示中` : `${FILTERS.find(x=>x[0]===active)?.[1] || ''}：${list.length}フォーム`;
    if (!info.parentNode) bar.insertAdjacentElement('afterend',info);

    lock = false;
  }

  if (!document.querySelector('#form-category-filter-style')) {
    const style = document.createElement('style');
    style.id = 'form-category-filter-style';
    style.textContent = `
      .form-category-filter{display:flex;gap:7px;overflow-x:auto;overscroll-behavior-x:contain;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding:2px 1px 4px;margin:1px 0 2px}
      .form-category-filter::-webkit-scrollbar{display:none}
      .form-filter-chip{flex:0 0 auto;display:inline-flex;align-items:center;gap:5px;min-height:34px;padding:7px 10px;border:1px solid #d7c9b5;border-radius:999px;background:#fff;color:#50483f;font:inherit;font-size:.78rem;font-weight:800;white-space:nowrap;touch-action:manipulation}
      .form-filter-chip span{display:inline-flex;align-items:center;justify-content:center;min-width:20px;height:20px;padding:0 5px;border-radius:999px;background:#f0ece5;font-size:.68rem;color:#6b6256}
      .form-filter-chip.active{background:#2e2924;color:#fff;border-color:#2e2924}
      .form-filter-chip.active span{background:rgba(255,255,255,.18);color:#fff}
      .form-filter-chip:disabled{opacity:.36}
      .form-filter-result{font-size:.72rem;color:#7b7165;margin:0 1px 5px}
    `;
    document.head.appendChild(style);
  }

  const host = document.querySelector('#selectedChord');
  const observer = new MutationObserver(()=>requestAnimationFrame(()=>sync(false)));
  if (host) observer.observe(host,{childList:true,subtree:true});
  [rootSelect,typeSelect,bassSelect].forEach(el=>el?.addEventListener('change',()=>{active='all';requestAnimationFrame(()=>sync(true));}));
  requestAnimationFrame(()=>sync(true));
})();
