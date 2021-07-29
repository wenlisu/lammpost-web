<template>
  <div id="wifiDevInfo">
    <div class="device-statistics">
      <el-row>
        <div class="flexRow">
          <div class="item borderLine">
            <p>设备总数(个)</p>
            <div>
              <span>{{ deviveCount.total }}</span>
            </div>
          </div>
          <div class="item borderLine">
            <p class="normalMark">在线设备(个)</p>
            <div>
              <span>{{ deviveCount.online }}</span>
            </div>
          </div>

          <div class="item borderLine">
            <p class="alarmMark">离线设备(个)</p>
            <div>
              <span>{{ deviveCount.offLine }}</span>
            </div>
            <div class="line"></div>
          </div>
        </div>
      </el-row>
    </div>
    <div class="searchBox">
      <search-form
        :searchItems="searchItems"
        :otherBtnVisible="true"
        @onSearch="onSearch"
        @on-addBtn301="onAdd"
        :addBtnVisible301="true"
        :otherBtnLists="[
          {
            label: '删除设备',
            click: () => {
              this.delDevice();
            },
          },
          {
            label: 'LED设置',
            click: () => {
              this.ledSeting();
            },
          },
          {
            label: '导出设备信息',
            click: () => {
              this.export();
            },
          },
        ]"
      />
    </div>

    <div class="content-view">
      <div class="Modeltable">
        <page-table
          operator
          col-align="center"
          operator-width="150"
          :data="tableData"
          :cols="tableCols"
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
          @current-change="onCurrentChange"
          @size-change="onPageSizeChange"
          @selection-change="onSelectionChange"
        >
          <template slot="status" slot-scope="scope">
            <div id="device-status">
              <div
                :class="[
                  'circle',
                  scope.row && scope.row.status == '3'
                    ? 'disconnected'
                    : 'connected',
                ]"
              ></div>
              <span style="padding-left: 4px"
                >{{ scope.row && scope.row.status == "3" ? "离线" : "在线" }}
              </span>
            </div>
          </template>
          <template slot="led" slot-scope="scope">
            <el-switch
              style="display: block; height: 23px"
              v-model="scope.row && scope.row.led == '1'"
              active-color="#2870FF"
              inactive-color="#e0e0e0"
              active-text="开"
              inactive-text=""
              @change="
                (val) =>
                  handleChangeOnline({
                    onlineStatus: val,
                    serialNumber: scope.row.deviceIndex,
                  })
              "
            >
            </el-switch>
          </template>
          <template slot-scope="scope" slot="operator">
            <flex>
              <el-button
                type="text"
                size="small"
                title="编辑"
                :style="{ marginRight: '10px' }"
                @click.prevent.stop="
                  handleEdit({
                    ...scope.row,
                  })
                "
                
                v-if="true || $_hasOperation($options.name, 'detail')"
              >
                编辑
              </el-button>
              <el-button
                type="text"
                size="small"
                title="重启"
                @click.prevent.stop="
                  showView('del', {
                    ...scope.row,
                  })
                "
                :disabled="true || scope.row && scope.row.devStatus == 1"
                v-if="true || $_hasOperation($options.name, 'edit')"
              >
                重启
              </el-button>
              <el-button
                type="text"
                size="small"
                title="升级"
                @click.prevent.stop="
                  showView('del', {
                    ...scope.row,
                  })
                "
                :disabled="true || scope.row && scope.row.devStatus == 1"
                v-if="true || $_hasOperation($options.name, 'edit')"
              >
                升级
              </el-button>
            </flex>
          </template>
        </page-table>
      </div>
      <el-drawer
        title="设备管理"
        :visible.sync="drawer"
        :direction="direction"
        :before-close="handleClose"
        ref="draw"
      >
        <div class="ap-device-title">
          <div class="ap-device-icon">
            <img src="../images/device.png" alt="" />
          </div>
          <div class="ap-device-header">
            <p title="AP-1">{{form['deviceName']}}</p>
            <div>
              <div id="device-status">
                <div :class="['circle', form['status'] == 3 ? 'disconnected' : 'connected']"></div>
                <span style="padding-left: 4px">{{form['status'] == 3 ? '离线' : '在线'}}</span>
              </div>
              <div class="btn">
                <el-button type="primary" size="small" disabled
                  >设备管理</el-button
                >
              </div>
            </div>
          </div>
        </div>
        <div>
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="设备信息" name="first">
              <FormItem
                ref="formItem"
                :formItems="formItems"
                :disabled="inputDisabled"
                :isEdit="isEdit"
                :form="form"
                :midway="midway"
                :labelWidth="'105px'"
              />
              <div class="formatter"><p>建议格式：“楼栋－楼层－房间号”</p></div>
            </el-tab-pane>
            <el-tab-pane label="无线状态" name="second">
              <div class="child-tabs">
                <el-tabs
                  v-model="sec_activeName"
                  type="card"
                  @tab-click="sec_handleClick"
                >
                  <el-tab-pane label="2.4G" name="2.4">
                    <div>
                      <div class="ap-wireless-ssid">
                        <label>SSID</label>
                        <div class="ap-wireless-ssid-item">
                          <div class="ssid-content">
                            <img
                              src="../images/wifi-icon.png"
                              alt=""
                              srcset=""
                              class="ssid-pic"
                            />
                            <span class="ssid-name">jdxq</span>
                            <span class="ssid-operation">删除</span>
                          </div>
                          <p class="bundle-text">+绑定SSID</p>
                        </div>
                      </div>

                      <div class="ssid-form">
                        <FormItem
                          ref="ssidForm"
                          :formItems="ssidForm"
                          :disabled="inputDisabled"
                          :isEdit="isEdit"
                          :form="sform"
                          :midway="midway"
                          :labelWidth="'105px'"
                        />
                        <div class="formatter">
                          <p>若超过设备最大支持值，该参数不生效</p>
                        </div>
                      </div>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="5G" name="5">
                    <div>
                      <div class="ap-wireless-ssid">
                        <label>SSID</label>
                        <div class="ap-wireless-ssid-item">
                          <div class="ssid-content">
                            <img
                              src="../images/wifi-icon.png"
                              alt=""
                              srcset=""
                              class="ssid-pic"
                            />
                            <span class="ssid-name">jdxq</span>
                            <span class="ssid-operation">删除</span>
                          </div>
                          <p class="bundle-text">+绑定SSID</p>
                        </div>
                      </div>

                      <div class="ssid-form">
                        <FormItem
                          ref="ssidForm"
                          :formItems="ssidForm"
                          :disabled="inputDisabled"
                          :isEdit="isEdit"
                          :form="sform"
                          :midway="midway"
                          :labelWidth="'105px'"
                        />
                        <div class="formatter">
                          <p>若超过设备最大支持值，该参数不生效</p>
                        </div>
                      </div>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="w-device-info-footer">
          <button class="cancel" @click="cancelDraw">取消</button>
          <button class="save-parimay" @click="saveInfo">保存</button>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import searchForm from "components/adminSearchForm/searchForm";
