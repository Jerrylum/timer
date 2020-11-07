'use strict';

const { TimerStatus, StopwatchTimer, CountdownTimer, getCookie, setCookie } = require('./preload');
const { i18n } = require('./language');

window.vueTimer = new Vue({
    el: '#thebody',
    mounted() {
        i18n.addComponent(this);

        let cookie = getCookie();

        if (cookie.timer_mode) {
            if (cookie.timer_mode == 'countdown') {
                this.t = new CountdownTimer();
                this.t._totalTicks = Math.trunc(cookie.timer_total_ticks) || 0;
            } else {
                this.t = new StopwatchTimer();
                this.t._initTicks = Math.trunc(cookie.timer_init_ticks) || 0;
            }

            this.t._startTick = Math.trunc(cookie.timer_start_tick) || null;
            this.t._previousTicks = Math.trunc(cookie.timer_previous_ticks) || 0;
        }

        if (this.t.status == TimerStatus.TIMESUP)
            this.t.reset();

        setInterval(() => {
            // HACK, manually update
            if (this.t) this.t.__ob__.dep.notify();
        }, 1);

        this.getAllEditableTimeValueFieldElm().forEach((x) => {
            x.addEventListener('focus', this.focusTimeValueFieldEvent, false);
            x.addEventListener('blur', this.blurTimeValueFieldEvent, false);
            x.addEventListener('beforeinput', this.b4changedTimeValueFieldEvent, false);
            x.addEventListener('input', this.changedTimeValueFieldEvent, false);
        });

    },
    data: {
        t: new CountdownTimer(),
        timerEditingFlag: {
            hour: false,
            minute: false,
            second: false,
            msec: false
        }
    },
    watch: {
        't._previousTicks': function() { this.updateTimerCookie() },
        't._startTick': function() { this.updateTimerCookie() },
        't': function(value) { vuePanel.updateTimer(value) },
        timeS: function() {
            document.title = `${this.timeH}:${this.timeM}:${this.timeS}`
        },
        isEditable: {
            handler: function(v) {
                this.getAllEditableTimeValueFieldElm().forEach(x => {
                    if (v)
                        x.setAttribute('contenteditable', 'true');
                    else
                        x.removeAttribute('contenteditable');
                });
            },
            immediate: true
        }

    },
    methods: {
        BodyKeyDownEvent: function(e) {
            let allFieldElm = [...this.getAllEditableTimeValueFieldElm()];

            if (e.key === 'Tab' || e.key === 'Enter') {
                if (allFieldElm.includes(e.target)) {
                    e.preventDefault();

                    let now = e.target;
                    let next = allFieldElm[(allFieldElm.indexOf(e.target) + 1) % allFieldElm.length];
                    now.blur();
                    next.focus();
                }
            }
        },

        clickBtn1Event: function() {
            if (this.t.status == TimerStatus.INIT) {
                if (this.t.displayTicks == 0) {
                    this.t = new StopwatchTimer();
                } else {
                    let oldTicks = this.t.displayTicks;

                    this.t = new CountdownTimer();
                    this.t.set(oldTicks);
                }
                this.t.start();
            } else if (this.t.status == TimerStatus.RUNNING)
                this.t.stop();
            else if (this.t.status == TimerStatus.PAUSE)
                this.t.start();
        },

        clickBtn2Event: function() {
            if (this.t.status == TimerStatus.INIT) {
                this.t.set(0);
                this.updateTimerCookie(); // important
            } else {
                this.t.reset();
            }
        },


        updateEditableDataAndHtml: function(target, value) {
            let max = { hour: 99, minute: 59, second: 59, msec: 999 };
            value = Math.max(0, Math.min(value, max[target.id]));

            target.innerText = value;

            let { hour, minute, second, msec } = this.getTimerData();
            this.t.set(hour, minute, second, msec);
        },

        focusTimeValueFieldEvent: function(e) {
            let target = e.target;

            if (target.contentEditable == 'inherit') return;

            var p = target,
                s = window.getSelection(),
                r = document.createRange();
            r.setStart(p, 0);
            r.setEnd(p, 0);
            s.removeAllRanges();
            s.addRange(r);

            this.timerEditingFlag[target.id] = true;

            target.beforeFocus = target.innerText; // important
        },

        blurTimeValueFieldEvent: function(e) {
            let target = e.target;

            if (this.timerEditingFlag[target.id] == false) return;

            let value_str = target.innerText;
            let value = Math.trunc(value_str);

            this.timerEditingFlag[target.id] = false;

            // important
            if (value_str.length == 0 || isNaN(value) || value_str.indexOf('.') !== -1) {
                value = Math.trunc(target.beforeFocus);
            }
            this.updateEditableDataAndHtml(target, value);
        },

        b4changedTimeValueFieldEvent: function(e) {
            e.target.beforeInput = e.target.innerText;
        },

        changedTimeValueFieldEvent: function(e) {
            let sel = window.getSelection();
            let startOffset = sel.getRangeAt(0).startOffset; // the orignal

            let target = e.target;
            let value_str = target.innerText;

            if (value_str.length == 0)
                value_str = target.innerText = '0';

            value_str = value_str.slice(0, target.id == "msec" ? 3 : 2);

            let value = Math.trunc(value_str);
            if (isNaN(value) || value_str.indexOf('.') !== -1) {
                value = Math.trunc(target.beforeInput);
            }



            // update the data
            this.updateEditableDataAndHtml(target, value);

            // set target.innerText will reset the caret position to zero
            // set the caret position to undo the effect
            let newRange = document.createRange();
            newRange.setStart(target.childNodes[0], Math.min(target.innerText.length, startOffset));
            newRange.collapse(true);
            sel.removeAllRanges();
            sel.addRange(newRange);

        },

        updateTimerCookie: function() {
            setCookie({
                timer_mode: this.t instanceof CountdownTimer ? 'countdown' : 'stopwatch',
                timer_start_tick: this.t._startTick,
                timer_previous_ticks: this.t._previousTicks,
                timer_init_ticks: this.t._initTicks, // for stopwatch
                timer_total_ticks: this.t._totalTicks // for countdown timer
            });
        },

        getTimerData: function() {
            let rtn = {};
            this.getAllEditableTimeValueFieldElm().forEach(e => rtn[e.id] = e.innerText - 0);
            return rtn;
        },

        getAllEditableTimeValueFieldElm: function() {
            return [...document.querySelectorAll('#timer-body span.editable-field')];
        }

    },
    computed: {
        displayTicks: function() {
            return t.displayTicks;
        },

        /**
         * when the flag == true, the user start typing. we should clear the content
         * when the user start typing, the computed update will be suspended by Vue
         */

        timeH: function() {
            if (this.timerEditingFlag.hour) return '';

            let time = Math.trunc(this.t.displayTicks / 3600000);
            time %= 100;
            return time > 9 ? time + '' : '0' + time;
        },

        timeM: function() {
            if (this.timerEditingFlag.minute) return '';

            let time = Math.trunc(this.t.displayTicks % 3600000 / 60000);
            return time > 9 ? time + '' : '0' + time;
        },

        timeS: function() {
            if (this.timerEditingFlag.second) return '';

            let time = Math.trunc(this.t.displayTicks % 60000 / 1000);
            return time > 9 ? time + '' : '0' + time;
        },

        timeMS: function() {
            if (this.timerEditingFlag.msec) return '';

            let time = Math.trunc(this.t.displayTicks % 1000);

            if (this.t.status == TimerStatus.INIT && time == 0)
                return '000';
            else
                return time;
        },

        isBtn1Disabled: function() {
            return this.t instanceof CountdownTimer ?
                this.t.status == TimerStatus.TIMESUP :
                false;
        },

        isTimesUp: function() {
            return this.t.status == TimerStatus.TIMESUP;
        },

        btn1Warning: function() {
            return this.t.status == TimerStatus.TIMESUP ? lang.times_up_blocked_warning : '';
        },

        btn1Message: function() {
            return this.t.status == TimerStatus.RUNNING ? lang.pause : lang.start;
        },

        btn2Message: function() {
            return this.t.status == TimerStatus.INIT ? lang.clear : lang.reset;
        },

        isEditable: function() {
            return this.t.status == TimerStatus.INIT || this.t.status == TimerStatus.PAUSE;
        },


    }
});


module.exports = { vueTimer };