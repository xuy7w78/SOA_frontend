<template>
  <div ref="chart" style="width: 100%; height: 100%;" class="chart"></div>
</template>

<script>
import * as echarts from 'echarts';


export default {
  props: ['data'],
  mounted() {
    
    this.chart = echarts.init(this.$refs.chart);
    // this.chart.setOption({
    //   radar: {
    //     indicator: this.data.map(item => ({ name: item.axis, max: 1 }))
    //   },
    //   series: [{
    //     type: 'radar',
    //     data: [this.data.map(item => item.value)],
    //   }]
    // });
    
  },
  watch: {
    data(newData) {

      this.chart.setOption({
        radar: {
          indicator: newData.map(item => ({ name: item.axis, max: 10 }))
        },
        series: [{
          type: 'radar',
          data: [newData.map(item => item.value)],
        }]
      });
    }
  }
};
</script>

