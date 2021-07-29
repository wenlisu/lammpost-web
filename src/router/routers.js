/*
    title 标题
    hideInMenu: (false) 设为true后在左侧菜单不显示
    role: (null) 可访问该页面的权限数组[]
    hideChildenAlways: (false)  如果设置true则显示当前路由下的子级到左侧菜单
    icon: 该页面在左侧菜单、面包屑和标签导航处显示的图标
*/


//  业务概览统计
//  网络拓扑展示
//  实例执行管理 (业务执行管理)
//  产品编排
//  模型定义中心
//  协议适配管理
//  基础信息管理
//  基础支撑功能
//  系统维护管理
import { getLocal } from 'util/tool'
const MainView = () => import('components/mainView')
const adminView = () => import('components/adminView');
let whiteRouterList = getLocal('whiteRouterList') // 白名单
// const sonView = () => import ('components/sonView') // 挂载

// export const adminRoute = [{
//   path: 'equipmentAccess',
//   name: 'equipmentAccess',
//   component: () =>
//     import('view/testpage/index'),
//   meta: {
//     title: '设备接入',
//     icon: 'iconfont icon-shebeijieru'
//   },
//   children: [{
//     path: 'lampPoleManagement',
//     name: 'lampPoleManagement',
//     component: () =>
//       import('view/admin/equipmentAccess/lampPoleManagement/index'),
//     meta: {
//       children: false,
//       title: '灯杆设备管理'
//     },
//     children: [{
//       path: 'lampPoleManagementEdit',
//       name: 'lampPoleManagementEdit',
//       component: () =>
//         import('view/admin/equipmentAccess/lampPoleManagement/detail'),
//       meta: {
//         hidden: true,
//         title: '接入设施设备'
//       }
//     }]
//   }, {
//     path: 'batchEquipmentAccess',
//     name: 'batchEquipmentAccess',
//     component: () =>
//       import('view/admin/equipmentAccess/batchEquipmentAccess/index'),
//     meta: {
//       title: '批量关联设备'
//     }
//   }]
// }, {
//   path: 'productManagement',
//   name: 'productManagement',
//   component: () =>
//     import('view/testpage/index'),
//   meta: {
//     title: '产品管理',
//     icon: 'iconfont icon-chanpinguanli'
//   },
//   children: [{
//     path: 'productManagementDetail',
//     name: 'productManagementDetail',
//     component: () =>
//       import('view/admin/equipmentAccess/productManagement/index'),
//     meta: {
//       title: '产品管理'
//     },
//     children: [{
//       path: 'productManagementPage',
//       name: 'productManagementPage',
//       component: () =>
//         import('view/admin/equipmentAccess/productManagement/page'),
//       meta: {
//         hideInMenu: true,
//         title: '产品管理详情'
//       }
//     }]
//   }]
// }, {
//   path: 'equipmentManagement',
//   name: 'equipmentManagement',
//   component: () =>
//     import('view/testpage/index'),
//   meta: {
//     title: '设备管理',
//     icon: 'iconfont icon-shebeiguanli'
//   },
//   children: [{
//     path: 'deviceOverview',
//     name: 'deviceOverview',
//     component: () =>
//       import('view/admin/equipmentManagement/deviceOverview/index'),
//     meta: {
//       title: '设备概览'
//     }
//   }, {
//     path: 'equipmentList',
//     name: 'equipmentList',
//     component: () =>
//       import('view/admin/equipmentManagement/equipmentList/index'),
//     meta: {
//       title: '设备管理'
//     },
//     children: [{
//       path: 'equipmentListDetail',
//       name: 'equipmentListDetail',
//       component: () =>
//         import('view/admin/equipmentManagement/equipmentDetail/index'),
//       meta: {
//         hidden: true,
//         title: '设备管理详情'
//       }
//     }]
//   }, {
//     path: 'equipmentDetail',
//     name: 'equipmentDetail',
//     component: () =>
//       import('view/admin/equipmentManagement/equipmentDetail/index'),
//     meta: {
//       title: '设备明细'
//     }
//   }, {
//     path: 'vendorManagement',
//     name: 'vendorManagement',
//     component: () =>
//       import('view/admin/equipmentManagement/vendorManagement/index'),
//     meta: {
//       title: '厂商管理'
//     }
//   }, {
//     path: 'sensorManagement',
//     name: 'sensorManagement',
//     component: () =>
//       import('view/admin/equipmentManagement/sensorManagement/index'),
//     meta: {
//       title: '设施类型管理'
//     }
//   }, {
//     path: 'deviceManagement',
//     name: 'deviceManagement',
//     component: () =>
//       import('view/admin/equipmentManagement/deviceManagement/index'),
//     meta: {
//       title: '设备类型管理'
//     }
//   }]
// }, {
//   path: 'ruleEngine',
//   name: 'ruleEngine',
//   component: () =>
//     import('view/testpage/index'),
//   meta: {
//     title: '规则引擎',
//     icon: 'iconfont icon-guizeyinqing'
//   },
//   children: [{
//     path: 'ruleManagement',
//     name: 'ruleManagement',
//     component: () =>
//       import('view/admin/ruleEngine/ruleManagement/index'),
//     meta: {
//       title: '规则管理'
//     },
//     children: [{
//       path: 'ruleManageEdit',
//       name: 'ruleManageEdit',
//       component: () =>
//         import('view/admin/ruleEngine/ruleManagement/detail'),
//       meta: {
//         hideInMenu: true,
//         title: '设备联动规则详情'
//       }
//     }]
//   }]
// }, {
//   path: 'monitorOperation',
//   name: 'monitorOperation',
//   component: () =>
//     import('view/testpage/index'),
//   meta: {
//     title: '监控运维',
//     icon: 'iconfont icon-jiankongyunwei'
//   },
//   children: [{
//     path: 'monitorReportManage',
//     name: 'monitorReportManage',
//     component: () =>
//       import('view/admin/monitorOperation/monitorReportManage/index'),
//     meta: {
//       title: '告警管理'
//     }
//   }]
// }, {
//   path: 'use',
//   name: 'use',
//   component: () =>
//     import('view/testpage/index'),
//   meta: {
//     title: '应用管理',
//     icon: 'iconfont icon-yingyongguanli'
//   },
//   children: [{
//     path: 'useManage',
//     name: 'useManage',
//     component: () =>
//       import('view/admin/use/useManage/index'),
//     meta: {
//       title: '应用管理'
//     },
//     children: [{
//       path: 'useManagePage',
//       name: 'useManagePage',
//       component: () =>
//         import('view/admin/use/useManage/page'),
//       meta: {
//         hideInMenu: true,
//         title: '应用管理详情'
//       }
//     }]
//   }]
// }];

