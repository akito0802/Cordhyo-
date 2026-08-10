// Lightweight exclusive form category filter. No MutationObserver, no render loop.
(()=>{
 if(typeof getForms!=='function')return;
 const FILTERS=[['all','すべて'],['beginner','🔰 初心者'],['standard','🎸 定番'],['reference','📘 資料'],['bossa','🌴 Bossa'],['jazz','🎷 Jazz'],['drop','🔀 Drop'],['special','✨ 特殊']];
 let active='all';
 const category=(shape='')=>{const s=String(shape);if(/Bossa/i.test(s))return'bossa';if(/Drop\s*2|Drop\s*3|Drop2|Drop3|転回|Inversion/i.test(s))return'drop';if(/Quartal|4度堆積|4度|Open特殊|オープン.*特殊/i.test(s))return'special';if(/初心者|オープンコード|\bOpen\b|簡易|省略|2フィンガー/i.test(s))return'beginner';if(/PDF|資料|📘/i.test(s))return'reference';if(/Jazz|Shell|Voicing|Standard/i.test(s))return'jazz';return'standard';};
 const icon={beginner:'🔰',standard:'🎸',reference:'📘',bossa:'🌴',jazz:'🎷',drop:'🔀',special:'✨'};
 function mount(){
  const ui=document.querySelector('#selectedChord .all-chords-compact-ui'),select=ui?.querySelector('.allChordsFormSelect');if(!ui||!select)return;
  const forms=getForms(rootSelect.value,typeSelect.value,bassSelect.value||'none')||[];if(!forms.length)return;
  let bar=ui.querySelector('.form-category-filter');if(!bar){bar=document.createElement('div');bar.className='form-category-filter';select.parentNode.insertBefore(bar,select);}
  const counts=Object.fromEntries(FILTERS.map(([id])=>[id,0]));counts.all=forms.length;forms.forEach(f=>counts[category(f.shape)]++);
  if(active!=='all'&&!counts[active])active='all';
  bar.innerHTML=FILTERS.map(([id,label])=>`<button type="button" class="form-filter-chip${active===id?' active':''}" data-filter="${id}" ${id!=='all'&&!counts[id]?'disabled':''}>${label}<span>${counts[id]||0}</span></button>`).join('');
  const list=forms.map((form,index)=>({form,index})).filter(x=>active==='all'||category(x.form.shape)===active);
  let current=typeof selectedFormIndex==='number'?selectedFormIndex:0;
  if(!list.some(x=>x.index===current)&&list.length){current=list[0].index;window.selectedFormIndex=current;}
  select.innerHTML=list.map(({form,index})=>{const c=category(form.shape),s=String(form.shape||`フォーム${index+1}`),name=s.startsWith(icon[c])?s:`${icon[c]} ${s}`;return `<option value="${index}" ${index===current?'selected':''}>${name}</option>`}).join('');
  if(list.length)select.value=String(current);
  bar.onclick=e=>{const b=e.target.closest('[data-filter]');if(!b||b.disabled)return;active=b.dataset.filter;const target=forms.map((form,index)=>({form,index})).filter(x=>active==='all'||category(x.form.shape)===active);if(!target.length)return;window.selectedFormIndex=target[0].index;if(typeof render==='function')render();};
 }
 const st=document.createElement('style');st.textContent=`.form-category-filter{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding:2px 1px 5px}.form-category-filter::-webkit-scrollbar{display:none}.form-filter-chip{flex:0 0 auto;min-height:32px;padding:6px 9px;border:1px solid #d7c9b5;border-radius:999px;background:#fff;font-size:.75rem;font-weight:800;white-space:nowrap}.form-filter-chip span{margin-left:4px;font-size:.64rem}.form-filter-chip.active{background:#2e2924;color:#fff;border-color:#2e2924}.form-filter-chip:disabled{opacity:.3}`;document.head.appendChild(st);
 window.addEventListener('universal-form-ui-mounted',mount);
 [rootSelect,typeSelect,bassSelect].forEach(el=>el?.addEventListener('change',()=>{active='all';setTimeout(mount,0);}));
 setTimeout(mount,0);
})();