import api from 'util/axios'

/** 获取环境监控地图 */
export const getAmbientMonitoringMap = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/iot-park/ambient/getAmbientMonitoringMap',
    data
  })
}

/** 获取环境监控设备详情 */
export const getAmbientMonitoringDtl = (serialNumber) => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/ambient/getAmbientMonitoringDtl/${serialNumber}`
  })
}

/** 获取环境监控设备运行状态 */
export const getAmbientMonitoringRunStatus = () => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/ambient/getAmbientMonitoringRunStatus`
  })
}

/** 获取环境监控设备统计 */
export const getAmbientMonitoringStat = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/ambient/getAmbientMonitoringStat`,
    data
  })
}

/** 获取环境监测统计趋势 */
export const getAmbientMonitoringTrendStat = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/ambient/getAmbientMonitoringTrendStat`,
    data
  })
}

/** 获取环境监测设备的最新数据(分页) */
export const getLastAmbientReportDataForPage = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/ambient/getLastAmbientReportDataForPage`,
    data
  })
}

/** 获取环境监测设备详情 */
export const getAmbientMonitoringDeviceDtl = (serialNumber) => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/ambient/getAmbientMonitoringDeviceDtl/${serialNumber}`
  })
}

/** 环境变化趋势分析 */
export const getAmbientMonitoringHistoryTrendStat = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/ambient/getAmbientMonitoringHistoryTrendStat`,
    data
  })
}

/** 环境数据上报记录(分页) */
export const getAmbientMonitoringRecord = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/ambient/getAmbientMonitoringRecord`,
    data
  })
}

/** 获取环境监控报警处理数量情况 */
export const getAmbientMonitoringAlarmHandleCount = (data) => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/ambient/getAmbientMonitoringAlarmHandleCount`,
    data
  })
}

/** 报警事件数据（分页） */
export const getAmbientMonitoringAlarmEventForPage = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/ambient/getAmbientMonitoringAlarmEventForPage`,
    data
  })
}

/** 获取报警次数统计 */
export const getAmbientMonitoringAlarmCount = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/ambient/getAmbientMonitoringAlarmCount`,
    data
  })
}

/** 批量处理环境监控报警 */
export const handleAmbientMonitoringAlarm = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/ambient/handleAmbientMonitoringAlarm`,
    data
  })
}

/** saveAmbientMonitoringThreshold */
export const saveAmbientMonitoringThreshold = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/ambient/saveAmbientMonitoringThreshold`,
    data
  })
}

/** 获取环境监控设备（分页） */
export const getAmbientMonitoringDeviceForPage = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/ambient/getAmbientMonitoringDeviceForPage`,
    data
  })
}
