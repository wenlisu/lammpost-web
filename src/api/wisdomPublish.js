import api from 'util/axios'
// 智慧发布LED屏

/** led半年数据分析 */
export const getLedDisplayCountInfo = (data) => {
    return api.request({
        method: 'GET',
        url: '/api/iot-park/led/map/LedDisplayCountDto',
        data
    })
}

/** led应用场景分析 */
export const getLedApplyInfo = (data) => {
    return api.request({
        method: 'GET',
        url: '/api/iot-park/led/map/getLedApply',
        data
    })
}

