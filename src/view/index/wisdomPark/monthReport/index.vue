<template>
  <div id="sm_screen" style="">
    <div style="margin-left: 10px;margin-right: 10px;">
      <img src="./images/title_top.png" style="width: 100%;"></img>
    </div>


    <div class="class_top">

      <el-row>
        <el-col :span="16">
          <div style="width: 100%;">
              <div style="">
                <div style="margin-left: 0px;">
                  <div style="margin-left: 20px;margin-top: 10px; ">
                    <img src="./images/e_title_bg.png">
                      <div style="display: flex;align-items: center; margin-top: -30px;">
                        <img src="./images/arrow.png" style="left: 1%;width: 16px;height: 16px;"></img>
                        <div style="margin-left: 0.5%;height: 25px;font-size: 16px;font-weight: 400;text-align: center;color: #00fcff;">未来6天天气预报信息</div>
                      </div>
                    </img>
                  </div>

                  <div style="width: 70%;height: 40px;margin: auto;margin-top: 20px;display: flex;justify-content: space-around;">


                    <div v-for="(item, index) in futureWeek" :key="index" style="">
                      <div style="font-size: 14px;color: #8bd1f7;">{{item.tem}}</div>
                      <img :src="item.imgUrl" style="width: 40px;height: 40px;"></img>
                      <!-- <img src="./images/showers.png"></img> -->
                    </div>


                  </div>

                </div>
              </div>



              <div style="">
                <div style="">
                  <div style="margin-left: 20px;margin-top: 18px; ">
                    <img src="./images/e_title_bg.png">
                    <div style="display: flex;align-items: center; margin-top: -30px;">
                      <img src="./images/arrow.png" style="left: 1%;width: 16px;height: 16px;"></img>
                      <div style="margin-left: 0.5%;height: 25px;font-size: 16px;font-weight: 400;text-align: center;color: #00fcff;">
                        最近六天风向、风速及温度情况</div>
                    </div>
                    </img>
                  </div>

                  <div style="width: 95%;height: 300px;margin-left: 20px;">

                    <windChart :chartData="windChartData" :chartId="windChartId"></windChart>

                  </div>

                </div>

              </div>
          </div>

        </el-col>

        <el-col :span="8">
          <div style="width: 100%;">
            <div style="margin-left: 20px;margin-top: 20px; ">
              <img src="./images/e_title_bg.png">
              <div style="display: flex;align-items: center; margin-top: -30px;">
                <img src="./images/arrow.png" style="left: 1%;width: 16px;height: 16px;"></img>
                <div style="margin-left: 1.5%;height: 25px;font-size: 16px;font-weight: 400;text-align: center;color: #00fcff;">土壤水分变化</div>
              </div>
              </img>
            </div>

            <div style="width: 100%;height: 380px;">
              <!-- 水分土壤变化 -->
              <twoBarChart :chartData="twoBarChartData" :chartId="twoBarChartId"></twoBarChart>
            </div>

          </div>
        </el-col>
      </el-row>
    </div>







    <div class="clsaa_bottom">

      <el-row>
        <el-col :span="8">
          <div style="margin-left: 20px;margin-top: 35px;">
            <img src="./images/e_title_bg.png"></img>
            <div style="display: flex;align-items: center; margin-top: -30px;">
              <img src="./images/arrow.png" style="left: 1%;width: 16px;height: 16px;"></img>
              <div style="margin-left: 1.5%;height: 25px;font-size: 16px;font-weight: 400;text-align: center;color: #00fcff;">灯杆耗能信息</div>
            </div>
          </div>

          <div style="width: 100%;height: 400px;">
            <treeBarChart :chartData="treeBarChartData" :chartId="treeBarChartId"></treeBarChart>
          </div>
        </el-col>


        <el-col :span="8">
          <div style="margin-left: 20px;margin-top: 35px; ">
            <img src="./images/e_title_bg.png"></img>
            <div style="display: flex;align-items: center; margin-top: -30px;">
              <img src="./images/arrow.png" style="left: 1%;width: 16px;height: 16px;"></img>
              <div style="margin-left: 1.5%;height: 25px;font-size: 16px;font-weight: 400;text-align: center;color: #00fcff;">人流量、PM2.5信息统计</div>
            </div>
          </div>

          <div style="width: 100%;height: 400px;">
            <barLineChart :chartData="barLineChartData" :chartId="barLineChartId"></barLineChart>
          </div>
        </el-col>


        <el-col :span="8"><div style="margin-left: 20px;margin-top: 35px; ">
            <img src="./images/e_title_bg.png"></img>
            <div style="display: flex;align-items:center; margin-top: -30px;">
              <img src="./images/arrow.png" style="left: 1%;width: 16px;height: 16px;"></img>
              <div style="margin-left: 1.5%;height: 25px;font-size: 16px;font-weight: 400;text-align: center;color: #00fcff;">噪音信息统计</div>
            </div>
          </div>

          <div style="width: 100%;height: 400px;">
            <noiseLineChart :chartData="noiseLineChartData" :chartId="noiseLineChartId"></noiseLineChart>
          </div>
        </el-col>
      </el-row>

    </div>



  </div>
