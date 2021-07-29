<template>
  <pageMain :currentTitleList="currentTitleList" class="warmDetail">
    <card title="基本信息" class="baseInfo">
      <FormItemText :layout="baseInfoItems"/>
    </card>
    <card title="报警处理过程">
      <div class="flexCloumn content" v-if="recordData.length !== 0">
        <div
          class="infoMain"
          v-for="(item, index) in recordData"
          :key="index"
        >
          <span class="index">{{index+1}}</span>
          <div class="name">{{item.alarmUserName}}</div>
          <div class="time">{{item.alarmHandlingTime}}</div>
          <div class="info">{{item.alarmProcessDescribed}}</div>
          <div class="deleteBtn" @click="deletInfo(item.alarmDetailsCode)">
            <i class="iconfont icon-shanchu2"></i>
          </div>
        </div>
      </div>
      <div class="form marginTop">
        <el-form ref="form" :model="form" label-width="80px" label-position="left">
          <el-row>
            <el-col :span="24">
              <el-form-item label="出警人：">
                <div class="flexRow selectProduct" @click="selectUser()">
                  <span>{{form.alarmUserName ? form.alarmUserName : "请选择出警人"}}</span>
                  <el-button type="text"><i class="el-icon-plus"/>选择</el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="marginTop">
            <el-col :span="24">
              <el-form-item label="处理描述：">
                <el-input
                  type="textarea"
                  maxlength="200"
                  show-word-limit
                  placeholder="请输入内容"
                  v-model="form.alarmProcessDescribed ">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row class="marginTop marginBottom">
          <el-col :span="24" style="text-align: center;">
            <el-button type="primary" @click="addProcess">添加处理过程</el-button>
          </el-col>
        </el-row>
      </div>
    </card>
    <dialog-cont
      @on-cancel="addUserCancel"
      @on-confirm="addUserSubmit"
      :visible.sync="addUser.show"
      width="80%"
      :title="addUser.title"
      append-to-body
      :customClass="'addProductDialog'"
    >
      <search-form :searchItems="searchItems" @onSearch="onSearch" />
      <page-table
          col-align="center"
          :operator="true"
          :data="tableData"
          :cols="tableCols"
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
          :highlightCurrentRow="true"
          @handle-current-change="handleChange"
          @current-change="onCurrentChange"
          @size-change="onPageSizeChange"
        >
        </page-table>
    </dialog-cont>
  </pageMain>
</template>

