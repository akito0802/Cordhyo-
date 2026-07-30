(() => {
  const THEME_KEY='neet-note-theme';
  const root=document.documentElement;
  const meta=document.querySelector('meta[name="theme-color"]');

  const topNav=document.querySelector('.site-nav');
  if(topNav){
    const pianoLink=topNav.querySelector('a[href="piano.html"]');
    const insertInstrumentLink=(href,label)=>{
      if(topNav.querySelector(`a[href="${href}"]`))return;
      const link=document.createElement('a');
      link.href=href;
      link.textContent=label;
      if(location.pathname.endsWith('/'+href)||location.pathname.endsWith(href)){
        link.classList.add('active');
        link.setAttribute('aria-current','page');
      }
      pianoLink?.insertAdjacentElement('afterend',link);
    };
    insertInstrumentLink('ukulele.html','🌺 ウクレレ');
    insertInstrumentLink('bass.html','🎸 ベース');
  }

  if (document.getElementById('sharedMenuOpenBtn')) return;
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <div id="sharedMenuOverlay" class="shared-menu-overlay"></div>
    <nav id="sharedSideMenu" class="shared-side-menu" aria-hidden="true" aria-label="サイトメニュー">
      <div class="shared-side-menu-head"><h2>NEET NOTE</h2><button id="sharedMenuCloseBtn" class="shared-menu-close" type="button" aria-label="メニューを閉じる">×</button></div>
      <a class="shared-menu-link" href="https://akito0802.github.io/NEET-note/?mode=note"><span class="shared-menu-icon">📝</span><span>ノート</span></a>
      <a class="shared-menu-link" href="https://akito0802.github.io/scale/"><span class="shared-menu-icon">🎸</span><span>スケール</span></a>
      <a class="shared-menu-link" href="https://akito0802.github.io/-h/"><span class="shared-menu-icon">🎵</span><span>指板</span></a>
      <a class="shared-menu-link current" href="index.html"><span class="shared-menu-icon">📚</span><span>コード</span></a>
      <a class="shared-menu-link" href="https://akito0802.github.io/NEET-note/tools.html"><span class="shared-menu-icon">🧰</span><span>ツール</span></a>
      <button id="sharedHelpButton" class="shared-menu-link" type="button" style="border:0;background:transparent;text-align:left"><span class="shared-menu-icon">❓</span><span>ヘルプ・使い方</span></button>
      <button id="sharedThemeToggle" class="shared-menu-link" type="button" style="margin-top:auto;border:0;background:transparent;text-align:left"><span class="shared-menu-icon">🌙</span><span>ダークモード</span></button>
    </nav>
    <button id="sharedMenuOpenBtn" class="shared-menu-button" type="button" aria-label="メニューを開く" aria-expanded="false">☰</button>`;
  document.body.prepend(wrapper);

  const helpStyle=document.createElement('style');
  helpStyle.textContent=`.neet-help-backdrop{position:fixed;inset:0;z-index:20000;display:none;place-items:center;padding:18px;background:rgba(17,24,39,.58)}.neet-help-backdrop.open{display:grid}.neet-help-dialog{width:min(720px,100%);max-height:min(82dvh,760px);overflow:auto;padding:20px;background:var(--paper,#fffdf8);color:var(--ink,#1f2937);border:1px solid var(--line,#ded6c9);border-radius:20px;box-shadow:0 24px 70px rgba(0,0,0,.3)}html[data-theme=dark] .neet-help-dialog{background:#201e1b;color:#f5f2ec;border-color:#514a42}.neet-help-head{display:flex;align-items:center;justify-content:space-between;gap:16px;position:sticky;top:-20px;margin:-20px -20px 16px;padding:18px 20px;background:inherit;border-bottom:1px solid var(--line,#ded6c9);z-index:1}.neet-help-head h2{margin:0;font-size:1.25rem}.neet-help-close{width:38px;height:38px;border:0;border-radius:11px;background:rgba(127,127,127,.14);color:inherit;font-size:1.35rem}.neet-help-intro{color:inherit;opacity:.72;line-height:1.7}.neet-help-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.neet-help-item{padding:14px;border:1px solid var(--line,#ded6c9);border-radius:14px;background:rgba(127,127,127,.06)}.neet-help-item b{display:block;margin-bottom:5px}.neet-help-item p{margin:0;line-height:1.65;opacity:.75;font-size:.88rem}@media(max-width:600px){.neet-help-backdrop{align-items:end;padding:0}.neet-help-dialog{max-height:88dvh;border-radius:22px 22px 0 0}.neet-help-grid{grid-template-columns:1fr}}`;
  document.head.appendChild(helpStyle);

  const page=location.pathname.split('/').pop()||'index.html';
  const pageData={
    'index.html':['ギターコード表',[['コード検索','コード名の一部を入力して候補を絞り込む。'],['ルート音','コードの基準になる音を選ぶ。'],['コードの種類','メジャー、マイナー、テンションなどを選ぶ。'],['オンコード','最低音を指定して分数コードを表示する。'],['フォーム表示','押さえる位置、構成音、ルート音を確認する。']]],
    'piano.html':['ピアノコード表',[['ルート音','コードの中心音を選ぶ。'],['コードの種類','表示したいコードタイプを選ぶ。'],['鍵盤表示','色の付いた鍵盤が構成音。ルート音は強調表示される。'],['構成音','コードを作る音名と度数を確認する。']]],
    'bass.html':['ベースコード表',[['ルート音','基準となる音を選ぶ。'],['コードの種類','コードに合う構成音を選ぶ。'],['指板表示','ベース指板上の音の位置を確認する。'],['実用フォーム','演奏で使いやすい位置を優先して表示する。']]],
    'ukulele.html':['ウクレレコード表',[['ルート音','コードの基準音を選ぶ。'],['コードの種類','基本コードやテンションを選ぶ。'],['フォーム表示','4弦の押さえ方と開放弦を確認する。'],['構成音','フォームに含まれる音を確認する。']]],
    'usage.html':['使い方',[['ページ切替','上部タブで楽器や理論ページを移動する。'],['コード選択','ルート音、種類、必要ならオンコードを順に選ぶ。'],['フォーム比較','複数候補がある場合は弾きやすさや音域で選ぶ。']]],
    'progressions.html':['コード進行',[['キー選択','進行の中心となるキーを選ぶ。'],['進行例','定番進行を確認して作曲へ利用する。'],['コード確認','気になるコードはコード表でフォームを確認する。']]],
    'theory.html':['コード理論',[['度数','ルート音からの音程関係を確認する。'],['コード構成','3度・5度・7度・テンションの役割を読む。'],['実践','理論説明からコード表や進行例へ移動する。']]]
  };
  const [helpTitle,items]=pageData[page]||['コード辞典',[['楽器ページ','ギター・ピアノ・ベース・ウクレレを切り替える。'],['コード選択','ルート音とコードタイプから調べる。'],['理論・進行','仕組みや実際の使い方を確認する。']]];
  const help=document.createElement('div');
  help.id='sharedHelpModal';help.className='neet-help-backdrop';help.setAttribute('aria-hidden','true');
  help.innerHTML=`<section class="neet-help-dialog" role="dialog" aria-modal="true" aria-labelledby="sharedHelpTitle"><div class="neet-help-head"><h2 id="sharedHelpTitle">${helpTitle}の使い方</h2><button class="neet-help-close" type="button" aria-label="ヘルプを閉じる">×</button></div><p class="neet-help-intro">このページで使える機能をまとめているよ。</p><div class="neet-help-grid">${items.map(([t,d])=>`<div class="neet-help-item"><b>${t}</b><p>${d}</p></div>`).join('')}</div></section>`;
  document.body.appendChild(help);

  const openButton=document.getElementById('sharedMenuOpenBtn');
  const closeButton=document.getElementById('sharedMenuCloseBtn');
  const menu=document.getElementById('sharedSideMenu');
  const overlay=document.getElementById('sharedMenuOverlay');
  const themeButton=document.getElementById('sharedThemeToggle');
  const helpButton=document.getElementById('sharedHelpButton');

  const applyTheme=theme=>{
    root.dataset.theme=theme;
    root.style.colorScheme=theme;
    meta?.setAttribute('content',theme==='dark'?'#141311':'#d9c7a8');
    if(themeButton){
      const dark=theme==='dark';
      themeButton.innerHTML=`<span class="shared-menu-icon">${dark?'☀️':'🌙'}</span><span>${dark?'ライトモード':'ダークモード'}</span>`;
      themeButton.setAttribute('aria-label',dark?'ライトモードに切り替える':'ダークモードに切り替える');
      themeButton.setAttribute('aria-pressed',String(dark));
    }
  };
  const saved=localStorage.getItem(THEME_KEY);
  applyTheme(saved==='light'||saved==='dark'?saved:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));

  const open=()=>{menu.classList.add('open');overlay.classList.add('open');menu.setAttribute('aria-hidden','false');openButton.setAttribute('aria-expanded','true');document.body.style.overflow='hidden'};
  const close=()=>{menu.classList.remove('open');overlay.classList.remove('open');menu.setAttribute('aria-hidden','true');openButton.setAttribute('aria-expanded','false');document.body.style.overflow=''};
  const openHelp=()=>{close();help.classList.add('open');help.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'};
  const closeHelp=()=>{help.classList.remove('open');help.setAttribute('aria-hidden','true');document.body.style.overflow=''};
  openButton.addEventListener('click',open);
  closeButton.addEventListener('click',close);
  overlay.addEventListener('click',close);
  helpButton?.addEventListener('click',openHelp);
  help.querySelector('.neet-help-close')?.addEventListener('click',closeHelp);
  help.addEventListener('click',e=>{if(e.target===help)closeHelp()});
  themeButton?.addEventListener('click',()=>{
    const next=root.dataset.theme==='dark'?'light':'dark';
    localStorage.setItem(THEME_KEY,next);
    applyTheme(next);
  });
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){close();closeHelp()}});

  if(document.body.classList.contains('piano-page')&&!document.querySelector('script[data-piano-descriptions]')){
    const script=document.createElement('script');
    script.src='piano-descriptions.js?v=1';
    script.dataset.pianoDescriptions='true';
    document.body.appendChild(script);
  }
})();