const rootSelect=document.querySelector('#rootSelect');
const typeSelect=document.querySelector('#typeSelect');
const bassSelect=document.querySelector('#bassSelect');
const selectedChord=document.querySelector('#selectedChord');
const slashQuickList=document.querySelector('#slashQuickList');
const roots=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const tuning=[4,9,2,7,11,4];
let selectedFormIndex=0;

const typeData={
 major:{suffix:'',label:'メジャー',intervals:[0,4,7],mood:'明るく安定した響き',use:'ポップスや弾き語りの基本。'},
 minor:{suffix:'m',label:'マイナー',intervals:[0,3,7],mood:'切なく落ち着いた響き',use:'バラードや哀愁のある進行で定番。'},
 '5':{suffix:'5',label:'パワーコード',intervals:[0,7],mood:'太く力強い響き',use:'ロックのリフに合う。'},
 '6':{suffix:'6',label:'6th',intervals:[0,4,7,9],mood:'明るく軽やかな響き',use:'ポップスやジャズ風伴奏に便利。'},
 m6:{suffix:'m6',label:'m6',intervals:[0,3,7,9],mood:'切なく温かい響き',use:'しっとりした曲に合う。'},
 '7':{suffix:'7',label:'7th',intervals:[0,4,7,10],mood:'ブルージーで緊張感のある響き',use:'次のコードへ進む定番。'},
 maj7:{suffix:'maj7',label:'maj7',intervals:[0,4,7,11],mood:'都会的で柔らかな響き',use:'シティポップやバラード向け。'},
 m7:{suffix:'m7',label:'m7',intervals:[0,3,7,10],mood:'大人っぽく落ち着いた響き',use:'R&Bやバラードで活躍。'},
 sus2:{suffix:'sus2',label:'sus2',intervals:[0,2,7],mood:'透明感のある響き',use:'爽やかな装飾に便利。'},
 sus4:{suffix:'sus4',label:'sus4',intervals:[0,5,7],mood:'解決前の緊張感',use:'メジャーとの行き来が定番。'},
 '7sus2':{suffix:'7sus2',label:'7sus2',intervals:[0,2,7,10],mood:'開放感とブルージーさがある響き',use:'ファンクやロックに合う。'},
 '7sus4':{suffix:'7sus4',label:'7sus4',intervals:[0,5,7,10],mood:'力強く開放感のある響き',use:'7コードへ戻す装飾に便利。'},
 add9:{suffix:'add9',label:'add9',intervals:[0,2,4,7],mood:'広がりのある爽やかな響き',use:'アコギのアルペジオに合う。'},
 madd9:{suffix:'m(add9)',label:'m(add9)',intervals:[0,2,3,7],mood:'切なく透明感のある響き',use:'静かなイントロに合う。'},
 add11:{suffix:'add11',label:'add11',intervals:[0,4,5,7],mood:'浮遊感のある明るい響き',use:'広がりを足したい時に便利。'},
 sus2add9:{suffix:'sus2(add9)',label:'sus2(add9)',intervals:[0,2,7],mood:'澄んだ開放的な響き',use:'アンビエントな伴奏に合う。'},
 sus4add9:{suffix:'sus4(add9)',label:'sus4(add9)',intervals:[0,2,5,7],mood:'広がりと緊張感のある響き',use:'壮大な伴奏に使いやすい。'},
 '9sus4':{suffix:'9sus4',label:'9sus4',intervals:[0,2,5,7,10],mood:'ファンキーで開放的な響き',use:'ソウルやファンクで定番。'},
 '9':{suffix:'9',label:'9th',intervals:[0,2,4,7,10],mood:'ブルージーでおしゃれな響き',use:'ファンクやジャズで定番。'},
 m9:{suffix:'m9',label:'m9',intervals:[0,2,3,7,10],mood:'深く柔らかな響き',use:'R&Bやネオソウルに合う。'},
 maj9:{suffix:'maj9',label:'maj9',intervals:[0,2,4,7,11],mood:'透明感の強い都会的な響き',use:'シティポップやジャズに合う。'},
 '69':{suffix:'6/9',label:'6/9',intervals:[0,2,4,7,9],mood:'明るく洗練された響き',use:'曲の終止やボサノバに便利。'},
 m69:{suffix:'m6/9',label:'m6/9',intervals:[0,2,3,7,9],mood:'柔らかく哀愁のある響き',use:'ジャズ系マイナーで使いやすい。'},
 '11':{suffix:'11',label:'11th',intervals:[0,2,4,5,7,10],mood:'厚く広がる響き',use:'ロックやソウルの持続音に合う。'},
 m11:{suffix:'m11',label:'m11',intervals:[0,2,3,5,7,10],mood:'深く浮遊感のある響き',use:'R&Bやジャズで活躍。'},
 maj11:{suffix:'maj11',label:'maj11',intervals:[0,2,4,5,7,11],mood:'幻想的で緊張感のある響き',use:'劇伴やモーダルな曲に合う。'},
 '13':{suffix:'13',label:'13th',intervals:[0,2,4,7,9,10],mood:'華やかでファンキーな響き',use:'ジャズやファンクのドミナントに。'},
 m13:{suffix:'m13',label:'m13',intervals:[0,2,3,7,9,10],mood:'柔らかく豊かな響き',use:'ネオソウルやジャズに合う。'},
 maj13:{suffix:'maj13',label:'maj13',intervals:[0,2,4,7,9,11],mood:'明るく豪華な響き',use:'終止や長く伸ばすコードに。'},
 '7b5':{suffix:'7♭5',label:'7♭5',intervals:[0,4,6,10],mood:'鋭く不安定な響き',use:'半音進行やジャズの代理コードに。'},
 '7s5':{suffix:'7♯5',label:'7♯5',intervals:[0,4,8,10],mood:'強い緊張と浮遊感',use:'マイナーへ解決する場面に。'},
 '7b9':{suffix:'7♭9',label:'7♭9',intervals:[0,1,4,7,10],mood:'非常に強い緊張感',use:'マイナーキーのドミナントに。'},
 '7s9':{suffix:'7♯9',label:'7♯9',intervals:[0,3,4,7,10],mood:'荒々しくブルージーな響き',use:'ロックやファンクで定番。'},
 '7b13':{suffix:'7♭13',label:'7♭13',intervals:[0,4,7,8,10],mood:'暗く濃い緊張感',use:'マイナーへの解決に合う。'},
 '7s11':{suffix:'7♯11',label:'7♯11',intervals:[0,4,6,7,10],mood:'現代的で鋭い響き',use:'リディアン・ドミナントで活躍。'},
 m7b5:{suffix:'m7♭5',label:'m7♭5',intervals:[0,3,6,10],mood:'不安定で少し暗い響き',use:'マイナーキーで登場する。'},
 m9b5:{suffix:'m9♭5',label:'m9♭5',intervals:[0,2,3,6,10],mood:'暗く繊細な響き',use:'ジャズのマイナー進行に。'},
 m11b5:{suffix:'m11♭5',label:'m11♭5',intervals:[0,2,3,5,6,10],mood:'複雑で深い響き',use:'モーダルジャズや劇伴に。'},
 dim:{suffix:'dim',label:'dim',intervals:[0,3,6],mood:'緊張感が強い響き',use:'経過コードとして便利。'},
 dim7:{suffix:'dim7',label:'dim7',intervals:[0,3,6,9],mood:'ミステリアスな響き',use:'半音進行で便利。'},
 dimadd9:{suffix:'dim(add9)',label:'dim(add9)',intervals:[0,2,3,6],mood:'不穏で透明感のある響き',use:'劇伴や特殊な経過音に。'},
 dim7add11:{suffix:'dim7(add11)',label:'dim7(add11)',intervals:[0,3,5,6,9],mood:'非常に複雑で不安定な響き',use:'現代的なアレンジ向け。'},
 aug:{suffix:'aug',label:'aug',intervals:[0,4,8],mood:'不思議で浮遊する響き',use:'次へ進む装飾に使える。'},
 aug7:{suffix:'aug7',label:'aug7',intervals:[0,4,8,10],mood:'強くうねるような緊張感',use:'ドミナントの変化形として。'},
 augmaj7:{suffix:'augmaj7',label:'augmaj7',intervals:[0,4,8,11],mood:'幻想的で映画的な響き',use:'劇伴や印象的な終止に。'}
};

