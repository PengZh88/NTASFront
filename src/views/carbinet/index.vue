<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 楼宇、机房 -->
      <el-col :xs="9" :sm="6" :md="5" :lg="4" :xl="4">
        <div class="head-container">
          <el-input
            v-model="qmName"
            placeholder="请输入检索项"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            class="filter-item"
          />
        </div>
        <el-tree
          ref="tree"
          class="filter-tree"
          :data="mroomDatas"
          :props="defaultProps"
          default-expand-all
          :filter-node-method="mroomFilterNode"
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
        />
      </el-col>

      <!--机柜-->
      <el-col :xs="15" :sm="18" :md="19" :lg="20" :xl="20">
        <!--工具栏-->
        <div class="head-container">
          <div v-if="crud.props.searchToggle">
            <!-- 搜索 -->
            <el-input
              v-model="query.blurry"
              clearable
              size="small"
              placeholder="输入机柜编号或名称搜索"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="crud.toQuery"
            />
            <rrOperation />
          </div>
          <crudOperation show="" :permission="permission" />
        </div>
        <!--表单组件-->
        <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
          <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
            <el-form-item label="机柜名称" prop="jgName">
              <el-input v-model="form.jgName" style="width: 370px;" />
            </el-form-item>
            <el-form-item label="机柜编号" prop="jgNum">
              <el-input v-model="form.jgNum" style="width: 370px;" />
            </el-form-item>
            <el-form-item label="所在机房" prop="machineroomId">
              <el-select
                v-model="form.machineroomId"
                style="width: 370px"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in machinerooms"
                  :key="item.roomName"
                  :label="item.roomName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="jgRemark">
              <el-input v-model="form.jgRemark" style="width: 370px;" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="text" @click="crud.cancelCU">取消</el-button>
            <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
          </div>
        </el-dialog>
        <!--表格渲染-->
        <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
          <el-table-column type="selection" width="55" />
          <el-table-column :show-overflow-tooltip="true" prop="jgNum" label="机柜编号" />
          <el-table-column :show-overflow-tooltip="true" prop="jgName" label="机柜名称" />
          <el-table-column :show-overflow-tooltip="true" prop="machineroom" label="所在机房">
            <template slot-scope="scope">
              <div>{{ scope.row.machineroom.roomName }}</div>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="jgRemark" width="100" label="备注" />
          <el-table-column
            v-permission="['admin','ntsCarbinet:edit','ntsCarbinet:del']"
            label="操作"
            width="115"
            align="center"
            fixed="right"
          >
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getBuildingMachinerooms, getAllMachinerooms } from '@/api/ntsMachineroom'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import crudCarbinet from '@/api/ntsCarbinet'

const defaultForm = { id: null, jgName: null, jgNum: null, machineroomId: null, jgRemark: null, createBy: null, updatedBy: null, createTime: null, updateTime: null }

export default {
  name: 'NtsCarbinet',
  components: { crudOperation, rrOperation, udOperation, pagination },
  cruds() {
    return CRUD({ title: '机柜', url: 'api/ntsCarbinet', crudMethod: { ...crudCarbinet }})
  },
  mixins: [presenter(), header(), form(function() {
    return Object.assign({ machineroom: { id: this.machineroomId }}, defaultForm)
  }), crud()],
  data() {
    return {
      height: document.documentElement.clientHeight - 180 + 'px;',
      machinerooms: [],
      permission: {
        add: ['admin', 'ntsCarbinet:add'],
        edit: ['admin', 'ntsCarbinet:edit'],
        del: ['admin', 'ntsCarbinet:del']
      },
      qmName: '',
      rules: {
        jgName: [
          { required: true, message: '机柜名称不能为空', trigger: 'blur' }
        ],
        jgNum: [
          { required: true, message: '机柜编号不能为空', trigger: 'blur' }
        ],
        machineroomId: [
          { required: true, message: '所在机房不能为空', trigger: 'blur' }
        ]
      },
      mroomDatas: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf'
      }
    }
  },
  watch: {
    qmName(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.crud.msg.add = '机柜创建成功!'
  },
  mounted: function() {
    const that = this
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + 'px;'
    }
    that.loadBuildingMachineroomTreeDatas()
  },
  methods: {
    mroomFilterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    handleNodeClick(data) {
      if (data.bmId.startsWith('Machineroom')) {
        // 选中机房
        this.query.machineroomId = data.bmId.split('_')[1]
        this.crud.toQuery()
      }
    },
    loadBuildingMachineroomTreeDatas() {
      setTimeout(() => {
        getBuildingMachinerooms().then(res => {
          this.mroomDatas = res.content
        })
      }, 100)
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      this.getMachinerooms()
    },
    // 打开编辑弹窗前做的操作
    [CRUD.HOOK.beforeToEdit](crud, form) {
      form.machineroomId = form.machineroom.id
      form.machineroom = {
        id: form.machineroom.id,
        roomName: form.machineroom.roomName
      }
    },
    // 提交前
    [CRUD.HOOK.beforeSubmit]() {
      this.form.machineroom = {
        id: this.form.machineroomId
      }
      return true
    },
    getMachinerooms: function() {
      getAllMachinerooms().then(res => {
        this.machinerooms = res.content
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>

</style>
