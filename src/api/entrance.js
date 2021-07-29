import api from 'util/axios'

/** 人员进出趋势 */
export const doorAccessLogChart = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/iot-park/doorAccessLog/chart',
    data
  })
}

/** 今日流量分析 */
export const doorAccessLogAnalysis = (data) => {
  return api.request({
    method: 'GET',
    url: '/api/iot-park/doorAccessLog/today/analysis',
    data
  })
}

/** 实时告警数据 */
export const doorAccessLogInstantWarn = (data) => {
  return api.request({
    method: 'GET',
    url: '/api/iot-park/doorAccess/instantWarn',
    data
  })
}
/** 实时告警图表数据 */
export const doorAccessLogInstantWarnChart = (data) => {
  return api.request({
    method: 'GET',
    url: '/api/iot-park/doorAccess/instantWarn/chart',
    data
  })
}

/** 实时告警分页数据 */
export const doorAccessAlarmDetail = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/doorAccess/instantWarn/detail`,
    data
  })
}

/** 告警统计 */
export const doorAccessAlarm = (alarmStatus) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/doorAccess/alarm?alarmStatus=${alarmStatus}`
  })
}

/** 门禁点人流量排名 */
export const doorAccessLogTraffic = (data) => {
  return api.request({
    method: 'GET',
    url: '/api/iot-park/doorAccessLog/traffic/ranking',
    data
  })
}

/** 门禁人员进出记录 */
export const doorAccessLogGetOrder = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/doorAccessLog/getOrder`,
    data
  })
}

/** 门禁点运行状态 */
export const doorAccessStatus = (data) => {
  return api.request({
    method: 'GET',
    url: '/api/iot-park/doorAccess/operate/status',
    data
  })
}

/** 门禁设备详情 */
export const doorAccessDetail = (serialNumber) => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/doorAccess/detail/${serialNumber}`
  })
}

/** 门禁安防监控 */
export const doorAccessVideo = () => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/doorAccess/get/video`
  })
}

/** 门禁地址树结构 */
export const getDoorAccessTree = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/doorAccess/getDoorAccessTree`,
    data
  })
}

/** 实时监控-门禁详情(按楼层) */
export const getByFloor = (floorCode) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/doorAccess/getByFloor?floorCode=${floorCode}`
  })
}

/** 门禁状态统计 */
export const getDoorAccessCurrentStatus = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/doorAccess/getDoorAccessCurrentStatus`,
    data
  })
}

/** 查询门禁人员信息列表 */
export const getDoorAccessEmployeeInfoPage = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/doorAccessLog/getDoorAccessEmployeeInfoPage`,
    data
  })
}

/** 查询门禁人员信息详情 */
export const getDoorAccessEmployeeInfoDetail = (employeeCode) => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/doorAccessLog/getDoorAccessEmployeeInfoDetail/${employeeCode}`
  })
}

/** 新增或修改人员信息 */
export const editDoorAccessEmployeeInfo = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/doorAccessLog/editDoorAccessEmployeeInfo`,
    data
  })
}

/** 删除人员信息 */
export const removeDoorAccessEmployeeInfo = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/doorAccessLog/removeDoorAccessEmployeeInfo`,
    data
  })
}

/** 所有来访人员记录 */
export const getVisitorInfo = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/doorAccessLog/getVisitorInfo`,
    data
  })
}

/** 来访人员历史访问记录 */
export const getBeVisitorInfo = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/doorAccessLog/getBeVisitorInfo`,
    data
  })
}

/** 添加访客 */
export const saveVisitorInfoDetail = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/doorAccessLog/saveVisitorInfoDetail`,
    data
  })
}

/** 门禁人员模板下载 */
export const downloadTemplate = () => {
  return api.request({
    method: 'GET',
    responseType: 'blob',
    type: 1, // 文件类型
    url: `/api/iot-park/doorAccess/downloadTemplate`
  })
}

/** 门禁人员导入 */
export const importPersonFromZip = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/doorAccess/importPersonFromZip`,
    headers: { 'content-type': 'multipart/form-data' },
    data
  })
}

