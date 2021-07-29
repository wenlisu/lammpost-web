<template>
  <div id="entranceLimitManagement">
    <div class="entranceLimitManagementMain">
      <div class="accessSelect">
        <div class="flexCenter">
          <!-- <span style="minWidth:45px">设备：</span> -->
          <!-- <treeselect
            :value="imei"
            @input="tressSelectInput"
            @select="tressSelectSelect"
            :multiple="false"
          /> -->
          <el-tabs type="border-card" v-model="cardId">
              <el-tab-pane label="权限" name="1">
                  <div id="treeselect">
                    <Treeselect
                    v-model="imei"
                    :multiple="false"
                    :options="options"
                    :always-open="true"
                    :load-options="loadOptions"
                    :value-consists-of="'ALL'"
                    @select="tressSelectSelect"
                    :showCount="true"
                    placeholder="权限"
                    value-format="object"
                    >
                    <label slot="option-label" slot-scope="{ node, labelClassName, countClassName }" :class="labelClassName">
                        <div :class="{'title': true, [node.raw.now]: true}">{{ node.label }}</div>
                        <span v-if="node.raw && node.raw.count" :class="countClassName">({{ node.raw.now === 'imei' ? `设备数：${node.raw.count}` : `灯杆数：${node.raw.count}` }})</span>
                    </label>
                    </Treeselect>
                </div>
              </el-tab-pane>
                <el-tab-pane label="人员" name="2">
                    <div id="treeselect">
                        <Treeselect
                        v-model="imei"
                        :multiple="false"
                        :options="options"
                        :always-open="true"
                        :load-options="loadOptions"
                        :value-consists-of="'ALL'"
                        @select="tressSelectSelect"
                        :showCount="true"
                        placeholder="人员"
                        value-format="object"
                        >
                        <label slot="option-label" slot-scope="{ node, labelClassName, countClassName }" :class="labelClassName">
                            <div :class="{'title': true, [node.raw.now]: true}">{{ node.label }}</div>
                            <span v-if="node.raw && node.raw.count" :class="countClassName">({{ node.raw.now === 'imei' ? `设备数：${node.raw.count}` : `灯杆数：${node.raw.count}` }})</span>
                        </label>
                        </Treeselect>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
      </div>
      <div class="flexCloumn equipmentSelect">
        <div class="listInfo flexCloumn" v-if="cardId === '1'">
          <div class="flexCloumn listItem">
            <span class="addBtn" @click="addLimit">新增权限</span>
            <FormItemText
                :layout="limitInfo.formItems"
                labelWidth="0px"
            >
            </FormItemText>
          </div>
          <div class="listItem">
            <div class="listTitle">选择人员</div>
            <el-transfer
            filterable
            v-model="deviceSelect"
            :data="deviceData"
            :titles="['待选人员列表', '已选人员列表']"
            ></el-transfer>
          </div>
        </div>
        <div class="listInfo flexCloumn" v-if="cardId === '2'">
          <div class="flexRow listItem personalItem">
            <el-image :src="''"></el-image>
            <FormItemText
                :layout="personalInfo.formItems"
                labelWidth="0px"
            >
            </FormItemText>
          </div>
          <div class="listItem">
            <div class="listTitle">选择权限</div>
            <el-transfer
            filterable
            v-model="deviceSelect"
            :data="deviceData"
            :titles="['待选权限列表', '已选权限列表']"
            ></el-transfer>
          </div>
        </div>
        <div class="flexRow flexCenter btnList">
          <el-button
              type="text"
              size="small"
              title="取消"
              :style="{marginRight: '10px'}"
              @click.prevent.stop="handleCancel"
              >
              取消
          </el-button>
          <el-button
              type="primary"
              size="small"
              title="保存"
              @click.prevent.stop="handleSave"
              >
              保存
          </el-button>
            </div>
      </div>
    </div>
    <dialog-cont
      @on-cancel="dialogCancel"
      @on-confirm="dialogSubmit"
      :visible.sync="dialog.show"
      width="550px"
      :title="dialog.title"
      append-to-body
      customClass="entranceLimitManagementDialog"
    >
     <div>
        <FormItem
          ref="limitFormItem"
          :formItems="dialog.formItems"
          :rules="dialog.formRules"
          :disabled="dialog.inputDisabled"
          :isEdit="dialog.isEdit"
          :form="dialog.form"
          :midway="dialog.midway"
        >
        </FormItem>
      </div>
    </dialog-cont>
  </div>
