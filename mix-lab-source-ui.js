(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s);
function boot(){
 const upload=$('.upload-card');
 if(!upload||upload.dataset.sourceUi==='1')return;
 upload.dataset.sourceUi='1';upload.classList.add('source-picker');
 const fileLabel=$('.file-label',upload),transport=$('.transport',upload),note=$('.note',upload),fileInput=$('#audioFile');
 const head=document.createElement('div');head.className='source-picker-head';head.innerHTML='<div><h2>練習音源を選ぶ</h2><p>自分の音源か、内蔵された練習用サンプルから選べるよ。</p></div>';
 const tabs=document.createElement('div');tabs.className='source-mode-tabs';tabs.innerHTML='<button type="button" class="active" data-source-mode="upload">📁 自分の音源</button><button type="button" data-source-mode="built-in">🎧 内蔵音源</button>';
 const uploadPanel=document.createElement('div');uploadPanel.className='source-panel active';uploadPanel.dataset.sourcePanel='upload';
 const box=document.createElement('div');box.className='source-upload-box';box.innerHTML='<div class="source-upload-icon">📁</div><div class="source-upload-copy"><b>端末から音源を選択</b><span>WAV・MP3・M4Aなど、ブラウザで再生できる形式</span></div>';
 if(fileLabel){fileLabel.childNodes[0].textContent='音源ファイルを選ぶ';box.appendChild(fileLabel)}
 const selected=document.createElement('div');selected.className='selected-source';selected.innerHTML='<div class="selected-source-icon">🎵</div><div class="selected-source-copy"><small>現在の音源</small><b id="sourceSelectedName">音源未選択</b></div><span class="selected-source-ready">待機中</span>';
 uploadPanel.append(box,selected);
 const builtPanel=document.createElement('div');builtPanel.className='source-panel';builtPanel.dataset.sourcePanel='built-in';builtPanel.innerHTML='<div class="sample-toolbar"><input id="sampleSearch" type="search" placeholder="音源を検索" autocomplete="off"></div><div class="sample-filter"><button class="active" data-kind="all">すべて</button><button data-kind="mix">ミックス</button><button data-kind="problem">問題音源</button><button data-kind="part">楽器別</button></div><div id="sourceSampleMount"><p class="source-empty">内蔵音源を読み込み中…</p></div>';
 upload.innerHTML='';upload.append(head,tabs,uploadPanel,builtPanel);
 if(transport)upload.appendChild(transport);if(note)upload.appendChild(note);
 const switchMode=mode=>{tabs.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.sourceMode===mode));upload.querySelectorAll('.source-panel').forEach(p=>p.classList.toggle('active',p.dataset.sourcePanel===mode))};
 tabs.querySelectorAll('button').forEach(b=>b.onclick=()=>switchMode(b.dataset.sourceMode));
 const syncName=()=>{const shown=$('#fileName')?.textContent||fileInput?.files?.[0]?.name||'音源未選択';$('#sourceSelectedName').textContent=shown;$('.selected-source-ready').textContent=shown==='音源未選択'?'待機中':'準備完了'};
 fileInput?.addEventListener('change',()=>{setTimeout(syncName,80);switchMode('upload')});syncName();
 const classify=card=>{const k=$('[data-sample]',card)?.dataset.sample||'';if(['full'].includes(k))return'mix';if(['muddy','harsh','boomy','thin'].includes(k))return'problem';return'part'};
 function mountLibrary(){const lib=$('.sample-library');if(!lib||lib.dataset.sourceMounted==='1')return false;lib.dataset.sourceMounted='1';lib.classList.add('source-embedded');$('#sourceSampleMount').replaceChildren(lib);lib.querySelectorAll('.sample-card').forEach(c=>c.dataset.kind=classify(c));
  const apply=()=>{const q=$('#sampleSearch').value.trim().toLowerCase(),kind=$('.sample-filter button.active').dataset.kind;let visible=0;lib.querySelectorAll('.sample-card').forEach(c=>{const okText=!q||c.textContent.toLowerCase().includes(q),okKind=kind==='all'||c.dataset.kind===kind;c.hidden=!(okText&&okKind);if(!c.hidden)visible++});let empty=$('.source-filter-empty',lib);if(!visible){if(!empty){empty=document.createElement('p');empty.className='source-filter-empty source-empty';empty.textContent='該当する音源がないよ';lib.appendChild(empty)}}else empty?.remove()};
  $('#sampleSearch').oninput=apply;document.querySelectorAll('.sample-filter button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.sample-filter button').forEach(x=>x.classList.toggle('active',x===b));apply()});
  lib.addEventListener('click',e=>{const btn=e.target.closest('[data-sample]');if(!btn)return;setTimeout(()=>{syncName();switchMode('built-in')},120)});return true}
 if(!mountLibrary()){const obs=new MutationObserver(()=>{if(mountLibrary())obs.disconnect()});obs.observe(document.body,{childList:true,subtree:true});setTimeout(()=>obs.disconnect(),5000)}
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',boot):boot();
})();