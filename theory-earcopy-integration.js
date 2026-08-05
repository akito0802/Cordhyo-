(()=>{'use strict';
function integrate(){
 if(typeof theoryCategories==='undefined')return;
 const entries=Object.entries(theoryCategories).filter(([,cat])=>String(cat?.label||'').includes('耳コピ'));
 let category=theoryCategories.earcopy||entries[0]?.[1];
 if(category){
  const merged=[];
  const seen=new Set();
  entries.forEach(([key,cat])=>{
   (cat.items||[]).forEach(item=>{
    if(item.title==='耳コピ分析ラボの使い方'||seen.has(item.title))return;
    seen.add(item.title);merged.push(item);
   });
   if(key!=='earcopy')delete theoryCategories[key];
  });
  theoryCategories.earcopy=category;
  category.label='耳コピ分析';
  category.description='耳コピの学習内容と候補コード分析を、1つにまとめた実践カテゴリ。';
  category.items=merged.length?merged:(category.items||[]).filter(item=>item.title!=='耳コピ分析ラボの使い方');
 }
 const guide=document.querySelector('.theory-guide');
 const cards=document.getElementById('theoryCards');
 const lab=document.getElementById('theoryLab');
 if(lab&&guide&&cards){
  lab.classList.add('earcopy-analysis-lab');
  const heading=lab.querySelector('.theory-lab-head h2');
  const lead=lab.querySelector('.theory-lab-head p');
  if(heading)heading.textContent='🎧 候補コードを分析';
  if(lead)lead.textContent='耳コピで見つけたキーとコード候補を入力して、構成音・度数・機能・テンション・注意音・次の進行まで確認できるよ。';
  cards.before(lab);
 }
 const syncLab=()=>{if(lab)lab.hidden=activeCategory!=='earcopy';};
 if(typeof renderCards==='function'){
  const baseRender=renderCards;
  renderCards=function(){baseRender();syncLab();};
  if(activeCategory&&!theoryCategories[activeCategory])activeCategory='earcopy';
  renderCards();
 }else syncLab();
 document.getElementById('theoryTabs')?.addEventListener('click',()=>setTimeout(syncLab,0));
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',integrate):integrate();
})();
