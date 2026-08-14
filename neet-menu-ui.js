(()=>{
'use strict';
const ROOT='https://akito0802.github.io/NEET-note/';
document.querySelectorAll(`a[href="${ROOT}"]`).forEach(a=>{const t=(a.textContent||'').trim();a.href=/ノート/.test(t)?ROOT+'?mode=note':ROOT+'home.html'});

// Guitar chord dictionary concept-3 base + V4 immediate chord-first layout.
// Chord data, search, filters, form switching and menu behavior stay unchanged.
if(document.querySelector('#selectedChord')&&document.querySelector('#rootSelect')){
  if(!document.querySelector('#chord-ui-v3-style')){
    const l=document.createElement('link');
    l.id='chord-ui-v3-style';
    l.rel='stylesheet';
    l.href='ui-v3.css?v=20260815-2';
    document.head.appendChild(l);
  }
  if(!window.__CHORD_UI_V3_LAYOUT_LOADER__){
    window.__CHORD_UI_V3_LAYOUT_LOADER__=true;
    const u=document.createElement('script');
    u.src='ui-v3-layout.js?v=20260815-4';
    u.async=false;
    document.body.appendChild(u);
  }

  // Run after the page-specific UI scripts so V4 can reuse all existing selectors and form logic.
  setTimeout(()=>{
    if(!document.querySelector('#chord-ui-v3-readability')){
      const r=document.createElement('link');
      r.id='chord-ui-v3-readability';
      r.rel='stylesheet';
      r.href='ui-v3-readability.css?v=20260815-4';
      document.head.appendChild(r);
    }
    if(!document.querySelector('#chord-ui-v3-flow')){
      const f=document.createElement('link');
      f.id='chord-ui-v3-flow';
      f.rel='stylesheet';
      f.href='ui-v3-flow.css?v=20260815-1';
      document.head.appendChild(f);
    }
    if(!document.querySelector('#chord-ui-v4-immediate-style')){
      const v=document.createElement('link');
      v.id='chord-ui-v4-immediate-style';
      v.rel='stylesheet';
      v.href='ui-v4-immediate.css?v=20260815-1';
      document.head.appendChild(v);
    }
    if(!window.__CHORD_UI_V4_IMMEDIATE_LOADER__){
      window.__CHORD_UI_V4_IMMEDIATE_LOADER__=true;
      const j=document.createElement('script');
      j.src='ui-v4-immediate.js?v=20260815-1';
      j.async=false;
      document.body.appendChild(j);
    }
  },0);
}

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
