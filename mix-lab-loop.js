(()=>{'use strict';
let loopEnabled=true;
const OriginalAudioContext=window.AudioContext||window.webkitAudioContext;
if(!OriginalAudioContext)return;
const originalCreateBufferSource=OriginalAudioContext.prototype.createBufferSource;
OriginalAudioContext.prototype.createBufferSource=function(){
  const node=originalCreateBufferSource.call(this);
  node.loop=loopEnabled;
  return node;
};
function mount(){
  const transport=document.querySelector('.transport');
  const stopBtn=document.getElementById('stopBtn');
  if(!transport||document.getElementById('loopBtn'))return;
  const button=document.createElement('button');
  button.id='loopBtn';
  button.type='button';
  button.className='active';
  button.setAttribute('aria-pressed','true');
  button.textContent='🔁 ループ ON';
  button.addEventListener('click',()=>{
    loopEnabled=!loopEnabled;
    button.classList.toggle('active',loopEnabled);
    button.classList.toggle('sub',!loopEnabled);
    button.setAttribute('aria-pressed',String(loopEnabled));
    button.textContent=loopEnabled?'🔁 ループ ON':'➡ ループ OFF';
  });
  stopBtn?stopBtn.after(button):transport.appendChild(button);
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',mount):mount();
})();
