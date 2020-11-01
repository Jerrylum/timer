'use strict';

let vuePanel = new Vue({
    el: '#setting-panel',
    mounted() {
        i18n.addComponent(this);

        let cookie = getCookie();

        this.theme = cookie.theme || this.theme;

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
        sound: new SoundManager()
    },
    watch: {
        isHideOptional: function() {
            document.body.style.cursor = this.isHideOptional ? 'none' : '';
        },
        theme: {
            handler: function() {
                this.themesList.forEach(x => document.body.classList.remove(x));
                document.body.classList.add(this.theme);
                setCookie({ theme: this.theme });
            },
            immediate: true
        }
    },
    computed: {},
    methods: {
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