// export const adminSmokeRoute = [{
//   path: 'smokeManagement',
//   name: 'smokeManagement',
//   component: () =>
//     import('view/testpage/index'),
//   meta: {
//     title: '实时监控',
//     icon: 'iconfont icon-shebeijieru'
//   },
//   children: [{
//     path: 'smokeTimeMonitoring',
//     name: 'smokeTimeMonitoring',
//     component: () =>
//       import('view/adminSmoke/smokeManagement/timeMonitoring/index'),
//     meta: {
//       children: false,
//       title: '实时监控'
//     }
//   }, {
//     path: 'smokeDeviceManage',
//     name: 'smokeDeviceManage',
//     component: () =>
//       import('view/adminSmoke/smokeManagement/smokeDeviceManage/index'),
//     meta: {
//       children: false,
//       title: '设备管理'
//     }
//   }]
// }, {
//   path: 'alarmAnalysis',
//   name: 'alarmAnalysis',
//   component: () =>
//     import('view/testpage/index'),
//   meta: {
//     title: '告警分析',
//     icon: 'iconfont icon-shebeijieru'
//   },
//   children: [{
//     path: 'alarmStatistics',
//     name: 'alarmStatistics',
//     component: () =>
//       import('view/adminSmoke/alarmAnalysis/alarmStatistics/index'),
//     meta: {
//       children: false,
//       title: '告警统计'
//     },
//     children: [{
//       path: 'alarmStatisticsPage',
//       name: 'alarmStatisticsPage',
//       component: () =>
//         import('view/adminSmoke/alarmAnalysis/alarmStatistics/index'),
//       meta: {
//         children: false,
//         hideInMenu: true,
//         title: '告警统计详情'
//       }
//     }]
//   }, {
//     path: 'faultStatistics',
//     name: 'faultStatistics',
//     component: () =>
//       import('view/adminSmoke/alarmAnalysis/faultStatistics/index'),
//     meta: {
//       children: false,
//       title: '故障统计'
//     },
//     children: [{
//       path: 'faultStatisticPage',
//       name: 'faultStatisticPage',
//       component: () =>
//         import('view/adminSmoke/alarmAnalysis/faultStatistics/page'),
//       meta: {
//         children: false,
//         hideInMenu: true,
//         title: '故障统计详情'
//       }
//     }]
//   }]
// }, {
//   path: 'smokeAnalysis',
//   name: 'smokeAnalysis',
//   component: () =>
//     import('view/testpage/index'),
//   meta: {
//     title: '统计分析',
//     icon: 'iconfont icon-shebeijieru'
//   },
//   children: [{
//     path: 'smokeStatisticAnalysis',
//     name: 'smokeStatisticAnalysis',
//     component: () =>
//       import('view/adminSmoke/smokeAnalysis/smokeStatisticAnalysis1/index'),
//     meta: {
//       children: false,
//       title: '统计分析'
//     }
//   }]
// }];
// export const adminEntranceRoute = [{
//   path: 'entranceManagement',
//   name: 'entranceManagement',
//   component: () =>
//     import('view/testpage/index'),
//   meta: {
//     title: '实时监控',
//     icon: 'iconfont icon-shebeijieru'
//   },
//   children: [{
//     path: 'entranceTimeMonitoring',
//     name: 'entranceTimeMonitoring',
//     component: () =>
//       import('view/adminEntrance/entranceManagement/timeMonitoring/index'),
//     meta: {
//       children: false,
//       title: '实时监控'
//     }
//   }, {
//     path: 'entranceAccessRecords',
//     name: 'entranceAccessRecords',
//     component: () =>
//       import('view/adminEntrance/entranceManagement/accessRecords/index'),
//     meta: {
//       children: false,
//       title: '出入记录'
//     }
//   }, {
//     path: 'entranceTrajectoryAnalysis',
//     name: 'entranceTrajectoryAnalysis',
//     component: () =>
//       import('view/adminEntrance/entranceManagement/trajectoryAnalysis/index'),
//     meta: {
//       children: false,
//       title: '访客轨迹分析'
//     }
//   }]
// }, {
//   path: 'entranceAlarmAnalysis',
//   name: 'entranceAlarmAnalysis',
//   component: () =>
//     import('view/testpage/index'),
//   meta: {
//     title: '告警分析',
//     icon: 'iconfont icon-shebeijieru'
//   },
//   children: [{
//     path: 'entranceInOutEvent',
//     name: 'entranceInOutEvent',
//     component: () =>
//       import('view/adminEntrance/alarmAnalysis/inOutEvent/index'),
//     meta: {
//       children: false,
//       title: '进出事件查询'
//     }
//   }, {
//     path: 'entranceAlarmEvent',
//     name: 'entranceAlarmEvent',
//     component: () =>
//       import('view/adminEntrance/alarmAnalysis/alarmEvent/index'),
//     meta: {
//       children: false,
//       title: '告警事件查询'
//     },
//     children: [{
//       path: 'entranceAlarmEventDetail',
//       name: 'entranceAlarmEventDetail',
//       component: () =>
//         import('view/adminEntrance/alarmAnalysis/alarmEvent/detail'),
//       meta: {
//         children: false,
//         hideInMenu: true,
//         title: '告警事件查询详情'
//       }
//     }]
//   }]
// }, {
//   path: 'entrancePersonnelManagement',
//   name: 'entrancePersonnelManagement',
//   component: () =>
//     import('view/testpage/index'),
//   meta: {
//     title: '人员管理',
//     icon: 'iconfont icon-shebeijieru'
//   },
//   children: [{
//     path: 'entranceVisitorInformation',
//     name: 'entranceVisitorInformation',
//     component: () =>
//       import('view/adminEntrance/personnelManagement/visitorInformation/index'),
//     meta: {
//       children: false,
//       title: '访客管理'
//     },
//     children: [{
//       path: 'entranceVisitorInformationDetail',
//       name: 'entranceVisitorInformationDetail',
//       component: () =>
//         import('view/adminEntrance/personnelManagement/visitorInformation/detail'),
//       meta: {
//         children: false,
//         hideInMenu: true,
//         title: '访客详情'
//       }
//     }]
//   }, {
//     path: 'entrancePersonalInformation',
//     name: 'entrancePersonalInformation',
//     component: () =>
//       import('view/adminEntrance/personnelManagement/personalInformation/index'),
//     meta: {
//       children: false,
//       title: '人员信息'
//     }
//   }]
// }, {
//   path: 'entranceLimitManagement',
//   name: 'entranceLimitManagement',
//   component: () =>
//     import('view/testpage/index'),
//   meta: {
//     title: '权限管理',
//     icon: 'iconfont icon-shebeijieru'
//   },
//   children: [{
//     path: 'entrancedoorLimit',
//     name: 'entrancedoorLimit',
//     component: () =>
//       import('view/adminEntrance/limitManagement/doorLimit/index'),
//     meta: {
//       hideInMenu: true,
//       children: false,
//       title: '门禁权限管理'
//     }
//   }, {
//     path: 'permissionList',
//     name: 'permissionList',
//     component: () =>
//       import('view/adminEntrance/limitManagement/permissionList/index'),
//     meta: {
//       children: false,
//       title: '权限列表'
//     }
//   }]
// }, {
//   path: 'entranceDeviceManagement',
//   name: 'entranceDeviceManagement',
//   component: () =>
//     import('view/testpage/index'),
//   meta: {
//     title: '设备管理',
//     icon: 'iconfont icon-shebeijieru'
//   },
//   children: [{
//     path: 'entranceDeviceList',
//     name: 'entranceDeviceList',
//     component: () =>
//       import('view/adminEntrance/deviceManagement/deviceList/index'),
//     meta: {
//       children: false,
//       title: '设备管理'
//     }
//   }]
// }];

