<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
        <el-card class="box-card">
          <!--工具栏-->
          <div class="head-container">
            <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
            <crudOperation :permission="permission" />
            <!-- 算法详情组件 -->
            <el-dialog width="700px" title="算法详情" :visible.sync="algVOdialogVisible" :before-close="closeViewAlgDialog" :close-on-click-modal="true">
              <el-row :gutter="20">
                <el-col :span="4">算法名称</el-col>
                <el-col :span="20">{{ algVO.algName }}</el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="4">相关论文</el-col>
                <el-col :span="20">{{ algVO.paperName }}</el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="4">论文类型</el-col>
                <el-col :span="20"><el-tag type="success">{{ dict.label.paper_type[algVO.paperType] }}</el-tag></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="4">收录情况</el-col>
                <el-col :span="20"><el-tag>{{ dict.label.includes_status[algVO.paperInclude] }}</el-tag></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="4">论文发表年</el-col>
                <el-col :span="20">{{ algVO.paperYear }}</el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="4">期刊（会议）名称</el-col>
                <el-col :span="20">{{ algVO.paperJcname }}</el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="4">论文作者</el-col>
                <el-col :span="20">{{ algVO.paperAuthors }}</el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="4">算法简要描述</el-col>
                <el-col :span="20">{{ algVO.algDesc }}</el-col>
              </el-row>
            </el-dialog>
            <!--表单组件-->
            <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
              <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
                <el-form-item label="算法名称" prop="algName">
                  <el-input v-model="form.algName" style="width: 370px;" />
                </el-form-item>
                <el-form-item label="算法简要描述" prop="algDesc">
                  <el-input v-model="form.algDesc" :rows="3" type="textarea" style="width: 370px;" />
                </el-form-item>
                <el-form-item label="相关论文" prop="paperName">
                  <el-input v-model="form.paperName" style="width: 370px;" />
                </el-form-item>
                <el-form-item label="论文发表年" prop="paperYear">
                  <el-input v-model="form.paperYear" style="width: 370px;" />
                </el-form-item>
                <el-form-item label="期刊（会议）名称" prop="paperJcname">
                  <el-input v-model="form.paperJcname" style="width: 370px;" />
                </el-form-item>
                <el-form-item label="论文类型" prop="paperType">
                  <el-select v-model="form.paperType" filterable placeholder="请选择">
                    <el-option
                      v-for="item in dict.paper_type"
                      :key="item.id"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="收录情况" prop="paperInclude">
                  <el-select v-model="form.paperInclude" filterable placeholder="请选择">
                    <el-option
                      v-for="item in dict.includes_status"
                      :key="item.id"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="论文作者" prop="paperAuthors">
                  <el-input v-model="form.paperAuthors" style="width: 370px;" />
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button type="text" @click="crud.cancelCU">取消</el-button>
                <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
              </div>
            </el-dialog>
            <!--表格渲染-->
            <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler" @row-click="handleAlgRowClick">
              <el-table-column type="selection" width="55" />
              <el-table-column prop="algName" label="算法名称" />
              <el-table-column prop="paperName" label="相关论文" />
              <el-table-column prop="paperYear" label="论文发表年" />
              <el-table-column prop="paperJcname" label="期刊（会议）名称" />
              <el-table-column prop="paperType" label="论文类型">
                <template slot-scope="scope">
                  {{ dict.label.paper_type[scope.row.paperType] }}
                </template>
              </el-table-column>
              <el-table-column prop="paperInclude" label="收录情况">
                <template slot-scope="scope">
                  {{ dict.label.includes_status[scope.row.paperInclude] }}
                </template>
              </el-table-column>
              <el-table-column v-permission="['admin','ntsAlgorithm:edit','ntsAlgorithm:del']" label="操作" width="250px" align="center">
                <template slot-scope="scope">
                  <div style="float: left;">
                    <el-button type="success" icon="el-icon-document" size="mini" @click="handleViewAlg(scope.row)" />
                  </div>
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
        </el-card>
      </el-col>

      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>算法参数</span>
            <el-button
              v-if="checkPermission(['admin','ntsAlgorithmParameters:add']) && this.$refs.algparas && this.$refs.algparas.query.algId"
              class="filter-item"
              size="mini"
              style="float: right;padding: 4px 10px"
              type="primary"
              icon="el-icon-plus"
              @click="$refs.algparas && $refs.algparas.crud.toAdd()"
            >新增</el-button>
          </div>
          <algparas ref="algparas" :permission="permission" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import crudNtsAlgorithm from '@/api/ntsAlgorithm'
import { viewAlg } from '@/api/ntsAlgorithm'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import Algparas from '@/views/algorithm/algparas'

const defaultForm = { id: null, algName: null, algDesc: null, paperName: null, paperYear: null, paperJcname: null, paperType: null, paperInclude: null, paperAuthors: null }
export default {
  name: 'NtsAlgorithm',
  components: { Algparas, pagination, crudOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['paper_type', 'includes_status'],
  cruds() {
    return CRUD({ title: '算法信息', url: 'api/ntsAlgorithm', sort: 'id,desc', crudMethod: { ...crudNtsAlgorithm }})
  },
  data() {
    return {
      algVOdialogVisible: false,
      algVO: {
        id: null,
        algName: '',
        algDesc: '',
        paperName: '',
        paperYear: '',
        paperJcname: '',
        paperType: '',
        paperInclude: '',
        paperAuthors: ''
      },
      permission: {
        add: ['admin', 'ntsAlgorithm:add'],
        edit: ['admin', 'ntsAlgorithm:edit'],
        del: ['admin', 'ntsAlgorithm:del']
      },
      rules: {
        algName: [
          { required: true, message: '算法名称不能为空', trigger: 'blur' }
        ],
        algDesc: [
          { required: true, message: '算法简要描述不能为空', trigger: 'blur' }
        ],
        paperName: [
          { required: true, message: '相关论文不能为空', trigger: 'blur' }
        ],
        paperYear: [
          { required: true, message: '论文发表年不能为空', trigger: 'blur' }
        ],
        paperJcname: [
          { required: true, message: '期刊（会议）名称不能为空', trigger: 'blur' }
        ],
        paperType: [
          { required: true, message: '论文类型不能为空', trigger: 'blur' }
        ],
        paperInclude: [
          { required: true, message: '收录情况不能为空', trigger: 'blur' }
        ],
        paperAuthors: [
          { required: true, message: '论文作者不能为空', trigger: 'blur' }
        ]
      }}
  },
  methods: {
    checkPermission,
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      if (this.$refs.algparas) {
        this.$refs.algparas.query.algId = ''
        this.$refs.algparas.query.algName = ''
      }
      return true
    },
    handleViewAlg: function(row) {
      this.algVOdialogVisible = true
      viewAlg(row.id).then(res => {
        Object.assign(this.algVO, res)
      }).catch(() => {})
    },
    closeViewAlgDialog: function(done) {
      done()
    },
    handleAlgRowClick: function(row) {
      if (row.id) {
        this.$refs.algparas.query.algId = row.id
        this.$refs.algparas.query.algName = row.algName
        this.$refs.algparas.algId = row.id
        this.$refs.algparas.algName = row.algName
        this.$refs.algparas.crud.toQuery()
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
     }
  }

  .el-col {
    border-radius: 4px;
  }
</style>
