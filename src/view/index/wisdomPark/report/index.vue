<template>
  <!-- <div style="min-width: 100%; min-height: 100%;"> -->
  <div id="my_screen" class="" style="">
    <div style="z-index: 999; margin-left: 10px;margin-right: 10px; cursor: pointer;" @click="goBack">
      <img src="./images/title.png" style="width: 100%;"/>
    </div>

    <div style="min-width: 100% ; min-height: 100%;position: relative;top: -120px;">
          <div style="display:flex; justify-content: center;  align-items: center; ">
            <div class="parkMap" id="parkMap"></div>
          </div>
          <div  style="display:flex; justify-content: center;  align-items: center; pointer-events:none;">
            <img src="./images/6.png" style=" position: absolute; top:0px; width: 1920px; height: 1080px;">
          </div>
    </div>
    <el-row class='posRow' style="pointer-events:none;"> <!--  -->
      <el-col :span="6" style="">
        <div class="top">
          <div style="margin-left: 20px;">
            <img src="./images/e_title_bg.png" >
              <div style="display: flex;align-items: center; margin-top: -30px;">
                <img src="./images/arrow.png" style="left: 1%;width: 16px;height: 16px;"></img>
                <div style="margin-left: 1.5%;height: 25px;font-size: 16px;font-weight: 400;text-align: center;color: #00fcff;">土壤信息检测</div>
              </div>
            </img>

          </div>

          <!-- border:1px solid yellowgreen; -->
          <div class="list" style="">
            <evnOneLineChart :chartData="evnOneLineChartData" :chartId="evnOneLineChartId"></evnOneLineChart>
          </div>
          <div class="list" style="">
            <evnTwoLineChart :chartData="evnTwoLineChartData" :chartId="evnTwoLineChartId"></evnTwoLineChart>
          </div>
        </div>

        <div style="margin-top: -60px;">
          <div style="margin-left: 20px;">
            <img src="./images/e_title_bg.png" >
              <div style="display: flex;align-items: center; margin-top: -30px;">
                <img src="./images/arrow.png" style="left: 1%;width: 16px;height: 16px;"></img>
                <div style="margin-left: 1.5%;height: 25px;font-size: 16px;font-weight: 400;text-align: center;color: #00fcff;">灯杆信息统计</div>
              </div>
            </img>

          </div>


          <div style="position: static;margin-top: 5px;margin-left: 20px;">
            <el-row style="position: static;margin-top: 30px;margin-left: 30px;">
              <el-col :span="12">
                <div style="">
                  <img src="./images/lamppost.png" ></img>
                  <img src="./images/ld.png" style="margin-left: -36px;"></img>
                  <div style="margin-top: -45px;margin-left: 60px;">
                    <div style="font-size: 14px;text-align: left;color: #8bd1f7;">总灯杆</div>
                    <div style="font-size: 20px;text-align: left;color: #00fcff;">{{deviceNum}}</div>
                  </div>

                </div>
              </el-col>
              <el-col :span="12">
                  <img src="./images/lamppost.png" ></img>
                  <img src="./images/hn.png" style="margin-left: -36px;"></img>
                  <div style="margin-top: -45px;margin-left: 60px;">
                    <div style="font-size: 14px;text-align: left;color: #8bd1f7;">总耗能</div>
                    <div style="display: flex;">
                      <div style="font-size: 20px;text-align: left;color: #00fcff;">{{total}}</div>
                      <div style="margin-left: 5px;text-align: left;font-size: 14px;color: #8bd1f7;margin-top: 5px;">度</div>
                    </div>


                  </div>
              </el-col>
            </el-row>

            <!-- <div style="width: 150px;height: 150px;  border: 1px solid antiquewhite; "> --> -->
              <pieChart1 :chartData="pieChart1Data" :chartId="pieChart1Id"  ></pieChart1>
            <!-- </div> -->

           <!-- <div style="border: 1px solid antiquewhite; "> -->
              <pieChart2 :chartData="pieChart2Data" :chartId="pieChart2Id"></pieChart2>
            <!-- </div> -->
          </div>

        </div>

      </el-col>
      <el-col :span="12" style="position: relative;top: 20px">
       <div style="">
            <div style="width: 60%;margin: auto; display: flex;justify-content: space-around;">
                 <div style="">
                       <img src="./images/total_bg.png" ></img>
                      <div style="margin-top: -70px; margin-left: 23px;">
                        <div style="color: #8bd1f7;font-size: 16px;">在园人数</div>
                        <div style="color: #00fcff;font-size: 30px;font-weight: 700;font-family: DS-Digital, DS-Digital-Bold Italic;margin-top: 5px;">{{personCountInPark}}</div>
                      </div>
                 </div>
                 <div style="">
                      <img src="./images/total_bg.png"></img>
                      <div style="margin-top: -70px; margin-left: 23px;">
                        <div style="color: #8bd1f7;font-size: 16px;">日累计人数</div>
                        <div style="color: #00fcff;font-size: 30px;font-weight: 700;font-family: DS-Digital, DS-Digital-Bold Italic;margin-top: 5px;">{{personCountToday}}</div>
                      </div>
                 </div>

            </div>



       </div>
      </el-col>
      <el-col :span="6" style="" >
        <div>
          <div style="display: flex;justify-content: space-around;margin-top: 10px;">
            <div>
              <img src="./images/tj_bg.png" style="width: 114px;height: 82px;"></img>
              <div style="margin-left: 40px;margin-top: -50px;">
                 <div style="color: #00fcff;font-size: 24px;width: 60px;text-align: center;margin-left: -15px;">{{noiseDecibels}}</div>
                 <div style="display: flex; margin-left: -10px;">
                   <img src="./images/voice.png" style="width: 16px;height: 16px;margin-top: 2px;"></img>
                   <div style="color: #8bd1f7;font-size: 14px;margin-left: 5px;">噪声</div>
                 </div>
                 <div style="color: #8bd1f7;font-size: 14px;">(分贝)</div>
              </div>
            </div>
            <div>
              <img src="./images/tj_bg.png" style="width: 114px;height: 82px;"></img>
              <div style="margin-left: 40px;margin-top: -50px;">
                 <div style="color: #00fcff;font-size: 24px;width: 60px;text-align: center;margin-left: -12px;">{{pm}}</div>
                 <div style="display: flex; margin-left: -12px;">
                   <img src="./images/voice.png" style="width: 16px;height: 16px;margin-top: 2px;"></img>
                   <div style="color: #8bd1f7;font-size: 14px;margin-left: 5px;">PM2.5</div>
                 </div>
                 <div style="color: #8bd1f7;font-size: 14px;">(ug/㎡)</div>
              </div>
            </div>
          </div>

          <div style="display: flex;justify-content: space-around;margin-top: 20px;">
            <div>
              <img src="./images/tj_bg.png" style="width: 114px;height: 82px;"></img>
              <div style="margin-left: 40px;margin-top: -50px;">
                 <div style="color: #00fcff;font-size: 24px;width: 60px;text-align: center;margin-left: -15px;">{{windSpeed}}</div>
                 <div style="display: flex; margin-left: -10px;">
                   <img src="./images/voice.png" style="width: 16px;height: 16px;margin-top: 2px;"></img>
                   <div style="color: #8bd1f7;font-size: 14px;margin-left: 5px;">风速</div>
                 </div>
                 <div style="color: #8bd1f7;font-size: 14px;">(m/s)</div>
              </div>
            </div>
            <div>
              <img src="./images/tj_bg.png" style="width: 114px;height: 82px;"></img>
              <div style="margin-left: 38px;margin-top: -50px;">
                 <div style="color: #00fcff;font-size: 24px;width: 60px;text-align: center;margin-left: -10px;">{{windDirection}}</div>
                 <div style="display: flex; margin-left: -6px;">
                   <img src="./images/voice.png" style="width: 16px;height: 16px;margin-top: 2px;"></img>
                   <div style="color: #8bd1f7;font-size: 14px;margin-left: 5px;">风向</div>
                 </div>
                 <div style="color: #8bd1f7;font-size: 14px;">(角度)</div>
              </div>
            </div>
          </div>

        </div>


        <div>
          <div style="margin-left: 20px;margin-top: 10px; ">
            <img src="./images/e_title_bg.png" >
              <div style="display: flex;align-items: center; margin-top: -30px;">
                <img src="./images/arrow.png" style="left: 1%;width: 16px;height: 16px;"></img>
                <div style="margin-left: 1.5%;height: 25px;font-size: 16px;font-weight: 400;text-align: center;color: #00fcff;">公厕信息统计</div>
              </div>
            </img>

          </div>

           <div style="display: flex;justify-content: space-around;margin-top: 15px;">
             <div>
              <img src="./images/malebg.png" @click="toilet_ManClick"></img>
              <img src="./images/head_man.png" style="margin-left: -36px;"></img>
              <div style="margin-top: -45px;margin-left: 60px;">
                <div style="font-size: 14px;text-align: left;color: #85c9ee;">男厕空闲</div>
                <div style="font-size: 20px;text-align: left;color: #00fcff;">{{toilet_ManCount}}</div>
              </div>
            </div>
            <div >
              <img src="./images/malebg.png" @click="toilet_WomanClick"></img>
              <img src="./images/head_woman.png" style="margin-left: -36px;"></img>
              <div style="margin-top: -45px;margin-left: 60px;">
                <div style="font-size: 14px;text-align: left;color: #EBE0BB;">女厕空闲</div>
                <div style="font-size: 20px;text-align: left;color: #ffd853;">{{toilet_WomanCount}}</div>
              </div>
            </div>
           </div>
        </div>


        <div style="margin-top: 20px;">
          <el-row>
            <el-col :span="10">
              <div style="margin-left: 35px;">
                <div style="margin-top: 16px;">
                  <img src="./images/databg.png"></img>
                  <div style="display: flex;align-items: center; margin-top: -28px;margin-left: 5px;">
                    <img src="./images/cloud.png" style="width: 20px;height: 20px;"></img>
                    <div style="color: #e4fdff;font-size: 14px;margin-left: 6px;">氨气:</div>
                    <div style="color: #24e5ea;font-size: 16px;margin-left: 6px;">{{toilet_Data.nh3}}PPM</div>
                  </div>
                </div>

                <div style="margin-top: 16px;">
                  <img src="./images/databg.png"></img>
                  <div style="display: flex;align-items: center;margin-top: -28px;margin-left: 5px;">
                    <img src="./images/cloudp.png" style="width: 20px;height: 20px;"></img>
                    <div style="color: #e4fdff;font-size: 14px;margin-left: 6px;">硫化氢:</div>
                    <div style="color: #24e5ea;font-size: 16px;margin-left: 6px;">{{toilet_Data.h2s}}PPM</div>
                  </div>
                </div>

                <div style="margin-top: 16px;">
                  <img src="./images/databg.png"></img>
                  <div style="display: flex;align-items: center;margin-top: -28px;margin-left: 5px;">
                    <img src="./images/drop_0.png" style="width: 20px;height: 20px;"></img>
                    <div style="color: #e4fdff;font-size: 14px;margin-left: 6px;">湿度:</div>
                    <div style="color: #24e5ea;font-size: 16px;margin-left: 6px;">{{toilet_Data.humidity}}%</div>
                  </div>
                </div>

                <div style="margin-top: 16px;">
                  <img src="./images/databg.png"></img>
                  <div style="display: flex;align-items: center;margin-top: -28px;margin-left: 5px;">
                    <img src="./images/temperature.png" style="width: 20px;height: 20px;"></img>
                    <div style="color: #e4fdff;font-size: 14px;margin-left: 6px;">温度:</div>
                    <div style="color: #24e5ea;font-size: 16px;margin-left: 6px;">{{toilet_Data.temperature}}°C</div>
                  </div>
                </div>

              </div>

            </el-col>
            <el-col :span="14">
              <div style="height: 150px;">
                  <!-- <div style=""> -->
                   <radarChart style="margin-top: -55px;" :chartData="radarChartData" :chartId="radarChartId"></radarChart>
                  <!-- </div> -->
              </div>
              <div style="margin-top: 60px;">
                <div style="display: flex;">
                  <div style="color: #8bd1f7;font-size: 14px;">当前环境质量：</div>
                  <div v-show="toilet_Data.qualityStatus==1" style="color: #05FF98;font-size: 14px;">差</div>
                  <div v-show="toilet_Data.qualityStatus==2" style="color: #05FF98;font-size: 14px;">优</div>
                  <div style="color: #8bd1f7;font-size: 14px;">，请保洁人员注意打扫</div>
                </div>
                <div style="display: flex;">
                  <div style="display: flex;width: 120px;">
                    <div style="color: #8bd1f7;font-size: 14px;">保洁员：</div>
                    <div style="color: #E4FDFF;font-size: 14px;">{{toilet_Data.worker}}</div>
                  </div>
                  <div style="display: flex;margin-left: 30px;">
                    <div style="color: #8bd1f7;font-size: 14px;">保洁次数：</div>
                    <div style="color: #E4FDFF;font-size: 14px;">{{toilet_Data.num}}</div>
                  </div>
                </div>
              </div>

            </el-col>
          </el-row>

        </div>


        <div>

          <div style="margin-left: 20px;margin-top: 10px; ">
            <img src="./images/e_title_bg.png" >
              <div style="display: flex;align-items: center; margin-top: -30px;">
                <img src="./images/arrow.png" style="left: 1%;width: 16px;height: 16px;"></img>
                <div style="margin-left: 1.5%;height: 25px;font-size: 16px;font-weight: 400;text-align: center;color: #00fcff;">古树信息统计</div>
              </div>
            </img>

          </div>


          <treeInfoBarChart :chartData="treeInfoBarChartData" :chartId="treeInfoBarChartId"></treeInfoBarChart>



        </div>

       </el-col>
    </el-row>

    <!-- 古树信息详情 -->
    <div v-show="showTreeAbout==true" class="afterOCB" style="position: absolute;left: 55%;top: 45%; z-index: 9999;">
      <img src="./images/tk_treebg.png"></img>
      <div style="margin-top: -284px;width: 202px;">
        <div style="display: flex;justify-content: space-between;margin-top: 6px;">
          <div style="display: flex;margin-left: 8px;">
            <img src="./images/ft.png" style="" ></img>
            <div style="font-weight: 700;color: #00fcff;font-size: 14px;margin-left: 7px;text-align: left;">古树信息</div>
          </div>

          <div style="width: 12px;height: 12px;margin-right: 10px;margin-top: 3px;z-index: 9999;" @click="hideTreeAbout_Click"></div>

        </div>
      </div>
      <div style="height: 7px;"></div>
      <div v-for="(item, index) in treeAboutData" :key="index" style="width: 202px;margin-top: 12px;margin-left: 10px;">
        <div style="display: flex;">
          <div style="width: 65px;text-align: right;color: #C7EBFF;font-size: 14px;">{{item.target}}</div>
          <div style="width: 110px;color: #ffffff;font-size: 14px;margin-left: 5px;word-wrap:break-word;">{{item.volume}}</div>
        </div>
      </div>
    </div>

    <!-- 公厕信息详情 -->
    <div v-show="showToiletAbout==true" class="afterOCA" style="position: absolute;left: 55%;top: 45%; z-index: 9999;">
      <img src="./images/tk_wcbg.png"></img>
      <div style="margin-top: -301px;width: 273px;">
        <div style="display: flex;justify-content: space-between;margin-top: 6px;">
          <div style="display: flex;margin-left: 8px;">
            <img src="./images/ft.png" style=""></img>
            <div style="font-weight: 700;color: #00fcff;font-size: 14px;margin-left: 7px;text-align: left;">公厕信息</div>
          </div>
          <img src="./images/close.png" style="width: 12px;height: 12px;margin-right: 10px;"  @click="hideToiletAbout_Click"></img>
        </div>
      </div>

      <div style="display: flex;margin-top: 18px;margin-left: 20px;">
        <div style="font-size: 18px;color: #5cf4f5;">{{toiletName}}</div>
        <div v-show="toiletAboutData.male.toiletStatus==1" style="font-size: 14px;color: #0ad687;margin-left: 6px;margin-top: 4px;"> 【流畅】</div>
        <div v-show="toiletAboutData.male.toiletStatus==2" style="font-size: 14px;color: #0ad687;margin-left: 6px;margin-top: 4px;"> 【拥堵】</div>
        <div style="font-size: 14px;color: #e4fdff;margin-left: 6px;margin-top: 4px;cursor: pointer;" @click="goto_AboutClick">详情>></div>
      </div>
      <div style="display: flex;margin-left: 15px;margin-top: 8px;">
        <div style="font-size: 14px;color: #C7EBFF;margin-left: 6px;">今日累计人数:</div>
        <div style="font-size: 14px;color: #e4fdff;margin-left: 6px;">{{toiletAllCount}}</div>
      </div>

      <div style="display: flex;justify-content: space-around;width: 273px;margin-top: 8px;">
        <div style="display: flex;margin-left: 10px;">
          <img src="./images/head_man.png" style="width: 16px;height: 16px;margin-top: 5px;"></img>
          <div style="font-size: 14px;color: #e4fdff;margin-left: 6px;margin-top: 4px;">男【{{toiletAboutData.male.usedNum}}/{{toiletAboutData.male.num}}】</div>
        </div>
        <div style="display: flex;margin-left: 10px;">
          <img src="./images/head_woman.png" style="width: 16px;height: 16px;margin-top: 5px;"></img>
          <div style="font-size: 14px;color: #e4fdff;margin-left: 6px;margin-top: 4px;">女【{{toiletAboutData.female.usedNum}}/{{toiletAboutData.female.num}}】</div>
        </div>
      </div>

      <div v-for="(item, index) in toiletsData" :key="index" style="display: flex;justify-content: space-around;width: 273px;margin-top: 10px;margin-left: -5px;">
        <div style="display: flex;">
          <div style="width: 65px;text-align: right;color: #C7EBFF;font-size: 14px;">{{item.target}}</div>
          <div style="width: 50px;color: #ffffff;font-size: 14px;margin-left: 5px;">{{item.volume_man}}</div>
        </div>
        <div style="display: flex;">
          <div style="width: 65px;text-align: right;color: #C7EBFF;font-size: 14px;">{{item.target}}</div>
          <div style="width: 50px;color: #ffffff;font-size: 14px;margin-left: 5px;">{{item.volume_woman}}</div>
        </div>
      </div>

    </div>



    <div style="position: absolute; width: 40%;display: flex;justify-content: space-around;top: 92%;left: 30%; z-index: 99999;">
      <div style="width: 100px;" @click="map_TreeClick">
        <img v-show="option_btn0==false" src="./images/option1.png" style="" ></img>
        <img v-show="option_btn0==true" src="./images/option2.png" style="" ></img>
        <div style="width: 60px;display: flex;justify-content: space-around;margin-left: 15px;" :style="option_btn0 ? 'margin-top: -30px;':'margin-top: -25px'">
          <img src="./images/tk_ttree.png" ></img>
          <div style="color: #ffffff;font-size: 14px;" :style="option_btn0 ? 'color: #ffffff;':'color: #31b3c6;'">古树</div>
        </div>
      </div>

      <div style="width: 100px;" @click="map_ToiletClick">
        <img v-show="option_btn1==false" src="./images/option1.png" style="" ></img>
        <img v-show="option_btn1==true" src="./images/option2.png" style="" ></img>
        <div style="width: 60px;display: flex;justify-content: space-around;margin-left: 15px;" :style="option_btn1 ? 'margin-top: -30px;':'margin-top: -25px'">
          <img src="./images/ft.png" ></img>
          <div style="color: #ffffff;font-size: 14px;" :style="option_btn1 ? 'color: #ffffff;':'color: #31b3c6;'">公厕</div>
        </div>
      </div>

      <div style="width: 100px;" @click="map_LampClick">
        <img v-show="option_btn2==false" src="./images/option1.png" style="" ></img>
        <img v-show="option_btn2==true" src="./images/option2.png" style="" ></img>
        <div style="width: 60px;display: flex;justify-content: space-around;margin-left: 15px;" :style="option_btn2 ? 'margin-top: -30px;':'margin-top: -25px'">
          <img src="./images/tk_tld.png" ></img>
          <div style="color: #ffffff;font-size: 14px;" :style="option_btn2 ? 'color: #ffffff;':'color: #31b3c6;'">灯控</div>
        </div>
      </div>


    </div>

  </div>