// export const adminWaterRoute = [{
//   path: 'waterManagement',
//   name: 'waterManagement',
//   component: () =>
//     import('view/testpage/index'),
//   meta: {
//     title: '实时监控',
//     icon: 'iconfont icon-shebeijieru'
//   },
//   children: [{
//     path: 'waterTimeMonitoring',
//     name: 'waterTimeMonitoring',
//     component: () =>
//       import('view/adminWater/waterManagement/timeMonitoring/index'),
//     meta: {
//       children: false,
//       title: '实时监控'
//     }
//   }]
// }, {
//   path: 'dataQuery',
//   name: 'dataQuery',
//   component: () =>
//     import('view/testpage/index'),
//   meta: {
//     title: '数据查询',
//     icon: 'iconfont icon-shebeijieru'
//   },
//   children: [{
//     path: 'meterReadingData',
//     name: 'meterReadingData',
//     component: () =>
//       import('view/adminWater/dataQuery/meterReadingData/index'),
//     meta: {
//       children: false,
//       title: '抄表数据'
//     }
//   }, {
//     path: 'chargeRecord',
//     name: 'chargeRecord',
//     component: () =>
//       import('view/adminWater/dataQuery/chargeRecord/index'),
//     meta: {
//       children: false,
//       title: '收费记录'
//     }
//   }, {
//     path: 'waterMeterManagement',
//     name: 'waterMeterManagement',
//     component: () =>
//       import('view/adminWater/dataQuery/waterMeterManagement/index'),
//     meta: {
//       children: false,
//       title: '水表管理'
//     }
//   }, {
//     path: 'dataDetail',
//     name: 'dataDetail',
//     component: () =>
//       import('view/adminWater/dataQuery/dataDetail/index'),
//     meta: {
//       children: false,
//       title: '水表详情',
//       hideInMenu: true
//     }
//   }]
// }, {
//   path: 'statisticalAnalysis',
//   name: 'statisticalAnalysis',
//   component: () =>
//     import('view/testpage/index'),
//   meta: {
//     title: '统计分析',
//     icon: 'iconfont icon-shebeijieru'
//   },
//   children: [{
//     path: 'energyConsumptionAnalysis',
//     name: 'energyConsumptionAnalysis',
//     component: () =>
//       import('view/adminWater/statisticalAnalysis/energyConsumptionAnalysis/index'),
//     meta: {
//       children: false,
//       title: '能耗分析'
//     }
//   }, {
//     path: 'chargeStatistics',
//     name: 'chargeStatistics',
//     component: () =>
//       import('view/adminWater/statisticalAnalysis/chargeStatistics/index'),
//     meta: {
//       children: false,
//       title: '收费统计'
//     }
//   }, {
//     path: 'monthlyPaymentReport',
//     name: 'monthlyPaymentReport',
//     component: () =>
//       import('view/adminWater/statisticalAnalysis/monthlyPaymentReport/index'),
//     meta: {
//       children: false,
//       title: '缴费月报'
//     }
//   }, {
//     path: 'summaryTableAnalysis',
//     name: 'summaryTableAnalysis',
//     component: () =>
//       import('view/adminWater/statisticalAnalysis/summaryTableAnalysis/index'),
//     meta: {
//       children: false,
//       title: '总表分析'
//     }
//   }]
// }, {
//   path: 'waterAlarmAnalysis',
//   name: 'waterAlarmAnalysis',
//   component: () =>
//     import('view/testpage/index'),
//   meta: {
//     title: '仪表报警',
//     icon: 'iconfont icon-shebeijieru'
//   },
//   children: [
//     {
//       path: 'instrumentAlarm',
//       name: 'instrumentAlarm',
//       component: () =>
//         import('view/adminWater/waterAlarmAnalysis/instrumentAlarm/index'),
//       meta: {
//         children: false,
//         title: '仪表报警',
//         hideInMenu: true
//       }
//     },
//     {
//       path: 'paymentAlarm',
//       name: 'paymentAlarm',
//       component: () =>
//         import('view/adminWater/waterAlarmAnalysis/paymentAlarm/index'),
//       meta: {
//         children: false,
//         title: '缴费报警'
//       }
//     },
//     {
//       path: 'deviceAlarm',
//       name: 'deviceAlarm',
//       component: () =>
//         import('view/adminWater/waterAlarmAnalysis/deviceAlarm/index'),
//       meta: {
//         children: false,
//         title: '设备报警'
//       }
//     }
//   ]
// }]

