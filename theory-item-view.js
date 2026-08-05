(()=>{'use strict';
function titleOf(card){const h=card.querySelector('summary,h3,h2,strong');return h?h.textContent.replace(/[＋−]$/,'').trim():''}
function init(){const root=document.getElementById('theoryCards');if(!root||document.getElementById('theoryItemView'))return;
 const list=document.createElement('div');list.id='theoryItemList';list.className='theory-item-list';
 const detail=document.createElement('div');detail.id='theoryItemView';detail.className='theory-item-view';detail.hidden=true;
 document.body.appendChild(detail);root.parentNode.insertBefore(list,root);root.hidden=true;
 let currentCards=[],currentIndex=-1;
 function rebuild(){
  currentCards=[...root.children].filter(el=>el.matches('.theory-card,details,[data-pro]'));
  list.innerHTML='';
  currentCards.forEach((card,i)=>{
   const title=titleOf(card);if(!title)return;
   const btn=document.createElement('button');btn.type='button';btn.className='theory-item-button';btn.innerHTML=`<span>${title}</span><b>›</b>`;
   btn.onclick=()=>show(i);
   list.appendChild(btn);
  });
  if(!currentCards.length)list.innerHTML='<p class="no-theory">該当する項目がありません。</p>';
 }
 function show(index){
  const card=currentCards[index];if(!card)return;currentIndex=index;
  const title=titleOf(card),total=currentCards.length;
  detail.innerHTML='';
  const shell=document.createElement('div');shell.className='theory-fullscreen-shell';
  const top=document.createElement('div');top.className='theory-item-view-head';
  top.innerHTML=`<button type="button" class="theory-back" aria-label="項目一覧へ戻る">← 戻る</button><strong>${title}</strong><span>${index+1} / ${total}</span>`;
  const content=document.createElement('div');content.className='theory-fullscreen-content';
  const clone=card.cloneNode(true);clone.removeAttribute('open');clone.classList.add('theory-item-detail');clone.open=true;
  const summary=clone.querySelector('summary');if(summary)summary.style.display='none';
  const nav=document.createElement('div');nav.className='theory-item-nav';
  nav.innerHTML=`<button type="button" data-prev ${index===0?'disabled':''}>← 前の項目</button><button type="button" data-next ${index===total-1?'disabled':''}>次の項目 →</button>`;
  top.querySelector('.theory-back').onclick=back;
  nav.querySelector('[data-prev]').onclick=()=>show(index-1);
  nav.querySelector('[data-next]').onclick=()=>show(index+1);
  content.append(clone,nav);shell.append(top,content);detail.append(shell);
  detail.hidden=false;document.body.classList.add('theory-detail-open');
  detail.scrollTop=0;
  history.pushState({theoryDetail:true},'',location.href);
  setTimeout(()=>document.dispatchEvent(new CustomEvent('theory-detail-opened',{detail:{root:detail}})),0);
 }
 function back(fromPop=false){
  if(detail.hidden)return;
  detail.hidden=true;document.body.classList.remove('theory-detail-open');currentIndex=-1;
  if(!fromPop&&history.state?.theoryDetail)history.back();
 }
 window.addEventListener('popstate',()=>back(true));
 detail.addEventListener('click',e=>{if(e.target===detail)back()});
 document.addEventListener('keydown',e=>{if(detail.hidden)return;if(e.key==='Escape')back();if(e.key==='ArrowLeft'&&currentIndex>0)show(currentIndex-1);if(e.key==='ArrowRight'&&currentIndex<currentCards.length-1)show(currentIndex+1)});
 new MutationObserver(()=>{if(detail.hidden)rebuild()}).observe(root,{childList:true});
 document.getElementById('theoryTabs')?.addEventListener('click',()=>setTimeout(()=>{back(true);rebuild()},0));
 document.getElementById('theorySearch')?.addEventListener('input',()=>setTimeout(()=>{back(true);rebuild()},0));
 rebuild();
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();