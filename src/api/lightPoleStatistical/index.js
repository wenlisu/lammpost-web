import api from 'util/axios'

/** 统计灯杆的故障次数排名 */
export const lampFault = () => {
  return api.request({
    method: 'GET',
    url: `/api/lampStatics/fault`
  })
}
/** 照明亮度级别分析 */
export const lampLight = () => {
  return api.request({
    method: 'GET',
    url: `/api/lampStatics/light`
  })
}
/** 照明亮度占比 */
export const getLampBrightnessCount = () => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/lamp/getLampBrightnessCount`
  })
}
/** 统计灯杆每月的节能用电与总用耗电 */
export const lampSaving = () => {
  return api.request({
    method: 'GET',
    url: `/api/lampStatics/saving`
  })
}
/** 能耗分析 */
export const getLampEnergyAnalysis = () => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/lamp/getLampEnergyAnalysis`
  })
}
/** 统计灯杆每月的工作率与故障率 */
export const lampWork = () => {
  return api.request({
    method: 'GET',
    url: `/api/lampStatics/work`
  })
}

/**  灯杆月度统计 */
export const lampMonthlyStatistics = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/lampStatics/lapMonthlyStatistics',
    data
  })
}

/**  灯杆日统计 */
export const lampDayStatistics = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/lampStatics/lapDayStatistics',
    data
  })
}

/**  设备信息 */
export const generalView = () => {
  return api.request({
    method: 'GET',
    url: '/api/screen/generalView',
  })
}