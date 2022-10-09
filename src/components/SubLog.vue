<template>
  <div class="table-wrapper">
    <table width="100%">
      <tr>
        <th>Time</th>
        <th>Log</th>
      </tr>
      <tr v-for="log in logs.slice().reverse()" :key="log.id">
        <td>{{ log.time }}</td>
        <td>{{ log.line }}</td>
      </tr>
    </table>
  </div>
</template>
<script>
/*jshint esversion: 6 */
class RedisLog {
  constructor(line) {
    this.line = line;
    this.time = new Date().toLocaleTimeString();
  }
}

import { Redis, Eventbus, Timer, newKey } from "../Redis.js";
import { Sub } from "../Sub.js";
export default {
  name: "SubLabel",
  props: {
    config: {
      type: Object,
      default: () => ({
        topic: "src/device/object/property",
        style:
          "font-size:17px;background-color:black;color:green;text-align:center;line-height:1",
        timeout: 3000,
        lineCount: 100,
      }),
    },
  },
  data() {
    return {
      key: newKey(),
      value: "\n====================\n",
      classState: "m-0 p-0 text-center dead",
      logs: [],
      Redis,
      Eventbus,
      Timer,
    };
  },
  mounted() {
    this.sub = new Sub(
      this.config.topic,
      60000,
      this.onMessage,
      this.onTimeout
    );
    console.log(
      "SubLabel label:" + this.config.label + " topic " + this.config.topic
    );
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
      this.logs.push(new RedisLog(message));
      if (this.logs.length > this.config.lineCount) {
        this.logs.shift();
      }
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
.table-wrapper {
  border: 1px solid black;
  overflow: auto;
}

table {
  border: 1px solid black;
}

td {
  background-color: #ccc;
  margin-left: 10px;
}
</style>