const openShapes={
 'C:major':['x',3,2,0,1,0],'D:major':['x','x',0,2,3,2],'E:major':[0,2,2,1,0,0],'G:major':[3,2,0,0,0,3],'A:major':['x',0,2,2,2,0],
 'A:minor':['x',0,2,2,1,0],'D:minor':['x','x',0,2,3,1],'E:minor':[0,2,2,0,0,0],
 'A:7':['x',0,2,0,2,0],'D:7':['x','x',0,2,1,2],'E:7':[0,2,0,1,0,0],'G:7':[3,2,0,0,0,1],
 'C:maj7':['x',3,2,0,0,0],'F:maj7':['x','x',3,2,1,0],'A:maj7':['x',0,2,1,2,0],
 'A:m7':['x',0,2,0,1,0],'D:m7':['x','x',0,2,1,1],'E:m7':[0,2,0,0,0,0],
 'D:sus2':['x','x',0,2,3,0],'A:sus2':['x',0,2,2,0,0],'D:sus4':['x','x',0,2,3,3],'A:sus4':['x',0,2,2,3,0],
 'C:add9':['x',3,2,0,3,0],'G:add9':[3,2,0,2,0,3]
};

const slashShapes={
 'C/E':[0,3,2,0,1,0],'C/G':[3,3,2,0,1,0],'C/B':['x',2,2,0,1,0],'C/D':['x','x',0,0,1,0],'C/F':['x','x',3,0,1,0],
 'D/F#':[2,0,0,2,3,2],'D/A':['x',0,0,2,3,2],'D/C#':['x',4,0,2,3,2],'D/C':['x',3,0,2,3,2],'D/B':['x',2,0,2,3,2],
 'Dm/F':[1,'x',0,2,3,1],'Dm/A':['x',0,0,2,3,1],'Dm/C':['x',3,0,2,3,1],'Dm/B':['x',2,0,2,3,1],'Dm/E':[0,'x',0,2,3,1],
 'E/G#':[4,2,2,1,0,0],'E/B':['x',2,2,1,0,0],'E/D':['x','x',0,1,0,0],'E/D#':['x','x',1,0,0,0],'E/F#':[2,2,2,1,0,0],
 'Em/G':[3,2,2,0,0,0],'Em/B':['x',2,2,0,0,0],'Em/D':['x','x',0,0,0,0],'Em/C':['x',3,2,0,0,0],
 'F/A':['x',0,3,2,1,1],'F/C':['x',3,3,2,1,1],'F/E':['x','x',2,2,1,1],'F/G':[3,'x',3,2,1,1],'F/D':['x','x',0,2,1,1],
 'G/B':['x',2,0,0,0,3],'G/D':['x','x',0,0,0,3],'G/F#':[2,'x',0,0,0,3],'G/F':[1,'x',0,0,0,3],'G/A':['x',0,0,0,0,3],
 'A/C#':['x',4,2,2,2,0],'A/E':[0,0,2,2,2,0],'A/G#':[4,0,2,2,2,0],'A/G':[3,0,2,2,2,0],
 'Am/C':['x',3,2,2,1,0],'Am/E':[0,0,2,2,1,0],'Am/G':[3,0,2,2,1,0],'Am/B':['x',2,2,2,1,0],
 'B/D#':['x',6,4,4,4,2],'B/F#':[2,2,4,4,4,2],'B/A':['x',0,4,4,4,2],
 'Bm/D':['x',5,4,4,3,2],'Bm/F#':[2,2,4,4,3,2],'Bm/A':['x',0,4,4,3,2],'Bm/E':[0,2,4,4,3,2]
};
const popularSlashChords=['C/E','C/G','D/F#','D/A','E/G#','E/B','F/A','F/C','G/B','G/D','A/C#','A/E','Am/C','Am/E','Em/G','Em/B','Dm/F','Bm/D'];

