<template>
  <div style="width: 100%;height:100%;"></div>
</template>

<script>
import { Redis, Eventbus, Timer } from "../Redis.js";
import * as echarts from "echarts";
import { Sub } from "../Sub.js";

export default {
  name: "SubGraph2",

  props: {
    label: {
      type: String,
      default: "LABEL-TBD",
    },
    topic: {
      type: String,
      default: "VALUE-TBD",
    },
    unit: {
      type: String,
      default: "UNIT-TBD",
    },
  },
  data() {
    return {
      value: 0,
      classState: "m-0 p-0 dead",
      manualUpdate: true,
      ts: [],
      Redis,
      Eventbus,
      Timer,
      chart: {},
    };
  },
  mounted() {
    this.sub = new Sub(this.topic, 2000, this.onMessage, this.onTimeout);
    console.log("SubGraph2 label:" + this.label + " topic " + this.topic,this);
    this.chart = echarts.init(this.$el, "dark");
    this.$parent.onresize = ()=> {
      console.log("SubGraph2.onresize");
      this.chart.resize();
    }
    var chartOptions = {
      title: {
        text: this.topic,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985",
          },
        },
      },
      xAxis: {
        type: "time",
      },
      yAxis: { type: "value" },
      series: [
        {
          name: this.label,
          animation: false,
          type: "line",
          data: this.ts,
          dimensions: [
            { name: "timestamp", type: "time" },
            { name: "sensor1", type: "float" },
          ],
        },
      ],
    };
    this.chart.setOption(chartOptions);
  },

  methods: {
    onMessage(topic, value) {
      this.value = value.toFixed(2);
      this.sub.resetTimer();
      this.classState = "m-0 p-0 alive";
      this.ts.push({ name: "serie11", value: [new Date(), this.value] });
      if (this.ts.length > 100) {
        this.ts.shift();
      }
      this.chart.setOption({ series: [{ data: this.ts }] });
    },
    onTimeout() {
      this.classState = "m-0 p-0 dead";
    },
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