<template>
  <div>{{ label }} : {{ value }}</div>
</template>

<script>
import { Redis, Eventbus, Timer } from "../Redis.js";
export default {
  name: "SubLabel",
  props: {
    label: {
      type: String,
      default: "",
    },
    topic: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      count: 0,
      value: 0,
      Redis,
      Eventbus,
      Timer,
    };
  },
  mounted() {
    console.log("SubLabel label:" + this.label + " topic " + this.topic);
    Redis.subscribe(this.topic, this.update);
  },
  methods: {
    update(topic, message) {
        console.log("SubLabel.update topic:" + topic + " message:" + message);
      this.count++;
      this.value = message;
    },
  },
};
</script>

<style>
</style>