const eShapes={major:r=>[r,r+2,r+2,r+1,r,r],minor:r=>[r,r+2,r+2,r,r,r],'5':r=>[r,r+2,r+2,'x','x','x'],'6':r=>[r,r+2,r+2,r+1,r+2,r],m6:r=>[r,r+2,r+2,r,r+2,r],'7':r=>[r,r+2,r,r+1,r,r],maj7:r=>[r,r+2,r+1,r+1,r,r],m7:r=>[r,r+2,r,r,r,r],sus2:r=>[r,r+2,r+4,r+4,r,r],sus4:r=>[r,r+2,r+2,r+2,r,r],'7sus4':r=>[r,r+2,r,r+2,r,r],add9:r=>[r,r+2,r+4,r+1,r,r],madd9:r=>[r,r+2,r+4,r,r,r],m7b5:r=>[r,r+1,r,r,r+3,'x'],dim:r=>[r,r+1,r+2,r,'x','x'],dim7:r=>[r,r+1,r+2,r,r+2,r],aug:r=>[r,r+3,r+2,r+1,r+1,r]};
const aShapes={major:r=>['x',r,r+2,r+2,r+2,r],minor:r=>['x',r,r+2,r+2,r+1,r],'5':r=>['x',r,r+2,r+2,'x','x'],'6':r=>['x',r,r+2,r+2,r+2,r+2],m6:r=>['x',r,r+2,r+2,r+1,r+2],'7':r=>['x',r,r+2,r,r+2,r],maj7:r=>['x',r,r+2,r+1,r+2,r],m7:r=>['x',r,r+2,r,r+1,r],sus2:r=>['x',r,r+2,r+2,r,r],sus4:r=>['x',r,r+2,r+2,r+3,r],'7sus4':r=>['x',r,r+2,r,r+3,r],add9:r=>['x',r,r+2,r+4,r+2,r],madd9:r=>['x',r,r+2,r+4,r+1,r],m7b5:r=>['x',r,r+1,r,r+1,'x'],dim:r=>['x',r,r+1,r+2,r+1,'x'],dim7:r=>['x',r,r+1,r+2,r+1,r+2],aug:r=>['x',r,r+3,r+2,r+2,'x']};

