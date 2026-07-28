const rootSelect = document.querySelector('#rootSelect');
const typeSelect = document.querySelector('#typeSelect');
const slashSelect = document.querySelector('#slashSelect');
const selectedChord = document.querySelector('#selectedChord');

const roots = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
let selectedFormIndex = 0;

const typeData = {
  major:{suffix:'',label:'メジャー',intervals:[0,4,7],mood:'明るく安定した響き',use:'ポップスや弾き語りの基本。'},
  minor:{suffix:'m',label:'マイナー',intervals:[0,3,7],mood:'切なく落ち着いた響き',use:'バラードや哀愁のある進行で定番。'},
  '5':{suffix:'5',label:'パワーコード',intervals:[0,7],mood:'太く力強い響き',use:'ロックのリフや歪ませた伴奏で使いやすい。'},
  '6':{suffix:'6',label:'6th',intervals:[0,4,7,9],mood:'明るく少しおしゃれな響き',use:'ポップスやジャズ風の伴奏に使える。'},
  m6:{suffix:'m6',label:'m6',intervals:[0,3,7,9],mood:'切なさの中に温かさがある響き',use:'しっとりしたバラードや締めのコードに合う。'},
  '7':{suffix:'7',label:'7th',intervals:[0,4,7,10],mood:'ブルージーで次へ進みたくなる響き',use:'次のコードへつなぐ定番コード。'},
  maj7:{suffix:'maj7',label:'maj7',intervals:[0,4,7,11],mood:'都会的で柔らかな響き',use:'シティポップやバラードでよく使う。'},
  m7:{suffix:'m7',label:'m7',intervals:[0,3,7,10],mood:'大人っぽく落ち着いた響き',use:'R&B、ジャズ、バラードで活躍。'},
  sus2:{suffix:'sus2',label:'sus2',intervals:[0,2,7],mood:'透明感と浮遊感のある響き',use:'メジャーコードの代わりに爽やかさを出せる。'},
  sus4:{suffix:'sus4',label:'sus4',intervals:[0,5,7],mood:'解決前の緊張感がある響き',use:'メジャーコードとの行き来が定番。'},
  '7sus4':{suffix:'7sus4',label:'7sus4',intervals:[0,5,7,10],mood:'力強く開放感のある緊張した響き',use:'7コードへ戻す装飾として便利。'},
  add9:{suffix:'add9',label:'add9',intervals:[0,4,7,14],mood:'広がりのある爽やかな響き',use:'アコギのアルペジオや弾き語りに合う。'},
  madd9:{suffix:'m(add9)',label:'m(add9)',intervals:[0,3,7,14],mood:'切なく透明感のある響き',use:'バラードや静かなイントロに合う。'},
  m7b5:{suffix:'m7♭5',label:'m7♭5',intervals:[0,3,6,10],mood:'不安定で少し暗い響き',use:'マイナーキーの進行で時々登場する。'},
  dim:{suffix:'dim',label:'dim',intervals:[0,3,6],mood:'緊張感が強い響き',use:'コード同士を滑らかにつなぐ経過コード。'},
  dim7:{suffix:'dim7',label:'dim7',intervals:[0,3,6,9],mood:'ミステリアスで強い緊張感',use:'次のコードへ半音で進むときに便利。'},
  aug:{suffix:'aug',label:'aug',intervals:[0,4,8],mood:'不思議で浮遊する響き',use:'メジャーコードから次へ進む装飾に使える。'}
};

