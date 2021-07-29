import api from 'util/axios'

/** 照明灯 **/

// 照明灯能耗分析
export const lampSaving = () => {
  return api.request({
    method: 'GET',
    url: `/api/lampStatics/saving`
  })
}
// 照明灯亮度分析
export const lampLight = () => {
  return api.request({
    method: 'GET',
    url: `/api/lampStatics/light`
  })
}
// 照明灯使用率
export const lampWork = () => {
  return api.request({
    method: 'GET',
    url: `/api/lampStatics/work`
  })
}
// 照明灯亮灯时长排名
export const lampRanking = () => {
  return api.request({
    method: 'GET',
    url: `/api/lampStatics/lightRank`
  })
}

// 摄像头告警信息（列表）
export const cameraAlarmList = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/camera/getCameraAlarmList`,
    data
  })
}

// 摄像头人流量统计
export const cameraAlarmCount = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/camera/getCameraAlarmCount`,
    data
  })
}
// 摄像头告警类型统计
export const cameraEventStat = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/camera/getCameraEventStat`,
    data
  })
}

/** 门禁 **/

// 门禁进出人流量统计
export const getDoorAccessFlowStatByDate = (data) => {
  return api.request({
    method: 'POST',
    url: `api/iot-park/doorAccess/getDoorAccessFlowStatByDate`,
    data
  })
}

// 本月通过人员类型统计
export const getInDoorAccessPersonTypeByDate = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/doorAccessLog/getInDoorAccessPersonTypeByDate`,
    data
  })
}

// 门禁验证通过类型情况
export const getDoorAccessInfoOverview = () => {
  return api.request({
    method: 'GET',
    url: `api/iot-park/doorAccess/getDoorAccessInfoOverview`
  })
}

// 门禁验证通过类型情况
export const getDoorAccessInOutForPage = (data) => {
  return api.request({
    method: 'POST',
    url: `api/iot-park/doorAccess/getDoorAccessInOutForPage`,
    data
  })
}
// 报警器今日报警情况分析
export const getAlarmCallTrendStats = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot/alarmCall/getAlarmCallTrendStats`,
    data
  })
}
// 报警器报警消息
export const getAlarmCallRecordForPage = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot/alarmCall/getAlarmCallRecordForPage`,
    data
  })
}
// 报警情况统计结果
export const getAlarmCallStats = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot/alarmCall/getAlarmCallStats`,
    data
  })
}


/** 广播器 **/

// 广播播放今日 广播播放最近七天 广播播放本年度
export const getDeviceAudioLatelyStatistics = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot/multiple/screen/getDeviceAudioLatelyStatistics`,
    data
  })
}

// 广播场景分体统计情况
export const getDeviceAudioSceneStatistics = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot/multiple/screen/getDeviceAudioSceneStatistics`,
    data
  })
}

/** 烟感 **/

// 烟雾浓度当日指标之最趋势分析 温度检测当日指标之最趋势分析
export const getSmokeDetectorTrendStat = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/smoke-detector/getSmokeDetectorTrendStat`,
    data
  })
}

// 烟感设备本年度告警次数统计
export const getSmokeDetectorAlarmStats = (data) => {
  return api.request({
    method: 'POST',
    url: `api/iot-park/smoke-detector/getSmokeDetectorAlarmStats/1`,
    data
  })
}

// 烟感设备告警消息
export const getSmokeDetectorAlarmForPage = (data) => {
  return api.request({
    method: 'POST',
    url: `api/iot-park/smoke-detector/getSmokeDetectorAlarmForPage`,
    data
  })
}

/** LED **/

// LED显示屏今日/本周/今年播放情况分析
export const getLedPlayStats = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/led/getLedPlayStats`,
    data
  })
}

// 显示屏应用场景情况分析
export const getLedprogramTreeLED = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/led/getLedprogramTree`,
    data
  })
}

/** 环境监测 **/

// 今日指标之最趋势分析
export const getAmbientMonitoringTrendStat = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/ambient/getAmbientMonitoringTrendStat`,
    data
  })
}

// 今日指标之最趋势分析 信息总览
export const getAmbientMonitoringInfoAndAlarmOf = () => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/ambient/getAmbientMonitoringInfoAndAlarmOf`,
  })
}

// 今日报警次数分析 年度报警情况分析
export const getAmbientMonitoringAlarmCount = (data) => {
  return api.request({
    method: 'POST',
    url: `api/iot-park/ambient/getAmbientMonitoringAlarmCount`,
    data
  })
}
/** 获取各个设备总数信息 */
export const getDeviceSumStatistics = (data) => {
  return api.request({
    method: 'GET',
    url: `/api/iot/multiple/screen/getDeviceSumStatistics`
  })
}

/* 照明公共信息 */
export const getDeviceLamp = (data) => {
  return api.request({
    method: 'GET',
    url: `/api/iot/multiple/screen/getDeviceLampStatistics/${data}`
  })
}

/* LED公共信息 */
export const getDeviceLed = (data) => {
  return api.request({
    method: 'GET',
    url: `/api/iot/multiple/screen/getDeviceLedStatistics/${data}`
  })
}

/* 烟感公共信息 */
export const getSmokeDetectorStatistics = () => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/smoke-detector/getSmokeDetectorConfirmStatistics`
  })
}

/* 广播器公共信息 */
export const getDeviceAudio = (data) => {
  return api.request({
    method: 'GET',
    url: `/api/iot/multiple/screen/getDeviceAudioStatistics/${data}`
  })
}
 
// 报警在线状态统计
export const getAlarmCallWorkingStats = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot/alarmCall/getAlarmCallWorkingStats`,
    data
  })
}

// 环境监测在线状态统计
export const getAmbientMonitoringRunStatus = () => {
  return api.request({
    method: 'GET',
    url: `api/iot-park/ambient/getAmbientMonitoringRunStatus`,
  })
}

// 摄像头在线状态统计
export const getCameraOnlineState = () => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/camera/getCameraOnlineState`,
  })
}

// 门禁在线状态统计
export const getDoorAccessCurrentStatus = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/doorAccess/getDoorAccessCurrentStatus`,
    data
  })
}

// 烟感在线状态统计
export const getSmokeDetectorCurrentStatus = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/smoke-detector/getSmokeDetectorCurrentStatus`,
    data
  })
}

// 音响在线状态统计
export const getDeviceAudioStatistics = () => {
  return api.request({
    method: 'GET',
    url: '/api/iot/multiple/screen/getDeviceAudioStatistics/AUDIO?dateInterval=6&specialQuery=1'
  })
}

// LED
export const getDeviceLedStatistics = () => {
  return api.request({
    method: 'GET',
    url: '/api/iot/multiple/screen/getDeviceLedStatistics/LED?dateInterval=6&specialQuery=1'
  })
}

// LAMP
export const getDeviceLampStatistics = () => {
  return api.request({
    method: 'GET',
    url: '/api/iot/multiple/screen/getDeviceLampStatistics/LAMP?dateInterval=6&specialQuery=1'
  })
}