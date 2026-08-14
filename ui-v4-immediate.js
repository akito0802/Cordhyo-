(()=>{
'use strict';
if(window.__CHORD_UI_V4_IMMEDIATE__)return;

const main=document.querySelector('main.container');
const controls=document.querySelector('.controls');
const host=document.querySelector('#selectedChord');
const root=document.querySelector('#rootSelect');
const type=document.querySelector('#typeSelect');
const bass=document.querySelector('#bassSelect');
if(!main||!controls||!host||!root||!type||!bass)return;

window.__CHORD_UI_V4_IMMEDIATE__=true;
document.body.classList.add('chord-ui-v4');
host.classList.remove('ui3-inline-result');
host.classList.add('ui4-primary-result');
controls.classList.add('ui4-secondary-controls');

let quick=document.querySelector('.ui4-quick-selectors');
if(!quick){
  quick=document.createElement('section');
  quick.className='ui4-quick-selectors';
  quick.setAttribute('aria-label','すぐにコードを選択');
  quick.innerHTML=`
    <label><span>ルート音</span><select class="ui4-root" aria-label="ルート音をすぐ選択"></select></label>
    <label><span>コードの種類</span><select class="ui4-type" aria-label="コードの種類をすぐ選択"></select></label>
    <label><span>オンコード</span><select class="ui4-bass" aria-label="オンコードをすぐ選択"></select></label>`;
}

const qRoot=quick.querySelector('.ui4-root');
const qType=quick.querySelector('.ui4-type');
const qBass=quick.querySelector('.ui4-bass');

function copyOptions(source,target){
  const html=source.innerHTML;
  if(target.dataset.optionsHtml!==html){
    target.innerHTML=html;
    target.dataset.optionsHtml=html;
  }
  target.value=source.value;
}
function syncAll(){
  copyOptions(root,qRoot);
  copyOptions(type,qType);
  copyOptions(bass,qBass);
}
function forward(proxy,source){
  proxy.addEventListener('change',()=>{
    if(source.value!==proxy.value){
      source.value=proxy.value;
      source.dispatchEvent(new Event('change',{bubbles:true}));
    }
    requestAnimationFrame(syncAll);
  });
  source.addEventListener('change',()=>requestAnimationFrame(syncAll));
}
forward(qRoot,root);
forward(qType,type);
forward(qBass,bass);

function place(){
  document.body.classList.add('chord-ui-v4');
  host.classList.remove('ui3-inline-result');
  host.classList.add('ui4-primary-result');
  controls.classList.add('ui4-secondary-controls');

  if(quick.parentElement!==main||main.firstElementChild!==quick){
    main.insertBefore(quick,main.firstElementChild);
  }
  if(host.parentElement!==main||quick.nextElementSibling!==host){
    main.insertBefore(host,quick.nextElementSibling);
  }
  if(controls.parentElement!==main||host.nextElementSibling!==controls){
    main.insertBefore(controls,host.nextElementSibling);
  }
  syncAll();
}

let raf=0;
function schedule(){
  if(raf)return;
  raf=requestAnimationFrame(()=>{raf=0;place();});
}

new MutationObserver(schedule).observe(main,{childList:true,subtree:true});
new MutationObserver(()=>requestAnimationFrame(()=>copyOptions(bass,qBass))).observe(bass,{childList:true,subtree:true});

place();
})();
