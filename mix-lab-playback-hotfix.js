(()=>{
'use strict';
const input=document.getElementById('audioFile');
const playBtn=document.getElementById('playBtn');
const stopBtn=document.getElementById('stopBtn');
if(!input||!playBtn||!stopBtn)return;

const audio=document.createElement('audio');
audio.id='mixLabStableAudio';
audio.preload='auto';
audio.playsInline=true;
audio.style.display='none';
document.body.appendChild(audio);

let objectUrl='';
const releaseUrl=()=>{if(objectUrl){URL.revokeObjectURL(objectUrl);objectUrl='';}};
const updateLoop=()=>{
  const loopBtn=document.getElementById('loopBtn');
  audio.loop=!loopBtn||loopBtn.getAttribute('aria-pressed')!=='false';
};

input.addEventListener('change',()=>{
  const file=input.files&&input.files[0];
  if(!file)return;
  audio.pause();
  releaseUrl();
  objectUrl=URL.createObjectURL(file);
  audio.src=objectUrl;
  audio.load();
  playBtn.textContent='▶ 再生';
},{capture:true});

playBtn.addEventListener('click',async event=>{
  event.preventDefault();
  event.stopImmediatePropagation();
  if(!audio.src){
    alert('先に音源を選んでね');
    return;
  }
  updateLoop();
  try{
    if(audio.paused){
      await audio.play();
      playBtn.textContent='⏸ 一時停止';
    }else{
      audio.pause();
      playBtn.textContent='▶ 再生';
    }
  }catch(error){
    console.error('Mix Lab playback error',error);
    alert('再生を開始できなかったよ。音源を選び直して、もう一度再生を押してね。');
  }
},{capture:true});

stopBtn.addEventListener('click',event=>{
  event.preventDefault();
  event.stopImmediatePropagation();
  audio.pause();
  audio.currentTime=0;
  playBtn.textContent='▶ 再生';
},{capture:true});

audio.addEventListener('ended',()=>{playBtn.textContent='▶ 再生';});
audio.addEventListener('timeupdate',()=>{
  const seek=document.getElementById('proSeek');
  const time=document.getElementById('proTime');
  const fmt=s=>{s=Math.max(0,s||0);const m=Math.floor(s/60),x=Math.floor(s%60);return `${m}:${String(x).padStart(2,'0')}`};
  if(seek&&Number.isFinite(audio.duration)&&audio.duration>0)seek.value=Math.round(audio.currentTime/audio.duration*1000);
  if(time)time.textContent=`${fmt(audio.currentTime)} / ${fmt(audio.duration)}`;
});

document.addEventListener('click',event=>{
  if(event.target&&event.target.id==='loopBtn')setTimeout(updateLoop,0);
});

window.addEventListener('beforeunload',releaseUrl);
})();
