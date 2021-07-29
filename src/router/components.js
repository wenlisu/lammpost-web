
/**
 * 动态路由部件映射
 */
const MainView = () =>
    import('components/mainView');
const adminView = () =>
    import('components/adminView');

export const routesMap = {
  // 智慧公园
  'iot_park': ['wisdomPark'],
  'iot_park_report': ['wisdomParkReport'],
  'iot_park_monthReport': ['wisdomParkMonthReport'],

  // 智慧灯杆
  'iot_lamppost': ['index', 'bigScreen', 'lightPole', 'adminLampIllumination', 'LampIllumination'],
  'iot_lamppost_zhdgdt': ['lightPoleMap', 'lightPoleDetail'],
  'iot_lamppost_nhtjfx': 'lightPoleStatistical',
  'iot_lamppost_dgnhfx': 'wisdomLightPole',
  'iot_lamppost_nhfx_dgyxsj': 'lightPoleList',
  'iot_lamppost_nhfx_yjnydfx': 'lightPoleMonthAnalysis',
  'iot_lamppost_nhfx_rjnydfx': 'lightPoleDayAnalysis',
  'iot_lamppost_zmkz': 'LightingControl',
  'iot_lamppost_zmkz_yckz': 'longRangControl',
  'iot_lamppost_zmkz_dskz': ['illumination', 'illuminationDetail'],
  // 智慧发布
  'iot_led': ['controlStrategy', 'adminScreen'],
  'iot_led_zhfbdt': 'publishPoleMap',
  'iot_led_bfrw': 'wisdomPublishTaskPage',
  'iot_led_tjfx': 'wisdomPublishAnalyse',
  'iot_led_zhgb': ['wisdomVideo', 'wisdomVideoDetail'],
  'iot_led_yjkp': ['screenManagement', 'fastScreen'],
  'iot_led_bfrwlb': 'screenPlayList',
  'iot_led_dsddbf': 'timedScreen',
  'iot_led_ggmbk': 'timeScreenCommonTemplate',
  'iot_led_gjfx': ['screenAnalysis', 'screenAlarmAnalysis'],
  'iot_led_xxrz': 'screenNewsInfo',
  // 智慧监测
  'iot_ambient': ['wisdomSupervise', 'adminSupervise'],
  'iot_ambient_zhjcdt': 'superviseMap',
  'iot_ambient_tjfx': 'superviseAnalysis',
  'iot_ambient_ssjk': ['superviseManagement', 'superviseTimeMonitoring'],
  'iot_ambient_ssjk_bjsj': 'superviseRecord',
  'iot_ambient_ssjk_lssj': 'superviseHistoryRecord',
  'iot_ambient_ssjk_sbgl': 'superviseDeviceManage',
  // 智慧WIFi
  'iot_wifi': 'wisdomWifiMain',
  'iot_wifi_wifi': 'wisdomWifi',
  // 智慧烟感
  'iot_smokedetector': ['smokeDetector', 'smokeMap', 'adminSmoke'],
  'iot_smokedetector_dp': 'smokeDetectorMap',
  'iot_smokedetector_ssjk': 'smokeManagement',
  'iot_smokedetector_ssjk_ssjk': 'smokeTimeMonitoring',
  'iot_smokedetector_ssjk_sbgl': 'smokeDeviceManage',
  'iot_smokedetector_gjfx_gjtj': ['alarmStatistics', 'alarmStatisticsPage'],
  'iot_smokedetector_gjfx': 'alarmAnalysis',
  'iot_smokedetector_gjfx_gztj': ['faultStatistics', 'faultStatisticPage'],
  'iot_smokedetector_tjfx': 'smokeAnalysis',
  'iot_smokedetector_tjfx_tjfx': 'smokeStatisticAnalysis',
  // 智慧门禁
  'iot_dooraccess': ['adminEntrance'],
  'iot_dooraccess_dp': 'smokeDetectorMap',
  'iot_dooraccess_ssjk': 'entranceManagement',
  'iot_dooraccess_ssjk_ssjk': 'entranceTimeMonitoring',
  'iot_dooraccess_ssjk_crjlcx': 'entranceAccessRecords',
  'iot_dooraccess_ssjk_fkgjfx': 'entranceTrajectoryAnalysis',
  'iot_dooraccess_rygl': 'entrancePersonnelManagement',
  'iot_dooraccess_rygl_fkxx': ['entranceVisitorInformation', 'entranceVisitorInformationDetail'],
  'iot_dooraccess_rygl_ryxx': 'entrancePersonalInformation',
  'iot_dooraccess_gjfx': 'entranceAlarmAnalysis',
  'iot_dooraccess_gjfx_jcsjcx': 'entranceInOutEvent',
  'iot_dooraccess_gjfx_gjsjcx': ['entranceAlarmEvent', 'entranceAlarmEventDetail'],
  'iot_dooraccess_qxgl': 'entranceLimitManagement',
  'iot_dooraccess_qxgl_mjqxgl': 'entrancedoorLimit',
  // 智慧水表
  'iot_water_meter': ['adminWater'],
  'iot_water_meter_dp': 'adminWaterMap',
  'iot_water_meter_ssjk': 'waterManagement',
  'iot_water_meter_ssjk_ssjk': 'waterTimeMonitoring',
  'iot_water_meter_sjcx': 'dataQuery',
  'iot_water_meter_sjcx_cbsj': 'meterReadingData',
  'iot_water_meter_sjcx_sfjl': 'chargeRecord',
  'iot_water_meter_sjcx_sbgl': 'waterMeterManagement',
  'iot_water_meter_sjcx_sbxq': 'dataDetail',
  'iot_water_meter_tjfx': 'statisticalAnalysis',
  'iot_water_meter_tjfx-nhfx': 'energyConsumptionAnalysis',
  'iot_water_meter_tjfx-sftj': 'chargeStatistics',
  'iot_water_meter_tjfx-jfyb': 'monthlyPaymentReport',
  'iot_water_meter_tjfx-zbfx': 'summaryTableAnalysis',
  // 基础管理
  'basic_information_management': ['basic_information_management', 'adminBaseManagement'],
  // 物联网管理
  'iot_platform': 'admin',
  'iot_platform_sbjr': 'equipmentAccess',
  'iot_platform_sbjr_dgsbgl': ['lampPoleManagement', 'lampPoleManagementEdit'],
  'iot_platform_sbjr_plglsb': 'batchEquipmentAccess',
  'iot_platform_cpgl': 'productManagement',
  'iot_platform_cpgl_cpgl': ['productManagementDetail', 'productManagementPage'],
  'iot_platform_sbgl': 'equipmentManagement',
  'iot_platform_sbgl_sbgl': 'deviceOverview',
  'iot_platform_sbgl_sbgl_1': ['equipmentList', 'equipmentListDetail'],
  'iot_platform_sbgl_sbmx': 'equipmentDetail',
  'iot_platform_sbgl_csgl': 'vendorManagement',
  'iot_platform_sbgl_sslxgl': 'sensorManagement',
  'iot_platform_sbgl_sblxgl': 'deviceManagement',
  'iot_platform_gzyq': 'ruleEngine',
  'iot_platform_gzyq_gzgl': ['ruleManagement', 'ruleManageEdit'],
  'iot_platform_jkyw': 'monitorOperation',
  'iot_platform_jkyw_gjgl': 'monitorReportManage',
  'iot_platform_yygl': 'use',
  'iot_platform_yygl_yygl': ['useManage', 'useManagePage'],
  'basic_information_Management': ['basicInformationManagement', 'roleManagement', 'userManagement', 'resourcesManagement', 'dictionariesManagement', 'approveConfig', 'treeManage', 'treeManageCity'],
  'work_order_management': ['workOrderManagement']
}

