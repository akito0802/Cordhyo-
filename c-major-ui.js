// 全ギターコード共通のコンパクトなフォーム切替UI。
(() => {
  // Bossa Nova forms are injected here deliberately because this file is already
  // part of the live page load chain. Keep a Bossa-labelled entry even when its
  // fret pattern is identical to an existing generic form.
  if (typeof getForms === 'function' && typeof roots !== 'undefined') {
    const beforeBossa = getForms;
    const rootIndex = Object.fromEntries(roots.map((n,i)=>[n,i]));
    const move = (root,shape) => shape.map(v=>typeof v==='number' ? v + rootIndex[root] : 'x');
    const bossaMovable = {
      maj9:[['Bossa・5弦Root △7(9) 基本形',['x',3,2,4,3,'x']]],
      '9':[['Bossa・5弦Root 7(9) 基本形',['x',3,2,3,3,'x']]],
      m9:[['Bossa・5弦Root m7(9) 基本形',['x',3,1,3,3,'x']]],
      maj7:[['Bossa・6弦Root △7 基本形',[8,'x',9,9,8,'x']]],
      m7:[['Bossa・6弦Root m7 基本形',[8,'x',8,8,8,'x']]],
      '13':[['Bossa・6弦Root 7(13) 基本形',[8,'x',8,9,10,'x']]]
    };
    const bossaFixed = {
      'D:maj9':[['Bossa・D△7(9) 実例',['x',5,4,6,5,'x']]],
      'E:9':[['Bossa・E7(9) 実例',['x',7,6,7,7,'x']]],
      'E:m9':[['Bossa・Em7(9) 実例',['x',7,5,7,7,'x']]],
      'D#:9':[['Bossa・E♭7(9) 実例',['x',6,5,6,6,'x']]],
      'B:13':[['Bossa・B7(13) 実例',[7,'x',7,8,9,'x']]],
      'A:13':[['Bossa・A7(13) 実例',['x',5,5,6,7,'x']]],
      'F:dim7':[['Bossa・Fdim 実例',['x',8,9,7,9,'x']]],
      'F#:m7':[['Bossa・F♯m7 実例',['x',9,11,9,10,'x']]]
    };
    getForms = function(root,type,bass){
      const base = beforeBossa(root,type,bass) || [];
      if (bass !== 'none') return base;
      const add=[];
      const existingNames = new Set(base.map(f=>f.shape));
      const push=(name,frets)=>{
        if(existingNames.has(name)) return;
        if(!frets.every(v=>v==='x'||(Number.isInteger(v)&&v>=0&&v<=21))) return;
        existingNames.add(name);
        add.push({shape:name,frets:[...frets],barres:[]});
      };
      (bossaFixed[`${root}:${type}`]||[]).forEach(([n,f])=>push(n,f));
      (bossaMovable[type]||[]).forEach(([n,f])=>push(n,move(root,f)));
      return base.concat(add);
    };
  }

  const isBossaVoicing = (shape='') => /Bossa/.test(shape);
  const isReferenceVoicing = (shape='') =>
    /Jazz|Standard|Triad Compact|Full Voicing|mMaj7・|6th・|m6・|資料/.test(shape);

  function shortLabel(shape='', index=0) {
    if (isBossaVoicing(shape)) return `🌴 ${shape}`;
    if (isReferenceVoicing(shape)) return `📘 ${shape}`;
    if (shape === 'オープンコード') return 'Open';
    if (shape === 'オンコード') return 'オンコード';
    if (shape === '6弦ルート') return '6弦ルート';
    if (shape === '5弦ルート') return '5弦ルート';
    if (shape.includes('6弦ルート')) return shape.replace('6弦ルート・','6弦 ');
    if (shape.includes('5弦ルート')) return shape.replace('5弦ルート・','5弦 ');
    if (shape.includes('4弦ルート')) return shape.replace('4弦ルート・','4弦 ');
    if (shape.includes('3弦ルート')) return shape.replace('3弦ルート・','3弦 ');
    if (shape.includes('初心者')) return '初心者';
    if (shape.includes('オープン・1弦')) return 'Open 省略';
    if (shape.includes('オープン・トップG')) return 'Open +G';
    if (shape.includes('CAGED・A')) return 'CAGED A';
    if (shape.includes('CAGED・G')) return 'CAGED G';
    if (shape.includes('CAGED・E')) return 'CAGED E';
    if (shape.includes('3弦トライアド')) return 'Triad 3弦';
    if (shape.includes('4弦トライアド')) return 'Triad 4弦';
    if (shape.includes('カッティング')) return 'Cutting';
    if (shape.includes('ジャズ')) return 'Jazz';
    if (shape.includes('ワイド')) return 'Wide';
    if (shape.includes('ハイポジション')) return 'High';
    return shape || `フォーム${index + 1}`;
  }

  function difficulty(shape='') {
    if (isBossaVoicing(shape)) return 'ボサノヴァ実用';
    if (shape === 'オンコード') return '指定ベース';
    if (shape.includes('Shell')) return 'ジャズ実用';
    if (shape.includes('Full Voicing')) return '4〜6音';
    if (shape.includes('Triad Compact')) return '高音トライアド';
    if (shape.includes('Jazz Basic')) return 'ジャズ定番';
    if (shape.includes('Standard')) return '定番';
    if (shape.includes('初心者') || shape.includes('オープン')) return '初心者向け';
    if (shape.includes('トライアド') || shape.includes('カッティング')) return '初級';
    if (shape.includes('CAGED') || shape.includes('ジャズ')) return '中級';
    if (shape.includes('ハイポジション') || shape.includes('ワイド')) return '上級';
    if (shape.includes('省略')) return '実用省略';
    return '定番';
  }

  function escapeHtml(value='') {
    return String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
  function optionHtml(form, index, currentIndex) {
    return `<option value="${index}" ${index===currentIndex?'selected':''}>${escapeHtml(shortLabel(form.shape,index))}｜${escapeHtml(difficulty(form.shape))}</option>`;
  }
  function groupedOptions(forms, currentIndex) {
    const normal=[], reference=[], bossa=[];
    forms.forEach((form,index)=>{
      if (isBossaVoicing(form.shape)) bossa.push({form,index});
      else if (isReferenceVoicing(form.shape)) reference.push({form,index});
      else normal.push({form,index});
    });
    let html='';
    if(normal.length) html += `<optgroup label="既存フォーム">${normal.map(({form,index})=>optionHtml(form,index,currentIndex)).join('')}</optgroup>`;
    if(reference.length) html += `<optgroup label="📘 資料準拠ボイシング">${reference.map(({form,index})=>optionHtml(form,index,currentIndex)).join('')}</optgroup>`;
    if(bossa.length) html += `<optgroup label="🌴 ボサノヴァフォーム">${bossa.map(({form,index})=>optionHtml(form,index,currentIndex)).join('')}</optgroup>`;
    return html;
  }

  function mount() {
    const host=document.querySelector('#selectedChord');
    if(!host||typeof getForms!=='function') return;
    const oldTabs=host.querySelector('.form-tabs'); if(oldTabs) oldTabs.style.display='none';
    const root=rootSelect?.value, type=typeSelect?.value, bass=bassSelect?.value||'none';
    if(!root||!type) return;
    const forms=getForms(root,type,bass)||[]; if(!forms.length) return;
    if(selectedFormIndex>=forms.length) selectedFormIndex=0;
    const currentIndex=Math.min(selectedFormIndex,forms.length-1), current=forms[currentIndex];
    const referenceCount=forms.filter(f=>isReferenceVoicing(f.shape)).length;
    const bossaCount=forms.filter(f=>isBossaVoicing(f.shape)).length;
    let ui=host.querySelector('.all-chords-compact-ui');
    if(!ui){ui=document.createElement('div');ui.className='all-chords-compact-ui';const card=host.querySelector('.selected-card');const heading=host.querySelector('.selected-heading');if(card&&heading) heading.insertAdjacentElement('afterend',ui);else host.prepend(ui);}
    ui.innerHTML=`<label class="all-chords-select-label"><span>押さえ方 ${referenceCount?`<b class="reference-count">📘 資料 ${referenceCount}</b>`:''} ${bossaCount?`<b class="bossa-count">🌴 ボサ ${bossaCount}</b>`:''}</span><select class="allChordsFormSelect" aria-label="${escapeHtml(root)}コードの押さえ方を選択">${groupedOptions(forms,currentIndex)}</select></label><div class="all-chords-current"><strong>${escapeHtml(shortLabel(current.shape,currentIndex))}</strong><span>${escapeHtml(difficulty(current.shape))} ・ ${currentIndex+1}/${forms.length}</span></div>`;
    const select=ui.querySelector('.allChordsFormSelect');
    if(select) select.addEventListener('change',event=>{selectedFormIndex=Number(event.target.value)||0;render();},{once:true});
  }

  const style=document.createElement('style');
  style.textContent=`.all-chords-compact-ui{display:flex;align-items:end;gap:12px;margin:12px 0 14px;padding:12px;border:1px solid #ded6c9;border-radius:14px;background:#fffaf2;position:relative;z-index:2}.all-chords-select-label{display:flex;flex:1;min-width:0;flex-direction:column;gap:6px;font-weight:800;color:#332b22}.all-chords-select-label>span{font-size:.82rem;color:#6b6256;display:flex;align-items:center;gap:8px;flex-wrap:wrap}.reference-count,.bossa-count{font-size:.72rem;font-weight:800;padding:3px 7px;border-radius:999px}.reference-count{background:#e7f5f8;color:#256574}.bossa-count{background:#eef4df;color:#486127}.all-chords-select-label select{display:block;width:100%;min-width:0;min-height:44px;padding:11px 38px 11px 12px;border:1px solid #d7c9b5;border-radius:11px;background:#fff;color:#2f2922;font:inherit;font-weight:750;pointer-events:auto;touch-action:manipulation;position:relative;z-index:3;-webkit-appearance:menulist;appearance:auto}.all-chords-current{display:flex;flex-direction:column;gap:3px;min-width:120px;text-align:right}.all-chords-current strong{font-size:.9rem}.all-chords-current span{font-size:.76rem;color:#756a5d}.selected-card .form-tabs{display:none!important}@media(max-width:560px){.all-chords-compact-ui{display:block;margin:10px 0 12px;padding:10px}.all-chords-current{display:none}.all-chords-select-label select{font-size:16px}}`;
  document.head.appendChild(style);
  const originalRender=render;
  render=function(...args){const result=originalRender.apply(this,args);requestAnimationFrame(mount);return result;};
  requestAnimationFrame(mount);
})();
