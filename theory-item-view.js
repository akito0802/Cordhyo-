(()=>{'use strict';
function titleOf(card){const h=card.querySelector('summary,h3,h2,strong');return h?h.textContent.replace(/[＋−]$/,'').trim():''}
function init(){const root=document.getElementById('theoryCards');if(!root||document.getElementById('theoryItemView'))return;
 const list=document.createElement('div');list.id='theoryItemList';list.className='theory-item-list';
 const detail=document.createElement('div');detail.id='theoryItemView';detail.className='theory-item-view';detail.hidden=true;
 root.parentNode.insertBefore(list,root);root.parentNode.insertBefore(detail,root.nextSibling);root.hidden=true;
 function rebuild(){
  const cards=[...root.children].filter(el=>el.matches('.theory-card,details,[data-pro]'));
  list.innerHTML='';
  cards.forEach((card,i)=>{
   const title=titleOf(card);if(!title)return;
   const btn=document.createElement('button');btn.type='button';btn.className='theory-item-button';btn.innerHTML=`<span>${title}</span><b>›</b>`;
   btn.onclick=()=>show(card,title,i,cards.length);
   list.appendChild(btn);
  });
  if(!cards.length)list.innerHTML='<p class="no-theory">該当する項目がありません。</p>';
 }
 function show(card,title,index,total){
  detail.innerHTML='';
  const top=document.createElement('div');top.className='theory-item-view-head';top.innerHTML=`<button type="button" class="theory-back">← 項目一覧へ</button><span>${index+1} / ${total}</span>`;
  const clone=card.cloneNode(true);clone.removeAttribute('open');clone.classList.add('theory-item-detail');clone.open=true;
  const summary=clone.querySelector('summary');if(summary)summary.style.display='none';
  top.querySelector('.theory-back').onclick=back;
  detail.append(top,clone);
  list.hidden=true;detail.hidden=false;
  document.getElementById('theoryTitle').textContent=title;
  detail.scrollIntoView({behavior:'smooth',block:'start'});
  setTimeout(()=>document.dispatchEvent(new CustomEvent('theory-detail-opened',{detail:{root:detail}})),0);
 }
 function back(){
  detail.hidden=true;list.hidden=false;
  const active=document.querySelector('.theory-tab.active');
  const label=active?active.textContent.trim():'理論';
  document.getElementById('theoryTitle').textContent=label;
  document.querySelector('.theory-guide').scrollIntoView({behavior:'smooth',block:'start'});
 }
 new MutationObserver(()=>{if(detail.hidden)rebuild()}).observe(root,{childList:true});
 document.getElementById('theoryTabs')?.addEventListener('click',()=>setTimeout(()=>{detail.hidden=true;list.hidden=false;rebuild()},0));
 document.getElementById('theorySearch')?.addEventListener('input',()=>setTimeout(()=>{detail.hidden=true;list.hidden=false;rebuild()},0));
 rebuild();
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();