<template>
  <div id="summaryTable">
    <div>
      <el-row :gutter="10" class="list2">
        <el-col :span="12">
          <div class="content">
            <div class="title">1栋总表与分表之和关系</div>
            <div class="chart-wrap">
              <div id="chart_1" class="chart"/>
              <div id="chart_farther_1" class="chart"></div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- <el-row :gutter="10">
      <el-col :span="8">
        <card title="1栋总表与分表之和关系" class="chart-wrap">
          <div id="chart_1"></div>
          <div id="chart_farther_1"></div>
        </card>
      </el-col>
      <el-col :span="8">
        <card title="2栋总表与分表之和关系"></card>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <card title="3栋总表与分表之和关系"></card>
      </el-col>
      <el-col :span="8">
        <card title="4栋总表与分表之和关系"></card>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <card title="5栋总表与分表之和关系"></card>
      </el-col>
      <el-col :span="8">
        <card title="6栋总表与分表之和关系"></card>
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
import card from 'view/lightPole/lightPoleStatistical/components/card';
import { getFatherAndChildrenReading } from '@/api/water'
import echarts from 'echarts'
export default {
  components: {
    card
  },
  data () {
    return {
      chartInstance_1: "",
      chartFartherInstance_1: ''
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  methods: {
    initChart () {
      this.chartInstance_1 = echarts.init(document.getElementById("chart_1"))
      this.chartFartherInstance_1 = echarts.init(document.getElementById("chart_farther_1"))
      this.chartInstance_1.setOption(this.getPieOption())
      this.chartFartherInstance_1.setOption(this.getPieOption())
    },
    // 饼图配置
    getPieOption(totalEchartData = [], childEchartData = [], colors = [], clockwise = true) {
      if (!totalEchartData.length) {
        totalEchartData = [
          {
            value: 45,
            name: "总表",
          }
        ];
      }
      if (!childEchartData.length) {
        childEchartData = [
          {
            value: 45,
            name: "分表",
          }
        ];
      }
      if (!colors.length) {
        colors = ["#F7614E"];
      }
      let option = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 10,
            data: ['总表']
        },
        series: [
            {
                name: '访问来源',
                type: 'pie',
                center: ['50%','50%'],
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [{value: 335, name: '总表'},]
            }
        ]
      };
      return option;
    }
  }
}
</script>

<style lang="less" scoped>
#summaryTable {
  // echarts图表
  .list2{
    margin-top: 10px;/*no*/
    &::after{
      content: none;
    }
    .el-col{
      .content{
        background: #fff;
        margin-bottom: 10px;/*no*/
        padding: 10px 15px;/*no*/
        position: relative;
        .title{
          font-size: 14px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #5F5F5F;
          margin-bottom: 15px;/*no*/
        }
      }
    }
    .chart{
      width: 45%;
      height: 300px;
      margin-top: 50px;
    }
    
  }
}
.chart-wrap {
  display: flex;
  #chart_1,#chart_farther_1 {
    // width: 300px;
    // height: 100%;
  }
}
</style>