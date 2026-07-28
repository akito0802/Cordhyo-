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
 style.textContent='.context-return-wrap{margin:18px 0 4px}.context-return-button{display:inline-flex;align-items:center;justify-content:center;padding:12px 18px;border:1px solid #d8d2c7;border-radius:999px;background:#fffdf8;color:#171717;text-decoration:none;font-weight:900;box-shadow:0 8px 22px rgba(17,24,39,.08);transition:.15s ease}.context-return-button:hover{transform:translateY(-1px);border-color:#ff6b35;background:#fff5ef}@media(max-width:640px){.context-return-button{width:100%}}';
 document.head.appendChild(style);
 const returnWrap=document.createElement('div');
 returnWrap.className='context-return-wrap';
 returnWrap.innerHTML=`<a class="context-return-button" href="${destination.href}">${destination.label}</a>`;
 selectedChord.insertAdjacentElement('beforebegin',returnWrap);
}