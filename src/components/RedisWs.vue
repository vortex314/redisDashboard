<template>
  <div>
    <b-btn :variant="colorPrimary" v-on:click="Redis.connect()">Connect</b-btn>
    <b-btn variant="warning" v-on:click="Redis.disconnect()">{{
      colorPrimary
    }}</b-btn>
    <b-btn variant="danger" v-on:click="Redis.send(['PSUBSCRIBE', '*'])"
      >Send</b-btn
    >
    <b-btn variant="danger" v-on:click="update()"
      >Update</b-btn
    >
  </div>
</template>

<script>
import { Redis } from "../redis.js";
import { Timer } from "../timer.js";
export default {
  name: "RedisWs",
  data() {
    return { Redis, Timer, colorPrimary: "primary", timer:{}, count: 0 };
  },
  props: {},
  created() {
    this.timer = Timer.create(this.paused, 1000);
  },
  methods: {
    awakeMe() {
      this.count++;
      if (this.count > 10) {
        console.log("sleep");
        Timer.delete(this.timer);
        return;
      }
      console.log("awakeMe");
      if (this.colorPrimary == "primary") {
        this.colorPrimary = "success";
      } else {
        this.colorPrimary = "primary";
      }
    },
    update() {
      this.resumed()
    },
    paused() {

    },
    resumed(){
      this.timer.reset();
    }
  },
};
</script>
