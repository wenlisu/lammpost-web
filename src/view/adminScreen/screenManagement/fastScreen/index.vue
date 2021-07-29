<template>
  <div id="fastScreen" :class="{'template': type === 'template'}">
    <div class="accessSelect" v-if="type !== 'template'">
      <div class="info flexCloumn">
        <div class="flexRow infoInput">
          <el-input
              placeholder="请输入LED屏的名称"
              v-model="filterText"
            >
            <i slot="suffix" class="el-input__icon el-icon-search" @click="searchTree(filterText)"></i>
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
                  `${data.type} device${data.onlineStatus}${data.alarmStatus}`
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
      <div class="flexCloumn deviceContainer" v-if="monitorId === 'device'">
        <div class="flexRow deviceName" v-if="type !== 'template'">
          <span class="name">
            {{deviceInfo.name}}
            <span class="specification">{{switchInfo.form.resolution}}</span>
          </span>
          <span class="previewBtn" @click="showPreview">预览</span>
        </div>
        <el-tabs v-model="activetDeviceTabsName" type="card" @tab-click="handleDeviceTabClick">
          <el-tab-pane
            label="开关"
            name="1"
            :disabled="type === 'template'"
          >
            <span slot="label"><i class="iconfont icon-chanpinxinxi"></i> 开关</span>
            <div class="content switchContent">
              <FormItem
                ref="switchFormItem"
                :formItems="switchInfo.formItems"
                :rules="switchInfo.formRules"
                :disabled="switchInfo.inputDisabled"
                :isEdit="switchInfo.isEdit"
                :form="switchInfo.form"
                :midway="switchInfo.midway"
              >
              </FormItem>
              <div class="saveBtn">
                <div class="btn" @click="saveSwitchInfo">
                保存
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane
            label="播放节目"
            name="2"
          >
            <span slot="label"><i class="iconfont icon-chanpinxinxi"></i> 播放节目</span>
            <div class="content programContent">
              <el-form :model="programInfo" ref="ruleForm" label-width="100px" label-position="left" :rules="programInfo.rules">
              <card title="播放节目" :className="'adminCard admin1Card'">
                <el-row :gutter="10">
                  <el-col :span="12">
                    <el-form-item label="节目名称：" prop="programName">
                      <el-input v-model="programInfo.programName"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="分屏模式：" prop="rectType">
                      <el-radio-group v-model="programInfo.rectType">
                        <el-radio
                          v-for="(item, index) in programInfo.policyType"
                          :key="index"
                          :label="item.id"
                        >
                        {{item.name}}
                        </el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>
                <div class="programDetail">
                  <div class="title">{{ programInfo.rectType === 1 ? '全屏' : '四宫格'}}</div>
                  <div class="content">
                    <programDetail
                      ref="fullScreen"
                      v-show="programInfo.rectType === 1"
                      :filesList="programInfo.fullScreen"
                    />
                    <el-tabs
                      v-model="screenActiveName"
                      @tab-click="handleScreenActiveClick"
                      v-show="programInfo.rectType === 2"
                    >
                      <el-tab-pane label="区域一" name="1">
                        <programDetail
                          ref="screen1"
                          :filesList="programInfo.screen1"
                        />
                      </el-tab-pane>
                      <el-tab-pane label="区域二" name="2">
                        <programDetail
                          ref="screen2"
                          :filesList="programInfo.screen2"
                        />
                      </el-tab-pane>
                      <el-tab-pane label="区域三" name="3">
                        <programDetail
                          ref="screen3"
                          :filesList="programInfo.screen3"
                        />
                      </el-tab-pane>
                      <el-tab-pane label="区域四" name="4">
                        <programDetail
                          ref="screen4"
                          :filesList="programInfo.screen4"
                        />
                      </el-tab-pane>
                    </el-tabs>
                  </div>
                </div>
              </card>
                <card title="模板信息" :className="'adminCard templateCard'">
                <el-row :gutter="10">
                  <el-col :span="24">
                    <el-form-item label="是否为公共模板：" label-width="120px" prop="programTemplate">
                      <el-radio-group v-model="programInfo.programTemplate">
                          <el-radio
                            v-for="(item, index) in [{
                              id: 0,
                              name: '否'
                            }, {
                              id: 1,
                              name: '是'
                            }]"
                            :key="index"
                            :label="item.id"
                          >
                          {{item.name}}
                          </el-radio>
                        </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>
              </card>
              <card title="背景音乐" :className="'adminCard backgroundContainer'">
                <scrollView>
                  <UploadFile
                    type="audio"
                    uploadUrl="/api/fileupload/upload"
                    :fileList="programInfo.videoList"
                    @change="val => changeUploadFile(val)"
                    :parames="{
                      service_table: 'broadcast_policy',
                      serviceCode: `${serviceCode}2`
                    }"
                    >
                    <template slot="content">
                      <div class="flexCloumn flexCenter resource_img">
                        <div class="flexCenter upload_img">
                          上传音频
                          <i class="el-icon-top"></i>
                        </div>
                      </div>
                    </template>
                  </UploadFile>
                </scrollView>
              </card>
              <div class="flexRow flexCenter saveBtnList">
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
                      title="设置"
                      @click.prevent.stop="handleSave"
                      >
                      设置
                  </el-button>
                </div>
              </el-form>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <dialog-cont
      @on-cancel="previewDialogCancel"
      :visible.sync="previewDialog.show"
      width="550px"
      :title="previewDialog.title"
      append-to-body
      :bottomShow="false"
      customClass="previewDialog"
    >
      <Effect :index-data="effextArray"/>
    </dialog-cont>
  </div>
