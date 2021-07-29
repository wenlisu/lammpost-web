import api from 'util/axios'

/** 新增/编辑播放任务 */
export const editAudioPlayTask = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/iot-park/audio/editAudioPlayTask',
    data
  })
}

/** 获取播控设备列表 */
export const getAudioList = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/iot-park/audio/getAudioList',
    data
  })
}

/** 获取播放任务列表 */
export const getTerminalDeviceStatusList = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/iot-park/audio/getAudioPlayTaskForPage',
    data
  })
}

/** 获取播放任务详情 */
export const getAudioPlayTaskDtl = (taskCode) => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/audio/getAudioPlayTaskDtl/${taskCode}`
  })
}


/** 设置任务禁用/启用 */
export const setTaskDisable = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/iot-park/audio/setTaskDisable',
    data
  })
}

/** 设置任务播放/停止 */
export const setTaskPlayStop = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/iot-park/audio/setTaskPlayStop',
    data
  })
}

/** 播控设备地图界面统计信息获取 */
export const getAudioInformationCount = () => {
  return api.request({
    method: 'GET',
    url: '/api/iot-park/audio/getAudioInformationCount'
  })
}

/** 播控设备地图界面统计信息获取 */
export const getAudioDeviceMapInfo = () => {
  return api.request({
    method: 'GET',
    url: '/api/iot-park/audio/getAudioDeviceMapInfo'
  })
}

/** 获取播控设备详情 */
export const getAudioDeviceDtl = (serialNumber) => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/audio/getAudioDeviceDtl/${serialNumber}`
  })
}

/** 设置音量 */
export const setVolume = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/iot-park/audio/setVolume',
    data
  })
}

/** 根据任务编号批量删除任务信息 */
export const removeAudioPlayTaskByTaskCode = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/iot-park/audio/removeAudioPlayTaskByTaskCode',
    data
  })
}

/** 根据序列号设置开关 */
export const updateDeviceStatus = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/audio/updateDeviceStatus?status=${data.status}&serialNumber=${data.serialNumber}`
  })
}

/** 设置开关 */
export const setPlay = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/iot-park/audio/setPlay',
    data
  })
}

/** 根据设备序列号获取最近的一条播放任务详情 */
export const getAudioPlayTaskByLastTime = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/audio/getRealTimeTask`,
    data
  })
}

/** 根据设备序列号获取最近的一条播放任务详情 */
export const addmediadata = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/php/addmediadata.php`,
    data
  })
}
/** 根据任务模板编号获取模板详情 */
export const getTaskTemplateInfo = (templateCode) => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/audio/getTaskTemplateInfo/${templateCode}`
  })
}


/** 获取广播器播放次数排名 */
export const getAudioPlayCountRank = (templateCode) => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/audio/audioPlayCountRank`
  })
}