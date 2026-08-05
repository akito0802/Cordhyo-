(()=>{'use strict';
const songMap={
 '音名と半音・全音':['「きらきら星」','隣り合う鍵盤や1フレット差の動きを聴く'],
 '度数の数え方':['「きらきら星」','最初の跳躍を完全5度として数えてみる'],
 'コードはどう作る？':['「Let It Be」','C・G・Am・Fの構成音を1音ずつ確認する'],
 '平行調と同主調':['「House of the Rising Sun」','Aマイナー中心でもCメジャーと共通音が多い点を聴く'],
 '転調とは':['「Love on Top」','後半でキーが段階的に上がる高揚感を聴く'],
 '7thコードの違い':['「Fly Me to the Moon」','maj7・m7・7thの響きの差を追う'],
 'テンションとは':['「Just the Two of Us」','7thコード上の9th系の柔らかい色を聴く'],
 'sus・add・omitの違い':['「Every Breath You Take」','add9系の広がりを聴く'],
 'オンコードと転回形':['「Let It Be」','ベースが滑らかに動く箇所を探す'],
 'ガイドトーン':['「Autumn Leaves」','3度と7度が半音でつながる動きを聴く'],
 'キーとスケール':['「Ode to Joy」','主音へ戻る安定感を聴く'],
 'ダイアトニックコード':['「Pachelbel’s Canon」','同じキーのコードが循環するまとまりを聴く'],
 'トニック・サブドミナント・ドミナント':['「Stand by Me」','安定→展開→緊張→安定の流れを追う'],
 '終止形の種類':['「Happy Birthday」','フレーズ末尾の終わった感じを確認する'],
 'ドミナントモーション':['「Autumn Leaves」','V→Iの強い解決を探す'],
 'クリシェ':['「Stairway to Heaven」','内声やベースが半音ずつ動く感覚を聴く'],
 'ペダルポイント':['「Jump」','同じ低音の上で和音が動く感覚を聴く'],
 '経過和音':['「Georgia on My Mind」','主要コード間をつなぐ短い和音を探す'],
 '教会旋法7種類':['「So What」','Dドリアンの長6度を意識して聴く'],
 'ドリアン':['「So What」','短3度と長6度の組み合わせを聴く'],
 'フリジアン':['「Wherever I May Roam」','主音と♭2の暗い緊張を聴く'],
 'リディアン':['「The Simpsons Theme」','♯4が作る浮遊感を聴く'],
 'ミクソリディアン':['「Sweet Home Alabama」','♭7を含むロックらしい明るさを聴く'],
 'ハーモニックマイナー':['「Hava Nagila」','増2度の異国的な響きを聴く'],
 'メロディックマイナー':['「Nica’s Dream」','マイナー上の6度・7度の上昇感を聴く'],
 'オルタードスケール':['「All the Things You Are」','V7直前の強いテンションと解決を聴く'],
 'Aメロ・Bメロ・サビの役割':['「Pretender」','Aメロからサビへ音域と密度が上がる流れを追う'],
 'リハーモナイズの手順':['「Misty」','同じメロディに対するコードの色変化を聴く'],
 'ベースライン設計':['「A Whiter Shade of Pale」','下降するベースとコードのつながりを追う'],
 'CAGEDシステム':['「Little Wing」','同じコードを複数ポジションで彩る感覚を聴く']
};
const catDefaults={
 basics:{melody:'C–D–E–F｜G–F–E–D｜C',task:'最後のCが「帰ってきた」と感じるか確認する。'},
 chords:{melody:'Cコード上で E–G–D–E',task:'コードトーンと飾り音の違いを耳で比べる。'},
 harmony:{melody:'C｜F｜G｜C に合わせて E–F–D–C',task:'各小節の強拍をコードトーンに置く。'},
 scaleMelody:{melody:'D–E–F–G｜A–B–C–D',task:'特徴音を長めに伸ばしてモード感を確認する。'},
 composition:{melody:'C–D–E–G｜A–G–E–D',task:'同じモチーフを音域やリズムだけ変えて反復する。'},
 guitar:{melody:'6弦ルート→3度→5度→7度',task:'形ではなく度数名を声に出しながら弾く。'},
 ear:{melody:'C–E–G｜G–E–C',task:'上行・下降・跳躍を言葉で説明する。'},
 jazz:{melody:'D–F–A–C｜G–B–D–F｜C–E–G–B',task:'ii–V–Iで3度と7度の動きを追う。'}
};
function findItem(title){for(const [cat,c] of Object.entries(window.theoryCategories||{})){const item=(c.items||[]).find(x=>x.title===title);if(item)return{cat,item}}return null}
function titleOf(card){const h=card.querySelector('summary,h3,h2,strong');return h?h.textContent.trim():''}
function escapeHtml(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function build(card){if(card.dataset.examplesAdded)return;const title=titleOf(card),found=findItem(title);if(!found)return;card.dataset.examplesAdded='1';const {cat,item}=found,d=catDefaults[cat]||catDefaults.basics,song=songMap[title]||['参考曲は順次追加','まずは自分の好きな曲で、この項目の特徴を1か所探してみる'];const example=item.example||'実際に音を鳴らし、理論上の説明と耳で感じる印象を比べる。';const points=(item.points||[]).slice(0,3);
 const wrap=document.createElement('section');wrap.className='theory-study-pack';wrap.innerHTML=`<h4>もっと具体的に理解する</h4><div class="theory-study-grid"><div class="theory-study-box"><h5>🎼 具体例</h5><p>${escapeHtml(example)}</p>${points.length?`<div class="theory-study-notes">${points.map(x=>`<span class="theory-study-note">${escapeHtml(x)}</span>`).join('')}</div>`:''}</div><div class="theory-study-box"><h5>🎵 練習用メロディ例</h5><p><b>${escapeHtml(d.melody)}</b></p><p>${escapeHtml(d.task)}</p></div><div class="theory-study-box"><h5>🎧 参考楽曲</h5><p><b>${escapeHtml(song[0])}</b></p><p>${escapeHtml(song[1])}</p><p class="theory-song-note">※曲全体がこの理論だけでできているという意味ではなく、聴き取りの参考例だよ。</p></div><div class="theory-study-box"><h5>📝 ミニ問題</h5><p>この項目を使って、2〜4小節のコード進行かメロディを1つ作ってみよう。</p><details class="theory-mini-answer"><summary>答え方のヒント</summary><p>${escapeHtml(example)} を別のキーへ移すか、最後の音だけ変えて響きを比較すると理解しやすい。</p></details></div></div>`;
 const target=card.querySelector('.theory-content')||card;target.appendChild(wrap)
}
function scan(){document.querySelectorAll('#theoryCards > *').forEach(build)}
function init(){const root=document.getElementById('theoryCards');if(!root)return;scan();new MutationObserver(scan).observe(root,{childList:true})}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();