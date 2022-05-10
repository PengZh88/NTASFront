<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="参数名称" prop="parName">
            <el-input v-model="form.parName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="参数值" prop="parValue">
            <el-input v-model="form.parValue" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.parRemark" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="关联算法" prop="algId">
            <el-input v-model="form.algId" style="width: 370px;" />
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
        <el-table-column prop="parName" label="参数名称" />
        <el-table-column prop="parValue" label="参数值" />
        <el-table-column prop="parRemark" label="备注" />
        <el-table-column prop="algId" label="关联算法" />
        <el-table-column v-permission="['admin','ntsAlgorithmParameters:edit','ntsAlgorithmParameters:del']" label="操作" width="150px" align="center">
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
import crudNtsAlgorithmParameters from '@/api/ntsAlgorithmParameters'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, parName: null, parValue: null, parRemark: null, algId: null }
export default {
  name: 'NtsAlgorithmParameters',
  components: { pagination, crudOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '算法参数信息', url: 'api/ntsAlgorithmParameters', sort: 'id,desc', crudMethod: { ...crudNtsAlgorithmParameters }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'ntsAlgorithmParameters:add'],
        edit: ['admin', 'ntsAlgorithmParameters:edit'],
        del: ['admin', 'ntsAlgorithmParameters:del']
      },
      rules: {
        parName: [
          { required: true, message: '参数名称不能为空', trigger: 'blur' }
        ],
        parValue: [
          { required: true, message: '参数值不能为空', trigger: 'blur' }
        ],
        algId: [
          { required: true, message: '关联算法不能为空', trigger: 'blur' }
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
