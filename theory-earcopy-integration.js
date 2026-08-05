(()=>{'use strict';
function integrate(){
 const category=window.theoryCategories?.earcopy||theoryCategories?.earcopy;
 if(category){
  category.label='耳コピ・分析';
  category.description='耳コピの手順を学びながら、コード分析ラボでキー・構成音・機能までその場で確認できる実践カテゴリ。';
  if(!category.items.some(item=>item.title==='耳コピ分析ラボの使い方')){
   category.items.unshift({
    title:'耳コピ分析ラボの使い方',
    keywords:'耳コピ 分析 ラボ キー コード 機能 構成音',
    body:'耳コピで候補にしたキーとコードを下の分析ラボへ入力し、構成音・度数・機能・テンション・注意音を照合する。聴こえた印象だけで確定せず、理論上の候補と実際の響きを往復して絞り込む。',
    simple:'耳で見つけたコードを分析ラボに入れて、合っているか確かめる。',
    example:'キーC、候補G7を入力して、V度・ドミナント・構成音G/B/D/Fを確認',
    points:['先にベース音とメジャー・マイナーを仮決めする','分析結果は正解ではなく候補確認として使う','前後のコードとメロディ音も合わせて判断する'],
    link:'#theoryLab',
    linkLabel:'耳コピ分析ラボを開く'
   });
  }
 }
 const lab=document.getElementById('theoryLab');
 if(lab){
  const heading=lab.querySelector('.theory-lab-head h2');
  const lead=lab.querySelector('.theory-lab-head p');
  if(heading)heading.textContent='🎧 コード・耳コピ分析ラボ';
  if(lead)lead.textContent='耳コピで見つけた候補コードを入力して、構成音・度数・機能・テンション・注意音・次の進行まで照合できるよ。';
 }
 if(typeof renderCards==='function')renderCards();
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',integrate):integrate();
})();