// export const adminBroadcastRoute = [{
//   path: 'broadcastManagement',
//   name: 'broadcastManagement',
//   component: () =>
//     import('view/testpage/index'),
//   meta: {
//     title: '远程控制',
//     icon: 'iconfont icon-shebeijieru'
//   },
//   children: [{
//     path: 'broadcastTimeMonitoring',
//     name: 'broadcastTimeMonitoring',
//     component: () =>
//       import('view/adminBroadcast/broadcastManagement/timeMonitoring/index'),
//     meta: {
//       children: false,
//       title: '远程控制'
//     }
//   }]
// }, {
//   path: 'broadcastControl',
//   name: 'broadcastControl',
//   component: () =>
//     import('view/testpage/index'),
//   meta: {
//     title: '广播控制',
//     icon: 'iconfont icon-shebeijieru'
//   },
//   children: [{
//     path: 'studioEquipment',
//     name: 'studioEquipment',
//     component: () =>
//       import('view/adminBroadcast/broadcastControl/studioEquipment'),
//     meta: {
//       title: '播控设备'
//     }
//   }, {
//     path: 'timeTaskList',
//     name: 'timeTaskList',
//     component: () =>
//       import('view/adminBroadcast/broadcastControl/timeTaskList'),
//     meta: {
//       title: '定时任务'
//     },
//     children: [{
//       path: 'timeTaskDetail',
//       name: 'timeTaskDetail',
//       component: () =>
//         import('view/adminBroadcast/broadcastControl/timeTaskList/detail'),
//       meta: {
//         hideInMenu: true,
//         title: '定时任务详情'
//       }
//     }]
//   }]
// }]