</template>
<script>
import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect';
import Flex from '@/components/flex';
import FormItemText from '@/components/formItemText/formItemText';
import FormItem from '@/components/adminFormItem';
import dialogCont from '@/components/adminDialog';
import {
  getGroupPolicy,
  getLamp
} from 'api/index';
import {
  getAddress,
  getSingAddress
} from 'api/controlStrategy';
import {
  getTerminalTree,
  getUnBindDeviceModuleInfoForPage,
  batchBindDeviceModule
} from 'api/admin';
export default {
  name: 'entranceLimitManagement',
  components: {
    Treeselect,
    Flex,
    FormItemText,
    FormItem,
    dialogCont
  },
  data () {
    return {
      cardId: '1',
      imei: null,
      lampSelect: [],
      deviceSelect: [],
      lampData: [],
      deviceData: [],
      options: [],
      unBindDevice: [],
      limitInfo: {
        formItems: [{
          id: 'terminalName',
          label: '权限名称',
          value: '',
          unit: '',
          class: 'noBottom',
          span: 8
        }, {
          id: 'terminalName',
          label: '授权门禁点',
          value: '',
          unit: '',
          class: 'noBottom',
          span: 8
        }, {
          id: 'terminalName',
          label: '门禁时间段',
          value: '',
          unit: '',
          class: 'noBottom',
          span: 8
        }]
      },
      personalInfo: {
        formItems: [{
          id: 'terminalName',
          label: '姓名',
          value: '',
          unit: '',
          span: 8
        }, {
          id: 'terminalName',
          label: '手机号码',
          value: '',
          unit: '',
          span: 8
        }, {
          id: 'terminalName',
          label: '员工编号',
          value: '',
          unit: '',
          span: 8
        }, {
          id: 'terminalName',
          label: '公司',
          value: '',
          unit: '',
          span: 8
        }, {
          id: 'terminalName',
          label: '部门',
          value: '',
          unit: '',
          span: 8
        }, {
          id: 'terminalName',
          label: '卡号',
          value: '',
          unit: '',
          span: 8
        }, {
          id: 'terminalName',
          label: '授权门禁点',
          value: '',
          unit: '',
          class: 'noBottom',
          span: 24
        }]
      },
      dialog: {
        title: '新增权限',
        show: false,
        fileList: [],
        formItems: [{
          label: '权限名称',
          labelWidth: '110px',
          prop: 'ruleName',
          inputType: 'input',
          required: true,
          span: 24
        }, {
          label: '授权门禁点',
          labelWidth: '110px',
          prop: 'ruleName',
          inputType: 'select',
          required: true,
          options: [],
          span: 24
        }, {
          label: '门禁时间段',
          labelWidth: '110px',
          prop: 'ruleName',
          inputType: 'daterange',
          type: 'datetimerange',
          options: [],
          span: 24
        }, {
          label: '备注',
          labelWidth: '110px',
          prop: 'ruleName',
          inputType: 'textarea',
          span: 24
        }],
        formRules: {},
        form: {
        },
        inputDisabled: false,
        isEdit: false,
        midway: true
      }
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.getCityOptions();
      this._getUnBindDeviceModuleInfoForPage();
    });
  },
  methods: {
    getCityOptions () {
      const parames = {
        'address': '',
        'area': '',
        'city': '',
        'imei': ''
      }
      getTerminalTree(parames).then(res => {
        if (res.code === '200') {
          this.options = res.data.map(da => {
            return {
              id: da.city,
              label: da.city,
              city: da.city,
              now: 'city',
              count: da.cityTerminalCount,
              children: null
            }
          })
        }
      });
    },
    async tressSelectSelect (val, instanceId) {
      if (val.now === 'imei') {
        let children = val.children;
        if (!children) {
          children = await this.loadOptions({ action: LOAD_CHILDREN_OPTIONS, parentNode: val });
        }
        const lampSelectData = [{
          key: val.imei,
          imei: val.imei,
          label: val.label
        }];
        this.lampData = lampSelectData;
        this.lampSelect = [val.imei];
        let deviceSelect = []
        children && children.length > 0 && children.map(child => {
          if (!child) return;
          deviceSelect.push({
            key: child && child.serialNumber,
            label: child && child.label
          });
        });
        this.deviceData = this.unBindDevice.concat(deviceSelect);
        this.deviceSelect = (deviceSelect && deviceSelect.length > 0) ? deviceSelect.map(device => device.key) : [];
      }
      if (val.now === 'address') {
        const lampData = val.children.map(child => {
          return {
            key: child.imei,
            imei: child.imei,
            label: child.label
          }
        });
        this.lampData = lampData;
        this.lampSelect = [];
      }
    },
    _getUnBindDeviceModuleInfoForPage () {
      const parames = {
        data: {},
        pageNo: 1,
        pageSize: 1000
      };
      getUnBindDeviceModuleInfoForPage(parames).then(res => {
        if (res.code === '200') {
          const deviceData = res.data.data.map(data => {
            return {
              key: data.serialNumber,
              label: data.deviceModuleName
            }
          });
          this.unBindDevice = deviceData;
          this.deviceData = deviceData;
        }
      })
    },
    _getTerminalTree (parames) {
      return getTerminalTree(parames).then(res => {
        if (res.code === '200') {
          return res.data;
        }
      });
    },
    async loadOptions ({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        if (!parentNode.area) {
          const areaParames = {
            city: parentNode.city,
            cityCode: parentNode.cityCode
          }
          const areaOption = await this._getTerminalTree(areaParames);
          parentNode.children = areaOption.map(item => {
            return {
              city: parentNode.city,
              area: item.area,
              now: 'area',
              count: item.areaTerminalCount,
              id: item.area,
              label: item.area,
              children: null
            }
          });
        }
        if (parentNode.area && !parentNode.address) {
          const addressParames = {
            city: parentNode.city,
            area: parentNode.area,
            cityCode: parentNode.cityCode,
            areaCode: parentNode.areaCode
          }
          const addressOption = await this._getTerminalTree(addressParames);
          parentNode.children = addressOption.map(item => {
            return {
              city: parentNode.city,
              area: parentNode.area,
              address: item.address,
              now: 'address',
              count: item.addressTerminalCount,
              id: item.address,
              label: item.address,
              children: null
            }
          });
        }
        if (parentNode.area && parentNode.address && !parentNode.imei) {
          const imeiParames = {
            city: parentNode.city,
            area: parentNode.area,
            cityCode: parentNode.cityCode,
            areaCode: parentNode.areaCode,
            address: parentNode.address
          }
          const imeiOption = await this._getTerminalTree(imeiParames);
          parentNode.children = imeiOption.map(item => {
            return {
              city: parentNode.city,
              area: parentNode.area,
              address: parentNode.address,
              now: 'imei',
              imei: item.imei,
              count: item.deviceModuleCount,
              id: item.imei,
              label: item.terminalName,
              children: null
            }
          });
        }
        if (parentNode.area && parentNode.address && parentNode.imei) {
          const deviceParames = {
            city: parentNode.city,
            area: parentNode.area,
            cityCode: parentNode.cityCode,
            areaCode: parentNode.areaCode,
            address: parentNode.address,
            imei: parentNode.imei
          }
          const deviceOption = await this._getTerminalTree(deviceParames);
          let children = deviceOption.map(item => {
            if (item && !item.serialNumber) {
              return;
            }
            return {
              city: parentNode.city,
              area: parentNode.area,
              address: parentNode.address,
              imei: parentNode.imei,
              now: 'device',
              ...item,
              id: item.serialNumber,
              label: item.deviceModuleName
            }
          });
          parentNode.children = children;
          return children;
        }
      }
    },
    handleSave () {
      if ((this.lampSelect.length === 0) || (this.lampSelect.length > 1)) {
        this.$notify({
          title: '失败',
          message: '请选择其中一个灯杆',
          type: 'error',
          position: 'bottom-right'
        });
        return;
      }
      const parames = {
        imei: this.lampSelect[0],
        serialNumbers: this.deviceSelect
      };
      batchBindDeviceModule(parames).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success',
            position: 'bottom-right'
          });
          this.lampSelect = [];
          this.deviceSelect = [];
          this.lampData = [];
          this.deviceData = [];
          this.getCityOptions();
          this._getUnBindDeviceModuleInfoForPage();
        }
      })
    },
    handleCancel () {
      this.lampSelect = [];
      this.deviceSelect = [];
      this.lampData = [];
    },
    addLimit () {
      this.dialog.show = true;
    },
    dialogCancel () {
      this.dialog.show = false;
      this.dialog.title = '新增人员信息';
    },
    dialogSubmit () {

    }
  }
};
</script>
<style lang="less">
#entranceLimitManagement > .entranceLimitManagementMain{
  min-height: 100%;
  // background: #fff !important;
  // padding: 20px 15px 0px !important;/*no*/
  display: flex;
  flex-direction: row;
  .accessSelect{
    flex: 2;
    max-height: 100% !important;
    padding-right: 20px;/*no*/
    >div{
      height: 100%;
      background: #fff;
      box-shadow:0px 2px 6px 0px rgba(221,222,223,0.5);/*no*/
      border-radius:4px;/*no*/
      align-items: flex-start;
      .el-tabs{
          width: 100%;
          height: 100%;
          .el-tabs__content{
              padding: 15px 0px 0px;/*no*/
              height: calc(100% - 39px);/*no*/
              .el-tab-pane{
                  height: 100%;
                  width: 100%;
              }
          }
      }
    }
    /deep/#treeselect{
      height: 100%;
      width: 100%;/*no*/
      display: inline-block;
      .vue-treeselect{
        height: 100%;
        .vue-treeselect__control{
          height: auto;
          display: flex;
          flex-direction: row;
          border-radius: 0;/*no*/
          border-left: 0;
          border-right: 0;
          background: #fff;
          border-color:#EEEEEE;/*no*/
          .vue-treeselect__value-container{
            display: flex;
            flex-direction: row;
            .vue-treeselect__single-value{
              // display: none;
              left: 50px;
              top: 50%;
              transform: translateY(-50%);
              line-height: 30px;
              z-index: 1;
              padding: 0 10px;/*no*/
            }
            .vue-treeselect__placeholder{
              position: relative;
              display: flex;
              align-items: center;
              font-size:12px;/*no*/
              font-family:PingFangSC-Regular,PingFang SC;
              font-weight:400;
              color:rgba(86,86,86,1);
            }
          }
          .vue-treeselect__input-container{
            display: flex;
            flex: 1;
            padding: 15px 10px;
            position: relative;
            input{
              height: 30px;
              padding: 0 10px;
              background:rgba(255,255,255,1);
              border-radius:5px;
              border:1px solid rgba(165,186,250,1);/*no*/
            }
          }
          .vue-treeselect__x-container{
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
        .vue-treeselect__menu-container{
          top: 70px;
          height: calc(100% - 36px);/*no*/
          .vue-treeselect__menu{
            padding: 0;
            max-height: calc(100%) !important;
            border: none;
            box-shadow: none;
            .vue-treeselect__list{
              .vue-treeselect__list-item{
                .vue-treeselect__option{
                  position: relative;
                  height: 38px;
                  .vue-treeselect__option-arrow-container{
                    width: 100%;
                    position: absolute;
                    right: 10px;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    z-index: 1111;
                    text-align: right;
                    padding: 0 20px;
                    svg{
                      width:10px;/*no*/
                      height:6px;/*no*/
                      color: #5D5D5D;
                    }
                  }
                  .vue-treeselect__label-container{
                    height: 100%;
                    .vue-treeselect__label{
                      position: relative;
                      overflow: visible;
                      >div.title{
                          display: inline-block;
                        &.city{
                          font-size:14px;
                          padding-left: 12px;
                          // border-left: 4px solid #265ACA;
                          line-height: 12px;
                          font-size:14px;
                          font-family:PingFangSC-Semibold,PingFang SC;
                          font-weight:600;
                          color:rgba(63,63,63,1);
                          line-height:20px;
                          letter-spacing:1px;/*no*/
                          position: relative;
                          &::after{
                            content: '';
                            width: 4px;
                            height:12px;
                            background: #265ACA;
                            position: absolute;
                            left: 0;
                            top: 50%;
                            transform: translateY(-50%);
                          }
                        }
                        &.area{
                          font-size:14px;
                          // padding-left: 8px;
                          &::before{
                            content: '';
                            position: absolute;
                            left: -5px;
                            top: 50%;
                            transform: translateY(-50%);
                            width:4px;
                            height:4px;
                            background:rgba(38,90,202,1);
                          }
                        }
                      }
                    }
                  }
                  &.vue-treeselect__option--selected{
                    background: #EFF7FF;
                    .vue-treeselect__label{
                      .title{
                        font-weight:600;
                        color:rgba(37,115,242,1);
                      }
                    }
                  }
                }
                &.vue-treeselect__indent-level-0{
                  border-bottom: 1px solid #EEEEEE;/*no*/
                }
              }
            }
            &::-webkit-scrollbar-track-piece {
              //滚动条凹槽的颜色，还可以设置边框属性
              background-color: #EBEBEB;
            }
            &::-webkit-scrollbar {
              //滚动条的宽度
              width: 4px;
              height: 2px;
              border-radius: 10px;
            }
            &::-webkit-scrollbar-thumb {
              //滚动条的设置
              background-color: #B6B5B5;
              background-clip: padding-box;
              min-height: 28px;
            }
            &::-webkit-scrollbar-thumb:hover {
              background-color: #B6B5B5;
            }
          }
        }
      }
    }
  }
  .equipmentSelect{
    flex: 8;
    max-height: calc(100vh - 170px) !important;
    .listInfo{
      height: calc(100% - 80px);
      .listItem{
        background:#fff;
        box-shadow:0px 2px 6px 0px rgba(221,222,223,0.5);/*no*/
        border-radius:4px;/*no*/
        padding:20px;
        padding-top:50px;
        position: relative;
        .listTitle{
          position: absolute;
          top:10px;
          left: 10px;
          font-size:14px;
          font-family:PingFangSC-Semibold,PingFang SC;
          font-weight:600;
          color:rgba(69,69,69,1);
          padding-left:8px;/*no*/
          &::before{
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width:4px;
            height:13px;
            background:rgba(38,90,202,1);
          }
        }
        #formItemText {
            flex: 1;
            .el-form-item__content{
                color: #333;
            }
        }
        &.personalItem{
            .el-image{
                width: 200px;
                margin-right: 10px;/*no*/
            }
        }
        &:first-child{
        height: auto;;
          margin-bottom: 10px;/*no*/
          padding-top: 20px;
            .addBtn{
                width: 80px;/*no*/
                font-size: 12px;/*no*/
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #fff;
                padding: 9px 15px;/*no*/
                background: #2573f1;
                margin-bottom: 10px;/*no*/
                cursor: pointer;
            }
        }
        &:last-child{
            flex: 1;
            height: calc(50% - 5px);
        }
      }
    }
    .el-transfer{
      height: 100%;
      margin-bottom: 20px;/*no*/
      display: flex;
      justify-content: space-between;
      .el-transfer__buttons{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0 15px;/*no*/
        button{
          margin-bottom: 0;
          margin-left: 0;
          border-radius:5px;
          padding: 0;
          width: 34px;/*no*/
          height: 34px;/*no*/
          &:first-child{
            margin-bottom: 12px;/*no*/
          }
          &.el-button--primary{
            background:linear-gradient(135deg,rgba(52,142,247,1) 0%,rgba(91,170,241,1) 100%);
            box-shadow:0px 2px 4px 0px rgba(170,195,229,1);/*no*/
          }
          &.is-disabled{
            border: none;
            background:rgba(255,255,255,1);
            box-shadow:0px 1px 4px 0px rgba(201,201,201,1);/*no*/
            i{
              color: #CACACA;
            }
          }
        }
      }
      .el-transfer-panel{
        width: 50%;
        height: 100%;
        border-color: #C4D1F5;
        .el-transfer-panel__header{
          border-color: #C4D1F5;
          .el-checkbox__input{
            .el-checkbox__inner{
              width: 16px;/*no*/
              height: 16px;/*no*/
              &::after{
                height: 8px;/*no*/
                width: 4px;/*no*/
                left: 4px;/*no*/
                top: 1px;/*no*/
              }
            }
            &.is-checked{
              .el-checkbox__inner{
                background-color: #086ACE;
                border-color: #086ACE;
              }
            }
          }
          .el-checkbox__label{
            font-size:14px;
            font-family:PingFangSC-Semibold,PingFang SC;
            font-weight:600;
            color:rgba(86,86,86,1);
            span{
              padding: 2px 7px;/*no*/
              background:rgba(85,183,103,1);
              border-radius:50px;/*no*/
              font-size:12px;/*no*/
              font-family:PingFangSC-Semibold,PingFang SC;
              font-weight:600;
              color:rgba(255,255,255,1);
              line-height:1;/*no*/
              text-shadow:2px 2px 4px rgba(71,120,57,1);/*no*/
            }
          }
        }
        .el-transfer-panel__body {
          height: calc(100% - 40px);/*no*/
          .el-transfer-panel__filter{
            border-radius:15px;
            width:100%;/*no*/
            margin: 10px 0;/*no*/
            padding:0 10px;
            text-align: right;
            &:after {
              content: '\20';
              display: block;
              height: 0;
              clear: both;
              visibility: hidden;
              overflow: hidden;
            }
            input{
              background:rgba(249,249,249,1);
              width:176px;/*no*/
              height:26px;/*no*/
              border:1px solid rgba(209,209,209,1);
              // float: right;
            }
            .el-input__prefix{
              left: auto;
              right: 154px;/*no*/
              i{
                display: flex;
                align-items: center;
                justify-content: center;
                margin-left: 0;
                color: #4277D1;
              }
            }
          }
          .el-checkbox-group{
            height: calc(100% - 45px);/*no*/
            padding:0 5px 10px 10px;/*no*/
            margin-right: 5px;
            .el-transfer-panel__item{
              border-radius:2px;/*no*/
              border:1px solid rgba(232,230,230,1);/*no*/
              padding-left: 10px;/*no*/
              margin: 0 0 10px 0;/*no*/
              &:last-child{
                margin-bottom: 0;
              }
              .el-checkbox__input{
                .el-checkbox__inner{
                  width: 11px;/*no*/
                  height: 11px;/*no*/
                  &::after{
                    left: 3px;/*no*/
                    top: 0;
                  }
                }
                .el-checkbox__label{
                  font-size:12px;/*no*/
                  font-family:PingFangSC-Regular,PingFang SC;
                  font-weight:400;
                  color:rgba(62,62,62,1);
                }
              }
              &.is-checked{
                border:1px solid rgba(65,130,255,1);/*no*/
                background:rgba(224,237,255,1);
                box-shadow:0px 2px 3px 0px rgba(221,228,238,1);/*no*/
                .el-checkbox__inner{
                  background-color: #086ACE;
                  border-color: #086ACE;
                }
              }
            }
            &::-webkit-scrollbar-track-piece {
              //滚动条凹槽的颜色，还可以设置边框属性
              background-color: #EBEBEB;
            }
            &::-webkit-scrollbar {
              //滚动条的宽度
              width: 4px;
              height: 2px;
              border-radius: 10px;
            }
            &::-webkit-scrollbar-thumb {
              //滚动条的设置
              background-color: #B6B5B5;
              background-clip: padding-box;
              min-height: 28px;
            }
            &::-webkit-scrollbar-thumb:hover {
              background-color: #B6B5B5;
            }
          }
          .el-transfer-panel__empty{
            height: calc(100% - 50px);/*no*/
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size:12px;/*no*/
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(115,130,146,1);
            padding-top: 0;
            &::before{
              content: '';
              display: block;
              width: 75px;
              height: 63px;
              background: url(./images/img1.png) no-repeat center;
              background-size: cover;
              margin-bottom: 10px;
            }
          }
        }
      }
      >div{
        &:first-child{
          .el-transfer-panel__header{
            .el-checkbox__label{
              span{
                background: #19BDB3;
              }
            }
          }
        }
      }
    }
    .btnList{
        height: 70px;
        margin-top: 10px;/*no*/
        background: #fff;
        justify-content: center !important;
        align-items: center !important;
        button{
            padding: 7px 25px;/*no*/
            // background:rgba(21,27,46,1);
            border-radius:4px;/*no*/
            border:1px solid #ddd;
            color: #888;
            font-size:12px;/*no*/
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            &.el-button--primary{
                background:linear-gradient(318deg,rgba(29,91,250,1) 0%,rgba(29,144,250,1) 100%);
                color:rgba(230,236,255,1);
                border-color: #1d5bfa;
            }
        }
    }
  }
}
.entranceLimitManagementDialog{
  .el-range-editor{
    width: 100%;
    max-width: 100% !important;
  }
}
</style>

