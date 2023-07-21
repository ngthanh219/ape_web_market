<template>
    <div class="login page container wrapper-content">
        <div class="title">
            <span>LOGIN</span>
        </div>
        <form @submit="login" aria-placeholder="true">
            <div class="group">
                <input type="email" placeholder="Email" name="email" v-model="formData.email">
                <div class="input-icon">
                    <i class="fa-solid fa-user-group"></i>
                </div>
                <span class="text-error" v-if="formDataError.email != ''">{{formDataError.email}}</span>
            </div>
            <div class="group" v-if="!isForgetPasswordForm">
                <input 
                    :type="[
                        isHiddenPassword ? 'password' : 'text'
                    ]" 
                    placeholder="Password"
                    v-model="formData.password"
                >
                <div class="input-icon">
                    <i 
                        :class="[
                            isHiddenPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'
                        ]" 
                        @click="hiddenPassword"
                    />
                </div>
                <span class="text-error" v-if="formDataError.password != ''">{{formDataError.password}}</span>
            </div>
            <div class="group" v-if="isForgetPasswordForm">
                <input 
                    type="text" 
                    placeholder="Verification code"
                    v-model="formData.verification_code"
                >
                <div class="input-icon" v-if="!isSendCode">
                    <a href="/" @click="sendVerificationCode">Send code</a>
                </div>
                <span class="text-error" v-if="formDataError.verification_code != ''">{{formDataError.verification_code}}</span>
            </div>
            <div class="forget-password">
                <a href="/" @click="handleForm">
                    {{ !isForgetPasswordForm ? 'Forget password?' : 'Back' }}
                </a>
            </div>
            <div class="login-button">
                <div class="group">
                    <div class="btn btn-black btn-loading" v-if="isBtnLogin">
                        <div class="loading">
                            <LoadingDot />
                        </div>
                    </div>
                    <button v-else class="btn btn-black" type="submit">Login</button>
                </div>
                <!-- <div class="group">
                    <button class="btn btn-white">Sign up</button>
                </div> -->
            </div>
        </form>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import LoadingDot from '../../commons/loading/LoadingDot';
    import request from '../../../helpers/request';

    export default {
        name: 'Login',
        components: {
            LoadingDot
        },
        props: {
            setNotification: Function,
            setAuthentication: Function,
            getInformation: Function
        },
        computed: {
            ...mapGetters([
                'auth',
                'isLoadingLogin'
            ])
        },
        data() {
            return {
                isHiddenPassword: true,
                isForgetPasswordForm: false,
                isBtnLogin: false,
                isSendCode: false,
                formData: {
                    email: '',
                    password: '',
                    verification_code: ''
                },
                formDataError: {
                    email: '',
                    password: '',
                    verification_code: ''
                },
                attributeName: {
                    email: 'email',
                    password: 'password',
                    verification_code: 'verification code'
                },
            }
        },
        mounted() {
            if (this.auth.user != null) {
                this.$router.push({path: '/toolbox-market' }).then((res) => {});
            }
        },
        methods: {
            hiddenPassword() {
                this.isHiddenPassword = this.isHiddenPassword ? false : true;
            },

            validation(form) {
                var i = 0;

                for (let param in form) {
                    this.formDataError[param] = '';

                    if (this.formData[param] == '') {
                        this.formDataError[param] =  'The ' + this.attributeName[param] + ' field is required';
                        i++;
                    }
                }

                if (i > 0) {
                    return false;
                }

                return true;
            },

            login(e) {
                e.preventDefault();
                var url = 'login';
                var formData = {
                    email: this.formData.email
                };

                if (!this.isForgetPasswordForm) {
                    formData['password'] = this.formData.password;
                } else {
                    formData['verification_code'] = this.formData.verification_code;
                    url = 'register';
                }

                var checkValidation = this.validation(formData);
                if (checkValidation) {
                    var formRequest = request.appendFormData(formData);
                    this.isBtnLogin = true;

                    this.$store.dispatch(url, formRequest)
                    .then((res) => {
                        this.setNotification(1, 'Login successfully');
                        this.setAuthentication({
                            accessToken: res.data.access_token,
                            refreshToken: res.data.refresh_token
                        });

                        this.getInformation();
                        this.$router.push({path: '/toolbox-market' }).then((res) => {});
                    })
                    .catch((err) => {
                        this.isBtnLogin = false;
                        this.setNotification(0, err.error.error_message);
                    });
                }
            },

            handleForm(e) {
                e.preventDefault();

                this.isForgetPasswordForm = this.isForgetPasswordForm ? false : true;
                this.formDataError = {
                    email: '',
                    password: '',
                    verification_code: ''
                }
            },

            sendVerificationCode(e) {
                e.preventDefault();
                var formData = {
                    email: this.formData.email
                };

                var checkValidation = this.validation(formData);
                if (checkValidation) {
                    var formRequest = request.appendFormData(formData);
                    this.isSendCode = true;

                    this.$store.dispatch('sendVerificationCode', formRequest)
                    .then((res) => {
                        this.setNotification(1, res.message);
                        this.isSendCode = false;
                    })
                    .catch((err) => {
                        this.setNotification(0, err.error.error_message);
                        this.isSendCode = false;
                    });
                }
            }
        }
    }
</script>
