const NOTES=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const FORMULAS={
major:[0,4,7],minor:[0,3,7],'5':[0,7],dim:[0,3,6],aug:[0,4,8],sus2:[0,2,7],sus4:[0,5,7],'7sus4':[0,5,7,10],'9sus4':[0,5,7,10,14],sus2add4:[0,2,5,7],sus4add9:[0,5,7,14],no3:[0,7],no5:[0,4],
'6':[0,4,7,9],m6:[0,3,7,9],'69':[0,4,7,9,14],m69:[0,3,7,9,14],'7':[0,4,7,10],maj7:[0,4,7,11],m7:[0,3,7,10],mMaj7:[0,3,7,11],dim7:[0,3,6,9],m7b5:[0,3,6,10],
add2:[0,2,4,7],add4:[0,4,5,7],add9:[0,4,7,14],madd9:[0,3,7,14],add11:[0,4,7,17],add13:[0,4,7,21],madd11:[0,3,7,17],madd13:[0,3,7,21],
'9':[0,4,7,10,14],maj9:[0,4,7,11,14],m9:[0,3,7,10,14],'11':[0,4,7,10,14,17],maj11:[0,4,7,11,14,17],m11:[0,3,7,10,14,17],'13':[0,4,7,10,14,21],maj13:[0,4,7,11,14,21],m13:[0,3,7,10,14,17,21],maj9s11:[0,4,7,11,14,18],
'7b5':[0,4,6,10],'7s5':[0,4,8,10],'7b9':[0,4,7,10,13],'7s9':[0,4,7,10,15],'7b13':[0,4,7,10,20],'7s11':[0,4,7,10,18],'7b5b9':[0,4,6,10,13],'7s5s9':[0,4,8,10,15],'7b9s11':[0,4,7,10,13,18],'13b9':[0,4,7,10,13,21],'13s11':[0,4,7,10,18,21],'7alt':[0,4,8,10,13,15],
maj7b5:[0,4,6,11],maj7s5:[0,4,8,11],m7b9:[0,3,7,10,13],m7s5:[0,3,8,10],aug7:[0,4,8,10],augMaj7:[0,4,8,11],dimadd9:[0,3,6,14]
};
const LABELS={major:'',minor:'m','5':'5',dim:'dim',aug:'aug',sus2:'sus2',sus4:'sus4','7sus4':'7sus4','9sus4':'9sus4',sus2add4:'sus2(add4)',sus4add9:'sus4(add9)',no3:'no3',no5:'no5','6':'6',m6:'m6','69':'6/9',m69:'m6/9','7':'7',maj7:'maj7',m7:'m7',mMaj7:'mMaj7',dim7:'dim7',m7b5:'m7♭5',add2:'add2',add4:'add4',add9:'add9',madd9:'m(add9)',add11:'add11',add13:'add13',madd11:'m(add11)',madd13:'m(add13)','9':'9',maj9:'maj9',m9:'m9','11':'11',maj11:'maj11',m11:'m11','13':'13',maj13:'maj13',m13:'m13',maj9s11:'maj9♯11','7b5':'7♭5','7s5':'7♯5','7b9':'7♭9','7s9':'7♯9','7b13':'7♭13','7s11':'7♯11','7b5b9':'7(♭5,♭9)','7s5s9':'7(♯5,♯9)','7b9s11':'7(♭9,♯11)','13b9':'13♭9','13s11':'13♯11','7alt':'7alt',maj7b5:'maj7♭5',maj7s5:'maj7♯5',m7b9:'m7♭9',m7s5:'m7♯5',aug7:'aug7',augMaj7:'augMaj7',dimadd9:'dim(add9)'};
const DEGREE={0:'1',1:'♭9',2:'9',3:'♭3 / ♯9',4:'3',5:'11',6:'♭5',7:'5',8:'♯5',9:'6',10:'♭7',11:'7',13:'♭9',14:'9',15:'♯9',17:'11',18:'♯11',20:'♭13',21:'13'};
const DESCRIPTIONS={major:'明るく安定した基本コード。',minor:'落ち着きや切なさを持つ基本コード。','7':'次のコードへ進みたくなる緊張感がある。',maj7:'透明感があり上品な響き。',m7:'柔らかく落ち着いた響き。',dim:'強い緊張感を作るコード。',aug:'不思議で広がりのある響き。',sus2:'透明感のある浮遊した響き。',sus4:'解決を期待させる響き。','7alt':'強い緊張感を持つジャズ向けのオルタードコード。'};
const rootEl=document.querySelector('#pianoRoot');
const typeEl=document.querySelector('#pianoType');
const bassEl=document.querySelector('#pianoBass');
const keyboard=document.querySelector('#keyboard');
const octaveLabel=document.querySelector('#octaveLabel');
const playChordButton=document.querySelector('#playChord');
let audioContext;
function getAudioContext(){if(!audioContext)audioContext=new(window.AudioContext||window.webkitAudioContext)();if(audioContext.state==='suspended')audioContext.resume();return audioContext;}
function playMidi(midi,duration=.7,delay=0){const context=getAudioContext(),oscillator=context.createOscillator(),gain=context.createGain(),start=context.currentTime+delay;oscillator.type='triangle';oscillator.frequency.value=440*Math.pow(2,(midi-69)/12);gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(.18,start+.025);gain.gain.exponentialRampToValueAtTime(.0001,start+duration);oscillator.connect(gain).connect(context.destination);oscillator.start(start);oscillator.stop(start+duration+.05);}
function flashPitchClass(pc){keyboard.querySelectorAll(`[data-pc="${pc}"]`).forEach(key=>{key.classList.remove('key-flash');void key.offsetWidth;key.classList.add('key-flash');setTimeout(()=>key.classList.remove('key-flash'),180);});}
function playPitchClass(pc,octave=4){playMidi(12*(octave+1)+pc,.65);flashPitchClass(pc);}
function render(){
 const root=NOTES.indexOf(rootEl.value),formula=FORMULAS[typeEl.value],bass=bassEl.value==='none'?null:NOTES.indexOf(bassEl.value),octaveCount=Math.max(...formula)<=11?1:2,pcs=new Map();
 formula.forEach(interval=>pcs.set((root+interval)%12,DEGREE[interval]||String(interval)));
 const slash=bass===null?'':`/${NOTES[bass]}`;
 document.querySelector('#pianoChordName').textContent=rootEl.value+LABELS[typeEl.value]+slash;
 document.querySelector('#pianoDegrees').textContent=formula.map(interval=>DEGREE[interval]||interval).join(' ・ ')+(bass!==null?' ・ Bass':'');
 document.querySelector('#pianoBadges').innerHTML=`<span class="badge">${formula.length+(bass!==null&&!pcs.has(bass)?1:0)}音</span><span class="badge">ルート ${rootEl.value}</span><span class="badge">${octaveCount}オクターブ表示</span>${bass!==null?`<span class="badge">ベース ${NOTES[bass]}</span>`:''}`;
 document.querySelector('#pianoDescription').textContent=(DESCRIPTIONS[typeEl.value]||'構成音を重ねた響きを鍵盤で確認できるよ。')+(bass!==null?` ベース音を${NOTES[bass]}にしたオンコード。`:'');
 const notes=[...formula.map(interval=>({pc:(root+interval)%12,octave:4+Math.floor((root+interval)/12),root:interval===0,bass:false}))];
 if(bass!==null&&!notes.some(n=>n.pc===bass))notes.unshift({pc:bass,octave:3,root:false,bass:true});
 const notesBox=document.querySelector('#pianoNotes');
 notesBox.innerHTML=notes.map(n=>`<button type="button" class="note-chip${n.root?' root':''}${n.bass?' bass':''}" data-pc="${n.pc}" data-octave="${n.octave}">${NOTES[n.pc]}${n.bass?' ↓':''}</button>`).join('');
 notesBox.querySelectorAll('.note-chip').forEach(button=>button.addEventListener('click',()=>playPitchClass(Number(button.dataset.pc),Number(button.dataset.octave))));
 octaveLabel.textContent=`${octaveCount} OCTAVE${octaveCount===1?'':'S'}`;keyboard.setAttribute('aria-label',`${octaveCount}オクターブのピアノ鍵盤`);keyboard.classList.toggle('single-octave',octaveCount===1);keyboard.innerHTML='';
 const whites=[0,2,4,5,7,9,11],blackAfter={0:1,1:3,3:6,4:8,5:10},totalWhite=7*octaveCount,width=100/totalWhite;
 for(let octave=0;octave<octaveCount;octave++)whites.forEach((pc,index)=>{const wi=octave*7+index,key=document.createElement('div'),active=pcs.has(pc),isBass=bass===pc;key.className='white-key'+(active?' active':'')+(pc===root&&active?' root-active':'')+(isBass?' bass-active':'');key.style.left=`${wi*width}%`;key.style.width=`${width}%`;key.dataset.pc=pc;key.innerHTML=`<span class="key-label">${NOTES[pc]}${active?`<span class="key-degree">${pcs.get(pc)}</span>`:''}${isBass?'<span class="key-degree">Bass</span>':''}</span>`;key.setAttribute('role','button');key.tabIndex=0;const play=()=>playPitchClass(pc,4+octave);key.addEventListener('click',play);key.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();play();}});keyboard.appendChild(key);
 if(Object.prototype.hasOwnProperty.call(blackAfter,index)){const bpc=blackAfter[index],black=document.createElement('div'),bactive=pcs.has(bpc),bBass=bass===bpc;black.className='black-key'+(bactive?' active':'')+(bpc===root&&bactive?' root-active':'')+(bBass?' bass-active':'');black.style.left=`${(wi+1)*width}%`;black.style.width=`${width*.62}%`;black.dataset.pc=bpc;black.innerHTML=`<span class="key-label">${NOTES[bpc]}${bactive?`<span class="key-degree">${pcs.get(bpc)}</span>`:''}${bBass?'<span class="key-degree">Bass</span>':''}</span>`;black.setAttribute('role','button');black.tabIndex=0;const playBlack=()=>playPitchClass(bpc,4+octave);black.addEventListener('click',playBlack);black.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();playBlack();}});keyboard.appendChild(black);}});
}
playChordButton.addEventListener('click',()=>{const root=NOTES.indexOf(rootEl.value),formula=FORMULAS[typeEl.value],bass=bassEl.value==='none'?null:NOTES.indexOf(bassEl.value);if(bass!==null)playMidi(48+bass,1.1,0);formula.forEach((interval,index)=>{playMidi(60+root+interval,1,bass!==null?.06+index*.035:index*.035);setTimeout(()=>flashPitchClass((root+interval)%12),index*35);});});
[rootEl,typeEl,bassEl].forEach(el=>el.addEventListener('change',render));render();