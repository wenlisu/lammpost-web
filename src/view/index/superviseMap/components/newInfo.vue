<template>
  <div class="info-wrap">
    <div class="device-status">
      <img src="../images/total.png" alt="" srcset="" />
      <div class="info">
        <p class="device">环境监测器总数</p>
        <p class="num">{{items.totalCount}}<span>个</span></p>
      </div>
    </div>
    <div class="device-status">
      <img src="../images/online.png" alt="" srcset="" />
      <div class="info">
        <p class="device">在线数</p>
        <p class="num">{{items.onlineCount}}<span>个</span></p>
      </div>
    </div>
    <div class="device-status">
      <img src="../images/offline.png" alt="" srcset="" />
      <div class="info">
        <p class="device">离线数</p>
        <p class="num">{{items.offlineCount}}<span>个</span></p>
      </div>
    </div>
    <div class="work-total">
      <commonTitle title="总报警数" />
      <div class="work-num">
        <img src="../images/alarm.png" alt="" />
        <p class="num">{{items.alarmCount}}<span>次</span></p>
      </div>
    </div>
    <div class="work-total">
      <commonTitle title="今日报警数" />
      <div class="work-num">
        <img src="../images/alarm.png" alt="" />
        <p class="num">{{items.todayAlarmCount}}<span>次</span></p>
      </div>
    </div>
    <div class="work-total">
      <commonTitle title="本月报警数" />
      <div class="work-num">
        <img src="../images/alarm.png" alt="" />
        <p class="num">{{items.monthAlarmCount}}<span>次</span></p>
      </div>
    </div>
  </div>
</template>

<script>
import commonTitle from "../../components/commonTitle";
import {
  getAmbientMonitoringRunStatus
} from 'api/supervise';
export default {
  components: {
    commonTitle
  },
  props: {},
  data () {
    return {
      items: {}
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.init();
    })
  },
  methods: {
    init () {
      getAmbientMonitoringRunStatus({}).then(res => {
        if (res.code === '200') {
          this.items = res.data;
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.info-wrap {
  width: 266px;
  height: 100%;
  background-image: url(../../images/border_1.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  padding: 44px 24px 29px 30px;
  margin-top: 1%;
  overflow: auto;
  .device-status {
    width: 100%;
    // height: 81px;
    display: flex;
    align-items: center;
    background: linear-gradient(
      135deg,
      rgba(76, 152, 215, 0.17),
      rgba(37, 95, 175, 0)
    );
    margin-bottom: 10px;
    border-radius: 3px;
    padding: 16px 0;

    .info-box {
      width: 100%;
      height: 100%;
    }
    img {
      width: 66px;
      height: 66px;
      margin-left: 14px;
      margin-right: 17px;
    }
    .info {
      .device {
        font-size: 14px;
        font-family: PingFangSC, PingFangSC-Semibold;
        font-weight: 600;
        color: #ffffff;
        line-height: 20px;
      }
      .num {
        font-size: 26px;
        font-family: PangMenZhengDao;
        color: #ffffff;
        line-height: 30px;
        margin-top: 6px;
        span {
          font-size: 14px;
        }
      }
    }
  }
  .work-total {
    width: 100%;
    background: linear-gradient(
      135deg,
      rgba(76, 152, 215, 0.17),
      rgba(37, 95, 175, 0) 99%
    );
    border-radius: 3px;
    margin-bottom: 10px;
    /deep/.common-box {
      padding-top: 2px;
      padding-bottom: 4px;
      padding-left: 20px;
      .txt {
        font-size: 14px;
        font-family: PingFangSC, PingFangSC-Semibold;
      }
    }
    .work-num {
      // margin: 14px 0;
      padding-top: 14px;
      padding-bottom: 14px;
      padding-left: 20px;
      display: flex;
      img {
        width: 36px;
        height: 35px;
        margin-right: 30px;
      }
      .num {
        font-size: 26px;
        font-family: PangMenZhengDao;
        color: #ffffff;
        span {
          font-size: 14px;
        }
      }
    }
  }
  // 滚动条
  &::-webkit-scrollbar {
    width: 3px; /*no*/
  }
      &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(236, 239, 246, 0.2); /*no*/
    background: #4a5b8f;
  }
      &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(236, 239, 246, 0.2); /*no*/
    border-radius: 0;
    background: transparent;
  }
}
</style>
