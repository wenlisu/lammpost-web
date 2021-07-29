/* eslint-disable camelcase */
<template>
  <pageMain idName='lightPoleDetail' :breadShow="false">
    <el-form
      ref="formData"
      id="formItem"
      :model="form"
      :label-width="'65px'"
    >
    <card title="" class="realTimeInfo">
      <div class="controlBtn" slot:titleOther>
        <el-button type="primary" @click.prevent.stop="getQrCode">二维码</el-button>
      </div>
      <div class="flexCenter timeInfo">
        <div class="timeContainer">
          <div class="imgContent">
            <img class="lampPost" src="./images/img1.png"/>
            <img class="lampLight" src="./images/img4.png" v-if="form.lampStatus" />
          </div>
          <div class="flexRow itemContent">
            <div
              class="itemMain"
              v-for="(item, index) in form.terminalDeviceModuleDtos"
              :key="index"
            >
              <div
                class="item"
              >
                <div
                  class="charge_car_title"
                  @click="item.infoItems.title !== clickFlage && jumpToPublishPoleMap(item)"
                >{{item.infoItems.title}}</div>
                <!-- <div class="linkBtn" v-if="true">联动显示</div> -->
                <div class="charge_car_val">
                  <FormItemText
                    :layout="[
                      {
                        id: 'status',
                        label: '设备状态',
                        custom: true,
                        hide: (item.onlineStatus && (item.deviceTypeNo === 'LED' || item.deviceTypeNo === 'AIRING')),
                        span: item.infoItems.title == '智慧传感' ? 12 : 24,
                        style: {marginBottom: '0.15rem'},
                        class: 'noBottom'
                      },
                      ...item.infoItems.formItem,
                      {
                        id: 'status',
                        label: '设备状态',
                        custom: true,
                        hide: !(item.onlineStatus && (item.deviceTypeNo === 'LED' || item.deviceTypeNo === 'AIRING')),
                        span: 24,
                        style: {marginBottom: '0.15rem'},
                        class: 'noBottom'
                      },
                      {
                        id: 'batteryUseTime',
                        label: '告警类型',
                        value: `${item.alarmContent}`,
                        hide: !item.alarmContent,
                        unit: '',
                        span: 24
                      }, {
                        id: 'batteryUseTime',
                        label: '故障时间',
                        value: `${item.alarmTime}`,
                        hide: !item.alarmTime,
                        unit: '',
                        span: 24
                      }
                    ]"
                    labelWidth="0px"
                  >
                    <template v-slot:status>
                      <!-- <el-radio-group disabled v-model="item.onlineStatus">
                        <el-radio :label="1">正常</el-radio>
                        <el-radio class="fault" :label="2">异常</el-radio>
                      </el-radio-group> -->
                      {{statusType[item.onlineStatus]}}
                    </template>
                    <template v-slot:lampPower>
                      <el-switch
                        v-model="lightItems[0] && lightItems[0].value === 1"
                        active-color="#2870FF"
                        inactive-color="#EEE"
                        :active-text="lightItems[0] && lightItems[0].value === 1 ? '开' : ''"
                        :inactive-text="lightItems[0] && lightItems[0].value === 1 ? '' : '关'"
                        @change="powerChange(lightItems[0].value)"
                        >
                      </el-switch>
                    </template>
                    <template v-slot:brightness>
                      <el-slider
                        v-model="lightItems[1] && lightItems[1].value"
                        @change="val => brightnessChange(val)"
                      >
                      </el-slider>
                      {{lightItems[1].value}}
                    </template>
                    <template v-slot:operationStatus>
                      {{form.operationStatus === 1 ? '开启' : '关闭'}}
                      <!-- <el-radio-group v-model="form.onlineStatus" disabled class="radioGroup">
                        <el-radio :label="1">开启</el-radio>
                        <el-radio :label="2">关闭</el-radio>
                        <el-radio :label="3">故障</el-radio>
                      </el-radio-group> -->
                    </template>
                    <template v-slot:serviceAddress>
                      <el-image
                        :src="watchImg"
                        fit="'fill'"
                        @click="handleServiceAddress"
                        ></el-image>
                    </template>
                    <template v-slot:batteryStatus>
                    <el-radio-group v-model="form.batteryStatus" class="radioGroup" disabled>
                      <el-radio :label="1">充电中</el-radio>
                      <el-radio :label="2">空闲中</el-radio>
                    </el-radio-group>
                    </template>
                    <template v-slot:batteryChargeValue>
                      <span style="color: #02FF2C">{{form.batteryChargeValue}}%</span>
                    </template>
                    <template v-slot:airQualityText>
                      <span style="color: #02FF2C">{{senseItems[6] && senseItems[6].value}}</span>
                    </template>
                    <template v-slot:airingAudio>
                      <div class="audioContent flexCloumn flexCenter" >
                        <div class="flexCenter editIcon" @click.prevent.stop="editBroadcast">
                          <i class="el-icon-edit"></i>
                        </div>
                        <!-- <i class="iconfont icon-zhihuiguangbo" :style="{fontSize: '40px', color: '#07ECE9', cursor: 'pointer'}"  @click="handlePlayVoice"></i> -->
                        <!-- <audio
                          ref="audio"
                          loop="loop"
                          controls
                          :src="`${pro}/upload${form.broadcastPolicyDto.filePath}`"
                          v-if="form.broadcastPolicyDto && form.broadcastPolicyDto.filePath"
                        ></audio> -->
                        <scrollView v-if="form.audioPlayTaskDto">
                          <div class="detailContent">
                            <div
                              v-for="audioFile in form.audioPlayTaskDto.audioMediaList"
                              :key="audioFile.fileCode"
                              class="audioItemContent"
                            >
                              <audioContainer
                                :file="{
                                  url:  `${pro}/upload${audioFile.fileUrl}`,
                                  name: audioFile.fileName,
                                  code: audioFile.fileCode
                                }"
                                :deleteShow="false"
                              />
                            </div>
                          </div>
                        </scrollView>
                        <!-- <audioContainer
                          :file="{
                            url: `${pro}/upload${form.broadcastPolicyDto.filePath}`,
                            name: form.broadcastPolicyDto.fileName,
                            code: form.broadcastPolicyDto.fileCode
                          }"
                          v-if="form.broadcastPolicyDto && form.broadcastPolicyDto.filePath"
                          :deleteShow="false"
                        /> -->
                      </div>
                    </template>
                    <template v-slot:linkBtn>
                      <div class="flexCloumn flexCenter">
                        <div class="linkButton" @click="linkToLed(item)">
                          <i>联动显示</i>
                        </div>
                      </div>
                    </template>
                    <template v-slot:ledItems>
                      <div class="flexCloumn flexCenter">
                        <!-- <i class="iconfont icon-zhihuifabuled" :style="{fontSize: '40px', color: '#07ECE9'}"></i> -->
                          <div class="flexCenter editIcon" @click.prevent.stop="editLed">
                            <i class="el-icon-edit"></i>
                          </div>
                        <div class="ledContent" v-if="form.ledProgramInfoDto">
                          <Effect :index-data="effextArray" v-if="!isLinkToLED" />
                          <FormItemText :layout=tempLED v-if="isLinkToLED">
                            <template v-slot:airQualityText>
                              <span style="color: #02FF2C">{{tempLED[5].value}}</span>
                            </template>
                          </FormItemText>
                        </div>
                      </div>
                    </template>
                    <!-- <template v-slot:ledPower>
                      <div class="ledContentItem">
                        <el-switch
                          @change="powerChange(form.ledProgramInfoDto, index)"
                        ></el-switch>
                      </div>
                    </template>
                    <template v-slot:ledBrightness>
                      <div class="ledContentItem">
                        <el-slider
                          @change="val => brightnessChange(val, index)"
                        >
                        </el-slider>
                      </div>
                    </template> -->
                    <template v-slot:pic>
                      <el-image
                        :src="watchImg"
                        @click="handleWarnAddress"
                      >
                      </el-image>
                    </template>
                    <template v-slot:smokePic>
                      <el-image
                        :src="watchImg"
                        @click="handleSmokeVideo"
                      >
                      </el-image>
                    </template>
                  </FormItemText>
                  <!-- <FormItemText
                    :layout="[{
                      id: 'status',
                      label: '设备状态',
                      custom: true,
                      span: 24,
                      class: 'noBottom'
                    }, {
                      id: 'batteryUseTime',
                      label: '告警类型',
                      value: `${form.terminalWarnDeviceModules.find(device => device.deviceType === item.deviceTypeNo).alarmContent}`,
                      unit: '',
                      span: 24
                    }, {
                      id: 'batteryUseTime',
                      label: '故障时间',
                      value: `${form.terminalWarnDeviceModules.find(device => device.deviceType === item.deviceTypeNo).alarmTime}`,
                      unit: '',
                      span: 24
                    }]"
                    labelWidth="0px"
                    v-if="false"
                  >
                    <template v-slot:status>
                      <el-radio-group disabled v-model="form.terminalWarnDeviceModules.find(device => device.deviceType === item.deviceTypeNo).onlineStatus">
                        <el-radio :label="1">正常</el-radio>
                        <el-radio class="fault" :label="2">故障</el-radio>
                      </el-radio-group>
                    </template>
                  </FormItemText> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </card>
    </el-form>
    <dialog-cont
      @on-cancel="fixLedCancel"
      @on-confirm="fixLedSubmit"
      :visible.sync="fixLed.show"
      width="80%"
      :title="fixLed.title"
      append-to-body
      :customClass="'fixLedDialog'"
    >
      <LEDDetail
      ref="ledDetail"
      type="template"
      :programCode="fixLed.programCode"
      @updateData="refreshDetail"
      @cancel="fixLedCancel"/>
    </dialog-cont>
    <dialog-cont
      @on-cancel="fixBroadcastCancel"
      @on-confirm="fixBroadcastSubmit"
      :visible.sync="fixBroadcast.show"
      width="80%"
      :title="fixBroadcast.title"
      append-to-body
      :customClass="'fixBroadcastDialog'"
    >
      <BroadcastDetail
        ref="broadcastDetail"
        type="template"
        :buttonShow="false"
        :currentData="{
          serialNumber: fixBroadcast.serialNumber,
          streetCode: fixBroadcast.streetCode
        }"
        @submit="fixBroadcastCancel"
      />
    </dialog-cont>
    <!-- 智慧报警视频弹窗 -->
    <dialog-cont
      :visible.sync="smokeDialogVisible"
      width="80%"
      :title="smokeDialogTitle"
      append-to-body
      :bottomShow="false"
      class="smokeDialogStyle"
      :customClass="'videoDialog'"
    >
      <div class="flexCenter video">
        <videoAddress />
      </div>
    </dialog-cont>
    <!-- 智慧监控视频弹窗 -->
    <dialog-cont
      :visible.sync="dialogVisible"
      width="80%"
      :title="dialogTitle"
      append-to-body
      :bottomShow="false"
      :customClass="'videoDialog'"
    >
    <div class="flexCenter video">
      <iframe
        :src="this.serviceAddress"
        :style="{width: '100%', height: '100%'}"
        frameborder="0"
        allowfullscreen
        allow="autoplay"
        scrolling="no"
        id="serviceAddress"
      ></iframe>
      <el-drawer
        title="我是标题"
        :with-header="false"
        :visible.sync="drawer.show"
        :direction="drawer.direction"
        :before-close="handleCloseDrawer"
        :modal-append-to-body="false"
      >
        <div class="flexCloumn btnList">
          <div
            class="submitBtn"
            size="small"
            v-for="item in drawer.btnItems"
            :key="item.id"
            @mousedown="item.mousedown"
            @mouseup="item.mouseup"
          >
            <!-- <i class="iconfont icon-chaxun"></i> -->
            {{item.name}}
          </div>
        </div>
      </el-drawer>
      <div class="kongzhi-icon" @click="handleMore"><i class="iconfont icon-shexiangtoukongzhi-copy" /></div>
      <div class="flexRow videoInfo">
        <div class="flexCenter icon"><i class="iconfont icon-dengganditu" /></div>
        <div class="flexCloumn title">
            <span>{{drawer.alarmItem.address}}</span>
            <span>{{time}}</span>
        </div>
        <!-- <div class="flexCenter playBack" @click="playBack(drawer.alarmItem)">
            <i class="iconfont iconshipinhuifang" />
            视频回放
        </div>
        <div class="flexCenter playBack more" @click="handleMore">
            <i class="iconfont iconshipinhuifang" />
            更多
        </div> -->
      </div>
    </div>
  </dialog-cont>
  <el-dialog
      title="视频回放"
      :visible.sync="dialog.show"
      width="750px"
      center
      @close="dialogClose"
      custom-class='videoPlayBack'
      >
        <videoPlayBack :cameraId="dialog.cameraId" :src="dialog.src"/>
    </el-dialog>

    <el-dialog
      title="二维码"
      :visible.sync="qr.show"
      width="750px"
      center
      @close="qrClose"
      class="qrDialog"
      custom-class='videoPlayBack'
      >
      <div class="qr-box">
        <div>
          <img :src="qr.src" />
          <!-- <el-image :src="qr.src"></el-image> -->
        </div>
      </div>
    </el-dialog>
  </pageMain>
