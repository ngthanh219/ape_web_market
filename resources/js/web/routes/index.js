import Vue from 'vue';
import Router from 'vue-router';
import VueRouter from "vue-router";

import routes from "./routes";

Vue.use(Router);

const router = new VueRouter({
    mode: 'history',
    routes,
    linkActiveClass: 'nav-link active',
    scrollBehavior: (to) => {
        if (to.hash) {
            return {selector: to.hash}
        } else {
            return {x: 0, y: 0}
        }
    }
})

export default router;
