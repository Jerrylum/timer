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
    set(a, b, c, d) {
        throw new Error("NotImplementedError");
    }

    reset() {
        this._startTick = null;
        this._previousTicks = 0;

        // CountdownTimer -> _totalTicks; StopwatchTimer -> 0
        this.set(this._totalTicks || 0);
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

    set(a, b, c, d) {
        if (b != null && c != null && d != null)
            a = a * 3600000 + b * 60000 + c * 1000 + d;

        if (this.status == TimerStatus.PAUSE) {
            this._initTicks = a - 1; // keep ms
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

    set(a, b, c, d) {
        if (b != null && c != null && d != null)
            a = a * 3600000 + b * 60000 + c * 1000 + d;

        if (this.status == TimerStatus.PAUSE) {
            this._totalTicks = a + 1; // keep ms
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

class SoundManager {
    constructor() {
        this._on = true;
        this._playing = false; // for IE
    }

    updateStatus(status) {
        if (status == TimerStatus.TIMESUP) {
            if (this._playing == false) {
                this.audioElem.currentTime = 0;
                this.audioElem.play();
                this._playing = true;
            }
        } else {
            this.audioElem.pause();
            this._playing = false;
        }
    }

    set isSoundOn(v) {
        this._on = v;

        this.audioElem.volume = this._on ? 1 : 0;
    }

    get isSoundOn() {
        return this._on;
    }

    get audioElem() {
        return document.getElementById("sound");
    }


}

function setCookie(input) {
    var expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    Object.keys(input).forEach((key) =>
        document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(input[key])}; expires=${expiryDate.toGMTString()};`
    );
}

function getCookie() {
    return document.cookie
        .split(';')
        .map(v => v.split('='))
        .reduce((acc, v) => {
            if (v.length != 1)
                acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
            return acc;
        }, {});
}

module.exports = {
    TimerStatus,
    Timer,
    StopwatchTimer,
    CountdownTimer,
    SoundManager,
    setCookie,
    getCookie
};