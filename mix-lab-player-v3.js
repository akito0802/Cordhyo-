(()=>{
'use strict';
const $=id=>document.getElementById(id);
const input=$('audioFile'),playBtn=$('playBtn'),stopBtn=$('stopBtn'),fileName=$('fileName');
if(!input||!playBtn||!stopBtn)return;
const AC=window.AudioContext||window.webkitAudioContext;
let ctx=null,buffer=null,source=null,filter=null,gain=null,startedAt=0,offset=0,playing=false,loop=true;
const ensure=async()=>{if(!ctx)ctx=new AC();if(ctx.state==='suspended')await ctx.resume();return ctx};
const stop=(reset=true)=>{try{source&&source.stop()}catch(e){}source=null;playing=false;if(reset)offset=0;playBtn.textContent='▶ 再生'};
const current=()=>playing&&ctx?Math.min(buffer?.duration||0,offset+(ctx.currentTime-startedAt)):offset;
function makeBuffer(kind){
 const c=ctx,sr=c.sampleRate,dur=6,n=Math.floor(sr*dur),b=c.createBuffer(2,n,sr),L=b.getChannelData(0),R=b.getChannelData(1);let seed=42;
 const rnd=()=>{seed=(seed*16807)%2147483647;return seed/1073741823.5-1};
 for(let i=0;i<n;i++){
  const t=i/sr,x=t-Math.floor(t/.5)*.5;
  const kick=x<.3?Math.sin(2*Math.PI*(55+80*Math.exp(-x*18))*x)*Math.exp(-x*16):0;
  const hat=(t%.25)<.05?rnd()*Math.exp(-(t%.25)*70)*.18:0;
  const seq=[0,0,3,3,5,5,7,7],f=55*Math.pow(2,seq[Math.floor(t/.5)%8]/12);
  const bass=(Math.sin(2*Math.PI*f*t)+.25*Math.sin(4*Math.PI*f*t))*.34;
  const lead=Math.sin(2*Math.PI*[330,392,440,392][Math.floor(t/.5)%4]*t)*.16;
  let v=kind==='drums'?kick+hat:kind==='bass'?bass:kind==='vocal'?lead+.22*Math.sin(2*Math.PI*660*t):kind==='muddy'?bass*1.45+lead*.5+.22*Math.sin(2*Math.PI*240*t):kind==='harsh'?lead+hat*1.5+.14*Math.sin(2*Math.PI*4200*t):kick+hat+bass+lead;
  v=Math.max(-1,Math.min(1,v*.72));L[i]=v;R[i]=v;
 }
 return b;
}
async function start(at=offset){
 if(!buffer){alert('先に音源を選んでね');return false}
 await ensure();stop(false);offset=Math.max(0,Math.min(at,Math.max(0,buffer.duration-.01)));
 source=ctx.createBufferSource();source.buffer=buffer;source.loop=loop;
 filter=ctx.createBiquadFilter();filter.type='peaking';filter.frequency.value=+$('eqFreq').value;filter.gain.value=+$('eqGain').value;filter.Q.value=+$('eqQ').value;
 gain=ctx.createGain();gain.gain.value=.9;source.connect(filter).connect(gain).connect(ctx.destination);source.start(0,offset);startedAt=ctx.currentTime;playing=true;playBtn.textContent='⏸ 一時停止';
 source.onended=()=>{if(!loop&&playing)stop(true)};return true;
}
playBtn.onclick=async e=>{e.preventDefault();if(playing){offset=current();stop(false)}else await start(offset)};
stopBtn.onclick=e=>{e.preventDefault();stop(true)};
input.onchange=async()=>{const f=input.files?.[0];if(!f)return;await ensure();stop(true);try{buffer=await ctx.decodeAudioData((await f.arrayBuffer()).slice(0));fileName.textContent=f.name;playBtn.textContent='▶ 再生'}catch(err){console.error(err);fileName.textContent='音源の読み込みに失敗'}};
const transport=document.querySelector('.transport');if(transport&&!$('loopBtn')){const b=document.createElement('button');b.id='loopBtn';b.type='button';b.textContent='🔁 ループ ON';b.onclick=()=>{loop=!loop;b.textContent=loop?'🔁 ループ ON':'➡ ループ OFF';b.classList.toggle('sub',!loop);if(source)source.loop=loop};stopBtn.after(b)}
const samples=[['full','完成形ミニミックス'],['muddy','モコモコしたミックス'],['harsh','高域が刺さるミックス'],['drums','ドラムループ'],['bass','ベースループ'],['vocal','ボーカル風シンセ']];
const upload=document.querySelector('.upload-card');if(upload){document.querySelector('.sample-library')?.remove();const sec=document.createElement('section');sec.className='sample-library';sec.innerHTML=`<div class="sample-head"><h2>内蔵練習音源</h2><p>ボタンを押すと直接再生するよ。</p></div><div class="sample-grid">${samples.map(([k,n])=>`<article class="sample-card"><h3>${n}</h3><button type="button" data-kind="${k}" data-name="${n}">この音源を再生</button></article>`).join('')}</div>`;upload.after(sec);sec.querySelectorAll('[data-kind]').forEach(b=>b.onclick=async()=>{await ensure();buffer=makeBuffer(b.dataset.kind);fileName.textContent=b.dataset.name;offset=0;sec.querySelectorAll('.sample-card').forEach(c=>c.classList.remove('selected'));b.closest('.sample-card').classList.add('selected');await start(0)})}
[['eqFreq','freqValue',v=>`${Math.round(v)} Hz`],['eqGain','gainValue',v=>`${+v>0?'+':''}${v} dB`],['eqQ','qValue',v=>(+v).toFixed(1)]].forEach(([id,out,fmt])=>$(id)?.addEventListener('input',()=>{if($(out))$(out).textContent=fmt($(id).value);if(filter){filter.frequency.value=+$('eqFreq').value;filter.gain.value=+$('eqGain').value;filter.Q.value=+$('eqQ').value}}));
$('eqReset')?.addEventListener('click',()=>{$('eqFreq').value=1000;$('eqGain').value=0;$('eqQ').value=1;['eqFreq','eqGain','eqQ'].forEach(id=>$(id).dispatchEvent(new Event('input')))});
document.querySelectorAll('.lab-tabs button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.lab-tabs button').forEach(x=>x.classList.toggle('active',x===b));document.querySelectorAll('.lab-panel').forEach(p=>p.classList.toggle('active',p.id===`panel-${b.dataset.panel}`))});
})();