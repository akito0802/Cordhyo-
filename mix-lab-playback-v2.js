(()=>{
'use strict';
if(window.__MIXLAB_PLAYBACK_V2__)return;window.__MIXLAB_PLAYBACK_V2__=true;

const oldInput=document.getElementById('audioFile');
const oldPlay=document.getElementById('playBtn');
const oldStop=document.getElementById('stopBtn');
if(!oldInput||!oldPlay||!oldStop)return;

// 旧コードのイベントを完全に外す
const input=oldInput.cloneNode(true);oldInput.replaceWith(input);
const playBtn=oldPlay.cloneNode(true);oldPlay.replaceWith(playBtn);
const stopBtn=oldStop.cloneNode(true);oldStop.replaceWith(stopBtn);

const audio=document.createElement('audio');
audio.id='mixLabAudioV2';audio.preload='auto';audio.playsInline=true;audio.setAttribute('playsinline','');audio.style.display='none';document.body.appendChild(audio);
let url='';
const release=()=>{audio.pause();if(url){URL.revokeObjectURL(url);url='';}};
const fmt=s=>{s=Number.isFinite(s)?Math.max(0,s):0;const m=Math.floor(s/60),x=Math.floor(s%60);return `${m}:${String(x).padStart(2,'0')}`};
const setStatus=t=>{const f=document.getElementById('fileName');if(f)f.textContent=t;const n=document.querySelector('.source-now strong');if(n)n.textContent=t;};
function useBlob(blob,name){release();url=URL.createObjectURL(blob);audio.src=url;audio.load();playBtn.textContent='▶ 再生';setStatus(name);window.dispatchEvent(new CustomEvent('mixlab-audio-ready',{detail:{blob,name}}));}
input.addEventListener('change',()=>{const file=input.files?.[0];if(file)useBlob(file,file.name)});

function loopState(){const b=document.getElementById('loopBtn');return !b||b.getAttribute('aria-pressed')!=='false'}
playBtn.addEventListener('click',async e=>{e.preventDefault();e.stopImmediatePropagation();if(!audio.src){alert('先に音源を選んでね');return}audio.loop=loopState();try{if(audio.paused){await audio.play();playBtn.textContent='⏸ 一時停止'}else{audio.pause();playBtn.textContent='▶ 再生'}}catch(err){console.error(err);alert('再生できなかったよ。音源を選び直してもう一度押してね')}} ,true);
stopBtn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();audio.pause();audio.currentTime=0;playBtn.textContent='▶ 再生';},true);

audio.addEventListener('play',()=>playBtn.textContent='⏸ 一時停止');
audio.addEventListener('pause',()=>{if(!audio.ended)playBtn.textContent='▶ 再生'});
audio.addEventListener('ended',()=>playBtn.textContent='▶ 再生');
audio.addEventListener('timeupdate',()=>{const seek=document.getElementById('proSeek'),time=document.getElementById('proTime');if(seek&&audio.duration>0)seek.value=Math.round(audio.currentTime/audio.duration*1000);if(time)time.textContent=`${fmt(audio.currentTime)} / ${fmt(audio.duration)}`;});
const seek=document.getElementById('proSeek');if(seek)seek.addEventListener('input',()=>{if(audio.duration>0)audio.currentTime=audio.duration*(+seek.value/1000)},true);

// iPhoneでDataTransferを使わず、内蔵音源を直接生成してプレイヤーへ渡す
const SR=44100,DUR=8,clamp=v=>Math.max(-1,Math.min(1,v));
function makeWav(kind){const n=SR*DUR,L=new Float32Array(n),R=new Float32Array(n);let seed=91;const rnd=()=>((seed=seed*16807%2147483647)/1073741823.5-1);for(let i=0;i<n;i++){const t=i/SR,beat=t%0.5,step=Math.floor(t/0.5),root=[55,55,65.4,65.4,73.4,73.4,82.4,82.4][step%8];let v=0;const kick=Math.sin(2*Math.PI*(55+100*Math.exp(-beat*22))*beat)*Math.exp(-beat*16);const sn=(step%4===1||step%4===3)?rnd()*Math.exp(-beat*25):0;const hat=rnd()*Math.exp(-(t%0.25)*55)*0.18;const bass=(Math.sin(2*Math.PI*root*t)+.25*Math.sin(4*Math.PI*root*t))*.35;const lead=Math.sin(2*Math.PI*[330,392,440,392][step%4]*t)*.15;switch(kind){case'drums':v=kick+sn*.5+hat;break;case'bass':v=bass*1.3;break;case'vocal':v=(Math.sin(2*Math.PI*220*t)+.35*Math.sin(2*Math.PI*440*t))*.3;break;case'guitar':v=Math.sign(Math.sin(2*Math.PI*165*t))*.15*Math.exp(-(t%0.25)*7);break;case'piano':v=(Math.sin(2*Math.PI*261.6*t)+.5*Math.sin(2*Math.PI*329.6*t)+.35*Math.sin(2*Math.PI*392*t))*.18*Math.exp(-(t%0.5)*3);break;case'muddy':v=(bass*1.5+lead+.28*Math.sin(2*Math.PI*260*t));break;case'harsh':v=lead*1.8+hat*1.6+.14*Math.sin(2*Math.PI*4200*t);break;case'boomy':v=bass*1.8+kick*1.4;break;case'thin':v=lead+hat;break;default:v=kick+sn*.45+hat+bass+lead;}L[i]=clamp(v*.65);R[i]=clamp((v+(kind==='guitar'?Math.sin(2*Math.PI*170*t)*.05:0))*.65)}const b=new ArrayBuffer(44+n*4),d=new DataView(b),w=(o,s)=>{for(let i=0;i<s.length;i++)d.setUint8(o+i,s.charCodeAt(i))};w(0,'RIFF');d.setUint32(4,36+n*4,true);w(8,'WAVE');w(12,'fmt ');d.setUint32(16,16,true);d.setUint16(20,1,true);d.setUint16(22,2,true);d.setUint32(24,SR,true);d.setUint32(28,SR*4,true);d.setUint16(32,4,true);d.setUint16(34,16,true);w(36,'data');d.setUint32(40,n*4,true);let o=44;for(let i=0;i<n;i++){d.setInt16(o,L[i]*32767,true);d.setInt16(o+2,R[i]*32767,true);o+=4}return new Blob([b],{type:'audio/wav'})}

document.addEventListener('click',e=>{const b=e.target.closest('[data-sample]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();const kind=b.dataset.sample||'full',name=b.dataset.title||'内蔵練習音源';b.disabled=true;b.textContent='生成中…';setTimeout(()=>{useBlob(makeWav(kind),`${name}.wav`);document.querySelectorAll('.sample-card').forEach(x=>x.classList.remove('selected'));b.closest('.sample-card')?.classList.add('selected');b.disabled=false;b.textContent='この音源を使う';},20)},true);

document.addEventListener('click',e=>{if(e.target?.id==='loopBtn')setTimeout(()=>audio.loop=loopState(),0)});
window.addEventListener('beforeunload',release);
})();
