<template>
  <v-chart
    :class="classState"
    :option="chartOptions"
    :update-options="{ notMerge: false }"
    autoresize
    :manual-update="manualUpdate"
  />
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import { Redis } from "../Redis.js";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  DatasetComponent,
  GridComponent,
  ToolboxComponent,
  DataZoomComponent
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
  ToolboxComponent,
  DataZoomComponent]);
export default {
  name: "TimeSeriesGraph",
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
        timeSeries: "sma:2100466612:voltage_dc_2",
        filter: [{label:"",value:1}],
      }),
    },
  },
  data() {
    return {
      value: 0,
      classState: "m-0 p-0 alive",
      manualUpdate: true,
      ts:[],
      Redis
    };
  },
  watch: {
    config: function (newConfig, oldConfig) {
      console.log(
        this.name + "watch config newVal:" + newConfig + " oldVal:" + oldConfig
      );

      this.chart.setOption(this.chartOptions);
    },
  },
  mounted() {
    console.log("TimeSeriesGraph mounted ", this.config.topic);
  //  Redis.request(["TS.RANGE",this.timeSeries,"-","+"]).resolve((s)=> console.log(s))
    let base = +new Date(1988, 9, 3);
    let oneDay = 24 * 3600 * 1000;
    this.ts = [[base, Math.random() * 300]];
    for (let i = 1; i < 20000; i++) {
      let now = new Date((base += oneDay));
      this.ts.push([
        +now,
        Math.round((Math.random() - 0.5) * 20 + this.ts[i - 1][1]),
      ]);
    }
    this.chart = this.$children[0].chart;
  },
  unmounted() {
    this.chart.dispose();
  },
  methods: {
    onMessage(topic, value) {
      this.value = value.toFixed(2);
      this.classState = "m-0 p-0 alive";
      console.log(topic, value);
      this.ts.push({ name: topic, value: [new Date(), this.value] });
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
      return {
        tooltip: {
          trigger: "axis",
          position: function (pt) {
            return [pt[0], "10%"];
          },
        },
        title: {
          left: "center",
          text: "Large Ara Chart",
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: "none",
            },
            restore: {},
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "time",
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "100%"],
        },
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 20,
          },
          {
            start: 0,
            end: 20,
          },
        ],
        series: [
          {
            name: "Fake Data",
            type: "line",
            smooth: true,
            symbol: "none",
            areaStyle: {},
            data: this.ts,
          },
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