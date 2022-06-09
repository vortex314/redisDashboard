<template>
    <v-switch v-model="switch1" :label="`${config.label} ${switch1.toString()}`"></v-switch>
</template>

<script>
import { Sub } from "../Sub.js";
import { Redis } from "@/Redis.js";

export default {
    props: {
        config: {
            type: Object,
            default: () => ({
                label: "LABELDUMMY",
                srcTopic: "TOPICDUMMY",
                dstTopic: "TOPICDUMMY",
                unit: "UNITDUMMY",
                timeout: 3000,
            }),
        },
    },
    data() {
        return {
            switch1: false,
        };
    },
    watch:{
        switxh1: function(newVal, oldVal){
            console.log(`${this.config.label} ${newVal.toString()}`);
            Redis.request(["publish", this.config.dstTopic, newVal]).then(function(response){
                console.log(`${this.config.label} ${response}`);
            });
        }
    },
    mounted() {
        this.sub = new Sub(this.config.srcTopic, 60000, this.onMessage, this.onTimeout);
        console.log("SubSwitch label:" + this.config.label + " topic " + this.config.dstTopic);
    },
    methods: {
        onMessage(topic, message) {
            this.switch1 = message;
            this.sub.resetTimer();
        },
        onTimeout() {
            this.switch1 = false;
        },
    }

}
</script>

<style>
</style>