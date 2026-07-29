const NOTES=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const FORMULAS={major:[0,4,7],minor:[0,3,7],'5':[0,7],sus2:[0,2,7],sus4:[0,5,7],dim:[0,3,6],aug:[0,4,8],'6':[0,4,7,9],m6:[0,3,7,9],'7':[0,4,7,10],maj7:[0,4,7,11],m7:[0,3,7,10],mMaj7:[0,3,7,11],dim7:[0,3,6,9],m7b5:[0,3,6,10],add9:[0,4,7,14],madd9:[0,3,7,14],'9':[0,4,7,10,14],maj9:[0,4,7,11,14],m9:[0,3,7,10,14],'11':[0,4,7,10,14,17],m11:[0,3,7,10,14,17],'13':[0,4,7,10,14,21],m13:[0,3,7,10,14,17,21]};
const LABELS={major:'',minor:'m','5':'5',sus2:'sus2',sus4:'sus4',dim:'dim',aug:'aug','6':'6',m6:'m6','7':'7',maj7:'maj7',m7:'m7',mMaj7:'mMaj7',dim7:'dim7',m7b5:'m7♭5',add9:'add9',madd9:'m(add9)','9':'9',maj9:'maj9',m9:'m9','11':'11',m11:'m11','13':'13',m13:'m13'};
const DEGREE={0:'1',2:'9',3:'♭3',4:'3',5:'11',6:'♭5',7:'5',8:'♯5',9:'6',10:'♭7',11:'7',14:'9',17:'11',21:'13'};
const DESCRIPTIONS={major:'明るく安定した響き。ポップスやロックで最も基本になるコード。',minor:'少し切なく落ち着いた響き。暗さや感情的な雰囲気を出しやすいコード。','5':'3度を省いた力強い響き。ロックやギターリフでよく使われる。',sus2:'3度を2度に置き換えた、透明感のある響き。',sus4:'3度を4度に置き換えた、浮遊感と期待感のある響き。',dim:'不安定で緊張感の強い響き。次のコードへつなぐ時に使いやすい。',aug:'5度を半音上げた、不思議で広がりのある響き。','6':'メジャーコードに6度を加えた、柔らかく少し洒落た響き。',m6:'マイナーコードに6度を加えた、落ち着きと哀愁のある響き。','7':'メジャーコードに短7度を加えた、次へ進みたくなる緊張感のある響き。',maj7:'透明感があり、都会的で上品な響き。',m7:'やわらかく落ち着いた、ジャズやR&Bでも定番の響き。',mMaj7:'マイナーの暗さに大7度の緊張感が加わった、ミステリアスな響き。',dim7:'強い緊張感を持ち、半音進行で次のコードへつなぎやすい。',m7b5:'暗く不安定な響き。マイナーキーの進行でよく使われる。',add9:'メジャーコードに9度を足した、爽やかで広がりのある響き。',madd9:'マイナーコードに9度を足した、切なく透明感のある響き。','9':'7thコードに9度を加えた、ファンクやジャズらしい厚みのある響き。',maj9:'maj7に9度を加えた、上品で柔らかい響き。',m9:'m7に9度を加えた、深く滑らかな響き。','11':'9thコードに11度を加えた、広がりと浮遊感のある響き。',m11:'マイナー系で特に自然に響く、柔らかく広がりのあるコード。','13':'7thコードに13度を加えた、華やかでジャジーな響き。',m13:'マイナーの落ち着きに13度の色彩を加えた、深みのある響き。'};
const rootEl=document.querySelector('#pianoRoot');
const typeEl=document.querySelector('#pianoType');
const keyboard=document.querySelector('#keyboard');
const octaveLabel=document.querySelector('#octaveLabel');
const playChordButton=document.querySelector('#playChord');
let audioContext;

function getAudioContext(){
  if(!audioContext) audioContext=new (window.AudioContext||window.webkitAudioContext)();
  if(audioContext.state==='suspended') audioContext.resume();
  return audioContext;
}

function playMidi(midi,duration=.7,delay=0){
  const context=getAudioContext();
  const oscillator=context.createOscillator();
  const gain=context.createGain();
  const start=context.currentTime+delay;
  oscillator.type='triangle';
  oscillator.frequency.value=440*Math.pow(2,(midi-69)/12);
  gain.gain.setValueAtTime(.0001,start);
  gain.gain.exponentialRampToValueAtTime(.18,start+.025);
  gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start+duration+.05);
}

function flashPitchClass(pc){
  keyboard.querySelectorAll(`[data-pc="${pc}"]`).forEach(key=>{
    key.classList.remove('key-flash');
    void key.offsetWidth;
    key.classList.add('key-flash');
    setTimeout(()=>key.classList.remove('key-flash'),180);
  });
}

