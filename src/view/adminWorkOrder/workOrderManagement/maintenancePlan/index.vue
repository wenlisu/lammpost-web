<template>
  <div id="maintence-plan">
    <header-title title="设备保养计划">
      <search-form
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
        @onChange="onChange"
        :addBtnVisible="true || $_hasOperation($options.name,'add')"
        :delBtnVisible="false"
        @on-addBtn="addPlan"
      />
    </header-title>
          <!-- 表格 -->
      <div class="content-view">
        <div class="Modeltable">
          <page-table
            ref="pageTable"
            col-align="center"
            operator-width="110"
            operator
            :border="false"
            :selection="true"
            :data="tableData"
            :cols="tableCols"
            :page-current="page.current"
            :total="page.total"
            :page-size="page.pageSize"
            highlightCurrentRow
            @current-change="onCurrentChange"
            @size-change="onPageSizeChange"
            @selection-change="onSelectionChange"
            @onSelect="select"
            @selectAll="selectAll"
            @row-current-change="onRowCurrentChange"
          >
            <template
              slot-scope="scope"
              slot="operator"
            >
            <flex>
              <el-button
                type="text"
                size="small"
                title="编辑"
                :style="{marginRight: '10px'}"
                @click.prevent.stop="handleEdite({
                  ...scope.row
                })"
                v-if="true || $_hasOperation($options.name,'edit')">
                <i class="iconfont icon-bianji" style="fontSize: 20px; color: #2573f1"/>
              </el-button>
              <el-button
                type="text"
                size="small"
                title="详情"
                :style="{marginRight: '10px'}"
                @click.prevent.stop="viewDetail({
                  ...scope.row
                })"
                v-if="true || $_hasOperation($options.name,'detail')">
                <i class="iconfont icon-xiangqing" style="fontSize: 20px; color: #2573f1"/>
              </el-button>
              <el-button
                type="text"
                size="small"
                title="删除"
                @click.prevent.stop="handleDelete({
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
      @on-cancel="cancelNext"
      @on-confirm="confirmNext"
      :visible.sync="add.show"
      width="35%"
      :title="add.title"
      append-to-body
    >
      <FormItem
        ref="assign"
        :formItems="add.formItems"
        :form="add.form"
      ></FormItem>
    </dialog-cont>
  </div>
</template>

<script>
import card from 'view/lightPole/lightPoleStatistical/components/card';
import searchForm from 'components/adminSearchForm/searchForm';
import PageTable from '@/components/adminPage-table';
import headerTitle from 'components/adminHeaderTitle/headerTitle';
import FormItem from '@/components/adminFormItem';
import dialogCont from '@/components/adminDialog';
import {
  getWorkOrderStatus,
  getWorkOrderForPage,
  doBack,
  doFinish,
  doNext
} from 'api/order'
export default {
  components: {
    card,
    searchForm,
    PageTable,
    headerTitle,
    FormItem,
    dialogCont
  },
  data() {
    return {
      add: {
        title: '新增保养计划',
        show: false,
        formItems: [
          {
            label: '保养名称',
            prop: 'handleUser',
            inputType: 'input',
            required: true,
            span:12,
          },{
            label: '保养日期',
            prop: 'handleUser',
            inputType: 'dataPicker',
            required: true,
            span:12,
          },{
            label: '起始日期',
            prop: 'handleUser',
            inputType: 'dataPicker',
            required: true,
            span:12,
          },{
            label: '重复',
            prop: 'repeat',
            inputType: 'custom',
            required: true,
            span:12,
          },{
            label: '保养人员',
            prop: 'repeat',
            inputType: 'select',
            options: [],
            multiple: true,
            required: true,
            span:12,
          }
        ]
      },
      page: {
        current: 1,
        total: null,
        pageSize: null
      },
      tableData: [],
      tableCols: [
        {
          label: '保养名称',
          prop: 'orderNo'
        },{
          label: '设备名称',
          prop: 'orderTitle'
        },{
          label: '设备负责人',
          prop: 'orderStatusText'
        },{
          label: '保养人员',
          prop: 'orderTypeText'
        },{
          label: '保养人员电话',
          prop: 'orderPosition'
        },{
          label: '保养日期',
          prop: 'orderCreateTime'
        },{
          label: '起始日期',
          prop: 'faultDesc'
        },{
          label: '重复',
          prop: 'orderSendDesc'
        },{
          label: '是否禁用',
          prop: 'handleUserName'
        },{
          label: '描述',
          prop: 'handleUserName'
        }
      ],
      searchItems: [
        {
          type: 'dataPicker',
          label: '保养日期',
          props: {
            fieldName: 'orderNo'
          }
        },{
          type: 'input',
          label: '保养名称',
          props: {
            fieldName: 'location'
          }
        },{
          type: 'input',
          label: '设备名称',
          props: {
            fieldName: 'location'
          }
        },{
          type: 'input',
          label: '设备负责人',
          props: {
            fieldName: 'location'
          }
        },{
          type: 'input',
          label: '保养人员',
          props: {
            fieldName: 'location'
          }
        }
      ],
      selectsList: []
    }
  },
  created() {
    this._getWorkOrderStatus()
  },
  methods: {
    handleEdite (row) {},
    viewDetail (row) {},
    handleDelete (row) {},
    addPlan () {},
    onSearch (val) {
      this.searchVal = {
        ...val,
        activateStatus: val && val.activateStatus && +val.activateStatus
      };
      this.onCurrentChange(1);
    },
    onCurrentChange (val) {
      this.page.current = val;
      this.getDataAllList()
    },
    onChange () {},
    getDataAllList () {
      let data = {
        data: {
          ...this.searchVal,
          productNo: this.statisticsProduct !== '-1' ? this.statisticsProduct : null
        },
        pageNo: Number(this.page.current), // 查询的分页页码
        pageSize: Number(this.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: ''
      }
      getWorkOrderForPage(data).then(res => {
        if (res.code === '200') {
          const {
            data,
            total
          } = res.data;
          this.page.total = total;
          this.tableData = data;
          console.log('data', this.tableData)
        }
      })
    },
    onPageSizeChange (val) {
      this.page.pageSize = val
      this.onCurrentChange(1)
    },
    select(obj) {
      if (obj.selection.length > 1) {
        let del_row = obj.selection.shift()
        this.selectsList = obj.selection
        this.$refs.pageTable.$refs.pageTable.toggleRowSelection(del_row, false)
      } else {
        this.selectsList = obj.selection
      }
    },
    selectAll(selection){
      if (selection.length > 1) {
        selection.length = 1
      }
      this.selectsList = obj.selection
    },
    onRowCurrentChange () {},
    onSelectionChange () {}
  }
}
</script>

<style lang="less">
#maintence-plan {
}
</style>