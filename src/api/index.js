import api from 'util/axios'
import qs from 'qs'
export * from './baseInfoManage';

/** 获取组地区 */
export const getGroupPolicy = (data) => {
  return api.request({
    method: 'GET',
    url: '/api/lampGroup/get/all/area'
  })
}

/** 获取灯 */
export const getLamp = (address) => {
  return api.request({
    method: 'GET',
    url: `/api/lampGroup/get/lamp?address=${address}`
  })
}

/** 获取所有灯和imei */
export const getAllImei = () => {
  return api.request({
    method: 'GET',
    url: `/api/lampGroup/get/all/imei`
  })
}

/** 删除文件 */
export const deleteFileByFileCode = (fileCode) => {
  return api.request({
    method: 'DELETE',
    url: `/api/fileupload/deleteFileByFileCode?fileCode=${fileCode}`
  })
}

/** 删除文件 */
export const deleteByFileCode = (fileCode) => {
  return api.request({
    method: 'POST',
    url: `/api/fileupload/deleteByFileCode?fileCode=${fileCode}`
  })
}

/** 厂商管理-厂商下拉列表数据 */
export const getManufacturerSelectList = () => {
  return api.request({
    method: 'GET',
    url: `/api/devicemanage/getManufacturerSelectList`
  })
}

/** 设施类型管理-设施类型下拉列表数据 */
export const getSensorTypeSelectList = () => {
  return api.request({
    method: 'GET',
    url: `/api/devicemanage/getSensorTypeSelectList`
  })
}

/** 设备类型管理-设备类型下拉列表数据 */
export const getDeviceTypeSelectList = (data) => {
  return api.request({
    method: 'GET',
    url: `/api/devicemanage/getDeviceTypeSelectList?manufacturerCode=${data.manufacturerCode}&sensorTypeCode=${data.sensorTypeCode}`
  })
}

/** 获取设备请求时间间隔 */
export const getDeviceRequestDateInterval = () => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/common/getDeviceRequestDateInterval`
  })
}


// 根据字典code获取子级字典
export const selectListByParentCode = (id) => {
  return api.request({
    method: 'get',
    url: '/api/dictionary/selectListByParentCode?code=' + id
  })
}

// 获取灯杆树形数据
export const getTerminalTree = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/terminal/getTerminalTree`,
    data
  })
}

// 获取园区树以及设备
export const getParkDeviceTree = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/deviceModuleTree/getParkDeviceTree`,
    data
  })
}

// 删除设备树结构数数据
export const deleteDeviceModuleTree = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/deviceModuleTree/deleteDeviceModuleTree`,
    data
  })
}

// 修改删除园区设备树结构数据
export const editDeviceModuleTree = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/deviceModuleTree/editDeviceModuleTree`,
    data
  })
}


// 获取设备树数据
export const getDeviceModuleTree = (data) => {
  return api.request({
    method: 'GET',
    url: `/api/deviceModuleTree/getDeviceModuleTree/${data.treeType}/${data.parentNodeCode}`
  })
}

 
// 验证身份证，手机号重复
export const getIfExists = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/doorAccessLog/getIfExists?${qs.stringify(data)}`,
  })
}

// 权限列表
export const getDoorAccessManagePermission = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/doorAccessLog/getDoorAccessManagePermission`,
    data
  })
}

 
// 删除权限列表
export const removeDoorAccessPermission = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/doorAccessLog/removeDoorAccessPermission`,
    data
  })
}


// 编辑权限列表
export const editDoorAccessPermission = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/doorAccessLog/editDoorAccessPermission`,
    data
  })
}

// 获取门禁设备实时抓拍图
export const getDoorAccessCloseUpPic = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/doorAccess/getDoorAccessCloseUpPic`,
    data
  })
}

// 获取门禁设备出入记录
export const getDoorAccessInOutForPage = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/doorAccess/getDoorAccessInOutForPage`,
    data
  })
}

// 门禁设备详情
export const getDoorAccessDeviceDetails = (serialNumber) => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/doorAccess/getDoorAccessDeviceDetails/${serialNumber}`,
  })
}

// 目标对比
export const getDoorAccessInOutRecordTop10 = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/doorAccess/getDoorAccessInOutRecordTop10`,
    data
  })
}
