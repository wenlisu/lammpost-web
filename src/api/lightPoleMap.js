import api from 'util/axios'


/** 获取灯杆地图统计数据 */
export const getTerminalCount = () => {
  return api.request({
    method: 'GET',
    url: '/api/terminal/getTerminalCount'
  })
}

/** 获取灯杆地图 */
export const getInfo = () => {
  return api.request({
    method: 'GET',
    url: '/api/terminal/info'
  })
}

/** 获取总耗电量前十道路 */
export const getRoad = () => {
  return api.request({
    method: 'GET',
    url: '/api/terminal/getRoad'
  })
}

/** 查询道灯杆杆信息 */
export const queryTerminal = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/terminal/queryTerminal',
    data
  })
}

/** 获取灯杆简略信息 */
export const getBriefInfo = (imei) => {
  return api.request({
    method: 'get',
    url: `/api/terminal/getBriefInfo?imei=${imei}`
  })
}

/** 获取灯杆详情 */
export const terminalDetail = (imei) => {
  return api.request({
    method: 'GET',
    url: '/api/terminal/terminalDetail',
    data: imei
  })
}

// 充电桩
/** 获取充电桩地图 */
export const getBatteryInfo = () => {
  return api.request({
    method: 'GET',
    url: '/api/battery/info'
  })
}

/** 获取充电桩地图统计数据 */
export const getBatteryCount = () => {
  return api.request({
    method: 'GET',
    url: '/api/battery/getBatteryCount'
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
