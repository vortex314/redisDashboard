<template>
  <v-card class="d-flex fill-height justify-center outlined align-center">
    <v-slider v-model="sliderValue" hint="Im a hint" :max="config.maxDstValue" :min="config.minDstValue"
      :step="config.stepDstValue" :label="config.label" thumb-label="always"></v-slider>
  </v-card>
</template>

<script>
import { Redis } from "@/Redis.js";
export default {
  name: 'PubSlider',
  props: {
    config: {
      type: Object,
      default: () => ({
        label: "SLIDER",
        dstTopic: "dst/device/object/prop",
        minDstValue: 0,
        maxDstValue: 100,
        stepDstValue: 1,
        startDstValue: 0,
        timeout: 3000,
      }),
    },
  },
  data() {
    return {
      sliderValue: this.config.startDstValue,
    };
  },
  watch: {
    config: function (newVal, oldVal) {
      console.log(this.config, newVal, oldVal);
    },
    sliderValue: function (newVal, oldVal) {
      console.log(this.config, newVal, oldVal);
      Redis.publish(this.config.dstTopic, newVal);
    },
  },
  methods: {
  },
};
</script>

<style>
</style>