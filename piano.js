const NOTES=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const FORMULAS={major:[0,4,7],minor:[0,3,7],'5':[0,7],sus2:[0,2,7],sus4:[0,5,7],dim:[0,3,6],aug:[0,4,8],'6':[0,4,7,9],m6:[0,3,7,9],'7':[0,4,7,10],maj7:[0,4,7,11],m7:[0,3,7,10],mMaj7:[0,3,7,11],dim7:[0,3,6,9],m7b5:[0,3,6,10],add9:[0,4,7,14],madd9:[0,3,7,14],'9':[0,4,7,10,14],maj9:[0,4,7,11,14],m9:[0,3,7,10,14],'11':[0,4,7,10,14,17],m11:[0,3,7,10,14,17],'13':[0,4,7,10,14,21],m13:[0,3,7,10,14,17,21]};
const LABELS={major:'',minor:'m','5':'5',sus2:'sus2',sus4:'sus4',dim:'dim',aug:'aug','6':'6',m6:'m6','7':'7',maj7:'maj7',m7:'m7',mMaj7:'mMaj7',dim7:'dim7',m7b5:'m7♭5',add9:'add9',madd9:'m(add9)','9':'9',maj9:'maj9',m9:'m9','11':'11',m11:'m11','13':'13',m13:'m13'};
const DEGREE={0:'1',2:'9',3:'♭3',4:'3',5:'11',6:'♭5',7:'5',8:'♯5',9:'6',10:'♭7',11:'7',14:'9',17:'11',21:'13'};
const rootEl=document.querySelector('#pianoRoot');
const typeEl=document.querySelector('#pianoType');
const keyboard=document.querySelector('#keyboard');

function render(){
  const root=NOTES.indexOf(rootEl.value);
  const formula=FORMULAS[typeEl.value];
  const pcs=new Map();
  formula.forEach(interval=>pcs.set((root+interval)%12,DEGREE[interval]||String(interval)));

  document.querySelector('#pianoChordName').textContent=rootEl.value+LABELS[typeEl.value];
  document.querySelector('#pianoNotes').textContent=formula.map(interval=>NOTES[(root+interval)%12]).join(' ・ ');
  document.querySelector('#pianoDegrees').textContent=formula.map(interval=>DEGREE[interval]||interval).join(' ・ ');
  document.querySelector('#pianoBadges').innerHTML=`<span class="badge">${formula.length}音</span><span class="badge">ルート ${rootEl.value}</span><span class="badge">2オクターブ表示</span>`;

  keyboard.innerHTML='';
  const whitePitchClasses=[0,2,4,5,7,9,11];
  const blackAfterWhite={0:1,1:3,3:6,4:8,5:10};
  const totalWhiteKeys=14;
  const whiteWidth=100/totalWhiteKeys;

  for(let octave=0;octave<2;octave++){
    whitePitchClasses.forEach((pc,index)=>{
      const whiteIndex=octave*7+index;
      const key=document.createElement('div');
      const active=pcs.has(pc);
      key.className='white-key'+(active?' active':'')+(pc===root&&active?' root-active':'');
      key.style.left=`${whiteIndex*whiteWidth}%`;
      key.style.width=`${whiteWidth}%`;
      key.innerHTML=`<span class="key-label">${NOTES[pc]}${active?`<span class="key-degree">${pcs.get(pc)}</span>`:''}</span>`;
      keyboard.appendChild(key);

      if(Object.prototype.hasOwnProperty.call(blackAfterWhite,index)){
        const blackPc=blackAfterWhite[index];
        const black=document.createElement('div');
        const blackActive=pcs.has(blackPc);
        black.className='black-key'+(blackActive?' active':'')+(blackPc===root&&blackActive?' root-active':'');
        black.style.left=`${(whiteIndex+1)*whiteWidth}%`;
        black.style.width=`${whiteWidth*.62}%`;
        black.innerHTML=`<span class="key-label">${NOTES[blackPc]}${blackActive?`<span class="key-degree">${pcs.get(blackPc)}</span>`:''}</span>`;
        keyboard.appendChild(black);
      }
    });
  }
}

rootEl.addEventListener('change',render);
typeEl.addEventListener('change',render);
render();