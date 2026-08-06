(()=>{
'use strict';
const AC=window.AudioContext||window.webkitAudioContext;
const $=id=>document.getElementById(id);
const status=$('status');
const playBtn=$('playBtn');
const stopBtn=$('stopBtn');
const bypassBtn=$('bypassBtn');
if(!AC||!status||!playBtn||!stopBtn||!bypassBtn)return;

let ctx=null;
let master=null;
let low=null;
let mid=null;
let high=null;
let timer=null;
let nodes=[];
let selected='drums';
let playing=false;
let bypass=false;

const setStatus=text=>status.textContent=text;

async function ensureAudio(){
  if(!ctx)ctx=new AC();
  if(ctx.state==='suspended')await ctx.resume();
  return ctx;
}

function stopAll(){
  clearInterval(timer);timer=null;
  for(const node of nodes){try{node.stop?.()}catch{}try{node.disconnect?.()}catch{}}
  nodes=[];
  playing=false;
  playBtn.textContent='▶ 再生';
  setStatus('停止中');
}

function buildChain(){
  master=ctx.createGain();master.gain.value=.55;
  low=ctx.createBiquadFilter();low.type='lowshelf';low.frequency.value=160;
  mid=ctx.createBiquadFilter();mid.type='peaking';mid.frequency.value=1000;mid.Q.value=1;
  high=ctx.createBiquadFilter();high.type='highshelf';high.frequency.value=6000;
  syncEq();
  low.connect(mid).connect(high).connect(master).connect(ctx.destination);
}

function destinationNode(){return bypass?master:low}

function tone(freq,start,duration,type='sine',volume=.12){
  const osc=ctx.createOscillator();
  const gain=ctx.createGain();
  osc.type=type;osc.frequency.setValueAtTime(freq,start);
  gain.gain.setValueAtTime(.0001,start);
  gain.gain.exponentialRampToValueAtTime(volume,start+.01);
  gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
  osc.connect(gain).connect(destinationNode());
  osc.start(start);osc.stop(start+duration+.03);
  nodes.push(osc,gain);
}

function noise(start,duration=.08,volume=.08){
  const length=Math.max(1,Math.floor(ctx.sampleRate*duration));
  const buffer=ctx.createBuffer(1,length,ctx.sampleRate);
  const data=buffer.getChannelData(0);
  for(let i=0;i<length;i++)data[i]=Math.random()*2-1;
  const src=ctx.createBufferSource();const gain=ctx.createGain();
  src.buffer=buffer;gain.gain.setValueAtTime(volume,start);gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
  src.connect(gain).connect(destinationNode());src.start(start);
  nodes.push(src,gain);
}

function schedulePattern(kind){
  const at=ctx.currentTime+.05;
  const bass=[55,55,65.41,65.41,73.42,73.42,82.41,82.41];
  const lead=[261.63,329.63,392,329.63,293.66,349.23,392,349.23];
  for(let i=0;i<8;i++){
    const t=at+i*.25;
    if(kind==='drums'||kind==='mix'){
      if(i%4===0)tone(58,t,.14,'sine',.35);
      if(i===2||i===6)noise(t,.13,.16);
      noise(t,.035,.045);
    }
    if(kind==='bass'||kind==='mix')tone(bass[i],t,.22,'sawtooth',.12);
    if(kind==='keys'||kind==='mix')tone(lead[i],t,.18,'triangle',.09);
  }
}

async function start(){
  await ensureAudio();
  stopAll();
  buildChain();
  playing=true;
  playBtn.textContent='⏸ 停止';
  setStatus(`再生中：${document.querySelector('.source-btn.active')?.textContent||'内蔵音源'}`);
  const run=()=>schedulePattern(selected);
  run();timer=setInterval(run,2000);
}

function syncEq(){
  const lv=Number($('lowGain').value);const mv=Number($('midGain').value);const hv=Number($('highGain').value);
  $('lowValue').textContent=`${lv>0?'+':''}${lv} dB`;
  $('midValue').textContent=`${mv>0?'+':''}${mv} dB`;
  $('highValue').textContent=`${hv>0?'+':''}${hv} dB`;
  if(low)low.gain.value=lv;if(mid)mid.gain.value=mv;if(high)high.gain.value=hv;
}

for(const id of ['lowGain','midGain','highGain'])$(id).addEventListener('input',syncEq);

document.querySelectorAll('.source-btn').forEach(btn=>btn.addEventListener('click',async()=>{
  selected=btn.dataset.source;
  document.querySelectorAll('.source-btn').forEach(x=>x.classList.toggle('active',x===btn));
  try{await start()}catch(error){console.error(error);setStatus(`再生エラー：${error.name||'不明'}`)}
}));

playBtn.addEventListener('click',async()=>{if(playing)stopAll();else{try{await start()}catch(error){setStatus(`再生エラー：${error.name||'不明'}`)}}});
stopBtn.addEventListener('click',stopAll);
bypassBtn.addEventListener('click',async()=>{bypass=!bypass;bypassBtn.classList.toggle('active',bypass);bypassBtn.textContent=bypass?'EQバイパス中（原音）':'EQを有効にする';if(playing)await start()});
$('resetBtn').addEventListener('click',()=>{$('lowGain').value=0;$('midGain').value=0;$('highGain').value=0;syncEq()});
syncEq();
})();