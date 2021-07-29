import api from 'util/axios'

/** 充电桩人数耗电量 */
export const screenBatteryByWeekAvg = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/screen/screenBatteryByWeekAvg',
    data
  })
}

/** 照明灯状态指标 */
export const screenDayLampByWeek = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/screen/screenDayLampByWeek',
    data
  })
}
/** 能耗指标 */
export const screenEnergyConsump = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/screen/screenEnergyConsump',
    data
  })
}
/** 大气，温度，湿度,噪音 */
export const screenHourIndex = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/screen/screenHourIndex',
    data
  })
}
/** 当前平均pm */
export const screenOneHourAvgPm = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/screen/screenOneHourAvgPm',
    data
  })
}
/** 大屏地图统计信息 */
export const screenStatisticsDtoMap = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/screen/screenStatisticsDtoMap',
    data
  })
}
/** 温度，湿度 */
export const screenTemperatureAndHumidity = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/screen/screenTemperatureAndHumidity',
    data
  })
}
/** 大屏地图灯杆 */
export const screenTerminalListMap = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/screen/screenTerminalListMap',
    data
  })
}

/** LED灯管理 */
/** LED灯添加播放节目 */
export const addLedIotPark = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/iot-park/led/add',
    data
  })
}

export const updateLedIotPark = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/iot-park/led/updateLedSettingControl',
    data
  })
}

/** 下发指令设置LED屏幕 */
export const settingLed = (serialNumber, data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/led/settingLed/${serialNumber}`,
    data
  })
}

/** LED一键控屏开关属性回显 */
export const selectLedSetting = (imei) => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/led/selectLedSetting/${imei}`
  })
}

/** LED一键控屏播放节目回显数据 */
export const selectRunningLedProgram = (imei) => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/led/selectRunningLedProgram/${imei}`
  })
}

/** LED屏幕修改播放节目 */
export const updateProgramCode = (data, programCode) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/led/update/${programCode}`,
    data
  })
}

/** LED节目模板列表获取 */
export const getScreenTemplate = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/led/template/get`,
    data
  })
}

/** LED播放节目获取详情 */
export const selectLedProgramDetail = (programCode) => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/led/selectLedProgramDetail/${programCode}`
  })
}

/** 分页查询LED播放任务 */
export const getLed = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/led/get`,
    data
  })
}

/** LED设备地图信息获取 */
export const getLedMap = () => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/led/map/get`
  })
}

/** LED设备地图界面统计信息获取 */
export const getLedDeviceCount = () => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/led/map/getLedDeviceCount`
  })
}

/** 获取播放统计失败 */
export const getLedPlayStats = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/led/getLedPlayStats`,
    data
  })
}

/** LED播放任务树结构查询 */
export const getLedprogramTree = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/led/getLedprogramTree`,
    data
  })
}

/** LED播放任务删除 */
export const deleteLed = (programCode) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/led/delete/${programCode}`
  })
}

/** LED节目模板删除 */
export const deleteNewTemplate = (programCode) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/led/template/delete?programCode=${programCode}`
  })
}

/** 获取设备实时告警趋势数 */
export const getDeviceRealTimeAlarmTrendCount = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/screen/getDeviceRealTimeAlarmTrendCount`,
    data
  })
}

/** 摄像头设备地图 */
export const getCameraMap = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/screen/getCameraMap`,
    data
  })
}

/** 获取萤石云实时token */
export const getAccessToken = (data) => {
  return api.request({
    method: 'GET',
    url: `/api/screen/getAccessToken`
  })
}


