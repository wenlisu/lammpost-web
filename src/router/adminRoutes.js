import { hasValue, saveLocal, getLocal } from 'util/tool'
const adminView = () => import('components/adminView');
const MainView = () => import('components/mainView')
let whiteRouterList = getLocal('whiteRouterList') // 白名单
const indexPath = process.env.NODE_ENV === 'hainan' ? 'newIndex' : 'newIndex';
// const indexPath = 'newIndex'
export const adminRoute = [
  {
    path: 'use',
    name: 'use',
    component: () =>
      import('view/testpage/index'),
    meta: {
      title: '应用管理',
      icon: 'iconfont icon-yingyongguanli'
    },
    children: [{
      path: 'useManage',
      name: 'useManage',
      component: () =>
        import('view/admin/use/useManage/index'),
      meta: {
        title: '应用管理'
      },
      children: [{
        path: 'useManagePage',
        name: 'useManagePage',
        component: () =>
          import('view/admin/use/useManage/page'),
        meta: {
          hideInMenu: true,
          title: '应用管理详情'
        }
      }]
    }]
  },
  {
    path: 'productManagement',
    name: 'productManagement',
    component: () =>
      import('view/testpage/index'),
    meta: {
      title: '产品管理',
      icon: 'iconfont icon-chanpinguanli'
    },
    children: [{
      path: 'productManagementDetail',
      name: 'productManagementDetail',
      component: () =>
        import('view/admin/equipmentAccess/productManagement/index'),
      meta: {
        title: '产品管理'
      },
      children: [{
        path: 'productManagementPage',
        name: 'productManagementPage',
        component: () =>
          import('view/admin/equipmentAccess/productManagement/page'),
        meta: {
          hideInMenu: true,
          title: '产品管理详情'
        }
      }]
    }]
  },
  {
    path: 'equipmentManagement',
    name: 'equipmentManagement',
    component: () =>
      import('view/testpage/index'),
    meta: {
      title: '设备管理',
      icon: 'iconfont icon-shebeiguanli'
    },
    children: [{
      path: 'deviceOverview',
      name: 'deviceOverview',
      component: () =>
        import('view/admin/equipmentManagement/deviceOverview/index'),
      meta: {
        title: '设备概览'
      }
    }, {
      path: 'equipmentList',
      name: 'equipmentList',
      component: () =>
        import('view/admin/equipmentManagement/equipmentList/index'),
      meta: {
        title: '设备管理'
      },
      children: [{
        path: 'equipmentListDetail',
        name: 'equipmentListDetail',
        component: () =>
          import('view/admin/equipmentManagement/equipmentDetail/index'),
        meta: {
          hidden: true,
          title: '设备管理详情'
        }
      }]
    }, {
      path: 'equipmentDetail',
      name: 'equipmentDetail',
      component: () =>
        import('view/admin/equipmentManagement/equipmentDetail/index'),
      meta: {
        title: '设备明细'
      }
    }, {
      path: 'vendorManagement',
      name: 'vendorManagement',
      component: () =>
        import('view/admin/equipmentManagement/vendorManagement/index'),
      meta: {
        title: '厂商管理'
      }
    }, {
      path: 'sensorManagement',
      name: 'sensorManagement',
      component: () =>
        import('view/admin/equipmentManagement/sensorManagement/index'),
      meta: {
        title: '设施类型管理'
      }
    }, {
      path: 'deviceManagement',
      name: 'deviceManagement',
      component: () =>
        import('view/admin/equipmentManagement/deviceManagement/index'),
      meta: {
        title: '设备类型管理'
      }
    }]
  },
  {
    path: 'equipmentAccess',
    name: 'equipmentAccess',
    component: () =>
      import('view/testpage/index'),
    meta: {
      title: '设备接入',
      icon: 'iconfont icon-shebeijieru'
    },
    children: [{
      path: 'lampPoleManagement',
      name: 'lampPoleManagement',
      component: () =>
        import('view/admin/equipmentAccess/lampPoleManagement/index'),
      meta: {
        children: false,
        title: '灯杆设备管理'
      },
      children: [{
        path: 'lampPoleManagementEdit',
        name: 'lampPoleManagementEdit',
        component: () =>
          import('view/admin/equipmentAccess/lampPoleManagement/detail'),
        meta: {
          hidden: true,
          title: '接入设施设备'
        }
      }]
    }, {
      path: 'batchEquipmentAccess',
      name: 'batchEquipmentAccess',
      component: () =>
        import('view/admin/equipmentAccess/batchEquipmentAccess/index'),
      meta: {
        title: '批量关联设备'
      }
    }]
  },
  {
    path: 'monitorOperation',
    name: 'monitorOperation',
    component: () =>
      import('view/testpage/index'),
    meta: {
      title: '监控运维',
      icon: 'iconfont icon-jiankongyunwei'
    },
    children: [{
      path: 'monitorReportManage',
      name: 'monitorReportManage',
      component: () =>
        import('view/admin/monitorOperation/monitorReportManage/index'),
      meta: {
        title: '告警管理'
      }
    }]
  },
  {
    path: 'ruleEngine',
    name: 'ruleEngine',
    component: () =>
      import('view/testpage/index'),
    meta: {
      title: '规则引擎',
      icon: 'iconfont icon-guizeyinqing'
    },
    children: [{
      path: 'ruleManagement',
      name: 'ruleManagement',
      component: () =>
        import('view/admin/ruleEngine/ruleManagement/index'),
      meta: {
        title: '规则管理'
      },
      children: [{
        path: 'ruleManageEdit',
        name: 'ruleManageEdit',
        component: () =>
          import('view/admin/ruleEngine/ruleManagement/detail'),
        meta: {
          hideInMenu: true,
          title: '设备联动规则详情'
        }
      }]
    }]
  }];

export const adminSmokeRoute = [{
  path: 'smokeManagement',
  name: 'smokeManagement',
  component: () =>
    import('view/testpage/index'),
  meta: {
    title: '实时监控',
    icon: 'iconfont icon-shebeijieru'
  },
  children: [{
    path: 'smokeTimeMonitoring',
    name: 'smokeTimeMonitoring',
    component: () =>
      import('view/adminSmoke/smokeManagement/timeMonitoring/index'),
    meta: {
      children: false,
      title: '实时监控'
    }
  }, {
    path: 'smokeDeviceManage',
    name: 'smokeDeviceManage',
    component: () =>
      import('view/adminSmoke/smokeManagement/smokeDeviceManage/index'),
    meta: {
      children: false,
      title: '设备管理'
    }
  }]
}, {
  path: 'alarmAnalysis',
  name: 'alarmAnalysis',
  component: () =>
    import('view/testpage/index'),
  meta: {
    title: '告警分析',
    icon: 'iconfont icon-shebeijieru'
  },
  children: [{
    path: 'alarmStatistics',
    name: 'alarmStatistics',
    component: () =>
      import('view/adminSmoke/alarmAnalysis/alarmStatistics/index'),
    meta: {
      children: false,
      title: '告警统计'
    },
    children: [{
      path: 'alarmStatisticsPage',
      name: 'alarmStatisticsPage',
      component: () =>
        import('view/adminSmoke/alarmAnalysis/alarmStatistics/index'),
      meta: {
        children: false,
        hideInMenu: true,
        title: '告警统计详情'
      }
    }]
  }, {
    path: 'faultStatistics',
    name: 'faultStatistics',
    component: () =>
      import('view/adminSmoke/alarmAnalysis/faultStatistics/index'),
    meta: {
      children: false,
      title: '故障统计'
    },
    children: [{
      path: 'faultStatisticPage',
      name: 'faultStatisticPage',
      component: () =>
        import('view/adminSmoke/alarmAnalysis/faultStatistics/page'),
      meta: {
        children: false,
        hideInMenu: true,
        title: '故障统计详情'
      }
    }]
  }]
}, {
  path: 'smokeAnalysis',
  name: 'smokeAnalysis',
  component: () =>
    import('view/testpage/index'),
  meta: {
    title: '统计分析',
    icon: 'iconfont icon-shebeijieru'
  },
  children: [{
    path: 'smokeStatisticAnalysis',
    name: 'smokeStatisticAnalysis',
    component: () =>
      import('view/adminSmoke/smokeAnalysis/smokeStatisticAnalysis1/index'),
    meta: {
      children: false,
      title: '统计分析'
    }
  }]
}];

