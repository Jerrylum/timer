'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var TimerStatus = function TimerStatus() {
  _classCallCheck(this, TimerStatus);
};

_defineProperty(TimerStatus, "INIT", Symbol());

_defineProperty(TimerStatus, "RUNNING", Symbol());

_defineProperty(TimerStatus, "PAUSE", Symbol());

_defineProperty(TimerStatus, "TIMESUP", Symbol());

var Timer = /*#__PURE__*/function () {
  function Timer() {
    _classCallCheck(this, Timer);

    this._previousTicks = 0;
    this._startTick = null;
  }

  _createClass(Timer, [{
    key: "stop",
    value: function stop() {
      if (this.isRunning) {
        this._previousTicks += new Date().getTime() - this._startTick;
        this._startTick = null;
      }
    }
  }, {
    key: "start",
    value: function start() {
      throw new Error("NotImplementedError");
    }
    /**
     * Set the time value of this timer
     * @param {number} a Hour or tick
     * @param {number} b Minute or undefined
     * @param {number} c Second
     */

  }, {
    key: "set",
    value: function set(a, b, c) {
      throw new Error("NotImplementedError");
    }
  }, {
    key: "reset",
    value: function reset() {
      this._startTick = null;
      this._previousTicks = 0;
      var hour = timerEditableData.hour,
          minute = timerEditableData.minute,
          second = timerEditableData.second;
      this.set(hour, minute, second);
    }
  }, {
    key: "displayTicks",
    get: function get() {
      throw new Error("NotImplementedError");
    }
  }, {
    key: "isRunning",
    get: function get() {
      return this.status == TimerStatus.RUNNING;
    }
  }, {
    key: "status",
    get: function get() {
      throw new Error("NotImplementedError");
    }
  }]);

  return Timer;
}();

var StopwatchTimer = /*#__PURE__*/function (_Timer) {
  _inherits(StopwatchTimer, _Timer);

  var _super = _createSuper(StopwatchTimer);

  function StopwatchTimer() {
    var _this;

    _classCallCheck(this, StopwatchTimer);

    _this = _super.call(this);
    _this._initTicks = 0;
    return _this;
  }

  _createClass(StopwatchTimer, [{
    key: "start",
    value: function start() {
      // override
      if (!this.isRunning) this._startTick = new Date().getTime();
    }
  }, {
    key: "set",
    value: function set(a, b, c) {
      if (b != null && c != null) a = a * 3600000 + b * 60000 + c * 1000;

      if (this.status == TimerStatus.PAUSE) {
        this._initTicks = a + this._previousTicks % 1000 + 1; // keep ms

        this._previousTicks = 1; // keep pause mode
      } else {
        this._initTicks = a;
      }
    }
  }, {
    key: "displayTicks",
    get: function get() {
      return this.passedTicks;
    }
  }, {
    key: "status",
    get: function get() {
      // override
      if (this._startTick == null && this._previousTicks == 0) return TimerStatus.INIT;else if (this._startTick == null && this._previousTicks != 0) return TimerStatus.PAUSE;else return TimerStatus.RUNNING;
    }
  }, {
    key: "passedTicks",
    get: function get() {
      return Math.max(0, (this._startTick ? new Date().getTime() - this._startTick : 0) + this._initTicks + this._previousTicks);
    }
  }]);

  return StopwatchTimer;
}(Timer);

