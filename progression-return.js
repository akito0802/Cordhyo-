const progressionCardsForReturn=document.querySelector('#progressionCards');

progressionCardsForReturn?.addEventListener('click',event=>{
 const button=event.target.closest('[data-root][data-type]');
 if(!button)return;
 event.preventDefault();
 event.stopImmediatePropagation();
 location.href=`index.html?root=${encodeURIComponent(button.dataset.root)}&type=${encodeURIComponent(button.dataset.type)}&from=progressions`;
},true);
