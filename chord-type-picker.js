// Compact category-based chord type picker. Keeps #typeSelect as source of truth.
(()=>{
 const sel=document.querySelector('#typeSelect'); if(!sel)return;
 const label=sel.closest('label');
 const cats={
  '⭐ 定番':['major','minor','7','maj7','m7','sus4','add9','6','m7b5','9','m9','maj9','13'],
  '基本':['major','minor','5','5add9','no3','no5','6','m6','7','maj7','m7','mMaj7'],
  '7th':['7','maj7','m7','mMaj7','m7b5','7sus2','7sus4','7b5','7s5','7b9','7s9','7b13','7s11'],
  '9/11/13':['9','m9','maj9','mMaj9','69','m69','11','m11','maj11','maj7s11','maj9s11','13','m13','maj13','maj13s11','mMaj13','13b9','13s9'],
  'sus/add':['sus2','sus4','add2','add4','add9','madd9','mAdd2','mAdd4','madd11','madd13','add11','6sus2','6sus4','7sus2','7sus4','9sus2','9sus4','13sus2','13sus4','sus2add9','sus4add9'],
  'Altered':['7b5','7s5','7b9','7s9','7b13','7s11','7b9b13','7s9b13','7b9s11','7s9s11','7b5b9','7b5s9','7s5b9','7s5s9','9b5','9s5','13b9','13s9'],
  'dim/aug':['m7b5','m9b5','m11b5','dim','dim7','dimMaj7','dim9','dimb9','dims9','dimadd9','dim7add11','aug','aug7','augmaj7','aug9','augs11','augMaj9','aug13']
 };
 const opts=[...sel.options]; const map=new Map(opts.map(o=>[o.value,o]));
 const short=v=>({major:'M',minor:'m',maj7:'M7',maj9:'M9',maj11:'M11',maj13:'M13',mMaj7:'mM7',mMaj9:'mM9',mMaj13:'mM13'}[v]||map.get(v)?.textContent||v);
 const wrap=document.createElement('div'); wrap.className='type-picker';
 wrap.innerHTML=`<div class="type-head"><b>コードの種類</b><span class="type-current"></span></div><div class="type-cats"></div><div class="type-buttons"></div><div class="type-tools"><button type="button" class="type-search-toggle">🔎 検索</button><button type="button" class="type-all-toggle">すべてのコード ▼</button></div><div class="type-search" hidden><input type="search" placeholder="例：maj、sus、♭9"></div><div class="type-all" hidden></div>`;
 label.parentNode.insertBefore(wrap,label); label.style.display='none';
 const catsEl=wrap.querySelector('.type-cats'), btns=wrap.querySelector('.type-buttons'), cur=wrap.querySelector('.type-current'), all=wrap.querySelector('.type-all'), search=wrap.querySelector('.type-search'), input=search.querySelector('input');
 let active='⭐ 定番';
 catsEl.innerHTML=Object.keys(cats).map((c,i)=>`<button type="button" data-cat="${c}" class="${i===0?'active':''}">${c}</button>`).join('');
 function choose(v){ if(!map.has(v))return; sel.value=v; sel.dispatchEvent(new Event('change',{bubbles:true})); render(); }
 function render(){cur.textContent=`現在：${short(sel.value)}`; const values=cats[active].filter(v=>map.has(v)); btns.innerHTML=values.map(v=>`<button type="button" data-type="${v}" class="${v===sel.value?'active':''}">${short(v)}</button>`).join('');}
 function renderAll(q=''){const query=q.trim().toLowerCase(); const groups=[...sel.querySelectorAll('optgroup')]; all.innerHTML=groups.map(g=>{const os=[...g.querySelectorAll('option')].filter(o=>!query||o.textContent.toLowerCase().includes(query)||o.value.toLowerCase().includes(query));if(!os.length)return'';return `<section><b>${g.label}</b><div>${os.map(o=>`<button type="button" data-type="${o.value}" class="${o.value===sel.value?'active':''}">${short(o.value)}</button>`).join('')}</div></section>`}).join('');}
 catsEl.onclick=e=>{const b=e.target.closest('[data-cat]');if(!b)return;active=b.dataset.cat;catsEl.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));render();};
 wrap.addEventListener('click',e=>{const b=e.target.closest('[data-type]');if(b)choose(b.dataset.type);});
 wrap.querySelector('.type-all-toggle').onclick=e=>{all.hidden=!all.hidden;e.currentTarget.textContent=all.hidden?'すべてのコード ▼':'すべてのコード ▲';if(!all.hidden)renderAll(input.value);};
 wrap.querySelector('.type-search-toggle').onclick=()=>{search.hidden=!search.hidden;if(!search.hidden){input.focus();all.hidden=false;wrap.querySelector('.type-all-toggle').textContent='すべてのコード ▲';renderAll(input.value);}};
 input.addEventListener('input',()=>renderAll(input.value)); sel.addEventListener('change',render);
 const st=document.createElement('style');st.textContent=`.type-picker{margin:0 0 12px;padding:12px;border:1px solid #ded6c9;border-radius:14px;background:#fff}.type-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:9px;color:#4a4036}.type-current{font-size:.75rem;color:#786d60;font-weight:800}.type-cats{display:flex;gap:6px;overflow-x:auto;padding-bottom:6px;scrollbar-width:none}.type-cats::-webkit-scrollbar{display:none}.type-cats button,.type-buttons button,.type-all button{border:1px solid #d9cdbd;background:#fffaf3;color:#4a4036;border-radius:10px;font-weight:800;touch-action:manipulation}.type-cats button{flex:0 0 auto;padding:7px 10px;font-size:.75rem}.type-cats button.active{background:#e9dfd0;border-color:#aa9a85}.type-buttons{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:4px}.type-buttons button{min-height:39px;padding:6px 3px;font-size:.82rem}.type-buttons button.active,.type-all button.active{background:#3f382f;color:#fff;border-color:#3f382f}.type-tools{display:flex;gap:7px;margin-top:9px}.type-tools button{flex:1;border:0;background:#f0ebe3;color:#5d5348;border-radius:9px;padding:8px;font-weight:800;font-size:.73rem}.type-search{margin-top:8px}.type-search input{width:100%;box-sizing:border-box;border:1px solid #d7cbbb;border-radius:10px;padding:10px;background:#fff}.type-all{margin-top:10px;max-height:330px;overflow:auto;border-top:1px solid #eee4d7;padding-top:4px}.type-all section{padding:8px 0}.type-all section>b{display:block;font-size:.73rem;color:#7b7063;margin-bottom:6px}.type-all section>div{display:grid;grid-template-columns:repeat(4,1fr);gap:5px}.type-all button{min-height:35px;font-size:.72rem;padding:5px 2px}@media(min-width:700px){.type-buttons{grid-template-columns:repeat(7,1fr)}.type-all section>div{grid-template-columns:repeat(7,1fr)}}`;document.head.appendChild(st);render();
})();