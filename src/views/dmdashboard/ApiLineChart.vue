<template>
  <div :class="className" :style="{height: height, width: width}" />
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'ApiLineChart',
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '240px'
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted: function() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart: function() {
      this.chart = echarts.init(this.$el)
      this.setOptions(this.chartData)
    },
    setOptions(obj) {
      this.chart.setOption({
        title: {
          text: '接口执行历史统计'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['成功数', '失败数']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '成功数',
            type: 'line',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '失败数',
            type: 'line',
            data: [220, 182, 191, 234, 290, 330, 310]
          }
        ]
      })
    }
  }
}
</script>

<style scoped>

</style>
