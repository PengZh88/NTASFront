<template>
  <div>
    <el-tabs type="border-card" :tab-position="tabPosition">
      <el-tab-pane label="任务信息">
        <el-row>
          <el-col :span="4"><div>任务名称</div></el-col>
          <el-col :span="20"><div>{{ taskData.taskName }}</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div>关联设备</div></el-col>
          <el-col :span="20"><div>{{ tabDeviceView(taskData.deviceId) }}</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div>网络协议</div></el-col>
          <el-col :span="20"><div>{{ taskData.ntsProtocol }}</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div>流量起始时间</div></el-col>
          <el-col :span="20"><div>{{ parseTime(taskData.ntsStart) }}</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div>流量结束时间</div></el-col>
          <el-col :span="20"><div>{{ parseTime(taskData.ntsEnd) }}</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div>异常检测算法</div></el-col>
          <el-col :span="20"><div><el-button type="success" size="mini" @click="handleViewAlg(taskData.algorithmId)">{{ tabAlgView(taskData.algorithmId) }}</el-button></div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div>分析维度</div></el-col>
          <el-col :span="20"><div><el-tag>{{ dict.label.ana_dimension_type[taskData.anaDimension] }}</el-tag></div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div>精细粒度</div></el-col>
          <el-col :span="20"><div><el-tag type="warning">{{ dict.label.fine_grained_type[taskData.fineGrained] }}</el-tag></div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div>窗口大小</div></el-col>
          <el-col :span="20"><div>{{ taskData.windowSize }}</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div>步长</div></el-col>
          <el-col :span="20"><div>{{ taskData.stepSize }}</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div>任务状态</div></el-col>
          <el-col :span="20"><div><el-tag :type="tsview">{{ taskStatus }}</el-tag></div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div>任务开始时间</div></el-col>
          <el-col :span="20"><div>{{ parseTime(taskData.taskStartTime) }}</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div>任务结束时间</div></el-col>
          <el-col :span="20"><div>{{ parseTime(taskData.taskEndTime) }}</div></el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="算法配置">
        <el-row v-for="ap in algParams" :key="ap.id">
          <el-col :span="4"><div>{{ ap.pmLabel }}</div></el-col>
          <el-col :span="20"><div>{{ ap.pmValue }}</div></el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="检测结果">
        <el-row>
          <el-col :span="24">
            <div width="100%">
              <ad-line-chart :chart-data="oriFlowChartData" :title-name="oriFlowChartTitle" :data-name="oriFlowChartDataName" />
            </div>
          </el-col>
        </el-row>
        <el-divider />
        <el-row>
          <el-col :span="24">
            <div width="100%">
              <ad-line-chart :chart-data="normOriFlowChartData" :title-name="normOriFlowChartTitle" :data-name="normOriFlowChartDataName" area-color="#bce9a6" />
            </div>
          </el-col>
        </el-row>
        <el-divider />
        <el-row>
          <el-col :span="24">
            <div width="100%">
              <ad-anomaly-line-chart :chart-data="anomalyChartData" :title-name="anomalyChartTitle" :data-name="anomalyChartDataName" :anomaly-map="anomalyMap" />
            </div>
          </el-col>
        </el-row>
        <ul>
          <li>原始数据[折线图]</li>
          <li>标准化数据[折线图]</li>
          <li>异常展示[把异常标注出来折线图]</li>
          <li>异常说明</li>
        </ul>
      </el-tab-pane>
    </el-tabs>
    <el-dialog width="700px" title="算法详情" :visible.sync="algVOdialogVisible" :before-close="closeViewAlgDialog" :close-on-click-modal="true">
      <el-row :gutter="20">
        <el-col :span="4">算法名称</el-col>
        <el-col :span="20">{{ algVO.algName }}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4">相关论文</el-col>
        <el-col :span="20">{{ algVO.paperName }}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4">论文类型</el-col>
        <el-col :span="20"><el-tag type="success">{{ dict.label.paper_type[algVO.paperType] }}</el-tag></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4">收录情况</el-col>
        <el-col :span="20"><el-tag>{{ dict.label.includes_status[algVO.paperInclude] }}</el-tag></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4">论文发表年</el-col>
        <el-col :span="20">{{ algVO.paperYear }}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4">期刊（会议）名称</el-col>
        <el-col :span="20">{{ algVO.paperJcname }}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4">论文作者</el-col>
        <el-col :span="20">{{ algVO.paperAuthors }}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4">算法简要描述</el-col>
        <el-col :span="20">{{ algVO.algDesc }}</el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { viewtask } from '@/api/ntsAnomalyDetectionTask'
import { parseTime } from '@/utils/index'
import { getAllAlgorithms } from '@/api/ntsAlgorithm'
import { getAllDevices } from '@/api/ntsDevice'
import { viewTaskAlgParameters, getFlowChartData } from '@/api/ntsAnomalyDetectionTask'
import { viewAlg } from '@/api/ntsAlgorithm'
import AdLineChart from './adLineChart'
import AdAnomalyLineChart from './adAnomalyLineChart'
import { getTaskResults } from '@/api/ntsAnomalyDetectionResults'

