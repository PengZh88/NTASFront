<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">设备名称</label>
        <el-input v-model="query.devName" clearable placeholder="设备名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">设备负责人</label>
        <el-input v-model="query.devChargePerson" clearable placeholder="设备负责人" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">设备联系人</label>
        <el-input v-model="query.devContactPerson" clearable placeholder="设备联系人" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="600px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="140px">
          <el-form-item label="设备名称" prop="devName">
            <el-input v-model="form.devName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="设备编号" prop="devNum">
            <el-input v-model="form.devNum" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="设备负责人" prop="devChargePerson">
            <el-input v-model="form.devChargePerson" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="设备联系人" prop="devContactPerson">
            <el-input v-model="form.devContactPerson" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="IP地址" prop="devIpAddr">
            <el-input v-model="form.devIpAddr" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="MAC地址" prop="devMacAddr">
            <el-input v-model="form.devMacAddr" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="设备品牌" prop="devBrand">
            <el-input v-model="form.devBrand" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="设备型号" prop="devModel">
            <el-input v-model="form.devModel" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="所在机柜" prop="carbinetId">
            <el-select
              v-model="form.carbinetId"
              style="width: 370px"
              placeholder="请选择"
            >
              <el-option
                v-for="item in carbinets"
                :key="item.voName"
                :label="item.voName"
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
        <el-table-column prop="devName" label="设备名称" />
        <el-table-column prop="devNum" label="设备编号" />
        <el-table-column prop="devChargePerson" label="设备负责人" />
        <el-table-column prop="devContactPerson" label="设备联系人" />
        <el-table-column prop="devIpAddr" label="IP地址" />
        <el-table-column prop="devMacAddr" label="MAC地址" />
        <el-table-column prop="devBrand" label="设备品牌" />
        <el-table-column prop="devModel" label="设备型号" />
        <el-table-column prop="carbinet.jgName" label="所在机柜" />
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
        <el-table-column v-permission="['admin','ntsDevice:edit','ntsDevice:del']" label="操作" width="150px" align="center">
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
import crudNtsDevice from '@/api/ntsDevice'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { getCarbinetsWithMachinerooms } from '@/api/ntsCarbinet'

const defaultForm = { id: null, devName: null, devNum: null, devChargePerson: null, devContactPerson: null, devIpAddr: null, devMacAddr: null, devBrand: null, devModel: null, carbinetId: null, createBy: null, updatedBy: null, createTime: null, updateTime: null }
export default {
  name: 'NtsDevice',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(function() {
    return Object.assign({ carbinet: { id: this.carbinetId }}, defaultForm)
  }), crud()],
  cruds() {
    return CRUD({ title: '设备信息', url: 'api/ntsDevice', sort: 'id,desc', crudMethod: { ...crudNtsDevice }})
  },
  data() {
    return {
      carbinets: [],
      permission: {
        add: ['admin', 'ntsDevice:add'],
        edit: ['admin', 'ntsDevice:edit'],
        del: ['admin', 'ntsDevice:del']
      },
      rules: {
        devName: [
          { required: true, message: '设备名称不能为空', trigger: 'blur' }
        ],
        devNum: [
          { required: true, message: '设备编号不能为空', trigger: 'blur' }
        ],
        devChargePerson: [
          { required: true, message: '设备负责人不能为空', trigger: 'blur' }
        ],
        devContactPerson: [
          { required: true, message: '设备联系人不能为空', trigger: 'blur' }
        ],
        devIpAddr: [
          { required: true, message: 'IP地址不能为空', trigger: 'blur' }
        ],
        devMacAddr: [
          { required: true, message: 'MAC地址不能为空', trigger: 'blur' }
        ],
        devBrand: [
          { required: true, message: '设备品牌不能为空', trigger: 'blur' }
        ],
        devModel: [
          { required: true, message: '设备型号不能为空', trigger: 'blur' }
        ],
        carbinetId: [
          { required: true, message: '所在机柜不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'devName', display_name: '设备名称' },
        { key: 'devChargePerson', display_name: '设备负责人' },
        { key: 'devContactPerson', display_name: '设备联系人' }
      ]
    }
  },
  mounted: function() {

  },
  methods: {
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      this.loadCarbinetDatas()
    },
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    // 打开编辑弹窗前做的操作
    [CRUD.HOOK.beforeToEdit](crud, form) {
      form.carbinetId = form.carbinet.id
      form.carbinet = {
        id: form.carbinet.id
      }
    },
    // 提交前
    [CRUD.HOOK.beforeSubmit]() {
      this.form.carbinet = {
        id: this.form.carbinetId
      }
      return true
    },
    loadCarbinetDatas: function() {
      getCarbinetsWithMachinerooms().then(res => {
        this.carbinets = res.content
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>

</style>