function chordBaseName(root,type){return root+typeData[type].suffix;}
function notesFor(root,type){const i=roots.indexOf(root);return [...new Set(typeData[type].intervals.map(n=>roots[(i+n)%12]))].join('・');}
function updateBassOptions(){const baseName=chordBaseName(rootSelect.value,typeSelect.value);const available=Object.keys(slashShapes).filter(name=>name.startsWith(`${baseName}/`)).map(name=>name.split('/')[1]);const previous=bassSelect.value;bassSelect.innerHTML='<option value="none">なし</option>'+available.map(b=>`<option value="${b}">${baseName}/${b}</option>`).join('');bassSelect.value=available.includes(previous)?previous:'none';bassSelect.disabled=available.length===0;}

function generatedShape(root,type,bassString){
 const rootPc=roots.indexOf(root),tones=new Set(typeData[type].intervals.map(n=>(rootPc+n)%12));
 const rootFret=(rootPc-tuning[bassString]+12)%12||12,frets=Array(6).fill('x'),used=new Set([0]);frets[bassString]=rootFret;
 for(let s=bassString+1;s<6;s++){
  const candidates=[];
  for(let f=Math.max(0,rootFret-1);f<=rootFret+4;f++){const pc=(tuning[s]+f)%12;if(tones.has(pc)){const interval=(pc-rootPc+12)%12;const score=(used.has(interval)?10:0)+Math.abs(f-rootFret)+(interval===7?3:0);candidates.push({f,interval,score});}}
  candidates.sort((a,b)=>a.score-b.score);if(candidates.length){frets[s]=candidates[0].f;used.add(candidates[0].interval);}
 }
 return frets;
}
function getForms(root,type,bass){
 const base=chordBaseName(root,type),slash=bass==='none'?null:`${base}/${bass}`;
 if(slash&&slashShapes[slash])return [{label:'フォーム1',shape:'オンコード',frets:slashShapes[slash],barres:[]}];
 const forms=[],open=openShapes[`${root}:${type}`];if(open)forms.push({label:'フォーム1',shape:'オープンコード',frets:open,barres:[]});
 const i=roots.indexOf(root),e=(i-4+12)%12||12,a=(i-9+12)%12||12,em=eShapes[type],am=aShapes[type];
 if(em)forms.push({label:`フォーム${forms.length+1}`,shape:'6弦ルート',frets:em(e),barres:[{fret:e,start:0,end:5}]});
 else forms.push({label:`フォーム${forms.length+1}`,shape:'6弦ルート・省略',frets:generatedShape(root,type,0),barres:[]});
 if(am)forms.push({label:`フォーム${forms.length+1}`,shape:'5弦ルート',frets:am(a),barres:[{fret:a,start:1,end:5}]});
 else forms.push({label:`フォーム${forms.length+1}`,shape:'5弦ルート・省略',frets:generatedShape(root,type,1),barres:[]});
 return forms.slice(0,3);
}
function diagram(name,frets,barres=[]){const nums=frets.filter(v=>typeof v==='number'&&v>0),min=nums.length?Math.min(...nums):1,max=nums.length?Math.max(...nums):1;const base=min>4?min:1,count=Math.max(4,max-base+1),x0=42,y0=38,sw=24,bh=150,fh=bh/count;let svg=`<svg class="chord-diagram large-diagram" viewBox="0 0 190 210" role="img" aria-label="${name}のコード図">`;for(let s=0;s<6;s++)svg+=`<line class="string" x1="${x0+s*sw}" y1="${y0}" x2="${x0+s*sw}" y2="${y0+bh}"/>`;for(let f=0;f<=count;f++)svg+=`<line class="${f===0&&base===1?'nut':'fret'}" x1="${x0}" y1="${y0+f*fh}" x2="${x0+5*sw}" y2="${y0+f*fh}"/>`;if(base>1)svg+=`<text class="fret-label" x="22" y="${y0+fh*.65}">${base}fr</text>`;const covered=new Set();barres.forEach(b=>{const df=b.fret-base+1;if(df<1||df>count)return;const y=y0+(df-.5)*fh;svg+=`<line class="barre" x1="${x0+b.start*sw}" y1="${y}" x2="${x0+b.end*sw}" y2="${y}"/>`;for(let s=b.start;s<=b.end;s++)if(frets[s]===b.fret)covered.add(`${s}:${b.fret}`);});frets.forEach((v,s)=>{const x=x0+s*sw;if(v==='x')svg+=`<text class="mute-mark" x="${x}" y="22">×</text>`;else if(v===0)svg+=`<text class="open-mark" x="${x}" y="22">○</text>`;else if(!covered.has(`${s}:${v}`)){const df=v-base+1,y=y0+(df-.5)*fh;if(df>=1&&df<=count)svg+=`<circle class="dot" cx="${x}" cy="${y}" r="9"/>`;}});return svg+'</svg>';}
function renderQuickList(){slashQuickList.innerHTML=popularSlashChords.map(name=>`<button class="slash-chip" type="button" data-slash="${name}">${name}</button>`).join('');}
function selectSlashChord(name){const [base,bass]=name.split('/');let root='',type='major';for(const candidate of [...roots].sort((a,b)=>b.length-a.length)){if(base.startsWith(candidate)){root=candidate;break;}}const suffix=base.slice(root.length),match=Object.entries(typeData).find(([,data])=>data.suffix===suffix);if(match)type=match[0];rootSelect.value=root;typeSelect.value=type;selectedFormIndex=0;updateBassOptions();bassSelect.value=bass;render();selectedChord.scrollIntoView({behavior:'smooth',block:'start'});}
function render(){const root=rootSelect.value,type=typeSelect.value,bass=bassSelect.value,data=typeData[type],baseName=chordBaseName(root,type),name=bass==='none'?baseName:`${baseName}/${bass}`,forms=getForms(root,type,bass),form=forms[selectedFormIndex]||forms[0];if(!form){selectedChord.innerHTML='<p>このコードのフォームは準備中です。</p>';return;}const bassInfo=bass==='none'?'通常コード':`最低音を${bass}にしたオンコード`;selectedChord.innerHTML=`<article class="selected-card"><div class="selected-heading"><p class="selected-label">選択中のコード</p><h2 class="selected-name">${name}</h2><div class="meta"><span class="badge">${data.label}</span><span class="badge">${form.shape}</span></div></div><div class="form-tabs">${forms.map((f,i)=>`<button class="form-tab ${i===selectedFormIndex?'active':''}" data-form="${i}" type="button">${f.label}<small>${f.shape}</small></button>`).join('')}</div><div class="selected-content"><div class="diagram-panel"><div class="diagram-wrap">${diagram(name,form.frets,form.barres)}</div></div><div class="info-list"><div class="info-box"><strong>構成音</strong>${notesFor(root,type)}</div><div class="info-box"><strong>ベース音</strong>${bassInfo}</div><div class="info-box"><strong>響き</strong>${data.mood}</div><div class="info-box"><strong>使い方</strong>${data.use}</div></div></div></article>`;}
[rootSelect,typeSelect].forEach(el=>el.addEventListener('change',()=>{selectedFormIndex=0;updateBassOptions();render();}));bassSelect.addEventListener('change',()=>{selectedFormIndex=0;render();});selectedChord.addEventListener('click',e=>{const b=e.target.closest('[data-form]');if(!b)return;selectedFormIndex=Number(b.dataset.form);render();});slashQuickList.addEventListener('click',e=>{const button=e.target.closest('[data-slash]');if(button)selectSlashChord(button.dataset.slash);});renderQuickList();updateBassOptions();render();