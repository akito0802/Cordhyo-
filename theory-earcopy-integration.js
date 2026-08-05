(()=>{'use strict';
function integrate(){
 const category=window.theoryCategories?.earcopy||theoryCategories?.earcopy;
 if(category){
  category.label='耳コピ';
  category.description='音を聴き分け、キー・コード・メロディ・リズムを学び、下の分析ラボで候補を確認できる実践カテゴリ。';
  category.items=category.items.filter(item=>item.title!=='耳コピ分析ラボの使い方');
 }
 const lab=document.getElementById('theoryLab');
 if(lab){
  const heading=lab.querySelector('.theory-lab-head h2');
  const lead=lab.querySelector('.theory-lab-head p');
  if(heading)heading.textContent='🎧 耳コピ分析ラボ';
  if(lead)lead.textContent='耳コピで見つけた候補コードを入力して、構成音・度数・機能・テンション・注意音・次の進行まで照合できるよ。';
 }
 if(typeof renderCards==='function')renderCards();
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',integrate):integrate();
})();
