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
      Redis,Eventbus,Timer
    };
  },
  mounted() {
    this.sub =  new Sub(this.topic, 1000, this.onMessage,this.onTimeout );
    console.log("SubLabel label:" + this.label + " topic " + this.topic);
  },
  methods: {
    onMessage(topic, message) {
  //    console.log("SubLabel.update topic:" + topic + " message:" + message);
      this.count++;
      this.value = message;
      this.timer.reset()
      this.classState = 'alive';
    },
    onTimeout() {
      this.classState = 'dead';
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