var CountdownTimer = /*#__PURE__*/function (_Timer2) {
  _inherits(CountdownTimer, _Timer2);

  var _super2 = _createSuper(CountdownTimer);

  function CountdownTimer() {
    var _this2;

    _classCallCheck(this, CountdownTimer);

    _this2 = _super2.call(this);
    _this2._totalTicks = 0;
    return _this2;
  }

  _createClass(CountdownTimer, [{
    key: "start",
    value: function start() {
      // override
      if (!this.isRunning && !this.isTimeup) this._startTick = new Date().getTime();
    }
  }, {
    key: "set",
    value: function set(a, b, c) {
      if (b != null && c != null) a = a * 3600000 + b * 60000 + c * 1000;

      if (this.status == TimerStatus.PAUSE) {
        this._totalTicks = a + this._previousTicks % 1000 + 1; // keep ms

        this._previousTicks = 1; // keep pause mode
      } else {
        this._totalTicks = a;
      }
    }
  }, {
    key: "displayTicks",
    get: function get() {
      return this.remainingTicks;
    }
  }, {
    key: "isTimeup",
    get: function get() {
      return this.status == TimerStatus.TIMESUP;
    }
  }, {
    key: "status",
    get: function get() {
      // override
      if (this._startTick == null && this._previousTicks == 0) return TimerStatus.INIT;else if (this._startTick != null && this.remainingTicks != 0) return TimerStatus.RUNNING;else if (this._startTick == null && this._previousTicks != 0) return TimerStatus.PAUSE;else if (this.remainingTicks == 0) return TimerStatus.TIMESUP;
    }
  }, {
    key: "totalTicks",
    get: function get() {
      return this._totalTicks;
    }
  }, {
    key: "remainingTicks",
    get: function get() {
      return Math.max(0, (this._startTick ? this._startTick - new Date().getTime() : 0) + this._totalTicks - this._previousTicks);
    }
  }]);

  return CountdownTimer;
}(Timer);

function setFieldContent(elm, time) {
  var col = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;
  time = Math.trunc(time);
  elm.innerText = time > 9 ? time + '' : (col == 3 ? '00' : '0') + time;
}

function getAllTimeValueField() {
  return [document.querySelector('#timer-value #H'), document.querySelector('#timer-value #M'), document.querySelector('#timer-value #S')];
}

function updateEditableDataToTimer(target) {
  var value = Math.trunc(target.innerText);
  var target_id = target.id;

  if (target_id === 'H') {
    timerEditableData.hour = value;
  } else if (target_id === 'M') {
    timerEditableData.minute = value;
  } else if (target_id === 'S') {
    timerEditableData.second = value;
  }

  var hour = timerEditableData.hour,
      minute = timerEditableData.minute,
      second = timerEditableData.second;
  t.set(hour, minute, second);
}

function focusTimeValueFieldEvent(e) {
  var target = e.target;
  target.beforeFocus = target.innerText;
  target.innerText = '';
}

function blurTimeValueFieldEvent(e) {
  var target = e.target;
  var value_str = target.innerText;
  var value = Math.trunc(value_str); // important

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
  var sel = window.getSelection();
  var startOffset = sel.getRangeAt(0).startOffset; // the orignal

  var target = e.target;
  var value_str = target.innerText;

  if (value_str.length == 0) {
    value_str = target.innerText = '0';
  } else if (value_str.length > 2) {
    value_str = target.innerText = value_str.slice(0, 2);
  }

  var value = Math.trunc(value_str);

  if (isNaN(value) || value_str.indexOf('.') !== -1) {
    target.innerText = target.beforeInput;
  } // set target.innerText will reset the caret position to zero
  // set the caret position to undo the effect


  var newRange = document.createRange();
  newRange.setStart(target.childNodes[0], Math.min(target.innerText.length, startOffset));
  newRange.collapse(true);
  sel.removeAllRanges();
  sel.addRange(newRange); // finally, update the data

  updateEditableDataToTimer(target);
}

function nextTimeValueFieldEvent(e) {
  var target_id = e.target.id;

  if (target_id === 'H' || target_id === 'M' || target_id === 'S') {
    e.preventDefault();
    var now = e.target;
    var allFields = getAllTimeValueField();
    var next = allFields[(allFields.indexOf(now) + 1) % allFields.length];
    now.blur();
    next.focus();
  }
}

function clickBtn0Event() {
  if (t.status == TimerStatus.INIT) {
    var oldClockTicks = t.displayTicks;
    t = t instanceof CountdownTimer ? new StopwatchTimer() : new CountdownTimer();
    t.set(oldClockTicks);
    var btn0 = document.querySelector('#btn0 .content');

    if (t instanceof CountdownTimer) {
      btn0.innerText = 'Timer';
    } else {
      btn0.innerText = 'Stopwatch';
    }
  }
}

