const theoryCategories={
 basics:{label:'基礎',description:'まず知っておきたい音程・度数・コードの基本。',items:[
  {title:'音名と半音・全音',keywords:'音名 半音 全音 クロマチック',body:'ギターでは1フレット進むと半音、2フレット進むと全音上がる。12フレットで同じ音名の1オクターブ上になる。',example:'C → C# は半音、C → D は全音',points:['#は半音上、♭は半音下を表す','E-FとB-Cの間は最初から半音','同じ高さでもC#とD♭のように呼び方が変わることがある']},
  {title:'度数の数え方',keywords:'度数 ルート 1度 3度 5度',body:'ルート音を1度として、何番目の音かを表す方法。コード名はこの度数の組み合わせで決まる。',example:'Cから数えると C=1度、E=3度、G=5度',points:['長3度はルートから4半音','短3度はルートから3半音','完全5度はルートから7半音']},
  {title:'コードはどう作る？',keywords:'コード 作り方 三和音 トライアド',body:'基本コードはスケールの音を1音おきに重ねて作る。1度・3度・5度の3音が三和音の基本。',example:'Cメジャー = C・E・G / Cm = C・E♭・G',points:['3度が長いとメジャー、短いとマイナー','5度を下げるとdim系、上げるとaug系','同じ構成音でも並び順が変わると転回形になる']}
 ]},
 chords:{label:'コード構成',description:'セブンス、テンション、sus、オンコードの仕組み。',items:[
  {title:'メジャー・マイナー・dim・aug',keywords:'メジャー マイナー dim aug',body:'三和音は3度と5度の違いで性格が決まる。まずこの4種類を覚えると複雑なコードも理解しやすい。',example:'C = 1・3・5 / Cm = 1・♭3・5 / Cdim = 1・♭3・♭5 / Caug = 1・3・♯5',points:['メジャーは明るく安定','マイナーは暗く切ない','dimは強い不安定感','augは浮遊感と上昇感']},
  {title:'7thコードの違い',keywords:'7th maj7 m7 セブンス',body:'三和音に7度の音を足したもの。7とmaj7では7度の高さが違うため、役割も響きも大きく変わる。',example:'C7 = C・E・G・B♭ / Cmaj7 = C・E・G・B / Cm7 = C・E♭・G・B♭',points:['7は次へ進みたがるドミナント感','maj7は透明で都会的','m7は柔らかいマイナー感','m7♭5はマイナーキーのiiでよく使う']},
  {title:'テンションとは',keywords:'テンション 9 11 13 add9',body:'7thコードの上に9度・11度・13度を加えた音。コードの機能を残しながら色や広がりを加える。',example:'Cmaj9 = C・E・G・B・D / C13 = C・E・G・B♭・D・A',points:['9度は2度の1オクターブ上','11度は4度の1オクターブ上','13度は6度の1オクターブ上','ギターでは5度などを省略することが多い']},
  {title:'sus・add・omitの違い',keywords:'sus add omit no3 no5',body:'susは3度を別の音に置き換える。addは三和音を残して音を追加する。omitやnoは指定音を省略する。',example:'Csus4 = C・F・G / Cadd9 = C・E・G・D / C(no3) = C・G',points:['sus2は3度を2度へ置換','sus4は3度を4度へ置換','add9には3度が残る','no3は長調・短調を曖昧にできる']},
  {title:'オンコードと転回形',keywords:'オンコード スラッシュコード 転回形 ベース',body:'C/Eのようにスラッシュの右側で最低音を指定する。構成音をベースに置けば転回形、構成音以外なら独立したベース音を持つコードになる。',example:'C/E = CコードでベースがE、C/G = ベースがG',points:['ベースラインを滑らかにできる','コード進行に上昇・下降感を作れる','右側の音が必ず最低音になる','左側のコードの機能は基本的に残る'],link:'index.html',linkLabel:'オンコードを辞典で見る'}
 ]},
 harmony:{label:'進行理論',description:'キー、ダイアトニック、終止とコードの役割。',items:[
  {title:'キーとスケール',keywords:'キー スケール 調 主音',body:'キーは曲の中心となる音とスケールを示す。CメジャーキーならCメジャースケールの音が基本材料になる。',example:'Cメジャー：C D E F G A B',points:['Iが最も安定するトニック','キーが変わると同じ進行でもコード名が変わる','ローマ数字で書くと全キー共通で考えられる']},
  {title:'ダイアトニックコード',keywords:'ダイアトニック I ii iii IV V vi vii',body:'1つのスケール内の音だけで作ったコード群。メジャーキーでは7つの基本コードができる。',example:'Cキー：C・Dm・Em・F・G・Am・Bm7♭5',points:['I・IV・Vはメジャー','ii・iii・viはマイナー','viiはm7♭5','曲作りではまずこの中から組むとまとまりやすい'],link:'progressions.html',linkLabel:'コード進行集を見る'},
  {title:'トニック・サブドミナント・ドミナント',keywords:'トニック サブドミナント ドミナント 機能和声',body:'コードの役割を安定・展開・緊張の3つに分けて考える方法。進行の流れを作る基本になる。',example:'Cキー：トニック C/Am、サブドミナント F/Dm、ドミナント G/Bm7♭5',points:['トニックは落ち着く','サブドミナントは場面を広げる','ドミナントは解決を求める','S→D→Tで自然な終止を作れる']},
  {title:'終止形の種類',keywords:'終止 完全終止 変格終止 半終止 偽終止',body:'フレーズや曲の区切りを作るコードの着地方法。終わり方によって印象が変わる。',example:'完全終止 V→I / 変格終止 IV→I / 偽終止 V→vi',points:['V→Iは最も強い解決','IV→Iは柔らかく穏やか','Vで止める半終止は続きが気になる','V→viは予想を外して切なさを残す'],link:'usage.html',linkLabel:'使い方表を見る'}
 ]},
 advanced:{label:'応用',description:'曲を一段おしゃれにする借用和音や代理コード。',items:[
  {title:'セカンダリードミナント',keywords:'セカンダリー ドミナント V of V 二次ドミナント',body:'一時的に別のコードをトニックのように見立て、その直前に専用のV7を置く方法。進行の推進力が強くなる。',example:'Cキーで D7→G7→C（D7はGに対するV7）',points:['ダイアトニック外の音が自然に入る','解決先のコードを強調できる','V/V、V/iiのように表記する','解決先へ5度下行するのが基本']},
  {title:'モーダルインターチェンジ・借用和音',keywords:'モーダルインターチェンジ 借用和音 サブドミナントマイナー',body:'同じ主音を持つ別モードや短調からコードを借りる方法。明るいキーの中に切なさや意外性を加えられる。',example:'Cメジャーで Fm→C（Cマイナーからivを借用）',points:['iv、♭VI、♭VIIがよく使われる','IV→iv→Iは定番の切ない終止','借りても主音が同じなのでまとまりやすい','使いすぎるとキー感が弱くなる']},
  {title:'代理コード',keywords:'代理コード トライトーンサブ 裏コード',body:'役割や構成音が似た別コードに置き換える考え方。メロディを保ちながらベースや響きを変えられる。',example:'Cキーで G7の代わりにD♭7を使うトライトーン代理',points:['共通音が多いコードは置換しやすい','iiiはIの代理、viもIの代理になりやすい','iiはIVの代理として使える','ドミナント7thはトライトーン代理が可能']},
  {title:'ボイスリーディング',keywords:'ボイスリーディング 声部進行 共通音',body:'各コードの音をなるべく近い音へ動かして、つながりを滑らかにする考え方。押さえ方選びにも直結する。',example:'Cmaj7→Am7では C・E・G が共通し、BだけAへ動く',points:['共通音は残す','各音の移動を半音・全音に抑える','トップノートを意識するとメロディ感が出る','オンコードでベースも滑らかにできる']}
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
 const visible=category.items.filter(item=>!query||normalize(`${item.title}${item.keywords}${item.body}${item.example}${item.points.join('')}`).includes(query));
 title.textContent=category.label;
 description.textContent=category.description;
 count.textContent=query?`${visible.length}項目が一致`:`${category.items.length}項目`;
 cards.innerHTML=visible.length?visible.map(item=>`<details class="theory-card"><summary>${item.title}</summary><div class="theory-content"><p>${item.body}</p><div class="theory-example">例：${item.example}</div><ul class="theory-points">${item.points.map(point=>`<li>${point}</li>`).join('')}</ul>${item.link?`<a class="theory-link" href="${item.link}">${item.linkLabel}</a>`:''}</div></details>`).join(''):'<p class="no-theory">一致する理論項目がなかったよ。</p>';
 renderTabs();
}
tabs.addEventListener('click',event=>{const button=event.target.closest('[data-category]');if(!button)return;activeCategory=button.dataset.category;renderCards();});
search.addEventListener('input',renderCards);
renderCards();