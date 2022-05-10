<template>
  <div :class="className" :style="{height: height, width: width}" :title="titleName" />
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'MongoBarChart',
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
    },
    titleName: {
      type: String,
      default: '柱形图'
    },
    chartColor: {
      type: String,
      default: '#40c9c6'
    },
    dataWeight: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      chart: null
    }
  },
  computed: {
    options() {
      const that = this
      const option = {
        title: {
          text: that.titleName
        },
        color: that.chartColor,
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: that.chartData.xaxisdata,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: that.dataWeight
          }
        ],
        series: [
          {
            type: 'bar',
            barWidth: '60%',
            data: that.chartData.datasview
          }
        ]
      }
      return option
    }
  },
  watch: {
    options: {
      handler(newVal, oldVal) {
        if (this.chart) {
          if (newVal) {
            this.chart.setOption(newVal)
          } else {
            this.chart.setOption(oldVal)
          }
        } else {
          this.initChart()
        }
      },
      deep: true // 对象内部属性的监听，关键。
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
      this.chart.setOption(this.options)
    }
  }
}
</script>

<style scoped>

</style>
