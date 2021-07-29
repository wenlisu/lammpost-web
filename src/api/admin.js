import { data } from 'autoprefixer';
import api from 'util/axios'
const qs = require('qs');

/** 分页查询灯杆设备 */
export const getTerminal = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/terminal/get',
    data
  })
}

/** 获取未绑定的模块设备信息 */
export const getUnBindDeviceModuleInfoForPage = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/deviceModule/getUnBindDeviceModuleInfoForPage',
    data
  })
}

/** 批量绑定模块设备信息 */
export const batchBindDeviceModule = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/terminal/batchBindDeviceModule',
    data
  })
}

/** 绑定模块设备信息 */
export const bindDeviceModule = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/terminal/bindDeviceModule?imei=${data.imei}&serialNumber=${data.serialNumber}`
  })
}

/** 获取灯杆挂载的感应器设信息 */
export const getTerminalDeviceModule = (imei) => {
  return api.request({
    method: 'GET',
    url: `/api/terminal/getTerminalDeviceModule?imei=${imei}`
  })
}

/** 解除绑定模块设备信息 */
export const unBindDeviceModule = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/terminal/unBindDeviceModule?imei=${data.imei}&serialNumber=${data.serialNumber}`
  })
}

/** 厂商管理 */
/** 厂商管理-列表查询 */
export const getManufacturerManagementPage = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/devicemanage/getManufacturerManagementPage`,
    data
  })
}

/** 厂商管理-新增 */
export const addManufacturerManagement = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/devicemanage/addManufacturerManagement`,
    data
  })
}

/** 厂商管理-更新 */
export const updateManufacturerManagement = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/devicemanage/updateManufacturerManagement`,
    data
  })
}

/** 厂商管理-删除 */
export const deleteManufacturerManagement = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/devicemanage/deleteManufacturerManagement`,
    data
  })
}

/** 设施类型 */
/** 设施类型管理-列表查询 */
export const getSensorTypeManagementPage = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/devicemanage/getSensorTypeManagementPage`,
    data
  })
}

/** 设施类型管理-新增 */
export const addSensorTypeManagement = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/devicemanage/addSensorTypeManagement`,
    data
  })
}

/** 设施类型管理-更新 */
export const updateSensorTypeManagement = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/devicemanage/updateSensorTypeManagement`,
    data
  })
}


/** 设施类型管理-删除 */
export const deleteSensorTypeManagement = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/devicemanage/deleteSensorTypeManagement`,
    data
  })
}

/** 设备类型管理 */
/** 设备类型管理-列表查询 */
export const getDeviceTypeManagementPage = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/devicemanage/getDeviceTypeManagementPage`,
    data
  })
}

/** 设备类型管理-新增 */
export const addDeviceTypeManagement = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/devicemanage/addDeviceTypeManagement`,
    data
  })
}


/** 设备类型管理-更新 */
export const updateDeviceTypeManagement = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/devicemanage/updateDeviceTypeManagement`,
    data
  })
}

/** 设备类型管理-删除 */
export const deleteDeviceTypeManagement = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/devicemanage/deleteDeviceTypeManagement`,
    data
  })
}

/** 设备类型管理-产品下拉列表数据 */
export const getProductList = () => {
  return api.request({
    method: 'GET',
    url: `/api/devicemanage/getProductList`
  })
}

/** 资产设备详情 */
/** 资产设备管理-资产设备详情属性菜单 */
export const getDeviceModuleTree = ({ type, id }) => {
  const data = qs.stringify({
    type,
    id
  })
  return api.request({
    method: 'POST',
    url: `/api/deviceModule/getDeviceModuleTree`,
    data,
    headers: {'content-type': 'application/x-www-form-urlencoded'}
  })
}

/** 资产设备管理-根据ID获取详情 */
export const getDetailByID = (id) => {
  return api.request({
    method: 'GET',
    url: `/api/deviceModule/getDetailByID/${id}`
  })
}