<script>
import pageMain from 'components/pageMain';
import card from '@/view/lightPole/lightPoleStatistical/components/card';
import FormItemText from '@/components/formItemText/formItemText';
import dialogCont from '@/components/dialog';
import PageTable from '@/components/page-table';
import searchForm from '@/components/searchForm/searchForm';
import {
  saveAlarmCallHandleRecord,
  deleteAlarmInfo,
  getAlarmInfo,
  getAlarmCallByEventId
} from 'api/wisdomMonitor';
import { userList } from 'api/baseInfoManage/users'
export default {
  components: {
    pageMain,
    card,
    FormItemText,
    dialogCont,
    PageTable,
    searchForm
  },
  data () {
    return {
      pliceName: '',
      addUser: {
        show: false,
        title: '选择出警人',
        productNo: '',
        type: '',
        index: 0,
        productItem: {}
      },
      searchVal: {
        username: '',
        realName: '',
        sex: ''
      },
      searchItems: [
        {
          type: 'input',
          label: '用户姓名：',
          props: {
            placeholder: '请输入用户姓名',
            fieldName: 'username'
          }
        },
        {
          type: 'input',
          label: '真实姓名：',
          props: {
            placeholder: '请输入真实姓名',
            fieldName: 'realName'
          }
        },
        {
          type: 'select',
          label: '性别：',
          labelWidth: '45px',
          props: {
            fieldName: 'sex',
            placeholder: '性别选择',
            options: [
              { name: '男', id: 1 },
              { name: '女', id: 0 }
            ]
          }
        }
      ],
      tableCols: [
        { label: '出警人名称', prop: 'username' },
        { label: '出警人真实姓名', prop: 'realName' },
        { label: '性别', prop: 'sex', minWidth: '50px' },
        { label: '邮箱', prop: 'email' },
        { label: '手机号', prop: 'mobile', minWidth: '150px' }
      ],
      tableData: [],
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      recordData: [],
      form: {
        alarmUserName: '',
        alarmUserRealName: this.$store.state.user.username,
        alarmProcessDescribed: ''
      },
      routeParams: {},
      queryParames: {},
      currentTitleList: [{
        name: 'wisdomWarnMap',
        title: '智慧报警'
      },
      {
        name: 'historyWarn',
        title: '历史报警'
      },
      {
        name: 'warmDetail',
        title: '报警详情'
      }],
      baseInfoItems: [{
        id: 'deviceName',
        label: '报警设备名称',
        value: '',
        unit: '',
        span: 12
      }, {
        id: 'installAddress',
        label: '地址',
        value: '',
        unit: '',
        span: 12
      }, {
        id: 'serialNumber',
        label: 'IMEI',
        value: '',
        unit: '',
        span: 12
      }, {
        id: 'longitude',
        label: '经度',
        value: '',
        unit: '',
        span: 12
      }, {
        id: 'latitude',
        label: '纬度',
        value: '',
        unit: '',
        span: 12
      }, {
        id: 'alarmCallStatusText',
        label: '报警状态',
        value: '',
        unit: '',
        span: 12
      }, {
        id: 'callTime',
        label: '报警开始',
        value: '',
        unit: '',
        span: 12
      }, {
        id: 'finishedTime',
        label: '报警结束时间',
        value: '',
        unit: '',
        span: 12
      }, {
        id: 'callUser',
        label: '报警人',
        value: '',
        unit: '',
        span: 12
      }, {
        id: 'calUserTel',
        label: '联系电话',
        value: '',
        unit: '',
        span: 12
      }, {
        id: 'callContent',
        label: '报警详情',
        value: '',
        unit: '',
        span: 12
      }]
    }
  },
  created () {
    this.routeParams = this.$route.params;
    this.queryParames = this.$route.query;
    getAlarmCallByEventId(this.queryParames.eventId).then(res => {
      if (res.code === '200') {
        this.baseInfoItems.forEach(item => {
          item.value = res.data[item.id]
        });
      }
    })

    this.getAlarmInfo(this.queryParames.eventId)
  },
  methods: {
    // 选择出警人
    handleChange (val) {
      this.form.alarmUserName = val.realName;
    },
    onSearch (val) {
      this.searchVal = {
        username: val.username ? val.username : '',
        realName: val.realName ? val.realName : '',
        sex: val.sex ? val.sex : ''
      };
      this.getList();
    },
    onCurrentChange (val) {
      this.page.current = val;
      this.getList();
    },
    onPageSizeChange (val) {
      this.page.pageSize = val;
      this.onCurrentChange(1);
    },
    // 取消
    addUserCancel () {
      this.addUser.show = false;
    },
    // 保存
    addUserSubmit () {
      this.addUser.show = false;
    },
    // 出警人列表
    selectUser () {
      this.addUser.show = true
      this.getList()
    },
    getList () {
      const param = {
        data: this.searchVal,
        pageNo: this.page.current,
        pageSize: this.page.pageSize
      };
      userList(param).then(res => {
        const { data, total } = res.data;
        this.page.total = total;
        this.tableData = data;
      });
    },
    // 删除处理过程
    deletInfo (id) {
      deleteAlarmInfo(id).then(res => {
        if (res.code === '200') {
          this.getAlarmInfo(this.routeParams.eventId)
        }
      })
    },
    // 添加处理过程
    addProcess () {
      let params = {
        ...JSON.parse(JSON.stringify(this.form)),
        alarmEventId: this.routeParams.eventId || '',
        alarmHandlingTime: this.routeParams.handleTime || '',
        alarmStatus: 1
      }
      saveAlarmCallHandleRecord(params).then(res => {
        if (res.code === '200') {
          this.getAlarmInfo(params.alarmEventId)
        }
      })
    },
    getAlarmInfo (id) {
      getAlarmInfo(id).then(result => {
        if (result.code === '200') {
          this.recordData = result.data;
        }
      })
    }
  }
}
</script>

