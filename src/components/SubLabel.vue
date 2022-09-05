<template>
  <div :key="key" :class="classState">{{ config.label }} : {{ value }} {{ config.unit }}</div>
</template>

<script>
/*jshint esversion: 6 */

import { Redis, Eventbus, Timer,newKey  } from "../Redis.js";
import { Sub } from "../Sub.js";
export default {
  name: "SubLabel",
  props: {
    config: {
      type: Object,
      default: () => ({
        label: "LABELDUMMY",
        topic: "src/device/object/property",
        unit: "SI Unit",
        timeout: 3000,
      }),
    },
  },
  data() {
    return {
      key:newKey(),
      count: 0,
      value: 0,
      classState: "m-0 p-0 text-center dead",
      Redis,
      Eventbus,
      Timer,
    };
  },
  mounted() {
    this.sub = new Sub(this.config.topic, 60000, this.onMessage, this.onTimeout);
    console.log("SubLabel label:" + this.config.label + " topic " + this.config.topic);
  },
  unmounted() {
    this.sub.unsubscribe(this.config.topic, this.onMessage);
    this.chart.dispose();
  },
  watch: {
    config: function (newConfig, oldConfig) {
      console.log(
        this.name + "watch topic newVal:" + newConfig + " oldVal:" + oldConfig
      );
      this.key = newKey();
      this.sub.unsubscribe(oldConfig.topic, this.onMessage);
      this.sub.subscribe(newConfig.topic, this.onMessage);
    },
  },
  methods: {
    onMessage(topic, message) {
      //    console.log("SubLabel.update topic:" + topic + " message:" + message);
      this.count++;
      this.value = message;
      this.classState = "m-0 p-0 text-center alive";
    },
    onTimeout() {
      this.classState = "m-0 p-0 text-center dead";
    },
  },
  computed: {},
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