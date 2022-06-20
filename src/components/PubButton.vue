<template>
  <v-card class="d-flex fill-height justify-center outlined align-center">
    <v-btn @click="buttonClicked">{{ config.label }}</v-btn>
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