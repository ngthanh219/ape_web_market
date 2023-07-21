import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

import actions from './actions';
import mutations from './mutations';
import getters from './getters';

const store = new Vuex.Store({
    state: {
        isLoadingLogin: false,
        notification: {
            success: 0,
            message: null,
            status: 0
        },
        auth: {
            user: null,
            isUpdatingUser: true,
            accessToken: null,
            refreshToken: null
        },
    },
    actions,
    mutations,
    getters,
    plugins: [createPersistedState()],
});

export default store;
