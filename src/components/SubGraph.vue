<template>
  <v-chart :class="classState" :option="chartOptions" :update-options="{ notMerge: false }" autoresize
    :manual-update="manualUpdate" />
</template>

<script>
import { Sub } from "../Sub.js";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  DatasetComponent,
  GridComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  DatasetComponent,
  GridComponent,
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
      value: 0,
      classState: "m-0 p-0 dead",
      manualUpdate: true,
      returnedTopics: [],
      arrayOfTs: [],
    };
  },
  watch: {
    config: function (newConfig, oldConfig) {
      console.log(
        this.name + "watch topic newVal:" + newConfig + " oldVal:" + oldConfig
      );
      this.sub.unsubscribe(oldConfig.topic, this.onMessage);
      this.sub.subscribe(newConfig.topic, this.onMessage);
      this.chart.setOption(this.chartOptions);
      this.ts = [];
      this.arrayOfTs = [];
    },
  },
  mounted() {
    console.log("SubGraph mounted ", this.config.topic);
    this.sub = new Sub(this.config.topic, this.config.timeout, this.onMessage, this.onTimeout);
    this.chart = this.$children[0].chart;
    this.ts = [];
  },
  unmounted() {
    this.sub.stop();
    this.chart.dispose();
  },
  methods: {
    onMessage(topic, value) {
      if ( !this.returnedTopics.includes(topic) ) { // only add new topics
        console.log(" topic not found yet. ", topic )
        this.returnedTopics.push(topic);
        let idx = this.returnedTopics.indexOf(topic);
        this.arrayOfTs[idx] = [];
        let series=[];
        this.returnedTopics.forEach(t => {
          series.push({
            name: t,
            animation: false,
            type: "line",
            data: this.arrayOfTs[idx],
            dimensions: [
              { name: "timestamp", type: "time" },
              { name: "sensor1", type: "float" },
            ],
          });
        });
        this.chart.setOption({ series: series}, false, true);
      }
            let idx = this.returnedTopics.indexOf(topic);

      this.value = value.toFixed(2);
      this.sub.resetTimer();
      this.classState = "m-0 p-0 alive";
      this.arrayOfTs[idx].push({ name: topic, value: [new Date(), this.value] });
      if (this.arrayOfTs[idx].length > 100) {
        this.arrayOfTs[idx].shift();
      }

      let datas = [];
      for(let i=0; i<this.arrayOfTs.length; i++) {
        datas.push({data:this.arrayOfTs[i]});
      }
      // updata values only for the current topic
      this.chart.setOption({ series: datas }, false, true);
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
          text: this.config.topic,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
          valueFormatter: (value) => {
            return value + " " + this.config.unit;
          },
        },
        xAxis: {
          type: "time",
        },
        yAxis: { type: "value" },
        series: [
        ],
      };
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