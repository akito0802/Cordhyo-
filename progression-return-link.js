document.addEventListener('click',event=>{
 const button=event.target.closest('.progression-chord[data-root][data-type]');
 if(!button)return;
 event.preventDefault();
 event.stopImmediatePropagation();
 const root=encodeURIComponent(button.dataset.root);
 const type=encodeURIComponent(button.dataset.type);
 location.href=`index.html?root=${root}&type=${type}&from=progressions`;
},true);
