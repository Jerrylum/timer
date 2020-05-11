'use strict';

var lang;
var languagesList = {
  "en-US": "English",
  "zh-HK": "繁體中文"
};

function loadLanguage(code) {
  var fileref = document.createElement('script');
  fileref.setAttribute("src", "./lang/" + code + ".js");
  document.getElementsByTagName("head")[0].appendChild(fileref);
}

function useLanguage(newLang) {
  lang = lang == undefined ? newLang : Object.assign(lang, newLang);
  document.cookie = 'lang=' + newLang.name + ';';
}

(function () {
  var code;

  if (document.cookie) {
    document.cookie.split(';').forEach(function (token) {
      var splited = token.split('=');

      if (splited[0].trim() == 'lang') {
        code = splited[1].trim();
      }
    });
  }

  if (code == undefined) {
    var language = window.navigator.userLanguage || window.navigator.language;

    var check = function check(r) {
      return r.test(language);
    };

    switch (true) {
      case check(/yue.*/):
      case check(/zh.*/):
        code = "zh-HK";
        break;
    }
  }

  if (code == undefined) return;
  loadLanguage(code);
})();