import api from 'util/axios'

/** 灯杆设备管理列表 */
export const getTerminalDeviceStatusList = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/terminal/getTerminalDeviceStatusList',
    data
  })
}

/** 获取照明状态 */
export const getLampOnStatus = () => {
  return api.request({
    method: 'GET',
    url: '/api/terminal/getLampStatus'
  })
}

/** 获取灯杆详情 */
export const terminalDetail = (imei) => {
  return api.request({
    method: 'GET',
    url: `/api/terminal/terminalDetail/${imei}`
  })
}

/** 智慧灯杆详情异常 */
export const terminalDetailWarn = (imei) => {
  return api.request({
    method: 'POST',
    url: `/api/terminal/terminalDetailWarn?imei=${imei}`
  })
}


/** 获取智慧灯杆列表 */
export const getTerminalList = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/terminal/getTerminalList`,
    data
  })
}

/** 获取灯杆区域 */
export const getAreaList = (data) => {
  return api.request({
    method: 'GET',
    url: `/api/battery/areaList`,
    data
  })
}

/** 获取灯设备在线、开/关灯状态信息 */
export const getLampWorkStatus = (data) => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/lamp/getLampWorkStatus`,
    data
  })
}

/** 获取灯(分页) */
export const getLampForPage = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/lamp/getLampForPage`,
    data
  })
}

/** 获取灯杆安装的设备以及指令参数 */
export const getDeviceAndCommand = (imei) => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/lamp/getDeviceAndCommand/${imei}`
  })
}

/** 设置设备指令参数 */
export const setDeviceCommand = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/lamp/setDeviceCommand`,
    data
  })
}

/** 设置灯的开关状态 */
export const setLampPower = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/lamp/setLampPower`,
    data
  })
}

/** 导出灯杆运行数据 */
export const exportTerminalInfo = () => {
  return api.request({
    method: 'GET',
    responseType: 'blob',
    type: 1, // 文件类型
    url: `/api/iot-park/lamp/exportTerminalInfo`
  })
}

/** 导出灯杆能耗 */
export const exportConsumptionAnalysis = (num) => {
  return api.request({
    method: 'GET',
    responseType: 'blob',
    type: 1, // 文件类型
    url: `/api/lampStatics/exportConsumptionAnalysis/${num}`
  })
}