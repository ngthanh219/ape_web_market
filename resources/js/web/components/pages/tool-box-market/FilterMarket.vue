<template>
    <div class="wp-filter">
        <div class="filter">
            <div class="f-header">
                <label>Filter</label>
                <div class="btn-option">
                    <div class="btn clear first" @click="clearFilter">Clear</div>
                    <div class="btn apply" @click="applyFilter">Apply</div>
                </div>
            </div>
            <div class="f-menu">
                <div class="f-m-box">
                    <label>Price</label>
                    <div class="value" v-if="!isLoadingData">
                        <div class="v-slider">
                            <MultiRangeSlider
                                :baseClassName="'multi-range-slider-bar-only'"
                                :minValue="parseInt(minPercentSlider)"
                                :maxValue="parseInt(maxPercentSlider)"
                                :step="1"
                                :rangeMargin="0"
                                @input="updateSliderRange"
                            />
                        </div>
                        <div class="v-input">
                            <span>
                                <input type="number" class="form-control" v-model="formData.min_price" @keypress="handleOnlyNumber($event)" @input="updateSliderNumber($event)">
                            </span>
                            <span class="fs-main text-main mx-auto">to</span>
                            <span>
                                <input type="number" class="form-control" v-model="formData.max_price" @keypress="handleOnlyNumber($event)" @input="updateSliderNumber($event)">
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import MultiRangeSlider from "multi-range-slider-vue";
    import "multi-range-slider-vue/MultiRangeSliderBarOnly.css";
    import request from '../../../helpers/request';

    export default {
        name: 'FilterMarket',
        components: {
            MultiRangeSlider
        },
        props: {
            formData: Object,
            getDataList: Function,
            isLoadingData: Boolean
        },
        data() {
            return {
                minPercentSlider: 0,
                maxPercentSlider: 100
            }
        },
        updated() {
            if (this.formData.reset_slider) {
                this.minPercentSlider = 0;

                setTimeout(() => {
                    this.maxPercentSlider = 100;
                }, 1);
                
                this.formData.reset_slider = false;
            }
        },
        methods: {
            updateSliderRange(e) {
                this.minPercentSlider = e.minValue;
                this.maxPercentSlider = e.maxValue;

                this.formData.min_price = (this.formData.max_price_slider * this.minPercentSlider / 100);
                this.formData.max_price = (this.formData.max_price_slider * this.maxPercentSlider / 100);
            },

            handleOnlyNumber(e) {
                request.isNumber(e);
            },

            updateSliderNumber(e) {
                if (this.formData.min_price > this.formData.max_price_slider) {
                    this.formData.min_price = this.formData.max_price_slider;
                }
                
                if (this.formData.max_price > this.formData.max_price_slider) {
                    this.formData.max_price = this.formData.max_price_slider;
                }

                if (this.formData.max_price < this.formData.min_price) {
                    var tmpMin = this.formData.min_price;
                    var tmpMax = this.formData.max_price;
                    this.formData.max_price = tmpMin;
                    this.formData.min_price = tmpMax;
                } else {
                    this.minPercentSlider = (this.formData.min_price / this.formData.max_price_slider * 100);
                    this.maxPercentSlider = (this.formData.max_price / this.formData.max_price_slider * 100);
                }
            },

            clearFilter(e) {
                e.preventDefault();
                
                this.minPercentSlider = 0;

                setTimeout(() => {
                    this.maxPercentSlider = 100;
                }, 1);
            },

            applyFilter(e) {
                e.preventDefault();

                if (this.maxPercentSlider == 0) {
                    this.maxPercentSlider = 1;
                }

                this.formData.offset = 1;
                this.getDataList();
            }
        }
    }
</script>