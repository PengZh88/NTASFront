<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">楼宇名称</label>
        <el-input v-model="query.buildingName" clearable placeholder="楼宇名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="楼宇名称" prop="buildingName">
            <el-input v-model="form.buildingName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="楼宇编号" prop="buildingNum">
            <el-input v-model="form.buildingNum" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="地址" prop="buildingAddress">
            <el-input v-model="form.buildingAddress" :rows="3" type="textarea" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="邮编" prop="buildingPostal">
            <el-input v-model="form.buildingPostal" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="联系电话" prop="buildingContact">
            <el-input v-model="form.buildingContact" style="width: 370px;" />
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
        <el-table-column prop="buildingName" label="楼宇名称" />
        <el-table-column prop="buildingNum" label="楼宇编号" />
        <el-table-column prop="buildingAddress" label="地址" />
        <el-table-column prop="buildingPostal" label="邮编" />
        <el-table-column prop="buildingContact" label="联系电话" />
        <el-table-column prop="createBy" label="创建者" />
        <el-table-column prop="updatedBy" label="更新者" />
        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','ntsBuilding:edit','ntsBuilding:del']" label="操作" width="150px" align="center">
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
import crudNtsBuilding from '@/api/ntsBuilding'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, buildingName: null, buildingNum: null, buildingAddress: null, buildingPostal: null, buildingContact: null, createBy: null, updatedBy: null, createTime: null, updateTime: null }
export default {
  name: 'NtsBuilding',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '楼宇信息', url: 'api/ntsBuilding', sort: 'id,desc', crudMethod: { ...crudNtsBuilding }})
  },
  data() {
    return {
      machinerooms: [],
      permission: {
        add: ['admin', 'ntsBuilding:add'],
        edit: ['admin', 'ntsBuilding:edit'],
        del: ['admin', 'ntsBuilding:del']
      },
      rules: {
        buildingName: [
          { required: true, message: '楼宇名称不能为空', trigger: 'blur' }
        ],
        buildingNum: [
          { required: true, message: '楼宇编号不能为空', trigger: 'blur' }
        ],
        buildingAddress: [
          { required: true, message: '地址不能为空', trigger: 'blur' }
        ],
        buildingPostal: [
          { required: true, message: '邮编不能为空', trigger: 'blur' }
        ],
        buildingContact: [
          { required: true, message: '联系电话不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'buildingName', display_name: '楼宇名称' }
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
