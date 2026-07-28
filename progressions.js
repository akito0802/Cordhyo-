const progressionRoots=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const degreeOffsets=[0,2,4,5,7,9,11];
const typeSuffix={major:'',minor:'m','5':'5','7':'7',maj7:'maj7',m7:'m7','9':'9',maj9:'maj9',m9:'m9',sus2:'sus2',sus4:'sus4',add9:'add9',dim:'dim',dim7:'dim7',m7b5:'m7♭5'};

const progressionCategories={
 pop:{label:'定番ポップス',description:'幅広い曲で使いやすい、覚えておくと便利な進行。',items:[
  {name:'王道進行',degrees:[[4,'major'],[5,'major'],[3,'minor'],[6,'minor']],roman:'IV → V → iii → vi',description:'切なさと前向きさが両立する、日本のポップスで定番の流れ。',tip:'サビや印象的なAメロに使いやすい。'},
  {name:'1564進行',degrees:[[1,'major'],[5,'major'],[6,'minor'],[4,'major']],roman:'I → V → vi → IV',description:'明るさと少しの切なさがある、世界的に使われる定番進行。',tip:'イントロ・Aメロ・サビのどこでも使いやすい。'},
  {name:'6415進行',degrees:[[6,'minor'],[4,'major'],[1,'major'],[5,'major']],roman:'vi → IV → I → V',description:'マイナーから始まり、切なさと開放感を両立する。',tip:'バラードやエモーショナルなサビに合う。'},
  {name:'1456進行',degrees:[[1,'major'],[4,'major'],[5,'major'],[6,'minor']],roman:'I → IV → V → vi',description:'明るく進みながら最後に少し切なく落ち着く。',tip:'AメロからBメロへ向かう場面に使いやすい。'},
  {name:'4156進行',degrees:[[4,'major'],[1,'major'],[5,'major'],[6,'minor']],roman:'IV → I → V → vi',description:'柔らかく始まり、サビらしい広がりを作れる。',tip:'高音メロディと組み合わせると爽やかになる。'},
  {name:'1645進行',degrees:[[1,'major'],[6,'minor'],[4,'major'],[5,'major']],roman:'I → vi → IV → V',description:'昔ながらのポップス感があり、歌を自然に支える。',tip:'最後のVからIへ戻すときれいに循環する。'},
  {name:'2516進行',degrees:[[2,'minor'],[5,'major'],[1,'major'],[6,'minor']],roman:'ii → V → I → vi',description:'ジャズの流れをポップス向けに柔らかくした進行。',tip:'各コードを7thにするとシティポップ寄りになる。'}]},
 ballad:{label:'バラード',description:'切なさ、温かさ、余韻を作りやすい進行。',items:[
  {name:'カノン進行',degrees:[[1,'major'],[5,'major'],[6,'minor'],[3,'minor'],[4,'major'],[1,'major'],[4,'major'],[5,'major']],roman:'I → V → vi → iii → IV → I → IV → V',description:'流れるような美しさがあり、壮大さや感動を作りやすい。',tip:'テンポを落としてアルペジオにするとバラード向き。'},
  {name:'しっとり循環',degrees:[[1,'maj7'],[6,'m7'],[2,'m7'],[5,'7']],roman:'Imaj7 → vim7 → iim7 → V7',description:'柔らかく都会的で、ジャズ寄りのバラードに合う。',tip:'最後のV7からImaj7へ戻すと自然に循環する。'},
  {name:'切ない下降',degrees:[[6,'minor'],[5,'major'],[4,'major'],[3,'minor']],roman:'vi → V → IV → iii',description:'低音が下がる感覚を作りやすく、寂しさや余韻を表現できる。',tip:'サビ後半やエンディング前に使いやすい。'},
  {name:'温かい終止',degrees:[[4,'maj7'],[5,'7'],[3,'m7'],[6,'m7']],roman:'IVmaj7 → V7 → iiim7 → vim7',description:'王道進行を柔らかい7thコードにした響き。',tip:'ピアノやクリーンギターのアルペジオに合う。'},
  {name:'静かな帰結',degrees:[[2,'m7'],[4,'major'],[1,'maj7'],[1,'major']],roman:'iim7 → IV → Imaj7 → I',description:'少し遠回りしてから主和音へ穏やかに着地する。',tip:'アウトロや歌い終わりの余韻に向く。'},
  {name:'感動の上昇',degrees:[[1,'major'],[3,'minor'],[4,'major'],[5,'major']],roman:'I → iii → IV → V',description:'音域と感情が少しずつ上がっていく印象を作れる。',tip:'ラスサビ前の盛り上げに使いやすい。'}]},
 rock:{label:'ロック',description:'勢い、力強さ、疾走感を出しやすい進行。',items:[
  {name:'ロック定番',degrees:[[1,'major'],[4,'major'],[5,'major'],[4,'major']],roman:'I → IV → V → IV',description:'シンプルで力強く、ギターリフやストレートな歌に合う。',tip:'パワーコードに置き換えるとさらにロックらしくなる。'},
  {name:'疾走進行',degrees:[[6,'minor'],[4,'major'],[1,'major'],[5,'major']],roman:'vi → IV → I → V',description:'切なさと勢いを両立しやすく、速い曲にもよく合う。',tip:'8ビートで刻むとアニソン・ロック感が出る。'},
  {name:'サス解決',degrees:[[1,'sus4'],[1,'major'],[4,'major'],[5,'major']],roman:'Isus4 → I → IV → V',description:'最初にタメを作り、メジャーへ解決する印象的な流れ。',tip:'イントロや曲の区切りに使いやすい。'},
  {name:'パンク進行',degrees:[[1,'5'],[5,'5'],[4,'5'],[5,'5']],roman:'I5 → V5 → IV5 → V5',description:'単純で勢いがあり、速いテンポと相性がいい。',tip:'全部ダウンピッキングにすると攻撃的になる。'},
  {name:'オルタナ進行',degrees:[[6,'minor'],[1,'major'],[4,'major'],[3,'minor']],roman:'vi → I → IV → iii',description:'少し不安定で内省的な空気を作りやすい。',tip:'歪みを抑えたクリーンからサビで開く構成に合う。'},
  {name:'スタジアム進行',degrees:[[4,'major'],[1,'major'],[5,'major'],[6,'minor']],roman:'IV → I → V → vi',description:'大きく開けた響きで、合唱できるサビを作りやすい。',tip:'コードを長く伸ばし、シンコペーションを入れると映える。'}]},
 jazz:{label:'ジャズ・おしゃれ',description:'セブンスやテンションを使った、都会的な進行。',items:[
  {name:'ツーファイブワン',degrees:[[2,'m7'],[5,'7'],[1,'maj7']],roman:'iim7 → V7 → Imaj7',description:'ジャズの基本。緊張から安定へ進む自然な流れ。',tip:'すべてのキーで練習するとコード理解が深まる。'},
  {name:'1625進行',degrees:[[1,'maj7'],[6,'m7'],[2,'m7'],[5,'7']],roman:'Imaj7 → vim7 → iim7 → V7',description:'上品で循環感があり、ジャズやシティポップで使いやすい。',tip:'各コードを9thにするとさらに柔らかくなる。'},
  {name:'バックドア終止',degrees:[],roman:'ivm7 → ♭VII7 → Imaj7',description:'少し意外な方向から主和音へ戻る、おしゃれな終止感。',tip:'サビ終わりやアウトロで使うと印象に残る。',custom:'backdoor'},
  {name:'3625進行',degrees:[[3,'m7'],[6,'7'],[2,'m7'],[5,'7']],roman:'iiim7 → VI7 → iim7 → V7',description:'循環しながら自然に主和音へ向かうジャズ定番。',tip:'最後にImaj7を足すときれいに終止する。'},
  {name:'メジャー2516',degrees:[[2,'m7'],[5,'7'],[1,'maj7'],[6,'m7']],roman:'iim7 → V7 → Imaj7 → vim7',description:'解決したあとにviへ流れ、再び循環しやすい。',tip:'BGMやシティポップのAメロに向く。'},
  {name:'ジャズ終止',degrees:[[4,'maj7'],[4,'minor'],[1,'maj7']],roman:'IVmaj7 → ivm → Imaj7',description:'メジャーから同主短調を借りて、切なく主和音へ戻る。',tip:'曲の最後や印象的な区切りに使いやすい。'},
  {name:'九度循環',degrees:[[1,'maj9'],[6,'m9'],[2,'m9'],[5,'9']],roman:'Imaj9 → vim9 → iim9 → V9',description:'1625を9th中心にして、より柔らかく広げた進行。',tip:'ネオソウルやチル系の伴奏に合う。'}]},
 minor:{label:'マイナー・切ない',description:'暗さ、緊張感、ドラマチックさを作る進行。',items:[
  {name:'マイナー王道',degrees:[[6,'minor'],[4,'major'],[5,'major'],[6,'minor']],roman:'vi → IV → V → vi',description:'暗さの中に前進感があり、ドラマチックな展開を作れる。',tip:'Vを7コードにするとviへの解決感が強くなる。'},
  {name:'小室進行',degrees:[[6,'minor'],[4,'major'],[5,'major'],[1,'major']],roman:'vi → IV → V → I',description:'切ない始まりから明るい主和音へ抜ける、印象的な進行。',tip:'ダンス系・J-POP・サビで使いやすい。'},
  {name:'緊張から解決',degrees:[[2,'m7b5'],[5,'7'],[6,'minor']],roman:'iim7♭5 → V7 → vi',description:'マイナーキーらしい強い緊張と解決を作る。',tip:'V7をV7♭9にするとさらに濃い響きになる。'},
  {name:'悲しい循環',degrees:[[6,'minor'],[3,'minor'],[4,'major'],[5,'major']],roman:'vi → iii → IV → V',description:'内側へ沈みながらも次へ進む力を残す。',tip:'Aメロや静かなサビ前に使いやすい。'},
  {name:'ドラマチック下降',degrees:[[6,'minor'],[5,'major'],[4,'major'],[1,'major']],roman:'vi → V → IV → I',description:'切ない下降から明るい着地へ向かう。',tip:'映画・ゲーム音楽のエンディング感を出しやすい。'},
  {name:'哀愁の上昇',degrees:[[6,'minor'],[2,'minor'],[4,'major'],[5,'major']],roman:'vi → ii → IV → V',description:'暗い始まりから徐々に緊張を高める。',tip:'Bメロやラスサビ前の助走に向く。'}]},
 anime:{label:'アニソン・ボカロ',description:'展開が速く、感情の起伏や疾走感を作りやすい進行。',items:[
  {name:'アニソン王道',degrees:[[4,'major'],[5,'major'],[6,'minor'],[3,'minor']],roman:'IV → V → vi → iii',description:'上昇感と切なさが強く、サビの入りで映える。',tip:'テンポを上げ、コードチェンジを細かくすると疾走感が出る。'},
  {name:'ボカロ疾走',degrees:[[6,'minor'],[4,'major'],[5,'major'],[3,'minor']],roman:'vi → IV → V → iii',description:'暗い始まりから緊張を保ったまま走り続ける。',tip:'16分の刻みやピアノアルペジオと相性がいい。'},
  {name:'劇的サビ',degrees:[[4,'major'],[5,'major'],[1,'major'],[6,'minor']],roman:'IV → V → I → vi',description:'一度明るく解決してから切なさへ戻る劇的な流れ。',tip:'サビ頭や転調後の最初に使いやすい。'},
  {name:'ラスサビ上昇',degrees:[[2,'minor'],[3,'minor'],[4,'major'],[5,'major']],roman:'ii → iii → IV → V',description:'段階的に上がり続け、強い期待感を作る。',tip:'このあとIへ進むと大きく解放できる。'},
  {name:'エモい転回感',degrees:[[3,'minor'],[4,'major'],[1,'major'],[5,'major']],roman:'iii → IV → I → V',description:'不安定な始まりから明るく開ける。',tip:'Aメロ後半やサビ前半に使いやすい。'},
  {name:'青春進行',degrees:[[4,'major'],[1,'major'],[2,'minor'],[5,'major']],roman:'IV → I → ii → V',description:'爽やかさと前進感があり、青春系の楽曲に合う。',tip:'add9やsus2に置き換えると透明感が増す。'}]},
 city:{label:'シティポップ・R&B',description:'maj7、m7、9thを使った滑らかで都会的な進行。',items:[
  {name:'都会の循環',degrees:[[1,'maj7'],[3,'m7'],[6,'m7'],[2,'m7'],[5,'7']],roman:'Imaj7 → iiim7 → vim7 → iim7 → V7',description:'長めに循環しながら自然に主和音へ戻れる。',tip:'テンポ80〜110程度のグルーヴに合わせやすい。'},
  {name:'ネオソウル循環',degrees:[[4,'maj9'],[3,'m7'],[2,'m9'],[5,'9']],roman:'IVmaj9 → iiim7 → iim9 → V9',description:'柔らかいトップノートを保ちやすい進行。',tip:'コードを短く切らず、レイドバックして弾くと雰囲気が出る。'},
  {name:'夜景進行',degrees:[[1,'maj9'],[5,'7'],[6,'m9'],[4,'maj7']],roman:'Imaj9 → V7 → vim9 → IVmaj7',description:'定番進行を9th中心にして夜っぽい質感にしたもの。',tip:'クリーントーンとコーラス系エフェクトに合う。'},
  {name:'R&B下降',degrees:[[6,'m9'],[5,'7'],[4,'maj9'],[3,'m7']],roman:'vim9 → V7 → IVmaj9 → iiim7',description:'滑らかな下降感があり、歌の間を広く取れる。',tip:'ベースラインを半音でつなぐとさらに自然になる。'},
  {name:'ボサノバ終止',degrees:[[2,'m7'],[5,'7'],[1,'maj7'],[6,'m7']],roman:'iim7 → V7 → Imaj7 → vim7',description:'軽やかに解決して、そのまま次の循環へ進める。',tip:'シンコペーションを入れた刻みに向く。'}]}
};

