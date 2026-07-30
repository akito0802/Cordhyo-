const themeLink=document.createElement('link');
themeLink.rel='stylesheet';
themeLink.href='neet-note-theme.css?v=1';
document.head.appendChild(themeLink);

const pageParams=new URLSearchParams(location.search);
const linkedRoot=pageParams.get('root');
const linkedType=pageParams.get('type');
const linkedFrom=pageParams.get('from');

if(linkedRoot&&roots.includes(linkedRoot))rootSelect.value=linkedRoot;
if(linkedType&&typeData[linkedType])typeSelect.value=linkedType;

if(linkedRoot||linkedType){
 selectedFormIndex=0;
 updateBassOptions();
 render();
 selectedChord.scrollIntoView({behavior:'smooth',block:'start'});
}

const returnDestinations={
 usage:{href:'usage.html?restore=1',label:'← 使い方へ戻る'},
 progressions:{href:'progressions.html?restore=1',label:'← コード進行へ戻る'}
};

if(returnDestinations[linkedFrom]){
 const destination=returnDestinations[linkedFrom];
 const style=document.createElement('style');
 style.textContent='.context-return-wrap{margin:18px 0 4px}.context-return-button{display:inline-flex;align-items:center;justify-content:center;padding:12px 18px;border:1px solid #e5e5ea;border-radius:12px;background:#fff;color:#1d1d1f;text-decoration:none;font-weight:800;box-shadow:0 5px 14px rgba(0,122,255,.1);transition:.15s ease}.context-return-button:hover{transform:translateY(-1px);border-color:#007aff;background:#edf5ff}@media(max-width:640px){.context-return-button{width:100%}}';
 document.head.appendChild(style);
 const returnWrap=document.createElement('div');
 returnWrap.className='context-return-wrap';
 returnWrap.innerHTML=`<a class="context-return-button" href="${destination.href}">${destination.label}</a>`;
 selectedChord.insertAdjacentElement('beforebegin',returnWrap);
}

const sharedMenuStyle=document.createElement('link');
sharedMenuStyle.rel='stylesheet';
sharedMenuStyle.href='shared-menu.css?v=2';
document.head.appendChild(sharedMenuStyle);
const sharedMenuScript=document.createElement('script');
sharedMenuScript.src='shared-menu.js?v=2';
document.body.appendChild(sharedMenuScript);