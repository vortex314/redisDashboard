<template>
    <v-switch v-model="switch1" class="v-input--reverse" >
        <template #label>
            {{label}}
        </template>
    </v-switch>
</template>

<script>
import { Sub } from "../Sub.js";
import { Redis } from "@/Redis.js";

export default {
    props: {
        config: {
            type: Object,
            default: () => ({
                srcTopic: "src/device/object/prop",
                dstTopic: "dst/device/object/prop",
                dstValueOn: "true",
                dstValueOff: "false",
                labelOn: "ON",
                labelOff: "OFF",
                timeout: 3000,
            }),
        },
    },
    data() {
        return {
            switch1: false,
            label:this.config.labelOff
        };
    },
    watch: {
        switch1: function (newVal, oldVal) {
            console.log(this.config.label, newVal, oldVal);
            var v = newVal ? this.config.dstValueOn : this.config.dstValueOff;
            Redis.request(["publish", this.config.dstTopic, v]).then(function (response) {
                console.log('response', response);
            });
            this.label = this.switch1 ? this.config.labelOn : this.config.labelOff;
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
.v-input--reverse .v-input__slot {
    flex-direction: row-reverse;
    justify-content: flex-end;

    .v-application--is-ltr & {
        .v-input--selection-controls__input {
            margin-right: 0;
            margin-left: 8px;
        }
    }

    .v-application--is-rtl & {
        .v-input--selection-controls__input {
            margin-left: 0;
            margin-right: 8px;
        }
    }
}

.v-input--expand .v-input__slot {
    .v-label {
        display: block;
        flex: 1;
    }
}

.container {
    max-width: 360px;
}
</style>