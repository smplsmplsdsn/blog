<?php include('include/index.php'); ?>
<!doctype html>
<html lang="ja">
  <head>
    <?php include_once("include/google.php"); ?>
    <meta charset="utf-8">
    <title>Sony Eマウント フルサイズ対応のレンズ収集</title>
    <meta name="robots" content="ALL">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="format-detection" content="telephone=no">
    <link rel="stylesheet" href="<?php echo ASSETS_PATH; ?>/css/common.min.css?t=<?php echo filemtime(ASSETS_LOOT."/css/common.min.css"); ?>">
    <link rel="stylesheet" href="<?php echo ASSETS_PATH; ?>/icomoon/style.css?t=<?php echo filemtime(ASSETS_LOOT."/icomoon/style.css"); ?>">
  </head>  
  <body class="frame js-frame">
    
    <div class="frame__content">
      <header class="header">
        <h1 class="header__title">Sony Eマウント フルサイズ対応のレンズ収集</h1>
        <p class="header__ex js-result-message">検索中...</p>
      </header>
      <div class="frame__list js-rendering"></div>      
    </div>
    
    <p class="btn frame__menu">
      <a class="btn__link js-btn-link">
        <span class="icon-forward"></span>
        <span class="icon-search"></span>
      </a>
    </p>
    
    
    <div class="search js-search frame__search">
      <div class="search__inner">
        <form class="form js-form frame__form">
          <table class="form__table form__table--condition">
            <tr>
              <th>メーカー</th>
              <td>
                <div class="form__label js-label-maker"></div>            
              </td>
              <td>
                <a class="form__clear-link js-form-clear" data-type="checkbox">
                  <span class="icon-reload-alt"></span>
                </a>
              </td>
            </tr>
            <tr>
              <th>価格</th>
              <td>
                <div class="form__flex">
                  <input type="number" name="price-low" value="" min="0" step="1000" inputmode="numeric">
                  <span class="form__combine">〜</span>
                  <input type="number" name="price-high" value="" min="0" step="1000" inputmode="numeric">
                </div>
              </td>
              <td>
                <a class="form__clear-link js-form-clear" data-type="unit">
                  <span class="icon-reload-alt"></span>
                </a>
              </td>
            </tr>
            <tr>
              <th>焦点距離</th>
              <td>
                <div class="form__flex">
                  <input type="number" name="length-low" value="" min="0" step="10" inputmode="numeric">
                  <span class="form__combine">〜</span>
                  <input type="number" name="length-high" value="" min="0" step="10" inputmode="numeric">
                </div>
              </td>
              <td>
                <a class="form__clear-link js-form-clear" data-type="unit">
                  <span class="icon-reload-alt"></span>
                </a>
              </td>
            </tr>
            <tr>
              <th>絞り(F値)</th>
              <td>
                <div class="form__flex">
                  <input type="number" name="aperture-low" value="" min="0" step="0.1" inputmode="decimal">
                  <span class="form__combine">〜</span>
                  <input type="number" name="aperture-high" value="" min="0" step="0.1" inputmode="decimal">
                </div>
              </td>
              <td>
                <a class="form__clear-link js-form-clear" data-type="unit">
                  <span class="icon-reload-alt"></span>
                </a>
              </td>
            </tr>
            <tr>
              <th>重さ(g)</th>
              <td>
                <div class="form__flex">
                  <input type="number" name="weight-low" value="" min="0" step="10" inputmode="numeric">
                  <span class="form__combine">〜</span>
                  <input type="number" name="weight-high" value="" min="0" step="10" inputmode="numeric">
                </div>
              </td>
              <td>
                <a class="form__clear-link js-form-clear" data-type="unit">
                  <span class="icon-reload-alt"></span>
                </a>
              </td>
            </tr>
            <tr>
              <th>フィルター径</th>
              <td>
                <div class="form__flex">
                  <input type="number" name="filter-low" value="" min="0" inputmode="numeric">
                  <span class="form__combine">〜</span>
                  <input type="number" name="filter-high" value="" min="0" inputmode="numeric">
                </div>
              </td>
              <td>
                <a class="form__clear-link js-form-clear" data-type="unit">
                  <span class="icon-reload-alt"></span>
                </a>
              </td>
            </tr>
            <tr>
              <th>レンズ</th>
              <td>
                <div class="form__label">
                  <label>
                    <input type="checkbox" name="lens" value="single">
                    <span>単焦点</span>
                  </label>
                  <label>
                    <input type="checkbox" name="lens" value="zoom">
                    <span>ズーム</span>
                  </label>
                </div>
              </td>
              <td>
                <a class="form__clear-link js-form-clear" data-type="checkbox">
                  <span class="icon-reload-alt"></span>
                </a>
              </td>
            </tr>
          </table>

          <!--
          <p class="form__btn">
            <a class="js-form-clear" data-type="all">検索条件リセット</a>
            <a class="js-form-submit">検索する</a>
          </p>
          -->

          <table class="form__table form__table--sort">
            <tr>
              <td>焦点距離<span class="form__table-number js-form-sort-number" data-type="12"></span></td>
              <td class="form__table-switch">
                <a class="form__switch-link js-form-switch" data-value="0" data-type="12">
                  <span>短い順</span>
                  <span>長い順</span>
                </a>
              </td>
              <td>
                <a class="form__clear-link js-form-clear" data-type="switch">
                  <span class="icon-reload-alt"></span>
                </a>
              </td>
            </tr>
            <tr>
              <td>絞り<span class="form__table-number js-form-sort-number" data-type="27"></span></td>
              <td class="form__table-switch">
                <a class="form__switch-link js-form-switch" data-value="0" data-type="27">
                  <span>明るい</span>
                  <span>絞り順</span>
                </a>
              </td>
              <td>
                <a class="form__clear-link js-form-clear" data-type="switch">
                  <span class="icon-reload-alt"></span>
                </a>
              </td>
            </tr>
            <tr>
              <td>重さ<span class="form__table-number js-form-sort-number" data-type="26"></span></td>
              <td class="form__table-switch">
                <a class="form__switch-link js-form-switch" data-value="0" data-type="26">
                  <span>軽い順</span>
                  <span>重い順</span>
                </a>
              </td>
              <td>
                <a class="form__clear-link js-form-clear" data-type="switch">
                  <span class="icon-reload-alt"></span>
                </a>
              </td>
            </tr>
            <tr>
              <td>発売日<span class="form__table-number js-form-sort-number" data-type="11-2"></span></td>
              <td class="form__table-switch">
                <a class="form__switch-link js-form-switch" data-value="0" data-type="11-2">
                  <span>古い順</span>
                  <span>新しい</span>
                </a>
              </td>
              <td>
                <a class="form__clear-link js-form-clear" data-type="switch">
                  <span class="icon-reload-alt"></span>
                </a>
              </td>
            </tr>
            <tr>
              <td>価格<span class="form__table-number js-form-sort-number" data-type="25"></span></td>
              <td class="form__table-switch">
                <a class="form__switch-link js-form-switch" data-value="0" data-type="25">
                  <span>安い順</span>
                  <span>高い順</span>
                </a>
              </td>
              <td>
                <a class="form__clear-link js-form-clear" data-type="switch">
                  <span class="icon-reload-alt"></span>
                </a>
              </td>
            </tr>
          </table>
          <input type="hidden" name="sort" value="">
          <input type="hidden" name="orderby" value="">

          <!--
          <p class="form__btn">
            <a class="js-form-clear" data-type="orderby">並び順リセット</a>
            <a class="js-form-submit">検索する</a>
          </p>
          -->

        </form>
      </div>
    </div>
    
    <script>
      <?php
      $file_json = "ajax/";
      if (isset($_GET['update'])) {
        $file_json = $file_json."?update=1";
      }
      ?>
      const JSON_FILE = '<?php echo $file_json; ?>';
      let JSON_DATA = [],
          DATA_MAKER = [],
          IS_SEARCH = false;
    </script>
    <script type="text/javascript" src="<?php echo ASSETS_PATH; ?>/js/jquery-3.6.0.min.js"></script>
    <script type="text/javascript" src="<?php echo ASSETS_PATH; ?>/js/common.uncompressed.js?t=<?php echo filemtime(ASSETS_LOOT."/js/common.min.js"); ?>"></script>
  </body>
</html>
