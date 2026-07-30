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
      <button id="sharedThemeToggle" class="shared-menu-link" type="button" style="margin-top:auto;border:0;background:transparent;text-align:left"><span class="shared-menu-icon">🌙</span><span>ダークモード</span></button>
    </nav>
    <button id="sharedMenuOpenBtn" class="shared-menu-button" type="button" aria-label="メニューを開く" aria-expanded="false">☰</button>`;
  document.body.prepend(wrapper);

  const openButton=document.getElementById('sharedMenuOpenBtn');
  const closeButton=document.getElementById('sharedMenuCloseBtn');
  const menu=document.getElementById('sharedSideMenu');
  const overlay=document.getElementById('sharedMenuOverlay');
  const themeButton=document.getElementById('sharedThemeToggle');

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
  openButton.addEventListener('click',open);
  closeButton.addEventListener('click',close);
  overlay.addEventListener('click',close);
  themeButton?.addEventListener('click',()=>{
    const next=root.dataset.theme==='dark'?'light':'dark';
    localStorage.setItem(THEME_KEY,next);
    applyTheme(next);
  });
  document.addEventListener('keydown',event=>{if(event.key==='Escape')close()});

  if(document.body.classList.contains('piano-page')&&!document.querySelector('script[data-piano-descriptions]')){
    const script=document.createElement('script');
    script.src='piano-descriptions.js?v=1';
    script.dataset.pianoDescriptions='true';
    document.body.appendChild(script);
  }
})();