<template>
    <div class="wp-data">
        <div class="data">
            <div class="d-header">
                <div class="d-h-menu">
                    <div class="d-h-m-box">
                        <a href="/tools" class="first" v-bind:class="[formData.type == 0 ? 'active' : '']" @click="selectTab($event, '0')">Tools</a>
                        <a href="/boxes" v-bind:class="[formData.type == 1 ? 'active' : '']" @click="selectTab($event, '1')">Boxes</a>
                    </div>
                </div>
                <div class="d-h-filter-option" v-if="!isLoadingData && dataList">
                    <label>
                        <span>{{ dataList.total_record + (formData.type == 0 ? ' tools' : ' boxes')}}</span>
                        <div v-if="auth.user && auth.user.mint_cooldown != null">
                            Cooldown time: <small>{{ mintCooldown }}</small>
                        </div>
                    </label>
                    <div class="user-coin">
                        <div class="image">
                            <img :src="apegCoinImage" alt="" />
                        </div>
                        <span>{{ (auth.user) ? auth.user.gold_coin_number.toLocaleString() : 0 }}</span>
                    </div>
                </div>
            </div>
            <div class="d-market-list">
                <div class="item-grid">
                    <div 
                        class="wp-list" 
                        v-if="!isLoadingData && dataList && dataList.list.length != 0"
                    >
                        <div class="l-item" v-for="data, index in dataList.list" v-bind:key="index">
                            <a
                                :href="'/mint-nft/' + data.id + (Math.random() + 1).toString(36).substring(7)"
                                v-on:click.prevent="
                                    data.owned ? showMintNFTModal(false) : showMintNFTModal(true, index, data)
                                "
                            >
                                <div
                                    class="card"
                                    v-bind:class="[
                                        data.owned ? 'card-owned' : ''
                                    ]"
                                >
                                    <div class="c-image">
                                        <img :src="data.image" alt="">
                                    </div>
                                    <div class="c-info">
                                        <div class="benefit">
                                            <div class="wp-box">
                                                <img :src="apegCoinImage" alt="" />
                                                <span>
                                                    {{
                                                        data.type == 0 ?
                                                            data.mining_speed.toLocaleString() + '/s'
                                                        :
                                                            data.max_earned.toLocaleString() + '/24h'
                                                    }}
                                                </span>
                                            </div>
                                        </div>
                                        <div class="price" v-if="!data.owned">
                                            <label>Price</label>
                                            <div class="value">
                                                <img :src="apegCoinImage" alt="">
                                                <span>{{ data.gold_price_number.toLocaleString() }}</span>
                                            </div>
                                        </div>
                                        <div class="price" v-else>
                                            <div class="owned">
                                                <i class="fa-solid fa-check"></i>
                                                <span>Owned</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div class="wp-list-pagination" v-if="!isLoadingData && dataList && dataList.list.length != 0">
                        <ul class="paginator">
                            <li>
                                <button 
                                    v-bind:class="[
                                        formData.offset <= 1 ? 'inactive' : ''
                                    ]"
                                    @click="prevPage"
                                >
                                    <i class="fa-solid fa-arrow-left"></i>
                                </button>
                            </li>
                            <li class="paginator-input">
                                <div class="left">Page</div>
                                <span class="form-container">
                                    <form>
                                        <span>
                                            <div class="wrapper-input-currency">
                                                <input 
                                                    type="text" 
                                                    class="form-control" 
                                                    v-model="formData.offset" 
                                                    @change="redirectPage"
                                                    @keypress="handleOnlyNumber($event)"
                                                >
                                            </div>
                                        </span>
                                    </form>
                                </span>
                                <div class="right">of {{ dataList.total_page }}</div>
                            </li>
                            <li>
                                <button
                                    v-bind:class="[
                                        formData.offset == dataList.total_page ? 'inactive' : ''
                                    ]"
                                    @click="nextPage"
                                >
                                    <i class="fa-solid fa-arrow-right"></i>
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div class="no-data" v-if="!isLoadingData && dataList && dataList.list.length == 0">
                        <i class="fa-solid fa-database"></i>
                        <span>No data</span>
                    </div>
                    <div class="pending-data" v-if="isLoadingData">
                        <LoadingCircle />
                    </div>
                </div>
            </div>
        </div>

        <MintNFTModal
            v-if="isMintNFTModal"
            :apegCoinImage="apegCoinImage"
            :auth="auth"
            :mintNFTModalData="mintNFTModalData"

            :closeMintNFTModal="closeMintNFTModal"
            :setNotification="setNotification"
            :setAuthentication="setAuthentication"
            :updateNftOwned="updateNftOwned"
        />
    </div>