const openShapes = {
  'C:major':['x',3,2,0,1,0], 'D:major':['x','x',0,2,3,2], 'E:major':[0,2,2,1,0,0], 'G:major':[3,2,0,0,0,3], 'A:major':['x',0,2,2,2,0],
  'A:minor':['x',0,2,2,1,0], 'D:minor':['x','x',0,2,3,1], 'E:minor':[0,2,2,0,0,0],
  'E:5':[0,2,2,'x','x','x'], 'A:5':['x',0,2,2,'x','x'], 'D:5':['x','x',0,2,3,'x'],
  'C:6':['x',3,2,2,1,0], 'A:6':['x',0,2,2,2,2], 'E:6':[0,2,2,1,2,0],
  'A:m6':['x',0,2,2,1,2], 'E:m6':[0,2,2,0,2,0],
  'A:7':['x',0,2,0,2,0], 'B:7':['x',2,1,2,0,2], 'C:7':['x',3,2,3,1,0], 'D:7':['x','x',0,2,1,2], 'E:7':[0,2,0,1,0,0], 'G:7':[3,2,0,0,0,1],
  'C:maj7':['x',3,2,0,0,0], 'F:maj7':['x','x',3,2,1,0], 'A:maj7':['x',0,2,1,2,0],
  'A:m7':['x',0,2,0,1,0], 'D:m7':['x','x',0,2,1,1], 'E:m7':[0,2,0,0,0,0],
  'D:sus2':['x','x',0,2,3,0], 'E:sus2':[0,2,4,4,0,0], 'A:sus2':['x',0,2,2,0,0],
  'D:sus4':['x','x',0,2,3,3], 'E:sus4':[0,2,2,2,0,0], 'A:sus4':['x',0,2,2,3,0],
  'A:7sus4':['x',0,2,0,3,0], 'D:7sus4':['x','x',0,2,1,3], 'E:7sus4':[0,2,0,2,0,0],
  'C:add9':['x',3,2,0,3,0], 'D:add9':['x','x',0,2,3,0], 'E:add9':[0,2,4,1,0,0], 'G:add9':[3,2,0,2,0,3], 'A:add9':['x',0,2,4,2,0],
  'A:madd9':['x',0,2,4,1,0], 'E:madd9':[0,2,4,0,0,0],
  'B:dim':['x',2,3,4,3,'x'], 'B:m7b5':['x',2,3,2,3,'x'], 'B:dim7':['x',2,3,1,3,'x'],
  'C:aug':['x',3,2,1,1,'x'], 'E:aug':[0,3,2,1,1,0]
};

const slashChords = {
  'C/E':{root:'C',type:'major',bass:'E',frets:[0,3,2,0,1,0],description:'Cコードの最低音をEにした形。C→C/E→Fの流れでよく使う。'},
  'C/G':{root:'C',type:'major',bass:'G',frets:[3,3,2,0,1,0],description:'Cコードの最低音をGにした形。響きを太くしたいときに便利。'},
  'D/F#':{root:'D',type:'major',bass:'F#',frets:[2,0,0,2,3,2],description:'G→D/F#→Emの下降ベースで超定番。'},
  'D/A':{root:'D',type:'major',bass:'A',frets:['x',0,0,2,3,2],description:'Dコードを安定させるオンコード。アルペジオにも使いやすい。'},
  'Em/G':{root:'E',type:'minor',bass:'G',frets:[3,2,2,0,0,0],description:'Emの暗さを保ちながら、低音をGにした柔らかい形。'},
  'F/A':{root:'F',type:'major',bass:'A',frets:['x',0,3,2,1,1],description:'C→F/A→Gのような滑らかなベース進行で使える。'},
  'G/B':{root:'G',type:'major',bass:'B',frets:['x',2,0,0,0,3],description:'C→G/B→Amの下降ベースで特によく使う。'},
  'G/D':{root:'G',type:'major',bass:'D',frets:['x','x',0,0,0,3],description:'Gコードの低音をDにして、軽くすっきり響かせる形。'},
  'Am/C':{root:'A',type:'minor',bass:'C',frets:['x',3,2,2,1,0],description:'Amの最低音をCにした形。Cとの行き来が自然。'},
  'Am/E':{root:'A',type:'minor',bass:'E',frets:[0,0,2,2,1,0],description:'Amを低音Eで支える形。力強く安定した響きになる。'}
};

