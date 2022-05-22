<template>
  <div>
    <b-btn class="w-25" v-if="Redis.connected" variant="success"
      >CONNECTED</b-btn
    >
    <b-btn class="w-25" v-if="!Redis.connected" variant="danger"
      >DISCONNECTED</b-btn
    >

    <b-btn variant="primary" v-on:click="Redis.connect()">Connect</b-btn>
    <b-btn variant="primary" v-on:click="Redis.disconnect()">Disconnect</b-btn>
    <b-btn variant="success" v-on:click="saveGrid">
      <b-icon icon="cloud-upload" aria-hidden="true"></b-icon>
    </b-btn>
    <b-btn variant="success" v-on:click="loadGrid"
      ><b-icon icon="folder" aria-hidden="true"
    /></b-btn>
  </div>
</template>

<script>
import { Redis, Eventbus } from "../Redis.js";
import { Timer } from "../Timer.js";
export default {
  name: "RedisConnection",
  props: {
    host: {
      type: String,
      default: "limero.ddns.net",
    },
    port: {
      type: Number,
      default: 9000,
    },
    path: {
      type: String,
      default: "/redis",
    },
  },
  data() {
    return {
      count: 0,
      Redis,
    };
  },
  mounted() {
    console.log("RedisConnection host:" + this.host + " port " + this.port);
  },
  methods: {
    update() {
      Redis.connect();
      Redis.disconnect();
      this.timer = Timer.create(this.expired, 5000);
      Redis.subscribe(this.update, "src/hover/system/loopback");
      setInterval(this.update, 7000, "XXXX");
    },
    resumed() {},
    saveGrid() {
      console.log("emitting ");
      Eventbus.$emit("Grid", "save");
    },
    loadGrid() {
      Eventbus.$emit("Grid", "load");
    },
  },
};
</script>

<style>
</style>