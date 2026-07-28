const rootSelect=document.querySelector('#rootSelect');
const typeSelect=document.querySelector('#typeSelect');
const bassSelect=document.querySelector('#bassSelect');
const selectedChord=document.querySelector('#selectedChord');
const slashQuickList=document.querySelector('#slashQuickList');
const roots=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
let selectedFormIndex=0;

const typeData={
 major:{suffix:'',label:'メジャー',intervals:[0,4,7],mood:'明るく安定した響き',use:'ポップスや弾き語りの基本。'},
 minor:{suffix:'m',label:'マイナー',intervals:[0,3,7],mood:'切なく落ち着いた響き',use:'バラードや哀愁のある進行で定番。'},
 '5':{suffix:'5',label:'パワーコード',intervals:[0,7],mood:'太く力強い響き',use:'ロックのリフや歪ませた伴奏で使いやすい。'},
 '6':{suffix:'6',label:'6th',intervals:[0,4,7,9],mood:'明るく少しおしゃれな響き',use:'ポップスや軽いジャズ風伴奏に合う。'},
 m6:{suffix:'m6',label:'m6',intervals:[0,3,7,9],mood:'切なさの中に温かさがある響き',use:'しっとりしたバラードに合う。'},
 '7':{suffix:'7',label:'7th',intervals:[0,4,7,10],mood:'ブルージーで次へ進みたくなる響き',use:'次のコードへつなぐ定番。'},
 maj7:{suffix:'maj7',label:'maj7',intervals:[0,4,7,11],mood:'都会的で柔らかな響き',use:'シティポップやバラードでよく使う。'},
 m7:{suffix:'m7',label:'m7',intervals:[0,3,7,10],mood:'大人っぽく落ち着いた響き',use:'R&Bやバラードで活躍。'},
 sus2:{suffix:'sus2',label:'sus2',intervals:[0,2,7],mood:'透明感のある響き',use:'爽やかな装飾に便利。'},
 sus4:{suffix:'sus4',label:'sus4',intervals:[0,5,7],mood:'解決前の緊張感',use:'メジャーコードとの行き来が定番。'},
 '7sus4':{suffix:'7sus4',label:'7sus4',intervals:[0,5,7,10],mood:'力強く開放感のある響き',use:'7コードへ戻す装飾に便利。'},
 add9:{suffix:'add9',label:'add9',intervals:[0,4,7,14],mood:'広がりのある爽やかな響き',use:'アコギのアルペジオに合う。'},
 madd9:{suffix:'m(add9)',label:'m(add9)',intervals:[0,3,7,14],mood:'切なく透明感のある響き',use:'静かなイントロに合う。'},
 m7b5:{suffix:'m7♭5',label:'m7♭5',intervals:[0,3,6,10],mood:'不安定で少し暗い響き',use:'マイナーキーで登場する。'},
 dim:{suffix:'dim',label:'dim',intervals:[0,3,6],mood:'緊張感が強い響き',use:'経過コードとして便利。'},
 dim7:{suffix:'dim7',label:'dim7',intervals:[0,3,6,9],mood:'ミステリアスな響き',use:'半音進行で便利。'},
 aug:{suffix:'aug',label:'aug',intervals:[0,4,8],mood:'不思議で浮遊する響き',use:'次へ進む装飾に使える。'}
};

const openShapes={
 'C:major':['x',3,2,0,1,0],'D:major':['x','x',0,2,3,2],'E:major':[0,2,2,1,0,0],'G:major':[3,2,0,0,0,3],'A:major':['x',0,2,2,2,0],
 'A:minor':['x',0,2,2,1,0],'D:minor':['x','x',0,2,3,1],'E:minor':[0,2,2,0,0,0],
 'A:7':['x',0,2,0,2,0],'D:7':['x','x',0,2,1,2],'E:7':[0,2,0,1,0,0],'G:7':[3,2,0,0,0,1],
 'C:maj7':['x',3,2,0,0,0],'F:maj7':['x','x',3,2,1,0],'A:maj7':['x',0,2,1,2,0],
 'A:m7':['x',0,2,0,1,0],'D:m7':['x','x',0,2,1,1],'E:m7':[0,2,0,0,0,0],
 'D:sus2':['x','x',0,2,3,0],'A:sus2':['x',0,2,2,0,0],
 'D:sus4':['x','x',0,2,3,3],'A:sus4':['x',0,2,2,3,0],
 'C:add9':['x',3,2,0,3,0],'G:add9':[3,2,0,2,0,3]
};

