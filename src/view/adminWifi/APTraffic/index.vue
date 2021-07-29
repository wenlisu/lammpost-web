<template>
  <div id="APTraffic">
    <div class="searchBox">
      <search-form
        :searchItems="searchItems"
        :otherBtnVisible="false"
        @onSearch="onSearch"
      />
    </div>

    <div class="content-view">
      <div class="Modeltable">
        <page-table
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
          <template slot="devName" slot-scope="scope">
            <div id="device-status">
              <span
                style="color: #1785e6; cursor: pointer"
                @click="handleDrawer({ ...scope.row })"
                >{{ scope.row && scope.row.devName }}
              </span>
            </div>
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
            <p title="AP-1">{{ form["deviceName"] || "" }}</p>
            <div>
              <div id="device-status">
                <div :class="['circle', form['status'] == 3 ? 'disconnected' : 'connected']"></div>
                <span style="padding-left: 4px">{{
                  form["status"] == 3 ? "离线" : "在线"
                }}</span>
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
import { queryWifiApLoad, queryWifiGroup, queryWifiInfoById } from "api/wifi";
export default {
  name: "devInfo",
  components: {
    searchForm,
    PageTable,
    FormItem,
  },
  data() {
    return {
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
          id: "deviceType",
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
          id: "firmwareVer",
          value: "",
          required: false,
          span: 24,
          disabled: true,
        },
        {
          label: "硬件版本",
          inputType: "text",
          id: "belongDevice",
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
          label: "AP名称",
          prop: "devName",
          custom: true,
        },
        {
          label: "上传流量",
          prop: "upFlow",
        },
        {
          label: "下载流量",
          prop: "downFlow",
        },
        {
          label: "流量总计",
          prop: "totalFlow",
        },
        {
          label: "安装位置",
          prop: "location",
        },
        {
          label: "所属组",
          prop: "groupName",
        },
      ],
      searchItems: [
        {
          type: "select",
          label: "所属组",
          props: {
            fieldName: "siteId",
            options: [],
          },
        },
      ],
    };
  },
  created() {
    this._queryWifiGroup();
    this.getDataAllList();
  },
  methods: {
    // 获取设备分组
    _queryWifiGroup() {
      const params = {
        deviceModuleName: "",
        deviceStatus: "",
        endTime: "",
        siteId: "",
        startTime: "",
      };
      queryWifiGroup(params).then((res) => {
        if ((res.code = "200")) {
          res.data.map((item) => {
            this.searchItems[0].props.options.push({
              name: item.siteName,
              id: item.siteId,
            });
          });
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
    // 点击设备名称查看详情
    handleDrawer(row) {
      this.drawer = true;
      const params = {
        deviceId: row.devId,
      };
      queryWifiInfoById(params).then((res) => {
        if (res.code == "200") {
          this.form = res.data;
          this.formItems.map((item, index) => {
            if (item.inputType == "text") {
              this.$set(
                this.formItems[index],
                "value",
                res.data[item.id] || "--"
              );
            }
          });
        }
      });
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
          siteId: this.searchVal.siteId || "",
        },
        pageNo: Number(this.page.current), // 查询的分页页码
        pageSize: Number(this.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: "",
      };
      queryWifiApLoad(data).then((res) => {
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
    onSelectionChange() {},
  },
};
</script>

<style scoped lang="less">
#APTraffic {
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