export const adminEntranceRoute = [{
  path: 'entranceManagement',
  name: 'entranceManagement',
  component: () =>
    import('view/testpage/index'),
  meta: {
    title: '实时监控',
    icon: 'iconfont icon-shebeijieru'
  },
  children: [{
    path: 'entranceTimeMonitoring',
    name: 'entranceTimeMonitoring',
    component: () =>
      import('view/adminEntrance/entranceManagement/timeMonitoring/index'),
    meta: {
      children: false,
      title: '实时监控'
    }
  }, {
    path: 'entranceAccessRecords',
    name: 'entranceAccessRecords',
    component: () =>
      import('view/adminEntrance/entranceManagement/accessRecords/index'),
    meta: {
      children: false,
      title: '出入记录'
    }
  }, {
    path: 'entranceTrajectoryAnalysis',
    name: 'entranceTrajectoryAnalysis',
    component: () =>
      import('view/adminEntrance/entranceManagement/trajectoryAnalysis/index'),
    meta: {
      children: false,
      title: '访客轨迹分析'
    }
  }]
}, {
  path: 'entranceAlarmAnalysis',
  name: 'entranceAlarmAnalysis',
  component: () =>
    import('view/testpage/index'),
  meta: {
    title: '告警分析',
    icon: 'iconfont icon-shebeijieru'
  },
  children: [{
    path: 'entranceInOutEvent',
    name: 'entranceInOutEvent',
    component: () =>
      import('view/adminEntrance/alarmAnalysis/inOutEvent/index'),
    meta: {
      children: false,
      title: '进出事件查询'
    }
  }, {
    path: 'entranceAlarmEvent',
    name: 'entranceAlarmEvent',
    component: () =>
      import('view/adminEntrance/alarmAnalysis/alarmEvent/index'),
    meta: {
      children: false,
      title: '告警事件查询'
    },
    children: [{
      path: 'entranceAlarmEventDetail',
      name: 'entranceAlarmEventDetail',
      component: () =>
        import('view/adminEntrance/alarmAnalysis/alarmEvent/detail'),
      meta: {
        children: false,
        hideInMenu: true,
        title: '告警事件查询详情'
      }
    }]
  }]
}, {
  path: 'entrancePersonnelManagement',
  name: 'entrancePersonnelManagement',
  component: () =>
    import('view/testpage/index'),
  meta: {
    title: '人员管理',
    icon: 'iconfont icon-shebeijieru'
  },
  children: [{
    path: 'entranceVisitorInformation',
    name: 'entranceVisitorInformation',
    component: () =>
      import('view/adminEntrance/personnelManagement/visitorInformation/index'),
    meta: {
      children: false,
      title: '访客管理'
    },
    children: [{
      path: 'entranceVisitorInformationDetail',
      name: 'entranceVisitorInformationDetail',
      component: () =>
        import('view/adminEntrance/personnelManagement/visitorInformation/detail'),
      meta: {
        children: false,
        hideInMenu: true,
        title: '访客详情'
      }
    }]
  }, {
    path: 'entrancePersonalInformation',
    name: 'entrancePersonalInformation',
    component: () =>
      import('view/adminEntrance/personnelManagement/personalInformation/index'),
    meta: {
      children: false,
      title: '人员信息'
    }
  }]
}, {
  path: 'entranceLimitManagement',
  name: 'entranceLimitManagement',
  component: () =>
    import('view/testpage/index'),
  meta: {
    title: '权限管理',
    icon: 'iconfont icon-shebeijieru'
  },
  children: [{
    path: 'entrancedoorLimit',
    name: 'entrancedoorLimit',
    component: () =>
      import('view/adminEntrance/limitManagement/doorLimit/index'),
    meta: {
      hideInMenu: true,
      children: false,
      title: '门禁权限管理'
    }
  }, {
    path: 'permissionList',
    name: 'permissionList',
    component: () =>
      import('view/adminEntrance/limitManagement/permissionList/index'),
    meta: {
      children: false,
      title: '权限列表'
    }
  }]
}, {
  path: 'entranceDeviceManagement',
  name: 'entranceDeviceManagement',
  component: () =>
    import('view/testpage/index'),
  meta: {
    title: '设备管理',
    icon: 'iconfont icon-shebeijieru'
  },
  children: [{
    path: 'entranceDeviceList',
    name: 'entranceDeviceList',
    component: () =>
      import('view/adminEntrance/deviceManagement/deviceList/index'),
    meta: {
      children: false,
      title: '设备管理'
    }
  }]
}];

