(()=>{'use strict';
if(typeof theoryCategories==='undefined')return;
const guide=document.querySelector('.theory-guide');
const controls=document.querySelector('.theory-controls');
const cards=document.getElementById('theoryCards');
const title=document.getElementById('theoryTitle');
const description=document.getElementById('theoryDescription');
if(!guide||!cards)return;
const icons={basics:'🎼',chords:'🎹',harmony:'🔄',advanced:'🧠',guitar:'🎸',jazz:'🎷',scaleMelody:'🎶',composition:'✍️',earcopy:'🎧',remix:'🔀',mix:'🎚️'};
const home=document.createElement('section');
home.className='theory-category-home';
home.innerHTML='<div class="theory-category-home-head"><h2>学びたいカテゴリを選ぶ</h2><p>カテゴリをタップすると、その分野だけをまとめたページに切り替わるよ。</p></div><div class="theory-category-grid"></div>';
const detailHead=document.createElement('div');
detailHead.className='theory-category-detail-head';
detailHead.innerHTML='<button type="button" class="theory-category-back">← カテゴリ一覧</button><div class="theory-category-detail-copy"><h2></h2><p></p></div>';
const originalHeading=guide.querySelector('.theory-heading');
if(originalHeading)originalHeading.hidden=true;
guide.before(home);
guide.prepend(detailHead);
const grid=home.querySelector('.theory-category-grid');
const back=detailHead.querySelector('.theory-category-back');
const detailTitle=detailHead.querySelector('h2');
const detailDescription=detailHead.querySelector('p');
function buildHome(){
 grid.innerHTML=Object.entries(theoryCategories).map(([key,cat])=>`<button type="button" class="theory-category-box" data-open-category="${key}"><span class="theory-category-icon">${icons[key]||'📘'}</span><span class="theory-category-name">${cat.label}</span><span class="theory-category-summary">${cat.description}</span><span class="theory-category-meta"><span>${cat.items.length}項目</span><span>開く →</span></span></button>`).join('');
}
function openCategory(key,push=true){
 if(!theoryCategories[key])return;
 activeCategory=key;
 if(typeof renderCards==='function')renderCards();
 const cat=theoryCategories[key];
 detailTitle.textContent=cat.label;
 detailDescription.textContent=cat.description;
 if(title)title.textContent=cat.label;
 if(description)description.textContent=cat.description;
 home.hidden=true;guide.hidden=false;if(controls)controls.hidden=false;
 if(push)history.pushState({category:key},'',`#category=${encodeURIComponent(key)}`);
 window.scrollTo({top:guide.offsetTop-16,behavior:'smooth'});
}
function showHome(push=true){
 home.hidden=false;guide.hidden=true;if(controls)controls.hidden=true;
 const search=document.getElementById('theorySearch');if(search){search.value='';}
 if(push)history.pushState({},'',location.pathname+location.search);
 window.scrollTo({top:home.offsetTop-16,behavior:'smooth'});
}
grid.addEventListener('click',e=>{const button=e.target.closest('[data-open-category]');if(button)openCategory(button.dataset.openCategory)});
back.addEventListener('click',()=>showHome());
window.addEventListener('popstate',()=>{const m=location.hash.match(/^#category=(.+)$/);m?openCategory(decodeURIComponent(m[1]),false):showHome(false)});
buildHome();
const initial=location.hash.match(/^#category=(.+)$/);
initial&&theoryCategories[decodeURIComponent(initial[1])]?openCategory(decodeURIComponent(initial[1]),false):showHome(false);
})();