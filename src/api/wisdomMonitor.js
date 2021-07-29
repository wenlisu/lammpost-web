import api from 'util/axios'

/** 获取告警列表 */
export const getInstantWarnList = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/instantWarn/list',
    data
  })
}

/** 获取近一个月告警次数排名与数量趋势 */
export const getRankAndTrend = () => {
  return api.request({
    method: 'GET',
    url: '/api/instantWarn/getRankAndTrend'
  })
}

/** 工单管理 */
export const getWorkOrderMgt = (alarmNo) => {
  return api.request({
    method: 'GET',
    url: `/api/instantWarn/workOrderMgt?alarmNo=${alarmNo}`
  })
}

/** 获取智慧报警列表 */
export const getEmergencyList = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/emergency/list',
    data
  })
}

/** 获取智慧报警详情-历史报警记录 */
export const getHistoryRecord = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/emergency/historyRecord',
    data
  })
}

/** 获取智慧报警详情 */
export const getEmergencyDetail = (emergencyNumber) => {
  return api.request({
    method: 'GET',
    url: `/api/emergency/detail?emergencyNumber=${emergencyNumber}`
  })
}

/** 智慧WIFI */
/** 获取实时客流分析 */
export const flowAnalysis = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/wifi/flowAnalysis',
    data
  })
}

/** 获取WIFI设备管理列表 */
export const apDeviceMgt = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/wifi/apDeviceMgt',
    data
  })
}

/** 用户流量分析-用户记录列表 */
export const userRecord = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/wifi/userRecord',
    data
  })
}


/** 用户流量分析-今日各时段流量趋势分析 */
export const todayAnalysis = (data) => {
  return api.request({
    method: 'GET',
    url: '/api/wifi/todayAnalysis',
    data
  })
}

/** 流量分析用户详情-用户流量统计 */
export const userTodayAnalysis = (userMac) => {
  return api.request({
    method: 'GET',
    url: `/api/wifi/userTodayAnalysis?userMac=${userMac}`
  })
}

/** 流量分析用户详情-用户最新记录 */
export const latestRecordDetail = (userMac) => {
  return api.request({
    method: 'POST',
    url: `/api/wifi/latestRecordDetail?userMac=${userMac}`
  })
}

/** 报警设备地图 */
export const getAlarmCallMap = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot/alarmCall/getAlarmCallMap`,
    data
  })
}

/** 报警情况统计结果 */
export const getAlarmCallStats = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot/alarmCall/getAlarmCallStats`,
    data
  })
}

/** 报警设备运行状态统计结果 */
export const getAlarmCallWorkingStats = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot/alarmCall/getAlarmCallWorkingStats`,
    data
  })
}

/** 记录警情 */
export const saveAlarmCallRecord = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot/alarmCall/saveAlarmCallRecord`,
    data
  })
}

/** 报警次数趋势分析 */
export const getAlarmCallTrendStats = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot/alarmCall/getAlarmCallTrendStats`,
    data
  })
}


/** 获取报警记录 */
export const getAlarmCallRecordForPage = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot/alarmCall/getAlarmCallRecordForPage`,
    data
  })
}

/** 获取报警详情 */
export const getAlarmCallDtl = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot/alarmCall/getAlarmCallDtl`,
    data
  })
}

/** 插入一键报警详情信息 */
export const saveAlarmCallHandleRecord = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot/alarmCall/saveAlarmCallHandleRecord`,
    data
  })
}

/** 根据详情编号删除一条报警详情 */
export const deleteAlarmInfo = (data) => {
  return api.request({
    method: 'DELETE',
    url: `/api/iot/alarmCall/deleteAlarmCallHandleRecordByAlarmDetailsCode/${data}`
  })
}

/** 根据一键报警事件id获取一键报警详情 */
export const getAlarmInfo = (data) => {
  return api.request({
    method: 'GET',
    url: `/api/iot/alarmCall/getAlarmCallHandleRecordListByAlarmEventId/${data}`
  })
}

/** 根据事件id获取报警信息 */
export const getAlarmCallByEventId = (eventId) => {
  return api.request({
    method: 'GET',
    url: `/api/iot/alarmCall/getAlarmCallByEventId/${eventId}`
  })
}

// 摄像头设备地图
export const getCameraMap = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/camera/getCameraMap`,
    data
  })
}

// 摄像头概览信息
export const getCameraOnlineState = (data) => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/camera/getCameraOnlineState`
  })
}

// 监控列表信息
export const getCameraAlarmList = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/camera/getCameraAlarmList`,
    data
  })
}

// 监控视频预览地址
export const getCameraURLList = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/camera/getCameraURLList`,
    data
  })
}