export const adminWaterRoute = [{
  path: 'waterManagement',
  name: 'waterManagement',
  component: () =>
    import('view/testpage/index'),
  meta: {
    title: '实时监控',
    icon: 'iconfont icon-shebeijieru'
  },
  children: [{
    path: 'waterTimeMonitoring',
    name: 'waterTimeMonitoring',
    component: () =>
      import('view/adminWater/waterManagement/timeMonitoring/index'),
    meta: {
      children: false,
      title: '实时监控'
    }
  }]
}, {
  path: 'dataQuery',
  name: 'dataQuery',
  component: () =>
    import('view/testpage/index'),
  meta: {
    title: '数据查询',
    icon: 'iconfont icon-shebeijieru'
  },
  children: [{
    path: 'meterReadingData',
    name: 'meterReadingData',
    component: () =>
      import('view/adminWater/dataQuery/meterReadingData/index'),
    meta: {
      children: false,
      title: '抄表数据'
    }
  }, {
    path: 'chargeRecord',
    name: 'chargeRecord',
    component: () =>
      import('view/adminWater/dataQuery/chargeRecord/index'),
    meta: {
      children: false,
      title: '收费记录'
    }
  }, {
    path: 'waterMeterManagement',
    name: 'waterMeterManagement',
    component: () =>
      import('view/adminWater/dataQuery/waterMeterManagement/index'),
    meta: {
      children: false,
      title: '水表管理'
    }
  }, {
    path: 'dataDetail',
    name: 'dataDetail',
    component: () =>
      import('view/adminWater/dataQuery/dataDetail/index'),
    meta: {
      children: false,
      title: '水表详情',
      hideInMenu: true
    }
  }]
}, {
  path: 'statisticalAnalysis',
  name: 'statisticalAnalysis',
  component: () =>
    import('view/testpage/index'),
  meta: {
    title: '统计分析',
    icon: 'iconfont icon-shebeijieru'
  },
  children: [{
    path: 'energyConsumptionAnalysis',
    name: 'energyConsumptionAnalysis',
    component: () =>
      import('view/adminWater/statisticalAnalysis/energyConsumptionAnalysis/index'),
    meta: {
      children: false,
      title: '能耗分析'
    }
  }, {
    path: 'chargeStatistics',
    name: 'chargeStatistics',
    component: () =>
      import('view/adminWater/statisticalAnalysis/chargeStatistics/index'),
    meta: {
      children: false,
      title: '收费统计'
    }
  }, {
    path: 'monthlyPaymentReport',
    name: 'monthlyPaymentReport',
    component: () =>
      import('view/adminWater/statisticalAnalysis/monthlyPaymentReport/index'),
    meta: {
      children: false,
      title: '缴费月报'
    }
  }, {
    path: 'summaryTableAnalysis',
    name: 'summaryTableAnalysis',
    component: () =>
      import('view/adminWater/statisticalAnalysis/summaryTableAnalysis/index'),
    meta: {
      children: false,
      title: '总表分析'
    }
  }]
}, {
  path: 'waterAlarmAnalysis',
  name: 'waterAlarmAnalysis',
  component: () =>
    import('view/testpage/index'),
  meta: {
    title: '仪表报警',
    icon: 'iconfont icon-shebeijieru'
  },
  children: [
    {
      path: 'instrumentAlarm',
      name: 'instrumentAlarm',
      component: () =>
        import('view/adminWater/waterAlarmAnalysis/instrumentAlarm/index'),
      meta: {
        children: false,
        title: '仪表报警',
        hideInMenu: true
      }
    },
    {
      path: 'paymentAlarm',
      name: 'paymentAlarm',
      component: () =>
        import('view/adminWater/waterAlarmAnalysis/paymentAlarm/index'),
      meta: {
        children: false,
        title: '缴费报警'
      }
    },
    {
      path: 'deviceAlarm',
      name: 'deviceAlarm',
      component: () =>
        import('view/adminWater/waterAlarmAnalysis/deviceAlarm/index'),
      meta: {
        children: false,
        title: '设备报警'
      }
    }
  ]
}]

export const adminBroadcastRoute = [{
  path: 'broadcastManagement',
  name: 'broadcastManagement',
  component: () =>
    import('view/testpage/index'),
  meta: {
    title: '远程控制',
    icon: 'iconfont icon-shebeijieru'
  },
  children: [{
    path: 'broadcastTimeMonitoring',
    name: 'broadcastTimeMonitoring',
    component: () =>
      import('view/adminBroadcast/broadcastManagement/timeMonitoring/index'),
    meta: {
      children: false,
      title: '远程控制'
    }
  }]
}, {
  path: 'broadcastControl',
  name: 'broadcastControl',
  component: () =>
    import('view/testpage/index'),
  meta: {
    title: '广播控制',
    icon: 'iconfont icon-shebeijieru'
  },
  children: [{
    path: 'studioEquipment',
    name: 'studioEquipment',
    component: () =>
      import('view/adminBroadcast/broadcastControl/studioEquipment'),
    meta: {
      title: '播控设备'
    }
  }, {
    path: 'timeTaskList',
    name: 'timeTaskList',
    component: () =>
      import('view/adminBroadcast/broadcastControl/timeTaskList'),
    meta: {
      title: '定时任务'
    },
    children: [{
      path: 'timeTaskDetail',
      name: 'timeTaskDetail',
      component: () =>
        import('view/adminBroadcast/broadcastControl/timeTaskList/detail'),
      meta: {
        hideInMenu: true,
        title: '定时任务详情'
      }
    }]
  }]
}]

export const adminWifiRoute = [
  {
    path: 'wifiDevInfo',
    name: 'wifiDevInfo',
    component: () =>
      import('view/testpage/index'),
    meta: {
      title: '设备列表',
      icon: 'iconfont icon-shebeijieru'
    },
    children: [{
      path: 'deviceInfo',
      name: 'deviceInfo',
      component: () =>
        import('view/adminWifi/devInfo'),
      meta: {
        children: false,
        title: 'WIFI设备信息'
      }
    }]
  },
  {
    path: 'wifiAPTraffic',
    name: 'wifiAPTraffic',
    component: () =>
      import('view/testpage/index'),
    meta: {
      title: '数据统计',
      icon: 'iconfont icon-shebeijieru'
    },
    children: [{
      path: 'APTraffic',
      name: 'APTraffic',
      component: () =>
        import('view/adminWifi/APTraffic'),
      meta: {
        children: false,
        title: 'AP流量统计'
      }
    }, {
      path: 'APLoad',
      name: 'APLoad',
      component: () =>
        import('view/adminWifi/APLoad'),
      meta: {
        children: false,
        title: 'AP负载量统计'
      }
    }]
  },
  {
    path: 'wifiWarmingNotice',
    name: 'wifiWarmingNotice',
    component: () =>
      import('view/testpage/index'),
    meta: {
      title: '告警查询',
      icon: 'iconfont icon-shebeijieru'
    },
    children: [{
      path: 'warmNotice',
      name: 'warmNotice',
      component: () =>
        import('view/adminWifi/warnNotice'),
      meta: {
        children: false,
        title: '告警通知'
      }
    }]
  }
]
export const adminLampIlluminationRoute = [{
  path: 'LampIllumination',
  name: 'LampIllumination',
  component: () =>
    import('view/testpage/index'),
  meta: {
    title: '能耗分析',
    icon: 'iconfont icon-shebeijieru'
  },
  children: [{
    path: 'lightPoleList',
    name: 'lightPoleList',
    component: () =>
      import('view/lightPole/lightPoleList'),
    meta: {
      title: '灯杆运行数据'
    }
  }, {
    path: 'lightPoleDayAnalysis',
    name: 'lightPoleDayAnalysis',
    component: () =>
      import('view/lightPole/lightPoleDayAnalysis'),
    meta: {
      title: '日节能用电分析'
    }
  }, {
    path: 'lightPoleMonthAnalysis',
    name: 'lightPoleMonthAnalysis',
    component: () =>
      import('view/lightPole/lightPoleMonthAnalysis'),
    meta: {
      title: '月节能用电分析'
    }
  }, {
    path: 'energyLightPoleList',
    name: 'energyLightPoleList',
    component: () =>
      import('view/testpage/index'),
    meta: {
      hideInMenu: true,
      title: '节能用电分析'
    },
    children: [{
      path: 'lightPoleDayAnalysis',
      name: 'lightPoleDayAnalysis',
      component: () =>
        import('view/lightPole/lightPoleDayAnalysis'),
      meta: {
        title: '日节能用电分析'
      }
    }]
  }]
}, {
  path: 'LightingControl',
  name: 'LightingControl',
  component: () =>
    import('view/testpage/index'),
  meta: {
    title: '照明控制',
    icon: 'iconfont icon-shebeijieru'
  },
  children: [{
    path: 'longRangControl',
    name: 'longRangControl',
    component: () =>
      import('view/adminLight/lightingControl/longRangControl'),
    meta: {
      title: '远程控制'
    }
  }, {
    path: 'illumination',
    name: 'illumination',
    component: () =>
      import('view/controlStrategy/illumination'),
    meta: {
      title: '定时控制'
    },
    children: [{
      path: 'illuminationDetail',
      name: 'illuminationDetail',
      component: () =>
        import('view/controlStrategy/illumination/Detail'),
      meta: {
        title: '定时控制策略',
        icon: 'iconfont icon-dot',
        hideInMenu: true
      }
    }]
  }]
}, {
  path: 'lightAnalysis',
  name: 'lightAnalysis',
  component: () =>
    import('view/testpage/index'),
  meta: {
    title: '告警分析',
    icon: 'iconfont icon-shebeijieru',
    hideInMenu: true
  },
  children: [{
    path: 'lightAlarmAnalysis',
    name: 'lightAlarmAnalysis',
    component: () =>
      import('view/adminLight/lightAnalysis/lightAlarmAnalysis'),
    meta: {
      title: '告警分析',
      icon: 'iconfont icon-dot'
    }
  }, {
    path: 'lightNewsInfo',
    name: 'lightNewsInfo',
    component: () =>
      import('view/adminLight/lightAnalysis/lightNewsInfo'),
    meta: {
      title: '消息日志',
      icon: 'iconfont icon-dot'
    }
  }]
}];

