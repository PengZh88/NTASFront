<template>
  <div>
    <el-row :gutter="12">
      <el-col :span="10">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>数据同步接口执行情况</span>
          </div>
          <el-row :gutter="30" class="panel-group">
            <el-col :xs="12" :sm="12" :lg="12" class="card-panel-col">
              <div class="card-panel">
                <div class="card-panel-icon-wrapper icon-people">
                  <svg-icon icon-class="peoples" class-name="card-panel-icon" />
                </div>
                <div class="card-panel-description">
                  <div class="card-panel-text">
                    总任务数
                  </div>
                  <count-to :start-val="0" :end-val="taskTotal" :duration="1000" class="card-panel-num" />
                </div>
              </div>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="12" class="card-panel-col">
              <div class="card-panel">
                <div class="card-panel-icon-wrapper icon-database">
                  <svg-icon icon-class="database" class-name="card-panel-icon" />
                </div>
                <div class="card-panel-description">
                  <div class="card-panel-text">
                    正在运行
                  </div>
                  <count-to :start-val="0" :end-val="taskOngoing" :duration="1000" class="card-panel-num" />
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="30" class="panel-group">
            <el-col :xs="12" :sm="12" :lg="12" class="card-panel-col">
              <div class="card-panel">
                <div class="card-panel-icon-wrapper icon-international">
                  <svg-icon icon-class="international" class-name="card-panel-icon" />
                </div>
                <div class="card-panel-description">
                  <div class="card-panel-text">
                    已成功数
                  </div>
                  <count-to :start-val="0" :end-val="taskSucceeded" :duration="1000" class="card-panel-num" />
                </div>
              </div>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="12" class="card-panel-col">
              <div class="card-panel">
                <div class="card-panel-icon-wrapper icon-error">
                  <svg-icon icon-class="error" class-name="card-panel-icon" />
                </div>
                <div class="card-panel-description">
                  <div class="card-panel-text">
                    已失败数
                  </div>
                  <count-to :start-val="0" :end-val="taskFailed" :duration="1000" class="card-panel-num" />
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="14">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>近期同步日志</span>
            <router-link :to="'/monitor/logs'" style="float: right; color: #13ce66">
              查看更多
            </router-link>
          </div>
          <ul class="list-unstyled">
            <li v-for="item in taskLogs" :key="item.id" style="line-height: 21px;">
              {{ item.description }}, {{ item.logType }}, {{ item.requestIp }}, {{ item.username }}, {{ parseTime(item.createTime) }}
            </li>
          </ul>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <div>
        <!--工具栏-->
        <div class="head-container">
          <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
          <crudOperation :permission="permission" />
          <!--表单组件-->
          <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
            <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">
              <el-form-item label="任务名称" prop="taskName">
                <el-input v-model="form.taskName" style="width: 340px;" />
              </el-form-item>
              <el-form-item label="Collection" prop="collectionName">
                <el-select v-model="form.collectionName" filterable placeholder="请选择">
                  <el-option
                    v-for="item in prepCollections"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="网络协议" prop="fdProtocol">
                <el-select v-model="form.fdProtocol" filterable placeholder="请选择">
                  <el-option
                    v-for="item in netProtocols"
                    :key="item.iptname"
                    :label="item.iptname"
                    :value="item.iptname"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="开始时间" prop="fdStartDate">
                <el-date-picker v-model="form.fdStartDate" type="datetime" style="width: 340px;" />
              </el-form-item>
              <el-form-item label="结束时间" prop="fdEndDate">
                <el-date-picker v-model="form.fdEndDate" type="datetime" style="width: 340px;" />
              </el-form-item>
              <el-form-item label="是否覆盖" prop="canOverwrite">
                <el-radio v-for="item in dict.yes_no" :key="item.id" v-model="form.canOverwrite" :label="item.value">{{ item.label }}</el-radio>
              </el-form-item>
              <el-form-item label="关联设备" prop="deviceId">
                <el-select v-model="form.deviceId" filterable placeholder="请选择">
                  <el-option
                    v-for="item in devices"
                    :key="item.id"
                    :label="item.devName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="form.taskRemark" :rows="3" type="textarea" style="width: 340px;" />
              </el-form-item>
              <el-form-item label="立即同步" prop="startNow">
                <el-radio v-for="item in dict.yes_no" :key="item.id" v-model="form.startNow" :label="item.value">{{ item.label }}</el-radio>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="text" @click="crud.cancelCU">取消</el-button>
              <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">提交</el-button>
            </div>
          </el-dialog>
          <!--表格渲染-->
          <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
            <el-table-column type="selection" width="55" />
            <el-table-column label="执行">
              <template slot-scope="scope">
                <el-popconfirm
                  title="确定执行同步操作吗？"
                  @confirm="handlePerform(scope.row.id)"
                >
                  <el-button slot="reference" type="success" icon="el-icon-video-play" />
                </el-popconfirm>
              </template>
            </el-table-column>
            <el-table-column prop="taskName" label="任务名称" />
            <el-table-column prop="collectionName" label="MongoDBCollection" />
            <el-table-column prop="fdProtocol" label="网络协议" />
            <el-table-column prop="fdStartDate" label="开始时间">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.fdStartDate) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="fdEndDate" label="结束时间">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.fdEndDate) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="canOverwrite" label="是否覆盖">
              <template slot-scope="scope">
                {{ dict.label.yes_no[scope.row.canOverwrite] }}
              </template>
            </el-table-column>
            <el-table-column prop="deviceId" label="关联设备">
              <template slot-scope="scope">
                {{ tabDeviceView(scope.row.deviceId) }}
              </template>
            </el-table-column>
            <el-table-column prop="taskRemark" label="备注" />
            <el-table-column prop="taskStatus" label="任务状态">
              <template slot-scope="scope">
                {{ dict.label.mm_task_status[scope.row.taskStatus] }}
              </template>
            </el-table-column>
            <el-table-column v-permission="['admin','ntsMongoToMysqlTask:edit','ntsMongoToMysqlTask:del']" label="操作" width="150px" align="center">
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
    </el-row>
  </div>