const keySelect=document.querySelector('#progressionKey');
const searchInput=document.querySelector('#progressionSearch');
const tabs=document.querySelector('#progressionTabs');
const cards=document.querySelector('#progressionCards');
const title=document.querySelector('#progressionTitle');
const description=document.querySelector('#progressionDescription');
const count=document.querySelector('#progressionCount');
let activeCategory='pop';

function degreeRoot(key,degree){const base=progressionRoots.indexOf(key);return progressionRoots[(base+degreeOffsets[degree-1])%12];}
function chordFromDegree(key,[degree,type]){const root=degreeRoot(key,degree);return {name:root+(typeSuffix[type]??''),root,type};}
function renderTabs(){tabs.innerHTML=Object.entries(progressionCategories).map(([key,item])=>`<button type="button" class="progression-tab ${key===activeCategory?'active':''}" data-category="${key}">${item.label}</button>`).join('');}
function normalized(text){return text.toLowerCase().replaceAll('♭','b').replaceAll('♯','#').replace(/\s+/g,'');}
function customChords(item,key){
 const tonic=degreeRoot(key,1),four=degreeRoot(key,4);
 if(item.custom==='backdoor'){
  const flatSeven=progressionRoots[(progressionRoots.indexOf(tonic)+10)%12];
  return [{name:`${four}m7`,root:four,type:'m7'},{name:`${flatSeven}7`,root:flatSeven,type:'7'},{name:`${tonic}maj7`,root:tonic,type:'maj7'}];
 }
 return [];
}
function renderCards(){
 const category=progressionCategories[activeCategory],query=normalized(searchInput.value);
 title.textContent=category.label;description.textContent=category.description;
 const visible=category.items.filter(item=>!query||normalized(`${item.name}${item.roman}${item.description}${item.tip}`).includes(query));
 count.textContent=`${visible.length}進行を表示中`;
 if(!visible.length){cards.innerHTML='<p class="no-progressions">一致する進行がなかったよ。</p>';renderTabs();return;}
 cards.innerHTML=visible.map(item=>cardHtml(item,item.custom?customChords(item,keySelect.value):item.degrees.map(d=>chordFromDegree(keySelect.value,d)))).join('');
 renderTabs();
}
function cardHtml(item,chords){
 const sequence=chords.map((chord,index)=>`${index?'<span class="sequence-arrow">→</span>':''}<button type="button" class="progression-chord" data-root="${chord.root}" data-type="${chord.type}">${chord.name}</button>`).join('');
 return `<article class="progression-card"><h3>${item.name}</h3><p class="roman">${item.roman}</p><p class="description">${item.description}</p><div class="chord-sequence">${sequence}</div><p class="progression-tip"><strong>使い方：</strong>${item.tip}</p></article>`;
}

tabs.addEventListener('click',event=>{const button=event.target.closest('[data-category]');if(!button)return;activeCategory=button.dataset.category;renderCards();});
keySelect.addEventListener('change',renderCards);
searchInput.addEventListener('input',renderCards);
cards.addEventListener('click',event=>{const button=event.target.closest('[data-root][data-type]');if(!button)return;location.href=`index.html?root=${encodeURIComponent(button.dataset.root)}&type=${encodeURIComponent(button.dataset.type)}`;});
renderCards();