export const adminScreenRoute = [{
  path: 'screenManagement',
  name: 'screenManagement',
  component: () =>
    import('view/testpage/index'),
  meta: {
    title: '一键控屏',
    icon: 'iconfont icon-shebeijieru'
  },
  children: [{
    path: 'fastScreen',
    name: 'fastScreen',
    component: () =>
      import('view/adminScreen/screenManagement/fastScreen/index'),
    meta: {
      children: false,
      title: '一键控屏'
    }
  }, {
    path: 'screenPlayList',
    name: 'screenPlayList',
    component: () =>
      import('view/adminScreen/screenManagement/playList/index'),
    meta: {
      children: false,
      title: '播放任务列表'
    }
  }, {
    path: 'timedScreen',
    name: 'timedScreen',
    component: () =>
      import('view/adminScreen/screenManagement/timedScreen/index'),
    meta: {
      children: false,
      title: '定时定点播放'
    }
  }, {
    path: 'timeScreenCommonTemplate',
    name: 'timeScreenCommonTemplate',
    component: () =>
      import('view/adminScreen/screenManagement/commonTemplate/index'),
    meta: {
      children: false,
      title: '公共模板库'
    }
  }]
}, {
  path: 'screenAnalysis',
  name: 'screenAnalysis',
  component: () =>
    import('view/testpage/index'),
  meta: {
    title: '告警分析',
    icon: 'iconfont icon-shebeijieru'
  },
  children: [{
    path: 'screenAlarmAnalysis',
    name: 'screenAlarmAnalysis',
    component: () =>
      import('view/adminScreen/screenAnalysis/screenAlarmAnalysis'),
    meta: {
      title: '告警分析',
      icon: 'iconfont icon-dot'
    }
  }, {
    path: 'screenNewsInfo',
    name: 'screenNewsInfo',
    component: () =>
      import('view/adminScreen/screenAnalysis/screenNewsInfo'),
    meta: {
      title: '消息日志',
      icon: 'iconfont icon-dot'
    }
  }]
}];

export const adminSupervise = [{
  path: 'superviseManagement',
  name: 'superviseManagement',
  component: () =>
    import('view/testpage/index'),
  meta: {
    title: '实时监控',
    icon: 'iconfont icon-shebeijieru'
  },
  children: [{
    path: 'superviseTimeMonitoring',
    name: 'superviseTimeMonitoring',
    component: () =>
      import('view/adminSupervise/timeMonitoring'),
    meta: {
      title: '实时监控'
    }
  }, {
    path: 'superviseRecord',
    name: 'superviseRecord',
    component: () =>
      import('view/adminSupervise/superviseRecord'),
    meta: {
      title: '报警事件'
    }
  }, {
    path: 'superviseHistoryRecord',
    name: 'superviseHistoryRecord',
    component: () =>
      import('view/adminSupervise/historyRecord'),
    meta: {
      title: '历史数据'
    }
  }, {
    path: 'superviseDeviceManage',
    name: 'superviseDeviceManage',
    component: () =>
      import('view/adminSupervise/deviceManage'),
    meta: {
      title: '设备管理'
    }
  }]
}];

export const adminBaseRoute = [{
  path: '/basicInformationManagement',
  name: 'basicInformationManagement',
  component: () =>
    import('view/testpage/index'),
  meta: {
    title: '基础信息管理',
    icon: 'iconfont icon-chanpinguanli'
  },
  children: [{
    path: 'roleManagement',
    name: 'roleManagement',
    component: () =>
      import('view/adminBaseManagement/baseInfoManage/roleManagement/index'),
    meta: {
      title: '角色管理',
      icon: 'iconfont icon-dot'
    }
  },
  {
    path: 'userManagement',
    name: 'userManagement',
    component: () =>
      import('@/view/adminBaseManagement/baseInfoManage/userManagement/Users'),
    meta: {
      title: '用户管理',
      icon: 'iconfont icon-dot'
    }
  },
  {
    path: 'resourcesManagement',
    name: 'resourcesManagement',
    component: () =>
      import('@/view/adminBaseManagement/baseInfoManage/resourcesManagement/index'),
    meta: {
      title: '权限管理',
      icon: 'iconfont icon-dot'
    }
  },
  {
    path: 'dictionariesManagement',
    name: 'dictionariesManagement',
    component: () =>
      import('@/view/adminBaseManagement/baseInfoManage/dictionariesManagement/index'),
    meta: {
      title: '字典管理',
      icon: 'iconfont icon-dot'
    }
  },
  {
    path: 'atta_templet',
    name: 'atta_templet',
    component: () =>
      import('@/view/adminBaseManagement/baseInfoManage/attaTemplet/index'),
    meta: {
      title: '附件模板',
      icon: 'iconfont icon-dot',
      hideInMenu: true
    }
  },
  {
    path: 'approveConfig',
    name: 'approveConfig',
    component: () =>
      import('@/view/adminBaseManagement/baseInfoManage/approveConfig/index'),
    meta: {
      title: '处理流程配置',
      icon: 'iconfont icon-dot'
    }
  },
  {
    path: 'treeManage',
    name: 'treeManage',
    component: () =>
      import('@/view/adminBaseManagement/baseInfoManage/treeManage/index'),
    meta: {
      title: '园区组织树维护',
      icon: 'iconfont icon-dot'
    }
  },
  {
    path: 'treeManageCity',
    name: 'treeManageCity',
    component: () =>
      import('@/view/adminBaseManagement/baseInfoManage/treeManage_city/index'),
    meta: {
      title: '城市组织树维护',
      icon: 'iconfont icon-dot'
    }
  }
  ]
}, {
  path: 'linkageRuleManage',
  name: 'linkageRuleManage',
  component: () =>
    import('view/testpage/index'),
  meta: {
    title: '联动规则管理',
    icon: 'iconfont icon-shebeijieru'
  },
  children: [{
    path: 'linkageRuleList',
    name: 'linkageRuleList',
    component: () =>
      import('view/adminBaseManagement/linkageRuleManage/linkageRuleList/index'),
    meta: {
      title: '联动规则管理'
    },
    children: [{
      path: 'linkageRuleListDetail',
      name: 'linkageRuleListDetail',
      component: () =>
        import('view/adminBaseManagement/linkageRuleManage/linkageRuleList/detail'),
      meta: {
        hideInMenu: true,
        title: '联动规则管理详情'
      }
    }]
  }, {
    path: 'linkageCommonTemplate',
    name: 'linkageCommonTemplate',
    component: () =>
      import('view/adminBaseManagement/linkageRuleManage/linkageRuleList/commonTemplate/index'),
    meta: {
      title: '公共模板库'
    }
  }]
}];