</template>

<script>

import CountTo from 'vue-count-to'
import crudNtsMongoToMysqlTask from '@/api/ntsMongoToMysqlTask'
import { confirmTask, getTaskNumbers } from '@/api/ntsMongoToMysqlTask'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { getAllDevices } from '@/api/ntsDevice'
import { getAllProtocols } from '@/api/ntsIpPortal'
import { getMongodbPrepCollections } from '@/api/ntsMongodb'
import { Notification } from 'element-ui'
import { getTasklogs } from '@/api/monitor/log'

const defaultForm = { id: null, taskName: null, collectionName: null, fdProtocol: null, fdStartDate: null, fdEndDate: null, canOverwrite: null, deviceId: null, taskRemark: null, taskStatus: null, createBy: null, updatedBy: null, createTime: null, updateTime: null, startNow: null }

export default {
  name: 'DmDashboard',
  components: { CountTo, pagination, crudOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['yes_no', 'mm_task_status'],
  cruds() {
    return CRUD({ title: 'MongoDBMySQL数据同步', url: 'api/ntsMongoToMysqlTask', sort: 'id,desc', crudMethod: { ...crudNtsMongoToMysqlTask }, optShow: { add: true, del: true }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'ntsMongoToMysqlTask:add'],
        edit: ['admin', 'ntsMongoToMysqlTask:edit'],
        del: ['admin', 'ntsMongoToMysqlTask:del']
      },
      rules: {
        taskName: [
          { required: true, message: '任务名称不能为空', trigger: 'blur' }
        ],
        collectionName: [
          { required: true, message: 'MongoDBCollection不能为空', trigger: 'blur' }
        ],
        fdProtocol: [
          { required: true, message: '网络协议不能为空', trigger: 'blur' }
        ],
        fdStartDate: [
          { required: true, message: '开始时间不能为空', trigger: 'blur' }
        ],
        fdEndDate: [
          { required: true, message: '结束时间不能为空', trigger: 'blur' }
        ],
        canOverwrite: [
          { required: true, message: '是否覆盖不能为空', trigger: 'blur' }
        ],
        deviceId: [
          { required: true, message: '关联设备不能为空', trigger: 'blur' }
        ],
        startNow: [
          { required: true, message: '立即启动不能为空', trigger: 'blur' }
        ]
      },
      netProtocols: [],
      devices: [],
      prepCollections: [],
      taskTotal: 0,
      taskOngoing: 0,
      taskSucceeded: 0,
      taskFailed: 0,
      taskLogs: []
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
    }
  },
  mounted() {
    this.loadNetProtocols()
    this.loadDevices()
    this.loadCollections()
    this.loadTaskNumbers()
    this.loadTaskLogs()
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
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
    loadCollections: function() {
      getMongodbPrepCollections().then(res => {
        this.prepCollections = res
      }).catch(() => {})
    },
    loadTaskNumbers: function() {
      getTaskNumbers().then(res => {
        this.taskTotal = res.total
        this.taskOngoing = res.ongoing
        this.taskSucceeded = res.succeeded
        this.taskFailed = res.failed
      })
    },
    loadTaskLogs: function() {
      const data = {
        blurry: 'MongoDBMySQL数据同步',
        page: 0,
        size: 10
      }
      getTasklogs(data).then(res => {
        this.taskLogs = res.content
      })
    },
    handlePerform: function(id) {
      const obj = {
        'id': id
      }
      confirmTask(obj).then(res => {
        Notification.success({
          title: '任务已经提交运行'
        })
        this.crud.toQuery()
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.panel-group {
  margin-top: 8px;

  .card-panel-col {
    margin-bottom: 8px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-database {
        background: #36a3f7;
      }

      .icon-international {
        background: #f4516c;
      }

      .icon-error {
        background: #ff502f
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-database {
      color: #36a3f7;
    }

    .icon-international {
      color: #f4516c;
    }

    .icon-error {
      color: #ff502f
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }

    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }

  a {
    text-decoraction: none;
  }

  .router-link-active {
    text-decoration: none;
  }
}
</style>
