<template>
  <div id="order-detail">
    <el-tabs v-model="factiveName" @tab-click="handleClick">
      <el-tab-pane label="工单信息" name="orderInfo">
        <FormItemText
          :layout="baseItems"
          labelWidth='0px'
        >
          <template slot="relativeImg">
            <el-image
              v-for="(item, index) in baseItems[7].value"
              :key="index"
              style="width: 100px; height: 100px"
              :src="item"
              fit="fill"></el-image>
          </template>
        </FormItemText>
        <card title="处理流程">
          <div class="step-box">
            <div class="flexRow content">
              <div
                v-for="(item, index) in stepInfo"
                :key="index"
                class="infoMain"
              >
                <span class="index">{{index+1}}</span>
                <div class="title">巡检组受理工单</div>
                <div class="name">
                  <span>处理人:</span>
                  <span>{{item.handleUserName}}</span>
                </div>
                <div class="name">
                  <span>处理时间:</span>
                  <span>{{item.handleDate}}</span>
                </div>
                <div class="time">
                  <span>处理描述:</span>
                  <span>{{item.handleDesc || ''}}</span>
                </div>
                <div class="info">
                  <span>相关图片:</span>
                  <el-image
                    v-for="(item, index) in (item.handlePics ? item.handlePics : [])"
                    :key="index"
                    style="width: 100px; height: 100px"
                    :src="item"
                    fit="fill"></el-image>
                </div>
              </div>
            </div>
          </div>
        </card>
        <card title="处理内容" v-if="orderStatus !== 2">
          <el-radio-group v-model="tabBtn" style="margin-bottom: 30px;" size="mini" @change="changeTabBtn">
            <el-radio-button label="assigned">指派</el-radio-button>
            <el-radio-button label="ok">处理完成</el-radio-button>
            <el-radio-button label="back">回退</el-radio-button>
          </el-radio-group>
          <div class="assigned" v-if="tabBtn == 'assigned'">
            <FormItem
              ref="assignForm"
              :formItems="handleContent.assignedItem"
              :isEdit="handleContent.isEdit"
              :form="handleContent.okForm"
              :midway="handleContent.midway"
              :key="Math.random()"
              @submit="getTableData"
            >
              <template slot="handlePics">
                <!-- <el-upload
                  action="https://jsonplaceholder.typicode.com/posts/"
                  list-type="picture-card"
                  :on-success="handleSuccess"
                  :on-remove="handleRemove">
                  <i class="el-icon-plus"></i>
                </el-upload> -->
                <uploadFile
                  type="img"
                  uploadUrl="/api/fileupload/upload"
                  @change="val => changeUploadFile(val)"
                  :parames="{
                    service_table: 'led_policy',
                    serviceCode: `${serviceCode}1`
                  }"
                  >
                  <template v-slot:content>
                    <div class="flexCloumn flexCenter resource_img">
                      <div class="upload_img">
                        上传图片
                        <i class="el-icon-top"></i>
                      </div>
                    </div>
                  </template>
                </uploadFile>
              </template>
            </FormItem>
            <!-- <FormItem
              ref="assignForm"
              :formItems="handleContent.assignedItem"
              :isEdit="handleContent.isEdit"
              :form="handleContent.assignedForm"
              :midway="handleContent.midway"
              :key="Math.random()"
              @submit="getTableData"
            >
              <template slot="handlePics" class="relativeImg">
                <uploadFile
                  type="img"
                  uploadUrl="/api/fileupload/upload"
                  @change="val => changeUploadFile(val)"
                  :parames="{
                    service_table: 'led_policy',
                    serviceCode: `${serviceCode}1`
                  }"
                  >
                  <template v-slot:content>
                    <div class="flexCloumn flexCenter resource_img">
                      <div class="upload_img">
                        上传图片
                        <i class="el-icon-top"></i>
                      </div>
                    </div>
                  </template>
                </uploadFile>
              </template>
            </FormItem> -->
          </div>
          <div class="assigned" v-if="tabBtn == 'ok'">
            <FormItem
              ref="okForm"
              :formItems="handleContent.okItem"
              :isEdit="handleContent.isEdit"
              :form="handleContent.okForm"
              :midway="handleContent.midway"
              :key="Math.random()"
              @submit="getTableData"
            >
              <template slot="handlePics">
                <!-- <el-upload
                  action="https://jsonplaceholder.typicode.com/posts/"
                  list-type="picture-card"
                  :on-success="handleSuccess"
                  :on-remove="handleRemove">
                  <i class="el-icon-plus"></i>
                </el-upload> -->
                <uploadFile
                  type="img"
                  uploadUrl="/api/fileupload/upload"
                  @change="val => changeUploadFile(val)"
                  :parames="{
                    service_table: 'led_policy',
                    serviceCode: `${serviceCode}1`
                  }"
                  >
                  <template v-slot:content>
                    <div class="flexCloumn flexCenter resource_img">
                      <div class="upload_img">
                        上传图片
                        <i class="el-icon-top"></i>
                      </div>
                    </div>
                  </template>
                </uploadFile>
              </template>
            </FormItem>
          </div>
          <div class="assigned" v-if="tabBtn == 'back'">
            <FormItem
              ref="backForm"
              :formItems="handleContent.backItem"
              :isEdit="handleContent.isEdit"
              :form="handleContent.backForm"
              :midway="handleContent.midway"
              :key="Math.random()"
              @submit="getTableData"
            >
            </FormItem>
          </div>
          <div class="button">
            <el-button class="reset-btn" @click="handleResetForm">
              取消
            </el-button>
            <el-button
              class="submit-btn"
              type="primary"
              :disabled="$_loading"
              @click="submit"
            >
              确定
            </el-button>
          </div>
        </card>
      </el-tab-pane>
      <el-tab-pane label="相关告警" name="alarm">
        <div class="content-view">
          <div class="Modeltable">
            <page-table
              ref="pageTable"
              col-align="center"
              operator-width="110"
              :data="tableData"
              :cols="tableCols"
              :page-current="page.current"
              :total="page.total"
              :page-size="page.pageSize"
              highlightCurrentRow
              @current-change="onCurrentChange"
              @size-change="onPageSizeChange"
              @selection-change="onSelectionChange"
              @row-current-change="onRowCurrentChange"
            >
            </page-table>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import FormItemText from '@/components/formItemText/formItemText';
