<template>
  <div id="bigDaLi">
      <bigScreen>
          <template v-slot:center>
            <div class="c_item_2_title">大理州智慧灯杆布点图</div>
            <div id="c_char_dali"></div>
          </template>
      </bigScreen>
  </div>
</template>

<script>
import * as echarts from 'echarts'; // 引入echarts
import bigScreen from './index';
let dalizhou = require('common/js/map/dalizhou.json');
export default {
  data () {
    return {
    };
  },
  components: {
    bigScreen
  },
  mounted () {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    init () {
      var that = this;
      var cityName = '大理';
      var dom4 = document.getElementById('c_char_dali');
      var myChart = echarts.init(dom4);
      var data = [];
      var option = null;
      let offset = {
        三沙市: {
          left: 110,
          top: 18,
          width: 0.5
        }
      };
      echarts.registerMap(cityName, dalizhou, cityName === '海南' ? offset : {}); // 导入地图数据
      let img1 =
        'data:image/png;base64,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';
      let img2 =
        'data:image/png;base64,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';
      let img11 =
        'path://M8.57,3a2.57,2.57,0,0,1,2.57,2.57V186.15a2.57,2.57,0,0,1-5.14,0V5.57A2.57,2.57,0,0,1,8.57,3Z';
      var gdDatas = [{
        area: '祥云县',
        city: '大理市',
        counts: '125'
      }];
      let mapData = dalizhou.features;
      let geoData = [];
      let gdGeoCoordMap = {};
      mapData.map(item => {
        gdGeoCoordMap[item.properties.name] = item.geometry.coordinates[0][0][0];
      });
      var convertData = function (data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
          var geoCoord = gdGeoCoordMap[data[i].city];
          if (geoCoord) {
            res.push({
              name: data[i].city,
              value: geoCoord.concat(Number(data[i].counts))
            });
          }
        }
        return res;
      };

      option = {
        // visualMap: {
        //   type: 'continuous',
        //   show: false,
        //   min: 10,
        //   max: 100,
        //   text: ['高', '低'], // 文本，默认为数值文本
        //   calculable: true,
        //   textStyle: {
        //     color: '#000',
        //     fontSize: 40
        //   },
        //   inRange: {
        //     /* 低-高 */
        //     color: ['#40F4E3', '#893392']
        //   }
        // },
        visualMap: {
          show: false,
          min: 0,
          // max: 220,
          text: ['高', '低'], // 文本，默认为数值文本
          calculable: true,
          inRange: {
            /* 低-高 */
            color: ['#40f4e3']
            // color: ['#40F4E3', '#893392']
          }
        },
        grid: {
          height: '100%',
          width: '100%'
        },
        geo: {
          map: cityName,
          aspectScale: 1,
          label: {
            show: true,
            fontSize: 10,
            color: 'rgba(131,221,253,.6)'
          },
          layoutCenter: ['48%', '48%'],
          layoutSize: '100%',

          roam: false,
          zoom: 1,
          itemStyle: {
            borderColor: '#009CEB',
            borderWidth: 2,
            areaColor: '#004B90',
            emphasis: {
              areaColor: '#243988 '
            }
          },
          emphasis: {
            label: {
              show: false,
              color: '#83DDFD'
            }
          },
          zlevel: 3
        },
        series: [
          {
            name: cityName,
            type: 'map',
            aspectScale: 1,
            zoom: 0.6,
            layoutCenter: ['50%', '50%'],
            layoutSize: '100%',
            mapType: cityName,
            label: {
              show: false
            },
            itemStyle: {
              areaColor: {
                type: 'radial',
                x: 0.5,
                y: 0.5,
                r: 0.8,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(0,75,144, 0)' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: 'rgba(0,75,144, .7)' // 100% 处的颜色
                  }
                ],
                globalCoord: false // 缺省为 false
              },
              shadowColor: '#243988',
              shadowBlur: 0,
              borderWidth: 0
            },
            emphasis: {
              itemStyle: {
                areaColor: {
                  type: 'radial',
                  x: 0.5,
                  y: 0.5,
                  r: 0.8,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(0,75,144, 0)' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: 'rgba(0,75,144, .7)' // 100% 处的颜色
                    }
                  ],
                  globalCoord: false // 缺省为 false
                }
              },
              label: {
                show: false
              }
            },
            zlevel: 0
            //  data: gdDatas
          },
          {
            type: 'effectScatter',
            coordinateSystem: 'geo',
            zlevel: 3,
            rippleEffect: {
              // 涟漪特效
              period: 4, // 动画时间，值越小速度越快
              brushType: 'stroke', // 波纹绘制方式 stroke, fill
              scale: 4 // 波纹圆环最大限制，值越大波纹越大
            },
            label: {
              normal: {
                show: true,
                position: 'bottom', // 显示位置
                // offset: [15, 0], // 偏移设置
                formatter: function (params) {
                  // 圆环显示文字
                  return params.data.value[2];
                },
                fontSize: 10,
                color: '#fff'
              },
              emphasis: {
                show: true
              }
            },
            symbol: 'circle',
            symbolSize: function (val) {
              // console.log(val);
              return 15 + val[2] * 0; // 圆环大小
            },
            itemStyle: {
              normal: {
                show: false
              }
            },
            data: convertData(
              gdDatas
                .sort(function (a, b) {
                  return Number(b.counts) - Number(a.counts);
                })
                .slice(0, 6)
            )
          },
          // 最多
          // {
          //   type: 'custom',
          //   coordinateSystem: 'geo',
          //   zlevel: 3,
          //   renderItem: function (params, api) { // 具体实现自定义图标的方法
          //     console.log(params, api);
          //     let item = convertData(
          //       gdDatas
          //         .sort(function (a, b) {
          //           return Number(b.counts) - Number(a.counts);
          //         })
          //         .slice(0, 6)
          //     )
          //     // console.log();
          //     // debugger
          //     return {
          //       type: 'path',
          //       style: {
          //         path: img11,
          //         // x: api.coord([item[0].value[0], item[0].value[0]]),
          //         // y: api.coord([item[0].value[1], item[0].value[1]])
          //       }
          //     }
          //   },
          //   // rippleEffect: {
          //   //   period: 4,
          //   //   brushType: 'stroke',
          //   //   scale: 4
          //   // },
          //   // label: {
          //   //   normal: {
          //   //     show: false
          //   //   },
          //   //   emphasis: {
          //   //     show: false
          //   //   }
          //   // },
          //   // symbol: img11,
          //   // symbolSize: [50, 100],
          //   // symbolKeepAspect: true,
          //   // symbolOffset: [0, '-30%'],
          //   data: convertData(
          //     gdDatas
          //       .sort(function (a, b) {
          //         return Number(b.counts) - Number(a.counts);
          //       })
          //       .slice(0, 6)
          //   )
          // }
          {
            type: 'scatter',
            coordinateSystem: 'geo',
            zlevel: 3,
            rippleEffect: {
              period: 4,
              brushType: 'stroke',
              scale: 4
            },
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            symbol: 'pin',
            // symbol: 'image://common/images/bigscreen/line.svg',
            symbolSize: 30,
            symbolKeepAspect: true,
            symbolOffset: [0, '-30%'],
            data: convertData(
              gdDatas
                .sort(function (a, b) {
                  return Number(b.counts) - Number(a.counts);
                })
                .slice(0, 6)
            )
          }
        ]
      };
      // 画图
      if (option && typeof option === 'object') {
        myChart.setOption(option, true);
      }
      //   myChart.on("click", params => {
      //     that.toList(params.data);
      //   });
    }
  }
};
</script>

<style lang="less">
#bigDaLi{
    #c_char_dali {
        min-height: 420px;
    }
}
</style>
