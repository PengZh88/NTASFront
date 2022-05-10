<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="任务名称" prop="taskName">
            <el-input v-model="form.taskName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="MongoDBCollection" prop="collectionName">
            未设置字典，请手动设置 Select
          </el-form-item>
          <el-form-item label="网络协议" prop="fdProtocol">
            未设置字典，请手动设置 Select
          </el-form-item>
          <el-form-item label="开始时间" prop="fdStartDate">
            <el-date-picker v-model="form.fdStartDate" type="datetime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="结束时间" prop="fdEndDate">
            <el-date-picker v-model="form.fdEndDate" type="datetime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="是否覆盖" prop="canOverwrite">
            <el-radio v-for="item in dict.yes_no" :key="item.id" v-model="form.canOverwrite" :label="item.value">{{ item.label }}</el-radio>
          </el-form-item>
          <el-form-item label="关联设备" prop="deviceId">
            未设置字典，请手动设置 Select
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.taskRemark" :rows="3" type="textarea" style="width: 370px;" />
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
        <el-table-column prop="deviceId" label="关联设备" />
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
import crudNtsMongoToMysqlTask from '@/api/ntsMongoToMysqlTask'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, taskName: null, collectionName: null, fdProtocol: null, fdStartDate: null, fdEndDate: null, canOverwrite: null, deviceId: null, taskRemark: null, taskStatus: null, createBy: null, updatedBy: null, createTime: null, updateTime: null }
export default {
  name: 'NtsMongoToMysqlTask',
  components: { pagination, crudOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['yes_no', 'mm_task_status'],
  cruds() {
    return CRUD({ title: 'MongoDBMySQL数据同步', url: 'api/ntsMongoToMysqlTask', sort: 'id,desc', crudMethod: { ...crudNtsMongoToMysqlTask }})
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
        ]
      }}
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style scoped>

</style>
