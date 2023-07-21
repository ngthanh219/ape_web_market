<template>
    <div class="modal-wrapper">
        <section class="m-container">
            <div class="m-overlay" @click="closeMintNFTModalProp"></div>
            <div class="m-wrap" v-bind:class="isAnimationActiveModal ? 'animation-active' : ''">
                <div class="m-box full-data">
                    <div class="loading" v-if="!isShowContentModal">
                        <LoadingCircle />
                    </div>
                    <div class="btn-close" v-if="isShowContentModal">
                        <a href="/close-modal" @click="closeMintNFTModalProp">
                            <i class="fa-solid fa-arrow-left"></i>
                            Back
                        </a>
                    </div>
                    <div class="m-content show" v-if="isShowContentModal">
                        <div class="card">
                            <div class="left">
                                <div class="c-image">
                                    <img :src="mintNFTModalData.image" alt="">
                                </div>
                                <div class="c-info">
                                    <div class="benefit"></div>
                                </div>
                            </div>
                            <div class="right">
                                <div class="item i-benefit">
                                    <img class="apeg-goin" :src="apegCoinImage" alt="" />
                                    <span>
                                        {{
                                            mintNFTModalData.type == 0 ?
                                                mintNFTModalData.mining_speed.toLocaleString() + '/s'
                                            :
                                                mintNFTModalData.max_earned.toLocaleString() + '/24h'
                                        }}
                                    </span>
                                </div>
                                <div class="item i-price" v-if="!mintNFTModalData.owned">
                                    <img class="apeg-goin" :src="apegCoinImage" alt="">
                                    <span>{{ mintNFTModalData.gold_price_number.toLocaleString() }} APEG</span>
                                </div>
                                <div class="item i-btn-mint">
                                    <a href="/mint-nft" @click="mintNft">
                                        <div class="loading" v-if="isBtnMint">
                                            <LoadingDot />
                                        </div>
                                        <i class="fa-solid fa-credit-card" v-if="!isBtnMint"></i>
                                        <span v-if="!isBtnMint">Mint</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    import request from '../../../helpers/request';
    import LoadingDot from '../../commons/loading/LoadingDot';
    import LoadingCircle from '../../commons/loading/LoadingCircle';

    export default {
        name: 'MintNFTModal',
        components: {
            LoadingCircle,
            LoadingDot
        },
        props: {
            apegCoinImage: String,
            mintNFTModalData: Object,
            auth: Object,
            closeMintNFTModal: Function,
            setNotification: Function,
            setAuthentication: Function,
            updateNftOwned: Function
        },
        data() {
            return {
                isAnimationActiveModal: false,
                isShowContentModal: false,
                isBtnMint: false
            }
        },
        mounted() {
            setTimeout(() => {
                this.isAnimationActiveModal = true;
            }, 100);

            setTimeout(() => {
                this.isShowContentModal = true;
            }, 300);
        },
        methods: {
            closeMintNFTModalProp(e) {
                e.preventDefault();
                
                this.closeMintNFTModal();
            },

            mintNft(e) {
                e.preventDefault();

                if (this.auth.user && !this.isBtnMint) {
                    this.isBtnMint = true;
                    var form = request.appendFormData({
                        nft_id: this.mintNFTModalData.id
                    });

                    this.$store.dispatch('mintNft', form)
                    .then((res) => {
                        this.setNotification(1, 'Minted successfully');
                        this.updateNftOwned();
                        this.closeMintNFTModal();
                        this.isBtnMint = false;
                        this.setAuthentication({
                            user: res.data
                        });
                    })
                    .catch((err) => {
                        this.isBtnMint = false;
                        this.setNotification(0, err.error.error_message);
                    })
                } else {
                    this.$router.push({path: '/login' }).then((res) => {});
                }
            }
        }
    }
</script>
