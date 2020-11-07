'use strict';

require('../css/style.css');
require('./language');

i18n.init();

window.addEventListener('DOMContentLoaded', () => {
    require('./vue-panel');
    require('./vue-timer');
});

window.addEventListener('load', () => {
    document.getElementById('sound').load();
});