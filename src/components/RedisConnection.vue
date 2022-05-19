<template>
  <div>
    <b-container
      style="background-color: rgba(127, 127, 127, 0.5)"
      class="m-0 border-primary"
      ><b-row class="m-0 p-0"
        ><b-col class="m-0 p-0">AA</b-col
        ><b-col class="w-25 p-0 mb-0 bg-secondary text-light">AA</b-col></b-row
      ></b-container
    >
    <b-btn variant="primary" v-on:click="resumed">Connect</b-btn>
    <b-btn variant="warning" v-on:click="Redis.disconnect()">Disconnect</b-btn>
    <b-btn variant="danger" v-on:click="Redis.send(['PSUBSCRIBE', '*'])"
      >Send</b-btn
    >
    <b-btn :variant="colorPrimary" v-on:click="update()">Update</b-btn>
  </div>
</template>

<script>
import { Redis } from "../redis.js";
import { Timer } from "../timer.js";
export default {
  name: "RedisConnection",
  data() {
    return {
      count: 0,
    };
  },
  methods: {
    update() {
      Redis.connect();
      Redis.disconnect();
      this.timer = Timer.create(this.expired, 5000);
      Redis.subscribe(this.update, "src/hover/system/loopback");
      setInterval(this.update, 7000, "XXXX");
    },
  },
};
</script>

<style>
</style>