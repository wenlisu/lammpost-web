<template>
  <bm-overlay
    ref="customOverlay"
    :class="{ sample: true, active }"
    pane="labelPane"
    @draw="draw"
  >
    <div v-if="status == 3" @click="handleClick">
      <offLine :active='active'/>
    </div>
    <div v-if="status == 1" @click="handleClick">
      <onLine :active='active'/>
    </div>
    <div class="info-layer" v-if="show">
      <div class="info-header">
        <i class="icon">
          <img src="../../images/broadCast_icon.png" alt="" />
        </i>
        <div class="header-text">
          <p>{{ allInfo.terminalName }}</p>
          <p>{{ allInfo.installAddress }}</p>
        </div>
      </div>
      <div class="info-container">
        <p class="no">编号：{{ allInfo.imei }}</p>
        <ul class="info-status">
          <li>
            <p>经度：{{ position.lng }}</p>
            <p>
              灯杆状态：<span
                :class="{ onLine: status == 1, offLine: status != 1 }"
                >{{ status == 1 ? "在线" : "离线" }}</span
              >
            </p>
            <!-- <p>设备状态：<span class="offLine">离线</span></p> -->
          </li>
          <li>
            <p>纬度：{{ position.lat }}</p>
          </li>
        </ul>
        <p class="text">音量：{{ allInfo.deviceVolume || 0 }}分贝</p>
        <p class="text">最后上报时间：{{ allInfo.lastReportTime }}</p>
      </div>
    </div>
  </bm-overlay>
</template>

<script>
import onLine from "./onLine";
import offLine from "./offLine";
import partTitle from "../../../components/commonTitle";

import BmOverlay from 'vue-baidu-map/components/overlays/Overlay'
export default {
  props: ["status", "position", "active", "allInfo", "index"],
  components: {
    onLine,
    offLine,
    partTitle,
    BmOverlay
  },
  watch: {
    position: {
      handler() {
        this.$refs.customOverlay.reload();
      },
      deep: true,
    }
  },
  data() {
    return {
      show: false,
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
      el.style.left = pixel.x - 60 + "px";
      el.style.top = pixel.y - 20 + "px";
    },
  },
};
</script>

<style lang="less" scoped>
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
  min-width: 300px;
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
  border-radius: 1px;
  box-shadow: 0px 5px 4px 0px rgba(0, 22, 43, 0.39);
  position: absolute;
  top: -16px;
  left: 90px;
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
          line-height: 18px; /*no*/
        }
        &:last-child {
          font-size: 12px;
          font-family: PingFangSC;
          font-weight: 400;
          text-align: left;
          color: #f5f7ff;
          line-height: 18px; /*no*/
        }
      }
    }
  }
  .info-container {
    width: 100%;
    padding: 20px;
    .no {
      font-size: 12px;
      font-family: PingFangSC;
      font-weight: 400;
      text-align: left;
      color: #ffffff;
      line-height: 34px;
      white-space: nowrap;
    }
    .text {
      font-size: 12px;
      font-family: PingFangSC;
      font-weight: 400;
      text-align: left;
      color: #ffffff;
      line-height: 34px;
    }
    .info-status {
      display: flex;
      justify-content: space-between;
      li {
        p {
          font-size: 12px;
          font-family: PingFangSC;
          font-weight: 400;
          text-align: left;
          color: #ffffff;
          // margin-top: 10px;
          line-height: 34px;
          span {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 4px;
            line-height: initial;
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
      margin-top: 20px;
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
  }
}
</style>