const theoryCategories={
 basics:{label:'基礎',description:'まず知っておきたい音程・度数・コードの基本。',items:[
  {title:'音名と半音・全音',keywords:'音名 半音 全音 クロマチック',body:'ギターでは1フレット進むと半音、2フレット進むと全音上がる。12フレットで同じ音名の1オクターブ上になる。',simple:'フレットを1つ進むと少し高くなり、12個進むと同じ名前の高い音になる。',example:'C → C# は半音、C → D は全音',points:['#は半音上、♭は半音下を表す','E-FとB-Cの間は最初から半音','同じ高さでも呼び方が変わることがある']},
  {title:'度数の数え方',keywords:'度数 ルート 1度 3度 5度',body:'ルート音を1度として、何番目の音かを表す方法。コード名はこの度数の組み合わせで決まる。',simple:'基準の音から何個目の音かを数字で呼ぶルール。',example:'Cから数えると C=1度、E=3度、G=5度',points:['長3度は4半音','短3度は3半音','完全5度は7半音']},
  {title:'コードはどう作る？',keywords:'コード 作り方 三和音 トライアド',body:'基本コードはスケールの音を1音おきに重ねて作る。1度・3度・5度の3音が三和音の基本。',simple:'音階から1つ飛ばしで3音選ぶと、基本のコードになる。',example:'Cメジャー = C・E・G / Cm = C・E♭・G',points:['3度が長いとメジャー、短いとマイナー','5度を下げるとdim系、上げるとaug系','並び順が変わると転回形になる']},
  {title:'平行調と同主調',keywords:'平行調 同主調 relative parallel',body:'平行調は使う音が同じ長調と短調、同主調は中心音が同じ長調と短調の関係。',simple:'同じ材料を使う長調と短調、または同じ中心音を持つ長調と短調のこと。',example:'CメジャーとAマイナーは平行調 / CメジャーとCマイナーは同主調',points:['平行調は調号が同じ','同主調は主音が同じ','借用和音は同主調から借りることが多い']},
  {title:'転調とは',keywords:'転調 key change modulation',body:'曲の途中で中心となるキーを別のキーへ移すこと。半音上げ、属調、平行調への転調などがある。',simple:'曲の途中で「帰る場所」を別の音に変えること。',example:'CメジャーからDメジャーへ転調',points:['ラスサビで半音上げると高揚感が出る','共通コードを使うと自然に移れる','急な転調は強い驚きを作れる']}
 ]},
 chords:{label:'コード構成',description:'セブンス、テンション、sus、オンコード、ボイシングの仕組み。',items:[
  {title:'メジャー・マイナー・dim・aug',keywords:'メジャー マイナー dim aug',body:'三和音は3度と5度の違いで性格が決まる。',simple:'3番目と5番目の音を少し変えるだけで、明るさや不安定さが変わる。',example:'C = 1・3・5 / Cm = 1・♭3・5 / Cdim = 1・♭3・♭5 / Caug = 1・3・♯5',points:['メジャーは明るく安定','マイナーは暗く切ない','dimは強い不安定感','augは浮遊感']},
  {title:'7thコードの違い',keywords:'7th maj7 m7 セブンス',body:'三和音に7度の音を足したもの。7とmaj7では7度の高さが違うため役割も響きも変わる。',simple:'基本コードにもう1音足して、色気や進みたさを加えたコード。',example:'C7 = C・E・G・B♭ / Cmaj7 = C・E・G・B',points:['7は次へ進みたがる','maj7は透明で都会的','m7は柔らかい']},
  {title:'テンションとは',keywords:'テンション 9 11 13 add9',body:'7thコードの上に9度・11度・13度を加えた音。コードの機能を残しながら色や広がりを加える。',simple:'コードに飾りの音を足して、響きをおしゃれにすること。',example:'Cmaj9 = C・E・G・B・D',points:['9度は2度の上','11度は4度の上','13度は6度の上','ギターでは一部の音を省略する']},
  {title:'sus・add・omitの違い',keywords:'sus add omit no3 no5',body:'susは3度を別の音に置き換える。addは三和音を残して音を追加する。omitやnoは指定音を省略する。',simple:'susは入れ替え、addは足し算、omitは引き算。',example:'Csus4 / Cadd9 / C(no3)',points:['sus2は3度を2度へ置換','sus4は3度を4度へ置換','add9には3度が残る']},
  {title:'オンコードと転回形',keywords:'オンコード スラッシュコード 転回形 ベース',body:'C/Eのようにスラッシュの右側で最低音を指定する。',simple:'同じコードでも、いちばん低い音だけ変えて流れをなめらかにする方法。',example:'C/E = CコードでベースがE',points:['ベースラインを滑らかにできる','上昇・下降感を作れる','右側の音が最低音になる'],link:'index.html',linkLabel:'オンコードを辞典で見る'},
  {title:'クローズとオープンボイシング',keywords:'クローズ オープン ボイシング',body:'構成音を狭い音域にまとめるのがクローズ、音の間隔を広げるのがオープンボイシング。',simple:'音をぎゅっと集めるか、広く散らすかの違い。',example:'C-E-Gを近く並べる / C-G-Eのように広げる',points:['クローズは密度が高い','オープンは広がりが出る','ギターでは自然にオープンになりやすい']},
  {title:'ドロップ2・ドロップ3',keywords:'ドロップ2 ドロップ3 ボイシング',body:'上から2番目または3番目の音を1オクターブ下げて、弾きやすく広い響きにする方法。',simple:'コードの中の1音を下へ移して、手に収まりやすくする並べ方。',example:'4声のクローズボイシングから2番目の音を下げる',points:['ジャズギターでよく使う','弦移動が自然になる','トップノートを保ちやすい']},
  {title:'ガイドトーン',keywords:'ガイドトーン 3rd 7th',body:'コードの性格を最も強く表す3度と7度の音。特にジャズではこの2音を重視する。',simple:'そのコードらしさを決める、いちばん大事な2音。',example:'G7ならBとF',points:['3度で長調・短調が決まる','7度でmaj7か7かが決まる','省略ボイシングでも残したい']},
  {title:'アッパーストラクチャー',keywords:'アッパーストラクチャー upper structure triad',body:'基本コードの上に別の三和音を重ね、テンションをまとめて作る考え方。',simple:'土台のコードの上に、別の小さなコードを重ねる方法。',example:'C7の上にDメジャーを重ねて9・♯11・13を作る',points:['複雑なテンションを整理できる','ピアノやアレンジで便利','メロディとの衝突確認が必要']}
 ]},
 harmony:{label:'進行理論',description:'キー、ダイアトニック、終止、動きの仕組み。',items:[
  {title:'キーとスケール',keywords:'キー スケール 調 主音',body:'キーは曲の中心となる音とスケールを示す。',simple:'曲が最終的に帰りたくなる音と、使いやすい音のセット。',example:'Cメジャー：C D E F G A B',points:['Iが最も安定','キーが変わるとコード名も変わる','ローマ数字なら全キー共通']},
  {title:'ダイアトニックコード',keywords:'ダイアトニック I ii iii IV V vi vii',body:'1つのスケール内の音だけで作ったコード群。',simple:'そのキーの音だけで作れる、仲間のコードたち。',example:'Cキー：C・Dm・Em・F・G・Am・Bm7♭5',points:['I・IV・Vはメジャー','ii・iii・viはマイナー','まずこの中から組むとまとまりやすい'],link:'progressions.html',linkLabel:'コード進行集を見る'},
  {title:'トニック・サブドミナント・ドミナント',keywords:'トニック サブドミナント ドミナント 機能和声',body:'コードの役割を安定・展開・緊張の3つに分ける方法。',simple:'落ち着く、広がる、戻りたくなるの3役。',example:'Cキー：C / F / G',points:['Tは落ち着く','Sは場面を広げる','Dは解決を求める']},
  {title:'終止形の種類',keywords:'終止 完全終止 変格終止 半終止 偽終止',body:'フレーズや曲の区切りを作るコードの着地方法。',simple:'曲をどう終わらせるかのパターン。',example:'V→I / IV→I / V→vi',points:['V→Iは強い解決','IV→Iは柔らかい','V→viは意外性がある'],link:'usage.html',linkLabel:'使い方表を見る'},
  {title:'ドミナントモーション',keywords:'ドミナントモーション 5度進行',body:'ルートが完全5度下へ進む動き。強い解決感を作る。',simple:'強く次のコードへ引っぱる、王道の進み方。',example:'G7→C / E7→Am',points:['V→Iが代表','セカンダリードミナントにも使う','連続させると循環感が出る']},
  {title:'クリシェ',keywords:'クリシェ line cliche 半音進行',body:'同じコード機能を保ちながら、コード内の1音だけを半音ずつ動かす手法。',simple:'コードはほぼ同じまま、1音だけ少しずつ動かす。',example:'Am→Am(maj7)→Am7→Am6',points:['切なさを作りやすい','ベースや内声で使える','バラードと相性が良い']},
  {title:'ペダルポイント',keywords:'ペダルポイント 持続音 pedal',body:'1つの音を長く保ったまま、その上でコードを変える方法。',simple:'同じ低音や高音を鳴らし続けながら、周りのコードだけ変える。',example:'ベースCを保ちながら C→F/C→G/C',points:['緊張と統一感を同時に作れる','イントロや映画音楽に向く','ルート以外でも使える']},
  {title:'経過和音',keywords:'経過和音 passing chord',body:'主要コード同士を滑らかにつなぐため、間に置く短いコード。',simple:'目的地まで自然につなぐ、途中の橋みたいなコード。',example:'C→C#dim→Dm',points:['半音進行と相性が良い','dimがよく使われる','長く鳴らしすぎないことが多い']},
  {title:'偽終止と代理終止',keywords:'偽終止 代理終止 deceptive cadence',body:'予想されるIではなくviなどへ進み、終わりを先延ばしにする終止。',simple:'終わると思わせて、別のコードへ逃げる終わり方。',example:'G→Am',points:['切なさや驚きを作る','サビ後半で使いやすい','その後Iへ戻すと効果的']}
 ]},
 advanced:{label:'応用',description:'借用和音、代理、モード、リハーモナイズなど。',items:[
  {title:'セカンダリードミナント',keywords:'セカンダリー ドミナント V of V 二次ドミナント',body:'一時的に別のコードをトニックのように見立て、その直前に専用のV7を置く方法。',simple:'行きたいコードの直前に、そのコード専用の「強く引っぱるコード」を置く。',example:'Cキーで D7→G7→C',points:['解決先を強調できる','ダイアトニック外の音が自然に入る','5度下行が基本']},
  {title:'モーダルインターチェンジ・借用和音',keywords:'モーダルインターチェンジ 借用和音 サブドミナントマイナー',body:'同じ主音を持つ別モードや短調からコードを借りる方法。',simple:'同じ中心音を持つ別の音階から、雰囲気の違うコードを借りる。',example:'Cメジャーで Fm→C',points:['iv、♭VI、♭VIIが定番','切なさや意外性を加える','使いすぎるとキー感が弱くなる']},
  {title:'トライトーン・サブ／裏コード',keywords:'トライトーン サブ 裏コード substitution',body:'ドミナント7thを、3度と7度を共有する半音上の別コードへ置き換える方法。',simple:'行き先は同じまま、ベースだけ半音違うドミナントへ入れ替える。',example:'G7→C を D♭7→C に置換',points:['ベースが半音で解決する','ジャズらしい響き','3度と7度が入れ替わる']},
  {title:'代理コード',keywords:'代理コード substitution',body:'役割や構成音が似た別コードへ置き換える考え方。',simple:'似た仕事をする別コードに交代してもらう。',example:'Cの代わりにAmやEm',points:['共通音が多いと置換しやすい','iiiとviはIの代理になりやすい','iiはIVの代理になりやすい']},
  {title:'ボイスリーディング',keywords:'ボイスリーディング 声部進行 共通音',body:'各コードの音をなるべく近い音へ動かして、つながりを滑らかにする考え方。',simple:'コードが変わる時、各音をできるだけ少しだけ動かす。',example:'Cmaj7→Am7では多くの音が共通',points:['共通音は残す','半音・全音の移動を優先','トップノートも意識する']},
  {title:'モード理論',keywords:'モード イオニアン ドリアン フリジアン リディアン ミクソリディアン',body:'同じ音の並びでも、中心音を変えることで別の雰囲気を作る考え方。',simple:'同じ音セットでも、どの音を主役にするかで雰囲気が変わる。',example:'Cメジャーの音をD中心で使うとDドリアン',points:['リディアンは明るく浮遊','ミクソリディアンはロック向き','ドリアンは都会的なマイナー']},
  {title:'コードスケール理論',keywords:'コードスケール chord scale',body:'各コードに対して、メロディやアドリブで使いやすいスケールを対応させる考え方。',simple:'今鳴っているコードに合う音階を選ぶルール。',example:'Dm7→Dドリアン / G7→Gミクソリディアン',points:['コードトーンを軸にする','進行全体のキーも見る','1コード1スケールに縛られすぎない']},
  {title:'アボイドノート',keywords:'アボイドノート avoid note',body:'コードの上で長く伸ばすと強くぶつかりやすい音。経過音としては使える。',simple:'一瞬なら平気だけど、長く鳴らすと濁りやすい音。',example:'Cmaj7上のF',points:['完全に禁止ではない','短く通過させれば使える','コードボイシングとの位置関係が重要']},
  {title:'リハーモナイズ',keywords:'リハーモナイズ reharmonization',body:'同じメロディに別のコードを付け直して、雰囲気や流れを変えること。',simple:'メロディはそのままで、伴奏コードだけ作り直す。',example:'C→Am→F→G を Cmaj7→A7→Dm7→G7 に変更',points:['メロディ音を含むコードを選ぶ','代理コードや借用和音を使う','ベースラインも確認する']},
  {title:'ピボットコード転調',keywords:'ピボットコード 転調 common chord',body:'転調前後の両方のキーに含まれる共通コードを橋として使う方法。',simple:'今のキーと次のキー、両方に入っているコードを橋にする。',example:'CメジャーのAmをGメジャーのiiとして使う',points:['自然な転調になる','共通コードの役割を読み替える','クラシックやポップスで使える']},
  {title:'ディミニッシュの使い方',keywords:'dim ディミニッシュ 経過和音',body:'半音上または下のコードへ進むための経過和音や、ドミナントの代理として使う。',simple:'次のコードへ半音で近づくための、強く不安定な橋。',example:'C→C#dim→Dm',points:['3半音ごとに同じ構成音になる','経過和音に便利','長く鳴らすより短く使うことが多い']},
  {title:'オーギュメントの使い方',keywords:'aug オーギュメント 増三和音',body:'5度を半音上げた浮遊感のあるコード。次のコードへ半音上昇する声部を作りやすい。',simple:'1音を半音上げて、上へ進みたくなる感じを作るコード。',example:'C→Caug→Am/C',points:['3度ごとに対称','経過的に使いやすい','メロディとの衝突に注意']},
  {title:'ブルース進行の理論',keywords:'ブルース 12小節 blues',body:'I7・IV7・V7を中心に12小節で循環する形式。メジャーとマイナーの響きが混ざる。',simple:'3つの7thコードを中心に、12小節で一周する定番パターン。',example:'C7｜F7｜C7｜C7｜F7｜F7｜C7｜C7｜G7｜F7｜C7｜G7',points:['ブルーノートを使う','シャッフルと相性が良い','ターンアラウンドで次へ戻る']}
 ]}
};