</template>
<script>
import {
  mapGetters
} from 'vuex';
import moment from 'moment';
import * as echarts from 'echarts'; // 引入echarts
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect';
import Flex from '@/components/flex';
import labers from '@/components/labers';
import searchForm from 'components/adminSearchForm/searchForm';
import FormItem from '@/components/adminFormItem';
import FormItemText from '@/components/formItemText/formItemText';
import card from '@/view/lightPole/lightPoleStatistical/components/card';
import Effect from '@/view/index/publishPoleMap/components/effect';
import PageTable from '@/components/adminPage-table';
import PoleMap from '@/view/index/lightPoleMap/poleMap';
import echartData from '@/view/lightPole/lightPoleStatistical/components/echartData';
import UploadFile from '@/components/upload/uploadFile';
import scrollView from '@/components/sideMenu/scrollView';
import dialogCont from '@/components/adminDialog';
import { routePush } from '@/util/util';
import { COMMON_TEMPLATE_SERVICE_TYPE } from '@/util/constants';
import config, { baseURL } from '@/config';
import programDetail from './programDetail';
import {
  getGroupPolicy,
  getLamp,
  deleteByFileCode
} from 'api/index';
import {
  getDeviceModuleTree,
  getDetailByID,
  getTerminalTree
} from 'api/admin';
import {
  addLedIotPark,
  updateProgramCode,
  updateLedIotPark,
  settingLed,
  selectLedSetting,
  selectRunningLedProgram
} from 'api/screen';
import 'swiper/swiper-bundle.css';

const onlineStatusType = {
  1: '在线',
  2: '故障',
  3: '离线'
};

const alarmStatusType = {
  1: '报警',
  0: '在线'
};

const statusPandType = {
  正常: 'normal',
  离线: 'normal',
  故障: 'malfunction',
  报警: 'alarm'
};

