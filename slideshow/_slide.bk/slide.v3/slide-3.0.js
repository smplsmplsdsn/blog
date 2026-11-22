/**
 * スライドショー
 * Create by Simple Simples Design / Takenori Kawakami
 * 2011-03-08 Version 1
 * 2017-02-10 Version 2　タッチイベントを追加
 * 2017-04-19 Version 3 スライドクリックとオートスライドを追加
 */
var slideshow = {};

slideshow.init = function(_tgt_parent, slide_time) {

  var isTap = slideshow.isTapEvent(),
      loadImg = slideshow.loadImg,
      actClick = slideshow.actClick;

  var _tgt = $(".slideshow-frame", _tgt_parent),
      _w = _tgt.width(),
      _unit = $('.slideshow-unit', _tgt_parent),
      _unit_bg = $('.slideshow-bg', _tgt_parent),
      _tgt_all_unit = $('.slideshow-all', _tgt_parent),
      _nav_list = $('.slideshow-nav-list', _tgt_parent),
      _prev = $(".slideshow-prev", _tgt_parent),
      _next = $(".slideshow-next", _tgt_parent),
      pos_scroll = 0,
      pos_scroll_y = 0,
      pos_scroll_diff = 0,
      pos_scroll_y_diff = 0,
      pos = 0,
      current_num = 0,
      scrolling,
      w_w = window.innerWidth,
      auto_moving,
      stop_auto,
      resizing;

  /**
   * フレームの枠を設定を作成するメソッド
   */
  slideshow.setWidth = function(is_resize) {
    _w = _tgt.width();
    _tgt_all_unit.width(_w*_unit.length);
    _tgt_all_unit.css({
      "padding-right": _tgt.css("padding-right")
    });
    _unit.width(_w);

    // 横幅リサイズの場合は、表示位置をアニメーションなしで移動する
    if (is_resize) {
      _tgt_parent.addClass("js-resize");
      moving(current_num*_w*(-1), current_num);
      setTimeout(function(){
        _tgt_parent.removeClass("js-resize");
      }, 300);
    }
  }

  /**
   * ナビゲーションリストを作成するメソッド
   */
  function setNavList() {
    var t = "";
    for (var i = 0; i < _unit.length; i++) {
      if (0 == i) {
        t += '<span class="slideshow-nav-current"></span>';
      } else {
        t += '<span></span>';
      }
    }
    _nav_list.html(t);        
  }

  /**
   * スライド時のメソッド(コア部分)
   */
  function moving(new_pos, num){

    // スライド位置を変化させる
    _tgt_all_unit
    .attr("data-pos", new_pos)
    .css({
      "transform": "translate3d(" + new_pos + "px, 0, 0)"
    });

    // ナビゲーションの表示位置を変化させる
    if (typeof num === "number" && num !== current_num) {
      current_num = num;
      $("span", _nav_list).removeClass("slideshow-nav-current");
      $("span:nth-child(" + (current_num+1) + ")", _nav_list).addClass("slideshow-nav-current");
    }        
  }

  // 画像を先読みする
  _unit_bg.each(function(){
    var _this = $(this),
        img_src = _this.attr("data-image"),
        img = new Image();

    img.src = img_src;
    loadImg(img, function(){
      _this.css({
        "background-image": "url(" + img_src + ")"
      });
    }, function(){
      _this.css({
        "background-image": "none"
      });
    });
  });

  // フレーム枠をセットして、リストナビをセットする
  slideshow.setWidth();
  setNavList();

  // touchイベントが有効か判別する
  if (isTap) {

    // スライドした場合に移動距離から次のアクションを決定する(1/2)
    _tgt.on("touchstart", function(e){
      e.preventDefault();        
      pos_scroll = e.touches[0].pageX;
      pos_scroll_y = e.touches[0].pageY;
      pos_scroll_diff = 0;
      pos_scroll_y_diff = 0;
      pos = _tgt_all_unit.attr("data-pos");
    });

    // スライドした場合に移動距離から次のアクションを決定する(2/2)
    _tgt.on("touchmove", function(e){
      e.preventDefault();

      pos_scroll_diff = pos_scroll - e.touches[0].pageX,
      pos_scroll_y_diff = pos_scroll_y - e.touches[0].pageY,
      new_pos = pos - pos_scroll_diff;

      if (Math.abs(pos_scroll_diff) > 20) {          
        moving(new_pos);
      } else {
        window.scrollTo(0, $(window).scrollTop() + pos_scroll_y_diff);          
      }

      if (scrolling) clearTimeout(scrolling);
      scrolling = setTimeout(function(){
        var v = false;

        // スクロール量を測定する
        if (pos_scroll_diff > 50) {
          v = Math.floor(new_pos/_w);
        } else if (pos_scroll_diff < -50) {
          v = Math.ceil(new_pos/_w);
        } else {
          v = Math.round(new_pos/_w);
        }

        // アニメーションする
        if (v > 0) {
          v = 0;
        } else if (_unit.length + v < 1){
          v = 1 - _unit.length;
        }
        moving(v*_w, Math.abs(v));
      }, 100);
    });

    // スライドした場合に移動距離から次のアクションを決定する(1/2)
    _tgt.on("touchend", function(){

      if (pos_scroll_diff == 0 && pos_scroll_y_diff == 0 && actClick) {
        actClick(current_num+1, $(this).closest(".slideshow"), stopLoopSlide);
      }
    });
  } else {

    _tgt.on("click", function(e){
      e.stopPropagation();
      if (actClick) actClick(current_num+1, $(this).closest(".slideshow"), stopLoopSlide);
      return false;
    });
  }

  // スライドショー（ループ処理）
  if ("number" === typeof slide_time && slide_time > 0) {

    function loopSlide(){
      if (!stop_auto) {
        nextMove();
        if (auto_moving) clearTimeout(auto_moving);
        auto_moving = setTimeout(loopSlide, slide_time);
      }
    }
    setTimeout(loopSlide, slide_time);
  }

  // スライドショーを止める
  function stopLoopSlide(){
    if (auto_moving) clearTimeout(auto_moving);
    stop_auto = true;
  }

  // 次へをタップしたとき、アニメーションする
  _next.on("click", function(){
    nextMove();
    return false;
  });

  function nextMove(){
    var num = (current_num + 1 > _unit.length - 1)? 0: current_num + 1,
        v = num*(-1);

    moving(v*_w, Math.abs(v));
  }

  // 前へをタップしたとき、アニメーションする
  _prev.on("click", function(){
    var num = (current_num - 1 < 0)? _unit.length - 1: current_num - 1,
        v = num*(-1);

    moving(v*_w, Math.abs(v));
    return false;
  });

  // 横幅リサイズしたとき、フレーム枠と表示位置を調整する
  $(window).on("resize", function(){      
    if (resizing) clearTimeout(resizing);
    resizing = setTimeout(function(){
      var new_w_w = window.innerWidth;
      if (new_w_w != w_w) {
        slideshow.setWidth(true);
        w_w = new_w_w;
      }
    }, 600);
  });
}  


/**
 * タッチイベントが有効か判別するメソッド
 * iframeを新規に作って, iframeのwindowを使って判定する
 * http://www.yoheim.net/blog.php?q=20140206
 */
slideshow.isTapEvent = function() {
  var hasTapEvent,
      _iframe = document.createElement('iframe');
  document.body.appendChild(_iframe);
  hasTapEvent = ('ontouchstart' in _iframe.contentWindow);
  _iframe.remove();    
  return hasTapEvent;
}

/**
 * 画像先読み用のメソッド
 */
slideshow.loadImg = function(element, handler, errorHandler) {
  var errorHandler = errorHandler || handler;
  if ("onreadystatechange" in element) {
    element.onreadystatechange = function (e) {
      if (element.readyState === "loaded" || element.readyState === "complete") {
        return handler(e);
      } else {
        return errorHandler(e);          
      }
    };
  } else {
    element.onload = handler;
    element.onerror = errorHandler;
  }
}





