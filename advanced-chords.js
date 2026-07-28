// 追加コード定義。script.js の typeData に安全に追記する。
Object.assign(typeData,{
 '5add9':{suffix:'5(add9)',label:'5(add9)',intervals:[0,2,7],mood:'力強さと広がりのある響き',use:'モダンロックのリフに合う。'},
 no3:{suffix:'(no3)',label:'no3',intervals:[0,7],mood:'長短を曖昧にした響き',use:'コードの上で旋律を動かしやすい。'},
 no5:{suffix:'(no5)',label:'no5',intervals:[0,4],mood:'軽く抜けのある響き',use:'鍵盤やベースと重なる時に便利。'},
 mMaj7:{suffix:'mMaj7',label:'mMaj7',intervals:[0,3,7,11],mood:'切なさと強い緊張感',use:'映画音楽やジャズで印象的。'},
 add2:{suffix:'add2',label:'add2',intervals:[0,2,4,7],mood:'近接した音が印象的',use:'ピアノ的な響きをギターで出したい時に。'},
 add4:{suffix:'add4',label:'add4',intervals:[0,4,5,7],mood:'明るさの中に緊張感がある',use:'ポップスの装飾コードに。'},
 madd11:{suffix:'m(add11)',label:'m(add11)',intervals:[0,3,5,7],mood:'深く浮遊感のある響き',use:'オルタナやR&Bに合う。'},
 madd13:{suffix:'m(add13)',label:'m(add13)',intervals:[0,3,7,9],mood:'哀愁と柔らかさのある響き',use:'マイナーコードの色付けに。'},
 '6sus2':{suffix:'6sus2',label:'6sus2',intervals:[0,2,7,9],mood:'開放的で軽やかな響き',use:'ポップスの装飾に便利。'},
 '6sus4':{suffix:'6sus4',label:'6sus4',intervals:[0,5,7,9],mood:'爽やかで少し緊張感がある',use:'サスの動きを残した伴奏に。'},
 '7sus4b9':{suffix:'7sus4♭9',label:'7sus4♭9',intervals:[0,1,5,7,10],mood:'強い緊張感のあるサス響き',use:'マイナーへの解決に。'},
 '13sus4':{suffix:'13sus4',label:'13sus4',intervals:[0,2,5,7,9,10],mood:'厚くファンキーな響き',use:'ソウルやゴスペルに合う。'},
 mMaj9:{suffix:'mMaj9',label:'mMaj9',intervals:[0,2,3,7,11],mood:'幻想的で切ない響き',use:'ジャズや劇伴に。'},
 maj7s11:{suffix:'maj7♯11',label:'maj7♯11',intervals:[0,4,6,7,11],mood:'明るく浮遊するリディアン感',use:'シティポップやジャズに。'},
 maj9s11:{suffix:'maj9♯11',label:'maj9♯11',intervals:[0,2,4,6,7,11],mood:'透明感のある現代的な響き',use:'ジャズやフュージョンに。'},
 maj13s11:{suffix:'maj13♯11',label:'maj13♯11',intervals:[0,2,4,6,7,9,11],mood:'豪華で浮遊感の強い響き',use:'現代ジャズや劇伴に。'},
 mMaj13:{suffix:'mMaj13',label:'mMaj13',intervals:[0,2,3,7,9,11],mood:'濃密で映画的な響き',use:'特殊な終止や劇伴に。'},
 '7b9b13':{suffix:'7(♭9,♭13)',label:'7(♭9,♭13)',intervals:[0,1,4,7,8,10],mood:'非常に濃いマイナー解決感',use:'ハーモニックマイナー系に。'},
 '7s9b13':{suffix:'7(♯9,♭13)',label:'7(♯9,♭13)',intervals:[0,3,4,7,8,10],mood:'荒々しく濃密な響き',use:'ブルースやオルタードに。'},
 '7b9s11':{suffix:'7(♭9,♯11)',label:'7(♭9,♯11)',intervals:[0,1,4,6,7,10],mood:'鋭く不穏な響き',use:'ジャズの緊張感あるドミナントに。'},
 '7s9s11':{suffix:'7(♯9,♯11)',label:'7(♯9,♯11)',intervals:[0,3,4,6,7,10],mood:'強烈で現代的な響き',use:'フュージョンやオルタードに。'},
 '9b5':{suffix:'9♭5',label:'9♭5',intervals:[0,2,4,6,10],mood:'クールで不安定な響き',use:'ジャズの代理ドミナントに。'},
 '9s5':{suffix:'9♯5',label:'9♯5',intervals:[0,2,4,8,10],mood:'浮遊感の強いドミナント',use:'マイナー解決に。'},
 '13b9':{suffix:'13♭9',label:'13♭9',intervals:[0,1,4,7,9,10],mood:'華やかさと強い緊張感',use:'ジャズのドミナントに。'},
 '13s9':{suffix:'13♯9',label:'13♯9',intervals:[0,3,4,7,9,10],mood:'ファンキーで荒々しい響き',use:'ブルースやファンクに。'},
 dimMaj7:{suffix:'dimMaj7',label:'dimMaj7',intervals:[0,3,6,11],mood:'不穏で鋭い響き',use:'現代音楽や劇伴に。'},
 dim9:{suffix:'dim9',label:'dim9',intervals:[0,2,3,6,9],mood:'不穏さに透明感が加わる',use:'特殊な経過コードに。'},
 aug9:{suffix:'aug9',label:'aug9',intervals:[0,2,4,8,10],mood:'広がりのある増和音',use:'ジャズや劇伴に。'},
 augs11:{suffix:'aug♯11',label:'aug♯11',intervals:[0,4,6,8],mood:'鋭く幻想的な響き',use:'現代的なアレンジに。'}
});

// 追加後に現在選択中のコードを再描画する。
selectedFormIndex=0;
updateBassOptions();
render();