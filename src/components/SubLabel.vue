<template>
  <div :class="classState">{{ label }} : {{ value }} {{ unit }}</div>
</template>

<script>
import { Redis, Eventbus, Timer } from "../Redis.js";
import { Sub } from "../Sub.js";
export default {
  name: "SubLabel",
  props: {
    label: {
      type: String,
      default: "Shaker2",
    },
    topic: {
      type: String,
      default: "dst/shaker2/shake/trigger",
    },
    unit: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      count: 0,
      value: 0,
      classState: "m-0 p-0 text-center dead",
      Redis,
      Eventbus,
      Timer,
    };
  },
  mounted() {
    this.sub = new Sub(this.topic, 60000, this.onMessage, this.onTimeout);
    console.log("SubLabel label:" + this.label + " topic " + this.topic);
  },
  unmounted() {
    this.sub.unsubscribe(this.pattern, this.onMessage);
    this.chart.dispose();
  },
  watch: {
    topic: function (newVal, oldVal) {
      console.log("SubLabel.watch topic:" + newVal + " oldVal:" + oldVal);
      this.sub.unsubscribe(oldVal, this.onMessage);
      this.sub.subscribe(newVal, this.onMessage);
    },
  },
  methods: {
    onMessage(topic, message) {
      //    console.log("SubLabel.update topic:" + topic + " message:" + message);
      this.count++;
      this.value = message.toFixed(2);
      this.sub.resetTimer();
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