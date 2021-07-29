<template>
  <bm-overlay
    ref="customOverlay"
    :class="{ sample: true, active }"
    pane="labelPane"
    @draw="draw"
  >
    <div
      v-if="status"
      @click="
        (e) => {
          this.handleClick(e);
        }
      "
    >
      <on-layer />
    </div>
    <div
      v-if="!status"
      @click="
        (e) => {
          this.handleClick(e);
        }
      "
    >
      <off-layer />
    </div>
    <div class="info-layer" v-if="show">
      <div class="header">
        <div class="img-wrap">
          <img src="../../images/ledimg.png" alt="" />
        </div>
        <div class="detail">
          <p class="name">{{ allInfo.name || "" }}</p>
          <p class="addr">{{ allInfo.installAddress || "fdhfewjfwej" }}</p>
        </div>
      </div>
      <div class="content">
        <el-row :gutter="20">
          <el-col :span="24">
            <span>IME号：{{ allInfo.imei }}</span>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="flex">
              <span>开关状态：</span>
              <span :class="{ status: true, off: !status }">{{
                status ? "开启" : "关闭"
              }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <span>分屏模式：{{ allInfo.imei }}</span>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <span>经度：{{ position.lng }}</span>
          </el-col>
          <el-col :span="12">
            <span>纬度：{{ position.lat }}</span>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <span>最后上报时间：{{ position.lat }}</span>
          </el-col>
        </el-row>
      </div>
    </div>
  </bm-overlay>
</template>

<script>
import onLayer from "./startLight.vue";
import offLayer from "./endLight.vue";

import BmOverlay from "vue-baidu-map/components/overlays/Overlay";
export default {
  props: ["status", "position", "active", "allInfo", "index"],
  components: {
    onLayer,
    offLayer,
    BmOverlay,
  },
  watch: {
    position: {
      handler() {
        this.$refs.customOverlay.reload();
      },
      deep: true,
    },
  },
  data() {
    return {
      show: false,
      timer: null,
    };
  },
  methods: {
    handleClick(e) {
      // let node = {
      //   id: this.allInfo.toiletId,
      //   label: this.allInfo.toiletName,
      //   regionId: this.allInfo.regionId,
      //   index: this.index,
      //   ...this.allInfo
      // }
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

<style scoped lang="less">
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
  // min-width: 300px;
  // height: 165px;
  opacity: 1;
  // background: linear-gradient(270deg, rgba(0, 19, 50, 0.85), #0e274c 100%);
  // border: 1px solid;
  // border-image: linear-gradient(
  //     316deg,
  //     rgba(27, 150, 219, 0.26),
  //     rgba(246, 97, 32, 0.69) 99%
  //   )
  //   1 1;
  // border-radius: 2px;
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
  .header {
    display: flex;
    width: 100%;
    padding: 9px 0 7px 10px;
    background: linear-gradient(
      270deg,
      rgba(32, 45, 85, 0.2),
      rgba(40, 222, 255, 0.47) 85%,
      rgba(40, 222, 255, 0.25)
    );
    .img-wrap {
      width: 35px;
      height: 35px;
      background: rgba(12, 164, 232, 0.31);
      border: 1px solid #39b4e2;
      border-radius: 50%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      margin-right: 6px;
      img {
        width: 26px;
        height: 10px;
      }
    }
    .name {
      font-size: 16px;
      font-family: PangMenZhengDao;
      text-align: left;
      color: #ffffff;
      line-height: 18px;
    }
    .addr {
      font-size: 12px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: left;
      color: #f5f7ff;
      line-height: 17px;
    }
  }
  .content {
    color: #ffffff;
    font-size: 12px;
    padding: 20px 20px 10px 20px;
    // width: 100%;
    display: block;
    .el-row {
      display: flex;
      margin-bottom: 10px;
      .el-col {
        width: 100%;
        display: inline-block;
      }
      span {
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .flex {
        display: flex;
      }
      .status {
        display: inline-block;
        // width: 36px;
        // height: 17px;
        padding: 2px 6px; /*no*/
        font-size: 12px;
        background: #D08719;
        border-radius: 4px;
        text-align: center;
        // margin-left: 4px;
        &.off {
          background: #2CC7FF;
        }
      }
    }
  }
}
</style>