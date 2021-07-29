<template>
  <div id="alarm-manage">
    <header-title title="告警管理">
      <search-form
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
        @onChange="onChange"
        :addBtnVisible="false || $_hasOperation($options.name,'add')"
        :delBtnVisible="false"
      />
    </header-title>
          <!-- 表格 -->
    <div class="content-view">
      <div class="Modeltable">
        <page-table
          ref="pageTable"
          col-align="center"
          operator
          :operatorWidth="120"
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
              })"
              v-if="(scope.row.workOrderNo && scope.row.alarmHandleStatus == 0 || scope.row.workOrderNo && scope.row.alarmHandleStatus == 2) || $_hasOperation($options.name,'edit')">
              指派
              <!-- <i class="iconfont icon-bianji" style="fontSize: 20px; color: #2573f1"/> -->
            </el-button>
            <el-button
              type="text"
              size="small"
              title="处理完成"
              :style="{marginRight: '10px'}"
              @click.prevent.stop="viewDetail({
                ...scope.row
              })"
              v-if="false || $_hasOperation($options.name,'detail')">
              处理完成
              <!-- <i class="iconfont icon-xiangqing" style="fontSize: 20px; color: #2573f1"/> -->
            </el-button>
            <el-button
              type="text"
              size="small"
              title="创建工单"
              @click.prevent.stop="createOrder({
                ...scope.row
              })"
              v-if="(!scope.row.alarmHandleStatus == 1 && !scope.row.workOrderNo) || ($_hasOperation($options.name,'edit'))">
              创建工单
              <!-- <i class="iconfont icon-shanchu" style="fontSize: 20px; color: #FF5736"/> -->
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
      width="50%"
      :title="next.title"
      append-to-body
    >
      <FormItem
        ref="assign"
        :formItems="next.assignedItems"
        :form="next.assignedForm"
        @submit="getAssignData"
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
import Flex from '@/components/flex';
import {
  getWorkOrderGroupUser,
  getWorkOrderStatus,
  getAlarmRecordForPage,
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
    dialogCont,
    Flex
  },
  data() {
    return {
      currentRow: {},
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
          }],
        assignedForm: {}
      },
      page: {
        current: 1,
        total: null,
        pageSize: null
      },
      tableData: [],
      tableCols: [
        {
          label: '告警编号',
          prop: 'alarmNo'
        },{
          label: '设备编号',
          prop: 'serialNumber'
        },{
          label: '设备名称',
          prop: 'deviceModuleName'
        },{
          label: '设备类型',
          prop: 'deviceTypeNoText'
        },{
          label: '事件类型',
          prop: 'alarmName'
        },{
          label: '告警内容',
          prop: 'alarmContent'
        },{
          label: '告警时间',
          prop: 'alarmTime'
        },{
          label: '告警状态',
          prop: 'alarmHandleStatusText'
        },{
          label: '关联工单号',
          prop: 'workOrderNo'
        }
      ],
      searchItems: [{
          type: 'input',
          label: '告警编号',
          props: {
            fieldName: 'alarmNo'
          }
        },{
          type: 'select',
          label: '告警状态',
          props: {
            fieldName: 'handleStatus',
            options: [{
                name: '未处理',
                id: 0
              },{
                name: '已处理',
                id: 1
              },{
                name: '已关闭',
                id: 2
              }
            ]
          }
        }
      ],
      selectsList: [],
      searchVal: {}
    }
  },
  mounted () {
    this.$nextTick(() => {
      // this.$refs.pageTable.doLayout()
    })
  },
  created() {
    this.onCurrentChange(1)
  },
  methods: {
    cancelNext () {
      this.$refs.assign.cancelForm()
      this.next.show = false
      this.next.assignedForm = {}
    },
    // 指派到下一人
    confirmNext () {
      this.$refs.assign.submitForm();
      const params = {
        handleUser: this.next.assignedForm.handleUser.userName,
        handleUserName: this.next.assignedForm.handleUser.userRealName,
        orderNo: this.currentRow.workOrderNo
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
          this.next.assignedForm = {}
        }
      })
    },
    getAssignData (form) {
      this.next.assignedForm = form
    },
    _doNext (row) {
      this.currentRow = row
      this.next.show = true
      this._getWorkOrderGroupUser()
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
    createOrder (row) {
      this.$router.push({
        name: 'createOrder',
        params: {...row}
      })
    },
    handleEdite (row) {},
    viewDetail (row) {},
    handleDelete (row) {},
    addPerson () {
      this.add.show = true
    },
    onSearch (val) {
      this.searchVal = {
        ...val
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
          ...this.searchVal
        },
        pageNo: Number(this.page.current), // 查询的分页页码
        pageSize: Number(this.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: ''
      }
      getAlarmRecordForPage(data).then(res => {
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
#alarm-manage {
 
}
</style>