// const redirectRoutes = [{
//   name: 'adminLampIllumination',
//   redirect: '/LampIllumination/LampIllumination'
// }, {
//   name: 'adminScreen',
//   redirect: '/adminScreen/screenManagement'
// }, {
//   name: 'adminSupervise',
//   redirect: '/adminSupervise/superviseManagement'
// }, {
//   name: 'adminSmoke',
//   redirect: '/adminSmoke/smokeManagement'
// }, {
//   name: 'adminEntrance',
//   redirect: '/adminEntrance/entranceManagement'
// }, {
//   name: 'adminWater',
//   redirect: '/adminWater/waterManagement'
// }, {
//   name: 'adminBroadcast',
//   redirect: '/adminBroadcast/broadcastManagement'
// }, {
//   name: 'adminBaseManagement',
//   redirect: '/adminBaseManagement/basic_information_management'
// }, {
//   name: 'adminWorkOrder',
//   redirect: '/adminWorkOrder/work_order_management'
// }];

// export const adminLampIlluminationRoute = [{
//   path: 'LampIllumination',
//   name: 'LampIllumination',
//   component: () =>
//     import('view/testpage/index'),
//   meta: {
//     title: '能耗分析',
//     icon: 'iconfont icon-shebeijieru'
//   },
//   children: [{
//     path: 'lightPoleList',
//     name: 'lightPoleList',
//     component: () =>
//       import('view/lightPole/lightPoleList'),
//     meta: {
//       title: '灯杆运行数据'
//     }
//   }, {
//     path: 'lightPoleDayAnalysis',
//     name: 'lightPoleDayAnalysis',
//     component: () =>
//       import('view/lightPole/lightPoleDayAnalysis'),
//     meta: {
//       title: '日节能用电分析'
//     }
//   }, {
//     path: 'lightPoleMonthAnalysis',
//     name: 'lightPoleMonthAnalysis',
//     component: () =>
//       import('view/lightPole/lightPoleMonthAnalysis'),
//     meta: {
//       title: '月节能用电分析'
//     }
//   }, {
//     path: 'energyLightPoleList',
//     name: 'energyLightPoleList',
//     component: () =>
//       import('view/testpage/index'),
//     meta: {
//       hideInMenu: true,
//       title: '节能用电分析'
//     },
//     children: [{
//       path: 'lightPoleDayAnalysis',
//       name: 'lightPoleDayAnalysis',
//       component: () =>
//         import('view/lightPole/lightPoleDayAnalysis'),
//       meta: {
//         title: '日节能用电分析'
//       }
//     }]
//   }]
// }, {
//   path: 'LightingControl',
//   name: 'LightingControl',
//   component: () =>
//     import('view/testpage/index'),
//   meta: {
//     title: '照明控制',
//     icon: 'iconfont icon-shebeijieru'
//   },
//   children: [{
//     path: 'longRangControl',
//     name: 'longRangControl',
//     component: () =>
//       import('view/adminLight/lightingControl/longRangControl'),
//     meta: {
//       title: '远程控制'
//     }
//   }, {
//     path: 'illumination',
//     name: 'illumination',
//     component: () =>
//       import('view/controlStrategy/illumination'),
//     meta: {
//       title: '定时控制'
//     },
//     children: [{
//       path: 'illuminationDetail',
//       name: 'illuminationDetail',
//       component: () =>
//         import('view/controlStrategy/illumination/Detail'),
//       meta: {
//         title: '定时控制策略',
//         icon: 'iconfont icon-dot',
//         hideInMenu: true
//       }
//     }]
//   }]
// }, {
//   path: 'lightAnalysis',
//   name: 'lightAnalysis',
//   component: () =>
//     import('view/testpage/index'),
//   meta: {
//     title: '告警分析',
//     icon: 'iconfont icon-shebeijieru',
//     hideInMenu: true
//   },
//   children: [{
//     path: 'lightAlarmAnalysis',
//     name: 'lightAlarmAnalysis',
//     component: () =>
//       import('view/adminLight/lightAnalysis/lightAlarmAnalysis'),
//     meta: {
//       title: '告警分析',
//       icon: 'iconfont icon-dot'
//     }
//   }, {
//     path: 'lightNewsInfo',
//     name: 'lightNewsInfo',
//     component: () =>
//       import('view/adminLight/lightAnalysis/lightNewsInfo'),
//     meta: {
//       title: '消息日志',
//       icon: 'iconfont icon-dot'
//     }
//   }]
// }];