import card from 'view/lightPole/lightPoleStatistical/components/card';
import PageTable from '@/components/adminPage-table';
import FormItem from '@/components/adminFormItem';
import uploadFile from '@/components/upload/uploadFile';
import moment from 'moment';
import {
  doBack,
  doFinish,
  doNext,
  getWorkOrderDetail,
  getWorkOrderGroupUser
} from 'api/order'
export default {
  components: {
    FormItemText,
    card,
    PageTable,
    FormItem,
    uploadFile
  },
  mounted () {
    this.$nextTick(() => {
      this.serviceCode = moment().format('YYYYMMDDHHmmss');
    });
  },
  created() {
    this.orderStatus = this.$route.params.orderStatus
    this._getWorkOrderDetail(this.$route.params.orderNo)
    this._getWorkOrderGroupUser()
  },
  data() {
    return {
      orderStatus: '',
      pageData: {},
      serviceCode: '',
      handleContent: {
        assignedItem: [
          {
            label: '指派人员',
            prop: 'handleUser',
            inputType: 'selectTree',
            required: true,
            span: 24,
            options: [],
            value: 'node',
            normalizer: (node) => { return this.formatterNode(node)}
          },{
            label: '处理意见',
            prop: 'handleDesc',
            inputType: 'textarea',
            required: true,
            span: 24
          },{
            label: '现场图片',
            prop: 'handlePics',
            inputType: 'custom',
            required: true,
            span: 24
          }
        ],
        okItem: [
          {
            label: '处理描述',
            prop: 'handleDesc',
            inputType: 'textarea',
            required: true,
            span: 24
          },{
            label: '现场图片',
            prop: 'handlePics',
            inputType: 'custom',
            required: true,
            span: 24
          }
        ],
        backItem: [
          {
            label: '退回原因',
            prop: 'handleDesc',
            inputType: 'textarea',
            required: true,
            span: 24
          }
        ],
        isEdit: true,
        midway: true,
        assignedForm: {
          handlePics: []
        },
        okForm: {
          handlePics: []
        },
        backForm: {}
      },
      tabBtn: 'assigned',
      page: {
        current: 1,
        total: null,
        pageSize: null
      },
      tableData: [],
      tableCols: [
        {
          label: '告警编号',
          props: 'orderCode'
        },{
          label: '设备编号',
          props: 'orderTitle'
        },{
          label: '设备名称',
          props: 'orderTitle'
        },{
          label: '设备类型',
          props: 'orderTitle'
        },{
          label: '事件类型',
          props: 'orderTitle'
        },{
          label: '告警级别',
          props: 'orderTitle'
        },{
          label: '告警内容',
          props: 'orderTitle'
        },{
          label: '告警时间',
          props: 'orderTitle'
        },{
          label: '告警状态',
          props: 'orderTitle'
        }
      ],
      sactiveName: 'processing',
      factiveName: 'orderInfo',
      stepInfo: [],
      baseItems: [
        {
          id: 'orderNo',
          label: '工单编号',
          value: null,
          unit: '',
          span: 8
        },{
          id: 'orderTypeText',
          label: '工单类型',
          value: null,
          unit: '',
          span: 8
        },{
          id: 'orderTitle',
          label: '工单标题',
          value: null,
          unit: '',
          span: 8
        },{
          id: 'orderLevelText',
          label: '工单级别',
          value: null,
          unit: '',
          span: 8
        },{
          id: 'orderCreateUser',
          label: '报障人',
          value: null,
          unit: '',
          span: 8
        },{
          id: 'orderCreateTime',
          label: '报障时间',
          value: null,
          unit: '',
          span: 8
        },{
          id: 'faultDesc',
          label: '派单描述',
          value: null,
          unit: '',
          span: 8
        },{
          id: 'orderPics',
          label: '相关图片',
          value: [],
          unit: '',
          span: 8,
          custom: true
        },{
          id: 'handleUserName',
          label: '当前处理人',
          value: null,
          unit: '',
          span: 8
        },{
          id: 'pointOfTime',
          label: '要求完成时间',
          value: null,
          unit: '',
          span: 8
        }
      ]
    }
  },
  methods: {
    changeUploadFile(val) {
      switch(this.tabBtn) {
        case 'assigned':
          this.handleContent.okForm.handlePics = val.map(item => {
            return item.path
          })
          // this.handleContent.assignedForm.handlePics = val.map(item => {
          //   return item.url
          // })
          break;
        case 'ok':
          this.handleContent.okForm.handlePics = val.map(item => {
            return item.path
          })
          break;
        case 'back':
          this.handleContent.backForm = {}
          break;
      }
    },
    // 获取指派人
    _getWorkOrderGroupUser () {
      getWorkOrderGroupUser().then(res => {
        if(res.code == '200') {
          this.handleContent.assignedItem[0].options = res.data.map(item => {
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
    _getWorkOrderDetail (orderNo) {
      getWorkOrderDetail(orderNo).then(res => {
        if(res.code == '200') {
          this.pageData = res.data
          this.handleContent.assignedForm.handleDesc = res.data.handleDesc
          this.baseItems.map(item => {
            item.value = res.data[item.id] || ''
          })
          this.stepInfo = res.data.workOrderHandles
        }
      })
    },
    getTableData(form) {
      switch(this.tabBtn) {
        case 'ok':
          this.handleContent.okForm = form
        case 'assigned':
          this.handleContent.assignForm = form
        case 'back':
          this.handleContent.backForm = form
      }
      
    },
    async submit() {
      let params;
      let apiMethod;
      switch(this.tabBtn) {
        case 'ok':
          let okData = await this.$refs.okForm.getValue();
          apiMethod = doFinish
          params = {
            currentHandleIsEnd: 1,
            orderNo: this.$route.params.orderNo,
            ...okData
          }
          break;
        case 'assigned':
          let assignedData = await this.$refs.assignForm.getValue();
          apiMethod = doNext
          params = {
            currentHandleIsEnd: 0,
            handleUser: assignedData.handleUser.userName,
            handleUserName: assignedData.handleUser.userRealName,
            orderNo: this.$route.params.orderNo,
            handlePics: assignedData.handlePics,
            handleDesc: assignedData.handleDesc
          }
          break;
        case 'back':
          let backData = await this.$refs.backForm.getValue();
          apiMethod = doBack
          params = {
            currentHandleIsEnd: 0,
            orderNo: this.$route.params.orderNo,
            ...backData
          }
          break;
      }
      apiMethod(params).then(res => {
        if(res.code == '200') {
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            position: 'bottom-right'
          });
        }
      })
    },
    handleResetForm () {
      this.$_resetForm();
      this.$router.push({
        name: 'workOrder'
      });
    },
    handleSuccess(res, file, fileList) {
      console.log(res, file, fileList)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    changeTabBtn(val) {
      this.tabBtn = val
      // switch(this.tabBtn) {
      //   case 'ok':
      //     this.$refs.okForm.resetForm();
      //   case 'assigned':
      //     this.$refs.assignForm.resetForm();
      //   case 'back':
      //     this.$refs.backForm.resetForm();
      // }
    },
    handleClick(tab, event) {
      console.log(tab, event);
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
      // getDeviceModuleInfoForPage(data).then(res => {
      //   if (res.code === '200') {
      //     const {
      //       data,
      //       total
      //     } = res.data;
      //     this.page.total = total;
      //     this.tableData = data;
      //   }
      // })
    },
    onPageSizeChange (val) {
      this.page.pageSize = val
      this.onCurrentChange(1)
    },
    onSelectionChange (list) {
      this.selectsList = list
    },
    onRowCurrentChange () {},
  }
}
</script>

<style lang="less">
#order-detail {
  #formItemText {
    background: #fff;
    margin-bottom: 10px;/*no*/
    padding: 20px;
  }
  #formItemText /deep/ .el-form-item /deep/ .el-form-item__label, 
  #formItemText /deep/ .el-form-item .el-form-item__content {
    color: #5D5D5D !important;
  }
  &.mainContent {
    // background: #fff;
    height: unset;
  }
  /deep/.el-tabs__nav-wrap::after {
    background-color: unset;
  }
  .step-box {
    position: relative;
    width: 100%;
  }
  .content {
    padding-left: 30px;
    padding-right: 30px;
    padding-bottom: 30px;
    border-top: 1px solid #E6E6E6;
    margin-top: 30px;
    margin-left: 12px;
  }
  .infoMain{
    padding: 10px 20px;/*no*/
    .deleteBtn{
      width: 30px;
      height: 30px;
      border-radius: 100px;
      background: #14C3F3;
      position: absolute;
      right: 10px;
      top: 10px;
      text-align: center;
      line-height: 30px;
      cursor: pointer;
    }
    .index{
      width: 25px;/*no*/
      height: 25px;/*no*/
      background: linear-gradient(130deg, #14C3F3 0%, #206AE1 100%);
      font-size: 16px;/*no*/
      font-family: DINAlternate-Bold, DINAlternate;
      font-weight: bold;
      color: #5D5D5D;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 0;
      transform: translateY(-50%);
      border-radius: 100px;
      color: #fff;
    }
    .title{
      font-size: 16px;/*no*/
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      margin-bottom: 10px;/*no*/
      color: #5D5D5D;
    }
    .name{
      font-size: 12px;/*no*/
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      margin-bottom: 10px;/*no*/
      color: #5D5D5D;
    }
    .time{
      font-size: 12px;/*no*/
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      margin-bottom: 10px;/*no*/
      color: #5D5D5D;
    }
    .info{
      font-size: 12px;/*no*/
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #5D5D5D;
      .el-image{
        vertical-align: top;
      }
    }
    &:last-child{
      margin-bottom: 0;
    }
  }
  .button {
    text-align: center;
    margin-top: 20px;
  }
  .reset-btn {
    border: 1px solid rgba(37, 115, 241, 1);
    margin-right: 20px;
  }
  .submit-btn {
    background: rgba(37, 115, 241, 1);
  }
  .el-upload--picture-card{
    background: transparent;
    width: auto;
    height: auto;
    border-radius: 0;
    // border: 2px dashed rgba(44, 52, 58, .3) !important;
    border: none;
  }
  .resource_img {
    // margin-bottom: 10px;
    cursor: pointer;
    position: relative;
    .upload_img {
      margin: 0 auto;
      width: 113px;/*no*/
      height: 28px;/*no*/
      line-height: 28px;/*no*/
      padding-right:10px;/*no*/
      text-align: center;
      background: linear-gradient(135deg, #E9F3FF 0%, #E6F6FF 100%);
      border: 1px solid rgb(50, 109, 172);/*no*/
      border-radius: 50px;/*no*/
      font-size: 12px;/*no*/
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #2A60CD;
      position: relative;
      .el-icon-top {
        position: absolute;
        right: 19px;/*no*/
        top: 50%;
        transform: translateY(-50%);
        font-size: 14px;/*no*/
        color: #2A60CD;
        font-weight: bold;
      }
    }
  }
  .el-tabs{
    height: 100%;
    margin-top: 20px;/*no*/
    .el-tabs__header{
      border-color: #D5D5D5;
      margin-bottom: 10px;/*no*/
      .el-tabs__nav-next, .el-tabs__nav-prev {
        z-index: 1;
      }
      .el-tabs__active-bar {
        background-color: unset;
      }
      .el-tabs__nav{
        .el-tabs__item{
          width: 80px;/*no*/
          padding: unset;
          background:rgba(255,255,255,1);
          font-size:14px;/*no*/
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(69,69,69,1);
          text-align: center;
          i{
            font-size: 15px;/*no*/
            color: #A6A6A6;
          }
          &.is-active{
            background:rgba(38,90,202,1);
            color:rgba(255,255,255,1);
            border-bottom: none;
            i{
              color: #fff;
            }
          }
        }
      }
    }
    .el-tabs__content{
      height: calc(100% - 56px);/*no*/
      padding: 10px;/*no*/
      // background: #fff;
      position: relative;
      overflow:visible;
      >div.el-tab-pane{
        height: 100%;
      }
    }
  }
}
</style>