(()=>{
'use strict';
const $=id=>document.getElementById(id);
const input=$('audioFile'),playBtn=$('playBtn'),stopBtn=$('stopBtn'),fileName=$('fileName');
if(!input||!playBtn||!stopBtn)return;

const audio=new Audio();
audio.preload='auto';
audio.playsInline=true;
audio.loop=true;
let objectUrl='';
let selectedFile=null;

const revoke=()=>{if(objectUrl){URL.revokeObjectURL(objectUrl);objectUrl='';}};
const setSource=(blob,name)=>{
  audio.pause();
  audio.currentTime=0;
  revoke();
  objectUrl=URL.createObjectURL(blob);
  audio.src=objectUrl;
  audio.load();
  selectedFile=blob;
  fileName.textContent=name;
  playBtn.textContent='▶ 再生';
  document.dispatchEvent(new CustomEvent('mixlab-source-changed',{detail:{blob,name,audio}}));
};

input.addEventListener('change',()=>{
  const file=input.files?.[0];
  if(file)setSource(file,file.name);
});

playBtn.addEventListener('click',async e=>{
  e.preventDefault();
  if(!audio.src){alert('先に音源を選んでね');return;}
  try{
    if(audio.paused){
      await audio.play();
      playBtn.textContent='⏸ 一時停止';
    }else{
      audio.pause();
      playBtn.textContent='▶ 再生';
    }
  }catch(err){
    console.error(err);
    alert('再生できなかったよ。ページを再読み込みして、音源を選び直してね。');
  }
});
stopBtn.addEventListener('click',e=>{e.preventDefault();audio.pause();audio.currentTime=0;playBtn.textContent='▶ 再生';});
audio.addEventListener('ended',()=>playBtn.textContent='▶ 再生');

const transport=document.querySelector('.transport');
if(transport&&!$('loopBtn')){
  const b=document.createElement('button');b.id='loopBtn';b.type='button';b.textContent='🔁 ループ ON';b.setAttribute('aria-pressed','true');
  b.addEventListener('click',()=>{audio.loop=!audio.loop;b.setAttribute('aria-pressed',String(audio.loop));b.textContent=audio.loop?'🔁 ループ ON':'➡ ループ OFF';b.classList.toggle('sub',!audio.loop)});
  stopBtn.after(b);
}

const SR=22050,DUR=6,clamp=v=>Math.max(-1,Math.min(1,v));
function makeWav(kind){
  const n=SR*DUR,L=new Float32Array(n),R=new Float32Array(n);
  let seed=42;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/1073741823.5-1};
  for(let i=0;i<n;i++){
    const t=i/SR,beat=Math.floor(t/.5)*.5,x=t-beat;
    const kick=x<.3?Math.sin(2*Math.PI*(55+80*Math.exp(-x*18))*x)*Math.exp(-x*16):0;
    const hat=(t%.25)<.05?rnd()*Math.exp(-(t%.25)*70)*.2:0;
    const step=Math.floor(t/.5)%8,f=55*Math.pow(2,[0,0,3,3,5,5,7,7][step]/12);
    const bass=(Math.sin(2*Math.PI*f*t)+.25*Math.sin(4*Math.PI*f*t))*.35;
    const lead=Math.sin(2*Math.PI*[330,392,440,392][Math.floor(t/.5)%4]*t)*.16;
    let v=0;
    if(kind==='drums')v=kick+hat;
    else if(kind==='bass')v=bass;
    else if(kind==='vocal')v=lead+.25*Math.sin(2*Math.PI*660*t);
    else if(kind==='muddy')v=bass*1.5+lead*.5+.25*Math.sin(2*Math.PI*240*t);
    else if(kind==='harsh')v=lead+hat*1.5+.18*Math.sin(2*Math.PI*4200*t);
    else v=kick+hat+bass+lead;
    L[i]=R[i]=clamp(v*.75);
  }
  const b=new ArrayBuffer(44+n*4),d=new DataView(b),w=(o,s)=>[...s].forEach((c,i)=>d.setUint8(o+i,c.charCodeAt(0)));
  w(0,'RIFF');d.setUint32(4,36+n*4,true);w(8,'WAVE');w(12,'fmt ');d.setUint32(16,16,true);d.setUint16(20,1,true);d.setUint16(22,2,true);d.setUint32(24,SR,true);d.setUint32(28,SR*4,true);d.setUint16(32,4,true);d.setUint16(34,16,true);w(36,'data');d.setUint32(40,n*4,true);
  let o=44;for(let i=0;i<n;i++){d.setInt16(o,L[i]*32767,true);d.setInt16(o+2,R[i]*32767,true);o+=4}
  return new Blob([b],{type:'audio/wav'});
}
const samples=[['full','完成形ミニミックス'],['muddy','モコモコしたミックス'],['harsh','高域が刺さるミックス'],['drums','ドラムループ'],['bass','ベースループ'],['vocal','ボーカル風シンセ']];
const upload=document.querySelector('.upload-card');
if(upload){
  const sec=document.createElement('section');sec.className='sample-library';
  sec.innerHTML=`<div class="sample-head"><h2>内蔵練習音源</h2><p>タップして選んだあと、上の再生ボタンを押してね。</p></div><div class="sample-grid">${samples.map(([k,n])=>`<article class="sample-card"><h3>${n}</h3><button type="button" data-kind="${k}" data-name="${n}">この音源を使う</button></article>`).join('')}</div>`;
  upload.after(sec);
  sec.querySelectorAll('[data-kind]').forEach(b=>b.addEventListener('click',()=>{
    b.disabled=true;b.textContent='生成中…';
    setTimeout(()=>{setSource(makeWav(b.dataset.kind),`${b.dataset.name}.wav`);sec.querySelectorAll('.sample-card').forEach(c=>c.classList.remove('selected'));b.closest('.sample-card').classList.add('selected');b.disabled=false;b.textContent='選択中';},20);
  }));
}

const ranges=[['eqFreq','freqValue',v=>`${Math.round(v)} Hz`],['eqGain','gainValue',v=>`${+v>0?'+':''}${v} dB`],['eqQ','qValue',v=>(+v).toFixed(1)]];
const updateEQ=()=>ranges.forEach(([id,out,fmt])=>{if($(id)&&$(out))$(out).textContent=fmt($(id).value)});
ranges.forEach(([id])=>$(id)?.addEventListener('input',updateEQ));$('eqReset')?.addEventListener('click',()=>{$('eqFreq').value=1000;$('eqGain').value=0;$('eqQ').value=1;updateEQ()});updateEQ();

document.querySelectorAll('.lab-tabs button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.lab-tabs button').forEach(x=>x.classList.toggle('active',x===b));document.querySelectorAll('.lab-panel').forEach(p=>p.classList.toggle('active',p.id===`panel-${b.dataset.panel}`))}));

window.mixLabAudio=audio;
window.addEventListener('beforeunload',revoke);
})();
