<template>
  <v-chart :class="classState" :option="chartOptions" :update-options="{ notMerge: false }" autoresize
    :manual-update="manualUpdate" />
</template>

<script>
import { Sub } from "../Sub.js";
import { use } from "echarts/core";
import { CanvasRenderer, SVGRenderer } from "echarts/renderers";
import { GaugeChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
use([
  CanvasRenderer,
  SVGRenderer,
  GaugeChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);
export default {
  name: "SubGauge",
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
        label: "LABEL",
        topic: "TOPIC",
        unit: "UNIT",
        min:0,
        max:100,
        steps:10,
        timeout: 3000,
      }),
    },
  },
  data() {
    return {
      classState: "alive",
      manualUpdate: false,
      alive: false,
      
    };
  },
  watch: {
    config: {
      handler(newConfig, oldConfig) {
        console.log(
          this.name + "watch topic newVal:" + newConfig + " oldVal:" + oldConfig
        );
        this.sub.unsubscribe(oldConfig.topic, this.onMessage);
        this.sub.subscribe(newConfig.topic, this.onMessage);
        this.chart.setOption(this.chartOptions);
      },
      deep: true
      //      this.ts = [];
    },
  },
  mounted() {
    this.sub = new Sub(this.config.topic, this.config.timeout, this.onMessage, this.onTimeout);
    console.log("SubAngle label:" + this.config.label + " topic " + this.config.topic);
    this.chart = this.$children[0].chart;
    this.value = 0;
  },
  unmounted() {
    this.sub.stop();
    this.chart.dispose();
  },
  methods: {
    onMessage(topic, message) {
      this.value = message.toFixed(2);
      this.sub.resetTimer();
      if (!this.alive) {
        this.alive = true;
        this.classState = "alive";
      }
      this.chart.setOption(
        { series: [{ data: [{ value: this.value, name: this.config.label }] }] },
        false,
        true
      );
    },
    onTimeout() {
      if (this.alive) {
        this.alive = false;
        this.classState = "m-0 p-0 dead";
      }
    },
  },
  computed: {
    chartOptions() {
      return {
        manualUpdate: false,
        zlevel: 0,
        title: {
          text: this.config.label,
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c}",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            type: "gauge",
            min: this.config.min,
            max: this.config.max,
            startAngle: 250,
            endAngle: -70,
            splitNumber: this.config.steps,
            radius: "80%",
            progress: {
              show: true,
            },
            detail: {
              valueAnimation: false,
              fontSize: 40,
               offsetCenter: [0, '50%'],
              formatter: "{value}"+this.config.unit,
            },
            data: [
              {
                value: this.value,
                name: this.config.label,
              },
            ],
          },
        ],
      }
    }
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