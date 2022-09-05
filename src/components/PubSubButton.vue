<template>
  <v-card class="d-flex fill-height justify-center  outlined align-center">
    <span bgcolor="onState ? 'green' : 'red'">
      {{ config.label }}
    </span>
    <v-btn
      @click="onButtonClicked"
      :disabled="onState || timedOut"
      color="green"
      >{{ config.labelOn }}</v-btn
    >
    <v-btn
      @click="offButtonClicked"
      :disabled="!onState || timedOut"
      color="red"
      >{{ config.labelOff }}</v-btn
    >
  </v-card>
</template>

<script>
import { Sub } from "../Sub.js";
import { Redis } from "@/Redis.js";

export default {
  props: {
    config: {
      type: Object,
      default: () => ({
        label: "DUMMY",
        srcTopic: "src/device/object/prop",
        srcValueOn: "ON",
        srcValueOff: "OFF",
        dstTopicOn: "dst/device/object/prop",
        dstValueOn: "true",
        dstTopicOff: "dst/device/object/prop",
        dstValueOff: "false",
        labelOn: "ON",
        labelOff: "OFF",
        timeout: 3000,
      }),
    },
  },
  data() {
    return {
      onState: false,
      timedOut: true,
      label: this.config.labelOff,
    };
  },
  watch: {
    config: function (newVal, oldVal) {
      console.log(this.config.label, newVal, oldVal);
      this.sub.dispose();
      this.sub = new Sub(
        this.config.srcTopic,
        this.config.timeout,
        this.onMessage,
        this.onTimeout
      );
    },
  },
  mounted() {
    this.sub = new Sub(
      this.config.srcTopic,
      60000,
      this.onMessage,
      this.onTimeout
    );
    console.log(
      "SubSwitch label:" + this.config.label + " topic " + this.config.dstTopic
    );
  },
  methods: {
    onMessage(topic, message) {
      this.timedOut = false;
      if (message == this.config.srcValueOn) {
        this.onState = true;
      } else if (message == this.config.srcValueOff) {
        this.onState = false;
      }
    },
    onTimeout() {
      this.timedOut = true;
    },
    onButtonClicked() {
      Redis.request([
        "publish",
        this.config.dstTopicOn,
        this.config.dstValueOn,
      ]).then(function (response) {
        console.log("response", response);
      });
    },
    offButtonClicked() {
      Redis.request([
        "publish",
        this.config.dstTopicOff,
        this.config.dstValueOff,
      ]).then(function (response) {
        console.log("response", response);
      });
    },
  },
};
</script>

<style>
.alive {
  background-color: #fff;
  color: #084480;
}

.dead {
  background-color: #888;
  color: #fff;
}
</style>