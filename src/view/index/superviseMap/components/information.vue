<template>
  <div id="superviseInformation" class="info" v-if="show">
        <div class="correct">
          <el-button icon="el-icon-close" @click="closeInformation"></el-button>
          <div class="title" @click="handleToDetail(info)">{{info.deviceName}}<img src="../images/img4.png"/></div>
          <div class="flexRow address"><img src="../images/img12.png" />{{info.address}}</div>
          <div class="flexRow">
            <div>IMEI号：{{info.imei}}</div>
          </div>
          <div class="flexRow">
            <div>最后上报时间：{{info.lastReportDate}}</div>
          </div>
          <div class="flexRow">
            <div>经度：{{info.longitude}}</div>
            <div>纬度：{{info.latitude}}</div>
          </div>
          <el-collapse v-model="collapseActiveNamesList">
             <el-collapse-item name="1">
              <template slot="title">
                <div class="tabTitle">
                  运行数据
                </div>
              </template>
              <div class="flexCloumn dataProgress">
                <div
                class="flexCloumn progressItem"
                >
                  <div class="infoItem flexRow" :class="(!info.temperatureAlarm || info.temperatureAlarm === 0) ? '' : (info.temperatureAlarm === 1 ? 'orange' : 'warn')">
                    <div class="flexCloumn infoValue">
                      <div class="flexRow number">温度：<div>{{info.temperatureValue}}℃</div></div>
                      <div class="section">报警范围：{{info.temperatureLowThreshold}}~{{info.temperatureMaxThreshold}}℃</div>
                    </div>
                    <div
                    class="laber"
                    >
                    <span
                    >
                    {{(!info.temperatureAlarm || info.temperatureAlarm === 0) ? '正常' : (info.temperatureAlarm === 2 ? '超上限' : '上限预警')}}</span>
                    </div>
                  </div>
                </div>
                <div
                class="flexCloumn progressItem"
                >
                  <div class="infoItem flexRow" :class="(!info.humidityAlarm || info.humidityAlarm === 0) ? '' : (info.humidityAlarm === 1 ? 'orange' : 'warn')">
                    <div class="flexCloumn infoValue">
                      <div class="flexRow number">湿度：<div>{{info.humidityValue}}%</div></div>
                      <div class="section">报警范围：{{info.humidityLowThreshold}}~{{info.humidityMaxThreshold}}%</div>
                    </div>
                    <div class="laber">
                      <span
                    >
                    {{(!info.humidityAlarm || info.humidityAlarm === 0) ? '正常' : (info.humidityAlarm === 2 ? '超上限' : '上限预警')}}</span>
                    </div>
                  </div>
                </div>
                <div
                  class="flexCloumn progressItem"
                >
                  <div class="infoItem flexRow" :class="(!info.noiseAlarm || info.noiseAlarm === 0) ? '' : (info.noiseAlarm === 1 ? 'orange' : 'warn')">
                    <div class="flexCloumn infoValue">
                    <div class="flexRow number">噪声：<div>{{info.noiseValue}}分贝</div></div>
                    <div class="section">报警范围：{{info.noiseLowThreshold}}~{{info.noiseMaxThreshold}}分贝</div>
                    </div>
                    <div class="laber"><span
                    >
                    {{(!info.noiseAlarm || info.noiseAlarm === 0) ? '正常' : (info.noiseAlarm === 2 ? '超上限' : '上限预警')}}</span></div>
                  </div>
                </div>
                <div
                class="flexCloumn progressItem"
                >
                  <div class="infoItem flexRow" :class="(!info.pmAlarm || info.pmAlarm === 0) ? '' : (info.pmAlarm === 1 ? 'orange' : 'warn')">
                    <div class="flexCloumn infoValue">
                      <div class="flexRow number">PM2.5：<div>{{info.pmValue}}ug/m³</div></div>
                      <div class="section">报警范围：{{info.pmLowThreshold}}~{{info.pmMaxThreshold}}ug/m³</div>
                    </div>
                    <div class="laber"><span
                    >
                    {{(!info.pmAlarm || info.pmAlarm === 0) ? '正常' : (info.pmAlarm === 2 ? '超上限' : '上限预警')}}</span></div>
                  </div>
                </div>
                <div
                class="flexCloumn progressItem"
                >
                  <div class="infoItem flexRow" :class="(!info.pmTenAlarm || info.pmTenAlarm === 0) ? '' : (info.pmTenAlarm === 1 ? 'orange' : 'warn')">
                    <div class="flexCloumn infoValue">
                      <div class="flexRow number">PM10：<div>{{info.pmTenValue}}ug/m³</div></div>
                      <div class="section">报警范围：{{info.pmTenLowThreshold}}~{{info.pmTenMaxThreshold}}ug/m³</div>
                    </div>
                    <div class="laber">
                      <span
                    >
                    {{(!info.pmTenAlarm || info.pmTenAlarm === 0) ? '正常' : (info.pmTenAlarm === 2 ? '超上限' : '上限预警')}}</span></div>
                  </div>
                </div>
              </div>
             </el-collapse-item>
          </el-collapse>
        </div>
  </div>
