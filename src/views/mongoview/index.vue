<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>IPV6原始流量库</span>
      </div>
      <el-row>
        <el-col :span="8">
          <el-table :data="oriDataView" border style="width: 100%">
            <el-table-column
              prop="label"
              label="Database 属性"
              width="180"
            />
            <el-table-column
              prop="value"
              label="数值"
            />
          </el-table>
        </el-col>
        <el-col :span="16">
          <mongo-bar-chart :chart-data="oriBarChartData" :title-name="oriBarTitle" :data-weight="dw1" />
          <el-divider />
          <mongo-bar-chart :chart-data="oriBarChartData2" :title-name="oriBarTitle2" :chart-color="color2" :data-weight="dw2" />
        </el-col>
      </el-row>
    </el-card>
    <el-divider />
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>IPV6流量预处理库</span>
      </div>
      <el-row>
        <el-col :span="8">
          <el-table :data="prepDataView" border style="width: 100%">
            <el-table-column
              prop="label"
              label="Database 属性"
              width="180"
            />
            <el-table-column
              prop="value"
              label="数值"
            />
          </el-table>
        </el-col>
        <el-col :span="16">
          <mongo-bar-chart :chart-data="prepChartData" :title-name="prepBarTitle" :data-weight="dw1" />
          <el-divider />
          <mongo-bar-chart :chart-data="prepChartData2" :title-name="prepBarTitle2" :chart-color="color2" :data-weight="dw3" />
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>

import { getMongodbInfo } from '@/api/ntsMongodb.js'
import MongoBarChart from './mongoBarChart'

export default {
  name: 'MvIndex',
  components: { MongoBarChart },
  data() {
    return {
      oriDataView: [],
      prepDataView: [],
      oriBarChartData: {},
      prepChartData: {},
      oriBarTitle: 'IPV6原始流量条目数',
      prepBarTitle: 'IPV6预处理流量条目数',
      color2: '#ffb549',
      oriBarChartData2: {},
      prepChartData2: {},
      oriBarTitle2: 'IPV6原始流量存储空间',
      prepBarTitle2: 'IPV6预处理流量存储空间',
      dw1: '条',
      dw2: 'GB',
      dw3: 'KB'
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getMdbInfo()
    })
  },
  methods: {
    getMdbInfo: function() {
      getMongodbInfo().then(res => {
        this.oriDataView = res.dbori
        this.prepDataView = res.dbprep
        this.prepChartData = {
          'xaxisdata': res.prepxaxis,
          'datasview': res.prepcountds
        }
        this.oriBarChartData = {
          'xaxisdata': res.orixaxis,
          'datasview': res.oricountds
        }
        this.prepChartData2 = {
          'xaxisdata': res.prepxaxis,
          'datasview': res.prepssds
        }
        this.oriBarChartData2 = {
          'xaxisdata': res.orixaxis,
          'datasview': res.orissds
        }
      }).catch(() => {
      })
    }
  }
}
</script>

<style scoped>

</style>
