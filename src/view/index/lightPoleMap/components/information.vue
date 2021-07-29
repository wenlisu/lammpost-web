<template>
  <div id="lightInformation"  class="info" v-if="show">
    <div class="error" v-if="info.type == 2">
      <el-button icon="el-icon-close" @click="closeInformation"></el-button>
        <div class="title" @click="handleToDetail(info)">{{info.terminalName}}<img src="../images/img4.png"/></div>
        <div class="flexRow address"><img src="../images/img12.png" />{{info.installAddress}}</div>
        <div>灯杆编号：{{info.imei}}</div>
        <div class="flexRow">
          <div class="flexRow">灯杆状态：<radioType :type="`${info.type}`" /></div>
          <div>照明状态：
            <el-switch
              :value="info.deviceLampDto && info.deviceLampDto.lampPower === 1 ? true : false"
              active-color="#2870FF"
              inactive-color="#1C376D"
              disabled>
            </el-switch>
          </div>
        </div>
        <div class="flexRow">
          <div>经度：{{info.longitude}}</div>
          <div>纬度：{{info.latitude}}</div>
        </div>
        <div class="flexRow">
        <div>负责人姓名：{{info.personInCharge}}</div>
        <div>负责人电话：{{info.personInChargeTel}}</div>
        </div>
        <el-collapse v-model="collapseActiveNamesList">
            <el-collapse-item name="1" v-if="Object.keys(info.deviceAmbientDataDto).length > 0">
            <template slot="title">
              <div class="tabTitle">
                环境监测器报警
              </div>
            </template>
            <div class="correct">
              <div class="flexRow">
                <div>告警发生时间：{{info.deviceAmbientData.lastReportTime}}</div>
              </div>
              <div class="flexRow">
                <div>告警类型：{{info.deviceAmbientDataDto.alarmTypeText}}</div>
              </div>
            </div>
            </el-collapse-item>
            <el-collapse-item name="2">
            <template slot="title">
              <div class="tabTitle">
                一键报警器报警
              </div>
            </template>
            <div class="correct">
              <div class="flexRow">
                <div>告警发生时间：{{info.deviceCallData.lastReportTime || ''}}</div>
              </div>
              <div class="flexRow">
                <div>报警状态：{{info.deviceCallData.deviceAlarmCallDataDto.alarmCallStatusText || ''}}</div>
              </div>
            </div>
            </el-collapse-item>
          <el-collapse-item name="3">
            <template slot="title">
              <div class="tabTitle">
                摄像头
              </div>
            </template>
            <div class="correct">
              <div class="flexRow imgList">
                <videoAddress :srcUrl="info.deviceCameraData.cameraDto.videoUrl || ''" />
              </div>
            </div>
            </el-collapse-item>
            <el-collapse-item name="4">
              <template slot="title">
                <div class="tabTitle">
                  智慧照明
                </div>
              </template>
              <div class="correct">
                <div class="">
                  {{info.lampPolicyDto ? info.lampPolicyDto.workTime : '18:00'}}开启照明灯
                </div>
                <div class="">
                  {{info.lampPolicyDto ? info.lampPolicyDto.closeTime : '05:00'}}关闭照明灯
                </div>
              </div>
            </el-collapse-item>
        </el-collapse>
    </div>
    <div class="correct" v-else>
      <el-button icon="el-icon-close" @click="closeInformation"></el-button>
      <div class="title" @click="handleToDetail(info)">{{info.terminalName}}<img src="../images/img4.png"/></div>
      <div class="flexRow address"><img src="../images/img12.png" />{{info.installAddress}}</div>
      <div>灯杆编号：{{info.imei}}</div>
      <div class="flexRow">
        <div class="flexRow">灯杆状态：<radioType :type="`${info.type}`" /></div>
        <div>照明状态：
          <el-switch
            :value="info.deviceLampDto && info.deviceLampDto.lampPower === 1 ? true : false"
            active-color="#2870FF"
            inactive-color="#1C376D"
            disabled>
          </el-switch>
        </div>
      </div>
      <div class="flexRow">
        <div>经度：{{info.longitude}}</div>
        <div>纬度：{{info.latitude}}</div>
      </div>
      <div class="flexRow">
      <div>负责人姓名：{{info.personInCharge}}</div>
      <div>负责人电话：{{info.personInChargeTel}}</div>
      </div>
      <el-collapse v-model="collapseActiveNamesList">
          <el-collapse-item name="1" v-if="Object.keys(info.deviceAmbientDataDto).length > 0">
          <template slot="title">
            <div class="tabTitle">
              空气环境
            </div>
          </template>
          <div class="correct">
            <div class="flexRow flexCenter">
              <div>温度：<span :class="(info.deviceAmbientDataDto && !info.deviceAmbientDataDto.temperatureAlarm || info.deviceAmbientDataDto && info.deviceAmbientDataDto.temperatureAlarm === 0) ? '' : (info.deviceAmbientDataDto && info.deviceAmbientDataDto.temperatureAlarm === 1 ? 'orange' : 'warn')">{{info.deviceAmbientDataDto && info.deviceAmbientDataDto.temperatureValue}}℃</span></div>
              <div>湿度：<span :class="(info.deviceAmbientDataDto && !info.deviceAmbientDataDto.humidityAlarm || info.deviceAmbientDataDto && info.deviceAmbientDataDto.humidityAlarm === 0) ? '' : (info.deviceAmbientDataDto && info.deviceAmbientDataDto.humidityAlarm === 1 ? 'orange' : 'warn')">{{info.deviceAmbientDataDto && info.deviceAmbientDataDto.humidityValue}}%</span></div>
            </div>
            <div class="flexRow">
              <div>噪声：<span :class="(info.deviceAmbientDataDto && !info.deviceAmbientDataDto.noiseAlarm || info.deviceAmbientDataDto && info.deviceAmbientDataDto.noiseAlarm === 0) ? '' : (info.deviceAmbientDataDto && info.deviceAmbientDataDto.noiseAlarm === 1 ? 'orange' : 'warn')">{{info.deviceAmbientDataDto && info.deviceAmbientDataDto.noiseValue}}dB</span></div>
            </div>
            <div class="flexRow">
              <div>PM2.5：<span :class="(info.deviceAmbientDataDto && !info.deviceAmbientDataDto.pmAlarm || info.deviceAmbientDataDto && info.deviceAmbientDataDto.pmAlarm === 0) ? '' : (info.deviceAmbientDataDto && info.deviceAmbientDataDto.pmAlarm === 1 ? 'orange' : 'warn')">{{info.deviceAmbientDataDto && info.deviceAmbientDataDto.pmValue}}ug/m³</span></div>
              <div>PM10：<span :class="(info.deviceAmbientDataDto && !info.deviceAmbientDataDto.pmTenAlarm || info.deviceAmbientDataDto && info.deviceAmbientDataDto.pmTenAlarm === 0) ? '' : (info.deviceAmbientDataDto && info.deviceAmbientDataDto.pmTenAlarm === 1 ? 'orange' : 'warn')">{{info.deviceAmbientDataDto && info.deviceAmbientDataDto.pmTenValue}}ug/m³</span></div>
            </div>
            <div>空气质量指数：<span class="diamond">{{info.deviceAmbientDataDto && info.deviceAmbientDataDto.airQualityText}}</span></div>
          </div>
          </el-collapse-item>
          <el-collapse-item name="2">
          <template slot="title">
            <div class="tabTitle">
              摄像头
            </div>
          </template>
          <div class="correct">
            <div class="flexRow imgList">
              <videoAddress :srcUrl="info.deviceCameraData.cameraDto.videoUrl || ''" />
            </div>
          </div>
          </el-collapse-item>
          <el-collapse-item name="3">
            <template slot="title">
              <div class="tabTitle">
                智慧照明
              </div>
            </template>
            <div class="correct">
              <div class="">
                {{info.lampPolicyDto ? info.lampPolicyDto.workTime : '18:00'}}开启照明灯
              </div>
              <div class="">
                {{info.lampPolicyDto ? info.lampPolicyDto.closeTime : '05:00'}}关闭照明灯
              </div>
            </div>
          </el-collapse-item>
      </el-collapse>
      <div class="updateTime">最新更新时间：{{info.createTime}}</div>
    </div>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex';
