"use strict";

let timerEditableData = {
    hour: 0,
    minute: 0,
    second: 0
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'Tab' || e.key === 'Enter') {
        nextTimeValueFieldEvent(e);
    }
});

getAllTimeValueField().forEach((x) => {
    x.addEventListener("focus", focusTimeValueFieldEvent, false);
    x.addEventListener("blur", blurTimeValueFieldEvent, false);
    x.addEventListener("beforeinput", b4changedTimeValueFieldEvent, false);
    x.addEventListener("input", changedTimeValueFieldEvent, false);
});


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
    target.innerText = "";
}

function blurTimeValueFieldEvent(e) {
    let target = e.target;
    let value_str = target.innerText;
    let value = Math.trunc(value_str);

    if (value_str.length == 0 || value_str.length > 2 || isNaN(value) || value_str.indexOf('.') !== -1) {
        target.innerText = target.beforeFocus;
    } else {
        value = Math.max(0, Math.min(value, 59));
        target.innerText = value > 9 ? value + "" : "0" + value;


        let target_id = target.id;
        if (target_id === 'H') {
            timerEditableData.hour = value;
        } else if (target_id === 'M') {
            timerEditableData.minute = value;
        } else if (target_id === 'S') {
            timerEditableData.second = value;
        }
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
        value_str = target.innerText = "0";
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