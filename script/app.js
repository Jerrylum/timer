'use strict';

vi = new Vue({
  el: '#thebody',
  mounted: function mounted() {
    var _this = this;

    setInterval(function () {
      // HACK, manually update
      if (vi.t) vi.t.__ob__.dep.notify();
    }, 1);
    getAllEditableTimeValueField().forEach(function (x) {
      x.addEventListener('focus', _this.focusTimeValueFieldEvent, false);
      x.addEventListener('blur', _this.blurTimeValueFieldEvent, false);
      x.addEventListener('beforeinput', _this.b4changedTimeValueFieldEvent, false);
      x.addEventListener('input', _this.changedTimeValueFieldEvent, false);
    });
  },
  data: {
    theme: rawTheme,
    themesList: ['dark', 'light'],
    isHideOptional: false,
    t: rawTimer,
    timerEditingFlag: {
      hour: false,
      minute: false,
      second: false,
      msec: false
    }
  },
  watch: {
    't._previousTicks': function t_previousTicks() {
      this.updateTimerCookie();
    },
    't._startTick': function t_startTick() {
      this.updateTimerCookie();
    },
    theme: {
      handler: function handler() {
        document.body.className = this.theme;
        setCookie({
          theme: this.theme
        });
      },
      immediate: true
    },
    isHideOptional: function isHideOptional() {
      document.body.style.cursor = this.isHideOptional ? 'none' : '';
    },
    timeS: function timeS() {
      document.title = "".concat(vi.timeH, ":").concat(vi.timeM, ":").concat(vi.timeS);
    }
  },
  methods: {
    BodyKeyDownEvent: function BodyKeyDownEvent(e) {
      if (e.key === 'Tab' || e.key === 'Enter') {
        var target_id = e.target.id;

        if (target_id in getTimerData()) {
          e.preventDefault();
          var now = e.target;
          var allFields = getAllEditableTimeValueField();
          var next = allFields[(allFields.indexOf(now) + 1) % allFields.length];
          now.blur();
          next.focus();
        }
      }
    },
    BodyMouseMoveEvent: function BodyMouseMoveEvent(e) {
      if (!this.isHideOptional) return;
      if (e.movementX > 1 || e.movementY > 1) this.isHideOptional = false;
    },
    clickBtn1Event: function clickBtn1Event() {
      if (this.t.status == TimerStatus.INIT) {
        if (this.t.displayTicks == 0) {
          this.t = new StopwatchTimer();
        } else {
          var oldTicks = this.t.displayTicks;
          this.t = new CountdownTimer();
          this.t.set(oldTicks);
        }

        this.t.start();
      } else if (this.t.status == TimerStatus.RUNNING) this.t.stop();else if (this.t.status == TimerStatus.PAUSE) this.t.start();
    },
    clickBtn2Event: function clickBtn2Event() {
      if (this.t.status == TimerStatus.INIT) {
        this.t.set(0);
        this.updateTimerCookie(); // important
      } else {
        this.t.reset();
      }
    },
    updateEditableDataAndHtml: function updateEditableDataAndHtml(target, value) {
      if (target.id === 'hour') {
        value = Math.max(0, Math.min(value, 99));
      } else if (target.id === 'minute') {
        value = Math.max(0, Math.min(value, 59));
      } else if (target.id === 'second') {
        value = Math.max(0, Math.min(value, 59));
      } else if (target.id === 'msec') {
        value = Math.max(0, Math.min(value, 999));
      } //this.timerEditableData[target.id] = value;


      target.innerText = value;

      var _getTimerData = getTimerData(),
          hour = _getTimerData.hour,
          minute = _getTimerData.minute,
          second = _getTimerData.second,
          msec = _getTimerData.msec;

      this.t.set(hour, minute, second, msec);
    },
    focusTimeValueFieldEvent: function focusTimeValueFieldEvent(e) {
      var target = e.target;
      this.timerEditingFlag[target.id] = true;
      target.beforeFocus = target.innerText;
    },
    blurTimeValueFieldEvent: function blurTimeValueFieldEvent(e) {
      var target = e.target;
      var value_str = target.innerText;
      var value = Math.trunc(value_str);
      this.timerEditingFlag[target.id] = false; // important

      if (value_str.length == 0 || isNaN(value) || value_str.indexOf('.') !== -1) {
        value = Math.trunc(target.beforeFocus);
      }

      this.updateEditableDataAndHtml(target, value);
    },
    b4changedTimeValueFieldEvent: function b4changedTimeValueFieldEvent(e) {
      e.target.beforeInput = e.target.innerText;
    },
    changedTimeValueFieldEvent: function changedTimeValueFieldEvent(e) {
      var sel = window.getSelection();
      var startOffset = sel.getRangeAt(0).startOffset; // the orignal

      var target = e.target;
      var value_str = target.innerText;

      if (value_str.length == 0) {
        value_str = target.innerText = '0';
      }

      if (target.id == "msec") {
        value_str = value_str.slice(0, 3);
      } else {
        value_str = value_str.slice(0, 2);
      }

      var value = Math.trunc(value_str);

      if (isNaN(value) || value_str.indexOf('.') !== -1) {
        value = Math.trunc(target.beforeInput);
      } // update the data


      this.updateEditableDataAndHtml(target, value); // set target.innerText will reset the caret position to zero
      // set the caret position to undo the effect

      var newRange = document.createRange();
      newRange.setStart(target.childNodes[0], Math.min(target.innerText.length, startOffset));
      newRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(newRange);
    },
    updateTimerCookie: function updateTimerCookie() {
      setCookie({
        timer_mode: this.t instanceof CountdownTimer ? 'countdown' : 'stopwatch',
        timer_start_tick: this.t._startTick,
        timer_previous_ticks: this.t._previousTicks,
        timer_init_ticks: this.t._initTicks,
        // for stopwatch
        timer_total_ticks: this.t._totalTicks // for countdown timer

      });
    }
  },
  computed: {
    displayTicks: function displayTicks() {
      return t.displayTicks;
    },

    /**
     * when the flag == true, the user start typing. we should clear the content
     * when the user start typing, the computed update will be suspended by Vue
     */
    timeH: function timeH() {
      if (this.timerEditingFlag.hour) return '';
      var time = Math.trunc(this.t.displayTicks / 3600000);
      return time > 9 ? time + '' : '0' + time;
    },
    timeM: function timeM() {
      if (this.timerEditingFlag.minute) return '';
      var time = Math.trunc(this.t.displayTicks % 3600000 / 60000);
      return time > 9 ? time + '' : '0' + time;
    },
    timeS: function timeS() {
      if (this.timerEditingFlag.second) return '';
      var time = Math.trunc(this.t.displayTicks % 60000 / 1000);
      return time > 9 ? time + '' : '0' + time;
    },
    timeMS: function timeMS() {
      if (this.timerEditingFlag.msec) return '';
      var time = Math.trunc(this.t.displayTicks % 1000);
      if (this.t.status == TimerStatus.INIT && time == 0) return '000';
      return time;
    },
    isBtn1Disabled: function isBtn1Disabled() {
      return this.t instanceof CountdownTimer ? this.t.status == TimerStatus.TIMESUP : false;
    },
    getBtn1Warning: function getBtn1Warning() {
      return this.t.status == TimerStatus.TIMESUP ? lang.times_up_blocked_warning : '';
    },
    getBtn1Message: function getBtn1Message() {
      return this.t.status == TimerStatus.RUNNING ? lang.pause : lang.start;
    },
    getBtn2Message: function getBtn2Message() {
      return this.t.status == TimerStatus.INIT ? lang.clear : lang.reset;
    },
    isEditable: function isEditable() {
      return this.t.status == TimerStatus.INIT || this.t.status == TimerStatus.PAUSE;
    }
  }
});