/** 资产设备管理-新增 */
export const addDeviceModuleInfo = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/deviceModule/addDeviceModuleInfo`,
    data
  })
}

/** 资产设备管理-更新 */
export const updateDeviceModuleInfo = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/deviceModule/updateDeviceModuleInfo`,
    data
  })
}

/** 设备运行状态图表信息 */
export const getDeviceModuleChart = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/deviceModule/operateStatus/chart`,
    data
  })
}

/** 设备下发消息跟踪 */
export const getDownMessage = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/deviceModule/getDownMessage`,
    data
  })
}

/** 设备上报消息跟踪 */
export const getUpMessage = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/deviceModule/getUpMessage`,
    data
  })
}

/** 获取设备消息状态说明 */
export const getMessageStatus = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/deviceModule/getMessageStatus`,
    data
  })
}

/** 设备运行状态 */
export const getDeviceModuleStatus = (serialNumber) => {
  return api.request({
    method: 'GET',
    url: `/api/deviceModule/operateStatus/${serialNumber}`
  })
}

/** 设备管理统计 */
export const getDeviceModuleCount = (data) => {
  return api.request({
    method: 'GET',
    url: `/api/deviceModule/deviceCount?productNo=${data.productNo}`
  })
}

/** 资产设备管理-删除 */
export const deleteDeviceModuleInfo = (serialNumbers) => {
  const data = qs.stringify({
    serialNumbers
  })
  return api.request({
    method: 'POST',
    url: `/api/deviceModule/delete`,
    data,
    headers: {'content-type': 'application/x-www-form-urlencoded'}
  })
}


/** 激活设备 */
export const activeDeviceModule = ({serialNumber}) => {
  console.log('serialNumber', serialNumber);
  const data = qs.stringify({
    serialNumber
  })
  return api.request({
    method: 'POST',
    url: `/api/deviceModule/activeDeviceModule`,
    data,
    headers: {'content-type': 'application/x-www-form-urlencoded'}
  })
}


/** 资产设备管理-接入平台信息 */
export const getPlatformInfo = ({ type, id }) => {
  const data = qs.stringify({
    type,
    id
  })
  return api.request({
    method: 'POST',
    url: `/api/deviceModule/getPlatformInfo`,
    data,
    headers: {'content-type': 'application/x-www-form-urlencoded'}
  })
}


/** 资产设备管理-订阅消息 */
export const getDeviceProtocolView = ({ type, id }) => {
  const data = qs.stringify({
    type,
    id
  })
  return api.request({
    method: 'POST',
    url: `/api/deviceModule/getDeviceProtocolView`,
    data,
    headers: {'content-type': 'application/x-www-form-urlencoded'}
  })
}

/** 产品管理 */
/** 分页获取产品设备 */
export const getDeviceProductForPage = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/deviceProduct/getDeviceProductForPage`,
    data
  })
}

/** 获取产品设备参数信息 */
export const getDeviceProductParam = () => {
  return api.request({
    method: 'GET',
    url: `/api/deviceProduct/getDeviceProductParam`
  })
}

/** 删除产品设备 */
export const deleteDeviceProduct = (id) => {
  return api.request({
    method: 'POST',
    url: `/api/deviceProduct/deleteDeviceProduct?id=${id}`
  })
}

/** 增加产品设备 */
export const insertDeviceProduct = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/deviceProduct/insertDeviceProduct`,
    data
  })
}

/** 修改产品设备 */
export const updateDeviceProduct = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/deviceProduct/updateDeviceProduct`,
    data
  })
}

/** 获取产品设备详情信息 */
export const getDeviceProductDtl = (id) => {
  return api.request({
    method: 'GET',
    url: `/api/deviceProduct/getDeviceProductDtl?id=${id}`
  })
}

/** 产品详情 */
/** getDeviceModuleCapability */
export const getCapability = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/deviceCapability/getCapability`,
    data
  })
}

