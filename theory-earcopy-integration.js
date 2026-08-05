(()=>{'use strict';
function integrate(){
 const category=window.theoryCategories?.earcopy||theoryCategories?.earcopy;
 if(category){
  category.label='耳コピ分析';
  category.description='耳コピの手順と、候補コードを確かめる分析機能を1つにまとめた実践カテゴリ。';
  category.items=category.items.filter(item=>item.title!=='耳コピ分析ラボの使い方');
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
 function syncLab(){
  if(!lab)return;
  lab.hidden=activeCategory!=='earcopy';
 }
 if(typeof renderCards==='function'){
  const baseRender=renderCards;
  renderCards=function(){baseRender();syncLab();};
  renderCards();
 }else{
  syncLab();
 }
 document.getElementById('theoryTabs')?.addEventListener('click',()=>setTimeout(syncLab,0));
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',integrate):integrate();
})();
