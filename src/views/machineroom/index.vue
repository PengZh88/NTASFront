<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">机房名称</label>
        <el-input v-model="query.roomName" clearable placeholder="机房名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="机房名称" prop="roomName">
            <el-input v-model="form.roomName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="楼宇主键" prop="buildingId">
            <el-select
              v-model="form.buildingId"
              style="width: 370px"
              placeholder="请选择"
            >
              <el-option
                v-for="item in buildings"
                :key="item.buildingName"
                :label="item.buildingName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="楼层" prop="floorNumber">
            <el-input-number v-model.number="form.floorNumber" :min="-3" :max="20" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="机柜数" prop="cabinetNumber">
            <el-input-number v-model.number="form.cabinetNumber" :min="0" :max="999" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="管理员" prop="chargePerson">
            <el-input v-model="form.chargePerson" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="联系电话" prop="telephone">
            <el-input v-model="form.telephone" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remark" :rows="3" type="textarea" style="width: 370px;" />
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
        <el-table-column prop="roomName" label="机房名称" />
        <el-table-column prop="building.buildingName" label="所在楼宇" />
        <el-table-column prop="floorNumber" label="楼层" />
        <el-table-column prop="cabinetNumber" label="机柜数" />
        <el-table-column prop="chargePerson" label="管理员" />
        <el-table-column prop="telephone" label="联系电话" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="createBy" label="创建者" />
        <el-table-column prop="updatedBy" label="更新者" />
        <el-table-column prop="createTime" label="创建日期">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新日期">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','ntsMachineroom:edit','ntsMachineroom:del']" label="操作" width="150px" align="center">
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
import crudNtsMachineroom from '@/api/ntsMachineroom'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { getAllBuildings } from '@/api/ntsBuilding.js'

const defaultForm = { id: null, roomName: null, buildingId: null, floorNumber: null, cabinetNumber: null, chargePerson: null, telephone: null, remark: null, createBy: null, updatedBy: null, createTime: null, updateTime: null, buildingName: null }
export default {
  name: 'NtsMachineroom',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(function() {
    return Object.assign({ building: { id: this.buildingId }}, defaultForm)
  }), crud()],
  cruds() {
    return CRUD({ title: '机房信息', url: 'api/ntsMachineroom', sort: 'id,desc', crudMethod: { ...crudNtsMachineroom }})
  },
  data() {
    return {
      buildings: [],
      permission: {
        add: ['admin', 'ntsMachineroom:add'],
        edit: ['admin', 'ntsMachineroom:edit'],
        del: ['admin', 'ntsMachineroom:del']
      },
      rules: {
        roomName: [
          { required: true, message: '机房名称不能为空', trigger: 'blur' }
        ],
        buildingId: [
          { required: true, message: '楼宇主键不能为空', trigger: 'blur' }
        ],
        floorNumber: [
          { required: true, message: '楼层不能为空', trigger: 'blur' }
        ],
        cabinetNumber: [
          { required: true, message: '机柜数不能为空', trigger: 'blur' }
        ],
        chargePerson: [
          { required: true, message: '管理员不能为空', trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: '联系电话不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'roomName', display_name: '机房名称' }
      ]
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      this.getBuildings()
    },
    // 打开编辑弹窗前做的操作
    [CRUD.HOOK.beforeToEdit](crud, form) {
      form.buildingId = form.building.id
      form.building = {
        id: form.building.id,
        buildingName: form.building.buildingName
      }
    },
    // 提交前
    [CRUD.HOOK.beforeSubmit]() {
      this.form.building = {
        id: this.form.buildingId
      }
      return true
    },
    getBuildings: function() {
      getAllBuildings().then(res => {
        this.buildings = res.content
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>

</style>
