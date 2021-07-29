/* eslint-disable camelcase */
<template>
  <div id="useManagePage">
    <card title="基本信息" :className="'adminCard baseInfo'">
      <FormItem
        ref="baseForm"
        :formItems="baseInfo.formItems"
        :rules="baseInfo.formRules"
        :disabled="baseInfo.inputDisabled"
        :isEdit="baseInfo.isEdit"
        :form="baseInfo.form"
        :midway="baseInfo.midway"
      >
      </FormItem>
    </card>
    <div class="flexRow flexCenter btnList">
      <el-button
        type="text"
        size="small"
        title="取消"
        :style="{ marginRight: '10px' }"
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
    <dialog-cont
      @on-cancel="addFlowCancel"
      @on-confirm="addFlowSubmit"
      :visible.sync="addFlow.show"
      width="80%"
      :title="addFlow.title"
      append-to-body
      :customClass="'addFlowDialog'"
    >
      <div class="flowCard">
        <div class="cardTitle">产品属性与业务模型字段映射</div>
        <div class="content">
          <FormItem
            ref="businessForm"
            :formItems="addFlow.businessFormItems"
            :rules="addFlow.formRules"
            :disabled="addFlow.inputDisabled"
            :isEdit="addFlow.isEdit"
            :form="addFlow.businessForm"
            :midway="addFlow.midway"
          >
            <template v-slot:serviceCapabilityCode>
              <el-select
                v-model="addFlow.businessForm.serviceCapabilityCode"
                :multiple="false"
                style="marginright: 10px"
              >
                <el-option
                  v-for="(option, oIndex) in addFlow.businessFormItems[0]
                    .options"
                  :label="option.name"
                  :value="option.id"
                  :key="`serviceCapabilityCode-${oIndex}`"
                />
              </el-select>
            </template>
            <template v-slot:dataType>
              <div class="flexRow">
                <el-select
                  v-model="addFlow.businessForm['dataType']"
                  :multiple="false"
                  style="marginright: 10px"
                  disabled
                >
                  <el-option
                    v-for="(option, oIndex) in addFlow.businessFormItems[1]
                      .options"
                    :label="option.name"
                    :value="option.id"
                    :key="`dataType-${oIndex}`"
                  />
                </el-select>
                <el-input v-model="addFlow.businessForm['method']" disabled />
              </div>
            </template>
          </FormItem>
        </div>
      </div>
      <div class="flowCard">
        <div class="cardTitle">预处理流程</div>
        <div class="content">
          <FormItem
            ref="flowFormItem"
            :formItems="addFlow.flowFormItems"
            :rules="addFlow.flowFormRules"
            :disabled="addFlow.inputDisabled"
            :isEdit="addFlow.isEdit"
            :form="addFlow.flowForm"
            :midway="addFlow.midway"
          >
            <template v-slot:handleCommands>
              <el-select
                v-model="addFlow.flowForm.handleCommands"
                :multiple="true"
                style="marginright: 10px"
              >
                <el-option
                  v-for="(option, oIndex) in addFlow.flowFormItems[0].options"
                  :label="option.name"
                  :value="option.id"
                  :key="`handleCommands-${oIndex}`"
                />
              </el-select>
            </template>
          </FormItem>
          <el-divider>执行顺序</el-divider>
          <SortableList lockAxis="y" v-model="addFlow.flowItems">
            <SortableItem
              v-for="(item, index) in addFlow.flowItems"
              :index="index"
              :key="index"
              :item="item"
            >
              <div class="sortableListItem">
                <div class="flexCenter itemIndex">
                  {{ index + 1 }}
                </div>
                <div class="itemTitle">{{ item.title }}</div>
                <div class="itemContent">
                  <FormItem
                    :formItems="[
                      {
                        label: '前置条件：',
                        prop: 'conditionMark',
                        labelWidth: '60px',
                        inputType: 'custom',
                        class: 'noBottom',
                        span: 8,
                      },
                      {
                        label: '转换公式',
                        prop: 'defaultValue',
                        labelWidth: '60px',
                        inputType: 'custom',
                        class: 'noBottom',
                        offset: 2,
                        span: 14,
                      },
                    ]"
                    :form="item.form"
                  >
                    <template v-slot:conditionMark>
                      <div class="flexRow">
                        <el-select
                          v-model="item.form['conditionMark']"
                          :multiple="false"
                          style="marginright: 10px"
                        >
                          <el-option
                            v-for="(option, oIndex) in decimalTypes"
                            :label="option.name"
                            :value="option.id"
                            :key="oIndex"
                          />
                        </el-select>
                        <el-input v-model="item.form['conditionValue']" />
                      </div>
                    </template>
                    <template v-slot:defaultValue>
                      <div class="flexRow">
                        <el-input v-model="item.form['defaultValue']" />
                      </div>
                    </template>
                  </FormItem>
                </div>
                <div class="flexCloumn btnList">
                  <div class="top" @click="handleTop(index)">
                    <i class="el-icon-caret-top" />
                  </div>
                  <div class="down" @click="handleDowm(index)">
                    <i class="el-icon-caret-bottom" />
                  </div>
                </div>
              </div>
            </SortableItem>
          </SortableList>
        </div>
      </div>
    </dialog-cont>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { ContainerMixin, ElementMixin } from "vue-slicksort";
