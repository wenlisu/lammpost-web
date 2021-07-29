<template>
  <div>
    <ul class="node">
      <li>
        <i>
          <img src="../images/led-on.png" alt="" />
        </i>
        <p>开启</p>
      </li>
      <li>
        <i>
          <img src="../images/led-off.png" alt="" />
        </i>
        <p>关闭</p>
      </li>
    </ul>
   <!--  <div class="center_bg">
      <partTitle :title="title" />
      <div ref="centerLine" class="centerLine"></div>
    </div> -->
  </div>
</template>

<script>
import partTitle from "../../components/commonTitle";
import * as echarts from "echarts"; // 引入echarts
export default {
  data() {
    return {
      title: "LED",
      centerLine: null
    };
  },
  mounted() {
    this.$nextTick(() => {
      // this.handleInitLine();
    });
  },
  components: {
    partTitle
  },
  methods: {
    handleInitLine() {
      this.centerLine = this.$echarts.init(this.$refs.centerLine, "chalk");
      let option = {
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: [
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
              "10",
              "11",
              "12"
            ],
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,0.18)"
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: "#91A3CE", //更改坐标轴文字颜色
                fontSize: 14 //更改坐标轴文字大小
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              show: true,
              textStyle: {
                color: "#91A3CE", //更改坐标轴文字颜色
                fontSize: 14 //更改坐标轴文字大小
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ["rgba(255,255,255,0.18)"],
                width: 1,
                type: "solid"
              }
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#91A3CE"
              }
            }
          }
        ],
        series: [
          {
            name: "",
            type: "bar",
            barWidth: 10,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "#A9BFFF" // 0% 处的颜色
                    },
                    {
                      offset: 0.04,
                      color: "rgba(58,72,255,1)"
                    },
                    {
                      offset: 1,
                      color: "rgba(173,133,241,0)" // 100% 处的颜色
                    }
                  ],
                  false
                )
              }
            },
            data: [10, 52, 200, 334, 390, 330, 220, 324, 654, 245, 123, 754]
          }
        ]
      };
      this.centerLine.setOption(option);
      window.addEventListener("resize", () => this.centerLine.resize(), false);
    }
  }
};
</script>

<style lang="less" scoped>
.node {
  position: absolute;
  bottom: 20px;
  left: 60%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  li {
    display: flex;
    align-items: center;
    margin-right: 20px;
    i {
      display: inline-block;
      width: 32px;
      height: 31px;
      margin-right: 10px;
      img {
        max-width: 100%;
      }
    }
    p {
      font-size: 14px;
      font-family: PingFangSC;
      font-weight: 400;
      text-align: left;
      color: #ffffff;
      line-height: 20px;
      letter-spacing: 0px;
    }
  }
}
.center_bg {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  // width: calc(100% - 1180px);
  width: 820px;
  height: 250px;
  padding: 20px;
  background: url("../images/c_bg.png") center center no-repeat;
  background-size: 100% 100%;
  .centerLine {
    width: 100%;
    height: 180px;
  }
}
</style>