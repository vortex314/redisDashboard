<template>
  <v-data-table disable-pagination :headers="headers" :items="kv" :items-per-page="5" class="elevation-1" :key="key">
  </v-data-table>
</template>

<script>
import { Sub } from "../Sub.js";
import _ from "lodash";
export default {
  name: "SubTable",
  props: {
    config: {
      type: Object,
      default: () => ({
        label: "LABELDUMMY",
        topic: "TOPICDUMMY",
        unit: "UNITDUMMY",
        timeout: 3000,
      }),
    },
  },
  data() {
    return {
      count: 0,
      key: 0,
      headers: [
        { text: "Topic", value: "topic", class: "blue lighten-5" },
        { text: "Value", value: "value", class: "blue lighten-5" },
        { text: "Date", value: "date", class: "blue lighten-5" },
        { text: "Count", value: "count", class: "blue lighten-5" }
      ],
      kv: [],
      classState: 'm-0 p-0 text-center dead',
    };
  },
  mounted() {
    this.sub = new Sub(this.config.topic, 1000, this.onMessage, this.onTimeout);
    console.log("SubTable  pattern " + this.pattern);
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
      this.sub.unsubscribe(oldConfig.topic, this.onMessage);
      this.sub.subscribe(newConfig.topic, this.onMessage);
    },
  },
  methods: {
    onMessage(topic, message) {
      //    console.log("SubLabel.update topic:" + topic + " message:" + message);
      this.count++;
      var v = JSON.stringify(message)
      var idx = _.findIndex(this.kv, (kvp) => { return kvp.topic == topic });
      //      console.log("SubTable.onMessage idx:" + idx + " topic:" + topic + " message:" + v+" length " + this.kv.length);
      var ts = new Date().toTimeString().split(' ')[0]
      if (idx < 0) {
        this.kv.push({ topic: topic, value: v, date: ts, count: 1 });
      } else {
        var count = this.kv[idx].count+1
        this.kv.splice(idx, 1, { topic: topic, value: v, date: ts, count: count});
        //  this.kv[idx]={topic:topic,value :v}; // doesn't work to update Array in vue notifications
      }
      this.sub.resetTimer()
      this.classState = 'm-0 p-0 text-center alive';
    },
    onTimeout() {
      this.classState = 'm-0 p-0 text-center dead';
    },
  },
  computed: {

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