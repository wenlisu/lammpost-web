<template>
  <div id="broadcastMonitoring" :class="{ template: type === 'template' }">
    <div class="accessSelect" v-if="type !== 'template'">
      <div class="info flexCloumn">
        <div class="flexRow infoInput">
          <el-input placeholder="请输入广播器的名称" v-model="filterText">
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              @click="searchTree(filterText)"
            ></i>
          </el-input>
        </div>
        <div class="infoTree">
          <el-tree
            class="filter-tree"
            :data="defaultOptions"
            node-key="id"
            :props="defaultProps"
            :default-expand-all="treeExpandAll"
            :default-expanded-keys="treeExpandKeys"
            :filter-node-method="filterNode"
            :load="loadNode"
            @node-click="nodeClick"
            highlight-current
            lazy
            ref="tree"
            :check-on-click-node="true"
            :auto-expand-parent="true"
            :current-node-key="currentNodeKey"
            v-if="sping"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span
                class="treeLabel"
                :class="[
                  `${data.type} device${data.onlineStatus}${data.alarmStatus}`,
                ]"
              >
                {{ node.label }}
              </span>
            </span>
          </el-tree>
        </div>
      </div>
    </div>
    <div class="flexCloumn timeMonitoringSelect">
      <div
        class="flexCloumn deviceContainer"
        v-if="monitorId === 'device' || monitorId === 'address'"
      >
        <div class="flexRow deviceName" v-if="type !== 'template'">
          <span class="name">
            {{ deviceInfo.name }}
          </span>
        </div>
        <el-form
          :model="formcontent"
          ref="ruleForm"
          label-width="80px"
          label-position="left"
        >
          <card title="基本信息" className="adminCard headerTitle">
            <el-row :gutter="10">
              <el-col :span="8" v-if="type === 'template'">
                <el-form-item label="模板名称：" label-width="80px">
                  <el-input v-model="formcontent.taskName"> </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="播放开关：" label-width="80px">
                  <el-switch
                    style="display: block; height: 23px"
                    :value="formcontent.playStatus === 1"
                    active-color="#2870FF"
                    inactive-color="#e0e0e0"
                    :active-text="formcontent.playStatus === 1 ? '开' : ''"
                    :inactive-text="formcontent.playStatus !== 1 ? '关' : ''"
                    @change="
                      (val) => handleChangeOnline(formcontent.playStatus)
                    "
                  >
                    >
                  </el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="音量：" label-width="60px">
                  <el-slider v-model="formcontent.volume"></el-slider>
                  <!-- <el-checkbox v-model="volumnDialog.form.b">应用音量到当前节点的所有设备</el-checkbox> -->
                </el-form-item>
              </el-col>
            </el-row>
          </card>
          <card title="播放音频" className="adminCard detail_content">
            <div class="detail_form">
              <div class="audioMain" style="marginbottom: 10px">
                <uploadFile
                  type="audio"
                  :uploadUrl="uploadPath"
                  :fileList="videoList"
                  @change="(val) => changeUploadFile(val)"
                  :parames="uploadParams"
                >
                  <template v-slot:content>
                    <div class="flexCloumn flexCenter resource_img">
                      <div class="upload_img">
                        上传音频
                        <i class="el-icon-top"></i>
                      </div>
                    </div>
                  </template>
                </uploadFile>
              </div>
              <el-row :gutter="10">
                <el-col :span="24">
                  <el-form-item label="播放方式：" prop="playMode">
                    <div class="flexRow playType">
                      <el-radio-group v-model="formcontent.playMode">
                        <el-radio :label="1">顺序播放</el-radio>
                        <el-radio :label="2">随机播放</el-radio>
                        <el-radio :label="3">循环</el-radio>
                      </el-radio-group>
                      <div v-if="formcontent.playMode === 3">
                        <el-input
                          v-model="formcontent.loopCount"
                          placeholder="请输入次数"
                        ></el-input>
                        次
                      </div>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </card>
          <card
            title="模板信息"
            :className="'adminCard templateCard'"
            v-if="type !== 'template'"
          >
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item
                  label="是否为模板："
                  label-width="120px"
                  prop="isTemplate"
                >
                  <el-radio-group v-model="formcontent.isTemplate">
                    <el-radio
                      v-for="(item, index) in [
                        {
                          id: 0,
                          name: '否',
                        },
                        {
                          id: 1,
                          name: '是',
                        },
                      ]"
                      :key="index"
                      :label="item.id"
                    >
                      {{ item.name }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </card>
          <div class="flexRow flexCenter btnList" v-if="buttonShow">
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
              设置
            </el-button>
          </div>
        </el-form>
      </div>
    </div>
    <!-- <dialog-cont
      @on-cancel="previewDialogCancel"
      :visible.sync="previewDialog.show"
      width="550px"
      :title="previewDialog.title"
      append-to-body
      :bottomShow="false"
      customClass="previewDialog"
    >
      <Effect :index-data="effextArray"/>
    </dialog-cont> -->
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import moment from "moment";
import * as echarts from "echarts"; // 引入echarts
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import Treeselect, { LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";
import Flex from "@/components/flex";
import labers from "@/components/labers";
import searchForm from "components/adminSearchForm/searchForm";
import FormItem from "@/components/adminFormItem";
import FormItemText from "@/components/formItemText/formItemText";
import card from "@/view/lightPole/lightPoleStatistical/components/card";
import Effect from "@/view/index/publishPoleMap/components/effect";
import PageTable from "@/components/adminPage-table";
import PoleMap from "@/view/index/lightPoleMap/poleMap";
import echartData from "@/view/lightPole/lightPoleStatistical/components/echartData";
import uploadFile from "@/components/upload/uploadFile";
import scrollView from "@/components/sideMenu/scrollView";
import dialogCont from "@/components/adminDialog";
import { routePush } from "@/util/util";
import { COMMON_TEMPLATE_SERVICE_TYPE } from "@/util/constants";
import config, { baseURL } from "@/config";
// import programDetail from './programDetail';
import {
  getGroupPolicy,
  getLamp,
  deleteByFileCode,
  getTerminalTree,
} from "api/index";
import { getDeviceModuleTree, getDetailByID } from "api/admin";
import {
  addmediadata,
  editAudioPlayTask,
  getAudioPlayTaskDtl,
  setVolume,
  getAudioPlayTaskByLastTime,
  getTaskTemplateInfo,
} from "api/brocast";
import "swiper/swiper-bundle.css";

const onlineStatusType = {
  1: "在线",
  2: "故障",
  3: "离线",
};

const alarmStatusType = {
  1: "报警",
  0: "在线",
};

const statusPandType = {
  正常: "normal",
  离线: "normal",
  故障: "malfunction",
  报警: "alarm",
};

export default {
  name: "broadcastTimeMonitoring",
  components: {
    Treeselect,
    Flex,
    FormItemText,
    card,
    PageTable,
    Swiper,
    SwiperSlide,
    echartData,
    searchForm,
    PoleMap,
    labers,
    FormItem,
    uploadFile,
    scrollView,
    dialogCont,
    Effect,
  },
  data() {
    return {
      uploadParams: {},
      uploadPath: "",
      isDetail: false,
      treeExpandAll: false,
      treeExpandKeys: [],
      sping: false,
      filterText: "",
      defaultOptions: [
        {
          id: 1,
          label: "一级 1",
          children: null,
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf",
      },
      monitorId: undefined,
      currentNodeKey: undefined,
      deviceInfo: {
        name: "广播器显示屏",
        address: "",
        area: "",
        city: "",
        imei: "",
        resolution: "",
        serialNumber: "",
        taskCode: "",
        volume: 0,
      },
      searchItems: [
        {
          type: "input",
          label: "任务名称",
          labelWidth: "60px",
          isLabel: true,
          initValue: undefined,
          props: {
            fieldName: "taskName",
            width: "200px",
          },
        },
        {
          type: "custom",
          label: "广播器",
          labelWidth: "60px",
          isLabel: true,
          initValue: undefined,
          props: {
            fieldName: "serialNumbers",
          },
        },
        {
          type: "custom",
          label: "广播器数量",
          labelWidth: "80px",
          isLabel: true,
          initValue: undefined,
          props: {
            fieldName: "number",
          },
        },
        {
          type: "checkbox",
          label: "任务状态",
          labelWidth: "70px",
          isLabel: true,
          initValue: [1],
          props: {
            fieldName: "taskStatus",
            options: [
              {
                id: 1,
                name: "启用",
              },
            ],
          },
        },
      ],
      serviceCode: "",
      formcontent: {
        volume: undefined,
        taskName: undefined,
        isTemplate: 0,
        taskType: 1,
        playMode: 1,
        playStatus: 1,
      },
      videoList: [],
      editData: {
        streetCode: undefined,
      },
    };
  },
  watch: {
    "$route.query": {
      deep: true,
      handler(newValue) {
        if (!newValue.activeNumber) {
          this.clearnData();
        } else {
          this.initData();
        }
      },
    },
    currentData(val) {
      if (val.streetCode !== this.editData.streetCode) {
        this.editData = val;
        this.initTemplate();
      }
    },
  },
  props: {
    type: {
      type: String,
      default: "default",
    },
    currentData: {
      type: Object,
      default: () => {},
    },
    buttonShow: {
      type: Boolean,
      default: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.serviceCode = moment().format("YYYYMMDDHHmmss");
      this.initData();
      this.initTemplate();
    });
  },
  computed: {
    ...mapGetters(["common", "openPage"]),
    routeName() {
      return this.$route.name;
    },
  },
  methods: {
    initTemplate() {
      if (this.type === "template") {
        this.clearnInfo();
        this.monitorId = "device";
        this.formcontent.isTemplate = 1;
        if (this.currentData && Object.keys(this.currentData).length > 1) {
          if (this.currentData.templateCode) {
            this.getTemplateInfo(this.currentData.templateCode);
          } else if (this.currentData.serialNumber) {
            this.deviceInfo.serialNumber = this.currentData.serialNumber;
            this._getAudioPlayTaskByLastTime();
          }
        }
      }
    },
    initData() {
      const query = this.$route.query;
      if (query.activeNumber) {
        const parames = this.common["broadcastTimeMonitoring"];
        this.treeExpandAll = true;
        this.sping = true;
        this.nodeClick({
          ...parames,
          type: "device",
          id: parames.serialNumber,
        });
        this.filterText = parames.audioDeviceName;
        setTimeout(() => {
          this.searchTree();
          this.$refs.tree.setCheckedKeys([query.activeNumber]);
        }, 500);
      } else {
        this.sping = true;
      }
    },
    clearnData() {
      this.sping = true;
      this.filterText = "";
      this.monitorId = "";
      this.currentNodeKey = "";
      setTimeout(() => {
        this.searchTree();
        this.$refs.tree.setCheckedKeys([]);
      }, 500);
    },
    searchTree(filterText) {
      this.$refs.tree &&
        this.$refs.tree.filter({ val: filterText, type: "label" });
    },
    filterNode(value, data) {
      if (!value.val) return true;
      return data[value.type] && data[value.type].indexOf(value.val) !== -1;
    },
    async loadNode(node, resolve) {
      const activeNumber = this.$route.query.activeNumber;
      if (node.level === 0) {
        const tree0 = await this._getTerminalTree(
          {
            address: "",
            area: "",
            city: "",
            imei: "",
          },
          "city",
          "city",
          "city",
          resolve
        );
        if (!activeNumber) {
          this.treeExpandKeys = [tree0[0].id];
        }
      }
      if (node.level === 1) {
        const tree1 = await this._getTerminalTree(
          {
            city: node.data.city,
            cityCode: node.data.cityCode,
          },
          "area",
          "area",
          "area",
          resolve
        );
        if (!activeNumber) {
          this.treeExpandKeys = [...this.treeExpandKeys, tree1[0].id];
        }
      }
      if (node.level === 2) {
        const tree2 = await this._getTerminalTree(
          {
            city: node.data.city,
            area: node.data.area,
            cityCode: node.data.cityCode,
            areaCode: node.data.areaCode,
          },
          "address",
          "address",
          "address",
          resolve
        );
        if (!activeNumber) {
          this.treeExpandKeys = [...this.treeExpandKeys, tree2[0].id];
        }
      }
      if (node.level === 3) {
        const tree3 = await this._getTerminalTree(
          {
            city: node.data.city,
            area: node.data.area,
            cityCode: node.data.cityCode,
            areaCode: node.data.areaCode,
            address: node.data.address,
          },
          "imei",
          "terminalName",
          "imei",
          resolve
        );
        if (!activeNumber) {
          this.treeExpandKeys = [...this.treeExpandKeys, tree3[0].id];
        }
      }
      if (node.level === 4) {
        getTerminalTree({
          city: node.data.city,
          area: node.data.area,
          cityCode: node.data.cityCode,
          areaCode: node.data.areaCode,
          address: node.data.address,
          imei: node.data.imei,
          deviceTypeNo: "AUDIO",
        }).then((res) => {
          if (res.code === "200") {
            const treeData = res.data.map((daItem) => {
              return {
                id: daItem["serialNumber"],
                label: daItem["deviceModuleName"],
                type: "device",
                city: node.data.city,
                area: node.data.area,
                address: node.data.address,
                imei: node.data.imei,
                ...daItem,
                leaf: true,
              };
            });
            resolve(treeData);
            if (!activeNumber) {
              this.treeExpandKeys = [...this.treeExpandKeys, treeData[0].id];
              this.$refs.tree.setCheckedKeys([treeData[0].id]);
              this.nodeClick({
                ...treeData[0],
                type: "device",
                id: treeData[0].serialNumber,
              });
            }
          }
        });
      }
      if (node.level === 5) {
        resolve([]);
      }
    },
    nodeClick(data) {
      if (data.type === "device") {
        this.clearnInfo();
        this.deviceInfo = {
          name: data.label,
          address: null,
          area: data.area,
          city: data.city,
          imei: data.imei,
          serialNumber: data.serialNumber,
        };
        const serialNum = data.serialNumber
        if (serialNum.slice(0, 2) == "XC") {
          this.uploadPath = "/api/php/addmediadata.php";
          this.uploadParams = {
            unformat: 1,
            subpath: "",
          };
        } else {
          this.uploadPath = "/api/fileupload/upload";
          this.uploadParams = {
            service_table: "broadcast_policy",
            serviceCode: moment().format("YYYYMMDDHHmmss")+'2',
          };
        }
      }
      if (data.type === "address") {
        this.clearnInfo();
        this.deviceInfo = {
          name: data.label,
          address: data.address,
          streetCode: data.streetCode,
          area: data.area,
          city: data.city,
          imei: data.imei,
          serialNumber: data.serialNumber,
        };
      }
      this.monitorId = data.type;
      this.currentNodeKey = data.id;
      this._getAudioPlayTaskByLastTime();
    },
    getTemplateInfo(templateCode) {
      getTaskTemplateInfo(templateCode).then((res) => {
        if (res.code === "200") {
          this.mergeData(res);
        }
      });
    },
    _getAudioPlayTaskByLastTime(
      serialNumber = this.deviceInfo.serialNumber,
      streetCode = this.deviceInfo.streetCode
    ) {
      getAudioPlayTaskByLastTime({
        serialNumber: serialNumber,
        streetCode: streetCode,
      }).then((res) => {
        if (res.code === "200") {
          this.mergeData(res);
        }
      });
    },
    mergeData(res) {
      let searchItems = [...this.searchItems];
      searchItems[0].initValue = res.data.taskName;
      searchItems[3].initValue = [res.data.taskStatus];
      this.searchItems = searchItems;
      this.deviceInfo.volume = +res.data.volume;
      this.formcontent = {
        ...this.formcontent,
        ...res.data,
        // playStatus: 1,
        taskName: `${this.deviceInfo.name}单次任务`,
        volume: this.deviceInfo.volume,
        date: res.data.beginDate ? [res.data.beginDate, res.data.endDate] : [],
        time: res.data.beginTime ? [res.data.beginTime, res.data.endTime] : [],
        weekList: res.data.weekList ? res.data.weekList : [],
      };
      this.videoList =
        res.data.audioMediaList &&
        res.data.audioMediaList.map((medio) => {
          const path = medio.fileUrl.split("upload")[1];
          return {
            code: medio.fileCode,
            url: medio.fileUrl,
            name: medio.fileName,
            path: path,
          };
        });
    },
    clearnInfo() {
      this.formcontent = {
        volume: undefined,
        isTemplate: 0,
        taskType: 1,
        playMode: 1,
        playStatus: 1,
      };
      this.videoList = [];
    },
    async _getTerminalTree(data, id, label, type, resolve) {
      let treeData = [];
      await getTerminalTree({
        ...data,
        deviceTypeNo: "AUDIO",
      }).then((res) => {
        if (res.code === "200") {
          treeData = res.data.map((daItem) => {
            return {
              id: daItem[id],
              label: daItem[label],
              type: type,
              ...data,
              ...daItem,
            };
          });
          resolve(treeData);
        }
      });
      return treeData;
    },
    async tressSelectSelect(val, instanceId) {
      if (val.now === "device") {
        this.deviceInfo = {
          name: val.label,
          address: val.address,
          area: val.area,
          city: val.city,
          imei: val.imei,
          serialNumber: val.serialNumber,
        };
      }
      this.monitorId = val.now;
    },
    changeUploadFile(list) {
      const removeObj = this.videoList.filter(
        (obj) => !list.some((obj1) => obj1.uid === obj.uid)
      );
      if (removeObj[0] && removeObj[0].fileCode) {
        deleteByFileCode(removeObj[0].fileCode).then((res) => {
          if (res.code === "200") {
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              position: "bottom-right",
            });
            this.videoList = list;
          }
        });
      } else {
        this.videoList = list;
      }
    },
    async handleSave() {
      if (
        this.deviceInfo.volume !== this.formcontent.volume &&
        this.deviceInfo.serialNumber
      ) {
        const volumnParames = {
          volume: this.formcontent.volume,
          serialNumbers: [this.deviceInfo.serialNumber],
        };
        setVolume(volumnParames).then((res) => {
          if (res.code === "200") {
            this.$notify({
              title: "成功",
              message: "设置音量成功",
              type: "success",
              position: "bottom-right",
            });
          }
        });
      }
      let message = "设置成功";
      const parames = {
        ...this.formcontent,
        loopCount: +this.formcontent.loopCount,
        taskStatus: 1,
        taskType: 1,
        // playStatus: 1,
        beginDate: `${moment().format("YYYY-MM-DD")} 00:00:00`,
        endDate: `${moment().format("YYYY-MM-DD")} 00:00:00`,
        beginTime: moment().format("HH:mm"),
        endTime: moment()
          .add(this.videoList.length * 5, "m")
          .format("HH:mm"),
        mediaCommandList: this.videoList.map((ls) => {
          return {
            fileCode: ls.code,
            fileUrl: ls.path,
            fileName: ls.name,
          };
        }),
        isTimer: 99,
      };
      if (parames.taskType !== 1) {
        parames.beginDate = parames.date[0];
        parames.endDate = parames.date[1];
      }
      if (this.deviceInfo.taskCode) {
        parames.taskCode = this.deviceInfo.taskCode;
        message = "修改成功";
      }
      if (this.monitorId === "address") {
        parames.streetCode = this.deviceInfo.streetCode;
        parames.isAddress = 1;
      } else {
        parames.isAddress = 0;
        parames.audioDeviceCommandList = [
          {
            area: this.deviceInfo.area,
            city: this.deviceInfo.city,
            deviceAddress: this.deviceInfo.area,
            imei: this.deviceInfo.imei,
            serialNumber: this.deviceInfo.serialNumber,
            street: this.deviceInfo.street,
          },
        ];
      }

      delete parames.number;
      delete parames.date;
      delete parames.time;
      delete parames.audioMediaList;
      delete parames.audioDeviceDtoList;
      delete parames.weeks;
      delete parames.serialNumbers;
      editAudioPlayTask(parames).then((res) => {
        if (res.code === "200" || res.res == "1") {
          this.$notify({
            title: "成功",
            message: message,
            type: "success",
            position: "bottom-right",
          });
          if (this.type !== "template") {
            this._getAudioPlayTaskByLastTime();
          }
          this.$emit("submit");
        }
      });
    },
    handleCancel() {
      if (this.type !== "template") {
        this._getAudioPlayTaskByLastTime();
      }
      this.$emit("cancel");
    },
    handleChangeOnline(val) {
      this.formcontent.playStatus = val === 1 ? 0 : 1;
    },
  },
};
</script>
<style lang="less">
.previewDialog {
  .el-dialog__body {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #wrpaBox {
    display: flex;
    width: 240px; /*no*/
    height: 160px; /*no*/
  }
}
#broadcastMonitoring {
  display: flex;
  flex-direction: row;
  .accessSelect {
    flex: 2;
    height: 100%;
    padding-right: 10px; /*no*/
    .info {
      height: 100%;
      background: #fff;
      .infoInput {
        padding: 15px 10px; /*no*/
        border-bottom: 1px solid rgba(238, 238, 238, 1); /*no*/
        input {
          background: rgba(255, 255, 255, 1);
          border-radius: 5px; /*no*/
          border: 1px solid rgba(165, 186, 250, 1); /*no*/
          line-height: 30px !important; /*no*/
        }
        > .el-select {
          display: flex;
          flex: 1;
          margin-right: 10px; /*no*/
        }
        > .el-input {
          display: flex;
          flex: 2;
        }
        .el-input__suffix {
          display: flex;
          align-items: center;
          padding-left: 8px; /*no*/
          cursor: pointer;
          &::after {
            position: relative;
            content: "";
            width: 1px; /*no*/
            height: 17px; /*no*/
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            background: #d0d0d0;
          }
          i {
            font-size: 16px; /*no*/
            color: #4a80f5;
          }
        }
      }
      .infoTree {
        height: calc(100% - 61px); /*no*/
        padding-bottom: 20px; /*no*/
        .el-tree {
          height: 100%;
          overflow: auto;
          .el-tree-node__children {
            .is-expanded {
              .area {
                color: #2573f2 !important;
                font-weight: 600 !important;
                .building,
                .floor {
                  color: #2573f2 !important;
                }
              }
              .is-expanded {
                .building {
                  color: #2573f2 !important;
                  font-weight: 600 !important;
                }
                .is-expanded {
                  .floor {
                    color: #2573f2 !important;
                  }
                  .is-checked {
                    .device {
                      color: #2573f2 !important;
                    }
                  }
                }
              }
            }
          }
          .custom-tree-node {
            .treeLabel {
              position: relative;
              &.park {
                font-size: 14px; /*no*/
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #3f3f3f;
              }
              &.area {
                font-size: 14px; /*no*/
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 400;
                color: #3f3f3f;
              }
              &.building,
              &.floor {
                font-size: 12px; /*no*/
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #3f3f3f;
              }
              &.device {
                padding-left: 15px; /*no*/
                font-size: 12px; /*no*/
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                &::before {
                  content: "";
                  width: 5px; /*no*/
                  height: 5px; /*no*/
                  border-radius: 100%;
                  background: linear-gradient(136deg, #35ba70 0%, #2eb67c 100%);
                  position: absolute;
                  top: 50%;
                  left: 5px; /*no*/
                  transform: translateY(-50%);
                }
                &.device11 {
                  &::before {
                    background: #ff3c30;
                  }
                }
                &.device10 {
                }
                &.device20 {
                  &::before {
                    background: #ffa330;
                  }
                }
                &.device30 {
                  &::before {
                    background: #8d8d8d;
                  }
                }
              }
            }
          }
        }
        .labers {
          padding: 0px 10px; /*no*/
        }
      }
    }
  }
  .timeMonitoringSelect {
    flex: 8;
    overflow-y: auto;
    // padding: 20px;/*no*/
    &::-webkit-scrollbar-track-piece {
      //滚动条凹槽的颜色，还可以设置边框属性
      background-color: #ebebeb;
    }
    &::-webkit-scrollbar {
      //滚动条的宽度
      width: 4px;
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
    .deviceContainer {
      height: 100%;
      .deviceName {
        padding: 20px; /*no*/
        background: #fff;
        justify-content: space-between;
        .name {
          font-size: 16px; /*no*/
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #393939;
          display: flex;
          align-items: center;
          .specification {
            margin-left: 8px; /*no*/
            padding: 4px 8px; /*no*/
            background: linear-gradient(135deg, #27c2ff 0%, #00a6e7 100%);
            font-size: 12px; /*no*/
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #ffffff;
          }
        }
        .previewBtn {
          display: flex;
          padding: 7px 20px; /*no*/
          background: #265aca;
          font-size: 12px; /*no*/
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
          width: fit-content;
          cursor: pointer;
        }
      }
      .headerTitle {
        margin-top: 10px; /*no*/
        margin-bottom: 10px; /*no*/
        // background:rgba(32,45,85, 0.49);
        background: #fff;
        border-radius: 4px;
        display: flex;
        padding: 20px 20px 10px;
        position: relative;
        .el-row {
          width: 100%;
        }
        .el-slider {
          .el-slider__runway {
            width: calc(100% - 10px); /*no*/
            margin: 12px 0; /*no*/
            margin-left: 10px; /*no*/
            .el-slider__button-wrapper {
              height: 30px; /*no*/
              width: 30px; /*no*/
              top: 50%;
              transform: translate(-50%, -50%);
            }
          }
        }
      }
      .detail_content {
        /deep/.el-tabs__item {
          // height:20px;
          font-size: 14px; /*no*/
          padding: 0 26px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(115, 131, 178, 1);
        }
        /deep/.el-tabs__item.is-active {
          color: rgba(255, 255, 255, 1);
        }
        /deep/.el-tabs__active-bar {
          //   width:122px;
          // padding: 0 26px;
          height: 2px;
        }
        /deep/.el-tabs__nav-wrap::after {
          background-color: #192349;
          height: 1px;
        }

        .detail_form {
          color: #000;
          font-size: 12px; /*no*/
          padding: 10px 0 0; /*no*/
          background: #fff;
          border-radius: 4px;
          .el-form-item {
            // margin-bottom: 15px;/*no*/
          }
          .audioMain {
            .audio {
              .audioContent {
                width: 300px; /*no*/
              }
            }
          }
          .el-form-item__content {
            position: relative;
            align-items: center;
            .brightText {
              font-size: 12px; /*no*/
              position: absolute;
              left: 2.8rem;
              top: 50%;
              transform: translateY(-50%);
            }
          }
          .modules_title {
            position: relative;
            padding-left: 36px;
            font-size: 14px; /*no*/
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #a0acd8;
            margin-bottom: 20px;
          }
          .modules_title::after {
            width: 26px;
            height: 13px;
            content: "";
            position: absolute;
            left: 0px;
            top: 50%;
            margin-top: -6.5px;
            background: url(~common/images/smartCharge/tit_bg.png) no-repeat;
            background-size: contain;
          }
          .el-switch {
            .el-switch__core {
              height: 17px; /*no*/
              &::after {
                width: 13px; /*no*/
                height: 13px; /*no*/
              }
            }
            &.is-checked {
              .el-switch__core {
                &::after {
                  margin-left: -13px; /*no*/
                }
              }
            }
          }

          /deep/.el-radio {
            margin-right: 20px;
            margin-left: 0;
          }
          /deep/.el-form-item__label,
          /deep/.el-radio .el-radio__label,
          /deep/.el-checkbox {
            width: auto !important;
            color: #000;
            font-size: 12px; /*no*/
          }
          .el-radio__label {
            padding-left: 6px;
          }
          .el-radio__inner {
            width: 12px; /*no*/
            height: 12px; /*no*/
            &::after {
              width: 5px; /*no*/
              height: 5px; /*no*/
            }
          }
          /deep/.el-checkbox__inner {
            // background: #34437b;
            // border-color: #34437b;
          }
          /deep/.is-checked /deep/.el-radio__inner {
            border-color: #2870ff;
            &::after {
              background: #fff;
            }
          }
          /deep/.el-slider__runway {
            width: 192px;
            height: 6px;
            background: rgba(38, 48, 55, 1);
            border-radius: 5px;
          }
          /deep/.el-slider__bar {
            height: 6px;
            background: rgba(29, 214, 176, 1);
            border-radius: 5px; /*no*/
          }
          /deep/.el-slider__button {
            background: rgba(255, 255, 255, 1);
            box-shadow: 0px 2px 10px 0px rgba(29, 214, 176, 1); /*no*/
            border-color: rgba(29, 214, 176, 1);
          }
          /deep/.el-select {
            // width: 150px;/*no*/
            // height: 25px !important;
            // line-height: 25px !important;
            display: inline-block;
            /deep/.el-input__inner,
            .el-input__inner:focus {
              color: #000;
              // border: 1px solid #6275bf !important;
              // background: rgba(34, 44, 81, 1);
              border-radius: 4px;
              outline: none;
            }
            /deep/.el-input--suffix /deep/.el-input__inner {
              padding: 0 6px !important; /*no*/
              // height: 25px !important;/*no*/
              // line-height: 25px !important;/*no*/
            }
            .el-input__icon {
              height: 25px;
              line-height: 25px;
            }
          }
          .el-radio__inner {
            // background-color: #202d55;
            // border-color: #ffffff;
          }
          .el-upload-list {
            .el-upload-list__item {
              width: auto;
              height: auto;
            }
            .el-upload-list__item-thumbnail {
              width: 182px;
              height: 152px;
            }
          }
          .el-upload--picture-card {
            background: transparent;
            width: auto;
            // height: auto;
            border-radius: 0;
            border: 2px dashed rgba(44, 52, 58, 1);
          }
          .resource_img {
            width: 182px;
            height: 152px;
            background: #fff;
            border-radius: 5px;
            // margin-bottom: 10px;
            cursor: pointer;
            position: relative;
            border: 2px dashed #d2d6de; /*no*/
            .upload_img {
              margin: 0 auto;
              // margin-top: 72px;
              // margin-bottom: 15px;
              padding: 0 40px;
              height: 30px;
              line-height: 30px;
              text-align: center;
              background: rgba(72, 128, 255, 1);
              box-shadow: 0px 4px 7px 0px rgba(72, 128, 255, 0.5); /*no*/
              border-radius: 19px;
              color: #fff;
              position: relative;
              .el-icon-top {
                position: absolute;
                right: 2px;
                top: 50%;
                transform: translateY(-50%);
                width: 26px;
                height: 26px;
                line-height: 26px;
                border-radius: 50%;
                background: rgba(56, 107, 225, 1);
                font-size: 10px;
                color: #fff;
              }
            }
          }
          .textMain {
            .textTemplate {
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
            }
            .resource_text {
              width: 200px;
              min-height: 152px;
              height: auto;
              // width: auto;
            }
          }

          .limit {
            position: absolute;
            bottom: 20px;
            left: 0;
            right: 0;
            margin: 0 auto;
            height: 17px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(116, 133, 145, 1);
            line-height: 17px;
            text-align: center;
          }
        }
      }
      .el-switch {
        height: 30px !important; /*no*/
        line-height: 27px !important; /*no*/
        .el-switch__label {
          height: 100%;
          background-color: transparent !important;
          border-color: transparent !important;
        }
      }
      .playType {
        .el-radio-group {
          height: 30px; /*no*/
          display: flex;
          align-items: center;
        }
        .el-input {
          max-width: 150px; /*no*/
          margin-right: 15px; /*no*/
        }
      }
      .primary {
        background: linear-gradient(
          318deg,
          rgba(29, 91, 250, 1) 0%,
          rgba(0, 119, 228, 1) 100%
        );
        border-radius: 4px;
        padding: 5px 15px;
        color: #000;
        font-size: 12px;
      }
      .btnList {
        height: 70px;
        margin-top: 10px; /*no*/
        background: #fff;
        justify-content: center !important;
        align-items: center !important;
        button {
          padding: 7px 25px; /*no*/
          // background:rgba(21,27,46,1);
          border-radius: 4px; /*no*/
          border: 1px solid #ddd;
          color: #888;
          font-size: 12px; /*no*/
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          &.el-button--primary {
            background: linear-gradient(
              318deg,
              rgba(29, 91, 250, 1) 0%,
              rgba(29, 144, 250, 1) 100%
            );
            color: rgba(230, 236, 255, 1);
            border-color: #1d5bfa;
          }
        }
      }
    }
    #formItemText {
      .el-form-item {
        .el-form-item__content {
          color: rgba(73, 73, 73, 1);
        }
      }
    }
  }
  &.template {
    .accessSelect {
    }
    .timeMonitoringSelect {
    }
  }
}
</style>

