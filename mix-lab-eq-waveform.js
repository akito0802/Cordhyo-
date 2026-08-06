(()=>{'use strict';
const input=document.getElementById('audioFile');
const panel=document.getElementById('panel-eq');
if(!input||!panel||document.getElementById('eqWaveformCanvas'))return;
let audioBuffer=null,peaks=null,raf=0,loadToken=0;
const card=document.createElement('section');
card.className='eq-waveform-card';
card.innerHTML=`<div class="eq-waveform-head"><div><h3>音源波形</h3><p>全体の音量変化と再生位置を見ながらEQを調整できるよ。</p></div><span id="eqWaveformTime" class="eq-waveform-time">0:00 / 0:00</span></div><div id="eqWaveformStage" class="eq-waveform-stage"><canvas id="eqWaveformCanvas" class="eq-waveform-canvas" width="1200" height="260" aria-label="選択中音源の波形"></canvas><div class="eq-waveform-empty">音源を選ぶと、ここに波形が表示されるよ</div></div><p class="eq-waveform-hint">波形をタップすると、その位置へ移動するよ。</p>`;
const head=panel.querySelector('.panel-head');
head?.insertAdjacentElement('afterend',card);
const canvas=document.getElementById('eqWaveformCanvas');
const stage=document.getElementById('eqWaveformStage');
const time=document.getElementById('eqWaveformTime');
const g=canvas.getContext('2d');
const fmt=s=>{s=Math.max(0,s||0);const m=Math.floor(s/60),x=Math.floor(s%60);return `${m}:${String(x).padStart(2,'0')}`};
function makePeaks(buffer,bins=1200){const channels=buffer.numberOfChannels,step=Math.max(1,Math.floor(buffer.length/bins)),out=new Float32Array(bins);for(let i=0;i<bins;i++){let max=0;const start=i*step,end=Math.min(buffer.length,start+step),stride=Math.max(1,Math.floor(step/40));for(let c=0;c<channels;c++){const data=buffer.getChannelData(c);for(let j=start;j<end;j+=stride)max=Math.max(max,Math.abs(data[j]))}out[i]=max}return out}
function draw(){const w=canvas.width,h=canvas.height;g.clearRect(0,0,w,h);g.fillStyle='#171717';g.fillRect(0,0,w,h);g.strokeStyle='rgba(255,255,255,.12)';g.lineWidth=1;g.beginPath();g.moveTo(0,h/2);g.lineTo(w,h/2);g.stroke();if(peaks){g.strokeStyle='#d9c7a8';g.lineWidth=1.6;g.beginPath();for(let i=0;i<peaks.length;i++){const x=i/(peaks.length-1)*w,a=peaks[i]*h*.43;g.moveTo(x,h/2-a);g.lineTo(x,h/2+a)}g.stroke()}const seek=document.getElementById('proSeek'),ratio=seek?Math.max(0,Math.min(1,+seek.value/1000)):0;g.fillStyle='rgba(217,199,168,.14)';g.fillRect(0,0,w*ratio,h);g.strokeStyle='#fff4df';g.lineWidth=3;g.beginPath();g.moveTo(w*ratio,0);g.lineTo(w*ratio,h);g.stroke();const duration=audioBuffer?.duration||0;time.textContent=`${fmt(duration*ratio)} / ${fmt(duration)}`;raf=requestAnimationFrame(draw)}
async function decodeForWaveform(data){
 const OfflineCtx=window.OfflineAudioContext||window.webkitOfflineAudioContext;
 if(OfflineCtx){
  const offline=new OfflineCtx(1,1,44100);
  return await offline.decodeAudioData(data.slice(0));
 }
 const TempCtx=window.AudioContext||window.webkitAudioContext;
 const temp=new TempCtx();
 try{return await temp.decodeAudioData(data.slice(0))}finally{try{await temp.close()}catch{}}
}
async function load(file){if(!file)return;const token=++loadToken;stage.classList.remove('ready');try{const data=await file.arrayBuffer();const decoded=await decodeForWaveform(data);if(token!==loadToken)return;audioBuffer=decoded;peaks=makePeaks(audioBuffer);stage.classList.add('ready')}catch(e){if(token!==loadToken)return;audioBuffer=null;peaks=null;stage.classList.remove('ready')}}
input.addEventListener('change',e=>load(e.target.files?.[0]));
stage.addEventListener('pointerdown',e=>{if(!audioBuffer)return;const r=stage.getBoundingClientRect(),ratio=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),seek=document.getElementById('proSeek');if(seek){seek.value=Math.round(ratio*1000);seek.dispatchEvent(new Event('input',{bubbles:true}))}});
window.addEventListener('pagehide',()=>cancelAnimationFrame(raf),{once:true});
draw();
})();