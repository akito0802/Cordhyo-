(()=>{
'use strict';
const ROOT='https://akito0802.github.io/NEET-note/';
document.querySelectorAll(`a[href="${ROOT}"]`).forEach(a=>{const t=(a.textContent||'').trim();a.href=/ノート/.test(t)?ROOT+'?mode=note':ROOT+'home.html'});
if(!window.__NEET_CHORD_ORIENTATION_LOADER__){
  window.__NEET_CHORD_ORIENTATION_LOADER__=true;
  const o=document.createElement('script');
  o.src='diagram-orientation.js?v=20260814-1';
  o.async=false;
  document.body.appendChild(o);
}
if(window.__NEET_MENU_V4_LOADER__)return;
const s=document.createElement('script');
s.src=ROOT+'global-menu-v4.js?v=20260814-7';
s.defer=true;
document.body.appendChild(s);
})();