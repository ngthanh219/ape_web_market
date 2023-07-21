import actionParams from "./index";

let user = {
    getInformation({state}) {
        axios.defaults.headers.common = {'Authorization': `Bearer ` + state.auth.accessToken}
        return new Promise((resolve, reject) => {
            axios.get(actionParams.appAPI + 'user/market-information')
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                reject(actionParams.getError(err));
            })
        });
    }
}

export default user;
