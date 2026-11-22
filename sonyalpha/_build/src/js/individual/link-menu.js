$(function () {
  
  const _frame = $(".js-frame"),
        _search = $(".js-search"),
        _form = $(".js-form");
  
  let pos = 0,
      top = 0,
      btn_animation;
  
  $(".js-btn-link").on('click', function () {
    
    // 通常画面の表示位置を取得する
    if (!_frame.hasClass("is-search")) {
      pos = $(window).scrollTop();
    }
    
    _search.scrollTop(1);   // メニューエリアを先頭に表示する
    _frame.toggleClass("is-search");    // メニュー表示を切り替える 
    
    // メニュー表示中はメインコンテンツが動かないようにfixするための数値設定を取得する
    if (_frame.hasClass("is-search")) {
      top = pos*(-1);
      
      bugfixScroll(_search);  // iOSの惰性スクロール対応する
    } else {
      top = 0;

      if (IS_SEARCH) {
        pos = 0;
        IS_SEARCH = false;
      }
      
      $(window).scrollTop(pos);
    }
    
    // 検索メニューアイコンのアニメーション    
    _frame.addClass("change-viewing");
    if (btn_animation) clearTimeout(btn_animation);
    btn_animation = setTimeout(function () {
      _frame.removeClass("change-viewing");
    }, 800);
        
    _frame.css({top: top});
    
    return false;
  });
});