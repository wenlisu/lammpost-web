/* eslint-disable camelcase */
<template>
  <div id="lampPoleManagement">
    <div v-if="routeName == 'lampPoleManagementEdit'">
      <Detail />
    </div>
    <div v-if="routeName == 'lampPoleManagement'">
      <!-- 灯杆设备管理 -->
      <header-title icon="iconfont icon-shouye" title="灯杆设备管理">
        <search-form
          slot="searchBox"
          :searchItems="searchItems"
          @onSearch="onSearch"
          @onChange="onChange"
          :addBtnVisible="true || $_hasOperation($options.name, 'add')"
          @on-addBtn="handleAddAction()"
          :delBtnDisabled="selectsList.length === 0"
          :delBtnVisible="true || $_hasOperation($options.name, 'del')"
          @on-delBtn="handleAction('del')"
          :otherBtnVisible="false"
          :otherBtnLists="[
            {
              label: '接入设备',
              disabled: selectsList.length === 0,
              click: () => addDevice(),
            },
          ]"
        >
          <!-- <div class="my-autocomplete" slot="imei">
            <treeselect
              :value="searchVal.imei"
              @input="tressSelectInput"
              @select="tressSelectSelect"
              className="adminTressSelect"
              disableBranchNodes
              :multiple="false"
            />
        </div> -->
        </search-form>
      </header-title>

      <div class="content-view">
        <div class="Modeltable">
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
            <template slot-scope="scope" slot="operator">
              <flex>
                <el-button
                  type="text"
                  size="small"
                  title="修改"
                  :style="{ marginRight: '10px' }"
                  @click.prevent.stop="
                    handleAction('edit', {
                      ...scope.row,
                    })
                  "
                  v-if="true || $_hasOperation($options.name, 'edit')"
                >
                  <i
                    class="iconfont icon-bianji"
                    style="fontsize: 20px; color: #2573f1"
                  />
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  title="操作"
                  :style="{ marginRight: '10px' }"
                  @click.prevent.stop="
                    handleAction('detail', {
                      ...scope.row,
                    })
                  "
                  v-if="true || $_hasOperation($options.name, 'detail')"
                >
                  <i
                    class="iconfont icon-xiangqing"
                    style="fontsize: 20px; color: #2573f1"
                  />
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  title="删除"
                  :style="{ marginRight: '10px' }"
                  @click.prevent.stop="
                    handleAction('del', {
                      ...scope.row,
                    })
                  "
                  v-if="true || $_hasOperation($options.name, 'delete')"
                >
                  <i
                    class="iconfont icon-shanchu"
                    style="fontsize: 20px; color: #ff5736"
                  />
                </el-button>
              </flex>
            </template>
          </page-table>
        </div>
      </div>
      <dialog-cont
        @on-cancel="dialog.show = false"
        @on-confirm="dialogSubmit"
        :visible.sync="dialog.show"
        title="新增设施"
        width="80%"
        append-to-body
      >
        <div>
          <header-title icon="iconfont icon-shouye" title="灯杆设备管理">
            <search-form
              slot="searchBox"
              :searchItems="dialog.searchItems"
              :searchChangeValue="dialog.dialogSearchChangeVal"
              @onSearch="onDialogSearch"
              @onChange="onDialogChange"
            >
            </search-form>
          </header-title>
          <page-table
            col-align="center"
            operator-width="110"
            operator
            selection
            :data="dialog.tableData"
            :cols="dialog.tableCols"
            :page-current="dialog.page.current"
            :total="dialog.page.total"
            :page-size="dialog.page.pageSize"
            @current-change="onDialogCurrentChange"
            @size-change="onDialogPageSizeChange"
            @selection-change="onDialogSelectionChange"
          >
          </page-table>
        </div>
      </dialog-cont>
      <dialog-cont
        @on-cancel="dialogAddCancel"
        @on-confirm="dialogAddSubmit"
        :visible.sync="addDialog.show"
        width="550px"
        :title="addDialog.title"
        append-to-body
      >
        <FormItem
          ref="formItem"
          :formItems="formItems"
          :rules="formRules"
          :disabled="inputDisabled"
          :isEdit="isEdit"
          :form="form"
          :midway="midway"
        />
      </dialog-cont>
    </div>
  </div>
