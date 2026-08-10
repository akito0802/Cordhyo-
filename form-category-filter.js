// Exclusive category filter for guitar form selector. UI-only: source form data is untouched.
(()=>{
 if(typeof getForms!=='function')return;
 const FILTERS=[['all','すべて'],['beginner','🔰 初心者'],['standard','🎸 定番'],['reference','📘 資料'],['bossa','🌴 Bossa'],['jazz','🎷 Jazz'],['drop','🔀 Drop'],['special','✨ 特殊']];
 let active='all',busy=false;
 const esc=(v='')=>String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
 function category(shape=''){
  const s=String(shape);
  if(/Bossa/i.test(s))return'bossa';
  if(/Drop\s*2|Drop\s*3|Drop2|Drop3|転回|Inversion/i.test(s))return'drop';
  if(/Quartal|4度堆積|4度|Open特殊|オープン.*特殊/i.test(s))return'special';
  if(/初心者|オープンコード|\bOpen\b|簡易|省略|2フィンガー/i.test(s))return'beginner';
  if(/PDF|資料|📘/i.test(s))return'reference';
  if(/Jazz|Shell|Voicing|Standard/i.test(s))return'jazz';
  return'standard';
 }
 const matches=(shape,id)=>id==='all'||category(shape)===id;
 function displayLabel(shape='',i=0){
  const s=String(shape||`フォーム${i+1}`),c=category(s);
  const icon={beginner:'🔰',standard:'🎸',reference:'📘',bossa:'🌴',jazz:'🎷',drop:'🔀',special:'✨'}[c]||'';
  return s.startsWith(icon)?s:`${icon} ${s}`;
 }
 function rebuild(forceDiagram=false){
  if(busy||typeof rootSelect==='undefined'||typeof typeSelect==='undefined'||typeof bassSelect==='undefined')return;
  const ui=document.querySelector('#selectedChord .all-chords-compact-ui');
  const select=ui?.querySelector('.allChordsFormSelect'); if(!ui||!select)return;
  const forms=getForms(rootSelect.value,typeSelect.value,bassSelect.value||'none')||[]; if(!forms.length)return;
  busy=true;
  const counts=Object.fromEntries(FILTERS.map(([id])=>[id,0]));counts.all=forms.length;forms.forEach(f=>counts[category(f.shape)]++);
  let bar=ui.querySelector('.form-category-filter');if(!bar){bar=document.createElement('div');bar.className='form-category-filter';select.parentNode.insertBefore(bar,select);}
  bar.innerHTML=FILTERS.map(([id,label])=>`<button type="button" class="form-filter-chip${active===id?' active':''}" data-filter="${id}" ${id!=='all'&&!counts[id]?'disabled':''}>${label}<span>${counts[id]||0}</span></button>`).join('');
  bar.onclick=e=>{
   const btn=e.target.closest('[data-filter]');if(!btn||btn.disabled)return;
   active=btn.dataset.filter;
   const list=forms.map((form,index)=>({form,index})).filter(x=>matches(x.form.shape,active));
   if(list.length){window.selectedFormIndex=list[0].index;if(typeof render==='function')render();requestAnimationFrame(()=>rebuild(false));}
  };
  const visible=forms.map((form,index)=>({form,index})).filter(x=>matches(x.form.shape,active));
  const list=visible.length?visible:forms.map((form,index)=>({form,index}));
  if(!visible.length&&active!=='all')active='all';
  let current=typeof selectedFormIndex==='number'?selectedFormIndex:0;
  if(!list.some(x=>x.index===current)){current=list[0].index;window.selectedFormIndex=current;forceDiagram=true;}
  select.innerHTML=list.map(({form,index})=>`<option value="${index}" ${index===current?'selected':''}>${esc(displayLabel(form.shape,index))}</option>`).join('');
  select.value=String(current);
  let info=ui.querySelector('.form-filter-result');if(!info){info=document.createElement('div');info.className='form-filter-result';bar.insertAdjacentElement('afterend',info);}
  info.textContent=active==='all'?`全${forms.length}フォーム表示中`:`${FILTERS.find(x=>x[0]===active)?.[1]}のみ・${list.length}フォーム`;
  busy=false;
  if(forceDiagram&&typeof render==='function'){render();requestAnimationFrame(()=>rebuild(false));}
 }
 if(!document.querySelector('#form-category-filter-style')){const st=document.createElement('style');st.id='form-category-filter-style';st.textContent=`.form-category-filter{display:flex;gap:6px;overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding:2px 1px 5px;margin:1px 0 2px}.form-category-filter::-webkit-scrollbar{display:none}.form-filter-chip{flex:0 0 auto;display:inline-flex;align-items:center;gap:4px;min-height:32px;padding:6px 9px;border:1px solid #d7c9b5;border-radius:999px;background:#fff;color:#50483f;font:inherit;font-size:.75rem;font-weight:800;white-space:nowrap;touch-action:manipulation}.form-filter-chip span{display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;padding:0 4px;border-radius:999px;background:#f0ece5;font-size:.64rem;color:#6b6256}.form-filter-chip.active{background:#2e2924;color:#fff;border-color:#2e2924}.form-filter-chip.active span{background:rgba(255,255,255,.18);color:#fff}.form-filter-chip:disabled{opacity:.3}.form-filter-result{font-size:.7rem;color:#7b7165;margin:0 1px 5px}`;document.head.appendChild(st);}
 const host=document.querySelector('#selectedChord');
 // Only watch top-level replacements caused by render(), not every subtree mutation.
 if(host)new MutationObserver(()=>requestAnimationFrame(()=>rebuild(false))).observe(host,{childList:true,subtree:false});
 [rootSelect,typeSelect,bassSelect].forEach(el=>el?.addEventListener('change',()=>{active='all';requestAnimationFrame(()=>rebuild(true));}));
 requestAnimationFrame(()=>rebuild(true));
})();