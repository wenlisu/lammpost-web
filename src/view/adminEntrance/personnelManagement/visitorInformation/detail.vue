<template>
  <div id="entranceVisitorInformationDetail">
    <card title="" :className="'adminCard'">
      <el-row :gutter="10">
        <el-col :span="8">
          <card title="访客信息" :className="'adminCard'">
            <FormItem
              ref="visitorFormItem"
              :formItems="visitorInfo.formItems"
              :rules="visitorInfo.formRules"
              :disabled="visitorInfo.inputDisabled"
              :isEdit="visitorInfo.isEdit"
              :form="visitorInfo.form"
              :midway="visitorInfo.midway"
              @submit="getInfo"
            >
            </FormItem>
          </card>
        </el-col>
        <el-col :span="8">
          <card title="接待信息" :className="'reception adminCard'">
            <FormItem
              ref="receptionFormItem"
              :formItems="receptionInfo.formItems"
              :rules="receptionInfo.formRules"
              :disabled="receptionInfo.inputDisabled"
              :isEdit="receptionInfo.isEdit"
              :form="receptionInfo.form"
              :midway="receptionInfo.midway"
              @submit="getReceptionInfo"
            >
              <template v-slot:employeeName>
                <div class="flexRow selectInterviewee" @click="selectInterviewee">
                  <span>{{receptionInfo.form.employeeName || ''}}</span>
                  <el-button type="text"><i class="el-icon-plus"/>选择</el-button>
                </div>
              </template>
            </FormItem>
            <div class="receptionFormItemTextMain" v-if="receptionInfo.hide">
              <FormItemText
                :layout="receptionInfo.formItemTexts"
                labelWidth="0px"
              >
              </FormItemText>
            </div>
          </card>
        </el-col>
        <el-col :span="8">
          <card title="抓拍头像" :className="'flexCloumn adminCard imgContainer'">
            <div class="flexRow imgList">
              <div class="left-img">
                <el-image
                fit="fill"
                :src="`${baseURL || config.baseURL.dev}/upload/${dialogImageUrl}`">
                </el-image>
                <!-- <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog> -->
                <el-upload
                  action="/api/fileupload/upload"
                  :on-success="handlePictureCardPreview"
                  :on-remove="handleRemove"
                  :limit="1"
                  :data="{
                    service_table: 'door_staff_info',
                    serviceCode: `${serviceCode}`
                  }">
                  <el-button type="primary" size="mini" @click="readCertificate">证件读取</el-button>
                </el-upload>
              </div>
              <div class="right-img">
                <el-image>
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <el-button type="primary" size="mini" @click="snap">抓拍</el-button>
              </div>
            </div>
            <div class="flexCloumn receptionList">
              <div class="rightHeader">
                <span>通行门禁</span>
                <el-button size="mini" class="el-icon-plus" @click="addAccessControl">添加</el-button>
              </div>
              <div class="receptionmain">
                <p
                  v-for="(item, index) in accessPermissions" 
                  :key="index">
                  <span>{{item.deviceName || ''}}</span>
                </p>
              </div>
            </div>
          </card>
        </el-col>
      </el-row>
    </card>
    <card title="历史来访记录" :className="'adminCard'">
      <page-table
        col-align="center"
        operator-width="110"
        :operator="false"
        :selection="false"
        :data="historyInfo.tableData"
        :cols="historyInfo.tableCols"
        :page-current="historyInfo.page.current"
        :total="historyInfo.page.total"
        :page-size="historyInfo.page.pageSize"
        @current-change="onCurrentChange"
        @size-change="onPageSizeChange"
      >
      </page-table>
    </card>
    <AuthEntrance
      :show="transferDialog.show"
      :select="transferDialog.select"
      :defaultTransfer="transferDialog.select.length > 0"
      @cancel="dialogCancel"
      @authEntranceSubmit="dialogSubmit"
    />
    <Interviewee
      :show="intervieweeDialog.show"
      :select="intervieweeDialog.select"
      @cancel="intervieweeCancel"
      @submit="intervieweeSubmit"
    />
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex';
import FormItem from '@/components/adminFormItem';
import FormItemText from '@/components/formItemText/formItemText';
import PageTable from '@/components/adminPage-table';
import card from 'view/lightPole/lightPoleStatistical/components/card';
import dialogCont from '@/components/adminDialog';
import AuthEntrance from '../personalInformation/authEntrance';
import Interviewee from './interviewee';
import moment from 'moment';
import config, { baseURL } from '@/config';
import {
  getBeVisitorInfo,
  saveVisitorInfoDetail,
  getVisitorInfoDetail
} from '@/api/entrance'
import { getIfExists } from '@/api'
export default {
  props: {
    initData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      config,
      baseURL,
      serviceCode:'',
      dialogImageUrl: '',
      dialogVisible: false,
      accessPermissions: [],
      intervieweeDialog: {
        title: '选择访问对象',
        show: false,
        select: [],
        data: []
      },
      transferDialog: {
        title: '人员授权',
        show: false,
        select: [],
        data: []
      },
      allDataForm: {},
      editData: {},
      visitorInfo: {
        formItems: [{
          label: '姓名',
          labelWidth: '100px',
          prop: 'visitorName',
          inputType: 'input',
          span: 24
        }, {
          label: '证件号码',
          labelWidth: '100px',
          prop: 'visitorIdentity',
          inputType: 'input',
          span: 24,
          onChange: (val) => {
            // 查看详情时不验证证件号
            if(!this.editData.visitCode) {
              this.getVisitorHistory(val)
            }
          }
        }, {
          label: '性别',
          prop: 'visitorSex',
          labelWidth: '100px',
          inputType: 'radio',
          options: [{
            id: 1,
            name: '男'
          }, {
            id: 0,
            name: '女'
          }],
          span: 24
        }, {
          label: '联系电话',
          labelWidth: '100px',
          prop: 'visitorPhone',
          inputType: 'input',
          span: 24,
          onChange: (val) => {
            this._getIfExists(val)
          }
        }, {
          label: '来访起始时间',
          labelWidth: '100px',
          prop: 'visitorBeginTime',
          inputType: 'datetimePicker',
          span: 24
        },{
          label: '来访结束时间',
          labelWidth: '100px',
          prop: 'visitorEndTime',
          inputType: 'datetimePicker',
          span: 24
        },{
          label: '来访事由',
          prop: 'visitorCause',
          labelWidth: '100px',
          inputType: 'textarea',
          maxlength: 455,
          span: 24
        },{
          label: '访客单位',
          labelWidth: '100px',
          prop: 'visitorUnit',
          inputType: 'input',
          span: 24
        },{
          label: '车牌号码',
          labelWidth: '100px',
          prop: 'carNumber',
          inputType: 'input',
          span: 24
        }],
        formRules: {
          visitorName: [{ required: true, message: '请输入来访人姓名', trigger: 'blur' }],
          visitorNum: [{ required: true, message: '请输入来访人证件号', trigger: 'blur' }],
          visitorPhone: [{ required: true, message: '请输入来访人联系电话', trigger: 'blur' }],
          visitorBeginTime: [{ required: true, message: '请输入来访起始时间', trigger: 'blur' }],
          visitorEndTime: [{ required: true, message: '请输入来访结束时间', trigger: 'blur' }],
          visitorIdentity: [{required: true, message: '请输入证件号', trigger: 'blur'}]
        },
        form: {
          visitorName: '',
          visitorIdentity: '',
          visitorSex: 1,
          visitorPhone: '',
          visitorCause: '',
          visitorUnit: '',
          carNumber: '',
          visitorBeginTime: '',
          visitorEndTime: ''
        },
        inputDisabled: false,
        isEdit: false,
        midway: true,
        validate: false,
        identityIsExists: false,
        phoneIsExists: false
      },
      receptionInfo: {
        formItems: [{
          label: '被访人',
          labelWidth: '100px',
          prop: 'employeeName',
          inputType: 'custom',
          span: 24
        }, {
          label: '联系电话',
          labelWidth: '100px',
          prop: 'employeePhone',
          inputType: 'input',
          span: 24
        }, {
          label: '公司',
          labelWidth: '100px',
          prop: 'employeeCompanyText',
          inputType: 'input',
          span: 24
        }, {
          label: '部门',
          labelWidth: '100px',
          prop: 'employeeDepartmentText',
          inputType: 'input',
          span: 24
        }],
        formItemTexts: [{
          id: 'visitStatusText',
          label: '状态',
          value: '',
          unit: '',
          span: 24
        }, {
          id: 'visitCode',
          label: '单号',
          value: '',
          unit: '',
          span: 24
        }, {
          id: 'visitorBeginTime',
          label: '来访时间',
          value: '',
          unit: '',
          span: 24
        }, {
          id: 'approveTime',
          label: '审批时间',
          value: '',
          unit: '',
          span: 24
        }],
        formRules: {
          employeeName: [{ required: true, message: '请输入被访人', trigger: 'blur' }],
          employeePhone: [{ required: true, message: '请输入被访人电话', trigger: 'blur' }],
          employeeCompanyText: [{ required: true, message: '请输入被访人公司', trigger: 'blur' }],
          employeeDepartmentText: [{ required: true, message: '请输入被访人部门', trigger: 'blur' }]
        },
        form: {
        },
        inputDisabled: false,
        isEdit: false,
        midway: true,
        hide: true,
        validate: false
      },
      historyInfo: {
        page: {
          current: 1,
          pageSize: 10,
          total: 0
        },
        tableData: [],
        tableCols: [
          { label: '登记时间',
            prop: 'visitorBeginTime',
            minWidth: '110px'
          },
          { label: '离开时间',
            prop: 'realEndTime',
            minWidth: '110px'
          },
          { label: '被访人姓名',
            prop: 'beVisitorName'
          },
          { label: '被访人公司',
            prop: 'beVisitorCompany'
          },
          { label: '被访人部门',
            prop: 'beVisitorDepartment'
          },
          { label: '来访事由',
            prop: 'visitorCause'
          },
          { label: '状态',
            prop: 'visitStatusText'
          }
        ]
      }
    };
  },
  created () {
    this.editData = this.initData
    this.init();
  },
  mounted () {
    this.$nextTick(() => {
      this.serviceCode = moment().format('YYYYMMDDHHmmss');
    });
  },
  computed: {
    ...mapGetters(['common', 'openPage'])
  },
  components: {
    card,
    FormItem,
    FormItemText,
    PageTable,
    dialogCont,
    AuthEntrance,
    Interviewee
  },
  watch: {
    accessPermissions(newVal, oldVal) {
      this.accessPermissions = newVal
    }
  },
  methods: {
    init () {
      if(this.editData.visitCode) {
        this._getVisitorInfoDetail(this.editData.visitCode)
      } else {
        this.receptionInfo.hide = false;
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(response,file) {
      console.log(response,file)
      this.dialogImageUrl = response.data.substring(response.data.lastIndexOf(':') +1 ,response.data.length);
      this.dialogVisible = true;
    },
    _getVisitorInfoDetail(code) {
      getVisitorInfoDetail(code).then(res => {
        if(res.code == '200') {
          this.visitorInfo.form = res.data
          this.$set(this.receptionInfo.form, 'employeeName', res.data.beVisitorName || '')
          this.$set(this.receptionInfo.form, 'employeePhone', res.data.beVisitedPhone || '')
          this.$set(this.receptionInfo.form, 'employeeCompanyText', res.data.beVisitorCompany || '')
          this.$set(this.receptionInfo.form, 'employeeDepartmentText', res.data.beVisitorDepartment || '')
          this.accessPermissions = res.data.list
          this.transferDialog.select = this.accessPermissions.map(item => {
            return item ? item.serialNumber : null
          })
          this.receptionInfo.formItemTexts.map((item, index) => {
            this.receptionInfo.formItemTexts[index].value = res.data[item.id] || ''
          })
          if(this.visitorInfo.form.visitorIdentity) {
            this.getVisitorHistory(this.visitorInfo.form.visitorIdentity)
          }
        }
      })
    },
    // 判断手机是否重复
    _getIfExists (val) {
      const param = {
        visitorPhone: val
      }
      getIfExists(param).then(res => {
        if(res.code == '200') {
          this.visitorInfo.phoneIsExists = false;
        } else {
          this.visitorInfo.phoneIsExists = true;
        }
      })
    },
    // 获取来访记录
    getVisitorHistory (val) {
      const params = {
        data: {
          visitorIdentity: val
        },
        pageNo: this.historyInfo.page.current,
        pageSize: this.historyInfo.page.pageSize,
        sort: ''
      }
      this.getHistoryDataAllList(params)
      if(!this.editData.visitCode) {
        getIfExists(params.data).then(res => {
          if(res.code == '200') {
            this.visitorInfo.identityIsExists = false;
          } else {
            this.visitorInfo.identityIsExists = true;
          }
        })
      }
    },
    // 证件读取
    readCertificate () {},
    // 抓拍
    snap () {
      
    },
    // 选择被访对象
    selectInterviewee () {
      this.intervieweeDialog.show = true;
    },
    // 取消选择被访对象
    intervieweeCancel () {
      this.intervieweeDialog.show = false;
    },
    // 选择被访对象
    intervieweeSubmit (info) {
      this.intervieweeDialog.show = false;
      this.receptionInfo.form = info
    },
    dialogSubmit (seletData) {
      this.transferDialog.show = false;
      let permissions = seletData.map(item => {
        if(item.nodeCode) {
          this.transferDialog.select.push(item.nodeCode)
        }
        return {
          deviceName: item.nodeName,
          serialNumber: item.nodeCode
        }
      })
      this.transferDialog.select = [...new Set(this.transferDialog.select)]
      this.accessPermissions = permissions
      console.log('select', this.transferDialog.select)
    },
    dialogCancel () {
      this.transferDialog.show = false;
    },
    // 选择权限
    addAccessControl () {
      this.transferDialog.show = true;
    },
    getInfo (form) {
      if(form) {
        this.visitorInfo.validate = true;
        Object.assign(this.allDataForm, form)
      } else {
        this.validate = form
      }
    },
    getReceptionInfo (form) {
      if(form) {
        this.receptionInfo.validate = true;
        this.allDataForm['beVisitedCode'] = form.employeeCode || ''
      } else {
        this.receptionInfo.validate = false;
      }
    },
    submitInfo () {
      this.$refs.visitorFormItem.submitForm();
      this.$refs.receptionFormItem.submitForm();
      if(this.visitorInfo.validate && this.receptionInfo.validate) {
        if(this.visitorInfo.identityIsExists) {
          this.$notify({
            title: '警告',
            message: '身份证号重复！',
            type: 'warning',
            position: 'bottom-right'
          });
        } else if(this.visitorInfo.phoneIsExists) {
          this.$notify({
            title: '警告',
            message: '手机号码重复！',
            type: 'warning',
            position: 'bottom-right'
          });
        } else {
          const params = {
          accessPermissions: this.accessPermissions,
          ...this.allDataForm,
          idPhoto: this.dialogImageUrl
          }
          return new Promise((resolve, reject) => {
            saveVisitorInfoDetail(params).then(res => {
              if(res.code == '200') {
                this.$notify({
                  title: '成功',
                  message: '新增访客成功',
                  type: 'success'
                });
                resolve(true)
              }
            })
          })
        }
      } else {
        return false
      }
    },
    // 获取所有/查询数据列表
    getHistoryDataAllList (params) {
      getBeVisitorInfo(params).then(res => {
        if (res.code === '200') {
          const {
            data,
            total
          } = res.data;
          this.historyInfo.page.total = total;
          this.historyInfo.tableData = data;
        }
      })
    },
    // 分页切换页面
    onCurrentChange (val) {
      this.historyInfo.page.current = val;
      this.getHistoryDataAllList()
    },
    onPageSizeChange (val) {
      this.historyInfo.page.pageSize = val
      this.onCurrentChange(1)
    }
  }
};
</script>

<style lang="less">
#entranceVisitorInformationDetail{
  .reception{
    .receptionFormItemTextMain{
      margin-top: 10px;/*no*/
      padding: 10px;/*no*/
      background: #dcdfe6;
    }
    .selectInterviewee {
      position: relative;
      height: 30px;/*no*/
      padding:0 46px 0 10px;/*no*/
      border-radius:4px;/*no*/
      border:1px solid #d9d9d9;/*no*/
      align-items: center;
      justify-content: space-between;
      font-size:12px;/*no*/
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(98,98,98,1);
    }
    span{
      width: 100%;
      overflow: hidden;
      word-break: keep-all;
      text-overflow:ellipsis;
      white-space: nowrap;
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
  .imgContainer{
    .imgList{
      .left-img {
        width: calc(50% - 5px);
        margin-right: 10px;
        text-align: right;
      }
      .right-img {
        width: calc(50% - 5px);
        text-align: right;
      }
      .el-image{
        width: 100%;/*no*/
        height: 200px;
        .image-slot{
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          background: #f5f7fa;
          color: #909399;
          font-size: 25px;/*no*/
        }
        &:first-child{
          margin-right: 10px;/*no*/
        }
      }
    }
    .receptionList{
      margin-top: 10px;/*no*/
      .rightHeader {
        display: flex;
        justify-content: space-between;
        .el-button {
          border: 1px dashed #DCDFE6 !important;
        }
      }
      >span{

      }
      .receptionmain{
        margin-top: 10px;/*no*/
        border: 1px solid #ccc;/*no*/
        min-height: 100px;/*no*/
      }
    }
  }
}
</style>
