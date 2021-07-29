<template>
  <bm-overlay
    ref="customOverlay"
    :class="{ sample: true, active }"
    pane="labelPane"
    @draw="draw"
  >
    <div v-if="status" @click="handleClick">
      <layer />
    </div>
    <div v-if="!status" @click="handleClick">
      <alarmLayer />
    </div>
    <div class="info-layer" v-if="show">
      <div class="header">
        <img src="../../images/address.png" alt="" />
        <div class="detai">
          <p class="name">{{allInfo && allInfo.deviceName}}</p>
          <p class="addr">{{allInfo && allInfo.address}}</p>
        </div>
      </div>
      <div class="content">
        <el-row :gutter="10">
          <el-col :span="24">
            <span>编号：{{allInfo && allInfo.imei}}</span>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <span>经度：{{position && position.lng}}</span>
          </el-col>
          <el-col :span="12">
            <span>纬度：{{position && position.lat}}</span>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <p>最后上报时间：{{allInfo && allInfo.lastReportDate}}</p>
          </el-col>
        </el-row>
        <div class="indicators">
          <commonTitle title="环境指标" />
          <div class="indicators-table">
            <IndicatorsTable :tableData="allInfo" :status="status"></IndicatorsTable>
          </div>
        </div>
      </div>
    </div>
  </bm-overlay>
</template>

<script>
import layer from "./layer.vue";
import alarmLayer from "./alarmLayer.vue";
import commonTitle from "../../../components/commonTitle";
import IndicatorsTable from "../infoTable/table.vue";

import BmOverlay from 'vue-baidu-map/components/overlays/Overlay'
export default {
  props: {
    status: {
      typeof: Number,
      default: () => {
        return 0;
      }
    },
        position: {
      typeof: Object,
      default: () => {
        return {};
      }
    },
         active: {
      typeof: Boolean,
      default: () => {
        return false;
      }
    },
        allInfo: {
      typeof: Object,
      default: {}
    },
    index: {
      typeof: Number,
      default: () => {
        return 0;
      }
    }
  },
  components: {
    layer,
    alarmLayer,
    commonTitle,
    IndicatorsTable,
    BmOverlay
  },
  watch: {
    position: {
      handler(val) {
        this.$refs.customOverlay.reload();
      },
      deep: true
    },
    allInfo: {
      handler(val, old) {
        if (val !== old) {
          // this.$refs.customOverlay.reload();
        }
      },
      deep: true
    }
  },
  data() {
    return {
      show: false
    };
  },
  mounted() {
    this.$nextTick(() => {
        // console.log('position', this.position);
    })
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
    }
  }
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
  // width: 303px;
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
    /* background: linear-gradient(
      270deg,
      rgba(32, 45, 85, 0.2),
      #94562c 85%,
      rgba(148, 78, 44, 0.31)
    ); */
    background: linear-gradient(
      270deg,
      rgba(32, 45, 85, 0.2),
      rgba(40, 222, 255, 0.47) 85%,
      rgba(40, 222, 255, 0.25)
    );
    img {
      width: 36px;
      height: 35px;
      margin-right: 6px;
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
    padding: 20px;
    .el-row {
      margin-bottom: 10px;
      span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      p {
        display: flex;
      }
      .status {
        display: inline-block;
        // width: 36px;
        // height: 17px;
        padding: 2px 6px;/*no*/
        font-size: 12px;
        background: #14c5a0;
        border-radius: 4px;
        text-align: center;
        &.alarm {
          background: #e4582f;
        }
      }
    }
  }
  .indicators {
    .indicators-table {
      width: 100%;
    }
    /deep/.common-box {
      padding-top: 2px;
      padding-bottom: 4px;
      padding-left: 10px;
      .txt {
        font-size: 14px;
        font-family: PingFangSC, PingFangSC-Semibold;
      }
    }
  }
}
</style>