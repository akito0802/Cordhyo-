(()=>{
'use strict';
const AC=window.AudioContext||window.webkitAudioContext;
const $=id=>document.getElementById(id);
const status=$('status');
const playBtn=$('playBtn');
const stopBtn=$('stopBtn');
const bypassBtn=$('bypassBtn');
const canvas=$('analyzerCanvas');
const canvasCtx=canvas?.getContext('2d');
const meter=$('outputMeter');
const meterValue=$('outputValue');
const heroState=$('heroState');
const liveDot=document.querySelector('.live-dot');
const frequencyLabels=$('frequencyLabels');
const analyzerHelp=$('analyzerHelp');
const newChallengeBtn=$('newChallengeBtn');
const challengeCompareBtn=$('challengeCompareBtn');
const challengeResult=$('challengeResult');
if(!AC||!status||!playBtn||!stopBtn||!bypassBtn||!canvas||!canvasCtx)return;

let ctx=null;
let master=null;
let low=null;
let mid=null;
let high=null;
let analyser=null;
let timer=null;
let animationId=null;
let nodes=[];
let selected='drums';
let playing=false;
let bypass=false;
let analyzerView='spectrum';
let frequencyData=null;
let waveformData=null;
let challenge=null;
let challengeActive=false;
let challengeOriginal=false;
let attempts=0;
let correct=0;
let streak=0;
let best=Number(localStorage.getItem('mixLabEqBest')||0);

const setStatus=text=>status.textContent=text;
const setPlayingUi=value=>{
  heroState?.classList.toggle('playing',value);
  if(heroState)heroState.textContent=value?'PLAYING':'READY';
  liveDot?.classList.toggle('active',value);
};

async function ensureAudio(){
  if(!ctx)ctx=new AC();
  if(ctx.state==='suspended')await ctx.resume();
  return ctx;
}

function stopNodes(){
  clearInterval(timer);timer=null;
  for(const node of nodes){try{node.stop?.()}catch{}try{node.disconnect?.()}catch{}}
  nodes=[];
}

function stopAll(){
  stopNodes();
  playing=false;
  playBtn.textContent='▶ 再生';
  setPlayingUi(false);
  setStatus('停止中');
}

function buildChain(){
  master=ctx.createGain();master.gain.value=.55;
  low=ctx.createBiquadFilter();low.type='lowshelf';low.frequency.value=160;
  mid=ctx.createBiquadFilter();mid.type='peaking';mid.frequency.value=1000;mid.Q.value=1;
  high=ctx.createBiquadFilter();high.type='highshelf';high.frequency.value=6000;
  analyser=ctx.createAnalyser();
  analyser.fftSize=2048;
  analyser.smoothingTimeConstant=.82;
  frequencyData=new Uint8Array(analyser.frequencyBinCount);
  waveformData=new Uint8Array(analyser.fftSize);
  applyAudioEq();
  low.connect(mid).connect(high).connect(master);
  master.connect(analyser).connect(ctx.destination);
  startVisualizer();
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
  stopNodes();
  if(!master)buildChain();
  applyAudioEq();
  playing=true;
  playBtn.textContent='⏸ 停止';
  setPlayingUi(true);
  setStatus(`再生中：${document.querySelector('.source-btn.active')?.textContent?.trim()||'内蔵音源'}`);
  const run=()=>schedulePattern(selected);
  run();timer=setInterval(run,2000);
}

function manualValues(){return{low:Number($('lowGain').value),mid:Number($('midGain').value),high:Number($('highGain').value)}}

function activeEqValues(){
  if(challengeActive&&challenge){
    if(challengeOriginal)return{low:0,mid:0,high:0};
    return{low:challenge.band==='low'?challenge.amount:0,mid:challenge.band==='mid'?challenge.amount:0,high:challenge.band==='high'?challenge.amount:0};
  }
  return manualValues();
}

function applyAudioEq(){
  const values=activeEqValues();
  if(low)low.gain.setTargetAtTime(values.low,ctx.currentTime,.015);
  if(mid)mid.gain.setTargetAtTime(values.mid,ctx.currentTime,.015);
  if(high)high.gain.setTargetAtTime(values.high,ctx.currentTime,.015);
}

function syncEq(){
  const values=manualValues();
  $('lowValue').textContent=`${values.low>0?'+':''}${values.low} dB`;
  $('midValue').textContent=`${values.mid>0?'+':''}${values.mid} dB`;
  $('highValue').textContent=`${values.high>0?'+':''}${values.high} dB`;
  if(!challengeActive)applyAudioEq();
}

function resizeCanvas(){
  const rect=canvas.getBoundingClientRect();
  const ratio=Math.min(window.devicePixelRatio||1,2);
  const width=Math.max(320,Math.floor(rect.width*ratio));
  const height=Math.max(180,Math.floor((rect.width*.33)*ratio));
  if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height}
}

function drawGrid(){
  const w=canvas.width,h=canvas.height;
  canvasCtx.clearRect(0,0,w,h);
  canvasCtx.fillStyle='#12191d';canvasCtx.fillRect(0,0,w,h);
  canvasCtx.strokeStyle='rgba(255,255,255,.08)';canvasCtx.lineWidth=1;
  for(let i=1;i<8;i++){const x=w*i/8;canvasCtx.beginPath();canvasCtx.moveTo(x,0);canvasCtx.lineTo(x,h);canvasCtx.stroke()}
  for(let i=1;i<5;i++){const y=h*i/5;canvasCtx.beginPath();canvasCtx.moveTo(0,y);canvasCtx.lineTo(w,y);canvasCtx.stroke()}
}

function drawSpectrum(){
  analyser.getByteFrequencyData(frequencyData);
  drawGrid();
  const w=canvas.width,h=canvas.height;
  const maxHz=20000;
  const nyquist=ctx.sampleRate/2;
  canvasCtx.beginPath();canvasCtx.moveTo(0,h);
  let peak=0;
  for(let x=0;x<w;x++){
    const normalized=x/Math.max(1,w-1);
    const hz=20*Math.pow(maxHz/20,normalized);
    const index=Math.min(frequencyData.length-1,Math.round(hz/nyquist*frequencyData.length));
    const value=frequencyData[index]/255;
    peak=Math.max(peak,value);
    canvasCtx.lineTo(x,h-(value*h*.88)-h*.03);
  }
  canvasCtx.lineTo(w,h);canvasCtx.closePath();
  const gradient=canvasCtx.createLinearGradient(0,0,0,h);
  gradient.addColorStop(0,'rgba(214,170,86,.9)');gradient.addColorStop(1,'rgba(214,170,86,.08)');
  canvasCtx.fillStyle=gradient;canvasCtx.fill();
  canvasCtx.strokeStyle='#e5bc69';canvasCtx.lineWidth=Math.max(2,window.devicePixelRatio||1);canvasCtx.stroke();
  updateMeter(peak);
}

function drawWaveform(){
  analyser.getByteTimeDomainData(waveformData);
  drawGrid();
  const w=canvas.width,h=canvas.height;
  canvasCtx.beginPath();canvasCtx.strokeStyle='#87b9c7';canvasCtx.lineWidth=Math.max(2,window.devicePixelRatio||1);
  let rms=0;const step=w/Math.max(1,waveformData.length-1);
  for(let i=0;i<waveformData.length;i++){
    const sample=(waveformData[i]-128)/128;rms+=sample*sample;
    const x=i*step,y=h/2+sample*h*.42;
    if(i===0)canvasCtx.moveTo(x,y);else canvasCtx.lineTo(x,y);
  }
  canvasCtx.stroke();updateMeter(Math.min(1,Math.sqrt(rms/waveformData.length)*2.2));
}

function updateMeter(level){
  const safe=Math.max(0,Math.min(1,level));
  if(meter)meter.style.width=`${safe*100}%`;
  if(meterValue){const db=safe>.001?20*Math.log10(safe):-Infinity;meterValue.textContent=Number.isFinite(db)?`${db.toFixed(1)} dB`:'-∞ dB'}
}

function startVisualizer(){
  cancelAnimationFrame(animationId);
  const render=()=>{
    resizeCanvas();
    if(analyser){if(analyzerView==='waveform')drawWaveform();else drawSpectrum()}else{drawGrid();updateMeter(0)}
    animationId=requestAnimationFrame(render);
  };
  render();
}

function updateScore(){
  const score=attempts?Math.round(correct/attempts*100):0;
  $('scoreValue').textContent=score;
  $('correctValue').textContent=correct;
  $('attemptValue').textContent=`/ ${attempts}問`;
  $('streakValue').textContent=streak;
  $('bestValue').textContent=best;
}

function setAnswersEnabled(value){document.querySelectorAll('#answerGrid button').forEach(btn=>{btn.disabled=!value;btn.classList.remove('correct','wrong')})}

function bandLabel(band){return band==='low'?'LOW（低域）':band==='mid'?'MID（中域）':'HIGH（高域）'}

async function newChallenge(){
  const bands=['low','mid','high'];
  const band=bands[Math.floor(Math.random()*bands.length)];
  const direction=Math.random()<.5?'boost':'cut';
  const magnitude=Math.random()<.55?6:9;
  challenge={band,direction,amount:direction==='boost'?magnitude:-magnitude};
  challengeActive=true;challengeOriginal=false;
  selected=['drums','bass','keys','mix'][Math.floor(Math.random()*4)];
  document.querySelectorAll('.source-btn').forEach(btn=>btn.classList.toggle('active',btn.dataset.source===selected));
  $('challengeTitle').textContent=`第${attempts+1}問：どこが変わった？`;
  $('challengeText').textContent='原音と変化後を聴き比べて、変化した帯域と方向を選んでね。';
  challengeCompareBtn.disabled=false;
  challengeCompareBtn.textContent='現在：変化後の音';
  challengeResult.className='challenge-result';
  challengeResult.textContent='回答を選んでね。';
  setAnswersEnabled(true);
  bypass=false;bypassBtn.classList.remove('active');bypassBtn.setAttribute('aria-pressed','false');bypassBtn.textContent='EQ ON（クリックで原音比較）';
  await start();
}

function answerChallenge(button){
  if(!challengeActive||!challenge)return;
  const isCorrect=button.dataset.band===challenge.band&&button.dataset.direction===challenge.direction;
  attempts++;
  if(isCorrect){correct++;streak++;best=Math.max(best,streak);localStorage.setItem('mixLabEqBest',String(best))}else{streak=0}
  const correctButton=document.querySelector(`#answerGrid button[data-band="${challenge.band}"][data-direction="${challenge.direction}"]`);
  correctButton?.classList.add('correct');
  if(!isCorrect)button.classList.add('wrong');
  setAnswersEnabled(false);
  const directionText=challenge.direction==='boost'?'上げた':'下げた';
  challengeResult.className=`challenge-result ${isCorrect?'success':'failure'}`;
  challengeResult.textContent=isCorrect?`正解！ ${bandLabel(challenge.band)}を${Math.abs(challenge.amount)} dB ${directionText}音だったよ。`:`惜しい！ 正解は${bandLabel(challenge.band)}を${Math.abs(challenge.amount)} dB ${directionText}音。原音ともう一度比べてみよう。`;
  $('challengeTitle').textContent=isCorrect?'🎉 正解！':'💡 答えを確認';
  newChallengeBtn.textContent='次の問題へ';
  updateScore();
}

for(const id of ['lowGain','midGain','highGain'])$(id).addEventListener('input',syncEq);

document.querySelectorAll('.source-btn').forEach(btn=>btn.addEventListener('click',async()=>{
  challengeActive=false;challenge=null;challengeOriginal=false;
  challengeCompareBtn.disabled=true;setAnswersEnabled(false);
  selected=btn.dataset.source;
  document.querySelectorAll('.source-btn').forEach(x=>x.classList.toggle('active',x===btn));
  try{await start()}catch(error){console.error(error);setStatus(`再生エラー：${error.name||'不明'}`)}
}));

document.querySelectorAll('.analyzer-tab').forEach(btn=>btn.addEventListener('click',()=>{
  analyzerView=btn.dataset.view;
  document.querySelectorAll('.analyzer-tab').forEach(x=>x.classList.toggle('active',x===btn));
  frequencyLabels?.classList.toggle('hidden',analyzerView==='waveform');
  if(analyzerHelp)analyzerHelp.textContent=analyzerView==='waveform'?'中央線を基準に、音の振幅と時間変化を表示しているよ。':'横軸が周波数、縦軸が音量。EQを動かすと音の山が変化するよ。';
}));

playBtn.addEventListener('click',async()=>{if(playing)stopAll();else{try{await start()}catch(error){console.error(error);setStatus(`再生エラー：${error.name||'不明'}`)}}});
stopBtn.addEventListener('click',stopAll);
bypassBtn.addEventListener('click',()=>{
  if(challengeActive)return;
  bypass=!bypass;
  bypassBtn.classList.toggle('active',bypass);
  bypassBtn.setAttribute('aria-pressed',String(bypass));
  bypassBtn.textContent=bypass?'原音再生中（クリックでEQ ON）':'EQ ON（クリックで原音比較）';
  setStatus(bypass?'A/B比較：現在は原音':'A/B比較：現在はEQ処理後');
});
$('resetBtn').addEventListener('click',()=>{$('lowGain').value=0;$('midGain').value=0;$('highGain').value=0;syncEq();setStatus('EQを0 dBに戻したよ')});
newChallengeBtn?.addEventListener('click',()=>newChallenge().catch(error=>{console.error(error);challengeResult.textContent='問題を開始できなかったよ。もう一度押してみてね。'}));
challengeCompareBtn?.addEventListener('click',()=>{
  if(!challengeActive)return;
  challengeOriginal=!challengeOriginal;applyAudioEq();
  challengeCompareBtn.textContent=challengeOriginal?'現在：原音':'現在：変化後の音';
});
document.querySelectorAll('#answerGrid button').forEach(btn=>btn.addEventListener('click',()=>answerChallenge(btn)));
window.addEventListener('resize',resizeCanvas,{passive:true});
updateScore();syncEq();startVisualizer();
})();