</template>

<script>
    import env from '../../../env';
    import request from '../../../helpers/request';
    import LoadingCircle from '../../commons/loading/LoadingCircle';
    import MintNFTModal from './MintNFTModal';

    export default {
        name: 'DataMarket',
        components: {
            LoadingCircle,
            MintNFTModal
        },
        props: {
            formData: Object,
            dataList: Object,
            auth: Object,
            isLoadingData: Boolean,
            getDataList: Function,
            setNotification: Function,
            setAuthentication: Function,
            getInformation: Function
        },
        data() {
            return {
                apegCoinImage: env.apegCoinImage,
                isMintNFTModal: false,
                mintNFTModalData: null,
                mintCooldown: null
            }
        },
        mounted() {
            this.getDataList(true);

            if (this.auth.user && this.auth.user.mint_cooldown) {
                var countDownDate = new Date(this.formatDateTime(new Date(this.auth.user.mint_cooldown), false)).getTime();
                this.getMintCooldownRemainingTime(countDownDate);
            }
        },
        updated() {
            if (this.auth.user && this.auth.user.mint_cooldown) {
                var countDownDate = new Date(this.formatDateTime(new Date(this.auth.user.mint_cooldown), false)).getTime();
                this.getMintCooldownRemainingTime(countDownDate);
            }
        },
        methods: {
            padTo2Digits(num) {
                return num.toString().padStart(2, '0');
            },

            formatDateTime(time, utc) {
                var format = '';

                if (utc) {
                    format = time.getUTCFullYear() + '-' + this.padTo2Digits(time.getUTCMonth())  + '-' + this.padTo2Digits(time.getUTCDate()) + ' ' + 
                            this.padTo2Digits(time.getUTCHours()) + ':' + this.padTo2Digits(time.getUTCMinutes()) + ':' + this.padTo2Digits(time.getUTCSeconds())
                } else {
                    format = time.getFullYear() + '-' + this.padTo2Digits(time.getMonth())  + '-' + this.padTo2Digits(time.getDate()) + ' ' + 
                            this.padTo2Digits(time.getHours()) + ':' + this.padTo2Digits(time.getMinutes()) + ':' + this.padTo2Digits(time.getSeconds())
                }

                return format;
            },

            getMintCooldownTime(countDownDate) {
                var now = new Date(this.formatDateTime(new Date(), true)).getTime();
                var distance = countDownDate - now;
                var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                this.mintCooldown = days + "d " + hours + "h " + minutes + "m " + seconds + "s";

                return distance;
            },

            getMintCooldownRemainingTime(countDownDate) {
                var self = this;
                var x = setInterval(function() {
                    var distance = self.getMintCooldownTime(countDownDate);

                    if (distance < 0) {
                        clearInterval(x);
                        self.mintCooldown = null;

                        var userData = self.auth.user;
                        userData.mint_cooldown = null;
                        self.setAuthentication({
                            user: userData
                        });
                    }
                }, 1000);
            },

            selectTab(e, type) {
                e.preventDefault();
                
                this.formData.type = type;
                this.formData.offset = 1;
                this.formData.min_price = 0;
                this.formData.max_price = 0;
                this.formData.reset_slider = true;
                this.getDataList(true);
            },

            prevPage() {
                if (this.formData.offset > 1) {
                    this.formData.offset = parseInt(this.formData.offset) - 1;
                    this.getDataList();
                }
            },

            nextPage() {
                if (this.formData.offset < this.dataList.total_page) {
                    this.formData.offset = parseInt(this.formData.offset) + 1;
                    this.getDataList();
                }
            },

            redirectPage() {
                if (this.formData.offset == 0) {
                    this.formData.offset = 1;
                }

                if (this.formData.offset > this.dataList.total_page) {
                    this.formData.offset = parseInt(this.dataList.total_page);
                }

                this.getDataList();
            },
            
            handleOnlyNumber(e) {
                request.isNumber(e);
            },

            showMintNFTModal(clickStatus, index, dataNft) {
                if (clickStatus) {
                    this.isMintNFTModal = true;
                    this.mintNFTModalData = dataNft;
                    this.mintNFTModalData['index'] = index;
                }
            },

            closeMintNFTModal() {
                this.isMintNFTModal = false;
            },

            updateNftOwned() {
                for (var i = 0; i <= this.mintNFTModalData.index; i++) {
                    this.dataList.list[i]['owned'] = 1;
                }
            }
        }
    }
</script>