<!-- </div> -->
</template>
<script>
import evnOneLineChart from "components/echarts/evnOneLineChart";
import evnTwoLineChart from "components/echarts/evnTwoLineChart";
import pieChart1 from "components/echarts/pieChart1";
import pieChart2 from "components/echarts/pieChart2";
import treeInfoBarChart from "components/echarts/treeInfoBarChart";
import radarChart from "components/echarts/radarChart";
// import wisdomParkReport from '@/api/report.js';
import wisdomParkReport from "@/api/wisdomPark/report.js";
export default {
  components: {
    evnOneLineChart,
    evnTwoLineChart,
    pieChart1,
    pieChart2,
    treeInfoBarChart,
    radarChart,
  },
  data() {
    return {
      markerList: [], //地图数据
      evnOneLineChartData: [],
      evnOneLineChartId: "barChart5",
      evnTwoLineChartData: [],
      evnTwoLineChartId: "barChart6",

      pieChart1Data: [],
      pieChart1Id: "barChart1",
      pieChart2Data: [],
      pieChart2Id: "barChart2",
      treeInfoBarChartData: [],
      treeInfoBarChartId: "barChart3",
      radarChartData: [],
      radarChartId: "barChart4",
      // option_btn:[true,false,false],
      option_btn0: true,
      option_btn1: false,
      option_btn2: false,
      toiletsData: [
        {
          target: "温度:",
          volume_man: "32℃",
          volume_woman: "32℃",
        },
        {
          target: "氨气:",
          volume_man: "40PPM",
          volume_woman: "40PPM",
        },
        {
          target: "PM2.5:",
          volume_man: "50%",
          volume_woman: "50%",
        },
        {
          target: "排风扇:",
          volume_man: "开",
          volume_woman: "开",
        },
        {
          target: "打扫次数:",
          volume_man: "3",
          volume_woman: "3",
        },
        {
          target: "保洁人员:",
          volume_man: "xxx",
          volume_woman: "xxx",
        },
      ],

      treeAboutData: [
        {
          target: "古树编号:",
          volume: "350002020000000000104955000000042",
        },
        {
          target: "古树名称:",
          volume: "白羊",
        },
        {
          target: "经度:",
          volume: "118.786888",
        },
        {
          target: "纬度:",
          volume: "23.98766",
        },
        {
          target: "背景角度:",
          volume: "60",
        },
        {
          target: "倾斜角度:",
          volume: "23",
        },
        {
          target: "状态:",
          volume: "正常",
        },
      ],

      personCountInPark: "120", //在园人数
      personCountToday: "450", //日累计人数
      deviceNum: "0", //总灯杆数
      total: "0", //总耗能

      noiseDecibels: "0", //噪声
      pm: "0", //PM2.5
      windSpeed: "0", //风速
      windDirection: "0", //风向

      //公厕总信息
      // 男厕male, 女厕female
      toiletAllCount: "0", //今日累计人数
      toilet_Man: {},
      toilet_Woman: {},
      toilet_ManCount: "0",
      toilet_WomanCount: "0",
      toilet_Data: {
        freeNum: "0", //空闲数
        nh3: "0", //氨气
        h2s: "0", //硫化氢
        humidity: "0", //湿度
        temperature: "0", //温度
        worker: "xxx", //保洁员
        nums: "0", //保洁次数
        qualityStatus: "0", //环境质量
      },
      toiletAboutData: {
        // 男厕male, 女厕female
        male: {
          usedNum: "0",
          toiletStatus: "0",
          flowIn: "0",
        },
        female: {
          usedNum: "0",
          toiletStatus: "0",
          flowIn: "0",
        },
      },

      showTreeAbout: false, //初始默认古树详情隐藏
      showToiletAbout: false, //初始默认厕所详情隐藏
      toiletId: null,
      toiletName: null,
      posScreen: {
        x: 0,
        y: 0,
      },
    };
  },
  methods: {
    handleClick() {
      console.log("wewewe");
    },
    initData() {
      this.pieChart1Data = [];
      this.pieChart2Data = [];
      this.treeInfoBarChartData = [];
      this.radarChartData = [];
      this.evnOneLineChartData = [];
      this.evnTwoLineChartData = [];

      this.getParkUserInfo(); //获取在园人数和日累计人数
      this.getAtmosphereInfo(); //获取土壤检测信息和气象信息
      this.getLampReport(); //获取灯杆的统计信息
      // this.getToiletInfo(); //根据公厕ID获取公厕的详细信息
      this.getToiletNewDevInfo("fswh-01", true); //根据公厕ID获取公厕的详细信息
      this.getTreeHisReport(); //获取古树的历史统计信息
      this.getDeviceList(1); //获取地图信息接口
      this.initParkMap();
      this.getSoilInfo(); //获取土壤检测信息: 24小时的土壤纬度、土壤水分和电导率
    },
    initParkMap() {
      var arearLinePointData = [
        [113.1298850996637, 23.015056910513525],
        [113.1298671335535, 23.017734556764676],
        [113.12979526911272, 23.018250122229645],
        [113.13044204907969, 23.018117073268247],
        [113.13117865959764, 23.01831664666055],
        [113.13146611736073, 23.018150335521046],
        [113.13148408347092, 23.020312364153217],
        [113.13279560951506, 23.020362256707777],
        [113.13279560951506, 23.02044541092387],
        [113.13277764340486, 23.02145988818393],
        [113.13265188063352, 23.021742609979242],
        [113.13335255893107, 23.02212511498322],
        [113.13430476277132, 23.022191637480564],
        [113.13576001769701, 23.022208268099718],
        [113.13568815325624, 23.01836653996195],
        [113.13563425492565, 23.01728551425153],
        [113.13558035659507, 23.011032024318673],
        [113.13265188063352, 23.010632855430938],
        [113.13256205008254, 23.014092279435392],
        [113.13214882954809, 23.014241964025576],
        [113.13110679515685, 23.014158805940657],
        [113.13094510016512, 23.01490722683808],
        [113.13076543906318, 23.015073542022648],
      ];
      let that = this;
      this.map = new BMap.Map("parkMap", { enableMapClick: false }); //禁用地图自带景点标点点击事件
      this.map.disableDragging(); //禁用地图拖拽
      this.map.disableScrollWheelZoom(); //禁用滚轮放大缩小
      this.map.disableDoubleClickZoom(); //禁用双击放大
      //设置默认中心点与zoom，暂时固定，如果要做成切换的则中心点需要动态配置
      // var point = new BMap.Point(113.134179, 23.015955);
      var point = new BMap.Point(113.134179, 23.017955);
      this.map.centerAndZoom(point, 17);
      this.drawArearLine(arearLinePointData);
      var loadCount = 1;
      var tempMap = this.map;
      tempMap.addEventListener("tilesloaded", function () {
        if (loadCount == 1) {
          tempMap.setCenter(point);
        }
        loadCount = loadCount + 20;
      });
      //使用地图样式
      // this.map.setMapStyleV2({
      //   styleId: "36f466a4f9b60a1544edd8435281a63b",
      // });
      this.map.setMapStyleV2({
        styleId: "02b81ab7cd95f6aece86c3500bf9b3cf",
      });
      // var param = [{type:1,id:[1,2], value:[[113.134179, 23.015955],[113.132179, 23.014955]]},{type:2,id:[1,2], value:[[113.136179, 23.012955],[113.133179, 23.018955]]}];
      // this.setLandMark(param);
    },
    drawArearLine(arearLinePointData) {
      var plyList = [];
      // 添加范围覆盖
      for (var i = 0; i < arearLinePointData.length; i++) {
        let ply = new BMap.Point(
          arearLinePointData[i][0],
          arearLinePointData[i][1]
        );
        plyList.push(ply);
      }
      this.map.addOverlay(
        new BMap.Polygon(plyList, {
          strokeWeight: 2,
          strokeColor: "#0bcbff",
          strokeStyle: "solid",
          fillColor: "#0bcbff",
          fillOpacity: 0.4,
        })
      ); //添加覆盖物
    },

    // 设置地理位置坐标及类型,参数格式[{type:1, value:[[123,123],[,123,124]]}] 类型：1:古树  2:公厕  3:灯杆
    setLandMark(param) {
      this.clearAllMarker();
      var self = this;
      for (var i = 0; i < param.length; i++) {
        for (let j = 0; j < param[i].value.length; j++) {
          let point = new BMap.Point(
            param[i].value[j][0],
            param[i].value[j][1]
          );
          // 绑定点击事件
          let clickId = param[i].id[j];
          let clickType = param[i].type;

          if (param[i].type == 1) {
            // 古树
            let myIcon = new BMap.Icon(
              require("./images/tree.png"),
              new BMap.Size(40, 60)
            );
            let marker = new BMap.Marker(point, { icon: myIcon });
            this.markerList.push(marker);
            marker.setTop(true);
            marker.addEventListener("click", function (event) {
              console.log(clickType, clickId);
              // var e = event || window.event;
              // self.posScreen = {
              //   x: e.screenX + 30,
              //   y: e.screenY - 80,
              // };
              let posX = 0,
                posY = 0;
              var event = event || window.event;
              if (event.pageX || event.pageY) {
                posX = event.pageX;
                posY = event.pageY;
              } else if (event.clientX || event.clientY) {
                posX =
                  event.clientX +
                  document.documentElement.scrollLeft +
                  document.body.scrollLeft;
                posY =
                  event.clientY +
                  document.documentElement.scrollTop +
                  document.body.scrollTop;
              }
              self.posScreen = {
                x: posX + 30,
                y: posY - 80,
              };
              self.getTreeInfo(clickId); //根据古树ID获取古树的详细信息
            });
            this.map.addOverlay(marker);
          } else if (param[i].type == 2) {
            // 公厕
            let myIcon = new BMap.Icon(
              require("./images/dt_wc.png"),
              new BMap.Size(40, 60)
            );
            let marker = new BMap.Marker(point, { icon: myIcon });
            this.markerList.push(marker);
            marker.setTop(true);
            marker.addEventListener("click", function (event) {
              self.toiletId = clickId;
              // var e = event || window.event;
              // self.posScreen = {
              //   x: e.screenX + 30,
              //   y: e.screenY - 80,
              // };
              // self.getToiletInfoAbout(clickId, clickName);
              self.getToiletNewDevInfo(clickId);
            });
            this.map.addOverlay(marker);
          } else if (param[i].type == 3) {
            // 灯柜
            let myIcon = new BMap.Icon(
              require("./images/dt_ld.png"),
              new BMap.Size(40, 60)
            );
            let marker = new BMap.Marker(point, { icon: myIcon });
            this.markerList.push(marker);
            marker.setTop(true);
            marker.addEventListener("click", function () {
              console.log(clickType, clickId);
              let href =
                "http://39.108.109.191:8080/#/login?redirect=%2F&username=sanyuan1";
              window.open(href, "_blank");
              return;
              wisdomParkReport.toDeviceDetail(self, 3);
            });
            this.map.addOverlay(marker);
          }
        }
      }
    },
    // 清除地图上的所有标志点
    clearAllMarker() {
      for (var i = 0; i < this.markerList.length; i++) {
        this.map.removeOverlay(this.markerList[i]);
      }
      this.markerList = [];
    },

    //古树
    map_TreeClick() {
      this.showToiletAbout = false;
      this.showTreeAbout = false;
      this.getDeviceList(1);
      this.initBtn(0);
      this.option_btn0 = true;
    },
    //公厕
    map_ToiletClick() {
      this.showToiletAbout = false;
      this.showTreeAbout = false;
      this.getDeviceList(2);
      this.initBtn(1);
      this.option_btn1 = true;
    },
    //灯杆
    map_LampClick() {
      this.showToiletAbout = false;
      this.showTreeAbout = false;
      this.getDeviceList(3);
      this.initBtn(2);
      this.option_btn2 = true;
    },

    initBtn(index) {
      this.option_btn0 = false;
      this.option_btn1 = false;
      this.option_btn2 = false;
    },

    getSoilInfo() {
      var self = this;
      wisdomParkReport.getSoilInfo({ parkId: 1 }).then((res) => {
        console.log(
          "获取土壤检测信息: 24小时的土壤纬度、土壤水分和电导率- ",
          res
        );
        if (res.code === "200") {
          //成功
          console.log(JSON.stringify(res));
          var timeData = [];
          var dataOneList = [];
          var electrical = [];
          var water = [];
          for (let i = 0; i < res.data.length; i++) {
            timeData.push(res.data[i].hour);
            dataOneList.push(res.data[i].soilTemperatureValue);
            electrical.push(res.data[i].electricalValue);
            water.push(res.data[i].waterValue);
            if (res.data.length - 1 == i) {
              self.evnOneLineChartData.push(timeData);
              self.evnOneLineChartData.push(dataOneList);
              self.evnTwoLineChartData.push(timeData);
              self.evnTwoLineChartData.push(water);
              self.evnTwoLineChartData.push(electrical);
            }
          }
        }
      });
    },

    getDeviceList(deviceType) {
      var self = this;
      wisdomParkReport
        .getDeviceList({ parkId: 1, deviceType: deviceType })
        .then((res) => {
          console.log("获取地图信息接口- ", res);
          if (res.code === "200") {
            //成功
            console.log(JSON.stringify(res));
            var param = [];
            var device = {};
            device.type = deviceType;
            device.value = [];
            device.id = [];
            device.name = [];
            for (let i = 0; i < res.data.length; i++) {
              device.id.push(res.data[i].id);
              device.value.push([res.data[i].longitude, res.data[i].latitude]);
              res.data[i].name && device.name.push(res.data[i].name);
              if (res.data.length - 1 == i) {
                param.push(device);
                self.setLandMark(param);
              }
            }
          }
        });
    },

    getParkUserInfo() {
      var self = this;
      wisdomParkReport.getParkUserInfo({ parkId: 1 }).then((res) => {
        if (res.code === "200") {
          //成功
          console.log(JSON.stringify(res));
          // self.personCountInPark =  res.data.personCountInPark;
          // self.personCountToday =  res.data.personCountToday;
        }
      });
    },

    getAtmosphereInfo() {
      var self = this;
      wisdomParkReport.getAtmosphereInfo({ parkId: 1 }).then((res) => {
        if (res.code === "200") {
          //成功
          console.log("获取土壤检测信息- ", res);

          self.noiseDecibels = res.data.noiseDecibels; //噪声
          self.pm = res.data.pm; //PM2.5
          self.windSpeed = res.data.windSpeed; //风速
          self.windDirection = res.data.windDirection; //风向
        }
      });
    },
    getTreeInfo(treeId) {
      var self = this;
      console.log(this.posScreen);
      wisdomParkReport
        .getTreeInfo({ parkId: 1, treeId: treeId })
        .then((res) => {
          console.log("获取单颗详情古树信息- ", res);
          if (res.code === "200") {
            //成功
            console.log(JSON.stringify(res));
            //  id: 古树ID
            self.treeAboutData[0].volume = res.data.code; //code: 古树编号
            self.treeAboutData[1].volume = res.data.name; //name: 古树名称
            self.treeAboutData[2].volume = res.data.longitude; //longitude: 经度
            self.treeAboutData[3].volume = res.data.latitude; //latitude: 纬度
            self.treeAboutData[4].volume = res.data.backgroundAngle; //backgroundAngle: 背景角度
            self.treeAboutData[5].volume = res.data.tiltAngle; //tiltAngle: 倾斜角度
            self.treeAboutData[6].volume = res.data.status; //status: 状态
            self.showTreeAbout = true;
          }
        });
    },

    hideTreeAbout_Click() {
      console.log("eeweee");
      this.showTreeAbout = false;
    },

    hideToiletAbout_Click() {
      console.log("eeweee");
      this.showToiletAbout = false;
    },

    getToiletInfoAbout(toiletId) {
      var self = this; //公厕信息接口
      this.toilet_Man;
      this.toilet_Woman;

      wisdomParkReport
        .getToiletInfo({ parkId: 1, toiletId: toiletId })
        .then((res) => {
          if (res.code === "200") {
            //成功
            console.log(JSON.stringify(res));
            console.log("公厕信息详情-", res);
            self.setToiletData(res.data);
            self.toiletAllCount = res.data.male.flowIn + res.data.female.flowIn;
          }
        });
    },

    getToiletNewDevInfo(toiletId, flag) {
      // 获取更新后对应公厕的信息统计
      let self = this;
      wisdomParkReport
        .getToiletNewDevDataList({ toiletId: toiletId })
        .then((res) => {
          console.log("获取厕所信息统计: ", res);
          if (res.code === "200") {
            //成功
            console.log(JSON.stringify(res));
            self.toilet_Man = res.data.male;
            self.toilet_Data = res.data.male;
            self.toilet_Woman = res.data.female;
            // self.toilet_ManCount = res.data.male.freeNum;
            // self.toilet_WomanCount = res.data.female.freeNum;
            // self.toiletAboutData = res.data;
            // nh3
            // h2s
            // humidity
            // temperature
            let male = res.data.male;
            self.radarChartData = [
              {
                value: [male.nh3, male.h2s, male.humidity, male.temperature],
              },
            ];
            self.toiletName = res.data.toiletName;
            var toilet = res.data;
            //男厕
            var maleToilet = toilet.male;
            var malePitList = maleToilet.pit || [];
            var malePitLen = malePitList.length;
            var freeNum = 0;
            for (var i = 0; i < malePitLen; i++) {
              var pit = malePitList[i];
              var state = pit.state;
              if (state == 0) {
                freeNum++;
              }
            }
            res.data.male.num = malePitLen; //总厕所数
            maleToilet.freeNum = freeNum; //空闲厕所数数
            maleToilet.usedNum = malePitLen - freeNum; //蹲坑人数
            maleToilet.nums = 3; //保洁次数
            maleToilet.worker = "张峰"; //保洁员
            maleToilet.exhaust = "开"; //排风扇
            if ((malePitLen - freeNum) / malePitLen >= 0.8) {
              maleToilet.toiletStatus = 2;
            } else {
              maleToilet.toiletStatus = 1;
            }
            maleToilet.qualityStatus = wisdomParkReport.calEnvironmentQuality(
              maleToilet.h2s,
              maleToilet.nh3
            ); //环境质量
            //女厕
            var femaleToilet = toilet.female;
            var femalePitList = femaleToilet.pit || [];
            var femalePitLen = femalePitList.length;
            var femaleFreeNum = 0;
            for (var i = 0; i < femalePitLen; i++) {
              var pit = femalePitList[i];
              var state = pit.state;
              if (state == 0) {
                femaleFreeNum++;
              }
            }
            femaleToilet.num = femalePitLen; //总厕所数
            femaleToilet.freeNum = femaleFreeNum; //空闲厕所数数
            femaleToilet.usedNum = femalePitLen - femaleFreeNum; //蹲坑人数
            femaleToilet.nums = 3; //保洁次数
            femaleToilet.worker = "陈燕"; //保洁员
            femaleToilet.exhaust = "开"; //排风扇
            if ((femalePitLen - femaleFreeNum) / femalePitLen >= 0.8) {
              femaleToilet.toiletStatus = 2;
            } else {
              femaleToilet.toiletStatus = 1;
            }
            femaleToilet.qualityStatus = wisdomParkReport.calEnvironmentQuality(
              femaleToilet.h2s,
              femaleToilet.nh3
            ); //环境质量
            self.toilet_ManCount = maleToilet.freeNum;
            self.toilet_WomanCount = femaleToilet.freeNum;
            self.setToiletData(toilet, flag);
            self.toiletAboutData = res.data;
            console.log(res.data, "res.data.male");
            self.toiletAllCount = res.data.male.flowIn + res.data.female.flowIn;
          }
        });
    },

    getToiletInfo(toiletId) {
      var self = this; //公厕信息接口
      this.toilet_Man;
      this.toilet_Woman;
      // var toiletId = "60659a9226b0670364e40adf";
      var toiletId = "fswh-01";
      wisdomParkReport
        .getToiletInfo({ parkId: 1, toiletId: toiletId })
        .then((res) => {
          if (res.code === "200") {
            //成功
            console.log(JSON.stringify(res));
            console.log("公厕信息汇总接口- ", res);
            self.toilet_Man = res.data.male;
            self.toilet_Data = res.data.male;
            self.toilet_Woman = res.data.female;
            self.toilet_ManCount = res.data.male.freeNum;
            self.toilet_WomanCount = res.data.female.freeNum;
            self.toiletAboutData = res.data;
          }
        });
    },

    setToiletData(data, flag) {
      var self = this;
      self.toiletsData[0].volume_man = data.male.temperature + "°C";
      self.toiletsData[0].volume_woman = data.female.temperature + "°C";
      self.toiletsData[1].volume_man = data.male.nh3 + "PPM";
      self.toiletsData[1].volume_woman = data.female.nh3 + "PPM";
      self.toiletsData[2].volume_man = "30%";
      self.toiletsData[2].volume_woman = "32%";
      self.toiletsData[3].volume_man = data.male.exhaust || "开";
      self.toiletsData[3].volume_woman = data.female.exhaust || "开";
      self.toiletsData[4].volume_man = data.male.num || 3;
      self.toiletsData[4].volume_woman = data.female.num || 3;
      self.toiletsData[5].volume_man = data.male.worker || "张峰";
      self.toiletsData[5].volume_woman = data.female.worker || "陈燕";
      if (!flag) {
        self.showToiletAbout = true;
      }
    },

    //公厕跳转详情页
    goto_AboutClick() {
      console.log("公厕跳转详情页");
      wisdomParkReport.toDeviceDetail(this, 2, this.toiletId);
    },

    toilet_ManClick() {
      console.log("点击男厕");
      this.toilet_Data = this.toilet_Man;
    },
    toilet_WomanClick() {
      console.log("点击女厕");
      this.toilet_Data = this.toilet_Woman;
    },
    getTreeHisReport() {
      var self = this;
      wisdomParkReport.getTreeHisReport({ parkId: 1 }).then((res) => {
        console.log("获取古树月份信息- ", res);
        if (res.code === "200") {
          //成功
          console.log(JSON.stringify(res));
          var dete = res.data;
          var index = 1;
          var timeData = [];
          var dataOneList = [];
          var dataTwoList = []; //数据
          for (let i = 0; i < dete.length; i++) {
            var month = dete[i].month.split("-");
            timeData.push(parseInt(month[1]) + "月");
            dataOneList.push(dete[i].normalNum);
            dataTwoList.push(dete[i].errorNum);
            if (dete.length - 1 == i) {
              timeData.reverse();
              dataOneList.reverse();
              dataTwoList.reverse();
              self.treeInfoBarChartData.push(timeData);
              self.treeInfoBarChartData.push(dataOneList);
              self.treeInfoBarChartData.push(dataTwoList);
            }
          }
        }
      });
    },
    getLampReport() {
      var self = this;
      wisdomParkReport.getLampReport({ parkId: 1 }).then((res) => {
        console.log("获取灯杆信息- ", res);
        if (res.code === "200") {
          //成功
          console.log(JSON.stringify(res));
          if (!res.data) {
            return;
          }
          self.deviceNum = res.data.deviceNum;
          self.total = res.data.total;
          if (self.total == 0) {
            res.data.total = 100;
          }
          self.pieChart1Data = [
            {
              name: "正常",
              value: (res.data.normalNum / res.data.deviceNum) * 100, //百分比
            },
            {
              name: "故障",
              value: (res.data.breakdownNum / res.data.deviceNum) * 100, //百分比
            },
          ];
          self.pieChart2Data = [
            {
              name: "实际用电",
              value: (res.data.totalUse / res.data.total) * 100, //百分比
            },
            {
              name: "节能用电",
              value: (res.data.totalSaving / res.data.total) * 100, //百分比
            },
          ];
        }
      });
    },
    goBack() {
      this.$router.push({
        name: "lightPoleMap",
      });
    },
  },
  mounted() {
    this.initData();
  },

  created() {},
};
</script>
<style lang="less" scoped>
#my_screen {
  min-width: 100%;
  min-height: 100%;
  // min-width: 1200px;/*no*/
  // padding: 20px 35px 42px 64px;
  background: url(images/bg.png) no-repeat;
  background-size: 100% 100%;
  background-position: center;
  // overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 0 !important;
  overflow-y: hidden !important;
  height: calc(100vh) !important;
  .posRow {
    position: absolute;
    top: 54px;
    width: 100%;
    height: 100%;
    z-index: 99999;
  }
}
.parkMap {
  position: absolute;
  top: -7%;
  left: 20%;
  width: 1250px;
  height: 1000px;
}
</style>
