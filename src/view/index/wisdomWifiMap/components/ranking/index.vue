<template>
  <div class="traffic-box">
    <commonTitle title="AP流量排名">
      <template>
        <div class="rightSlot">
          <p>
            <i class="dot"></i>
            <span class="txt">全部</span>
          </p>
          <p>
            <i class="dot"></i>
            <span class="txt">上传</span>
          </p>
          <p>
            <i class="dot"></i>
            <span class="txt">下载</span>
          </p>
        </div>
      </template>
    </commonTitle>
    <vueSeamlessScroll
      :class-option="defaultOption"
      :data="apData"
      class="seamless-box"
    >
      <div v-for="(item, index) in apData" :key="index" class="colum">
        <scrollItem :item="item" :index="index" />
      </div>
    </vueSeamlessScroll>
  </div>
</template>

<script>
import scrollItem from "./item";
import commonTitle from "../../../components/commonTitle";
import vueSeamlessScroll from "vue-seamless-scroll";
import { queryWifiFlowRank } from "api/wifi";
export default {
  components: {
    scrollItem,
    commonTitle,
    vueSeamlessScroll,
  },
  computed: {
    defaultOption() {
      return {
        step: 0.2, // 数值越大速度滚动越快
        limitMoveNum: 5, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000, // 单步运动停止的时间(默认值1000ms)
      };
    },
  },
  data() {
    return {
      apData: [],
    };
  },
  created() {
    this._queryWifiFlowRank()
  },
  methods: {
    _queryWifiFlowRank() {
      queryWifiFlowRank({}).then(res => {
        if(res.code == '200') {
          let apData = [...res.data]
          this.apData = apData.map(item => {
            return {
              devName: item.devName,
              downFlow: item.downFlow > 1024 ? (item.downFlow/1024).toFixed(2) + 'M' : item.downFlow + 'kb',
              upFlow: item.upFlow > 1024 ? (item.upFlow/1024).toFixed(2) + 'M' : item.upFlow + 'kb',
              totalFlow: item.totalFlow > 1024 ? (item.totalFlow/1024).toFixed(2) + 'M' : item.totalFlow + 'kb',
              downRate: item.totalFlow > 0 ? Number((item.downFlow/item.totalFlow).toFixed(2)) : 0,
              upRate: item.totalFlow > 0 ? Number((item.upFlow/item.totalFlow).toFixed(2)) : 0,
            }
          })
        }
      })
    }
  }
};
</script>

<style lang="less" scoped>
.traffic-box {
  height: 100%;
  padding-right: 36px;
  /deep/.common-box {
    padding-top: 16px;
    padding-bottom: 16px;
    padding-left: 23px;
    margin-bottom: 16px;
    .txt {
      font-size: 28px;
      font-family: YouSheBiaoTiHei;
    }
  }
  .rightSlot {
    display: flex;
    align-items: flex-end;
    p {
      margin-left: 14px;
    }
    .dot {
      display: inline-block;
      width: 9px;
      height: 9px;
      margin-right: 8px;
      background: #1690ff;
      border-radius: 50%;
    }
    p:nth-of-type(2) .dot {
      background: #15e1f9;
    }
    p:nth-of-type(3) .dot {
      background: #5fdfb6;
    }
    .txt {
      color: #91a3ce;
      font-size: 12px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
    }
  }
}
.seamless-box {
  height: calc(100% - 60px);
  overflow: hidden;
  .colum {
    margin-bottom: 9px;
  }
}
</style>