import PageTable from "@/components/adminPage-table";
import Flex from "@/components/flex";
import Card from "view/lightPole/lightPoleStatistical/components/card";
import FormItem from "@/components/adminFormItem";
import dialogCont from "@/components/adminDialog";
import Main from "@/view/admin/equipmentAccess/productManagement/main";
import { decimalTypes } from "@/view/admin/ruleEngine/ruleManagement/detail";
import { METHOD_TYPE } from "@/util/constants";
import {
  addReportRelation,
  updateReportRelation,
  getDeviceProductForPage,
  getCapability,
  getPropertiesList,
  getDataType,
  getReportRelationHandle,
  getReportRelationDataModule,
  getReportRelationDtl,
} from "api/admin";

const SortableList = {
  mixins: [ContainerMixin],
  template: `
    <ul class="list sortableList">
      <slot />
    </ul>
  `,
};
const SortableItem = {
  mixins: [ElementMixin],
  props: ["item"],
  template: `
    <li class="list-item">
      <slot />
    </li>
  `,
};
export default {
  name: "useManagePage",
  data() {
    return {
      decimalTypes,
      baseInfo: {
        form: {},
        formRules: {},
        inputDisabled: false,
        isEdit: false,
        midway: false,
        formItems: [
          {
            label: "应用ID",
            prop: "ruleName",
            labelWidth: "80px",
            inputType: "input",
            required: true,
            hide: true,
            span: 6,
          },
          {
            label: "应用名称",
            prop: "relationName",
            labelWidth: "80px",
            inputType: "input",
            required: true,
            span: 6,
          },
          {
            label: "应用描述",
            prop: "remark",
            labelWidth: "80px",
            inputType: "textarea",
            maxlength: 455,
            span: 24,
          },
        ],
      },
      flowInfo: {
        form: {
          productName: undefined,
          capabilityCode: undefined,
          clazzModule: undefined,
        },
        changeForm: {},
        formRules: {},
        inputDisabled: false,
        isEdit: false,
        midway: true,
        formItems: [
          {
            label: "产品",
            prop: "productName",
            labelWidth: "50px",
            inputType: "custom",
            required: true,
            span: 6,
          },
          {
            label: "服务类型",
            prop: "capabilityCode",
            labelWidth: "80px",
            inputType: "custom",
            required: true,
            options: [],
            offset: 3,
            span: 6,
          },
          {
            label: "业务模型",
            prop: "clazzModule",
            labelWidth: "80px",
            inputType: "custom",
            options: [],
            offset: 3,
            span: 6,
          },
        ],
        itemsvalue: "",
      },
      // page: {
      //   current: 1,
      //   pageSize: 10,
      //   total: 0
      // },
      tableData: [],
      tableCols: [
        { label: "属性名称", prop: "serviceCapabilityProperties" },
        { label: "模型字段", prop: "clazzModuleProperties" },
        { label: "中文描述", prop: "clazzModulePropertiesDesc" },
        {
          label: "预处理事件",
          prop: "createTime",
          minWidth: "120px",
          render: (h, scoped) => {
            let processHandleList = [];
            scoped.row.handleCommands &&
              scoped.row.handleCommands.map((command) => {
                processHandleList.push(command.processHandle);
              });
            return <div>{processHandleList.join(",")}</div>;
          },
        },
      ],
      addFlow: {
        show: false,
        title: "新增预处理事件",
        businessForm: {
          rang: {
            min: "",
            max: "",
          },
        },
        businessChangeForm: {},
        formRules: {},
        inputDisabled: false,
        isEdit: false,
        midway: true,
        businessFormItems: [
          {
            label: "属性名称",
            prop: "serviceCapabilityCode",
            labelWidth: "80px",
            inputType: "custom",
            required: true,
            options: [],
            span: 6,
          },
          {
            label: "数据类型",
            prop: "dataType",
            labelWidth: "80px",
            inputType: "custom",
            options: [],
            disabled: true,
            offset: 3,
            span: 6,
          },
          {
            label: "取值范围",
            prop: "rang",
            labelWidth: "80px",
            inputType: "inputRang",
            disabled: true,
            offset: 3,
            span: 6,
          },
          {
            label: "单位",
            prop: "unit",
            labelWidth: "50px",
            inputType: "input",
            disabled: true,
            span: 6,
          },
          {
            label: "模型字段： ",
            prop: "clazzModuleProperties",
            labelWidth: "80px",
            inputType: "select",
            options: [],
            offset: 3,
            span: 6,
          },
          {
            label: "中文描述：",
            prop: "description",
            labelWidth: "80px",
            inputType: "input",
            disabled: true,
            offset: 3,
            span: 6,
          },
        ],
        flowForm: {
          handleCommands: [],
        },
        flowFormRules: {},
        flowFormItems: [
          {
            label: "执行事件：",
            prop: "handleCommands",
            labelWidth: "80px",
            inputType: "custom",
            required: true,
            multiple: true,
            options: [],
            span: 24,
          },
        ],
        flowItems: [],
      },
      editData: {},
    };
  },
  watch: {},
  mounted() {
    this.$nextTick(async () => {
      if (this.openPage === "useManagePage") {
        this.editData = this.common["useManagePage"];
        if (this.editData && this.editData.code) {
          getReportRelationDtl(this.editData.code).then(async (res) => {
            if (res.code === "200") {
              this.editData = { ...res.data, toName: this.editData.toName };
              this.$set(this.baseInfo, "form", {
                relationName: this.editData.relationName,
                remark: this.editData.remark,
              });
            }
          });
        }
      }
    });
  },
  components: {
    PageTable,
    Flex,
    Card,
    FormItem,
    dialogCont,
    Main,
    SortableList,
    SortableItem,
  },
  computed: {
    ...mapGetters(["common", "openPage"]),
  },
  methods: {
    _getCapability(parames) {
      return getCapability(parames).then(async (res) => {
        if (res.code === "200") {
          return res.data.map((data) => {
            return {
              id: data.capabilityCode,
              name: data.capabilityName,
            };
          });
        }
      });
    },
    handleAddFlow() {
      this.addFlow.show = true;
      this.addFlow.businessForm = {
        rang: {
          min: "",
          max: "",
        },
      };
      this.addFlow.businessChangeForm = {};
    },
    addFlowCancel() {
      this.addFlow.show = false;
      this.addFlow.businessForm = {
        rang: {
          min: "",
          max: "",
        },
      };
      this.$refs.businessForm.resetForm();
      this.addFlow.businessChangeForm = {};
      this.addFlow.flowForm = {};
      this.addFlow.flowItems = [];
    },
    async addFlowSubmit() {
      const businessValue = await this.$refs["businessForm"].getValue();
      const businessForm = {
        ...this.addFlow.businessForm,
        ...businessValue,
      };
      const handleCommands = this.addFlow.flowItems.map((item, index) => {
        return {
          ...item.form,
          sort: index,
        };
      });
      const serviceCapability = this.addFlow.businessFormItems[0].options.find(
        (option) => option.id === businessForm.serviceCapabilityCode
      );
      const clazzModuleProperties =
        this.addFlow.businessFormItems[4].options.find(
          (option) => option.id === businessForm.clazzModuleProperties
        );
      const parames = {
        clazzModulePropertiesDesc:
          clazzModuleProperties && clazzModuleProperties.des,
        clazzModuleProperties:
          clazzModuleProperties && clazzModuleProperties.id,
        serviceCapabilityCode: serviceCapability.id,
        serviceCapabilityProperties: serviceCapability.name,
        code: businessForm.code,
        handleCommands: handleCommands,
      };
      const tableData = JSON.parse(JSON.stringify(this.tableData));
      const tableDataIndex = tableData.findIndex(
        (data) => data.serviceCapabilityCode === parames.serviceCapabilityCode
      );
      if (tableDataIndex !== -1) {
        tableData[tableDataIndex] = {
          ...parames,
        };
      } else {
        tableData.push(parames);
      }
      this.$set(this, "tableData", tableData);
      this.addFlowCancel();
    },
    handleTop(index) {
      const fieldItems = JSON.parse(JSON.stringify(this.addFlow.flowItems));
      if (index !== 0) {
        fieldItems[index] = fieldItems.splice(
          index - 1,
          1,
          fieldItems[index]
        )[0];
      } else {
        fieldItems.push(fieldItems.shift());
      }
      this.$set(this.addFlow, "flowItems", fieldItems);
    },
    handleDowm(index) {
      const fieldItems = JSON.parse(JSON.stringify(this.addFlow.flowItems));
      if (index !== fieldItems.length - 1) {
        fieldItems[index] = fieldItems.splice(
          index + 1,
          1,
          fieldItems[index]
        )[0];
      } else {
        fieldItems.unshift(fieldItems.splice(index, 1)[0]);
      }
      this.$set(this.addFlow, "flowItems", fieldItems);
    },
    showView(type, item) {
      if (type === "detail") {
        this.addFlow.businessForm = {
          clazzModuleProperties: item.clazzModuleProperties,
          clazzModulePropertiesDesc: item.clazzModulePropertiesDesc,
          serviceCapabilityCode: item.serviceCapabilityCode,
          serviceCapabilityProperties: item.serviceCapabilityProperties,
        };
        let handleCommands = [];
        let flowItems = [];
        item.handleCommands.map((command) => {
          handleCommands.push(command.processHandle);
          flowItems.push({
            form: {
              ...command,
            },
            title: command.processHandle,
          });
        });
        this.addFlow.flowForm = {
          handleCommands: handleCommands,
        };
        this.addFlow.flowItems = flowItems;
        this.handleAddFlow();
      }
      if (type === "del") {
        const tableData = JSON.parse(JSON.stringify(this.tableData));
        const tableIndex = tableData.findIndex(
          (data) => data.serviceCapabilityCode === item.serviceCapabilityCode
        );
        tableData.splice(tableIndex, 1);
        this.tableData = tableData;
      }
    },
    handleCancel() {
      this.$router.push({
        name: this.editData.toName,
      });
      this.baseInfo.form = {};
      this.$refs.baseForm.resetForm();
      // this.flowInfo.form = {};
      // this.$refs.flowForm.resetForm();
    },
    async handleSave() {
      let apiMethod = addReportRelation;
      let message = "新增成功";
      const baseFormValue = await this.$refs["baseForm"].getValue();
      const clazzModuleItem = this.flowInfo.formItems[2].options.find(
        (option) => option.id === this.flowInfo.form.clazzModule
      );
      const parames = {
        capabilityCode: this.flowInfo.form.capabilityCode,
        productName: this.flowInfo.form.productName,
        productNo: this.flowInfo.form.productNo,
        clazzModule: clazzModuleItem && clazzModuleItem.id,
        clazzModuleDesc: clazzModuleItem && clazzModuleItem.des,
        relationName: baseFormValue.relationName,
        remark: baseFormValue.remark,
        propertiesCommands: this.tableData,
      };
      if (this.editData && this.editData.code) {
        apiMethod = updateReportRelation;
        parames.code = this.editData.code;
        message = "修改成功";
      }
      apiMethod(parames).then((res) => {
        if (res.code === "200") {
          this.$notify({
            title: "成功",
            message: message,
            type: "success",
            position: "bottom-right",
          });
          this.handleCancel();
        }
      });
    },
  },
};
</script>

