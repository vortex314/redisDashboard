<template>
  <v-data-table disable-pagination :headers="headers" :items="kv" :items-per-page="5" class="elevation-1" :key="key"></v-data-table>
</template>

<script>
import { Sub } from "../Sub.js";
import _ from "lodash";
export default {
  name: "SubTable",
  props: {
    pattern: {
      type: String,
      default: "src/*",
    },
  },
  data() {
    return {
      count: 0,
      key:0,
      headers: [{text:"Topic",value:"topic",class:"blue lighten-5"},{text:"Value",value:"value",class:"blue lighten-5"}],
      kv:[],
      classState:'m-0 p-0 text-center dead',
    };
  },
  mounted() {
    this.sub =  new Sub(this.pattern, 1000, this.onMessage,this.onTimeout );
    console.log("SubTable  pattern " + this.pattern);
  },
  unmounted() {
    this.sub.unsubscribe(this.pattern,this.onMessage);
    this.chart.dispose();
  },
  watch : {
    '$props':function(oldVal,newVal){
      console.log("SubTable.props changed from " + oldVal + " to " + newVal);
      console.log("SubTable.watch props");

    },
    pattern: function(newVal,oldVal) {
      this.key = Math.round(Math.random() * 1000)
      console.log("SubTable.pattern changed from " + oldVal + " to " + newVal);
   /*   this.sub.unsubscribe(oldVal,this.onMessage);
      this.kv=[];
      this.sub.subscribe(newVal,this.onMessage);*/
    }
  },
  methods: {
    onMessage(topic, message) {
  //    console.log("SubLabel.update topic:" + topic + " message:" + message);
      this.count++;
      var v = JSON.stringify(message)
      var idx = _.findIndex(this.kv, (kvp) => { return kvp.topic == topic });
//      console.log("SubTable.onMessage idx:" + idx + " topic:" + topic + " message:" + v+" length " + this.kv.length);
      if ( idx <0 ) {
        this.kv.push({topic:topic,value:v});
      } else {
        this.kv.splice(idx,1,{topic:topic,value:v});
      //  this.kv[idx]={topic:topic,value :v}; // doesn't work to update Array in vue notifications
      }
      this.sub.resetTimer()
      this.classState = 'm-0 p-0 text-center alive';
    },
    onTimeout() {
      this.classState = 'm-0 p-0 text-center dead';
    },
  },
  computed : {
    
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