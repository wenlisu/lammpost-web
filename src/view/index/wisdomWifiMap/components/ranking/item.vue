<template>
  <div class="item-box">
    <div class="left">
      <div class="xh">
        <span>{{ index + 1 }}</span>
      </div>
      <p class="wifi-name">{{ item["devName"] || "" }}</p>
    </div>
    <div class="center">
      <div
        class="progress"
        :style="{ width: '100%' }"
        :class="[item.totalFlow == 0 ? 'displayNone' : '']"
      ></div>
      <div
        class="progress"
        :style="{ width: item['upRate'] + '%' }"
        :class="[item.upRate == 0 ? 'displayNone' : '']"
      ></div>
      <div
        class="progress"
        :style="{ width: item['downRate'] + '%' }"
        :class="[item.downRate == 0 ? 'displayNone' : '']"
      ></div>
    </div>
    <div class="right">
      <span class="data">{{ item["totalFlow"] }}</span>
      <span class="data">{{ item["upFlow"] }}</span>
      <span class="data">{{ item["downFlow"] }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {
        return {};
      },
    },
    index: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style lang="less" scoped>
.item-box {
  padding-left: 14px;
  display: flex;
  .left {
    display: flex;
    flex: 1.2;
    align-items: center;
    margin-right: 15px;
    .xh {
      width: 31px;
      height: 35px;
      background-image: url("../../images/xh.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        font-size: 16px;
        font-family: PingFangSC, PingFangSC-Semibold;
        font-weight: 600;
        color: #ffffff;
      }
    }
    .wifi-name {
      margin-left: 10px;
      font-size: 14px;
      font-family: PingFangSC, PingFangSC-Semibold;
      font-weight: 600;
      color: #ffffff;
      line-height: 20px;
      text-shadow: 0px 2px 4px 0px rgba(9, 18, 62, 0.71);
    }
  }
  .center {
    flex: 4;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .progress {
      height: 4px;
      background: linear-gradient(270deg, #1690ff 0%, rgba(39, 73, 132, 0.23));
      position: relative;
      &::after {
        content: "";
        display: inline-block;
        position: absolute;
        right: -8px;
        border: solid;
        border-width: 4px 8px 0 0px;
        border-color: #1690ff transparent transparent transparent;
      }
    }
    .progress:nth-of-type(2) {
      background: linear-gradient(270deg, #16e8ff 0%, rgba(39, 73, 132, 0.23));
      &::after {
        border-color: #16e8ff transparent transparent transparent;
      }
    }
    .progress:nth-of-type(3) {
      background: linear-gradient(270deg, #63e8bb 0%, rgba(39, 73, 132, 0.23));
      &::after {
        border-color: #63e8bb transparent transparent transparent;
      }
    }
    .displayNone {
      visibility: hidden;
    }
  }
  .right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .data {
      color: #6493e5;
      font-size: 12px;
      font-family: DIN, DIN-Regular;
      font-weight: 400;
      text-align: right;
    }
    span:first-of-type {
      color: #ffffff;
    }
  }
}
</style>