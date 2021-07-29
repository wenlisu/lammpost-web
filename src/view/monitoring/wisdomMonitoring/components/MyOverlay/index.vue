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
    <div v-if="status == 3" @click="handleClick">
      <endLight />
    </div>
    <div class="info-layer" v-if="show">
      <div class="info-header">
        <i class="icon">
          <img src="../../images/light_icon.png" alt="" />
        </i>
        <div class="header-text">
          <p>{{ allInfo["deviceName"] || "" }}</p>
          <p>{{ allInfo["installAddress"] || "" }}</p>
        </div>
      </div>
      <div class="info-container">
        <p class="no">IME号：{{ allInfo["imei"] || "" }}</p>
        <ul class="info-status">
          <li>
            <p>
              摄像头状态：<span :class="[status == 1 ? 'onLine' : 'offLine']">{{
                status == 1 ? "在线" : "离线"
              }}</span>
            </p>
          </li>
          <li class="adress-li">
            <p>经度：{{ allInfo["longitude"] || "" }}</p>
            <p>纬度：{{ allInfo["latitude"] || "" }}</p>
          </li>
        </ul>
        <p class="no">最后上报时间：{{ allInfo["updateTime"] }}</p>
      </div>
    </div>
  </bm-overlay>
</template>

<script>
import startLight from "./startLight";
import endLight from "./endLight";
// import partTitle from "../../../../components/commonTitle";

import BmOverlay from "vue-baidu-map/components/overlays/Overlay";
export default {
  props: ["status", "position", "active", "allInfo", "index"],
  components: {
    startLight,
    // partTitle,
    endLight,
    BmOverlay
  },
  watch: {
    position: {
      handler() {
        this.$refs.customOverlay.reload();
      },
      deep: true
    }
  },
  data() {
    return {
      show: false,
      title1: "环境指标",
      title2: "智能照明策略"
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
      this.$emit("getDetail", this.allInfo);
      this.show = !this.show;
      this.show
        ? (this.timer = setTimeout(() => {
            this.show = false;
          }, 10000))
        : null;
    },
    draw({ el, BMap, map }) {
      const { lng, lat } = this.position;
      const pixel = map.pointToOverlayPixel(new BMap.Point(lng, lat));
      el.style.left = pixel.x - 0 + "px";
      el.style.top = pixel.y - 0 + "px";
    }
  }
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
    padding: 20px;
    white-space: nowrap;
    .no {
      .textNormal();
      line-height: 17px;
    }
    .info-status {
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
      .adress-li {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }

  .disPlayNone {
    display: none;
  }
}
</style>