const slashShapes={
 'C/E':[0,3,2,0,1,0], 'C/G':[3,3,2,0,1,0], 'C/B':['x',2,2,0,1,0], 'C/D':['x','x',0,0,1,0], 'C/F':['x','x',3,0,1,0],
 'D/F#':[2,0,0,2,3,2], 'D/A':['x',0,0,2,3,2], 'D/C#':['x',4,0,2,3,2], 'D/C':['x',3,0,2,3,2], 'D/B':['x',2,0,2,3,2],
 'Dm/F':[1,'x',0,2,3,1], 'Dm/A':['x',0,0,2,3,1], 'Dm/C':['x',3,0,2,3,1], 'Dm/B':['x',2,0,2,3,1], 'Dm/E':[0,'x',0,2,3,1],
 'E/G#':[4,2,2,1,0,0], 'E/B':['x',2,2,1,0,0], 'E/D':['x','x',0,1,0,0], 'E/D#':['x','x',1,0,0,0], 'E/F#':[2,2,2,1,0,0],
 'Em/G':[3,2,2,0,0,0], 'Em/B':['x',2,2,0,0,0], 'Em/D':['x','x',0,0,0,0], 'Em/C':['x',3,2,0,0,0],
 'F/A':['x',0,3,2,1,1], 'F/C':['x',3,3,2,1,1], 'F/E':['x','x',2,2,1,1], 'F/G':[3,'x',3,2,1,1], 'F/D':['x','x',0,2,1,1],
 'G/B':['x',2,0,0,0,3], 'G/D':['x','x',0,0,0,3], 'G/F#':[2,'x',0,0,0,3], 'G/F':[1,'x',0,0,0,3], 'G/A':['x',0,0,0,0,3],
 'A/C#':['x',4,2,2,2,0], 'A/E':[0,0,2,2,2,0], 'A/G#':[4,0,2,2,2,0], 'A/G':[3,0,2,2,2,0],
 'Am/C':['x',3,2,2,1,0], 'Am/E':[0,0,2,2,1,0], 'Am/G':[3,0,2,2,1,0], 'Am/B':['x',2,2,2,1,0],
 'B/D#':['x',6,4,4,4,2], 'B/F#':[2,2,4,4,4,2], 'B/A':['x',0,4,4,4,2],
 'Bm/D':['x',5,4,4,3,2], 'Bm/F#':[2,2,4,4,3,2], 'Bm/A':['x',0,4,4,3,2], 'Bm/E':[0,2,4,4,3,2]
};

const popularSlashChords=['C/E','C/G','D/F#','D/A','E/G#','E/B','F/A','F/C','G/B','G/D','A/C#','A/E','Am/C','Am/E','Em/G','Em/B','Dm/F','Bm/D'];
const eShapes={major:r=>[r,r+2,r+2,r+1,r,r],minor:r=>[r,r+2,r+2,r,r,r],'7':r=>[r,r+2,r,r+1,r,r],maj7:r=>[r,r+2,r+1,r+1,r,r],m7:r=>[r,r+2,r,r,r,r]};
const aShapes={major:r=>['x',r,r+2,r+2,r+2,r],minor:r=>['x',r,r+2,r+2,r+1,r],'7':r=>['x',r,r+2,r,r+2,r],maj7:r=>['x',r,r+2,r+1,r+2,r],m7:r=>['x',r,r+2,r,r+1,r]};

function chordBaseName(root,type){return root+typeData[type].suffix;}
function notesFor(root,type){const i=roots.indexOf(root);return [...new Set(typeData[type].intervals.map(n=>roots[(i+n)%12]))].join('・');}

function updateBassOptions(){
 const baseName=chordBaseName(rootSelect.value,typeSelect.value);
 const available=Object.keys(slashShapes).filter(name=>name.startsWith(`${baseName}/`)).map(name=>name.split('/')[1]);
 const previous=bassSelect.value;
 bassSelect.innerHTML='<option value="none">なし</option>'+available.map(b=>`<option value="${b}">${baseName}/${b}</option>`).join('');
 bassSelect.value=available.includes(previous)?previous:'none';
 bassSelect.disabled=available.length===0;
}

function getForms(root,type,bass){
 const base=chordBaseName(root,type),slash=bass==='none'?null:`${base}/${bass}`;
 if(slash&&slashShapes[slash])return [{label:'フォーム1',shape:'オンコード',frets:slashShapes[slash],barres:[]}];
 const open=openShapes[`${root}:${type}`];
 const forms=[];
 if(open)forms.push({label:'フォーム1',shape:'オープンコード',frets:open,barres:[]});
 const i=roots.indexOf(root),e=(i-4+12)%12||12,a=(i-9+12)%12||12;
 const em=eShapes[type]||eShapes.major,am=aShapes[type]||aShapes.major;
 forms.push({label:`フォーム${forms.length+1}`,shape:'6弦ルート',frets:em(e),barres:[{fret:e,start:0,end:5}]});
 forms.push({label:`フォーム${forms.length+1}`,shape:'5弦ルート',frets:am(a),barres:[{fret:a,start:1,end:5}]});
 return forms.slice(0,3);
}

