(()=>{
'use strict';
if(window.__CHORD_UI_V3_LAYOUT__)return;
const host=document.querySelector('#selectedChord');
const root=document.querySelector('#rootSelect');
if(!host||!root)return;
window.__CHORD_UI_V3_LAYOUT__=true;
document.body.classList.add('chord-ui-v3');

const hero=document.querySelector('.hero');
const nav=document.querySelector('.site-nav');
if(hero&&nav&&hero.nextElementSibling!==nav){
  nav.parentNode.insertBefore(hero,nav);
}
if(hero){
  hero.innerHTML=`<div class="ui3-brand"><div class="ui3-brand-icon" aria-hidden="true">🎸</div><div class="ui3-brand-copy"><p class="ui3-brand-title">コード辞典</p><p class="ui3-brand-sub">ギターコードを探して学べるコード辞典</p></div></div>`;
}

const search=document.querySelector('#chordSearch');
if(search)search.placeholder='コード検索';

const filterLabels=[...document.querySelectorAll('.selection-filters>label')];
filterLabels[0]?.classList.add('ui3-filter-root');
filterLabels[1]?.classList.add('ui3-filter-type');
filterLabels[2]?.classList.add('ui3-filter-bass');

function enhanceCard(){
  const card=host.querySelector('.selected-card');
  if(!card)return;
  card.dataset.uiConcept='3';
  card.querySelectorAll('.form-tab').forEach((button,i)=>{
    button.dataset.uiIndex=String(i+1);
  });
}

new MutationObserver(()=>requestAnimationFrame(enhanceCard)).observe(host,{childList:true,subtree:true});
requestAnimationFrame(enhanceCard);
})();
