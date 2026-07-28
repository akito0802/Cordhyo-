const searchInput=document.querySelector('#chordSearch');
const searchResult=document.querySelector('#searchResult');

function normalizeChordText(text){
 return text.toLowerCase().replaceAll('♭','b').replaceAll('♯','#').replace(/\s+/g,'');
}

function filterChordOptions(){
 const query=normalizeChordText(searchInput.value);
 let visible=0;
 [...typeSelect.options].forEach(option=>{
  const match=!query||normalizeChordText(option.textContent).includes(query)||normalizeChordText(option.value).includes(query);
  option.hidden=!match;
  if(match)visible++;
 });
 [...typeSelect.querySelectorAll('optgroup')].forEach(group=>{
  group.hidden=![...group.querySelectorAll('option')].some(option=>!option.hidden);
 });
 searchResult.textContent=query?`${visible}種類が一致`:`全${typeSelect.options.length}種類`;
 if(query&&typeSelect.selectedOptions[0]?.hidden){
  const first=[...typeSelect.options].find(option=>!option.hidden);
  if(first){typeSelect.value=first.value;selectedFormIndex=0;updateBassOptions();render();}
 }
}

searchInput.addEventListener('input',filterChordOptions);
filterChordOptions();