/** 新增设备能力 */
export const addCapability = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/deviceCapability/addCapability`,
    data
  })
}

/** 修改设备能力 */
export const updateCapability = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/deviceCapability/updateCapability`,
    data
  })
}

/** 删除设备能力信息 */
export const deleteCapability = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/deviceCapability/delete`,
    data
  })
}


/** 新增服务能力指令 */
export const addCommand = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/serviceCapability/addCommand`,
    data
  })
}

/** 修改服务能力指令 */
export const updateCommand = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/serviceCapability/updateCommand`,
    data
  })
}


/** 新增服务能力属性 */
export const addProperties = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/serviceCapability/addProperties`,
    data
  })
}


/** 修改服务能力属性 */
export const updateProperties = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/serviceCapability/updateProperties`,
    data
  })
}

/** 获取服务能力指令信息 */
export const getCommandList = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/serviceCapability/getCommandList`,
    data
  })
}

/** 获取产品拥有的能力属性 */
export const getPropertiesList = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/serviceCapability/getPropertiesList`,
    data
  })
}

/** 删除服务能力 */
export const deleteCommandListAndPropertiesList = ({serviceCapabilityCode}) => {
  // const data = qs.stringify({
  //   serviceCapabilityCode
  // })
  return api.request({
    method: 'POST',
    url: `/api/serviceCapability/delete`,
    data: serviceCapabilityCode
    // headers: {'content-type': 'application/x-www-form-urlencoded'}
  })
}

/** 获取服务能力数据类型 */
export const getDataType = () => {
  return api.request({
    method: 'GET',
    url: `/api/serviceCapability/getDataType`
  })
}

/** 订阅推送 */
/** 订阅推送分页查询 */
export const getPublishSubscribeForPage = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/deviceProduct/getPublishSubscribeForPage`,
    data
  })
}

/** 删除订阅推送(批量) */
export const deletePublishSubscribe = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/deviceProduct/deletePublishSubscribe`,
    data
  })
}


/** 订阅推送获取消息类别 */
export const getOperationTypeList = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/deviceProduct/getOperationTypeList`,
    data
  })
}

/** 订阅推送消息协议通道 */
export const getProtocolList = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/deviceProduct/getProtocolList`,
    data
  })
}

/** 添加订阅推送 */
export const insertPublishSubscribe = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/deviceProduct/insertPublishSubscribe`,
    data
  })
}

/** 修改订阅推送 */
export const updatePublishSubscribe = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/deviceProduct/updatePublishSubscribe`,
    data
  })
}

/** 获取订阅推送详情 */
export const getPublishSubscribeDetail = (code) => {
  return api.request({
    method: 'GET',
    url: `/api/deviceProduct/getPublishSubscribeDetail?code=${code}`
  })
}

/** 设备概览 */
/** 设备概览 */
export const generalView = () => {
  return api.request({
    method: 'GET',
    url: `/api/screen/generalView`
  })
}

/** 批量关联设备 */
/** 获取灯杆树形数据 */
export const getTerminalTree = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/terminal/getTerminalTree`,
    data
  })
}

/** 删除灯杆设备信息 */
export const deleteTerminalTree = (id) => {
  const data = qs.stringify({
    id
  })
  return api.request({
    method: 'POST',
    url: `/api/terminal/delete`,
    data,
    headers: {'content-type': 'application/x-www-form-urlencoded'}
  })
}


/** 修改灯杆设备信息 */
export const editTerminalTree = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/terminal/edit`,
    data
  })
}


/** 新增灯杆树形数据 */
export const addTerminalTree = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/terminal/add`,
    data
  })
}


/** 设备管理 */
/** 获取灯杆树形数据 */
export const getDeviceModuleInfoForPage = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/deviceModule/getDeviceModuleInfoForPage`,
    data
  })
}


/** 获取灯城市灯杆绑定设备 */
export const getCityDeviceModuleInfoForPage = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/deviceModule/getCityDeviceModuleInfoForPage`,
    data
  })
}