export const adminWorkOrderRoute = [{
  path: '/workOrderManagement',
  name: 'workOrderManagement',
  component: () =>
    import('view/testpage/index'),
  meta: {
    title: '工单管理',
    icon: 'iconfont icon-chanpinguanli'
  },
  children: [{
    path: 'workOrder',
    name: 'workOrder',
    component: () =>
      import('view/adminWorkOrder/workOrderManagement/workOrder/index'),
    meta: {
      title: '工单管理',
      icon: 'iconfont icon-dot'
    }
  }, {
    path: 'createOrder',
    name: 'createOrder',
    component: () =>
      import('view/adminWorkOrder/workOrderManagement/createOrder/index'),
    meta: {
      title: '创建工单',
      icon: 'iconfont icon-dot',
      hideInMenu: true
    }
  }, {
    path: 'orderDetail',
    name: 'orderDetail',
    component: () =>
      import('view/adminWorkOrder/workOrderManagement/orderDetail/index'),
    meta: {
      title: '工单详情',
      icon: 'iconfont icon-dot',
      hideInMenu: true
    }
  }, {
    path: 'myTask',
    name: 'myTask',
    component: () =>
      import('view/adminWorkOrder/workOrderManagement/myTask/index'),
    meta: {
      title: '我的任务',
      icon: 'iconfont icon-dot'
    }
  }, {
    path: 'maintenancePlan',
    name: 'maintenancePlan',
    component: () =>
      import('view/adminWorkOrder/workOrderManagement/maintenancePlan/index'),
    meta: {
      title: '设备保养计划',
      icon: 'iconfont icon-dot'
    }
  }, {
    path: 'alarmManage',
    name: 'alarmManage',
    component: () =>
      import('view/adminWorkOrder/workOrderManagement/alarmManage/index'),
    meta: {
      title: '告警管理',
      icon: 'iconfont icon-dot'
    }
  }, {
    path: 'personnelManage',
    name: 'personnelManage',
    component: () =>
      import('view/adminWorkOrder/workOrderManagement/personnelManage/index'),
    meta: {
      title: '人员管理',
      icon: 'iconfont icon-dot'
    }
  }]
}];

export const adminAmmeterRoute = [{
  path: '/ammeterManagement',
  name: 'ammeterManagement',
  component: () =>
    import('view/testpage/index'),
  meta: {
    title: '实时监控',
    icon: 'iconfont icon-chanpinguanli'
  },
  children: [{
    path: 'ammeterTimeMonitoring',
    name: 'ammeterTimeMonitoring',
    component: () =>
      import('view/adminAmmeter/timeMonitoring'),
    meta: {
      title: '实时监控'
    }
  }]
}, {
  path: 'ammeterDataQuery',
  name: 'ammeterDataQuery',
  component: () =>
    import('view/testpage/index'),
  meta: {
    title: '数据查询',
    icon: 'iconfont icon-shebeijieru'
  },
  children: [{
    path: 'ammeterMeterReadingData',
    name: 'ammeterMeterReadingData',
    component: () =>
      import('view/adminAmmeter/dataQuery/meterReadingData/index'),
    meta: {
      children: false,
      title: '抄表数据'
    }
  }, {
    path: 'ammeterChargeRecord',
    name: 'ammeterChargeRecord',
    component: () =>
      import('view/adminAmmeter/dataQuery/chargeRecord/index'),
    meta: {
      children: false,
      title: '收费记录'
    }
  }, {
    path: 'ammeterMeterManagement',
    name: 'ammeterMeterManagement',
    component: () =>
      import('view/adminAmmeter/dataQuery/ammeterMeterManagement/index'),
    meta: {
      children: false,
      title: '电表管理'
    }
  }, {
    path: 'ammeterDataDetail',
    name: 'ammeterDataDetail',
    component: () =>
      import('view/adminAmmeter/dataQuery/dataDetail/index'),
    meta: {
      children: false,
      title: '电表信息'
    }
  }]
}, {
  path: 'ammeterPrepaymentManagement',
  name: 'ammeterPrepaymentManagement',
  component: () =>
    import('view/testpage/index'),
  meta: {
    title: '预付费管理',
    icon: 'iconfont icon-shebeijieru'
  },
  children: [{
    path: 'ammeterPrepayManagement',
    name: 'ammeterPrepayManagement',
    component: () =>
      import('view/adminAmmeter/prepaymentManagement/management/index'),
    meta: {
      children: false,
      title: '预付费管理'
    }
  }, {
    path: 'ammeterPrepayHistory',
    name: 'ammeterPrepayHistory',
    component: () =>
      import('view/adminAmmeter/prepaymentManagement/history/index'),
    meta: {
      children: false,
      title: '充值历史'
    }
  }]
}, {
  path: 'ammeterAnalyzeAlarm',
  name: 'ammeterAnalyzeAlarm',
  component: () =>
    import('view/testpage/index'),
  meta: {
    title: '报警分析',
    icon: 'iconfont icon-shebeijieru'
  },
  children: [{
    path: 'ammeterInstrumentAlarm',
    name: 'ammeterInstrumentAlarm',
    component: () =>
      import('view/adminAmmeter/alarmAnalyze/instrumentAlarm/index'),
    meta: {
      children: false,
      title: '仪器报警'
    }
  }, {
    path: 'ammeterPaymentAlarm',
    name: 'ammeterPaymentAlarm',
    component: () =>
      import('view/adminAmmeter/alarmAnalyze/paymentAlarm/index'),
    meta: {
      children: false,
      title: '缴费报警'
    }
  }]
}];

