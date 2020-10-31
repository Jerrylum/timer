'use strict';

let vuePanel = new Vue({
    el: '#setting-panel',
    mounted() {
        i18n.addComponent(this);

        let cookie = getCookie();

        this.theme = cookie.theme || this.theme;

        document.body.addEventListener("mousemove", (e) => {
            if (!this.isHideOptional) return;

            if (e.movementX > 2 || e.movementY > 2) this.isHideOptional = false;
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