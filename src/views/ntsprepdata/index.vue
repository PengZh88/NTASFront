<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="150px">
          <el-form-item label="流量产生时间" prop="fdDateTime">
            <el-date-picker v-model="form.fdDateTime" type="datetime" style="width: 300px;" />
          </el-form-item>
          <el-form-item label="流量值" prop="fdValue">
            <el-input v-model="form.fdValue" style="width: 300px;" />
          </el-form-item>
          <el-form-item label="协议" prop="fdProtocol">
            <el-input v-model="form.fdProtocol" style="width: 300px;" />
          </el-form-item>
          <el-form-item label="流量单位" prop="fdWeight">
            <el-input v-model="form.fdWeight" style="width: 300px;" />
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
          <el-form-item label="关联同步任务" prop="taskId">
            <el-select v-model="form.taskId" filterable placeholder="请选择">
              <el-option
                v-for="item in tasks"
                :key="item.id"
                :label="item.taskName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="fdDateTime" label="流量产生时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.fdDateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fdValue" label="流量值" />
        <el-table-column prop="fdProtocol" label="协议" />
        <el-table-column prop="fdWeight" label="流量单位" />
        <el-table-column prop="deviceId" label="关联设备">
          <template slot-scope="scope">
            {{ tabDeviceView(scope.row.deviceId) }}
          </template>
        </el-table-column>
        <el-table-column prop="taskId" label="关联同步任务">
          <template slot-scope="scope">
            {{ tabTaskView(scope.row.taskId) }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="数据入库时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','ntsPrepFlowData:edit','ntsPrepFlowData:del']" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
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
import crudNtsPrepFlowData from '@/api/ntsPrepFlowData'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { getAllDevices } from '@/api/ntsDevice'
import { findAllTasks } from '@/api/ntsMongoToMysqlTask'

const defaultForm = { id: null, fdDateTime: null, fdValue: null, fdProtocol: null, fdWeight: null, deviceId: null, taskId: null, createTime: null }
export default {
  name: 'NtsPrepFlowData',
  components: { pagination, crudOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '预处理流量数据', url: 'api/ntsPrepFlowData', sort: 'id,desc', crudMethod: { ...crudNtsPrepFlowData }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'ntsPrepFlowData:add'],
        edit: ['admin', 'ntsPrepFlowData:edit'],
        del: ['admin', 'ntsPrepFlowData:del']
      },
      rules: {
        fdDateTime: [
          { required: true, message: '流量产生时间不能为空', trigger: 'blur' }
        ],
        fdValue: [
          { required: true, message: '流量值不能为空', trigger: 'blur' }
        ],
        fdProtocol: [
          { required: true, message: '协议不能为空', trigger: 'blur' }
        ],
        fdWeight: [
          { required: true, message: '流量单位不能为空', trigger: 'blur' }
        ],
        deviceId: [
          { required: true, message: '关联设备主键不能为空', trigger: 'blur' }
        ],
        taskId: [
          { required: true, message: '关联同步任务主键不能为空', trigger: 'blur' }
        ]
      },
      devices: [],
      tasks: []
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
    tabTaskView() {
      return function(taskId) {
        if (this.tasks.length !== 0) {
          for (const x in this.tasks) {
            if (this.tasks[x].id === taskId) {
              return this.tasks[x].taskName
            }
          }
        }
      }
    }
  },
  mounted() {
    this.loadDevices()
    this.loadTasks()
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    loadDevices: function() {
      getAllDevices().then(res => {
        this.devices = res
      }).catch(() => {})
    },
    loadTasks: function() {
      findAllTasks().then(res => {
        this.tasks = res
      })
    }
  }
}
</script>

<style scoped>

</style>