</template>

<script>
import {
  mapGetters
} from 'vuex';
import Vue from 'vue';
import moment from 'moment';
import EZUIKit from 'ezuikit-js';
import pageMain from 'components/pageMain';
import scrollView from '@/components/sideMenu/scrollView';
import FormItemText from '@/components/formItemText/formItemText';
import dialogCont from '@/components/dialog';
import formItem from '@/components/formItem/base';
import audioContainer from '@/components/upload/audio';
import card from 'view/lightPole/lightPoleStatistical/components/card';
import Effect from '@/view/index/publishPoleMap/components/effect';
import LEDDetail from '@/view/adminScreen/screenManagement/timedScreen/index';
import BroadcastDetail from '@/view/adminBroadcast/broadcastManagement/timeMonitoring';
import videoPlayBack from '@/view/smokeDetector/smokeManage/videoPlayback';
import videoAddress from '@/view/smokeDetector/smokeDetectorMap/components/videoAddress'
import watchImg from '@/view/lightPole/lightPoleDetail/images/img2.png';
import { routePush, postData } from '@/util/util';
import { COMMON_TEMPLATE_SERVICE_TYPE } from '@/util/constants';
import config, { baseURL } from '@/config';
import {
  selectTemplate,
  getQrCode
} from 'api/controlStrategy';
import {
  terminalDetail,
  terminalDetailWarn,
  setDeviceCommand
} from 'api/lightPole';
export default {
  name: 'lightPoleDetail',
  data () {
    return {
      qr: {
        src: '',
        show: false
      },
      smokeDialogVisible: false,
      smokeDialogTitle: '最新烟感监控画面',
      tempLED: [],
      isLinkToLED: false,
      clickFlage: '智慧照明',
      pro: baseURL || config.baseURL.dev,
      watchImg,
      statusType: {
        1: '在线',
        2: '离线',
        3: '离线'
      },
      baseItems: [{
        id: 'terminalName',
        label: '灯杆名称',
        value: undefined,
        unit: '',
        span: 8
      }, {
        id: 'id',
        label: '设备序号',
        value: undefined,
        unit: '',
        span: 8
      }, {
        id: 'street',
        label: '所属道路',
        value: undefined,
        unit: '',
        span: 8
      }, {
        id: 'imei',
        label: 'IMEI号',
        value: undefined,
        unit: '',
        span: 8
      }, {
        id: 'version',
        label: '硬件版本号',
        value: undefined,
        unit: '',
        span: 16
      }, {
        id: 'deviceTypeNo',
        label: '设备型号',
        value: undefined,
        unit: '',
        span: 8
      }, {
        id: 'deviceTypeName',
        label: '设备类型',
        value: undefined,
        unit: '',
        span: 8
      }, {
        id: 'manufacturerName',
        label: '厂商名称',
        value: undefined,
        unit: '',
        span: 8
      }, {
        id: 'longitude',
        label: '经度',
        value: undefined,
        unit: '',
        span: 8
      }, {
        id: 'latitude',
        label: '纬度',
        value: undefined,
        unit: '',
        span: 8
      }, {
        id: 'current',
        label: '电流：',
        value: undefined,
        unit: 'A',
        span: 8
      }, {
        id: 'voltage',
        label: '电压：',
        value: undefined,
        unit: 'V',
        span: 8
      }, {
        id: 'usingPower',
        label: '耗电量：',
        value: undefined,
        unit: '度',
        span: 8
      }, {
        id: 'usingPower',
        label: '节能用电：',
        value: undefined,
        unit: '度',
        span: 8
      }, {
        id: 'applyTime',
        label: '运行时长：',
        value: undefined,
        unit: '',
        span: 8
      }],
      warnItems: [{
        id: 'callCount',
        label: '报警次数：',
        value: undefined,
        hide: true,
        span: 24
      }, {
        id: 'alarmCallStatusText',
        label: '报警状态：',
        value: undefined,
        span: 24
      }, {
        id: 'smokePic',
        label: '报警监控画面：',
        custom: true,
        span: 24
        // class: 'noBottom'
      }, {
        id: 'lastReportTime',
        label: '最新一键报警：',
        value: undefined,
        span: 24
      }],
      senseItems: [
        {
          id: 'temperatureValue',
          label: '温度：',
          value: undefined,
          unit: '℃',
          span: 12
        }, {
          id: 'humidityValue',
          label: '湿度：',
          value: undefined,
          unit: '%',
          span: 12
        }, {
          id: 'pmValue',
          label: 'PM2.5：',
          value: undefined,
          unit: 'ug/m³',
          span: 12
        }, {
          id: 'pmTenValue',
          label: 'PM10：',
          value: undefined,
          unit: 'ug/m³',
          span: 12
        }, {
          id: 'noiseValue',
          label: '噪声：',
          value: undefined,
          unit: 'dB',
          span: 12
        }, {
          id: 'airQualityText',
          label: '空气质量指数：',
          custom: true,
          value: undefined,
          span: 24
        // class: 'noBottom'
        }],
      lightItems: [{
        id: 'lampPower',
        label: '照明状态：',
        value: undefined,
        custom: true,
        span: 24
        // class: 'noBottom'
      }, {
        id: 'brightness',
        label: '照明亮度：',
        value: undefined,
        custom: true,
        span: 24
        // class: 'noBottom'
      }, {
        id: 'serialNumber',
        label: '照明设备号：',
        value: undefined,
        hide: true,
        span: 24
        // class: 'noBottom'
      }, {
        id: 'deviceModuleName',
        label: '照明名称：',
        hide: true,
        value: undefined,
        span: 24
        // class: 'noBottom'
      }],
      videoItems: [{
        id: 'operationStatus',
        label: '摄像头状态：',
        custom: true,
        value: undefined,
        unit: '',
        hide: true,
        span: 24
      }, {
        id: 'pic',
        label: '监控画面：',
        custom: true,
        span: 24
      }
      // {
      //     id: 'serviceAddress',
      //     label: '最新监控画面：',
      //     custom: true,
      //     span: 24
      //   },
      ],
      wifiItems: [{
        id: 'apName',
        label: 'Wi-Fi名称：',
        value: undefined,
        hide: true,
        unit: '',
        span: 24
      }, {
        id: 'wifiStatus',
        label: '连接状态：',
        value: undefined,
        unit: '个',
        span: 24
      }, {
        id: 'wifiConnectionCount',
        label: '连接数：',
        value: undefined,
        unit: '个',
        span: 24,
        class: 'noBottom'
      }, {
        id: 'a',
        label: 'Wi-Fi AP覆盖率：',
        value: undefined,
        unit: '',
        hide: true,
        span: 24
      }],
      rechargeItems: [{
        id: 'a',
        label: '充电桩数：',
        value: undefined,
        unit: '个',
        span: 24,
        hide: true
      }, {
        id: 'a',
        label: '当前充电电枪位',
        value: undefined,
        unit: '个',
        span: 24,
        hide: true
      }, {
        id: 'batteryStatus',
        label: '充电桩状态：',
        custom: true,
        span: 24
      }, {
        id: 'batteryCarNo',
        label: '车牌号：',
        value: undefined,
        unit: '',
        span: 24,
        hide: true
      }, {
        id: 'batteryChargeValue',
        label: '充电量：',
        custom: true,
        span: 24
      }, {
        id: 'batteryUseTime',
        label: '充电时长：',
        value: undefined,
        unit: '分钟',
        span: 24
      }, {
        id: 'batteryIncome',
        label: '收入',
        value: undefined,
        unit: '元',
        span: 24
        // class: 'noBottom'
      }],
      airingItems: [{
        id: 'airingAudio',
        label: '',
        value: undefined,
        custom: true,
        span: 24
      }],
      LedItems: [{
        id: 'ledItems',
        label: '',
        value: undefined,
        custom: true,
        span: 24
      }, {
        id: 'ledPower',
        label: '开关',
        value: undefined,
        custom: true,
        hide: true,
        span: 24
      }, {
        id: 'ledBrightness',
        label: '亮度',
        value: undefined,
        custom: true,
        hide: true,
        span: 24
      }],
      stationItems: [{
        id: 'stationItems',
        label: '',
        custom: true,
        value: undefined,
        span: 24
      }],
      form: {
        switch: '',
        radio: '',
        terminalDeviceModuleDtos: [],
        terminalWarnDeviceModules: []
      },
      formItems: [{
        label: '开启时段：',
        labelWidth: '75px',
        prop: 'onTime',
        inputType: 'timePicker'
      }, {
        label: '关闭时段：',
        labelWidth: '75px',
        prop: 'offTime',
        inputType: 'timePicker'
      }],
      serviceAddress: undefined,
      dialogVisible: false,
      dialogTitle: '最新监控画面',
      word: {
        id: null,
        keyWord: [],
        templateName: ''
      },
      activePolicy: 'light',
      currentTitleList: [{
        name: 'wisdomLightPole',
        title: '灯杆设备状态'
      }, {
        name: 'lightPoleDetail',
        title: '灯杆详情'
      }],
      terminalDeviceModule: {
        'LAMP': {
          title: '智慧照明',
          deviceNo: 'deviceLampDto',
          formItem: 'lightItems'
        },
        'CAMERA': {
          title: '智慧监控',
          deviceNo: 'deviceCameraDataDto',
          formItem: 'videoItems'
        },
        'WIFI': {
          title: '智慧Wi-Fi',
          deviceNo: 'deviceWifiDataDto',
          formItem: 'wifiItems'
        },
        'BATTERY': {
          title: '智慧充电',
          deviceNo: 'deviceBatteryDataDto',
          formItem: 'rechargeItems'
        },
        'AMBIENT': {
          title: '智慧传感',
          deviceNo: 'deviceAmbientDataDto',
          formItem: 'senseItems'
        },
        'SMOKE_DETECTOR': {
          title: '智慧烟感',
          deviceNo: 'deviceAmbientDataDto',
          formItem: 'senseItems'
        },
        'AUDIO': {
          title: '智慧广播',
          deviceNo: 'deviceAiringDataDto',
          formItem: 'airingItems'
        },
        'LED': {
          title: '智慧发布',
          deviceNo: 'deviceLedDataDto',
          formItem: 'LedItems'
        },
        'CALL': {
          title: '智慧报警',
          deviceNo: 'deviceAlarmCallDataDto',
          formItem: 'warnItems'
        },
        'STATION': {
          title: '微基站',
          deviceNo: 'deviceStationDataDto',
          formItem: 'stationItems'
        }
      },
      effextArray: [],
      fixLed: {
        show: false,
        title: '智慧发布详情',
        programCode: undefined
      },
      fixBroadcast: {
        show: false,
        title: '智慧广播详情',
        serialNumber: undefined,
        streetCode: undefined
      },
      fixLamp: {
        serialNumber: undefined
      },
      drawer: {
        show: false,
        direction: 'rtl',
        alarmItem: {
          address: ''
        },
        btnItems: [{
          id: 'a',
          name: '上转',
          mousedown: () => {
            this.handleDeviceContral(0);
          },
          mouseup: () => {
            this.handleDeviceContral(0, 'stop');
          }
        }, {
          id: 'b',
          name: '下转',
          mousedown: () => {
            this.handleDeviceContral(1);
          },
          mouseup: () => {
            this.handleDeviceContral(1, 'stop');
          }
        }, {
          id: 'c',
          name: '左转',
          mousedown: () => {
            this.handleDeviceContral(2);
          },
          mouseup: () => {
            this.handleDeviceContral(2, 'stop');
          }
        }, {
          id: 'd',
          name: '右转',
          mousedown: () => {
            this.handleDeviceContral(3);
          },
          mouseup: () => {
            this.handleDeviceContral(3, 'stop');
          }
        }, {
          id: 'e',
          name: '左上转',
          mousedown: () => {
            this.handleDeviceContral(4);
          },
          mouseup: () => {
            this.handleDeviceContral(4, 'stop');
          }
        }, {
          id: 'f',
          name: '左下转',
          mousedown: () => {
            this.handleDeviceContral(5);
          },
          mouseup: () => {
            this.handleDeviceContral(5, 'stop');
          }
        }, {
          id: 'g',
          name: '放大',
          mousedown: () => {
            this.handleDeviceContral(8);
          },
          mouseup: () => {
            this.handleDeviceContral(8, 'stop');
          }
        }, {
          id: 'h',
          name: '缩小',
          mousedown: () => {
            this.handleDeviceContral(9);
          },
          mouseup: () => {
            this.handleDeviceContral(9, 'stop');
          }
        }, {
          id: 'i',
          name: '近聚焦',
          mousedown: () => {
            this.handleDeviceContral(10);
          },
          mouseup: () => {
            this.handleDeviceContral(10, 'stop');
          }
        }, {
          id: 'j',
          name: '远聚焦',
          mousedown: () => {
            this.handleDeviceContral(11);
          },
          mouseup: () => {
            this.handleDeviceContral(11, 'stop');
          }
        }]
      },
      dialog: {
        show: false,
        src: ''
      },
      changeLampNess: null,
      editData: {
        imei: undefined
      },
      player: null
    }
  },
  mounted () {
    this.$nextTick(() => {
      // this.editData = this.common['lightPoleDetail'];
      this.editData.imei = this.imei
      if (!!this.editData && !!this.editData.imei) {
        // this.getWarnDetail();
        this.getDetail();
      }
      if (this.type === 'template' && !!this.imei) {
        this.editData = {
          imei: this.imei
        };
        this.getDetail();
      }
      this.serviceAddress = `https://open.ys7.com/ezopen/h5/iframe_se?url=ezopen://RPUENL@open.ys7.com/E63112920/1.live&autoplay=0&audio=1&accessToken=${this.common.accessToken}&templete=2`;
      this.player = new EZUIKit.EZUIPlayer('serviceAddress');
      this.player.play();
    });
  },
  props: {
    imei: {
      type: String,
      default: undefined
    },
    type: {
      type: String,
      default: 'default'
    }
  },
  computed: {
    ...mapGetters(['common']),
    time () {
      return this.common.timeDay
    }
  },
  components: {
    card,
    FormItemText,
    formItem,
    pageMain,
    Effect,
    scrollView,
    audioContainer,
    dialogCont,
    LEDDetail,
    BroadcastDetail,
    videoPlayBack,
    videoAddress
  },
  methods: {
    // 跳转到地图页
    jumpToPublishPoleMap (items) {
      let parames = {};
      parames['ledDeviceName'] = this.baseItems[0].value;
      this.baseItems.forEach(item => {
        parames[item.id] = item.value;
      })
      switch (items.infoItems.title) {
        case '智慧发布':
          this.$router.push({
            name: 'publishPoleMap',
            params: {
              ...parames
            }
          })
          break;
        case '智慧传感':
          this.$router.push({
            name: 'superviseMap',
            params: {
              ...parames
            }
          })
          break;
        case '智慧报警':
          this.$router.push({
            name: 'wisdomWarnMap',
            params: {
              ...parames
            }
          })
          break;
        case '智慧广播':
          this.$router.push({
            name: 'wisdomBroadcastMap',
            params: {
              ...parames
            }
          })
      }
    },
    getWarnDetail () {
      if (!this.editData.imei) return;
      terminalDetailWarn(this.editData.imei).then(async res => {
        if (res.code === '200') {
          this.form = {
            ...this.form,
            terminalWarnDeviceModules: res.data
          }
        }
      });
    },
    async getDetail () {
      if (!this.editData.imei) return;
      await terminalDetail(this.editData.imei).then(async res => {
        if (res.code === '200') {
          this.form = {
            ...this.form,
            ...res.data,
            lampStatus: res.data.lampStatus === 1,
            terminalDeviceModuleDtos: res.data.terminalDeviceModuleDtos.map(dto => {
              const infoItems = this.terminalDeviceModule[dto.deviceTypeNo];
              return {
                ...dto,
                infoItems: {
                  ...infoItems,
                  formItem: this[infoItems.formItem]
                }
              }
            })
          };
          const effextArray = res.data.ledProgramInfoDto && res.data.ledProgramInfoDto.ledRects && res.data.ledProgramInfoDto.ledRects[0].ledMedias.map(medias => {
            const { types } = this.$_useTypes(COMMON_TEMPLATE_SERVICE_TYPE);
            return {
              ...medias,
              Type: types[medias.mediaType],
              Src: medias.source
            }
          });
          this.effextArray = effextArray;
          let baseItems = await this.getItemValue(res.data, this.baseItems);
          if (res.data.terminalExtends) {
            await res.data.terminalExtends.map((listItem, index) => {
              baseItems.push({
                id: listItem.fieldNo || '',
                label: listItem.fieldName || '',
                value: listItem.fieldValue || '',
                class: '',
                span: 8
              });
            });
          }
          this.baseItems = baseItems;
          this.baseItems = await this.getItemValue(res.data, this.baseItems);
          this.warnItems = await this.getItemValue(res.data, this.warnItems);
          this.senseItems = await this.getItemValue(res.data, this.senseItems);
          this.rechargeItems = await this.getItemValue(res.data, this.rechargeItems);
          this.videoItems = await this.getItemValue(res.data, this.videoItems);
          this.wifiItems = await this.getItemValue(res.data, this.wifiItems);
          this.form = {
            ...this.form,
            terminalDeviceModuleDtos: res.data.terminalDeviceModuleDtos.map(dto => {
              const infoItems = this.terminalDeviceModule[dto.deviceTypeNo];
              if (dto.deviceTypeNo === 'LED') {
                this.fixLed.programCode = this.form.ledProgramInfoDto.programCode;
              }
              if (dto.deviceTypeNo === 'CAMERA') {
                this.drawer.alarmItem = {
                  address: dto.address,
                  deviceBindCode: dto.serialNumber
                };
              }
              if (dto.deviceTypeNo === 'AUDIO') {
                this.fixBroadcast.serialNumber = dto.serialNumber;
                this.fixBroadcast.streetCode = this.form.streetCode;
              }
              if (dto.deviceTypeNo === 'LAMP') {
                this.fixLamp.serialNumber = dto.serialNumber;
              }
              const deviceNo = infoItems.deviceNo;
              if (dto[deviceNo]) {
                if (dto.deviceTypeNo === 'AMBIENT') {
                  this.senseItems = [
                    {
                      id: 'linkBtn',
                      label: '',
                      value: undefined,
                      custom: true,
                      class: 'noBottom',
                      span: 12
                    },
                    {
                      id: 'temperatureValue',
                      label: '温度：',
                      value: dto[deviceNo].temperatureValue,
                      class: ((dto[deviceNo] && !dto[deviceNo].temperatureAlarm) || (dto[deviceNo] && dto[deviceNo].temperatureAlarm === 0)) ? '' : (dto[deviceNo] && dto[deviceNo].temperatureAlarm === 1 ? 'orange' : 'warn'),
                      unit: '℃',
                      span: 12
                    }, {
                      id: 'humidityValue',
                      label: '湿度：',
                      value: dto[deviceNo].humidityValue,
                      class: ((dto[deviceNo] && !dto[deviceNo].humidityAlarm) || (dto[deviceNo] && dto[deviceNo].humidityAlarm === 0)) ? '' : (dto[deviceNo] && dto[deviceNo].humidityAlarm === 1 ? 'orange' : 'warn'),
                      unit: '%',
                      span: 12
                    }, {
                      id: 'pmValue',
                      label: 'PM2.5：',
                      value: dto[deviceNo].pmValue,
                      class: ((dto[deviceNo] && !dto[deviceNo].pmAlarm) || (dto[deviceNo] && dto[deviceNo].pmAlarm === 0)) ? '' : (dto[deviceNo] && dto[deviceNo].pmAlarm === 1 ? 'orange' : 'warn'),
                      unit: 'ug/m³',
                      span: 12
                    }, {
                      id: 'pmTenValue',
                      label: 'PM10：',
                      value: dto[deviceNo].pmTenValue,
                      class: ((dto[deviceNo] && !dto[deviceNo].pmTenAlarm) || (dto[deviceNo] && dto[deviceNo].pmTenAlarm === 0)) ? '' : (dto[deviceNo] && dto[deviceNo].pmTenAlarm === 1 ? 'orange' : 'warn'),
                      unit: 'ug/m³',
                      span: 12
                    }, {
                      id: 'noiseValue',
                      label: '噪声：',
                      value: dto[deviceNo].noiseValue,
                      class: ((dto[deviceNo] && !dto[deviceNo].noiseAlarm) || (dto[deviceNo] && dto[deviceNo].noiseAlarm === 0)) ? '' : (dto[deviceNo] && dto[deviceNo].noiseAlarm === 1 ? 'orange' : 'warn'),
                      unit: 'dB',
                      span: 24
                    }, {
                      id: 'airQualityText',
                      label: '空气质量指数：',
                      custom: true,
                      value: dto[deviceNo].airQualityText,
                      span: 24
                    // class: 'noBottom'
                    }]
                } else {
                  this[infoItems.formItem] = this.getItemValue({
                    ...dto, ...dto[deviceNo]}, this[infoItems.formItem]);
                }
              }
              return {
                ...dto,
                infoItems: {
                  ...infoItems,
                  formItem: this[infoItems.formItem]
                }
              }
            })
          };
          if (res.data.templateId) {
            selectTemplate({id: res.data.templateId, imei: this.editData.imei}).then(selectRes => {
              if (selectRes.code === '200') {
                this.word = {id: res.data.templateId, ...selectRes.data};
              }
            });
          }
        }
      });
    },
    getItemValue (data, items) {
      return items.map(item => {
        return {
          ...item,
          value: data[item.id] || item.value
        }
      });
    },
    handleSetPolicy () {
      routePush({
        title: '智慧照明详情',
        name: 'illuminationDetail',
        parames: {
          imei: this.form.imei,
          relatedType: null,
          address: this.form.address,
          area: this.form.area,
          terminalName: this.form.terminalName,
          toName: 'lightPoleDetail'
        }
      });
    },
    handleServiceAddress () {
      this.dialogVisible = true;
      // this.serviceAddress = this.form.serviceAddress;
      this.dialogTitle = '最新监控画面';
    },
    handleWarnAddress () {
      this.dialogVisible = true;
      this.serviceAddress = this.form.pic[0].pic1;
      this.dialogTitle = '报警监控画面';
    },
    handleSmokeVideo () {
      this.smokeDialogVisible = true,
      this.smokeDialogTitle = '报警监控画面'
    },
    handleMore () {
      this.drawer.show = true;
    },
    playBack (item) {
      const today = moment().format('YYYYMMDD');
      this.dialog.show = true;
      this.dialog.src = `https://open.ys7.com/ezopen/h5/iframe_se?url=ezopen://RPUENL@open.ys7.com/${item.serialNumber}/at.avol532y60wkdmohbfm4fphn0dms4ia1-9rhtue5jit-0cys088-wsjd2hrmi=${today}&end=${today}`;
    },
    dialogClose () {
      this.dialog.show = false;
      this.dialog.src = undefined;
    },
    qrClose () {
      this.qr.show = false;
    },
    handleCloseDrawer () {
      this.drawer.show = false;
    },
    async handleDeviceContral (direction, type = 'start') {
      const parames = {
        speed: 1,
        direction,
        deviceSerial: this.drawer.alarmItem.deviceBindCode
      };
      const res = await postData(`api/lapp/device/ptz/${type}`, parames);
    },
    handlePlayVoice () {
      this.$refs.audio.play()
    },
    async goLampGroupDetail (item, type) {
      let title = '';
      let name = 'illuminationDetail';
      let parames = {
        toName: 'lightPoleDetail'
      };
      let query = {};
      switch (type) {
        case 'light': // 关闭全部
          parames = {
            ...parames,
            groupNo: item.groupNo,
            imei: item.imei,
            relatedType: item.relatedType,
            address: item.address,
            area: item.area,
            terminalName: item.terminalName
          }
          break;
        case 'led':
          // name = 'wisdomPublishDetail';
          name = 'screenPlayList';
          parames = {
            ...parames,
            ...item,
            ...this.baseItems[0]
          };
          query = {
            activeName: 'led'
          };
          break;
        case 'video':
          title = '智慧广播详情';
          name = 'wisdomVideoDetail';
          parames = {
            ...parames,
            ...item
          };
          query = {
            activeName: 'video'
          };
          break;
      };
      routePush({
        title,
        name,
        parames,
        query
      });
    },
    handlePolicyClick (tab, event) {
    },
    goMorePolicy (type) {
      let title = '';
      let name = 'illumination';
      let parames = {
        toName: 'lightPoleDetail'
      };
      let query = {};
      switch (type) {
        case 'light': // 关闭全部
          query = {
            imei: this.form.imei
          }
          break;
        case 'led':
          name = 'wisdomPublish'
          break;
        case 'video':
          name = 'wisdomVideo';
          break;
      }
      routePush({
        title,
        name,
        parames,
        query
      });
    },
    getQrCode () {
      let params = {
        height: 200,
        text: `https://www.uismp.cn/upload/dist/assets/images/index?deviceTypeNo=LAMP&serialNumber=${this.lightItems[2].value}`,
        width: 200
      }
      getQrCode(params).then(res => {
        console.log('getQrCode', res)
        let blob = new Blob([res]);
        let url = window.URL.createObjectURL(blob);
        this.qr.show = true;
        this.qr.src = url;
      })
      // routePush({
      //   name: 'bigScreen',
      //   parames: {
      //     deviceModuleName: this.lightItems[3].value,
      //     imei: this.form.imei
      //   },
      //   query: {
      //     activeNumber: this.lightItems[2].value,
      //     from: 'lightPoleDetail'
      //   }
      // });
    },
    powerChange (power) {
      this.lightItems[0].value = (power === 1 ? 0 : 1);
      this._setDeviceCommand(this.lightItems[1].value, this.lightItems[0].value);
    },
    brightnessChange (brightness) {
      clearTimeout(this.changeLampNess);
      this.changeLampNess = null;
      this.changeLampNess = setTimeout(() => {
        this._setDeviceCommand(brightness, this.lightItems[0].value);
      }, 1000)
    },
    _setDeviceCommand (brightness, power) {
      const deviceModules = {
        lampSettingCommand: {
          brightness,
          power,
          serialNumber: this.fixLamp.serialNumber
        }
      };
      setDeviceCommand(deviceModules).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '设置成功',
            type: 'success',
            position: 'bottom-right'
          });
          this.form.lampStatus = this.lightItems[0].value
        }
      })
    },
    async handleSave () {
      let deviceModules = {};
      // await this.deviceModuleList.map(data => {
      //   const info = data.info;
      //   const formItem = data.formItem;
      //   let infoObject = {};
      //   Object.keys(formItem).map(item => {
      //     infoObject[item] = data[item] || data.lampSettingInfoDto[item]
      //   });
      //   deviceModules[info.deviceId] = infoObject;
      //   return deviceModules
      // });
      setDeviceCommand(deviceModules).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '设置成功',
            type: 'success',
            position: 'bottom-right'
          });
        }
      })
    },
    linkToLed (item) {
      this.tempLED = item.infoItems.formItem.slice(1);
      console.log('this.tempLED', this.tempLED);
      this.isLinkToLED = true;
      setTimeout(() => {
        this.isLinkToLED = false;
        this.tempLED = []
      }, 10000)
    },
    editLed () {
      this.fixLed.show = true;
      if (this.$refs.ledDetail) {
        this.$refs.ledDetail.init();
      }
    },
    fixLedCancel () {
      this.fixLed.show = false;
    },
    fixLedSubmit () {
      this.$refs.ledDetail.handleSave();
      // setTimeout(() => {
      //   this.getDetail()
      // }, 2000)
    },
    refreshDetail () {
      this.getDetail();
    },
    editBroadcast () {
      this.fixBroadcast.show = true;
    },
    fixBroadcastCancel () {
      this.fixBroadcast.show = false;
    },
    fixBroadcastSubmit () {
      this.$refs.broadcastDetail.handleSave();
    },
    stringToNumber (value) {
      return value ? +value : 0
    }
  }
}
</script>

