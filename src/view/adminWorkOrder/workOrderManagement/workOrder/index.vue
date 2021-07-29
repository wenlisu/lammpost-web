<template>
  <div id="work-order">
    <!-- 头部 -->
    <div class="header-wrap">
      <el-row class="info-box">
        <el-col class="flexCenter" :style="{width: `${100/5}%`}">
          <el-avatar :src="image.all"></el-avatar>
          <div class="flexCloumn">
            <div class="title">全部</div>
            <div class="num">{{statistics.totalCount}}</div>
          </div>
        </el-col>
        <el-col class="flexCenter" :style="{width: `${100/5}%`}">
          <el-avatar :src="image.handle"></el-avatar>
          <div class="flexCloumn">
            <div class="title">处理中</div>
            <div class="num">{{statistics.handleCount}}</div>
          </div>
        </el-col>
        <el-col class="flexCenter" :style="{width: `${100/5}%`}">
          <el-avatar :src="image.finish"></el-avatar>
          <div class="flexCloumn">
            <div class="title">已处理</div>
            <div class="num">{{statistics.finishCount}}</div>
          </div>
        </el-col>
        <el-col class="flexCenter" :style="{width: `${100/5}%`}">
          <el-avatar :src="image.close"></el-avatar>
          <div class="flexCloumn">
            <div class="title">已关闭</div>
            <div class="num">{{statistics.closeCount}}</div>
          </div>
        </el-col>
        <el-col class="flexCenter" :style="{width: `${100/5}%`}">
          <el-avatar :src="image.outtime"></el-avatar>
          <div class="flexCloumn">
            <div class="title">超时</div>
            <div class="num">{{statistics.delayCount}}</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 筛选栏 -->
    <header-title title="工单管理">
      <search-form
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
        @onChange="onChange"
        :addBtnVisible="false || $_hasOperation($options.name,'add')"
        :delBtnVisible="false"
        :otherBtnVisible="true"
        :otherBtnLists="[{
          label: '受理',
          disabled: selectsList.length === 0,
          click: () => _doAccept(selectsList[0])
        },{
          label: '指派',
          disabled: selectsList.length === 0,
          click: () => _doNext(selectsList[0])
        },{
          label: '催办',
          disabled: selectsList.length === 0,
          click: () => _doUrgent(selectsList[0])
        },{
          label: '处理完成',
          disabled: selectsList.length === 0,
          click: () => _doFinish(selectsList[0])
        },{
          label: '确认关闭',
          disabled: selectsList.length === 0,
          click: () => _doClose(selectsList[0])
        }]"
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
              title="受理"
              :style="{marginRight: '10px'}"
              @click.prevent.stop="_doAccept({
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
        @submit="getAssignData"
      ></FormItem>
    </dialog-cont>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex';
