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
     * @param {number} c Second
     */
    set(a, b, c) {
        throw new Error("NotImplementedError");
    }

    reset() {
        this._startTick = null;
        this._previousTicks = 0;

        let { hour, minute, second } = timerEditableData;
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
            this._initTicks = a + this._previousTicks % 1000 + 1; // keep ms
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
            this._totalTicks = a + this._previousTicks % 1000 + 1; // keep ms
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

function setFieldContent(elm, time, col = 2) {
    time = Math.trunc(time);
    elm.innerText = time > 9 ? time + '' : (col == 3 ? '00' : '0') + time;
}

function getAllEditableTimeValueField() {
    return document.querySelectorAll('#timer-value > *[contenteditable]');
}

function getMSecTimeValueField() {
    return document.querySelector('#timer-value-msec');
}

function updateEditableDataToTimer(target) {
    let value = Math.trunc(target.innerText);

    let target_id = target.id;
    if (target_id === 'H') {
        timerEditableData.hour = value;
    } else if (target_id === 'M') {
        timerEditableData.minute = value;
    } else if (target_id === 'S') {
        timerEditableData.second = value;
    }

    let { hour, minute, second } = timerEditableData;
    t.set(hour, minute, second);
}

function focusTimeValueFieldEvent(e) {
    let target = e.target;

    target.beforeFocus = target.innerText;
    target.innerText = '';
}

function blurTimeValueFieldEvent(e) {
    let target = e.target;
    let value_str = target.innerText;
    let value = Math.trunc(value_str);

    // important
    if (value_str.length == 0 || value_str.length > 2 || isNaN(value) || value_str.indexOf('.') !== -1) {
        target.innerText = target.beforeFocus;
    } else {
        value = Math.max(0, Math.min(value, 59));
        setFieldContent(target, value);
    }
    updateEditableDataToTimer(target);
}

function b4changedTimeValueFieldEvent(e) {
    e.target.beforeInput = e.target.innerText;
}

function changedTimeValueFieldEvent(e) {
    let sel = window.getSelection();
    let startOffset = sel.getRangeAt(0).startOffset; // the orignal

    let target = e.target;
    let value_str = target.innerText;

    if (value_str.length == 0) {
        value_str = target.innerText = '0';
    } else if (value_str.length > 2) {
        value_str = target.innerText = value_str.slice(0, 2);
    }

    let value = Math.trunc(value_str);
    if (isNaN(value) || value_str.indexOf('.') !== -1) {
        target.innerText = target.beforeInput;
    }

    // set target.innerText will reset the caret position to zero
    // set the caret position to undo the effect
    let newRange = document.createRange();
    newRange.setStart(target.childNodes[0], Math.min(target.innerText.length, startOffset));
    newRange.collapse(true);
    sel.removeAllRanges();
    sel.addRange(newRange);

    // finally, update the data
    updateEditableDataToTimer(target);
}

function nextTimeValueFieldEvent(e) {
    let target_id = e.target.id;
    if (target_id === 'H' || target_id === 'M' || target_id === 'S') {
        e.preventDefault();

        let now = e.target;
        let allFields = getAllEditableTimeValueField();

        let next = allFields[(allFields.indexOf(now) + 1) % allFields.length];
        now.blur();
        next.focus();
    }
}

function clickBtn0Event() {
    if (t.status == TimerStatus.INIT) {
        let oldClockTicks = t.displayTicks;
        t = t instanceof CountdownTimer ? new StopwatchTimer() : new CountdownTimer();
        t.set(oldClockTicks);

        let btn0 = document.querySelector('#btn0 .content');
        if (t instanceof CountdownTimer) {
            btn0.innerText = 'Timer';
        } else {
            btn0.innerText = 'Stopwatch';
        }
    }
}

function clickBtn1Event() {
    if (t.status == TimerStatus.INIT)
        if ((t instanceof CountdownTimer) && (t.totalTicks == 0))
            return;
        else
            t.start();
    else if (t.status == TimerStatus.RUNNING)
        t.stop();
    else if (t.status == TimerStatus.PAUSE)
        t.start();
}

function clickBtn2Event() {
    if (t instanceof StopwatchTimer) {
        // if stopwatch, to 0
        getAllEditableTimeValueField().forEach((x) => setFieldContent(x, 0))
        setFieldContent(getMSecTimeValueField, 0)
        timerEditableData = {
            hour: 0,
            minute: 0,
            second: 0
        };
    }
    t.reset();
}

function enableButton(elm, text) {
    elm.className = '';
    if (text)
        elm.querySelector('.content').innerText = text;
}

function disableButton(elm, text, msg) {
    elm.className = 'disabled';
    if (text)
        elm.querySelector('.content').innerText = text;
    if (msg)
        elm.querySelector('.tooltiptext').innerText = msg;
}

function updateTimerEvent() {
    let btn0 = document.getElementById('btn0');
    let btn1 = document.getElementById('btn1');
    let fields = getAllEditableTimeValueField();
    let msField = document.getElementById('timer-value-msec');


    let nowStatus = t.status;

    if (nowStatus == TimerStatus.TIMESUP) {
        if (updateTimerEvent.lastStatus != nowStatus) {
            fields.forEach((x) => x.setAttribute('contenteditable', 'false'));

            disableButton(btn0);
            disableButton(btn1, 'Start', 'Time is up, please reset the timer first');

            setFieldContent(fields[0], 0);
            setFieldContent(fields[1], 0);
            setFieldContent(fields[2], 0);
            setFieldContent(msField, 0, 3);
        }

    } else if (nowStatus == TimerStatus.RUNNING) {
        if (updateTimerEvent.lastStatus != nowStatus) {

            fields.forEach((x) => x.setAttribute('contenteditable', 'false'));

            disableButton(btn0);
            enableButton(btn1, 'Pause');
        }

        // should always update, important

        let ticks = t.displayTicks;

        setFieldContent(fields[0], ticks / 3600000);
        ticks %= 3600000;
        setFieldContent(fields[1], ticks / 60000);
        ticks %= 60000;
        setFieldContent(fields[2], ticks / 1000);
        ticks %= 1000;
        setFieldContent(msField, ticks);

    } else if (nowStatus == TimerStatus.PAUSE) {
        if (updateTimerEvent.lastStatus != nowStatus) {
            // the user can edit the time
            fields.forEach((x) => x.setAttribute('contenteditable', 'true'));

            disableButton(btn0);
            enableButton(btn1, 'Start');
        }

    } else { // init status, make the field editable

        if (updateTimerEvent.lastStatus != nowStatus) {
            let { hour, minute, second } = timerEditableData;

            setFieldContent(fields[0], hour);
            setFieldContent(fields[1], minute);
            setFieldContent(fields[2], second);
            setFieldContent(msField, 0, 3);

            fields.forEach((x) => x.setAttribute('contenteditable', 'true'));

            enableButton(btn0);

        }

        if (t instanceof CountdownTimer && t.displayTicks == 0)
            disableButton(btn1, 'Start', 'Timer cannot be set to zero');
        else
            enableButton(btn1, 'Start');
    }

    updateTimerEvent.lastStatus = nowStatus;
}


let timerEditableData = {
    hour: 0,
    minute: 0,
    second: 0
}

let t = new CountdownTimer();

document.addEventListener('keydown', function (e) {
    if (e.key === 'Tab' || e.key === 'Enter') {
        nextTimeValueFieldEvent(e);
    }
});

getAllEditableTimeValueField().forEach((x) => {
    x.addEventListener('focus', focusTimeValueFieldEvent, false);
    x.addEventListener('blur', blurTimeValueFieldEvent, false);
    x.addEventListener('beforeinput', b4changedTimeValueFieldEvent, false);
    x.addEventListener('input', changedTimeValueFieldEvent, false);
});

setInterval(updateTimerEvent, 1);