/** 设备联动 */
/** 设备联动分页页面 */
export const deviceLinkage = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/deviceLinkage/search/linkage`,
    data
  })
}

/** 禁用设备联动 */
export const devicedisable = (id) => {
  return api.request({
    method: 'GET',
    url: `/api/deviceLinkage/disable?id=${id}`
  })
}

/** 启用设备联动 */
export const deviceenable = (id) => {
  return api.request({
    method: 'GET',
    url: `/api/deviceLinkage/enable?id=${id}`
  })
}

/** 设备联动删除 */
export const deviceDeleteLinkage = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/deviceLinkage/delete?id=${data.id}&type=${data.type}`
  })
}

/** 设备联动新增 */
export const deviceAddLinkage = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/deviceLinkage/add/linkage`,
    data
  })
}

/** 设备联动更新 */
export const deviceUpdateLinkage = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/deviceLinkage/update/linkage`,
    data
  })
}

/** 设备联动详情 */
export const deviceDetailLinkage = (id) => {
  return api.request({
    method: 'GET',
    url: `/api/deviceLinkage/detail/linkage?id=${id}`
  })
}


/** 设备联动页面,通过产品编号或者设备编号找设备能力 */
export const deviceCapabilityLinkage = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/deviceCapability/linkage?number=${data.number}&type=${data.type}`
  })
}

/** 设备联动页面,通过产品编号或者设备编号找设备能力 */
export const getLinkageUser = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/adminUser/get/user`,
    data
  })
}

/** 告警管理 */
/** 告警管理列表 */
export const alarmManage = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/instantWarn/alarmManage`,
    data
  })
}

/** getAlarmManageChart */
export const alarmManageChart = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/instantWarn/alarmManageChart`,
    data
  })
}

/** 应用管理 */
/** 获取上报数据属性与模型字段关联关系列表 */
export const getReportRelation = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/reportRelation/getReportRelation`,
    data
  })
}

/** 获取上报数据属性与模型关系的总数 */
export const getReportRelationCount = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/reportRelation/getReportRelationCount`,
    data
  })
}


/** 新增上报数据属性与模型字段关系 */
export const addReportRelation = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/reportRelation/addReportRelation`,
    data
  })
}

/** 删除上报数据属性与模型字段关系 */
export const deleteReportRelationDataModule = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/reportRelation/deleteReportRelationDataModule`,
    data
  })
}

/** 修改上报数据属性与模型字段关系 */
export const updateReportRelation = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/reportRelation/updateReportRelation`,
    data
  })
}

/** 获取数据模型 */
export const getReportRelationDataModule = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/reportRelation/getReportRelationDataModule`,
    data
  })
}

/** 获取执行事件 */
export const getReportRelationHandle = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/reportRelation/getReportRelationHandle`,
    data
  })
}

/** 获取上报数据属性与模型字段关联关系详情 */
export const getReportRelationDtl = (code) => {
  return api.request({
    method: 'GET',
    url: `/api/reportRelation/getReportRelationDtl?code=${code}`
  })
}


/** 智慧烟感 设置阈值 */
export const setThresholdValue = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/smoke-detector/saveSmokeDetectorThreshold`,
    data
  })
}

/** 智慧水表 查询水表树 */
export const getWaterMeterSiteTree = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/water-meter/getWaterMeterSiteTree`,
    data
  })
}

/** 获取烟感设备报警趋势 */
export const getSmokeDetectorTrend = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/screen/getSmokeDetectorTrend`,
    data
  })
}

/** 获取烟感设备运行状态 */
export const getSmokeDetectorRunStatus = (data) => {
  return api.request({
    method: 'GET',
    url: '/api/screen/getSmokeDetectorRunStatus'
  })
}

/** 解绑设备 */
export const editDeviceToParkTree = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/deviceModule/editDeviceToParkTree',
    data
  })
}


/** 解绑城市组织树设备 */
export const editDeviceToCityTree = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/deviceModule/editDeviceToCityTree',
    data
  })
}