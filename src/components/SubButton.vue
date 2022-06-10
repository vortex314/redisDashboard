<template>
<v-btn
  :color="color"
  depressed
  elevation="2"
  rounded
></v-btn>
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
                srcValueOn:"true",
                srcValueOff:"false",
                labelOn: "ON",
                labelOff: "OFF",
                timeout: 3000,
            }),
        },
    },
    data() {
        return {
            color: "red",
        };
    },
    watch: {
        config: function (newVal, oldVal) {
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
            if (message == JSON.parse(this.config.srcValueOn)) {
                this.color = "green";
            } else {
                this.color = "red";
            }
        },
        onTimeout() {
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