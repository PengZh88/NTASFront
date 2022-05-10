<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">协议号</label>
        <el-input v-model="query.iptnum" clearable placeholder="协议号" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="协议号" prop="iptnum">
            <el-input v-model="form.iptnum" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="协议名称">
            <el-input v-model="form.iptname" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="说明">
            <el-input v-model="form.iptremark" :rows="3" type="textarea" style="width: 370px;" />
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
        <el-table-column prop="iptnum" label="协议号" />
        <el-table-column prop="iptname" label="协议名称" />
        <el-table-column prop="iptremark" label="说明" />
        <el-table-column v-permission="['admin','ntsIpPortal:edit','ntsIpPortal:del']" label="操作" width="150px" align="center">
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
import crudNtsIpPortal from '@/api/ntsIpPortal'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, iptnum: null, iptname: null, iptremark: null }
export default {
  name: 'NtsIpPortal',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: 'IP协议号', url: 'api/ntsIpPortal', sort: 'id,asc', crudMethod: { ...crudNtsIpPortal }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'ntsIpPortal:add'],
        edit: ['admin', 'ntsIpPortal:edit'],
        del: ['admin', 'ntsIpPortal:del']
      },
      rules: {
        iptnum: [
          { required: true, message: '协议号不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'iptnum', display_name: '协议号' }
      ]
    }
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