// export const adminScreenRoute = [{
//   path: 'screenManagement',
//   name: 'screenManagement',
//   component: () =>
//     import('view/testpage/index'),
//   meta: {
//     title: '一键控屏',
//     icon: 'iconfont icon-shebeijieru'
//   },
//   children: [{
//     path: 'fastScreen',
//     name: 'fastScreen',
//     component: () =>
//       import('view/adminScreen/screenManagement/fastScreen/index'),
//     meta: {
//       children: false,
//       title: '一键控屏'
//     }
//   }, {
//     path: 'screenPlayList',
//     name: 'screenPlayList',
//     component: () =>
//       import('view/adminScreen/screenManagement/playList/index'),
//     meta: {
//       children: false,
//       title: '播放任务列表'
//     }
//   }, {
//     path: 'timedScreen',
//     name: 'timedScreen',
//     component: () =>
//       import('view/adminScreen/screenManagement/timedScreen/index'),
//     meta: {
//       children: false,
//       title: '定时定点播放'
//     }
//   }, {
//     path: 'timeScreenCommonTemplate',
//     name: 'timeScreenCommonTemplate',
//     component: () =>
//       import('view/adminScreen/screenManagement/commonTemplate/index'),
//     meta: {
//       children: false,
//       title: '公共模板库'
//     }
//   }]
// }, {
//   path: 'screenAnalysis',
//   name: 'screenAnalysis',
//   component: () =>
//     import('view/testpage/index'),
//   meta: {
//     title: '告警分析',
//     icon: 'iconfont icon-shebeijieru'
//   },
//   children: [{
//     path: 'screenAlarmAnalysis',
//     name: 'screenAlarmAnalysis',
//     component: () =>
//       import('view/adminScreen/screenAnalysis/screenAlarmAnalysis'),
//     meta: {
//       title: '告警分析',
//       icon: 'iconfont icon-dot'
//     }
//   }, {
//     path: 'screenNewsInfo',
//     name: 'screenNewsInfo',
//     component: () =>
//       import('view/adminScreen/screenAnalysis/screenNewsInfo'),
//     meta: {
//       title: '消息日志',
//       icon: 'iconfont icon-dot'
//     }
//   }]
// }];

// export const adminSupervise = [{
//   path: 'superviseManagement',
//   name: 'superviseManagement',
//   component: () =>
//     import('view/testpage/index'),
//   meta: {
//     title: '实时监控',
//     icon: 'iconfont icon-shebeijieru'
//   },
//   children: [{
//     path: 'superviseTimeMonitoring',
//     name: 'superviseTimeMonitoring',
//     component: () =>
//       import('view/adminSupervise/timeMonitoring'),
//     meta: {
//       title: '实时监控'
//     }
//   }, {
//     path: 'superviseRecord',
//     name: 'superviseRecord',
//     component: () =>
//       import('view/adminSupervise/superviseRecord'),
//     meta: {
//       title: '报警事件'
//     }
//   }, {
//     path: 'superviseHistoryRecord',
//     name: 'superviseHistoryRecord',
//     component: () =>
//       import('view/adminSupervise/historyRecord'),
//     meta: {
//       title: '历史数据'
//     }
//   }, {
//     path: 'superviseDeviceManage',
//     name: 'superviseDeviceManage',
//     component: () =>
//       import('view/adminSupervise/deviceManage'),
//     meta: {
//       title: '设备管理'
//     }
//   }]
// }];

