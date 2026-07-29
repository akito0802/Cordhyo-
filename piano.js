const NOTES=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const FORMULAS={major:[0,4,7],minor:[0,3,7],'5':[0,7],sus2:[0,2,7],sus4:[0,5,7],dim:[0,3,6],aug:[0,4,8],'6':[0,4,7,9],m6:[0,3,7,9],'7':[0,4,7,10],maj7:[0,4,7,11],m7:[0,3,7,10],mMaj7:[0,3,7,11],dim7:[0,3,6,9],m7b5:[0,3,6,10],add9:[0,4,7,14],madd9:[0,3,7,14],'9':[0,4,7,10,14],maj9:[0,4,7,11,14],m9:[0,3,7,10,14],'11':[0,4,7,10,14,17],m11:[0,3,7,10,14,17],'13':[0,4,7,10,14,21],m13:[0,3,7,10,14,17,21]};
const LABELS={major:'',minor:'m','5':'5',sus2:'sus2',sus4:'sus4',dim:'dim',aug:'aug','6':'6',m6:'m6','7':'7',maj7:'maj7',m7:'m7',mMaj7:'mMaj7',dim7:'dim7',m7b5:'m7♭5',add9:'add9',madd9:'m(add9)','9':'9',maj9:'maj9',m9:'m9','11':'11',m11:'m11','13':'13',m13:'m13'};
const DEGREE={0:'1',2:'9',3:'♭3',4:'3',5:'11',6:'♭5',7:'5',8:'♯5',9:'6',10:'♭7',11:'7',14:'9',17:'11',21:'13'};
const rootEl=document.querySelector('#pianoRoot'),typeEl=document.querySelector('#pianoType'),keyboard=document.querySelector('#keyboard');
function render(){
 const root=NOTES.indexOf(rootEl.value),formula=FORMULAS[typeEl.value],pcs=new Map();
 formula.forEach(i=>pcs.set((root+i)%12,DEGREE[i]||String(i)));
 document.querySelector('#pianoChordName').textContent=rootEl.value+LABELS[typeEl.value];
 document.querySelector('#pianoNotes').textContent=formula.map(i=>NOTES[(root+i)%12]).join(' ・ ');
 document.querySelector('#pianoDegrees').textContent=formula.map(i=>DEGREE[i]||i).join(' ・ ');
 document.querySelector('#pianoBadges').innerHTML=`<span class="badge">${formula.length}音</span><span class="badge">ルート ${rootEl.value}</span>`;
 keyboard.innerHTML='';
 const whiteNotes=[0,2,4,5,7,9,11,12,14,16,17,19,21,23];
 whiteNotes.forEach((semi,index)=>{const pc=semi%12,key=document.createElement('div');key.className='white-key'+(pcs.has(pc)?' active':'');key.innerHTML=`<span class="key-label">${NOTES[pc]}${pcs.has(pc)?`<span class="key-degree">${pcs.get(pc)}</span>`:''}</span>`;keyboard.appendChild(key);});
 const blackNotes=[1,3,6,8,10,13,15,18,20,22];
 const positions=[1,2,4,5,6,8,9,11,12,13];
 blackNotes.forEach((semi,i)=>{const pc=semi%12,key=document.createElement('div');key.className='black-key'+(pcs.has(pc)?' active':'');key.style.left=`calc(${positions[i]} * max(72px, 7.142857%) )`;key.innerHTML=`<span class="key-label">${NOTES[pc]}${pcs.has(pc)?`<span class="key-degree">${pcs.get(pc)}</span>`:''}</span>`;keyboard.appendChild(key);});
}
rootEl.addEventListener('change',render);typeEl.addEventListener('change',render);render();
