import actionParams from "./index";

let toolbox = {
    getListNft({state}, queryString) {
        if (state.auth.accessToken) {
            axios.defaults.headers.common = {'Authorization': `Bearer ` + state.auth.accessToken}
        }

        return new Promise((resolve, reject) => {
            axios.get(actionParams.appAPI + 'list-tool-boxes' + queryString)
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                reject(actionParams.getError(err));
            })
        });
    },

    mintNft({state}, formData) {
        axios.defaults.headers.common = {'Authorization': `Bearer ` + state.auth.accessToken}
        return new Promise((resolve, reject) => {
            axios.post(actionParams.appAPI + 'user/market-mint-toolbox', formData)
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                reject(actionParams.getError(err));
            })
        });
    }
}

export default toolbox;