function playPitchClass(pc,octave=4){
  playMidi(12*(octave+1)+pc,.65);
  flashPitchClass(pc);
}

function render(){
  const root=NOTES.indexOf(rootEl.value);
  const formula=FORMULAS[typeEl.value];
  const octaveCount=Math.max(...formula)<=11?1:2;
  const pcs=new Map();
  formula.forEach(interval=>pcs.set((root+interval)%12,DEGREE[interval]||String(interval)));

  document.querySelector('#pianoChordName').textContent=rootEl.value+LABELS[typeEl.value];
  document.querySelector('#pianoDegrees').textContent=formula.map(interval=>DEGREE[interval]||interval).join(' ・ ');
  document.querySelector('#pianoBadges').innerHTML=`<span class="badge">${formula.length}音</span><span class="badge">ルート ${rootEl.value}</span><span class="badge">${octaveCount}オクターブ表示</span>`;
  document.querySelector('#pianoDescription').textContent=DESCRIPTIONS[typeEl.value]||'コードの構成音を鍵盤で確認できるよ。';

  const notesBox=document.querySelector('#pianoNotes');
  notesBox.innerHTML=formula.map((interval,index)=>{
    const pc=(root+interval)%12;
    const rootClass=index===0?' root':'';
    return `<button type="button" class="note-chip${rootClass}" data-pc="${pc}" data-octave="${4+Math.floor((root+interval)/12)}">${NOTES[pc]}</button>`;
  }).join('');
  notesBox.querySelectorAll('.note-chip').forEach(button=>button.addEventListener('click',()=>playPitchClass(Number(button.dataset.pc),Number(button.dataset.octave))));

  octaveLabel.textContent=`${octaveCount} OCTAVE${octaveCount===1?'':'S'}`;
  keyboard.setAttribute('aria-label',`${octaveCount}オクターブのピアノ鍵盤`);
  keyboard.classList.toggle('single-octave',octaveCount===1);
  keyboard.innerHTML='';

  const whitePitchClasses=[0,2,4,5,7,9,11];
  const blackAfterWhite={0:1,1:3,3:6,4:8,5:10};
  const totalWhiteKeys=7*octaveCount;
  const whiteWidth=100/totalWhiteKeys;

  for(let octave=0;octave<octaveCount;octave++){
    whitePitchClasses.forEach((pc,index)=>{
      const whiteIndex=octave*7+index;
      const key=document.createElement('div');
      const active=pcs.has(pc);
      key.className='white-key'+(active?' active':'')+(pc===root&&active?' root-active':'');
      key.style.left=`${whiteIndex*whiteWidth}%`;
      key.style.width=`${whiteWidth}%`;
      key.dataset.pc=pc;
      key.dataset.octave=4+octave;
      key.setAttribute('role','button');
      key.setAttribute('tabindex','0');
      key.setAttribute('aria-label',`${NOTES[pc]}の音を鳴らす`);
      key.innerHTML=`<span class="key-label">${NOTES[pc]}${active?`<span class="key-degree">${pcs.get(pc)}</span>`:''}</span>`;
      const play=()=>playPitchClass(pc,4+octave);
      key.addEventListener('click',play);
      key.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();play();}});
      keyboard.appendChild(key);

      if(Object.prototype.hasOwnProperty.call(blackAfterWhite,index)){
        const blackPc=blackAfterWhite[index];
        const black=document.createElement('div');
        const blackActive=pcs.has(blackPc);
        black.className='black-key'+(blackActive?' active':'')+(blackPc===root&&blackActive?' root-active':'');
        black.style.left=`${(whiteIndex+1)*whiteWidth}%`;
        black.style.width=`${whiteWidth*.62}%`;
        black.dataset.pc=blackPc;
        black.dataset.octave=4+octave;
        black.setAttribute('role','button');
        black.setAttribute('tabindex','0');
        black.setAttribute('aria-label',`${NOTES[blackPc]}の音を鳴らす`);
        black.innerHTML=`<span class="key-label">${NOTES[blackPc]}${blackActive?`<span class="key-degree">${pcs.get(blackPc)}</span>`:''}</span>`;
        const playBlack=()=>playPitchClass(blackPc,4+octave);
        black.addEventListener('click',playBlack);
        black.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();playBlack();}});
        keyboard.appendChild(black);
      }
    });
  }
}

playChordButton.addEventListener('click',()=>{
  const root=NOTES.indexOf(rootEl.value);
  const formula=FORMULAS[typeEl.value];
  formula.forEach((interval,index)=>{
    const midi=60+root+interval;
    playMidi(midi,1,index*.035);
    setTimeout(()=>flashPitchClass((root+interval)%12),index*35);
  });
});
rootEl.addEventListener('change',render);
typeEl.addEventListener('change',render);
render();