<template>
  <bm-overlay
    ref="customOverlay"
    :class="{ sample: true, active }"
    pane="labelPane"
    @draw="draw"
  >
    <div v-if="status == 1" @click="handleClick">
      <startLight />
    </div>
    <div v-if="status == 0" @click="handleClick">
      <alarmLight />
    </div>
    <!-- <div v-if="status == 2" @click="handleClick">
      <endLight />
    </div> -->
    <div class="info-layer" v-if="show">
      <div class="info-header">
        <i class="icon">
          <img src="../../images/light_icon.png" alt="" />
        </i>
        <div class="header-text">
          <p>{{ allInfo["deviceName"] || "" }}</p>
          <p>{{ allInfo["address"] || "" }}</p>
        </div>
      </div>
      <div class="info-container">
        <p class="no">编号：{{ allInfo["serialNumber"] || "" }}</p>
        <ul class="info-status">
          <li>
            <p>
              灯杆状态：<span :class="[status == 1 ? 'onLine' : 'offLine']">{{
                status == 1 ? "在线" : "离线"
              }}</span>
            </p>
            <p>经度：{{ allInfo["longitude"] || "" }}</p>
          </li>
          <li>
            <p>
              照明状态：<span
                :class="[allInfo['isOpen'] == 1 ? 'onLine' : 'offLine']"
                >{{ allInfo["isOpen"] == 1 ? "开启" : "关闭" }}</span
              >
            </p>
            <p>纬度：{{ allInfo["latitude"] || "" }}</p>
          </li>
        </ul>
        <div :class="['part-title', allInfo['ambientDataDto'] ? null : 'disPlayNone']">
          <span class="txt">环境指标</span>
        </div>
        <div :class="['content', allInfo['ambientDataDto'] ? null : 'disPlayNone']">
          <ul class="info-content">
            <li>
              <p>
                温度：{{
                  (allInfo["ambientDataDto"] &&
                    allInfo["ambientDataDto"]["temperatureValue"]) ||
                  0
                }}°C
              </p>
              <p>
                噪声：{{
                  (allInfo["ambientDataDto"] &&
                    allInfo["ambientDataDto"]["noiseValue"]) ||
                  0
                }}dB
              </p>
            </li>
            <li>
              <p>
                湿度：{{
                  (allInfo["ambientDataDto"] &&
                    allInfo["ambientDataDto"]["humidityValue"]) ||
                  0
                }}%
              </p>
              <p>
                PM2.5：{{
                  (allInfo["DeviceAmbientDataDto"] &&
                    allInfo["DeviceAmbientDataDto"]["pmValue"]) ||
                  0
                }}ug/m³
              </p>
            </li>
          </ul>
          <p>
            PM10：{{
              (allInfo["DeviceAmbientDataDto"] &&
                allInfo["DeviceAmbientDataDto"]["pmTenValue"]) ||
              0
            }}ug/m³
          </p>
          <!-- <p>
            空气质量指数：
            <span class="label">优(0-50)</span>
          </p> -->
        </div>
        <div class="part-title">
          <span class="txt">智能照明策略</span>
        </div>
        <div class="handle-light">
          <p>{{ allInfo["lampPolicyDto"]["onTime"] || "" }}开启照明灯</p>
          <p>{{ allInfo["lampPolicyDto"]["offTime"] || "" }}关闭照明灯</p>
        </div>
        <div class="light-img">
          <img src="../../images/light.png" alt="" />
        </div>
      </div>
    </div>
  </bm-overlay>
</template>

<script>
import startLight from "./startLight";
import alarmLight from "./alarmLight.vue";
import endLight from "./endLight";
import partTitle from "../../../components/commonTitle";

