const roots=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const suffixes={
 major:'',minor:'m',sus2:'sus2',sus4:'sus4',add9:'add9',maj7:'maj7',maj9:'maj9','69':'6/9',
 '7':'7',dim:'dim',dim7:'dim7',m7b5:'m7♭5',aug:'aug','9':'9',m9:'m9','11':'11',m11:'m11','13':'13','13sus4':'13sus4',
 '6':'6',maj13:'maj13','7b9':'7♭9','7s9':'7♯9','7b13':'7♭13','7s11':'7♯11','7b9b13':'7(♭9,♭13)','7s5s9':'7(♯5,♯9)'
};

const usageGuideData={
 intro:{label:'曲の最初',description:'イントロや歌い出しで雰囲気を作りやすいコード。',types:['major','sus2','add9','maj7','maj9','69'],roles:['安定した始まり','透明感のある導入','広がりのある導入','都会的な始まり','柔らかな余韻','明るく洗練された開始'],next:['major / minor','major','major / maj7','6 / maj9','maj7 / 6/9','maj7']},
 connect:{label:'展開・つなぎ',description:'次のコードへ自然につなげたり、流れを作るコード。',types:['7','sus4','dim','dim7','m7b5','aug'],roles:['次へ進みたくなる力','解決前のタメ','半音進行の橋渡し','強い経過感','マイナー進行の橋渡し','半音上や下への接続'],next:['4度上のコード','major / minor','半音上・半音下','半音上','m / 7','major / minor']},
 lift:{label:'盛り上げ',description:'サビ前・サビ・間奏で音の厚みや高揚感を出しやすいコード。',types:['9','m9','11','m11','13','13sus4'],roles:['ファンキーな高揚感','深く広がるマイナー感','厚い広がり','浮遊感ある厚み','華やかなピーク','ゴスペル風の盛り上がり'],next:['7 / major','m7 / major','7 / sus4','m7 / 13','major / minor','13 / major']},
 ending:{label:'終止',description:'曲の終わりや一区切りで、落ち着きや余韻を作るコード。',types:['major','6','maj7','69','maj9','maj13'],roles:['はっきり終わる','軽やかに終わる','余韻を残す','ジャズ・ボサノバ風','透明感を残す','豪華に締める'],next:['終止','終止','終止 / major','終止','終止 / maj7','終止']},
 tension:{label:'緊張→解決',description:'強い不安定感を作って、次のコードを印象的に聞かせるコード。',types:['7b9','7s9','7b13','7s11','7b9b13','7s5s9'],roles:['マイナーへ強く解決','荒々しいブルース感','暗い緊張感','現代的な鋭さ','最も濃いマイナー解決','強烈なオルタード感'],next:['minor','minor / major','minor','major / minor','minor','minor']}
};

const usageRoot=document.querySelector('#usageRoot');
const usageTabs=document.querySelector('#usageTabs');
const usageTitle=document.querySelector('#usageTitle');
const usageDescription=document.querySelector('#usageDescription');
const usageTableBody=document.querySelector('#usageTableBody');
let activeUsage='intro';

function chordName(type){return `${usageRoot.value}${suffixes[type] ?? type}`;}
function renderTabs(){
 usageTabs.innerHTML=Object.entries(usageGuideData).map(([key,item])=>`<button type="button" class="usage-tab ${key===activeUsage?'active':''}" data-usage="${key}">${item.label}</button>`).join('');
}
function renderTable(){
 const item=usageGuideData[activeUsage];
 usageTitle.textContent=item.label;
 usageDescription.textContent=item.description;
 usageTableBody.innerHTML=item.types.map((type,index)=>{
  const href=`index.html?root=${encodeURIComponent(usageRoot.value)}&type=${encodeURIComponent(type)}&from=usage`;
  return `<tr><td><a class="usage-chord" href="${href}">${chordName(type)}</a></td><td>${item.roles[index]}</td><td>${item.next[index]}</td></tr>`;
 }).join('');
 renderTabs();
}
usageTabs.addEventListener('click',event=>{
 const button=event.target.closest('[data-usage]');
 if(!button)return;
 activeUsage=button.dataset.usage;
 renderTable();
});
usageRoot.addEventListener('change',renderTable);
renderTable();
