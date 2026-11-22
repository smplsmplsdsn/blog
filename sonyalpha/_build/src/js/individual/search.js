/**
 * 検索結果を表示する
 *
 * @param boolean|NULL is_sort: is_sort 並び替えかどうか
 * @param boolean|NULL is_init: 初期の読み込み時かどうか
 */
const search = (is_sort, is_init) => {
    
  const _rendering = $(".js-rendering"),
        _resut_text = $(".js-result-message");
  
  const countupdown_number = (typeof OBJ_NUMBER == 'object')? OBJ_NUMBER: new Intl.NumberFormat('en-US', {style: 'decimal'});
    
  let data = [].concat(JSON_DATA),    // データの初期化
      html = '',
      result_num = 0,
      i = 0,
      j;
  
  // 配列の上書き防止
  let data_3 = '',
      data_4 = '',
      data_5 = '',
      data_7 = '',
      data_13 = '',
      data_15 = '',
      data_16 = '',
      data_17 = '',
      data_18 = '',
      data_19 = '',
      data_20 = '',
      data_21 = '',
      data_24 = '',
      data_28 = '';
  
  // 検索値
  let val_price_low = $('[name="price-low"]').val(),
      val_price_high = $('[name="price-high"]').val(),
      val_length_low = $('[name="length-low"]').val(),
      val_length_high = $('[name="length-high"]').val(),
      val_aperture_low = $('[name="aperture-low"]').val(),
      val_aperture_high = $('[name="aperture-high"]').val(),
      val_weight_low = $('[name="weight-low"]').val(),
      val_weight_high = $('[name="weight-high"]').val(),
      val_filter_low = $('[name="filter-low"]').val(),
      val_filter_high = $('[name="filter-high"]').val(),
      val_maker = $('[name="maker"]:checked').map(function(){return $(this).val();}).get(),
      val_lens = $('[name="lens"]:checked').map(function(){return $(this).val();}).get(),
      val_sort = $('[name="sort"]').val(),
      val_orderby = $('[name="orderby"]').val();
  
  let val_max = 99999999;
  
  // 初期化する
  _rendering.css({visibility: 'hidden'});
  if (!is_sort) _resut_text.html('');   // 並び替えでない場合
  
  
  // 検索条件に合わせて、並び替えを行う（初期は発売日順）
  if (val_sort == "") {
      data = arraySort(data, '11-2', true);
  } else {
    
    val_sort = val_sort.split(',');
    val_orderby = val_orderby.split(',');

    if (val_sort.length === val_orderby.length) {
      for (i = 0; i < val_orderby.length; i++) {        
        val_orderby[i] = (val_orderby[i] === "1")? false: true;
      }
          
      
      data = arraySort(data, val_sort, val_orderby);      
    }
  }
    
  /**
   * フォームの値を確認する
   */
  const check_val = function (val, is_high) {
    
    if (val != '' && isNumber(val*10)) {
      val = (+val);
    } else {
      if (is_high) {
        val = val_max;
      } else {
        val = 0;
      }
    }
    
    return val;
  }
  
  // コーディングする
  if (data.length > 0) {
    
    // 検索条件の値を確認する
    val_price_low = check_val(val_price_low);
    val_price_high = check_val(val_price_high, true);
    val_length_low = check_val(val_length_low);
    val_length_high = check_val(val_length_high, true);
    val_aperture_low = check_val(val_aperture_low);
    val_aperture_high = check_val(val_aperture_high, true);
    val_weight_low = check_val(val_weight_low);
    val_weight_high = check_val(val_weight_high, true);
    val_filter_low = check_val(val_filter_low);
    val_filter_high = check_val(val_filter_high, true);
    
    for (i = 0; i < data.length; i++) {
      let data_diff = '',
          data_diff_val = 0;
      
      data_5 = (data[i][5] != '')? (+(data[i][5].replace(/,/g, ''))): 0;
      data_7 = (data[i][7] != '')? (+(data[i][7].replace(/,/g, ''))): 0;
      
      // メーカー確認
      if (val_maker.length > 0 && val_maker.length < DATA_MAKER.length) {
        if (arrayMatch(val_maker, data[i][1]) === false) {
          continue;
        }
      }
      
      // 単焦点かズームかの場合を判別する
      if (val_lens.length === 1) {
        if (
          (val_lens[0] === 'single' && data[i][13] != '') || 
          (val_lens[0] === 'zoom' && data[i][13] === '')
        ) {
          continue;          
        }
      }
      
      // 絞り込み（価格、重量）
      if (
        val_price_low > (+(data[i][5].replace(/,/g, ''))) || 
        val_price_high < (+(data[i][5].replace(/,/g, ''))) || 
        val_weight_low > (+(data[i][17].replace(/,/g, ''))) || 
        val_weight_high < (+(data[i][17].replace(/,/g, '')))
      ) {
        continue;
      }
      
      // 絞り込み（フィルター）
      if (val_filter_low === 0 && val_filter_high === val_max) {
        
      } else {
        data_28 = data[i][28];
        if (
          data_28 == '' ||
          val_filter_low*10 > (+(data[i][28])) || 
          val_filter_high*10 < (+(data[i][28]))
        ) {
          continue;
        }        
      }
      
      // 絞りこみ（焦点距離）
      if (data[i][13] === '') {   // 単焦点の場合
                
        if (
          ((+data[i][12]) < val_length_low) || 
          ((+data[i][12]) > val_length_high)
        ) {
          continue;
        }
      } else {    // ズームの場合
        
        switch (true) {
          case val_length_low === 0 && val_length_high === val_max:
            break;
            
          case val_length_low === 0:
            if (
              ((+data[i][12]) > val_length_high) || 
              ((+data[i][13]) < val_length_high)
            ) {
              continue;
            }
            break;
          case val_length_high === val_max:
            if (
              ((+data[i][12]) > val_length_low) || 
              ((+data[i][13]) < val_length_low)
            ) {
              continue;
            }
            break;
          default:
            if (
              ((+data[i][12]) > val_length_low) || 
              ((+data[i][13]) < val_length_high)
            ) {
              continue;
            }
        }
      }      
      
      // 絞りこみ（F値）
      if (data[i][15] === '') {
        
        if (
          ((+data[i][14])*10 < val_aperture_low*10) || 
          ((+data[i][14])*10 > val_aperture_high*10)
        ) {
          continue;
        }
      } else {
        
        switch (true) {
          case val_aperture_low === 0 && val_aperture_high === val_max:
            break;
            
          case val_aperture_low === 0:
            if ((+data[i][15])*10 > val_aperture_high*10) {
              continue;
            }
            break;
          case val_aperture_high === val_max:
            if ((+data[i][14])*10 < val_aperture_low*10) {
              continue;
            }
            break;
          default:
            if (
              ((+data[i][14])*10 < val_aperture_low*10) || 
              ((+data[i][15])*10 > val_aperture_high*10)
            ) {
              continue;
            }
        }
                        
      }
      
      // マークアップ
      
      result_num++;
      
      data_3 = data[i][3];
      if (data_3 != '') {
        data_3 = '<span class="unit__model">' + data_3 + '</span>';
      }
      
      data_4 = data[i][4]
      if (data_4 != '') {
        data_4 = '<span class="unit__maker-price">' + data_4 + '<span>円</span></span>';
      }
         
      if (data_5 > 0 && data_7 > 0) {
        data_diff_val = data_5 - data_7;

        if (data_diff_val > 0) {
          data_diff = '<p class="unit__price-best">過去安' + data[i][7] + '円 (' + 
                      data[i][8].split(" ")[0] + ': 差額 ' + countupdown_number.format(data_diff_val) + '円)</p>';        
        }
      }
      
      data_5 = data[i][5];
      if (data_5 != '') {
        data_5 = data_5 + '<span>円</span>';
      } else {
        data_5 = 'データなし';
      }
            
      data_13 = data[i][13];
      if (data_13 != '') {
        data_13 = ' - ' + data_13;
      }
            
      data_15 = data[i][15];
      if (data_15 != '') {
        data_15 = ' - ' + data_15;
      }
      
      data_16 = data[i][16];
      if (data_16 != '') {
        data_16 = '';  
        data_16 += '<div>';  
        data_16 += '<dt>OSS</dt>';  
        data_16 += '<dd>◯</dd>';  
        data_16 += '</div>';          
      }
      
      data_18 = data[i][18];
      if (data_18 != '') {
        data_18 = data_18 + 'mm';
      } else {
        data_18 = '-';
      }
      
      data_19 = data[i][19];
      if (data_19 != '') {
        data_19 = data_19 + 'cm';
      } else {
        data_19 = '-';
      }
      
      data_20 = data[i][20];
      if (data_20 != '') {
        data_20 = ' / ' + data_20 + 'cm';
      }
      
      data_21 = data[i][21];
      if (data_21 == '') {
        data_21 = '-';
      }
            
      data_24 = data[i][24];
      if (data_24 != '') {
        data_24 = '<p class="unit__add">' + data_24 + '</p>';
      }
      
      html += `
<section class="unit">
  <div class="unit__column">
    <figure class="unit__img" style="background-image:url('${data[i][22]}');"></figure>
    <div class="unit__text">
      <div class="unit__header">
        <p class="unit__maker">${data[i][1]}</p>
        <h1 class="unit__name">${data[i][2]}</h1>
      </div>
      <p class="unit__ex">
        ${data_3}${data_4}<span class="unit__release">${data[i][11]}<span>発売</span></span>
      </p>
      <dl class="unit__spec">
        <div>
          <dt>重さ</dt>
          <dd>${data[i][17]}g</dd>
        </div>
        <div>
          <dt>絞り</dt>
          <dd>F${data[i][14]}${data_15}</dd>
        </div>
        <div>
          <dt>焦点距離</dt>
          <dd>${data[i][12]}${data_13}mm</dd>
        </div>
        <div>
          <dt>フィルター径</dt>
          <dd>${data_18}</dd>
        </div>
        <div>
          <dt>最短撮影距離</dt>
          <dd>${data_19}${data_20}</dd>
        </div>
        <div>
          <dt>最大撮影倍率(倍)</dt>
          <dd>${data_21}</dd>
        </div>
        ${data_16}
      </dl>
      ${data_24}
      <p class="unit__price">
        <span class="unit__price-label">最安</span><span class="unit__price-num">${data[i][5]}</span>
        <span class="unit__price-date">(${data[i][6].split(" ")[0]}更新)</span>
      </p>
      ${data_diff}  
      <div class="unit__footer">
        <a class="unit__link" href="${data[i][23]}" rel="noreferrer" target="_blank">レンズ詳細</a>
        <a class="unit__link" href="${data[i][10]}" rel="noreferrer" target="_blank">価格コム</a>
      </div>
    </div>
  </div>
  
</section>  
      `;
    }      
  }
  
  // 画面表示する
  if (result_num > 0) {
    setTimeout(function () {
      _resut_text.html(result_num + '個のレンズがみつかりました。');
      _rendering.html(html).css({visibility: 'visible'});    
    }, 100);

    // TODO lazy
  } else {
    _resut_text.html('該当するデータは見つかりませんでした。');
  }
  
  // 初期読み込み時以外、表示位置を先頭に移動するフラグを立てる
  if (!is_init) {
    IS_SEARCH = true;
    $(window).scrollTop(0);
  }
  
}