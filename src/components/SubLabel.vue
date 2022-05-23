<template>
  <div :class="classState">{{ label }} : {{ value }} {{ unit }}</div>
</template>

<script>
import { Redis, Eventbus, Timer } from "../Redis.js";
export default {
  name: "SubLabel",
  props: {
    label: {
      type: String,
      default: "LABEL",
    },
    topic: {
      type: String,
      default: "VALUE",
    },
    unit: {
      type: String,
      default: "UNIT",
    },
  },
  data() {
    return {
      count: 0,
      value: 0,
      classState:'alive',
      timer:Timer.create(() => { this.classState="dead" } , 2000),
      Redis,Eventbus,Timer
    };
  },
  mounted() {
    console.log("SubLabel label:" + this.label + " topic " + this.topic);
    Redis.subscribe(this.topic, this.update);
  },
  methods: {
    update(topic, message) {
  //    console.log("SubLabel.update topic:" + topic + " message:" + message);
      this.count++;
      this.value = message;
      this.timer.reset()
      this.classState = 'alive';
    },
  },
  computed : {
    
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