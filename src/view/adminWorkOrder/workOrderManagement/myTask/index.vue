<template>
  <div id="my-task">
    <header-title title="我的任务">
      <search-form
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
        @onChange="onChange"
        :addBtnVisible="false || $_hasOperation($options.name,'add')"
        :delBtnVisible="false"
        :otherBtnVisible="true"
        :otherBtnLists="[{
          label: '处理完成',
          disabled: selectsList.length === 0 || (selectsList[0].orderStatus !== 1),
          click: () => _doFinish(selectsList[0])
        },{
          label: '退回',
          disabled: selectsList.length === 0 || (selectsList[0].orderStatus !== 1),
          click: () => _doBack(selectsList[0])
        },{
          label: '指派',
          disabled: selectsList.length === 0 || (selectsList[0].orderStatus !== 1),
          click: () => _doNext(selectsList[0])
        }]"
      />
    </header-title>
          <!-- 表格 -->
      <div class="content-view">
        <div class="Modeltable">
          <page-table
            ref="pageTable"
            col-align="center"
            operator-width="120"
            operator
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
                title="指派"
                :style="{marginRight: '10px'}"
                @click.prevent.stop="_doNext({
                  ...scope.row
                }, 'row')"
                v-if="scope.row.orderStatus == 1 || scope.row.orderStatus == 0 || $_hasOperation($options.name,'edit')">
                指派
                <!-- <i class="iconfont icon-bianji" style="fontSize: 20px; color: #2573f1"/> -->
              </el-button>
              <el-button
                type="text"
                size="small"
                title="反馈"
                :style="{marginRight: '10px'}"
                @click.prevent.stop="_doFinish({
                  ...scope.row
                }, 'row')"
                v-if="scope.row.orderStatus == 1 || $_hasOperation($options.name,'detail')">
                反馈
                <!-- <i class="iconfont icon-xiangqing" style="fontSize: 20px; color: #2573f1"/> -->
              </el-button>
              <el-button
                type="text"
                size="small"
                title="退回"
                :style="{marginRight: '10px'}"
                @click.prevent.stop="_doBack({
                  ...scope.row
                }, 'row')"
                v-if="scope.row.orderStatus == 1 || $_hasOperation($options.name,'detail')">
                退回
                <!-- <i class="iconfont icon-xiangqing" style="fontSize: 20px; color: #2573f1"/> -->
              </el-button>
            </flex>
            </template>
          </page-table>
        </div>
      </div>
      <dialog-cont
        @on-cancel="cancelNext"
        @on-confirm="confirmNext"
        :visible.sync="next.show"
        width="35%"
        :title="next.title"
        append-to-body
      >
        <FormItem
          ref="assign"
          :formItems="next.assignedItems"
          :form="next.assignedForm"
          :key="Math.random()"
          @submit="getAssignData"
        ></FormItem>
      </dialog-cont>
      <dialog-cont
        @on-cancel="cancelback"
        @on-confirm="confirmback"
        :visible.sync="back.show"
        width="35%"
        :title="back.title"
        append-to-body
      >
        <FormItem
          ref="backForm"
          :formItems="back.FormItems"
          :form="back.form"
          :key="Math.random()"
        ></FormItem>
      </dialog-cont>
      <dialog-cont
        @on-cancel="cancelFinish"
        @on-confirm="confirmFinish"
        :visible.sync="finish.show"
        width="35%"
        :title="finish.title"
        append-to-body
      >
        <FormItem
          ref="finishForm"
          :formItems="finish.FormItems"
          :form="finish.form"
          :key="Math.random()"
        ></FormItem>
      </dialog-cont>
  </div>
</template>

