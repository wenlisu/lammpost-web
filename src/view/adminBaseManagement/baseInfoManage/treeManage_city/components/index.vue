/* eslint-disable camelcase */
<template>
  <div id='equipmentList'>
    <div class="flexCloumn equipmentStatistics" v-if="false">
      <el-select v-model="statisticsProduct" placeholder="请选择" @change="productChange">
        <el-option
          v-for="item in statisticsOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <div class="flexRow info">
        <div class="flexRow">
          <div class="icon">
            <i class="iconfont icon-shebeiludeng" />
          </div>
          <div class="flexCloumn infoDetail">
            <div class="title">设备总数</div>
            <div class="number"><span>{{statistics.totalDevice}}</span>个</div>
          </div>
        </div>
          <div class="flexRow">
          <div class="icon">
            <i class="iconfont icon-dianji" />
          </div>
          <div class="flexCloumn infoDetail">
            <div class="title">激活设备</div>
            <div class="number"><span>{{statistics.activateDevice}}</span>个</div>
          </div>
        </div>
        <div class="flexRow">
          <div class="icon">
            <i class="iconfont icon-zaixian" />
          </div>
          <div class="flexCloumn infoDetail">
            <div class="title">当前在线</div>
            <div class="number"><span>{{statistics.onLine}}</span>个</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 设备管理 -->
    <header-title
      icon="iconfont icon-shouye"
      title="设备管理"
    >
      <search-form
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
        :otherBtnVisible="true"
        :otherBtnLists="[{
          label: '绑定设备',
          disabled: selectsList.length == 0,
          click: () => bindeDevice()
        }]"
      />
    </header-title>
    <Main
      :tableData="tableData"
      :page="page"
      :operationType="'bind'"
      @onCurrentChange="onCurrentChange"
      @onPageSizeChange="onPageSizeChange"
      @onSelectionChange="onSelectionChange"
      @bindSingleDev="bindSingleDev"
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
      />
    </dialog-cont>
    <dialog-cont
      @on-cancel="activeDialogCancel"
      @on-confirm="activeDialog.show = false"
      :visible.sync="activeDialog.show"
      width="550px"
      :title="'注册设备成功'"
      :bottomShow="false"
      append-to-body
    >
      <FormItem
        ref="formItem"
        :formItems="activeDialog.formItems"
        :disabled="true"
        :isEdit="false"
        :form="activeDialog.form"
      />
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
import { routePush } from '@/util/util';
// import Detail from '../equipmentDetail/index';
import Main from './main';
import {
  editDeviceToCityTree,
  getCityDeviceModuleInfoForPage,
  getDeviceModuleInfoForPage,
  getUnBindDeviceModuleInfoForPage,
  editDeviceToParkTree,
  addDeviceModuleInfo,
  updateDeviceModuleInfo,
  deleteDeviceModuleInfo,
  activeDeviceModule,
  getDeviceModuleCount,
  getProductList
} from 'api/admin';
import {
  getGroupPolicy,
  getManufacturerSelectList,
  getDeviceTypeSelectList,
  getSensorTypeSelectList
} from 'api/index';
export default {
  name: 'equipmentList',
  props: {
    nodeData: {
      type: Object,
      default: () => {}
    },
  },
  data () {
    const validateSensorTypeCode = async (rule, value, callback) => {
      if (!value) {
        return callback(new Error('设施类型不能为空'));
      }
      if (value !== this.form.sensorTypeCode) {
        this.form.sensorTypeCode = value;
      }
      const deviceTypeOptions = await this._getDeviceTypeSelectList({
        manufacturerCode: this.form.manufacturerCode,
        sensorTypeCode: value
      });
      this.$set(this.formItems[4], 'options', deviceTypeOptions);
      callback()
    };
    const validateManufacturerManageCode = async (rule, value, callback) => {
      if (!value) {
        return callback(new Error('厂商不能为空'));
      }
      if (value !== this.form.manufacturerCode) {
        this.form.manufacturerCode = value;
      }
      const deviceTypeOptions = await this._getDeviceTypeSelectList({
        manufacturerCode: value,
        sensorTypeCode: this.form.sensorTypeCode
      });
      this.$set(this.formItems[4], 'options', deviceTypeOptions);
      callback()
    };
    return {
      disableCode: '',
      searchVal: {},
      searchChangeVal: {},
      searchItems: [{
        type: 'input',
        label: '设备名称',
        props: {
          fieldName: 'deviceModuleName'
        }
      }, {
        type: 'select',
        label: '设施类型',
        labelWidth: '85px',
        props: {
          fieldName: 'sensorTypeCode',
          options: []
        },
        onChange: (val) => {
          this.onChange(val)
        }
      }, {
        type: 'select',
        label: '厂商',
        labelWidth: '45px',
        props: {
          fieldName: 'manufacturerManageCode',
          options: []
        }
      }, {
        type: 'select',
        label: '设备类型',
        props: {
          fieldName: 'deviceCode',
          options: []
        }
      }, {
        type: 'select',
        label: '激活状态',
        props: {
          fieldName: 'activateStatus',
          options: [{
            id: 0,
            name: '未激活'
          }, {
            id: 1,
            name: '已激活'
          }]
        }
      }],
      // 分页
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      selectsList: [],
      tableData: [],
      tableCols: [
        { label: 'IMEI',
          prop: 'serialNumber'
        },
        { label: '设备名称',
          prop: 'terminalName'
        },
        { label: '设施类型',
          prop: 'deviceTypeName',
          minWidth: '110px'
        },
        { label: '设备所属产品',
          prop: 'productName'
        },
        { label: '厂商名称',
          prop: 'manufacturer'
        },
        { label: '设备类型',
          prop: 'deviceName'
        },
        { label: '设备型号',
          prop: 'version'
        },
        { label: '激活状态',
          prop: 'activateStatusText'
        },
        { label: '设备关联状态',
          prop: 'bindStatusText',
          minWidth: '110px'
        },
        { label: '创建时间',
          prop: 'createTime',
          minWidth: '110px'
        }
      ],
      dialog: {
        show: false,
        title: '新增设备'
      },
      inputDisabled: false,
      isEdit: true,
      form: {
        manufacturerCode: null,
        sensorTypeCode: null
      },
      formItems: [{
        label: 'IMEI',
        prop: 'imei',
        inputType: 'input',
        required: true,
        span: 24
      }, {
        label: '设备名称',
        prop: 'deviceModuleName',
        inputType: 'input',
        required: true,
        span: 24
      }, {
        label: '所属产品',
        prop: 'productNo',
        inputType: 'select',
        required: true,
        options: [],
        span: 24
      }, {
        label: '设备型号',
        prop: 'deviceName',
        inputType: 'input',
        required: true,
        span: 24
      }, {
        label: '设备版本',
        prop: 'version',
        inputType: 'input',
        span: 24
      }, {
        label: '安装时间',
        prop: 'createTime',
        range: false,
        inputType: 'dataPicker',
        span: 24
      }, {
        label: '备注',
        prop: 'remark',
        inputType: 'input',
        span: 24
      }],
      formRules: {
        sensorTypeCode: [
          { required: true, validator: validateSensorTypeCode, trigger: 'change' }
        ],
        manufacturerCode: [
          { required: true, validator: validateManufacturerManageCode, trigger: 'change' }
        ]
      },
      activeDialog: {
        show: false,
        formItems: [{
          label: '设备ID',
          prop: 'serialNumber',
          inputType: 'input',
          span: 24
        }, {
          label: '密钥',
          prop: 'securityKey',
          inputType: 'input',
          span: 24
        }],
        form: {}
      },
      statisticsProduct: '-1',
      statisticsOptions: [],
      statistics: {
        activateDevice: 0,
        onLine: 0,
        totalDevice: 0
      }
    }
  },
  computed: {
    ...mapGetters(['common', 'openPage']),
    routeName () {
      return this.$route.name
    }
  },
  watch: {
    'nodeData.bindParkTree': {
      deep: true,
      immediate: true,
      handler: (newVal, oldVal) => {
        this.disableCode = newVal;
      }
    }
  },
  mounted () {
    this.$nextTick(async () => {
      const editData = this.$route.query;
      if (editData && editData.productNo) {
        this.statisticsProduct = editData.productNo
      }
      if (editData && editData.deviceCategoryNo) {
        this.$set(this.searchItems[1], 'initValue', editData.deviceCategoryNo);
        this.onSearch({
          sensorTypeCode: editData.deviceCategoryNo
        });
      } else {
        this.$set(this.searchItems[1], 'initValue', '');
        this.onSearch({
          sensorTypeCode: ''
        });
      }
      const deviceTypeOptions = await this._getDeviceTypeSelectList({
        manufacturerCode: '',
        sensorTypeCode: ''
      });
      this.$set(this.searchItems[3], 'props', {
        fieldName: 'deviceCode',
        options: deviceTypeOptions
      });
      getManufacturerSelectList().then(res => {
        if (res.code === '200') {
          const deviceOptions = res.data.map(data => {
            return {
              id: data.code,
              name: data.name
            }
          });
          this.$set(this.searchItems[2], 'props', {
            fieldName: 'manufacturerManageCode',
            options: deviceOptions
          });
          this.$set(this.formItems[3], 'options', deviceOptions);
        }
      });
      getSensorTypeSelectList().then(res => {
        if (res.code === '200') {
          const deviceOptions = res.data.map(data => {
            return {
              id: data.code,
              name: data.name
            }
          });
          this.$set(this.searchItems[1], 'props', {
            fieldName: 'sensorTypeCode',
            options: deviceOptions
          });
          // this.$set(this.formItems[2], 'options', deviceOptions);
        }
      });
      getProductList().then(res => {
        if (res.code === '200') {
          const statisticsOptions = res.data.map(da => {
            return {
              id: da.code,
              name: da.name
            }
          });
          this.statisticsOptions = [{
            id: '-1',
            name: '全部产品'
          }, ...statisticsOptions];
          this.$set(this.formItems[2], 'options', statisticsOptions);
        }
      });
      this.productChange('-1')
    })
  },
  components: {
    headerTitle,
    searchForm,
    PageTable,
    Flex,
    dialogCont,
    FormItem,
    Main
  },
  methods: {
    bindSingleDev (row) {
      this.bindeDevice(row)
    },
    bindeDevice (row = []) {
      let params = {
        list: row.length != 0 ? row : this.selectsList,
        address: this.nodeData.row.nodeName,
        choose: 1,
        securityUser: '',
        securityUserTel: '',
        treeNodeCode: this.nodeData.row.nodeCode
      }
      editDeviceToCityTree(params).then(res => {
        if(res.code == '200') {
          this.$notify({
            title: '成功',
            message: '绑定成功',
            type: 'success',
            position: 'bottom-right'
          });
          this.onCurrentChange(1)
        }
      })
    },
    _getDeviceTypeSelectList (data) {
      const deviceParames = {
        manufacturerCode: data.manufacturerCode,
        sensorTypeCode: data.sensorTypeCode
      };
      return getDeviceTypeSelectList(deviceParames).then(res => {
        if (res.code === '200') {
          const deviceOptions = res.data.map(data => {
            return {
              id: data.code,
              name: data.name
            }
          });
          return deviceOptions;
        }
      });
    },
    // 日期选项
    onSearch (val) {
      this.searchVal = {
        ...val,
        activateStatus: val && val.activateStatus && +val.activateStatus
      };
      this.onCurrentChange(1);
    },
    async onChange (val) {
      // if ((val.manufacturerCode !== this.searchChangeVal.manufacturerCode) || (val.sensorTypeCode !== this.searchChangeVal.sensorTypeCode)) {
        const deviceOptions = await this._getDeviceTypeSelectList({
          manufacturerCode: '',
          sensorTypeCode: val
        });
        this.$set(this.searchItems[3], 'props', {
          fieldName: 'deviceCode',
          options: deviceOptions
        });
        // this.searchChangeVal = {
        //   ...val,
        //   deviceCode: null
        // };
        // console.log(this.searchChangeVal)
      // }
    },
    // 获取所有/查询数据列表
    getDataAllList () {
      let data = {
        data: {
          ...this.searchVal,
          // productNo: this.statisticsProduct !== '-1' ? this.statisticsProduct : null,
          // parkTreeCode: this.nodeData.parkTreeCode ? this.nodeData.parkTreeCode : "",
          // bindParkTree: this.nodeData.bindParkTree
        },
        pageNo: Number(this.page.current), // 查询的分页页码
        pageSize: Number(this.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: ''
      }
      getCityDeviceModuleInfoForPage(data).then(res => {
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
      this.selectsList = list.map(ls => {
        return {
          imei: ls.imei
        }
      });
    },
    async showView ({type, row}) {
      switch (type) {
        case 'detail': // 详情
          let parames = {
            ...row,
            toName: 'equipmentList'
          };
          routePush({
            title: '设备管理详情',
            name: 'equipmentListDetail',
            parames
          });
          break;
        case 'add': // 新增
          this.form = {
            manufacturerCode: null,
            sensorTypeCode: null
          };
          this.dialog.show = true;
          this.dialog.title = '新增设备';
          break;
        case 'edit': // 编辑
          this.dialog.show = true;
          this.dialog.title = '修改设备';
          const deviceOptions = await this._getDeviceTypeSelectList({
            manufacturerCode: row.manufacturerCode || '',
            sensorTypeCode: row.sensorTypeCode || ''
          });
          this.$set(this.formItems[4], 'options', deviceOptions);
          this.form = {
            manufacturerCode: row.manufacturerCode,
            sensorTypeCode: row.sensorTypeCode,
            ...row
          };
          break;
        case 'del': // 删除
          this.handleDel();
          break;
        case 'register': // 注册
          this.register()
          break;
      }
    },
    register () {
      if (this.selectsList.length > 1) {
        this.$notify({
          title: '失败',
          message: '请选择一个设备',
          type: 'error',
          position: 'bottom-right'
        });
        return;
      }
      activeDeviceModule({serialNumber: this.selectsList[0]}).then(res => {
        if (res.code === '200') {
          this.activeDialog.show = true;
          this.activeDialog.form = res.data;
        }
      });
    },
    handleDel (item) {
      this.$confirm('此操作将永久删除该设施类型, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let parames = this.selectsList && this.selectsList.length > 0 ? this.selectsList.join(',') : '';
        if (item) {
          parames = item.id;
        }
        deleteDeviceModuleInfo(parames)
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
      this.form = {
        manufacturerCode: null,
        sensorTypeCode: null
      };
    },
    async dialogSubmit (val) {
      let apiMethod = addDeviceModuleInfo;
      let message = '新增成功';
      const formData = await this.$refs.formItem.getValue();
      const param = {
        serialNumber: formData.serialNumber,
        deviceModuleName: formData.deviceModuleName,
        productNo: formData.productNo,
        deviceCode: formData.deviceCode,
        deviceName: formData.deviceName,
        version: formData.version,
        createTime: formData.createTime,
        remark: formData.remark
      };
      if (this.form.id) {
        apiMethod = updateDeviceModuleInfo;
        param.id = this.form.id;
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
    activeDialogCancel () {
      this.activeDialog.show = false;
      this.activeDialog.form = {};
      this.onCurrentChange(this.page.current);
    },
    productChange (val) {
      this.statisticsProduct = val;
      const parames = {
        productNo: this.statisticsProduct !== '-1' ? this.statisticsProduct : null
      }
      getDeviceModuleCount(parames).then(res => {
        if (res.code === '200') {
          this.statistics = {
            activateDevice: res.data.activateDevice || 0,
            onLine: res.data.onLine || 0,
            totalDevice: res.data.totalDevice || 0
          }
        }
      });
      this.getDataAllList();
    }
  }
}
</script>

<style lang="less">
#equipmentList{
  .equipmentStatistics{
    padding: 20px;/*no*/
    background: #fff;
    margin-bottom: 10px;/*no*/
    .el-select{
      width:110px;
      min-width:110px;/*no*/
      height:30px;/*no*/
      margin-bottom: 15px;/*no*/
      input{
        background:rgba(247,252,255,1);
        border-radius:4px;/*no*/
        border:1px solid rgba(191,197,198,1);/*no*/
        font-weight:400;
        color:rgba(77,84,100,1);
        font-size:12px;/*no*/
      }
    }
    .info{
      justify-content: space-between;
      >div{
        .icon{
          width:62px;/*no*/
          height:62px;/*no*/
          background:linear-gradient(135deg,rgba(83,171,243,1) 0%,rgba(19,202,243,1) 100%);
          border-radius:11px;/*no*/
          margin-right: 20px;/*no*/
          display: flex;
          align-items: center;
          justify-content: center;
          i{
            font-size: 36px;/*no*/
            color: #fff;
          }
        }
        .infoDetail{
          justify-content: space-between;
          .title{
            font-size:14px;/*no*/
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(90,90,90,1);
            text-align:left;
            padding-right: 10px;
          }
          .number{
            font-size:12px;/*no*/
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(49,49,49,1);
            span{
              font-size:36px;/*no*/
              line-height: 36px;/*no*/
              font-family:DINAlternate-Bold,DINAlternate;
              font-weight:bold;
              color:rgba(11,152,213,1);
              margin-right: 8px;
            }
          }
        }
        &:nth-of-type(2) {
          .icon{
            background:linear-gradient(135deg,rgba(13,211,182,1) 0%,rgba(45,225,143,1) 100%);
          }
          .number{
            span{
              color: #10BFA7;
            }
          }
        }
        &:last-child {
          .icon{
            background:linear-gradient(135deg,rgba(255,173,57,1) 0%,rgba(242,187,68,1) 100%);
          }
          .number{
            span{
              color: #F99313;
            }
          }
        }
      }
    }
  }
}
</style>
