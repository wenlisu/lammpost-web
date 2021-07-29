/* eslint-disable camelcase */
<template>
  <div id='ruleManageEdit' >
    <card title="基本信息" :className="'adminCard'">
      <FormItem
        ref="baseFormItem"
        :formItems="baseInfo.formItems"
        :rules="baseInfo.formRules"
        :disabled="baseInfo.inputDisabled"
        :isEdit="baseInfo.isEdit"
        :form="baseInfo.form"
        :midway="baseInfo.midway"
      >
      <template v-slot:timeStatus>
        <el-radio-group
          class="radioGroup"
          v-model="baseInfo.form.timeStatus"
        >
          <el-radio
            v-for="ch in baseInfo.formItems[2].options"
            :label="ch.value || ch.id"
            :key="ch.value || ch.id"
          >
            {{ch.text || ch.name}}
          </el-radio>
        </el-radio-group>
      </template>
      <template v-slot:time>
        <el-date-picker
          v-model="baseInfo.form.time"
          type="daterange"
          range-separator="至"
          :start-placeholder="`请选择开始日期`"
          :end-placeholder="`请选择结束日期`"
          :disabled="baseInfo.timeDisabled"
        >
        </el-date-picker>
      </template>
      </FormItem>
    </card>
    <card title="触发条件" :className="'adminCard conditionCard'">
      <el-form ref="conditionform" :inline="true" :model="conditionForm" label-width="80px">
        <el-form-item label="满足条件：">
          <el-radio-group
            class="radioGroup"
            v-model="conditionForm.condition"
          >
            <el-radio
              v-for="ch in conditionForm.typeoOptions"
              :label="ch.id"
              :key="ch.id"
            >
              {{ch.name}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-for="(item, index) in conditionForm.items" :key="`conditionForm${index}`" class="conditionItems">
          <div class="flexCenter itemTittle"><i class="iconfont icon-shebeijierupingtai" /></div>
            <FormItemBase
              :formItems="[
                {
                label: '条件类型',
                prop: 'conditionType',
                inputType: 'select',
                labelWidth: '65px',
                options: [{
                  id: 1,
                  name: '指定产品触发'
                }, {
                  id: 2,
                  name: '指定设备触发'
                }, {
                  id: 3,
                  name: '定时触发'
                }],
                span: 4
              },
              ...item.formItems,
              {
                label: '',
                prop: 'action',
                inputType: 'custom',
                colClass: 'delCol',
                span: 3
              }
              ]"
              :form="item"
            >
            <template v-slot:productName>
              <div class="flexRow selectProduct" @click="selectProduct('conditionForm', index, item.productNumber)">
                <span>{{item.productName || ''}}</span>
                <el-button type="text"><i class="el-icon-plus"/>选择</el-button>
              </div>
            </template>
            <template v-slot:deviceName>
              <div class="flexRow selectProduct" @click="selectDevice('conditionForm', index, item.serialNumber)">
                <span>{{item.deviceName || ''}}</span>
                <el-button type="text"><i class="el-icon-plus"/>选择</el-button>
              </div>
            </template>
            <template v-slot:action>
              <div class="flexCenter action">
                <i class="iconfont icon-shanchu" style="fontSize: 12px; color: #0C98F2" @click="removeConditionTab('conditionForm', item, index)"/>
              </div>
            </template>
            </FormItemBase>
        </div>
        <el-button type="primary" class="flexCenter addBtn" @click="addProductItem('conditionForm')">添加条件</el-button>
      </el-form>
    </card>
    <card title="执行动作" :className="'adminCard actionsCard'">
      <el-form ref="actionsform" :inline="true" :model="actionForm" label-width="80px">
        <div v-for="(item, index) in actionForm.items" :key="`actionForm${index}`" class="actionsItems">
          <div class="flexCenter itemTittle"><i class="iconfont icon-xingzhuang2" /></div>
            <FormItemBase
              :formItems="[
              {
                label: '动作类型',
                prop: 'execute',
                inputType: 'select',
                labelWidth: '80px',
                options: [{
                  id: 1,
                  name: '下发命令'
                }, {
                  id: 2,
                  name: '上报告警'
                }, {
                  id: 4,
                  name: '发送通知'
                }],
                span: 4
              },
              ...item.formItems,
              {
                label: '',
                prop: 'action',
                inputType: 'custom',
                colClass: 'delCol',
                span: 3
              }
              ]"
              :form="item"
            >
            <template v-slot:productName>
              <div class="flexRow selectProduct"  @click="selectProduct('actionForm', index, item.productNumber)">
                <span>{{item.productName || ''}}</span>
                <el-button type="text"><i class="el-icon-plus"/>选择</el-button>
              </div>
            </template>
            <template v-slot:deviceName>
              <div class="flexRow selectProduct" @click="selectDevice('actionForm', index, item.serialNumber)">
                <span>{{item.deviceName || ''}}</span>
                <el-button type="text"><i class="el-icon-plus"/>选择</el-button>
              </div>
            </template>
            <template v-slot:userName>
              <div class="flexRow selectProduct" @click="selectObj(index)">
                <span>{{item.username ? item.username.join(',') : ''}}</span>
                <el-button type="text"><i class="el-icon-plus"/>选择</el-button>
              </div>
            </template>
            <template v-slot:action>
              <div class="flexCenter action">
                <i class="iconfont icon-shanchu" style="fontSize: 12px; color: #0C98F2" @click="removeConditionTab('actionForm', item, index)"/>
              </div>
            </template>
            </FormItemBase>
        </div>
        <el-button type="primary" class="flexCenter addBtn" @click="addProductItem('actionForm')">添加动作</el-button>
      </el-form>
    </card>
    <div class="flexRow flexCenter btnList">
      <el-button
          type="text"
          size="small"
          title="取消"
          :style="{marginRight: '10px'}"
          class="cancel"
          @click.prevent.stop="handleCancel"
          >
          取消
      </el-button>
      <el-button
          type="primary"
          size="small"
          title="保存"
          class="save"
          @click.prevent.stop="handleSave"
          >
          保存
      </el-button>
    </div>
    <dialog-cont
      @on-cancel="addProductCancel"
      @on-confirm="addProductSubmit"
      :visible.sync="addProduct.show"
      width="80%"
      :title="addProduct.title"
      append-to-body
      :customClass="'addProductDialog'"
    >
      <Main
        ref="addProductMain"
        :tableData="addProduct.tableData"
        :page="addProduct.page"
        :toolsShow="false"
        :productNo="addProduct.productNo"
        @onCurrentChange="onCurrentChange"
        @onPageSizeChange="onPageSizeChange"
        @goProductPage="selectProductPage"
      />
    </dialog-cont>
    <dialog-cont
      @on-cancel="addDeviceCancel"
      @on-confirm="addDeviceSubmit"
      :visible.sync="addDevice.show"
      width="80%"
      :title="addDevice.title"
      append-to-body
      :customClass="'addDeviceDialog'"
    >
    <div>
      <search-form
        :searchItems="addDevice.searchItems"
        @onSearch="onSearch"
        @onChange="onChange"
        />
      <deviceMain
        ref="addDeviceMain"
        :tableData="addDevice.tableData"
        :page="addDevice.page"
        :toolsShow="false"
        :selection="false"
        @onCurrentChange="onDeviceCurrentChange"
        @onPageSizeChange="onDevicePageSizeChange"
        @onRowCurrentChange="onRowCurrentChange"
      />
    </div>
    </dialog-cont>
    <dialog-cont
      @on-cancel="addObjCancel"
      @on-confirm="addObjSubmit"
      :visible.sync="addObj.show"
      width="80%"
      :title="addObj.title"
      append-to-body
      :customClass="'addObjDialog'"
    >
    <div>
      <!-- <search-form
        :searchItems="addObj.searchItems"
        @onSearch="onSearch"
        @onChange="onChange"
        /> -->
      <deviceMain
        ref="addObjMain"
        :tableData="addObj.tableData"
        :page="addObj.page"
        :tableCols="addObj.tableCols"
        :toolsShow="false"
        @onCurrentChange="onObjCurrentChange"
        @onPageSizeChange="onObjPageSizeChange"
        @onSelectionChange="onObjSelectionChange"
      />
    </div>
    </dialog-cont>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex';
