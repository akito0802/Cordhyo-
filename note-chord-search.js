(()=>{
'use strict';

const controls=document.querySelector('.controls');
const existingSearch=document.querySelector('.search-field');
const rootEl=document.getElementById('rootSelect');
const typeEl=document.getElementById('typeSelect');
const bassEl=document.getElementById('bassSelect');
if(!controls||!existingSearch||!rootEl||!typeEl||!bassEl||typeof typeData==='undefined')return;

const PC_NAMES_SHARP=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const PC_NAMES_FLAT=['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
const JP_BASE={ド:0,レ:2,ミ:4,ファ:5,フア:5,ソ:7,ラ:9,シ:11};
const EN_BASE={C:0,D:2,E:4,F:5,G:7,A:9,B:11};

const normalizeAccidentals=s=>String(s||'').trim().replace(/＃|♯/g,'#').replace(/♭/g,'b').replace(/−|ー/g,'-');
const pc=(n)=>((n%12)+12)%12;
const uniqueSorted=arr=>[...new Set(arr)].sort((a,b)=>a-b);
const setKey=arr=>uniqueSorted(arr).join(',');

function parseToken(raw){
  let token=normalizeAccidentals(raw).replace(/[()\[\]{}]/g,'').trim();
  if(!token)return null;
  token=token.replace(/(?:-?\d+)$/,'');
  if(!token)return null;

  const jp=token.match(/^(ド|レ|ミ|ファ|フア|ソ|ラ|シ)([#b]{0,2})$/i);
  if(jp){
    let value=JP_BASE[jp[1]];
    for(const mark of jp[2])value+=mark==='#'?1:-1;
    return {pc:pc(value),token:raw};
  }

  const en=token.match(/^([A-Ga-g])([#b]{0,2})$/);
  if(en){
    let value=EN_BASE[en[1].toUpperCase()];
    for(const mark of en[2])value+=mark==='#'?1:-1;
    return {pc:pc(value),token:raw};
  }
  return null;
}

function parseInput(value){
  const rawTokens=String(value||'')
    .replace(/[、，]/g,',')
    .replace(/\s*\/\s*/g,' ')
    .split(/[\s,;・]+/)
    .map(v=>v.trim())
    .filter(Boolean);
  const parsed=[];
  const invalid=[];
  rawTokens.forEach(token=>{
    const note=parseToken(token);
    if(note)parsed.push(note);else invalid.push(token);
  });
  return {rawTokens,parsed,invalid};
}

function preferFlats(value){
  const s=normalizeAccidentals(value);
  return /\b[A-Ga-g]b|[ドレミファフアソラシ]b/.test(s)&&!/\b[A-Ga-g]#|[ドレミファフアソラシ]#/.test(s);
}

function rootName(pcValue,useFlats){return (useFlats?PC_NAMES_FLAT:PC_NAMES_SHARP)[pcValue];}
function selectRootName(pcValue){return PC_NAMES_SHARP[pcValue];}

function chordPitchClasses(rootIndex,data){
  return uniqueSorted((data?.intervals||[]).map(interval=>pc(rootIndex+Number(interval))));
}

function buildCandidates(parsed,value){
  const inputPcs=uniqueSorted(parsed.map(n=>n.pc));
  if(inputPcs.length<2)return {exact:[],near:[]};
  const inputKey=setKey(inputPcs);
  const firstPc=parsed[0]?.pc;
  const useFlats=preferFlats(value);
  const exact=[];
  const near=[];

  for(let rootIndex=0;rootIndex<12;rootIndex++){
    for(const [typeKey,data] of Object.entries(typeData)){
      if(!data||!Array.isArray(data.intervals)||!data.intervals.length)continue;
      const chordPcs=chordPitchClasses(rootIndex,data);
      const chordKey=setKey(chordPcs);
      const displayRoot=rootName(rootIndex,useFlats);
      const baseName=`${displayRoot}${data.suffix||''}`;
      const inversion=firstPc!=null&&firstPc!==rootIndex&&chordPcs.includes(firstPc);
      const displayBass=inversion?rootName(firstPc,useFlats):'';
      const displayName=inversion?`${baseName}/${displayBass}`:baseName;
      const common=inputPcs.filter(n=>chordPcs.includes(n)).length;
      const missing=chordPcs.filter(n=>!inputPcs.includes(n));
      const extra=inputPcs.filter(n=>!chordPcs.includes(n));
      const candidate={rootIndex,typeKey,data,chordPcs,displayName,baseName,inversion,bassPc:inversion?firstPc:null,missing,extra,common};
      if(chordKey===inputKey){
        candidate.score=(rootIndex===firstPc?100:0)+(inversion?35:0)-chordPcs.length;
        exact.push(candidate);
      }else if(extra.length===0&&missing.length<=2){
        candidate.score=(rootIndex===firstPc?60:0)+(inversion?20:0)+(common*10)-(missing.length*14)-chordPcs.length;
        near.push(candidate);
      }
    }
  }

  const dedupe=list=>{
    const seen=new Set();
    return list.sort((a,b)=>b.score-a.score||a.displayName.localeCompare(b.displayName,'ja')).filter(item=>{
      const key=`${item.displayName}|${setKey(item.chordPcs)}`;
      if(seen.has(key))return false;
      seen.add(key);
      return true;
    });
  };
  return {exact:dedupe(exact).slice(0,14),near:dedupe(near).slice(0,10)};
}

function notesLabel(pcs,useFlats){return pcs.map(n=>rootName(n,useFlats)).join('・');}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}

const panel=document.createElement('section');
panel.className='note-reverse-search';
panel.setAttribute('aria-label','構成音から和音を逆引き');
panel.innerHTML=`
  <div class="note-reverse-head">
    <div><p class="note-reverse-kicker">REVERSE CHORD SEARCH</p><h2>音名から和音を検索</h2></div>
    <span class="note-reverse-badge">逆引き</span>
  </div>
  <p class="note-reverse-help">鳴っている音・構成音を入力すると、当てはまるコード名を探すよ。入力順の最初の音はベース音として候補順位に反映するよ。</p>
  <div class="note-reverse-input-row">
    <input id="noteChordSearchInput" type="search" inputmode="text" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="例：C E G / A C E G / ド ミ ソ">
    <button id="noteChordSearchBtn" type="button">和音を検索</button>
  </div>
  <div class="note-reverse-examples" aria-label="入力例">
    <button type="button" data-notes="C E G">C E G</button>
    <button type="button" data-notes="A C E G">A C E G</button>
    <button type="button" data-notes="D F A C">D F A C</button>
    <button type="button" data-notes="ド ミ ソ">ド ミ ソ</button>
  </div>
  <div id="noteChordSearchStatus" class="note-reverse-status" aria-live="polite">2音以上入力してね。</div>
  <div id="noteChordSearchResults" class="note-reverse-results"></div>
`;
existingSearch.insertAdjacentElement('afterend',panel);

const style=document.createElement('style');
style.textContent=`
.note-reverse-search{margin:16px 0 18px;padding:17px;border:1px solid rgba(120,95,55,.18);border-radius:16px;background:linear-gradient(180deg,#fffdf8,#fff);box-shadow:0 8px 22px rgba(62,47,24,.06)}
.note-reverse-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.note-reverse-head h2{margin:2px 0 0;font-size:1.05rem}.note-reverse-kicker{margin:0;color:#8a7659;font-size:.67rem;font-weight:800;letter-spacing:.12em}.note-reverse-badge{flex:none;padding:5px 9px;border-radius:999px;background:#eee4d2;color:#685538;font-size:.7rem;font-weight:800}.note-reverse-help{margin:9px 0 12px;color:var(--muted,#6e6e73);font-size:.79rem;line-height:1.65}
.note-reverse-input-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px}.note-reverse-input-row input{min-width:0;min-height:46px;padding:10px 12px;border:1px solid var(--border,#ddd);border-radius:11px;background:#fff;color:var(--text,#222);font:inherit;font-size:16px;outline:none}.note-reverse-input-row input:focus{border-color:#9f835b;box-shadow:0 0 0 3px rgba(159,131,91,.12)}.note-reverse-input-row button{min-height:46px;padding:10px 15px;border:0;border-radius:11px;background:#8b6f47;color:#fff;font:inherit;font-weight:800}
.note-reverse-examples{display:flex;flex-wrap:wrap;gap:6px;margin:9px 0 0}.note-reverse-examples button{padding:6px 9px;border:1px solid rgba(120,95,55,.18);border-radius:999px;background:#fff;color:#665437;font:inherit;font-size:.72rem;font-weight:700}.note-reverse-status{margin:12px 0 0;color:var(--muted,#6e6e73);font-size:.78rem}.note-reverse-status.is-error{color:#b3261e}.note-reverse-group-title{display:flex;align-items:center;justify-content:space-between;margin:14px 0 7px;font-size:.79rem;font-weight:800;color:#54462f}.note-reverse-group-title span{font-weight:600;color:var(--muted,#6e6e73)}
.note-reverse-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.note-reverse-result{display:block;width:100%;padding:11px 12px;text-align:left;border:1px solid rgba(120,95,55,.16);border-radius:12px;background:#fff;color:inherit;box-shadow:0 3px 10px rgba(0,0,0,.035)}.note-reverse-result:active{transform:translateY(1px)}.note-reverse-name{display:block;font-size:1rem;font-weight:900;color:#332919}.note-reverse-notes{display:block;margin-top:4px;color:var(--muted,#6e6e73);font-size:.7rem;line-height:1.45}.note-reverse-tag{display:inline-block;margin-top:6px;padding:3px 6px;border-radius:999px;background:#f2ece2;color:#6b5637;font-size:.64rem;font-weight:800}
@media(max-width:560px){.note-reverse-search{padding:14px}.note-reverse-input-row{grid-template-columns:1fr}.note-reverse-input-row button{width:100%}.note-reverse-grid{grid-template-columns:1fr}}
`;
document.head.appendChild(style);

const input=panel.querySelector('#noteChordSearchInput');
const searchBtn=panel.querySelector('#noteChordSearchBtn');
const status=panel.querySelector('#noteChordSearchStatus');
const results=panel.querySelector('#noteChordSearchResults');
let lastCandidates=new Map();

function candidateButton(candidate,index,group,useFlats){
  const id=`${group}-${index}`;
  lastCandidates.set(id,candidate);
  const detail=group==='near'&&candidate.missing.length
    ?`不足候補：${notesLabel(candidate.missing,useFlats)}を足すと一致`
    :(candidate.inversion?'最初の入力音をベースにした転回形':'完全一致');
  return `<button class="note-reverse-result" type="button" data-candidate="${id}"><span class="note-reverse-name">${escapeHtml(candidate.displayName)}</span><span class="note-reverse-notes">構成音：${escapeHtml(notesLabel(candidate.chordPcs,useFlats))}</span><span class="note-reverse-tag">${escapeHtml(detail)}</span></button>`;
}

function runSearch(){
  lastCandidates=new Map();
  const value=input.value;
  const {rawTokens,parsed,invalid}=parseInput(value);
  const inputPcs=uniqueSorted(parsed.map(n=>n.pc));
  const useFlats=preferFlats(value);
  status.classList.remove('is-error');
  results.innerHTML='';

  if(!rawTokens.length){status.textContent='2音以上入力してね。';return;}
  if(invalid.length){status.classList.add('is-error');status.textContent=`読み取れない音名：${invalid.join('、')}。例：C E G / Db F Ab / ド ミ ソ`;return;}
  if(inputPcs.length<2){status.textContent='異なる音を2音以上入力してね。';return;}

  const {exact,near}=buildCandidates(parsed,value);
  status.textContent=`入力音：${notesLabel(inputPcs,useFlats)} ／ ${inputPcs.length}音で検索`;
  let html='';
  if(exact.length){
    html+=`<div class="note-reverse-group-title">完全一致 <span>${exact.length}候補</span></div><div class="note-reverse-grid">${exact.map((c,i)=>candidateButton(c,i,'exact',useFlats)).join('')}</div>`;
  }
  if(near.length){
    html+=`<div class="note-reverse-group-title">近い候補 <span>入力音をすべて含む</span></div><div class="note-reverse-grid">${near.map((c,i)=>candidateButton(c,i,'near',useFlats)).join('')}</div>`;
  }
  if(!html){html='<div class="note-reverse-status is-error">該当する和音が見つからなかったよ。音名を追加・削除して試してみてね。</div>';}
  results.innerHTML=html;
}

function openCandidate(candidate){
  if(!candidate)return;
  rootEl.value=selectRootName(candidate.rootIndex);
  typeEl.value=candidate.typeKey;
  rootEl.dispatchEvent(new Event('change',{bubbles:true}));
  if(candidate.inversion&&candidate.bassPc!=null){
    const bass=selectRootName(candidate.bassPc);
    if([...bassEl.options].some(opt=>opt.value===bass)){
      bassEl.value=bass;
      bassEl.dispatchEvent(new Event('change',{bubbles:true}));
    }
  }
  document.getElementById('selectedChord')?.scrollIntoView({behavior:'smooth',block:'start'});
}

searchBtn.addEventListener('click',runSearch);
input.addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.isComposing){event.preventDefault();runSearch();}});
let timer;
input.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(runSearch,220);});
panel.querySelector('.note-reverse-examples').addEventListener('click',event=>{
  const button=event.target.closest('[data-notes]');
  if(!button)return;
  input.value=button.dataset.notes||'';
  runSearch();
});
results.addEventListener('click',event=>{
  const button=event.target.closest('[data-candidate]');
  if(!button)return;
  openCandidate(lastCandidates.get(button.dataset.candidate));
});
})();
