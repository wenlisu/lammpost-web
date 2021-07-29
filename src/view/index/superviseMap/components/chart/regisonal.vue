<template>
  <div class="com-container">
    <div class="com-chart" ref="radio_scenarios">
      <highcharts :options="option" v-if="echartShow"/>
    </div>
  </div>
</template>

<script>
import highcharts from 'highcharts'
import highcharts3d from 'highcharts/highcharts-3d'
import { Chart } from 'highcharts-vue';
import { getLocal } from 'util/tool';
import {
  getAmbientMonitoringInfoAndAlarmOf
} from 'api/screen/newIndex';
highcharts3d(highcharts)
export default {
  data () {
    return {
      chartInstance: '',
      allData: {},
      option: {},
      echartShow: false
    };
  },
  mounted () {
    this.$nextTick(() => {
      getAmbientMonitoringInfoAndAlarmOf().then(res => {
        if (res.code === '200') {
          const data = [
            ['温度上限告警', +(res.data.temperatureAlarmRatio).replace('%', '')],
            ['湿度上限告警', +(res.data.humidityAlarmRatio).replace('%', '')],
            ['噪音上限告警', +(res.data.noiseAlarmRatio).replace('%', '')],
            ['PM2.5上限告警', +(res.data.pmAlarmRatio).replace('%', '')],
            ['PM10上限告警', +(res.data.pmTenAlarmRatio).replace('%', '')]
          ];
          this.initChart(data);
          this.echartShow = true;
        }
      })
    })
  },
  components: {
    highcharts: Chart
  },
  methods: {
    initChart (data) {
      // let scenData = getLocal("bigScreenNew")["audioScene"];
      // let seriesData = [];
      // let sum = 0;
      // if (scenData && scenData.length) {
      //   sum = scenData.reduce((pre, curr) => {
      //     return !isNaN(pre.programCount)
      //       ? pre.programCount + curr.programCount
      //       : pre + curr.programCount;
      //   });
      //   scenData.map((item, index) => {
      //     if (index == 0) {
      //       seriesData.push({
      //         name: item.programScenarioDesc,
      //         y: Number(((item.programCount / sum) * 100).toFixed(2)),
      //         sliced: true,
      //         selected: true,
      //         slicedOffset: 30,
      //       });
      //     } else {
      //       seriesData.push([
      //         item.programScenarioDesc,
      //         Number(((item.programCount / sum) * 100).toFixed(2)),
      //       ]);
      //     }
      //   });
      // }
      const initOption = {
        chart: {
          type: 'pie',
          options3d: {
            enabled: true,
            alpha: 60,
            beta: 0
          },
          backgroundColor: 'transparent'
        },
        credits: {
          enabled: false
        },
        title: {
          text: null
        },
        legend: {
          // enabled: true,
          align: 'center',
          symbolRadius: 0,
          // lineHeight: 20,
          itemMarginBottom: 10, // 图例项底部间距
          // itemDistance: 40, // 图例项间的距离
          itemStyle: {
            color: '#fff',
            fontWeight: 400,
            // fontSize: 14,
            fontFamily: 'PingFangSC, PingFangSC-Regular'
          },
          itemHoverStyle: {
            color: '#fff'
          },
          labelFormatter: function () {
            return this.name;
          }
        },
        tooltip: {
          pointFormatter: function () {
            return (
              '<span style="color: ' +
              this.series.color +
              '">\u25CF</span> ' +
              this.series.name +
              ': <b>' +
              this.y + '%' +
              '</b><br/>.'
            );
          }
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            depth: 35,
            dataLabels: {
              enabled: true,
              inside: true,
              crop: false,
              format: '{point.name}',
              color: '#fff'
            },
            showInLegend: true
          }
        },
        colors: ['rgba(254,124,132,1)', 'rgba(85,109,228,1)', 'rgba(104,152,254,1)', 'rgba(104,206,255,1)', 'rgba(87,226,233,1)'],
        series: [
          {
            type: 'pie',
            name: '报警情况',
            // data: seriesData,
            data: data,
            dataLabels: {
              enabled: true,
              format: '{y}%',
              distance: 10
            }
          }
        ]
      };
      this.option = initOption;
    }
  }
};
</script>

<style lang="less" scoped>
.com-chart {
  > div {
    height: 100%;
    width: 100%;
  }
}
</style>
