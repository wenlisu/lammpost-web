import api from 'util/axios'

/** 充电桩所属位置 */
export const addressList = (address) => {
  return api.request({
    method: 'GET',
    url: `/api/battery/addressList?address=${address}`
  })
}
/** 充电营业收入 */
export const batteryBusinessIncome = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/battery/batteryBusinessIncome',
    data
  })
}
/** 总收入趋势 */
export const batteryBusinessTotal = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/battery/batteryBusinessTotal',
    data
  })
}
/** 获取充电桩详情 */
export const batteryDetail = (data) => {
  return api.request({
    method: 'GET',
    url: '/api/battery/batteryDetail',
    data
  })
}
/** 充电桩故障率 */
export const batteryFailureRate = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/battery/batteryFailureRate',
    data
  })
}
/** 充电监控详情基础信息 */
export const batteryMonitorDetail = (serialNumber) => {
  return api.request({
    method: 'GET',
    url: `/api/battery/batteryMonitorDetail?serialNumber=${serialNumber}`
  })
}
/** 充电监控详桩充电状态信息 */
export const batteryStatusMonitorDetail = (serialNumber) => {
  return api.request({
    method: 'GET',
    url: `/api/battery/batteryStatusMonitorDetail?serialNumber=${serialNumber}`
  })
}
/** 充电桩充电历史记录 */
export const batteryMonitorHistory = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/battery/batteryMonitorHistory',
    data
  })
}
/** 充电桩功率 */
export const batteryPowerIndex = () => {
  return api.request({
    method: 'POST',
    url: '/api/battery/batteryPowerIndex'
  })
}
/** 充电桩服务统计 */
export const batteryServiceStatistics = () => {
  return api.request({
    method: 'POST',
    url: '/api/battery/batteryServiceStatistics'
  })
}
/** 充电桩前10 */
export const batteryTop10Dto = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/battery/batteryTop10Dto'
  })
}
/** 获取总充电量Top10充电桩 */
export const getBattery = (data) => {
  return api.request({
    method: 'GET',
    url: '/api/battery/getBattery'
  })
}
/** 获取充电桩地图统计数据 */
export const getBatteryCount = (data) => {
  return api.request({
    method: 'GET',
    url: '/api/battery/getBatteryCount'
  })
}
/** 获取充电桩地图 */
export const batteryInfo = (data) => {
  return api.request({
    method: 'GET',
    url: '/api/battery/info'
  })
}
/** 充电监控列表 */
export const batteryList = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/battery/list',
    data
  })
}
/** 查询道路充电桩信息 */
export const queryBattery = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/battery/queryBattery',
    data
  })
}