<style lang="less">
#useManagePage {
  #card {
    padding-left: 20px; /*no*/
    padding-right: 20px; /*no*/
    padding-bottom: 20px; /*no*/
    .el-row {
      .selectProduct {
        position: relative;
        height: 30px; /*no*/
        padding: 0 46px 0 10px; /*no*/
        border-radius: 4px; /*no*/
        border: 1px solid #d9d9d9; /*no*/
        align-items: center;
        justify-content: space-between;
        font-size: 12px; /*no*/
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(98, 98, 98, 1);
        span {
          width: 100%;
          overflow: hidden;
          word-break: keep-all;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        button {
          font-size: 12px; /*no*/
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(38, 90, 202, 1);
          padding: 0;
          height: 100%;
          display: flex;
          align-items: center;
          position: absolute;
          top: 0;
          right: 10px; /*no*/
          i {
            font-size: 10px; /*no*/
            color: #265aca;
          }
        }
      }
    }
    .el-divider {
      margin: 0;
    }
    .addFlow {
      margin: 10px 0; /*no*/
    }
  }
  .btnList {
    height: 70px;
    margin-top: 10px; /*no*/
    // background: #fff;
    justify-content: center !important;
    align-items: center !important;
    button {
      font-size: 14px; /*no*/
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(37, 115, 241, 1);
      width: 82px; /*no*/
      height: 36px; /*no*/
      background: rgba(255, 255, 255, 1);
      border-radius: 1px; /*no*/
      border: 1px solid rgba(37, 115, 241, 1);
      &.el-button--primary {
        background: rgba(37, 115, 241, 1);
        box-shadow: 0px 2px 4px 0px rgba(205, 205, 205, 1);
        color: rgba(230, 236, 255, 1);
        border-color: #1d5bfa;
      }
    }
  }
}
.addFlowDialog {
  .el-divider {
    background-color: #b1c4e3;
    margin: 30px 0; /*no*/
  }
  .flowCard {
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(224, 224, 224, 1); /*no*/
    margin-bottom: 20px; /*no*/
    .cardTitle {
      background: rgba(229, 238, 253, 1);
      border-radius: 1px; /*no*/
      padding: 13px 26px; /*no*/
      position: relative;
      font-size: 14px; /*no*/
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(71, 71, 71, 1);
      &::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 12px; /*no*/
        transform: translateY(-50%);
        width: 4px; /*no*/
        height: 14px; /*no*/
        background: rgba(37, 115, 241, 1);
      }
    }
    .content {
      padding: 20px; /*no*/
      .sortableList {
        padding-left: 60px; /*no*/
        > li {
          background: rgba(255, 255, 255, 1);
          box-shadow: 0px 0px 4px 0px rgba(205, 223, 255, 1); /*no*/
          border-radius: 1px; /*no*/
          border: 1px solid rgba(189, 214, 255, 1); /*no*/
          margin-bottom: 20px; /*no*/
          padding: 15px 50px 20px 20px; /*no*/
          position: relative;
          .itemIndex {
            position: absolute;
            background: url(./images/img1.png) no-repeat center;
            background-size: auto 100%;
            left: -60px; /*no*/
            top: 50%;
            transform: translateY(-50%);
            width: 35px; /*no*/
            height: 35px; /*no*/
            font-size: 14px; /*no*/
            font-family: DINAlternate-Bold, DINAlternate;
            font-weight: bold;
            color: rgba(2, 73, 187, 1);
            &::after {
              content: "";
              position: absolute;
              left: 50%;
              transform: translateX(-50%);
              top: 35px;
              width: 2px; /*no*/
              background: #f0f0f0;
              height: 115px; /*no*/
            }
          }
          .itemTitle {
            font-size: 14px; /*no*/
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: rgba(91, 91, 91, 1);
            padding-left: 10px; /*no*/
            position: relative;
            &::after {
              content: "";
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              left: 0;
              width: 4px; /*no*/
              height: 13px; /*no*/
              background: rgba(43, 182, 217, 1);
            }
          }
          .itemContent {
            margin-top: 10px; /*no*/
          }
          .btnList {
            position: absolute;
            right: 15px; /*no*/
            top: 50%;
            transform: translateY(-50%);
            align-items: center;
            > div {
              width: 18px; /*no*/
              height: 18px; /*no*/
              border-radius: 50%;
              background: rgba(207, 227, 255, 1);
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              i {
                color: #4486dc;
                font-size: 9px;
              }
              &:first-child {
                margin-bottom: 10px; /*no*/
              }
            }
          }
          &:first-child {
            .btnList {
              > div {
                &:first-child {
                  background: rgba(233, 233, 233, 1);
                  i {
                    color: #bababa;
                  }
                }
              }
            }
          }
          &:last-child {
            .itemIndex {
              &::after {
                content: none;
              }
            }
            .btnList {
              > div {
                &:last-child {
                  background: rgba(233, 233, 233, 1);
                  i {
                    color: #bababa;
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
</style>