function clickBtn1Event() {
  if (t.status == TimerStatus.INIT) {
    if (t instanceof CountdownTimer && t.totalTicks == 0) return;else t.start();
  } else if (t.status == TimerStatus.RUNNING) t.stop();else if (t.status == TimerStatus.PAUSE) t.start();
}

function clickBtn2Event() {
  t.reset();
}

function enableButton(elm, text) {
  elm.className = '';
  if (text) elm.querySelector('.content').innerText = text;
}

function disableButton(elm, text, msg) {
  elm.className = 'disabled';
  if (text) elm.querySelector('.content').innerText = text;
  if (msg) elm.querySelector('.tooltiptext').innerText = msg;
}

function updateTimerEvent() {
  var btn0 = document.getElementById('btn0');
  var btn1 = document.getElementById('btn1');
  var fields = getAllTimeValueField();
  var msField = document.getElementById('timer-value-msec');
  var nowStatus = t.status;

  if (nowStatus == TimerStatus.TIMESUP) {
    if (updateTimerEvent.lastStatus != nowStatus) {
      fields.forEach(function (x) {
        return x.setAttribute('contenteditable', 'false');
      });
      disableButton(btn0);
      disableButton(btn1, 'Start', 'Time is up, please reset the timer first');
      setFieldContent(fields[0], 0);
      setFieldContent(fields[1], 0);
      setFieldContent(fields[2], 0);
      setFieldContent(msField, 0, 3);
    }
  } else if (nowStatus == TimerStatus.RUNNING) {
    if (updateTimerEvent.lastStatus != nowStatus) {
      fields.forEach(function (x) {
        return x.setAttribute('contenteditable', 'false');
      });
      disableButton(btn0);
      enableButton(btn1, 'Pause');
    }

    var ticks = t.displayTicks;
    setFieldContent(fields[0], ticks / 3600000);
    ticks %= 3600000;
    setFieldContent(fields[1], ticks / 60000);
    ticks %= 60000;
    setFieldContent(fields[2], ticks / 1000);
    ticks %= 1000;
    setFieldContent(msField, ticks, 3);
  } else if (nowStatus == TimerStatus.PAUSE) {
    if (updateTimerEvent.lastStatus != nowStatus) {
      // the user can edit the time
      fields.forEach(function (x) {
        return x.setAttribute('contenteditable', 'true');
      });
      disableButton(btn0);
      enableButton(btn1, 'Start');
    }
  } else {
    // init status, make the field editable
    if (updateTimerEvent.lastStatus != nowStatus) {
      var hour = timerEditableData.hour,
          minute = timerEditableData.minute,
          second = timerEditableData.second;
      setFieldContent(fields[0], hour);
      setFieldContent(fields[1], minute);
      setFieldContent(fields[2], second);
      setFieldContent(msField, 0, 3);
      fields.forEach(function (x) {
        return x.setAttribute('contenteditable', 'true');
      });
      enableButton(btn0);
    }

    if (t instanceof CountdownTimer && t.displayTicks == 0) disableButton(btn1, 'Start', 'Timer cannot be set to zero');else enableButton(btn1, 'Start');
  }

  updateTimerEvent.lastStatus = nowStatus;
}

var timerEditableData = {
  hour: 0,
  minute: 0,
  second: 0
};
var t = new CountdownTimer();
document.addEventListener('keydown', function (e) {
  if (e.key === 'Tab' || e.key === 'Enter') {
    nextTimeValueFieldEvent(e);
  }
});
getAllTimeValueField().forEach(function (x) {
  x.addEventListener('focus', focusTimeValueFieldEvent, false);
  x.addEventListener('blur', blurTimeValueFieldEvent, false);
  x.addEventListener('beforeinput', b4changedTimeValueFieldEvent, false);
  x.addEventListener('input', changedTimeValueFieldEvent, false);
});
setInterval(updateTimerEvent, 1);