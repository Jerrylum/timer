'use strict';

class TimerStatus {
    static INIT = Symbol();
    static RUNNING = Symbol();
    static PAUSE = Symbol();
    static TIMESUP = Symbol();
}

class Timer {
    constructor() {
        this._previousTicks = 0;
        this._startTick = null;
    }

    stop() {
        if (this.isRunning) {
            this._previousTicks += new Date().getTime() - this._startTick;
            this._startTick = null;
        }
    }

    start() {
        throw new Error("NotImplementedError");
    }

    /**
     * Set the time value of this timer
     * @param {number} a Hour or tick
     * @param {number} b Minute or undefined
     * @param {number} c Second or undefined
     */
    set(a, b, c) {
        throw new Error("NotImplementedError");
    }

    reset() {
        this._startTick = null;
        this._previousTicks = 0;

        let { hour, minute, second } = vi.timerEditableData;
        this.set(hour, minute, second);
    }

    get displayTicks() {
        throw new Error("NotImplementedError");
    }

    get isRunning() {
        return this.status == TimerStatus.RUNNING;
    }

    get status() {
        throw new Error("NotImplementedError");
    }
}

class StopwatchTimer extends Timer {
    constructor() {
        super();

        this._initTicks = 0;
    }

    start() { // override
        if (!this.isRunning)
            this._startTick = new Date().getTime();
    }

    set(a, b, c) {
        if (b != null && c != null)
            a = a * 3600000 + b * 60000 + c * 1000;

        if (this.status == TimerStatus.PAUSE) {
            this._initTicks = a + this.displayTicks % 1000 - 1; // keep ms
            this._previousTicks = 1; // keep pause mode
        } else {
            this._initTicks = a;
        }
    }

    get displayTicks() {
        return this.passedTicks;
    }

    get status() { // override
        if (this._startTick == null && this._previousTicks == 0)
            return TimerStatus.INIT;
        else if (this._startTick == null && this._previousTicks != 0)
            return TimerStatus.PAUSE;
        else
            return TimerStatus.RUNNING;
    }

    get passedTicks() {
        return Math.max(
            0,
            (
                this._startTick ?
                    new Date().getTime() - this._startTick :
                    0
            ) +
            this._initTicks + this._previousTicks
        );
    }
}

class CountdownTimer extends Timer {
    constructor() {
        super();

        this._totalTicks = 0;
    }

    start() { // override
        if (!this.isRunning && !this.isTimeup)
            this._startTick = new Date().getTime();
    }

    set(a, b, c) {
        if (b != null && c != null)
            a = a * 3600000 + b * 60000 + c * 1000;

        if (this.status == TimerStatus.PAUSE) {
            this._totalTicks = a + this.displayTicks % 1000 + 1; // keep ms
            this._previousTicks = 1; // keep pause mode
        } else {
            this._totalTicks = a;
        }
    }

    get displayTicks() {
        return this.remainingTicks;
    }

    get isTimeup() {
        return this.status == TimerStatus.TIMESUP;
    }

    get status() { // override
        if (this._startTick == null && this._previousTicks == 0)
            return TimerStatus.INIT;
        else if (this._startTick != null && this.remainingTicks != 0)
            return TimerStatus.RUNNING;
        else if (this._startTick == null && this._previousTicks != 0)
            return TimerStatus.PAUSE;
        else if (this.remainingTicks == 0)
            return TimerStatus.TIMESUP;
    }


    get totalTicks() {
        return this._totalTicks;
    }

    get remainingTicks() {
        return Math.max(
            0,
            (
                this._startTick ?
                    this._startTick - new Date().getTime() :
                    0
            ) +
            this._totalTicks - this._previousTicks
        );
    }

}


let lang;
let languagesList = {
    "en-US": "English",
    "zh-HK": "繁體中文"
};

let rawTheme = 'dark';
let rawTimer = new CountdownTimer();

let vi;

function loadLanguage(code) {
    let fileref = document.createElement('script');
    fileref.setAttribute('src', './lang/' + code + '.js');

    document.getElementsByTagName("head")[0].appendChild(fileref);
}

function useLanguage(newLang) {
    lang = lang == undefined ? newLang : Object.assign(lang, newLang);
    setCookie({lang: lang.name});
}


function setCookie(input) {
    var expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    Object.keys(input).forEach((key) =>
        document.cookie = `${key}=${input[key]}; expires=${expiryDate.toGMTString()};`
    );
}

function getCookie() {
    let rtn = {};

    document.cookie.split(';').forEach((token) => {
        let splited = token.split('=');
        rtn[splited[0].trim()] = splited[1].trim();
    });

    return rtn;
}

function getAllEditableTimeValueField() {
    return [...document.querySelectorAll('#timer-value > *[contenteditable]')];
}

(function () {
    let cookie = getCookie();

    // language

    let code = cookie.lang;

    if (code == undefined) {
        let language = window.navigator.userLanguage || window.navigator.language;

        let check = function (r) {
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

    // theme

    rawTheme = cookie.theme || rawTheme;

    // timer

    if (cookie.timer_mode) {
        if (cookie.timer_mode == 'countdown') {
            rawTimer = new CountdownTimer();
            rawTimer._totalTicks = Math.trunc(cookie.timer_total_ticks) || 0;
        } else {
            rawTimer = new StopwatchTimer();
            rawTimer._initTicks = Math.trunc(cookie.timer_init_ticks) || 0;
        }

        rawTimer._startTick = Math.trunc(cookie.timer_start_tick) || null;
        rawTimer._previousTicks = Math.trunc(cookie.timer_previous_ticks) || 0;
    }


})();