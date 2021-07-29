<template>
  <div id='productManagementPage'>
    <div class="productBaseInfo">
      <FormItemText
        :layout="productBaseInfoItem"
        labelWidth="0px"
      >
      <template v-slot:deviceCount>
        <span class="deviceCount">
          {{info.deviceCount}}个
          <el-button type="text" @click="goDeviceManage">管理设备</el-button>
        </span>
      </template>
      </FormItemText>
    </div>
    <el-tabs v-model="activetTabsName" type="card" @tab-click="handleClick">
        <el-tab-pane
          label="产品信息"
          name="1"
        >
          <span slot="label"><i class="iconfont icon-chanpinxinxi"></i> 产品信息</span>
          <card title="产品信息" :className="'adminCard'">
            <FormItemText
              :layout="productInfoItem"
              labelWidth="0px"
            >
            </FormItemText>
          </card>
        </el-tab-pane>
        <el-tab-pane
          label="服务能力"
          name="2"
        >
          <span slot="label"><i class="iconfont icon-fuwunengli"></i> 服务能力</span>
          <div class="flexCloumn">
            <div class="panelContainer" v-if="!loading && capability.length > 0">
              <el-button type="primary" class="addServe" @click="addServer">新增服务<i class="el-icon-plus el-icon--right"></i></el-button>
              <div
                class="flexRow panelMain"
                :style="{
                  'margin-top': `${capability[0] && capability[0].top}px`,
                  'margin-bottom': `${capability[capability.length - 1] && capability[capability.length - 1].top}px`,
                }"
                >
                <div class="lever1">
                  <span class="serverLeg">服务</span>
                  <div class="icon">
                    <div class="flexCenter iconBox">
                      <i class="iconfont icon-chanpin" />
                    </div>
                    产品
                  </div>
                </div>
                <div class="flexCloumn lever2">
                  <span class="line" v-if="capability.length > 1"/>
                  <div
                    class="flexRow item"
                    v-for="(item, index) in capability"
                    :key="index"
                    :class="`index${index}`"
                  >
                    <div class="flexCloumn flexCenter parent">
                      <div class="flexCenter iconBox">
                        <i class="iconfont icon-fuwu" />
                      </div>
                      {{item.capabilityName}}
                    </div>
                    <div class="flexCloumn children" :class="{'noChildren':(item.propertiesList.length + item.commandList.length) === 0}" :style="item.style">
                      <span class="line" :style="{height: `${(27 * ((item.propertiesList.length + item.commandList.length) - 1) + 7 * ((item.propertiesList.length + item.commandList.length) - 1))}px`}"/>
                      <div
                        class="childItem properties"
                        v-for="(propertiesItem, itemIndex) in item.propertiesList"
                        :key="`properties${index}-${itemIndex}`"
                        @click="showPage(`${index + 1}`, 'property', propertiesItem)"
                      >
                        <div>{{propertiesItem.paraName}}</div>
                      </div>
                      <div
                        class="childItem command"
                        v-for="(commandItem, itemIndex) in item.commandList"
                        :key="`command${index}-${itemIndex}`"
                        @click="showPage(`${index + 1}`, 'order', commandItem)"
                      >
                        <div>{{commandItem.commandName}}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="panelLeg">
                <span />属性
                <span />命令
              </div>
            </div>
            <div class="flexCloumn flexCenter noHavePanelContainer" v-if="!loading && capability.length === 0">
              <img src="./images/img7.png"/>
              <div class="text">暂无服务，请点击新增服务按钮添加吧~</div>
              <el-button type="primary" class="addServe" @click="addServer">新增服务<i class="el-icon-plus el-icon--right"></i></el-button>
            </div>
            <div class="collapseContainer">
              <el-collapse v-model="collapseIndex" accordion>
                <el-collapse-item
                  v-for="(item, index) in capability"
                  :key="index"
                  :name="`collapse${index + 1}`"
                >
                  <template slot="title">
                    <span class="collapseTitle">
                      {{item.capabilityName}}
                      <i class="iconfont icon-shanchu" style="fontSize: 15px; color: #FF5736" @click="_deleteCapability(item.capabilityCode)"/>
                    </span>
                  </template>
                  <div class="flexRow btnList">
                    <el-button type="primary" @click="addProperty(item.capabilityCode)">新增属性</el-button>
                    <el-button type="primary" @click="addOrder(item.capabilityCode)">新增命令</el-button>
                  </div>
                  <el-tabs v-model="tabIndex">
                    <el-tab-pane label="属性" name="property">
                      <page-table
                        :ref="`collapseproperty`"
                        col-align="center"
                        selection
                        operator-width="90"
                        operator
                        :data="item.propertiesList"
                        :cols="propertyTableCols"
                        :highlightCurrentRow="true"
                        :showPage="false"
                      >
                        <template
                          slot-scope="scope"
                          slot="operator"
                        >
                        <flex>
                          <el-button
                            type="text"
                            size="small"
                            title="修改"
                            @click.prevent.stop="showProperties('detail', {
                              ...scope.row
                            })"
                            v-if="true || $_hasOperation($options.name,'detail')">
                            <i class="iconfont icon-bianji1" style="fontSize: 15px; color: #1A57D1"/>
                        </el-button>
                        <el-button
                            type="text"
                            size="small"
                            title="删除"
                            @click.prevent.stop="showProperties('delete', {
                              ...scope.row
                            })"
                            v-if="true || ($_hasOperation($options.name,'edit'))">
                            <i class="iconfont icon-shanchu" style="fontSize: 15px; color: #FF5736"/>
                          </el-button>
                          </flex>
                        </template>
                      </page-table>
                    </el-tab-pane>
                    <el-tab-pane label="命令" name="order">
                      <page-table
                        :ref="`collapseorder`"
                        col-align="center"
                        selection
                        operator-width="90"
                        operator
                        :data="item.commandList"
                        :cols="orderTableCols"
                        :highlightCurrentRow="true"
                        :showPage="false"
                      >
                        <template
                          slot-scope="scope"
                          slot="operator"
                        >
                          <flex>
                          <el-button
                            type="text"
                            size="small"
                            title="修改"
                            @click.prevent.stop="showCommand('detail', {
                              ...scope.row
                            })"
                            v-if="true || $_hasOperation($options.name,'detail')">
                            <i class="iconfont icon-bianji1" style="fontSize: 15px; color: #1A57D1"/>
                        </el-button>
                        <el-button
                            type="text"
                            size="small"
                            title="删除"
                            @click.prevent.stop="showCommand('delete', {
                              ...scope.row
                            })"
                            v-if="true || ($_hasOperation($options.name,'edit'))">
                            <i class="iconfont icon-shanchu" style="fontSize: 15px; color: #FF5736"/>
                          </el-button>
                          </flex>
                        </template>
                      </page-table>
                    </el-tab-pane>
                  </el-tabs>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
         </el-tab-pane>
        <el-tab-pane
          label="维护能力"
          name="3"
        >
          <span slot="label"><i class="iconfont icon-weihunengli"></i> 维护能力</span>
          <div class="flexCloumn flexCenter maintainContainer">
            <div class="flexCloumn flexCenter info">
              <img src="./images/img4.png"/>
              <div class="flexRow">
                <span>当前软件版本：V1.0  </span>
                <span>当前固件版本：V1.0</span>
              </div>
              <div>升级状态：升级成功</div>
              <div>更新时间：2020-07-10 10:00:00</div>
            </div>
            <div class="flexRow btnList">
              <div class="flexCloumn btn">
                <div class="flexCenter imgBox">
                  <img src="./images/img3.png"/>
                </div>
                <span class="maintainTitle">设备固件升级</span>
                <span>firmware upgrade</span>
              </div>
              <div class="flexCloumn btn">
                <div class="flexCenter imgBox">
                  <img src="./images/img2.png"/>
                </div>
                <span class="maintainTitle">软件升级</span>
                <span>Software upgrade</span>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="订阅推送"
          name="4"
        >
          <span slot="label"><i class="iconfont icon-dingyuetuisong"></i> 订阅推送</span>
          <div class="pushContainer">
            <search-form
              :searchItems="pushSearchItems"
              @onSearch="onPushSearch"
              :addBtnVisible="true || $_hasOperation($options.name,'add')"
              @on-addBtn="showPush('add');"
            />
            <page-table
              col-align="center"
              operator-width="110"
              operator
              selection
              :data="tableData"
              :cols="tableCols"
              :page-current="page.current"
              :total="page.total"
              :page-size="page.pageSize"
              @current-change="onCurrentChange"
              @size-change="onPageSizeChange"
              @selection-change="onSelectionChange"
            >
              <template
                slot-scope="scope"
                slot="operator"
              >
              <flex>
                <el-button
                  type="text"
                  size="small"
                  title="查看"
                  :style="{marginRight: '10px'}"
                  @click.prevent.stop="showPush('detail', {
                    ...scope.row
                  })"
                  v-if="true || $_hasOperation($options.name,'detail')">
                  <i class="iconfont icon-xiangqing" style="fontSize: 20px; color: #2573f1"/>
              </el-button>
                <el-button
                  type="text"
                  size="small"
                  title="删除"
                  @click.prevent.stop="showPushDel({
                    ...scope.row
                  })"
                  v-if="true || ($_hasOperation($options.name,'edit'))">
                  <i class="iconfont icon-shanchu" style="fontSize: 20px; color: #FF5736"/>
              </el-button>
              </flex>
              </template>
            </page-table>
          </div>
        </el-tab-pane>
    </el-tabs>
    <dialog-cont
      @on-cancel="addServerDialogCancel"
      @on-confirm="addServerDialogSubmit"
      :visible.sync="addServerDialog.show"
      width="550px"
      :title="addServerDialog.title"
      append-to-body
    >
      <FormItem
        ref="serverFormItem"
        :formItems="addServerDialog.formItems"
        :rules="addServerDialog.formRules"
        :disabled="addServerDialog.inputDisabled"
        :isEdit="addServerDialog.isEdit"
        :form="addServerDialog.form"
        :midway="addServerDialog.midway"
      />
    </dialog-cont>
    <dialog-cont
      @on-cancel="addPropertyDialogCancel"
      @on-confirm="addPropertyDialogSubmit"
      :visible.sync="addPropertyDialog.show"
      width="550px"
      :title="addPropertyDialog.title"
      append-to-body
    >
      <FormItem
        ref="propertyFormItem"
        :formItems="addPropertyDialog.formItems"
        :rules="addPropertyDialog.formRules"
        :disabled="addPropertyDialog.inputDisabled"
        :isEdit="addPropertyDialog.isEdit"
        :form="addPropertyDialog.form"
        :midway="addPropertyDialog.midway"
      >
      </FormItem>
    </dialog-cont>
    <dialog-cont
      @on-cancel="addOrderDialogCancel"
      @on-confirm="addOrderDialogSubmit"
      :visible.sync="addOrderDialog.show"
      width="650px"
      :title="addOrderDialog.title"
      append-to-body
    >
      <FormItem
        ref="orderFormItem"
        :formItems="addOrderDialog.formItems"
        :rules="addOrderDialog.formRules"
        :disabled="addOrderDialog.inputDisabled"
        :isEdit="addOrderDialog.isEdit"
        :form="addOrderDialog.form"
        :midway="addOrderDialog.midway"
      >
        <template v-slot:query>
          <div class="oderParameTable flexCloumn">
             <el-button type="primary" @click="addParames('query')">新增输入参数</el-button>
             <page-table
              col-align="center"
              operator-width="110"
              operator
              :data="addOrderDialog.queryTableData"
              :cols="addOrderDialog.tableCols"
              :showPage="false"
            >
              <template
                slot-scope="scope"
                slot="operator"
              >
              <flex>
                <el-button
                  type="text"
                  size="small"
                  title="查看"
                  :style="{marginRight: '10px'}"
                  @click.prevent.stop="addParames('query', {
                    ...scope.row
                  })"
                  v-if="true || $_hasOperation($options.name,'detail')">
                  <i class="iconfont icon-xiangqing" style="fontSize: 20px; color: #2573f1"/>
              </el-button>
                <el-button
                  type="text"
                  size="small"
                  title="删除"
                  @click.prevent.stop="delParames('query', {
                    ...scope.row
                  })"
                  v-if="true || ($_hasOperation($options.name,'edit'))">
                  <i class="iconfont icon-shanchu" style="fontSize: 20px; color: #FF5736"/>
              </el-button>
              </flex>
              </template>
            </page-table>
          </div>
        </template>
        <template v-slot:response>
          <div class="oderParameTable flexCloumn">
             <el-button type="primary"  @click="addParames('response')">新增输出参数</el-button>
             <page-table
              col-align="center"
              operator-width="110"
              operator
              :data="addOrderDialog.responseTableData"
              :cols="addOrderDialog.tableCols"
              :showPage="false"
            >
              <template
                slot-scope="scope"
                slot="operator"
              >
              <flex>
                <el-button
                  type="text"
                  size="small"
                  title="查看"
                  :style="{marginRight: '10px'}"
                  @click.prevent.stop="addParames('response', {
                    ...scope.row
                  })"
                  v-if="true || $_hasOperation($options.name,'detail')">
                  <i class="iconfont icon-xiangqing" style="fontSize: 20px; color: #2573f1"/>
              </el-button>
                <el-button
                  type="text"
                  size="small"
                  title="删除"
                  @click.prevent.stop="delParames('response', {
                    ...scope.row
                  })"
                  v-if="true || ($_hasOperation($options.name,'edit'))">
                  <i class="iconfont icon-shanchu" style="fontSize: 20px; color: #FF5736"/>
              </el-button>
              </flex>
              </template>
            </page-table>
          </div>
        </template>
      </FormItem>
      <dialog-cont
        @on-cancel="addParameDialogCancel"
        @on-confirm="addParameDialogSubmit"
        :visible.sync="addParameDialog.show"
        width="550px"
        :title="addParameDialog.title"
        append-to-body
      >
        <FormItem
          ref="paramesFormItem"
          :formItems="addParameDialog.formItems"
          :rules="addParameDialog.formRules"
          :disabled="addParameDialog.inputDisabled"
          :isEdit="addParameDialog.isEdit"
          :form="addParameDialog.form"
          :midway="addParameDialog.midway"
        />
      </dialog-cont>
    </dialog-cont>
    <dialog-cont
      @on-cancel="addMaintainDialogCancel"
      @on-confirm="addMaintainDialogSubmit"
      :visible.sync="addMaintainDialog.show"
      width="550px"
      :title="addMaintainDialog.title"
      append-to-body
    >
      <FormItem
        ref="maintainFormItem"
        :formItems="addMaintainDialog.formItems"
        :rules="addMaintainDialog.formRules"
        :disabled="addMaintainDialog.inputDisabled"
        :isEdit="addMaintainDialog.isEdit"
        :form="addMaintainDialog.form"
        :midway="addMaintainDialog.midway"
      />
    </dialog-cont>
    <dialog-cont
      @on-cancel="addPushDialogCancel"
      @on-confirm="addPushDialogSubmit"
      :visible.sync="addPushDialog.show"
      width="550px"
      :title="addPushDialog.title"
      append-to-body
    >
      <FormItem
        ref="pushFormItem"
        :formItems="addPushDialog.formItems"
        :rules="addPushDialog.formRules"
        :disabled="addPushDialog.inputDisabled"
        :isEdit="addPushDialog.isEdit"
        :form="addPushDialog.form"
        :midway="addPushDialog.midway"
      />
    </dialog-cont>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex';
