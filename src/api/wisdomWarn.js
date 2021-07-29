import api from 'util/axios'
// 智慧报警

/** 获取前50列表告警信息列表 */
export const getAlarmInfoList = (data) => {
    return api.request({
        method: 'POST',
        url: '/api/iot/hik/device/alarmInfo',
        data
    })
}

/** 设备信息获取 */
export const getDeviceInfo = (data) => {
    return api.request({
        method: 'POST',
        url: '/api/iot/hik/device/DeviceInfo',
        data
    })
}

/** 告警信息扇形统计 */
export const getAlarmInfoCount = (data) => {
    return api.request({
        method: 'POST',
        url: '/api/iot/hik/device/alarmInfoCount',
        data
    })
}


/**  告警信息次数统计 */
export const getAlarmInfoTop = (data) => {
    return api.request({
        method: 'POST',
        url: '/api/iot/hik/device/alarmInfoTop',
        data
    })
}

/**  地区告警统计 */
export const getAlarmPosition = (data) => {
    return api.request({
        method: 'POST',
        url: '/api/iot/hik/device/getAlarmPosition',
        data
    })
}