const search=document.querySelector('#theorySearch');
const tabs=document.querySelector('#theoryTabs');
const cards=document.querySelector('#theoryCards');
const title=document.querySelector('#theoryTitle');
const description=document.querySelector('#theoryDescription');
const count=document.querySelector('#theoryCount');
let activeCategory='basics';

function normalize(text){return text.toLowerCase().replaceAll('♭','b').replaceAll('♯','#').replace(/\s+/g,'');}
function renderTabs(){tabs.innerHTML=Object.entries(theoryCategories).map(([key,item])=>`<button type="button" class="theory-tab ${key===activeCategory?'active':''}" data-category="${key}">${item.label}</button>`).join('');}
function renderCards(){
 const category=theoryCategories[activeCategory];
 const query=normalize(search.value);
 const visible=category.items.filter(item=>!query||normalize(`${item.title}${item.keywords}${item.body}${item.simple}${item.example}${item.points.join('')}`).includes(query));
 title.textContent=category.label;
 description.textContent=category.description;
 count.textContent=query?`${visible.length}項目が一致`:`${category.items.length}項目`;
 cards.innerHTML=visible.length?visible.map((item,index)=>`<details class="theory-card"><summary>${item.title}</summary><div class="theory-content"><p class="theory-main-text">${item.body}</p><button type="button" class="simple-toggle" data-simple-id="${index}" aria-pressed="false">やさしい言葉で見る</button><p class="simple-explanation" hidden><strong>かんたんに言うと：</strong>${item.simple}</p><div class="theory-example">例：${item.example}</div><ul class="theory-points">${item.points.map(point=>`<li>${point}</li>`).join('')}</ul>${item.link?`<a class="theory-link" href="${item.link}">${item.linkLabel}</a>`:''}</div></details>`).join(''):'<p class="no-theory">一致する理論項目がなかったよ。</p>';
 renderTabs();
}
tabs.addEventListener('click',event=>{const button=event.target.closest('[data-category]');if(!button)return;activeCategory=button.dataset.category;renderCards();});
search.addEventListener('input',renderCards);
cards.addEventListener('click',event=>{
 const button=event.target.closest('.simple-toggle');
 if(!button)return;
 const simple=button.nextElementSibling;
 const showing=!simple.hidden;
 simple.hidden=showing;
 button.setAttribute('aria-pressed',String(!showing));
 button.textContent=showing?'やさしい言葉で見る':'通常の説明に戻す';
});
renderCards();