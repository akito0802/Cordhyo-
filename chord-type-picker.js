// Lightweight compact chord type picker. Keeps #typeSelect as source of truth.
(()=>{
 const sel=document.querySelector('#typeSelect');if(!sel)return;const label=sel.closest('label');
 const cats={
  '定番':['major','minor','7','maj7','m7','sus4'],
  '基本':['major','minor','5','6','m6','7','maj7','m7'],
  '7th':['7','maj7','m7','mMaj7','m7b5','7sus4','7b9','7s9'],
  '9/11/13':['9','m9','maj9','11','m11','13','m13','maj13'],
  'sus/add':['sus2','sus4','add9','madd9','add11','7sus4','9sus4','13sus4'],
  'Altered':['7b5','7s5','7b9','7s9','7b13','7s11','13b9','13s9'],
  'dim/aug':['m7b5','dim','dim7','aug','aug7','augmaj7']
 };
 const map=new Map([...sel.options].map(o=>[o.value,o]));
 const short=v=>({major:'M',minor:'m',maj7:'M7',maj9:'M9',maj11:'M11',maj13:'M13',mMaj7:'mM7',mMaj9:'mM9'}[v]||map.get(v)?.textContent||v);
 const wrap=document.createElement('div');wrap.className='type-picker';wrap.innerHTML=`<div class="type-row"><b>コード</b><div class="type-cats"></div></div><div class="type-buttons"></div><div class="type-bottom"><span class="type-current"></span><button type="button" class="type-more">もっと見る</button></div><div class="type-panel" hidden><input type="search" placeholder="コード検索"><div class="type-all"></div></div>`;label.parentNode.insertBefore(wrap,label);label.style.display='none';
 const catsEl=wrap.querySelector('.type-cats'),btns=wrap.querySelector('.type-buttons'),cur=wrap.querySelector('.type-current'),panel=wrap.querySelector('.type-panel'),all=wrap.querySelector('.type-all'),input=panel.querySelector('input');let active='定番';
 catsEl.innerHTML=Object.keys(cats).map((c,i)=>`<button type="button" data-cat="${c}" class="${i===0?'active':''}">${c}</button>`).join('');
 function choose(v){if(!map.has(v))return;sel.value=v;sel.dispatchEvent(new Event('change',{bubbles:true}));render();panel.hidden=true;wrap.querySelector('.type-more').textContent='もっと見る';}
 function render(){cur.textContent=`現在 ${short(sel.value)}`;btns.innerHTML=cats[active].filter(v=>map.has(v)).map(v=>`<button type="button" data-type="${v}" class="${v===sel.value?'active':''}">${short(v)}</button>`).join('');}
 function renderAll(q=''){const query=q.trim().toLowerCase();const opts=[...sel.options].filter(o=>!query||o.textContent.toLowerCase().includes(query)||o.value.toLowerCase().includes(query));all.innerHTML=opts.map(o=>`<button type="button" data-type="${o.value}" class="${o.value===sel.value?'active':''}">${short(o.value)}</button>`).join('');}
 catsEl.onclick=e=>{const b=e.target.closest('[data-cat]');if(!b)return;active=b.dataset.cat;catsEl.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));render();};
 wrap.onclick=e=>{const b=e.target.closest('[data-type]');if(b)choose(b.dataset.type);};
 wrap.querySelector('.type-more').onclick=e=>{panel.hidden=!panel.hidden;e.currentTarget.textContent=panel.hidden?'もっと見る':'閉じる';if(!panel.hidden)renderAll(input.value);};
 input.oninput=()=>renderAll(input.value);sel.addEventListener('change',render);
 const st=document.createElement('style');st.textContent=`
 .type-picker{width:100%;max-width:100%;min-width:0;box-sizing:border-box;overflow:hidden;margin:0 0 8px;padding:8px;border:1px solid #ded6c9;border-radius:12px;background:#fff}
 .type-row{display:flex;align-items:center;gap:7px;min-width:0;max-width:100%;overflow:hidden}.type-row>b{font-size:.72rem;color:#665b4f;flex:0 0 auto}
 .type-cats{display:flex;gap:4px;overflow-x:auto;overflow-y:hidden;min-width:0;max-width:100%;flex:1 1 auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}.type-cats::-webkit-scrollbar{display:none}
 .type-cats button{flex:0 0 auto;max-width:88px;white-space:nowrap;border:1px solid #ddd0bf;background:#fffaf3;color:#4a4036;border-radius:8px;padding:5px 7px;font-size:.66rem;font-weight:800}.type-cats button.active{background:#e9dfd0;border-color:#aa9a85}
 .type-buttons{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px;margin-top:7px;min-width:0}.type-buttons button,.type-all button{width:100%;min-width:0;box-sizing:border-box;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;border:1px solid #d9cdbd;background:#fffaf3;color:#4a4036;border-radius:8px;font-weight:800;min-height:34px;font-size:.76rem}.type-buttons button.active,.type-all button.active{background:#3f382f;color:#fff;border-color:#3f382f}
 .type-bottom{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:6px;min-width:0}.type-current{font-size:.68rem;color:#786d60;font-weight:800;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.type-more{flex:0 0 auto;border:0;background:#f3eee7;color:#675c50;border-radius:8px;font-size:.68rem;font-weight:800;padding:6px 9px}
 .type-panel{width:100%;max-width:100%;box-sizing:border-box;margin-top:7px;border-top:1px solid #eee4d7;padding-top:7px;overflow:hidden}.type-panel input{width:100%;max-width:100%;box-sizing:border-box;border:1px solid #d7cbbb;border-radius:8px;padding:8px;font-size:14px}
 .type-all{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px;max-height:220px;overflow-y:auto;overflow-x:hidden;margin-top:7px;padding-right:1px}.type-all button{font-size:.68rem;padding:4px 2px}
 @media(min-width:700px){.type-buttons,.type-all{grid-template-columns:repeat(6,minmax(0,1fr))}}
 `;document.head.appendChild(st);render();
})();