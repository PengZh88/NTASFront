<template>
  <div>
    <div v-if="query.algId === ''">
      <div class="my-code">点击算法查看参数详情</div>
    </div>
    <div v-else>
      <!--工具栏-->
      <div class="head-container">
        <div v-if="crud.props.searchToggle">
          <!-- 搜索 -->
          <rrOperation />
        </div>
      </div>
      <!--表单组件-->
      <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="参数名" prop="label">
            <el-input v-model="form.parName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="参数值" prop="value">
            <el-input v-model="form.parValue" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="备注" prop="dictSort">
            <el-input v-model="form.parRemark" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" highlight-current-row style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column label="所属算法">
          {{ query.algName }}
        </el-table-column>
        <el-table-column prop="parName" label="参数名" />
        <el-table-column prop="parValue" label="参数值" />
        <el-table-column prop="parRemark" label="备注" />
        <el-table-column v-permission="['admin','ntsAlgorithmParameters:edit','ntsAlgorithmParameters:del']" label="操作" width="130px" align="center" fixed="right">
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
import crudAlgParameters from '@/api/ntsAlgorithmParameters'
import CRUD, { presenter, header, form } from '@crud/crud'
import pagination from '@crud/Pagination'
import udOperation from '@crud/UD.operation'

const defaultForm = { id: null, parName: null, parValue: null, parRemark: null }

export default {
  components: { pagination, udOperation },
  cruds() {
    return [
      CRUD({ title: '参数详情', url: 'api/ntsAlgorithmParameters', query: { algId: '' }, sort: ['id,asc'],
        crudMethod: { ...crudAlgParameters },
        optShow: {
          add: true,
          edit: true,
          del: true,
          reset: false
        },
        queryOnPresenterCreated: false
      })
    ]
  },
  mixins: [
    presenter(),
    header(),
    form(function() {
      return Object.assign({ algId: this.algId }, defaultForm)
    })],
  data() {
    return {
      algId: null,
      algName: null,
      rules: {
        parName: [
          { required: true, message: '请输入参数名', trigger: 'blur' }
        ],
        parValue: [
          { required: true, message: '请输入参数值', trigger: 'blur' }
        ]
      },
      permission: {
        add: ['admin', 'ntsAlgorithmParameters:add'],
        edit: ['admin', 'ntsAlgorithmParameters:edit'],
        del: ['admin', 'ntsAlgorithmParameters:del']
      }
    }
  }
}
</script>

<style scoped>

</style>
