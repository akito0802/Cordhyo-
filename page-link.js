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
 usage:{href:'usage.html',label:'← 使い方へ戻る'},
 progressions:{href:'progressions.html',label:'← コード進行へ戻る'}
};

if(returnDestinations[linkedFrom]){
 const destination=returnDestinations[linkedFrom];
 const returnWrap=document.createElement('div');
 returnWrap.className='context-return-wrap';
 returnWrap.innerHTML=`<a class="context-return-button" href="${destination.href}">${destination.label}</a>`;
 selectedChord.insertAdjacentElement('beforebegin',returnWrap);
}
