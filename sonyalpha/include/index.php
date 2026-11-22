<?php
$http_host = "filmpathy.com";
$template_path = '/sonyalpha';

// 本番環境かつプレビュー画面でないことを確認
$is_honban = ($http_host == $_SERVER['HTTP_HOST'] && (strpos($_SERVER['REQUEST_URI'],'/?preview') === false))? true: false;

// functions直下のphpファイルをすべて呼び出す
foreach(glob(dirname(__FILE__).'/functions/{*.php}',GLOB_BRACE) as $file){
  if(is_file($file)){
    include_once($file);
  }
}

// 日本語使えるかチェック
// $is_ja = is_lang_ja();

// 公開パス
define("ASSETS_PATH", $template_path.'/assets');
define("ASSETS_LOOT", dirname(__FILE__).'/../assets');

// ブログドメイン（http/httpsあり 例 https://tabinoto.com）
$blog_url = (empty($_SERVER["HTTPS"])? "http://": "https://").$_SERVER["HTTP_HOST"];

// canonical
// $canonical_link = $blog_url.parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$canonical_link = $blog_url.$_SERVER["REQUEST_URI"];
