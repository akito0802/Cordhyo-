(()=>{'use strict';
const levels=[['基礎','音程・度数・コードの土台'],['スケール','音階とモード'],['コード','和音とボイシング'],['作曲','曲作りと展開'],['ギター','指板と実践'],['ジャズ','高度な和声'],['耳コピ','聴いて分析する力']];
const L=[
['音程の種類',0,'2音の距離を長・短・完全・増・減で表す。コードもメロディも音程の積み重ね。','C→Eは長3度、C→E♭は短3度',['半音数と度数名を両方覚える','完全系は1・4・5・8度','長短系は2・3・6・7度']],
['複音程と転回音程',0,'9度以上の音程を複音程と呼ぶ。上下を入れ替えると転回音程になり、度数の合計は9になる。','長3度の転回は短6度',['長↔短、増↔減、完全↔完全','9度は2度の1オクターブ上','テンション理解に直結']],
['三和音の種類',0,'1・3・5度を重ね、3度と5度の変化でメジャー、マイナー、dim、augが決まる。','C / Cm / Cdim / Caug',['3度が明暗を決める','5度が安定感を変える','全キーで同じ公式']],
['四和音の作り方',0,'三和音に7度を加えると7thコードになる。3度と7度が機能を強く示す。','G7=G B D F',['maj7と7の違いは7度','m7とmMaj7も区別','3度と7度はガイドトーン']],
['ローマ数字分析',0,'コードをキー内の度数で表し、移調しても同じ進行として読めるようにする。','C-G-Am-F = I-V-vi-IV',['大文字はメジャー、小文字はマイナー','度数で覚えると全キー共通','分析と作曲に有効']],
['イオニアン',1,'メジャースケールそのもの。安定した明るさを持つ基本モード。','C D E F G A B',['特徴音は4度と7度','Imaj7上で基本','強い機能和声を作れる']],
['ドリアン',1,'ナチュラルマイナーの6度を上げたモード。暗さの中に前向きさがある。','D E F G A B C',['特徴音は長6度','m7上で使いやすい','ファンクやジャズで定番']],
['フリジアン',1,'ナチュラルマイナーの2度を下げたモード。異国的で緊張感が強い。','E F G A B C D',['特徴音は♭2','低音の半音進行が効果的','メタルや民族調に合う']],
['リディアン',1,'メジャースケールの4度を上げたモード。明るく浮遊する。','F G A B C D E',['特徴音は♯4','maj7♯11と相性が良い','映画音楽で多用']],
['ミクソリディアン',1,'メジャースケールの7度を下げたモード。ロックやブルース向き。','G A B C D E F',['特徴音は♭7','7thコードに合う','I-♭VII-IVで使いやすい']],
['コードの機能',2,'トニック・サブドミナント・ドミナントに分け、安定→展開→緊張→解決を設計する。','Cキーで C / F / G',['代理コードも同じ機能を持つ','機能を崩すとモーダルになる','終止感の設計に使う']],
['テンションの選び方',2,'9・11・13を、コード構成音やキーとの衝突を確認して加える。','Cmaj9=C E G B D',['3度との短9度衝突に注意','5度は省略しやすい','メロディ音を最優先']],
['シェルボイシング',2,'ルート・3度・7度を中心にした省略形。少ない音で機能を明確にする。','G7ならG B F',['5度は省略可能','ベースがルートなら3度と7度だけでも成立','バンドで濁りを減らせる']],
['四度堆積和音',2,'3度ではなく4度を重ねる現代的なボイシング。機能感が弱く広がりが出る。','C F B♭',['モーダル曲と相性が良い','同じ形を平行移動できる','トップノートを意識']],
['ネガティブハーモニー',2,'主音と属音の軸を基準に音やコードを鏡映し、別の機能的候補を得る考え方。','CメジャーのGをFmへ対応させる例',['完全な置換規則ではない','メロディとの整合を確認','作曲の発想法として使う']],
['Aメロの役割',3,'物語や世界観を提示し、音域とコードの緊張を抑えてサビの余地を残す。','I-vi-IV-Vなど',['音域を低めにする','反復で覚えやすくする','情報量を詰めすぎない']],
['Bメロの役割',3,'Aメロからサビへ向かう橋。リズム・音域・ハーモニーを変えて期待を高める。','ii-V-iii-viなど',['ベースを上昇させる','ドミナントを強める','フレーズ長を変える']],
['サビの設計',3,'最高音・強拍・主題・コード解決を集め、曲の中心を明確にする。','I-V-vi-IV',['タイトル語を置く','音域を広げる','リズムを単純化すると歌いやすい']],
['転調の種類',3,'共通コード、属和音、半音上げ、直接転調などを使い、中心音を移す。','C→Am→D7→G',['自然さは共通音で作る','驚きは直接転調で作る','新キーのV-Iを示す']],
['リハーモナイズ手順',3,'メロディ音を保持しながら、代理・借用・経過和音で伴奏を付け替える。','C-Am-F-G→Cmaj7-A7-Dm7-G7',['メロディ音を含むコードを探す','ベースラインを滑らかにする','機能を一度に変えすぎない']],
['CAGEDシステム',4,'C・A・G・E・Dの5フォームをつなぎ、同じコードを指板全体で把握する。','Cコードを5ポジションで見る',['ルート位置を先に覚える','コードとスケールを対応','形だけでなく構成音を見る']],
['3NPS',4,'1弦あたり3音でスケールを配置する。運指が規則的で速いラインに向く。','Gメジャーを3音ずつ配置',['ポジション移動が大きい','オルタネイトと相性が良い','CAGEDと併用すると強い']],
['コードトーンソロ',4,'各コードの1・3・5・7度へ着地し、進行感のあるソロを作る。','Dm7→G7→Cmaj7でF→F→E',['3度と7度を狙う','弱拍はスケール音でつなぐ','共通音を残す']],
['ハイブリッドピッキング',4,'ピックと右手指を併用し、離れた弦やコードメロディを滑らかに弾く。','低音をピック、高音を中指',['音量をそろえる','弦飛びに強い','カントリーやファンクに有効']],
['カポと実音',4,'カポ位置とフォームから実際のキーを計算する。フォーム音を半音単位で上げる。','カポ2でCフォーム=実音D',['移調と同じ計算','歌いやすいキー調整に使う','開放弦の響きを保てる']],
['II-V-I',5,'ジャズの基本進行。iiのサブドミナント、Vの緊張、Iの解決を連続させる。','Dm7-G7-Cmaj7',['3度と7度を半音で動かす','全キーで練習する','マイナーII-V-Iも覚える']],
['バックドア進行',5,'ivm7-♭VII7-Iで、通常のV-Iとは違う柔らかい解決を作る。','Fm7-B♭7-Cmaj7',['同主短調から借用','♭VII7の上でリディアン♭7','ソウルやジャズで多い']],
['コルトレーンチェンジ',5,'長3度間隔の3つの調性中心を高速で循環する進行。','Bmaj7-D7-Gmaj7-B♭7-E♭maj7',['各IへV7を置く','ガイドトーンを最優先','ゆっくり分解して練習']],
['リズムチェンジ',5,'I Got Rhythm由来の定型進行。A部のターンアラウンドとB部のドミナント連鎖が特徴。','I-vi-ii-V',['代理コードが豊富','B部はIII7-VI7-II7-V7','ジャズ語法の練習に最適']],
['アッパーストラクチャー',5,'ドミナントなどの上に別の三和音を重ね、テンション群を整理する。','C7上にDメジャー=9 ♯11 13',['下の3度と7度を保つ','上の三和音で色を決める','メロディと衝突確認']],
['キー判定',6,'終止、頻出コード、メロディの着地点、調号を総合して中心音を推測する。','G7→Cが多ければC候補',['最後のコードだけで決めない','借用和音を除外して考える','ベースの解決を見る']],
['ベースからコード判定',6,'最低音を先に拾い、その上の3度・5度・7度を確認してコード名を絞る。','低音G、上にBとFならG7候補',['オンコードに注意','ルート不在もある','3度が長短を決める']],
['テンションの聴き分け',6,'基本コードとの差分を聴き、9thの広がり、11thの浮遊、13thの明るさを判断する。','Cmaj7とCmaj9を比較',['低音より高音へ集中','1音ずつ加えて比較','ボイシングで印象が変わる']],
['進行の耳コピ',6,'まずベース、次にコード品質、最後にテンションという順で段階的に採る。','I-V-vi-IVを度数で記録',['最初は度数でメモ','ループ再生を使う','リズムとコードを分けて聴く']],
['曲全体の理論分析',6,'キー・構成・コード機能・メロディ・リズム・音色を分けて観察し、曲の狙いを説明する。','Aメロは安定、Bメロで属和音、サビで最高音',['事実と解釈を分ける','特徴的な1箇所を深掘る','分析を自作曲へ応用']]
].map((x,i)=>({id:'academy-'+i,title:x[0],level:x[1],body:x[2],example:x[3],points:x[4]}));
const STORE='cordbook-theory-academy-v1';
const state=(()=>{try{return JSON.parse(localStorage.getItem(STORE))||{done:[],fav:[]}}catch{return{done:[],fav:[]}}})();
let active=0,query='',onlyFav=false;
const save=()=>localStorage.setItem(STORE,JSON.stringify(state));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function progress(){const n=state.done.length,p=Math.round(n/L.length*100);document.querySelector('#academyProgressText').textContent=`${n}/${L.length} 完了`;document.querySelector('#academyProgressBar').style.width=p+'%';document.querySelector('#academyLevelText').textContent=`理論Lv.${Math.min(100,Math.max(1,Math.round(p)))}`}
function render(){const box=document.querySelector('#academyGrid');const q=query.toLowerCase();const list=L.filter(x=>x.level===active&&(!q||`${x.title}${x.body}${x.example}${x.points.join('')}`.toLowerCase().includes(q))&&(!onlyFav||state.fav.includes(x.id)));box.innerHTML=list.length?list.map(x=>`<article class="academy-card ${state.done.includes(x.id)?'done':''}"><div class="academy-meta"><span class="academy-tag">Lv.${x.level+1}</span><span class="academy-tag">${levels[x.level][0]}</span></div><h3>${esc(x.title)}</h3><p>${esc(x.body)}</p><div class="academy-example"><b>例：</b>${esc(x.example)}</div><ul class="academy-points">${x.points.map(p=>`<li>${esc(p)}</li>`).join('')}</ul><div class="academy-actions"><button data-done="${x.id}">${state.done.includes(x.id)?'✓ 学習済み':'学習完了'}</button><button class="secondary fav ${state.fav.includes(x.id)?'active':''}" data-fav="${x.id}">★</button></div></article>`).join(''):'<div class="academy-empty">条件に合う教材がないよ。</div>';box.querySelectorAll('[data-done]').forEach(b=>b.onclick=()=>{const id=b.dataset.done,i=state.done.indexOf(id);i>=0?state.done.splice(i,1):state.done.push(id);save();render();progress()});box.querySelectorAll('[data-fav]').forEach(b=>b.onclick=()=>{const id=b.dataset.fav,i=state.fav.indexOf(id);i>=0?state.fav.splice(i,1):state.fav.push(id);save();render()});}
function quiz(){const pool=L.filter(x=>x.level===active),x=pool[Math.floor(Math.random()*pool.length)],wrong=L.filter(y=>y.id!==x.id).sort(()=>Math.random()-.5).slice(0,3),opts=[x,...wrong].sort(()=>Math.random()-.5);document.querySelector('#academyQuiz').innerHTML=`<b>確認テスト：次の説明に当てはまる理論は？</b><p>${esc(x.body)}</p><div class="academy-quiz-options">${opts.map(o=>`<button data-a="${o.id}">${esc(o.title)}</button>`).join('')}</div><p id="academyFeedback"></p>`;document.querySelectorAll('#academyQuiz [data-a]').forEach(b=>b.onclick=()=>{const ok=b.dataset.a===x.id;b.classList.add(ok?'correct':'wrong');document.querySelector('#academyFeedback').textContent=ok?'正解！':'正解は「'+x.title+'」だよ';if(ok&&!state.done.includes(x.id)){state.done.push(x.id);save();progress();render()}})}
function init(){const main=document.querySelector('.theory-page-container');const guide=document.querySelector('.theory-guide');if(!main||!guide||document.querySelector('#theoryAcademy'))return;const s=document.createElement('section');s.id='theoryAcademy';s.className='theory-academy';s.innerHTML=`<div class="academy-head"><div><h2>🎓 音楽理論アカデミー</h2><p>基礎からジャズ・耳コピまで、7段階・35教材で順番に学べるよ。</p></div><div class="academy-progress"><div class="academy-progress-top"><span id="academyLevelText">理論Lv.1</span><span id="academyProgressText">0/${L.length} 完了</span></div><div class="academy-bar"><i id="academyProgressBar"></i></div></div></div><div class="academy-tools"><input id="academySearch" placeholder="教材を検索"><select id="academyFilter"><option value="all">すべて表示</option><option value="fav">お気に入りのみ</option></select><button id="academyQuizBtn">確認テスト</button></div><div id="academyLevels" class="academy-levels">${levels.map((l,i)=>`<button class="academy-level ${i===0?'active':''}" data-level="${i}">Lv.${i+1} ${l[0]}</button>`).join('')}</div><div id="academyGrid" class="academy-grid"></div><div id="academyQuiz" class="academy-quiz"></div>`;main.insertBefore(s,guide);document.querySelectorAll('[data-level]').forEach(b=>b.onclick=()=>{active=Number(b.dataset.level);document.querySelectorAll('.academy-level').forEach(x=>x.classList.toggle('active',x===b));render();quiz()});document.querySelector('#academySearch').oninput=e=>{query=e.target.value;render()};document.querySelector('#academyFilter').onchange=e=>{onlyFav=e.target.value==='fav';render()};document.querySelector('#academyQuizBtn').onclick=quiz;progress();render();quiz()}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();