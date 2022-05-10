<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="主键">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="检测任务主键" prop="adtaskid">
            <el-input v-model="form.adtaskid" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="待检测数据">
            <el-input v-model="form.fdvalues" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="待检测标准化数据">
            <el-input v-model="form.fdnormvalues" style="width: 370px;" />
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
        <el-table-column prop="id" label="主键" />
        <el-table-column prop="adtaskid" label="检测任务主键" />
        <el-table-column prop="fdvalues" label="待检测数据" />
        <el-table-column prop="fdnormvalues" label="待检测标准化数据" />
        <el-table-column v-permission="['admin','ntsAnomalyDetectionPersistenceData:edit','ntsAnomalyDetectionPersistenceData:del']" label="操作" width="150px" align="center">
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
import crudNtsAnomalyDetectionPersistenceData from '@/api/ntsAnomalyDetectionPersistenceData'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, adtaskid: null, fdvalues: null, fdnormvalues: null }
export default {
  name: 'NtsAnomalyDetectionPersistenceData',
  components: { pagination, crudOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '异常检测任务持久化待检测数据', url: 'api/ntsAnomalyDetectionPersistenceData', sort: 'id,desc', crudMethod: { ...crudNtsAnomalyDetectionPersistenceData }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'ntsAnomalyDetectionPersistenceData:add'],
        edit: ['admin', 'ntsAnomalyDetectionPersistenceData:edit'],
        del: ['admin', 'ntsAnomalyDetectionPersistenceData:del']
      },
      rules: {
        adtaskid: [
          { required: true, message: '检测任务主键不能为空', trigger: 'blur' }
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
