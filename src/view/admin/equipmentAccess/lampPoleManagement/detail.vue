<template>
  <div id="lampPoleManagementEdit">
    <card title="基本信息" :className="'adminCard'">
      <FormItemText :layout="baseInfoItems" labelWidth="0px"> </FormItemText>
    </card>
    <card title="灯杆承载设备" :className="'adminCard'">
      <FormItemText :layout="poleItems" labelWidth="0px"> </FormItemText>
      <div class="flexCenter timeInfo">
        <div class="timeContainer">
          <img
            class="lampPost"
            src="../../../lightPole/lightPoleDetail/images/img1.png"
          />
          <img
            class="lampLight"
            src="../../../lightPole/lightPoleDetail/images/img4.png"
            v-if="form.lampStatus"
          />
          <div
            class="item left item1"
            :class="baseModuleInfo['LAMP'] ? '' : 'noHave'"
          >
            <div class="charge_car_title">智慧照明</div>
            <div class="charge_car_val">
              <FormItemText
                :layout="baseModuleInfo['LAMP'] && baseModuleInfo['LAMP'].item"
                labelWidth="0px"
                :styles="{ width: '160px' }"
                v-if="baseModuleInfo['LAMP']"
              >
              </FormItemText>
              <div class="flexRow equipmentBtnList">
                <div
                  class="flexRow flexCenter add"
                  @click="
                    handleAction('add', {
                      sensorTypeCode: 'LAMP',
                      serialNumber:
                        baseModuleInfo['LAMP'] &&
                        baseModuleInfo['LAMP'].serialNumbe,
                    })
                  "
                >
                  <i class="iconfont icon-charu" />
                  {{ baseModuleInfo["LAMP"] ? "替换" : "绑定" }}
                </div>
                <div
                  class="flexRow flexCenter del"
                  @click="
                    handleAction('del', baseModuleInfo['LAMP'].serialNumber)
                  "
                >
                  <i class="iconfont icon-shanchu1" />
                  解绑
                </div>
              </div>
            </div>
          </div>
          <div
            class="item left green item2"
            :class="baseModuleInfo['CAMERA'] ? '' : 'noHave'"
          >
            <div class="charge_car_title">智慧监控</div>
            <div class="charge_car_val">
              <FormItemText
                :layout="
                  baseModuleInfo['CAMERA'] && baseModuleInfo['CAMERA'].item
                "
                labelWidth="0px"
                :style="{ width: '180px' }"
                v-if="baseModuleInfo['CAMERA']"
              >
              </FormItemText>
              <div class="flexRow equipmentBtnList">
                <div
                  class="flexRow flexCenter add"
                  @click="
                    handleAction('add', {
                      sensorTypeCode: 'CAMERA',
                      serialNumber:
                        baseModuleInfo['CAMERA'] &&
                        baseModuleInfo['CAMERA'].serialNumber,
                    })
                  "
                >
                  <i class="iconfont icon-charu" />
                  {{ baseModuleInfo["CAMERA"] ? "替换" : "绑定" }}
                </div>
                <div
                  class="flexRow flexCenter del"
                  @click="
                    handleAction('del', baseModuleInfo['CAMERA'].serialNumber)
                  "
                >
                  <i class="iconfont icon-shanchu1" />
                  解绑
                </div>
              </div>
            </div>
          </div>
          <div
            class="item left green item3"
            :class="baseModuleInfo['WIFI'] ? '' : 'noHave'"
          >
            <div class="charge_car_title">智慧WiFi</div>
            <div class="charge_car_val">
              <FormItemText
                :layout="baseModuleInfo['WIFI'] && baseModuleInfo['WIFI'].item"
                labelWidth="0px"
                :styles="{ width: '160px' }"
                v-if="baseModuleInfo['WIFI']"
              >
              </FormItemText>
              <div class="flexRow equipmentBtnList">
                <div
                  class="flexRow flexCenter add"
                  @click="
                    handleAction('add', {
                      sensorTypeCode: 'WIFI',
                      serialNumber:
                        baseModuleInfo['WIFI'] &&
                        baseModuleInfo['WIFI'].serialNumber,
                    })
                  "
                >
                  <i class="iconfont icon-charu" />
                  {{ baseModuleInfo["WIFI"] ? "替换" : "绑定" }}
                </div>
                <div
                  class="flexRow flexCenter del"
                  @click="
                    handleAction('del', baseModuleInfo['WIFI'].serialNumber)
                  "
                >
                  <i class="iconfont icon-shanchu1" />
                  解绑
                </div>
              </div>
            </div>
          </div>
          <div
            class="item left item4"
            :class="baseModuleInfo['BATTERY'] ? '' : 'noHave'"
          >
            <div class="charge_car_title">智慧充电</div>
            <div class="charge_car_val">
              <FormItemText
                :layout="
                  baseModuleInfo['BATTERY'] && baseModuleInfo['BATTERY'].item
                "
                labelWidth="0px"
                :styles="{ width: '160px' }"
                v-if="baseModuleInfo['BATTERY']"
              >
              </FormItemText>
              <div class="flexRow equipmentBtnList">
                <div
                  class="flexRow flexCenter add"
                  @click="
                    handleAction('add', {
                      sensorTypeCode: 'BATTERY',
                      serialNumber:
                        baseModuleInfo['BATTERY'] &&
                        baseModuleInfo['BATTERY'].serialNumber,
                    })
                  "
                >
                  <i class="iconfont icon-charu" />
                  {{ baseModuleInfo["BATTERY"] ? "替换" : "绑定" }}
                </div>
                <div
                  class="flexRow flexCenter del"
                  @click="
                    handleAction('del', baseModuleInfo['BATTERY'].serialNumber)
                  "
                >
                  <i class="iconfont icon-shanchu1" />
                  解绑
                </div>
              </div>
            </div>
          </div>
          <div
            class="item left item8"
            :class="baseModuleInfo['STATION'] ? '' : 'noHave'"
          >
            <div class="charge_car_title">微基站</div>
            <div class="charge_car_val">
              <FormItemText
                :layout="
                  baseModuleInfo['STATION'] && baseModuleInfo['STATION'].item
                "
                labelWidth="0px"
                :styles="{ width: '160px' }"
                v-if="baseModuleInfo['STATION']"
              >
              </FormItemText>
              <div class="flexRow equipmentBtnList">
                <div
                  class="flexRow flexCenter add"
                  @click="
                    handleAction('add', {
                      sensorTypeCode: 'STATION',
                      serialNumber:
                        baseModuleInfo['STATION'] &&
                        baseModuleInfo['STATION'].serialNumber,
                    })
                  "
                >
                  <i class="iconfont icon-charu" />
                  {{ baseModuleInfo["STATION"] ? "替换" : "绑定" }}
                </div>
                <div
                  class="flexRow flexCenter del"
                  @click="
                    handleAction('del', baseModuleInfo['STATION'].serialNumber)
                  "
                >
                  <i class="iconfont icon-shanchu1" />
                  解绑
                </div>
              </div>
            </div>
          </div>
          <div
            class="item green item11"
            :class="baseModuleInfo['AMBIENT'] ? '' : 'noHave'"
          >
            <div class="charge_car_title">智慧环境监测</div>
            <div class="charge_car_val">
              <FormItemText
                :layout="
                  baseModuleInfo['AMBIENT'] && baseModuleInfo['AMBIENT'].item
                "
                labelWidth="0px"
                :styles="{ width: '160px' }"
                v-if="baseModuleInfo['AMBIENT']"
              >
              </FormItemText>
              <div class="flexRow equipmentBtnList">
                <div
                  class="flexRow flexCenter add"
                  @click="
                    handleAction('add', {
                      sensorTypeCode: 'AMBIENT',
                      serialNumber:
                        baseModuleInfo['AMBIENT'] &&
                        baseModuleInfo['AMBIENT'].serialNumber,
                    })
                  "
                >
                  <i class="iconfont icon-charu" />
                  {{ baseModuleInfo["AMBIENT"] ? "替换" : "绑定" }}
                </div>
                <div
                  class="flexRow flexCenter del"
                  @click="
                    handleAction('del', baseModuleInfo['AMBIENT'].serialNumber)
                  "
                >
                  <i class="iconfont icon-shanchu1" />
                  解绑
                </div>
              </div>
            </div>
          </div>
          <div
            class="item green item5"
            :class="baseModuleInfo['AUDIO'] ? '' : 'noHave'"
          >
            <div class="charge_car_title">智慧广播</div>
            <div class="charge_car_val">
              <FormItemText
                :layout="
                  baseModuleInfo['AUDIO'] && baseModuleInfo['AUDIO'].item
                "
                labelWidth="0px"
                :styles="{ width: '160px' }"
                v-if="baseModuleInfo['AUDIO']"
              >
              </FormItemText>
              <div class="flexRow equipmentBtnList">
                <div
                  class="flexRow flexCenter add"
                  @click="
                    handleAction('add', {
                      sensorTypeCode: 'AUDIO',
                      serialNumber:
                        baseModuleInfo['AUDIO'] &&
                        baseModuleInfo['AUDIO'].serialNumber,
                    })
                  "
                >
                  <i class="iconfont icon-charu" />
                  {{ baseModuleInfo["AUDIO"] ? "替换" : "绑定" }}
                </div>
                <div
                  class="flexRow flexCenter del"
                  @click="
                    handleAction('del', baseModuleInfo['AUDIO'].serialNumber)
                  "
                >
                  <i class="iconfont icon-shanchu1" />
                  解绑
                </div>
              </div>
            </div>
          </div>
          <div
            class="item item6"
            :class="baseModuleInfo['LED'] ? '' : 'noHave'"
          >
            <div class="charge_car_title">智慧发布</div>
            <div class="charge_car_val">
              <FormItemText
                :layout="baseModuleInfo['LED'] && baseModuleInfo['LED'].item"
                labelWidth="0px"
                :styles="{ width: '160px' }"
                v-if="baseModuleInfo['LED']"
              >
              </FormItemText>
              <div class="flexRow equipmentBtnList">
                <div
                  class="flexRow flexCenter add"
                  @click="
                    handleAction('add', {
                      sensorTypeCode: 'LED',
                      serialNumber:
                        baseModuleInfo['LED'] &&
                        baseModuleInfo['LED'].serialNumber,
                    })
                  "
                >
                  <i class="iconfont icon-charu" />
                  {{ baseModuleInfo["LED"] ? "替换" : "绑定" }}
                </div>
                <div
                  class="flexRow flexCenter del"
                  @click="
                    handleAction('del', baseModuleInfo['LED'].serialNumber)
                  "
                >
                  <i class="iconfont icon-shanchu1" />
                  解绑
                </div>
              </div>
            </div>
          </div>
          <div
            class="item item7"
            :class="baseModuleInfo['CALL'] ? '' : 'noHave'"
          >
            <div class="charge_car_title">智慧报警</div>
            <div class="charge_car_val">
              <div class="flexCenter">
                <FormItemText
                  :layout="
                    baseModuleInfo['CALL'] && baseModuleInfo['CALL'].item
                  "
                  labelWidth="0px"
                  :styles="{ width: '160px' }"
                  v-if="baseModuleInfo['CALL']"
                >
                </FormItemText>
              </div>
              <div class="flexRow equipmentBtnList">
                <div
                  class="flexRow flexCenter add"
                  @click="
                    handleAction('add', {
                      sensorTypeCode: 'CALL',
                      serialNumber:
                        baseModuleInfo['CALL'] &&
                        baseModuleInfo['CALL'].serialNumber,
                    })
                  "
                >
                  <i class="iconfont icon-charu" />
                  {{ baseModuleInfo["CALL"] ? "替换" : "绑定" }}
                </div>
                <div
                  class="flexRow flexCenter del"
                  @click="
                    handleAction('del', baseModuleInfo['CALL'].serialNumber)
                  "
                >
                  <i class="iconfont icon-shanchu1" />
                  解绑
                </div>
              </div>
            </div>
          </div>
          <!-- 智慧网关 -->
          <div
            class="item item9"
            :class="baseModuleInfo['GATEWAY'] ? '' : 'noHave'"
          >
            <div class="charge_car_title">智慧网关</div>
            <div class="charge_car_val">
              <div class="flexCenter">
                <FormItemText
                  :layout="
                    baseModuleInfo['GATEWAY'] && baseModuleInfo['GATEWAY'].item
                  "
                  labelWidth="0px"
                  :styles="{ width: '160px' }"
                  v-if="baseModuleInfo['GATEWAY']"
                >
                </FormItemText>
              </div>
              <div class="flexRow equipmentBtnList">
                <div
                  class="flexRow flexCenter add"
                  @click="
                    handleAction('add', {
                      sensorTypeCode: 'GATEWAY',
                      serialNumber:
                        baseModuleInfo['GATEWAY'] &&
                        baseModuleInfo['GATEWAY'].serialNumber,
                    })
                  "
                >
                  <i class="iconfont icon-charu" />
                  {{ baseModuleInfo["GATEWAY"] ? "替换" : "绑定" }}
                </div>
                <div
                  class="flexRow flexCenter del"
                  @click="
                    handleAction('del', baseModuleInfo['GATEWAY'].serialNumber)
                  "
                >
                  <i class="iconfont icon-shanchu1" />
                  解绑
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </card>
    <dialog-cont
      @on-cancel="dialogCancel"
      @on-confirm="dialogSubmit"
      :visible.sync="dialog.show"
      width="80%"
      title="设备管理列表"
      append-to-body
    >
      <div>
        <header-title icon="iconfont icon-shouye" title="灯杆设备管理">
          <search-form
            slot="searchBox"
            ref="searchForm"
            :searchItems="dialog.searchItems"
            @onSearch="onDialogSearch"
            @onChange="onDialogChange"
          >
          </search-form>
        </header-title>
        <page-table
          col-align="center"
          highlightCurrentRow
          :data="dialog.tableData"
          :cols="dialog.tableCols"
          :page-current="dialog.page.current"
          :total="dialog.page.total"
          :page-size="dialog.page.pageSize"
          @current-change="onDialogCurrentChange"
          @size-change="onDialogPageSizeChange"
          @row-current-change="onDialogSelectionChange"
        >
        </page-table>
      </div>
    </dialog-cont>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import headerTitle from "components/adminHeaderTitle/headerTitle";
