/**
 * Ajaxでデータを取得しないと何も始まらない。
 */
$(function () {
  let INIT_HTML = '',
      i;
  
  $.ajax({
    url: JSON_FILE,
    type: "GET",
    dataType: "json",
    timeout: 5000
  }).done(function (data) {
    let result;
    JSON_DATA = data;
    
    // 検索用の調整
    for (i in JSON_DATA) {
      
      let ymd = getYmd(JSON_DATA[i]['11']);
      
      JSON_DATA[i]['11-2'] = new Date(ymd).getTime();   // 数値に変更
      JSON_DATA[i]['12'] = (+JSON_DATA[i]['12']);   // 型を変更
      JSON_DATA[i]['25'] = (+JSON_DATA[i]['25']);   // 型を変更
      JSON_DATA[i]['26'] = (+JSON_DATA[i]['26']);   // 型を変更
      JSON_DATA[i]['27'] = (+JSON_DATA[i]['27']);   // 型を変更
      DATA_MAKER.push(JSON_DATA[i]['1']);
  
    }
    
    setSearchMaker();   // メーカーをマークアップする
    setSearchAction();    // 検証条件を機能させる
    search(false, true);   // 検索する    
    
  }).fail(function (e) {
    
    // TODO js-reloadをクリックした時の処理 検索条件を保持したまま再検索するのが妥当
    INIT_HTML = `
  <div class="error">
  <div class="error__inner">
    <p>あ、読み込みに失敗しました...</p>
    <a class="js-reload">再読み込みする</a>
  </div>
  </div>
    `;
    $('.js-rendering').html(INIT_HTML);
  }).always(function () {
        
  });

});

const getYmd = (ymd) => {
  let array_ymd = ymd.split('-'),
      y = array_ymd[0].trim() || '1999',
      m = array_ymd[1].trim() || '01',
      d = array_ymd[2].trim() || '01';
  
  if (d == 0) d = "1";

  y = (y.length === 1)? '0' + y: y;
  m = (m.length === 1)? '0' + m: m;
  d = (d.length === 1)? '0' + d: d;
  
  return y + '-' + m + '-' + d;
}
