<template>
  <v-card class="test-body-2 d-flex fill-height justify-center outlined align-center">
    <v-btn :style="config.style" :class="config.class" @click="buttonClicked">{{ config.label }}</v-btn>
  </v-card>
</template>

<script>
import { Redis } from "@/Redis.js";
export default {
  props: {
    config: {
      type: Object,
      default: () => ({
        label: "BUTTON",
        dstTopic: "dst/device/object/prop",
        dstValue: "true",
        style:"",
        class:"text-button",
        timeout: 3000,
      }),
    },
  },
  data() {
    return {};
  },
  watch: {
    config: function (newVal, oldVal) {
      console.log(this.config, newVal, oldVal);
    },
  },
  methods: {
    buttonClicked() {
      Redis.request([
        "publish",
        this.config.dstTopic,
        this.config.dstValue,
      ]).then((x) => {
        console.log("Publish reply", x);
      });
    },
  },
};
</script>

<style>
</style>