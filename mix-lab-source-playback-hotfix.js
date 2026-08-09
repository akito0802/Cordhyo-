(()=>{
'use strict';
const AC=window.AudioContext||window.webkitAudioContext;
if(!AC)return;
let ctx=null,timer=null,nodes=[],selected='drums',playing=false;
const $=id=>document.getElementById(id);
async function ensure(){if(!ctx)ctx=new AC();if(ctx.state==='suspended')await ctx.resume();return ctx}
function clear(){if(timer){clearInterval(timer);timer=null}for(const n of nodes){try{n.stop?.()}catch{}try{n.disconnect?.()}catch{}}nodes=[];playing=false;const p=$('playBtn');if(p)p.textContent='▶ 再生'}
function tone(freq,start,dur,type='sine',vol=.15){const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,start);g.gain.setValueAtTime(.0001,start);g.gain.exponentialRampToValueAtTime(Math.max(.0002,vol),start+.01);g.gain.exponentialRampToValueAtTime(.0001,start+dur);o.connect(g).connect(ctx.destination);o.start(start);o.stop(start+dur+.03);nodes.push(o,g)}
function noise(start,dur=.08,vol=.1){const b=ctx.createBuffer(1,Math.max(1,Math.floor(ctx.sampleRate*dur)),ctx.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;const s=ctx.createBufferSource(),g=ctx.createGain();s.buffer=b;g.gain.setValueAtTime(vol,start);g.gain.exponentialRampToValueAtTime(.0001,start+dur);s.connect(g).connect(ctx.destination);s.start(start);s.stop(start+dur+.03);nodes.push(s,g)}
function schedule(kind){const at=ctx.currentTime+.03;const bass=[55,55,65.41,65.41,73.42,73.42,82.41,82.41];const keys=[261.63,329.63,392,329.63,293.66,349.23,392,349.23];for(let i=0;i<8;i++){const t=at+i*.25;if(kind==='drums'||kind==='mix'){if(i%4===0)tone(58,t,.16,'sine',.34);if(i===2||i===6)noise(t,.13,.17);noise(t,.035,.045)}if(kind==='bass'||kind==='mix')tone(bass[i],t,.22,'sawtooth',.11);if(kind==='keys'||kind==='mix')tone(keys[i],t,.18,'triangle',.09)}}
async function start(kind=selected){await ensure();clear();selected=kind;playing=true;schedule(selected);timer=setInterval(()=>schedule(selected),2000);const p=$('playBtn');if(p)p.textContent='⏸ 停止';const state=$('heroState');if(state){state.textContent='PLAYING';state.classList.add('playing')}const status=$('status');if(status){const label={drums:'ドラム',bass:'ベース',keys:'キー',mix:'ミックス'}[selected]||selected;status.textContent=`再生中：${label}`}}
document.addEventListener('click',async e=>{const b=e.target.closest?.('.source-btn');if(!b)return;e.preventDefault();e.stopImmediatePropagation();document.querySelectorAll('.source-btn').forEach(x=>x.classList.toggle('active',x===b));await start(b.dataset.source||'drums')},true);
document.addEventListener('click',async e=>{if(e.target?.id==='playBtn'){e.preventDefault();e.stopImmediatePropagation();if(playing){clear();const s=$('status');if(s)s.textContent='停止中'}else await start(selected)}else if(e.target?.id==='stopBtn'){e.preventDefault();e.stopImmediatePropagation();clear();const s=$('status');if(s)s.textContent='停止中'}},true);
window.addEventListener('beforeunload',clear);
})();