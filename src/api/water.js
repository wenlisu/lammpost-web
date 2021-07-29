import api from 'util/axios'

/** 查询水表树 */
export const getWaterMeterSiteTree = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/iot-park/water-meter/getWaterMeterSiteTree',
    data
  })
}

/** 获取当前烟感状态统计 */
export const getWaterMeterCurrentStatus = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/iot-park/water-meter/getWaterMeterCurrentStatus',
    data
  })
}

/** 获取抄表数据 */
export const getMeterReadingData = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/water-meter/getWaterMeterReadingForPage`,
    data
  })
}


/** 获取水表收费记录 */
export const getWaterMeterPayRecordForPage = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/water-meter/getWaterMeterPayRecordForPage`,
    data
  })
}

/** 水表管理 获取水表设备运行状态 */
export const getWaterMeterRunStatus = () => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/water-meter/getWaterMeterRunStatus`
  })
}

/** 水表管理 获取水表设备信息*/
export const getWaterMeterDeviceForPage = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/water-meter/getWaterMeterDeviceForPage`,
    data
  })
}

/** 水表管理 总表分析*/
export const getFatherAndChildrenReading = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/water-meter/getFatherAndChildrenReading`,
    data
  })
}
/** 获取水表详情 */
export const getWaterMeterDeviceDtl = (serialNumber) => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/water-meter/getWaterMeterDeviceDtl/${serialNumber}`
  })
}

/** x水表详情修改*/
export const editWaterMeterDeviceDtl = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/water-meter/editWaterMeterDeviceDtl`,
    data
  })
}

/** 统计分析 楼栋能耗对比分析*/
export const getWaterConsumptionStatsByBuilding = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/water-meter/getWaterConsumptionStatsByBuilding`,
    data
  })
}

/** 收入分析 */
export const getWaterChargeInRevenueStats = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/water-meter/getWaterChargeInRevenueStats`,
    data
  })
}

/** 缴费情况分布图 */
export const getWaterChargePayShapeStats = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/water-meter/getWaterChargePayShapeStats`,
    data
  })
}

/** 收费方式 */
export const getWaterChargePayWayStats = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/water-meter/getWaterChargePayWayStats`,
    data
  })
}

/** 缴费统计 */
export const getWaterChargeStats = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/water-meter/getWaterChargeStats`,
    data
  })
}

/** 缴费月报 */
export const getWaterChargeStatsByMonthForPage = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/water-meter/getWaterChargeStatsByMonthForPage`,
    data
  })
}
/** 设备报警 */
export const getWaterMeterRealTimeAlarm = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/water-meter/getWaterMeterRealTimeAlarm`,
    data
  })
}
/** 设备报警 趋势统计 */
export const getWaterMeterAlarmTrend = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/water-meter/getWaterMeterAlarmTrend`,
    data
  })
}
/** 设备报警 告警状态统计 */
export const getWaterMeterConfirmStatistics = () => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/water-meter/getWaterMeterConfirmStatistics`
  })
}

/** 导出 */
export const exportWaterChargeStatsByMonth = () => {
  return api.request({
    method: 'GET',
    responseType: 'blob',
    type: 1, // 文件类型
    url: `/api/iot-park/water-meter/exportWaterChargeStatsByMonth`
  })
}

/** 设备报警 告警状态统计 */
export const getWaterChargeAlarm = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/water-meter/getWaterChargeAlarm`,
    data
  })
}

/** 设备报警 告警状态统计 */
export const getFloorInfo = (nodeCode) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/water-meter/getFloorInfo/${nodeCode}`,
  })
}

/** 远程抄表 */
export const remoteMeterReading = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/water-meter/remoteMeterReading`,
    data
  })
}

/** 72小时用水量分析 */
export const getRecentRealWaterConsumption = (serialNumber) => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/water-meter/getRecentRealWaterConsumption/${serialNumber}`
  })
}
