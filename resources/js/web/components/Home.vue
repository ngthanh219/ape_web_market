<template>
    <div class="container-wrap">
        <Alert 
            v-if="notification.message != null" 
            :setNotification="setNotification"
        />

        <Header 
            :setNotification="setNotification"
            :setAuthentication="setAuthentication"
        />

        <div class="pages">
            <router-view
                :setNotification="setNotification"
                :setAuthentication="setAuthentication"
                :getInformation="getInformation"
            />
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';

    import Alert from './commons/popup/Alert';
    import Header from './layouts/Header';
    import Login from './pages/auth/Login';
    import ToolBoxMarket from './pages/tool-box-market/ToolBoxMarket';

    export default {
        name: 'Home',
        components: {
            Alert,
            Header,
            Login,
            ToolBoxMarket
        },
        computed: {
            ...mapGetters([
                'auth',
                'notification',
            ])
        },
        mounted() {
            this.setNotification(1, null);

            if (this.auth.accessToken != null) {
                this.getInformation();
            }
        },
        methods: {
            setAuthentication(data) {
                data.user = (typeof data.user === 'undefined') ? (this.auth.user ? this.auth.user : null) : data.user;
                data.isUpdatingUser = (typeof data.isUpdatingUser === 'undefined') ? false : data.isUpdatingUser;
                data.accessToken = (typeof data.accessToken === 'undefined') ? (this.auth.accessToken ? this.auth.accessToken : null) : data.accessToken;
                data.refreshToken = (typeof data.refreshToken === 'undefined') ? (this.auth.refreshToken ? this.auth.refreshToken : null) : data.refreshToken;
                
                this.$store.commit('setAuth', data);
            },

            setNotification(success, message) {
                this.$store.commit('setNotification', {
                    success: success,
                    message: message,
                    status: this.notification.status == 0 ? 1 : 0
                });
            },

            getInformation() {
                this.$store.commit('setLoadingLogin', true);
                this.setAuthentication({
                    isUpdatingUser: true
                });
                
                this.$store.dispatch('getInformation')
                .then((res) => {
                    this.$store.commit('setLoadingLogin', false);
                    this.setAuthentication({
                        user: res.data
                    });
                })
                .catch((err) => {
                    this.$store.commit('setLoadingLogin', false);
                    this.setNotification(0, err.error.error_message);
                    this.setAuthentication({
                        user: null,
                        accessToken: null,
                        refreshToken: null
                    });
                });
            },
        }
    }
</script>