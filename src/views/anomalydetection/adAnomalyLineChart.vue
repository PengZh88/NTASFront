<template>
  <div :class="className" :style="{height: height, width: width, margin: auto}" :title="titleName" />
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'AdAnomalyLineChart',
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '75vw'
    },
    height: {
      type: String,
      default: '220px'
    },
    chartData: {
      type: Object,
      required: true
    },
    titleName: {
      type: String,
      default: '异常检测结果'
    },
    dataName: {
      type: String,
      default: '流量值'
    },
    chartColor: {
      type: String,
      default: '#40c9c6'
    },
    dataWeight: {
      type: String,
      default: ''
    },
    areaColor: {
      type: String,
      default: '#a4e0f7'
    },
    anomalyMap: {
      type: Object,
      default() {
        return {}
      }
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
        tooltip: {
          trigger: 'axis',
          position: function(pt) {
            return [pt[0], '10%']
          }
        },
        title: {
          text: that.titleName
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: that.chartData.xdata
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%']
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            start: 0,
            end: 100
          }
        ],
        visualMap: that.anomalyMap,
        series: [
          {
            name: that.dataName,
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            areaStyle: {},
            lineStyle: {
              color: 'green',
              width: 2
            },
            data: that.chartData.ydata
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
      deep: true // 对象内部树形的监听，关键。
    }
  },
  mounted() {
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
