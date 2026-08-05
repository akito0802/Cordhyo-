(()=>{'use strict';
function bind(pack){
 if(!pack)return;
 const boxes=[...pack.querySelectorAll('.theory-study-box,.theory-study-panel')];
 if(boxes.length<2)return;
 let nav=pack.querySelector('.theory-study-tabs');
 if(!nav){
  nav=document.createElement('div');nav.className='theory-study-tabs';nav.setAttribute('role','tablist');
  boxes.forEach((box,i)=>{
   const h=box.querySelector('h5');const label=h?h.textContent.trim():`項目${i+1}`;
   const id=`study-panel-${Math.random().toString(36).slice(2)}-${i}`;
   box.id=id;box.classList.add('theory-study-panel');box.hidden=i!==0;box.setAttribute('role','tabpanel');
   const btn=document.createElement('button');btn.type='button';btn.className='theory-study-tab'+(i===0?' active':'');btn.textContent=label;btn.setAttribute('role','tab');btn.setAttribute('aria-controls',id);btn.setAttribute('aria-selected',i===0?'true':'false');nav.appendChild(btn)
  });
  const grid=pack.querySelector('.theory-study-grid');if(grid){grid.before(nav);grid.classList.add('theory-study-single')}
 }
 const buttons=[...nav.querySelectorAll('.theory-study-tab')];
 buttons.forEach((btn,i)=>{
  btn.onclick=()=>{
   buttons.forEach((b,n)=>{const active=n===i;b.classList.toggle('active',active);b.setAttribute('aria-selected',active?'true':'false');if(boxes[n])boxes[n].hidden=!active})
  }
 });
 pack.dataset.tabReady='1'
}
function scan(root=document){root.querySelectorAll('.theory-study-pack').forEach(bind)}
function init(){scan();const root=document.getElementById('theoryCards');if(root)new MutationObserver(()=>scan(root)).observe(root,{childList:true,subtree:true});document.addEventListener('theory-detail-opened',e=>scan(e.detail?.root||document))}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();