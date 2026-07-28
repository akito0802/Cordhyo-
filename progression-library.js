const extraProgressions={
 pop:[
  ['6345進行',[[6,'minor'],[3,'minor'],[4,'major'],[5,'major']],'vi → iii → IV → V','切なさから自然に盛り上がる循環。','Aメロ後半・Bメロ','★★','Am7→Em7→Fmaj7→G7','iiiをI/IIIへ置換','下降後に上昇','切ない,サビ,循環'],
  ['1562進行',[[1,'major'],[5,'major'],[6,'minor'],[2,'minor']],'I → V → vi → ii','定番感を残しつつ次の展開へ進みやすい。','Aメロ・イントロ','★','Iadd9→Vsus4→vim7→iim7','iiをIVへ置換','跳躍して着地','初心者,爽やか'],
  ['4251進行',[[4,'major'],[2,'minor'],[5,'major'],[1,'major']],'IV → ii → V → I','柔らかく始まり、きれいに終止する。','Bメロ・アウトロ','★★','IVmaj7→iim7→V7→Imaj9','iiをIV/iiへ置換','安定へ下降','終止,ポップス'],
  ['4511進行',[[4,'major'],[5,'major'],[1,'major'],[1,'major']],'IV → V → I → I','サビ頭で一気に開放できる。','サビ・ラスサビ','★','IVadd9→V7→Imaj9→I6','最後をviへ置換','上昇して固定','明るい,サビ,初心者'],
  ['6251進行',[[6,'minor'],[2,'minor'],[5,'major'],[1,'major']],'vi → ii → V → I','切ない始まりから明るく解決する。','Bメロ・サビ終わり','★★','vim7→iim7→V9→Imaj7','viをIVへ置換','低音が段階移動','解決,切ない'],
  ['1345進行',[[1,'major'],[3,'minor'],[4,'major'],[5,'major']],'I → iii → IV → V','少しずつ期待感を高める王道上昇。','Bメロ・サビ前','★','Imaj7→iiim7→IVmaj7→V7','iiiをI/IIIへ置換','なだらかな上昇','上昇,盛り上げ'],
  ['1432進行',[[1,'major'],[4,'major'],[3,'minor'],[2,'minor']],'I → IV → iii → ii','明るさから静かに落ち着く流れ。','Aメロ・間奏','★★','Iadd9→IVmaj7→iiim7→iim7','iiiをV/iiiへ置換','順次下降','穏やか,アルペジオ'],
  ['5146進行',[[5,'major'],[1,'major'],[4,'major'],[6,'minor']],'V → I → IV → vi','強い始まりから切なさへ着地する。','イントロ・サビ','★★','V7→Imaj9→IVadd9→vim7','VをVsus4へ置換','解決後に下降','印象的,サビ']
 ],
 ballad:[
  ['I-iii-IV-iv',[[1,'major'],[3,'minor'],[4,'major'],[4,'minor']],'I → iii → IV → iv','最後のサブドミナントマイナーが胸を締めつける。','サビ終わり・アウトロ','★★★','Imaj7→iiim7→IVmaj7→ivm6','iiiをI/IIIへ置換','上昇後に半音下降','泣ける,終止'],
  ['I-V-IV-iv',[[1,'major'],[5,'major'],[4,'major'],[4,'minor']],'I → V → IV → iv','王道の安心感から切ない余韻へ変わる。','バラード終盤','★★','Iadd9→V7→IVmaj7→ivm6','VをV/IVへ置換','下降して半音変化','切ない,アウトロ'],
  ['IV-iv-I',[[4,'major'],[4,'minor'],[1,'major']],'IV → iv → I','短くても強い感情を作れる定番終止。','曲の最後・区切り','★★','IVmaj7→ivm6→I6/9','IをImaj9へ置換','半音下降して着地','終止,感動'],
  ['I-vi-ii-V',[[1,'major'],[6,'minor'],[2,'minor'],[5,'major']],'I → vi → ii → V','古典的で歌を支えやすい循環。','Aメロ・間奏','★','Imaj7→vim7→iim7→V9','viをVI7へ置換','循環型','初心者,循環'],
  ['vi-ii-V-I',[[6,'minor'],[2,'minor'],[5,'major'],[1,'major']],'vi → ii → V → I','暗さから少しずつ明るさへ向かう。','サビ後半','★★','vim9→iim7→V7♭9→Imaj9','iiをIVへ置換','上向きの解決','感動,サビ'],
  ['I-IVmaj7-iv',[[1,'major'],[4,'maj7'],[4,'minor']],'I → IVmaj7 → iv','余白が多く、歌詞を聴かせやすい。','静かなAメロ・アウトロ','★★','Iadd9→IVmaj9→ivm9','Iをiiiへ置換','共通音を保つ','アルペジオ,余韻'],
  ['add9バラード',[[1,'add9'],[5,'sus4'],[6,'m7'],[4,'add9']],'Iadd9 → Vsus4 → vim7 → IVadd9','開放弦を活かしやすい透明な進行。','イントロ・Aメロ','★★','そのまま9thを維持','Vsus4をVへ解決','共通音を固定','透明感,ギター'],
  ['maj9エンディング',[[4,'maj9'],[5,'9'],[1,'maj9']],'IVmaj9 → V9 → Imaj9','豪華だが静かなエンディング。','アウトロ・終止','★★★','IVmaj9→V13→I6/9','Vを♭VII9へ置換','低音4-5-1','おしゃれ,終止'],
  ['ペダル終止',[[1,'major'],[4,'major'],[5,'sus4'],[1,'major']],'I → IV → Vsus4 → I','同じ高音を保つと祈るような響きになる。','ラスサビ後・映画風','★★','Iadd9→IVmaj7→V7sus4→Imaj9','IVをiiへ置換','ペダル音を維持','壮大,映画']
 ],
 rock:[
  ['I-♭VII-IV風',[[1,'major'],[7,'major'],[4,'major']],'I → ♭VII → IV','ミクソリディアン風の開放的なロック。','イントロ・リフ','★★','I5→♭VIIadd9→IV5','IVをivへ置換','全音下降','ロック,リフ'],
  ['I-IV-I-V',[[1,'major'],[4,'major'],[1,'major'],[5,'major']],'I → IV → I → V','シンプルで歌いやすいクラシックロック。','Aメロ・サビ','★','I5→IVadd9→I5→Vsus4','Vを♭VIIへ置換','主音へ戻る反復','初心者,8ビート'],
  ['vi-I-V-IV',[[6,'minor'],[1,'major'],[5,'major'],[4,'major']],'vi → I → V → IV','エモさと力強さが両立する。','サビ・間奏','★','vim7→Iadd9→Vsus4→IVadd9','IをI/IIIへ置換','跳躍下降','エモ,サビ'],
  ['IV-V-vi-I',[[4,'major'],[5,'major'],[6,'minor'],[1,'major']],'IV → V → vi → I','上昇感を保ったまま明るく着地する。','ラスサビ','★★','IVadd9→V7→vim7→Imaj9','viをiiiへ置換','連続上昇','壮大,ラスサビ'],
  ['I5-♭VII5-IV5',[[1,'5'],[7,'5'],[4,'5']],'I5 → ♭VII5 → IV5','太いリフに向くモーダルな進行。','リフ・間奏','★','5(add9)を混ぜる','IV5をivへ置換','低音下降','ハードロック,リフ'],
  ['半音上昇ブリッジ',[[3,'minor'],[4,'major'],[5,'major'],[6,'minor']],'iii → IV → V → vi','半音感のある上昇でサビへ押し上げる。','Bメロ・ブリッジ','★★','iiim7→IVmaj7→V7→vim9','iiiをI/IIIへ置換','段階上昇','盛り上げ,エモ'],
  ['下降ロック',[[6,'minor'],[5,'major'],[4,'major'],[1,'major']],'vi → V → IV → I','泣きながら前へ進むような下降。','サビ後半','★','vim7→Vsus4→IVadd9→I','Iをiiiへ置換','明確な下降','切ない,ロック'],
  ['ブルースロック循環',[[1,'7'],[4,'7'],[1,'7'],[5,'7']],'I7 → IV7 → I7 → V7','ブルージーなギターソロに向く。','間奏・ソロ','★★','I9→IV9→I7♯9→V9','Vを♭VII7へ置換','ルート中心','ブルース,ソロ'],
  ['オクターブ疾走',[[1,'5'],[5,'5'],[6,'minor'],[4,'5']],'I5 → V5 → vi → IV5','オクターブ奏法と相性がよい疾走系。','イントロ・サビ','★★','5(add9)を混ぜる','viをVI5へ単純化','大きな跳躍','疾走,アニソン']
 ],
 jazz:[
  ['iii-VI-ii-V',[[3,'m7'],[6,'7'],[2,'m7'],[5,'7']],'iiim7 → VI7 → iim7 → V7','循環感が強い定番ターンアラウンド。','Aメロ・間奏','★★★','iiim9→VI7♭9→iim9→V13','VI7を♭III7へ置換','五度進行','ジャズ,循環'],
  ['リズムチェンジ風',[[1,'maj7'],[6,'7'],[2,'m7'],[5,'7']],'Imaj7 → VI7 → iim7 → V7','明るく軽快なジャズ定番。','アップテンポ','★★★','I6→VI7♭9→iim9→V13','VI7を♭III7へ置換','五度循環','ジャズ,速い'],
  ['Lady Bird風',[[1,'maj7'],[3,'7'],[6,'m7'],[2,'7'],[5,'7']],'Imaj7 → III7 → vim7 → II7 → V7','連続するドミナントで華やかに進む。','エンディング・ターンアラウンド','★★★★','各7thに♭9や13を追加','II7を♭VI7へ置換','五度下降','ジャズ,上級'],
  ['トライトーン終止',[[2,'m7'],[2,'7'],[1,'maj7']],'iim7 → ♭II7 → Imaj7','半音下から主和音へ解決する都会的な終止。','サビ終わり','★★★★','iim9→♭II13♯11→Imaj9','V7の代わりに♭II7','半音下降','代理コード,終止'],
  ['IVmaj7-♯IVdim-I',[[4,'maj7'],[4,'dim7'],[1,'maj7']],'IVmaj7 → ♯IVdim7 → Imaj7','ディミニッシュで滑らかにつなぐ。','間奏・アウトロ','★★★','IVmaj9→♯IVdim7→I6/9','dim7をV7/iiへ置換','半音上昇','経過コード,ジャズ'],
  ['マイナー251',[[2,'m7b5'],[5,'7'],[6,'minor']],'iim7♭5 → V7 → i','マイナーキーの基本終止。','ジャズバラード','★★★','iim11♭5→V7♭9→imMaj9','V7を♭II7へ置換','五度進行','マイナー,ジャズ'],
  ['クリシェ循環',[[1,'maj7'],[1,'7'],[4,'maj7'],[4,'minor']],'Imaj7 → I7 → IVmaj7 → ivm','内声が半音で動くドラマチックな流れ。','バラード・映画風','★★★','Imaj9→I13→IVmaj9→ivm9','I7をV/IVとして扱う','内声半音下降','クリシェ,映画'],
  ['モーダルmaj7',[[1,'maj7'],[2,'maj7'],[1,'maj7']],'Imaj7 → IImaj7 → Imaj7','リディアン風の浮遊感。','間奏・BGM','★★★','Imaj9♯11→IImaj9→Imaj9','IIをV/Ⅴへ解釈','全音往復','モーダル,浮遊'],
  ['ゴスペル終止',[[4,'maj7'],[5,'sus4'],[5,'7'],[1,'maj7']],'IVmaj7 → V7sus4 → V7 → Imaj7','タメから解決する厚い終止。','サビ終わり・教会風','★★★','IVmaj9→V13sus4→V7♭9→I6/9','V7を♭VII9へ置換','4-5-1','ゴスペル,終止']
 ],
 minor:[
  ['i-♭VII-♭VI-V',[[6,'minor'],[5,'major'],[4,'major'],[3,'major']],'i → ♭VII → ♭VI → V','王道のドラマチック下降。','サビ・映画風','★★','im→♭VIIadd9→♭VImaj7→V7♭9','VをVaugへ置換','段階下降','映画,切ない'],
  ['i-iv-♭VII-♭III',[[6,'minor'],[2,'minor'],[5,'major'],[1,'major']],'i → iv → ♭VII → ♭III','暗さの中に壮大さがある。','ゲーム・ロック','★★','im9→ivm9→♭VII9→♭IIImaj7','ivをiiøへ置換','四度進行','壮大,ゲーム'],
  ['i-♭VI-♭III-♭VII',[[6,'minor'],[4,'major'],[1,'major'],[5,'major']],'i → ♭VI → ♭III → ♭VII','広がりのあるマイナー定番。','サビ・EDM','★','im7→♭VImaj7→♭IIIadd9→♭VII','♭VIIをVへ置換','跳躍型','エモ,サビ'],
  ['i-v-♭VI-♭VII',[[6,'minor'],[3,'minor'],[4,'major'],[5,'major']],'i → v → ♭VI → ♭VII','静かに始まり徐々に熱くなる。','AメロからBメロ','★','im9→vm7→♭VImaj7→♭VIIadd9','vをV7へ置換','上昇後半','切ない,上昇'],
  ['i-iiø-V7-i',[[6,'minor'],[2,'m7b5'],[5,'7'],[6,'minor']],'i → iiø → V7 → i','クラシカルで強い解決感。','間奏・終止','★★★','imMaj7→iim11♭5→V7♭9→im9','V7を♭II7へ置換','五度進行','クラシカル,終止'],
  ['泣きメロ進行',[[4,'major'],[5,'major'],[6,'minor'],[3,'minor']],'♭VI → ♭VII → i → v','上昇して主和音へ飛び込む感情的な流れ。','泣きサビ','★★','♭VImaj7→♭VIIadd9→im9→vm7','vをV7へ置換','上昇後に下降','泣ける,サビ'],
  ['半終止マイナー',[[6,'minor'],[4,'major'],[2,'minor'],[5,'7']],'i → ♭VI → iv → V7','解決せずVで止め、次を期待させる。','Bメロ・転調前','★★','im9→♭VImaj7→ivm9→V7♭9','ivをiiøへ置換','Vで停止','緊張,転調'],
  ['暗いクリシェ',[[6,'minor'],[6,'mMaj7'],[6,'m7'],[4,'major']],'im → imMaj7 → im7 → ♭VI','内声が半音下降する映画的な進行。','イントロ・劇伴','★★★★','im(add9)→imMaj9→im9→♭VImaj7','最後をivmへ置換','半音下降','クリシェ,映画'],
  ['ラスサビ解放',[[6,'minor'],[4,'major'],[5,'major'],[1,'major']],'i → ♭VI → ♭VII → ♭III','暗い世界から明るい相対調へ抜ける。','ラスサビ','★★','im9→♭VImaj9→♭VII13→♭IIImaj9','最後をiへ戻す','上昇して解放','ラスサビ,感動']
 ],
 anime:[
  ['4536高速',[[4,'major'],[5,'major'],[3,'minor'],[6,'minor']],'IV → V → iii → vi','王道進行を高速で回す疾走型。','サビ・OP','★★','IVadd9→V7→iiim7→vim9','iiiをI/IIIへ置換','上昇後に下降','アニソン,疾走'],
  ['6415エモ',[[6,'minor'],[4,'major'],[1,'major'],[5,'major']],'vi → IV → I → V','切なさと開放感の定番。','サビ・ED','★','vim7→IVadd9→Imaj9→Vsus4','VをV7へ置換','跳躍型','エモ,初心者'],
  ['サビ前上昇',[[2,'minor'],[3,'minor'],[4,'major'],[5,'major']],'ii → iii → IV → V','段階上昇で一気にサビへつなぐ。','Bメロ','★','iim7→iiim7→IVmaj7→V7','iiiをI/IIIへ置換','連続上昇','Bメロ,盛り上げ'],
  ['泣きサビ循環',[[4,'major'],[5,'major'],[6,'minor'],[1,'major']],'IV → V → vi → I','泣きながら前へ進むような明るさ。','サビ','★★','IVmaj9→V13→vim9→Iadd9','Iをiiiへ置換','上昇して着地','泣ける,サビ'],
  ['ボカロ高速下降',[[6,'minor'],[5,'major'],[4,'major'],[3,'minor']],'vi → V → IV → iii','細かいメロディを乗せやすい下降型。','Aメロ・間奏','★★','vim9→V7→IVmaj7→iiim7','VをV/IVへ置換','連続下降','ボカロ,高速'],
  ['ブレイク後開放',[[5,'sus4'],[5,'major'],[1,'major'],[4,'major']],'Vsus4 → V → I → IV','タメてから一気に開放する。','ブレイク後・ラスサビ','★★','V13sus4→V7→Imaj9→IVadd9','Vを♭VII7へ置換','解決して広がる','ラスサビ,ブレイク'],
  ['転調準備',[[4,'major'],[5,'major'],[6,'minor'],[2,'7']],'IV → V → vi → II7','最後のII7が次のキーへ引っ張る。','転調前','★★★','IVmaj7→V13→vim9→II7♭9','II7を♭VI7へ置換','五度方向へ移動','転調,上級'],
  ['変化球サビ',[[3,'minor'],[6,'minor'],[4,'major'],[5,'major']],'iii → vi → IV → V','少し意外な始まりから王道へ戻る。','サビ頭','★★','iiim7→vim9→IVadd9→V7','iiiをI/IIIへ置換','下降後に上昇','アニソン,サビ'],
  ['ラスト一周',[[4,'major'],[5,'major'],[1,'major'],[6,'minor'],[4,'major'],[5,'major'],[1,'major']],'IV → V → I → vi → IV → V → I','最後にもう一度感情を押し上げる長い終止。','ラスサビ最後','★★','IVmaj9→V13→Imaj9→vim9→IV→V7→I6/9','viをiiiへ置換','上昇と帰結','ラスサビ,終止']
 ],
 city:[
  ['1625ネオソウル',[[1,'maj9'],[6,'m9'],[2,'m9'],[5,'9']],'Imaj9 → vim9 → iim9 → V9','トップノートを滑らかに保てる。','Aメロ・ループ','★★★','V9をV13へ','VI7を挟む','五度循環','ネオソウル,循環'],
  ['4361夜景',[[4,'maj9'],[3,'m7'],[6,'m9'],[1,'maj9']],'IVmaj9 → iiim7 → vim9 → Imaj9','夜景のように柔らかく帰結する。','イントロ・BGM','★★★','iiim7をIII7♭9へ','IをI6/9へ','下降後に着地','夜景,チル'],
  ['2516スムース',[[2,'m9'],[5,'13'],[1,'maj9'],[6,'m9']],'iim9 → V13 → Imaj9 → vim9','解決後も余韻を保つ滑らかな循環。','Aメロ・間奏','★★★','V13♭9を使用','VI7へ置換','五度進行','R&B,おしゃれ'],
  ['maj9下降',[[1,'maj9'],[5,'9'],[4,'maj9'],[3,'m9']],'Imaj9 → V9 → IVmaj9 → iiim9','ベース下降と柔らかなテンション。','歌ものAメロ','★★★','V9をV13sus4へ','iiiをI/IIIへ','下降','シティポップ,下降'],
  ['ゴスペル上昇',[[2,'m7'],[3,'m7'],[4,'maj7'],[5,'sus4'],[1,'maj7']],'iim7 → iiim7 → IVmaj7 → V7sus4 → Imaj7','段階上昇から厚く解決する。','サビ・コーラス','★★★','iim9→iiim9→IVmaj9→V13sus4→I6/9','Vを♭VII9へ','連続上昇','ゴスペル,サビ'],
  ['Lo-fi循環',[[4,'maj7'],[3,'m7'],[2,'m7'],[1,'maj7']],'IVmaj7 → iiim7 → iim7 → Imaj7','短い下降を繰り返す落ち着いた進行。','BGM・作業用','★★','全て9th化','IをVI7へ','順次下降','Lo-fi,チル'],
  ['R&Bペダル',[[1,'maj9'],[4,'maj9'],[2,'m9'],[5,'13']],'Imaj9 → IVmaj9 → iim9 → V13','高音を固定してコードだけ動かせる。','Aメロ・ブリッジ','★★★★','♯11を加える','Vを♭II13へ','ペダル音維持','R&B,上級'],
  ['クロマチック接続',[[3,'m7'],[4,'dim7'],[4,'maj7'],[5,'9']],'iiim7 → ♯IVdim7 → IVmaj7 → V9','ディミニッシュで半音接続する。','間奏・イントロ','★★★★','IVmaj9→V13','dim7をIII7へ','半音進行','クロマチック,ジャズ'],
  ['13thファンク',[[1,'9'],[4,'13'],[1,'9'],[5,'13']],'I9 → IV13 → I9 → V13','短く刻むファンク向け。','間奏・グルーヴ','★★★','♯9やsus4を混ぜる','V13を♭VII9へ','ルート中心','ファンク,16ビート'],
  ['エレピ終止',[[4,'maj9'],[4,'minor'],[1,'maj9']],'IVmaj9 → ivm9 → Imaj9','エレピに合う柔らかく切ない終止。','アウトロ','★★★','最後をI6/9へ','ivmを♭VII13へ','半音内声','エレピ,終止']
 ]
};

