<template>
  <v-chart :class="classState" :option="chartOptions" :update-options="{ notMerge: false }" autoresize
    :manual-update="manualUpdate" />
</template>

<script>
import { Redis, Eventbus, Timer } from "../Redis.js";
import { Sub } from "../Sub.js";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  DatasetComponent,
  GridComponent
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  DatasetComponent,
  GridComponent
]);
export default {
  name: "SubGraph",
  components: {
    VChart,
  },
  provide: {
    [THEME_KEY]: "light",
  },
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
//      ts: [],
      Redis,
      Eventbus,
      Timer,
    };
  },
  mounted() {
    this.sub = new Sub(this.topic, 1000, this.onMessage, this.onTimeout);
    console.log("SubGraph label:" + this.label + " topic " + this.topic);
    this.chart = this.$children[0].chart;
    this.ts = [];
  },
  unmounted() {
    this.sub.stop();
    this.chart.dispose();
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
      this.chart.setOption({ series: [{ data: this.ts }] }, false, true);
    },
    onTimeout() {
      this.classState = "m-0 p-0 dead";
    },
  },
  computed: {
    chartOptions() {
      console.log("SubGraph.chartOptions");
      return {
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
      }
    }
  }
}

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