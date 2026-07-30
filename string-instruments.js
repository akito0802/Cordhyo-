(()=>{
const NOTES=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const FORMULAS={major:[0,4,7],minor:[0,3,7],'5':[0,7],'6':[0,4,7,9],m6:[0,3,7,9],'7':[0,4,7,10],maj7:[0,4,7,11],m7:[0,3,7,10],mMaj7:[0,3,7,11],sus2:[0,2,7],sus4:[0,5,7],add9:[0,4,7,14],madd9:[0,3,7,14],'9':[0,4,7,10,14],maj9:[0,4,7,11,14],m9:[0,3,7,10,14],'11':[0,4,7,10,14,17],m11:[0,3,7,10,14,17],'13':[0,4,7,10,14,17,21],m13:[0,3,7,10,14,17,21],dim:[0,3,6],dim7:[0,3,6,9],m7b5:[0,3,6,10],aug:[0,4,8]};
const LABELS={major:'',minor:'m','5':'5','6':'6',m6:'m6','7':'7',maj7:'maj7',m7:'m7',mMaj7:'mMaj7',sus2:'sus2',sus4:'sus4',add9:'add9',madd9:'m(add9)','9':'9',maj9:'maj9',m9:'m9','11':'11',m11:'m11','13':'13',m13:'m13',dim:'dim',dim7:'dim7',m7b5:'m7♭5',aug:'aug'};
const DEG={0:'R',2:'2',3:'♭3',4:'3',5:'4',6:'♭5',7:'5',8:'♯5',9:'6',10:'♭7',11:'7',14:'9',17:'11',21:'13'};
const BASS_FORMS={
 major:{name:'定番3音フォーム（5度省略）',notes:[[3,0,0],[1,2,0],[0,1,4]]},
 minor:{name:'定番3音フォーム（5度省略）',notes:[[3,0,0],[1,2,0],[0,0,3]]},
 '5':{name:'パワーコード型',notes:[[3,0,0],[2,2,7],[1,2,0]]},
 '6':{name:'4音フォーム',notes:[[3,0,0],[2,2,7],[1,-1,9],[0,1,4]]},
 m6:{name:'4音フォーム',notes:[[3,0,0],[2,2,7],[1,-1,9],[0,0,3]]},
 '7':{name:'定番4音フォーム',notes:[[3,0,0],[2,2,7],[1,0,10],[0,1,4]]},
 maj7:{name:'定番4音フォーム',notes:[[3,0,0],[2,2,7],[1,1,11],[0,1,4]]},
 m7:{name:'定番4音フォーム',notes:[[3,0,0],[2,2,7],[1,0,10],[0,0,3]]},
 mMaj7:{name:'4音フォーム',notes:[[3,0,0],[2,2,7],[1,1,11],[0,0,3]]},
 sus2:{name:'3音フォーム',notes:[[3,0,0],[2,2,7],[1,4,2]]},
 sus4:{name:'3音フォーム',notes:[[3,0,0],[2,0,5],[1,2,0]]},
 add9:{name:'4音フォーム',notes:[[3,0,0],[2,2,7],[1,4,14],[0,1,4]]},
 madd9:{name:'4音フォーム',notes:[[3,0,0],[2,2,7],[1,4,14],[0,0,3]]},
 '9':{name:'シェル4音フォーム（5度省略）',notes:[[3,0,0],[2,5,10],[1,4,14],[0,1,4]]},
 maj9:{name:'シェル4音フォーム（5度省略）',notes:[[3,0,0],[2,6,11],[1,4,14],[0,1,4]]},
 m9:{name:'シェル4音フォーム（5度省略）',notes:[[3,0,0],[2,5,10],[1,4,14],[0,0,3]]},
 '11':{name:'シェル4音フォーム',notes:[[3,0,0],[2,5,10],[1,3,17],[0,1,4]]},
 m11:{name:'シェル4音フォーム',notes:[[3,0,0],[2,5,10],[1,3,17],[0,0,3]]},
 '13':{name:'シェル4音フォーム',notes:[[3,0,0],[2,4,9],[1,0,10],[0,1,4]]},
 m13:{name:'シェル4音フォーム',notes:[[3,0,0],[2,4,9],[1,0,10],[0,0,3]]},
 dim:{name:'定番3音フォーム',notes:[[3,0,0],[2,1,6],[0,0,3]]},
 dim7:{name:'4音フォーム',notes:[[3,0,0],[2,1,6],[1,-1,9],[0,0,3]]},
 m7b5:{name:'定番4音フォーム',notes:[[3,0,0],[2,1,6],[1,0,10],[0,0,3]]},
 aug:{name:'定番3音フォーム',notes:[[3,0,0],[2,3,8],[0,1,4]]}
};
const cfg=window.STRING_INSTRUMENT_CONFIG,root=document.querySelector('#stringRoot'),type=document.querySelector('#stringType'),name=document.querySelector('#stringChordName'),board=document.querySelector('#fretboard'),chips=document.querySelector('#stringNotes'),degrees=document.querySelector('#stringDegrees'),desc=document.querySelector('#stringDescription'),play=document.querySelector('#playStringChord');
const pc=n=>(n+120)%12,note=n=>NOTES[pc(n)];
function degreeForPitch(r,tone,intervals){const match=intervals.find(i=>pc(r+i)===tone);return DEG[match]||''}
function ukeForm(r,intervals){const unique=[...new Set(intervals.map(i=>pc(i)))],order=[0,3,4,10,11,2,5,9,6,8,7],target=order.filter(i=>unique.includes(i)).slice(0,4).map(i=>pc(r+i));let best=null;for(let a=0;a<=12;a++)for(let e=0;e<=12;e++)for(let c=0;c<=12;c++)for(let g=0;g<=12;g++){const frets=[a,e,c,g],pcs=frets.map((f,i)=>pc(cfg.strings[i].pc+f));if(pcs.some(x=>!target.includes(x))||!target.every(x=>pcs.includes(x)))continue;const p=frets.filter(f=>f>0),span=p.length?Math.max(...p)-Math.min(...p):0;if(span>4)continue;const score=Math.max(...frets)*7+span*10+p.reduce((s,f)=>s+f,0)-frets.filter(f=>f===0).length*4;if(!best||score<best.score)best={frets,score}}return best}
function bassForm(r,key){const tpl=BASS_FORMS[key]||BASS_FORMS.major;let rootF=pc(r-4);const minOff=Math.min(...tpl.notes.map(n=>n[1])),maxOff=Math.max(...tpl.notes.map(n=>n[1]));if(rootF+minOff<0)rootF+=12;if(rootF+maxOff>15)rootF-=12;const notes=tpl.notes.map(([si,off,degree])=>({si,f:rootF+off,degree,pc:pc(r+degree),midi:[55,50,45,40][si]+rootF+off}));return {notes,label:tpl.name}}
function renderBoard(selected,r,intervals){const maxF=15,used=selected.map(n=>n.f),min=Math.max(0,Math.min(...used)-1),max=Math.min(maxF,Math.max(...used)+1);board.innerHTML='<div class="fret-cell header corner">弦</div>'+Array.from({length:maxF+1},(_,f)=>`<div class="fret-cell header ${f<min||f>max?'muted-fret':''}">${f}</div>`).join('');cfg.strings.forEach((s,si)=>{board.insertAdjacentHTML('beforeend',`<div class="fret-cell string-label">${s.name}<small>弦</small></div>`);for(let f=0;f<=maxF;f++){const hit=selected.find(n=>n.si===si&&n.f===f),outside=f<min||f>max;let cls=outside?'muted-fret':'',marker='';if(hit){cls+=hit.pc===r?' root':' tone';marker=`<span class="form-marker"><b>${note(hit.pc)}</b><small>${DEG[hit.degree]||degreeForPitch(r,hit.pc,intervals)}</small></span>`}board.insertAdjacentHTML('beforeend',`<div class="fret-cell ${cls}">${marker}</div>`)}})}
function render(){const r=NOTES.indexOf(root.value),intervals=FORMULAS[type.value],pcs=[...new Set(intervals.map(i=>pc(r+i)))];name.textContent=root.value+LABELS[type.value];chips.innerHTML=pcs.map(x=>`<span class="note-chip ${x===r?'root':''}">${note(x)}<small>${degreeForPitch(r,x,intervals)}</small></span>`).join('');degrees.textContent=intervals.map(i=>DEG[i]||i).join(' ・ ');if(cfg.type==='ukulele'){const form=ukeForm(r,intervals),selected=form?form.frets.map((f,si)=>({si,f,pc:pc(cfg.strings[si].pc+f),degree:intervals.find(i=>pc(r+i)===pc(cfg.strings[si].pc+f))||0})):[];renderBoard(selected,r,intervals);desc.textContent=form?`おすすめフォーム（G→C→E→A）：${[...form.frets].reverse().join('–')}。`:'フォームが見つからなかったよ。'}else{const form=bassForm(r,type.value),selected=form.notes;renderBoard(selected,r,intervals);desc.textContent=`${form.label}。E弦ルートの可動フォームをそのまま平行移動して表示しているよ。押さえる位置：${selected.map(n=>`${cfg.strings[n.si].name}弦${n.f}F（${note(n.pc)}）`).join('・')}。`}}
function audio(){const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)return;const ctx=new Ctx(),r=NOTES.indexOf(root.value),intervals=FORMULAS[type.value];let midis=[];if(cfg.type==='bass')midis=bassForm(r,type.value).notes.map(n=>n.midi);else{const form=ukeForm(r,intervals);midis=form?form.frets.map((f,si)=>[69,64,60,67][si]+f):[]}midis.forEach(midi=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type=cfg.type==='bass'?'triangle':'sine';o.frequency.value=440*Math.pow(2,(midi-69)/12);g.gain.setValueAtTime(0,ctx.currentTime);g.gain.linearRampToValueAtTime(cfg.type==='bass'?.06:.09,ctx.currentTime+.02);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+1.25);o.connect(g).connect(ctx.destination);o.start();o.stop(ctx.currentTime+1.3)})}
root.addEventListener('change',render);type.addEventListener('change',render);play.addEventListener('click',audio);render();
})();