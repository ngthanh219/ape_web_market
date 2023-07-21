import actionParams from "./index";

let authentication = {
    login({state}, formRequest) {
        return new Promise((resolve, reject) => {
            axios.post(actionParams.appAPI + 'auth/login', formRequest)
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                reject(actionParams.getError(err));
            })
        });
    },

    register({state}, formRequest) {
        return new Promise((resolve, reject) => {
            axios.post(actionParams.appAPI + 'auth/register', formRequest)
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                reject(actionParams.getError(err));
            })
        });
    },

    logout({state}, formRequest) {
        axios.defaults.headers.common = {'Authorization': `Bearer ` + state.auth.accessToken}
        return new Promise((resolve, reject) => {
            axios.post(actionParams.appAPI + 'auth/logout')
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                reject(actionParams.getError(err));
            })
        });
    },

    sendVerificationCode({state}, formRequest) {
        return new Promise((resolve, reject) => {
            axios.post(actionParams.appAPI + 'auth/send-verification-code', formRequest)
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                reject(actionParams.getError(err));
            })
        });
    },
}

export default authentication;