<style lang="less">
#card {
  background: unset;
}
#lightPoleDetail{
  .el-switch__label[style] {
    border-color: unset !important;
    background-color: unset !important;
  }
  .realTimeInfo{
    .controlBtn{
      position: absolute;
      top: 11px;/*no*/
      right: 16px;/*no*/
      button{
        height: 30px;/*no*/
        padding: 5px 25px;
        border-radius:4px;/*no*/
        border:1px solid rgba(52,114,255,1);
        font-size:12px;/*no*/
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(230,236,255,1);
      }
    }
    .timeInfo {
      .orange{
        .value {
          color:#FF720D;
        }
      }
      .warn{
        .value {
          color:#FF3C30;
        }
      }
    }
  }
  #card{
    padding-top: 40px;/*no*/
    margin-bottom: 10px;/*no*/
    padding-left: 26px;
    border-radius:4px;/*no*/
    // background:rgba(32,45,85,0.49);
    .title{
      top: 24px;
      left: 26px;
    }
    // &::after{
    //   content: '';
    //   position: absolute;
    //   top: 0;
    //   left: 0;
    //   width:3px;/*no*/
    //   height:100%;
    //   background:rgba(43,126,242,1);
    //   border-radius:1px;/*no*/
    // }
  }
  .el-radio-group{
    .el-radio__inner{
      width: 12px;/*no*/
      height: 12px;/*no*/
      background: transparent;
    }
    >label.is-disabled{
      >span.is-checked{
        .el-radio__inner{
          border-color: #409EFF;
          background: transparent;
          &::after{
            background-color: #409EFF;
          }
        }
      }
    }
  }
  .el-dialog{
    .el-dialog__body{
      padding: 0px;
      height: 309px;/*no*/
    }
  }
  .button{
      height: 30px;/*no*/
      padding: 5px 25px;
      background:rgba(21,27,46,1);
      border-radius:4px;/*no*/
      border:1px solid rgba(52,114,255,1);
      font-size:12px;/*no*/
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(52,114,255,1);
      // margin-left: 20px;/*no*/
      &.el-button--primary{
          background:linear-gradient(318deg,rgba(29,91,250,1) 0%,rgba(29,144,250,1) 100%);
          color:rgba(230,236,255,1);
      }
  }
  .el-image{
    cursor: pointer;
        vertical-align: middle;
    img{
      width: 16px;
      height: 12px;
      vertical-align: middle;
    }
  }
  .el-radio-group{
    .el-radio{
      margin-right: 15px;

      .el-radio__label{
        padding-left: 4px;/*no*/
        font-size:12px;/*no*/
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(255,255,255,1);
      }
      &:not(:first-child){
        margin-left: 0;
      }
    }
  }
  .el-switch{
      height: 17px;/*no*/
      line-height: 17px;/*no*/
      >span{
          height: 100%;
          &::after{
              left: 2px;
              height: 13px;/*no*/
              width: 13px;/*no*/
          }
      }
      &.is-checked{
        span{
          &::after{
            margin-left: 23px;/*no*/
          }
        }
      }
  }
  .el-slider{
    display: flex;
    flex: 1;
    height: 17px;/*no*/
    line-height: 17px;/*no*/
    margin-left: 10px;/*no*/
    margin-right: 14px;/*no*/
    position: relative;
    align-items: center;
    .el-slider__runway{
      margin:0;
      display: flex;
    }
    .el-slider__button-wrapper{
      width: 16px;/*no*/
      height: 16px;/*no*/
      top: -6px;/*no*/
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .timeInfo{
    padding: 30px 20px;/*no*/
    .timeContainer{
      width: 100%;
      position: relative;
      flex-wrap: wrap;
      .imgContent{
          width: 50%;
          height: 110%;
          position: absolute;
          left: 50%;
          top: -5%;
          bottom: 0;
          transform: translateX(-50%);
          text-align: center;
            >img{
              &.lampPost{
                width: auto;
                height: 100%;
              }
              &.lampLight{
                position: absolute;
                left: 50%;
                top: 5%;
                transform: translateX(-132%);
                width: 66%;
                height: auto;
              }
            }
      }
      .itemContent{
        width: 100%;
        position: relative;
        flex-wrap: wrap;
        .itemMain{
          height: 150px;/*no*/
          width: 50%;
          margin-bottom: 20px;/*no*/
          .item{
            max-width: 500px;
            cursor: pointer;
            padding:20px 140px 20px 20px;
            border-right: none;
            border-left: 2px solid rgba(7, 236, 233, 1);
            &::after {
              position: absolute;
              content: "";
              width: 200px;
              left: auto;
              right: -224px;
              top: 50%;
              margin-top: -11.5px;
              height: 23px;/*no*/
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
              font-size:24px;
              font-family:PingFangSC-Regular,PingFang SC;
              font-weight:400;
              color:rgba(255,255,255,1);
            }
            .charge_car_val {
              width: auto;
              overflow-x: auto;
              overflow-y: auto;
              // 滚动条
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
                // background-color: #293466;
                background: rgba(0, 0, 0, 0);
                background-clip: padding-box;
                min-height: 28px;
              }
              &::-webkit-scrollbar-thumb:hover {
                // background-color: #293466;
                background: rgba(0, 0, 0, .2);
              }
              &:hover {
                &::-webkit-scrollbar-thumb {
                //滚动条的设置
                // background-color: #293466;
                  background: rgba(0, 0, 0, .2);
                  background-clip: padding-box;
                  min-height: 28px;
                }
                &::-webkit-scrollbar-thumb:hover {
                  background: rgba(0, 0, 0, .2);
                }
              }
              &::before {
                width: 14px;
                height: 14px;
                content: "";
                border-top: 2px solid #0eece9;
                border-left: none;
                border-right: 2px solid #0eece9;
                border-top-right-radius: 5px;
                position: absolute;
                left: auto;
                right: 10px;
                top: 10px;
              }
              &::after {
                width: 14px;
                height: 14px;
                content: "";
                border-bottom: 2px solid #0eece9;
                border-left: none;
                border-right: 2px solid #0eece9;
                border-bottom-right-radius: 5px;
                position: absolute;
                left: auto;
                right: 10px;
                bottom: 10px;
              }
              #formItemText{
                min-height: 100%;
                display: flex;
                align-items: center;
                .el-col{
                  display: inline-block;
                  width: auto;
                  text-align: left;
                  float: none;
                  &.el-col-24{
                    display: block;
                  }
                  &.el-col-12{
                    width: 50%;
                  }
                  .el-form-item{
                    width: 100%;
                    display: inline-block;
                    .el-form-item__content{
                      width: 100%;
                      display: inline-block;
                      >div{
                        width: 100%;
                      }
                      .flexRow{
                        width: 100%;
                        word-break: keep-all;
                        display: inline-flex;
                        i{
                          width: 41px;/*no*/
                          height: 41px;/*no*/
                          line-height: 41px;/*no*/
                        }
                      }
                    }
                  }
                }
              }
              .linkButton {
                i {
                  background: linear-gradient(318deg, #1d5bfa 0%, #1d90fa 100%);
                  width: 56px;
                  padding: 5px 10px;
                  border-radius: 5px;
                }
              }
              .ledContentItem{
                width: 100%;
                .el-slider{
                  width: calc(100% - 10px);/*no*/
                  margin-left: 0 !important;
                  .el-slider__runway{
                    margin-left: 7px;/*no*/
                    width: calc(100% - 7px);/*no*/
                    // margin-bottom: 25px;/*no*/
                    .el-slider__button-wrapper{
                      width: 25px;/*no*/
                      height: 25px;/*no*/
                      top: -10px;/*no*/
                      .el-slider__button{
                        width: 14px;/*no*/
                        height: 14px;/*no*/
                        background: #0484D6;
                        border: 2px solid #FFFFFF;/*no*/
                      }
                    }
                    .el-slider__marks{
                      .el-slider__marks-text{
                        margin-top: 8px;/*no*/
                      }
                    }
                    .el-slider__marks-stop{
                      visibility: hidden;
                    }
                  }
                }
              }
              .editIcon {
                  position: absolute;
                  top: 0;
                  right: 0;
                  width: 25px;/*no*/
                  height: 25px;/*no*/
                  background: linear-gradient(318deg, #1d5bfa 0%, #1d90fa 100%);
                  color: #e6ecff;
                  border-radius: 4px;/*no*/
                  z-index: 11;
                  i{
                    width: auto !important;
                    height: auto !important;
                    cursor: pointer;
                  }
                }
              .audioContent{
                padding-right: 25px;/*no*/
                width: 100%;
                position: relative;
                i{
                  display: flex;
                }
                .scrollView__nav-wrap{
                  width: 200px !important;/*no*/
                  .tsp-audio{
                    width: 260px !important;/*no*/
                  }
                }
              }
              .ledContent{
                width: 200px;/*no*/
                height: 150px;
                position: relative;
                .el-form-item__content[style] {
                  margin-left: 0px !important;
                }
                .el-carousel{
                  width: 100%;
                  height: 100%;
                  .el-carousel__item{
                    .el-image{
                      width: 100%;
                      height: 100%;
                      img{
                        width: 100%;
                        height: 100%;
                      }
                    }
                  }
                  ul{
                    li{
                      padding: 12px 4px;
                      button{
                        width: 10px;
                      }
                    }
                  }
                }
                video{
                  width: 100%;
                  height: 100%;
                }
                .textTemplate{
                  height: auto;
                  position: relative;
                  min-width: 250px;
                  padding: 20px 35px 20px 18px;
                  background:linear-gradient(171deg,rgba(21,173,182,1) 0%,rgba(49,72,219,1) 100%);
                  box-shadow:0px 2px 9px 0px rgba(72,128,255,0.5);/*no*/
                  border-radius:5px;
                  margin-right: 10px;/*no*/
                  display: flex;
                  flex-direction: column;
                  overflow-y: auto;
                  .title{
                    font-size:14px;
                    font-family:PingFangSC-Semibold,PingFang SC;
                    font-weight:600;
                    color:rgba(255,255,255,1);
                    // line-height:14px;
                    text-shadow:0px 2px 4px rgba(17,118,111,0.5);
                    margin-bottom: 7px;
                  }
                  ul{
                    li{
                      font-size:12px;/*no*/
                      font-family:PingFangSC-Regular,PingFang SC;
                      font-weight:400;
                      color:rgba(255,255,255,1);
                      padding: 6px 0;
                      // line-height:17px;
                    }
                  }
                }
              }
            }
            .noHave{
              font-size: 24px;
              color: #fff;
              display: flex;
              align-items: center;
            }
            &:hover {
              -webkit-scrollbar-thumb {
                //滚动条的设置
                // background-color: #293466;
                background: rgba(0, 0, 0, .3);
                background-clip: padding-box;
                min-height: 28px;
              }
            }
          }
          &:nth-of-type(2n) {
            text-align: right;
            .item{
              padding:20px 20px 20px 140px;
              border-left: none;
              border-right: 2px solid rgba(7, 236, 233, 1);
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
                right: auto;
                left: 20px;
                font-size:24px;
                font-family:PingFangSC-Regular,PingFang SC;
                font-weight:400;
                color:rgba(255,255,255,1);
              }
              .charge_car_val {
                &::before {
                  content: "";
                  border: none;
                  border-top: 2px solid #0eece9;
                  border-left: 2px solid #0eece9;
                  border-top-left-radius: 5px;
                  left: 10px;
                  right: auto;
                }
                &::after {
                  content: "";
                  border: none;
                  border-bottom: 2px solid #0eece9;
                  border-left: 2px solid #0eece9;
                  border-bottom-left-radius: 5px;
                  left: 10px;
                  right: auto;
                }
              }
            }
          }
        }
        .item {
          display: inline-flex;
          height: 150px;/*no*/
          background:linear-gradient(270deg,rgba(34,36,77,0.5) 0%,rgba(23,43,99,0.5) 50%,rgba(35,35,74,0.5) 100%);
          box-shadow:0px 5px 6px 0px #000b29;
          position: relative;
          .radioGroup{
            // position: absolute;
            margin-top: 0;
            // left: 82px;/*no*/
            width: 100%;
            // top: 0;
            height: 17px;/*no*/
            line-height: 17px;/*no*/
            >label{
              line-height: 17px;/*no*/
            }
          }
          &.left{
            &.green{
              &::after{
                background: url(~common/images/index/jd.gif) no-repeat center;
                background-size: 100% 100%;
              }
            }
            &.warn{
              &::after{
                background: url(~common/images/index/warnjd.gif) no-repeat center;
                background-size: 100% 100%;
              }
            }
          }
          &.green{
            border-color: rgba(7, 236, 233, 1);
            &::after{
              background: url(~common/images/index/jd.gif) no-repeat center;
              background-size: 100% 100%;
            }
            .charge_car_val {
              &::before{
                border-color: #0eece9;
              }
              &::after{
                border-color: #0eece9;
              }
            }
          }
          &.warn{
            border-color: rgba(7, 236, 233, 1);
            &::after{
              background: url(~common/images/index/warnjd.gif) no-repeat center;
              background-size: 100% 100%;
            }
            .charge_car_val {
              &::before{
                border-color: #0eece9;
              }
              &::after{
                border-color: #0eece9;
              }
            }
          }
          #formItemText{
            .el-form-item{
              .el-form-item__content{
                color: #fff;
              }
            }
          }
        }
      }

    }
  }
  .policyContainer{
    padding-bottom: 15px;
    .el-tabs{
      width: 100%;
      .el-tabs__header{
        .el-tabs__nav-wrap{
          &::after{
            content: none;
          }
          .el-tabs__nav-scroll{
            text-align: center;
            .el-tabs__nav{
              display: inline-block;
              float: none;
              background:rgba(39,56,117,1);
              border-radius:5px;/*no*/
              padding: 2px;/*no*/
              .el-tabs__active-bar{
                display: none;
              }
              .el-tabs__item{
                padding: 4px 11px;/*no*/
                height: auto;
                line-height: 17px !important;/*no*/
                font-size:12px;/*no*/
                font-family:PingFangSC-Semibold,PingFang SC;
                font-weight:600;
                color:rgba(115,131,178,1);
                &.is-active{
                  background:linear-gradient(276deg,rgba(37,168,203,1) 0%,rgba(88,160,255,1) 100%);
                  border-radius:4px;/*no*/
                  color:rgba(255,255,255,1);
                }
              }
            }
          }
        }
      }
      .el-tabs__content{
        padding-right: 20px;/*no*/
        .lightPolicy, .ledPolicy, .videoPolicy{
          >.flexRow{
            .main{
              width: calc((100% - 440px) / 3);
              position: relative;
              &::after{
                content: '';
                height:4px;/*no*/
                width: 100%;
                background:linear-gradient(270deg,rgba(11,47,92,1) 0%,rgba(36,53,91,1) 100%);
                // border-radius:3px;/*no*/
                position: absolute;
                top: 19px;/*no*/
                left: 0
              }
              .number{
                margin-top: 10px;/*no*/
                display: flex;
                align-items: center;
                justify-content: center;
                color:rgba(255,255,255,1);
                width:21px;/*no*/
                height:21px;/*no*/
                background:linear-gradient(135deg,rgba(156,252,255,1) 0%,rgba(53,205,199,1) 100%);
                box-shadow: 0 0 1px 4px rgba(93, 244, 242, 0.4), 0 0 1px 10px rgba(93, 244, 242, 0.1);/*no*/
                border-radius: 50%;
                font-size: 14px;/*no*/
                text-shadow:0px 3px 4px rgba(7,78,82,1);/*no*/
                z-index: 1;
              }
              .policyTitle{
                width: 220px;/*no*/
                margin-top: 15px;/*no*/
                padding: 11px 18px 11px 23px;/*no*/
                background:linear-gradient(135deg,rgba(58,63,123,1) 0%,rgba(32,56,120,1) 100%);
                border-radius:4px;/*no*/
                position: relative;
                cursor: pointer;
                >div{
                  &:first-child{
                    font-size:14px;/*no*/
                    font-family:PingFangSC-Semibold,PingFang SC;
                    font-weight:600;
                    color:rgba(255,255,255,1);
                    margin-bottom: 6px;/*no*/
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                  }
                  &:last-child{
                    font-size:12px;/*no*/
                    font-family:PingFangSC-Regular,PingFang SC;
                    font-weight:400;
                    color:rgba(255,255,255,1);
                  }
                }
                &::after{
                  content: '';
                  width:6px;/*no*/
                  height:6px;/*no*/
                  background:rgba(65,171,255,1);
                  position: absolute;
                  top: 19px;/*no*/
                  left: 10px;/*no*/
                }
              }
              &:first-child{
                width: 220px;/*no*/
                &::after{
                  width: 50%;
                  left: auto;
                  right: 0;
                }
              }
              &:last-child{
                width: 220px;/*no*/
                &::after{
                  width: 50%;
                  left: 0;
                  right: auto;
                }
              }
            }
            &.policyItems1{
              .main{
                &:last-child{
                  &::after{
                    content: none;
                  }
                }
              }
            }
            &.policyItems2{
              .main{
                &:last-child{
                  width: calc((100% - 440px) / 3);
                }
              }
            }
          }
        .more{
            position: absolute;
            top: 11px;/*no*/
            right: 20px;/*no*/
            background:rgba(33,45,90,1);
            border-radius:4px;/*no*/
            padding: 2px 9px;/*no*/
            font-size:12px;/*no*/
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(138,146,202,1);
            cursor: pointer;
          }
        }
      }
    }
  }
  .el-radio{
    .el-radio__input{
      line-height: 14px;/*no*/
    }
    &.fault,
    &.fault.is-checked{
      .el-radio__inner{
        border-color: #ff731f !important;
        background: transparent;
        &::after{
          background: #ff731f !important;
        }
      }
      .el-radio__label{
        color: #ff731f;
        padding-left: 4px;
      }
    }
  }
}
.fixLedDialog, .fixBroadcastDialog{
  /deep/#card{
    background: transparent !important;
    .detail_form, .el-radio__label, .resource_img{
      background: transparent !important;
    }
    .cardTitle{
      color: #a0acd8 !important;
      img {
        display: flex;
      }
    }
    .el-input__inner{
      border: 1px solid #6275bf;
    }
    .time .el-input__inner{
      border-color: transparent;
      background: transparent;
    }
    input{
      background: #222c51;
      border: 0.013333rem solid #6275bf;
      color: #e6ecff;
    }
    .el-form-item__label, .el-radio__label, .programDetail .title, .el-range-separator{
      color: #e6ecff !important;
    }
    .el-radio{
      margin-right: 10px;
      .el-radio__inner{
        width: 12px;/*no*/
        height: 12px;/*no*/
        background-color: #202d55;
        border-color: #2870ff;
        &::after{
              background: #2870ff;
        }
      }
    }
  }
}
.videoDialog{
  .video{
      position: relative;
      width: 100%;
      height: 700px;/*no*/
      background:transparent;
      position: relative;
      margin-bottom: 10px;/*no*/
      .kongzhi-icon {
        position: absolute;
        bottom: 12px;/*no*/
        right: 115px;/*no*/
        i {
          display: inline-block;
          width: 18px;
          height: 18px;
          color: #fff;
          cursor: pointer;
        }
      }
      .videoInfo{
          position: absolute;
          bottom: 5px;
          left: 5px;
          right: 400px;/*no*/
          padding: unset;
          // background:rgba(0,0,0,0.5);
          align-items: center;
          .icon{
              width:38px;
              height:38px;
              background:linear-gradient(135deg, #09a6d0 0%, #0a65d4 100%);
              border-radius:6px;
              margin-right: 10px;/*no*/
              i{
                  font-size: 21px;
                  color: #fff;
              }
          }
          .title{
              span{
                  font-size:16px;
                  font-family:PingFangHK-Semibold,PingFangHK;
                  font-weight:600;
                  color:rgba(255,255,255,1);
                  &:last-child{
                      font-size:12px;/*no*/
                      font-family:PingFangSC-Regular,PingFang SC;
                      font-weight:400;
                      color:rgba(255,255,255,1);
                  }
              }
          }
          .playBack{
              width: 90px;/*no*/
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              right: 120px;/*no*/
              background:linear-gradient(135deg, #09a6d0 0%, #0a65d4 100%);
              box-shadow:0px 5px 9px 0px rgba(47,47,47,1);/*no*/
              border-radius:50px;/*no*/
              font-size:14px;/*no*/
              font-family:PingFangSC-Semibold,PingFang SC;
              // font-weight:600;
              color:rgba(255,255,255,1);
              padding: 8px 15px;
              text-shadow:0px 2px 4px rgba(47,47,47,1);/*no*/
              cursor: pointer;
              i{
                  font-size: 20px;
                  color: #fff;
                  margin-right: 3px;
              }
              &.more{
                right: 15px;/*no*/
                background:linear-gradient(135deg, #09a6d0 0%, #0a65d4 100%);
              }
          }
      }
      .v-modal{
        display: none;
      }
      .el-drawer__wrapper{
        position: absolute;
        /deep/.el-drawer__container{
          >div{
            width: 103px !important;/*no*/
          }
        }
        .el-drawer__body{
          overflow-y: auto;
          .btnList{
            padding: 15px;/*no*/
            >div{
              cursor: pointer;
              padding: 0 13px;/*no*/
              min-width:70px;/*no*/
              height:30px;/*no*/
              background:linear-gradient(318deg,rgba(29,91,250,1) 0%,rgba(29,144,250,1) 100%);
              border-radius:4px;/*no*/
              line-height: 28px;/*no*/
              font-size:12px;/*no*/
              font-family:PingFangSC-Regular,PingFang SC;
              font-weight:400;
              color:rgba(230,236,255,1);
              margin-bottom: 10px;/*no*/
              text-align: center;
              span{
                font-size:12px;/*no*/
                font-family:PingFangSC-Regular,PingFang SC;
                font-weight:400;
                color:rgba(230,236,255,1);
              }
            }
          }
        }
      }
  }
  .videoInfo{
    background:transparent;
    // box-shadow:0px 2px 4px 0px rgba(213,213,213,0.5);
    border-radius:4px;
    padding: 15px;/*no*/
    .videoTitle{
      justify-content: space-between;
      margin-bottom: 10px;/*no*/
      span{
        font-size:12px;/*no*/
        font-family:PingFangSC-Semibold,PingFang SC;
        font-weight:600;
        color:rgba(26,26,26,1);
        padding:0 10px;/*no*/
        &:first-child{
          font-size:14px;/*no*/
          border-left: 4px solid #129ff7;/*no*/
        }
        &.linkage{
          cursor: pointer;
        }
      }
    }
  }
}
.fixBroadcastDialog {
  /deep/#card{
    padding: 40px 20px 20px !important;
  }
}

.qrDialog {
  .el-dialog__body {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.qr-box {
  display: flex;
  justify-content: center;
  padding: 20px;
}

</style>