import radioType from '@/components/radioType';
import videoAddress from '@/view/smokeDetector/smokeDetectorMap/components/videoAddress';
export default {
  name: 'lightInformation',
  data () {
    return {
      collapseActiveNamesList: []
    };
  },
  watch: {
    info (val) {
      this.info = val;
    },
    show (val) {
      this.show = val;
      console.log('11',this.show)
    },
    collapseActiveNames (val) {
      this.collapseActiveNamesList = val
    }
  },
  computed: {
    ...mapGetters(['common'])
  },
  components: {
    radioType,
    videoAddress
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => {
        return {}
      }
    },
    collapseActiveNames: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
    });
  },
  methods: {
    handleToDetail (item) {
      this.$emit('detail', item)
    },
    closeInformation () {
      this.$emit('close');
    }
  }
};
</script>

<style lang="less">
#lightInformation{
      &.info{
      position: absolute;
      top: 10px;
      right: 10px;
      color: #fff;
      #radioType{
        justify-content: flex-start;
      }
      >div{
      padding: 35px 36px 35px 25px;
      }
      button{
        position: absolute;
        top: 0;
        right: 0;
        padding: 0;
        border-radius: 0;
        width:20px;
        height:20px;
        background:rgba(103,112,148,1);
        /deep/i{
          color: #fff;
          font-size: 12px;
        }
      }
      >div>div{
        margin-bottom: 10px;
        font-size:12px;/*no*/
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        &.title{
          font-family:PingFangSC-Semibold,PingFang SC;
          font-weight:600;
          font-size:14px;/*no*/
          cursor: pointer;
          img{
            width: 17px;
            height: 12px;
            margin-left: 8px;
          }
        }
        &:last-child{

        }
      }
    }
  .error{
    background:url('../images/img6.png') no-repeat center;
    background-size: 100% 100%;
    .address{
      align-items: center;
      img{
        width: 14px;
        height: 16px;
        margin-right: 6px;
      }
    }
    >div{
      width: 100%;
      // color: #fff;
      >div{
        flex: 1;
        text-align: left;
        // color: #fff;
      }
    }
  }
  .correct{
    min-width: 333px;/*no*/
    background:url('../images/img11.png') no-repeat center;
    background-size: 100% 100%;
    color: #fff;
    .orange{
      color:#FF720D;
    }
    .warn{
      color:#FF3C30;
    }
    >div{
      width: 100%;
      // color: #fff;
      >div{
        flex: 1;
        text-align: left;
        // color: #fff;
      }
      span.diamond{
        font-size: 12px;/*no*/
        color: #fff;
        padding:1px 7px;/*no*/
        background:linear-gradient(141deg,rgba(49,205,151,1) 0%,rgba(31,171,142,1) 100%);
        border-radius: 50px;
        &.greent{
          background:linear-gradient(141deg,rgba(135,199,68,1) 0%,rgba(94,147,48,1) 100%);
        }
        &.yellow{
          background:linear-gradient(141deg,rgba(251,186,69,1) 0%,rgba(233,156,33,1) 100%);
        }
        &.orange{
          background:linear-gradient(141deg,rgba(251,115,69,1) 0%,rgba(233,86,33,1) 100%);
        }
      }
    }
    .updateTime{
      color:rgba(135,145,190,1);
      margin-bottom: 0;
    }
    .address{
      align-items: center;
      img{
        width: 14px;
        height: 16px;
        margin-right: 6px;
      }
    }
    .imgList{
      min-width: 256px;
      max-width: 500px;
      height: 180px;/*no*/
      position: relative;
      overflow: hidden;
      // iframe{
      //   height: 100%;/*no*/
      //   height: 180px !important;/*no*/
      //   width: 100%;
      //   overflow: hidden;
      // }
      #videoAddress{
        position: absolute;
        top: -48px;/*no*/
        left: 0;
        right: 0;
        height: calc(100% + 96px);/*no*/
        bottom: -48px;/*no*/
      }
    }
    .el-switch{
      width:29px;/*no*/
      height:13px;/*no*/
      /deep/.el-switch__core{
        height: 100%;
        &::after{
          top: 0;
          width:11px;/*no*/
          height:11px;/*no*/
          background:rgba(255,255,255,1);
          box-shadow:0px 3px 7px 0px rgba(27,104,126,0.5);
        }
      }
      &.is-checked{
        /deep/.el-switch__core{
          &::after{
            margin-left: -12px;/*no*/
          }
        }
      }
    }
  }
  .el-collapse{
    border: none;
    .el-collapse-item{
      width: 100%;
      padding-right: 0;
      /deep/.el-collapse-item__header{
        height: auto;
        line-height: initial;
        border-bottom: none;
        background-color: transparent;
        position: relative;
        margin-bottom: 10px;
        .tabTitle{
          width: 100%;
        }
        i{
          position: absolute;
          color: #fff;
          right: 0px;
        }
      }
      /deep/.el-collapse-item__wrap{
        background: transparent;
        border-bottom: none;
        .el-collapse-item__content{
          padding-bottom: 0px;
          >div{
            background: none;
          }
        }
      }
    }
  }
  .tabTitle{
    font-size:12px;/*no*/
    font-family:PingFangSC-Semibold,PingFang SC;
    font-weight:600;
    color:rgba(255,255,255,1);
    padding: 8px 10px;
    position: relative;
    border-bottom: 1px solid rgba(46, 61, 107, 1);/*no*/
    &::after{
      content: '';
      width:3px;/*no*/
      height:12px;/*no*/
      background:rgba(216,216,216,1) linear-gradient(138deg,rgba(62,210,240,1) 0%,rgba(58,104,211,1) 100%);
      border-radius:1px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 0;
    }
  }
}
</style>
