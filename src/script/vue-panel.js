'use strict';

const { getCookie, setCookie, SoundManager, TimerStatus, CountdownTimer } = require('./preload');
const { i18n } = require('./language');

window.vuePanel = new Vue({
    el: '#setting-panel',
    mounted() {
        i18n.addComponent(this);

        let cookie = getCookie();

        this.theme = cookie.theme || this.theme;
        this.sound.isSoundOn = cookie.sound ? cookie.sound == 'true' : this.sound.isSoundOn;

        let cancelHideOptional = () => {
            if (!this.isHideOptional) return;

            this.isHideOptional = false;
        };

        document.body.addEventListener("touchstart", cancelHideOptional, false);
        document.body.addEventListener("touchmove", cancelHideOptional, false);

        // IE does not support movementX
        let prevX = 0;
        let prevY = 0;
        document.body.addEventListener("mousemove", (e) => {
            let movementX = (prevX ? e.screenX - prevX : 0)
            let movementY = (prevY ? e.screenY - prevY : 0)

            prevX = e.screenX;
            prevY = e.screenY;

            if (movementX > 2 || movementY > 2) cancelHideOptional();
        });

        document.addEventListener("fullscreenchange", () => {
            this.$forceUpdate();
        });

        window.addEventListener('resize', () => {
            this.$forceUpdate();
        });

    },
    data: {
        isHideOptional: false,
        theme: 'dark',
        themesList: [
            'dark',
            'light'
        ],
        zoomScale: 1,
        sound: new SoundManager(),
        animation: {
            soundBtnHighlight: false
        }
    },
    watch: {
        isHideOptional: function() {
            document.body.style.cursor = this.isHideOptional ? 'none' : '';
        },
        theme: {
            handler: function(newVal, oldVal) {
                this.themesList.forEach(x => document.body.classList.remove(x));
                document.body.classList.add(newVal);

                if (oldVal != undefined) // important, check is not immediate update
                    setCookie({ theme: newVal });
            },
            immediate: true
        },
        'sound.isSoundOn': {
            handler: function(newVal, oldVal) {
                if (oldVal != undefined) // important, check is not immediate update
                    setCookie({ sound: newVal });
            },
            immediate: true
        }
    },
    computed: {},
    methods: {
        updateTimer: function(t) {
            this.sound.updateStatus(t.status);
            if (t.status == TimerStatus.RUNNING && t instanceof CountdownTimer)
                this.playSoundBtnHighlight();
            else
                this.animation.soundBtnHighlight = false;
        },

        playSoundBtnHighlight: function() {
            if (!this.animation.soundBtnHighlight) {
                this.animation.soundBtnHighlight = true;

                this.$refs.muteIcon.classList.add('highlight');
                setTimeout(() => {
                    this.$refs.muteIcon.classList.remove('highlight');
                }, 1000);
            }
        },

        openFullscreen: function() {
            var elem = document.documentElement;
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) { /* Safari */
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE11 */
                elem.msRequestFullscreen();
            }
        },

        closeFullscreen: function() {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) { /* Safari */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE11 */
                document.msExitFullscreen();
            }
        },

        isFullScreen: function() {
            return document.fullscreenElement != null || document.msFullscreenElement != null;
        },

        getTimerScale: function() {
            var clientWidth = document.body.offsetWidth;

            var i = Math.min(1, clientWidth / 900) * this.zoomScale;

            return "scale(" + i + ")";
        }
    }
});


module.exports = { vuePanel };