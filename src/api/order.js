import api from 'util/axios'

export const getWorkOrderStatistics = () => {
    return api.request({
        method: 'GET',
        url: '/api/iot-park/workOrder/getWorkOrderStatistics'
    })
}

export const getWorkOrderForPage = (data) => {
    return api.request({
        method: 'POST',
        url: '/api/iot-park/workOrder/getWorkOrderForPage',
        data
    })
}
// 工单级别
export const getWorkOrderLevel = () => {
    return api.request({
        method: 'GET',
        url: '/api/iot-park/workOrder/getWorkOrderLevel'
    })
}

// 工单类型
export const getWorkOrderType = () => {
    return api.request({
        method: 'GET',
        url: '/api/iot-park/workOrder/getWorkOrderType'
    })
}
 
// 超时状态
export const getWorkOrderDelayStatus = () => {
    return api.request({
        method: 'GET',
        url: '/api/iot-park/workOrder/getWorkOrderDelayStatus'
    })
}

// 工单状态
export const getWorkOrderStatus = () => {
    return api.request({
        method: 'GET',
        url: '/api/iot-park/workOrder/getWorkOrderStatus'
    })
}

// 受理工单
export const doAccept = (data) => {
    return api.request({
        method: 'POST',
        url: `/api/iot-park/workOrder/doAccept?orderNo=${data}`,
    })
}

// 退回工单
export const doBack = (data) => {
    return api.request({
        method: 'POST',
        url: '/api/iot-park/workOrder/doBack',
        data
    })
}

// 关闭工单
export const doClose = (data) => {
    return api.request({
        method: 'POST',
        url: '/api/iot-park/workOrder/doClose',
        data
    })
}
// 完成工单
export const doFinish = (data) => {
    return api.request({
        method: 'POST',
        url: '/api/iot-park/workOrder/doFinish',
        data
    })
}

// 加急工单
export const doUrgent = (data) => {
    return api.request({
        method: 'POST',
        url: `/api/iot-park/workOrder/doUrgent?orderNo=${data}`
    })
}

// 指派
export const doNext = (data) => {
    return api.request({
        method: 'POST',
        url: '/api/iot-park/workOrder/doNext',
        data
    })
}

// 获取指派人

export const getWorkOrderGroupUser = (data) => {
    return api.request({
        method: 'POST',
        url: '/api/iot-park/workOrder/getWorkOrderGroupUser',
        data
    })
}

// 工单详情
export const getWorkOrderDetail = (orderNo) => {
    return api.request({
        method: 'GET',
        url: `/api/iot-park/workOrder/getWorkOrderDetail/${orderNo}`,
    })
}

// 创建工单 
export const editWorkOrder = (data) => {
    return api.request({
        method: 'POST',
        url: `/api/iot-park/workOrder/editWorkOrder`,
        data
    })
}

// 告警列表 
export const getAlarmRecordForPage = (data) => {
    return api.request({
        method: 'POST',
        url: `/api/iot/wechat/task/getAlarmRecordForPage`,
        data
    })
}

// 我的任务
export const getMyWorkOrderForPage = (data) => {
    return api.request({
        method: 'POST',
        url: `/api/iot-park/workOrder/getMyWorkOrderForPage`,
        data
    })
}

// 人员管理 
export const getWorkOrderGroupUserForPage = (data) => {
    return api.request({
        method: 'POST',
        url: `/api/iot-park/workOrder/getWorkOrderGroupUserForPage`,
        data
    })
}

// 删除人员 
export const deleteWorkOrderGroup = (data) => {
    return api.request({
        method: 'POST',
        url: `/api/iot-park/workOrder/deleteWorkOrderGroup`,
        data
    })
}
// 新增，编辑人员
export const editWorkOrderGroup = (data) => {
    return api.request({
        method: 'POST',
        url: `/api/iot-park/workOrder/editWorkOrderGroup`,
        data
    })
}