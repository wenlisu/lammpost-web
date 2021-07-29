<template>
  <div class="rightTable">
    <partTitle :title="title" />
    <div ref="rightLine" class="rightLine"></div>
    <div class="pieBox">
      <partTitle :title="bottomTitle" />
      <div ref="pieChart" class="pieChart"></div>
    </div>
  </div>
</template>

<script>
import partTitle from "../../components/commonTitle";
import * as echarts from "echarts"; // 引入echarts
import {
  getLampUsageRateList,
  getLampAreaCountStatisticsList,
} from "@/api/wisdomLightPole";

export default {
  data() {
    return {
      title: "照明灯使用率",
      bottomTitle: "各地区灯杆分布统计",
      rightLine: null,
      pieChart: null,
    };
  },
  components: {
    partTitle,
  },
  mounted() {
    this.$nextTick(() => {
      this.handleInitLine();
      this.handleInitPie();
    });
  },
  methods: {
    getLineData() {
      return getLampUsageRateList({ dateInterval: 1 }).then((res) => {
        if (res.code === "200") {
          const { data } = res;
          return data;
        }
      });
    },
    async handleInitLine() {
      this.rightLine = this.$echarts.init(this.$refs.rightLine, "chalk");
      let result = await this.getLineData();
      // closeRate (string, optional): 关灯率 ,
      // count (integer, optional),
      // offlineRate (string, optional): 离线率 ,
      // onlineCount (integer, optional),
      // onlineRate (string, optional): 在线率 ,
      // openCount (integer, optional),
      // openRate (string, optional): 亮灯率 ,
      // timeAxis (string, optional): 时间轴
      let allData = {
        time: [],
        value1: [],
        value2: [],
      };
      if (result && result.length) {
        result.map((item) => {
          allData.time.push(item.timeAxis);
          allData.value1.push(Number(item.openRate));
          allData.value2.push(Number(item.offlineRate));
        });
      } else {
        // 测试数据
        allData.time = [
          "2021-01",
          "2021-02",
          "2021-03",
          "2021-04",
          "2021-05",
          "2021-06",
        ];
        allData.value1 = [120, 132, 101, 134, 90, 230];
        allData.value2 = [220, 182, 191, 234, 290, 330];
      }
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        legend: {
          data: ["亮灯率", "离线率"],
          bottom: 0,
          itemWidth: 10,
          itemHeight: 4,
          icon: "react",
          textStyle: {
            color: "#FFFFFF",
            fontSize: 14,
            fontWeight: 400,
            fontFamily: "PingFangSC",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "8%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: true,
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,0.18)",
              },
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: "#91A3CE", //更改坐标轴文字颜色
                fontSize: 14, //更改坐标轴文字大小
              },
            },
            data: allData.time,
          },
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              show: true,
              textStyle: {
                color: "#91A3CE", //更改坐标轴文字颜色
                fontSize: 14, //更改坐标轴文字大小
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ["rgba(255,255,255,0.18)"],
                width: 1,
                type: "solid",
              },
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#91A3CE",
              },
            },
          },
        ],
        series: [
          {
            symbol: "none",
            name: "亮灯率",
            type: "line",
            itemStyle: {
              normal: {
                color: "#29FFAA",
                lineStyle: {
                  color: "#29FFAA", //改变折线颜色
                },
              },
            },
            data: [...allData.value1],
          },
          {
            symbol: "none",
            name: "离线率",
            type: "line",
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(0,109,187,0.34)", // 0% 处的颜色
                  },
                  {
                    offset: 0.89,
                    color: "rgba(70,147,248,0)", // 100% 处的颜色
                  },
                ],
              },
            },
            itemStyle: {
              normal: {
                color: "#03AAFF",
                lineStyle: {
                  color: "#03AAFF", //改变折线颜色
                },
              },
            },
            data: [...allData.value2],
          },
        ],
      };
      this.rightLine.setOption(option);
      window.addEventListener("resize", () => this.rightLine.resize(), false);
    },
    getPieData() {
      return getLampAreaCountStatisticsList({ dateInterval: 1 }).then((res) => {
        if (res.code === "200") {
          const { data } = res;
          return data;
        }
      });
    },
    async handleInitPie() {
      this.pieChart = this.$echarts.init(this.$refs.pieChart, "chalk");
      let result = await this.getPieData();
      // areaId (string, optional): 地区id ,
      // areaName (string, optional): 地区名称 ,
      // areaRate (number, optional): 地区占比率 ,
      // areaRateText (string, optional): 地区占比率
      let allData = [];
      if (result && result.length) {
        allData = result.map((item) => {
          return {
            name: item.areaName,
            value: item.areaRate,
          };
        });
      } else {
        // 测试假数据
        allData = [
          { value: 335, name: "天河区" },
          { value: 310, name: "白云区" },
          { value: 234, name: "越秀区" },
          { value: 135, name: "黄浦区" },
          { value: 1548, name: "番禺区" },
        ];
      }
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          itemWidth: 10,
          itemHeight: 10,
          icon: "circle",
          orient: "vertical",
          left: "75%",
          top: "40%",
          textStyle: {
            color: "#91A3CE",
            fontFamily: "PingFangSC",
            fontWeight: 400,
            fontSize: 12,
          },
          data: allData.map(e => e.name),
        },
        series: [
          {
            name: "分布统计",
            type: "pie",
            center: ["50%", "55%"],
            radius: ["46%", "60%"],
            avoidLabelOverlap: false,
            color: ["#5B80F9", "#FF794D", "#F6ED1D", "#26FAB4", "#03FBEF"],
            label: {
              show: false,
              position: "center",
            },
            labelLine: {
              show: false,
            },
            data: allData,
          },
        ],
      };
      this.pieChart.setOption(option);
      window.addEventListener("resize", () => this.pieChart.resize(), false);
    },
  },
};
</script>

<style lang="less" scoped>
.rightTable {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 500px;
  height: calc(100% - 10px);
  background: url("../images/right_bg.png") center center no-repeat;
  background-size: 100% 100%;
  padding: 0 20px;
  padding-top: 60px;
  z-index: 11;
  .rightLine {
    width: 100%;
    height: 300px;
  }
  .pieBox {
    margin-top: 25px;
    .pieChart {
      width: 100%;
      height: 300px;
    }
  }
}
</style>