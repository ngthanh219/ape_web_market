import authentication from './api/authentication';
import toolbox from './api/toolbox';
import user from './api/user';

let actions = {
    login: authentication.login,
    register: authentication.register,
    sendVerificationCode: authentication.sendVerificationCode,
    logout: authentication.logout,
    getInformation: user.getInformation,
    getListNft: toolbox.getListNft,
    mintNft: toolbox.mintNft
}

export default actions;
