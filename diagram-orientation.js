(()=>{
'use strict';
if(window.__NEET_CHORD_ORIENTATION__)return;
window.__NEET_CHORD_ORIENTATION__=true;

const STORAGE_KEY='neet-chord-diagram-orientation-v1';
let orientation=localStorage.getItem(STORAGE_KEY)==='vertical'?'vertical':'horizontal';

const esc=(v='')=>String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const calc=(frets)=>{
  const nums=frets.filter(v=>typeof v==='number'&&v>0);
  const min=nums.length?Math.min(...nums):1;
  const max=nums.length?Math.max(...nums):1;
  const base=min>4?min:1;
  const count=Math.max(4,max-base+1);
  return {base,count};
};

function verticalDiagram(name,frets,barres=[]){
  const {base,count}=calc(frets),x0=42,y0=38,sw=24,bh=150,fh=bh/count;
  let svg=`<svg class="chord-diagram large-diagram orientation-vertical" viewBox="0 0 190 210" role="img" aria-label="${esc(name)}の縦向きコード図">`;
  for(let s=0;s<6;s++)svg+=`<line class="string" x1="${x0+s*sw}" y1="${y0}" x2="${x0+s*sw}" y2="${y0+bh}"/>`;
  for(let f=0;f<=count;f++)svg+=`<line class="${f===0&&base===1?'nut':'fret'}" x1="${x0}" y1="${y0+f*fh}" x2="${x0+5*sw}" y2="${y0+f*fh}"/>`;
  if(base>1)svg+=`<text class="fret-label" x="22" y="${y0+fh*.65}">${base}fr</text>`;
  const covered=new Set();
  barres.forEach(b=>{
    const df=b.fret-base+1;if(df<1||df>count)return;
    const y=y0+(df-.5)*fh;
    svg+=`<line class="barre" x1="${x0+b.start*sw}" y1="${y}" x2="${x0+b.end*sw}" y2="${y}"/>`;
    for(let s=b.start;s<=b.end;s++)if(frets[s]===b.fret)covered.add(`${s}:${b.fret}`);
  });
  frets.forEach((v,s)=>{
    const x=x0+s*sw;
    if(v==='x')svg+=`<text class="mute-mark" x="${x}" y="22">×</text>`;
    else if(v===0)svg+=`<text class="open-mark" x="${x}" y="22">○</text>`;
    else if(!covered.has(`${s}:${v}`)){
      const df=v-base+1,y=y0+(df-.5)*fh;
      if(df>=1&&df<=count)svg+=`<circle class="dot" cx="${x}" cy="${y}" r="9"/>`;
    }
  });
  return svg+'</svg>';
}

function horizontalDiagram(name,frets,barres=[]){
  const {base,count}=calc(frets),x0=55,y0=28,neckW=235,stringGap=23,fw=neckW/count;
  const stringY=s=>y0+(5-s)*stringGap;
  const bottom=y0+5*stringGap;
  let svg=`<svg class="chord-diagram large-diagram orientation-horizontal" viewBox="0 0 330 175" role="img" aria-label="${esc(name)}の横向きコード図">`;
  for(let s=0;s<6;s++){
    const y=stringY(s);
    svg+=`<line class="string" x1="${x0}" y1="${y}" x2="${x0+neckW}" y2="${y}"/>`;
  }
  for(let f=0;f<=count;f++){
    const x=x0+f*fw;
    svg+=`<line class="${f===0&&base===1?'nut':'fret'}" x1="${x}" y1="${y0}" x2="${x}" y2="${bottom}"/>`;
  }
  if(base>1)svg+=`<text class="fret-label horizontal-fret-label" x="${x0+fw*.5}" y="${bottom+25}">${base}fr</text>`;
  const covered=new Set();
  barres.forEach(b=>{
    const df=b.fret-base+1;if(df<1||df>count)return;
    const x=x0+(df-.5)*fw;
    svg+=`<line class="barre" x1="${x}" y1="${stringY(b.start)}" x2="${x}" y2="${stringY(b.end)}"/>`;
    for(let s=b.start;s<=b.end;s++)if(frets[s]===b.fret)covered.add(`${s}:${b.fret}`);
  });
  frets.forEach((v,s)=>{
    const y=stringY(s);
    if(v==='x')svg+=`<text class="mute-mark horizontal-mark" x="30" y="${y+4}">×</text>`;
    else if(v===0)svg+=`<text class="open-mark horizontal-mark" x="30" y="${y+4}">○</text>`;
    else if(!covered.has(`${s}:${v}`)){
      const df=v-base+1,x=x0+(df-.5)*fw;
      if(df>=1&&df<=count)svg+=`<circle class="dot" cx="${x}" cy="${y}" r="9"/>`;
    }
  });
  svg+=`<text class="string-guide" x="${x0+neckW+18}" y="${stringY(5)+4}">1</text><text class="string-guide" x="${x0+neckW+18}" y="${stringY(0)+4}">6</text>`;
  return svg+'</svg>';
}

const originalDiagram=window.diagram;
if(typeof originalDiagram!=='function')return;
window.diagram=function(name,frets,barres=[]){
  return orientation==='vertical'?verticalDiagram(name,frets,barres):horizontalDiagram(name,frets,barres);
};

function mountControl(){
  const host=document.querySelector('#selectedChord');
  const card=host?.querySelector('.selected-card');
  const heading=card?.querySelector('.selected-heading');
  if(!card||!heading)return;
  card.dataset.chordOrientation=orientation;
  let box=heading.querySelector('.diagram-orientation-control');
  if(!box){
    box=document.createElement('div');
    box.className='diagram-orientation-control';
    box.innerHTML='<button type="button" class="diagram-orientation-toggle"></button>';
    heading.appendChild(box);
    box.querySelector('button').addEventListener('click',()=>{
      orientation=orientation==='horizontal'?'vertical':'horizontal';
      localStorage.setItem(STORAGE_KEY,orientation);
      if(typeof window.render==='function')window.render();
      requestAnimationFrame(mountControl);
    });
  }
  const btn=box.querySelector('.diagram-orientation-toggle');
  btn.textContent=orientation==='horizontal'?'↕ 縦向きにする':'↔ 横向きに戻す';
  btn.setAttribute('aria-label',orientation==='horizontal'?'コード図を縦向きに切り替える':'コード図を横向きに切り替える');
  btn.setAttribute('aria-pressed',orientation==='vertical'?'true':'false');
}

if(!document.querySelector('#diagram-orientation-style')){
  const style=document.createElement('style');
  style.id='diagram-orientation-style';
  style.textContent=`
    .diagram-orientation-control{display:flex;align-items:center;gap:8px;margin-top:12px}
    .diagram-orientation-toggle{min-height:42px;padding:9px 14px;border:1px solid var(--line,#d8d2c7);border-radius:12px;background:#fff;color:var(--ink,#171717);font-weight:850;font-size:.84rem;box-shadow:0 4px 12px rgba(17,24,39,.06)}
    .diagram-orientation-toggle:active{transform:translateY(1px)}
    .selected-card[data-chord-orientation="horizontal"] .selected-content{grid-template-columns:minmax(0,1fr)}
    .selected-card[data-chord-orientation="horizontal"] .orientation-horizontal{width:min(100%,560px)!important;max-width:560px!important}
    .selected-card[data-chord-orientation="horizontal"] .diagram-panel{padding:16px}
    .selected-card[data-chord-orientation="horizontal"] .info-list{grid-template-columns:repeat(2,minmax(0,1fr))}
    .selected-card[data-chord-orientation="vertical"] .orientation-vertical{width:min(100%,270px)!important;max-width:270px!important}
    .string-guide{font-size:11px;font-weight:900;text-anchor:middle;fill:#756b5f}
    .horizontal-fret-label{font-size:11px}
    .horizontal-mark{font-size:13px}
    @media(max-width:640px){
      .diagram-orientation-control{margin-top:10px}
      .diagram-orientation-toggle{width:100%;min-height:44px;font-size:.82rem}
      .selected-card[data-chord-orientation="horizontal"] .info-list{grid-template-columns:1fr}
      .selected-card[data-chord-orientation="horizontal"] .diagram-panel{padding:8px 6px}
      .selected-card[data-chord-orientation="horizontal"] .orientation-horizontal{width:100%!important;max-width:100%!important}
    }
  `;
  document.head.appendChild(style);
}

const host=document.querySelector('#selectedChord');
if(host){
  new MutationObserver(()=>requestAnimationFrame(mountControl)).observe(host,{childList:true,subtree:true});
}
if(typeof window.render==='function')window.render();
requestAnimationFrame(mountControl);
})();