// export const adminBaseRoute = [{
//   path: '/basic_information_management',
//   name: 'basic_information_management',
//   component: () =>
//     import('view/testpage/index'),
//   meta: {
//     title: '基础信息管理',
//     icon: 'iconfont icon-chanpinguanli'
//   },
//   children: [{
//     path: 'role_management',
//     name: 'role_management',
//     component: () =>
//       import('view/adminBaseManagement/baseInfoManage/roleManagement/index'),
//     meta: {
//       title: '角色管理',
//       icon: 'iconfont icon-dot'
//     }
//   },
//   {
//     path: 'user_management',
//     name: 'user_management',
//     component: () =>
//       import('@/view/adminBaseManagement/baseInfoManage/userManagement/Users'),
//     meta: {
//       title: '用户管理',
//       icon: 'iconfont icon-dot'
//     }
//   },
//   {
//     path: 'resources_management',
//     name: 'resources_management',
//     component: () =>
//       import('@/view/adminBaseManagement/baseInfoManage/resourcesManagement/index'),
//     meta: {
//       title: '权限管理',
//       icon: 'iconfont icon-dot'
//     }
//   },
//   {
//     path: 'dictionaries_management',
//     name: 'dictionaries_management',
//     component: () =>
//       import('@/view/adminBaseManagement/baseInfoManage/dictionariesManagement/index'),
//     meta: {
//       title: '字典管理',
//       icon: 'iconfont icon-dot'
//     }
//   },
//   {
//     path: 'atta_templet',
//     name: 'atta_templet',
//     component: () =>
//       import('@/view/adminBaseManagement/baseInfoManage/attaTemplet/index'),
//     meta: {
//       title: '附件模板',
//       icon: 'iconfont icon-dot',
//       hideInMenu: true
//     }
//   },
//   {
//     path: 'approve_config',
//     name: 'approve_config',
//     component: () =>
//       import('@/view/adminBaseManagement/baseInfoManage/approveConfig/index'),
//     meta: {
//       title: '处理流程配置',
//       icon: 'iconfont icon-dot'
//     }
//   },
//   {
//     path: 'treeManage',
//     name: 'treeManage',
//     component: () =>
//       import('@/view/adminBaseManagement/baseInfoManage/treeManage/index'),
//     meta: {
//       title: '园区组织树维护',
//       icon: 'iconfont icon-dot'
//     }
//   },
//   {
//     path: 'treeManage_city',
//     name: 'treeManage_city',
//     component: () =>
//       import('@/view/adminBaseManagement/baseInfoManage/treeManage_city/index'),
//     meta: {
//       title: '城市组织树维护',
//       icon: 'iconfont icon-dot'
//     }
//   }
//   ]
// }, {
//   path: 'linkageRuleManage',
//   name: 'linkageRuleManage',
//   component: () =>
//     import('view/testpage/index'),
//   meta: {
//     title: '联动规则管理',
//     icon: 'iconfont icon-shebeijieru'
//   },
//   children: [{
//     path: 'linkageRuleList',
//     name: 'linkageRuleList',
//     component: () =>
//       import('view/adminBaseManagement/linkageRuleManage/linkageRuleList/index'),
//     meta: {
//       title: '联动规则管理'
//     },
//     children: [{
//       path: 'linkageRuleListDetail',
//       name: 'linkageRuleListDetail',
//       component: () =>
//         import('view/adminBaseManagement/linkageRuleManage/linkageRuleList/detail'),
//       meta: {
//         hideInMenu: true,
//         title: '联动规则管理详情'
//       }
//     }]
//   }, {
//     path: 'linkageCommonTemplate',
//     name: 'linkageCommonTemplate',
//     component: () =>
//       import('view/adminBaseManagement/linkageRuleManage/linkageRuleList/commonTemplate/index'),
//     meta: {
//       title: '公共模板库'
//     }
//   }]
// }];

// export const adminWorkOrderRoute = [{
//   path: '/work_order_management',
//   name: 'work_order_management',
//   component: () =>
//     import('view/testpage/index'),
//   meta: {
//     title: '工单管理',
//     icon: 'iconfont icon-chanpinguanli'
//   },
//   children: [{
//     path: 'workOrder',
//     name: 'workOrder',
//     component: () =>
//       import('view/adminWorkOrder/workOrderManagement/workOrder/index'),
//     meta: {
//       title: '工单管理',
//       icon: 'iconfont icon-dot'
//     }
//   }, {
//     path: 'createOrder',
//     name: 'createOrder',
//     component: () =>
//       import('view/adminWorkOrder/workOrderManagement/createOrder/index'),
//     meta: {
//       title: '创建工单',
//       icon: 'iconfont icon-dot',
//       hideInMenu: true
//     }
//   }, {
//     path: 'orderDetail',
//     name: 'orderDetail',
//     component: () =>
//       import('view/adminWorkOrder/workOrderManagement/orderDetail/index'),
//     meta: {
//       title: '工单详情',
//       icon: 'iconfont icon-dot',
//       hideInMenu: true
//     }
//   }, {
//     path: 'myTask',
//     name: 'myTask',
//     component: () =>
//       import('view/adminWorkOrder/workOrderManagement/myTask/index'),
//     meta: {
//       title: '我的任务',
//       icon: 'iconfont icon-dot'
//     }
//   }, {
//     path: 'maintenancePlan',
//     name: 'maintenancePlan',
//     component: () =>
//       import('view/adminWorkOrder/workOrderManagement/maintenancePlan/index'),
//     meta: {
//       title: '设备保养计划',
//       icon: 'iconfont icon-dot'
//     }
//   }, {
//     path: 'alarmManage',
//     name: 'alarmManage',
//     component: () =>
//       import('view/adminWorkOrder/workOrderManagement/alarmManage/index'),
//     meta: {
//       title: '告警管理',
//       icon: 'iconfont icon-dot'
//     }
//   }, {
//     path: 'personnelManage',
//     name: 'personnelManage',
//     component: () =>
//       import('view/adminWorkOrder/workOrderManagement/personnelManage/index'),
//     meta: {
//       title: '人员管理',
//       icon: 'iconfont icon-dot'
//     }
//   }]
// }];

