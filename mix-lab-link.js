(()=>{'use strict';
if(typeof theoryCategories==='undefined')return;
const category=theoryCategories.mixing;
if(!category)return;
const title='Mix Labを開く';
if(!category.items.some(item=>item.title===title)){
 category.items.unshift({
  title,
  keywords:'mix lab EQ トレーニング A B 比較 楽器別 講座',
  body:'音源を読み込み、EQトレーニング、楽器別ミックス、A/B比較、レベル別講座を実際に操作しながら学べる専用ページ。',
  simple:'音を聴きながらミックスを練習できるページ。',
  example:'ボーカル音源を読み込み、3kHzを調整して原音と比較する',
  points:['音源はブラウザ内で処理','講座の進捗を端末へ保存','スマホとPCの両方に対応'],
  link:'mix-lab.html',
  linkLabel:'🎛 Mix Labへ移動'
 });
}
if(typeof renderCards==='function')renderCards();
})();