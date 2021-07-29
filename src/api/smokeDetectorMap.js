import api from 'util/axios'

/** 获取烟感设备分页信息 */
export const getSmokeDetectorAlarmByCondition = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/iot-park/smoke-detector/getSmokeDetectorAlarmByCondition',
    data
  })
}

/** 获取烟感报警信息分页 */
export const getSmokeDetectorAlarmForPage = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/iot-park/smoke-detector/getSmokeDetectorAlarmForPage',
    data
  })
}


/** 查询烟感设备分布情况 */
export const getSmokeDetectorArrange = (data) => {
  return api.request({
    method: 'GET',
    url: '/api/iot-park/smoke-detector/getSmokeDetectorArrange'
  })
}

/** 报警确认统计 */
export const getSmokeDetectorConfirmStatistics = (data) => {
  return api.request({
    method: 'GET',
    url: '/api/iot-park/smoke-detector/getSmokeDetectorConfirmStatistics'
  })
}

/** 获取烟感设备分页信息 */
export const getSmokeDetectorDeviceForPage = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/iot-park/smoke-detector/getSmokeDetectorDeviceForPage',
    data
  })
}

/** 烟感设备实时告警 */
export const getSmokeDetectorRealTimeAlarm = (data) => {
  return api.request({
    method: 'GET',
    url: '/api/iot-park/smoke-detector/getSmokeDetectorRealTimeAlarm'
  })
}

/** 获取烟感设备运行状态 */
export const getSmokeDetectorRunStatus = (data) => {
  return api.request({
    method: 'GET',
    url: '/api/iot-park/smoke-detector/getSmokeDetectorRunStatus'
  })
}

/** 查询烟感分布区域树 */
export const getSmokeDetectorSiteTree = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/iot-park/smoke-detector/getSmokeDetectorSiteTree',
    data
  })
}

/** 获取烟感设备报警趋势 */
export const getSmokeDetectorTrend = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/smoke-detector/getSmokeDetectorTrend`,
    data
  })
}

/** 获取烟感故障率和告警分析 */
export const getSmokeDetectorAlarmAndFaultStats = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/smoke-detector/getSmokeDetectorAlarmAndFaultStats`,
    data
  })
}

/** 获取烟感故障率和告警分析 */
export const getFireAccessStats = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/smoke-detector/getFireAccessStats`,
    data
  })
}

/** 清理烟感设备报警 */
export const clearSmokeDetectorAlarm = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/smoke-detector/clearSmokeDetectorAlarm`,
    data
  })
}

/** 获取告警级别字典 */
export const getSmokeDetectorAlarmLevel = (data) => {
  return api.request({
    method: 'GET',
    url: '/api/iot-park/smoke-detector/getSmokeDetectorAlarmLevel'
  })
}

/** 获取告警状态字典 */
export const getSmokeDetectorAlarmStatus = (data) => {
  return api.request({
    method: 'GET',
    url: '/api/iot-park/smoke-detector/getSmokeDetectorAlarmStatus'
  })
}

/** 获取在线状态字典 */
export const getSmokeDetectorOnLineStatus = (data) => {
  return api.request({
    method: 'GET',
    url: '/api/iot-park/smoke-detector/getSmokeDetectorOnLineStatus'
  })
}

/** 获取告警类型字典 */
export const getSmokeDetectorAlarmType = (data) => {
  return api.request({
    method: 'GET',
    url: '/api/iot-park/smoke-detector/getSmokeDetectorAlarmType'
  })
}

/** 查看告警分布情况 */
export const getSmokeDetectorFaultDistributed = (data) => {
  return api.request({
    method: 'GET',
    url: '/api/iot-park/smoke-detector/getSmokeDetectorFaultDistributed'
  })
}


/** 实时监控 */
/** 获取烟感设备当前状态 */
export const getSmokeDetectorCurrentStatus = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/smoke-detector/getSmokeDetectorCurrentStatus`,
    data
  })
}

/** 获取烟感设备报警最新工单(分页) */
export const getSmokeDetectorWorkOrderForPage = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/smoke-detector/getSmokeDetectorWorkOrderForPage`,
    data
  })
}

/** 获取清理烟感设备报警日志(分页) */
export const getSmokeDetectorClearAlarmLogForPage = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/smoke-detector/getSmokeDetectorClearAlarmLogForPage`,
    data
  })
}

/** 获取烟感设备信息详情 */
export const getSmokeDetectorDeviceDtl = (serialNumber) => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/smoke-detector/getSmokeDetectorDeviceDtl/${serialNumber}`
  })
}

/** 查询当天具体设备的报警数据趋势 */
export const getSmokeDetectorTodayAlarmStats = (serialNumber) => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/smoke-detector/getSmokeDetectorTodayAlarmStats/${serialNumber}`
  })
}

/** 查询当天具体设备指标数据趋势 */
export const getSmokeDetectorTodayStats = (serialNumber) => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/smoke-detector/getSmokeDetectorTodayStats/${serialNumber}`
  })
}

