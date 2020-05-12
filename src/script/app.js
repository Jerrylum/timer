'use strict';

vi = new Vue({
    el: '#thebody',
    mounted() {

        setInterval(function () {
            // HACK, manually update
            if (vi.t) vi.t.__ob__.dep.notify();
        }, 1);

        getAllEditableTimeValueField().forEach((x) => {
            x.addEventListener('focus', this.focusTimeValueFieldEvent, false);
            x.addEventListener('blur', this.blurTimeValueFieldEvent, false);
            x.addEventListener('beforeinput', this.b4changedTimeValueFieldEvent, false);
            x.addEventListener('input', this.changedTimeValueFieldEvent, false);
        });

    },
    data: {
        theme: rawTheme,
        themesList: [
            'dark',
            'light'
        ],

        t: rawTimer,
        timerEditableData: {
            hour: 0,
            minute: 0,
            second: 0
        },
        timerEditingFlag: {
            hour: false,
            minute: false,
            second: false
        }
    },
    watch: {
        't._previousTicks': function () { this.updateTimerCookie() },
        't._startTick': function () { this.updateTimerCookie() },
        theme: {
            handler: function () {
                document.querySelector('body').className = this.theme;
                setCookie({theme: this.theme});
            },
            immediate: true
        },
        timeS: function() {
            document.title = `${vi.timeH}:${vi.timeM}:${vi.timeS}`
        }

    },
    methods: {
        BodyKeyDownEvent: function (e) {
            if (e.key === 'Tab' || e.key === 'Enter') {
                let target_id = e.target.id;
                if (target_id === 'hour' || target_id === 'minute' || target_id === 'second') {
                    e.preventDefault();

                    let now = e.target;
                    let allFields = getAllEditableTimeValueField();

                    let next = allFields[(allFields.indexOf(now) + 1) % allFields.length];
                    now.blur();
                    next.focus();
                }
            }
        },

        clickBtn0Event: function () {
            if (this.t.status == TimerStatus.INIT) {
                let oldClockTicks = this.t.displayTicks;
                this.t = this.t instanceof CountdownTimer ? new StopwatchTimer() : new CountdownTimer();
                this.t.set(oldClockTicks);
            }
        },

        clickBtn1Event: function () {
            if (this.t.status == TimerStatus.INIT)
                if ((this.t instanceof CountdownTimer) && (this.t.totalTicks == 0))
                    return;
                else
                    this.t.start();
            else if (this.t.status == TimerStatus.RUNNING)
                this.t.stop();
            else if (this.t.status == TimerStatus.PAUSE)
                this.t.start();
        },

        clickBtn2Event: function () {
            if (this.t instanceof StopwatchTimer) {
                // if stopwatch, to 0
                this.timerEditableData = {
                    hour: 0,
                    minute: 0,
                    second: 0
                };
            }
            this.t.reset();
        },


        updateEditableDataAndHtml: function (target, value) {
            if (target.id === 'hour') {
                value = Math.max(0, Math.min(value, 99));
            } else if (target.id === 'minute') {
                value = Math.max(0, Math.min(value, 59));
            } else if (target.id === 'second') {
                value = Math.max(0, Math.min(value, 59));
            }
            this.timerEditableData[target.id] = value;
            target.innerText = value;

            let { hour, minute, second } = this.timerEditableData;
            this.t.set(hour, minute, second);
        },

        focusTimeValueFieldEvent: function (e) {
            let target = e.target;

            this.timerEditingFlag[target.id] = true;

            target.beforeFocus = target.innerText;
        },

        blurTimeValueFieldEvent: function (e) {
            let target = e.target;
            let value_str = target.innerText;
            let value = Math.trunc(value_str);

            this.timerEditingFlag[target.id] = false;

            // important
            if (value_str.length == 0 || value_str.length > 2 || isNaN(value) || value_str.indexOf('.') !== -1) {
                value = Math.trunc(target.beforeFocus);
            }
            this.updateEditableDataAndHtml(target, value);
        },

        b4changedTimeValueFieldEvent: function (e) {
            e.target.beforeInput = e.target.innerText;
        },

        changedTimeValueFieldEvent: function (e) {
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

        updateTimerCookie: function () {
            setCookie({
                timer_mode: this.t instanceof CountdownTimer ? 'countdown' : 'stopwatch',
                timer_start_tick: this.t._startTick,
                timer_previous_ticks: this.t._previousTicks,
                timer_init_ticks: this.t._initTicks, // for stopwatch
                timer_total_ticks: this.t._totalTicks // for countdown timer
            });
        }

    },
    computed: {
        displayTicks: function () {
            return t.displayTicks;
        },

        /**
         * when the flag == true, the user start typing. we should clear the content
         * when the user start typing, the computed update will be suspended by Vue
         */

        timeH: function () {
            if (this.timerEditingFlag.hour) return '';

            let time = Math.trunc(this.t.displayTicks / 3600000);
            return time > 9 ? time + '' : '0' + time;
        },

        timeM: function () {
            if (this.timerEditingFlag.minute) return '';

            let time = Math.trunc(this.t.displayTicks % 3600000 / 60000);
            return time > 9 ? time + '' : '0' + time;
        },

        timeS: function () {
            if (this.timerEditingFlag.second) return '';

            let time = Math.trunc(this.t.displayTicks % 60000 / 1000);
            return time > 9 ? time + '' : '0' + time;
        },

        timeMS: function () {
            if (this.t.status == TimerStatus.INIT) return '000';

            let time = Math.trunc(this.t.displayTicks % 1000);
            return time;
        },

        isBtn0Disabled: function () {
            return this.t.status != TimerStatus.INIT;
        },

        isBtn1Disabled: function () {
            return this.t instanceof CountdownTimer ?
                this.t.status == TimerStatus.TIMESUP || this.t.displayTicks == 0 :
                false;
        },

        getBtn1Warning: function () {
            return this.t.status == TimerStatus.TIMESUP ? lang.times_up_blocked_warning : lang.time_zero_warning;
        },

        getBtn0Message: function () {
            return this.t instanceof CountdownTimer ?
                lang.countdown :
                lang.stopwatch
        },

        getBtn1Message: function () {
            return this.t.status == TimerStatus.RUNNING ? lang.pause : lang.start;
        },

        isEditable: function () {
            return this.t.status == TimerStatus.INIT || this.t.status == TimerStatus.PAUSE;
        }
    }
});
