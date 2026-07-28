const progressionRoots=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const degreeOffsets=[0,2,4,5,7,9,11];
const typeSuffix={major:'',minor:'m','7':'7',maj7:'maj7',m7:'m7',sus4:'sus4',add9:'add9',dim:'dim',m7b5:'m7♭5'};

const progressionCategories={
 pop:{label:'定番ポップス',description:'幅広い曲で使いやすい、覚えておくと便利な進行。',items:[
  {name:'王道進行',degrees:[[4,'major'],[5,'major'],[3,'minor'],[6,'minor']],roman:'IV → V → iii → vi',description:'切なさと前向きさが両立する、日本のポップスで定番の流れ。',tip:'サビや印象的なAメロに使いやすい。'},
  {name:'4536進行',degrees:[[4,'major'],[5,'major'],[3,'minor'],[6,'minor']],roman:'IV → V → iii → vi',description:'王道進行の数字表記。メロディを乗せやすく、感情的な雰囲気を作れる。',tip:'最後をviではなくIにすると明るく着地できる。'},
  {name:'1564進行',degrees:[[1,'major'],[5,'major'],[6,'minor'],[4,'major']],roman:'I → V → vi → IV',description:'明るさと少しの切なさがある、世界的に使われる定番進行。',tip:'イントロ・Aメロ・サビのどこでも使いやすい。'},
  {name:'6415進行',degrees:[[6,'minor'],[4,'major'],[1,'major'],[5,'major']],roman:'vi → IV → I → V',description:'マイナーから始まるため、少し切ない印象を出しやすい。',tip:'バラードやエモーショナルなサビに合う。'}]},
 ballad:{label:'バラード',description:'切なさ、温かさ、余韻を作りやすい進行。',items:[
  {name:'カノン進行',degrees:[[1,'major'],[5,'major'],[6,'minor'],[3,'minor'],[4,'major'],[1,'major'],[4,'major'],[5,'major']],roman:'I → V → vi → iii → IV → I → IV → V',description:'流れるような美しさがあり、壮大さや感動を作りやすい。',tip:'テンポを落としてアルペジオにするとバラード向き。'},
  {name:'しっとり循環',degrees:[[1,'maj7'],[6,'m7'],[2,'m7'],[5,'7']],roman:'Imaj7 → vim7 → iim7 → V7',description:'柔らかく都会的で、ジャズ寄りのバラードに合う。',tip:'最後のV7からImaj7へ戻すと自然に循環する。'},
  {name:'切ない下降',degrees:[[6,'minor'],[5,'major'],[4,'major'],[3,'minor']],roman:'vi → V → IV → iii',description:'低音が下がる感覚を作りやすく、寂しさや余韻を表現できる。',tip:'サビ後半やエンディング前に使いやすい。'}]},
 rock:{label:'ロック',description:'勢い、力強さ、疾走感を出しやすい進行。',items:[
  {name:'ロック定番',degrees:[[1,'major'],[4,'major'],[5,'major'],[4,'major']],roman:'I → IV → V → IV',description:'シンプルで力強く、ギターリフやストレートな歌に合う。',tip:'パワーコードに置き換えるとさらにロックらしくなる。'},
  {name:'疾走進行',degrees:[[6,'minor'],[4,'major'],[1,'major'],[5,'major']],roman:'vi → IV → I → V',description:'切なさと勢いを両立しやすく、速い曲にもよく合う。',tip:'8ビートで刻むとアニソン・ロック感が出る。'},
  {name:'サス解決',degrees:[[1,'sus4'],[1,'major'],[4,'major'],[5,'major']],roman:'Isus4 → I → IV → V',description:'最初にタメを作り、メジャーへ解決する印象的な流れ。',tip:'イントロや曲の区切りに使いやすい。'}]},
 jazz:{label:'ジャズ・おしゃれ',description:'セブンスやテンションを使った、都会的な進行。',items:[
  {name:'ツーファイブワン',degrees:[[2,'m7'],[5,'7'],[1,'maj7']],roman:'iim7 → V7 → Imaj7',description:'ジャズの基本。緊張から安定へ進む自然な流れ。',tip:'すべてのキーで練習するとコード理解が深まる。'},
  {name:'1625進行',degrees:[[1,'maj7'],[6,'m7'],[2,'m7'],[5,'7']],roman:'Imaj7 → vim7 → iim7 → V7',description:'上品で循環感があり、ジャズやシティポップで使いやすい。',tip:'各コードを9thにするとさらに柔らかくなる。'},
  {name:'バックドア風',degrees:[[4,'m7'],[7,'7'],[1,'maj7']],roman:'ivm7 → ♭VII7 → Imaj7',description:'少し意外な方向から主和音へ戻る、おしゃれな終止感。',tip:'この進行は借用和音を含むため、コード名はキーに応じた近似表示。',custom:true}]},
 minor:{label:'マイナー・切ない',description:'暗さ、緊張感、ドラマチックさを作る進行。',items:[
  {name:'マイナー王道',degrees:[[6,'minor'],[4,'major'],[5,'major'],[6,'minor']],roman:'vi → IV → V → vi',description:'暗さの中に前進感があり、ドラマチックな展開を作れる。',tip:'Vを7コードにするとviへの解決感が強くなる。'},
  {name:'小室進行',degrees:[[6,'minor'],[4,'major'],[5,'major'],[1,'major']],roman:'vi → IV → V → I',description:'切ない始まりから明るい主和音へ抜ける、印象的な進行。',tip:'ダンス系・J-POP・サビで使いやすい。'},
  {name:'緊張から解決',degrees:[[2,'m7b5'],[5,'7'],[6,'minor']],roman:'iim7♭5 → V7 → vi',description:'マイナーキーらしい強い緊張と解決を作る。',tip:'V7をV7♭9にするとさらに濃い響きになる。'}]}
};

