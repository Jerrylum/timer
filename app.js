'use strict';

class TimerStatus {
    static INIT = Symbol();
    static RUNNING = Symbol();
    static PAUSE = Symbol();
    static TIMESUP = Symbol();
}

class CountdownTimer {
    constructor() {
        this._previousTicks = 0;
        this._totalTicks = 0;
        this._startTick = null;
    }

    stop() {
        if (this.isRunning) {
            this._previousTicks += new Date().getTime() - this._startTick;
            this._startTick = null;
        }
    }

    start() {
        if (!this.isRunning && !this.isTimeup)
            this._startTick = new Date().getTime();
    }

    reset() {
        this._previousTicks = 0;
        this._startTick = null;
    }

    set(h, m, s) {
        this._previousTicks = 0;
        this._totalTicks = h * 3600000 + m * 60000 + s * 1000;
    }

    get isTimeup() {
        return this.status == TimerStatus.TIMESUP;
    }

    get isRunning() {
        return this.status == TimerStatus.RUNNING;
    }

    get status() {
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

function setFieldContent(elm, time, zero = 2) {
    time = Math.trunc(time);
    elm.innerText = time > 9 ? time + '' : (zero == 3 ? '00' : '0') + time;
}

function getAllTimeValueField() {
    return [
        document.querySelector('#timer-value #H'),
        document.querySelector('#timer-value #M'),
        document.querySelector('#timer-value #S')
    ];
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

    if (value_str.length == 0 || value_str.length > 2 || isNaN(value) || value_str.indexOf('.') !== -1) {
        target.innerText = target.beforeFocus;
    } else {
        value = Math.max(0, Math.min(value, 59));
        setFieldContent(target, value);


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
}

function nextTimeValueFieldEvent(e) {
    let target_id = e.target.id;
    if (target_id === 'H' || target_id === 'M' || target_id === 'S') {
        e.preventDefault();

        let now = e.target;
        let allFields = getAllTimeValueField();

        let next = allFields[(allFields.indexOf(now) + 1) % allFields.length];
        now.blur();
        next.focus();
    }
}

function clickBtn1Event() {
    if (t.status == TimerStatus.INIT && t.totalTicks != 0)
        t.start();
    else if (t.status == TimerStatus.RUNNING)
        t.stop();
    else if (t.status == TimerStatus.PAUSE)
        t.start();
}

function clickBtn2Event() {
    t.reset();
}

function updateTimerEvent() {
    let btn1 = document.getElementById('btn1');
    let fields = getAllTimeValueField();
    let msField = document.getElementById('timer-value-msec');


    let nowStatus = t.status;

    if (nowStatus == TimerStatus.TIMESUP) {
        if (this.lastStatus != nowStatus) {
            fields.forEach((x) => x.setAttribute('contenteditable', 'false'));

            btn1.className = 'disabled';
            btn1.innerText = 'Start';

            setFieldContent(fields[0], 0);
            setFieldContent(fields[1], 0);
            setFieldContent(fields[2], 0);
            setFieldContent(msField, 0, 3);
        }

    } else if (nowStatus == TimerStatus.RUNNING) {
        if (this.lastStatus != nowStatus) {

            fields.forEach((x) => x.setAttribute('contenteditable', 'false'));

            btn1.className = '';
            btn1.innerText = 'Pause';
        }


        let ticks = t.remainingTicks;

        setFieldContent(fields[0], ticks / 3600000);
        ticks %= 3600000;
        setFieldContent(fields[1], ticks / 60000);
        ticks %= 60000;
        setFieldContent(fields[2], ticks / 1000);
        ticks %= 1000;
        setFieldContent(msField, ticks, 3);

    } else if (nowStatus == TimerStatus.PAUSE) {
        if (this.lastStatus != nowStatus) {
             // the user can edit the time
            fields.forEach((x) => x.setAttribute('contenteditable', 'true'));

            btn1.className = '';
            btn1.innerText = 'Start';
        }

    } else { // init status, make the field editable

        if (this.lastStatus != nowStatus) {
            let { hour, minute, second } = timerEditableData;

            setFieldContent(fields[0], hour);
            setFieldContent(fields[1], minute);
            setFieldContent(fields[2], second);
            setFieldContent(msField, 0, 3);

            fields.forEach((x) => x.setAttribute('contenteditable', 'true'));

            btn1.className = '';
            btn1.innerText = 'Start';
        }

    }

    this.lastStatus = nowStatus;
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

getAllTimeValueField().forEach((x) => {
    x.addEventListener('focus', focusTimeValueFieldEvent, false);
    x.addEventListener('blur', blurTimeValueFieldEvent, false);
    x.addEventListener('beforeinput', b4changedTimeValueFieldEvent, false);
    x.addEventListener('input', changedTimeValueFieldEvent, false);
});

setInterval(updateTimerEvent, 1);