</template>
<script>
  import windChart from "components/echarts/windChart";
  import twoBarChart from "components/echarts/twoBarChart";
  import treeBarChart from "components/echarts/treeBarChart";
  import noiseLineChart from "components/echarts/noiseLineChart";
  import barLineChart from "components/echarts/barLineChart";
  // import wisdomParkReport from '@/api/report.js';
  import wisdomParkReport from '@/api/wisdomPark/report.js';
  export default {
    components: {
      windChart,
      twoBarChart,
      treeBarChart,
      noiseLineChart,
      barLineChart,
    },
    data() {
      return {
        windChartData: {},
        windChartId: "barChart1",
        twoBarChartData: [],
        twoBarChartId: "barChart2",
        treeBarChartData: [],
        treeBarChartId: "barChart3",
        noiseLineChartData: [],
        noiseLineChartId: "barChart4",
        barLineChartData: [],
        barLineChartId: "barChart5",



        //天气预报
        futureWeek:[],
        atmosphereWeek:[],
        // nosieOrPm:[],
        // lampHisReport:[],
        // soilWaterYear:[],
      };
    },
    computed: {

    },
    methods: {
      initData(){
        this.windChartData = {};
        this.noiseLineChartData = [];
        this.barLineChartData = [];
        this.twoBarChartData = [];
        this.treeBarChartData = [];



        this.getFutureWeekAtmosphereInfo();//天气预报
        this.getAtmosphereWeekInfo();//最近六天风向、风速及温度情况
        this.getLampHisReport();//获取灯杆的历史统计信息
        this.getNosieOrPmInfoOfYear();//最近1年的噪音信息统计、人流量、PM2.5信息统计
        this.getSoilWaterYearInfo();//获取今年和去年的土壤水分变化

      },

      //天气预报
      getFutureWeekAtmosphereInfo(){
        var self = this;
        wisdomParkReport.getFutureWeekAtmosphereInfo({"parkId":1}).then(res => {
          if (res.code === '200') { //成功
            console.log('天气预报- ',JSON.stringify(res));
            for(let i=0;i<res.data.length;i++){
                let obj = {};
                obj.tem = res.data[i].tem + '℃';
                obj.weather = res.data[i].weather;
                obj.imgUrl = 'http://www.gd121.cn/img/tqIcon/new/'+res.data[i].imgUrl+'.png';
                self.futureWeek.push(obj);
            }
            console.log('天气预报-- ',self.futureWeek);
          }
        });
      },

      //最近六天风向、风速及温度情况
      getAtmosphereWeekInfo(){
        var self = this;
        var endir = ['W', 'WSW', 'SW', 'SSW', 'S', 'SSE', 'SE', 'ESE', 'E', 'ENE', 'NE', 'NNE', 'N', 'NNW', 'NW', 'WNW'];
        wisdomParkReport.getAtmosphereWeekInfo({"parkId":1}).then(res => {
          if (res.code === '200') { //成功
            console.log('最近六天风向、风速及温度情况- ',JSON.stringify(res));
            var obj = {};
            obj.data = [];obj.title="HOBART";
            for(let i=0;i<res.data.length;i++){
              let info = {}
              // 时间格式：2017-06-27T11:00:00.000Z
              info.time = res.data[i].date + "T" + res.data[i].hour + ":00:00.000Z";// *  date: 日期
              info.windSpeed= res.data[i].windSpeed;// *  windSpeed: 风速
              let direct = parseInt(res.data[i].windDirection);// *  windSpeed: 风向
              if(direct < 0 || direct > 360){
                direct = 0;
              }
              info.R = endir[parseInt(direct/22.5)];
              info.waveHeight= res.data[i].temperature;// *  temperature: 温度
              obj.data.push(info);
              if(res.data.length-1 == i){
                self.windChartData = obj;
                console.log('最近六天风向、风速及温度情况-- ',self.windChartData);
              }
            }
          }
        });
      },

      //获取灯杆的历史统计信息
      getLampHisReport(){
        var self = this;
        wisdomParkReport.getLampHisReport({"parkId":1}).then(res => {
          if (res.code === '200') { //成功
            console.log('获取灯杆的历史统计信息- ',JSON.stringify(res));
            var obj = [[],[],[],[]];
            for(let i=0;i<res.data.length;i++){
              obj[0].push(res.data[i].date);// *  date: 月份
              obj[1].push(res.data[i].savingPower);// *  savingPower: 节能用电
              obj[2].push(res.data[i].usingPower);// *  usingPower: 实际用电
              obj[3].push(res.data[i].totalPower);// *  totalPower: 总耗能
              if(res.data.length-1 == i){
                self.treeBarChartData = obj;
                console.log('获取灯杆的历史统计信息-- ',self.treeBarChartData);
              }
            }
          }
        });
      },

      //最近1年的噪音信息统计、人流量、PM2.5信息统计
      getNosieOrPmInfoOfYear(){
        var self = this;
        wisdomParkReport.getNosieOrPmInfoOfYear({"parkId":1}).then(res => {
          if (res.code === '200') { //成功
            console.log('最近1年的噪音信息统计、人流量、PM2.5信息统计- ',JSON.stringify(res));
            var obj = [[],[],[],[]];
            var noise = [[],[],[],[]];
            for(let i=0;i<res.data.length;i++){
              obj[0].push(res.data[i].month);// *  date: 月份
              obj[1].push(res.data[i].flowInNum);// *  waterValue: 人流量
              obj[2].push(res.data[i].pm);// *  pm: PM2.5值
              noise[0].push(res.data[i].month);// *  date: 月份
              noise[1].push(res.data[i].noiseDecibels);// noiseDecibels: 噪音分贝值
              if(res.data.length-1 == i){
                self.barLineChartData = obj;
                noise[0].reverse();
                noise[1].reverse();
                self.noiseLineChartData = noise;
                console.log('最近1年的噪音信息统计、人流量、PM2.5信息统计-- ',self.barLineChartData);
                console.log('最近1年的噪音信息统计、人流量、PM2.5信息统计--- ',self.noiseLineChartData);
              }
            }
          }
        });
      },

      //获取今年和去年的土壤水分变化
      getSoilWaterYearInfo(){
        var self = this;
        wisdomParkReport.getSoilWaterYearInfo({"parkId":1}).then(res => {
          if (res.code === '200') { //成功
            console.log('获取今年和去年的土壤水分变化- ',JSON.stringify(res));
            var obj = [[],[],[],[]];
            for(let i=0;i<res.data.length;i++){
              obj[0].push(res.data[i].date+'月');// *  date: 月份
              obj[1].push(res.data[i].lastYearWaterValue);// *  去年的水分值(百分比)
              obj[2].push(res.data[i].waterValue);// *  今年的水分值(百分比)
              if(res.data.length-1 == i){
                self.twoBarChartData = obj;
                console.log('获取今年和去年的土壤水分变化-- ',self.twoBarChartData);
              }
            }
          }
        });
      },
    },
    mounted(){
       this.initData();
    },
    created() {

    }
  };
</script>
<style lang="less" scoped>
  #sm_screen {
    height: 100%;
    width: 100%;
    // min-width: 1200px;/*no*/
    // padding: 20px 35px 42px 64px;
    background: url(images/bg.png) no-repeat;
    background-size: 100% 100%;
    background-position: center;
    // overflow: hidden;
    display: flex;
    flex-direction: column;
  }
</style>
