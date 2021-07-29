import api from 'util/axios'
import { objToUrl } from '@/util/util';

/** 分页查询组策略 */
export const policy = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/lampGroup/get/policy',
    data
  })
}

/** 删除组策略 */
export const deletePolicy = (id) => {
  return api.request({
    method: 'POST',
    url: `/api/lampGroup/delete/group/policy?id=${id}`
  })
}

/** 获取组策略详情 */
export const getPolicyDetail = (groupNo) => {
  return api.request({
    method: 'POST',
    url: `/api/lampGroup/getDetail/group/policy?groupNo=${groupNo}`
  })
}

/** 增加组策略 */
export const addPolicy = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/lampGroup/add/group/policy',
    data
  })
}

/** 更新组策略 */
export const updatePolicy = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/lampGroup/update/group/policy',
    data
  })
}

/** 根据区域获取组灯位置 */
export const getAddress = (data) => {
  return api.request({
    method: 'GET',
    url: `/api/lampGroup/getArea?area=${data.area}&address=${data.address}`
  })
}

/** 根据区域获取单灯位置 */
export const getSingAddress = (data) => {
  return api.request({
    method: 'GET',
    url: `/api/lampGroup/get/single?area=${data.area}`
  })
}

/** 公共模板 */

/** 分页查询led模板 */
export const getTemplate = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/led/template/get',
    data
  })
}

/** 删除文字模板 */
export const deletTextTemplate = (id) => {
  return api.request({
    method: 'POST',
    url: `/api/led/template/delete?id=${id}`
  })
}

/** 删除LED模板 */
export const deleteTemplate = (id) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/led/template/delete?programCode=${id}`
  })
}

/** 删除广播模板 */
export const removeAudioTemplate = (id) => {
  return api.request({
    method: 'GET',
    url: `api/iot-park/audio/removeAudioTemplate/${id}`
  })
}

/** 增加led模板 */
export const addTemplate = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/led/template/add',
    data
  })
}

/** 修改led模板 */
export const updateTemplate = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/led/template/update',
    data
  })
}

/** 选择模板 */
export const selectTemplate = async (data) => {
  const paramesText = await objToUrl(data);
  return api.request({
    method: 'GET',
    url: `/api/led/template/select?${paramesText}`
  })
}

/** 广播组策略 */

/** 删除策略 */
export const deleteBroadcast = (id) => {
  return api.request({
    method: 'GET',
    url: `/api/broadcast/delete?id=${id}`
  })
}

/** 策略详情 */
export const getBroadcastDetail = (teamNo) => {
  return api.request({
    method: 'GET',
    url: `/api/broadcast/detail?teamNo=${teamNo}`
  })
}

/** 获取组策略 */
export const getBroadcast = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/broadcast/get',
    data
  })
}

/** 修改策略 */
export const updateBroadcast = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/broadcast/update',
    data
  })
}

/** 增加广播策略 */
export const addBroadcast = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/broadcast/add',
    data
  })
}

export const getQrCode = (data) => {
  return api.request({
    method: 'POST',
    responseType: 'blob',
    type: 1, // 文件类型
    url: '/api/iot/wechat/index/getQrCode',
    data
  })
}
