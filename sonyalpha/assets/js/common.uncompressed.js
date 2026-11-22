"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * touchデバイスチェック
 * HACK: Windows Chrome において、ontouchend が object を返すので、やむを得ずユーザーエージェンにょる分岐。どうにかしたい。
 */
// cmn.IS_TOUCH = (("object" == typeof document.documentElement.ontouchend) && (navigator.userAgent.indexOf('Chrome') == -1));
// http://shanabrian.com/web/javascript/is-touch-device.php
var IS_TOUCH = 'ontouchstart' in window && 'ontouchend' in window || navigator.msPointerEnabled ? true : false; // iOS判定 https://qiita.com/kon_yu/items/f295033107089dd6468d

var UA = navigator.userAgent;
var IS_IOS = /iPad|iPhone|iPod/.test(UA) || navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1 ? true : false;
var eventstart = IS_TOUCH ? 'touchstart' : 'mousedown';
var eventmove = IS_TOUCH ? 'touchmove' : 'mousemove';
var eventend = IS_TOUCH ? 'touchend' : 'click';
var eventover = IS_TOUCH ? 'touchstart' : 'mouseover';
var eventout = IS_TOUCH ? 'touchmove' : 'mouseout';
var TAP_COUNT = 0;
var LONGTAPPING;
var IS_CLICK = false;
var IS_DBLCLICK = false;
var IS_LONGTAP = false; // タップ

var tap = function tap(tgt, func) {
  tgt.on(eventstart, function () {
    IS_CLICK = true; // 長押し離しは無効になるようにケア

    setTimeout(function () {
      IS_CLICK = false;
    }, 300);
    return false;
  }).on(eventmove, function () {
    IS_CLICK = false;
    return false;
  }).on(eventend, function () {
    if (func && (IS_CLICK || !IS_TOUCH)) func($(this));
    return false;
  });
}; // ロングタップ（シングルタップ）


var longtap = function longtap(tgt, func_long, func_single) {
  tgt.on(eventstart, function () {
    IS_CLICK = true; // 長押し離しか判別する

    if (LONGTAPPING) clearTimeout(LONGTAPPING);
    LONGTAPPING = setTimeout(function () {
      if (func_long && IS_CLICK) {
        func_long($(this));
      }

      IS_CLICK = false;
    }, 300);
    return false;
  }).on(eventend, function () {
    if (func_single && IS_CLICK) {
      func_single($(this));
      IS_CLICK = false;
    }

    ;
    return false;
  });
}; // ダブルタップ（シングルタップ）


var dbltap = function dbltap(tgt, func_double, func_single) {
  tgt.on(eventstart, function () {
    IS_CLICK = true;
    TAP_COUNT++;

    if (TAP_COUNT == 2) {
      IS_DBLCLICK = true;
      TAP_COUNT = 0;
    } // ダブルタップ判定解除して、シングルタップが有効か判別する


    setTimeout(function () {
      TAP_COUNT = 0;
      IS_DBLCLICK = false;

      if (func_single && IS_CLICK) {
        func_single($(this));
      }

      IS_CLICK = false;
    }, 300);
    return false;
  }).on(eventend, function (e) {
    if (func_double && IS_DBLCLICK) {
      e.preventDefault();
      func_double($(this));
      IS_DBLCLICK = false;
      IS_CLICK = false;
    }

    return false;
  });
}; // ダブルクリックを無効にする


var stopDblClick = function stopDblClick(tgt) {
  if (IS_TOUCH) {
    tgt.on("touchend", function (e) {
      e.preventDefault();
    });
  }
}; // スクロールを無効にする


var stopScroll = function stopScroll(tgt) {
  if (IS_TOUCH) {
    tgt.on("touchmove", function (e) {
      e.preventDefault();
    });
  }
}; // ダブルクリックとスクロール処理を無効にする


var stopDblClickAndScroll = function stopDblClickAndScroll(tgt) {
  if (IS_TOUCH) {
    tgt.on("touchmove", function (e) {
      e.preventDefault();
    }).on("touchend", function (e) {
      e.preventDefault();
    });
  }
};
/**
 * 連想配列の指定キーの値が重複する場合は削除する
 * https://www.simplesimplesdesign.com/web/markup/javascript/配列の重複を削除する
 *
 * @param {array} ary* 配列
 * @param {string|null} key aryが連想配列の場合、重複判別するキー, 通常配列の場合は、null
 * @return {array} 処理後のary
 */


var arrayDelDouble = function arrayDelDouble(ary, key) {
  var result, map, values; // MEMO: 処理件数による処理速度を考慮

  if (ary.length > 1000) {
    // 連想配列の場合
    if (typeof key === "string") {
      map = new Map(ary.map(function (o) {
        return [o[key], o];
      }));
      result = Array.from(map.values());
    } else {
      // 配列の場合
      result = Array.from(new Set(ary));
    }
  } else {
    values = []; // 連想配列の場合

    if (typeof key === "string") {
      result = ary.filter(function (e) {
        if (values.indexOf(e[key]) === -1) {
          values.push(e[key]);
          return e;
        }
      });
    } else {
      // 配列の場合
      result = ary.filter(function (e) {
        if (values.indexOf(e) === -1) {
          values.push(e);
          return e;
        }
      });
    }
  }

  return result;
};
/**
 * 配列に合致するか判別する
 *
 * @param {array} ary*
 * @param {string} val*
 * @return {array|boolean} マッチした配列がある場合は、その配列。ない場合はfalse
 */