import headerTitle from 'components/adminHeaderTitle/headerTitle'
import searchForm from 'components/adminSearchForm/searchForm';
import PageTable from '@/components/adminPage-table';
import Flex from '@/components/flex';
import dialogCont from '@/components/adminDialog';
import FormItem from '@/components/adminFormItem';
import all from '@/common/images/workOrder/all.png';
import close from '@/common/images/workOrder/close.png'
import finish from '@/common/images/workOrder/finish.png'
import handle from '@/common/images/workOrder/handle.png'
import outtime from '@/common/images/workOrder/outtime.png'
import {
  getWorkOrderGroupUser,
  doNext,
  doUrgent,
  doFinish,
  doClose,
  doBack,
  doAccept,
  getWorkOrderStatistics,
  getWorkOrderForPage,
  getWorkOrderType,
  getWorkOrderLevel,
  getWorkOrderDelayStatus,
  getWorkOrderStatus
} from 'api/order'
export default {
  components: {
    searchForm,
    PageTable,
    Flex,
    dialogCont,
    FormItem,
    headerTitle
  },
  data() {
    return {
      image: {
        all,
        close,
        finish,
        handle,
        outtime
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
          label: '工单编号',
          prop: 'orderNo',
          minWidth: 165
        },{
          label: '工单标题',
          prop: 'orderTitle'
        },{
          label: '工单状态',
          prop: 'orderStatusText'
        },{
          label: '超时状态',
          prop: 'overTimeStatusText',
          minWidth: 100,
          render: (h, scope) => {
            if(scope.row.overTimeStatus == 1 || scope.row.overTimeStatus == 2) {
              return <div class="overTime">
                        {scope.row.overTimeStatusText}
                      </div>
            } else {
              return <div>{scope.row.overTimeStatusText}</div>
            }
            
          }
        },{
          label: '工单类型',
          prop: 'orderTypeText'
        },{
          label: '响应级别',
          prop: 'orderLevelText'
        },{
          label: '位置',
          prop: 'orderPosition'
        },{
          label: '报障人',
          prop: 'orderCreateUser'
        },{
          label: '报障时间',
          prop: 'orderCreateTime'
        },{
          label: '处理人',
          prop: 'handleUserName'
        }
      ],
      selectsList: [],
      searchItems: [{
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
              id: '-1'
            }
          ]
        },
        initValue: '-1',
      },{
        type: 'select',
        label: '工单类型',
        props: {
          fieldName: 'orderType',
          options: []
        }
      },{
        type: 'select',
        label: '响应级别',
        props: {
          fieldName: 'orderLevel',
          options: []
        }
      },{
        type: 'select',
        label: '超时状态',
        props: {
          fieldName: 'overTimeStatus',
          options: []
        }
      },{
        type: 'input',
        label: '报障人',
        props: {
          fieldName: 'createUser'
        }
      },{
        type: 'input',
        label: '处理人',
        props: {
          fieldName: 'handleUser'
        }
      }],
      statistics: {
        closeCount: 0,
        delayCount: 0,
        finishCount: 0,
        handleCount: 0,
        totalCount: 0
      }
    }
  },
  created() {
    this._getWorkOrderStatistics()
    this.onCurrentChange(1)
    this._getWorkOrderType()
    this._getWorkOrderLevel()
    this._getWorkOrderDelayStatus()
    this._getWorkOrderStatus()
  },
  methods: {
    // 工单关闭
    _doClose (row) {
      const params = {
        ...row
      }
      doClose(params).then(res => {
        if(res.code == '200') {
           this.$notify({
            title: '成功',
            message: '关闭成功',
            type: 'success',
            position: 'bottom-right'
          });
        }
        this.onCurrentChange(1)
         this.selectsList = []
      })
    },
    // 处理完成
    _doFinish (row) {
      const params = {
        ...row
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
         this.selectsList = []
      })
    },
    // 催办
    _doUrgent (row) {
      doUrgent(row.orderNo).then(res => {
        if(res.code == '200') {
           this.$notify({
            title: '成功',
            message: '催办成功',
            type: 'success',
            position: 'bottom-right'
          });
        }
        this.onCurrentChange(1)
         this.selectsList = []
      })
    },
    cancelNext () {
      this.next.show = false
    },
    // 指派到下一人
    confirmNext () {
      this.$refs.assign.submitForm();
      const params = {
        handleUser: this.next.assignedForm.handleUser.userName,
        handleUserName: this.next.assignedForm.handleUser.userRealName,
        orderNo: this.selectsList[0].orderNo
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
          this.selectsList = []
        }
      })
    },
    getAssignData (form) {
      this.next.assignedForm = form
    },
    _doNext () {
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
    // 受理工单
    _doAccept(row) {
      doAccept(row.orderNo).then(res => {
        if(res.code == '200') {
           this.$notify({
            title: '成功',
            message: '受理成功',
            type: 'success',
            position: 'bottom-right'
          });
        }
        this.onCurrentChange(1)
        this.selectsList = []
      })
    },
    // 工单级别
    _getWorkOrderLevel() {
      getWorkOrderLevel().then(res => {
        if(res.code == '200') {
          this.searchItems[3].props.options = res.data.map((item,index) => {
            return {
              name: item.value,
              id: index
            }
          })
        }
      })
    },
    // 工单类型
    _getWorkOrderType() {
      getWorkOrderType().then(res => {
        if(res.code == '200') {
          this.searchItems[2].props.options = res.data.map((item,index) => {
            return {
              name: item.value,
              id: index
            }
          })
        }
      })
    },
    // 超时状态
    _getWorkOrderDelayStatus() {
      getWorkOrderDelayStatus().then(res => {
        if(res.code == '200') {
          this.searchItems[4].props.options = res.data.map((item,index) => {
            return {
              name: item.value,
              id: index
            }
          })
        }
      })
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
    viewDetail (row) {
      this.$router.push({
        name: 'orderDetail',
        params: row
      })
    },
    handle () {},
    accept () {},
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
    onSelectionChange () {},
    _getWorkOrderStatistics() {
      getWorkOrderStatistics().then(res => {
        if(res.code == '200') {
          this.statistics = res.data
        }
      })
    }
  }
}
</script>

<style lang="less">
#work-order {
  .header-wrap {
    width: 100%;
    margin-bottom: 10px; /*no*/
    // background: #fff;
    .info-box {
      width: 100%;
      display: flex;
      justify-content: space-between;
      .el-col {
        height: 98px;
        background: #fff;
        // margin-right: 5px;
        position: relative;
        box-shadow: 1px 0px 6px 0px #E2E2E2;
        &:last-child {
          margin-right: 0;
        }
        &::after {
          content: '';
          width: 10px;
          height: 6px;
          background: #00CAE3;
          position: absolute;
          top: 10px;
          left: 0px;
        }
      }
      .el-avatar{
        width:52px;
        height:52px;
        margin-right: 20px;
      }
      .title {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #393939;
        margin-bottom: 5px;
      }
      .num {
        font-size: 28px;
        font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold;
        color: #3D3D3D;
      }
    }
  }
  .overTime::after {
    content: '';
    display: inline-block;
    width: 40px;/*no*/
    height: 26px;
    background: url(~@/common/images/workOrder/status.png);
  }
  
}
</style>