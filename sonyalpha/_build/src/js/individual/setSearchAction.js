const setSearchAction = () => {
  
  const _sort = $('[name="sort"]'),
        _orderby = $('[name="orderby"]'),
        _sort_number = $('.js-form-sort-number');
    
  let array_sort = [],
      array_orderby = {},
      i = 0,
      readysteady;
  
  /**
   * 重複した配列を削除する
   * クリアしたとき、もしくはクリア状態から選択したときに実行する
   */
  const delArray = (sort_type) => {    
    array_sort = arrayDelDouble(array_sort);    
    for (i = 0; i < array_sort.length; i++) {      
      if (array_sort[i] === sort_type) {
        array_sort.splice(i, 1);
        break;
      }
    }
    delete array_orderby[sort_type];
  }
  
  /**
   * ラベリングして、hiddenにセットする
   */
  const setPriority = () => {
    let array_orderby_value = [],
        sort_type;
    
    _sort_number.html('');
    
    for (i = 0; i < array_sort.length; i++) {
      sort_type = array_sort[i];
      array_orderby_value.push(array_orderby[sort_type]);
      
      $('.js-form-sort-number[data-type="' + sort_type + '"]').html('(第' + (i + 1) + '優先)');
    }
        
    _sort.val(array_sort.join(','));
    _orderby.val(array_orderby_value.join(','));
  }
  
  /**
   * 並び替え優先をセットする
   */
  $('.js-form-switch').on('click', function () {
    let _this = $(this),
        sort_type = _this.attr('data-type'),
        val = _this.attr('data-value'),
        val_new,
        del_i,
        add_ary = [];
    
    switch (val) {
      case '0':   // クリア状態から選択したとき
        val_new = '1';
        
        delArray(sort_type);    // 保険で処理する（クリアできていない場合）
        
        // 優先を追加する
        array_sort.push(sort_type);        
        break;
      case '1':   // orderbyを降順に変更するとき
        val_new = '2';        
        break;
      case '2':   // orderbyを昇順に変更するとき
        val_new = '1';
        break;
        
      // default なし
    }
        
    _this.attr('data-value', val_new);
    array_orderby[sort_type] = val_new;
    setPriority();    // hiddenをセットする
    
    search(true);   // 再検索する
    
    return false;
  });
  
  /**
   * クリアする
   */
  $('.js-form-switch-clear').on('click', function () {
    let tgt = $('.js-form-switch', $(this).closest('tr')),
        tgt_type = tgt.attr('data-type');
    
    tgt.attr('data-value', '0');    
    delArray(tgt_type);
    setPriority();    // hiddenをセットする
    
    return false;
  });
  
  
  $(".js-form-clear").on('click', function () {
    let _this = $(this),
        tgt,
        tgt_type;
    
    switch (_this.attr('data-type')) {
        
      case 'unit':
        $('input', _this.closest('tr')).val('');
        break;
        
      case 'checkbox':
        $('input', _this.closest('tr')).removeAttr('checked').prop('checked', false).change();
        break;
        
      case 'switch':
        tgt = $('.js-form-switch', _this.closest('tr'));
        tgt_type = tgt.attr('data-type');
        
        tgt.attr('data-value', '0');    
        delArray(tgt_type);
        setPriority();    // hiddenをセットする
        break;
        
      case 'orderby':
        
        // 優先順をクリアする
        array_sort.length = 0;
        array_orderby.length = 0;
        array_sort = [];
        array_orderby = [];
        $('.js-form-switch').attr('data-value', '0');
        setPriority();
        
      case 'all':
        
        
        // 選択をクリアする
        $('.js-form input[type="checkbox"]').removeAttr('checked').prop('checked', false).change();
        $('.js-form input[type="number"]').val('');
        break;
        
      // default なし
    }
    
    search();   // 再検索する
    
    return false;
  });
  
  /**
   * type=number, checkboxの値が変わったとき再検索する
   */
  $('input[type="checkbox"]', $('.js-form')).on('change', search);
  $('input[type="number"]').on('input', function () {
    if (readysteady) clearTimeout(readysteady);
    readysteady = setTimeout(search, 1000);
  });
}