import Flex from '@/components/flex';
import FormItemText from '@/components/formItemText/formItemText';
import searchForm from 'components/adminSearchForm/searchForm';
import PageTable from '@/components/adminPage-table';
import card from 'view/lightPole/lightPoleStatistical/components/card';
import dialogCont from '@/components/adminDialog';
import FormItem from '@/components/adminFormItem';
import { routePush } from '@/util/util';
import { METHOD_TYPE } from '@/util/constants';
import {
  getDeviceProductDtl,
  getCapability,
  getCommandList,
  getPropertiesList,
  addCapability,
  updateCapability,
  deleteCapability,
  addCommand,
  updateCommand,
  addProperties,
  updateProperties,
  deleteCommandListAndPropertiesList,
  getDataType,
  getPublishSubscribeForPage,
  deletePublishSubscribe,
  getOperationTypeList,
  getProtocolList,
  insertPublishSubscribe,
  updatePublishSubscribe,
  getPublishSubscribeDetail
} from 'api/admin';
export default {
  name: 'productManagementPage',
  data () {
    const { options, types } = this.$_useTypes(METHOD_TYPE);
    const validateDataType = async (rule, value, callback) => {
      if (!value) {
        return callback(new Error('数据类型不能为空'));
      }
      if (value === 'String') {
        this.addPropertyDialog.formItems[3].hide = true;
        this.addPropertyDialog.formItems[4].hide = true;
        this.addPropertyDialog.formItems[5].hide = false;
        this.addPropertyDialog.formItems[6].hide = false;
      } else {
        this.addPropertyDialog.formItems[3].hide = false;
        this.addPropertyDialog.formItems[4].hide = false;
        this.addPropertyDialog.formItems[5].hide = true;
        this.addPropertyDialog.formItems[6].hide = true;
      }
      callback()
    };
    return {
      activetTabsName: '1',
      activeName: 'property',
      editData: {},
      info: {},
      productNo: null,
      productBaseInfoItem: [{
        id: 'productName',
        label: '产品名称',
        value: '',
        unit: '',
        span: 12
      }, {
        id: 'productNo',
        label: '产品ID',
        value: '',
        unit: '',
        span: 12
      }, {
        id: 'deviceCount',
        label: '设备数',
        value: '',
        unit: '',
        custom: true,
        class: 'noBottom',
        span: 12
      }],
      productInfoItem: [{
        id: 'deviceTypeName',
        label: '设备类型',
        value: '',
        unit: '',
        span: 12
      }, {
        id: 'manufacturerName',
        label: '厂商名称',
        value: '',
        unit: '',
        span: 12
      }, {
        id: 'platformTypeName',
        label: '平台类型',
        value: '',
        unit: '',
        span: 24
      }, {
        id: 'protocolTypeName',
        label: '通信协议',
        value: '',
        unit: '',
        span: 12
      }, {
        id: 'ratedPower',
        label: '数据格式',
        value: '',
        unit: '',
        span: 12
      }, {
        id: 'createTime',
        label: '最后修改时间',
        value: '',
        unit: '',
        class: 'noBottom',
        span: 12
      }, {
        id: 'dateEncryptionName',
        label: '数据加密方式',
        value: '',
        unit: '',
        class: 'noBottom',
        span: 12
      }],
      capability: [],
      propertyTableCols: [
        { label: '属性名称',
          prop: 'paraName'
        },
        { label: '中文描述',
          prop: 'description'
        },
        { label: '数据类型',
          prop: 'dataType',
          render: (h, scope) => {
            const dataType = this.dataType.find(data => data.id === scope.row.dataType);
            return <div>{dataType ? dataType.name : ''}</div>
          }
        },
        { label: '取值范围 ',
          prop: 'rang',
          render: (h, scope) => {
            return <div>{scope.row.min && scope.row.max ? `${scope.row.min}~${scope.row.max}` : ''}</div>
          }
        },
        { label: '单位',
          prop: 'unit'
        },
        { label: '访问权限',
          prop: 'method',
          render: (h, scope) => {
            let list = scope.row.method.split('');
            list = list.map(ls => types[ls]).join();
            return <div>{list}</div>
          }
        }
      ],
      orderTableCols: [
        { label: '命令名称',
          prop: 'commandName'
        },
        { label: '下发参数',
          prop: 'commandParas',
          render: (h, scope) => {
            const list = scope.row.commandParas && scope.row.commandParas.map(paras => paras.paraName).join(',')
            return <div>{list}</div>
          }
        },
        { label: '响应参数',
          prop: 'commandResponse',
          render: (h, scope) => {
            const list = scope.row.commandResponse && scope.row.commandResponse.map(paras => paras.paraName).join(',')
            return <div>{list}</div>
          }
        }
      ],
      addServerDialog: {
        show: false,
        title: '新增服务',
        formItems: [{
          label: '服务名称',
          prop: 'capabilityName',
          inputType: 'input',
          required: true,
          span: 24
        }, {
          label: '服务描述',
          prop: 'remark',
          inputType: 'textarea',
          required: false,
          span: 24
        }],
        formRules: {},
        form: {},
        inputDisabled: false,
        isEdit: false,
        midway: false
      },
      addPropertyDialog: {
        show: false,
        title: '新增属性',
        capabilityCode: null,
        formItems: [{
          label: '属性名称',
          prop: 'paraName',
          inputType: 'input',
          required: true,
          span: 24
        }, {
          label: '数据类型',
          prop: 'dataType',
          inputType: 'select',
          options: [],
          span: 24
        }, {
          label: '访问权限',
          prop: 'method',
          inputType: 'checkbox',
          options: options,
          required: true,
          span: 24
        }, {
          label: '取值范围',
          prop: 'rang',
          hide: false,
          inputType: 'inputRang',
          span: 24
        }, {
          label: '单位',
          prop: 'unit',
          hide: false,
          inputType: 'input',
          span: 24
        }, {
          label: '长度',
          prop: 'maxLength',
          hide: true,
          inputType: 'input',
          span: 24
        }, {
          label: '枚举值',
          prop: 'enumList',
          hide: true,
          inputType: 'input',
          span: 24
        }, {
          label: '中文描述',
          prop: 'description',
          inputType: 'input',
          span: 24,
          required: true
        }],
        formRules: {
          dataType: [
            { required: true, validator: validateDataType, trigger: 'change' }
          ]
        },
        form: {
          method: [],
          rang: {
            min: null,
            max: null
          }
        },
        inputDisabled: false,
        isEdit: false,
        midway: false
      },
      addOrderDialog: {
        show: false,
        capabilityCode: null,
        title: '新增命令',
        formItems: [{
          label: '命令名称',
          prop: 'commandName',
          inputType: 'input',
          required: true,
          span: 24
        }, {
          label: '下发参数',
          prop: 'query',
          inputType: 'custom',
          span: 24
        }, {
          label: '响应参数',
          prop: 'response',
          inputType: 'custom',
          span: 24
        }],
        formRules: {},
        form: {},
        inputDisabled: false,
        isEdit: false,
        midway: false,
        queryTableData: [],
        responseTableData: [],
        tableCols: [
          { label: '参数名称',
            prop: 'paraName'
          },
          { label: '数据类型',
            prop: 'dataType',
            render: (h, scope) => {
              const dataType = this.dataType.find(data => data.id === scope.row.dataType);
              return <div>{dataType ? dataType.name : ''}</div>
            }
          },
          { label: '是否必选',
            prop: 'required',
            render: (h, scope) => {
              return (
                <div>{scope.row.required === 1 ? '是' : '否'}</div>
              );
            }
          }
        ]
      },
      addParameDialog: {
        title: '新增参数',
        type: 'query',
        show: false,
        formItems: [{
          label: '参数名称',
          prop: 'paraName',
          inputType: 'input',
          required: true,
          span: 24
        }, {
          label: '是否必选',
          prop: 'required',
          inputType: 'radio',
          required: true,
          options: [{
            id: 1,
            name: '是'
          }, {
            id: 0,
            name: '否'
          }],
          span: 24
        }, {
          label: '数据类型',
          prop: 'dataType',
          inputType: 'select',
          required: true,
          options: [],
          span: 24
        }, {
          label: '长度',
          prop: 'maxLength',
          inputType: 'input',
          required: true,
          span: 24
        }, {
          label: '枚举值',
          prop: 'enumList',
          inputType: 'textarea',
          span: 24
        }],
        form: {},
        formRules: {},
        inputDisabled: false,
        isEdit: false,
        midway: true
      },
      dataType: [],
      collapseIndex: 'collapse1',
      tabIndex: 'property',
      currentTable: null,
      addMaintainDialog: {
        show: false,
        title: '新增升级版本',
        formItems: [{
          label: '支持服务',
          prop: 'description',
          inputType: 'checkbox',
          options: [{
            id: 1,
            name: '是否支持固件升级'
          }, {
            id: 2,
            name: '是否支持软件升级'
          }]
        }],
        formRules: {},
        form: {},
        inputDisabled: false,
        isEdit: false,
        midway: false
      },
      pushSearchVal: {},
      pushSearchItems: [{
        type: 'select',
        label: '消息类别',
        labelWidth: '85px',
        props: {
          fieldName: 'operationType',
          options: []
        }
      }, {
        type: 'select',
        label: '推送消息协议通道',
        labelWidth: '140px',
        props: {
          fieldName: 'protocolType',
          options: []
        }
      }],
      // 分页
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      selectList: [],
      tableData: [],
      tableCols: [
        { label: '消息类别',
          prop: 'operationTypeName'
        },
        { label: '订阅回调地址',
          prop: 'callbackUrl'
        },
        { label: '推送消息协议通道',
          prop: 'protocolTypeName'
        },
        { label: '创建时间',
          prop: 'createTime'
        }
      ],
      addPushDialog: {
        show: false,
        title: '新增订阅消息',
        formItems: [{
          label: '消息类别',
          prop: 'operationType',
          inputType: 'select',
          options: [],
          required: true
        }, {
          label: '订阅回调地址',
          prop: 'callbackUrl',
          inputType: 'textarea',
          required: true,
          span: 24
        }, {
          label: '推送消息协议通道',
          prop: 'protocolType',
          inputType: 'select',
          options: [],
          required: true
        }, {
          label: '备注',
          prop: 'remark',
          inputType: 'textarea',
          span: 24
        }],
        formRules: {},
        form: {},
        inputDisabled: false,
        isEdit: false,
        midway: false
      },
      loading: false
    }
  },
  computed: {
    ...mapGetters(['common', 'openPage']),
    routeName () {
      return this.$route.name
    }
  },
  mounted () {
    if (this.routeName === 'productManagementPage') {
      this.$nextTick(async () => {
        this.editData = this.common['productManagementPage'];
        if (this.editData && this.editData.id) {
          this._getDeviceProductDtl(this.editData.id);
        }
      });
      if (this.addPropertyDialog.formItems[1].options.length === 0) {
        getDataType().then(res => {
          if (res.code === '200') {
            this.dataType = res.data.map(data => {
              return {
                id: data.key,
                name: data.value
              }
            });
            this.$set(this.addPropertyDialog.formItems[1], 'options', this.dataType);
            this.$set(this.addParameDialog.formItems[2], 'options', this.dataType);
          }
        })
      }
    }
  },
  components: {
    Flex,
    FormItemText,
    card,
    PageTable,
    dialogCont,
    FormItem,
    searchForm
  },
  methods: {
    handleClick (tag) {
      this.activetTabsName = tag.name;
      if (tag.name === '4') {
        this._getPublishSubscribeForPage();
        getOperationTypeList().then(res => {
          if (res.code === '200') {
            const operationList = res.data.map(data => {
              return {
                id: data.key,
                name: data.value
              }
            });
            this.$set(this.pushSearchItems[0].props, 'options', operationList);
            this.$set(this.addPushDialog.formItems[0], 'options', operationList);
          }
        });
        getProtocolList().then(res => {
          if (res.code === '200') {
            const protocolList = res.data.map(data => {
              return {
                id: data.key,
                name: data.value
              }
            });
            this.$set(this.addPushDialog.formItems[2], 'options', protocolList);
            this.$set(this.pushSearchItems[1].props, 'options', protocolList);
          }
        });
      }
    },
    handleActiveClick (tag) {
      this.activeName = tag.name;
    },
    tableRowClassName ({row, rowIndex}, collapseIndex, tabIndex) {
      if ((rowIndex + 1) % 2 === 0) {
        return 'signRow';
      }
      return '';
    },
    _getDeviceProductDtl (id) {
      getDeviceProductDtl(id).then(async res => {
        if (res.code === '200') {
          this.productInfoItem = await this.$_setItem(this.productInfoItem, res.data);
          this.productBaseInfoItem = await this.$_setItem(this.productBaseInfoItem, res.data);
          this.info = res.data;
          this.productNo = res.data.productNo;
          this._getCapability({
            productNo: res.data.productNo
          });
        }
      });
    },
    _getCapability (parames) {
      this.loading = true;
      getCapability(parames).then(async res => {
        if (res.code === '200') {
          this.capability = [];
          let index = 0;
          new Promise(async resolve => {
            await res.data.map(async (data) => {
              const commandList = await this._getCommandList({
                capabilityCode: data.capabilityCode
              });
              const propertiesList = await this._getPropertiesList({
                capabilityCode: data.capabilityCode
              });
              let marginTop = -(((propertiesList.length + commandList.length) - 2) * 20);
              const style = {
                'margin-top': (index === 0) && `${marginTop}px`,
                'margin-bottom': (index === (res.data.length - 1)) && `${marginTop}px`
              };
              this.capability.push({
                ...data,
                style,
                childrenLength: commandList.length + propertiesList.length,
                top: Math.abs(marginTop - 20),
                commandList,
                propertiesList
              });
              index = index + 1;
            });
            resolve();
          }).then(() => {
            setTimeout(() => {
              this.loading = false;
            }, 500)
          });
        }
      });
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
    addServer () {
      this.addServerDialog.show = true;
    },
    addServerDialogCancel () {
      this.addServerDialog.show = false;
      this.addServerDialog.form = {};
      this.collapseIndex = 'collapse1';
      this.$refs.serverFormItem.resetForm();
    },
    async addServerDialogSubmit () {
      const val = await this.$refs.serverFormItem.getValue();
      const parames = {
        ...val,
        productNo: this.productNo
      };
      addCapability(parames).then(res => {
        if (res.code === '200') {
          this._getCapability({
            productNo: parames.productNo
          });
          this.addServerDialogCancel();
        }
      })
    },
    addProperty (capabilityCode) {
      this.addPropertyDialog.show = true;
      this.addPropertyDialog.capabilityCode = capabilityCode;
    },
    addPropertyDialogCancel () {
      this.addPropertyDialog.show = false;
      this.addPropertyDialog.capabilityCode = null;
      this.addPropertyDialog.form = {
        method: [],
        rang: {
          min: null,
          max: null
        }
      };
      this.$refs.propertyFormItem.resetForm();
    },
    async addPropertyDialogSubmit () {
      let methodApi = addProperties;
      const { values } = this.$_useTypes(METHOD_TYPE);
      const val = await this.$refs.propertyFormItem.getValue();
      if (val) {
        const parames = {
          paraName: val.paraName,
          dataType: val.dataType,
          method: val.method.map(method => values[method]).join(''),
          min: val.rang && val.rang.min,
          max: val.rang && val.rang.max,
          unit: val.unit,
          enumList: val.enumList,
          maxLength: val.maxLength,
          description: val.description,
          capabilityCode: this.addPropertyDialog.capabilityCode
        };
        if (this.addPropertyDialog.form.serviceCapabilityCode) {
          parames.capabilityCode = this.addPropertyDialog.form.capabilityCode;
          parames.serviceCapabilityCode = this.addPropertyDialog.form.serviceCapabilityCode;
          methodApi = updateProperties;
        }
        methodApi(parames).then(res => {
          if (res.code === '200') {
            this._getCapability({
              productNo: this.productNo
            });
            this.addPropertyDialogCancel();
          }
        });
      }
    },
    addOrder (capabilityCode) {
      this.addOrderDialog.show = true;
      this.addOrderDialog.capabilityCode = capabilityCode;
      this.addOrderDialog.form = {};
    },
    addOrderDialogCancel () {
      this.addOrderDialog.show = false;
      this.addOrderDialog.capabilityCode = null;
      this.addOrderDialog.form = {};
      this.addOrderDialog.queryTableData = [];
      this.addOrderDialog.responseTableData = [];
      this.$refs.orderFormItem.resetForm();
    },
    async addOrderDialogSubmit () {
      let methodApi = addCommand;
      const val = await this.$refs.orderFormItem.getValue();
      const parames = {
        commandName: val.commandName,
        requestParas: this.addOrderDialog.queryTableData,
        responseParas: this.addOrderDialog.responseTableData,
        capabilityCode: this.addOrderDialog.capabilityCode
      };
      if (val.serviceCapabilityCode) {
        parames.serviceCapabilityCode = val.serviceCapabilityCode;
        methodApi = updateCommand;
      }
      methodApi(parames).then(res => {
        if (res.code === '200') {
          this._getCapability({
            productNo: this.productNo
          });
          this.addOrderDialogCancel();
        }
      })
    },
    showProperties (method, item) {
      if (method === 'delete') {
        this._deleteCommandListAndPropertiesList(item.serviceCapabilityCode, '属性');
      } else {
        const { types } = this.$_useTypes(METHOD_TYPE);
        let list = item.method.split('');
        list = list.map(ls => types[ls]);
        this.addPropertyDialog.form = {
          ...item,
          rang: {
            min: item.min,
            max: item.max
          },
          method: list
        };
        this.addPropertyDialog.show = true;
      }
    },
    showCommand (method, item) {
      if (method === 'delete') {
        this._deleteCommandListAndPropertiesList(item.serviceCapabilityCode, '指令');
      } else {
        this.addOrderDialog.show = true;
        this.addOrderDialog.capabilityCode = item.capabilityCode;
        this.addOrderDialog.form = {
          ...item
        };
        this.addOrderDialog.queryTableData = item.commandParas.map(paras => {
          return {
            ...paras,
            index: paras.serviceCapabilityCode
          }
        });
        this.addOrderDialog.responseTableData = item.commandResponse.map(paras => {
          return {
            ...paras,
            index: paras.serviceCapabilityCode
          }
        });
      }
    },
    _deleteCommandListAndPropertiesList (serviceCapabilityCode, name) {
      const parames = {
        serviceCapabilityCode: [serviceCapabilityCode]
      }
      this.$confirm(`此操作将永久删除该${name}能力, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCommandListAndPropertiesList(parames).then(res => {
          if (res.code === '200') {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              position: 'bottom-right'
            });
            this._getCapability({
              productNo: this.productNo
            });
          }
        });
      });
    },
    showPage (collapseIndex, tabIndex, item) {
      this.collapseIndex = `collapse${collapseIndex}`;
      this.tabIndex = tabIndex;
      const refName = `collapse${tabIndex}`;
      if (this.currentTable) {
        this.currentTable.getPageTable();
      }
      this.currentTable = this.$refs[refName][collapseIndex - 1];
      this.currentTable.onSetCurrentRow(item.serviceCapabilityCode, 'serviceCapabilityCode');
    },
    addMaintainDialogCancel () {

    },
    addMaintainDialogSubmit () {

    },
    onPushSearch (val) {
      this.pushSearchVal = {
        ...val
      };
      this.onCurrentChange(1);
    },
    // 分页切换页面
    onCurrentChange (val) {
      this.page.current = val;
      this._getPublishSubscribeForPage()
    },
    onPageSizeChange (val) {
      this.page.pageSize = val
      this.onCurrentChange(1)
    },
    onSelectionChange (list) {
      this.selectList = list.map(ls => ls.code);
    },
    addParames (type, item) {
      this.addParameDialog.show = true;
      this.addParameDialog.type = type;
      this.addParameDialog.form = {
        ...item
      };
      this.addParameDialog.title = '新增参数';
      if (item) {
        this.addParameDialog.title = '编辑参数';
      }
    },
    delParames (type, item) {
      if (type === 'query') {
        this.addOrderDialog.queryTableData = this.addOrderDialog.queryTableData.filter(data => !(data.index === item.index));
      } else if (type === 'response') {
        this.addOrderDialog.responseTableData = this.addOrderDialog.responseTableData.filter(data => !(data.index === item.index));
      }
    },
    addParameDialogCancel () {
      this.addParameDialog.show = false;
      this.addParameDialog.type = 'query';
      this.addParameDialog.form = {};
      this.$refs.paramesFormItem.resetForm();
    },
    async addParameDialogSubmit () {
      const formVal = await this.$refs.paramesFormItem.getValue();
      const type = this.addParameDialog.type;
      const val = JSON.parse(JSON.stringify(formVal));
      if (type === 'query') {
        if (!val.index) {
          this.addOrderDialog.queryTableData.push({
            ...val,
            capabilityCode: this.addOrderDialog.capabilityCode,
            index: this.addOrderDialog.queryTableData.length + 1
          });
        } else {
          this.addOrderDialog.queryTableData = this.addOrderDialog.queryTableData.map(data => {
            return data.index === val.index ? val : data
          });
        }
      } else if (type === 'response') {
        if (!val.index) {
          this.addOrderDialog.responseTableData.push({
            ...val,
            capabilityCode: this.addOrderDialog.capabilityCode,
            index: this.addOrderDialog.responseTableData.length + 1
          });
        } else {
          this.addOrderDialog.responseTableData = this.addOrderDialog.responseTableData.map(data => {
            return data.index === val.index ? val : data
          });
        }
      }
      this.addParameDialogCancel();
    },
    _deleteCapability (capabilityCode) {
      this.$confirm('此操作将永久删除该服务能力, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCapability([capabilityCode]).then(res => {
          if (res.code === '200') {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              position: 'bottom-right'
            });
            this._getCapability({
              productNo: this.productNo
            });
          }
        });
      });
    },
    _getPublishSubscribeForPage () {
      let data = {
        data: {
          ...this.pushSearchVal
        },
        pageNo: Number(this.page.current), // 查询的分页页码
        pageSize: Number(this.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: ''
      }
      getPublishSubscribeForPage(data).then(res => {
        if (res.code === '200') {
          const {
            data,
            total
          } = res.data;
          this.page.total = total;
          this.tableData = data;
        }
      });
    },
    showPush (type, item) {
      this.addPushDialog.show = true;
      this.addPushDialog.form = item;
      this.addPushDialog.title = '新增订阅消息';
      if (item) {
        this.addPushDialog.title = '编辑订阅消息';
      }
    },
    addPushDialogCancel () {
      this.addPushDialog.show = false;
      this.addPushDialog.form = {};
      this.$refs.pushFormItem.resetForm();
    },
    async addPushDialogSubmit () {
      let methodApi = insertPublishSubscribe;
      const formVal = await this.$refs.pushFormItem.getValue();
      const parames = {
        ...formVal
      };
      let message = '新增成功';
      if (formVal.code) {
        parames.code = formVal.code;
        methodApi = updatePublishSubscribe;
        message = '编辑成功';
      }
      methodApi(parames).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: message,
            type: 'success',
            position: 'bottom-right'
          });
          this._getPublishSubscribeForPage();
          this.addPushDialogCancel();
        }
      })
    },
    showPushDel (item) {
      this.$confirm('此操作将永久删除该消息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePublishSubscribe([item.code]).then(res => {
          if (res.code === '200') {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              position: 'bottom-right'
            });
            this._getPublishSubscribeForPage();
          }
        });
      });
    },
    goDeviceManage () {
      routePush({
        name: 'equipmentList',
        query: {
          productNo: this.info.productNo
        }
      });
    }
  }
}
</script>

<style lang="less">
#productManagementPage{
  #formItemText{
    .el-form-item{
      .el-form-item__content{
        color:rgba(73,73,73,1);
        .keyWord{
          display: inline-block;
          button{
            padding: 0;
          }
        }
      }
    }
  }
  .productBaseInfo{
    background: #fff;
    margin-bottom: 10px;/*no*/
    padding: 20px;
    .deviceCount{
      button{
        font-size: 12px;/*no*/
        padding-top: 0;
        padding-bottom: 0;
        margin-left: 10px;/*no*/
      }
    }
  }
  >.el-tabs{
    height: 100%;
    >.el-tabs__header{
      border-color: #D5D5D5;
      .el-tabs__nav{
        .el-tabs__item{
          background:rgba(255,255,255,1);
          font-size:14px;/*no*/
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(69,69,69,1);
          margin-right: 4px;/*no*/
          i{
            font-size: 14px;/*no*/
          }
          &.is-active{
            background:rgba(38,90,202,1);
            color:rgba(255,255,255,1);
            border-bottom: none;
          }
        }
      }
    }
    .el-tabs__content{
      height: calc(100% - 56px);/*no*/
      >div{
        height: 100%;
        // &:first-child{
          #card{
            background: #fff;
            padding: 40px 20px 20px;/*no*/
            .cardTitle{
              color: #333333;
              font-weight: normal;
            }
          }
        // }
      }
      .panelContainer, .noHavePanelContainer{
        position: relative;
        padding: 10px;/*no*/
        background: #fff;
        box-shadow:0px 4px 6px 0px rgba(221,221,221,1);/*no*/
        .addServe{
          padding: 10px;/*no*/
          background:rgba(37,115,241,1);
          box-shadow:0px 2px 4px 0px rgba(190,214,251,1);/*no*/
        }
        .panelMain{
          margin: 20px 0;/*no*/
          padding: 0 20px;/*no*/
          justify-content: space-between;
          .lever1{
            display: flex;
            flex: 3;
            align-items: center;
            position: relative;
            .serverLeg{
              padding: 3px 20px;/*no*/
              position: absolute;
              right: 3%;
              top: 50%;
              transform: translateY(-135%);
              background:rgba(230,241,253,1);
              border-radius:50px;
              font-size:12px;
              font-family:PingFangSC-Regular,PingFang SC;
              font-weight:400;
              color:rgba(21,49,73,1);
            }
            .icon{
              display: inline-block;
              position: relative;
              text-align: center;
              .iconBox{
                width:72px;/*no*/
                height:72px;/*no*/
                margin-bottom: 22px;
                background:url(./images/img1.png) no-repeat center;
                background-size: 100% 100%;
                border-radius: 50%;
                font-size:14px;/*no*/
                font-family:PingFangSC-Semibold,PingFang SC;
                font-weight:600;
                color:rgba(42,42,42,1);
                position: relative;
                i{
                  font-size: 30px;/*no*/
                  color: #fff;
                }
              }
              &::before{
                content: '';
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                right: -30px;/*no*/
                width:8px;/*no*/
                height:8px;/*no*/
                background:rgba(198,198,198,1);
                border-radius: 50%;
                z-index: 1;
              }
            }
            &::after{
              content: '';
              width:calc(100% - 105px);/*no*/
              height: 1px;/*no*/
              background: #D6D6D6;
              position: absolute;
              right: 0px;/*no*/
            }
          }
          .lever2{
            flex: 7;
            position: relative;
            justify-content: center;
            >.line{
              width: 1px;
              height: calc(100% - 64px);/*no*/
              position: absolute;
              top: 50%;
              left: 0;
              -webkit-transform: translateY(-50%);
              transform: translateY(-50%);
              background: #c6c6c6;
            }
            .item{
              margin-bottom: 20px;/*no*/
              align-items: center;
              .parent{
                width: 500px;
                height: 64px;/*no*/
                font-size:12px;
                font-family:PingFangSC-Semibold,PingFang SC;
                font-weight:600;
                color:rgba(42,42,42,1);
                // margin-bottom: 50px;/*no*/
                padding:0 220px 0 133px;
                position: relative;
                .iconBox{
                  font-size: 30px;/*no*/
                  color: #0F9AD8;
                  margin-bottom: 5px;/*no*/
                  width: 30px;/*no*/
                  height: 30px;/*no*/
                  border-radius: 50%;
                  border: 3px solid #2CB9F7;
                  i{
                    font-size: 11px;
                  }
                }
                &:last-child{
                  margin-bottom: 0;
                }
                &::before{
                  content: '';
                  position: absolute;
                  top: 50%;
                  transform: translateY(-50%);
                  left: 90px;
                  width:8px;/*no*/
                  height:8px;/*no*/
                  background:rgba(198,198,198,1);
                  border-radius: 50%;
                }
                &::after{
                  content: '';
                  width:88px;
                  height: 1px;/*no*/
                  background: #D6D6D6;
                  position: absolute;
                  left: 0px;/*no*/
                }
              }
              .children{
                justify-content: center;
                position: relative;
                .childItem{
                  display: flex;
                  padding: 5px 16px;/*no*/
                  font-size:12px;/*no*/
                  font-family:PingFangSC-Regular,PingFang SC;
                  font-weight:400;
                  color:rgba(255,255,255,1);
                  box-shadow:0px 4px 4px 0px rgba(224,241,252,1);/*no*/
                  border-radius:50px;/*no*/
                  margin-bottom: 7px;/*no*/
                  margin-left: 320px;
                  position: relative;
                  cursor: pointer;
                  &:last-child{
                    margin-bottom: 0;
                  }
                  &::after{
                    content: '';
                    width:295px;
                    height: 1px;/*no*/
                    background: #D6D6D6;
                    position: absolute;
                    left: -320px;
                    top: 50%;
                    transform: translateY(-50%);
                  }
                  &.properties{
                    background:linear-gradient(135deg,rgba(66,208,182,1) 0%,rgba(22,173,206,1) 100%);
                  }
                  &.command{
                    background:linear-gradient(135deg,rgba(249,121,111,1) 0%,rgba(243,85,85,1) 100%);
                  }
                  &.is-active{
                    background:linear-gradient(135deg,rgba(109,163,255,1) 0%,rgba(9,113,246,1) 100%);
                  }
                }
                .line{
                  width: 1px;/*no*/
                  position: absolute;
                  top:50%;
                  left: 0;
                  transform: translateY(-50%);
                  background:rgba(198,198,198,1);
                }
                &::after{
                  content: '';
                  width:180px;
                  height: 1px;/*no*/
                  background: #D6D6D6;
                  position: absolute;
                  left: -180px;
                  top: 50%;
                  transform: translateY(-50%);
                }
                &.noChildren{
                   &::after{
                     content: none;
                   }
                }
              }
              &:last-child{
                margin-bottom: 0;
                .parent{
                  align-self: flex-end;
                }
              }
              &.index0{
                .parent{
                  align-self: flex-start;
                }
              }
            }
            // &::after{
            //   content: '';
            //   width: 1px;/*no*/
            //   height: calc(100% - 64px);/*no*/
            //   position: absolute;
            //   top:50%;
            //   left: 0;
            //   transform: translateY(-50%);
            //   background:rgba(198,198,198,1);
            // }
          }
        }
        .panelLeg{
          text-align: right;
          span{
            display: inline-block;
            width:10px;/*no*/
            height:10px;/*no*/
            background:linear-gradient(135deg,rgba(66,208,182,1) 0%,rgba(22,173,206,1) 100%);
            box-shadow:0px 4px 4px 0px rgba(226,234,240,1);/*no*/
            border-radius:2px;/*no*/
            margin-right: 5px;/*no*/
            margin-left: 15px;/*no*/
            font-size:12px;/*no*/
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(100,100,100,1);
            &:last-child{
              background:linear-gradient(135deg,rgba(249,121,111,1) 0%,rgba(243,85,85,1) 100%);
              box-shadow:0px 4px 4px 0px rgba(249,234,231,1);
            }
          }
        }
      }
      .noHavePanelContainer{
        height:809px;
        img{
          width: 257px;/*no*/
          height: 181px;/*no*/
          margin-bottom: 10px;/*no*/
        }
        .text{
          font-size:14px;/*no*/
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(78,78,78,1);
          margin-bottom: 20px;
        }
        .addServe{

        }
      }
      .collapseContainer{
        margin-top: 10px;/*no*/
        .el-collapse{
          .el-collapse-item{
            margin-bottom: 10px;/*no*/
            padding: 0 10px;/*no*/
            background-color: #FFF;
            .collapseTitle{
              width: 100%;
              line-height: 20px;/*no*/
              display: inline-block;
              padding: 0 15px;/*no*/
              border-left: 4px solid #1957D0;/*no*/
              i{
                float: right;
              }
            }
            .el-collapse-item__content{
              position: relative;
            }
            .btnList{
              position: absolute;
              top: 10px;/*no*/
              right: 0;
              z-index: 1;
              button{
                background:rgba(47,115,225,1);
                border-radius:50px;
                padding: 4px 12px;/*no*/
                font-size:12px;/*no*/
                font-family:PingFangSC-Regular,PingFang SC;
                font-weight:400;
                color:rgba(255,255,255,1);
                margin-left: 10px;/*no*/
              }
            }
            .el-tabs{
              .el-tabs__header{
                .el-tabs__nav{
                  .el-tabs__active-bar{
                    background-color: #1755CC;
                    height: 3px;/*no*/
                  }
                  .el-tabs__item{
                    width: 68px;/*no*/
                    padding: 0 10px;/*no*/
                    text-align: center;
                    &:nth-of-type(2n) {
                      padding-left: 0;
                    }
                    &:last-child {
                      padding-right: 0;
                    }
                    &.is-active{
                      color: #1755CC;
                    }
                  }
                }
              }
              .el-tabs__content{
                .el-table{
                  border: none;
                  table.el-table__header{
                    tr{
                      th{
                        background: #F4F5FA;
                        border-bottom: none;
                        border-color: #D2D7F2;
                        font-size:12px;/*no*/
                        font-family:PingFangSC-Medium,PingFang SC;
                        font-weight:500;
                        color:rgba(67,67,67,1);
                        &:nth-last-child(2) {
                          border-right: 0;
                        }
                      }
                    }
                  }
                  table.el-table__body{
                    tr{
                      td{
                        border-right: 0;
                        border-bottom: 1px solid #D2D7F2;/*no*/
                      }
                      &.current-row{
                          background:rgba(240,246,255,1);
                          box-shadow:0px 1px 0px 0px rgba(212,212,212,0.5);/*no*/
                          td{
                            color:rgba(9,113,246,1);
                          }
                        }
                    }
                  }
                }
              }
            }
          }
        }
      }
      .maintainContainer{
        width: 100%;
        height: calc(100vh - 180px);/*no*/
        background: #fff;
        .info{
          >img{
            width: 226px;
            height: 142px;
            margin-bottom: 21px;
          }
          div{
            width: 100%;
            text-align: left;
            margin-bottom: 10px;
            span:first-child{
              margin-right: 20px;
            }
          }
        }
        .btnList{
          margin-top: 38px;
          .btn{
            width:218px;
            height:56px;
            background:linear-gradient(135deg,rgba(88,162,255,1) 0%,rgba(17,102,239,1) 100%);
            box-shadow:0px 6px 9px 0px rgba(228,232,255,1);/*no*/
            border-radius:10px;
            cursor: pointer;
            position: relative;
            justify-content: center;
            padding-left: 62px;
            &:first-child{
              margin-bottom: 20px;/*no*/
              margin-right: 14px;
              background: url(./images/img5.png) no-repeat center;
              background-size: 100% 100%;
              .imgBox{
                background:rgba(62,131,227,1);
              }
              img{
                width: 22px;
                height: 24px;
                left: 17px;
              }
            }
            &:last-child{
              background: url(./images/img6.png) no-repeat center;
              background-size: 100% 100%;
              box-shadow:0px 6px 9px 0px rgba(221,247,245,1);/*no*/
              .imgBox{
                background:rgba(37,201,192,1);
              }
              img{
                width: 30px;
                height: 33px;
              }
            }
            span {
              font-size:10px;
              font-family:PingFangSC-Regular,PingFang SC;
              font-weight:normal;
              color:rgba(237,254,255,1);
              line-height:14px;
              &.maintainTitle{
                font-size:14px;
                font-family:PingFangSC-Semibold,PingFang SC;
                font-weight:600;
                color:rgba(255,255,255,1);
                line-height:20px;
                margin-bottom: 3px;
              }
            }
            .imgBox{
              width: 48px;
              height: 48px;
              position: absolute;
              left: 4px;
              top: 50%;
              transform: translateY(-50%);
              border-radius:7px;
            }
          }
        }
      }
      .pushContainer{
        width: 100%;
        height: calc(100vh - 180px);/*no*/
        background: #fff;
        padding: 20px;
      }
    }
  }
}
.oderParameTable{
  >button{
    width: 125px;/*no*/
    margin-bottom: 10px;/*no*/
  }
  .adminComp-page-table{
    max-height: 200px;
    overflow-y: auto;
    .el-table__body-wrapper{
      border-right: 1px solid #D9D9D9;/*no*/
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
</style>