<style lang="less">
  .warmDetail{
    .baseInfo {margin-bottom: 10px;}
    .content{
      padding-left: 30px;/*no*/
      padding-right: 30px; /*no*/
      padding-bottom: 30px;/*no*/
      border-left:1px solid #E6E6E6;/*no*/
      margin-top: 30px;/*no*/
      margin-left: 12px;/*no*/
      .infoMain{
        padding: 10px 20px;/*no*/
        width: 100%;
        background: rgba(34, 44, 81, 0.5);
        border: 1px solid;/*no*/
        border-image: linear-gradient(136deg, rgba(160, 213, 255, 1), rgba(65, 158, 251, 1)) 1 1;
        position: relative;
        margin-bottom: 10px;/*no*/
        &::before{
          content: '';
          width:4px;/*no*/
          height: 100%;
          background: linear-gradient(180deg, #1694E4 0%, #015DD2 100%);
          border-radius: 1px;/*no*/
          position: absolute;
          left: 0px;
          top: 0;
        }
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
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          left: -45px;/*no*/
          top: 50%;
          transform: translateY(-50%);
        }
        .title{
          font-size: 16px;/*no*/
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          margin-bottom: 10px;/*no*/
          color: #fff;
        }
        .name{
          font-size: 12px;/*no*/
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          margin-bottom: 10px;/*no*/
          color: #fff;
        }
        .time{
          font-size: 12px;/*no*/
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          margin-bottom: 10px;/*no*/
          color: #fff;
        }
        .info{
          font-size: 12px;/*no*/
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #fff;
        }
        &:last-child{
          margin-bottom: 0;
        }
      }
    }
    .selectProduct{
      position: relative;
      height: 30px;/*no*/
      padding:0 46px 0 10px;/*no*/
      border-radius:4px;/*no*/
      border:1px solid #6275bf;/*no*/
      align-items: center;
      justify-content: space-between;
      font-size:12px;/*no*/
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(98,98,98,1);
      span{
        width: 100%;
        overflow: hidden;
        word-break: keep-all;
        text-overflow:ellipsis;
        white-space: nowrap;
        color: #e6ecff;
        font-size: 14px;/*no*/
      }
      button{
        font-size:12px;/*no*/
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(38,90,202,1);
        padding: 0;
        height: 100%;
        display: flex;
        align-items: center;
        position: absolute;
        top: 0;
        right: 10px;/*no*/
        i{
          font-size: 10px;/*no*/
          color: #265ACA;
        }
      }
    }
    .el-form-item__label {
      padding: 0 !important;
      line-height: 30px;
      font-size: 14px;
      color: #fff;
    }
    .form {
      padding-left: 30px;
      padding-right: 30px;
      padding-bottom: 10px;
      input.el-input__inner, .el-textarea__inner {
        color: #e6ecff;
        background: rgba(34, 44, 81, 0.5);
        border-radius: 4px;
        border: 0.013333rem solid #6275bf;
      }
      .el-textarea .el-input__count {
        color: #e6ecff;
        background: rgba(34, 44, 81, 0.5);
        position: absolute;
        font-size: 12px;
        bottom: 5px;
        right: 10px;
      }
    }
    .marginTop {
      margin-top: 20px;
    }
    .marginBottom {
      margin-bottom: 10px;
    }
  }
</style>
