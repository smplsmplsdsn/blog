/**
 * スライドショー
 * Create by Simple Simples Design / Takenori Kawakami
 * 2011-03-08 Version 1
 * 2017-02-10 Version 2
 */
(function(){  
  var slideshow = function(_tgt_parent) {
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
        pos = 0,
        current_num = 0,
        scrolling,
        w_w = window.innerWidth,
        resizing;

    /**
     * フレームの枠を設定を作成するメソッド
     */
    function setWidth(is_resize) {
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
    setWidth();
    setNavList();

    // touchイベントが有効か判別する
    if (isTap) {
      
      // スライドした場合に移動距離から次のアクションを決定する(1/2)
      _tgt.on("touchstart", function(e){
        e.preventDefault();        
        pos_scroll = e.touches[0].pageX;
        pos_scroll_y = e.touches[0].pageY;
        pos = _tgt_all_unit.attr("data-pos");
      });

      // スライドした場合に移動距離から次のアクションを決定する(2/2)
      _tgt.on("touchmove", function(e){
        var diff = pos_scroll - e.touches[0].pageX,
            diff_y = pos_scroll_y - e.touches[0].pageY,
            new_pos = pos - diff;
        e.preventDefault();

        if (Math.abs(diff) > 20) {          
          moving(new_pos);
        } else {
          window.scrollTo(0, $(window).scrollTop() + diff_y);          
        }

        if (scrolling) clearTimeout(scrolling);
        scrolling = setTimeout(function(){
          var v = false;

          // スクロール量を測定する
          if (diff > 50) {
            v = Math.floor(new_pos/_w);
          } else if (diff < -50) {
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
    }

    // 次へをタップしたとき、アニメーションする
    _next.on("click", function(){
      var num = (current_num + 1 > _unit.length - 1)? 0: current_num + 1,
          v = num*(-1);

      moving(v*_w, Math.abs(v));
      return false;
    });

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
          setWidth(true);
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
  function isTapEvent() {
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
  function loadImg(element, handler, errorHandler) {
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

  /**
   * ページ読み込み後に処理をする
   * (読み込み準備完了で実行してしまうとページ読み込みに時間がかかる場合があるため)
   */
  var isTap;  
  $(window).on("load", function(){
    isTap = isTapEvent();
    $(".slideshow").each(function(){
      slideshow($(this));
    });
  })
})();