</template>

<script>
export default {
  name: 'superviseInformation',
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
    },
    collapseActiveNames (val) {
      this.collapseActiveNamesList = val;
    }
  },
  components: {
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
#superviseInformation{
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
  .correct{
    background:url('../images/img11.png') no-repeat center;
    background-size: 100% 100%;
    color: #fff;
    >div{
      width: 300px;/*no*/
      // color: #fff;
      >div{
        // width: 50%;
        flex: 1;
        text-align: left;
        word-break: break-all;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
        padding-right: 10px;/*no*/
        // color: #fff;
        .el-tooltip{
          flex: 1;
          text-align: left;
          word-break: break-all;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
        }
      }
      span{
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
          .dataProgress{
            .progressItem{
              color: #fff;
              margin-bottom: 10px;/*no*/
              .infoItem{
                  width: 100%;
                  padding: 10px;/*no*/
                  background: linear-gradient(270deg, rgba(24, 83, 161, 0) 0%, rgba(34, 41, 93, 0.67) 100%);
                  border: 1px solid;
                  border-image: linear-gradient(270deg, rgba(81, 148, 217, 0.27), rgba(29, 103, 201, 1)) 1 1;
                  // color: #fff;
                  >div{
                    // width: 50%;
                    display: flex;
                    flex: 2;
                    text-align: left;
                    word-break: break-all;
                    white-space:nowrap;
                    overflow:hidden;
                    text-overflow:ellipsis;
                    padding-right: 10px;/*no*/
                    // color: #fff;
                    &:last-child{
                      flex: 1;
                      padding-right: 0;
                    }
                  }
                  .infoValue{
                    .number{
                      font-size: 14px;/*no*/
                      font-family: PingFangSC-Regular, PingFang SC;
                      font-weight: 400;
                      color: #FFFFFF;
                      align-content: center;
                      line-height: 25px;/*no*/
                      div{
                        font-size: 18px;/*no*/
                      }
                    }
                    .section{
                      font-size: 12px;/*no*/
                      font-family: PingFangSC-Regular, PingFang SC;
                      font-weight: 400;
                      color: #4799F3;
                    }
                  }
                  .laber{
                    justify-content: flex-end;
                    align-items: center;
                                          span{
                    width: auto;
                  height: auto;
                  font-size: 12px;/*no*/
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: #FFFFFF;
                  background: linear-gradient(135deg, rgba(138, 220, 255, 0.3) 0%, rgba(19, 58, 199, 0.33) 100%);
                  border: 1px solid;
                  border-image: linear-gradient(135deg, rgba(103, 198, 255, 1), rgba(0, 136, 230, 1)) 1 1;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  border-radius: 0;
                  }
                  }
                &.orange{
                  .infoValue .number div{
                    color:#FF720D;
                  }
                  .laber span{
                  background: linear-gradient(135deg, rgba(255, 91, 91, 0.17) 0%, rgba(135, 19, 19, 0.33) 100%);
                  border: 1px solid;
                  border-image: linear-gradient(135deg, rgba(255, 113, 56, 1), rgba(233, 66, 57, 1)) 1 1;
                  }
                }
                &.warn{
                  .infoValue .number div{
                    color:#FF3C30;
                  }
                  .laber span{
                  background: linear-gradient(135deg, rgba(255, 91, 91, 0.17) 0%, rgba(135, 19, 19, 0.33) 100%);
                  border: 1px solid;
                  border-image: linear-gradient(135deg, rgba(255, 60, 48, 1), rgba(233, 60, 48, 1)) 1 1;
                  }
                }
              }
              &:last-child{
                margin-bottom: 0;
              }
            }
            .progress{
              width: 100%;
              height:10px;/*no*/
              background:rgba(216,216,216,0.06);
              border-radius:7px;
              position: relative;
              margin-top: 8px;/*no*/
              span{
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                height: 10px;/*no*/
                background:linear-gradient(90deg,rgba(255,116,151,0) 0%,rgba(255,56,123,1) 100%);
                border-radius:7px;
                padding: 0;
              }
            }
          }
        }
      }
    }
  }
}
</style>