export default {
  name: 'AlgPreview',
  components: { AdAnomalyLineChart, AdLineChart },
  dicts: ['fine_grained_type', 'ana_dimension_type', 'paper_type', 'includes_status'],
  data() {
    return {
      tabPosition: 'left',
      taskData: null,
      algorithms: [],
      devices: [],
      algParams: [],
      algVOdialogVisible: false,
      algVO: {
        id: null,
        algName: '',
        algDesc: '',
        paperName: '',
        paperYear: '',
        paperJcname: '',
        paperType: '',
        paperInclude: '',
        paperAuthors: ''
      },
      oriFlowChartData: {},
      oriFlowChartTitle: '原始网络流量',
      oriFlowChartDataName: '流量值',
      normOriFlowChartData: {},
      normOriFlowChartTitle: 'Z-normalization网络流量',
      normOriFlowChartDataName: '标准化值',
      anomalyChartData: {},
      anomalyChartTitle: '异常检测结果',
      anomalyChartDataName: '标准化值',
      anomalyMap: {}
    }
  },
  computed: {
    taskStatus: function() {
      if (this.taskData.startNow === 'Y') {
        return 'Started'
      } else if (this.taskData.startNow === 'N') {
        return 'Not Running'
      } else {
        return 'Unknown Status'
      }
    },
    tsview: function() {
      if (this.taskData.startNow === 'Y') {
        return 'success'
      } else if (this.taskData.startNow === 'N') {
        return 'danger'
      } else {
        return ''
      }
    },
    tabAlgView() {
      return function(algorithmId) {
        if (this.algorithms.length !== 0) {
          for (const x in this.algorithms) {
            if (this.algorithms[x].id === algorithmId) {
              return this.algorithms[x].algName
            }
          }
        }
      }
    },
    tabDeviceView() {
      return function(deviceId) {
        if (this.devices.length !== 0) {
          for (const x in this.devices) {
            if (this.devices[x].id === deviceId) {
              return this.devices[x].devName
            }
          }
        }
      }
    }
  },
  created() {
    const taskId = this.$route.params.id
    viewtask(taskId).then(res => {
      this.taskData = res.tdata
    }).catch(() => {
      this.$router.go(-1)
    })
  },
  mounted() {
    this.loadAlgorithms()
    this.loadDevices()
    this.loadAlgParameters(this.$route.params.id)
    this.$nextTick(() => {
      this.loadFlowChartData(this.$route.params.id)
      this.loadAnomalyChartData(this.$route.params.id)
    })
  },
  methods: {
    parseTime,
    loadAlgorithms: function() {
      getAllAlgorithms().then(res => {
        this.algorithms = res.content
      }).catch(() => {})
    },
    loadDevices: function() {
      getAllDevices().then(res => {
        this.devices = res
      }).catch(() => {})
    },
    loadAlgParameters: function(taskId) {
      viewTaskAlgParameters(taskId).then(res => {
        this.algParams = res.data
      }).catch(() => {})
    },
    handleViewAlg: function(algId) {
      this.algVOdialogVisible = true
      viewAlg(algId).then(res => {
        Object.assign(this.algVO, res)
      }).catch(() => {})
    },
    loadFlowChartData: function(taskId) {
      getFlowChartData(taskId).then(res => {
        let base = ''
        let baseDate = ''
        let oriFlow = ''
        let oriFlowDate = []
        let oriFlowData = []
        let normOriFlow = ''
        let normOriFlowDate = []
        let normOriFlowData = []
        let now = ''
        let oriFlowArrayTmp = []
        let normOriFlowArrayTmp = []
        let fineGrained = ''
        let m = 1
        fineGrained = res.fineGrained
        if (fineGrained === 'H') {
          m = m * 60 * 60 * 1
        } else if (fineGrained === 'M') {
          m = m * 60 * 1
        } else {
          m = m * 1
        }
        base = res.startTime
        baseDate = +new Date(base)
        oriFlow = res.viewData.fdValues
        oriFlowArrayTmp = oriFlow.split(',')
        oriFlowData = [Number(oriFlowArrayTmp[0])]
        oriFlowDate = [parseTime(baseDate)]
        for (let i = 1; i < oriFlowArrayTmp.length; i++) {
          now = new Date(base + i * m * 1000)
          oriFlowDate.push(parseTime(now))
          oriFlowData.push(Number(oriFlowArrayTmp[i]))
        }

        normOriFlow = res.viewData.fdNormValues
        normOriFlowArrayTmp = normOriFlow.split(',')
        normOriFlowData = [Number(normOriFlowArrayTmp[0])]
        normOriFlowDate = [parseTime(baseDate)]
        for (let i = 1; i < normOriFlowArrayTmp.length; i++) {
          now = new Date(base + i * m * 1000)
          normOriFlowDate.push(parseTime(now))
          normOriFlowData.push(Number(normOriFlowArrayTmp[i]))
        }
        this.oriFlowChartData = {
          'xdata': oriFlowDate,
          'ydata': oriFlowData
        }
        this.normOriFlowChartData = {
          'xdata': normOriFlowDate,
          'ydata': normOriFlowData
        }
        this.anomalyChartData = this.normOriFlowChartData
      }).catch(() => {})
    },
    loadAnomalyChartData: function(taskId) {
      getTaskResults(taskId).then(res => {
        if (res.length > 0) {
          const anoPieces = []
          for (let i = 0; i < res.length; i++) {
            anoPieces.push({
              gt: res[i].asPosition,
              lt: res[i].asPosition + res[i].asLength,
              color: '#c23531'
            })
          }
          console.log(anoPieces)
          this.anomalyMap = {
            type: 'piecewise',
            show: false,
            dimension: 0,
            seriesIndex: 0,
            pieces: anoPieces
          }
        }
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
  .el-row {
    margin-bottom: 20px;
    &:last-child {
     margin-bottom: 0;
   }
  }
</style>