// export const adminAmmeterRoute = [{
//   path: '/ammeterManagement',
//   name: 'ammeterManagement',
//   component: () =>
//     import('view/testpage/index'),
//   meta: {
//     title: '实时监控',
//     icon: 'iconfont icon-chanpinguanli'
//   },
//   children: [{
//     path: 'ammeterTimeMonitoring',
//     name: 'ammeterTimeMonitoring',
//     component: () =>
//       import('view/adminAmmeter/timeMonitoring'),
//     meta: {
//       title: '实时监控'
//     }
//   }]
// }, {
//   path: 'ammeterDataQuery',
//   name: 'ammeterDataQuery',
//   component: () =>
//     import('view/testpage/index'),
//   meta: {
//     title: '数据查询',
//     icon: 'iconfont icon-shebeijieru'
//   },
//   children: [{
//     path: 'ammeterMeterReadingData',
//     name: 'ammeterMeterReadingData',
//     component: () =>
//       import('view/adminAmmeter/dataQuery/meterReadingData/index'),
//     meta: {
//       children: false,
//       title: '抄表数据'
//     }
//   }, {
//     path: 'ammeterChargeRecord',
//     name: 'ammeterChargeRecord',
//     component: () =>
//       import('view/adminAmmeter/dataQuery/chargeRecord/index'),
//     meta: {
//       children: false,
//       title: '收费记录'
//     }
//   }, {
//     path: 'ammeterMeterManagement',
//     name: 'ammeterMeterManagement',
//     component: () =>
//       import('view/adminAmmeter/dataQuery/ammeterMeterManagement/index'),
//     meta: {
//       children: false,
//       title: '电表管理'
//     }
//   }, {
//     path: 'ammeterDataDetail',
//     name: 'ammeterDataDetail',
//     component: () =>
//       import('view/adminAmmeter/dataQuery/dataDetail/index'),
//     meta: {
//       children: false,
//       title: '电表信息'
//     }
//   }]
// }, {
//   path: 'ammeterPrepaymentManagement',
//   name: 'ammeterPrepaymentManagement',
//   component: () =>
//     import('view/testpage/index'),
//   meta: {
//     title: '预付费管理',
//     icon: 'iconfont icon-shebeijieru'
//   },
//   children: [{
//     path: 'ammeterPrepayManagement',
//     name: 'ammeterPrepayManagement',
//     component: () =>
//       import('view/adminAmmeter/prepaymentManagement/management/index'),
//     meta: {
//       children: false,
//       title: '预付费管理'
//     }
//   }, {
//     path: 'ammeterPrepayHistory',
//     name: 'ammeterPrepayHistory',
//     component: () =>
//       import('view/adminAmmeter/prepaymentManagement/history/index'),
//     meta: {
//       children: false,
//       title: '充值历史'
//     }
//   }]
// }, {
//   path: 'ammeterAnalyzeAlarm',
//   name: 'ammeterAnalyzeAlarm',
//   component: () =>
//     import('view/testpage/index'),
//   meta: {
//     title: '报警分析',
//     icon: 'iconfont icon-shebeijieru'
//   },
//   children: [{
//     path: 'ammeterInstrumentAlarm',
//     name: 'ammeterInstrumentAlarm',
//     component: () =>
//       import('view/adminAmmeter/alarmAnalyze/instrumentAlarm/index'),
//     meta: {
//       children: false,
//       title: '仪器报警'
//     }
//   }, {
//     path: 'ammeterPaymentAlarm',
//     name: 'ammeterPaymentAlarm',
//     component: () =>
//       import('view/adminAmmeter/alarmAnalyze/paymentAlarm/index'),
//     meta: {
//       children: false,
//       title: '缴费报警'
//     }
//   }]
// }];

// export const loginRoute = [
//   // { path: '/', redirect: '/login' },
//   // { path: '/indexPage', redirect: '/index/lightPoleMap' },
//   {
//     path: '/login',
//     name: 'login',
//     component: () =>
//     import('components/login/login')
//   }]

export default [
  // { path: '/', redirect: '/index/lightPoleMap' },
  {
    path: '/login',
    name: 'login',
    component: () =>
      import('components/login/login')
  },

  // 后台管理菜单
  {
    path: '/test',
    name: 'test',
    component: MainView,
    meta: {
      hideInMenu: true,
      title: '测试界面',
      icon: 'iconfont icon-fuwuqi'
    },
    children: [{
      path: 'testpage1',
      name: 'testpage1',
      component: () =>
        import('view/testpage/index'),
      meta: {
        title: '测试1',
        icon: 'iconfont icon-tuopu'
      }
    }]
  },
  {
    path: '/monitorMap',
    name: 'monitorMap',
    component: () =>
      import('view/mobile/map'),
    meta: {
      title: '视频监控',
      hideInMenu: true
    }
  },
  {
    path: '/monitorList',
    name: 'monitorList',
    component: () =>
      import('view/mobile/detail'),
    meta: {
      title: '监控详情',
      hideInMenu: true
    }
  },
  {
    path: '/error_404',
    name: 'error_404',
    component: () =>
      import('components/error_404')
  }
]
