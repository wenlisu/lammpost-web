import api from 'util/axios'

/** 前台获取wifi在线,离线总数 */
export const queryWifiInfo = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/iot-park/wifi/queryWifiInfo',
    data
  })
}

/** 后台管理获取wifi在线,离线总数 */
export const queryBKWifiInfo = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/iot-park/wifi/queryBKWifiInfo',
    data
  })
}

/** 获取wifi列表分页 */
export const queryWifiList = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/iot-park/wifi/queryWifiList',
    data
  })
}

/** AP流量统计 */
export const queryWifiApLoad = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/iot-park/wifi/queryWifiApLoad',
    data
  })
}

/** wifi设备分组 */
export const queryWifiGroup = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/iot-park/wifi/queryWifiGroup',
    data
  })
}

/** wifi负载统计 */
export const queryWifiApLoadStat = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/iot-park/wifi/queryWifiApLoadStat',
    data
  })
}

/** wifi负载统计 */
export const queryWifiWarn = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/iot-park/wifi/queryWifiWarn',
    data
  })
}

/** wifi流量统计排名 */
export const queryWifiFlowRank = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/iot-park/wifi/queryWifiFlowRank',
    data
  })
}

/** 地图上的设备 */
export const queryWifiMapInfo = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/iot-park/wifi/queryWifiMapInfo',
    data
  })
}

/** 单个设备信息 */
export const queryWifiInfoById = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/iot-park/wifi/queryWifiInfoById',
    data
  })
}

/** 导出 */
export const exportWifiInfo = () => {
  return api.request({
    method: 'GET',
    responseType: 'blob',
    type: 1, // 文件类型
    url: '/api/iot-park/wifi/exportWifiInfo',
  })
}