import BmOverlay from 'vue-baidu-map/components/overlays/Overlay'
export default {
  props: ["status", "position", "active", "allInfo", "index"],
  components: {
    startLight,
    alarmLight,
    partTitle,
    endLight,
    BmOverlay
  },
  watch: {
    position: {
      handler() {
        // console.log(11111)
        this.$refs.customOverlay.reload();
      },
      deep: true,
    },
  },
  data() {
    return {
      show: false,
      title1: "环境指标",
      title2: "智能照明策略",
    };
  },
  methods: {
    handleClick() {
      // let node = {
      //   id: this.allInfo.toiletId,
      //   label: this.allInfo.toiletName,
      //   regionId: this.allInfo.regionId,
      //   index: this.index,
      //   ...this.allInfo
      // }
      // this.$emit('getDetail', node.id)
      clearTimeout(this.timer);
      this.$emit("getDetail", {});
      this.show = !this.show;
      this.show
        ? (this.timer = setTimeout(() => {
            this.show = false;
          }, 5000))
        : null;
    },
    draw({ el, BMap, map }) {
      const { lng, lat } = this.position;
      const pixel = map.pointToOverlayPixel(new BMap.Point(lng, lat));
      el.style.left = pixel.x - 0 + "px";
      el.style.top = pixel.y - 0 + "px";
    },
  },
};
</script>

<style lang="less" scoped>
.label {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  background: #14c5a0;
  line-height: 18px;
}
.textNormal {
  font-size: 12px;
  font-family: PingFangSC;
  font-weight: 400;
  text-align: left;
  color: #ffffff;
}
.sample {
  width: 73px;
  height: 127px;
  position: absolute;
}
/* .sample.active {
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
} */
.info-layer {
  /* height: 165px; */
  opacity: 1;
  background: linear-gradient(270deg, rgba(0, 19, 50, 0.85), #0e274c 100%);
  border: 1px solid;
  border-image: linear-gradient(
      316deg,
      rgba(27, 150, 219, 0.26),
      rgba(40, 222, 255, 0.8) 99%
    )
    1 1;
  border-radius: 2px;
  position: absolute;
  top: -60px;
  left: 65px;
  z-index: 10;
  .info-header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 50px;
    padding: 0 10px;
    // background: linear-gradient(
    //   270deg,
    //   rgba(32, 45, 85, 0.2),
    //   #94562c 85%,
    //   rgba(148, 78, 44, 0.31)
    // );
    background: linear-gradient(
      270deg,
      rgba(32, 45, 85, 0.2),
      rgba(40, 222, 255, 0.47) 85%,
      rgba(40, 222, 255, 0.25)
    );
    .icon {
      display: inline-block;
      width: 35px;
      height: 35px;
      margin-right: 4px;
      img {
        max-width: 100%;
      }
    }
    .header-text {
      p {
        &:first-child {
          font-size: 16px;
          font-family: PangMenZhengDao;
          text-align: left;
          color: #ffffff;
          line-height: 18px;
        }
        &:last-child {
          font-size: 12px;
          font-family: PingFangSC;
          font-weight: 400;
          text-align: left;
          color: #f5f7ff;
          line-height: 17px;
        }
      }
    }
  }
  .info-container {
    width: 100%;
    padding: 20px 20px 0 20px;
    white-space: nowrap;
    .no {
      .textNormal();
      line-height: 17px;
    }
    .info-status {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      li {
        p {
          .textNormal();
          margin-top: 10px;
          span {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 4px;
          }
          .onLine {
            background: #14c5a0;
          }
          .offLine {
            background: #e4582f;
          }
        }
      }
    }
    .part-title {
      width: 100%;
      background: linear-gradient(270deg, rgba(32, 45, 85, 0.2), #2c5b94);
      padding-left: 10px;
      padding-bottom: 2px;
      border-left: 2px solid #28deff;
      // padding-top: 5px;
      // margin-top: 20px;
      position: relative;
      &::after {
        content: "";
        display: inline-block;
        width: 100%;
        height: 1px;
        background: linear-gradient(270deg, rgba(32, 45, 85, 0.2), #108dff 98%);
        position: absolute;
        bottom: 0;
        left: 0;
      }
      .txt {
        font-size: 14px;
        font-family: PingFangSC;
        font-weight: 600;
        text-align: left;
        color: #ffffff;
        line-height: 20px;
      }
    }
    .content {
      p {
        .textNormal();
        line-height: 34px;
      }
      .info-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        li {
          p {
            .textNormal();
            line-height: 34px;
          }
        }
      }
    }
    .handle-light {
      p {
        .textNormal();
        line-height: 34px;
      }
    }
    .light-img {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 88px;
      height: 150px;
      img {
        max-width: 100%;
      }
    }
  }

  .disPlayNone {
    display: none;
  }
}
</style>