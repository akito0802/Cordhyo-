// 省略フォームの特徴音が落ちて別コードと重複しないように、全候補を比較して最適化する。
function generatedShape(root,type,bassString){
 const rootPc=roots.indexOf(root),intervals=typeData[type].intervals.map(n=>n%12),tones=new Set(intervals.map(n=>(rootPc+n)%12));
 const rootFret=(rootPc-tuning[bassString]+12)%12||12,candidateLists=[];
 for(let s=bassString+1;s<6;s++){
  const candidates=[{fret:'x',interval:null}];
  for(let fret=Math.max(0,rootFret-1);fret<=rootFret+4;fret++){
   const pc=(tuning[s]+fret)%12;
   if(tones.has(pc))candidates.push({fret,interval:(pc-rootPc+12)%12});
  }
  candidateLists.push(candidates);
 }
 const weights=new Map(intervals.map(interval=>[interval,interval===0?.5:interval===7?1:5]));
 if(type==='7b13')weights.set(7,4);
 let bestShape=null,bestScore=-Infinity;
 function search(index,shape,covered,numericFrets){
  if(index===candidateLists.length){
   let score=0;covered.forEach(interval=>score+=weights.get(interval)||0);
   const spread=Math.max(...numericFrets)-Math.min(...numericFrets);
   score-=spread*.15;
   score-=numericFrets.reduce((sum,fret)=>sum+Math.abs(fret-rootFret),0)*.03;
   score-=shape.filter(fret=>fret==='x').length*.05;
   if(score>bestScore){bestScore=score;bestShape=[...shape];}
   return;
  }
  const stringIndex=bassString+1+index;
  candidateLists[index].forEach(({fret,interval})=>{
   shape[stringIndex]=fret;
   const nextCovered=new Set(covered),nextFrets=[...numericFrets];
   if(fret!=='x'){nextCovered.add(interval);nextFrets.push(fret);}
   search(index+1,shape,nextCovered,nextFrets);
  });
 }
 const initial=Array(6).fill('x');initial[bassString]=rootFret;
 search(0,initial,new Set([0]),[rootFret]);
 return bestShape;
}
