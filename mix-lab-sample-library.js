(()=>{'use strict';
const SR=44100,DUR=8;
const clamp=v=>Math.max(-1,Math.min(1,v));
function env(t,a=.01,d=.25){return Math.min(1,t/a)*Math.exp(-t/d)}
function noise(seed){let x=seed||1234567;return()=>{x=(x*16807)%2147483647;return x/1073741823.5-1}}
function kick(t,beat){const x=t-beat;if(x<0||x>.45)return 0;const f=52+95*Math.exp(-x*22);return Math.sin(2*Math.PI*f*x)*env(x,.003,.13)*1.3}
function snare(t,beat,rng){const x=t-beat;if(x<0||x>.28)return 0;return (rng()*.85+Math.sin(2*Math.PI*185*x)*.25)*env(x,.002,.09)}
function hat(t,beat,rng){const x=t-beat;if(x<0||x>.08)return 0;return rng()*env(x,.001,.025)*.32}
function bass(t,root=55){const step=Math.floor(t/.5)%8,seq=[0,0,3,3,5,5,7,7],f=root*Math.pow(2,seq[step]/12);return (Math.sin(2*Math.PI*f*t)+.28*Math.sin(2*Math.PI*f*2*t))*0.42}
function pad(t){const roots=[261.63,220,174.61,196],r=roots[Math.floor(t/2)%4];return [1,1.25,1.5].reduce((s,m)=>s+Math.sin(2*Math.PI*r*m*t),0)*.13}
function lead(t){const notes=[329.63,392,440,392,349.23,329.63,293.66,261.63],f=notes[Math.floor(t/.5)%8];return Math.sin(2*Math.PI*f*t)*.16*(.65+.35*Math.sin(2*Math.PI*4*t));}
function guitar(t){const roots=[164.81,146.83,130.81,146.83],r=roots[Math.floor(t/2)%4],phase=t%0.25;return (Math.sign(Math.sin(2*Math.PI*r*t))*.08+Math.sin(2*Math.PI*r*2*t)*.08)*Math.exp(-phase*8)}
function render(kind){const n=SR*DUR,L=new Float32Array(n),R=new Float32Array(n),rng=noise(91);for(let i=0;i<n;i++){const t=i/SR;let l=0,r=0;const beat=Math.floor(t/.5)*.5;switch(kind){
case'full':{let v=pad(t)+bass(t)+lead(t)+guitar(t);v+=kick(t,beat);if(Math.floor(t/.5)%4===1||Math.floor(t/.5)%4===3)v+=snare(t,beat,rng);v+=hat(t,Math.floor(t/.25)*.25,rng);l=v+guitar(t)*.35;r=v-guitar(t)*.35;break}
case'muddy':{let v=pad(t)*1.8+bass(t)*1.45+guitar(t)*1.2+kick(t,beat)*.75;v+=.3*Math.sin(2*Math.PI*240*t);l=r=v;break}
case'harsh':{let v=lead(t)*1.6+guitar(t)*1.8+hat(t,Math.floor(t/.25)*.25,rng)*1.5;v+=.18*Math.sin(2*Math.PI*4200*t);l=v;r=v*.92;break}
case'boomy':{let v=bass(t)*1.9+kick(t,beat)*1.6+pad(t)*.55;l=r=v;break}
case'thin':{let v=lead(t)+hat(t,Math.floor(t/.25)*.25,rng)+guitar(t);l=v;r=v*.9;break}
case'drums':{let v=kick(t,beat);if(Math.floor(t/.5)%4===1||Math.floor(t/.5)%4===3)v+=snare(t,beat,rng);v+=hat(t,Math.floor(t/.25)*.25,rng);l=r=v;break}
case'bass':l=r=bass(t)*1.35;break;
case'vocal':{const f=[220,246.94,261.63,293.66][Math.floor(t/.5)%4];const form=(Math.sin(2*Math.PI*f*t)+.35*Math.sin(2*Math.PI*f*2*t)+.18*Math.sin(2*Math.PI*f*3*t));l=r=form*.32*(.75+.25*Math.sin(2*Math.PI*5*t));break}
case'guitar':l=guitar(t)*1.9;r=guitar(t+.006)*1.9;break;
case'piano':{const roots=[261.63,220,174.61,196],rr=roots[Math.floor(t/2)%4],p=t%.5;const v=[1,1.25,1.5,2].reduce((s,m)=>s+Math.sin(2*Math.PI*rr*m*t),0)*Math.exp(-p*3)*.18;l=v;r=v*.9;break}
}L[i]=clamp(l*.75);R[i]=clamp(r*.75)}return wav(L,R)}
function wav(L,R){const n=L.length,b=new ArrayBuffer(44+n*4),v=new DataView(b),w=(o,s)=>{for(let i=0;i<s.length;i++)v.setUint8(o+i,s.charCodeAt(i))};w(0,'RIFF');v.setUint32(4,36+n*4,true);w(8,'WAVE');w(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,2,true);v.setUint32(24,SR,true);v.setUint32(28,SR*4,true);v.setUint16(32,4,true);v.setUint16(34,16,true);w(36,'data');v.setUint32(40,n*4,true);let o=44;for(let i=0;i<n;i++){v.setInt16(o,clamp(L[i])*32767,true);v.setInt16(o+2,clamp(R[i])*32767,true);o+=4}return new Blob([b],{type:'audio/wav'})}
const samples=[
 ['full','完成形ミニミックス','ドラム・ベース・ギター・パッド・リードを含む基本練習'],
 ['muddy','モコモコしたミックス','200〜400Hz付近の整理練習'],
 ['harsh','高域が刺さるミックス','3〜6kHz付近の刺さりを探す練習'],
 ['boomy','低域が膨らんだミックス','キックとベースの低域整理'],
 ['thin','薄く軽いミックス','不足している低中域を判断する練習'],
 ['drums','ドラムループ','キック・スネア・ハイハットの処理'],
 ['bass','ベースループ','低域・倍音・輪郭の確認'],
 ['vocal','ボーカル風シンセ','声に近い倍音素材でEQ練習'],
 ['guitar','ギター風ループ','中低域とプレゼンスの整理'],
 ['piano','ピアノ風ループ','広い帯域を持つ鍵盤素材の整理']
];
function load(kind,title,btn){btn.disabled=true;btn.textContent='生成中…';setTimeout(()=>{const file=new File([render(kind)],`${title}.wav`,{type:'audio/wav'});const dt=new DataTransfer();dt.items.add(file);const input=document.getElementById('audioFile');input.files=dt.files;input.dispatchEvent(new Event('change',{bubbles:true}));document.querySelectorAll('.sample-card').forEach(x=>x.classList.remove('selected'));btn.closest('.sample-card').classList.add('selected');btn.disabled=false;btn.textContent='この音源を使う';},30)}
function init(){const upload=document.querySelector('.upload-card');if(!upload)return;const sec=document.createElement('section');sec.className='sample-library';sec.innerHTML=`<div class="sample-head"><div><p class="eyebrow">BUILT-IN PRACTICE SOUNDS</p><h2>内蔵練習音源</h2><p>すべてブラウザ上で生成するオリジナル音源。ダウンロード不要ですぐ練習できるよ。</p></div></div><div class="sample-grid">${samples.map(([k,n,d])=>`<article class="sample-card"><span>${k==='full'?'🎵':k==='drums'?'🥁':k==='bass'?'🎸':k==='vocal'?'🎤':k==='piano'?'🎹':'🎚'}</span><h3>${n}</h3><p>${d}</p><button type="button" data-sample="${k}" data-title="${n}">この音源を使う</button></article>`).join('')}</div>`;upload.after(sec);sec.querySelectorAll('[data-sample]').forEach(b=>b.onclick=()=>load(b.dataset.sample,b.dataset.title,b));const style=document.createElement('style');style.textContent=`.sample-library{margin:18px 0;padding:22px;border-radius:22px;background:rgba(255,255,255,.78);box-shadow:0 12px 34px rgba(50,38,24,.1)}.sample-head h2{margin:.15rem 0}.sample-head p{margin:.25rem 0}.sample-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:16px}.sample-card{padding:16px;border:1px solid rgba(90,70,45,.16);border-radius:16px;background:#fff;transition:.2s}.sample-card.selected{outline:3px solid rgba(128,92,48,.25);transform:translateY(-2px)}.sample-card>span{font-size:1.5rem}.sample-card h3{margin:.35rem 0}.sample-card p{min-height:2.7em;margin:.25rem 0 .8rem;font-size:.9rem}.sample-card button{width:100%}@media(max-width:640px){.sample-grid{grid-template-columns:1fr}.sample-card p{min-height:0}}`;document.head.appendChild(style)}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();