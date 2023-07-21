<template>
    <div class="market-place page container wrapper-content">
        <div class="title">
            <span>NFT mining</span>
        </div>
        <section>
            <FilterMarket
                :formData="formData"
                :isLoadingData="isLoadingData"

                :getDataList="getDataList"
            />

            <DataMarket
                :formData="formData"
                :isLoadingData="isLoadingData"
                :dataList="dataList"
                :auth="auth"
                
                :getDataList="getDataList"
                :setNotification="setNotification"
                :setAuthentication="setAuthentication"
                :getInformation="getInformation"
            />
        </section>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import FilterMarket from './FilterMarket';
    import DataMarket from './DataMarket';
    import request from '../../../helpers/request';

    export default {
        name: 'ToolBoxMarket',
        components: {
            FilterMarket,
            DataMarket
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
                formData: {
                    type: 0,
                    min_price: 0,
                    max_price: 0,
                    max_price_slider: 0,
                    reset_slider: false,
                    limit: 12,
                    offset: 1
                },
                isLoadingData: false,
                dataList: null
            }
        },
        methods: {
            getDataList(isSetData = false) {
                this.isLoadingData = true;
                var form = request.getQueryString({
                    type: this.formData.type,
                    min_price: this.formData.min_price,
                    max_price: this.formData.max_price,
                    limit: this.formData.limit,
                    offset: this.formData.offset
                });

                this.$store.dispatch('getListNft', form)
                .then((res) => {
                    this.dataList = res.data;

                    if (isSetData) {
                        this.formData.max_price = parseInt(this.dataList.max_price);
                        this.formData.max_price_slider = parseInt(this.dataList.max_price);
                    }

                    this.isLoadingData = false;
                })
                .catch((err) => {
                    this.isLoadingData = false;
                    this.setNotification(0, err.error.error_message);
                });
            }
        }
    }
</script>
