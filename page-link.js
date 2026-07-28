const pageParams=new URLSearchParams(location.search);
const linkedRoot=pageParams.get('root');
const linkedType=pageParams.get('type');
if(linkedRoot&&roots.includes(linkedRoot))rootSelect.value=linkedRoot;
if(linkedType&&typeData[linkedType])typeSelect.value=linkedType;
if(linkedRoot||linkedType){
 selectedFormIndex=0;
 updateBassOptions();
 render();
 selectedChord.scrollIntoView({behavior:'smooth',block:'start'});
}