const eShapes = {
  major:r=>[r,r+2,r+2,r+1,r,r], minor:r=>[r,r+2,r+2,r,r,r], '5':r=>[r,r+2,r+2,'x','x','x'],
  '6':r=>[r,r+2,r+2,r+1,r+2,r], m6:r=>[r,r+2,r+2,r,r+2,r], '7':r=>[r,r+2,r,r+1,r,r],
  maj7:r=>[r,r+2,r+1,r+1,r,r], m7:r=>[r,r+2,r,r,r,r], sus2:r=>[r,r+2,r+4,r+4,r,r],
  sus4:r=>[r,r+2,r+2,r+2,r,r], '7sus4':r=>[r,r+2,r,r+2,r,r], add9:r=>[r,r+2,r+2,r+1,r,r+2],
  madd9:r=>[r,r+2,r+2,r,r,r+2], m7b5:r=>[r,r+1,r,r,r,r], dim:r=>[r,r+1,r+2,r,r+2,r],
  dim7:r=>[r,r+1,r+2,r,r+2,r+1], aug:r=>[r,r+3,r+2,r+1,r+1,r]
};
const aShapes = {
  major:r=>['x',r,r+2,r+2,r+2,r], minor:r=>['x',r,r+2,r+2,r+1,r], '5':r=>['x',r,r+2,r+2,'x','x'],
  '6':r=>['x',r,r+2,r+2,r+2,r+2], m6:r=>['x',r,r+2,r+2,r+1,r+2], '7':r=>['x',r,r+2,r,r+2,r],
  maj7:r=>['x',r,r+2,r+1,r+2,r], m7:r=>['x',r,r+2,r,r+1,r], sus2:r=>['x',r,r+2,r+2,r,r],
  sus4:r=>['x',r,r+2,r+2,r+3,r], '7sus4':r=>['x',r,r+2,r,r+3,r], add9:r=>['x',r,r+2,r+4,r,r],
  madd9:r=>['x',r,r+2,r+4,r+1,r], m7b5:r=>['x',r,r+1,r,r+1,r], dim:r=>['x',r,r+1,r+2,r+1,'x'],
  dim7:r=>['x',r,r+1,r+2,r+1,r+2], aug:r=>['x',r,r-1,r-2,r-2,'x']
};

function chordName(root,type){return root+typeData[type].suffix;}
function notesFor(root,type){const i=roots.indexOf(root);return [...new Set(typeData[type].intervals.map(n=>roots[(i+n)%12]))].join('・');}
function lowestFret(frets){const nums=frets.filter(v=>typeof v==='number'&&v>0);return nums.length?Math.min(...nums):0;}

function getForms(root,type){
  const rootIndex=roots.indexOf(root);
  const eRoot=(rootIndex-4+12)%12||12;
  const aRoot=(rootIndex-9+12)%12||12;
  const eForm=fret=>({shape:'6弦ルート',frets:eShapes[type](fret),barres:type==='5'?[]:[{fret,start:0,end:5}]});
  const aForm=fret=>({shape:'5弦ルート',frets:aShapes[type](fret),barres:type==='5'?[]:[{fret,start:1,end:5}]});
  const movable=[eForm(eRoot),aForm(aRoot),eRoot<=aRoot?{...eForm(eRoot+12),shape:'6弦ルート・ハイ'}:{...aForm(aRoot+12),shape:'5弦ルート・ハイ'}].sort((a,b)=>lowestFret(a.frets)-lowestFret(b.frets));
  const open=openShapes[`${root}:${type}`];
  const forms=open?[{shape:'オープンコード',frets:open,barres:[]},...movable.slice(0,2)]:movable;
  return forms.map((form,index)=>({...form,label:`フォーム${index+1}`}));
}