export default {
  'index': MainView,
  'login': () =>
  import('components/login/login'),
  'bigScreen': () => import('view/bigScreen/index'),

  //智慧公园
  'wisdomPark': MainView,
  'wisdomParkReport': () => import('view/index/wisdomPark/report'),
  'wisdomParkMonthReport': () => import('view/index/wisdomPark/monthReport'),

  'lightPoleMap': () =>
  import('view/index/lightPoleMap'),
  'chargingPileMap': () =>
  import('view/index/chargingPileMap'),
  lightPole: MainView,
  'wisdomLightPole': () =>
  import('view/lightPole/wisdomLightPole'),
  'lightPoleDetail': () =>
  import('view/lightPole/lightPoleDetail'),
  'LampIllumination': () =>
  import('view/testpage/index'),
  'lightPoleStatistical': () =>
  import('view/lightPole/lightPoleStatistical'),
  'lightPoleList': () =>
  import('view/lightPole/lightPoleList'),
  'lightPoleDayAnalysis': () =>
  import('view/lightPole/lightPoleDayAnalysis'),
  'energyLightPoleList': () =>
  import('view/testpage/index'),
  'illumination': () =>
  import('view/controlStrategy/illumination'),
  'illuminationDetail': () =>
  import('view/controlStrategy/illumination/Detail'),
  'smartCharge': MainView,
  'chargePileMonitor': () =>
  import('view/smartCharge/chargePileMonitor/index'),
  'chargeBaseInfo': () =>
  import('view/smartCharge/chargeBaseInfo/index'),
  'chargeStatisticAnalysis': () =>
  import('view/smartCharge/chargeStatisticAnalysis/index'),
  'chargeOperationAnalysis': () =>
  import('view/smartCharge/chargeStatisticAnalysis/index'),
  'controlStrategy': MainView,
  'wisdomPublish': () =>
  import('view/controlStrategy/wisdomPublish'),
  'wisdomPublishDetail': () =>
  import('view/controlStrategy/wisdomPublish/detail'),
  'wisdomVideo': () =>
  import('view/controlStrategy/wisdomVideo'),
  'wisdomVideoDetail': () =>
  import('view/controlStrategy/wisdomPublish/detail'),
  'commonTemplate': () =>
  import('view/controlStrategy/commonTemplate'),
  'wisdomWarnMain': MainView,
  'wisdomWarn': () =>
  import('view/wisdomMonitor/wisdomWarn'),
  'wisdomWarnDetail': () =>
  import('view/wisdomMonitor/wisdomWarn/detail'),
  'wisdomWifiMain': MainView,
  'wisdomWifi': () =>
  import('view/wisdomMonitor/wisdomWifi'),
  'wisdomWifiEquipment': () =>
  import('view/wisdomMonitor/wisdomWifi/equipment'),
  'wisdomWifiUserTraffic': () =>
  import('view/wisdomMonitor/wisdomWifi/userTraffic'),
  'wisdomWifiUserDetail': () =>
  import('view/wisdomMonitor/wisdomWifi/userDetail'),
  'wisdomMonitor': MainView,
  'faultWarn': () =>
  import('view/wisdomMonitor/faultWarn'),
  'faultWarnDetail': () =>
  import('view/wisdomMonitor/faultWarn/detail'),
  'admin': adminView,
  'equipmentAccess': () =>
  import('view/testpage/index'),
  'lampPoleManagement': () =>
  import('view/admin/equipmentAccess/lampPoleManagement/index'),
  'lampPoleManagementEdit': () =>
  import('view/admin/equipmentAccess/lampPoleManagement/detail'),
  'batchEquipmentAccess': () =>
  import('view/admin/equipmentAccess/batchEquipmentAccess/index'),
  'productManagement': () =>
  import('view/testpage/index'),
  'productManagementDetail': () =>
  import('view/admin/equipmentAccess/productManagement/index'),
  'equipmentManagement': () =>
  import('view/testpage/index'),
  'deviceOverview': () =>
  import('view/admin/equipmentManagement/deviceOverview/index'),
  'equipmentList': () =>
  import('view/admin/equipmentManagement/equipmentList/index'),
  'equipmentListDetail': () =>
  import('view/admin/equipmentManagement/equipmentDetail/index'),
  'equipmentDetail': () =>
  import('view/admin/equipmentManagement/equipmentDetail/index'),
  'vendorManagement': () =>
  import('view/admin/equipmentManagement/vendorManagement/index'),
  'sensorManagement': () =>
  import('view/admin/equipmentManagement/sensorManagement/index'),
  'deviceManagement': () =>
  import('view/admin/equipmentManagement/deviceManagement/index')
};
