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
  CanvasRenderer, SVGRenderer,
  GaugeChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);
export default {
  name: "SubAngle",
  components: {
    VChart,
  },
  provide: {
    [THEME_KEY]: "light",
  },
  props: {
    label: {
      type: String,
      default: "LABEL",
    },
    topic: {
      type: String,
      default: "VALUE",
    },
    unit: {
      type: String,
      default: "UNIT",
    },
  },
  data() {
    return {
      classState: "alive",
      manualUpdate: true,
      alive:false,

    };
  },
  mounted() {
    this.sub = new Sub(this.topic, 2000, this.onMessage, this.onTimeout);
    console.log("SubAngle label:" + this.label + " topic " + this.topic);
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
      if ( !this.alive ) {
        this.alive = true;
        this.classState = "alive";
      } 
      this.chart.setOption({ series: [{ data: [{ value: this.value, name: this.label }] }] }, false, true);
    },
    onTimeout() {
      if ( this.alive ) {
        this.alive = false;
        this.classState = "m-0 p-0 dead";
      }
    },
  },
  computed: {
    chartOptions() {
      console.log("SubAngle.chartOptions");
      return {
        manualUpdate: false,
        zlevel: 0,
        title: {
          text: this.topic,
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            type: "gauge",
            min: -180,
            max: 180,
            startAngle: 270,
            endAngle: -90,
            radius: "80%",
            progress: {
              show: false,
            },
            detail: {
              valueAnimation: true,
              formatter: "{value}",
            },
            data: [
              {
                value: this.value,
                name: this.label,
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