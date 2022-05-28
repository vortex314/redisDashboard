<template>
  <v-chart class="chart" :option="chartOptions" autoresize/>
</template>

<script>
import { Redis, Eventbus, Timer } from "../Redis.js";
import { Sub } from "../Sub.js";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart, GaugeChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
use([
  CanvasRenderer,
  PieChart,
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
    [THEME_KEY]: "dark",
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
      count: 0,
      value: 0,
      classState: "alive",
      Redis,
      Eventbus,
      Timer,
      chartOptions: {
//        width: "100%",
//        height: "100%",
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
              show: true,
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
      },
    };
  },
  mounted() {
    this.sub = new Sub(this.topic, 1000, this.onMessage, this.onTimeout);
    console.log("SubLabel label:" + this.label + " topic " + this.topic);
    this.chart =  this.$children[0].chart;
  },
  methods: {
    onMessage(topic, message) {
      //    console.log("SubLabel.update topic:" + topic + " message:" + message);
      this.count++;
      this.value = message;
      this.sub.reset(); 
      this.classState = "m-0 p-0 alive";
      this.chart.setOption({series:[{type:"gauge",data:[{value:message,name:this.label}]}]});
    },
    onTimeout() {
      this.classState = "m-0 p-0 dead";
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
</style>