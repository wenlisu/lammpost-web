/* eslint-disable camelcase */
<template>
  <div id='productManagement'>
    <div v-if="routeName == 'productManagementDetail'">
      <div class="flexRow search">
        <el-input placeholder="请输入内容" v-model="searchVal" class="input-with-select">
          <div slot="append">
            <el-button icon="el-icon-search" @click="onSearch">查询</el-button>
          </div>
        </el-input>
        <el-button icon="el-icon-plus" @click="creatProduct({})">创建产品</el-button>
      </div>
      <Main
        :tableData="tableData"
        :page="page"
        @onCurrentChange="onCurrentChange"
        @onPageSizeChange="onPageSizeChange"
        @creatProduct="creatProduct"
        @delProduct="delProduct"
        @goProductPage="goProductPage"
      />
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
          :midway="true"
        >
        <template v-slot:deviceType>
          <el-cascader
            v-model="form.deviceType"
            :options="options"
            :props="{ expandTrigger: 'hover' }"
            @change="handleOptionsChange"></el-cascader>
        </template>
        </FormItem>
      </dialog-cont>
    </div>
    <div v-if="routeName == 'productManagementPage'">
      <Page />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Flex from '@/components/flex';
import FormItemText from '@/components/formItemText/formItemText';
import dialogCont from '@/components/adminDialog';
import FormItem from '@/components/adminFormItem';
import Page from './page';
import Main from './main';
import { routePush } from '@/util/util';
import {
  getDeviceProductForPage,
  getDeviceProductParam,
  deleteDeviceProduct,
  insertDeviceProduct,
  updateDeviceProduct,
  getDeviceProductDtl
} from 'api/admin';
import {
  getSensorTypeSelectList,
  getDeviceTypeSelectList
} from 'api/index';
export default {
  name: 'productManagement',
  data () {
    const validateDeviceType = (rule, value, callback) => {
      this.form.deviceCategoryNo = this.form.deviceType && this.form.deviceType[0];
      this.form.deviceTypeNo = this.form.deviceType && this.form.deviceType[1];
      if (this.form.deviceType && this.form.deviceType.length === 0) {
        return callback(new Error('设施类型不能为空'));
      }
      callback();
    };
    const validatePlatformTypeNo = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('平台类型不能为空'));
      }
      // 电信IOT
      if (value === 'CHINA_NET_LOT') {
        this.setHide([7, 8], false);
        this.setHide([9, 10, 11, 12, 13], true);
      }
      // 南向云接入
      if (value === 'SOUTH_CLOUD_IN') {
        this.setHide([7, 8, 9, 10], false);
        this.setHide([11, 12, 13], true);
      }
      // 设备直连
      if (value === 'DEVICE_CONNECTION') {
        this.setHide([11, 12, 13], false);
        this.setHide([7, 8, 9, 10], true);
      }
      callback();
    };
    return {
      validateDeviceType,
      searchVal: '',
      // 分页
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      tableCols: [
        { label: '设备编号',
          prop: 'imei'
        }
      ],
      inputDisabled: false,
      isEdit: true,
      form: {
        deviceType: [],
        deviceCategoryNo: null,
        deviceTypeNo: null,
        appId: null
      },
      options: [],
      formItems: [{
        label: '产品名称',
        prop: 'productName',
        inputType: 'input',
        required: true,
        span: 24
      }, {
        label: '设备类型',
        prop: 'deviceType',
        inputType: 'custom',
        required: true,
        span: 24
      }, {
        label: '设备类型',
        prop: 'deviceTypeNo',
        inputType: 'select',
        hide: true,
        options: [],
        required: true,
        span: 24
      }, {
        label: '产品模型',
        prop: 'noticeType',
        inputType: 'select',
        hide: true,
        required: true,
        options: [],
        span: 24
      }, {
        label: '备注',
        prop: 'remark',
        inputType: 'input',
        span: 24
      }, {
        label: '平台类型',
        prop: 'platformTypeNo',
        inputType: 'select',
        options: [],
        required: true,
        span: 24
      }, {
        label: '应用ID',
        prop: 'appId',
        inputType: 'select',
        options: [],
        required: true,
        disabled: true,
        span: 24
      }, {
        label: '应用密钥',
        prop: 'appSecret',
        inputType: 'input',
        hide: true,
        required: true,
        span: 24
      }, {
        label: 'URL',
        prop: 'appUrl',
        inputType: 'input',
        hide: true,
        required: true,
        span: 24
      }, {
        label: '登录账号',
        prop: 'userName',
        inputType: 'input',
        hide: true,
        required: true,
        span: 24
      }, {
        label: '登录密码',
        prop: 'password',
        inputType: 'input',
        hide: true,
        required: true,
        span: 24
      }, {
        label: '协议类型',
        prop: 'protocolType',
        inputType: 'select',
        hide: true,
        required: true,
        options: [],
        span: 24
      }, {
        label: '数据加密',
        prop: 'dateEncryption',
        inputType: 'select',
        hide: true,
        required: true,
        options: [],
        span: 24
      }, {
        label: '网络类型',
        prop: 'networkType',
        inputType: 'select',
        hide: true,
        required: true,
        options: [],
        span: 24
      }],
      formRules: {
        deviceType: [
          { required: true, validator: validateDeviceType, trigger: 'change' }
        ],
        platformTypeNo: [
          { required: true, validator: validatePlatformTypeNo, trigger: 'change' }
        ]
      },
      dialog: {
        id: null,
        show: false,
        title: '新增产品'
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.formItems[6].options = this.appCodes.appCodes.map(codeData => {
        return {
          name: codeData.relationName,
          id: codeData.code
        }
      });
      this.form.appId = this.appCodes.appCode
      if (this.routeName === 'productManagementDetail') {
        this.getDataAllList();
        this._getDeviceProductParam();
        this._getSensorTypeSelectList();
      }
    })
  },
  computed: {
    ...mapGetters([
      'appCodes'
    ]),
    routeName () {
      return this.$route.name
    }
  },
  components: {
    Flex,
    FormItemText,
    dialogCont,
    FormItem,
    Page,
    Main
  },
  methods: {
    changeForm (val) {
      this.form = val;
    },
    // 日期选项
    onSearch () {
      this.onCurrentChange(1);
    },
    // 获取所有/查询数据列表
    getDataAllList () {
      let data = {
        data: {
          productName: this.searchVal
        },
        pageNo: Number(this.page.current), // 查询的分页页码
        pageSize: Number(this.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: ''
      }
      getDeviceProductForPage(data).then(res => {
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
    setOptions (list) {
      return list.map(item => {
        return {
          id: item.value || item.code,
          name: item.key || item.name
        };
      })
    },
    _getSensorTypeSelectList () {
      getSensorTypeSelectList().then(async res => {
        if (res.code === '200') {
          await res.data.map(async data => {
            const children = await this._getDeviceTypeSelectList(data.code);
            this.options.push({
              value: data.code,
              label: data.name,
              children
            });
          });
        }
      });
    },
    _getDeviceTypeSelectList (code) {
      let children = [];
      children = getDeviceTypeSelectList({ manufacturerCode: '', sensorTypeCode: code }).then(async deviceRes => {
        if (deviceRes.code === '200') {
          return deviceRes.data.map(deviceData => {
            return {
              value: deviceData.code,
              label: deviceData.name
            };
          });
        }
      });
      return children;
    },
    _getDeviceProductParam () {
      getDeviceProductParam().then(async res => {
        if (res.code === '200') {
          this.formItems[2].options = await this.setOptions(res.data.deviceCategoryList);
          this.formItems[3].options = await this.setOptions(res.data.platformList);
          this.formItems[5].options = await this.setOptions(res.data.platformList);
          this.formItems[11].options = await this.setOptions(res.data.protocolList);
          this.formItems[12].options = await this.setOptions(res.data.dataEncryptionList);
          this.formItems[13].options = await this.setOptions(res.data.networkTypeList);
        }
      });
    },
    dialogCancel () {
      this.dialog.show = false;
      this.dialog.id = null;
      this.$refs.formItem.resetForm();
      this.inputDisabled = false;
      this.isEdit = true;
      this.form = {
        deviceCategoryNo: null,
        deviceTypeNo: null
      };
      this.setHide([7, 8, 9, 10, 11, 12, 13], true);
    },
    setHide (items, hide) {
      items.map(itemIndex => {
        this.formItems[itemIndex].hide = hide;
      });
    },
    async dialogSubmit (val) {
      let apiMethod = insertDeviceProduct;
      let message = '新增成功';
      const formData = await this.$refs.formItem.getValue();
      const param = {
        ...formData
      };
      delete param.deviceType;
      if (this.dialog.id) {
        apiMethod = updateDeviceProduct;
        message = '修改成功';
        param.id = this.dialog.id;
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
    },
    goProductPage (item) {
      routePush({
        title: '产品管理详情',
        name: 'productManagementPage',
        parames: {
          id: item.id
        }
      });
    },
    creatProduct ({id, inputDisabled = false}) {
      this.dialog.show = true;
      this.dialog.title = '新增产品';
      if (id) {
        this.dialog.id = id;
        this.dialog.title = '修改产品';
        this.inputDisabled = inputDisabled;
        getDeviceProductDtl(id).then(res => {
          if (res.code === '200') {
            this.form = {
              ...res.data,
              deviceType: [res.data.deviceCategoryNo, res.data.deviceTypeNo]
            }
          }
        });
      } else {

      }
    },
    delProduct (id) {
      this.$confirm('此操作将永久删除该所选产品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDeviceProduct(id).then(res => {
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
      }).catch(() => {
      });
    },
    handleOptionsChange (val) {
      console.log('val', val);
    }
  }
}
</script>

<style lang="less">
#productManagement{
  >div >.search{
    .el-input{
      width: 250px;/*no*/
      margin-right: 10px;/*no*/
      input{
        height:36px;/*no*/
        line-height: 36px !important;/*no*/
        background:rgba(255,255,255,1);
        border:1px solid rgba(211,211,211,1);/*no*/
      }
    }
    .el-input-group__append{
      overflow: hidden;
      border-color: rgba(37,115,241,1);
      background: rgba(37,115,241,1);
    }
    button{
      height: 35px;/*no*/
      background:rgba(37,115,241,1);
      color: #fff;
      padding: 10px;/*no*/
      border-radius: 0;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      i{
        font-size: 20px;
      }
    }
  }
  .main{
    margin-top: 10px;/*no*/
    .mainContainer{
      flex-wrap: wrap;
      margin-bottom: 15px;/*no*/
      .content {
        > div{
          margin: 0 0 10px 0;/*no*/
          padding: 10px;/*no*/
          background:rgba(255,255,255,1);
          box-shadow:0px 4px 6px 0px rgba(221,221,221,1);/*no*/
          cursor: pointer;
          .title{
            font-size:14px;/*no*/
            font-family:PingFangSC-Semibold,PingFang SC;
            font-weight:600;
            color:rgba(80,80,80,1);
            position: relative;
            margin-bottom: 15px;/*no*/
            span{
              padding: 1px 7px;/*no*/
              font-size:12px; /*no*/
              font-family:PingFangSC-Regular,PingFang SC;
              font-weight:400;
              color:rgba(255,255,255,1);
              background:linear-gradient(270deg,rgba(40,134,228,1) 0%,rgba(67,115,223,1) 100%);
              box-shadow:0px 2px 4px 0px rgba(107,190,238,0.5);/*no*/
              border-radius:9px;/*no*/
              margin-left: 10px;/*no*/
            }
            .tools{
              position: absolute;
              top: 50%;
              right: 0;
              transform: translateY(-50%);
              >div{
                width:18px;/*no*/
                height:18px;/*no*/
                background:rgba(240,249,255,1);
                border-radius:3px;/*no*/
                cursor: pointer;
                i{
                  font-size: 11px;/*no*/
                  color: #4171E2;
                }
                &.del{
                  margin-left: 5px;/*no*/
                  background:rgba(255,245,240,1);
                  i{
                    color: #F96B55;
                  }
                }
              }
            }
          }
          #formItemText{
            .el-form-item__content{
              color: #505050;
              font-size:12px;/*no*/
              font-family:PingFangSC-Regular,PingFang SC;
              font-weight:400;
            }
            .productTotel{
              display: inline-block;
              font-size:17px;/*no*/
              font-family:DINAlternate-Bold,DINAlternate;
              font-weight:bold;
              color:rgba(217,79,7,1);
              line-height:20px;/*no*/
              letter-spacing:1px;/*no*/
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
            }
          }
        }
        &:nth-of-type(2n) {
          .title{
            span{
              background:linear-gradient(270deg,rgba(22,168,172,1) 0%,rgba(74,202,151,1) 100%);
            }
          }
        }
      }
    }
    .el-pagination{
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