const keySelect=document.querySelector('#progressionKey');
const searchInput=document.querySelector('#progressionSearch');
const tabs=document.querySelector('#progressionTabs');
const cards=document.querySelector('#progressionCards');
const title=document.querySelector('#progressionTitle');
const description=document.querySelector('#progressionDescription');
const count=document.querySelector('#progressionCount');
let activeCategory='pop';

function degreeRoot(key,degree){
 const base=progressionRoots.indexOf(key);
 return progressionRoots[(base+degreeOffsets[degree-1])%12];
}
function chordFromDegree(key,[degree,type]){
 const root=degreeRoot(key,degree);
 return {name:root+(typeSuffix[type]??''),root,type};
}
function renderTabs(){
 tabs.innerHTML=Object.entries(progressionCategories).map(([key,item])=>`<button type="button" class="progression-tab ${key===activeCategory?'active':''}" data-category="${key}">${item.label}</button>`).join('');
}
function normalized(text){return text.toLowerCase().replaceAll('♭','b').replaceAll('♯','#').replace(/\s+/g,'');}
function renderCards(){
 const category=progressionCategories[activeCategory];
 const query=normalized(searchInput.value);
 title.textContent=category.label;
 description.textContent=category.description;
 const visible=category.items.filter(item=>!query||normalized(`${item.name}${item.roman}${item.description}${item.tip}`).includes(query));
 count.textContent=`${visible.length}進行を表示中`;
 if(!visible.length){cards.innerHTML='<p class="no-progressions">一致する進行がなかったよ。</p>';renderTabs();return;}
 cards.innerHTML=visible.map(item=>{
  if(item.custom){
   const key=keySelect.value,root=degreeRoot(key,1),flatSeven=progressionRoots[(progressionRoots.indexOf(root)+10)%12],four=degreeRoot(key,4);
   const custom=[{name:`${four}m7`,root:four,type:'m7'},{name:`${flatSeven}7`,root:flatSeven,type:'7'},{name:`${root}maj7`,root,type:'maj7'}];
   return cardHtml(item,custom);
  }
  return cardHtml(item,item.degrees.map(d=>chordFromDegree(keySelect.value,d)));
 }).join('');
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