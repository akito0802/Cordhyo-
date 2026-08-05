(()=>{'use strict';
if(typeof theoryCategories==='undefined')return;
const source=theoryCategories.composition;
if(!source)return;
const remixTitles=new Set([
 'リミックスとは','リミックス制作の流れ','ステムの使い方','アカペラを使った制作','マッシュアップ','エディット・VIP Mix・ブートレグ','サンプリングの基礎','テンポ変更とタイムストレッチ','ピッチ変更とキー合わせ','ジャンル変換アレンジ','EDMのビルドアップとドロップ','Lo-fiリミックス','ボーカルチョップ','トランジション設計','リミックス公開前チェック'
]);
const mixTitles=new Set([
 'ミックスの基礎','オートメーション','ボーカルプロデュース','リファレンス曲を使う'
]);
const remixItems=[];const remain=[];
source.items.forEach(item=>{
 if(remixTitles.has(item.title))remixItems.push(item);
 else if(!mixTitles.has(item.title))remain.push(item);
});
source.items=remain;
source.description='メロディ、コード、構成、楽器配置、展開を組み立て、曲を完成まで導く実践カテゴリ。';
theoryCategories.remix={
 label:'リミックス',
 description:'原曲素材の分析、ステム編集、ジャンル変換、マッシュアップ、公開前確認まで学ぶ。',
 items:remixItems
};
delete theoryCategories.mixing;
if(typeof renderCards==='function')renderCards();
})();