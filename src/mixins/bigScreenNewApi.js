/**
 * 新可视化大屏公共请求
 */
import { mapGetters, mapMutations } from 'vuex';
import {
  screenEnergyConsump
} from 'api/screen/index';
import {
  // 照明灯
  lampSaving,
  lampLight,
  lampWork,
  lampRanking,
  // 门禁
  getDoorAccessFlowStatByDate,
  getDoorAccessInfoOverview,
  getInDoorAccessPersonTypeByDate,
  getDoorAccessInOutForPage,
  // 广播
  getDeviceAudioLatelyStatistics,
  getDeviceAudioSceneStatistics,
  // 烟感
  getSmokeDetectorTrendStat,
  getSmokeDetectorAlarmStats,
  getSmokeDetectorAlarmForPage,
  // LED
  getLedPlayStats,
  getLedprogramTreeLED,
  // 环境监测
  getAmbientMonitoringTrendStat,
  getAmbientMonitoringInfoAndAlarmOf,
  getAmbientMonitoringAlarmCount,

  // getSmokeDetectorAlarmForPage,
  //摄像头
  cameraAlarmList,
  cameraAlarmCount,
  cameraEventStat,
  // 报警器
  getAlarmCallTrendStats,
  getAlarmCallStats,
  getAlarmCallRecordForPage,
  // 中间部分
  getDeviceSumStatistics,
  getDeviceLamp,
  getDeviceLed,
  getSmokeDetectorStatistics,
  getDeviceAudio,
  getAlarmCallWorkingStats,
  getAmbientMonitoringRunStatus,
  getCameraOnlineState,
  getDoorAccessCurrentStatus,
  getSmokeDetectorCurrentStatus,
  getDeviceAudioStatistics,
  getDeviceLedStatistics,
  getDeviceLampStatistics,
} from 'api/screen/newIndex'
import { stat } from 'fs';
const bigScreenNewApi = () => ({
  data() {
    return {
      _heardCheckID: null,
      _fastQueueRecvTime: (this.bigScreenNew && this.bigScreenNew._fastQueueRecvTime) ? this.bigScreenNew._fastQueueRecvTime : new Date(),
      _queueRecvTime: (this.bigScreenNew && this.bigScreenNew._queueRecvTime) ? this.bigScreenNew._queueRecvTime : new Date(),
      screenEnergyConsump: this.bigScreenNew && this.bigScreenNew.screenEnergyConsump,
      lampEnergy: this.bigScreenNew && this.bigScreenNew.lampEnergy,
      lampLight: this.bigScreenNew && this.bigScreenNew.lampLight,
      lampWork: this.bigScreenNew && this.bigScreenNew.lampWork,
      lampRanking: this.bigScreenNew && this.bigScreenNew.lampRanking,
      doorAccessFlow: this.bigScreenNew && this.bigScreenNew.doorAccessFlow,
      doorAccessInfo: this.bigScreenNew && this.bigScreenNew.doorAccessInfo,
      doorAccessType: this.bigScreenNew && this.bigScreenNew.doorAccessType,
      doorAccessPage: this.bigScreenNew && this.bigScreenNew.doorAccessPage,
      audioStatisticsDay: this.bigScreenNew && this.bigScreenNew.audioStatisticsDay,
      audioStatisticsWeek: this.bigScreenNew && this.bigScreenNew.audioStatisticsWeek,
      audioStatisticsYear: this.bigScreenNew && this.bigScreenNew.audioStatisticsYear,
      audioScene: this.bigScreenNew && this.bigScreenNew.audioScene,
      smokeTrendStat: this.bigScreenNew && this.bigScreenNew.smokeTrendStat,
      smokeAlarmCount: this.bigScreenNew && this.bigScreenNew.smokeAlarmCount,
      smokeAlarmMsg: this.bigScreenNew && this.bigScreenNew.smokeAlarmMsg,
      ledPlayStateDay: this.bigScreenNew && this.bigScreenNew.ledPlayStateDay,
      ledPlayStateWeek: this.bigScreenNew && this.bigScreenNew.ledPlayStateWeek,
      ledPlayStateYear: this.bigScreenNew && this.bigScreenNew.ledPlayStateYear,
      ledprogram: this.bigScreenNew && this.bigScreenNew.ledprogram,
      ambientToday: this.bigScreenNew && this.bigScreenNew.ambientToday,
      ambientAlarmAnalysis: this.bigScreenNew && this.bigScreenNew.ambientAlarmAnalysis,
      ambientAlarmCount: this.bigScreenNew && this.bigScreenNew.ambientAlarmCount,
      ambientAlarmAnalysisY: this.bigScreenNew && this.bigScreenNew.ambientAlarmAnalysisY,
      cameraAlarmList: this.bigScreenNew && this.bigScreenNew.cameraAlarmList,
      cameraAlarmCount: this.bigScreenNew && this.bigScreenNew.cameraAlarmCount,
      cameraEventStat: this.bigScreenNew && this.bigScreenNew.cameraEventStat,
      callTrend: this.bigScreenNew && this.bigScreenNew.callTrend,
      callTrendStats: this.bigScreenNew && this.bigScreenNew.callTrendStats,
      alarmCallStats: this.bigScreenNew && this.bigScreenNew.alarmCallStats,
      alarmCallRecordForPage: this.bigScreenNew && this.bigScreenNew.alarmCallRecordForPage,
      deviceSumStatistics: this.bigScreenNew && this.bigScreenNew.DeviceSumStatistics,
      deviceLamp: this.bigScreenNew && this.bigScreenNew.deviceLamp,
      deviceLed: this.bigScreenNew && this.bigScreenNew.deviceLed,
      smokeDetectorStatistics: this.bigScreenNew && this.bigScreenNew.smokeDetectorStatistics,
      deviceAudio: this.bigScreenNew && this.bigScreenNew.deviceAudio,
      alarmCallWorkingStats: this.bigScreenNew && this.bigScreenNew.alarmCallWorkingStats,
      ambientMonitoringRunStatus: this.bigScreenNew && this.bigScreenNew.ambientMonitoringRunStatus,
      cameraOnlineState: this.bigScreenNew && this.bigScreenNew.cameraOnlineState,
      doorAccessCurrentStatus: this.bigScreenNew && this.bigScreenNew.doorAccessCurrentStatus,
      smokeDetectorCurrentStatus: this.bigScreenNew && this.bigScreenNew.smokeDetectorCurrentStatus,
      deviceAudioStatistics: this.bigScreenNew && this.bigScreenNew.deviceAudioStatistics,
      deviceLedStatistics: this.bigScreenNew && this.bigScreenNew.deviceLedStatistics,
      deviceLampStatistics: this.bigScreenNew && this.bigScreenNew.deviceLampStatistics,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this._init();
    });
  },
  computed: {
    ...mapGetters(['bigScreenNew', 'openPage'])
  },
  methods: {
    ...mapMutations([
      'set_bigScreenNew'
    ]),
    _init() {
      this.getApiData();
      this._fastQueueRecvTime = new Date();
      this._heardCheckID && clearInterval(this._heardCheckID);
      this._heardCheckID = setInterval(() => {
        let nowTime = (new Date()).getTime();
        // 1小时请求一次
        if ((this._queueRecvTime === null || this._queueRecvTime === undefined) ? false : (nowTime - (this._queueRecvTime).getTime()) > 3600000) {
          this.getApiData();
        }
        // 8秒请求一次
        if (this._fastQueueRecvTime === null ? false : (nowTime - (this._fastQueueRecvTime).getTime()) > 8000) {
          this.getFastApiData();
        }
      }, 20000);
    },
    async getApiData() {
      this._screenEnergyConsump();
      this._lampSaving()
      this._lampLight()
      this._lampWork()
      this._lampRanking()
      this._getDoorAccessFlowStatByDate()
      this._getDoorAccessInfoOverview()
      this._getInDoorAccessPersonTypeByDate()
      this._getDeviceAudioLatelyStatistics(6)
      this._getDeviceAudioLatelyStatistics(9)
      this._getDeviceAudioLatelyStatistics(1)
      this._getDeviceAudioSceneStatistics()
      this._getSmokeDetectorTrendStat()
      this._getSmokeDetectorAlarmStats()
      
      this._getLedPlayStats(6)
      this._getLedPlayStats(9)
      this._getLedPlayStats(1)
      this._getLedprogramTreeLED(),
        this._getAmbientMonitoringTrendStat(),
        this._getAmbientMonitoringInfoAndAlarmOf(1)
      this._getAmbientMonitoringAlarmCount(1)
      this._getAmbientMonitoringAlarmCount(2)
      
      this._cameraAlarmCount()
      this._cameraEventStat()
      this._getAlarmCallTrendStats()
      this._getAlarmCallStats()
      
      this._getAlarmCallTrend()
      this._getDeviceSumStatistics()
      this._getDeviceLamp()
      this._getDeviceLed()
      this._getSmokeDetectorStatistics()
      this._getDeviceAudio()
      this._getAlarmCallWorkingStats()
      this._getAmbientMonitoringRunStatus()
      this._getCameraOnlineState()
      this._getDoorAccessCurrentStatus()
      this._getSmokeDetectorCurrentStatus()
      this._getDeviceAudioStatistics()
      this._getDeviceLedStatistics()
      this._getDeviceLampStatistics()
    },
    async getFastApiData() {
      this._fastQueueRecvTime = new Date();
      this.set_bigScreenNew({
        ...this.bigScreenNew,
        _fastQueueRecvTime: this._fastQueueRecvTime
      });
      // 门禁进出消息
      this._getDoorAccessInOutForPage()
      // 报警器报警信息列表
      this._getAlarmCallRecordForPage()
      // 摄像头告警消息
      this._cameraAlarmList()
      // 烟感设备告警消息
      this._getSmokeDetectorAlarmForPage()
    },
    // 灯杆能耗状态
    _screenEnergyConsump() {
      let params = {
        area: '',
        city: '',
        type: null
      };
      screenEnergyConsump(params).then(res => {
        const { data } = res;
        this.screenEnergyConsump = {
          ...data
        };
        this._queueRecvTime = new Date();
        this.set_bigScreenNew({
          ...this.bigScreenNew,
          _queueRecvTime: this._queueRecvTime,
          screenEnergyConsump: this.screenEnergyConsump
        });
      });
    },
    /** 照明灯 start */
    _lampSaving() {
      lampSaving().then(res => {
        if (res.code == '200') {
          const { data } = res
          this.lampEnergy = {
            ...data
          }
          this._queueRecvTime = new Date();
          this.set_bigScreenNew({
            ...this.bigScreenNew,
            _queueRecvTime: this._queueRecvTime,
            lampEnergy: this.lampEnergy
          });
        }

      })
    },
    _lampLight() {
      lampLight().then(res => {
        if (res.code == '200') {
          const { data } = res
          this.lampLight = {
            ...data
          }
          this._queueRecvTime = new Date();
          this.set_bigScreenNew({
            ...this.bigScreenNew,
            _queueRecvTime: this._queueRecvTime,
            lampLight: this.lampLight
          });
        }

      })
    },
    _lampWork() {
      lampWork().then(res => {
        if (res.code == '200') {
          const { data } = res
          this.lampWork = {
            ...data
          }
          this._queueRecvTime = new Date();
          this.set_bigScreenNew({
            ...this.bigScreenNew,
            _queueRecvTime: this._queueRecvTime,
            lampWork: this.lampWork
          });
        }
      })
    },
    _lampRanking() {
      lampRanking().then(res => {
        if (res.code == '200') {
          const { data } = res
          this.lampRanking = {
            ...data
          }
          this._queueRecvTime = new Date();
          this.set_bigScreenNew({
            ...this.bigScreenNew,
            _queueRecvTime: this._queueRecvTime,
            lampRanking: this.lampRanking
          });
        }
      })
    },
    /** 照明灯 end */

    /** 门禁 */
    _getDoorAccessFlowStatByDate() {
      const params = { specialQuery: 1, dateInterval: 6 }
      getDoorAccessFlowStatByDate(params).then(res => {
        if (res.code == '200') {
          const { data } = res;
          this.doorAccessFlow = data;
          this._queueRecvTime = new Date();
          this.set_bigScreenNew({
            ...this.bigScreenNew,
            _queueRecvTime: this._queueRecvTime,
            doorAccessFlow: this.doorAccessFlow
          });
        }
      })
    },
    _getDoorAccessInfoOverview() {
      getDoorAccessInfoOverview().then(res => {
        if (res.code == '200') {
          const { data } = res
          this.doorAccessInfo = data
          this._queueRecvTime = new Date();
          this.set_bigScreenNew({
            ...this.bigScreenNew,
            _queueRecvTime: this._queueRecvTime,
            doorAccessInfo: this.doorAccessInfo
          });
        }
      })
    },
    _getInDoorAccessPersonTypeByDate() {
      const params = { dateInterval: 9 }
      getInDoorAccessPersonTypeByDate(params).then(res => {
        if (res.code == '200') {
          const { data } = res
          this.doorAccessType = data
          this._queueRecvTime = new Date();
          this.set_bigScreenNew({
            ...this.bigScreenNew,
            _queueRecvTime: this._queueRecvTime,
            doorAccessType: this.doorAccessType
          });
        }
      })
    },
    _getDoorAccessInOutForPage() {
      const params = { data: {}, pageNo: 1, pageSize: 20, sorting: "" }
      getDoorAccessInOutForPage(params).then(res => {
        if (res.code == '200') {
          const { data } = res
          this.doorAccessPage = data
          this._queueRecvTime = new Date();
          this.set_bigScreenNew({
            ...this.bigScreenNew,
            _queueRecvTime: this._queueRecvTime,
            doorAccessPage: this.doorAccessPage
          });
        }
      })
    },

    /** 广播器 */
    _getDeviceAudioLatelyStatistics(state) {
      let params = {
        dateInterval: state
      }
      getDeviceAudioLatelyStatistics(params).then(res => {
        if (res.code == '200') {
          const { data } = res

          let tempString = state == 6 ? 'audioStatisticsDay' : (state == 9 ? 'audioStatisticsWeek' : (state == 1 ? 'audioStatisticsYear' : ''))
          this[tempString] = data
          this._queueRecvTime = new Date();
          this.set_bigScreenNew({
            ...this.bigScreenNew,
            _queueRecvTime: this._queueRecvTime,
            [tempString]: this[tempString]
          });
        }
      })
    },
    _getDeviceAudioSceneStatistics() {
      let params = {
        dateInterval: 6
      }
      getDeviceAudioSceneStatistics(params).then(res => {
        if (res.code == 200) {
          const { data } = res
          this.audioScene = data
          this._queueRecvTime = new Date();
          this.set_bigScreenNew({
            ...this.bigScreenNew,
            _queueRecvTime: this._queueRecvTime,
            audioScene: this.audioScene
          });
        }
      })
    },
    /** 烟感 */
    _getSmokeDetectorTrendStat() {
      const params = {
        specialQuery: 1,
        dateInterval: 6
      }
      getSmokeDetectorTrendStat(params).then(res => {
        if (res.code == 200) {
          const { data } = res
          this.smokeTrendStat = data
          this._queueRecvTime = new Date();
          this.set_bigScreenNew({
            ...this.bigScreenNew,
            _queueRecvTime: this._queueRecvTime,
            smokeTrendStat: this.smokeTrendStat
          });
        }
      })
    },
    _getSmokeDetectorAlarmStats() {
      const params = { dateInterval: 1, specialQuery: 1 }
      getSmokeDetectorAlarmStats(params).then(res => {
        if (res.code == 200) {
          const { data } = res
          this.smokeAlarmCount = data
          this._queueRecvTime = new Date();
          this.set_bigScreenNew({
            ...this.bigScreenNew,
            _queueRecvTime: this._queueRecvTime,
            smokeAlarmCount: this.smokeAlarmCount
          });
        }
      })
    },
    _getSmokeDetectorAlarmForPage() {
      const params = { data: {}, pageNo: 1, pageSize: 20, sorting: "" }
      getSmokeDetectorAlarmForPage(params).then(res => {
        if (res.code == 200) {
          const { data } = res
          this.smokeAlarmMsg = data
          this._queueRecvTime = new Date();
          this.set_bigScreenNew({
            ...this.bigScreenNew,
            _queueRecvTime: this._queueRecvTime,
            smokeAlarmMsg: this.smokeAlarmMsg
          });
        }
      })
    },
    /** LED */
    _getLedPlayStats(state) {
      let params = {
        dateInterval: state
      }
      getLedPlayStats(params).then(res => {
        if (res.code == 200) {
          const { data } = res
          let tempString = state == 6 ? 'ledPlayStateDay' : (state == 9 ? 'ledPlayStateWeek' : (state == 1 ? 'ledPlayStateYear' : ''))
          this[tempString] = data
          this._queueRecvTime = new Date();
          this.set_bigScreenNew({
            ...this.bigScreenNew,
            _queueRecvTime: this._queueRecvTime,
            [tempString]: this[tempString]
          });
        }
      })
    },
    _getLedprogramTreeLED() {
      const params = {}
      getLedprogramTreeLED(params).then(res => {
        if (res.code == 200) {
          const { data } = res
          this.ledprogram = data
          this._queueRecvTime = new Date();
          this.set_bigScreenNew({
            ...this.bigScreenNew,
            _queueRecvTime: this._queueRecvTime,
            ledprogram: this.ledprogram
          });
        }
      })
    },
    /** 环境监测 */
    _getAmbientMonitoringTrendStat() {
      const params = { specialQuery: 1, dateInterval: 6 }
      getAmbientMonitoringTrendStat(params).then(res => {
        if (res.code == 200) {
          const { data } = res
          this.ambientToday = data
          this._queueRecvTime = new Date();
          this.set_bigScreenNew({
            ...this.bigScreenNew,
            _queueRecvTime: this._queueRecvTime,
            ambientToday: this.ambientToday
          });
        }
      })
    },
    _getAmbientMonitoringInfoAndAlarmOf(state) {
      // 1->环境监测器报警情况分析 2->信息总览
      let tempString = state == 1 ? 'ambientAlarmAnalysis' : ''
      getAmbientMonitoringInfoAndAlarmOf().then(res => {
        if (res.code == 200) {
          const { data } = res
          this[tempString] = data
          this._queueRecvTime = new Date();
          this.set_bigScreenNew({
            ...this.bigScreenNew,
            _queueRecvTime: this._queueRecvTime,
            [tempString]: this[tempString]
          });
        }
      })
    },
    _getAmbientMonitoringAlarmCount(state) {
      let params;
      let tempString;
      if (state == 1) {
        params = { specialQuery: 1, dateInterval: 6 }
        tempString = 'ambientAlarmCount'
      } else {
        params = { dateInterval: 1 }
        tempString = 'ambientAlarmAnalysisY'
      }
      getAmbientMonitoringAlarmCount(params).then(res => {
        if (res.code == 200) {
          const { data } = res
          this[tempString] = data
          this._queueRecvTime = new Date();
          this.set_bigScreenNew({
            ...this.bigScreenNew,
            _queueRecvTime: this._queueRecvTime,
            [tempString]: this[tempString]
          });
        }
      })
    },
    _cameraAlarmList() {
      let data = {
        data: {},
        pageNo: 1,
        pageSize: 20,
        sorting: ""
      };
      cameraAlarmList(data).then(res => {
        if (res.code == 200) {
          const { data } = res
          this.cameraAlarmList = data;
          this._queueRecvTime = new Date();
          this.set_bigScreenNew({
            ...this.bigScreenNew,
            _queueRecvTime: this._queueRecvTime,
            cameraAlarmList: this.cameraAlarmList
          });
        }
      });
    },
    _cameraAlarmCount() {
      let data = {
        dateInterval: 1,
        visitorsFlowRate: "1"
      };
      cameraAlarmCount(data).then(res => {
        if (res.code == 200) {
          let { data } = res;
          this.cameraAlarmCount = data;
          this._queueRecvTime = new Date();
          this.set_bigScreenNew({
            ...this.bigScreenNew,
            _queueRecvTime: this._queueRecvTime,
            cameraAlarmCount: this.cameraAlarmCount
          });
        }
      });
    },
    _cameraEventStat() {
      let data = {
        dateInterval: 6,
        specialQuery: 1
      };
      cameraEventStat(data).then(res => {
        if (res.code == 200) {
          let { data } = res;
          this.cameraEventStat = data;
          this._queueRecvTime = new Date();
          this.set_bigScreenNew({
            ...this.bigScreenNew,
            _queueRecvTime: this._queueRecvTime,
            cameraEventStat: this.cameraEventStat
          });
        }
      });
    },
    _getAlarmCallTrendStats() {
      let data = {
        dateInterval: 6,
        specialQuery: 1
      }
      getAlarmCallTrendStats(data).then(res => {
        if (res.code == 200) {
          let { data } = res;
          this.callTrend = data;
          this._queueRecvTime = new Date();
          this.set_bigScreenNew({
            ...this.bigScreenNew,
            _queueRecvTime: this._queueRecvTime,
            callTrend: this.callTrend
          });
        }
      });
    },
    _getAlarmCallTrend() {
      let data = {
        dateInterval: 1
      }
      getAlarmCallTrendStats(data).then(res => {
        if (res.code == 200) {
          let { data } = res;
          this.callTrendStats = data;
          this._queueRecvTime = new Date();
          this.set_bigScreenNew({
            ...this.bigScreenNew,
            _queueRecvTime: this._queueRecvTime,
            callTrendStats: this.callTrendStats
          });
        }
      });
    },
    _getAlarmCallStats() {
      let data = {}
      getAlarmCallStats(data).then(res => {
        if (res.code == 200) {
          let { data } = res;
          this.alarmCallStats = data;
          this._queueRecvTime = new Date();
          this.set_bigScreenNew({
            ...this.bigScreenNew,
            _queueRecvTime: this._queueRecvTime,
            alarmCallStats: this.alarmCallStats
          });
        }
      });
    },
    _getAlarmCallRecordForPage() {
      let data = {
        data: {},
        pageNo: 1,
        pageSize: 20,
        sorting: ""
      };
      getAlarmCallRecordForPage(data).then(res => {
        if (res.code == 200) {
          let { data } = res;
          this.alarmCallRecordForPage = data;
          this._queueRecvTime = new Date();
          this.set_bigScreenNew({
            ...this.bigScreenNew,
            _queueRecvTime: this._queueRecvTime,
            alarmCallRecordForPage: this.alarmCallRecordForPage
          });
        }
      });
    },
    _getDeviceSumStatistics() {
      getDeviceSumStatistics().then(res => {
        if (res.code == 200) {
          this._queueRecvTime = new Date();
          this.deviceSumStatistics = res.data;
          this.set_bigScreenNew({
            ...this.bigScreenNew,
            _queueRecvTime: this._queueRecvTime,
            deviceSumStatistics: this.deviceSumStatistics
          });
        }
      });
    },
    _getDeviceLamp() {
      let data = 'LAMP'
      getDeviceLamp(data).then(res => {
        if (res.code == 200) {
          let { data } = res;
          this.deviceLamp = data;
          this._queueRecvTime = new Date();
          this.set_bigScreenNew({
            ...this.bigScreenNew,
            _queueRecvTime: this._queueRecvTime,
            deviceLamp: this.deviceLamp
          });
        }
      })
    },
    _getDeviceLed() {
      let data = 'LED'
      getDeviceLed(data).then(res => {
        if (res.code == 200) {
          let { data } = res;
          this.deviceLed = data;
          this._queueRecvTime = new Date();
          this.set_bigScreenNew({
            ...this.bigScreenNew,
            _queueRecvTime: this._queueRecvTime,
            deviceLed: this.deviceLed
          });
        }
      })
    },
    _getDeviceAudio() {
      let data = 'AUDIO'
      getDeviceAudio(data).then(res => {
        if (res.code == 200) {
          let { data } = res;
          this.deviceAudio = data;
          this._queueRecvTime = new Date();
          this.set_bigScreenNew({
            ...this.bigScreenNew,
            _queueRecvTime: this._queueRecvTime,
            deviceAudio: this.deviceAudio
          });
        }
      })
    },
    _getSmokeDetectorStatistics() {
      getSmokeDetectorStatistics().then(res => {
        if (res.code == 200) {
          let { data } = res;
          this.smokeDetectorStatistics = data;
          this._queueRecvTime = new Date();
          this.set_bigScreenNew({
            ...this.bigScreenNew,
            _queueRecvTime: this._queueRecvTime,
            smokeDetectorStatistics: this.smokeDetectorStatistics
          });
        }
      })
    },
    _getAlarmCallWorkingStats() {
      var data = { dateInterval: 6, specialQuery: 1 }
      getAlarmCallWorkingStats(data).then(res => {
        if (res.code == 200) {
          let { data } = res;
          this.alarmCallWorkingStats = data;
          this._queueRecvTime = new Date();
          this.set_bigScreenNew({
            ...this.bigScreenNew,
            _queueRecvTime: this._queueRecvTime,
            alarmCallWorkingStats: this.alarmCallWorkingStats
          });
        }
      })
    },
    _getAmbientMonitoringRunStatus() {
      getAmbientMonitoringRunStatus().then(res => {
        if (res.code == 200) {
          let { data } = res;
          this.ambientMonitoringRunStatus = data;
          this._queueRecvTime = new Date();
          this.set_bigScreenNew({
            ...this.bigScreenNew,
            _queueRecvTime: this._queueRecvTime,
            ambientMonitoringRunStatus: this.ambientMonitoringRunStatus
          });
        }
      })
    },
    _getCameraOnlineState() {
      getCameraOnlineState().then(res => {
        if (res.code == 200) {
          let { data } = res;
          this.cameraOnlineState = data;
          this._queueRecvTime = new Date();
          this.set_bigScreenNew({
            ...this.bigScreenNew,
            _queueRecvTime: this._queueRecvTime,
            cameraOnlineState: this.cameraOnlineState
          });
        }
      })
    },
    _getDoorAccessCurrentStatus() {
      let params = { dateInterval: 6, specialQuery: 1 }
      getDoorAccessCurrentStatus(params).then(res => {
        if (res.code == 200) {
          let { data } = res;
          this.doorAccessCurrentStatus = data;
          this._queueRecvTime = new Date();
          this.set_bigScreenNew({
            ...this.bigScreenNew,
            _queueRecvTime: this._queueRecvTime,
            doorAccessCurrentStatus: this.doorAccessCurrentStatus
          });
        }
      })
    },
    _getSmokeDetectorCurrentStatus() {
      let params = { dateInterval: 6, specialQuery: 1 }
      getSmokeDetectorCurrentStatus(params).then(res => {
        if (res.code == 200) {
          let { data } = res;
          this.smokeDetectorCurrentStatus = data;
          this._queueRecvTime = new Date();
          this.set_bigScreenNew({
            ...this.bigScreenNew,
            _queueRecvTime: this._queueRecvTime,
            smokeDetectorCurrentStatus: this.smokeDetectorCurrentStatus
          });
        }
      })
    },
    _getDeviceAudioStatistics() {
      getDeviceAudioStatistics().then(res => {
        if (res.code == 200) {
          let { data } = res;
          this.deviceAudioStatistics = data;
          this._queueRecvTime = new Date();
          this.set_bigScreenNew({
            ...this.bigScreenNew,
            _queueRecvTime: this._queueRecvTime,
            deviceAudioStatistics: this.deviceAudioStatistics
          });
        }
      })
    },
    _getDeviceLedStatistics() {
      getDeviceLedStatistics().then(res => {
        if (res.code == 200) {
          let { data } = res;
          this.deviceLedStatistics = data;
          this._queueRecvTime = new Date();
          this.set_bigScreenNew({
            ...this.bigScreenNew,
            _queueRecvTime: this._queueRecvTime,
            deviceLedStatistics: this.deviceLedStatistics
          });
        }
      })
    },
    _getDeviceLampStatistics() {
      getDeviceLampStatistics().then(res => {
        if (res.code == 200) {
          let { data } = res;
          this.deviceLampStatistics = data;
          this._queueRecvTime = new Date();
          this.set_bigScreenNew({
            ...this.bigScreenNew,
            _queueRecvTime: this._queueRecvTime,
            deviceLampStatistics: this.deviceLampStatistics
          });
        }
      })
    },
  },
  destroyed() {
    this._heardCheckID && clearInterval(this._heardCheckID);
  }
})

export default bigScreenNewApi
