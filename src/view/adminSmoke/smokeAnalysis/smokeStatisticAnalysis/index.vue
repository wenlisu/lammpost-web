<template>
  <div id="smokeStatisticAnalysis">
      <div class="flexCloumn item detectData">
          <span class="title">
              烟感探测数据
          </span>
          <div class="flexRow content">
              <div
                class="flexRow contentItem"
                v-for="item in detectData.items"
                :key="item.id"
                :class="item.class"
              >
                  <div class="flexCenter icon" :style="item.iconStyle">
                      <i :class="`iconfont icon-${item.icon}`" />
                  </div>
                  <div class="flexCloumn info">
                      <span class="infoTitle">{{item.title}}</span>
                      <span class="infoValue">{{item.value}}{{item.unit}}</span>
                  </div>
              </div>
          </div>
      </div>
      <el-row :gutter="10" class="chart">
          <el-col :span="10">
              <div class="content">
                <div class="flexCloumn item distributionData">
                    <span class="title">
                        2020年火灾发生场所分布
                    </span>
                    <div id="distributionData" />
                </div>
                    <div class="flexCloumn item concentrationData">
                    <span class="title">
                        今日烟雾浓度TOP10设备
                    </span>
                    <div class="listItmes">
                        <div
                            class="flexRow listItem"
                            v-for="(item, index) in [1, 2, 3, 4, 5, 6, 7, 8, 9]"
                            :key="item"
                            :class="{
                                'top': index < 3
                            }"
                        >
                            <div class="flexCenter index">
                                {{index + 1}}
                            </div>
                            <div class="flexCloumn info">
                                <div class="flexRow infoDetail">
                                    <span>烟感设备</span>
                                    <span>1456</span>
                                </div>
                                <div class="infoProgress">
                                    <span :style="{ width: `${40}%`}"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
          </el-col>
          <el-col :span="14">
              <div class="content">
                  <div class="flexCloumn item deviceDistribution">
                    <span class="title">
                        各个区域设备分布
                    </span>
                    <div class="flexRow listItems">
                      <div class="tion1">
                          <div class="info">
                              <div class="value">26774</div>
                              <div class="title">烟感数</div>
                          </div>
                          <div id="tion1" class="tionChart"/>
                            <div class="area">A区</div>
                      </div>
                        <div class="tion2">
                            <div class="info">
                              <div class="value">26774</div>
                              <div class="title">烟感数</div>
                          </div>
                          <div id="tion2" class="tionChart"/>
                            <div class="area">B区</div>
                      </div>
                    <div class="tion3">
                        <div class="info">
                              <div class="value">26774</div>
                              <div class="title">烟感数</div>
                          </div>
                          <div id="tion3" class="tionChart"/>
                            <div class="area">C区</div>

                      </div>
                    <div class="tion4">
                         <div class="info">
                              <div class="value">26774</div>
                              <div class="title">烟感数</div>
                          </div>
                          <div id="tion4" class="tionChart"/>
                            <div class="area">D区</div>
                      </div>
                    </div>
                    <div class="flexRow labers">
                        <labers
                            location="right"
                            :items="[{
                                color: '#4AD3AB',
                                name: '在线'
                            }, {
                                color: '#FA4949',
                                name: '故障'
                            }, {
                                color: '#FFAE49',
                                name: '报警'
                            }, {
                                color: '#6746E1',
                                name: '预警'
                            }]"
                        />
                    </div>
                  </div>
              </div>
          </el-col>
      </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'; // 引入echarts
