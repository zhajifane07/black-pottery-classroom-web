(() => {
 const fish='<path d="M63 41Q88 56 63 83Q37 59 63 41ZM63 83 49 105 63 98 77 105ZM48 56 33 66 45 71M78 56 92 66 81 72"/><circle cx="63" cy="50" r="2"/><path d="M50 64Q63 73 76 64M51 73Q63 80 74 73"/>';
 const left='<g>'+fish+'</g>';
 const pair=left+'<g transform="translate(200 0) scale(-1 1)">'+fish+'</g>';
 const unequal=left+'<g transform="translate(193 19) scale(-.72 .72)">'+fish+'</g>';
 const lotus='<path d="M100 98Q74 68 100 27Q126 68 100 98ZM100 98Q60 88 55 49Q90 56 100 98ZM100 98Q140 88 145 49Q110 56 100 98ZM100 98Q52 107 36 74Q76 68 100 98ZM100 98Q148 107 164 74Q124 68 100 98Z"/>';
 const fan='<path d="M100 100 39 52Q100 9 161 52L100 100Z"/><path d="M100 100 65 37M100 100V29M100 100 135 37"/>';
 const vine='<path d="M49 106Q135 98 117 33Q112 16 93 26Q70 44 104 61Q148 64 157 40M106 63Q55 37 45 64Q39 86 84 83M117 83Q165 69 161 98Q151 118 120 103"/>';
 const fret='<path d="M32 98V48H78V80H56V66M78 98V32H124V66H103V49M124 98V48H169V80H147V65"/>';
 window.POTTERY_MOTIFS=[
  {id:'paired-fish',name:'双鱼对望纹',symmetric:true,svg:pair,explanation:'左右两条鱼大小相同、位置相对。沿中间竖线对折，轮廓可以完全重合。'},
  {id:'unequal-fish',name:'大小双鱼纹',symmetric:false,svg:unequal,explanation:'两边都有鱼，但鱼的大小和位置不同。对折后不能完全重合。'},
  {id:'lotus',name:'莲瓣纹',symmetric:true,svg:lotus,explanation:'中间莲瓣两侧的花瓣成对对应。沿中线对折后，所有花瓣都能重合。'},
  {id:'vine',name:'舒卷藤纹',symmetric:false,svg:vine,explanation:'藤蔓向两侧伸展的方向和长短不同，找不到让整个纹样重合的对折直线。'},
  {id:'fan',name:'扇面纹',symmetric:true,svg:fan,explanation:'扇面两边形状、大小相同。沿扇柄到扇面中点的直线对折，轮廓能重合。'},
  {id:'fret',name:'错位回纹',symmetric:false,svg:fret,explanation:'中间与两边的回纹高度、转折方向不同，整个装饰单元无法对折重合。'}
 ];
 window.motifSVG=(motif,side='all')=>'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 130"><defs><clipPath id="half"><rect x="'+(side==='right'?100:0)+'" y="0" width="'+(side==='all'?200:100)+'" height="130"/></clipPath></defs><g clip-path="url(#half)" fill="none" stroke="#d0b578" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">'+motif.svg+'</g></svg>';
})();