import PageTable from "@/components/adminPage-table";
import dialogCont from "@/components/adminDialog";
import searchForm from "components/adminSearchForm/searchForm";
import card from "view/lightPole/lightPoleStatistical/components/card";
import FormItemText from "@/components/formItemText/formItemText";
import watchImg from "../../../lightPole/lightPoleDetail/images/img2.png";
import { MODULE_TYPE } from "@/util/constants";
import {
  getTerminalDeviceModule,
  getUnBindDeviceModuleInfoForPage,
  bindDeviceModule,
  unBindDeviceModule,
} from "api/admin";
import {
  getGroupPolicy,
  getManufacturerSelectList,
  getDeviceTypeSelectList,
  getSensorTypeSelectList,
} from "api/index";
export default {
  name: "lampPoleManagementEdit",
  data() {
    return {
      watchImg,
      baseInfoItems: [
        {
          id: "terminalName",
          label: "灯杆名称",
          value: "",
          unit: "",
          span: 8,
        },
        {
          id: "lampNumber",
          label: "设备序号",
          value: "",
          unit: "",
          span: 8,
        },
        {
          id: "address",
          label: "所属道路",
          value: "",
          unit: "",
          span: 8,
        },
        {
          id: "imei",
          label: "IMEI号",
          value: "",
          unit: "",
          span: 8,
        },
        {
          id: "version",
          label: "硬件版本号",
          value: "",
          unit: "",
          span: 16,
        },
        {
          id: "manufacturer",
          label: "厂商名称",
          value: "",
          unit: "",
          span: 8,
        },
        {
          id: "deviceTypeNo",
          label: "设备型号",
          value: "",
          unit: "",
          span: 8,
        },
        {
          id: "deviceTypeName",
          label: "设备类型",
          value: "",
          unit: "",
          span: 8,
        },
        {
          id: "longitude",
          label: "经度",
          value: "",
          unit: "",
          span: 8,
        },
        {
          id: "latitude",
          label: "纬度",
          value: "",
          unit: "",
          span: 8,
        },
      ],
      poleItems: [
        {
          id: "terminalName",
          label: "承载设备数量",
          value: "",
          unit: "个",
          span: 8,
        },
      ],
      baseModuleItems: [
        {
          id: "serialNumber",
          label: "设备序列号",
          value: "",
          unit: "",
          style: "word-break: break-all",
          span: 24,
        },
        {
          id: "deviceModuleName",
          label: "设备名称",
          value: "",
          unit: "",
          span: 24,
        },
        {
          id: "deviceTypeName",
          label: "设备类型",
          value: "",
          unit: "",
          span: 24,
        },
        {
          id: "activateStatusText",
          label: "激活状态",
          value: "",
          unit: "",
          span: 24,
          // class: 'noBottom'
        },
      ],
      baseModuleInfo: {},
      serviceAddress: "",
      dialog: {
        show: false,
        dialogSearchVal: {},
        dialogSearchChangeVal: {},
        searchItems: [
          {
            type: "input",
            label: "设备名称",
            props: {
              fieldName: "deviceModuleName",
            },
          },
          {
            type: "select",
            label: "设施类型",
            labelWidth: "85px",
            props: {
              fieldName: "sensorTypeCode",
              disabled: true,
              options: [],
            },
          },
          {
            type: "select",
            label: "厂商",
            labelWidth: "45px",
            props: {
              fieldName: "manufacturerManageCode",
              options: [],
            },
          },
          {
            type: "select",
            label: "设备类型",
            props: {
              fieldName: "deviceCode",
              options: [],
            },
          },
          {
            type: "select",
            label: "激活状态",
            hide: true,
            props: {
              fieldName: "activateStatus",
              options: [
                {
                  id: 0,
                  name: "未激活",
                },
                {
                  id: 1,
                  name: "已激活",
                },
              ],
            },
          },
        ],
        tableData: [],
        tableCols: [
          { label: "IMEI", prop: "serialNumber" },
          { label: "设备名称", prop: "deviceModuleName" },
          { label: "设施类型", prop: "deviceTypeName", minWidth: "110px" },
          { label: "厂商名称", prop: "factoryName" },
          { label: "设备类型", prop: "deviceTypeName" },
          { label: "设备型号", prop: "version" },
          { label: "创建时间", prop: "createTime", minWidth: "110px" },
        ],
        page: {
          current: 1,
          pageSize: 10,
          total: 0,
        },
        parames: {},
        selectsList: [],
      },
      form: {
        switch: "",
        radio: "",
      },
      word: {
        id: null,
        keyWord: [],
        templateName: "",
      },
      editData: {},
    };
  },
  components: {
    card,
    FormItemText,
    headerTitle,
    searchForm,
    PageTable,
    dialogCont,
  },
  computed: {
    ...mapGetters(["common"]),
  },
  mounted() {
    this.$nextTick(() => {
      // if (this.routeName === 'lampPoleManagementEdit') {
      this.editData = this.common["lampPoleManagementEdit"];
      this._getDeviceTypeSelectList({
        manufacturerCode: null,
        sensorTypeCode: null,
      });
      getManufacturerSelectList().then((res) => {
        if (res.code === "200") {
          const deviceOptions = res.data.map((data) => {
            return {
              id: data.code,
              name: data.name,
            };
          });
          this.$set(this.dialog.searchItems[2], "props", {
            fieldName: "manufacturerManageCode",
            options: deviceOptions,
          });
        }
      });
      getSensorTypeSelectList().then((res) => {
        if (res.code === "200") {
          const deviceOptions = res.data.map((data) => {
            return {
              id: data.viewCode,
              name: data.name,
            };
          });
          this.$set(this.dialog.searchItems[1], "props", {
            fieldName: "sensorTypeCode",
            disabled: true,
            options: deviceOptions,
          });
        }
      });
      if (this.editData && this.editData.imei) {
        this.getDetail();
      }
      // }
    });
  },
  methods: {
    _getDeviceTypeSelectList(data) {
      const deviceParames = {
        manufacturerCode: data.manufacturerCode,
        sensorTypeCode: data.sensorTypeCode,
      };
      getDeviceTypeSelectList(deviceParames).then((res) => {
        if (res.code === "200") {
          const deviceOptions = res.data.map((data) => {
            return {
              id: data.code,
              name: data.name,
            };
          });
          this.$set(this.dialog.searchItems[3], "props", {
            fieldName: "deviceCode",
            options: deviceOptions,
          });
        }
      });
    },
    getDetail() {
      const modules = this.$_useTypes(MODULE_TYPE);
      getTerminalDeviceModule(this.editData.imei).then((res) => {
        if (res.code === "200") {
          let baseInfoItems = [];
          baseInfoItems = this.baseInfoItems.map((item) => {
            return {
              ...item,
              value: res.data[item.id],
            };
          });
          res.data.deviceModuleExtend.map((extendItem) => {
            baseInfoItems.push({
              id: extendItem.fieldNo,
              label: extendItem.fieldName,
              value: extendItem.fieldValue,
              span: 8,
            });
          });
          this.baseInfoItems = baseInfoItems;
          this.poleItems[0].value =
            res.data.terminalDeviceModuleDtos.length || 0;
          let baseModuleInfo = {};
          modules.options.map((option) => {
            const terminalItem = res.data.terminalDeviceModuleDtos.find(
              (deviceItem) => deviceItem.deviceTypeNo === option.id
            );
            if (!terminalItem) return;
            baseModuleInfo[option.id] = {
              serialNumber: null,
              item: null,
            };
            const baseModuleItem = this.baseModuleItems.map((baseItem) => {
              return {
                ...baseItem,
                value: terminalItem && terminalItem[baseItem.id],
              };
            });
            baseModuleInfo[option.id] = {
              serialNumber: terminalItem.serialNumber,
              item: baseModuleItem,
            };
          });
          this.baseModuleInfo = baseModuleInfo;
        }
      });
    },
    handleAction(type, item) {
      const parames = {
        imei: this.editData.imei,
        serialNumber: item,
      };
      if (type === "add") {
        this.dialog.parames = {
          sensorTypeCode: item.sensorTypeCode,
          orgiSerialNumber: item.serialNumber,
        };
        this.dialog.dialogSearchVal = {
          sensorTypeCode: item.sensorTypeCode,
        };
        this.dialog.searchItems[1].initValue = item.sensorTypeCode;
        this.dialog.show = true;
        this.onDialogSearch();
      } else if (type === "del") {
        unBindDeviceModule(parames).then((res) => {
          if (res.code === "200") {
            this.$notify({
              title: "成功",
              message: "解绑成功",
              type: "success",
              position: "bottom-right",
            });
            this.getDetail();
          }
        });
      }
    },
    onDialogSearch(val) {
      this.dialog.dialogSearchVal = {
        ...this.dialog.dialogSearchVal,
        ...val,
      };
      this.getDialogDataAllList();
    },
    async onDialogChange(val) {
      if (
        (!!val.manufacturerManageCode &&
          val.manufacturerManageCode !==
            this.dialog.dialogSearchChangeVal.manufacturerManageCode) ||
        (!!val.sensorTypeCode &&
          val.sensorTypeCode !==
            this.dialog.dialogSearchChangeVal.sensorTypeCode)
      ) {
        this.dialog.dialogSearchChangeVal = {
          ...val,
          manufacturerManageCode: val.manufacturerManageCode,
          sensorTypeCode: val.sensorTypeCode,
        };
        const deviceOptions = await this._getDeviceTypeSelectList({
          manufacturerCode: val.manufacturerManageCode || null,
          sensorTypeCode: val.sensorTypeCode || null,
        });
        this.$set(
          this.dialog.searchItems[2],
          "initValue",
          val.manufacturerManageCode
        );
        this.$set(this.dialog.searchItems[3], "props", {
          fieldName: "deviceCode",
          options: deviceOptions,
        });
      }
    },
    // 获取所有/查询数据列表
    getDialogDataAllList() {
      let data = {
        data: {
          ...this.dialog.dialogSearchVal,
        },
        pageNo: Number(this.dialog.page.current), // 查询的分页页码
        pageSize: Number(this.dialog.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: "",
      };
      getUnBindDeviceModuleInfoForPage(data).then((res) => {
        if (res.code === "200") {
          const { data, total } = res.data;
          this.dialog.page.total = total;
          this.dialog.tableData = data;
        }
      });
    },
    onDialogCurrentChange(val) {
      this.dialog.page.current = val;
      this.getDialogDataAllList();
    },
    onDialogPageSizeChange(val) {
      this.dialog.page.pageSize = val;
      this.onDialogCurrentChange(1);
    },
    onDialogSelectionChange(args) {
      this.dialog.selectsList = args;
    },
    dialogCancel() {
      this.dialog.show = false;
      this.dialog.dialogSearchChangeVal = {};
      this.dialog.dialogSearchVal = {};
      this.$refs.searchForm.onReset();
    },
    dialogSubmit() {
      const parames = {
        imei: this.editData.imei,
        serialNumber: this.dialog.selectsList.serialNumber,
        orgiSerialNumber: this.dialog.parames.orgiSerialNumber,
      };
      bindDeviceModule(parames).then((res) => {
        if (res.code === "200") {
          this.$notify({
            title: "成功",
            message: "绑定成功",
            type: "success",
            position: "bottom-right",
          });
          this.dialog.show = false;
          this.dialog.page = {
            current: 1,
            pageSize: 10,
            total: 0,
          };
          this.dialog.parames = {};
          this.dialogCancel();
          this.getDetail();
        }
      });
    },
  },
};
</script>
<style lang="less">
#lampPoleManagementEdit {
  .adminCard {
    &:not(:first-child) {
      margin-top: 10px; /*no*/
      padding-bottom: 10px; /*no*/
    }
  }
  .button {
    height: 30px; /*no*/
    padding: 5px 25px;
    background: rgba(21, 27, 46, 1);
    border-radius: 4px; /*no*/
    border: 1px solid rgba(52, 114, 255, 1);
    font-size: 12px; /*no*/
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(52, 114, 255, 1);
    // margin-left: 20px;/*no*/
    &.el-button--primary {
      background: linear-gradient(
        318deg,
        rgba(29, 91, 250, 1) 0%,
        rgba(29, 144, 250, 1) 100%
      );
      color: rgba(230, 236, 255, 1);
    }
  }
  .el-image {
    cursor: pointer;
    vertical-align: middle;
    img {
      width: 16px;
      height: 12px;
      vertical-align: middle;
    }
  }
  .el-radio-group {
    .el-radio {
      margin-right: 15px;
      .el-radio__label {
        padding-left: 4px; /*no*/
        font-size: 12px; /*no*/
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(73, 73, 73, 1);
      }
      &:not(:first-child) {
        margin-left: 0;
      }
    }
  }
  .el-switch {
    height: 17px; /*no*/
    line-height: 17px; /*no*/
    > span {
      height: 100%;
      &::after {
        left: 2px;
        height: 13px; /*no*/
        width: 13px; /*no*/
      }
    }
    &.is-checked {
      span {
        &::after {
          margin-left: 23px; /*no*/
        }
      }
    }
  }
  .timeInfo {
    padding: 220px 0 220px;
    .timeContainer {
      display: inline-block;
      position: relative;
      > img {
        &.lampPost {
          width: auto;
          height: 950px;
        }
        &.lampLight {
          position: absolute;
          top: 5%;
          left: -27%;
          width: 167px;
        }
      }
      .item {
        position: absolute;
        right: -510px;
        padding: 20px 30px 20px 140px;
        border-right: 2px solid #2673f1;
        background: rgba(246, 249, 255, 1);
        box-shadow: 0px 2px 4px 0px rgba(228, 228, 228, 1);
        display: flex;
        align-items: center;
        #formItemText {
          .el-form-item {
            .el-form-item__content {
              color: rgba(73, 73, 73, 1);
            }
          }
        }
        .equipmentBtnList {
          min-height: auto !important;
          // margin-top: 10px;/*no*/
          .add,
          .del {
            display: flex;
            padding: 6px 12px;
            color: #fff;
            cursor: pointer;
            border-radius: 4px;
            background: rgba(229, 232, 243, 1);
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(73, 73, 73, 1);
            // height: 17px;/*no*/
            line-height: 17px; /*no*/
            i {
              margin-right: 7px; /*no*/
              font-size: 14px; /*no*/
              color: #7598c3;
              text-shadow: none;
            }
          }
          .add {
            margin-right: 10px; /*no*/
            background: linear-gradient(
              135deg,
              rgba(131, 172, 255, 1) 0%,
              rgba(64, 127, 251, 1) 28%,
              rgba(43, 112, 249, 1) 100%
            );
            box-shadow: 0px 4px 4px 0px rgba(176, 201, 251, 0.43);
            color: rgba(255, 255, 255, 1);
            text-shadow: 0px 2px 2px rgba(34, 60, 160, 1);
            i {
              background-image: -webkit-linear-gradient(
                -45deg,
                #d6e2ff 20%,
                #b5d8ff 60%
              );
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
          }
        }
        &::after {
          position: absolute;
          content: "";
          width: 200px;
          left: -224px;
          top: 50%;
          margin-top: -11.5px;
          height: 23px;
          background: url(~common/images/index/jd.gif) no-repeat center;
          background-size: 100% 100%;
          transform: rotate(180deg);
          border-top-right-radius: 10px;
          border-bottom-right-radius: 10px;
        }
        .charge_car_title {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          left: 20px;
          font-size: 24px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(75, 75, 75, 1);
        }
        .charge_car_val {
          &::before {
            width: 14px;
            height: 14px;
            content: "";
            border-top: 2px solid #2673f1;
            border-left: 2px solid #2673f1;
            border-top-left-radius: 5px;
            position: absolute;
            left: 10px;
            top: 10px;
          }
          &::after {
            width: 14px;
            height: 14px;
            content: "";
            border-bottom: 2px solid #2673f1;
            border-left: 2px solid #2673f1;
            border-bottom-left-radius: 5px;
            position: absolute;
            left: 10px;
            bottom: 10px;
          }
        }
        &.left {
          right: auto;
          left: -510px;
          padding: 20px 140px 20px 30px;
          border-right: none;
          border-left: 2px solid #2673f1;
          &::after {
            position: absolute;
            content: "";
            width: 200px;
            left: auto;
            right: -224px;
            top: 50%;
            margin-top: -11.5px;
            height: 23px; /*no*/
            background: url(~common/images/index/jd.gif) no-repeat center;
            background-size: 100% 100%;
            transform: rotate(0deg);
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
          }
          .charge_car_title {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: auto;
            right: 20px;
            font-size: 24px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
          }
          .charge_car_val {
            &::before {
              content: "";
              border-top: 2px solid #2673f1;
              border-left: none;
              border-right: 2px solid #2673f1;
              border-top-right-radius: 5px;
              left: auto;
              right: 10px;
            }
            &::after {
              width: 14px;
              height: 14px;
              content: "";
              border-bottom: 2px solid #2673f1;
              border-left: none;
              border-right: 2px solid #2673f1;
              border-bottom-right-radius: 5px;
              left: auto;
              right: 10px;
            }
          }
          &.green {
            &::after {
              background: url(~common/images/index/jd.gif) no-repeat center;
              background-size: 100% 100%;
            }
          }
          &.warn {
            &::after {
              background: url(~common/images/index/warnjd.gif) no-repeat center;
              background-size: 100% 100%;
            }
          }
        }
        &.green {
          border-color: #2673f1;
          &::after {
            background: url(~common/images/index/jd.gif) no-repeat center;
            background-size: 100% 100%;
          }
          .charge_car_val {
            &::before {
              border-color: #2673f1;
            }
            &::after {
              border-color: #2673f1;
            }
          }
        }
        &.warn {
          border-color: #2673f1;
          &::after {
            background: url(~common/images/index/warnjd.gif) no-repeat center;
            background-size: 100% 100%;
          }
          .charge_car_val {
            &::before {
              border-color: #2673f1;
            }
            &::after {
              border-color: #2673f1;
            }
          }
        }
        &.noHave {
          // background: #ddd;
          .equipmentBtnList {
            .del {
              display: none;
            }
            .add {
              display: flex;
            }
          }
        }
        &.item1 {
          top: -200px;
          .charge_car_title {
            right: 30px;
          }
        }
        &.item11 {
          top: -200px;
          padding-left: 200px;
        }
        &.item2 {
          top: 80px;
          left: -550px;
        }
        &.item3 {
          top: 350px;
          left: -550px;
        }
        &.item4 {
          top: 630px;
        }
        &.item5 {
          top: 100px;
          right: -530px;
          .charge_car_val {
            > div {
              min-height: 120px;
            }
          }
          audio {
            margin-top: 10px; /*no*/
            width: 200px;
            height: 50px;
          }
        }
        &.item6 {
          top: 410px;
          right: -530px;
          .charge_car_val {
            > div {
              min-height: 210px;
            }
            .content {
              margin-top: 10px; /*no*/
              width: 300px;
              height: 150px;
              .el-carousel {
                width: 100%;
                height: 100%;
                .el-carousel__item {
                  .el-image {
                    width: 100%;
                    height: 100%;
                    img {
                      width: 100%;
                      height: 100%;
                    }
                  }
                }
                ul {
                  li {
                    padding: 12px 4px;
                    button {
                      width: 10px;
                    }
                  }
                }
              }
              video {
                width: 100%;
                height: 100%;
              }
              .textTemplate {
                height: 150px;
                position: relative;
                min-width: 250px;
                padding: 20px 35px 20px 18px;
                background: linear-gradient(
                  171deg,
                  rgba(21, 173, 182, 1) 0%,
                  rgba(49, 72, 219, 1) 100%
                );
                box-shadow: 0px 2px 9px 0px rgba(72, 128, 255, 0.5); /*no*/
                border-radius: 5px;
                margin-right: 10px; /*no*/
                display: flex;
                flex-direction: column;
                overflow-y: auto;
                .title {
                  font-size: 14px;
                  font-family: PingFangSC-Semibold, PingFang SC;
                  font-weight: 600;
                  color: rgba(255, 255, 255, 1);
                  // line-height:14px;
                  text-shadow: 0px 2px 4px rgba(17, 118, 111, 0.5);
                  margin-bottom: 7px;
                }
                ul {
                  li {
                    font-size: 12px; /*no*/
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: rgba(255, 255, 255, 1);
                    padding: 6px 0;
                    // line-height:17px;
                  }
                }
                &::-webkit-scrollbar-track-piece {
                  //滚动条凹槽的颜色，还可以设置边框属性
                  background-color: transparent;
                }
                &::-webkit-scrollbar {
                  //滚动条的宽度
                  width: 2px;
                  height: 2px;
                  border-radius: 10px;
                }
                &::-webkit-scrollbar-thumb {
                  //滚动条的设置
                  background-color: #b6b5b5;
                  background-clip: padding-box;
                  min-height: 28px;
                }
                &::-webkit-scrollbar-thumb:hover {
                  background-color: #b6b5b5;
                }
              }
            }
          }
        }
        &.item7 {
          top: 720px;
        }
        &.item8 {
          top: 920px;
        }
        &.item9 {
          top: 1000px;
        }
      }
    }
  }
}
</style>