import 'echarts-liquidfill';
import labers from '@/components/labers';
export default {
  data () {
    return {
      detectData: {
        items: [{
          id: 'a',
          icon: 'yanwu',
          title: '烟雾',
          value: '',
          iconStyle: 'background: linear-gradient(320deg, #25D3FF 0%, #3FBAF2 100%);',
          unit: ''
        }, {
          id: 'b',
          icon: 'wendu',
          title: '温度',
          value: '',
          iconStyle: 'background: linear-gradient(320deg, #FF8364 0%, #FF6433 100%);',
          unit: '℃'
        }, {
          id: 'c',
          icon: 'shidu',
          title: '湿度',
          value: '',
          iconStyle: 'background: linear-gradient(320deg, #25EBA2 0%, #2FC19A 100%);',
          unit: '% '
        }, {
          id: 'd',
          icon: 'baojing1',
          title: '报警状态',
          value: '正常',
          iconStyle: 'background: linear-gradient(138deg, #FB841A 0%, #FDB638 100%);',
          unit: ''
        }]
      }
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.distributionData();
      [document.getElementById('tion1'), document.getElementById('tion2'), document.getElementById('tion3'), document.getElementById('tion4')].map(dom => {
        this.deviceDistribution(dom);
      });
    });
  },
  components: {
    labers
  },
  methods: {
    distributionData () {
      var dom_1 = document.getElementById('distributionData');
      var myChart = echarts.init(dom_1);
      var option = null;
      let color = [
        '#FF9023',
        '#4CDC9F',
        '#7F00C0',
        '#0F72FF',
        '#C00000',
        '#4AEAB0'
      ];
      const data = {
        c1: 1,
        c2: 2,
        c3: 3,
        c4: 4,
        c5: 5,
        c6: 6,
        c7: 7
      };
      let dataJson = [
        {
          name: '住宅',
          value: `${data.c1}`,
          itemStyle: {
            normal: {
              color: '#FA4949'
            }
          }
        },
        {
          name: '交通工具',
          value: `${data.c2}`,
          itemStyle: {
            normal: {
              color: '#FFAE49'
            }
          }
        },
        {
          name: '人员密集场所',
          value: `${data.c3}`,
          itemStyle: {
            normal: {
              color: '#3ACFA3'
            }
          }
        },
        {
          name: '工地厂房',
          value: `${data.c4}`,
          itemStyle: {
            normal: {
              color: '#73ADFA'
            }
          }
        },
        {
          name: '农副场所',
          value: `${data.c5}`,
          itemStyle: {
            normal: {
              color: '#D172F4'
            }
          }
        },
        {
          name: '垃圾弃物',
          value: `${data.c6}`,
          itemStyle: {
            normal: {
              color: '#87DE33'
            }
          }
        },
        {
          name: '其他场所',
          value: `${data.c7}`,
          itemStyle: {
            normal: {
              color: '#FFDD4A'
            }
          }
        }
      ];
      option = {
        // color: color,
        graphic: {
          elements: [
          ]
        },
        legend: {
          orient: 'horizontal',
          itemWidth: 10,
          itemHeight: 10,
          bottom: 0,
          right: 'auto',
          borderRadius: 0,
          textStyle: {
            color: '#555555',
            fontSize: 12
          },
          data: [{
            name: '住宅',
            icon: 'rect'
          }, {
            name: '交通工具',
            icon: 'rect'
          }, {
            name: '人员密集场所',
            icon: 'rect'
          }, {
            name: '工地厂房',
            icon: 'rect'
          }, {
            name: '农副场所',
            icon: 'rect'
          }, {
            name: '垃圾弃物',
            icon: 'rect'
          }, {
            name: '其他场所',
            icon: 'rect'
          }]
        },
        series: [
          {
            type: 'pie',
            top: 50,
            bottom: 40,
            left: 'center',
            radius: '90%',
            data: dataJson,
            label: {
              // show: false
              formatter: '{c}, {d}%',
              backgroundColor: 'rgba(14, 14, 14, 0.48)',
              padding: [6, 5],
              color: '#fff'
            },
            labelLine: {
              lineStyle: {
                color: 'rgba(14, 14, 14, 0.48)',
                length2: 0,
                borderRadius: 4
              }
            }
          }
        ]
      };
      myChart.setOption(option, true);
      window.onresize = function () {
        myChart.resize();
      };
    },
    getbutionOption (data) {
      return {
        dataJson: [
          {
            name: '在线',
            value: `${data.onlineCount}`,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                  offset: 0,
                  color: '#C2FFAA'
                }, {
                  offset: 1,
                  color: '#42EA9B'
                }])
              }
            }
          },
          {
            name: '故障',
            value: `${data.faultCount}`,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                  offset: 0,
                  color: '#FF8965'
                }, {
                  offset: 1,
                  color: '#FF4141'
                }])
              }
            }
          },
          {
            name: '报警',
            value: `${data.alarmCount}`,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                  offset: 0,
                  color: '#FFB946'
                }, {
                  offset: 1,
                  color: '#FF9129'
                }])
              }
            }
          },
          {
            name: '预警',
            value: `${data.offlineCount}`,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                  offset: 0,
                  color: '#5E86FF'
                }, {
                  offset: 1,
                  color: '#6741DF'
                }])
              }
            }
          }
        ],
        legend: {
          show: false,
          orient: 'horizontal',
          itemWidth: 14,
          itemHeight: 10,
          bottom: 0,
          right: 'auto',
          borderRadius: 0,
          textStyle: {
            color: '#fff',
            fontSize: 12
          },
          data: [{
            name: '在线',
            icon: 'rect'
          }, {
            name: '故障',
            icon: 'rect'
          }, {
            name: '报警',
            icon: 'rect'
          }, {
            name: '预警',
            icon: 'rect'
          }]
        },
        series: [{
          type: 'liquidFill',
          center: ['50%', '50%'],
          data: [0.35, 0.35, 0.35], // data个数代表波浪数
          color: ['rgba(211, 236, 255, 0.5)', 'rgba(78, 255, 191, 0.3)'],
          backgroundStyle: {
            borderWidth: 1,
            color: 'rgb(255,255,255,0.1)',
            itemStyle: {
              shadowColor: '#fff'
            }
          },
          itemStyle: {
            shadowBlur: 0
          },
          label: {
            show: false
          },
          outline: {
            show: false
          }
        }, {
          type: 'pie',
          top: 0,
          bottom: 0,
          left: 'center',
          radius: ['75%', '90%'],
          hoverAnimation: false,
          label: {
            show: false,
            formatter: '{c}',
            backgroundColor: 'rgba(14, 14, 14, 0.48)',
            padding: [7, 8],
            color: '#fff'
          },
          labelLine: {
            lineStyle: {
              color: 'rgba(14, 14, 14, 0.48)',
              length2: 0,
              borderRadius: 4
            }
          }
        }]
      }
    },
    async deviceDistribution (dom) {
      const myChart = echarts.init(dom);
      const data = {
        onlineCount: 4,
        faultCount: 4,
        alarmCount: 4,
        offlineCount: 4
      };
      const { dataJson, legend, series } = await this.getbutionOption(data);
      let datajson = dataJson;
      const option = {
        graphic: {
          elements: [
          ]
        },
        legend,
        series: [
          {
            ...series[0]
          },
          {
            ...series[1],
            data: datajson
          }
        ]
      };
      myChart.setOption(option, true);
      window.onresize = function () {
        myChart.resize();
      };
    }
  }
};
</script>