var arrayMatch = function arrayMatch(ary, val) {
  var check = [];

  if (ary.length > 0 && val) {
    check = ary.filter(function (v) {
      return v == val;
    });
  }

  return check.length > 0 ? check : false;
};
/**
 * 連想配列の並び替え
 * simplesimplesdesign.com/web/markup/javascript/sort_array_object/
 *
 * @param {array} ary*
 * @param {string} ky*
 * @param {boolean} st true: 降順, false: 昇順
 * @return {array}
 */


var arraySort = function arraySort(ary, ky, st) {
  var ary_ky = 'string' == typeof ky || 'number' == typeof ky ? new Array(ky) : ky,
      ary_ky_num = ary_ky.length,
      ary_st = [],
      key = null,
      srt = null; // 並び替え（降順かどうか）

  if ('boolean' == typeof st && st === true) {
    ary_st.push(st);
  } else if (st) {
    ary_st = st;
  }

  ary.sort(function (a, b) {
    function ary_chk(i) {
      key = ary_ky[i];
      srt = ary_st[i] ? -1 : 1;

      if (a[key] < b[key]) {
        return -1 * srt;
      } else if (a[key] > b[key]) {
        return 1 * srt;
      } else {
        if (i < ary_ky_num) {
          return ary_chk(i + 1);
        } else {
          return 0;
        }
      }
    }

    return ary_chk(0);
  });
  return ary;
};
/**
 * 【Bugfix】iOS Safari で惰性スクロールがロックされてしまうのを回避する
 * https://www.simplesimplesdesign.com/web/markup/javascript/ios-safari-bugfix-smooth-scroll/
 *
 * 引数には、スクロール領域（position:fixed; overflow:auto; を指定している要素）を指定する
 * display:none; の状態で実行しても何も動作しないので注意
 *
 * @param {object} tgt* jQueryでの要素指定 例) $(".js-ios-scroll")
 */


var bugfixScroll = function bugfixScroll(tgt) {
  var is_top = true,
      is_bottom = false,
      moving; // ページ上部にあるときは、1px下に移動する

  if (tgt.scrollTop() === 0) {
    tgt.scrollTop(1);
  }
  /**
   * スクロール位置が上部、もしくは下部にあるとき1px移動する
   */


  var checkScroll = function checkScroll() {
    var t = tgt.scrollTop(),
        h = $("> :first-child", tgt).outerHeight(true) - tgt.height();
    h = Math.ceil(h); // スクロール位置が惰性で最上部より上の位置にあるか判別する

    if (t < 0) {
      is_top = true;
    } else if (is_top) {
      // 0.01秒最上部より上の位置にある場合、1px下に移動する
      if (moving) clearTimeout(moving);
      moving = setTimeout(function () {
        tgt.scrollTop(1);
        is_top = false;
      }, 10);
    } // スクロール位置が惰性で最下部より下の位置にあるか判別する


    if (t > h) {
      is_bottom = true;
    } else if (is_bottom) {
      // 0.01秒最下部より下の位置にある場合、1px上に移動する
      if (moving) clearTimeout(moving);
      moving = setTimeout(function () {
        tgt.scrollTop(t - 1);
        is_bottom = false;
      }, 10);
    }
  }; // tgt内をスクロールしている間、処理する


  tgt.on("scroll", checkScroll);
}; // リサイズがとまったときのイベントを追加する


$(function () {
  var stopEvent = new $.Event("resizestop"),
      timer;

  function stopEventTrigger() {
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () {
      $(window).trigger(stopEvent);
    }, 300);
  }

  $(window).on("resize", stopEventTrigger);
}); // スクロールがとまったときのイベントを追加する
// http://www.risewill.co.jp/blog/archives/2618

$(function () {
  var stopEvent = new $.Event("scrollstop"),
      timer;

  function stopEventTrigger() {
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () {
      $(window).trigger(stopEvent);
    }, 100);
  }

  $(window).on("scroll", stopEventTrigger);
});
/**
 * <br>を改行コードに変換する
 * textareaの値にセットする際に使う
 * PHP htmlspecialcharsで処理されたケースも想定する
 *
 * @param {string} str*
 * @return {string} 変換後のstr
 */

