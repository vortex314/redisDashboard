<template>
  <div>
    <b-btn variant="primary" v-on:click="Redis.connect()">Connect</b-btn>
    <b-btn variant="warning" v-on:click="Redis.disconnect()">Disconnect</b-btn>
    <b-btn variant="danger" v-on:click="Redis.send(['PSUBSCRIBE','*'])">Send</b-btn>
  </div>
</template>

<script>
import { Redis } from "../redis.js";
export default {
  name: "RedisWs",
  data() {
    return {Redis};
  },
  props: {},
};
</script>