/** 获取烟感设备最终的报警信息 */
export const getSmokeDetectorFinalAlarm = (serialNumber, alarmNo) => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/smoke-detector/getSmokeDetectorFinalAlarm/${serialNumber}${alarmNo ? '/' + alarmNo : ''}`
  })
};

/** 获取消防安全人员 */
export const getFireControlSecurity = (serialNumber) => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/smoke-detector/getFireControlSecurity`
  })
};

/** 查询具体设备的报警数据趋势 */
export const getSmokeDetectorAlarmStats = (data, serialNumber) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/smoke-detector/getSmokeDetectorAlarmStats/${serialNumber}`,
    data
  })
}

/** 获取烟感设备报警工单 */
export const getSmokeDetectorWorkOrder = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/smoke-detector/getSmokeDetectorWorkOrder`,
    data
  })
}

/** getSmokeDetectorInBuilding */
export const getSmokeDetectorInBuilding = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/smoke-detector/getSmokeDetectorInBuilding`,
    data
  })
}

/** getSmokeDetectorDevice */
export const getSmokeDetectorDevice = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/smoke-detector/getSmokeDetectorDevice`,
    data
  })
}

/** 保存获取消防预案记录 */
export const saveFireControlPlanRecord = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/smoke-detector/saveFireControlPlanRecord`,
    data
  })
}

/** 获取消防预案 */
export const getFireControlPlan = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/smoke-detector/getFireControlPlan`,
    data
  })
}

/** 获取火警消防预案记录 */
export const getFireControlPlanRecord = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/smoke-detector/getFireControlPlanRecord`,
    data
  })
}

/** 获取烟感告警字典 */
export const getSmokeDetectorAlarmEnum = () => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/smoke-detector/getSmokeDetectorAlarmEnum`
  })
}

/** 获取烟感的平均值、最大值、最小值数据趋势 */
export const getSmokeDetectorTrendStat = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/smoke-detector/getSmokeDetectorTrendStat`,
    data
  })
}

/** 获取烟感的平均值、最大值、最小值数据 */
export const getSmokeDetectorAvgData = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/smoke-detector/getSmokeDetectorAvgData`,
    data
  })
}


/** 查询所有设备的报警数据趋势 */
export const getAllSmokeDetectorAlarmStats = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/smoke-detector/getAllSmokeDetectorAlarmStats`,
    data
  })
}

// 场景联动
/** 联动设备数量统计 */
export const getDeviceCount = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/linkage/getDeviceCount`,
    data
  })
}

/** 获取联动设备信息 */
export const getLinkageDeviceDetails = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/linkage/getLinkageDeviceDetails`,
    data
  })
}

/** 获取联动人员信息 */
export const getLinkagePersonInfoDetails = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/linkage/getLinkagePersonInfoDetails`,
    data
  })
}

/** 烟感设备实时告警事件 */
export const getSmokeAlarmEvent = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/linkage/getSmokeAlarmEvent`,
    data
  })
}
/** 烟感设备实时告警事件 */
// export const getLinkageEventEnums = (data) => {
//   return api.request({
//     method: 'POST',
//     url: `/api/iot-park/linkage/getLinkageEventEnums`,
//     data
//   })
// }
/** 获取场景联动列表 */
export const getSceneLinkageList = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/linkage/getSceneLinkageList`,
    data
  })
}

/** 通过场景联动编码获取详情 */
export const getSceneLinkageInfo = (data) => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/linkage/getSceneLinkageInfo/${data.linkageCode}`
  })
}

/** 插入/修改一条场景联动信息 */
export const editSceneLinkageInfo = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/linkage/editSceneLinkageInfo`,
    data
  })
}

/** 获取联动设备类型集合 */
export const getLinkageDeviceEnums = (eventTypeCode) => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/linkage/getLinkageDeviceEnums/${eventTypeCode}`
  })
}


/** 获取联动事件类型集合 */
export const getLinkageEventEnums = (data) => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/linkage/getLinkageEventEnums`
  })
}

/** 获取任务模板列表 */
export const getTaskTemplatePage = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/linkage/getTaskTemplatePage`,
    data
  })
}

/** 删除场景联动信息 */
export const removeSceneLinkage = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/linkage/removeSceneLinkage`,
    data
  })
}

/** 获取摄像头告警事件枚举 */
export const getCameraAlarmEventEnum = () => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/camera/getCameraAlarmEventEnum`
  })
}

/** 获取监控报警列表 */
export const getCameraAlarmList = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/camera/getCameraAlarmList`,
    data
  })
}

/** 获取监控事件列表 */
export const getCameraEventPage = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/camera/getCameraEventPage`,
    data
  })
}

/** 获取摄像头报警事件信息统计 */
export const getCameraEventStat = () => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/camera/getCameraEventStat`
  })
}

/** 获取摄像头视频地址 */
export const getCameraURLList = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/camera/getCameraURLList`,
    data
  })
}
