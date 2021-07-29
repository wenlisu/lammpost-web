<template>
  <!-- 照明灯亮度 -->
  <div class="com-container">
    <div class="com-chart" ref="lamp_brightness"></div>
  </div>
</template>

<script>
import layer from "../../images/Layer_4.png";
import { getLocal } from "util/tool";
export default {
  data() {
    return {
      chartInstance: "",
      allData: [],
      pieItem: [],
    };
  },
  mounted() {
    this.initChart();
    this.getData();
    window.addEventListener("resize", this.sreenAdapter);
    this.sreenAdapter();
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(
        this.$refs.lamp_brightness,
        "chalk"
      );
      const initOption = {
        backgroundColor: "transparent",
        grid: {
          bottom: '10%',
        },
        graphic: {
          elements: [
            {
              type: "image",
              z: 3,
              style: {
                image: layer,
                width: 46,
                height: 105,
              },
              left: "center",
              top: "center",
              position: [100, 100],
            },
          ],
        },
        tooltip: {
          show: true,
        },
        legend: {
          icon: "path://M6,0 C9.3137085,0 12,2.6862915 12,6 C12,9.3137085 9.3137085,12 6,12 C2.6862915,12 0,9.3137085 0,6 C0,2.6862915 2.6862915,0 6,0 Z M6,3 C4.34314575,3 3,4.34314575 3,6 C3,7.65685425 4.34314575,9 6,9 C7.65685425,9 9,7.65685425 9,6 C9,4.34314575 7.65685425,3 6,3 Z",
          orient: "horizontal",
          // x: 'left',
          data: ["高", "节能", "中"],
          bottom: "0",
          align: "left",
          textStyle: {
            color: "#fff",
          },
          itemGap: 80,
          // padding: [0, 5, 5, 5],
        },
        toolbox: {
          show: false,
        },
      };
      this.chartInstance.setOption(initOption);
    },
    getData() {
      let energyData =
        getLocal("bigScreenNew")["lampLight"]["lampStaticsLightDto"];
      let total;
      if (energyData && energyData[0]) {
        // total = energyData.reduce((pre, curr) => {
        //   return pre + curr
        // })
        total =
          energyData[0]["level3Scale"] +
          energyData[0]["level1Scale"] +
          energyData[0]["level2Scale"];
      } else {
        return;
      }
      this.pieItem = [
        {
          name: "高",
          value: Math.floor((energyData[0]["level3Scale"] / total) * 100),
        },
        {
          name: "节能",
          value: Math.floor((energyData[0]["level1Scale"] / total) * 100),
        },
        {
          name: "中",
          value: Math.floor((energyData[0]["level2Scale"] / total) * 100),
        },
      ];
      var color = [
        {
          c1: "#FFF2C9",
          c2: "#FF4038",
        },
        {
          c1: "#69B5FF",
          c2: "#38DDFF",
        },
        {
          c1: "#69FFFE",
          c2: "#10AA7F",
        },
      ];
      for (var i = 0; i < this.pieItem.length; i++) {
        this.allData.push(
          {
            value: this.pieItem[i].value,
            name: this.pieItem[i].name,
            itemStyle: {
              normal: {
                borderWidth: 10,
                borderRadius: "50%",
                borderColor: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: color[i]["c1"], // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: color[i]["c2"], // 100% 处的颜色
                    },
                  ],
                  global: false, // 缺省为 false
                },
                // shadowColor: color[i],
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: color[i]["c1"], // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: color[i]["c2"], // 100% 处的颜色
                    },
                  ],
                  global: false, // 缺省为 false
                },
              },
            },
          },
          {
            value: 2,
            name: "",
            itemStyle: {
              normal: {
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
                color: "rgba(0, 0, 0, 0)",
                borderColor: "rgba(0, 0, 0, 0)",
                borderWidth: 0,
              },
            },
          }
        );
      }
      this.upDataChart();
    },
    upDataChart() {
      let that = this;
      const pieItem = [...this.pieItem];
      const dataOption = {
        legend: {
          formatter: function (name) {
            // let res = that.pieItem.filter(v => v.name == name);
            // return (
            //   "{percent|" +
            //   res.value +
            //   "}{unit| %}\n" +
            //   res.name 
            // );
            return (
              "{title|" +
              name +
              "}\n{value|" +
              that.pieItem.find((item) => {
                return item.name == name;
              }).value +
              "}{value|%}"
            );
          },
          textStyle: {
            lineHeight: 30,
            rich: {
              title: {
                fontSize: 14,
                color: "#fff",
              },
              value: {
                fontSize: 22,
                fontWeight: "bold",
                color: "#fff",
                lineHeight: 22,
              },
            },
          },
        },
        series: [
          {
            name: "",
            type: "pie",
            clockWise: false,
            radius: [75, 78],
            hoverAnimation: false,
            itemStyle: {
              normal: {
                label: {
                  show: false,
                  position: "outside",
                  color: "#ddd",
                  formatter: function (params) {
                    var percent = 0;
                    var total = 0;
                    for (var i = 0; i < pieItem.length; i++) {
                      total += pieItem[i].value;
                    }
                    percent = ((params.value / total) * 100).toFixed(0);
                    if (params.name !== "") {
                      return params.name + "：" + percent + "%";
                    } else {
                      return "";
                    }
                  },
                },
                labelLine: {
                  length: 30,
                  length2: 50,
                  show: true,
                  color: "#00ffff",
                },
              },
            },
            data: this.allData,
            roundCap: true,
          },
          // 边框的设置
          {
            name: "外边框",
            type: "pie",
            clockWise: false, //顺时加载
            hoverAnimation: false, //鼠标移入变大
            center: ["50%", "50%"],
            radius: ["60%", "60%"],
            label: {
              normal: {
                show: false,
              },
            },
            data: [
              {
                value: 5,
                name: "",
                itemStyle: {
                  normal: {
                    borderWidth: 1,
                    borderColor: {
                      type: "linear",
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [
                        {
                          offset: 0,
                          color: "rgba(105,233,255,0.29)", // 0% 处的颜色
                        },
                        {
                          offset: 0.7,
                          color: "rgba(56,207,255,0.00)", // 100% 处的颜色
                        },
                      ],
                      global: false, // 缺省为 false
                    },
                  },
                },
              },
            ],
          },
          {
            name: "外边框",
            type: "pie",
            clockWise: false, //顺时加载
            hoverAnimation: false, //鼠标移入变大
            center: ["50%", "50%"],
            radius: ["65%", "65%"],
            label: {
              normal: {
                show: false,
              },
            },
            data: [
              {
                value: 5,
                name: "",
                itemStyle: {
                  normal: {
                    borderWidth: 1,
                    borderColor: {
                      type: "linear",
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [
                        {
                          offset: 0,
                          color: "rgba(105,233,255,0.29)", // 0% 处的颜色
                        },
                        {
                          offset: 0.5,
                          color: "rgba(56,207,255,0)", // 100% 处的颜色
                        },
                      ],
                      global: false, // 缺省为 false
                    },
                  },
                },
              },
            ],
          },
        ],
      };
      this.chartInstance.setOption(dataOption);
    },
    sreenAdapter() {
      const adapterOption = {};
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
  },
};
</script>

<style>
</style>