/** 门禁人员导入失败结果集合 */
export const importFailedList = (sequenceNo) => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/doorAccess/getImportFailedList/${sequenceNo}`
  })
}


/** 重新保存导入失败人员 */
export const saveImportFailedPerson = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/doorAccess/saveImportFailedPerson`,
    data
  })
}

/** 获取字典中公司或部门信息 */
export const getDictionaryInfo = (id) => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/doorAccessLog/getDictionaryInfo/${id}`
  })
}

/** 审批访客权限 */
export const doorAccessLogProval = (visitCode, status) => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/doorAccessLog/editVisitStatus/${visitCode}/${status}`
  })
}

/** 访客详情 */
export const getVisitorInfoDetail = (visitCode) => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/doorAccessLog/getVisitorInfoDetail/${visitCode}`
  })
}

/** 添加人员进出门禁权限 */
export const saveDoorAccessPermission = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/doorAccessLog/saveDoorAccessPermission`,
    data
  })
}

/** 授权 */
export const getBuildTreeDevice = (data) => {
  return api.request({
    method: 'POST',
    url: `api/deviceModuleTree/getBuildTreeDevice`,
    data
  })
}

/** 根据手机号查询访问人员的权限 */
export const getDoorAccessPermission = (phone) => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/doorAccessLog/getDoorAccessPermission/${phone}`
  })
}

/** 获取门禁设备列表 */
export const getDoorAccessDeviceList = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/doorAccess/getDoorAccessDeviceList`,
    data
  })
}

/** 获取门禁设备详情 */
export const getDoorAccessDeviceDetails = (serialNumber) => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/doorAccess/getDoorAccessDeviceDetails/${serialNumber}`
  })
}

/** 获取设备状态统计 */
export const getDoorAccessDeviceStatus = (serialNumber) => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/doorAccess/getDoorAccessDeviceStatus`
  })
}

/** 删除门禁设备 */
export const removeDoorAccessDevice = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/doorAccess/removeDoorAccessDevice`,
    data
  })
}

/** 修改门禁设备 */
export const editDoorAccessDeviceDetails = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/doorAccess/editDoorAccessDeviceDetails`,
    data
  })
}

// 进出记录查询

/** 获取人流量TOP10 */
export const getDoorAccessFlowCountTop10 = (data) => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/doorAccess/getDoorAccessFlowCountTop10`
  })
}

/** 查询设备出入记录(分页) */
export const getDoorAccessInOutForPage = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/doorAccess/getDoorAccessInOutForPage`,
    data
  })
}

// 门禁地图

/** 按照人员类型查询今日的进出情况 */
export const getTodayInOutStatByPersonType = (data) => {
  return api.request({
    method: 'GET',
    url: `/api/iot-park/doorAccess/getTodayInOutStatByPersonType`
  })
}

/** 按照日期统计出入人流量 */
export const getDoorAccessFlowStatByDate = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/doorAccess/getDoorAccessFlowStatByDate`,
    data
  })
}


/** 获取设备最新抓拍图 */
export const getDoorAccessCloseUpPic = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/iot-park/doorAccess/getDoorAccessCloseUpPic`,
    data
  })
}

/** 导出访客 */
export const exportVisitorInfo = () => {
  return api.request({
    method: 'GET',
    responseType: 'blob',
    type: 1, // 文件类型
    url: `api/iot-park/doorAccessLog/exportVisitorInfo`
  })
}

/** 导出出入记录 */
export const exportDoorAccessInOutInfo = () => {
  return api.request({
    method: 'GET',
    responseType: 'blob',
    type: 1, // 文件类型
    url: `/api/iot-park/doorAccess/exportDoorAccessInOutInfo`
  })
}

/** 导出人员信息 */
export const exportEmployeeInfo = () => {
  return api.request({
    method: 'GET',
    responseType: 'blob',
    type: 1, // 文件类型
    url: `/api/iot-park/doorAccessLog/exportEmployeeInfo`
  })
}


/** 导出人员信息 */
export const exportVisitorInfoo = () => {
  return api.request({
    method: 'GET',
    responseType: 'blob',
    type: 1, // 文件类型
    url: `/exchange/api/iot-park/micro/accessLog/exportVisitorInfo`
  })
}