import moment from 'moment';
import PageTable from '@/components/adminPage-table';
import Flex from '@/components/flex';
import searchForm from 'components/adminSearchForm/searchForm';
import Card from 'view/lightPole/lightPoleStatistical/components/card';
import FormItem from '@/components/adminFormItem';
import FormItemBase from '@/components/adminFormItem/base';
import dialogCont from '@/components/adminDialog';
import Main from '@/view/admin/equipmentAccess/productManagement/main';
import DeviceMain from '@/view/admin/equipmentManagement/equipmentList/main';
import {
  getDeviceProductForPage,
  getCapability,
  getCommandList,
  getPropertiesList,
  getDeviceModuleInfoForPage,
  deviceAddLinkage,
  deviceCapabilityLinkage,
  getLinkageUser,
  deviceUpdateLinkage,
  deviceDetailLinkage,
  deviceDeleteLinkage
} from 'api/admin';
import {
  getDeviceTypeSelectList,
  getSensorTypeSelectList,
  getManufacturerSelectList
} from 'api/index';
export const decimalTypes = [{
  id: '>',
  name: '>'
}, {
  id: '>=',
  name: '>='
}, {
  id: '=',
  name: '='
}, {
  id: '<',
  name: '<'
}, {
  id: '<=',
  name: '<='
}];
const scopeTypes = {
  'String': [{
    id: '=',
    name: '='
  }],
  'Decimal': decimalTypes,
  'Boolean': [{
    id: 't',
    name: 'true'
  }, {
    id: 'f',
    name: 'false'
  }]
}
export default {
  name: 'ruleManageEdit',
  data () {
    return {
      baseInfo: {
        timeDisabled: true,
        formItems: [{
          label: '规则名称',
          labelWidth: '80px',
          prop: 'ruleName',
          inputType: 'input',
          required: true,
          span: 6
        }, {
          label: '是否立即触发',
          prop: 'instantUse',
          labelWidth: '100px',
          inputType: 'radio',
          options: [{
            id: 1,
            name: '是'
          }, {
            id: 2,
            name: '否'
          }],
          span: 4
        }, {
          label: '生效时间',
          prop: 'timeStatus',
          labelWidth: '80px',
          inputType: 'radio',
          custom: true,
          options: [{
            id: 1,
            name: '一直生效'
          }, {
            id: 2,
            name: '指定时间'
          }],
          span: 6,
          offset: 1
        }, {
          label: '',
          prop: 'time',
          custom: true,
          inputType: 'custom',
          span: 7
        }, {
          label: '规则描述',
          prop: 'remark',
          labelWidth: '80px',
          inputType: 'textarea',
          maxlength: 455,
          span: 24
        }],
        formRules: {},
        form: {
        },
        inputDisabled: false,
        isEdit: false,
        midway: true
      },
      conditionForm: {
        condition: undefined,
        typeoOptions: [{
          id: 'and',
          name: '全部满足'
        }, {
          id: 'or',
          name: '任意一个'
        }],
        formItems: [],
        productNumberItem: [{
          label: '产品',
          prop: 'productName',
          labelWidth: '45px',
          inputType: 'custom',
          span: 4
        }],
        deviceNameItem: [{
          label: '设备',
          prop: 'deviceName',
          labelWidth: '45px',
          inputType: 'custom',
          span: 4
        }],
        defaultFormItems: [{
          label: '服务类型',
          prop: 'serviceNo',
          labelWidth: '80px',
          inputType: 'select',
          options: [],
          span: 4
        }, {
          label: '属性',
          prop: 'serviceCode',
          labelWidth: '45px',
          inputType: 'select',
          options: [],
          span: 4
        }, {
          label: '操作',
          prop: 'scope',
          labelWidth: '45px',
          inputType: 'select',
          options: [],
          span: 4
        }, {
          label: '值',
          prop: 'value',
          labelWidth: '45px',
          inputType: 'input',
          options: [],
          span: 4
        }],
        timgingItems: [{
          label: '触发时间',
          prop: 'triggerTime',
          inputType: 'timePicker',
          labelWidth: '80px',
          span: 4
        }, {
          label: ' ',
          prop: 'timeType',
          delLabelUnit: true,
          hide: true,
          inputType: 'radio',
          labelWidth: '80px',
          options: [{
            id: 1,
            name: '每天'
          }],
          span: 15
        }],
        items: [{
          conditionType: null,
          formItems: [],
          timeType: 1
        }],
        itemsvalue: ''
      },
      actionForm: {
        formItems: [],
        defaultFormItems: [{
          label: '产品',
          prop: 'productName',
          labelWidth: '45px',
          inputType: 'custom',
          span: 4
        }, {
          label: '设备',
          prop: 'deviceName',
          labelWidth: '45px',
          inputType: 'custom',
          span: 4
        }, {
          label: '服务类型',
          prop: 'serviceNo',
          labelWidth: '80px',
          inputType: 'select',
          options: [],
          span: 4
        }, {
          label: '属性/命令',
          prop: 'serviceCommand',
          labelWidth: '80px',
          inputType: 'select',
          options: [],
          span: 3
        }, {
          label: '参数',
          prop: 'commandProperty',
          labelWidth: '45px',
          inputType: 'select',
          hide: false,
          options: [],
          span: 3
        }, {
          label: '值',
          prop: 'value',
          labelWidth: '45px',
          inputType: 'input',
          span: 3
        }],
        warnFormItems: [{
          label: '告警级别',
          prop: 'alarmLevel',
          inputType: 'select',
          labelWidth: '80px',
          options: [{
            id: '1',
            name: '警告'
          }, {
            id: '2',
            name: '一般'
          }, {
            id: '3',
            name: '重要'
          }, {
            id: '4',
            name: '严重'
          }],
          span: 4
        }, {
          label: '告警名称',
          prop: 'alarmName',
          labelWidth: '80px',
          inputType: 'input',
          options: [],
          span: 7
        }, {
          label: '告警内容',
          prop: 'alarmContent',
          labelWidth: '80px',
          inputType: 'input',
          options: [],
          span: 7
        }],
        sendItems: [{
          label: '接收对象',
          prop: 'userName',
          inputType: 'custom',
          labelWidth: '80px',
          span: 4
        }, {
          label: '接收渠道',
          prop: 'acceptWay',
          inputType: 'radio',
          labelWidth: '80px',
          options: [{
            id: 1,
            name: '邮件'
          }, {
            id: 2,
            name: '短信'
          }, {
            id: 3,
            name: '微信'
          }],
          span: 12
        }],
        items: [{
          execute: null,
          formItems: []
        }],
        itemsvalue: ''
      },
      addProduct: {
        show: false,
        title: '选择产品',
        productNo: '',
        page: {
          current: 1,
          pageSize: 10,
          total: 0
        },
        tableData: [],
        type: '',
        index: 0,
        productItem: {}
      },
      addDevice: {
        show: false,
        title: '选择设备',
        deviceNo: '',
        type: '',
        page: {
          current: 1,
          pageSize: 10,
          total: 0
        },
        tableData: [],
        index: 0,
        deviceItem: {},
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
        }]
      },
      addObj: {
        show: false,
        title: '选择接受对象',
        page: {
          current: 1,
          pageSize: 10,
          total: 0
        },
        tableData: [],
        tableCols: [{
          label: '角色',
          prop: 'flag',
          render: (h, scoped) => {
            const userType = {
              1: '用户',
              2: '运营'
            }
            return <div>{userType[scoped.row.flag]}</div>
          }
        }, {
          label: '用户名',
          prop: 'username'
        }, {
          label: '邮箱',
          prop: 'email'
        }, {
          label: '手机号',
          prop: 'mobile'
        }],
        index: 0,
        objItem: {},
        searchVal: {},
        searchItems: []
      },
      editData: {}
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.openPage === 'ruleManageEdit') {
        this.editData = this.common['ruleManageEdit'];
        this._deviceDetailLinkage();
      }
      getManufacturerSelectList().then(res => {
        if (res.code === '200') {
          const deviceOptions = res.data.map(data => {
            return {
              id: data.code,
              name: data.name
            }
          });
          this.$set(this.addDevice.searchItems[2], 'props', {
            fieldName: 'manufacturerManageCode',
            options: deviceOptions
          });
        }
      });
      getSensorTypeSelectList().then(res => {
        if (res.code === '200') {
          const deviceOptions = res.data.map(data => {
            return {
              id: data.viewCode,
              name: data.name
            }
          });
          this.$set(this.addDevice.searchItems[1], 'props', {
            fieldName: 'sensorTypeCode',
            options: deviceOptions
          });
        }
      });
    })
  },
  watch: {
    'baseInfo.form': {
      deep: true,
      handler (val) {
        console.log('val', val);
        if (val.timeStatus === 1) {
          this.baseInfo.timeDisabled = true;
        } else if (val.timeStatus === 2) {
          this.baseInfo.timeDisabled = false;
        }
      }
    },
    'conditionForm.items': {
      deep: true,
      // immediate: true,
      async handler (val, oldVal) {
        const itemsval = JSON.stringify(val);
        if (itemsval !== this.conditionForm.itemsvalue) {
          const formItems = await Promise.all(val.map(async (valItem, index) => {
            const parames = {
              ...valItem
            };
            let formItem = [];
            if (valItem.conditionType) {
              parames.conditionType = valItem.conditionType;
              if (valItem.conditionType === 3) {
                formItem = JSON.parse(JSON.stringify(this.conditionForm.timgingItems));
              } else {
                let defaultFormItems = JSON.parse(JSON.stringify(this.conditionForm.defaultFormItems));
                if (valItem.conditionType === 1) {
                  defaultFormItems = JSON.parse(JSON.stringify([...this.conditionForm.productNumberItem, ...defaultFormItems]));
                } else if (valItem.conditionType === 2) {
                  defaultFormItems = JSON.parse(JSON.stringify([...this.conditionForm.deviceNameItem, ...defaultFormItems]));
                }
                if ((this.conditionForm.items[index].formItems && this.conditionForm.items[index].formItems.length > 0) && (this.conditionForm.items[index].formItems.length === defaultFormItems.length)) {
                  defaultFormItems = this.conditionForm.items[index].formItems.map((itemOption, index) => {
                    return {
                      ...defaultFormItems[index],
                      ...itemOption,
                      label: defaultFormItems[index].label,
                      inputType: defaultFormItems[index].inputType,
                      prop: defaultFormItems[index].prop
                    }
                  });
                }
                const isProduct = valItem.productNumber && ((valItem.productNumber !== (this.conditionForm.formItems[index] && this.conditionForm.formItems[index].productNumber)) || (valItem.productNumber && !(this.conditionForm.formItems[index] && this.conditionForm.formItems[index].productNumber)));
                const isDevice = valItem.serialNumber && ((valItem.serialNumber !== (this.conditionForm.formItems[index] && this.conditionForm.formItems[index].serialNumber)) || (valItem.serialNumber && !(this.conditionForm.formItems[index] && this.conditionForm.formItems[index].serialNumber)));
                if (isProduct) {
                  const capabilityList = await this._getCapability({
                    productNo: valItem.productNumber
                  });
                  defaultFormItems[1].options = capabilityList;
                  parames.serviceNo = undefined;
                  this.conditionForm.formItems[index].oldServiceNo = null;
                  parames.serviceName = undefined;
                  parames.serviceCode = undefined;
                  parames.serviceProperty = undefined;
                  parames.scope = undefined;
                  parames.value = undefined;
                  defaultFormItems[3].options = [];
                }
                if (this.conditionForm.formItems[index]) {
                  if ((valItem.serviceNo && !this.conditionForm.formItems[index].oldServiceNo) || (valItem.serviceNo !== this.conditionForm.formItems[index].oldServiceNo)) {
                    const propertiesList = await this._getPropertiesList({
                      capabilityCode: valItem.serviceNo
                    });
                    const servicePropertiesList = propertiesList.map(list => {
                      return {
                        id: list.serviceCapabilityCode,
                        dataType: list.dataType,
                        name: list.description
                      }
                    });
                    defaultFormItems[2].options = servicePropertiesList;
                    const serviceName = defaultFormItems[1].options.find(option => option.id === valItem.serviceNo);
                    parames.serviceNo = serviceName ? valItem.serviceNo : parames.serviceNo;
                    parames.serviceName = serviceName && serviceName.name;
                    parames.serviceCode = undefined;
                    parames.serviceProperty = undefined;
                    parames.scope = undefined;
                    this.conditionForm.formItems[index].scope = null;
                    parames.value = undefined;
                    parames.oldServiceNo = valItem.serviceNo;
                  }
                  if ((valItem.serviceCode && !this.conditionForm.formItems[index].oldServiceCode) || (valItem.serviceCode && (valItem.serviceCode !== this.conditionForm.formItems[index].oldServiceCode))) {
                    const dataTypeObj = defaultFormItems[2].options.length > 0 && defaultFormItems[2].options.find(list => list.id === valItem.serviceCode);
                    if (dataTypeObj) {
                      if (Object.keys(scopeTypes).indexOf(dataTypeObj.dataType) > -1) {
                        defaultFormItems[3].hide = false;
                        defaultFormItems[3].options = scopeTypes[dataTypeObj.dataType];
                      } else {
                        defaultFormItems[3].hide = true;
                      }
                    }
                    parames.serviceCode = valItem.serviceCode;
                    const servicePropertyObj = defaultFormItems[2].options.find(option => option.id === parames.serviceCode);
                    parames.serviceProperty = servicePropertyObj && servicePropertyObj.name;
                    parames.scope = undefined;
                    this.conditionForm.formItems[index].scope = null;
                    parames.value = undefined;
                    parames.oldServiceCode = valItem.serviceCode;
                  }
                  if ((valItem.scope && !this.conditionForm.formItems[index].oldScope) || (valItem.scope !== this.conditionForm.formItems[index].oldScope)) {
                    parames.scope = valItem.scope;
                    parames.value = undefined;
                    this.conditionForm.formItems[index].oldValue = null;
                    parames.oldScope = valItem.scope;
                    if (valItem.oldScope && (valItem.scope !== valItem.oldScope)) {
                      valItem.value = undefined;
                    }
                  }
                  if ((valItem.value && !this.conditionForm.formItems[index].oldValue) || (valItem.value !== this.conditionForm.formItems[index].oldValue)) {
                    parames.value = valItem.value;
                    parames.oldValue = valItem.value;
                  }
                }
                formItem = defaultFormItems;
              }
            }
            parames.formItems = formItem;
            return parames;
          }));
          this.$set(this.conditionForm, 'items', formItems);
          this.$set(this.conditionForm, 'formItems', formItems);
          this.$set(this.conditionForm, 'itemsvalue', itemsval);
        }
        console.log(this.conditionForm.items)
      }
    },
    'actionForm.items': {
      deep: true,
      // immediate: true,
      async handler (val, oldVal) {
        const itemsval = JSON.stringify(val);
        if (itemsval !== this.actionForm.itemsvalue) {
          const formItems = await Promise.all(val.map(async (valItem, index) => {
            const parames = {
              ...valItem
            };
            let formItem = [];
            if (valItem.execute) {
              parames.execute = valItem.execute;
              if (valItem.execute === 2) {
                formItem = JSON.parse(JSON.stringify(this.actionForm.warnFormItems));
              }
              if (valItem.execute === 4) {
                formItem = JSON.parse(JSON.stringify(this.actionForm.sendItems));
              }
              if (valItem.execute === 1) {
                let defaultFormItems = JSON.parse(JSON.stringify(this.actionForm.defaultFormItems));
                if ((this.actionForm.items[index].formItems && this.actionForm.items[index].formItems.length > 0) && (this.actionForm.items[index].formItems.length === defaultFormItems.length)) {
                  defaultFormItems = this.actionForm.items[index].formItems.map((itemOption, index) => {
                    return {
                      ...defaultFormItems[index],
                      ...itemOption
                    }
                  });
                }
                if (valItem.productName && (valItem.productName !== this.actionForm.formItems[index].productName)) {
                  const capabilityList = await this._getCapability({
                    productNo: valItem.productNumber
                  });
                  defaultFormItems[2].options = capabilityList;
                  parames.deviceName = undefined;
                  parames.serialNumber = undefined;
                  parames.serviceNo = undefined;
                  parames.commandProperty = undefined;
                  parames.serviceCommand = undefined;
                  parames.value = undefined;
                }
                if (valItem.serialNumber && (valItem.serialNumber !== (this.actionForm.formItems[index] && this.actionForm.formItems[index].serialNumber))) {
                  const capabilityList = await this._getCapability({
                    productNo: valItem.productNumber
                  });
                  parames.deviceName = valItem.deviceName;
                  parames.serialNumber = valItem.serialNumber;
                  defaultFormItems[2].options = capabilityList;
                  parames.serviceNo = undefined;
                  parames.serviceCommand = undefined;
                  parames.commandProperty = undefined;
                  parames.value = undefined;
                }
                if (this.actionForm.formItems[index]) {
                  if ((valItem.serviceNo && !this.actionForm.formItems[index].oldServiceNo) || (valItem.serviceNo !== this.actionForm.formItems[index].oldServiceNo)) {
                    const commandList = await this._getCommandList({
                      capabilityCode: valItem.serviceNo
                    });
                    const serviceCommandList = commandList.map(list => {
                      const commandParas = (list.commandParas && list.commandParas.length > 0) ? list.commandParas.map(paras => {
                        return {
                          id: paras.serviceCapabilityCode,
                          name: paras.paraName,
                          enumList: paras.enumList
                        }
                      }) : [];
                      const commandResponse = (list.commandResponse && list.commandResponse.length > 0) ? list.commandResponse.map(paras => {
                        return {
                          id: paras.serviceCapabilityCode,
                          name: paras.paraName
                        }
                      }) : [];
                      return {
                        id: list.serviceCapabilityCode,
                        dataType: 'c',
                        commandParas: commandParas,
                        commandResponse: commandResponse,
                        name: list.commandName
                      }
                    });
                    const propertiesList = await this._getPropertiesList({
                      capabilityCode: valItem.serviceNo
                    });
                    const servicePropertiesList = propertiesList.map(list => {
                      return {
                        id: list.serviceCapabilityCode,
                        dataType: 'p',
                        name: list.description
                      }
                    });
                    defaultFormItems[3].options = serviceCommandList.concat(servicePropertiesList);
                    parames.serviceNo = valItem.serviceNo;
                    parames.commandProperty = undefined;
                    parames.serviceCommand = undefined;
                    parames.value = undefined;
                    parames.oldServiceNo = valItem.serviceNo;
                    this.actionForm.formItems[index].oldServiceCommand = null;
                  }
                  if ((valItem.serviceCommand && !this.actionForm.formItems[index].oldServiceCommand) || (valItem.serviceCommand !== this.actionForm.formItems[index].oldServiceCommand)) {
                    const dataTypeObj = defaultFormItems[3].options.find(option => option.id === valItem.serviceCommand);
                    let serviceCommandParamesList = [];
                    if (dataTypeObj && dataTypeObj.dataType === 'c') {
                      defaultFormItems[4].hide = false;
                      serviceCommandParamesList = dataTypeObj.commandParas.concat(dataTypeObj.commandResponse);
                      defaultFormItems[4].options = serviceCommandParamesList;
                    } else {
                      defaultFormItems[4].hide = true;
                    }
                    const serviceCommandParames = defaultFormItems[3].options.find(parame => parame.id === valItem.serviceCommand);
                    parames.serviceCommand = serviceCommandParames ? valItem.serviceCommand : parames.serviceCommand;
                    parames.oldServiceCommand = serviceCommandParames ? valItem.serviceCommand : parames.serviceCommand;
                    parames.value = undefined;
                  }
                  if (valItem.commandProperty !== this.actionForm.formItems[index].oldCommandProperty) {
                    const valueTypeObj = defaultFormItems[4].options.find(option => option.id === valItem.commandProperty);
                    if (valueTypeObj && valueTypeObj.enumList && valueTypeObj.enumList.length > 0) {
                      const enumList = valueTypeObj.enumList.split(',');
                      defaultFormItems[5].inputType = 'select';
                      defaultFormItems[5].options = enumList.map(ls => {
                        return {
                          id: ls,
                          name: ls
                        }
                      });
                    } else {
                      defaultFormItems[5].inputType = 'input';
                    }
                    parames.commandProperty = valItem.commandProperty;
                    parames.value = undefined;
                    parames.oldCommandProperty = valItem.commandProperty;
                  }
                  if (valItem.value !== this.actionForm.formItems[index].value) {
                    parames.value = valItem.value;
                  }
                }
                formItem = defaultFormItems;
              }
            }
            parames.formItems = formItem;
            return parames;
          }));
          this.$set(this.actionForm, 'items', formItems);
          this.$set(this.actionForm, 'formItems', formItems);
          this.$set(this.actionForm, 'itemsvalue', itemsval);
        }
      }
    }
  },
  components: {
    PageTable,
    Flex,
    FormItem,
    Card,
    FormItemBase,
    dialogCont,
    Main,
    DeviceMain,
    searchForm
  },
  computed: {
    ...mapGetters(['common', 'openPage'])
  },
  methods: {
    _deviceDetailLinkage () {
      if (!this.editData.id) return;
      deviceDetailLinkage(this.editData.id).then(res => {
        if (res.code === '200') {
          const data = res.data;
          this.baseInfo.form = {
            time: data.onTime && data.closeTime ? [moment(data.onTime).format('yyyy-MM-DD'), moment(data.closeTime).format('yyyy-MM-DD')] : [],
            id: data.id,
            linkNo: data.linkNo,
            remark: data.remark,
            ruleName: data.ruleName,
            instantUse: data.instantUse,
            timeStatus: data.timeStatus
          };
          this.conditionForm.condition = data.condition;
          this.conditionForm.items = data.deviceLinkageConditionCommands;
          this.conditionForm.formItems = data.deviceLinkageConditionCommands.map(command => {
            return {}
          });
          this.actionForm.items = data.deviceLinkageExecuteCommands;
          this.actionForm.formItems = data.deviceLinkageExecuteCommands.map(command => {
            return {}
          });
        }
      })
    },
    removeConditionTab (type, item, index) {
      let items = this.conditionForm.items;
      if (type === 'actionForm') {
        items = this.actionForm.items
      }
      if (items.length > 1) {
        let deleteType = 'CONDITION';
        let title = '条件';
        if (type === 'conditionForm') {
        } else if (type === 'actionForm') {
          deleteType = 'EXECUTE';
          title = '动作';
        }
        this.$confirm(`此操作将永久删除该${title}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (item.id) {
            const parames = {
              id: item.id,
              type: deleteType
            };
            deviceDeleteLinkage(parames).then(res => {
              if (res.code === '200') {
                this.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success',
                  position: 'bottom-right'
                });
                this.deleteItem(type, index);
              }
            });
          } else {
            this.deleteItem(type, index);
          }
        }).catch(() => {
        });
      }
    },
    deleteItem (type, index) {
      if (type === 'conditionForm') {
        this.conditionForm.items.splice(index, 1)
      } else {
        this.actionForm.items.splice(index, 1)
      }
    },
    selectProduct (type, index, no) {
      this.addProduct.show = true;
      this.addProduct.type = type;
      this.addProduct.index = index;
      this.addProduct.productNo = no;
      this.getProductList();
    },
    onCurrentChange (val) {
      this.addProduct.page.current = val;
      this.getProductList()
    },
    onPageSizeChange (val) {
      this.addProduct.page.pageSize = val
      this.onCurrentChange(1)
    },
    getProductList () {
      let data = {
        data: {
        },
        pageNo: Number(this.addProduct.page.current), // 查询的分页页码
        pageSize: Number(this.addProduct.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: ''
      }
      getDeviceProductForPage(data).then(res => {
        if (res.code === '200') {
          const {
            data,
            total
          } = res.data;
          this.addProduct.page.total = total;
          this.addProduct.tableData = data;
        }
      })
    },
    addProductCancel () {
      this.addProduct.show = false;
      this.addProduct.productItem = {};
      this.addProduct.page = {
        current: 1,
        pageSize: 10,
        total: 0
      };
    },
    addProductSubmit () {
      const type = this.addProduct.type;
      const index = this.addProduct.index;
      const item = this.addProduct.productItem;
      if (type === 'conditionForm') {
        let items = [...this.conditionForm.items];
        items[index] = {
          ...this.conditionForm.items[index],
          productName: item.productName,
          productNumber: item.productNo
        };
        this.$set(this.conditionForm, 'items', items);
      }
      if (type === 'actionForm') {
        let items = [...this.actionForm.items];
        items[index] = {
          ...this.actionForm.items[index],
          productName: item.productName,
          productNumber: item.productNo
        };
        this.$set(this.actionForm, 'items', items);
      }
      this.addProductCancel();
    },
    selectProductPage (item) {
      console.log('item', item);
      this.addProduct.productItem = item;
      this.addProduct.productNo = item.productNo;
    },
    addProductItem (type) {
      if (type === 'conditionForm') {
        this.conditionForm.items = this.conditionForm.items.concat({
          conditionType: null,
          formItems: [],
          timeType: 1
        });
      }
      if (type === 'actionForm') {
        this.actionForm.items = this.actionForm.items.concat({
          execute: null,
          formItems: []
        });
      }
    },
    _getCapability (parames) {
      return getCapability(parames).then(async res => {
        if (res.code === '200') {
          return res.data.map(data => {
            return {
              id: data.capabilityCode,
              name: data.capabilityName
            }
          });
        }
      })
    },
    _getCommandList (parames) {
      return getCommandList(parames).then(res => {
        if (res.code === '200') {
          return res.data;
        }
      });
    },
    _getPropertiesList (parames) {
      return getPropertiesList(parames).then(res => {
        if (res.code === '200') {
          return res.data;
        }
      });
    },
    async selectDevice (type, index, no) {
      this.addDevice.show = true;
      this.addDevice.index = index;
      this.addDevice.deviceNo = no;
      this.addDevice.type = type;
      console.log('this.actionForm.items[index]', this.actionForm.items[index]);
      if (this.actionForm.items[index]) {
        this.addDevice.searchVal = {
          productNo: this.actionForm.items[index].productNumber
        };
      }
      const data = await this.getDeviceList();
      if (data) {
        this.$refs.addDeviceMain.onSetCurrentRow(this.addDevice.deviceNo, 'serialNumber');
      }
    },
    addDeviceCancel () {
      this.addDevice.show = false;
      this.addDevice.deviceItem = {};
      this.addDevice.deviceNo = '';
      this.addDevice.type = '';
      this.addDevice.page = {
        current: 1,
        pageSize: 10,
        total: 0
      };
      this.$refs.addDeviceMain.cleanData();
    },
    addDeviceSubmit () {
      const index = this.addDevice.index;
      const type = this.addDevice.type;
      const item = this.addDevice.deviceItem;
      if (type === 'conditionForm') {
        let items = [...this.conditionForm.items];
        items[index] = {
          ...this.conditionForm.items[index],
          deviceName: item.deviceName,
          serialNumber: item.serialNumber,
          productNumber: item.productNo
        };
        this.$set(this.conditionForm, 'items', items);
      }
      if (type === 'actionForm') {
        let items = [...this.actionForm.items];
        items[index] = {
          ...this.actionForm.items[index],
          deviceName: item.deviceName,
          serialNumber: item.serialNumber,
          productNumber: item.productNo
        };
        this.$set(this.actionForm, 'items', items);
      }
      this.addDeviceCancel();
    },
    onRowCurrentChange (val) {
      this.addDevice.deviceItem = val;
    },
    onDeviceCurrentChange (val) {
      this.addDevice.page.current = val;
      this.getDeviceList()
    },
    onDevicePageSizeChange (val) {
      this.addDevice.page.pageSize = val
      this.onDeviceCurrentChange(1)
    },
    onSearch (val) {
      this.addDevice.searchVal = {
        ...this.addDevice.searchVal,
        ...val,
        activateStatus: val && val.activateStatus && +val.activateStatus
      };
      this.addDevice.page.current = 1;
      this.getDeviceList();
    },
    async onChange (val) {
      if ((!!val.manufacturerManageCode && (val.manufacturerManageCode !== this.addDevice.searchChangeVal.manufacturerManageCode)) || (!!val.sensorTypeCode && (val.sensorTypeCode !== this.addDevice.searchChangeVal.sensorTypeCode))) {
        this.addDevice.searchChangeVal = {
          ...val,
          manufacturerManageCode: val.manufacturerManageCode || '',
          sensorTypeCode: val.sensorTypeCode || '',
          deviceCode: null
        };
        const deviceOptions = await this._getDeviceTypeSelectList({
          manufacturerManageCode: val.manufacturerManageCode || '',
          sensorTypeCode: val.sensorTypeCode || ''
        });
        const searchItems = [...this.addDevice.searchItems];
        searchItems[1].initValue = val.sensorTypeCode;
        searchItems[2].initValue = val.manufacturerManageCode;
        searchItems[3].props = {
          fieldName: 'deviceCode',
          options: deviceOptions
        };
        this.addDevice.searchItems = searchItems;
      }
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
    getDeviceList () {
      let data = {
        data: {
          ...this.addDevice.searchVal
        },
        pageNo: Number(this.addDevice.page.current), // 查询的分页页码
        pageSize: Number(this.addDevice.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: ''
      }
      return getDeviceModuleInfoForPage(data).then(res => {
        if (res.code === '200') {
          const {
            data,
            total
          } = res.data;
          this.addDevice.page.total = total;
          this.addDevice.tableData = data;
          return data;
        }
      })
    },
    _deviceCapabilityLinkage (data) {
      return deviceCapabilityLinkage(data).then(res => {
        if (res.code === '200') {
          return res.data.map(data => {
            return {
              id: data.capabilityCode,
              name: data.capabilityName
            }
          });
        }
      });
    },
    selectObj (index) {
      this.addObj.show = true;
      this.addObj.index = index;
      this.getObjDataList();
    },
    addObjCancel () {
      this.addObj.show = false;
      this.addObj.index = 0;
      this.addObj.page = {
        current: 1,
        pageSize: 10,
        total: 0
      };
      this.$refs.addObjMain.cleanData();
    },
    addObjSubmit () {
      const index = this.addObj.index;
      const item = this.addObj.objItem;
      let items = [...this.actionForm.items];
      items[index] = {
        ...this.actionForm.items[index],
        username: item
      };
      this.$set(this.actionForm, 'items', items);
      this.addObjCancel();
    },
    onObjCurrentChange (val) {
      this.addObj.page.current = val;
      this.getObjDataList()
    },
    onObjPageSizeChange (val) {
      this.addObj.page.pageSize = val
      this.getObjData(1)
    },
    getObjDataList () {
      let data = {
        data: {
          flag: 1
        },
        pageNo: Number(this.addObj.page.current), // 查询的分页页码
        pageSize: Number(this.addObj.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: ''
      }
      getLinkageUser(data).then(res => {
        if (res.code === '200') {
          const {
            data,
            total
          } = res.data;
          this.addObj.page.total = total;
          this.addObj.tableData = data;
        }
      })
    },
    onObjSelectionChange (args) {
      this.addObj.objItem = args.map(arg => arg.username);
    },
    handleCancel () {
      this.$router.push({
        name: this.editData.toName
      });
    },
    async handleSave () {
      let methodApi = deviceAddLinkage;
      let message = '添加成功';
      const baseInfoVal = await this.$refs.baseFormItem.getValue();
      let notifyinputErr = {
        'ruleName': {
          rule: !baseInfoVal.ruleName,
          message: '输入规则名称'
        },
        'condition': {
          rule: !this.conditionForm.condition,
          message: '请选择触发满足条件'
        }
      };
      const deviceLinkageConditionCommands = this.conditionForm.items.length > 0 ? this.conditionForm.items.map(item => {
        const conditionItem = {
          ...item
        };
        if (conditionItem.conditionType === null) {
          notifyinputErr['deviceLinkageConditionCommands-conditionType'] = {
            rule: true,
            message: '检查触发条件是否添加完整'
          }
        }
        delete conditionItem.formItems;
        delete conditionItem.oldServiceCode;
        delete conditionItem.oldServiceNo;
        delete conditionItem.oldScope;
        delete conditionItem.oldValue;
        return conditionItem;
      }) : [];
      notifyinputErr['deviceLinkageConditionCommands'] = {
        rule: deviceLinkageConditionCommands.length === 0,
        message: '检查触发条件是否有添加'
      }
      const deviceLinkageExecuteCommands = this.actionForm.items.length > 0 ? this.actionForm.items.map(item => {
        const actionItem = {
          ...item
        };
        delete actionItem.formItems;
        delete actionItem.oldServiceCommand;
        delete actionItem.oldServiceNo;
        delete actionItem.oldCommandProperty;
        return actionItem;
      }) : [];
      console.log('deviceLinkageExecuteCommands', deviceLinkageExecuteCommands);
      notifyinputErr['deviceLinkageExecuteCommands'] = {
        rule: deviceLinkageExecuteCommands.length === 0,
        message: '检查执行动作是否有添加'
      }
      const inputerrArray = this.$_notifyError(notifyinputErr)
      if (inputerrArray.length !== 0) {
        return false;
      }
      const params = {
        ...baseInfoVal,
        onTime: baseInfoVal.time && moment(baseInfoVal.time[0]).format('yyyy-MM-DD'),
        closeTime: baseInfoVal.time && moment(baseInfoVal.time[1]).format('yyyy-MM-DD'),
        condition: this.conditionForm.condition,
        deviceLinkageConditionCommands,
        deviceLinkageExecuteCommands
      };
      delete params.time;
      if (params.linkNo) {
        methodApi = deviceUpdateLinkage;
        message = '更新成功';
      }
      methodApi(params).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message,
            type: 'success',
            position: 'bottom-right'
          });
          this.handleCancel();
        }
      })
    }
  }
}
</script>

<style lang="less">
#ruleManageEdit{
  #card{
    background: #fff;
    padding: 40px 20px 20px;/*no*/
    margin-bottom: 10px;/*no*/
    .radioGroup{
      width: 100%;
      text-align: left;
      label{
        margin-right: 30px;
        margin-left: 0;
      }
    }
    .cardTitle{
      color: #333333;
      font-weight: normal;
    }
    /deep/.radioGroup{
      display: flex;
      flex-direction: row;
      height: 30px;/*no*/
      >label{
        font-size: 12px;/*no*/
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        line-height: 30px;/*no*/
        margin-right: 20px;
        &:last-child{
          margin-right: 0 !important;
        }
      }
      .el-radio__label{
        padding-left: 5px;/*no*/
        font-size: 12px;/*no*/
      }
    }
  }
  .conditionCard, .actionsCard{
    form{
      &:after {
        content: '\20';
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
        overflow: hidden;
      }
      >.el-form-item{
        &:first-child{
          margin-bottom: 10px !important;/*no*/
          >label{
            text-align: right;
          }
        }
      }
    }
    /deep/.el-form-item{
      margin-bottom: 0 !important;
      >label{
        min-height: 30px;/*no*/
        font-size: 12px;/*no*/
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight:600;
        color:rgba(93,93,93,1);
        text-align: left;
      }

    }
    .delCol{
      position: absolute;
      right: -15px;/*no*/
      top: 0;
      text-align: right;
      .el-form-item{
        width: auto;
        margin-right: 0;
        .action{
          width:28px;
          height:28px;
          background:rgba(238,245,255,1);
          cursor: pointer;
        }
      }
    }
    .conditionItems,.actionsItems{
      // display: flex;
      // align-items: center;
      position: relative;
      height:80px;/*no*/
      padding-right: 15px;/*no*/
      padding-left: 85px;/*no*/
      box-shadow:0px 0px 7px 0px rgba(209,209,209,1);
      margin-bottom: 10px;/*no*/
      .el-row{
        display: flex;
        align-items: center;
        height: 100%;
        position: relative;
        .selectProduct{
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
      }
      .itemTittle{
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width:70px;/*no*/
        height:80px;/*no*/
        background:linear-gradient(135deg,rgba(52,142,247,1) 0%,rgba(91,170,241,1) 100%);
        box-shadow:0px 2px 4px 0px rgba(170,195,229,1);/*no*/
        i{
          font-size: 28px;/*no*/
           background-image: -webkit-linear-gradient(-45deg, #D0DEFF 20%, #FFFFFF 60%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
    }
    .addBtn{
      padding:0;
      width:61px;/*no*/
      height:27px;/*no*/
      background:rgba(37,115,241,1);
      box-shadow:0px 2px 4px 0px rgba(190,214,251,1);/*no*/
      font-size:12px;/*no*/
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(255,255,255,1);
      float: right;
    }
  }
  .actionsCard{
    .actionsItems{
      .itemTittle{
        background:linear-gradient(135deg,rgba(14,174,208,1) 0%,rgba(66,201,208,1) 100%);/*no*/
        box-shadow:0px 4px 4px 0px rgba(226,234,240,1);/*no*/
        i{
          background-image: -webkit-linear-gradient(-45deg, #D0F6FF 20%, #FFFFFF 60%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
    }
  }
  .btnList{
    padding: 20px;/*no*/
    button{
      &.cancel{
        width:82px;/*no*/
        height:36px;/*no*/
        background:rgba(255,255,255,1);
        border-radius:1px;/*no*/
        border:1px solid rgba(37,115,241,1);/*no*/
        margin-right: 20px;/*no*/
        color: #2573F1;
      }
      &.save{
        width:82px;/*no*/
        height:36px;/*no*/
        background:rgba(37,115,241,1);
        box-shadow:0px 2px 4px 0px rgba(205,205,205,1);/*no*/
        border-radius:1px;/*no*/
      }
    }
  }
}
.addProductDialog{
  .el-dialog__body{
    background: #e5e7ec;
    #productMain{
      margin-top:0;
    }
  }
}
</style>
