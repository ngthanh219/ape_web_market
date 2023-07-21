<template>
    <header
        v-bind:class="[
            isToggleBox ? 'toggle-show' : ''
        ]"
    >
        <div class="container wrapper-content">
            <div class="logo">
                <a href="https://apemove.io">
                    <img src="https://apemove.io/3553d1edf004cb9410cc2ceaaa5fd2b2.svg" alt="apemove" />
                </a>
            </div>
            <button class="toggle" @click="showToggleMenu">
                <i 
                    class="fa-solid" 
                    v-bind:class="[
                        isToggleBox ? 'fa-times' : 'fa-bars'
                    ]" 
                />
            </button>
            <div class="navbar" v-bind:class="[
                isToggleBox ? 'toggle-show' : ''
            ]">
                <div class="menu">
                    <ul>
                        <li class="first-item">
                            <router-link to="/toolbox-market" class="nav-link" @click.native="clickMenu">
                                APEToolBox Marketplace
                            </router-link>
                        </li>
                    </ul>
                </div>
                <div class="information" v-bind:class="[ isLoadingLogin ? 'loading-login' : '' ]">
                    <div class="loading" v-if="isLoadingLogin">
                        <LoadingDot />
                    </div>
                    <div class="login-button f-end" v-if="!isLoadingLogin && auth.user == null">
                        <router-link to="/login" class="nav-link" @click.native="clickMenu">
                            <i class="fa-solid fa-right-to-bracket"></i>
                            <span>Login</span>
                        </router-link>
                    </div>
                    <div class="login-button f-space" v-if="!isLoadingLogin && auth.user != null">
                        <div class="email" @click="copyEmail">{{ auth.user.email }}</div>
                        <div class="login-button">
                            <a @click="logout" href="/logout" class="nav-link">
                                <i class="fa-solid fa-right-to-bracket"></i>
                                <span>Logout</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
    import { mapGetters } from 'vuex';
    import LoadingDot from '../commons/loading/LoadingDot';

    export default {
        name: 'Header',
        components: {
            LoadingDot
        },
        props: {
            setNotification: Function,
            setAuthentication: Function
        },
        computed: {
            ...mapGetters([
                'isLoadingLogin',
                'auth'
            ])
        },
        data() {
            return {
                isToggleBox: false
            }
        },
        methods: {
            logout(e) {
                e.preventDefault();
                this.$store.commit('setLoadingLogin', true);
                this.$store.dispatch('logout')
                .then((res) => {
                    this.setAuthentication({
                        user: null,
                        accessToken: null,
                        refreshToken: null
                    });

                    this.setNotification(1, 'Logged out');
                    this.$router.push({path: '/login' }).then((res) => {});
                    this.$store.commit('setLoadingLogin', false);
                })
                .catch((err) => {
                    this.setNotification(0, err.error.error_message);
                    this.$store.commit('setLoadingLogin', false);
                });

                this.isToggleBox = false;
            },

            copyEmail(e) {
                this.setNotification(1, 'Copied');
                navigator.clipboard.writeText(this.auth.user.email);
            },

            showToggleMenu(e) {
                e.preventDefault();

                this.isToggleBox = this.isToggleBox ? false : true;
            },

            clickMenu(e) {
                e.preventDefault();

                this.isToggleBox = false;
            }
        }
    }
</script>