var getBrToNr = function getBrToNr() {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  str = str.replace(/(<br>|<br \/>)/gi, '\n');
  str = str.replace(/&apos;/gi, "'");
  str = str.replace(/&#039;/gi, "'");
  str = str.replace(/&quot;/gi, '"');
  str = str.replace(/&lt;/gi, '<');
  str = str.replace(/&gt;/gi, '>');
  str = str.replace(/&amp;/gi, '&');
  return str;
};
/**
 * 特殊文字をHTMLエンティティに変換する
 *
 * @param {string}
 * @return {string}
 */


var getHtmlSpecialChars = function getHtmlSpecialChars(str) {
  str = str.replace(/&/g, '&amp;');
  str = str.replace(/"/g, '&quot;');
  str = str.replace(/'/g, '&#039;');
  str = str.replace(/</g, '&lt;');
  str = str.replace(/>/g, '&gt;');
  return str;
};
/**
 * 現在時刻を取得する
 * 
 * @return {string} ex) "2020-12-17T10:27";
 */


var getNowTime = function getNowTime() {
  var now = new Date(),
      y = now.getFullYear(),
      m = now.getMonth() + 1,
      d = now.getDate(),
      h = now.getHours(),
      i = now.getMinutes();
  if (m < 10) m = '0' + m;
  if (d < 10) d = '0' + d;
  if (h < 10) h = '0' + h;
  if (i < 10) i = '0' + i;
  return y + "-" + m + "-" + d + "T" + h + ":" + i;
};
/**
 * 改行コードを<br>に変換する
 * textareaの値をhtmlにセットする際に使う
 *
 * @param {string} str*
 * @return {string} 変換後のstr
 */


var getNrToBr = function getNrToBr() {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return str.replace(/\n/g, '<br>');
};
/**
 * 表示URLのgetパラメータを取得してオブジェクトで返却。
 * 値が空の場合は、key情報も取得しない
 *
 * @param {string} url_string
 *
 * @return {object}
 */


var getParam = function getParam(url_string) {
  var str = url_string || location.href,
      param = [],
      obj = {},
      i;
  str = str.split('?').length > 1 ? str.split('?')[1] : str;
  param = str.split('&');

  for (i in param) {
    var p = param[i].split('=');

    if (p.length == 2 && "" != p[1].trim()) {
      obj[p[0]] = p[1];
    }
  }

  return obj;
};
/**
 * 数字だけの値か判別する
 *
 * @param {string|number}
 * @return boolean
 */


var isNumber = function isNumber(v) {
  var pattern = /^[0-9]+$/;
  return pattern.test(v);
};
/**
 * aタグのスタイル処理
 *
 * @param tgt* jQueryのDOM
 *
 * @return なし
 */


var setHover = function setHover(tgt) {
  var hovering;
  tgt.on(eventover, function () {
    var _this = $(this);

    _this.addClass("hover"); // touchstart処理時、clickが発火しない場合に対応


    if (hovering) clearTimeout(hovering);
    hovering = setTimeout(function () {
      _this.removeClass("hover");
    }, 300);
  }).on(eventout, function () {
    $(this).removeClass("hover");
  }).on("click", function () {
    $(this).removeClass("hover");
  });
};
/**
 * SNSの共有リンクを取得する
 *
 * @param {string} url*
 * @param {string} title
 * @return {object} 各SNSのリンク
 */


var shareSNS = function shareSNS(url) {
  var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  return {
    twitter: 'https://twitter.com/share?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(title),
    facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url),
    line: 'https://line.me/R/msg/text/?' + encodeURIComponent(title) + ' ' + url // lineのurlはエンコード不要 

  };
};
/*
 *  ストレージ（ローカル・セッション）
 */


var IS_LOCALSTORAGE = 'localStorage' in window && window['localStorage'] !== null,
    IS_SESSIONSTORAGE = 'sessionStorage' in window && window['sessionStorage'] !== null;
/**
 * ローカルストレージの呼び出しと保存
 *
 * @param {string} n* key
 * @param {anything} v value vがない場合は、nの呼び出し
 * @return {anything} 
 */

var storageLS = function storageLS(n, v) {
  var r = null;

  if (IS_LOCALSTORAGE && typeof n !== 'undefined') {
    if (typeof v !== 'undefined') {
      if (_typeof(v) === 'object') {
        localStorage[n] = JSON.stringify(v);
      } else {
        localStorage[n] = v;
      }
    } else {
      try {
        r = new Function("return " + localStorage[n])(); //        r = JSON.parse(localStorage[n]);
      } catch (e) {
        r = localStorage[n];
      }
    }
  }

  return r;
}; // ローカルストレージ削除


var storageDelLS = function storageDelLS(n) {
  return typeof n !== 'undefined' ? localStorage.removeItem(n) : null;
};
/**
 * セッションストレージの呼び出しと保存
 *
 * @param {string} n* key
 * @param {anything} v value vがない場合は、nの呼び出し
 * @return {anything} 
 */


var storageSS = function storageSS(n, v) {
  var r = null;

  if (IS_SESSIONSTORAGE && typeof n !== 'undefined') {
    if (typeof v !== 'undefined') {
      if (_typeof(v) === 'object') {
        sessionStorage[n] = JSON.stringify(v);
      } else {
        sessionStorage[n] = v;
      }
    } else {
      try {
        r = new Function("return " + sessionStorage[n])(); //        r = JSON.parse(sessionStorage[n]);
      } catch (e) {
        r = sessionStorage[n];
      }
    }
  }

  return r;
}; // ローカルストレージ削除


var storageDelSS = function storageDelSS(n) {
  return typeof n !== 'undefined' ? sessionStorage.removeItem(n) : null;
};
/**
 * 言語もしくは名前を指定して、voice情報を取得する
 *
 * @param {string} val*
 * @param {boolean|NULL} is_name true: valが名前の場合
 * @return {object|string} voice情報、なければ、空テキスト
 *
 * https://cpoint-lab.co.jp/article/201908/11323/ 連想配列 マッチ
 */


var voicerGetVoice = function voicerGetVoice(val, is_name) {
  var lang_name = [],
      lang_default = [],
      i,
      r = ""; // 名前でマッチするか判別する

  if (is_name) {
    for (i = 0; i < voicer.ary_voice.length; i++) {
      var n = voicer.ary_voice[i].name;

      if (n === val) {
        r = voicer.ary_voice[i];
        break;
      }
    }
  } else {
    // 言語でマッチするvoiceを取得する
    lang_name = voicer.ary_voice.filter(function (u) {
      return u.lang === val;
    });

    if (lang_name.length > 0) {
      lang_default = lang_name.filter(function (u) {
        return u["default"] === true;
      });
      r = lang_default.length > 0 ? lang_default[0] : lang_name[0];
    }

    r = _typeof(r) === "object" && r.name ? r : "";
  }

  return r;
};
/**
 * 音声情報
 * https://www.codegrid.net/articles/2016-web-speech-api-1/
 */


var voicer;

var voicerInit = function voicerInit(func) {
  // 音声再生ができるか判別する
  if (window.speechSynthesis) {
    voicer = {}; // 初期設定

    voicer.volume = 1;
    voicer.rate = 1;
    voicer.pitch = 1;
    voicer.voice = "";
    voicer.lang = "";
    voicer.name = ""; // 音声情報

    voicer.ary_voice = [];
    voicer.ary_voice_lang = [];
    voicer.ary_lang = []; // 予約後

    voicer.speech; // {object} 音声情報

    voicer.changeVoice; // {function} 名前を変更した際に処理を実行する場合に利用する関数名

    voicer.settiming; // オートプレイ時のsettimeout監視用

    voicer.status_autoplay; // {string} all|one|stop

    voicer.is_autoplay; // {boolean} オートプレイ設定中かどうか

    voicer.is_playing; // {boolean} 再生中かどうか
    // 音声情報をマークアップする

    voicerSetVoice(func);
  }
}; // 画面をリロードしても音声再生は停止しないための対応


window.addEventListener('beforeunload', function () {
  if (speechSynthesis) speechSynthesis.cancel();
});
/**
 * 音声を再生する
 * lang はSafari14で無効のため、voiceを指定する
 *
 * @param {object} obj*
 */

var voicerPlay = function voicerPlay(obj) {
  if (voicer.speech) speechSynthesis.cancel(voicer.speech); // 再生中があれば、停止する

  voicer.speech = new SpeechSynthesisUtterance(); // 読み上げます

  voicer.speech.text = obj.text || "";
  if (typeof obj.rate === "number") voicer.speech.rate = obj.rate;
  if (typeof obj.pitch === "number") voicer.speech.pitch = obj.pitch;
  if (typeof obj.volume === "number") voicer.speech.volume = obj.volume;

  if (_typeof(obj.voice) === "object") {
    voicer.speech.lang = obj.voice.lang;
    voicer.speech.voice = obj.voice;
  }

  if (obj.lang) voicer.speech.lang = obj.lang;
  speechSynthesis.speak(voicer.speech); // 再生する
  // 音声読み上げ終了時に処理する

  if (obj.func) {
    voicer.speech.onend = function () {
      obj.func();
    };
  }
};
/**
 * プラスマイナス
 *
 * @param {string*} t* volume|rate|pitch
 * @param {string|NULL} v plus|minus|NULL
 * @param {boolean|NULL} is_default
 * @return {object}
 */


var voicerPlusMinus = function voicerPlusMinus(t, v, is_default) {
  var diff = 0,
      is_plus = true,
      is_minus = true,
      is_changing = typeof v === "string" ? true : false,
      num; // タイプに分ける

  switch (t) {
    case "volume":
      // 音量を調整する（0〜1）デフォルト:1
      if (is_default && voicer[t] !== 1) {
        voicer[t] = 1;
        is_changing = true;
      } else if (v) {
        diff = v === "plus" ? 3 : -3;
        voicer[t] = (voicer[t] * 10 + diff) / 10;
      }

      num = voicer[t] * 10;

      if (num <= 1) {
        voicer[t] = 0.1;
        is_minus = false;
      } else if (num >= 9) {
        voicer[t] = 1;
        is_plus = false;
      }

      break;

    case "rate":
      // 速度を調整する（0.1〜10）言語によってレンジは異なる デフォルト:1
      if (is_default && voicer[t] !== 1) {
        voicer[t] = 1;
        is_changing = true;
      } else if (v) {
        diff = v === "plus" ? 3 : -3;
        voicer[t] = (voicer[t] * 10 + diff) / 10;
      }

      num = voicer[t] * 10;

      if (num <= 4) {
        voicer[t] = 0.4;
        is_minus = false;
      } else if (num >= 13) {
        voicer[t] = 1.3;
        is_plus = false;
      }

      break;

    case "pitch":
      // ピッチを調整する（0.0 〜 2.0）言語によってレンジは異なる デフォルト:1
      if (is_default && voicer[t] !== 1) {
        voicer[t] = 1;
        is_changing = true;
      } else if (v) {
        diff = v === "plus" ? 3 : -3;
        voicer[t] = (voicer[t] * 10 + diff) / 10;
      }

      num = voicer[t] * 10;

      if (num <= 7) {
        voicer[t] = 0.7;
        is_minus = false;
      } else if (num >= 13) {
        voicer[t] = 1.3;
        is_plus = false;
      }

      break;
    // default なし
  } // 設定値が変更された場合


  if (is_changing) {
    voice('setting'); // 音声設定を更新する
  }

  return {
    can_plus: is_plus,
    can_minus: is_minus
  };
};
/**
 * 音声切り替え情報をマークアップする
 *
 * 必ず、voicerInit関数の中で呼ばれ、直接呼び出すことはない前提
 * ただし、load時に言語・名前が生成されない場合は別途呼び出す
 * Androidで発覚
 */


var voicerSetVoice = function voicerSetVoice(func) {
  var tgt = $(".js-form-speech"),
      tgt_lang = $("select.js-speech-lang"),
      tgt_lang_select = $(".js-speech-lang-flag"),
      tgt_voice = $("select.js-speech-voice");
  var speech = new SpeechSynthesisUtterance(); // 事前に最低限のマークアップがあるか判別する

  if (tgt_lang.length > 0 || tgt_voice.length > 0) {
    // 一度音声を再生し、タイムラグ後にならないと、音声情報を取得できないので、空テキストを再生し時間差で処理する
    speech.text = '';
    speechSynthesis.speak(speech);
    setTimeout(function () {
      var t = '',
          i; // 音声情報を取得する

      voicer.ary_voice = speechSynthesis.getVoices(); // 名前をマークアップする

      arraySort(voicer.ary_voice, "name"); // 名前で並び変える

      t = '<option class="all" value="all">Anonymous</option>';

      for (i = 0; i < voicer.ary_voice.length; i++) {
        t += '<option class="' + voicer.ary_voice[i].lang + '" value="' + voicer.ary_voice[i].name + '">' + voicer.ary_voice[i].name + '</option>';
      }

      tgt_voice.html(t);
      /*
       * 言語
       */

      arraySort(voicer.ary_voice, "lang"); // langで並び替える

      voicer.ary_voice_lang = arrayDelDouble(voicer.ary_voice, "lang"); // 重複を削除して、lang用の配列をつくる
      // マークアップする

      t = '<option class="all" value="all">---</option>';

      for (i = 0; i < voicer.ary_voice_lang.length; i++) {
        t += '<option value="' + voicer.ary_voice_lang[i].lang + '">' + voicer.ary_voice_lang[i].lang + '</option>';
        voicer.ary_lang.push(voicer.ary_voice_lang[i].lang);
      }

      tgt_lang.html(t);
      /*
       * 言語アイコン
       * ja-JP ja_JP のように端末によって、「-」「_」があるので、そのケアも入れています
       */

      if ($(".js-speech-lang-flag").length > 0 && voicer.ary_lang.length > 0) {
        $(".js-speech-lang-flag").each(function () {
          var lang = $(this).attr("data-lang");

          if (arrayMatch(voicer.ary_lang, lang)) {
            $(this).attr("data-type", lang);
          } else if (arrayMatch(voicer.ary_lang, lang.replace("-", "_"))) {
            $(this).attr("data-type", lang.replace("-", "_"));
          } else {
            $(this).remove();
          }
        });
      }
      /*
       * 言語を切り替える
       */


      tgt_lang.on("change", function () {
        var val = $(this).val();

        if (val === "all") {
          voicer.voice = "";
          voicer.lang = "";
        } else {
          voicer.voice = voicerGetVoice(val);
          voicer.lang = voicer.voice ? voicer.voice.lang : "";
        }

        voicerSetSelect();
      });
      /*
       * 名前を切り替える
       */

      tgt_voice.on("change", function () {
        voicer.voice = voicerGetVoice($(this).val(), true);
        voicer.lang = voicer.voice ? voicer.voice.lang : "";
        voicerSetSelect();
      });
      /**
       * 言語・名前マークアップ後に処理する
       */

      if (func) func();
    }, 100);
  }
  /**
   * 名前、もしくは言語が変更されたときの挙動
   * Hack: Safari 14.x でform要素（input, option）では、display: noneが無効になるため
   * Hack: Safari 14.x でlangが無効となるため、voiceの指定を必須とする
   * voicer.voice に値がある場合は、その値が有効であることが前提
   */


  var voicerSetSelect = function voicerSetSelect() {
    var selected_lang,
        val_voice,
        voice_lang = '',
        voice_name = '',
        i; // 音声設定を更新する

    if (voice) voice('setting');
    $(".bugfix-safari-hide option", tgt_voice).unwrap(); // 名前をすべて表示する
    // 名前が設定されていないか判別する

    if (voicer.voice === "") {
      tgt_voice.val("all"); // 名前を選択をリセットする

      tgt_lang.val("all"); // 名前を選択をリセットする
    } else {
      voice_lang = voicer.voice.lang;
      voice_name = voicer.voice.name;
      selected_lang = $("option." + voice_lang, tgt_voice);
      tgt_lang.val(voice_lang);
      $(".js-speech-lang-flag[data-type='" + voice_lang + "']").addClass("selected"); // 名前を全非表示する（Hackの都合で、一旦、すべて表示後に非表示にする必要あり

      $("option", tgt_voice).wrap('<span class="bugfix-safari-hide">');
      selected_lang.unwrap(); // 選択した言語の名前を表示する
      // 名前が一致するか判別する

      if ($("option." + voice_lang + "[value='" + voice_name + "']", tgt_voice).length === 1) {
        tgt_voice.val(voice_name);
      } else {
        // 選択した言語の名前が複数あるか判別する
        if (selected_lang.length > 1) {
          voicer.voice = voicerGetVoice(voice_lang);
          tgt_voice.val(voicer.voice.name);
        } else {
          val_voice = selected_lang.val(); // 名前を取得する          

          voicer.voice = voicerGetVoice(val_voice, true);
        }

        voicer.lang = voicer.voice ? voicer.voice.lang : "";
      }
    } // 名前を変更した際に、何かしら処理を実行する場合


    if (voicer.voice != "" && voicer.changeVoice) {
      voicer.changeVoice(voicer.voice); // ピッチはリセットする

      voicer.pitch = 1;
      setVoicePlusMinus("pitch");
    }
  };
  /**
   * 言語をセットする
   */


  voicer.setLang = function (v) {
    voicer.voice = voicerGetVoice(v);
    voicer.lang = voicer.voice ? voicer.voice.lang : "";
    voicerSetSelect();
  };
  /**
   * 名前をセットする
   */


  voicer.setVoice = function (v) {
    voicer.voice = voicerGetVoice(v, true);
    voicer.lang = voicer.voice ? voicer.voice.lang : "";
    voicerSetSelect();
  };
  /**
   * リンク 音声言語アイコンをタップする
   */


  tgt_lang_select.on("click", function () {
    var tgt = $(this);

    if (!tgt.hasClass("selected")) {
      tgt.addClass("selected");
      voicer.setLang(tgt.attr("data-type"));
    }

    return false;
  });
};

$(function () {
  $('.js-form').on('submit', function () {
    search();
    return false;
  });
  $('.js-form-submit').on('click', function () {
    $('.js-form').submit();
    return false;
  });
});
$(function () {
  var _frame = $(".js-frame"),
      _search = $(".js-search"),
      _form = $(".js-form");

  var pos = 0,
      top = 0,
      btn_animation;
  $(".js-btn-link").on('click', function () {
    // 通常画面の表示位置を取得する
    if (!_frame.hasClass("is-search")) {
      pos = $(window).scrollTop();
    }

    _search.scrollTop(1); // メニューエリアを先頭に表示する


    _frame.toggleClass("is-search"); // メニュー表示を切り替える 
    // メニュー表示中はメインコンテンツが動かないようにfixするための数値設定を取得する


    if (_frame.hasClass("is-search")) {
      top = pos * -1;
      bugfixScroll(_search); // iOSの惰性スクロール対応する
    } else {
      top = 0;

      if (IS_SEARCH) {
        pos = 0;
        IS_SEARCH = false;
      }

      $(window).scrollTop(pos);
    } // 検索メニューアイコンのアニメーション    


    _frame.addClass("change-viewing");

    if (btn_animation) clearTimeout(btn_animation);
    btn_animation = setTimeout(function () {
      _frame.removeClass("change-viewing");
    }, 800);

    _frame.css({
      top: top
    });

    return false;
  });
});
/**
 * 検索結果を表示する
 *
 * @param boolean|NULL is_sort: is_sort 並び替えかどうか
 * @param boolean|NULL is_init: 初期の読み込み時かどうか
 */

var search = function search(is_sort, is_init) {
  var _rendering = $(".js-rendering"),
      _resut_text = $(".js-result-message");

  var countupdown_number = (typeof OBJ_NUMBER === "undefined" ? "undefined" : _typeof(OBJ_NUMBER)) == 'object' ? OBJ_NUMBER : new Intl.NumberFormat('en-US', {
    style: 'decimal'
  });
  var data = [].concat(JSON_DATA),
      // データの初期化
  html = '',
      result_num = 0,
      i = 0,
      j; // 配列の上書き防止

  var data_3 = '',
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
      data_28 = ''; // 検索値

  var val_price_low = $('[name="price-low"]').val(),
      val_price_high = $('[name="price-high"]').val(),
      val_length_low = $('[name="length-low"]').val(),
      val_length_high = $('[name="length-high"]').val(),
      val_aperture_low = $('[name="aperture-low"]').val(),
      val_aperture_high = $('[name="aperture-high"]').val(),
      val_weight_low = $('[name="weight-low"]').val(),
      val_weight_high = $('[name="weight-high"]').val(),
      val_filter_low = $('[name="filter-low"]').val(),
      val_filter_high = $('[name="filter-high"]').val(),
      val_maker = $('[name="maker"]:checked').map(function () {
    return $(this).val();
  }).get(),
      val_lens = $('[name="lens"]:checked').map(function () {
    return $(this).val();
  }).get(),
      val_sort = $('[name="sort"]').val(),
      val_orderby = $('[name="orderby"]').val();
  var val_max = 99999999; // 初期化する

  _rendering.css({
    visibility: 'hidden'
  });

  if (!is_sort) _resut_text.html(''); // 並び替えでない場合
  // 検索条件に合わせて、並び替えを行う（初期は発売日順）

  if (val_sort == "") {
    data = arraySort(data, '11-2', true);
  } else {
    val_sort = val_sort.split(',');
    val_orderby = val_orderby.split(',');

    if (val_sort.length === val_orderby.length) {
      for (i = 0; i < val_orderby.length; i++) {
        val_orderby[i] = val_orderby[i] === "1" ? false : true;
      }

      data = arraySort(data, val_sort, val_orderby);
    }
  }
  /**
   * フォームの値を確認する
   */


  var check_val = function check_val(val, is_high) {
    if (val != '' && isNumber(val * 10)) {
      val = +val;
    } else {
      if (is_high) {
        val = val_max;
      } else {
        val = 0;
      }
    }

    return val;
  }; // コーディングする


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
      var data_diff = '',
          data_diff_val = 0;
      data_5 = data[i][5] != '' ? +data[i][5].replace(/,/g, '') : 0;
      data_7 = data[i][7] != '' ? +data[i][7].replace(/,/g, '') : 0; // メーカー確認

      if (val_maker.length > 0 && val_maker.length < DATA_MAKER.length) {
        if (arrayMatch(val_maker, data[i][1]) === false) {
          continue;
        }
      } // 単焦点かズームかの場合を判別する


      if (val_lens.length === 1) {
        if (val_lens[0] === 'single' && data[i][13] != '' || val_lens[0] === 'zoom' && data[i][13] === '') {
          continue;
        }
      } // 絞り込み（価格、重量）


      if (val_price_low > +data[i][5].replace(/,/g, '') || val_price_high < +data[i][5].replace(/,/g, '') || val_weight_low > +data[i][17].replace(/,/g, '') || val_weight_high < +data[i][17].replace(/,/g, '')) {
        continue;
      } // 絞り込み（フィルター）


      if (val_filter_low === 0 && val_filter_high === val_max) {} else {
        data_28 = data[i][28];

        if (data_28 == '' || val_filter_low * 10 > +data[i][28] || val_filter_high * 10 < +data[i][28]) {
          continue;
        }
      } // 絞りこみ（焦点距離）


      if (data[i][13] === '') {
        // 単焦点の場合
        if (+data[i][12] < val_length_low || +data[i][12] > val_length_high) {
          continue;
        }
      } else {
        // ズームの場合
        switch (true) {
          case val_length_low === 0 && val_length_high === val_max:
            break;

          case val_length_low === 0:
            if (+data[i][12] > val_length_high || +data[i][13] < val_length_high) {
              continue;
            }

            break;

          case val_length_high === val_max:
            if (+data[i][12] > val_length_low || +data[i][13] < val_length_low) {
              continue;
            }

            break;

          default:
            if (+data[i][12] > val_length_low || +data[i][13] < val_length_high) {
              continue;
            }

        }
      } // 絞りこみ（F値）


      if (data[i][15] === '') {
        if (+data[i][14] * 10 < val_aperture_low * 10 || +data[i][14] * 10 > val_aperture_high * 10) {
          continue;
        }
      } else {
        switch (true) {
          case val_aperture_low === 0 && val_aperture_high === val_max:
            break;

          case val_aperture_low === 0:
            if (+data[i][15] * 10 > val_aperture_high * 10) {
              continue;
            }

            break;

          case val_aperture_high === val_max:
            if (+data[i][14] * 10 < val_aperture_low * 10) {
              continue;
            }

            break;

          default:
            if (+data[i][14] * 10 < val_aperture_low * 10 || +data[i][15] * 10 > val_aperture_high * 10) {
              continue;
            }

        }
      } // マークアップ


      result_num++;
      data_3 = data[i][3];

      if (data_3 != '') {
        data_3 = '<span class="unit__model">' + data_3 + '</span>';
      }

      data_4 = data[i][4];

      if (data_4 != '') {
        data_4 = '<span class="unit__maker-price">' + data_4 + '<span>円</span></span>';
      }

      if (data_5 > 0 && data_7 > 0) {
        data_diff_val = data_5 - data_7;

        if (data_diff_val > 0) {
          data_diff = '<p class="unit__price-best">過去安' + data[i][7] + '円 (' + data[i][8].split(" ")[0] + ': 差額 ' + countupdown_number.format(data_diff_val) + '円)</p>';
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

      html += "\n<section class=\"unit\">\n  <div class=\"unit__column\">\n    <figure class=\"unit__img\" style=\"background-image:url('".concat(data[i][22], "');\"></figure>\n    <div class=\"unit__text\">\n      <div class=\"unit__header\">\n        <p class=\"unit__maker\">").concat(data[i][1], "</p>\n        <h1 class=\"unit__name\">").concat(data[i][2], "</h1>\n      </div>\n      <p class=\"unit__ex\">\n        ").concat(data_3).concat(data_4, "<span class=\"unit__release\">").concat(data[i][11], "<span>\u767A\u58F2</span></span>\n      </p>\n      <dl class=\"unit__spec\">\n        <div>\n          <dt>\u91CD\u3055</dt>\n          <dd>").concat(data[i][17], "g</dd>\n        </div>\n        <div>\n          <dt>\u7D5E\u308A</dt>\n          <dd>F").concat(data[i][14]).concat(data_15, "</dd>\n        </div>\n        <div>\n          <dt>\u7126\u70B9\u8DDD\u96E2</dt>\n          <dd>").concat(data[i][12]).concat(data_13, "mm</dd>\n        </div>\n        <div>\n          <dt>\u30D5\u30A3\u30EB\u30BF\u30FC\u5F84</dt>\n          <dd>").concat(data_18, "</dd>\n        </div>\n        <div>\n          <dt>\u6700\u77ED\u64AE\u5F71\u8DDD\u96E2</dt>\n          <dd>").concat(data_19).concat(data_20, "</dd>\n        </div>\n        <div>\n          <dt>\u6700\u5927\u64AE\u5F71\u500D\u7387(\u500D)</dt>\n          <dd>").concat(data_21, "</dd>\n        </div>\n        ").concat(data_16, "\n      </dl>\n      ").concat(data_24, "\n      <p class=\"unit__price\">\n        <span class=\"unit__price-label\">\u6700\u5B89</span><span class=\"unit__price-num\">").concat(data[i][5], "</span>\n        <span class=\"unit__price-date\">(").concat(data[i][6].split(" ")[0], "\u66F4\u65B0)</span>\n      </p>\n      ").concat(data_diff, "  \n      <div class=\"unit__footer\">\n        <a class=\"unit__link\" href=\"").concat(data[i][23], "\" rel=\"noreferrer\" target=\"_blank\">\u30EC\u30F3\u30BA\u8A73\u7D30</a>\n        <a class=\"unit__link\" href=\"").concat(data[i][10], "\" rel=\"noreferrer\" target=\"_blank\">\u4FA1\u683C\u30B3\u30E0</a>\n      </div>\n    </div>\n  </div>\n  \n</section>  \n      ");
    }
  } // 画面表示する


  if (result_num > 0) {
    setTimeout(function () {
      _resut_text.html(result_num + '個のレンズがみつかりました。');

      _rendering.html(html).css({
        visibility: 'visible'
      });
    }, 100); // TODO lazy
  } else {
    _resut_text.html('該当するデータは見つかりませんでした。');
  } // 初期読み込み時以外、表示位置を先頭に移動するフラグを立てる


  if (!is_init) {
    IS_SEARCH = true;
    $(window).scrollTop(0);
  }
};

var setSearchAction = function setSearchAction() {
  var _sort = $('[name="sort"]'),
      _orderby = $('[name="orderby"]'),
      _sort_number = $('.js-form-sort-number');

  var array_sort = [],
      array_orderby = {},
      i = 0,
      readysteady;
  /**
   * 重複した配列を削除する
   * クリアしたとき、もしくはクリア状態から選択したときに実行する
   */

  var delArray = function delArray(sort_type) {
    array_sort = arrayDelDouble(array_sort);

    for (i = 0; i < array_sort.length; i++) {
      if (array_sort[i] === sort_type) {
        array_sort.splice(i, 1);
        break;
      }
    }

    delete array_orderby[sort_type];
  };
  /**
   * ラベリングして、hiddenにセットする
   */


  var setPriority = function setPriority() {
    var array_orderby_value = [],
        sort_type;

    _sort_number.html('');

    for (i = 0; i < array_sort.length; i++) {
      sort_type = array_sort[i];
      array_orderby_value.push(array_orderby[sort_type]);
      $('.js-form-sort-number[data-type="' + sort_type + '"]').html('(第' + (i + 1) + '優先)');
    }

    _sort.val(array_sort.join(','));

    _orderby.val(array_orderby_value.join(','));
  };
  /**
   * 並び替え優先をセットする
   */


  $('.js-form-switch').on('click', function () {
    var _this = $(this),
        sort_type = _this.attr('data-type'),
        val = _this.attr('data-value'),
        val_new,
        del_i,
        add_ary = [];

    switch (val) {
      case '0':
        // クリア状態から選択したとき
        val_new = '1';
        delArray(sort_type); // 保険で処理する（クリアできていない場合）
        // 優先を追加する

        array_sort.push(sort_type);
        break;

      case '1':
        // orderbyを降順に変更するとき
        val_new = '2';
        break;

      case '2':
        // orderbyを昇順に変更するとき
        val_new = '1';
        break;
      // default なし
    }

    _this.attr('data-value', val_new);

    array_orderby[sort_type] = val_new;
    setPriority(); // hiddenをセットする

    search(true); // 再検索する

    return false;
  });
  /**
   * クリアする
   */

  $('.js-form-switch-clear').on('click', function () {
    var tgt = $('.js-form-switch', $(this).closest('tr')),
        tgt_type = tgt.attr('data-type');
    tgt.attr('data-value', '0');
    delArray(tgt_type);
    setPriority(); // hiddenをセットする

    return false;
  });
  $(".js-form-clear").on('click', function () {
    var _this = $(this),
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
        setPriority(); // hiddenをセットする

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

    search(); // 再検索する

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
};
/**
 * 検索条件をコーディングする
 */


var setSearchMaker = function setSearchMaker() {
  var html = '',
      i;
  DATA_MAKER = arrayDelDouble(DATA_MAKER);

  for (i in DATA_MAKER) {
    html += "\n<label>\n  <input type=\"checkbox\" name=\"maker\" value=\"".concat(DATA_MAKER[i], "\">\n  <span>").concat(DATA_MAKER[i], "</span>\n</label>\n    ");
  }

  $(".js-label-maker").html(html);
};
/**
 * Ajaxでデータを取得しないと何も始まらない。
 */


$(function () {
  var INIT_HTML = '',
      i;
  $.ajax({
    url: JSON_FILE,
    type: "GET",
    dataType: "json",
    timeout: 5000
  }).done(function (data) {
    var result;
    JSON_DATA = data; // 検索用の調整

    for (i in JSON_DATA) {
      var ymd = getYmd(JSON_DATA[i]['11']);
      JSON_DATA[i]['11-2'] = new Date(ymd).getTime(); // 数値に変更

      JSON_DATA[i]['12'] = +JSON_DATA[i]['12']; // 型を変更

      JSON_DATA[i]['25'] = +JSON_DATA[i]['25']; // 型を変更

      JSON_DATA[i]['26'] = +JSON_DATA[i]['26']; // 型を変更

      JSON_DATA[i]['27'] = +JSON_DATA[i]['27']; // 型を変更

      DATA_MAKER.push(JSON_DATA[i]['1']);
    }

    setSearchMaker(); // メーカーをマークアップする

    setSearchAction(); // 検証条件を機能させる

    search(false, true); // 検索する    
  }).fail(function (e) {
    // TODO js-reloadをクリックした時の処理 検索条件を保持したまま再検索するのが妥当
    INIT_HTML = "\n  <div class=\"error\">\n  <div class=\"error__inner\">\n    <p>\u3042\u3001\u8AAD\u307F\u8FBC\u307F\u306B\u5931\u6557\u3057\u307E\u3057\u305F...</p>\n    <a class=\"js-reload\">\u518D\u8AAD\u307F\u8FBC\u307F\u3059\u308B</a>\n  </div>\n  </div>\n    ";
    $('.js-rendering').html(INIT_HTML);
  }).always(function () {});
});

var getYmd = function getYmd(ymd) {
  var array_ymd = ymd.split('-'),
      y = array_ymd[0].trim() || '1999',
      m = array_ymd[1].trim() || '01',
      d = array_ymd[2].trim() || '01';
  if (d == 0) d = "1";
  y = y.length === 1 ? '0' + y : y;
  m = m.length === 1 ? '0' + m : m;
  d = d.length === 1 ? '0' + d : d;
  return y + '-' + m + '-' + d;
};