export default {
  name: 'fastScreen',
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
    UploadFile,
    programDetail,
    scrollView,
    dialogCont,
    Effect
  },
  data () {
    return {
      isDetail: false,
      treeExpandAll: false,
      treeExpandKeys: [],
      sping: false,
      filterText: '',
      defaultOptions: [{
        id: 1,
        label: '一级 1',
        children: null
      }],
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'leaf'
      },
      monitorId: undefined,
      deviceInfo: {
        name: 'Led显示屏1',
        address: '',
        area: '',
        city: '',
        imei: '',
        resolution: '',
        serialNumber: ''
      },
      activetDeviceTabsName: '1',
      currentNodeKey: undefined,
      switchInfo: {
        formItems: [{
          label: '开关',
          labelWidth: '80px',
          prop: 'power',
          inputType: 'switch',
          activeColor: '#12BD69',
          inactiveColor: '#e0e0e0',
          span: 6
        }, {
          label: '显示亮度',
          labelWidth: '80px',
          prop: 'brightness',
          inputType: 'slider',
          span: 6,
          offset: 2
        }, {
          label: '音量',
          prop: 'volume',
          labelWidth: '80px',
          inputType: 'slider',
          span: 6,
          offset: 2
        }],
        formRules: {},
        form: {
          power: undefined,
          brightness: undefined,
          volume: undefined,
          settingId: undefined,
          software: undefined,
          settingCode: undefined,
          serialNumber: undefined,
          resolution: undefined
        },
        inputDisabled: false,
        isEdit: false,
        midway: true
      },
      serviceCode: '',
      programInfo: {
        policyType: [{
          id: 1,
          name: '全屏'
        }, {
          id: 2,
          name: '四宫格'
        }],
        programName: undefined,
        rectType: 1,
        programTemplate: 0,
        videoList: [],
        fullScreen: {},
        screen1: {},
        screen2: {},
        screen3: {},
        screen4: {},
        rules: {
          programName: [
            { required: true, message: '请输入节目名称', trigger: 'blur' }
          ],
          rectType: [
            { required: true, message: '请选择分屏模式', trigger: 'blur' }
          ]
        }
      },
      screenActiveName: '1',
      lampSelect: [],
      deviceSelect: [],
      lampData: [],
      deviceData: [],
      options: [],
      previewDialog: {
        show: false,
        title: '预览'
      },
      effextArray: []
    };
  },
  watch: {
    '$route.query': {
      deep: true,
      handler (newValue) {
        if (!newValue.activeNumber) {
          this.clearnData();
        } else {
          this.initData();
        }
      }
    },
    currentData (val) {
      if (Object.keys(val).length > 1) {
        this.assignmentValue(val);
      }
    }
  },
  props: {
    type: {
      type: String,
      default: 'default'
    },
    currentData: {
      type: Object,
      default: () => {}
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.serviceCode = moment().format('YYYYMMDDHHmmss');
      this.initData();
      this.initTemplate();
    });
  },
  computed: {
    ...mapGetters(['common', 'openPage']),
    routeName () {
      return this.$route.name
    }
  },
  methods: {
    initTemplate () {
      if (this.type === 'template') {
        this.clearnInfo();
        this.monitorId = 'device';
        this.activetDeviceTabsName = '2';
        if (this.currentData && Object.keys(this.currentData).length > 1) {
          this.assignmentValue(this.currentData);
        }
      }
    },
    initData () {
      const query = this.$route.query;
      if (query.activeNumber) {
        const parames = this.common['fastScreen'];
        this.treeExpandAll = true;
        this.sping = true;
        this.nodeClick({
          ...parames,
          type: 'device',
          id: parames.serialNumber
        });
        this.filterText = parames.ledDeviceName;
        setTimeout(() => {
          this.searchTree();
          this.$refs.tree.setCheckedKeys([query.activeNumber]);
        }, 500);
      } else {
        this.sping = true;
      }
    },
    clearnData () {
      this.sping = true;
      this.filterText = '';
      this.monitorId = '';
      this.currentNodeKey = '';
      setTimeout(() => {
        this.searchTree();
        this.$refs.tree.setCheckedKeys([]);
      }, 500);
    },
    searchTree (filterText) {
      this.$refs.tree && this.$refs.tree.filter({val: filterText, type: 'label'});
    },
    filterNode (value, data) {
      if (!value.val) return true;
      return data[value.type] && data[value.type].indexOf(value.val) !== -1;
    },
    async loadNode (node, resolve) {
      const activeNumber = this.$route.query.activeNumber;
      if (node.level === 0) {
        const tree0 = await this._getTerminalTree({
          'address': '',
          'area': '',
          'city': '',
          'imei': ''
        }, 'city', 'city', 'city', resolve);
        if (!activeNumber) {
          this.treeExpandKeys = [tree0[0].id];
        }
      }
      if (node.level === 1) {
        const tree1 = await this._getTerminalTree({
          city: node.data.city,
          cityCode: node.data.cityCode
        }, 'area', 'area', 'area', resolve);
        if (!activeNumber) {
          this.treeExpandKeys = [ ...this.treeExpandKeys, tree1[0].id ];
        }
      }
      if (node.level === 2) {
        const tree2 = await this._getTerminalTree({
          city: node.data.city,
          area: node.data.area,
          cityCode: node.data.cityCode,
          areaCode: node.data.areaCode
        }, 'address', 'address', 'address', resolve);
        if (!activeNumber) {
          this.treeExpandKeys = [ ...this.treeExpandKeys, tree2[0].id ];
        }
      }
      if (node.level === 3) {
        const tree3 = await this._getTerminalTree({
          city: node.data.city,
          area: node.data.area,
          cityCode: node.data.cityCode,
          areaCode: node.data.areaCode,
          address: node.data.address
        }, 'imei', 'terminalName', 'imei', resolve);
        if (!activeNumber) {
          this.treeExpandKeys = [ ...this.treeExpandKeys, tree3[0].id ];
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
          deviceTypeNo: 'LED'
        }).then(res => {
          if (res.code === '200') {
            const treeData = res.data.map(daItem => {
              return {
                id: daItem['serialNumber'],
                label: daItem['deviceModuleName'],
                type: 'device',
                city: node.data.city,
                area: node.data.area,
                address: node.data.address,
                imei: node.data.imei,
                ...daItem,
                leaf: true
              }
            });
            resolve(treeData);
            if (!activeNumber) {
              this.treeExpandKeys = [ ...this.treeExpandKeys, treeData[0].id ];
              this.$refs.tree.setCheckedKeys([treeData[0].id]);
              this.nodeClick({
                ...treeData[0],
                type: 'device',
                id: treeData[0].serialNumber
              });
            }
          }
        })
      }
      if (node.level === 5) {
        resolve([])
      }
    },
    nodeClick (data) {
      if (data.type === 'device') {
        this.clearnInfo();
        this.deviceInfo = {
          name: data.label || data.ledDeviceName,
          address: data.address,
          area: data.area,
          city: data.city,
          imei: data.imei,
          serialNumber: data.serialNumber
        };
      }
      this.monitorId = data.type;
      this.currentNodeKey = data.id;
      this._selectLedSetting(data.imei);
    },
    clearnInfo () {
      this.activetDeviceTabsName = '1';
      this.programInfo = {
        ...this.programInfo,
        policyType: [{
          id: 1,
          name: '全屏'
        }, {
          id: 2,
          name: '四宫格'
        }],
        programName: undefined,
        rectType: 1,
        programTemplate: 0,
        videoList: [],
        fullScreen: {},
        screen1: {},
        screen2: {},
        screen3: {},
        screen4: {},
        programCode: ''
      }
    },
    _selectLedSetting (imei) {
      selectLedSetting(imei).then(res => {
        if (res.code === '200') {
          this.switchInfo.form = {
            ...res.data,
            power: res.data.power !== 0
          }
        }
      });
      selectRunningLedProgram(imei).then(res => {
        if (res.code === '200') {
          this.assignmentValue(res.data);
        }
      });
    },
    assignmentValue (item) {
      const rectType = item && item.ledRects && item.ledRects[0] && item.ledRects[0].rectType;
      const videoList = item && item.ledMusics.length > 0 && item.ledMusics.map((musics, index) => {
        return {
          name: index,
          uid: musics.musicId,
          url: `${baseURL || config.baseURL.dev}/upload${musics.source}`,
          musicId: musics.musicId,
          fileCode: musics.musicCode,
          programCode: musics.programCode,
          path: musics.source
        }
      });
      this.programInfo = {
        ...this.programInfo,
        ...item,
        programName: item.programName,
        rectType,
        videoList
      };
      if (rectType === 1) {
        this.programInfo.fullScreen = item.ledRects && item.ledRects[0];
      } else {
        this.programInfo.screen1 = item.ledRects && item.ledRects[0];
        this.programInfo.screen2 = item.ledRects && item.ledRects[1];
        this.programInfo.screen3 = item.ledRects && item.ledRects[2];
        this.programInfo.screen4 = item.ledRects && item.ledRects[3];
      }
    },
    async _getTerminalTree (data, id, label, type, resolve) {
      let treeData = [];
      await getTerminalTree({
        ...data,
        deviceTypeNo: 'LED'
      }).then(res => {
        if (res.code === '200') {
          treeData = res.data.map(daItem => {
            return {
              id: daItem[id],
              label: daItem[label],
              type: type,
              ...data,
              ...daItem,
              children: null
            }
          });
          resolve(treeData)
        }
      });
      return treeData;
    },
    async tressSelectSelect (val, instanceId) {
      if (val.now === 'device') {
        this.deviceInfo = {
          name: val.label,
          address: val.address,
          area: val.area,
          city: val.city,
          imei: val.imei,
          serialNumber: val.serialNumber
        };
      }
      this.monitorId = val.now;
    },
    _getTypeDel (data) {
      const type = data.onlineStatus === 1 ? data.alarmStatusText : data.onlineStatusText;
    },
    handleDeviceTabClick (e) {
      if (e.name === '2') {
      }
    },
    changeResType (index) {
      this.resource.map((item, i) => {
        item.class = '';
        if (index === i) {
          item.class = 'active';
          this.resourceType = item.type;
        }
      });
    },
    changeUploadFile (list) {
      const removeObj = (list && list.length > 0) && this.programInfo.videoList.filter(obj => !list.some(obj1 => obj1.uid === obj.uid));
      if (removeObj && removeObj[0] && removeObj[0].fileCode) {
        // deleteByFileCode(removeObj[0].fileCode).then(res => {
        //   if (res.code === '200') {
        //     this.$notify({
        //       title: '成功',
        //       message: '删除成功',
        //       type: 'success',
        //       position: 'bottom-right'
        //     });
        //     this.programInfo.videoList = list;
        //   }
        // })
        this.programInfo.videoList = list;
      } else {
        this.programInfo.videoList = list;
      }
    },
    handleScreenActiveClick (tab) {
      this.screenActiveName = tab.name;
    },
    async saveSwitchInfo () {
      const switchValues = await this.$refs.switchFormItem.getValue();
      const parames = {
        ...this.deviceInfo,
        ...switchValues,
        power: switchValues.power ? 1 : 0
      };
      // settingLed(this.deviceInfo.serialNumber, {
      //   brightness: parames.brightness,
      //   power: parames.power,
      //   volume: parames.volume,
      //   resolution: parames.resolution,
      //   software: '1.0'
      // }).then(res => {

      // });
      updateLedIotPark(parames).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success',
            position: 'bottom-right'
          });
        }
      });
    },
    async handleSave () {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          let apiMethod = addLedIotPark;
          const ledMusicAddCommands = [];
          this.programInfo.videoList && this.programInfo.videoList.map(videoFile => {
            ledMusicAddCommands.push({
              remark: videoFile.name,
              source: videoFile.path
            });
          });
          let ledRectAddCommands = [];
          const rectType = this.programInfo.rectType;
          if (rectType === 1) {
            const fullFiles = await this.$refs.fullScreen.getFileLists();
            ledRectAddCommands = [{
              rectType,
              ledMediaAddCommands: fullFiles
            }];
          } else {
            const screen1Files = await this.$refs.screen1.getFileLists();
            const screen2Files = await this.$refs.screen2.getFileLists();
            const screen3Files = await this.$refs.screen3.getFileLists();
            const screen4Files = await this.$refs.screen4.getFileLists();
            const hideOptions = {
              hight: 10,
              left: 10,
              top: 10,
              width: 10
            };
            ledRectAddCommands = [{
              ...hideOptions,
              rectType,
              ledMediaAddCommands: screen1Files
            }, {
              ...hideOptions,
              rectType,
              ledMediaAddCommands: screen2Files
            }, {
              ...hideOptions,
              rectType,
              ledMediaAddCommands: screen3Files
            }, {
              ...hideOptions,
              rectType,
              ledMediaAddCommands: screen4Files
            }]
          }
          let parames = {
            ...this.deviceInfo,
            ledMusicAddCommands,
            ledRectAddCommands,
            programName: this.programInfo.programName,
            programTemplate: this.programInfo.programTemplate
          };
          if (this.programInfo.programCode) {
            apiMethod = updateProgramCode;
          }else {

          }
          console.log(this.programInfo.programCode, 'this.programInfo.programCode')
          console.log(apiMethod, 'apiMethod')
          console.log(parames, 'parames')
          apiMethod(parames, this.programInfo.programCode).then(res => {
            if (res.code === '200') {
              this.$notify({
                title: '成功',
                message: '保存成功',
                type: 'success',
                position: 'bottom-right'
              });
              this.$emit('submit', 'cancel')
            }
          });
        } else {
          this.$notify.error({
            title: '失败',
            message: '请填写完整必填数据!!!',
            position: 'bottom-right'
          });
          return false;
        }
      });
    },
    handleCancel () {
      if (this.type !== 'template') {

      }
      this.$emit('cancel', 'close');
    },
    async showPreview () {
      const rectType = this.programInfo.rectType;
      if (rectType === 1) {
        const fullFiles = await this.$refs.fullScreen.getFileLists();
        const effextArray = await this.getEffext(fullFiles);
        this.effextArray = effextArray;
      } else {
        // const screen1Files = await this.$refs.screen1.getFileLists();
        // const screen2Files = await this.$refs.screen2.getFileLists();
        // const screen3Files = await this.$refs.screen3.getFileLists();
        // const screen4Files = await this.$refs.screen4.getFileLists();
        // const effextArray = await this.getEffext(dtos[0].ledRects[0].ledMedias)
        // this.effextArray = effextArray;
      };
      this.previewDialog.show = true;
    },
    previewDialogCancel () {
      this.previewDialog.show = false;
      this.effextArray = [];
    },
    getEffext (items) {
      return items.map(medias => {
        const { types } = this.$_useTypes(COMMON_TEMPLATE_SERVICE_TYPE);
        return {
          ...medias,
          Type: types[medias.mediaType],
          Src: medias.source
        }
      });
    }
  }
};
</script>
<style lang="less">
.previewDialog{
  .el-dialog__body{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #wrpaBox{
    display: flex;
    width: 240px;/*no*/
    height: 160px;/*no*/
  }
}
#fastScreen{
  display: flex;
  flex-direction: row;
  .accessSelect{
    flex: 2;
    height: 100%;
    padding-right: 10px;/*no*/
    .info{
      height: 100%;
      background: #fff;
      .infoInput{
        padding: 15px 10px;/*no*/
        border-bottom: 1px solid rgba(238,238,238,1);/*no*/
        input{
          background:rgba(255,255,255,1);
          border-radius:5px;/*no*/
          border:1px solid rgba(165,186,250,1);/*no*/
          line-height: 30px !important;/*no*/
        }
        >.el-select{
          display: flex;
          flex: 1;
          margin-right: 10px;/*no*/
        }
        >.el-input{
          display: flex;
          flex: 2;
        }
        .el-input__suffix{
          display: flex;
          align-items: center;
          padding-left:8px;/*no*/
          cursor: pointer;
          &::after{
            position: relative;
            content: '';
            width: 1px;/*no*/
            height: 17px;/*no*/
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            background: #D0D0D0;
          }
          i{
            font-size: 16px;/*no*/
            color: #4A80F5;
          }
        }
      }
      .infoTree{
        height: calc(100% - 61px);/*no*/
        padding-bottom: 20px;/*no*/
        .el-tree{
          height: 100%;
          overflow: auto;
          .el-tree-node__children{
            .is-expanded{
              .area{
                color: #2573F2 !important;
                font-weight: 600 !important;
                .building, .floor {
                  color: #2573F2 !important;
                }
              }
              .is-expanded{
                .building {
                  color: #2573F2 !important;
                  font-weight: 600 !important;
                }
                .is-expanded{
                  .floor {
                    color: #2573F2 !important;
                  }
                  .is-checked{
                    .device{
                      color: #2573F2 !important;
                    }
                  }
                }
              }
            }
          }
          .custom-tree-node{
            .treeLabel{
              position: relative;
              &.park{
                font-size: 14px;/*no*/
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #3F3F3F;
              }
              &.area{
                font-size: 14px;/*no*/
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 400;
                color: #3F3F3F;
              }
              &.building, &.floor {
                font-size: 12px;/*no*/
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #3F3F3F;
              }
              &.device{
                padding-left: 15px;/*no*/
                font-size: 12px;/*no*/
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                &::before{
                  content: '';
                  width: 5px;/*no*/
                  height: 5px;/*no*/
                  border-radius: 100%;
                  background: linear-gradient(136deg, #35BA70 0%, #2EB67C 100%);
                  position: absolute;
                  top: 50%;
                  left: 5px;/*no*/
                  transform: translateY(-50%);
                }
                &.device11{
                  &::before{
                    background: #FF3C30;
                  }
                }
                &.device10{
                }
                &.device20{
                  &::before{
                    background: #FFA330;
                  }
                }
                &.device30{
                  &::before{
                    background: #8D8D8D;
                  }
                }
              }
            }
          }
        }
        .labers{
          padding: 0px 10px;/*no*/
        }
      }
    }
  }
  .timeMonitoringSelect{
    flex: 8;
    overflow-y: auto;
    // padding: 20px;/*no*/
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
    .deviceContainer{
      height: 100%;
      .deviceName{
        padding: 20px;/*no*/
        background: #fff;
        justify-content: space-between;
        .name{
          font-size: 16px;/*no*/
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #393939;
          display: flex;
          align-items: center;
          .specification{
            margin-left: 8px;/*no*/
            padding: 4px 8px;/*no*/
            background: linear-gradient(135deg, #27C2FF 0%, #00A6E7 100%);
            font-size: 12px;/*no*/
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #FFFFFF;
          }
        }
        .previewBtn{
          display: flex;
          padding: 7px 20px;/*no*/
          background: #265ACA;
          font-size: 12px;/*no*/
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #FFFFFF;
          width: fit-content;
          cursor: pointer;
        }
      }
      .el-tabs{
        .switchContent{
          height: 100%;
          background: #fff;
          padding: 10px;/*no*/
          .saveBtn{
            display: flex;
            justify-content: center;
            .btn{
              display: flex;
              padding: 7px 8px;/*no*/
              background: #265ACA;
              font-size: 12px;/*no*/
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #FFFFFF;
              width: fit-content;
              cursor: pointer;
            }
          }
        }
        .programContent{
          .admin1Card {
            .programDetail{
              .title{
                font-size: 14px;/*no*/
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #3E3E3E;
                padding: 6px 0;
                border-bottom: 1px solid #D5D5D5;
              }
              .content{
                padding: 10px 0;/*no*/
              }
            }
          }
          .saveBtnList{
         height: 70px;
              margin-top: 10px;/*no*/
              justify-content: center !important;
              align-items: center !important;
              button{
                padding: 8px 25px;/*no*/
                // background:rgba(21,27,46,1);
                border-radius:4px;/*no*/
                border:1px solid #ddd;
                color: #888;
                font-size:12px;/*no*/
                font-family:PingFangSC-Regular,PingFang SC;
                font-weight:400;
                background: #FFFFFF;
                border-radius: 1px;/*no*/
                border: 1px solid #2573F1;/*no*/
                font-size: 14px;/*no*/
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #2573F1;
                &.el-button--primary{
                    background:#2573F1;
                    color:rgba(230,236,255,1);
                  box-shadow: 0px 2px 4px 0px #CDCDCD;/*no*/
                }
            }
          }
        }
      }
    }
    .backgroundContainer{
      .scrollView__nav-wrap{
        .scrollView__nav{
          width: 100%;
        }
        .scrollView__nav-prev, .scrollView__nav-next{
          color: #ccc;
          font-size: 20px;/*no*/
        }
      }
      .resource_list {
        margin-bottom: 10px;/*no*/
        div {
          padding: 4px 18px;
          background: #232e53;
          border-radius: 2px;
          color: #fff;
          margin-right: 10px;
          display: inline-block;
          vertical-align: middle;
          cursor: pointer;
        }
      }
      .imgFileList, .videoFileList, .textFileList{
        >div:first-child{
          margin-bottom: 20px;/*no*/
        }
        ul.el-upload-list{
          li{
            margin-right: 10px;/*no*/
          }
        }
        .el-radio-group{
          .el-radio{
            margin-right: 10px;/*no*/
            .el-radio__label{
              padding-left: 4px;/*no*/
            }
          }
        }
      }
      .el-upload-list{
        .el-upload-list__item{
          width: auto;
          height: auto;
        }
        .el-upload-list__item-thumbnail{
          width: 182px;
          height: 152px;
        }
      }
      .el-upload--picture-card{
        background: transparent;
        width: auto;
        // height: auto;
        border-radius: 0;
        border: 2px dashed rgba(44, 52, 58, 1);
      }
      .resource_img {
        width: 265px;/*no*/
        height: 100%;/*no*/
        min-height: 54px;/*no*/
        border: 1px solid;/*no*/
        border-image: linear-gradient(225deg, rgba(217, 234, 255, 1), rgba(187, 212, 255, 1)) 1 1;
        cursor: pointer;
        position: relative;
        .upload_img {
          width: 113px;/*no*/
          height: 28px;/*no*/
          background: linear-gradient(135deg, #E9F3FF 0%, #E6F6FF 100%);
          border: 1px solid rgb(50, 109, 172);/*no*/
          border-radius: 50px;/*no*/
          font-size: 12px;/*no*/
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #2A60CD;
          cursor: pointer;
          position: relative;
          padding-right:10px;/*no*/
          line-height: 1;
          .el-icon-top {
            position: absolute;
            right: 19px;/*no*/
            top: 50%;
            transform: translateY(-50%);
            font-size: 14px;/*no*/
            color: #2A60CD;
            font-weight: bold;
          }
        }
      }
      .resource_video, .resource_text {
        width: 182px;/*no*/
        height: 152px;/*no*/
        background: rgba(15, 20, 41, 1);
        border-radius: 5px;/*no*/
        border: 2px dashed rgba(44, 52, 58, 1);/*no*/
        // margin-bottom: 10px;
        cursor: pointer;
        .upload_video {
          margin: 0 auto;
          // margin-top: 72px;
          // margin-bottom: 15px;
          padding:0 40px;/*no*/
          height: 30px;/*no*/
          line-height: 30px;/*no*/
          text-align: center;
          background: rgba(72, 128, 255, 1);
          box-shadow: 0px 4px 7px 0px rgba(72, 128, 255, 0.5);/*no*/
          border-radius: 19px;/*no*/
          color: #fff;
          position: relative;
          .el-icon-top, .el-icon-plus {
            position: absolute;
            right: 2px;/*no*/
            top: 50%;
            transform: translateY(-50%);
            width: 26px;/*no*/
            height: 26px;/*no*/
            line-height: 26px;/*no*/
            border-radius: 50%;
            font-size: 10px;/*no*/
            background: rgba(56, 107, 225, 1);
            color: #fff;
          }
        }
        .el-textarea, textarea{
          width: 100%;
          height: 100%;
        }
      }
    }
    .deviceContainer {
      >.el-tabs{
        height: 100%;
        margin-top: 10px;/*no*/
        >.el-tabs__header{
          border-color: #D5D5D5;
          margin-bottom: 10px;/*no*/
          .el-tabs__nav-next, .el-tabs__nav-prev {
            z-index: 1;
          }
          .el-tabs__nav{
            .el-tabs__item{
              background:rgba(255,255,255,1);
              font-size:14px;/*no*/
              font-family:PingFangSC-Regular,PingFang SC;
              font-weight:400;
              color:rgba(69,69,69,1);
              i{
                font-size: 15px;/*no*/
                color: #A6A6A6;
              }
              &.is-active{
                background:rgba(38,90,202,1);
                color:rgba(255,255,255,1);
                border-bottom: none;
                i{
                  color: #fff;
                }
              }
            }
          }
        }
        >.el-tabs__content{
          height: calc(100% - 51px);/*no*/
          // padding: 10px;/*no*/
          // background: #fff;
          position: relative;
          overflow:visible;
          >div.el-tab-pane{
            height: 100%;
          }
        }
      }
    }
    #formItemText{
      .el-form-item{
        .el-form-item__content{
          color:rgba(73,73,73,1);
        }
      }
    }
  }
  &.template{
    .accessSelect{

    }
    .timeMonitoringSelect{

    }
  }
}

</style>

