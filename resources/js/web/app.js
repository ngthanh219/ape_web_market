import Vue from 'vue';
import VueRouter from 'vue-router';
import axios from "axios";

import App from './App.vue';
import router from './routes/index';
import store from './store';

Vue.use(VueRouter);

Vue.prototype.$axios = axios;
Vue.prototype.router = router;
Vue.prototype.$store = store;
Vue.config.productionTip = false;
Vue.config.devtools = false;
Vue.config.debug = false;
Vue.config.silent = true;

window.axios = require('axios');

new Vue({
    el: '#app',
    render: h => h(App),
    router,
    store: store
})