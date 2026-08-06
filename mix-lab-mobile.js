(()=>{'use strict';
function organizeEqMobile(){
  if(!matchMedia('(max-width: 640px)').matches)return;
  const panel=document.getElementById('panel-eq');
  const challenge=panel?.querySelector('.challenge');
  if(!panel||!challenge||challenge.closest('.mobile-eq-details'))return;
  const details=document.createElement('details');
  details.className='mobile-eq-details';
  const summary=document.createElement('summary');
  summary.textContent='🎧 耳トレ・ミニ課題';
  const body=document.createElement('div');
  body.className='mobile-eq-details-body';
  challenge.parentNode.insertBefore(details,challenge);
  body.appendChild(challenge);
  details.append(summary,body);
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',organizeEqMobile):organizeEqMobile();
})();