<script>
import card from 'view/lightPole/lightPoleStatistical/components/card';
import searchForm from 'components/adminSearchForm/searchForm';
import PageTable from '@/components/adminPage-table';
import headerTitle from 'components/adminHeaderTitle/headerTitle'
import Flex from '@/components/flex';
import dialogCont from '@/components/adminDialog';
import FormItem from '@/components/adminFormItem';
import moment from 'moment';
import {
  getWorkOrderGroupUser,
  getWorkOrderStatus,
  getMyWorkOrderForPage,
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
    Flex,
    dialogCont,
    FormItem
  },
  data() {
    return {
      keyIndex: 1,
      currentRow: [],
      finish: {
        show: false,
        title: '工单反馈',
        FormItems: [
          {
            label: '处理情况',
            prop: 'handleDesc',
            inputType: 'textarea',
            required: true,
            span: 24,
          }
        ],
        form: {}
      },
      back: {
        show: false,
        title: '退回工单',
        FormItems: [
          {
            label: '退回原因',
            prop: 'handleDesc',
            inputType: 'textarea',
            required: true,
            span: 24,
          }
        ],
        form: {}
      },
      next: {
        show: false,
        title: '指派',
        assignedItems: [{
          label: '指派人员',
          prop: 'handleUser',
          value: 'node',
          inputType: 'selectTree',
          required: true,
          span: 24,
          options: [],
          normalizer: (node) => { return this.formatterNode(node)}
        },{
          label: '处理建议',
          prop: 'handleDesc',
          inputType: 'textarea',
          required: true,
          span: 24,
        }],
        assignedForm: {
          handleUser: {},
          handleDesc: ''
        }
      },
      page: {
        current: 1,
        total: null,
        pageSize: null
      },
      tableData: [],
      tableCols: [
        {
          label: '工单编号',
          prop: 'orderNo'
        },{
          label: '工单标题',
          prop: 'orderTitle'
        },{
          label: '工单状态',
          prop: 'orderStatusText'
        },{
          label: '工单类型',
          prop: 'orderTypeText'
        },{
          label: '位置',
          prop: 'orderPosition'
        },{
          label: '报警时间',
          prop: 'orderCreateTime'
        },{
          label: '报警描述',
          prop: 'faultDesc'
        },{
          label: '派单描述',
          prop: 'orderSendDesc'
        },{
          label: '登记人',
          prop: 'handleUserName'
        },{
          label: '处理人',
          prop: 'handleUserName'
        },{
          label: '处理情况',
          prop: 'handleDesc'
        }
      ],
      searchItems: [
        {
          type: 'input',
          label: '工单编号',
          props: {
            fieldName: 'orderNo'
          }
        },{
          type: 'radio',
          label: '工单状态',
          labelWidth: '70px',
          props: {
            fieldName: 'orderStatus',
            options: [
              {
                name: '全部',
                id: ''
              }
            ]
          }
        },{
          type: 'input',
          label: '位置',
          props: {
            fieldName: 'location'
          }
        }
      ],
      selectsList: []
    }
  },
  mounted () {
    this.$nextTick(() => {
      // this.$refs.pageTable.doLayout()
    })
  },
  created() {
    this._getWorkOrderStatus()
    this.onCurrentChange(1)
  },
  methods: {
    cancelback () {
      this.back.show = false
      this.next.form = {}
      if(this.selectsList.length) {
        this.$refs.pageTable.$refs.pageTable.toggleRowSelection(this.selectsList[0], false)
        this.selectsList = []
      }
    },
    async confirmback () {
      console.log(this.currentRow)
      const backData = await this.$refs.backForm.getValue();
      const params = {
        currentHandleIsEnd: 0,
        orderNo: this.selectsList[0] ? this.selectsList[0].orderNo : this.currentRow[0].orderNo,
        ...backData
      }
      doBack(params).then(res => {
        if(res.code == '200') {
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            position: 'bottom-right'
          });
          if(this.selectsList.length) {
            this.$refs.pageTable.$refs.pageTable.toggleRowSelection(this.selectsList[0], false)
            this.selectsList = []
          }
          this.onCurrentChange(1)
          this.back.show = false
        }
      })
    },
    _doBack (row, type) {
      console.log('row', row)
      this.back.show = true
      this.back.form = {}
      if(type && type == 'row') {
        this.currentRow = [{...row}]
      }
    },
    getAssignData (form) {
      this.next.assignedForm = form
    },
    cancelNext () {
      this.$refs.assign.cancelForm()
      this.next.show = false
      this.next.assignedForm = {}
      if(this.selectsList.length) {
        this.$refs.pageTable.$refs.pageTable.toggleRowSelection(this.selectsList[0], false)
        this.selectsList = []
      }
    },
    // 指派到下一人
    confirmNext () {
      this.$refs.assign.submitForm()
      const params = {
        handleUser: this.next.assignedForm.handleUser.userName,
        handleUserName: this.next.assignedForm.handleUser.userRealName,
        orderNo: this.selectsList[0] ? this.selectsList[0].orderNo : this.currentRow.orderNo
      }
      doNext(params).then(res => {
        if(res.code == '200') {
          this.next.show = false
          this.$notify({
            title: '成功',
            message: '指派成功',
            type: 'success',
            position: 'bottom-right'
          });
          this.onCurrentChange(1)
          if(this.selectsList.length) {
            this.$refs.pageTable.$refs.pageTable.toggleRowSelection(this.selectsList[0], false)
            this.selectsList = []
          }
          this.$refs.assign.resetForm()
          this.next.show = false
        }
      })
    },
    // 指派
    _doNext (row, type) {
      this.keyIndex = this.keyIndex + 1
      this.next.show = true
      this.next.assignedForm = {}
      this._getWorkOrderGroupUser()
      if(type && type == 'row') {
        this.currentRow = [{...row}]
      }
    },
    // 获取指派人
    _getWorkOrderGroupUser () {
      getWorkOrderGroupUser().then(res => {
        if(res.code == '200') {
          this.next.assignedItems[0].options = res.data.map(item => {
            return {
              userRealName: item.groupName,
              userName: item.groupCode,
              groupUserDtoList: item.groupUserDtoList
            }
          })
        }
      }) 
    },
    // treeselect 自定义键名
    formatterNode (node) {
      return {
        id: node.userName, // 键名转换，默认是label和children进行树状渲染
        label: node.userRealName,
        children: node.groupUserDtoList,
      }
    },
    cancelFinish () {
      this.finish.show = false
      this.finish.form = {}
      if(this.selectsList.length) {
        this.$refs.pageTable.$refs.pageTable.toggleRowSelection(this.selectsList[0], false)
        this.selectsList = []
      }
    },
    async confirmFinish () {
      const finishData = await this.$refs.finishForm.getValue();
      const params = {
        currentHandleIsEnd: 0,
        ...(this.selectsList[0] ? this.selectsList[0] : this.currentRow[0]),
        ...finishData

      }
      doFinish(params).then(res => {
        if(res.code == '200') {
           this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            position: 'bottom-right'
          });
        }
        this.onCurrentChange(1)
        if(this.selectsList.length) {
          this.$refs.pageTable.$refs.pageTable.toggleRowSelection(this.selectsList[0], false)
          this.selectsList = []
        }
        this.finish.show = false
      })
    },
    // 处理完成
    _doFinish (row, type) {
      this.finish.show = true
      this.finish.form = {}
      if(type && type == 'row') {
        this.currentRow = [{...row}]
      }
    },
    // 工单状态
    _getWorkOrderStatus() {
      getWorkOrderStatus().then(res => {
        if(res.code == '200') {
          this.searchItems[1].props.options = res.data.map((item,index) => {
            return {
              name: item.value,
              id: `${index}`
            }
          })
          this.searchItems[1].props.options.unshift({
            name: '全部',
            id: '-1'
          })
        }
      })
    },
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
      getMyWorkOrderForPage(data).then(res => {
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
#my-task {
  .search-wrap {
    width: 100%;
    background: #fff;
    padding: 15px;
  }
}
</style>