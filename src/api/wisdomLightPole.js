import api from 'util/axios'
// 智慧灯杆

/** 左侧设备能耗统计 */
export const getLampPowerWastingInfo = (data) => {
    return api.request({
        method: 'GET',
        url: '/api/iot-park/lamp/getLampPowerWastingInfo',
        data
    })
}

/** 获取灯基本信息 */
export const getLampBriefInfoList = (data) => {
    return api.request({
        method: 'GET',
        url: '/api/iot-park/lamp/getLampBriefInfoList',
        data
    })
}


/** 获取灯在线率统计 */
export const getLampUsageRateList = (data) => {
    return api.request({
        method: 'GET',
        url: '/api/iot-park/lamp/getLampUsageRateList',
        data
    })
}

/** 获取灯地区分布数量 */
export const getLampAreaCountStatisticsList = (data) => {
    return api.request({
        method: 'GET',
        url: '/api/iot-park/lamp/getLampAreaCountStatisticsList',
        data
    })
}