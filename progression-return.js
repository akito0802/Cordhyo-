const progressionCardsForReturn=document.querySelector('#progressionCards');
const progressionStateKey='progressionPageState';

function getActiveProgressionCategory(){
 return document.querySelector('.progression-tab.active')?.dataset.category||'pop';
}
function getActiveProgressionTag(){
 return document.querySelector('[data-tag].active')?.dataset.tag||'';
}
function saveProgressionState(){
 sessionStorage.setItem(progressionStateKey,JSON.stringify({
  category:getActiveProgressionCategory(),
  key:document.querySelector('#progressionKey')?.value||'C',
  search:document.querySelector('#progressionSearch')?.value||'',
  tag:getActiveProgressionTag(),
  scrollY:window.scrollY
 }));
}
function restoreProgressionState(){
 const state=JSON.parse(sessionStorage.getItem(progressionStateKey)||'null');
 if(!state)return;
 const keySelect=document.querySelector('#progressionKey');
 const searchInput=document.querySelector('#progressionSearch');
 if(keySelect&&state.key)keySelect.value=state.key;
 if(searchInput)searchInput.value=state.search||'';
 const categoryButton=document.querySelector(`[data-category="${CSS.escape(state.category||'pop')}"]`);
 if(categoryButton)categoryButton.click();
 else{
  keySelect?.dispatchEvent(new Event('change',{bubbles:true}));
  searchInput?.dispatchEvent(new Event('input',{bubbles:true}));
 }
 if(state.tag){
  requestAnimationFrame(()=>document.querySelector(`[data-tag="${CSS.escape(state.tag)}"]`)?.click());
 }
 requestAnimationFrame(()=>requestAnimationFrame(()=>window.scrollTo(0,Number(state.scrollY)||0)));
}

progressionCardsForReturn?.addEventListener('click',event=>{
 const button=event.target.closest('[data-root][data-type]');
 if(!button)return;
 event.preventDefault();
 event.stopImmediatePropagation();
 saveProgressionState();
 location.href=`index.html?root=${encodeURIComponent(button.dataset.root)}&type=${encodeURIComponent(button.dataset.type)}&from=progressions`;
},true);

restoreProgressionState();