const detailDefaults={mood:'バランスのよい響き',scene:'作曲全般',difficulty:'★★',tension:'7th・9th化で色付け',substitute:'近い機能のコードへ置換',bass:'ルート中心',tags:'定番'};
Object.entries(extraProgressions).forEach(([category,items])=>{
 items.forEach(([name,degrees,roman,description,scene,difficulty,tension,substitute,bass,tags])=>progressionCategories[category].items.push({name,degrees,roman,description,tip:scene,mood:description,scene,difficulty,tension,substitute,bass,tags}));
});

Object.values(progressionCategories).forEach(category=>category.items.forEach(item=>Object.assign(item,{...detailDefaults,...item})));

const guide=document.querySelector('.progression-guide');
const tagBar=document.createElement('div');
tagBar.className='progression-tag-bar';
tagBar.innerHTML=['すべて','初心者','サビ','切ない','おしゃれ','終止','疾走','ジャズ'].map((tag,index)=>`<button type="button" class="progression-tag ${index===0?'active':''}" data-tag="${tag}">${tag}</button>`).join('');
guide.insertBefore(tagBar,document.querySelector('#progressionCards'));
let activeTag='すべて';

cardHtml=function(item,chords){
 const sequence=chords.map((chord,index)=>`${index?'<span class="sequence-arrow">→</span>':''}<button type="button" class="progression-chord" data-root="${chord.root}" data-type="${chord.type}">${chord.name}</button>`).join('');
 const tags=String(item.tags).split(',').map(tag=>`<span class="progression-item-tag">${tag}</span>`).join('');
 return `<article class="progression-card"><div class="progression-card-top"><div><h3>${item.name}</h3><p class="roman">${item.roman}</p></div><span class="difficulty">${item.difficulty}</span></div><p class="description">${item.description}</p><div class="chord-sequence">${sequence}</div><div class="progression-details"><p><strong>雰囲気</strong>${item.mood}</p><p><strong>使用場面</strong>${item.scene}</p><p><strong>テンション例</strong>${item.tension}</p><p><strong>代理コード例</strong>${item.substitute}</p><p><strong>ベース</strong>${item.bass}</p></div><div class="progression-item-tags">${tags}</div></article>`;
};

renderCards=function(){
 const category=progressionCategories[activeCategory],query=normalized(searchInput.value);
 title.textContent=category.label;description.textContent=category.description;
 const visible=category.items.filter(item=>{
  const text=normalized(`${item.name}${item.roman}${item.description}${item.tip}${item.mood}${item.scene}${item.tags}`);
  const queryMatch=!query||text.includes(query);
  const tagMatch=activeTag==='すべて'||text.includes(normalized(activeTag));
  return queryMatch&&tagMatch;
 });
 count.textContent=`${visible.length}進行を表示中（全${category.items.length}進行）`;
 if(!visible.length){cards.innerHTML='<p class="no-progressions">一致する進行がなかったよ。</p>';renderTabs();return;}
 cards.innerHTML=visible.map(item=>cardHtml(item,item.custom?customChords(item,keySelect.value):item.degrees.map(d=>chordFromDegree(keySelect.value,d)))).join('');
 renderTabs();
};

tagBar.addEventListener('click',event=>{const button=event.target.closest('[data-tag]');if(!button)return;activeTag=button.dataset.tag;tagBar.querySelectorAll('.progression-tag').forEach(item=>item.classList.toggle('active',item===button));renderCards();});
renderCards();