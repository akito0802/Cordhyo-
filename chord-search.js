const searchInput=document.querySelector('#chordSearch');
const searchResult=document.querySelector('#searchResult');

const searchStyle=document.createElement('style');
searchStyle.textContent='.search-field{display:grid;gap:8px;margin-bottom:16px;color:var(--muted);font-size:13px;font-weight:800}.search-field input{width:100%;padding:16px 18px;border:1px solid var(--line);border-radius:14px;background:white;color:var(--ink);outline:none;font-size:17px}.search-field input:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(255,107,53,.13)}.search-field small{min-height:1.2em;color:var(--muted);font-size:11px;font-weight:700}';
document.head.appendChild(searchStyle);

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
