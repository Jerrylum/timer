let lang;
let languagesList = {
    "en-US": "English",
    "zh-HK": "繁體中文"
};

function loadLanguage(code) {
    let fileref = document.createElement('script');
    fileref.setAttribute('src', './lang/' + code + '.js');

    document.getElementsByTagName("head")[0].appendChild(fileref);
}

function useLanguage(newLang) {
    lang = lang == undefined ? newLang : Object.assign(lang, newLang);
    setCookie({ lang: lang.name });
}

function initLanguage() {
    let cookie = getCookie();

    let code = cookie.lang;

    if (code == undefined) {
        let language = window.navigator.userLanguage || window.navigator.language;

        let check = function(r) {
            return r.test(language);
        }

        switch (true) {
            case check(/yue.*/):
            case check(/zh.*/):
                code = "zh-HK";
                break;
        }
    }

    if (code != undefined) loadLanguage(code); // no need to loadLanguage, english auto load
}

initLanguage();