function diagram(name,frets,barres=[]){
 const nums=frets.filter(v=>typeof v==='number'&&v>0),min=nums.length?Math.min(...nums):1,max=nums.length?Math.max(...nums):1;
 const base=min>4?min:1,count=Math.max(4,max-base+1),x0=42,y0=38,sw=24,bh=150,fh=bh/count;
 let svg=`<svg class="chord-diagram large-diagram" viewBox="0 0 190 210" role="img" aria-label="${name}のコード図">`;
 for(let s=0;s<6;s++)svg+=`<line class="string" x1="${x0+s*sw}" y1="${y0}" x2="${x0+s*sw}" y2="${y0+bh}"/>`;
 for(let f=0;f<=count;f++)svg+=`<line class="${f===0&&base===1?'nut':'fret'}" x1="${x0}" y1="${y0+f*fh}" x2="${x0+5*sw}" y2="${y0+f*fh}"/>`;
 if(base>1)svg+=`<text class="fret-label" x="22" y="${y0+fh*.65}">${base}fr</text>`;
 const covered=new Set();
 barres.forEach(b=>{const df=b.fret-base+1;if(df<1||df>count)return;const y=y0+(df-.5)*fh;svg+=`<line class="barre" x1="${x0+b.start*sw}" y1="${y}" x2="${x0+b.end*sw}" y2="${y}"/>`;for(let s=b.start;s<=b.end;s++)if(frets[s]===b.fret)covered.add(`${s}:${b.fret}`);});
 frets.forEach((v,s)=>{const x=x0+s*sw;if(v==='x')svg+=`<text class="mute-mark" x="${x}" y="22">×</text>`;else if(v===0)svg+=`<text class="open-mark" x="${x}" y="22">○</text>`;else if(!covered.has(`${s}:${v}`)){const df=v-base+1,y=y0+(df-.5)*fh;if(df>=1&&df<=count)svg+=`<circle class="dot" cx="${x}" cy="${y}" r="9"/>`;}});
 return svg+'</svg>';
}

function renderQuickList(){
 slashQuickList.innerHTML=popularSlashChords.map(name=>`<button class="slash-chip" type="button" data-slash="${name}">${name}</button>`).join('');
}

function selectSlashChord(name){
 const [base,bass]=name.split('/');
 let root='';
 let type='major';
 for(const candidate of [...roots].sort((a,b)=>b.length-a.length)){
  if(base.startsWith(candidate)){root=candidate;break;}
 }
 const suffix=base.slice(root.length);
 const match=Object.entries(typeData).find(([,data])=>data.suffix===suffix);
 if(match)type=match[0];
 rootSelect.value=root;
 typeSelect.value=type;
 selectedFormIndex=0;
 updateBassOptions();
 bassSelect.value=bass;
 render();
 selectedChord.scrollIntoView({behavior:'smooth',block:'start'});
}

function render(){
 const root=rootSelect.value,type=typeSelect.value,bass=bassSelect.value,data=typeData[type],baseName=chordBaseName(root,type);
 const name=bass==='none'?baseName:`${baseName}/${bass}`;
 const forms=getForms(root,type,bass),form=forms[selectedFormIndex]||forms[0];
 const bassInfo=bass==='none'?'通常コード':`最低音を${bass}にした、実際によく使われるオンコード`;
 selectedChord.innerHTML=`<article class="selected-card"><div class="selected-heading"><p class="selected-label">選択中のコード</p><h2 class="selected-name">${name}</h2><div class="meta"><span class="badge">${data.label}</span><span class="badge">${form.shape}</span></div></div><div class="form-tabs">${forms.map((f,i)=>`<button class="form-tab ${i===selectedFormIndex?'active':''}" data-form="${i}" type="button">${f.label}<small>${f.shape}</small></button>`).join('')}</div><div class="selected-content"><div class="diagram-panel"><div class="diagram-wrap">${diagram(name,form.frets,form.barres)}</div></div><div class="info-list"><div class="info-box"><strong>構成音</strong>${notesFor(root,type)}</div><div class="info-box"><strong>ベース音</strong>${bassInfo}</div><div class="info-box"><strong>響き</strong>${data.mood}</div><div class="info-box"><strong>使い方</strong>${data.use}</div></div></div></article>`;
}

[rootSelect,typeSelect].forEach(el=>el.addEventListener('change',()=>{selectedFormIndex=0;updateBassOptions();render();}));
bassSelect.addEventListener('change',()=>{selectedFormIndex=0;render();});
selectedChord.addEventListener('click',e=>{const b=e.target.closest('[data-form]');if(!b)return;selectedFormIndex=Number(b.dataset.form);render();});
slashQuickList.addEventListener('click',e=>{const button=e.target.closest('[data-slash]');if(button)selectSlashChord(button.dataset.slash);});
renderQuickList();
updateBassOptions();
render();