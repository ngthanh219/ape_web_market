<template>
    <div class="alert-notification">
        <div class="notification-wrapper">
            <i 
                class="fa-solid"
                v-bind:class="[
                    (notification.success == 1) ? 'fa-check' : 'fa-x'
                ]"
            />
            <span
                v-bind:class="[
                    (notification.success == 1) ? 'check' : 'x'
                ]"
            >{{ notification.message }}</span>
            <div 
                class="under-process" 
                :style="{
                    width: proccessPercent + '%'
                }"
                v-bind:class="[
                    (notification.success == 1) ? 'check' : 'x'
                ]"
            />
        </div>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: 'Alert',
        computed: {
            ...mapGetters([
                'notification',
            ])
        },
        props: {
            setNotification: Function
        },
        data() {
            return {
                proccessPercent: 100,
                intervalId: null,
                currentStatus: 0
            }
        },
        mounted() {
            this.setProccess();
        },
        updated() { 
            if (this.currentStatus != this.notification.status) {
                this.proccessPercent = 100;
                clearInterval(this.intervalId);
                this.setProccess();
            }
        },
        destroyed() {
            clearInterval(this.intervalId);
            this.setNotification(1, null);
        },
        methods: {
            setProccess() {
                this.intervalId = setInterval(this.move, 50);
                this.currentStatus = this.notification.status;
            },
            
            move() {
                if (this.proccessPercent <= 0) {
                    this.setNotification(1, null);
                } else {
                    this.proccessPercent -= 1;
                }
            }
        }
    }
</script>
