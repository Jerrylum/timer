const { TimerStatus, Timer, StopwatchTimer, CountdownTimer, getCookie, setCookie } = require('./preload');

window.lang = undefined;

window.i18n = {
    languages: {
        "en-US": "English",
        "zh-HK": "繁體中文"
    },

    components: [],

    addComponent: function(c) {
        this.components.push(c);
        // c.$forceUpdate();
    },

    init: function() {
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

        // english by default
        if (code != undefined)
            this.load(code); // load new language file if other one is better
    },

    load: async function(code) {
        let fileref = document.createElement('script');
        fileref.setAttribute('src', './lang/' + code + '.js');

        document.getElementsByTagName("head")[0].appendChild(fileref);
    },

    use: async function(newLang) {
        window.lang = window.lang == undefined ? newLang : Object.assign(lang, newLang);
        setCookie({ lang: lang.name });

        this.components.forEach(c => {
            c.$forceUpdate();
        });
    }
};


module.exports = { i18n };