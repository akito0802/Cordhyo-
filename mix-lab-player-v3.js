(()=>{
'use strict';
const $=id=>document.getElementById(id);
const input=$('audioFile');
const playBtn=$('playBtn');
const stopBtn=$('stopBtn');
const fileName=$('fileName');
const status=$('playbackStatus');
const AC=window.AudioContext||window.webkitAudioContext;
if(!input||!playBtn||!stopBtn||!fileName||!AC)return;

let ctx=null;
let buffer=null;
let source=null;
let filter=null;
let master=null;
let offset=0;
let startedAt=0;
let playing=false;
let loop=true;

async function ensureAudio(){
  if(!ctx) ctx=new AC();
  if(ctx.state==='suspended') await ctx.resume();
  return ctx;
}

function setStatus(text){
  if(status) status.textContent=text;
}

function stop(reset=true){
  if(source){
    source.onended=null;
    try{source.stop();}catch{}
    try{source.disconnect();}catch{}
  }
  source=null;
  playing=false;
  if(reset) offset=0;
  playBtn.textContent='▶ 再生';
}

function currentTime(){
  if(!playing||!ctx) return offset;
  return Math.min(buffer?.duration||0,offset+(ctx.currentTime-startedAt));
}

function makePracticeBuffer(kind){
  const sr=ctx.sampleRate;
  const duration=6;
  const length=Math.floor(sr*duration);
  const out=ctx.createBuffer(2,length,sr);
  const left=out.getChannelData(0);
  const right=out.getChannelData(1);
  let seed=15731;
  const noise=()=>{seed=(seed*16807)%2147483647;return seed/1073741823.5-1;};

  for(let i=0;i<length;i++){
    const t=i/sr;
    const beatPhase=t%0.5;
    const eighthPhase=t%0.25;
    const kick=beatPhase<0.28
      ?Math.sin(2*Math.PI*(52+95*Math.exp(-beatPhase*22))*beatPhase)*Math.exp(-beatPhase*15)
      :0;
    const snareBeat=Math.floor(t/0.5)%4;
    const snare=(snareBeat===1||snareBeat===3)&&beatPhase<0.18
      ?(noise()*0.55+Math.sin(2*Math.PI*185*beatPhase)*0.25)*Math.exp(-beatPhase*20)
      :0;
    const hat=eighthPhase<0.045?noise()*Math.exp(-eighthPhase*75)*0.18:0;
    const bassSteps=[0,0,3,3,5,5,7,7];
    const bassFreq=55*Math.pow(2,bassSteps[Math.floor(t/0.5)%8]/12);
    const bass=(Math.sin(2*Math.PI*bassFreq*t)+0.25*Math.sin(4*Math.PI*bassFreq*t))*0.34;
    const leadNotes=[330,392,440,392,349,330,294,262];
    const leadFreq=leadNotes[Math.floor(t/0.5)%8];
    const lead=Math.sin(2*Math.PI*leadFreq*t)*0.16;

    let value=0;
    switch(kind){
      case 'drums': value=kick+snare+hat; break;
      case 'bass': value=bass; break;
      case 'vocal': value=lead+0.22*Math.sin(2*Math.PI*leadFreq*2*t); break;
      case 'muddy': value=bass*1.45+lead*0.5+0.22*Math.sin(2*Math.PI*240*t); break;
      case 'harsh': value=lead+hat*1.6+0.14*Math.sin(2*Math.PI*4200*t); break;
      default: value=kick+snare+hat+bass+lead;
    }
    value=Math.max(-1,Math.min(1,value*0.72));
    left[i]=value;
    right[i]=value;
  }
  return out;
}

async function start(at=offset){
  if(!buffer){
    setStatus('先に内蔵音源か自分の音源を選んでね。');
    return false;
  }
  await ensureAudio();
  stop(false);
  offset=Math.max(0,Math.min(at,Math.max(0,buffer.duration-0.01)));

  source=ctx.createBufferSource();
  source.buffer=buffer;
  source.loop=loop;

  filter=ctx.createBiquadFilter();
  filter.type='peaking';
  filter.frequency.value=Number($('eqFreq')?.value||1000);
  filter.gain.value=Number($('eqGain')?.value||0);
  filter.Q.value=Number($('eqQ')?.value||1);

  master=ctx.createGain();
  master.gain.value=0.9;
  source.connect(filter).connect(master).connect(ctx.destination);
  source.start(0,offset);
  startedAt=ctx.currentTime;
  playing=true;
  playBtn.textContent='⏸ 一時停止';
  setStatus(`再生中：${fileName.textContent}`);
  source.onended=()=>{
    if(!loop&&playing){
      stop(true);
      setStatus('再生終了');
    }
  };
  return true;
}

async function generateAndPlay(button){
  button.disabled=true;
  const original=button.textContent;
  button.textContent='生成中…';
  setStatus('音源を生成中…');
  try{
    await ensureAudio();
    stop(true);
    buffer=makePracticeBuffer(button.dataset.kind||'full');
    fileName.textContent=button.dataset.name||'内蔵練習音源';
    offset=0;
    document.querySelectorAll('.sample-card').forEach(card=>card.classList.remove('selected'));
    button.closest('.sample-card')?.classList.add('selected');
    await start(0);
    document.querySelectorAll('[data-kind]').forEach(btn=>{
      btn.textContent=btn===button?'⏸ 再生中':'▶ 再生';
    });
  }catch(error){
    console.error('Mix Lab playback error',error);
    setStatus(`再生エラー：${error?.name||'不明'}`);
    button.textContent=original;
  }finally{
    button.disabled=false;
  }
}

document.querySelectorAll('[data-kind]').forEach(button=>{
  button.addEventListener('click',()=>generateAndPlay(button));
});

playBtn.addEventListener('click',async event=>{
  event.preventDefault();
  if(playing){
    offset=currentTime();
    stop(false);
    setStatus('一時停止中');
  }else{
    await start(offset);
  }
});

stopBtn.addEventListener('click',event=>{
  event.preventDefault();
  stop(true);
  setStatus('停止中');
});

input.addEventListener('change',async()=>{
  const file=input.files?.[0];
  if(!file)return;
  try{
    await ensureAudio();
    stop(true);
    setStatus('音源を読み込み中…');
    const arrayBuffer=await file.arrayBuffer();
    buffer=await ctx.decodeAudioData(arrayBuffer.slice(0));
    fileName.textContent=file.name;
    offset=0;
    setStatus('読み込み完了。再生ボタンを押してね。');
  }catch(error){
    console.error('Audio decode error',error);
    buffer=null;
    fileName.textContent='音源の読み込みに失敗';
    setStatus(`読み込みエラー：${error?.name||'不明'}`);
  }
});

const transport=document.querySelector('.transport');
if(transport&&!$('loopBtn')){
  const loopBtn=document.createElement('button');
  loopBtn.id='loopBtn';
  loopBtn.type='button';
  loopBtn.textContent='🔁 ループ ON';
  loopBtn.addEventListener('click',()=>{
    loop=!loop;
    loopBtn.textContent=loop?'🔁 ループ ON':'➡ ループ OFF';
    loopBtn.classList.toggle('sub',!loop);
    if(source) source.loop=loop;
  });
  stopBtn.after(loopBtn);
}

const eqControls=[
  ['eqFreq','freqValue',value=>`${Math.round(value)} Hz`],
  ['eqGain','gainValue',value=>`${value>0?'+':''}${value} dB`],
  ['eqQ','qValue',value=>Number(value).toFixed(1)]
];
function syncEq(){
  eqControls.forEach(([id,out,format])=>{
    const control=$(id);
    if(control&&$(out)) $(out).textContent=format(Number(control.value));
  });
  if(filter){
    filter.frequency.value=Number($('eqFreq').value);
    filter.gain.value=Number($('eqGain').value);
    filter.Q.value=Number($('eqQ').value);
  }
}
eqControls.forEach(([id])=>$(id)?.addEventListener('input',syncEq));
$('eqReset')?.addEventListener('click',()=>{
  $('eqFreq').value=1000;
  $('eqGain').value=0;
  $('eqQ').value=1;
  syncEq();
});
syncEq();

document.querySelectorAll('.lab-tabs button').forEach(button=>{
  button.addEventListener('click',()=>{
    document.querySelectorAll('.lab-tabs button').forEach(item=>item.classList.toggle('active',item===button));
    document.querySelectorAll('.lab-panel').forEach(panel=>panel.classList.toggle('active',panel.id===`panel-${button.dataset.panel}`));
  });
});
})();
