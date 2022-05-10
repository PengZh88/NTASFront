<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">任务名称</label>
        <el-input v-model="query.taskName" clearable placeholder="任务名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">任务是否启动</label>
        <el-input v-model="query.startNow" clearable placeholder="任务是否启动" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-date-picker
          v-model="query.createTime"
          :default-time="['00:00:00','23:59:59']"
          type="daterange"
          range-separator=":"
          size="small"
          class="date-item"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="创建时间起"
          end-placeholder="创建时间止"
        />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-steps :active="active" finish-status="success">
          <el-step title="步骤 1" description="确定检测范围及算法" />
          <el-step title="步骤 2" description="调整算法参数" />
        </el-steps>
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="110px">
          <div v-show="active==0" class="info">
            <el-form-item label="任务名称" prop="taskName">
              <el-input v-model="form.taskName" style="width: 350px;" />
            </el-form-item>
            <el-form-item label="设备" prop="deviceId">
              <el-select v-model="form.deviceId" filterable placeholder="请选择">
                <el-option
                  v-for="item in devices"
                  :key="item.id"
                  :label="item.devName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="网络协议" prop="ntsProtocol">
              <el-select v-model="form.ntsProtocol" filterable placeholder="请选择">
                <el-option
                  v-for="item in netProtocols"
                  :key="item.id"
                  :label="item.iptname"
                  :value="item.iptname"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="流量开始时间" prop="ntsStart">
              <el-date-picker v-model="form.ntsStart" type="datetime" style="width: 350px;" />
            </el-form-item>
            <el-form-item label="流量结束时间" prop="ntsEnd">
              <el-date-picker v-model="form.ntsEnd" type="datetime" style="width: 350px;" />
            </el-form-item>
            <el-form-item label="检测算法" prop="algorithmId">
              <el-select v-model="form.algorithmId" filterable placeholder="请选择" @change="updateParams">
                <el-option
                  v-for="item in algorithms"
                  :key="item.id"
                  :label="item.algName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="分析维度" prop="anaDimension">
              <el-radio-group v-model="form.anaDimension" @change="dgchange">
                <el-radio v-for="item in dict.ana_dimension_type" :key="item.id" :label="item.value" border>{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="精细粒度" prop="fineGrained">
              <el-radio-group v-model="form.fineGrained" @change="dgchange">
                <el-radio v-for="item in dict.fine_grained_type" :key="item.id" :label="item.value" border>{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="窗口大小" prop="windowSize">
              <el-input-number v-model="form.windowSize" :min="1" style="width: 150px;" />
            </el-form-item>
            <el-form-item label="步长" prop="stepSize">
              <el-input-number v-model="form.stepSize" :min="1" style="width: 150px;" />
            </el-form-item>
          </div>
          <div v-show="active==1" class="info">
            <el-form-item v-for="(pars, index) in form.algParamDatas" :key="pars.id" :label="pars.parName" :prop="'algParamDatas.' + index + '.parValue'" :rules="{required: true, message: '参数值不能为空', trigger: 'blur'}">
              <el-input v-model="pars.parValue" style="width: 250px;" />
              <el-input v-model="pars.parName" type="hidden" />
            </el-form-item>
          </div>
          <div class="info">
            <el-button v-show="active > 0" @click="iforward">上一步</el-button>
            <el-button v-show="active < 1" @click="inext">下一步</el-button>
            <el-button v-show="active > 0" @click="ifinish">完成</el-button>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" :disabled="active == 2 ? false : true" @click="crud.submitCU">提交</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column label="执行">
          <template slot-scope="scope">
            <el-popconfirm
              title="确定启动异常检测任务吗？"
              @confirm="handlePerform(scope.row.id)"
            >
              <el-button slot="reference" type="success" icon="el-icon-video-play" />
            </el-popconfirm>
          </template>
        </el-table-column>
        <el-table-column prop="taskName" label="任务名称" />
        <el-table-column prop="deviceId" label="设备">
          <template slot-scope="scope">
            {{ tabDeviceView(scope.row.deviceId) }}
          </template>
        </el-table-column>
        <el-table-column prop="ntsProtocol" label="网络协议" />
        <el-table-column prop="ntsStart" label="流量开始时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.ntsStart) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ntsEnd" label="流量结束时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.ntsEnd) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="algorithmId" label="检测算法">
          <template slot-scope="scope">
            {{ tabAlgView(scope.row.algorithmId) }}
          </template>
        </el-table-column>
        <el-table-column prop="windowSize" label="窗口大小" />
        <el-table-column prop="stepSize" label="步长" />
        <el-table-column prop="startNow" label="任务是否启动">
          <template slot-scope="scope">
            {{ dict.label.yes_no[scope.row.startNow] }}
          </template>
        </el-table-column>
        <el-table-column prop="createBy" label="创建者" />
        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="查看" width="100px" align="center">
          <template slot-scope="scope">
            <el-button size="small" type="text">
              <router-link :to="'/ntsanomaly/anomalydetection/preview/' + scope.row.id">
                查看
              </router-link>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','ntsAnomalyDetectionTask:edit','ntsAnomalyDetectionTask:del']" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
              :disabled-edit="true"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudNtsAnomalyDetectionTask from '@/api/ntsAnomalyDetectionTask'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { getAllDevices } from '@/api/ntsDevice'
import { getAllProtocols } from '@/api/ntsIpPortal'
import { getAllAlgorithms } from '@/api/ntsAlgorithm'
import { get as getAllAlgParams } from '@/api/ntsAlgorithmParameters'
import { calWindowSize } from '@/api/ntsAnomalyDetectionTask'
import { Notification } from 'element-ui'
import { confirmAnomalyTask } from '@/api/ntsAnomalyDetectionTask'

const defaultForm = { id: null, taskName: null, deviceId: null, ntsProtocol: null, ntsStart: null, ntsEnd: null, algorithmId: null, anaDimension: null, fineGrained: null, windowSize: null, stepSize: null, drillStyle: null, createBy: null, updatedBy: null, createTime: null, updateTime: null, startNow: 'N', algParamDatas: [] }
export default {
  name: 'NtsAnomalyDetectionTask',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['yes_no', 'ana_dimension_type', 'fine_grained_type'],
  cruds() {
    return CRUD({ title: '流量异常检测', url: 'api/ntsAnomalyDetectionTask', sort: 'id,desc', crudMethod: { ...crudNtsAnomalyDetectionTask }})
  },
  data() {
    return {
      active: 0,
      permission: {
        add: ['admin', 'ntsAnomalyDetectionTask:add'],
        edit: ['admin', 'ntsAnomalyDetectionTask:edit'],
        del: ['admin', 'ntsAnomalyDetectionTask:del']
      },
      rules: {
        taskName: [
          { required: true, message: '任务名称不能为空', trigger: 'blur' }
        ],
        deviceId: [
          { required: true, message: '设备不能为空', trigger: 'blur' }
        ],
        ntsProtocol: [
          { required: true, message: '网络协议不能为空', trigger: 'blur' }
        ],
        ntsStart: [
          { required: true, message: '流量开始时间不能为空', trigger: 'blur' }
        ],
        ntsEnd: [
          { required: true, message: '流量结束时间不能为空', trigger: 'blur' }
        ],
        algorithmId: [
          { required: true, message: '检测算法不能为空', trigger: 'blur' }
        ],
        anaDimension: [
          { required: true, message: '分析维度不能为空', trigger: 'blur' }
        ],
        fineGrained: [
          { required: true, message: '精细粒度不能为空', trigger: 'blur' }
        ],
        windowSize: [
          { required: true, message: '窗口大小不能为空', trigger: 'blur' }
        ],
        stepSize: [
          { required: true, message: '步长不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'taskName', display_name: '任务名称' },
        { key: 'startNow', display_name: '任务是否启动' }
      ],
      devices: [],
      netProtocols: [],
      algorithms: []
    }
  },
  computed: {
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
    }
  },
  mounted() {
    this.loadNetProtocols()
    this.loadDevices()
    this.loadAlgorithms()
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    [CRUD.HOOK.beforeAddCancel]() {
      this.active = 0
    },
    [CRUD.HOOK.afterSubmit]() {
      this.active = 0
    },
    loadNetProtocols: function() {
      getAllProtocols().then(res => {
        this.netProtocols = res
      }).catch(() => {})
    },
    loadDevices: function() {
      getAllDevices().then(res => {
        this.devices = res
      }).catch(() => {})
    },
    loadAlgorithms: function() {
      getAllAlgorithms().then(res => {
        this.algorithms = res.content
      }).catch(() => {})
    },
    inext: function() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (++this.active > 1) {
            this.active = 1
          }
        }
      })
    },
    iforward: function() {
      if (--this.active < 0) {
        this.active = 0
      }
    },
    ifinish: function() {
      this.active = 2
    },
    updateParams: function(item) {
      console.log(item)
      getAllAlgParams(item).then(res => {
        for (var dt of res.content) {
          this.form.algParamDatas.push({
            parName: dt.parName,
            parValue: dt.parValue
          })
        }
      }).catch(() => {})
    },
    dgchange: function() {
      this.form.windowSize = calWindowSize(this.form.anaDimension, this.form.fineGrained)
    },
    handlePerform: function(id) {
      const obj = {
        'id': id
      }
      confirmAnomalyTask(obj).then(res => {
        Notification.success({
          title: '任务已经提交运行'
        })
        this.crud.toQuery()
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>

</style>
