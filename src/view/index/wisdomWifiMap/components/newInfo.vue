<template>
  <div class="info-wrap">
    <el-row>
      <el-col :span="24">
        <commonTitle title="设备总览" />
      </el-col>
    </el-row>
    <el-row class="firstRow">
      <el-col :span="12">
        <div class="device-status">
          <img src="../images/alarm.png" alt="" srcset="" />
          <div class="info">
            <p class="device">wifi设备总数</p>
            <p class="num">{{ deviveCount.total }}<span>个</span></p>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="device-status">
          <img src="../images/open.png" alt="" srcset="" />
          <div class="info">
            <p class="device">设备LED开启数</p>
            <p class="num">{{ deviveCount.ledOnline }}<span>个</span></p>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row class="secondRow">
      <el-col :span="12">
        <div class="device-status">
          <img src="../images/online.png" alt="" srcset="" />
          <div class="info">
            <p class="device">在线数</p>
            <p class="num">{{ deviveCount.online }}<span>个</span></p>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="device-status">
          <img src="../images/offline.png" alt="" srcset="" />
          <div class="info">
            <p class="device">离线数</p>
            <p class="num">{{ deviveCount.offLine }}<span>个</span></p>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import commonTitle from "../../components/commonTitle";
import { queryWifiInfo } from "api/wifi";
export default {
  components: {
    commonTitle,
  },
  props: {},
  data() {
    return {
      deviveCount: {
        online: 0,
        offLine: 0,
        ledOnline: 0,
        total: 0,
      },
    }
  },
  created() {
    this._queryWifiInfo()
  },
  methods: {
    // 查询WiFi在线、离线数量
    _queryWifiInfo() {
      const params = {
        deviceModuleName: "",
        deviceStatus: "",
        endTime: "",
        siteId: "",
        startTime: "",
      };
      queryWifiInfo(params).then((res) => {
        if (res.code == "200") {
          for (let key in this.deviveCount) {
            this.deviveCount[key] = res.data[key];
          }
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.info-wrap {
  height: 100%;
  /deep/.common-box {
    padding-top: 16px;
    padding-bottom: 16px;
    padding-left: 23px;
    margin-bottom: 34px;
    .txt {
      font-size: 28px;
      font-family: YouSheBiaoTiHei;
    }
  }
  .firstRow,
  .secondRow {
    padding-left: 34px;
  }
  .device-status {
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    border-radius: 3px;
    padding: 16px 0;

    .info-box {
      width: 100%;
      height: 100%;
    }
    img {
      width: 90px;
      height: 84px;
      margin-left: 14px;
      margin-right: 13px;
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
}
</style>