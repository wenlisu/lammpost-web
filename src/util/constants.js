/** LAMP */
import lamp1 from '@/common/images/markers/lamp1.png';
import lamp2 from '@/common/images/markers/lamp2.png';
import lamp3 from '@/common/images/markers/lamp3.png';

/** LED */
import led1 from '@/common/images/markers/led1.png';
import led3 from '@/common/images/markers/led3.png';

/** AMBIENT */
import ambient1 from '@/common/images/markers/ambient1.png';
import ambient2 from '@/common/images/markers/ambient2.png';
import ambient3 from '@/common/images/markers/ambient3.png';

/** AUDIO */
import broadcast1 from '@/common/images/markers/broadcast1.png';
import broadcast2 from '@/common/images/markers/broadcast2.png';
import broadcast3 from '@/common/images/markers/broadcast3.png';

/** CALL */
import call1 from '@/common/images/markers/call1.png';
import call2 from '@/common/images/markers/call2.png';
import call3 from '@/common/images/markers/call3.png';

/** CAMERA */
import camera1 from '@/common/images/markers/camera1.png';
import camera2 from '@/common/images/markers/camera2.png';
import camera3 from '@/common/images/markers/camera3.png';

export const GROUP_POLICY_TYPE = {
  全控: 1,
  分时控: 2,
  自动调光: 3
};

export const NUMBER_TYPE = {
  一: 1,
  二: 2,
  三: 3
};

export const LIGHT_TYPE = {
  节能: 1,
  中: 2,
  高: 3
};

export const COMMON_TEMPLATE_TYPE = {
  自编: 1,
  选择关键词: 2
};

export const COMMON_TEMPLATE_SERVICE_TYPE = {
  图片: 1,
  视频: 2,
  文字: 3
};

export const COMMON_TEMPLATE_RECTTYPE_TYPE = {
  全屏: 1,
  四宫格: 2
};

export const COMMON_TEMPLATE_KEY_WORD = {
  温度: 'wd',
  湿度: 'sd',
  // 风速: 'fs',
  // 风向: 'fx',
  'PM2.5': 'pm2.5',
  'PM10': 'pm10',
  噪声: 'zs'
  // 大气压: 'dqy',
  // 本桩状态: 'cdz'
};

export const MODULE_TYPE = {
  充电桩: 'BATTERY',
  摄像头: 'CAMERA',
  环境监控: 'AMBIENT',
  智能WIFE: 'WIFI',
  LED屏幕: 'LED',
  音响广播: 'AIRING',
  紧急呼叫: 'CALL',
  照明: 'LAMP',
  微基站: 'STATION',
  智慧网关: 'GATEWAY'
}

export const METHOD_TYPE = {
  可读: 'R',
  可写: 'W',
  可订阅: 'E'
}

export const WEEK_LIST_TYPE = {
  周一: 'MON',
  周二: 'TUE',
  周三: 'WED',
  周四: 'THU',
  周五: 'FRI',
  周六: 'SAT',
  周日: 'SUN'
}

export const EVENT_LIST_TYPE = {
  烟雾报警: 1,
  一键报警: 2,
  人脸识别: 3,
  入侵报警: 4,
  环境指标超标: 5
}

export const MARKERS_TYPE = {
  'LAMP': {
    1: {
      normal: lamp1,
      current: lamp1
    },
    2: {
      normal: lamp2,
      current: lamp2
    },
    3: {
      normal: lamp3,
      current: lamp3
    }
  },
  'LED': {
    1: {
      normal: led1,
      current: led1
    },
    0: {
      normal: led3,
      current: led3
    }
  },
  'AMBIENT': {
    1: {
      normal: ambient1,
      current: ambient1,
      text: '在线'
    },
    2: {
      normal: ambient2,
      current: ambient2,
      text: '报警'
    },
    3: {
      normal: ambient2,
      current: ambient2,
      text: '故障'
    },
    4: {
      normal: ambient3,
      current: ambient3,
      text: '离线'
    }
  },
  'AUDIO': {
    1: {
      normal: broadcast1,
      current: broadcast1
    },
    2: {
      normal: broadcast2,
      current: broadcast2
    },
    3: {
      normal: broadcast3,
      current: broadcast3
    }
  },
  'CALL': {
    1: {
      normal: call1,
      current: call1,
      text: '在线'
    },
    2: {
      normal: call2,
      current: call2,
      text: '报警'
    },
    3: {
      normal: call3,
      current: call3,
      text: '离线'
    }
  },
  'CAMERA': {
    1: {
      normal: camera1,
      current: camera1,
      text: '在线'
    },
    2: {
      normal: camera2,
      current: camera2,
      text: '报警'
    },
    3: {
      normal: camera3,
      current: camera3,
      text: '离线'
    }
  }
}

export const ENTRANCE_CHECK_TYPE = {
  身份证号重复: 1,
  员工编号重复: 2,
  注册头像缺失: 3,
  人员名称为空: 4,
  人员编号为空: 5,
  证件号为空: 5
}

export const SEX_TYPE = {
  女: 0,
  男: 1
}