const routers = [
  {
    path: '/bigScreenNew',
    name: 'bigScreenNew',
    meta: {
      title: '设备信息总览',
      icon: 'iconfont icon-shebeixinxizonglan',
      address: 'before'
    },
    component: () =>
      import('view/big-screen_new/index')
  },
  {
    path: '/bigScreen',
    name: 'bigScreen',
    meta: {
      title: '可视化大屏',
      icon: 'iconfont icon-zhihuidenggan',
      address: 'before'
    },
    component: () =>
      import('view/bigScreen/index')
  },
  {
    path: '/wisdomApplication',
    name: 'wisdomApplication',
    meta: {
      title: '智慧应用',
      icon: 'iconfont icon-zhihuiyingyong',
      address: 'before'
    },
    component: () => import('view/testpage/index'),
    children: [{
      path: 'wisdomAppParkReport',
      name: 'wisdomAppParkReport',
      component: () =>
        import('view/index/wisdomPark/report'),
      meta: {
        title: '智慧公园'
      }
    }, {
      path: 'smokeAppMap',
      name: 'smokeAppMap',
      component: () =>
        import('view/smokeDetector/smokeDetectorMap'),
      meta: {
        title: '智慧园区'
      }
    }, {
      path: 'toiltAppMap',
      name: 'toiltAppMap',
      component: () =>
        import('view/newToilt/toiltMap/index'),
      meta: {
        title: '智慧公厕-网关'
      }
    }]
  },
  {
    path: '/smokeDetectorMap',
    name: 'smokeDetectorMap',
    component: () =>
      import('view/smokeDetector/smokeDetectorMap')
  },
  {
    path: '/wisdomParkReport',
    name: 'wisdomParkReport',
    component: () =>
      import('view/index/wisdomPark/report')
  },
  {
    path: '/wisdomParkMonthReport',
    name: 'wisdomParkMonthReport',
    component: () =>
      import('view/index/wisdomPark/monthReport')
  },
  {
    path: '/bigScreen-dali',
    name: 'bigScreen-dali',
    component: () =>
      import('view/bigScreen/dali')
  },
  {
    path: '/newToiltMap',
    name: 'newToiltMap',
    meta: {
      title: '智能公厕地图'
    },
    component: () => import('view/toilt/toiltMap/index')
  },
  // 智慧公厕
  {
    path: '/newToiltDetail',
    name: 'newToiltDetail',
    meta: {
      title: '智能公厕'
    },
    component: () => import('view/toilt/toiltDetail/index')
  },
  // -------新厕所
  {
    path: '/toiltMap',
    name: 'toiltMap',
    meta: {
      title: '智能公厕地图'
    },
    component: () => import('view/newToilt/toiltMap/index')
  },
  // 智慧公厕
  {
    path: '/toiltDetail',
    name: 'toiltDetail',
    meta: {
      title: '智能公厕'
    },
    component: () => import('view/newToilt/newToiltDetail/index')
  },
  {
    path: '/toiltHistory',
    name: 'toiltHistory',
    meta: {
      title: '智能公厕历史记录'
    },
    component: () => import('view/toilt/toiltHistory/index')
  },
  {
    path: '/index',
    name: 'index',
    component: MainView,
    meta: {
      hideInMenu: true,
      title: '灯杆地图',
      icon: 'iconfont icon-dengganditu'
    },
    children: [
      /* {
        path: 'lightPoleMap',
        name: 'lightPoleMap',
        component: () =>
          import('view/index/lightPoleMap'),
        meta: {
          title: '智慧灯杆地图'
        }
      }, */
      {
        // 新改版智慧灯杆总览
        path: 'lightPoleMap',
        name: 'lightPoleMap',
        component: () =>
          import('view/index/wisdomLightPoleMap/newIndex'),
        // return () => Promise.resolve(require(`view/index/wisdomLightPoleMap/${indexPath}`).default)
        meta: {
          title: '智慧灯杆地图',
          // target: true,
          // href: 'http://39.108.109.191:8080/#/login?redirect=%2F&username=sanyuan1'
        }
      },
      {
        path: 'chargingPileMap',
        name: 'chargingPileMap',
        component: () =>
          import('view/index/chargingPileMap'),
        meta: {
          title: '智慧充电桩地图'
        }
      }
    ]
  },
  {
    path: '/lightPole',
    name: 'lightPole',
    component: MainView,
    meta: {
      title: '智慧灯杆',
      icon: 'iconfont icon-zhihuidenggan'
    },
    children: [{
      path: 'lightPoleMap',
      name: 'lightPoleMap',
      component: () =>
        import('view/index/lightPoleMap'),
      meta: {
        title: '智慧灯杆地图',
        target: false,
        href: 'http://39.108.109.191:8080/#/login?redirect=%2F&username=sanyuan1'

      },
      children: [{
        path: 'lightPoleMap',
        name: 'lightPoleMap',
        component: () =>
          import('view/index/lightPoleMap'),
        meta: {
          hideInMenu: true,
          title: '历史数据分析'
        }
      }]
    },
    {
      path: 'lightPoleStatistical',
      name: 'lightPoleStatistical',
      component: () =>
        import('view/lightPole/lightPoleStatistical'),
      meta: {
        title: '能耗统计分析'
      }
    },
    {
      path: 'wisdomLightPole',
      name: 'wisdomLightPole',
      component: () =>
        import('view/lightPole/wisdomLightPole'),
      meta: {
        title: '灯杆能耗分析'
      }
    }, {
      path: 'lightPoleDetail',
      name: 'lightPoleDetail',
      component: () =>
        import('view/lightPole/lightPoleDetail'),
      meta: {
        hideInMenu: true,
        title: '灯杆详情'
      }
    }
    ]
  },
  {
    path: '/monitoring',
    name: 'monitoring',
    component: MainView,
    meta: {
      title: '安防监控',
      icon: 'iconfont icon-zhihuiyangan'
    },
    children: [
      {
        path: 'wisdomMonitoring',
        name: 'wisdomMonitoring',
        component: () =>
          import('view/monitoring/wisdomMonitoring/index'),
        meta: {
          title: '智慧监控'
        }
      },
      {
        path: 'securityMonitoring',
        name: 'securityMonitoring',
        component: () =>
          import('view/monitoring/securityMonitoring'),
        meta: {
          title: '安防监控'
        }
      },
      {
        path: 'cameraEvent',
        name: 'cameraEvent',
        meta: {
          hideInMenu: true,
          title: '摄像头事件详情'
        },
        component: () =>
          import('view/monitoring/smokeAlarmLink')
      }]
  },
  {
    path: '/smartCharge',
    name: 'smartCharge',
    component: MainView,
    meta: {
      title: '智慧充电',
      icon: 'iconfont icon-zhihuichongdian'
    },
    children: [{
      path: 'chargingPileMap',
      name: 'chargingPileMap',
      component: () =>
        import('view/index/chargingPileMap'),
      meta: {
        title: '充电桩地图'
      }
    },
    {
      path: 'chargePileMonitor',
      name: 'chargePileMonitor',
      component: () =>
        import('view/smartCharge/chargePileMonitor/index'),
      meta: {
        title: '充电桩监控'
      }
    },
    {
      path: 'chargeBaseInfo',
      name: 'chargeBaseInfo',
      component: () =>
        import('view/smartCharge/chargeBaseInfo/index'),
      meta: {
        title: '充电桩基本信息',
        hideInMenu: true
      }
    },
    {
      path: 'chargeStatisticAnalysis',
      name: 'chargeStatisticAnalysis',
      component: () =>
        import('view/smartCharge/chargeStatisticAnalysis/index'),
      meta: {
        title: '充电统计分析'
      }
    },
    {
      path: 'chargeOperationAnalysis',
      name: 'chargeOperationAnalysis',
      component: () =>
        import('view/smartCharge/chargeStatisticAnalysis/index'),
      meta: {
        hideInMenu: true,
        title: '充电运营分析'
      }
    }
    ]
  },
  {
    path: '/controlStrategy',
    name: 'controlStrategy',
    component: MainView,
    meta: {
      title: '智慧发布',
      icon: 'iconfont icon-zhihuifabu'
    },
    children: [{
      path: 'publishPoleMap',
      name: 'publishPoleMap',
      component: () =>
        import('view/index/publishPoleMap'),
      meta: {
        title: '智慧发布地图'
      }
    }, {
      path: 'wisdomPublishTaskPage',
      name: 'wisdomPublishTaskPage',
      component: () =>
        import('view/controlStrategy/wisdomPublish/taskPage'),
      meta: {
        title: '播放任务'
      }
    }, {
      path: 'wisdomPublishAnalyse',
      name: 'wisdomPublishAnalyse',
      component: () =>
        import('view/controlStrategy/wisdomPublishAnalyse/index'),
      meta: {
        title: '统计分析'
      }
    }, {
      path: 'wisdomPublish',
      name: 'wisdomPublish',
      component: () =>
        import('view/controlStrategy/wisdomPublish'),
      meta: {
        hideInMenu: true,
        title: '智慧LED屏'
      },
      children: [
        {
          path: 'wisdomPublishDetail',
          name: 'wisdomPublishDetail',
          component: () =>
            import('view/controlStrategy/wisdomPublish/detail'),
          meta: {
            title: '信息发布详情',
            icon: 'iconfont icon-dot',
            hideInMenu: true
          }
        },
        {
          path: 'wisdomPublishPage',
          name: 'wisdomPublishPage',
          component: () =>
            import('view/controlStrategy/wisdomPublish/page'),
          meta: {
            title: '信息发布',
            icon: 'iconfont icon-dot',
            hideInMenu: true
          }
        }
      ]
    }, {
      path: 'wisdomVideo',
      name: 'wisdomVideo',
      component: () =>
        import('view/controlStrategy/wisdomVideo'),
      meta: {
        title: '智慧广播',
        hideInMenu: true,
      },
      children: [
        {
          path: 'wisdomVideoDetail',
          name: 'wisdomVideoDetail',
          component: () =>
            import('view/controlStrategy/wisdomPublish/detail'),
          meta: {
            title: '智慧广播详情',
            icon: 'iconfont icon-dot',
            hideInMenu: true
          }
        }
      ]
    }, {
      path: 'fastPanel',
      name: 'fastPanel',
      component: () =>
        import('view/controlStrategy/fastPanel'),
      meta: {
        hideInMenu: true,
        title: '一键控屏'
      }
    }, {
      path: 'commonTemplate',
      name: 'commonTemplate',
      component: () =>
        import('view/controlStrategy/commonTemplate'),
      meta: {
        title: '公共模板'
      }
    }]
  },
  {
    path: '/wisdomWarnMain',
    name: 'wisdomWarnMain',
    component: MainView,
    meta: {
      title: '智慧报警',
      icon: 'iconfont icon-zhihuibaojing'
    },
    children: [{
      path: 'wisdomWarnMap',
      name: 'wisdomWarnMap',
      component: () =>
        import('view/index/wisdomWarnMap/newIndex'),
      // return () => Promise.resolve(require(`view/index/wisdomWarnMap/${indexPath}`).default)
      meta: {
        title: '智慧报警地图'
      }
    }, {
      path: 'fastWarn',
      name: 'fastWarn',
      component: () =>
        import('view/wisdomMonitor/fastWarn'),
      meta: {
        title: '一键报警'
      }
    }, {
      path: 'historyWarn',
      name: 'historyWarn',
      component: () =>
        import('view/wisdomMonitor/historyWarn'),
      meta: {
        title: '历史报警'
      }
    }, {
      path: 'wisdomWarn',
      name: 'cc',
      component: () =>
        import('view/wisdomMonitor/wisdomWarn'),
      meta: {
        hideInMenu: true,
        title: '智慧报警'
      },
      children: [{
        path: 'wisdomWarnDetail',
        name: 'wisdomWarnDetail',
        component: () =>
          import('view/wisdomMonitor/wisdomWarn/detail'),
        meta: {
          hideInMenu: true,
          title: '报警详情'
        }
      }]
    }, {
      path: 'warmDetail',
      name: 'warmDetail',
      component: () => import('view/wisdomMonitor/warmDetail'),
      meta: {
        hideInMenu: true,
        title: '报警详情'
      }
    }]
  },
  {
    path: '/wisdomSupervise',
    name: 'wisdomSupervise',
    component: MainView,
    meta: {
      title: '智慧环境',
      icon: 'iconfont icon-zhihuijiance'
    },
    children: [{
      path: 'superviseMap',
      name: 'superviseMap',
      component: () =>
        import('view/index/superviseMap/newIndex'),
      // return () => Promise.resolve(require(`view/index/superviseMap/${indexPath}`).default)
      meta: {
        title: '环境监测地图'
      }
    }, {
      path: 'superviseAnalysis',
      name: 'superviseAnalysis',
      component: () =>
        import('view/wisdomSupervise/superviseAnalysis'),
      meta: {
        title: '统计分析'
      }
    }]
  },
  {
    path: '/wisdomMonitor',
    name: 'wisdomMonitor',
    component: MainView,
    meta: {
      title: '告警管理',
      icon: 'iconfont icon-zhihuijiance'
    },
    children: [{
      path: 'faultWarn',
      name: 'faultWarn',
      component: () =>
        import('view/wisdomMonitor/faultWarn'),
      meta: {
        title: '故障告警'
      },
      children: [{
        path: 'faultWarnDetail',
        name: 'faultWarnDetail',
        component: () =>
          import('view/wisdomMonitor/faultWarn/detail'),
        meta: {
          hideInMenu: true,
          title: '故障告警详情'
        }
      }]
    }]
  },
  // {
  //   path: '/wisdomWifiMain',
  //   name: 'wisdomWifiMain',
  //   component: MainView,
  //   meta: {
  //     title: '智慧WIFI',
  //     icon: 'iconfont icon-wifi'
  //   },
  //   children: []
  // },
  {
    path: '/wisdomBroadcast',
    name: 'wisdomBroadcast',
    component: MainView,
    meta: {
      title: '智慧广播',
      icon: 'iconfont icon-zhihuiguangbo'
    },
    children: [{
      path: 'wisdomBroadcastMap',
      name: 'wisdomBroadcastMap',
      component: () =>
        import('view/index/wisdomBroadcastMap/newIndex'),
      // return () => Promise.resolve(require(`view/index/wisdomBroadcastMap/${indexPath}`).default)
      meta: {
        title: '智慧广播地图'
      }
    }]
  },
  {
    path: '/wisdomWifi',
    name: 'wisdomWifi',
    component: MainView,
    meta: {
      title: '智慧WIFI',
      icon: 'iconfont icon-wifi'
    },
    children: [{
      path: 'wisdomWifiMap',
      name: 'wisdomWifiMap',
      component: () =>
        import('view/index/wisdomWifiMap/newIndex'),
      // return () => Promise.resolve(require(`view/index/wisdomWifiMap/${indexPath}`).default)
      meta: {
        title: '智慧WIFI地图'
      }
    }, {
      path: 'wisdomMonitorWifi',
      name: 'wisdomMonitorWifi',
      component: () =>
        import('view/wisdomMonitor/wisdomWifi'),
      meta: {
        title: '智慧WIFI'
      },
      children: [{
        path: 'wisdomWifiEquipment',
        name: 'wisdomWifiEquipment',
        component: () =>
          import('view/wisdomMonitor/wisdomWifi/equipment'),
        meta: {
          hideInMenu: true,
          title: 'wifi设备管理'
        }
      }, {
        path: 'wisdomWifiUserTraffic',
        name: 'wisdomWifiUserTraffic',
        component: () =>
          import('view/wisdomMonitor/wisdomWifi/userTraffic'),
        meta: {
          hideInMenu: true,
          title: '用户流量分析'
        },
        children: [{
          path: 'wisdomWifiUserDetail',
          name: 'wisdomWifiUserDetail',
          component: () =>
            import('view/wisdomMonitor/wisdomWifi/userDetail'),
          meta: {
            hideInMenu: true,
            title: '用户流量分析详情'
          }
        }]
      }]
    }]
  },
  {
    path: '/smokeDetector',
    name: 'smokeDetector',
    component: MainView,
    meta: {
      title: '智慧烟感',
      icon: 'iconfont icon-zhihuiyangan'
    },
    children: [{
      path: 'smokeMap',
      name: 'smokeMap',
      meta: {
        title: '智慧烟感地图'
      },
      component: () =>
        import('view/smokeDetector/smokeDetectorMap')
      // redirect: '/smokeDetectorMap'
    }, {
      path: 'smokeAlarmLink',
      name: 'smokeAlarmLink',
      component: () =>
        import('view/smokeDetector/smokeManage/cameraEvent'),
      meta: {
        title: '烟感报警联动'
      },
      children: [{
        path: 'smokeAlarmLinkDetail',
        name: 'smokeAlarmLinkDetail',
        meta: {
          hideInMenu: true,
          title: '场景联动详情'
        },
        component: () =>
          import('view/smokeDetector/smokeManage/smokeAlarmLink/detail')
      }]
    }, {
      path: 'videoAddress',
      name: 'videoAddress',
      component: () =>
        import('view/smokeDetector/smokeManage/videoAddress'),
      meta: {
        hideInMenu: true,
        title: '摄像头监控画面'
      }
    }]
  },
  {
    path: '/wisdomPark',
    name: 'wisdomPark',
    component: MainView,
    meta: {
      title: '智慧公园',
      icon: 'iconfont icon-zhihuigongyuan'
    },
    children: [
      {
        path: 'wisdomParkReport',
        name: 'wisdomParkReport',
        redirect: '/wisdomParkReport',
        meta: {
          title: '整体监控'
        }
      },
      {
        path: 'wisdomParkMonthReport',
        name: 'wisdomParkMonthReport',
        redirect: '/wisdomParkMonthReport',
        //component: () => import('view/index/wisdomPark/monthReport'),
        meta: {
          title: '统计分析'
        }
      }
    ]
  },
  {
    path: '/lotAdmin',
    name: 'lotAdmin',
    component: adminView,
    // component: () => { import('view/testpage/index') },
    meta: {
      title: '后台管理',
      icon: 'iconfont icon-celvekongzhi',
      address: 'after'
    }
  },
  {
    path: '/admin',
    name: 'admin',
    component: adminView,
    meta: {
      title: '物联网管理',
      icon: 'iconfont icon-wulianwangguanli'
    },
    children: adminRoute
  },
  {
    path: '/adminLampIllumination',
    name: 'adminLampIllumination',
    component: adminView,
    meta: {
      title: '智慧照明',
      icon: 'iconfont icon-zhihuizhaoming'
    },
    children: adminLampIlluminationRoute
  },
  {
    path: '/adminScreen',
    name: 'adminScreen',
    component: adminView,
    meta: {
      title: '智慧LED',
      icon: 'iconfont icon-zhihuiLED'
    },
    children: adminScreenRoute
  },
  {
    path: '/adminSupervise',
    name: 'adminSupervise',
    component: adminView,
    meta: {
      title: '智慧环境',
      icon: 'iconfont icon-zhihuijiance1'
    },
    children: adminSupervise
  },
  {
    path: '/adminEntrance',
    name: 'adminEntrance',
    component: adminView,
    meta: {
      title: '智慧门禁',
      icon: 'iconfont icon-zhihuimenjin'
    },
    children: adminEntranceRoute
  },
  {
    path: '/adminWater',
    name: 'adminWater',
    component: adminView,
    meta: {
      title: '智慧水表',
      icon: 'iconfont icon-zhihuishuibiao'
    },
    children: adminWaterRoute
  },
  {
    path: '/adminAmmeter',
    name: 'adminAmmeter',
    component: adminView,
    meta: {
      title: '智慧能源',
      icon: 'iconfont icon-zhihuishuibiao'
    },
    children: adminAmmeterRoute
  },
  {
    path: '/adminBroadcast',
    name: 'adminBroadcast',
    component: adminView,
    meta: {
      title: '智慧广播',
      icon: 'iconfont icon-xitongguanli'
    },
    children: adminBroadcastRoute
  }, {
    path: '/adminSmoke',
    name: 'adminSmoke',
    component: adminView,
    meta: {
      title: '智慧烟感',
      icon: 'iconfont icon-zhihuiyangan'
    },
    children: adminSmokeRoute
  }, {
    path: '/adminWifi',
    name: 'adminWifi',
    component: adminView,
    meta: {
      title: '智慧WIFI',
      icon: 'iconfont icon-xitongguanli'
    },
    children: adminWifiRoute
  },
  {
    path: '/adminBaseManagement',
    name: 'adminBaseManagement',
    component: adminView,
    meta: {
      title: '基础管理',
      icon: 'iconfont icon-jichuguanli'
    },
    children: adminBaseRoute
  }, {
    path: '/adminWorkOrder',
    name: 'adminWorkOrder',
    component: adminView,
    meta: {
      title: '工单管理',
      icon: 'iconfont icon-jichuguanli'
    },
    children: adminWorkOrderRoute
  }
]

export default routers;