import PageTable from "@/components/adminPage-table";
import FormItem from "@/components/adminFormItem";
import { queryBKWifiInfo, queryWifiList, exportWifiInfo } from "api/wifi";
import { download } from '@/util/util';
export default {
  name: "devInfo",
  components: {
    searchForm,
    PageTable,
    FormItem,
  },
  data() {
    return {
      deviveCount: {
        online: 0,
        offLine: 0,
        total: 0,
      },
      sec_activeName: "2.4",
      activeName: "first",
      done: null,
      direction: "rtl",
      drawer: false,
      searchVal: {},
      midway: true,
      isEdit: true,
      inputDisabled: false,
      form: {
        deviceName: "",
        deviceIndex: "",
        deviceIp: "",
        deviceMac: "",
        firmwareVer: "",
        location: "",
      },
      sform: {},
      ssidForm: [
        {
          label: "状态",
          prop: "status",
          inputType: "switch",
          required: false,
          span: 24,
          disabled: false,
        },
        {
          label: "工作模式",
          prop: "mode",
          inputType: "select",
          required: true,
          span: 24,
          disabled: false,
          options: [
            {
              name: "802.11a",
              id: "1",
            },
            {
              name: "802.11n",
              id: "2",
            },
            {
              name: "802.11a/n",
              id: "3",
            },
            {
              name: "802.11a/n/ac",
              id: "4",
            },
          ],
        },
        {
          label: "信道",
          prop: "channel",
          inputType: "select",
          required: true,
          span: 24,
          disabled: false,
          options: [
            {
              name: "自动",
              id: "1",
            },
            {
              name: "36",
              id: "2",
            },
            {
              name: "40",
              id: "3",
            },
            {
              name: "44",
              id: "4",
            },
            {
              name: "48",
              id: "5",
            },
          ],
        },
        {
          label: "频段带宽",
          prop: "bandwidth",
          inputType: "select",
          required: true,
          span: 24,
          disabled: false,
          options: [
            {
              name: "自动",
              id: "1",
            },
            {
              name: "20MHz",
              id: "2",
            },
            {
              name: "40MHz",
              id: "3",
            },
            {
              name: "80MHz",
              id: "4",
            },
          ],
        },
        {
          label: "发射功率",
          prop: "power",
          inputType: "select",
          required: true,
          span: 24,
          disabled: false,
          options: [
            {
              name: "10%",
              id: "1",
            },
            {
              name: "20%",
              id: "2",
            },
            {
              name: "30%",
              id: "3",
            },
            {
              name: "40%",
              id: "4",
            },
            {
              name: "50%",
              id: "5",
            },
            {
              name: "60%",
              id: "6",
            },
            {
              name: "70%",
              id: "7",
            },
            {
              name: "80%",
              id: "8",
            },
            {
              name: "90%",
              id: "9",
            },
            {
              name: "100%",
              id: "10",
            },
          ],
        },
        {
          label: "客户端限制",
          prop: "limit",
          inputType: "input",
          required: true,
          span: 24,
          disabled: false,
        },
      ],
      formItems: [
        {
          label: "设备名称",
          prop: "deviceName",
          inputType: "input",
          required: false,
          span: 24,
          disabled: true,
        },
        {
          label: "设备型号",
          inputType: "text",
          id: 'deviceIndex',
          value: "",
          required: false,
          span: 24,
          disabled: true,
        },
        {
          label: "IP地址",
          inputType: "text",
          id: "deviceIp",
          value: "",
          required: false,
          span: 24,
          disabled: true,
        },
        {
          label: "MAC地址",
          inputType: "text",
          id: "deviceMac",
          value: "",
          required: false,
          span: 24,
          disabled: true,
        },
        {
          label: "软件版本",
          inputType: "text",
          id: 'firmwareVer',
          value: "",
          required: false,
          span: 24,
          disabled: true,
        },
        {
          label: "硬件版本",
          inputType: "text",
          id: 'belongDevice',
          value: "--",
          required: false,
          span: 24,
          disabled: true,
        },
        {
          label: "安装位置",
          prop: "location",
          inputType: "input",
          required: false,
          span: 24,
          disabled: true,
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
        {
          label: "设备名称",
          prop: "deviceName",
        },
        {
          label: "设备分组",
          prop: "deviceGroup",
        },
        {
          label: "设备类型",
          prop: "deviceType",
        },
        {
          label: "软件版本",
          prop: "firmwareVer",
        },
        // {
        //   label: "硬件版本",
        //   prop: "firmwareVer",
        // },
        {
          label: "安装位置",
          prop: "location",
        },
        {
          label: "设备状态",
          prop: "status",
          custom: true,
        },
        {
          label: "设备型号",
          prop: "deviceIndex",
        },
        {
          label: "IP地址",
          prop: "deviceIp",
        },
        {
          label: "MAC地址",
          prop: "deviceMac",
        },
        {
          label: "LED状态",
          prop: "led",
          custom: true,
        },
        {
          label: "关联设备",
          prop: "belongDevice",
        },
      ],
      searchItems: [
        {
          type: "input",
          label: "设备名称、型号、IP、MAC",
          props: {
            fieldName: "deviceModuleName",
            width: "300px",
          },
        },
        {
          type: "select",
          label: "设备状态",
          props: {
            fieldName: "deviceStatus",
            options: [
              {
                name: "在线",
                id: 1,
              },
              {
                name: "离线",
                id: 3,
              },
            ],
          },
        },
      ],
    };
  },
  created() {
    this._queryWifiInfo();
    this.getDataAllList();
  },
  methods: {
    // 查询WiFi在线、离线数量
    _queryWifiInfo() {
      const params = {
        deviceModuleName: "",
        deviceStatus: "",
        endTime: "",
        siteId: "",
        startTime: "",
      };
      queryBKWifiInfo(params).then((res) => {
        if (res.code == "200") {
          for (let key in this.deviveCount) {
            this.deviveCount[key] = res.data[key];
          }
        }
      });
    },
    // 切换tabs
    sec_handleClick() {},
    handleClick() {},
    // 关闭抽屉
    handleClose(done) {
      done();
    },
    cancelDraw() {
      this.$refs.draw.closeDrawer();
    },
    saveInfo() {
      this.$refs.draw.closeDrawer();
    },
    // 编辑
    handleEdit(row) {
      this.drawer = true;
      this.form = { ...row };
      this.formItems.map((item, index) => {
        if (item.inputType == "text") {
          console.log(item);
          this.$set(this.formItems[index], "value", row[item.id] || '--');
        }
      });
    },
    // 导出
    export() {
      exportWifiInfo().then(res => {
        let blob = new Blob([res.data]);
        let url = window.URL.createObjectURL(blob);
        download(url, "wifi设备信息.xls");
      })
    },
    // LED设置
    ledSeting() {},
    // 删除设备
    delDevice() {},
    // 新增
    onAdd() {
      console.log("a,a,a,a");
    },
    // 查询
    onSearch(val) {
      this.searchVal = {
        ...val,
      };
      this.onCurrentChange(1);
    },
    // 获取所有/查询数据列表
    getDataAllList() {
      let data = {
        data: {
          deviceModuleName: this.searchVal.deviceModuleName || "",
          deviceStatus: this.searchVal.deviceStatus
            ? this.searchVal.deviceStatus
            : "",
        },
        pageNo: Number(this.page.current), // 查询的分页页码
        pageSize: Number(this.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: "",
      };
      queryWifiList(data).then((res) => {
        if (res.code === "200") {
          const { data, total } = res.data;
          this.page.total = total;
          this.tableData = data.map((item) => {
            item["belongDevice"] = "-";
            item["location"] ? null : item["location"] = '-'
            return item;
          });
        }
      });
    },
    // 控制LED
    handleChangeOnline(val, id) {},
    // 分页切换页面
    onCurrentChange(val) {
      this.page.current = val;
      this.getDataAllList();
    },
    onPageSizeChange(val) {
      this.page.pageSize = val;
      this.onCurrentChange(1);
    },
    onSelectionChange() {},
  },
};
</script>

<style scoped lang="less">
#wifiDevInfo {
  // 设备总览样式
  .device-statistics {
    background: #fff;
    padding: 20px;
    margin-bottom: 15px;
    .flexRow {
      display: flex;
      .line {
        width: 1px;
        border-right: 1px solid;
      }
      .normalMark::before {
        content: "";
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 100px;
        background-color: #2573f1;
        margin-right: 5px;
      }
      .alarmMark::before {
        content: "";
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 100px;
        background-color: #f36f16;
        margin-right: 5px;
      }
      .malfunctionMark::before {
        content: "";
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 100px;
        background-color: #f11313;
        margin-right: 5px;
      }
      .borderLine {
        border-right: 1px solid;
      }
      .item {
        font-size: 18px;
        padding-right: 10px;
        margin-right: 25px;
      }
    }
  }
  // 表格内样式
  #device-status {
    margin: 4px 0;
    font-size: 12px;
    line-height: 18px;
    .disconnected {
      background-color: #ff675c;
    }
    .connected {
      background-color: #00bb94;
    }
    .circle {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 3px;
      margin-right: 4px;
      vertical-align: top;
      margin-top: 6px;
    }
  }
  .searchBox {
    background: #fff;
    padding: 20px;
    margin-bottom: 15px;
  }
  /deep/.el-drawer__body {
    padding: 0 24px;
    position: relative;
  }
  .ap-device-title {
    margin: 41px 0 16px;
    height: 66px;
    .ap-device-icon {
      width: 64px;
      height: 64px;
      border: 1px solid #d9d9d9;
      border-radius: 2px;
      float: left;
      padding: 8px;
      img {
        width: 48px;
        height: 48px;
      }
    }
    .ap-device-header {
      width: calc(100% - 80px);
      margin-left: 12px;
      display: inline-block;
      font-size: 0;
      & > p {
        vertical-align: middle;
        display: inline-block;
        overflow-x: hidden;
        width: 280px;
        white-space: pre;
        cursor: default;
        text-overflow: ellipsis;
        font-size: 16px;
        color: #333;
        line-height: 24px;
        margin-top: 9px;
      }
    }
    #device-status {
      margin: 4px 0;
      font-size: 12px;
      line-height: 18px;
      .disconnected {
        background-color: #ff675c;
      }
      .circle {
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 3px;
        margin-right: 4px;
        vertical-align: top;
        margin-top: 6px;
      }
    }
    .btn {
      margin-top: -43px;
      float: right;
    }
  }
  .w-device-info-footer {
    display: flex;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    button {
      flex: 1;
      padding: 9px 11px;
      font-size: 12px;
      border-radius: 2px;
      border: 1px solid #dcdfe6;
      white-space: nowrap;
      cursor: pointer;
    }
    .cancel {
      color: #333;
      background-color: #e6e6e6;
      border-color: #e6e6e6;
      &:hover {
        background: #ccc;
        border-color: #ccc;
        color: #333;
      }
    }
    .save-parimay {
      color: #fff;
      background-color: #1785e6;
      border-color: #1785e6;
      &:hover {
        background: #1476cc;
        border-color: #1476cc;
        color: #fff;
      }
    }
  }
  .formatter {
    height: 24px;
    margin-bottom: 8px;
    position: relative;
    > p {
      color: #666;
      text-align: right;
    }
  }
  // 第二个tabs
  .child-tabs {
    /* tabs样式 start*/
    margin-top: 24px;
    /deep/.el-tabs {
      // height: 28px;
      .el-tabs__nav {
        width: 100%;
        .el-tabs__item {
          width: 50%;
          height: 100%;
          line-height: 28px;
        }
        .el-tabs__item:hover {
          cursor: pointer;
          color: #303133;
        }
      }
      > .el-tabs__header .el-tabs__nav {
        border: unset;
        height: 100%;
      }
      > .el-tabs__header .el-tabs__item.is-active {
        border-bottom-color: #409eff;
        color: #fff;
        background-color: #409eff;
      }
      > .el-tabs__header .el-tabs__item {
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
          padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      }
    }
    /* tabs样式 end*/

    /** 内容样式 */
    .ap-wireless-ssid {
      font-size: 12px;
      line-height: 18px;
      margin-bottom: 3px;
      > label {
        width: 70px;
        color: #666;
        text-align: right;
        margin-right: 8px;
        display: inline-block;
        vertical-align: top;
        height: 24px;
        line-height: 24px;
      }
      .ap-wireless-ssid-item {
        width: calc(100% - 90px);
        display: inline-block;
        height: 24px;
      }
      .ssid-content {
        border: 0;
        border-bottom: 1px;
        border-color: #e6e6e6;
        border-style: solid;
        margin-bottom: 10px;
        display: inline-block;
        width: 100%;
        .ssid-pic {
          width: 16px;
          height: 15px;
          vertical-align: middle;
        }
        .ssid-name {
          vertical-align: middle;
          display: inline-block;
          overflow-x: hidden;
          text-overflow: ellipsis;
          width: calc(100% - 80px);
          line-height: 18px;
        }
        .ssid-operation {
          font-size: 12px;
          vertical-align: middle;
          line-height: 18px;
          float: right;
          color: #1785e6;
          cursor: pointer;
        }
      }
      .bundle-text {
        color: #1785e6;
        cursor: pointer;
      }
    }
  }
}
</style>