function diagram(name,frets,barres=[]){
  const numeric=frets.filter(v=>typeof v==='number'&&v>0);
  const minFret=numeric.length?Math.min(...numeric):1;
  const maxFret=numeric.length?Math.max(...numeric):1;
  const baseFret=minFret>4?minFret:1;
  const fretCount=Math.max(4,maxFret-baseFret+1);
  const x0=42,y0=38,stringWidth=24,boardHeight=150;
  const fretHeight=boardHeight/fretCount;
  let svg=`<svg class="chord-diagram large-diagram" viewBox="0 0 190 210" role="img" aria-label="${name}のコード図">`;
  for(let s=0;s<6;s++)svg+=`<line class="string" x1="${x0+s*stringWidth}" y1="${y0}" x2="${x0+s*stringWidth}" y2="${y0+boardHeight}"/>`;
  for(let f=0;f<=fretCount;f++)svg+=`<line class="${f===0&&baseFret===1?'nut':'fret'}" x1="${x0}" y1="${y0+f*fretHeight}" x2="${x0+5*stringWidth}" y2="${y0+f*fretHeight}"/>`;
  if(baseFret>1)svg+=`<text class="fret-label" x="22" y="${y0+fretHeight*.65}">${baseFret}fr</text>`;
  const covered=new Set();
  barres.forEach(barre=>{const displayFret=barre.fret-baseFret+1;if(displayFret<1||displayFret>fretCount)return;const y=y0+(displayFret-.5)*fretHeight;const x1=x0+barre.start*stringWidth;const x2=x0+barre.end*stringWidth;svg+=`<line class="barre" x1="${x1}" y1="${y}" x2="${x2}" y2="${y}"/>`;for(let s=barre.start;s<=barre.end;s++)if(frets[s]===barre.fret)covered.add(`${s}:${barre.fret}`);});
  frets.forEach((value,string)=>{const x=x0+string*stringWidth;if(value==='x')svg+=`<text class="mute-mark" x="${x}" y="22">×</text>`;else if(value===0)svg+=`<text class="open-mark" x="${x}" y="22">○</text>`;else if(!covered.has(`${string}:${value}`)){const displayFret=value-baseFret+1;const y=y0+(displayFret-.5)*fretHeight;if(displayFret>=1&&displayFret<=fretCount)svg+=`<circle class="dot" cx="${x}" cy="${y}" r="9"/>`;}});
  return svg+'</svg>';
}

function render(){
  const slashValue=slashSelect.value;
  if(slashValue!=='none'){
    const slash=slashChords[slashValue];
    selectedFormIndex=0;
    selectedChord.innerHTML=`<article class="selected-card"><div class="selected-heading"><p class="selected-label">選択中のオンコード</p><h2 class="selected-name">${slashValue}</h2><div class="meta"><span class="badge">オンコード</span><span class="badge">ベース音 ${slash.bass}</span></div></div><div class="selected-content"><div class="diagram-panel"><div class="diagram-wrap">${diagram(slashValue,slash.frets,[])}</div></div><div class="info-list"><div class="info-box"><strong>構成音</strong>${notesFor(slash.root,slash.type)}</div><div class="info-box"><strong>最低音</strong>${slash.bass}</div><div class="info-box"><strong>使い方</strong>${slash.description}</div><div class="info-box"><strong>オンコードとは</strong>「コード名 / ベース音」で表し、いちばん低い音だけを変えたコードだよ。</div></div></div></article>`;
    return;
  }

  const root=rootSelect.value,type=typeSelect.value,data=typeData[type],name=chordName(root,type),forms=getForms(root,type),form=forms[selectedFormIndex]||forms[0],low=lowestFret(form.frets);
  selectedChord.innerHTML=`<article class="selected-card"><div class="selected-heading"><p class="selected-label">選択中のコード</p><h2 class="selected-name">${name}</h2><div class="meta"><span class="badge">${data.label}</span><span class="badge">${form.shape}</span></div></div><div class="form-tabs" role="tablist" aria-label="コードフォーム切替">${forms.map((item,index)=>`<button class="form-tab ${index===selectedFormIndex?'active':''}" data-form="${index}" type="button">${item.label}<small>${item.shape}</small></button>`).join('')}</div><div class="selected-content"><div class="diagram-panel"><div class="diagram-wrap">${diagram(name,form.frets,form.barres)}</div></div><div class="info-list"><div class="info-box"><strong>構成音</strong>${notesFor(root,type)}</div><div class="info-box"><strong>ポジション</strong>${form.shape==='オープンコード'?'オープンポジション':`${low}フレット付近`}</div><div class="info-box"><strong>響き</strong>${data.mood}</div><div class="info-box"><strong>使い方</strong>${data.use}</div></div></div></article>`;
}

rootSelect.addEventListener('change',()=>{slashSelect.value='none';selectedFormIndex=0;render();});
typeSelect.addEventListener('change',()=>{slashSelect.value='none';selectedFormIndex=0;render();});
slashSelect.addEventListener('change',()=>{selectedFormIndex=0;render();});
selectedChord.addEventListener('click',event=>{const button=event.target.closest('[data-form]');if(!button)return;selectedFormIndex=Number(button.dataset.form);render();});
render();