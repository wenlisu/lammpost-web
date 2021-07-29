import api from 'util/axios'
import store from '@/store';

/**
 * 智慧公园接口
 * 调用:
 *  wisdomParkReport.getParkUserInfo({"parkId":1}).then(res => {
        if (res.code === '200') { //成功
          console.log(JSON.stringify(res));
        }
      })
 */
var wisdomParkReport = {
  parkId: 1, //公园ID

  /**
   * 获取在园人数和日累计人数
   * @param {Object} parameters json对象参数
   *
   * 返回报文：{"code":"200","message":"操作成功","data":{"parkId":1,"personCountInPark":1,"personCountToday":2}}
   * 返回字段如下：
   *  personCountInPark: 在园人数
   *  personCountToday: 日累计人数
   *
   */
  getParkUserInfo(parameters) {
    if (parameters == null) {
      parameters = {};
    }
    parameters.parkId = this.parkId;

    return api.request({
      method: 'GET',
      url: `/api/iot-park/doorAccess/countTodayPersonInPark/` + parameters.parkId
    })
  },
  /**
   * 获取土壤检测信息和气象信息
   * @param {Object} parameters json对象参数
   *
   * 返回报文：{"code":"200","message":"操作成功","data":{"windSpeed":"0","windDirection":"0","pm":"28","noiseDecibels":"0","soilTemperatureValue":"3","electricalValue":"0","waterValue":"10"}}
   * 返回字段如下：
   *  soilTemperatureValue: 土壤温度
   *  无: EC电导率
   *  无:  盐度TDS
   *  无: 水分原始AD值
   *  waterValue: 土壤水分
   *  无: 原始电导率
   *  electricalValue: 电导率AD值
   *  无: 水分温度补偿系数
   *
   *  noiseDecibels: 噪声
   *  pm: PM2.5
   *  windSpeed: 风速
   *  windDirection: 风向
   */
  getAtmosphereInfo(parameters) {
    if (parameters == null) {
      parameters = {};
    }
    parameters.parkId = this.parkId;

    return api.request({
      method: 'GET',
      url: `/api/iot-park/atmosphere-soil/queryAtmosphereInfo/` + parameters.parkId
    })
  },
  /**
   * 获取土壤检测信息: 24小时的土壤纬度、土壤水分和电导率
   * @param {Object} parameters json对象参数
   *
   * 返回报文：{"code":"200","message":"操作成功","data":[{"soilTemperatureValue":"2.0","electricalValue":"0.0","waterValue":"10.0","hour":"8"},{"soilTemperatureValue":"2.4","electricalValue":"0.0","waterValue":"10.0","hour":"9"}]}
   * 返回字段如下：
   *  soilTemperatureValue: 土壤温度
   *  electricalValue: 电导率
   *  waterValue: 土壤水分
   */
  getSoilInfo(parameters) {
    if (parameters == null) {
      parameters = {};
    }
    parameters.parkId = this.parkId;

    return api.request({
      method: 'GET',
      url: `/api/iot-park/atmosphere-soil/querySoilInfo/` + parameters.parkId
    })
  },

  /**
   * 根据古树ID获取古树的详细信息
   * @param {Object} parameters json对象参数
   *
   * 返回报文：{"code":"200","message":"操作成功","data":{"id":1,"code":"1000010011","name":"银杏-1","longitude":"22.30","latitude":"30.00","backgroundAngle":30,"tiltAngle":40,"status":"异常"}}
   * 返回字段如下：
   *  id: 古树ID
   *  code: 古树编号
   *  name: 古树名称
   *  longitude: 经度
   *  latitude: 纬度
   *  backgroundAngle: 背景角度
   *  tiltAngle: 倾斜角度
   *  status: 状态
   *
   */
  getTreeInfo(parameters) {
    if (parameters == null) {
      parameters = {};
    }
    parameters.parkId = this.parkId;

    return api.request({
      method: 'GET',
      url: `/api/iot-park/ancientTree/getTreeInfo/` + parameters.treeId
    })
  },
  /**
   * 获取古树的历史统计信息: 按月份
   * @param {Object} parameters json对象参数
   *
   * 返回报文：{"code":"200","message":"操作成功","data":[{"month":"2020-05","errorNum":0,"normalNum":0},{"month":"2020-06","errorNum":0,"normalNum":0},{"month":"2020-07","errorNum":0,"normalNum":0},{"month":"2020-08","errorNum":0,"normalNum":0},{"month":"2020-09","errorNum":0,"normalNum":0},{"month":"2020-10","errorNum":0,"normalNum":0},{"month":"2020-11","errorNum":0,"normalNum":0},{"month":"2020-12","errorNum":0,"normalNum":0},{"month":"2021-01","errorNum":1,"normalNum":0},{"month":"2021-02","errorNum":0,"normalNum":1},{"month":"2021-03","errorNum":1,"normalNum":0},{"month":"2021-04","errorNum":2,"normalNum":0}]}
   * 返回字段如下：
   *  month: 月份
   *  normalNum: 正常数
   *  errorNum: 异常数
   *
   */
  getTreeHisReport(parameters) {
    if (parameters == null) {
      parameters = {};
    }
    parameters.parkId = this.parkId;

    return api.request({
      method: 'GET',
      url: `/api/iot-park/ancientTree/getTreeDataLastTwelveMonth/` + parameters.parkId
    })
  },
  /**
   * 获取灯杆的统计信息
   * @param {Object} parameters json对象参数
   *
   * 返回报文：{"code":"200","message":"操作成功","data":{"deviceNum":410,"totalSaving":0,"breakdownNum":0,"total":0,"totalUse":0,"normalNum":410}}
   * 返回字段如下：
   *  deviceNum: 总灯杆数
   *  normalNum: 灯杆正常数
   *  breakdownNum: 灯杆故障数
   *  total: 总耗能
   *  totalSaving: 节能用电
   *  totalUse: 实际用电
   *
   */
  getLampReport(parameters) {
    if (parameters == null) {
      parameters = {};
    }
    parameters.parkId = this.parkId;

    return api.request({
      method: 'POST',
      url: `/api/park/lampStatics/report`,
      data: parameters
    })
  },
  /**
   * 获取历史的灯杆耗能信息
   * @param {Object} parameters json对象参数
   *  queryDay: 查询n天的数据
   *
   * 返回报文：{"code":"200","message":"操作成功","data":[{"date":"2021-04-21","usingPower":0,"savingPower":0,"totalPower":0},{"date":"2021-04-22","usingPower":0,"savingPower":0,"totalPower":0},{"date":"2021-04-23","usingPower":0,"savingPower":0,"totalPower":0},{"date":"2021-04-24","usingPower":0,"savingPower":0,"totalPower":0},{"date":"2021-04-25","usingPower":0,"savingPower":0,"totalPower":0},{"date":"2021-04-26","usingPower":0,"savingPower":0,"totalPower":0},{"date":"2021-04-27","usingPower":0,"savingPower":0,"totalPower":0},{"date":"2021-04-28","usingPower":0,"savingPower":0,"totalPower":0}]}
   * 返回字段如下：
   *  date: 月份
   *  totalPower: 总耗能
   *  savingPower: 节能用电
   *  usingPower: 实际用电
   *
   */
  getLampHisReport(parameters) {
    if (parameters == null) {
      parameters = {};
    }
    parameters.parkId = this.parkId;

    return api.request({
      method: 'POST',
      url: `/api/park/lampStatics/monthReport`,
      data: parameters
    })
  },
  division(num1, num2) {
    var t1, t2, r1, r2;
    try {
      t1 = num1.toString().split(".")[1].length;
    } catch (e) {
      t1 = 0;
    }
    try {
      t2 = num2.toString().split(".")[1].length;
    } catch (e) {
      t2 = 0;
    }
    r1 = Number(num1.toString().replace(".", ""));
    r2 = Number(num2.toString().replace(".", ""));
    return (r1 / r2) * Math.pow(10, t2 - t1);
  },
  //计算环境质量奖
  calEnvironmentQuality: function (h2s, nh3) {
    // 环境质量优差计算
    if (h2s && nh3) {
      const h2sMax = this.division(1.39, h2s); //硫化氢阈值
      const nh3Max = this.division(0.695, nh3); //氨气阈值
      if (h2sMax >= 0.0076 || nh3Max >= 0.028) {
        return 1;
      }
      if (h2sMax < 0.0076 && nh3Max < 0.028) {
        return 2;
      }
    } else {
      return 0;
    }

  },
  /**
   * 根据公厕ID获取公厕的详细信息
   * @param {Object} parameters json对象参数
   *  公厕ID: toiletId, 固定值:60659a9226b0670364e40adf
   *
   * 返回报文：{"code":200,"data":{"female":{"flowIn":0,"nh3":79,"h2s":4.7,"temperature":25.1,"flowAll":0,"humidity":77.3,"pit":[{"address":"0302002c6a6f00850a17","name":"文华公园驿站智慧公厕女厕1","state":0,"deviceId":"60605b8326b06703e20aa961"},{"address":"0302002c6a6f00850a3a","name":"文华公园驿站智慧公厕女厕2","state":0,"deviceId":"60605b9626b06703e20aa967"},{"address":"0302002c6a6f00850a4a","name":"文华公园驿站智慧公厕女厕3","state":0,"deviceId":"60605ba926b06703e20aa96c"},{"address":"0302002c6a6f00850a2f","name":"文华公园驿站智慧公厕女厕4","state":0,"deviceId":"60605bbd26b06703e20aa96d"},{"address":"0302002c6a6f00850a4d","name":"文华公园驿站智慧公厕女厕5","state":0,"deviceId":"60605bdb26b06703e20aa96f"},{"address":"0302002c6a6f00850a1f","name":"文华公园驿站智慧公厕女厕6","state":0,"deviceId":"60605bec26b06703e20aa972"},{"address":"0302002c6a6f00850a1e","name":"文华公园驿站智慧公厕女厕7","state":1,"deviceId":"60605bfd26b06703e20aa977"},{"address":"0302002c6a6f00850a19","name":"文华公园驿站智慧公厕女厕8","state":0,"deviceId":"60605c1126b06703e20aa97e"}]},"male":{"flowIn":0,"nh3":79.5,"h2s":4.8,"temperature":25,"flowAll":0,"humidity":80.6,"pit":[{"address":"0302002c6a6f00850a11","name":"文华公园驿站智慧公厕男厕1","state":0,"deviceId":"60605c2526b06703e20aa984"},{"address":"0302002c6a6f00850a1c","name":"文华公园驿站智慧公厕男厕2","state":0,"deviceId":"60605c3726b06703e20aa985"},{"address":"0302002c6a6f00850a10","name":"文华公园驿站智慧公厕男厕3","state":1,"deviceId":"60605c4b26b06703e20aa989"},{"address":"0302002c6a6f00850a18","name":"文华公园驿站智慧公厕男厕4","state":0,"deviceId":"60605c5c26b06703e20aa98c"}]}},"id":"c7a5abdf-b319-4e2f-ae25-08a8f0050e4f","message":"OK","status":"SUCCESS"}
   * 返回字段如下：男厕male, 女厕female
   *  num: 总厕所个数
   *  usedNum: 厕所已使用数
   *  freeNum: 厕所空闲数
   *  nh3: 氨气
   *  h2s: 硫化氢
   *  humidity: 湿度
   *  temperature: 温度
   *  worker: 保洁员
   *  num: 保洁次数
   *  exhaust: 排风扇
   *  toiletStatus: 状态 1-流畅, 2-拥堵
   *  qualityStatus: 环境质量 1-差, 2-优
   *
   *  今日累计人数：{{ item.female.flowIn + item.male.flowIn }}
   */
  getToiletInfo(parameters) {
    if (parameters == null) {
      parameters = {};
    }
    parameters.parkId = this.parkId;

    return new Promise((resolve, reject) => {
      api.request({
        method: 'POST',
        url: `/api/toilet/devDataList`,
        data: parameters
      }).then(res => {
        if (res.code === 200) { //成功
          res.code = "200";
          var toilet = res.data;

          //男厕
          var maleToilet = toilet.male;
          var malePitList = maleToilet.pit || [];
          var malePitLen = malePitList.length;
          var freeNum = 0;
          for (var i = 0; i < malePitLen; i++) {
            var pit = malePitList[i];
            var state = pit.state;
            if (state == 0) {
              freeNum++;
            }
          }
          maleToilet.num = malePitLen; //总厕所数
          maleToilet.freeNum = freeNum; //空闲厕所数数
          maleToilet.usedNum = malePitLen - freeNum; //蹲坑人数
          maleToilet.num = 3; //保洁次数
          maleToilet.worker = "张峰"; //保洁员
          maleToilet.exhaust = "开";//排风扇
          if ((malePitLen - freeNum) / malePitLen >= 0.8) {
            maleToilet.toiletStatus = 2;
          } else {
            maleToilet.toiletStatus = 1;
          }
          maleToilet.qualityStatus = this.calEnvironmentQuality(maleToilet.h2s, maleToilet.nh3);//环境质量

          //女厕
          var femaleToilet = toilet.female;
          var femalePitList = femaleToilet.pit || [];
          var femalePitLen = femalePitList.length;
          var femaleFreeNum = 0;
          for (var i = 0; i < femalePitLen; i++) {
            var pit = femalePitList[i];
            var state = pit.state;
            if (state == 0) {
              femaleFreeNum++;
            }
          }
          femaleToilet.num = femalePitLen; //总厕所数
          femaleToilet.freeNum = femaleFreeNum; //空闲厕所数数
          femaleToilet.usedNum = femalePitLen - femaleFreeNum; //蹲坑人数
          femaleToilet.num = 3; //保洁次数
          femaleToilet.worker = "陈燕"; //保洁员
          femaleToilet.exhaust = "开";//排风扇
          if ((femalePitLen - femaleFreeNum) / femalePitLen >= 0.8) {
            femaleToilet.toiletStatus = 2;
          } else {
            femaleToilet.toiletStatus = 1;
          }
          femaleToilet.qualityStatus = this.calEnvironmentQuality(femaleToilet.h2s, femaleToilet.nh3);//环境质量

        }
        resolve(res);
      })
    })
  },

  /**
   * 获取未来6天天气预报信息
   * @param {Object} parameters json对象参数
   *
   * 返回报文：{"code":"200","message":"操作成功","data":[{"tem":"28-19","weather":"多云","imgUrl":"01_02"},{"tem":"30-21","weather":"多云","imgUrl":"01_02"},{"tem":"32-23","weather":"多云","imgUrl":"01_02"},{"tem":"32-23","weather":"阵雨","imgUrl":"03_02"},{"tem":"29-24","weather":"多云","imgUrl":"01_02"},{"tem":"30-23","weather":"小雨","imgUrl":"07"}]}
   * 返回字段如下：
   *  tem: 日期
   *  weather: 天气
   *  imgUrl: 图片名称, 需要拼接图片访问地址 http://www.gd121.cn/img/tqIcon/new/{imgUrl}.png
   *
   */
  getFutureWeekAtmosphereInfo(parameters) {
    if (parameters == null) {
      parameters = {};
    }
    parameters.parkId = this.parkId;

    return api.request({
      method: 'GET',
      url: `/api/iot-park/atmosphere-soil/queryFutureWeekAtmosphereInfo`
    })
  },
  /**
   * 最近六天风向、风速及温度情况
   * @param {Object} parameters
   *
   * 返回报文：{"code":"200","message":"操作成功","data":[{"windSpeed":"10.0","windDirection":"30.0","temperature":"28.0","date":"23","hour":"00"}]}
   * 返回字段如下：
   *  date: 日期
   *  hour: 小时
   *  windSpeed: 风速
   *  windDirection: 风向
   *  temperature: 温度
   *
   */
  getAtmosphereWeekInfo(parameters) {
    if (parameters == null) {
      parameters = {};
    }
    parameters.parkId = this.parkId;

    return api.request({
      method: 'GET',
      url: '/api/iot-park/atmosphere-soil/queryAtmosphereWeekInfo/' + parameters.parkId
    })
  },
  /**
   * 最近1年的噪音信息统计、人流量、PM2.5信息统计
   * @param {Object} parameters json对象参数
   *
   * 返回报文：{"code":"200","message":"操作成功","data":[{"month":"2020-06","pm":"30.0","noiseDecibels":"30.0","flowInNum":0},{"month":"2020-07","pm":"31.0","noiseDecibels":"40.0","flowInNum":0},{"month":"2020-08","pm":"32.0","noiseDecibels":"50.0","flowInNum":2},{"month":"2020-09","pm":"34.0","noiseDecibels":"60.0","flowInNum":551},{"month":"2020-10","pm":"35.0","noiseDecibels":"70.0","flowInNum":0},{"month":"2020-11","pm":"34.0","noiseDecibels":"60.0","flowInNum":0},{"month":"2020-12","pm":"33.0","noiseDecibels":"50.0","flowInNum":0},{"month":"2021-01","pm":"32.0","noiseDecibels":"40.0","flowInNum":0},{"month":"2021-02","pm":"31.0","noiseDecibels":"30.0","flowInNum":0},{"month":"2021-03","pm":"27.0","noiseDecibels":"20.0","flowInNum":0},{"month":"2021-03","pm":"27.0","noiseDecibels":"20.0","flowInNum":0},{"month":"2021-04","pm":"2.58","noiseDecibels":"0.06","flowInNum":1}]}
   * 返回字段如下：
   *  month: 月份
   *  pm: PM2.5值
   *  noiseDecibels: 噪音分贝值
   *  flowInNum: 人流量
   *
   */
  getNosieOrPmInfoOfYear(parameters) {
    if (parameters == null) {
      parameters = {};
    }
    parameters.parkId = this.parkId;

    return api.request({
      method: 'GET',
      url: '/api/iot-park/atmosphere-soil/queryNosieOrPmInfoOfYear/' + parameters.parkId
    })
  },
  /**
   * 获取今年和去年的土壤水分变化
   * @param {Object} parameters json对象参数
   *
   * 返回报文：{"code":"200","message":"操作成功","data":[{"date":"1","pm":"0.0","noiseDecibels":"0.0","waterValue":"10","day":"2","updateTime":"2020-01-24T16:14:52.000+0800","lastYearWaterValue":"10"},{"date":"2","pm":"0.0","noiseDecibels":"0.0","waterValue":"10","day":"2","updateTime":"2020-02-24T16:14:52.000+0800","lastYearWaterValue":"10"},{"date":"3","pm":"0.0","noiseDecibels":"0.0","waterValue":"10","day":"2","updateTime":"2020-03-24T16:14:52.000+0800","lastYearWaterValue":"10"},{"date":"4","pm":"0.0","noiseDecibels":"0.0","waterValue":"1.74","day":"2","updateTime":"2020-04-24T16:14:52.000+0800","lastYearWaterValue":"10"},{"date":"5","pm":"0.0","noiseDecibels":"0.0","waterValue":"0","day":"2","updateTime":"2020-05-24T16:14:52.000+0800","lastYearWaterValue":"10"},{"date":"6","pm":"0.0","noiseDecibels":"0.0","waterValue":"0","day":"2","updateTime":"2020-06-24T16:14:52.000+0800","lastYearWaterValue":"10"},{"date":"7","pm":"0.0","noiseDecibels":"0.0","waterValue":"0","day":"2","updateTime":"2020-07-24T16:14:52.000+0800","lastYearWaterValue":"10"},{"date":"8","pm":"0.0","noiseDecibels":"0.0","waterValue":"0","day":"2","updateTime":"2020-08-24T16:14:52.000+0800","lastYearWaterValue":"10"},{"date":"9","pm":"0.0","noiseDecibels":"0.0","waterValue":"0","day":"2","updateTime":"2020-09-24T16:14:52.000+0800","lastYearWaterValue":"10"},{"date":"10","pm":"0.0","noiseDecibels":"0.0","waterValue":"0","day":"2","updateTime":"2020-10-24T16:14:52.000+0800","lastYearWaterValue":"10"},{"date":"11","pm":"0.0","noiseDecibels":"0.0","waterValue":"0","day":"2","updateTime":"2020-11-24T16:14:52.000+0800","lastYearWaterValue":"10"},{"date":"12","pm":"0.0","noiseDecibels":"0.0","waterValue":"0","day":"2","updateTime":"2020-12-24T16:14:52.000+0800","lastYearWaterValue":"10"}]}
   * 返回字段如下：
   *  date: 月份
   *  waterValue: 今年的水分值(百分比)
   *  lastYearWaterValue: 去年的水分值(百分比)
   *
   */
  getSoilWaterYearInfo(parameters) {
    if (parameters == null) {
      parameters = {};
    }
    parameters.parkId = this.parkId;

    return api.request({
      method: 'GET',
      url: '/api/iot-park/atmosphere-soil/querySoilWaterYearInfo/' + parameters.parkId
    })
  },

  /**
   * 获取设备的经纬度信息
   * @param {Object} parameters json对象参数
   *  deviceType: 设备类型, 古树-1, 公厕-2, 灯杆-3, 默认为古树
   *
   * 返回报文：灯杆{"code":"200","message":"操作成功","data":[{"latitude":"23.00575","name":"6灯杆005","id":100720,"longitude":"113.126689"}]}
   * 返回报文：古树{"code":"200","message":"操作成功","data":[{"id":1,"name":"银杏-1","longitude":"22.30","latitude":"30.00"},{"id":2,"name":"银杏-2","longitude":"30.00","latitude":"22.30"}]}
   * 返回字段如下：
   *  id: 设备ID
   *  name: 设备名称
   *  longitude: 经度
   *  latitude: 纬度
   *
   */
  getDeviceList(parameters) {
    if (parameters == null) {
      parameters = {};
    }
    parameters.parkId = this.parkId;

    var deviceType = parameters.deviceType;
    if (deviceType == null) {
      deviceType = 1;
    }

    if (1 == deviceType) { //古树
      return new Promise((resolve, reject) => {
        api.request({
          method: 'GET',
          url: `/api/iot-park/ancientTree/getTreeList/` + parameters.parkId
        }).then(res => {
          if (res.code === '200') { //成功
            var toiletList = res.data;
            // 113.130972,23.017718
            // toiletList[0].longitude = '113.12979526911272'
            // toiletList[0].latitude = '23.018250122229645'
            toiletList[0].longitude = '113.130972'
            toiletList[0].latitude = '23.017718'
            toiletList[1].longitude = '113.132041'
            toiletList[1].latitude = '23.019448'
            toiletList[2].longitude = '113.135513'
            toiletList[2].latitude = '23.018516'
            toiletList[3].longitude = '113.133519'
            toiletList[3].latitude = '23.016105'
            //console.log("toiletList:" + JSON.stringify(res));
          }
          resolve(res);
        })
      })
    } else if (2 == deviceType) { //公厕
      parameters.skip = 0; //从0条开始
      parameters.limit = 50;//获取50条

      return new Promise((resolve, reject) => {
        api.request({
          method: 'POST',
          url: `/api/toilet/toiletList`,
          data: parameters
        }).then(res => {
          //{"code":200,"data":[{"toiletId":"60659a9226b0670364e40adf","name":"文华公园驿站智慧公厕"}],"id":"b534e9cc-48b4-4a7f-9586-3365da1ca758","message":"OK","status":"SUCCESS"}
          let newData = []
          if (res.code === 200) { //成功
            res.code = "200";
            var onetoilet = res.data[0];
            let toiletList = [1, 2, 3].map(e => {
              return {
                ...onetoilet
              }
            })
            newData = toiletList
            var len = toiletList.length;
            for (var i = 0; i < len; i++) {
              var toilet = toiletList[i];
              // toilet.id = toilet.toiletId;
              // toilet.longitude = "113.134179";
              // toilet.latitude = "23.015955";
              // 文华公园公厕  113.12624246939086 ,23.009000877057044
              // 亚艺公园公厕  113.124562  23.005607 
              // 人民公园公厕  113.118291  23.023874
              if (i == 0) {
                // 113.130532,23.017161
                toilet.longitude = "113.130532";
                toilet.latitude = "23.017161";
                toilet.name = "文华公园公厕";
                toilet.id = 'fswh-01';
              } else if (i == 1) {
                // 113.134817,23.017086
                toilet.longitude = "113.134817";
                toilet.latitude = "23.017086";
                toilet.name = "亚艺公园公厕";
                toilet.id = 'fsyy-01';
              } else if (i == 2) {
                // 113.131763,23.01667
                toilet.longitude = "113.131763";
                toilet.latitude = "23.01667";
                toilet.name = "人民公园公厕";
                toilet.id = 'fsrm-01';
              } else {
                toilet.name = "公共公厕";
                toilet.id = toilet.toiletId;
                toilet.longitude = "113.134179";
                toilet.latitude = "23.015955";
              }
            }
            //console.log("toiletList:" + JSON.stringify(res));
          }
          let newRes = {
            ...res,
            data: newData
          }
          resolve(newRes);
        })
      })
    } else if (3 == deviceType) { //灯杆
      return new Promise((resolve, reject) => {
        api.request({
          method: 'POST',
          url: `/api/park/lampStatics/deviceList`,
          data: parameters
        }).then(res => {
          if (res.code === '200') { //成功
            var toiletList = res.data;
            if (toiletList == null || toiletList.length == 0) {
              toiletList = [];
              var obj = {};
              obj.id = 1;
              obj.name = "灯杆001";
              obj.longitude = "113.134179";
              obj.latitude = "23.015966";
              toiletList.push(obj);
              res.data = toiletList;
            } else {
              var len = toiletList.length;
              for (var i = 0; i < len; i++) {
                var toilet = toiletList[i];
                if (i == 0) {
                  // 上 113.134089,23.020412
                  toilet.longitude = "113.134089";
                  toilet.latitude = '23.020412';
                } else if (i == 1) {
                  // 右
                  toilet.longitude = "113.134943";
                  toilet.latitude = '23.016886';
                } else if (i == 2) {
                  // 下 113.134251,23.013094
                  toilet.longitude = "113.134251";
                  toilet.latitude = '23.013094';
                } else if (i == 3) {
                  // 左
                  toilet.longitude = "113.130649";
                  toilet.latitude = '23.017094';
                } else if (i == 4) {
                  // 中
                  toilet.longitude = "113.133371";
                  toilet.latitude = "23.01766";
                }
                else {
                  toilet.longitude = "113.134179";
                  toilet.latitude = (23.015955 + i / 100).toString();
                }
              }
            }
          }
          resolve(res);
        })
      })
    }

  },
  /**
   * 根据设备ID查看设备详情信息
   *
   * @param {Object} pageObj 页面对象
   * @param {Object} type 设备类型: 古树-1, 公厕-2, 灯杆-3, 默认为古树
   * @param {Object} id 设备ID
   *
   * 调用: wisdomParkReport.getDeviceDetail(this, 2, "60659a9226b0670364e40adf");
   */
  getDeviceDetail(pageObj, type, id) {
    if (type == 1) { //古树
      return this.getTreeInfo({ "treeId": id });
    } else if (type == 2) { //公厕
      return this.getToiletInfo({ "toiletId": id });
    } else if (type == 3) { //灯杆是跳转页面
      this.toDeviceDetail(pageObj, type, id);
    }
  },
  /**
   * 到设备详情页面
   *
   * @param {Object} pageObj 页面对象
   * @param {Object} type 设备类型: 古树-1, 公厕-2, 灯杆-3, 默认为古树
   * @param {Object} id 设备ID
   *
   * 调用: wisdomParkReport.toDeviceDetail(this, 2, "60659a9226b0670364e40adf");
   */
  toDeviceDetail(pageObj, type, id) {
    if (type == 1) {

    } else if (type == 2) {
      pageObj.$router.push({
        path: "/toiltDetail",
        query: {
          code: id
        },
        params: {
          code: id
        }
      });
      store.commit('set_common', {
        'toiltId': id
      });
    } else if (type == 3) {
      //进入外部系统主页: 
      var url = "http://116.63.170.11:8080/client_login.action?clientId=20ce0942adf442a6a02de143fd39bfa3";
      window.open(url);
    }

  },

  // 获取对应的公厕信息统计
  getToiletNewDevDataList(parameters) {
    if (parameters == null) {
      parameters = {};
    }
    return new Promise((resolve, reject) => {
      api.request({
        method: 'POST',
        url: '/api/toilet/newDevDataList',
        data: parameters
      }).then(res => {
        var toiletData = [];
        if (res.code === 200) { //成功
          res.code = "200";
          var toilet = res.data;
          toiletData = toilet
          //男厕
          var maleToilet = toilet.male;
          var malePitList = maleToilet.pit || [];
          var malePitLen = malePitList.length;
          var freeNum = 0;
          for (var i = 0; i < malePitLen; i++) {
            var pit = malePitList[i];
            var state = pit.state;
            if (state == 0) {
              freeNum++;
            }
          }
          maleToilet.num = malePitLen; //总厕所数
          maleToilet.freeNum = freeNum; //空闲厕所数数
          maleToilet.usedNum = malePitLen - freeNum; //蹲坑人数
          maleToilet.num = 3; //保洁次数
          maleToilet.worker = "张峰"; //保洁员
          maleToilet.exhaust = "开";//排风扇
          if ((malePitLen - freeNum) / malePitLen >= 0.8) {
            maleToilet.toiletStatus = 2;
          } else {
            maleToilet.toiletStatus = 1;
          }
          maleToilet.qualityStatus = this.calEnvironmentQuality(maleToilet.h2s, maleToilet.nh3);//环境质量
          //女厕
          var femaleToilet = toilet.female;
          var femalePitList = femaleToilet.pit || [];
          var femalePitLen = femalePitList.length;
          var femaleFreeNum = 0;
          for (var i = 0; i < femalePitLen; i++) {
            var pit = femalePitList[i];
            var state = pit.state;
            if (state == 0) {
              femaleFreeNum++;
            }
          }
          femaleToilet.num = femalePitLen; //总厕所数
          femaleToilet.freeNum = femaleFreeNum; //空闲厕所数数
          femaleToilet.usedNum = femalePitLen - femaleFreeNum; //蹲坑人数
          femaleToilet.num = 3; //保洁次数
          femaleToilet.worker = "陈燕"; //保洁员
          femaleToilet.exhaust = "开";//排风扇
          if ((femalePitLen - femaleFreeNum) / femalePitLen >= 0.8) {
            femaleToilet.toiletStatus = 2;
          } else {
            femaleToilet.toiletStatus = 1;
          }
          femaleToilet.qualityStatus = this.calEnvironmentQuality(femaleToilet.h2s, femaleToilet.nh3);//环境质量
        }
        resolve(res);
      })
    })
  },
}

export default wisdomParkReport;
