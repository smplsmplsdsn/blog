/*--------------------------
create:takenori kawakami

/markup/library/photo_slide.html 
2011.03.05 create
2011.03.06 update
--------------------------*/
function photoSlide(elem){
	// 必須要素
	var t = document.getElementById(elem);
	var w_w = document.getElementById(elem+"_wrap");
	var p = document.getElementById(elem+"_prev");
	var n = document.getElementById(elem+"_next");
	if(t && w_w && p && n){
		// boxレイアウト未対応用（IE8 Opera11）
		if(/*@cc_on!@*/0 || navigator.userAgent.indexOf("Presto") != -1){
			w_w.className += " ie";
			p.className += " ie";
			n.className += " ie";
		};	
		
		// デフォルト設定
		var now = 1;
		var w = w_w.offsetWidth;
		var f = t.getElementsByTagName("figure");
		var c = f.length;
		if(c>1){n.style.visibility = "visible";}else{return false;}
		t.style.width = (w*c) + "px";
		
		// 前後ファンクション
		function prevSlide(){
			now--;
			p.style.visibility = now == 1?"hidden":"visible";
			n.style.visibility = now == c?"hidden":"visible";
			t.style.left = "-" + (w*now-w) + "px";
		}
		function nextSlide(){
			t.style.left = "-" + (w*now) + "px";
			now++;
			p.style.visibility = now == 1?"hidden":"visible";
			n.style.visibility = now == c?"hidden":"visible";
		}
		
		// 前後イベント
		if(typeof document.documentElement.ontouchstart == "object" && typeof document.documentElement.ontouchend == "object"){
			p.ontouchend = function(){prevSlide();}
			n.ontouchend = function(){nextSlide();}
			for(var i=0;i<c;i++){
				f[i].ontouchstart = function(){this.className = this.className == "caption_off"?"caption_on":"caption_off";}
			}
		}else{
			p.onclick = function(){prevSlide();}
			n.onclick = function(){nextSlide();}	
			for(var i=0;i<c;i++){
				f[i].onmouseover = function(){this.className = "caption_on";}
				f[i].onmouseout = function(){this.className = "caption_off";}
			}
		}
	}
}
