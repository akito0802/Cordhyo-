(()=>{
'use strict';
const rootSelect=document.getElementById('rootSelect');
const typeSelect=document.getElementById('typeSelect');
const bassSelect=document.getElementById('bassSelect');
const selectedChord=document.getElementById('selectedChord');
if(!rootSelect||!typeSelect||!bassSelect||!selectedChord)return;

const params=new URLSearchParams(location.search);
const enharmonic={'Db':'C#','D♭':'C#','Eb':'D#','E♭':'D#','Gb':'F#','G♭':'F#','Ab':'G#','A♭':'G#','Bb':'A#','B♭':'A#'};
const suffixMap={
 '':'major','maj':'major','M':'major','m':'minor','min':'minor','5':'5',
 '6':'6','m6':'m6','7':'7','maj7':'maj7','M7':'maj7','m7':'m7',
 'mMaj7':'mMaj7','sus2':'sus2','sus4':'sus4','add9':'add9','madd9':'madd9',
 'm(add9)':'madd9','9':'9','m9':'m9','maj9':'maj9','6/9':'69','m6/9':'m69',
 '11':'11','m11':'m11','maj11':'maj11','13':'13','m13':'m13','maj13':'maj13',
 'm7b5':'m7b5','m7♭5':'m7b5','dim':'dim','dim7':'dim7','aug':'aug','aug7':'aug7',
 '7b5':'7b5','7♭5':'7b5','7#5':'7s5','7♯5':'7s5','7b9':'7b9','7♭9':'7b9',
 '7#9':'7s9','7♯9':'7s9','7b13':'7b13','7♭13':'7b13','7#11':'7s11','7♯11':'7s11'
};
function normalizeRoot(root=''){
  root=root.replace(/♯/g,'#').replace(/♭/g,'b');
  return enharmonic[root]||root;
}
function parseChord(raw=''){
  raw=raw.trim();
  const slash=raw.split('/');
  const main=slash[0],bass=slash[1]||'';
  const m=main.match(/^([A-G](?:#|b|♯|♭)?)(.*)$/);
  if(!m)return null;
  const root=normalizeRoot(m[1]);
  let suffix=m[2]||'';
  suffix=suffix.replace(/♭/g,'b').replace(/♯/g,'#');
  const type=suffixMap[suffix]||suffixMap[suffix.replace(/[()]/g,'')]||'major';
  return{root,type,bass:normalizeRoot(bass)};
}
function optionHas(select,value){return [...select.options].some(o=>o.value===value)}
function safeReturn(url){
  if(!url)return null;
  try{
    const u=new URL(url,location.href);
    if(u.origin!=='https://akito0802.github.io')return null;
    if(!u.pathname.startsWith('/NEET-note/'))return null;
    return u.href;
  }catch{return null}
}
function showContext(message,returnUrl){
  if(document.querySelector('.gp-dict-context'))return;
  const style=document.createElement('style');
  style.textContent=`.gp-dict-context{margin:12px auto 0;max-width:1100px;padding:10px 12px;border:1px solid #d9c4a8;border-radius:13px;background:#fff7eb;color:#5f452f;font-family:-apple-system,BlinkMacSystemFont,"Hiragino Sans","Yu Gothic",sans-serif;font-size:.78rem;font-weight:800;display:flex;align-items:center;justify-content:space-between;gap:10px}.gp-dict-context a{display:inline-flex;align-items:center;justify-content:center;min-height:36px;padding:0 11px;border-radius:10px;background:#8d6239;color:#fff;text-decoration:none;white-space:nowrap}@media(max-width:600px){.gp-dict-context{margin:8px 10px 0;align-items:stretch;flex-direction:column}.gp-dict-context a{width:100%}}html[data-theme="dark"] .gp-dict-context{background:#302a23;color:#f2e7d8;border-color:#514438}`;
  document.head.appendChild(style);
  const box=document.createElement('div');box.className='gp-dict-context';
  box.innerHTML=`<span>${message}</span>${returnUrl?`<a href="${returnUrl}">← GUITAR PROへ戻る</a>`:''}`;
  const nav=document.querySelector('.site-nav');
  if(nav)nav.insertAdjacentElement('afterend',box);else document.body.prepend(box);
}
function apply(){
  let root=params.get('root'),type=params.get('type'),bass=params.get('bass')||'';
  const chord=params.get('chord');
  if(chord){
    const parsed=parseChord(chord);
    if(parsed){root=parsed.root;type=parsed.type;bass=parsed.bass||bass}
  }
  root=normalizeRoot(root||'');
  if(root&&optionHas(rootSelect,root))rootSelect.value=root;
  if(type&&optionHas(typeSelect,type))typeSelect.value=type;
  if(root||type){
    rootSelect.dispatchEvent(new Event('change',{bubbles:true}));
  }
  if(bass){
    const normalized=normalizeRoot(bass);
    requestAnimationFrame(()=>{
      if(optionHas(bassSelect,normalized)){
        bassSelect.value=normalized;
        bassSelect.dispatchEvent(new Event('change',{bubbles:true}));
      }
    });
  }
  const from=params.get('from');
  const returnUrl=safeReturn(params.get('return'));
  if(from==='guitar-pro'){
    const label=chord||`${root||rootSelect.value}${type&&type!=='major'?type:''}${bass?'/'+bass:''}`;
    showContext(`GUITAR PROから ${label} を開いています。フォーム・構成音をここで詳しく確認できます。`,returnUrl);
    setTimeout(()=>selectedChord.scrollIntoView({behavior:'smooth',block:'start'}),90);
  }
}
apply();
})();