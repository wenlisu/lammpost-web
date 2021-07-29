/* eslint-disable camelcase */
<template>
  <div id='sensorManagement' >
    <!-- 业务执行管理 -->
    <header-title
      icon="iconfont icon-shouye"
      title="业务执行管理"
    >
      <search-form
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
        :addBtnVisible="true || $_hasOperation($options.name,'add')"
        @on-addBtn="showView('add');"
        :delBtnDisabled="selectList.length === 0"
        :delBtnVisible="true"
        @on-delBtn="showView('del')"
      />
    </header-title>

    <div class="content-view">
      <div class="Modeltable">
        <page-table
          col-align="center"
          operator-width="110"
          operator
          selection
          :data="tableData"
          :cols="tableCols"
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
          @current-change="onCurrentChange"
          @size-change="onPageSizeChange"
          @selection-change="onSelectionChange"
        >
          <template
            slot-scope="scope"
            slot="operator"
          >
          <flex>
            <el-button
              type="text"
              size="small"
              title="查看"
              :style="{marginRight: '10px'}"
              @click.prevent.stop="showView('detail', {
                ...scope.row
              })"
              v-if="true || $_hasOperation($options.name,'detail')">
              <i class="iconfont icon-xiangqing" style="fontSize: 20px; color: #2573f1"/>
          </el-button>
            <el-button
              type="text"
              size="small"
              title="删除"
              @click.prevent.stop="showView('del', {
                ...scope.row
              })"
              v-if="true || ($_hasOperation($options.name,'edit'))">
              <i class="iconfont icon-shanchu" style="fontSize: 20px; color: #FF5736"/>
          </el-button>
          </flex>
          </template>
        </page-table>
      </div>
    </div>
    <dialog-cont
      @on-cancel="dialogCancel"
      @on-confirm="dialogSubmit"
      :visible.sync="dialog.show"
      width="550px"
      :title="dialog.title"
      append-to-body
    >
      <FormItem
        ref="formItem"
        :formItems="formItems"
        :rules="formRules"
        :disabled="inputDisabled"
        :isEdit="isEdit"
        :form="form"
      />
    </dialog-cont>
  </div>
</template>

<script>
import headerTitle from 'components/adminHeaderTitle/headerTitle'
import searchForm from 'components/adminSearchForm/searchForm';
import PageTable from '@/components/adminPage-table';
import Flex from '@/components/flex';
import dialogCont from '@/components/adminDialog';
import FormItem from '@/components/adminFormItem';
import {
  getSensorTypeManagementPage,
  addSensorTypeManagement,
  updateSensorTypeManagement,
  deleteSensorTypeManagement
} from 'api/admin';
export default {
  name: 'sensorManagement',
  data () {
    return {
      searchVal: {},
      searchItems: [{
        type: 'input',
        label: '设施类型名称',
        labelWidth: '120px',
        props: {
          fieldName: 'sensorName'
        }
      }],
      // 分页
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      tableCols: [
        { label: '设施类型名称',
          prop: 'sensorName'
        },
        { label: '设施类型编码',
          prop: 'sensorCode'
        },
        { label: '备注',
          prop: 'remark'
        },
        { label: '创建人',
          prop: 'createUser'
        },
        { label: '创建时间',
          prop: 'createTime'
        },
        { label: '修改人',
          prop: 'updateUser'
        },
        { label: '修改时间',
          prop: 'updateTime'
        }
      ],
      dialog: {
        show: false,
        title: '新增产品'
      },
      selectList: [],
      inputDisabled: false,
      isEdit: true,
      form: {
      },
      formItems: [{
        label: '设施类型名称',
        prop: 'sensorName',
        inputType: 'input',
        required: true,
        span: 24
      }, {
        label: '设施类型编码',
        prop: 'sensorCode',
        inputType: 'input',
        required: true,
        span: 24
      }, {
        label: '显示顺序',
        prop: 'sortNumber',
        inputType: 'inputNumber',
        span: 24
      }, {
        label: '备注',
        prop: 'remark',
        inputType: 'input',
        span: 24
      }],
      formRules: {
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getDataAllList()
    })
  },
  components: {
    headerTitle,
    searchForm,
    PageTable,
    dialogCont,
    FormItem,
    Flex
  },
  methods: {
    // 日期选项
    onSearch (val) {
      this.searchVal = {
        ...val
      }
      this.onCurrentChange(1);
    },
    // 获取所有/查询数据列表
    getDataAllList () {
      let data = {
        data: {
          ...this.searchVal
        },
        pageNo: Number(this.page.current), // 查询的分页页码
        pageSize: Number(this.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: ''
      }
      getSensorTypeManagementPage(data).then(res => {
        if (res.code === '200') {
          const {
            data,
            total
          } = res.data;
          this.page.total = total;
          this.tableData = data;
        }
      })
    },
    // 分页切换页面
    onCurrentChange (val) {
      this.page.current = val;
      this.getDataAllList()
    },
    onPageSizeChange (val) {
      this.page.pageSize = val
      this.onCurrentChange(1)
    },
    onSelectionChange (list) {
      this.selectList = list.map(ls => ls.code);
    },
    showView (type, item) {
      switch (type) {
        case 'detail': // 关闭全部
          this.form = item;
          this.dialog.show = true;
          this.dialog.title = '更新设施';
          break;
        case 'add': // 关闭其他
          this.form = {};
          this.dialog.show = true;
          this.dialog.title = '新增设施';
          break;
        case 'del': // 关闭其他
          this.handleDel(item);
          break;
      }
    },
    handleDel (item) {
      this.$confirm('此操作将永久删除该设施类型, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let parames = this.selectList
        if (item) {
          parames = [item.code];
        }
        deleteSensorTypeManagement(parames)
          .then(res => {
            if (res.code === '200') {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                position: 'bottom-right'
              });
              this.onSearch();
            }
          })
          .catch(() => {});
      });
    },
    dialogCancel () {
      this.dialog.show = false;
      this.$refs.formItem.resetForm();
      this.inputDisabled = false;
      this.isEdit = true;
      this.form = {};
    },
    async dialogSubmit (val) {
      let apiMethod = addSensorTypeManagement;
      let message = '新增成功';
      const formData = await this.$refs.formItem.getValue();
      const param = {
        sensorCode: formData.sensorCode,
        sensorName: formData.sensorName,
        sortNumber: formData.sortNumber,
        remark: formData.remark
      };
      if (this.form.id) {
        apiMethod = updateSensorTypeManagement;
        message = '修改成功';
        param.id = this.form.id;
        param.code = this.form.code;
      }
      apiMethod(param).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message,
            type: 'success',
            position: 'bottom-right'
          });
          this.dialogCancel();
          this.onSearch();
        }
      })
    }
  }
}
</script>

<style lang="less">
#sensorManagement{}
</style>
