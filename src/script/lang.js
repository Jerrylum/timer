'use strict';

let lang;

const languages = {
    "en-US": "English",
    "zh-HK": "繁體中文"
};

function loadLanguage(code) {
    let fileref = document.createElement('script');
    fileref.setAttribute("src", "./lang/" + code + ".js");

    document.getElementsByTagName("head")[0].appendChild(fileref);
}

function useLanguage(newLang) {
    lang = lang == undefined ? newLang : Object.assign(lang, newLang);
    langUpdateSignalFlag = true;
}

(function() {
    let language = window.navigator.userLanguage || window.navigator.language;
    let code;

    let check = function(r) {
        return r.test(language);
    }

    switch (true) {
        case check(/yue.*/):
        case check(/zh.*/):
            code = "zh-HK";
            break;
    }

    if (code == undefined) return;

    loadLanguage(code);

})();