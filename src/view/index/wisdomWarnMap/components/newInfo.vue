<template>
  <div class="info-wrap">
    <div class="scroll-wrap">
      <div class="device-status">
        <img src="../images/alarm.png" alt="" srcset="" />
        <div class="info">
          <p class="device">报警器总数</p>
          <p class="num">{{ result.deviceTotal }}<span>个</span></p>
        </div>
      </div>
      <div class="device-status">
        <img src="../images/online.png" alt="" srcset="" />
        <div class="info">
          <p class="device">在线数</p>
          <p class="num">{{ result.onlineHik }}<span>个</span></p>
        </div>
      </div>
      <div class="device-status">
        <img src="../images/offline.png" alt="" srcset="" />
        <div class="info">
          <p class="device">离线数</p>
          <p class="num">{{ result.offlineHik }}<span>个</span></p>
        </div>
      </div>
      <div class="work-total">
        <commonTitle title="总报警数" />
        <div class="work-num">
          <img src="../images/alarm_2.png" alt="" />
          <p class="num">{{ result.alarmTotal }}<span>个</span></p>
        </div>
      </div>
      <div class="work-total">
        <commonTitle title="今日报警数" />
        <div class="work-num">
          <img src="../images/alarm_2.png" alt="" />
          <p class="num">{{ result.alarmToday }}<span>个</span></p>
        </div>
      </div>
      <div class="work-total">
        <commonTitle title="本月报警数" />
        <div class="work-num">
          <img src="../images/alarm_2.png" alt="" />
          <p class="num">{{ result.alarmMonth }}<span>个</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import commonTitle from "../../components/commonTitle";
import { getAlarmInfoTop } from "@/api/wisdomWarn";
export default {
  components: {
    commonTitle,
  },
  props: {},
  data() {
    return {
      result: {
        alarmMonth: 0, // 当月告警 ,
        alarmToday: 0, // 当天告警 ,
        alarmTotal: 0, // 告警总数 ,
        deviceTotal: 0, //  设备总数 ,
        offlineHik: 0, // 离线数 ,
        onlineHik: 0, //  在线数
      },
    };
  },
  created() {
    this.getInfos();
  },
  methods: {
    async getInfos() {
      let res = await getAlarmInfoTop({});
      if (res.code === "200") {
        const { data } = res;
        this.result = data;
      }
    },
  },
};
</script>

<style scoped lang="less">
.info-wrap {
  width: 245px;
  height: 100%;
  background-image: url(../images/border_1.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  padding: 30px 0px 20px 0px;
  // margin-top: 1%;
  overflow: hidden;
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
      width: 40px;
      height: 48px;
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
        width: 21px;
        height: 26px;
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

  .scroll-wrap {
    overflow: auto;
    margin-top: 1%;
    padding: 14px 24px 0px 30px;
    height: 100%;
    widows: 100%;
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
}
</style>
