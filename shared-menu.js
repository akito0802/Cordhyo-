(() => {
  if (document.getElementById('sharedMenuOpenBtn')) return;
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <div id="sharedMenuOverlay" class="shared-menu-overlay"></div>
    <nav id="sharedSideMenu" class="shared-side-menu" aria-hidden="true" aria-label="サイトメニュー">
      <div class="shared-side-menu-head"><h2>メニュー</h2><button id="sharedMenuCloseBtn" class="shared-menu-close" type="button" aria-label="メニューを閉じる">×</button></div>
      <a class="shared-menu-link" href="https://akito0802.github.io/NEET-note/"><span class="shared-menu-icon">📝</span><span>ノート</span></a>
      <a class="shared-menu-link" href="https://akito0802.github.io/scale/"><span class="shared-menu-icon">🎸</span><span>スケール</span></a>
      <a class="shared-menu-link" href="https://akito0802.github.io/-h/"><span class="shared-menu-icon">🎵</span><span>指板</span></a>
      <a class="shared-menu-link current" href="index.html"><span class="shared-menu-icon">📚</span><span>コード表</span></a>
    </nav>
    <button id="sharedMenuOpenBtn" class="shared-menu-button" type="button" aria-label="メニューを開く" aria-expanded="false">☰</button>`;
  document.body.prepend(wrapper);
  const openButton=document.getElementById('sharedMenuOpenBtn');
  const closeButton=document.getElementById('sharedMenuCloseBtn');
  const menu=document.getElementById('sharedSideMenu');
  const overlay=document.getElementById('sharedMenuOverlay');
  const open=()=>{menu.classList.add('open');overlay.classList.add('open');menu.setAttribute('aria-hidden','false');openButton.setAttribute('aria-expanded','true');document.body.style.overflow='hidden'};
  const close=()=>{menu.classList.remove('open');overlay.classList.remove('open');menu.setAttribute('aria-hidden','true');openButton.setAttribute('aria-expanded','false');document.body.style.overflow=''};
  openButton.addEventListener('click',open);
  closeButton.addEventListener('click',close);
  overlay.addEventListener('click',close);
  document.addEventListener('keydown',event=>{if(event.key==='Escape')close()});

  if(document.body.classList.contains('piano-page')&&!document.querySelector('script[data-piano-descriptions]')){
    const script=document.createElement('script');
    script.src='piano-descriptions.js?v=1';
    script.dataset.pianoDescriptions='true';
    document.body.appendChild(script);
  }
})();