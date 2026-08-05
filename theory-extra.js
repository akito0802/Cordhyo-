(()=>{'use strict';
const lessons=[
['メジャーペンタトニック','メジャースケールから4度と7度を抜いた5音音階。明るく歌いやすい。','C D E G A'],
['マイナーペンタトニック','ナチュラルマイナーから2度と♭6度を抜いた5音音階。ロックやソロの基本。','A C D E G'],
['ブルーススケール','マイナーペンタトニックに♭5を加えた音階。ブルースらしい濁りを作る。','A C D E♭ E G'],
['ハーモニックマイナー','ナチュラルマイナーの7度を上げ、V7→iの強い解決を作る。','A B C D E F G#'],
['メロディックマイナー','マイナーの6度と7度を上げた音階。ジャズのコードスケールで重要。','A B C D E F# G#'],
['オルタードスケール','ドミナント7th上で♭9・♯9・♭5・♯5を使い、強い緊張を作る。','G A♭ B♭ B D♭ E♭ F'],
['ホールトーンスケール','すべて全音間隔の6音音階。augや7♯5で浮遊感を作る。','C D E F# G# A#'],
['ディミニッシュスケール','半音と全音を交互に並べる8音音階。7♭9やdim7で使う。','G A♭ B♭ B C# D E F'],
['非和声音','経過音・刺繍音・掛留音など、コード外の音を解決させて動きを作る。','E→F→G'],
['モチーフ展開','短いフレーズを反復・移高・反行・リズム変更して曲に統一感を作る。','C-D-E → D-E-F'],
['ターゲットノート','コードが変わる瞬間に3度や7度などの構成音へ着地する。','G7→Cで F→E'],
['トップノートとコード選び','メロディ音を含む複数のコードから、機能とベースラインで選ぶ。','Eに対して C・Am・Em・Fmaj7']
];
function init(){
 const guide=document.querySelector('.theory-guide');
 const lab=document.getElementById('theoryLab');
 if(guide&&lab&&guide.nextElementSibling!==lab) guide.insertAdjacentElement('afterend',lab);
 if(document.getElementById('extraTheoryLessons')) return;
 const section=document.createElement('section');
 section.id='extraTheoryLessons';
 section.className='theory-guide';
 section.innerHTML=`<div class="theory-heading"><div><h2>スケール・旋律</h2><p>コードに合う音階と、メロディを作る考え方を追加で学べるよ。</p></div><span>${lessons.length}項目</span></div><div class="theory-cards">${lessons.map(x=>`<details class="theory-card"><summary>${x[0]}</summary><div class="theory-content"><p class="theory-main-text">${x[1]}</p><div class="theory-example">例：${x[2]}</div><ul class="theory-points"><li>まず構成音を声に出して確認する</li><li>コードトーンを着地点にする</li><li>実際に鳴らして響きを確かめる</li></ul></div></details>`).join('')}</div>`;
 const target=document.getElementById('theoryLab')||guide;
 target.insertAdjacentElement('afterend',section);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,50));else setTimeout(init,50);
})();