<style lang="less">
#smokeStatisticAnalysis{
    .item{
        padding: 10px 24px;/*no*/
        background: #fff;
        .title {
            font-size: 14px;/*no*/
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #5F5F5F;
        }
    }
    .detectData{
        width: 100%;
        .content{
            width: 100%;
            padding: 24px 0 13px;/*no*/
            .contentItem{
                 flex: 3;
                 border-right: 1px solid #EBEBEB;/*no*/
                 margin-right: 40px;/*no*/
                 .icon{
                    width: 60px;/*no*/
                    height: 57px;/*no*/
                    border-radius: 8px;/*no*/
                    margin-right: 14px;/*no*/
                    i{
                        font-size: 28px;/*no*/
                        color: #fff;
                    }
                 }
                .info{
                    justify-content: space-between;
                    .infoTitle{
                        font-size: 14px;/*no*/
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #5D5D5D;
                    }
                    .infoValue{
                        font-size: 28px;/*no*/
                        font-family: DINAlternate-Bold, DINAlternate;
                        font-weight: bold;
                        color: #FF7A46;
                    }
                }
                &:last-child{
                    flex: 2;
                    border-right: none;
                    margin-right: 0;
                    .info{
                        .infoValue{
                            color: #15A26A;
                        }
                    }
                }
            }
        }
    }
    .chart{
        margin-top: 10px;/*no*/
        height: calc(100% - 140px);/*no*/
        >.el-col{
            height: 100%;
        }
        .content{
            height: 100%;
            width: 100%;
            .distributionData{
                margin-bottom: 10px;/*no*/
                height: calc(50% - 5px);/*no*/
                #distributionData{
                    height: calc(100% - 20px);/*no*/
                }
            }
            .concentrationData{
                height: calc(50% - 5px);/*no*/
                overflow-y: auto;
                &::-webkit-scrollbar-track-piece {
                //滚动条凹槽的颜色，还可以设置边框属性
                background-color: transparent;
                }
                &::-webkit-scrollbar {
                //滚动条的宽度
                width: 3px;/*no*/
                height: 2px;
                border-radius: 3px;/*no*/
                }
                &::-webkit-scrollbar-thumb {
                //滚动条的设置
                background-color: #B6B5B5;
                background-clip: padding-box;
                }
                &::-webkit-scrollbar-thumb:hover {
                background-color: #B6B5B5;
                }
                .listItmes{
                    margin-top: 15px;/*no*/
                    .listItem{
                        margin-bottom: 5px;/*no*/
                        align-items: center;
                        .index{
                            width: 23px;/*no*/
                            height: 23px;/*no*/
                            font-size: 16px;/*no*/
                            font-family: DINAlternate-Bold, DINAlternate;
                            font-weight: bold;
                            color: #3956A4;
                            margin-right: 10px;/*no*/
                        }
                        .info{
                            flex: 1;
                            .infoDetail{
                                font-size: 12px;/*no*/
                                font-family: PingFangSC-Regular, PingFang SC;
                                font-weight: 400;
                                color: #434343;
                                margin-bottom: 3px;/*no*/
                            }
                            .infoProgress{
                                width: 100%;
                                height: 9px;/*no*/
                                background: #F0F0F0;
                                position: relative;
                                span{
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                    bottom: 0;
                                    background: linear-gradient(270deg, #7CC0FF 0%, #65A7FF 100%);
                                }
                            }
                        }
                        &.top{
                            .index{
                                background: #EEFAFF;
                                border: 1px solid #C7E5FF;/*no*/
                                color: #DD3210;
                            }
                            .infoProgress{
                                span{
                                    background: linear-gradient(270deg, #FFB25C 0%, #FF7B2F 100%);
                                }
                            }
                        }
                    }
                }
            }
            .deviceDistribution{
                width: 100%;
                height: 100%;
                .listItems{
                    width: 100%;
                    height: calc(100% - 47px);/*no*/
                    flex-wrap: wrap;
                    >div{
                        width: 50%;
                        height: 40%;
                        background: url(./images/img1.png) no-repeat center;
                        background-size: 55% auto;
                        position: relative;
                        margin-bottom: 10%;/*no*/
                        .area{
                            position: absolute;
                            bottom: -15%;
                            left: 50%;
                            transform: translateX(-50%);
                            font-size: 16px;/*no*/
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: #555555;
                        }
                        .info{
                            display: flex;
                            flex-direction: column;
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            z-index: 11;
                            .value{
                                font-size: 34px;/*no*/
                                font-family: DINAlternate-Bold, DINAlternate;
                                font-weight: bold;
                                color: #2588D3;
                                line-height: 40px;/*no*/
                                margin-bottom: 5px;/*no*/
                            }
                            .title{
                                font-size: 14px;/*no*/
                                font-family: PingFangSC-Regular, PingFang SC;
                                font-weight: 400;
                                color: #434343;
                                line-height: 20px;/*no*/
                                text-align: center;
                            }
                        }
                        >div.tionChart{
                            width: 100%;
                            height: 100%;
                        }
                    }
                }
                .labers{
                    margin-bottom: 10px;/*no*/
                }
            }
        }
    }

}
</style>