</template>

<script>
import headerTitle from "components/adminHeaderTitle/headerTitle";
import searchForm from "components/adminSearchForm/searchForm";
import PageTable from "@/components/adminPage-table";
import Flex from "@/components/flex";
import treeselect from "components/treeselect";
import dialogCont from "@/components/adminDialog";
import FormItem from "@/components/adminFormItem";
import radioType from "@/components/radioType";
import Detail from "./detail";
import { routePush } from "@/util/util";
import {
  getTerminal,
  getUnBindDeviceModuleInfoForPage,
  batchBindDeviceModule,
  getTerminalTree,
  addTerminalTree,
  deleteTerminalTree,
  editTerminalTree,
} from "api/admin";
import {
  getGroupPolicy,
  getManufacturerSelectList,
  getDeviceTypeSelectList,
  getSensorTypeSelectList,
} from "api/index";
export default {
  name: "lampPoleManagement",
  data() {
    const validateCity = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("城市不能为空"));
      }
      if (value !== this.form.city) {
        this.form.city = value;
        this.form.area = null;
        this.form.address = null;
      }
      getTerminalTree({ city: value }).then(async (res) => {
        if (res.code === "200") {
          this.formItems[3].options = await this.setOptions(res.data, "area", "areaCode");
          return callback();
        }
      });
    };
    const validateArea = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("区域不能为空"));
      }
      this.form.area = value;
      const areaParams = {
        city: this.form.city,
        area: value,
      };
      getTerminalTree(areaParams).then(async (res) => {
        if (res.code === "200") {
          this.formItems[4].options = await this.setOptions(
            res.data,
            "address",
            "streetCode"
          );
          return callback();
        }
      });
    };
    const validateAddress = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("地址不能为空"));
      }
      this.form.address = value;
      return callback();
    };
    const validateManufacturerManage = async (rule, value, callback) => {
      if (!value) {
        return callback(new Error("厂商不能为空"));
      }
      if (value !== this.form.manufacturerCode) {
        this.form.manufacturerCode = value;
        this.form.deviceTypeCode = "";
      }
      const deviceOptions = await this._getDeviceTypeSelectList({
        manufacturerCode: value,
        sensorTypeCode: "",
      });
      this.$set(this.formItems[10], "options", deviceOptions);
      return callback();
    };
    return {
      searchChangeVal: {},
      searchVal: {
        imei: "",
        terminalName: "",
        area: "",
        manufacturerManageCode: "",
        deviceCode: "",
      },
      searchItems: [
        {
          type: "input",
          label: "设备编号",
          props: {
            fieldName: "imei",
          },
        },
        {
          type: "input",
          label: "灯杆名称",
          props: {
            fieldName: "terminalName",
          },
        },
        {
          type: "select",
          label: "区域",
          labelWidth: "45px",
          props: {
            fieldName: "area",
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
      ],
      // 分页
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      tableData: [],
      tableCols: [
        { label: "设备编号", prop: "imei" },
        { label: "灯杆名称", prop: "terminalName" },
        { label: "灯号", prop: "lampNumber" },
        { label: "位置", prop: "address" },
        { label: "区域", prop: "area" },
        {
          label: "设备状态",
          prop: "status",
          render: (h, scope) => {
            return this.getRadiosType(scope.row.status);
          },
        },
        { label: "厂商名称", prop: "manufacturer" },
        { label: "设备类型", prop: "deviceTypeName" },
        { label: "设备型号", prop: "deviceTypeName" },
        { label: "经度", prop: "longitude" },
        { label: "纬度", prop: "latitude" },
        { label: "安装时间", prop: "createTime" },
        { label: "承载设备数量", minWidth: "110px", prop: "deviceCount" },
      ],
      selectsList: [],
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
            label: "区域",
            labelWidth: "45px",
            props: {
              fieldName: "area",
              options: [],
            },
          },
          {
            type: "select",
            label: "协议类型",
            props: {
              fieldName: "status",
              options: [],
            },
          },
        ],
        tableData: [],
        tableCols: [
          { label: "设备ID", prop: "id" },
          { label: "设备名称", prop: "fieldName" },
          { label: "设施类型", prop: "imei", minWidth: "110px" },
          { label: "厂商名称", prop: "imei" },
          { label: "设备类型", prop: "imei" },
          { label: "设备型号", prop: "imei" },
          { label: "硬件版本号", prop: "imei", minWidth: "110px" },
        ],
        page: {
          current: 1,
          pageSize: 10,
          total: 0,
        },
        selectsList: [],
      },
      addDialog: {
        show: false,
        title: "新增灯杆设备",
      },
      inputDisabled: false,
      isEdit: true,
      form: {
        city: null,
        area: null,
        address: null,
        manufacturerCode: null,
        deviceTypeCode: null,
      },
      formItems: [
        {
          label: "设备编号",
          prop: "imei",
          inputType: "input",
          required: true,
          span: 24,
          disabled: false,
        },
        {
          label: "设备名称",
          prop: "terminalName",
          inputType: "input",
          required: true,
          span: 24,
        },
        {
          label: "城市",
          prop: "city",
          inputType: "select",
          required: true,
          options: [],
          span: 24,
          Obj: true
        },
        {
          label: "区域",
          prop: "area",
          inputType: "select",
          required: true,
          options: [],
          span: 24,
          Obj: true
        },
        {
          label: "地址",
          prop: "address",
          inputType: "select",
          required: true,
          options: [],
          span: 24,
          Obj: true
        },
        {
          label: "电流",
          prop: "current",
          inputType: "input",
          span: 24,
        },
        {
          label: "电压",
          prop: "voltage",
          inputType: "input",
          span: 24,
        },
        {
          label: "经度",
          prop: "longitude",
          inputType: "input",
          required: true,
          span: 24,
        },
        {
          label: "纬度",
          prop: "latitude",
          inputType: "input",
          required: true,
          span: 24,
        },
        {
          label: "厂商",
          prop: "manufacturerCode",
          inputType: "select",
          required: true,
          options: [],
          span: 24,
        },
        {
          label: "设备类型",
          prop: "deviceTypeCode",
          inputType: "select",
          required: true,
          options: [],
          span: 24,
        },
        {
          label: "设备版本",
          prop: "version",
          inputType: "input",
          span: 24,
        },
        {
          label: "备注",
          prop: "remark",
          inputType: "input",
          span: 24,
        },
      ],
      formRules: {
        city: [{ required: true, validator: validateCity, trigger: "change" }],
        area: [{ required: true, validator: validateArea, trigger: "change" }],
        address: [
          { required: true, validator: validateAddress, trigger: "change" },
        ],
        manufacturerCode: [
          {
            required: true,
            validator: validateManufacturerManage,
            trigger: "change",
          },
        ],
      },
      midway: true,
    };
  },
  mounted() {
    this.$nextTick(async () => {
      if (this.routeName === "lampPoleManagement") {
        getGroupPolicy().then((res) => {
          if (res.code === "200") {
            const areaOptions = res.data.map((data) => {
              return {
                id: data.id,
                name: data.area,
              };
            });
            this.$set(this.searchItems[2], "props", {
              fieldName: "area",
              options: areaOptions,
            });
            this.$set(this.dialog.searchItems[3], "props", {
              fieldName: "area",
              options: areaOptions,
            });
          }
        });
        const deviceOptions = await this._getDeviceTypeSelectList({
          manufacturerCode: "",
          sensorTypeCode: "",
        });
        this.$set(this.searchItems[4], "props", {
          fieldName: "deviceCode",
          options: deviceOptions,
        });
        this.$set(this.dialog.searchItems[3], "props", {
          fieldName: "deviceCode",
          options: deviceOptions,
        });
        getManufacturerSelectList().then((res) => {
          if (res.code === "200") {
            const deviceOptions = res.data.map((data) => {
              return {
                id: data.code,
                name: data.name,
              };
            });
            this.$set(this.dialog.searchItems[4], "props", {
              fieldName: "manufacturerManageCode",
              options: deviceOptions,
            });
            this.$set(this.searchItems[3], "props", {
              fieldName: "manufacturerManageCode",
              options: deviceOptions,
            });
            this.$set(this.formItems[9], "options", deviceOptions);
          }
        });
        getSensorTypeSelectList().then((res) => {
          if (res.code === "200") {
            const deviceOptions = res.data.map((data) => {
              return {
                id: data.code,
                name: data.name,
              };
            });
            this.$set(this.dialog.searchItems[1], "props", {
              fieldName: "sensorTypeCode",
              options: deviceOptions,
            });
          }
        });
        const parames = {
          address: "",
          area: "",
          city: "",
          imei: "",
        };
        getTerminalTree(parames).then(async (res) => {
          if (res.code === "200") {
            this.formItems[2].options = await this.setOptions(res.data, "city", "cityCode");
          }
        });
        this.getDataAllList();
      }
    });
  },
  computed: {
    routeName() {
      return this.$route.name;
    },
  },
  components: {
    headerTitle,
    searchForm,
    PageTable,
    Flex,
    treeselect,
    dialogCont,
    Detail,
    radioType,
    FormItem,
  },
  methods: {
    setOptions(list, id = "city", code = "cityCode") {
      return list.map((item) => {
        return {
          id: item[code],
          name: item[id],
        };
      });
    },
    _getDeviceTypeSelectList(data) {
      const deviceParames = {
        manufacturerCode: data.manufacturerCode,
        sensorTypeCode: data.sensorTypeCode,
      };
      return getDeviceTypeSelectList(deviceParames).then((res) => {
        if (res.code === "200") {
          const deviceOptions = res.data.map((data) => {
            return {
              id: data.code,
              name: data.name,
            };
          });
          // this.$set(this.searchItems[4], 'props', {
          //   fieldName: 'deviceCode',
          //   options: deviceOptions
          // });
          // this.$set(this.dialog.searchItems[3], 'props', {
          //   fieldName: 'deviceCode',
          //   options: deviceOptions
          // });
          return deviceOptions;
        }
      });
    },
    getRadiosType(type) {
      let div = <radioType type="3" className="adminRadioType" />;
      switch (type) {
        case 1:
          div = <radioType type="1" className="adminRadioType" />;
          break;
        case 2:
          div = <radioType type="2" className="adminRadioType" />;
          break;
        default:
      }
      return div;
    },
    // 日期选项
    onSearch(val) {
      this.searchVal = {
        ...val,
      };
      this.getDataAllList();
    },
    async onChange(val) {
      if (
        val.manufacturerManageCode &&
        val.manufacturerManageCode !==
          this.searchChangeVal.manufacturerManageCode
      ) {
        this.searchChangeVal = {
          ...val,
          manufacturerManageCode: val.manufacturerManageCode,
          deviceCode: null,
        };
        const deviceOptions = await this._getDeviceTypeSelectList({
          manufacturerCode: val.manufacturerManageCode || "",
          sensorTypeCode: val.sensorTypeCode || "",
        });
        this.$set(this.searchItems[3], "initValue", val.manufacturerManageCode);
        this.$set(this.searchItems[4], "props", {
          fieldName: "deviceCode",
          options: deviceOptions,
        });
        // this.$set(this.dialog.searchItems[3], 'props', {
        //   fieldName: 'deviceCode',
        //   options: deviceOptions
        // });
      }
    },
    onDialogSearch(val) {
      this.dialogSearchVal = {
        ...val,
      };
      this.getDialogDataAllList();
    },
    async onDialogChange(val) {
      if (
        val.manufacturerManageCode !==
        this.dialogSearchVal.manufacturerManageCode
      ) {
        const deviceOptions = await this._getDeviceTypeSelectList({
          manufacturerCode: val.manufacturerManageCode || "",
          sensorTypeCode: val.sensorTypeCode || "",
        });
        this.$set(this.searchItems[4], "props", {
          fieldName: "deviceCode",
          options: deviceOptions,
        });
        this.$set(this.dialog.searchItems[3], "props", {
          fieldName: "deviceCode",
          options: deviceOptions,
        });
        this.dialog.dialogSearchChangeVal = {
          ...val,
          deviceCode: null,
        };
      }
    },
    // 获取所有/查询数据列表
    getDataAllList() {
      let data = {
        data: {
          ...this.searchVal,
        },
        pageNo: Number(this.page.current), // 查询的分页页码
        pageSize: Number(this.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: "",
      };
      getTerminal(data).then((res) => {
        if (res.code === "200") {
          const { data, total } = res.data;
          this.page.total = total;
          this.tableData = data;
        }
      });
    },
    // 分页切换页面
    onCurrentChange(val) {
      this.page.current = val;
      this.getDataAllList();
    },
    onPageSizeChange(val) {
      this.page.pageSize = val;
      this.onCurrentChange(1);
    },
    onSelectionChange(args) {
      this.selectsList = args.map((arg) => `${arg.id}`);
    },
    tressSelectInput(val) {
      this.form.imei = val;
    },
    tressSelectSelect(val) {
      this.form.area = val.area;
      this.form.address = val.address;
    },
    addDevice() {
      this.dialog.show = true;
      this.getDialogDataAllList();
    },
    // 获取所有/查询数据列表
    getDialogDataAllList() {
      let data = {
        data: {
          ...this.searchVal,
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
      this.dialog.selectsList = args.map((arg) => {
        return {
          ...arg,
        };
      });
    },
    async handleAction(type, item) {
      switch (type) {
        case "detail": // 详情
          const parames = {
            ...item,
          };
          routePush({
            title: "接入设施设备详情",
            name: "lampPoleManagementEdit",
            parames,
          });
          break;
        case "edit": // 新增
          const deviceOptions = await this._getDeviceTypeSelectList({
            manufacturerCode: item.manufacturerCode,
            sensorTypeCode: "",
          });
          this.$set(this.formItems[10], "options", deviceOptions);
          this.form = {
            ...item,
          };
          this.addDialog.show = true;
          this.formItems[0].disabled = true;
          this.addDialog.title = "修改灯杆设备";
          break;
        case "del": // 删除
          this.handleDel(item);
          break;
      }
    },
    handleDel(item) {
      this.$confirm("此操作将永久删除该灯杆, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let parames =
          this.selectsList && this.selectsList.length > 0
            ? this.selectsList.join(",")
            : "";
        if (item) {
          parames = item.id;
        }
        deleteTerminalTree(parames)
          .then((res) => {
            if (res.code === "200") {
              this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success",
                position: "bottom-right",
              });
              this.onSearch();
            }
          })
          .catch(() => {});
      });
    },
    dialogSubmit() {
      const parames = {
        imei: this.selectsList,
      };
      batchBindDeviceModule().then((res) => {
        if (res.code === "200") {
        }
      });
    },
    handleAddAction() {
      this.addDialog.show = true;
      this.addDialog.title = "新增灯杆设备";
      this.formItems[0].disabled = false;
      this.midway = true;
    },
    dialogAddCancel() {
      this.addDialog.show = false;
      this.$refs.formItem.resetForm();
      this.inputDisabled = false;
      this.isEdit = true;
      this.midway = false;
      this.form = {
        city: null,
        area: null,
        address: null,
      };
    },
    async dialogAddSubmit() {
      let apiMethod = addTerminalTree;
      let message = "新增成功";
      const formData = await this.$refs.formItem.getValue();
      const param = {
        ...formData,
        city: formData.city && typeof(formData.city) == 'object' ? formData.city.name : formData.city,
        cityCode: formData.city && typeof(formData.city) == 'object' ? formData.city.id : formData.cityCode,
        area: formData.area && typeof(formData.area) == 'object' ? formData.area.name : formData.area,
        areaCode: formData.area && typeof(formData.area) == 'object' ? formData.area.id : formData.areaCode,
        address: formData.address && typeof(formData.address) == 'object' ? formData.address.name : formData.address,
        streetCode: formData.address && typeof(formData.address) == 'object' ? formData.address.id : formData.streetCode,
        current: +formData.current,
        voltage: +formData.voltage,
      };
      if (this.form.id) {
        param.id = this.form.id;
        apiMethod = editTerminalTree;
      }
      console.log(formData)
      apiMethod(param).then((res) => {
        if (res.code === "200") {
          this.$notify({
            title: "成功",
            message,
            type: "success",
            position: "bottom-right",
          });
          this.dialogAddCancel();
          this.onSearch();
        }
      });
    },
  },
};
</script>

<style lang="less">
#lampPoleManagement {
}
</style>
