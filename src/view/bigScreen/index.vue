<template>
  <div id="bigScreen">
    <div
      :class="{
        'inner-header-icon': !contentsHeader,
        'inner-header-icon-click': contentsHeader,
        'inner-header-icon-out': !contentsHeader
      }"
      @click="() => { contentsHeader = !contentsHeader; }"
    >
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="screenTitleBg" />
    <div
      class="flexCloumn screen_title"
      v-if="contentsHeader"
    >
      <div
        :class="activeFrame === 'index' && 'active'"
        @click="handleChangeFrame('index')"
      >
        概览
      </div>
      <div
        :class="activeFrame === 'lightPoleMap' && 'active'"
        @click="handleChangeFrame('lightPoleMap')"
      >
        智慧灯杆
      </div>
      <div
        :class="activeFrame === 'smokeDetectorMap' && 'active'"
        @click="handleChangeFrame('smokeDetectorMap')"
      >
        智慧园区
      </div>
	  <div
	    :class="activeFrame === 'wisdomParkReport' && 'active'"
	    @click="handleAccessPage('wisdomParkReport')"
	  >
	    智慧公园
	  </div>
      <div
        :class="activeFrame === 'toiltMap' && 'active'"
        @click="handleAccessPage('newToiltMap')"
      >
        智能公厕
      </div>
      <div
        :class="activeFrame === 'newToiltMap' && 'active'"
        @click="handleAccessPage('toiltMap')"
      >
        智慧公厕-网关
      </div>
      <div
        :class="activeFrame === 'smokeDetectorMap' && 'active'"
        @click="handleChangeFrame('smokeDetectorMap')"
      >
        智慧垃圾桶
      </div>
      <div
        :class="activeFrame === 'smokeDetectorMap' && 'active'"
        @click="handleChangeFrame('smokeDetectorMap')"
      >
        水质监测
      </div>
      <div
        :class="activeFrame === 'securityMonitoring' && 'active'"
        @click="handleChangeFrame('securityMonitoring')"
      >
        安防监控
      </div>
      <div
        :class="activeFrame === 'smokeAlarmLink' && 'active'"
        @click="handleChangeFrame('smokeAlarmLink')"
      >
        智能联动
      </div>
      <div
        :class="activeFrame === 'longRangControl' && 'active'"
        @click="handleChangeFrame('longRangControl')"
      >
        远程控制
      </div>
    </div>
    <div class="srceen_content">
      <el-row :gutter="10" class="indexMap" v-if="activeFrame === 'index'">
        <el-col :span="7">
          <div class="c_left">
            <DvBorderBox1 class="indexl_item_1" :dur="8" :color="['#02368E', '#3377E3']">
            <!-- <div class="l_item_1"> -->
              <div class="item_title">
                <span>灯杆监控状态</span>
              </div>
              <div
                id="l_bigchar_1"
              >
                <div
                  class="flexRow main"
                  v-for="(item, index) in searchModule"
                  :key="item.id"
                  v-if="searchModuleShow"
                >
                  <div class="icon flexCenter">
                    <i class="iconfont" :class="`icon-${item.icon} icon${index+1}`" />
                  </div>
                  <div class="info flexCloumn">
                    <div class="flexRow infoTitle">
                      {{item.title}}
                      <div class="number flexRow">
                        <div @click="() => onSearch({sensorTypeNo: item.id, [item.searchId]: 1})">{{item.normal}}</div>
                        <div class="unit">/</div>
                        <div class='last' @click="() => onSearch({sensorTypeNo: item.id,[item.searchId]: 2})">{{item.abnormal}}</div>
                    </div>
                    </div>
                    <div class="progress">
                      <electricLine :startColor="'#00FFE6'" :endColor="'#17A2FF'" :width="`${item.normal !== 0 ? parseInt((item.normal/(item.normal + item.abnormal)) * 100, 10) : 0}`" height="9" :className="'validProgress'" :click="() => onSearch({sensorTypeNo: item.id,[item.searchId]: 1})"/>
                      <electricLine startColor="#193C82" endColor="#193C82" width="100" height="15" :click="() => onSearch({sensorTypeNo: item.id,[item.searchId]: 2})"/>
                    </div>
                  </div>
                </div>
              </div>
            <!-- </div> -->
            </DvBorderBox1>
            <DvBorderBox1 class="indexl_item_2" :dur="8" :color="['#02368E', '#3377E3']">
              <div class="item_title">
                <span>灯杆能耗状态</span>
                <!-- <div class="time" v-if="data_2 && data_2.statisticsTime">
                  {{data_2.statisticsTime}}
                </div> -->
              </div>
              <highcharts :options="chart1Options" />
              <div class="flexRow labers">
              <Labers
                location="center"
                type="default"
                :items="[{
                    color: '#FFA81C',
                    name: '节能能耗/kwh',
                    width: '14px',
                    height: '10px'
                }, {
                    color: '#EA2E18',
                    name: '总能耗/J',
                    width: '14px',
                    height: '10px'
                }, {
                    color: '#4CDB9F',
                    name: '节能率',
                    width: '14px',
                }, {
                    color: '#9035DF',
                    name: '故障率',
                    height: '10px'
                }]"
              />
            </div>
              <!-- <div id="l_bigchar_2"></div> -->
            </DvBorderBox1>
            <DvBorderBox1 class="indexl_item_3" :dur="8" :color="['#02368E', '#3377E3']">
              <div class="item_title">
                <span>实时告警趋势</span>
              </div>
              <div class="indexcharTitle">
                <span :class="{'is-active': alarmTrendId === '1'}" @click="changeAlarmTrend('1')"><span>本日</span></span>
                <span :class="{'is-active': alarmTrendId === '2'}" @click="changeAlarmTrend('2')"><span>近30天</span></span>
              </div>
              <div id="l_bigchar_3"></div>
                <div class="flexRow labers">
                <Labers
                  location="center"
                  type="default"
                  :items="[{
                      color: '#FFD86A',
                      name: '一键报警',
                      width: '14px',
                      height: '10px'
                  }, {
                      color: '#1EDCFF',
                      name: '环境监测',
                      width: '14px',
                      height: '10px'
                  }, {
                      color: '#1E7AFF',
                      name: '摄像头告警',
                      width: '14px',
                      height: '10px'

                  }]"
                />
              </div>
            </DvBorderBox1>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="c_center">
            <div class="c_item_top">
              <div class="c_item_1">
                <el-row>
                  <el-col :span="4">
                    <div
                      class="c_item_1_count"
                      :style="{cursor: 'pointer'}"
                      :class="map.labers === 'lightPoleMap' ? 'is-active' : ''"
                      @click="handlePush('LAMP')"
                    >
                      <div class="c_item_1_count_img" >
                        <img src="../../common/images/bigscreen/img41.png"/>
                      </div>
                      <div class="c_item_1_count_val">
                        <div class="c_item_1_count_val_1">灯杆</div>
                        <div class="c_item_1_count_val_2">{{data_T.terminals || 0}}</div>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div
                      class="c_item_1_count"
                      :style="{cursor: 'pointer'}"
                      :class="map.labers === 'superviseMap' ? 'is-active' : ''"
                      @click="handlePush('AMBIENT')"
                    >
                      <div class="c_item_1_count_img" >
                        <img src="../../common/images/bigscreen/img42.png"/>
                      </div>
                      <div class="c_item_1_count_val">
                        <div class="c_item_1_count_val_1">环境监测</div>
                        <div class="c_item_1_count_val_2">{{data_T.ambients || 0}}</div>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div
                      class="c_item_1_count"
                      :style="{cursor: 'pointer'}"
                      :class="map.labers === 'securityMonitoring' ? 'is-active' : ''"
                      @click="handlePush('CAMERA')"
                    >
                      <div class="c_item_1_count_img"
                    >
                        <img src="../../common/images/bigscreen/img43.png"/>
                      </div>
                      <div class="c_item_1_count_val">
                        <div class="c_item_1_count_val_1">摄像头</div>
                        <div class="c_item_1_count_val_2">{{data_T.cameras || 0}}</div>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div
                      class="c_item_1_count"
                      :style="{cursor: 'pointer'}"
                      @click="handlePush('LED')"
                      :class="map.labers === 'publishPoleMap' ? 'is-active' : ''"
                    >
                      <div class="c_item_1_count_img"
                    >
                        <img src="../../common/images/bigscreen/img44.png"/>
                      </div>
                      <div class="c_item_1_count_val">
                        <div class="c_item_1_count_val_1">LED屏</div>
                        <div class="c_item_1_count_val_2">{{data_T.leds || 0}}</div>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div
                      class="c_item_1_count"
                      :style="{cursor: 'pointer'}" @click="handlePush('CALL')"
                      :class="map.labers === 'wisdomWarnMap' ? 'is-active' : ''"
                    >
                      <div class="c_item_1_count_img"

                    >
                        <img src="../../common/images/bigscreen/img45.png"/>
                      </div>
                      <div class="c_item_1_count_val">
                        <div class="c_item_1_count_val_1">报警器</div>
                        <div class="c_item_1_count_val_2">{{data_T.calls || 0}}</div>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div
                      class="c_item_1_count"
                      :style="{cursor: 'pointer'}"
                      @click="handlePush('AUDIO')"
                      :class="map.labers === 'wisdomBroadcastMap' ? 'is-active' : ''"
                    >
                      <div class="c_item_1_count_img"
                    >
                        <img src="../../common/images/bigscreen/img46.png"/>
                      </div>
                      <div class="c_item_1_count_val">
                        <div class="c_item_1_count_val_1">广播器</div>
                        <div class="c_item_1_count_val_2">{{data_T.cameras || 0}}</div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <div class="flexCenter homeIcon">
                  <i class="iconfont icon-shouye" @click="handleHome"/>
                </div>
              </div>
              <div class="c_item_2">
                <el-row>
                  <el-col :span="24" >
                    <slot name="center">
                      <div class="c_item_2_title">{{map.show ? map.title : '广东省智慧灯杆布点图'}}</div>
                      <div id="c_bigchar_1" v-if="!map.show" ref="c_bigchar_1"></div>
                      <canvas id="light-piller-layer" width="1680" height="1000" v-if="!map.show"></canvas>
	                    <canvas id="icon-layer" width="1680" height="1000" v-if="!map.show"></canvas>
                      <div class="centerMap" v-if="map.show">
                        <Map
                          @click="item => onCurrentMarker(item)"
                          @mouseover="item => onClickMarker(item)"
                          :nodeData="map.nodeData"
                          :loading="map.loading"
                        >
                          <template slot="content">
                            <div v-if="map.labers === 'lightPoleMap'">
                              <LightLabers />
                              <Information @close="map.infoShow = false" :show="map.infoShow" :info="map.info" :collapseActiveNames="map.collapseActiveNames"
                              @detail="handleLightDetail"/>
                            </div>
                            <div v-if="map.labers === 'securityMonitoring'">
                              <LightLabers />
                            </div>
                            <div v-if="map.labers === 'superviseMap'">
                              <AmbientLabers/>
                              <SuperviseInformation @close="map.infoShow = false" :show="map.infoShow" :info="map.info" :collapseActiveNames="map.collapseActiveNames"
                              @detail="handleSuperviseDetail"/>
                            </div>
                            <div v-if="map.labers === 'publishPoleMap'">
                              <LedLabers />
                              <PublishInformation @close="map.infoShow = false" :show="map.infoShow" :info="map.info" :effextArray="map.effextArray"
                              @detail="handlePublishDetail"/>
                            </div>
                            <div v-if="map.labers === 'wisdomWarnMap'">
                              <CallLabers />
                              <WarnInformation @close="map.infoShow = false" :show="map.infoShow" :info="map.info"
                              @detail="handleWarnDetail"/>
                            </div>
                            <div v-if="map.labers === 'wisdomBroadcastMap'">
                              <AudioLabers/>
                              <BroadcastInformation @close="map.infoShow = false" :show="map.infoShow" :info="map.info"
                              @detail="handleBroadcastDetail"/>
                            </div>
                          </template>
                        </Map>
                      </div>
                    </slot>
                  </el-col>
                </el-row>
              </div>
            </div>
            <DvBorderBox1 class="c_item_bottom">
              <div class="item_title">
                <span>环境监测数据</span>
              </div>
              <!-- <div class="c_item_5">
                <div class="item_title_s">
                  <span>环境监测数据</span>
                </div>
                <div class="time" v-if="data_7[0] && data_7[0].updateTime">
                  {{data_7[0].updateTime}}
                </div>
              </div> -->
              <div class="c_item_3">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <div class="c_item_3_1">
                      <div class="item_title_s">
                        <span>温度湿度</span>
                      </div>
                      <div class="legend_content">
                        <span class="wendu">温度</span>
                        <span class="shidu">湿度</span>
                      </div>
                      <div id="c_bigchar_5"></div>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="c_item_3_2">
                      <div class="item_title_s">
                        <span>空气质量</span>
                      </div>
                      <div class="legend_content">
                        <span>单位: ug/m³</span>
                      </div>
                      <div id="c_bigchar_3" class="flexCloumn">
                        <div :class="`lineTop flexRow is-active${curr_1}`">
                          <span
                            :key="item"
                            v-for="(item) in [2, 3, 4, 5]"
                            :class="`${curr_1 === item ? 'is-active' : ''}`"
                          />
                        </div>
                        <div class="lineCenter">
                          <div id="earth" :class="`current${curr_1}`">
                            <a-scene>
                              <a-camera position='0 0 3' user-height='0'></a-camera>
                              <a-sphere :src="earthImg" radius="1.5" segments-height="53">
                                <a-animation
                                  attribute="rotation"
                                  dur="10000"
                                  fill="forwards"
                                  to="0 360 0"
                                  easing="linear"
                                  repeat="indefinite"
                                ></a-animation>
                              </a-sphere>
                            </a-scene>
                          </div>
                        </div>
                        <div :class="`lineBottom flexRow is-active${curr_1}`">
                          <span
                            :key="item"
                            v-for="(item) in [2, 3, 4, 5]"
                            :class="`${curr_1 === item ? 'is-active' : ''}`"
                          />
                        </div>
                        <div class="flexRow bottonText">
                            <div class="flexCloumn">
                              <span>优</span>
                              <span>≥35</span>
                            </div>
                            <div class="flexCloumn">
                              <span>良</span>
                              <span>35-75</span>
                            </div>
                            <div class="flexCloumn">
                              <span>轻污染</span>
                              <span>75-115</span>
                            </div>
                            <div class="flexCloumn">
                              <span>中污染</span>
                              <span>115-150</span>
                            </div>
                            <div class="flexCloumn">
                              <span>重污染</span>
                              <span>150-250</span>
                            </div>
                            <div class="flexCloumn">
                              <span>严重污染</span>
                              <span>≥250</span>
                            </div>
                        </div>
                        <!-- <div class="level_1">
                          <span :class="curr_1">0-35</span>
                        </div>
                        <div class="level_2">
                          <span :class="curr_2">35-75</span>
                        </div>
                        <div class="level_3">
                          <span :class="curr_3">75-115</span>
                        </div>
                        <div class="level_4">
                          <span :class="curr_4">115-150</span>
                        </div>
                        <div class="level_5">
                          <span :class="curr_5">150-250</span>
                        </div>
                        <div class="level_6">
                          <span :class="curr_6">250</span>
                        </div> -->
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>
              <div class="c_item_4">
                <el-row :gutter="10">
                  <el-col :span="12">
                    <div class="c_item_4_1">
                      <div class="item_title_s">
                        <span>噪声</span>
                      </div>
                      <div class="legend_content">
                        <span>单位: 分贝</span>
                      </div>
                      <div id="c_bigchar_4"></div>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="c_item_4_2">
                      <div class="item_title_s">
                        <span>PM2.5PM10</span>
                      </div>
                      <div class="legend_content">
                        <span>单位：ug/m³</span>
                      </div>
                      <div id="c_bigchar_2"></div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </DvBorderBox1>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="c_right">
              <DvBorderBox1 class="r_item_1" :dur="8" :reverse="true" :color="['#02368E', '#3377E3']">
              <div class="item_title">
                <span>监控界面</span>
              </div>
              <el-row :gutter="10" style="text-align: center;">
                <el-col :span="24" class="videoContent">
                  <videoAddress
                    :srcUrl="`https://open.ys7.com/ezopen/h5/iframe_se?url=ezopen://RPUENL@open.ys7.com/E63112920/1.live&autoplay=0&audio=1&accessToken=${common.accessToken}&templete=2`"/>
                </el-col>
                <!-- <el-col :span="12" v-for="(item, index) in 2" :key="index+'_2'">
                  <!-- <img src="~common/images/bigscreen/p1.png" style="margin-top:10px" /> -->
                  <!-- <iframe
                    src="http://221.7.190.82:10800/play.html?channel=2&iframe=yes&aspect=640x360"
                    frameborder="0"
                    allowfullscreen
                    allow="autoplay"
                    border="0"
                    scrolling="no"
                  ></iframe>
                </el-col>
                <el-col :span="12" v-for="(item, index) in 2" :key="index+'_3'"> -->
                  <!-- <img src="~common/images/bigscreen/p1.png" style="margin-top:10px" /> -->
                  <!-- <iframe
                    src="http://221.7.190.82:10800/play.html?channel=3&iframe=yes&aspect=640x360"
                    frameborder="0"
                    allowfullscreen
                    allow="autoplay"
                    border="0"
                    scrolling="no"
                  ></iframe>
                </el-col> -->
              </el-row>
              <!-- <div class="r_item_1_img_content"> -->
              <!-- <div v-for="(item, index) in 6" :key="index"> -->
              <!-- <iframe src="http://221.7.190.82:10800/play.html?channel=1&iframe=yes&aspect=640x360" width="640" height="360" allowfullscreen allow="autoplay"></iframe>-->
              <!-- </div> -->
              <!-- </div> -->
            </DvBorderBox1>
            <DvBorderBox1 class="r_item_2" :dur="8" :reverse="true" :color="['#02368E', '#3377E3']">
              <div class="item_title">
                <span>烟感设备状态</span>
              </div>
              <div class="flexCloumn center">
                <div class="flexCloumn flexCenter mainCenter">
                  <span>{{rItem2.alarmData}}个</span>
                  <span>告警数</span>
                </div>
                <div class="flexRow mainFooter">
                  <span class="point"/>
                  <div class="flexRow text">
                    总数
                    <span>{{rItem2.totalData}}</span>
                    个
                  </div>
                </div>
              </div>
              <!-- <div class="legend_content">
                <span class="yizhanyong">报警数</span>
                <span class="weizhanyong">总数</span>
              </div>
              <div id="r_bigchar_1"></div> -->
            </DvBorderBox1>
            <DvBorderBox1 class="r_item_3" :dur="8" :reverse="true" :color="['#02368E', '#3377E3']">
              <div class="item_title">
                <span>烟感报警趋势</span>
              </div>
              <div class="indexcharTitle">
                <span :class="{'is-active': trendId === '1'}" @click="changeTrend('1')">
                  <span>本日</span>
                </span>
                <span :class="{'is-active': trendId === '2'}" @click="changeTrend('2')">
                  <span>近一周</span>
                </span>
                <span :class="{'is-active': trendId === '3'}" @click="changeTrend('3')">
                  <span>近30天
                    </span>
                 </span>
              </div>
              <div id="r_bigchar_2"></div>
              <div class="flexRow labers">
                <Labers
                  location="center"
                  type="default"
                  :items="[{
                    color: '#FFC27D',
                    name: '报警',
                    width: '14px',
                    height: '10px'
                  }, {
                    color: '#FF6848',
                    name: '故障',
                    width: '14px',
                    height: '10px'
                  }, {
                    color: '#1E7AFF',
                    name: '预警',
                    width: '14px',
                    height: '10px'

                  }]"
                />
              </div>
            </DvBorderBox1>
          </div>
        </el-col>
      </el-row>
      <LightPoleMap v-if="activeFrame === 'lightPoleMap'"/>
      <SmokeDetectorMap type="template" v-if="activeFrame === 'smokeDetectorMap'"/>
      <SecurityMonitoring v-if="activeFrame === 'securityMonitoring'"/>
      <SmokeAlarmLink type="template" v-if="activeFrame === 'smokeAlarmLink'"/>
      <LongRangControl type="template" v-if="activeFrame === 'longRangControl'"/>
      <!--
      <img src="./images/park01.jpg" style="width: 100%;height: 100%;" v-if="activeFrame === 'parkMap'" />
      <WisdomParkReport type="template" v-if="activeFrame === 'parkMap'"/>
      -->

    </div>
  </div>
</template>
<script>
import {
  mapGetters,
  mapMutations
} from 'vuex';
import * as echarts from 'echarts'; // 引入echarts
// import './js/aframe.min.js';
import { Chart } from 'highcharts-vue';
import highcharts from 'highcharts'
import highcharts3d from 'highcharts/highcharts-3d'
highcharts3d(highcharts)
import store from '@/store';
import electricLine from '@/components/electricLine';
import DvBorderBox1 from '@/components/test';
import Map from '@/view/index/lightPoleMap/map';
import Information from '@/view/index/lightPoleMap/components/information';
import SuperviseInformation from '@/view/index/superviseMap/components/information';
import PublishInformation from '@/view/index/publishPoleMap/components/information';
import WarnInformation from '@/view/index/wisdomWarnMap/components/information';
import BroadcastInformation from '@/view/index/wisdomBroadcastMap/components/information';
import LightPoleMap from '@/view/index/lightPoleMap/index';
import SmokeDetectorMap from '@/view/smokeDetector/smokeDetectorMap';

import WisdomParkReport from '@/view/index/wisdomPark/report/index';

import SecurityMonitoring from '@/view/monitoring/securityMonitoring';
import SmokeAlarmLink from '@/view/smokeDetector/smokeManage/cameraEvent';
import LongRangControl from '@/view/adminLight/lightingControl/longRangControl';
import LightLabers from '@/view/index/lightPoleMap/components/labers';
import LedLabers from '@/view/index/publishPoleMap/components/labers';
import AmbientLabers from '@/view/index/superviseMap/components/labers';
import AudioLabers from '@/view/index/wisdomBroadcastMap/components/labers';
import CallLabers from '@/view/index/wisdomWarnMap/components/labers';
import videoAddress from '@/view/smokeDetector/smokeDetectorMap/components/videoAddress';
import Labers from '@/components/labers';
import { COMMON_TEMPLATE_SERVICE_TYPE, MARKERS_TYPE } from 'util/constants';
import {
  screenBatteryByWeekAvg,
  screenDayLampByWeek,
  screenEnergyConsump,
  screenHourIndex,
  screenOneHourAvgPm,
  screenStatisticsDtoMap,
  screenTemperatureAndHumidity,
  screenTerminalListMap,
  getDeviceRealTimeAlarmTrendCount,
  getCameraMap
} from 'api/screen/index';
import {
  getAmbientMonitoringTrendStat
  ,
  getAmbientMonitoringMap,
  getAmbientMonitoringDtl
} from 'api/supervise';
import {
  generalView,
  getSmokeDetectorTrend,
  getSmokeDetectorRunStatus
} from 'api/admin';
import {
  getInfo,
  getBriefInfo
} from 'api/lightPoleMap';
import {
  getLedMap,
  selectRunningLedProgram,
  getAccessToken
} from 'api/screen';
import {
  getAudioDeviceMapInfo,
  getAudioDeviceDtl
} from 'api/brocast';
import {
  getAlarmCallMap,
  getAlarmCallDtl
} from 'api/wisdomMonitor';
import earthImg from './images/earth_atmos_4096.png';
import pieBgImg from 'common/images/bigscreen/img7.png';
let GD = require('common/js/map/guangdong.json');

export default {
  data () {
    return {
      earthImg,
      contentsHeader: false,
      city: '',
      area: '',
      data_1: [],
      data_2: [],
      data_3: [],
      data_4: [],
      data_5: [],
      data_6: [],
      data_7: [],
      data_8: [],
      data_9: [],
      data_10: [],
      data_T: {},
      curr_1: 1,
      alarmTrendId: null,
      trendId: null,
      onLoadId: null,
      lightTime: null,
      alarmTime: null,
      searchModuleShow: false,
      searchModule: [{
        id: 'LAMP',
        icon: 'dengpao-tianchong',
        title: '照明灯',
        startColor: '#4c99d0',
        endColor: '#D093FF',
        normal: 100,
        abnormal: 365,
        searchId: 's_lamp'
      }, {
        id: 'BATTERY',
        icon: 'chongdianzhuang',
        title: '充电桩',
        startColor: '#4c99d0',
        endColor: '#D093FF',
        normal: 100,
        abnormal: 365,
        searchId: 's_battery'
      }, {
        id: 'CAMERA',
        icon: 'jiankong',
        title: '监控视频',
        startColor: '#4c99d0',
        endColor: '#D093FF',
        normal: 100,
        abnormal: 365,
        searchId: 's_video'
      }, {
        id: 'AMBIENT',
        icon: 'huanjingjiance1',
        title: '环境监测器',
        startColor: '#4c99d0',
        endColor: '#D093FF',
        normal: 100,
        abnormal: 365,
        searchId: 's_wind'
      }, {
        id: 'LED',
        icon: 'led',
        title: 'LED显示屏',
        startColor: '#4c99d0',
        endColor: '#D093FF',
        normal: 100,
        abnormal: 365,
        searchId: 's_led'
      }, {
        id: 'AUDIO',
        icon: 'yinxiang',
        title: '广播器',
        startColor: '#4c99d0',
        endColor: '#D093FF',
        normal: 100,
        abnormal: 365,
        searchId: 's_broadcast'
      }, {
        id: 'CALL',
        icon: 'baojingqi',
        title: '报警器',
        startColor: '#4c99d0',
        endColor: '#D093FF',
        normal: 100,
        abnormal: 365,
        searchId: 's_call'
      }, {
        id: 'WIFI',
        icon: 'wifi1',
        title: '智能WIFI',
        startColor: '#4c99d0',
        endColor: '#D093FF',
        normal: 100,
        abnormal: 365,
        searchId: 's_wifi'
      }],
      map: {
        show: false,
        infoShow: false,
        collapseActiveNames: ['1'],
        effextArray: [],
        info: {},
        title: '地图',
        labers: undefined,
        center: {},
        nodeData: [],
        LAMP: [],
        AMBIENT: [],
        CAMERA: [],
        LED: [],
        CALL: [],
        AUDIO: []
      },
      activeFrame: undefined,
      chart1Options: {
        chart: {
          className: 'chartBg',
          backgroundColor: 'transparent',
          // plotBackgroundImage: pieBgImg,
          type: 'pie',
          height: '215px',
          options3d: {
            enabled: true,
            alpha: 60,
            beta: 0
          }

        },
        credits: {
          enabled: false
        },
        legend: {
          align: 'center'
        },
        title: {
          text: ''
        },
        tooltip: {
          pointFormat: '{series.value}'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            depth: 25,
            dataLabels: {
              enabled: true,
              format: '{y}',
              connectorColor: '#1B6CCC',
              color: '#fff',
              style: {
                'fontSize': '16px'
              }
            }
          }
        },
        series: []
      },
      rItem2: {
        totalData: 0,
        alarmData: 0
      },
      timer: null,
      disktimer: null
    };
  },
  components: {
    electricLine,
    Map,
    LightLabers,
    AmbientLabers,
    LedLabers,
    CallLabers,
    AudioLabers,
    Information,
    PublishInformation,
    SuperviseInformation,
    WarnInformation,
    BroadcastInformation,
    LightPoleMap,
    SmokeDetectorMap,
    WisdomParkReport,
    SecurityMonitoring,
    SmokeAlarmLink,
    LongRangControl,
    videoAddress,
    DvBorderBox1,
    Labers,
    highcharts: Chart
  },
  computed: {
    ...mapGetters(['common', 'openPage'])
  },
  methods: {
    ...mapMutations([
      'set_common'
    ]),
    getInit () {
      this.$nextTick(() => {
        this.init9();
        this.changeTrend('3');
        this.map.show = false;
        this.map.labers = undefined;
        // const _iframe = this.$refs.iframe.contentWindow;
        // console.dir(_iframe);
        // const divContent = _iframe.document.getElementsByClassName('panel-top');
        // console.dir(divContent)
      });
    },
    _generalView () {
      generalView().then(res => {
        if (res.code === '200') {
          const tableData = this.searchModule.map(data => {
            const findObj = res.data.find(da => da.deviceCategoryNo === data.id);
            if (findObj) {
              return {
                ...data,
                normal: findObj ? findObj.onlineCount : 0,
                abnormal: findObj ? findObj.offlineCount : 0
              }
            }
          });
          this.searchModule = tableData.filter(Boolean);
          this.searchModuleShow = true;
        }
      });
    },
    init1 () {
      let dom_1 = document.getElementById('l_bigchar_1');
      // let myChart = echarts.init(dom_1);
      // window.onresize = function () {
      //   myChart.resize();
      // };
      // let normals = []; // 正常数
      // let offLines = []; // 故障数
      // let date = []; // 故障数
      // this.data_1.map(item => {
      //   date.push(item.date);
      //   normals.push(item.normals);
      //   offLines.push(item.offLines);
      // });
      // let option = null;
      // option = {
      //   legend: {
      //     data: ['正常', '异常'],
      //     bottom: 0,
      //     right: 0,
      //     textStyle: {
      //       color: '#fff',
      //       fontSize: 12
      //     },
      //     itemWidth: 14,
      //     itemHeight: 10
      //   },
      //   grid: {
      //     left: '40px',
      //     right: '20px',
      //     top: '20px',
      //     bottom: '50px'
      //   },
      //   tooltip: {
      //     show: true,
      //     trigger: 'item'
      //   },
      //   xAxis: {
      //     type: 'category',
      //     axisTick: { show: false },
      //     axisLabel: {
      //       color: '#fff',
      //       fontSize: '10'
      //     },
      //     splitLine: {
      //       lineStyle: {
      //         width: 1,
      //         color: '#28335A'
      //       }
      //     },
      //     data: date
      //   },
      //   yAxis: {
      //     nameTextStyle: { padding: [0, 20, 0, 0], color: '#fff' },
      //     type: 'value',
      //     axisLabel: {
      //       color: '#fff',
      //       fontSize: '10'
      //     },
      //     //   min: 0,
      //     //   max: 600,
      //     //   interval: 100,
      //     splitLine: { show: false }, // 横向的线
      //     axisTick: { show: false }, // y轴的端点
      //     axisLine: { show: false } // y轴的线
      //   },
      //   // animationEasing: 'elasticOut',   //初始动画的缓动效果
      //   series: [
      //     {
      //       name: '正常',
      //       type: 'pictorialBar',
      //       barWidth: '15px',
      //       symbol: 'rect', // 图形形状
      //       symbolRepeat: 'true', // 指定图形元素是否重复
      //       symbolMargin: '30%', // 图形的两边间隔
      //       symbolClip: true, // 是否剪裁图形
      //       symbolSize: ['90%', '15%'], // 图形的大小
      //       itemStyle: {
      //         normal: {
      //           color: '#A46AFF'
      //         }
      //       },
      //       data: normals
      //     },
      //     {
      //       name: '异常',
      //       type: 'pictorialBar',
      //       barWidth: '15px',
      //       symbol: 'rect', // 图形形状
      //       symbolRepeat: 'true', // 指定图形元素是否重复
      //       symbolMargin: '30%', // 图形的两边间隔
      //       symbolClip: true, // 是否剪裁图形
      //       symbolSize: ['90%', '15%'], // 图形的大小
      //       itemStyle: {
      //         normal: {
      //           color: '#28BCD8'
      //         }
      //       },
      //       symbolOffset: ['130%', 0], // 偏移
      //       data: offLines
      //     }
      //   ]
      // };
      // myChart.setOption(option, true);
    },
    init2 () {
      let option = null;

      let colors = ['#FFA81C', '#EA2E18', '#42E3FF', '#9035DF'];
      let chartData = [
        [
          '节能能耗/度',
          parseInt(this.data_2.energySaving)
        ],
        [
          '总能耗/度',
          parseInt(this.data_2.totalEnergy)
        ],
        [
          '节能率',
          parseInt(this.data_2.energySavingRate)
        ],
        [
          '故障率',
          parseInt(this.data_2.failureRate)
        ]
      ];
      option = {
        ...this.chart1Options,
        colors: colors,
        series: [{
          type: 'pie',
          name: '能耗状态',
          data: chartData
        }]
      }
      this.chart1Options = option;
    },
    init3 () {
      let dom_3 = document.getElementById('l_bigchar_3');
      if (!dom_3) return;
      let myChart = echarts.init(dom_3);
      window.onresize = function () {
        myChart.resize();
      };
      let option = null;
      let ambientAlarmCount = [];
      let callAlarmCount = [];
      let cameraAlarmCount = [];
      let date = [];
      this.data_3.map(item => {
        date.push(item.simpleTimeAxis);
        ambientAlarmCount.push(item.ambientAlarmCount);
        callAlarmCount.push(item.callAlarmCount);
        cameraAlarmCount.push(item.cameraAlarmCount);
      });
      option = {
        color: ['#FFD86A', '#1EDCFF', '#1E7AFF'],
        grid: {
          left: '30px',
          right: '30px',
          top: '16px',
          bottom: '0px',
          containLabel: true
        },
        tooltip: {
          show: true,
          trigger: 'item'
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            color: '#fff',
            fontSize: '10'
          },
          axisLine: {
            lineStyle: {
              color: '#D9D9D9'
            },
            width: 5
          },
          axisTick: {
            show: true,
            alignWithLabel: true,
            lineStyle: {
              color: '#D9D9D9'
            }
          },
          data: date
        },
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              color: '#fff',
              fontSize: '10',
              lineHeight: '20'
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#132465'
              },
              width: 5
            },
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                color: '#12577F',
                type: 'dashed'
              }
            }
          }
        ],
        series: [
          {
            name: '一键报警',
            type: 'bar',
            stack: '总量',
            barWidth: '8',
            label: {
              show: false,
              position: 'insideRight'
            },
            data: callAlarmCount
          },
          {
            name: '环境监测',
            type: 'bar',
            stack: '总量',
            barWidth: '8',
            label: {
              show: false,
              position: 'insideRight'
            },
            data: ambientAlarmCount
          },
          {
            name: '摄像头告警',
            type: 'bar',
            stack: '总量',
            barWidth: '8',
            label: {
              show: false,
              position: 'insideRight'
            },
            data: cameraAlarmCount
          }
        ]
      };
      myChart.setOption(option, true);
    },
    init4 () {
      let cityName = '广东';
      let dom4 = document.getElementById('c_bigchar_1');
      if (!dom4) return;
      let mapLayer = echarts.init(dom4);
      let option = null;
      let offset = {
        三沙市: {
          left: 110,
          top: 18,
          width: 0.5
        }
      };
      echarts.registerMap(cityName, GD, cityName === '海南' ? offset : {}); // 导入地图数据
      let gdDatas = this.data_4;
      let mapData = GD.features;
      let gdGeoCoordMap = {};
      mapData.map(item => {
        gdGeoCoordMap[item.properties.name] = item.properties.cp;
      });
      let convertData = function (data) {
        let res = [];
        for (let i = 0; i < data.length; i++) {
          let geoCoord = gdGeoCoordMap[data[i].city];
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
        visualMap: {
          show: false,
          min: 0,
          // max: 220,
          text: ['高', '低'], // 文本，默认为数值文本
          calculable: true,
          inRange: {
            /* 低-高 */
            color: ['rgba(233, 63, 69, 1)']
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
            fontSize: 12,
            color: '#FEFFFF',
            fontWeight: '400'
          },
          layoutCenter: ['48%', '48%'],
          layoutSize: '100%',
          roam: false,
          zoom: 1.3,
          itemStyle: {
            borderColor: '#2BD9FF',
            borderWidth: 2,
            areaColor: '#007BC2',
            emphasis: {
              areaColor: '#007BC2',
              color: '#FEFFFF'
            }
          },
          emphasis: {
            label: {
              color: '#FEFFFF',
              areaColor: '#007BC2'
            }
          },
          zlevel: 3
        },
        series: [
          {
            name: cityName,
            type: 'map',
            aspectScale: 1,
            zoom: 1.3,
            layoutCenter: ['50%', '50%'],
            layoutSize: '100%',
            mapType: cityName,
            label: {
              show: false
            },
            itemStyle: {
              areaColor: '#1C60B9',
              borderWidth: 0,
              emphasis: {
                areaColor: '#1C60B9',
                color: '#1C60B9'
              }
            },
            emphasis: {
              areaColor: '#1C60B9',
              color: '#1C60B9'
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
              color: 'rgba(207, 119, 214, 1)',
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
              return 15 + val[2] * 0; // 圆环大小
            },
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
      // console.log(convertData(
      //   gdDatas
      //     .sort(function (a, b) {
      //       return Number(b.counts) - Number(a.counts);
      //     })
      //     .slice(0, 6)
      // ));
      // 画图
      if (option && typeof option === 'object') {
        mapLayer.setOption(option, true);
        mapLayer.on('click', this.handleCenterMap);
      }
      /** 灯柱 */

      let showMap = {
        '汕尾': {
          name: '汕尾市',
          rank: 1,
          position: [115.364238, 22.774485]
        }
      }

      let changeMap;
      changeMap = JSON.parse(JSON.stringify(showMap))

      const lightPillerLayer = document.getElementById('light-piller-layer')
      const iconLayer = document.getElementById('icon-layer')
      const lightPillerLayerConText = lightPillerLayer.getContext('2d');
      const iconLayerContext = iconLayer.getContext('2d');

      let img = new Image();
      // let timer = null;
      // let disktimer = null;
      let name;
      let validateName;
      let iconPosition;
      let sumY;
      mapLayer.on('click', (params) => {
        validateName = params.name;
        if (showMap[validateName]) {
          name = params.name
          this.timer && clearInterval(this.timer)
          this.disktimer && clearInterval(this.disktimer)
          iconLayerContext.clearRect(0, 0, iconLayer.width, iconLayer.height)
          if (changeMap[name]) {
            changeMap = JSON.parse(JSON.stringify(showMap))
            delete (changeMap[name])
            this.timer = setInterval(function () {
              // 这儿放要执行的代码, 参数在外面准备好
              iconAnimation(iconPosition)
            }, 20)
            sumY = 1
            this.disktimer = setInterval(function () {
              iconPosition = mapLayer.convertToPixel('geo', showMap[name].position)
              // 这儿放要执行的代码, 参数在外面准备好
            }, 150)
            // cityName.innerText = showMap[name].name;
          } else {
            changeMap = JSON.parse(JSON.stringify(showMap))
          }
        }
      });

      let iconChange = {
        abeam: 22,
        portrait: 9,
        height: 26
      }
      // let iconDraw = (iconPosition) => {
      //   iconLayerContext.beginPath();
      //   iconPosition = mapLayer.convertToPixel('geo', showMap[name].position)
      //   const styleColor = {
      //     r: 236,
      //     g: 68,
      //     b: 78
      //   }

      //   iconLayerContext.strokeStyle = 'rgba(' + styleColor.r + ',' + styleColor.g + ',' + styleColor.b + ',0.4)';
      //   // BezierEllipse1(iconLayerContext, iconPosition[0], iconPosition[1] + 12, 6, 2);
      //   BezierEllipse1(iconLayerContext, iconPosition[0], iconPosition[1], 6, 2);
      //   iconLayerContext.fillStyle = 'rgba(' + styleColor.r + ',' + styleColor.g + ',' + styleColor.b + ',0.6)';
      //   iconLayerContext.fill();
      //   iconLayerContext.closePath();

      //   iconLayerContext.beginPath();
      //   iconLayerContext.strokeStyle = 'rgba(' + styleColor.r + ',' + styleColor.g + ',' + styleColor.b + ',0.8)';
      //   // BezierEllipse1(iconLayerContext, iconPosition[0], iconPosition[1] + 12, iconChange.abeam, iconChange.portrait);
      //   BezierEllipse1(iconLayerContext, iconPosition[0], iconPosition[1], iconChange.abeam, iconChange.portrait);

      //   // if (showMap[name].rank == 1) {
      //   //   img.src = './img/icon1.png';
      //   // } else if (showMap[name].rank == 2) {
      //   //   img.src = './img/icon2.png';
      //   // } else if (showMap[name].rank == 3) {
      //   //   img.src = './img/icon3.png';
      //   // } else {
      //   //   img.src = './img/icon4.png';
      //   // }
      //   // iconLayerContext.drawImage(img, iconPosition[0] - 21, iconPosition[1] - iconChange.height, 40, 40);
      //   // iconLayerContext.drawImage(img, iconPosition[0] - 21, iconPosition[1] - iconChange.height - 12, 40, 40);
      //   iconLayerContext.closePath();
      // }

      let iconAdd;
      let iconHeight;
      let iconAnimation = (iconPosition) => {
        iconMove(); // 更新
        iconLayerContext.clearRect(0, 0, iconLayer.width, iconLayer.height); // 清除
        // iconDraw(iconPosition); // 绘制
      }
  	  let iconMove = () => {
        if (Math.floor(iconChange.abeam) === 16) {
          iconAdd = +0.1
        } else if (Math.floor(iconChange.abeam) === 22) {
          iconAdd = -0.1
        }
        if (Math.floor(iconChange.height) === 26) {
          iconHeight = +0.1
        } else if (Math.floor(iconChange.height) === 30) {
          iconHeight = -0.1
        }
        iconChange.abeam = iconChange.abeam + iconAdd
        iconChange.portrait = iconChange.portrait + iconAdd
        iconChange.height = iconChange.height + iconHeight
      }
      let change = {
        light: 60,
        abeam: 11,
        portrait: 5
      };
      let draw = () => {
        echarts.util.each(changeMap, (dataItem, idx) => {
          let geoCoord = showMap[idx].position;
          let coord = mapLayer.convertToPixel('geo', geoCoord);
          let linkColor = {
            r: 236,
            g: 68,
            b: 78
          }

          let grd = lightPillerLayerConText.createLinearGradient(coord[0] - 10, coord[1] + 9, coord[0], coord[1] - 151);
          grd.addColorStop(0, 'rgba(' + linkColor.r + ',' + linkColor.g + ',' + linkColor.b + ',' + change.light / 100 +
            ')');
          grd.addColorStop(1, 'rgba(255,255,255,0)');
          lightPillerLayerConText.shadowColor = 'rgba(' + linkColor.r + ',' + linkColor.g + ',' + linkColor.b + ',' +
            change.light / 100 + ')';
          lightPillerLayerConText.shadowOffsetX = 0;
          lightPillerLayerConText.shadowOffsetY = 10;
          lightPillerLayerConText.shadowBlur = 50;
          lightPillerLayerConText.beginPath();
          lightPillerLayerConText.fillStyle = grd;
          // 绘制矩形
          // lightPillerLayerConText.fillRect(coord[0] - 8, coord[1] + 9, 16, -80);
          lightPillerLayerConText.fillRect(coord[0] - 8, coord[1], 16, -150);
          lightPillerLayerConText.closePath();

          lightPillerLayerConText.beginPath();
          lightPillerLayerConText.fillStyle = 'rgba(' + linkColor.r + ',' + linkColor.g + ',' + linkColor.b + ',1)';
          lightPillerLayerConText.strokeStyle = 'rgba(' + linkColor.r + ',' + linkColor.g + ',' + linkColor.b + ',0.8)';
          // BezierEllipse1(lightPillerLayerConText, coord[0], coord[1] + 9, 8, 2);
          BezierEllipse1(lightPillerLayerConText, coord[0], coord[1], 8, 2);
          lightPillerLayerConText.fill();
          lightPillerLayerConText.closePath()

          lightPillerLayerConText.beginPath();
          lightPillerLayerConText.lineWidth = 1;
          lightPillerLayerConText.strokeStyle = 'rgba(' + linkColor.r + ',' + linkColor.g + ',' + linkColor.b + ',0.6)';
          // BezierEllipse1(lightPillerLayerConText, coord[0], coord[1] + 9, change.abeam, change.portrait);
          BezierEllipse1(lightPillerLayerConText, coord[0], coord[1], change.abeam, change.portrait);
          lightPillerLayerConText.closePath();
        })
      }
      let lightAdd;
      let abearAdd;
      let move = () => {
        if (change.light === 60) {
          lightAdd = +1
        } else if (change.light === 100) {
          lightAdd = -1
        }
        change.light = change.light + lightAdd

        if (Math.floor(change.abeam) === 11) {
          abearAdd = +0.1
        } else if (Math.floor(change.abeam) === 18) {
          abearAdd = -0.1
        }
        // console.log(change.abeam)
        change.abeam = change.abeam + abearAdd
        change.portrait = change.portrait + abearAdd
      }
      let BezierEllipse1 = (context, x, y, a, b) => {
        // 关键是bezierCurveTo中两个控制点的设置
        // 0.5和0.6是两个关键系数（在本函数中为试验而得）
        let ox = 0.5 * a;
        let oy = 0.6 * b;
        context.save();
        context.translate(x, y);
        context.beginPath();
        // 从椭圆纵轴下端开始逆时针方向绘制
        context.moveTo(0, b);
        context.bezierCurveTo(ox, b, a, oy, a, 0);
        context.bezierCurveTo(a, -oy, ox, -b, 0, -b);
        context.bezierCurveTo(-ox, -b, -a, -oy, -a, 0);
        context.bezierCurveTo(-a, oy, -ox, b, 0, b);
        context.closePath();
        context.stroke();
        context.restore();
      };
      let animation = () => {
        move(); // 更新
        lightPillerLayerConText.clearRect(0, 0, lightPillerLayer.width, lightPillerLayer.height); // 清除
        draw(); // 绘制
        requestAnimationFrame(animation); // 循环
      }
      animation();
    },
    init5 () {
      let dom_5 = document.getElementById('c_bigchar_2');
      if (!dom_5) return;
      let myChart = echarts.init(dom_5);
      window.onresize = function () {
        myChart.resize();
      };
      let hours = []; // 小时
      let pmList = []; // PM2.5
      let pmTenList = []; // PM10
      this.data_8.map(item => {
        hours.push(item.simpleTimeAxis);
        pmList.push(item.pmValue);
        pmTenList.push(item.pmTenValue);
      });
      let option = null;
      option = {
        grid: {
          left: '15px',
          right: '16px',
          top: '20px',
          bottom: '0px',
          containLabel: true
        },
        tooltip: {
          show: true,
          trigger: 'item'
        },
        xAxis: [ {
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            color: '#fff',
            fontSize: '10'
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#12577F',
              type: 'dashed'
            }
          },
          axisTick: {
            show: false,
            alignWithLabel: true,
            lineStyle: {
              color: '#28335A'
            }
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: '#132465'
            }
          },
          data: hours
        }],
        yAxis: {
          type: 'value',
          name: '', // 左
          axisLabel: {
            color: '#fff',
            fontSize: '10'
          },
          splitLine: {
            lineStyle: {
              color: '#12577F',
              type: 'dashed'
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#132465'
            }
          },
          nameTextStyle: {
            color: '#fff'
          },
          splitArea: {
            show: false
          }
        },
        series: [
          {
            name: 'PM2.5',
            type: 'line',
            symbol: 'none',
            lineStyle: {
              normal: {
                width: 3,
                color: {
                  type: 'linear',
                  colorStops: [{
                    offset: 0,
                    color: '#22CFFF' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: '#22CFFF' // 100% 处的颜色
                  }],
                  globalCoord: false // 缺省为 false
                }
              }
            },
            itemStyle: {
              normal: {
                color: '#22CFFF',
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                    offset: 1,
                    color: 'rgba(34,207,255,0.3)'
                  },
                  {
                    offset: 0,
                    color: 'rgba(34,207,255,0)'
                  }
                  ])
                }
              }
            },
            tooltip: {
              show: 'true',
              formatter: '时间：{b}<br />PM2.5：{c}ug/m³'
            },
            animationEasing: 'cubicInOut',
            animationDuration: 1000,
            smooth: false,
            data: pmList
          },
          {
            name: 'PM10',
            type: 'line',
            animationEasing: 'cubicInOut',
            animationDuration: 1000,
            smooth: false,
            symbol: 'none',
            lineStyle: {
              normal: {
                width: 3,
                color: {
                  type: 'linear',
                  colorStops: [{
                    offset: 0,
                    color: '#7BFFF2' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: '#7BFFF2' // 100% 处的颜色
                  }],
                  globalCoord: false // 缺省为 false
                }
              }
            },
            itemStyle: {
              normal: {
                color: '#7BFFF2',
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                    offset: 1,
                    color: 'rgba(123,255,242, 0.3)'
                  },
                  {
                    offset: 0,
                    color: 'rgba(123,255,242, 0)'
                  }
                  ])
                }
              }
            },
            tooltip: {
              show: 'true',
              formatter: '时间：{b}<br />PM10：{c}ug/m³'
            },
            data: pmTenList
          }
        ]
      };
      myChart.setOption(option, true);
    },
    init6 () {},
    init7 () {
      let dom_7 = document.getElementById('c_bigchar_4');
      if (!dom_7) return;
      let myChart = echarts.init(dom_7);
      window.onresize = function () {
        myChart.resize();
      };
      let option = null;
      let hours = []; // 小时
      let avgs = []; // 分贝
      this.data_8.map(item => {
        hours.push(item.simpleTimeAxis);
        avgs.push(item.noiseValue);
      });
      option = {
        tooltip: {
          show: true,
          trigger: 'item'
        },
        grid: {
          left: '30px',
          right: '10px',
          top: '16px',
          bottom: '0px',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            axisLabel: {
              color: 'fff',
              fontSize: '10'
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#132465'
              }
            },
            axisTick: {
              show: false,
              alignWithLabel: true,
              lineStyle: {
                color: '#28335A'
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#12577F',
                type: 'dashed'
              }
            },
            data: hours
          }
        ],
        yAxis: {
          type: 'value',
          name: '', // 左
          min: 0,
          axisLabel: {
            formatter: '{value}',
            textStyle: {
              color: '#fff',
              fontSize: '10'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#132465'
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#12577F',
              type: 'dashed'
            }
          }
        },
        series: [
          {
            name: '分贝',
            type: 'bar',
            barWidth: '8',
            itemStyle: {
              color: '#28BCD8'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(40,188,216,.3)'
                },
                {
                  offset: 1,
                  color: 'rgba(40,188,216,.9)'
                }
              ])
            },
            tooltip: {
              show: 'true',
              formatter: '时间：{b}<br />噪声：{c}分贝'
            },
            data: avgs
          }
        ]
      };
      myChart.setOption(option, true);
    },
    init8 () {
      let dom_8 = document.getElementById('c_bigchar_5');
      if (!dom_8) return;
      let myChart = echarts.init(dom_8);
      window.onresize = function () {
        myChart.resize();
      };
      let option = null;
      let hours = []; // 小时
      let avgs1 = []; // 温度
      let avgs2 = []; // 湿度
      this.data_8.map(item => {
        hours.push(item.simpleTimeAxis);
        avgs1.push(item.temperatureValue);
        avgs2.push(item.humidityValue);
      });
      option = {
        // title: {
        //   top: '0',
        //   left: 'center',
        //   textStyle: {
        //     color: '#FFF',
        //     align: 'center'
        //   }
        // },
        grid: {
          left: '15px',
          right: '5px',
          top: '20px',
          bottom: '0px',
          containLabel: true
        },
        tooltip: {
          show: true,
          trigger: 'item'
        },
        legend: {
          show: false,
          bottom: '0',
          left: '0',
          icon: 'stack',
          itemWidth: 14,
          itemHeight: 3,
          textStyle: {
            color: '#fff',
            fontSize: 12
          },
          data: ['温度', '湿度']
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLabel: {
              color: '#fff',
              fontSize: '10'
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#12577F',
                type: 'dashed'
              }
            },
            axisTick: {
              show: false,
              alignWithLabel: true,
              lineStyle: {
                color: '#28335A'
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#132465'
              }
            },
            data: hours
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '', // 左
            axisLabel: {
              formatter: '{value}℃',
              textStyle: {
                color: '#fff',
                fontSize: '12'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#132465'
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#12577F',
                type: 'dashed'
              }
            }
          },
          {
            type: 'value',
            name: '', // 右
            axisLabel: {
              formatter: '{value}%',
              textStyle: {
                color: '#fff',
                fontSize: '10'
              }
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#132465'
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#132465'
              }
            }
          }
        ],
        series: [
          {
            name: '温度',
            type: 'line',
            symbol: 'none',
            smooth: false,
            itemStyle: {
              normal: {
                color: '#30FFA8',
                lineStyle: {
                  color: '#30FFA8',
                  width: 3
                },
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 0,
                      color: 'rgba(48,255,168,0)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(48,255,168,0.3)'
                    }
                  ])
                }
              }
            },
            tooltip: {
              show: 'true',
              formatter: '时间：{b}<br />温度：{c}℃'
            },
            data: avgs1
          },
          {
            name: '湿度',
            type: 'line',
            symbol: 'none',
            smooth: false,
            itemStyle: {
              normal: {
                color: '#FFC55B',
                lineStyle: {
                  color: '#FFC55B',
                  width: 3
                },
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 0,
                      color: 'rgba(138,68,222,0)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(138,68,222,0.3)'
                    }
                  ])
                }
              }
            },
            yAxisIndex: 1,
            tooltip: {
              show: 'true',
              formatter: '时间：{b}<br />湿度：{c}%'
            },
            data: avgs2
          }
        ]
      };
      myChart.setOption(option, true);
    },
    init9 () {
      getSmokeDetectorRunStatus().then(res => {
        if (res.code === '200') {
          this.rItem2.totalData = res.data.totalCount;
          this.rItem2.alarmData = res.data.alarmCount;
          // let dom_9 = document.getElementById('r_bigchar_1');
          // let myChart = echarts.init(dom_9);
          // window.onresize = function () {
          //   myChart.resize();
          // };
          // let option = null;
          // let total = 100; // 数据总数
          // let datas = [(alarmData / totalData) * 100];
          // option = {
          //   xAxis: {
          //     max: total,
          //     splitLine: {
          //       show: false
          //     },
          //     axisLine: {
          //       show: false
          //     },
          //     axisLabel: {
          //       show: false
          //     },
          //     axisTick: {
          //       alignWithLabel: true,
          //       lineStyle: {
          //         color: '#28335A'
          //       }
          //     }
          //   },
          //   yAxis: [
          //     {
          //       type: 'category',
          //       inverse: false,
          //       axisLine: {
          //         show: false
          //       },
          //       axisTick: {
          //         show: false
          //       },
          //       axisLabel: {
          //         show: false
          //       }
          //     }
          //   ],
          //   grid: {
          //     left: 50,
          //     top: 90, // 设置条形图的边距
          //     right: 50,
          //     bottom: 90
          //   },
          //   series: [
          //     {
          //       // 内
          //       type: 'bar',
          //       barWidth: 28,
          //       silent: true,
          //       itemStyle: {
          //         normal: {
          //           color: '#f56c6c',
          //           fontFamily: 'DINAlternate'
          //         }
          //       },
          //       label: {
          //         normal: {
          //           formatter: params => {
          //             let text;
          //             text =
          //               '{f| ' + ((params.data * 100) / total).toFixed(0) + '%}';
          //             return text;
          //           },
          //           rich: {
          //             f: {
          //               color: '#ffffff',
          //               fontFamily: 'DINAlternate'
          //             }
          //           },
          //           fontFamily: 'DINAlternate',
          //           position: 'left',
          //           distance: 10, // 向右偏移位置
          //           show: true
          //         }
          //       },
          //       data: datas,
          //       z: 1,
          //       animationEasing: 'elasticOut'
          //     },

          //     {
          //       // 分隔
          //       type: 'pictorialBar',
          //       itemStyle: {
          //         normal: {
          //           color: '#1A58A7',
          //           fontFamily: 'DINAlternate'
          //         }
          //       },
          //       symbolRepeat: 'fixed',
          //       symbolMargin: 2,
          //       symbol: 'rect',
          //       symbolClip: true,
          //       symbolSize: [3, 28],
          //       symbolPosition: 'start',
          //       symbolOffset: [3, -4],
          //       symbolBoundingData: this.total,
          //       data: [total],
          //       z: 2,
          //       animationEasing: 'elasticOut'
          //     },
          //     {
          //       // label
          //       type: 'pictorialBar',
          //       symbolBoundingData: total,
          //       itemStyle: {
          //         normal: {
          //           color: 'none'
          //         }
          //       },
          //       label: {
          //         normal: {
          //           formatter: params => {
          //             let text;
          //             text =
          //               '{f| ' +
          //               (100 - (params.data * 100) / total).toFixed(0) +
          //               '%}';
          //             return text;
          //           },
          //           rich: {
          //             f: {
          //               color: '#ffffff',
          //               fontFamily: 'DINAlternate'
          //             }
          //           },
          //           fontFamily: 'DINAlternate',
          //           position: 'right',
          //           distance: 10, // 向右偏移位置
          //           show: true
          //         }
          //       },
          //       data: datas,
          //       z: 0
          //     },

          //     {
          //       name: '外框',
          //       type: 'bar',
          //       barGap: '-130%', // 设置外框粗细
          //       data: [total],
          //       barWidth: 44,
          //       itemStyle: {
          //         normal: {
          //           // barBorderRadius: [5, 5, 5, 5],
          //           color: 'transparent', // 填充色
          //           barBorderColor: '#5769BE', // 边框色
          //           barBorderWidth: 1 // 边框宽度
          //         }
          //       },
          //       z: 0
          //     }
          //   ]
          // };
          // myChart.setOption(option, true);
        }
      });
    },
    changeTrend (index) {
      const indexType = {
        '1': '',
        '2': 7,
        '3': 30
      }
      if (this.trendId !== index) {
        this.trendId = index;
        this.init10({
          timeInterval: indexType[index]
        });
      }
    },
    changeAlarmTrend (index) {
      const indexType = {
        '1': 6,
        '2': 4
      }
      if (this.alarmTrendId !== index) {
        this.alarmTrendId = index;
        this._screenBatteryByWeekAvg(indexType[this.alarmTrendId])
      }
    },
    init10 (timeInterval) {
      getSmokeDetectorTrend(timeInterval).then(res => {
        if (res.code === '200') {
          const init2Data = res.data;
          const dom_2 = document.getElementById('r_bigchar_2');
          if (!dom_2) return;
          let myChart = echarts.init(dom_2);
          let option = null;
          const fontColor = '#30eee9';
          let alarmCount = [];
          let faultCount = [];
          let warningCount = [];
          let date = [];
          let all = [];
          res.data.map(item => {
            date.push(item.time);
            alarmCount.push(item.alarmCount);
            faultCount.push(item.faultCount);
            warningCount.push(item.warningCount);
            all.push(100);
          });
          let ylMax = Math.max(...alarmCount);
          let ylMmin = 0;
          let y2Max = Math.max(...faultCount);
          let y2Mmin = 0;
          let y3Max = Math.max(...warningCount);
          let y3Mmin = 0;
          let legend = [{
            name: '报警',
            icon: 'rect'
          }, {
            name: '故障',
            icon: 'rect'
          }, {
            name: '预警',
            icon: 'rect'
          }];
          const color = ['#FFC27D', '#FF6848', '#1E7AFF'];
          option = {
            grid: {
              left: '10px',
              right: '10px',
              top: '20px',
              bottom: '20px',
              containLabel: true
            },
            tooltip: {
              show: 'true',
              trigger: 'axis',
              axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              },
              formatter: function (prams) {
                return `<div style="font-size:12px;">${prams[0].name}</div>
            <div style="font-size:12px;">${prams[0].seriesName}：${prams[0].data}次</div>
            <div style="font-size:12px;">${prams[1].seriesName}：${prams[1].data}次</div>
            <div style="font-size:12px;">${prams[2].seriesName}：${prams[2].data}次</div>
            `;
              }
            },
            color: color,
            legend: {
              show: false,
              orient: 'horizontal',
              itemHeight: 10,
              itemWidth: 10,
              textStyle: { color: '#fff', fontSize: 12 },
              bottom: '0px',
              right: 'auto',
              data: legend
            },
            yAxis: [
              {
                type: 'value',
                axisTick: {
                  show: false // 隐藏Y轴刻度
                },
                axisLabel: {
                  color: '#A0ACD8',
                  fontSize: 12
                },
                axisLine: {
                  show: false,
                  lineStyle: {
                    color: '#0F6384'
                  }
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: '#12577F',
                    type: 'dashed'
                  }
                }
              },
              {
                type: 'value',
                gridIndex: 0,
                min: 0,
                max: 100,
                splitNumber: 6,
                splitLine: {
                  show: false,
                  lineStyle: {
                    color: '#28335A'
                  }
                },
                axisLine: {
                  show: false,
                  lineStyle: {
                    color: '#0F6384'
                  }
                },
                axisTick: {
                  show: false
                },
                axisLabel: {
                  show: false
                },
                splitArea: {
                  show: false
                }
              }
            ],
            xAxis: {
              type: 'category',
              boundaryGap: true, // 坐标轴两边留白
              axisTick: {
                show: false // 隐藏Y轴刻度
              },
              axisLabel: {
                color: '#A8EAFF',
                fontSize: 10
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#12577F',
                  type: 'dashed'
                }
              },
              data: date
            },
            series: [
              {
                name: legend[0].name,
                type: 'bar',
                barWidth: 7,
                stack: '1',
                showBackground: false,
                itemStyle: {
                  normal: {
                    show: true,
                    color: '#FF6A6A'
                  }
                },
                data: alarmCount,
                zlevel: 2
              },
              {
                name: legend[1].name,
                type: 'bar',
                barWidth: 7,
                stack: '1',
                showBackground: false,
                itemStyle: {
                  normal: {
                    show: true,
                    color: '#48F7B2'
                  }
                },
                data: faultCount,
                zlevel: 2
              },
              {
                name: legend[2].name,
                type: 'bar',
                barWidth: 7,
                stack: '1',
                showBackground: false,
                itemStyle: {
                  normal: {
                    show: true,
                    color: '#3FB9FF'
                  }
                },
                data: warningCount,
                zlevel: 2
              }
            ]
          };
          myChart.setOption(option, true);
          window.onresize = function () {
            myChart.resize();
          };
        }
      });
    },
    // 先获取地图数据
    _screenTerminalListMap () {
      let params = {
        area: '',
        city: '',
        type: null
      };
      screenTerminalListMap(params).then(res => {
        const { data } = res;
        this.data_4 = data;
        this.$nextTick(() => {
          this.init4();
        });
      });
    },
    // 灯杆监控状态
    _screenDayLampByWeek () {
      let params = {
        area: '',
        city: '',
        type: null
      };
      screenDayLampByWeek(params).then(res => {
        const { data } = res;
        this.data_1 = data;
        this.$nextTick(() => {
          // this.init1();
        });
      });
    },
    // 灯杆能耗状态
    _screenEnergyConsump () {
      let params = {
        area: '',
        city: '',
        type: null
      };
      screenEnergyConsump(params).then(res => {
        const { data } = res;
        this.data_2 = {
          ...data
          // statisticsTime: moment(data.statisticsTime).format('YYYY-MM-DD HH:mm:ss')
        };
        this.$nextTick(() => {
          this.init2();
        });
      });
    },
    // 灯杆能耗状态
    _screenBatteryByWeekAvg (index) {
      let params = {
        dateInterval: index
      };
      getDeviceRealTimeAlarmTrendCount(params).then(res => {
        const { data } = res;
        this.data_3 = data;
        this.$nextTick(() => {
          this.init3();
        });
      });
    },
    // 大气压监测
    _screenHourIndex_1 () {
      let params = {
        dateInterval: 6
      };
      getAmbientMonitoringTrendStat(params).then(res => {
        const { data } = res;
        this.data_5 = data;
        this.$nextTick(() => {
        });
      });
    },
    // 噪声监测
    _screenHourIndex_2 () {
      let params = {
        area: '',
        city: '',
        type: 2
      };
      screenHourIndex(params).then(res => {
        const { data } = res;
        this.data_7 = data;
        this.$nextTick(() => {
          this.init7();
        });
      });
    },
    // 温度湿度监测
    _screenTemperatureAndHumidity () {
      let params = {
        area: '',
        city: '',
        type: null
      };
      // 湿度
      screenTemperatureAndHumidity(params).then(res => {
        const { data } = res;
        this.data_8 = data;
        this.$nextTick(() => {
          this.init8();
          this.init7();
          this.init5();
        });
      });
    },
    // 空气质量
    _screenOneHourAvgPm () {
      let params = {
        area: '',
        city: '',
        type: null
      };
      screenOneHourAvgPm(params).then(res => {
        const { data } = res;
        this.data_6 = Number(data.pm);
        if (this.data_6 >= 0 && this.data_6 <= 35) {
          this.curr_1 = 1;
        } else if (this.data_6 > 35 && this.data_6 <= 75) {
          this.curr_1 = 2;
        } else if (this.data_6 > 75 && this.data_6 <= 115) {
          this.curr_1 = 3;
        } else if (this.data_6 > 115 && this.data_6 <= 150) {
          this.curr_1 = 4;
        } else if (this.data_6 > 150 && this.data_6 <= 250) {
          this.curr_1 = 5;
        } else if (this.data_6 > 250) {
          this.curr_1 = 6;
        }
      });
    },
    async handlePush (path) {
      let title = '';
      let labers = ''
      this.map.loading = true;
      this.map.labers = undefined;
      this.map.nodeData = [];
      this.lightTime = null;
      clearInterval(this.lightTime);
      this.alarmTime = null;
      clearInterval(this.alarmTime);
      switch (path) {
        case 'LAMP':
          title = '灯杆地图';
          if (this.map[path].length === 0) {
            await this._getLAMPInfo(path);
            this.lightTime = setInterval(async () => {
              if (this.map.labers === 'lightPoleMap') {
                await this._getLAMPInfo(path);
                this.map.nodeData = this.map[path];
              }
            }, this.$store.state.updateTime.lampTime * 1000);
          }
          labers = 'lightPoleMap';
          break;
        case 'AMBIENT':
          title = '环境监测地图';
          if (this.map[path].length === 0) {
            await this._getAMBIENTInfo(path);
          }
          labers = 'superviseMap';
          break;
        case 'CAMERA':
          title = `摄像头地图`;
          if (this.map[path].length === 0) {
            await this._getCameraInfo(path);
          }
          labers = 'securityMonitoring';
          break;
        case 'LED':
          title = 'LED屏地图';
          if (this.map[path].length === 0) {
            await this._getLEDInfo(path);
          }
          labers = 'publishPoleMap';
          break;
        case 'CALL':
          title = '报警器地图';
          if (this.map[path].length === 0) {
            await this._getCALLInfo(path);
            this.alarmTime = setInterval(async () => {
              if (this.map.labers === 'wisdomWarnMap') {
                await this._getCALLInfo(path);
                this.map.nodeData = this.map[path];
              }
            }, this.$store.state.updateTime.alarmCallTime * 1000);
          }
          labers = 'wisdomWarnMap';
          break;
        case 'AUDIO':
          title = '广播器地图';
          if (this.map[path].length === 0) {
            await this._getAUDIOInfo(path);
          }
          labers = 'wisdomBroadcastMap';
          break;
        default:
      }
      this.map.show = true;
      this.map.title = title;
      this.map.labers = labers;
      this.map.nodeData = this.map[path];
      this.map.loading = false;
      this.map.infoShow = false;
      this.map.info = {};
    },
    onCurrentMarker (target) {
      if (this.map.labers === 'lightPoleMap') {
        this.handleChangeFrame('lightPoleMap')
      } else {
        // routePush({
        //   name: this.map.labers,
        //   parames: {
        //     ...target
        //   }
        // });
        const parames = {
          ...target
        }
        store.commit('set_common', {
          [this.map.labers]: parames
        });
        const detailURL = this.$router.resolve({
          name: this.map.labers,
          query: {
          }
        })
        window.open(detailURL.href, '_blank')
      }
    },
    activeGetInfo (item) {
      switch (this.map.labers) {
        case 'lightPoleMap':
          this._getLightBriefInfo(item.imei);
          break;
        case 'superviseMap':
          this._getSuperviseBriefInfo(item);
          break;
        case 'securityMonitoring':
          break;
        case 'publishPoleMap':
          this._getLedBriefInfo(item);
          break;
        case 'wisdomWarnMap':
          this._getWarnBriefInfo(item);
          break;
        case 'wisdomBroadcastMap':
          this._getBroadcastBriefInfo(item);
          break;
      };
      this.zoomTarget(item);
    },
    zoomTarget (item) {
      const nodeData = this.map.nodeData.map(marker => {
        if (marker.imei === item.imei) {
          this.map.center = {
            lng: +marker.position.lng,
            lat: +marker.position.lat
          }
          this.map.info.type = marker.status;
          return {
            ...marker,
            url: marker.current,
            size: {width: 45, height: 70}
          }
        }
        return {
          ...marker,
          url: marker.normal,
          size: {width: 17, height: 32}
        }
      });
      this.map.nodeData = nodeData;
    },
    onClickMarker (target) {
      if (this.tableActiveId !== target.imei) {
        this.map.tableActiveId = target.imei;
        this.activeGetInfo(target);
      }
    },
    _getLightBriefInfo (imei) {
      getBriefInfo(imei).then(res => {
        if (res.code === '200') {
          // let infos = {};
          // Object.keys(this.info).map(info => {
          //   infos[info] = res.data[info];
          // });
          const deviceAmbientData = res.data.terminalDeviceModuleDtos.find(dto => dto.deviceTypeNo === 'AMBIENT');
          const deviceLampData = res.data.terminalDeviceModuleDtos.find(dto => dto.deviceTypeNo === 'LAMP');
          const deviceCallData = res.data.terminalDeviceModuleDtos.find(dto => dto.deviceTypeNo === 'CALL');
          const deviceCameraData = res.data.terminalDeviceModuleDtos.find(dto => dto.deviceTypeNo === 'CAMERA');
          if (!deviceAmbientData) {
            this.map.collapseActiveNames = ['2'];
          } else {
            this.map.collapseActiveNames = ['1', '2'];
          }
          this.map.info = {
            // ...infos,
            ...res.data,
            deviceCameraData: deviceCameraData || {},
            deviceAmbientData: deviceAmbientData || {},
            deviceAmbientDataDto: deviceAmbientData ? deviceAmbientData.deviceAmbientDataDto : {},
            deviceLampDto: deviceLampData ? deviceLampData.deviceLampDto : {},
            deviceCallData: deviceCallData || {},
            type: this.map.info.type
          };
          this.map.infoShow = true;
        }
      });
    },
    _getSuperviseBriefInfo (item) {
      const ambientTypes = MARKERS_TYPE['AMBIENT'];
      const parames = {
        deviceName: item.deviceName,
        deviceNo: item.deviceNo,
        installAddress: item.installAddress,
        serialNumber: item.serialNumber
      };
      getAmbientMonitoringDtl(item.serialNumber).then(res => {
        if (res.code === '200') {
          const status = this.getAmbientStatus(res.data);
          this.map.info = {
            ...item,
            statusText: ambientTypes[status] && ambientTypes[status].text,
            ...res.data
          };
          this.map.infoShow = true;
        }
      });
    },
    _getLedBriefInfo (item) {
      selectRunningLedProgram(item.imei).then(res => {
        if (res.code === '200') {
          this.map.info = {
            ...item,
            power: res.data.power,
            rectType: res.data && res.data.ledRects[0].rectType,
            ledRects: res.data && res.data.ledRects
          };
          const effextArray = this.map.info.ledRects && this.map.info.ledRects[0].ledMedias.map(medias => {
            const { types } = this.$_useTypes(COMMON_TEMPLATE_SERVICE_TYPE);
            return {
              ...medias,
              Type: types[medias.mediaType],
              Src: medias.source
            }
          });
          this.map.effextArray = effextArray;
          this.map.infoShow = true;
        }
      });
    },
    _getWarnBriefInfo (item) {
      const parames = {
        deviceName: item.deviceName,
        deviceNo: item.deviceNo,
        installAddress: item.installAddress,
        serialNumber: item.serialNumber
      };
      const warnTypes = MARKERS_TYPE['CALL'];
      getAlarmCallDtl(parames).then(res => {
        if (res.code === '200') {
          const status = this.getCALLStatus(res.data);
          this.map.info = {
            ...item,
            statusText: warnTypes[status] && warnTypes[status].text,
            ...res.data
          };
          this.map.infoShow = true;
        }
      });
    },
    _getBroadcastBriefInfo (item) {
      getAudioDeviceDtl(item.serialNumber).then(res => {
        if (res.code === '200') {
          this.map.info = {
            ...item,
            ...res.data
          };
          this.map.infoShow = true;
        }
      });
    },
    _getLAMPInfo (path) {
      const lightTypes = MARKERS_TYPE[path];
      return getInfo().then(res => {
        if (res.code === '200') {
          this.map[path] = res.data.map(data => {
            const status = this.getLampStatus(data);
            return {
              ...data,
              size: {width: 17, height: 32},
              status,
              url: lightTypes[status] && lightTypes[status].normal,
              current: lightTypes[status] && lightTypes[status].current,
              normal: lightTypes[status] && lightTypes[status].normal,
              zIndex: data.terminalPosition === 2 ? 1 : 2,
              position: {
                lng: +data.longitude,
                lat: +data.latitude
              }
            }
          });
        }
      });
    },
    _getCameraInfo (path) {
      const lightTypes = MARKERS_TYPE[path];
      return getCameraMap({}).then(res => {
        if (res.code === '200') {
          this.map[path] = res.data.map(data => {
            const status = this.getLampStatus(data);
            return {
              ...data,
              size: {width: 17, height: 32},
              status,
              url: lightTypes[status] && lightTypes[status].normal,
              current: lightTypes[status] && lightTypes[status].current,
              normal: lightTypes[status] && lightTypes[status].normal,
              zIndex: data.terminalPosition === 2 ? 1 : 2,
              position: {
                lng: +data.longitude,
                lat: +data.latitude
              }
            }
          });
        }
      });
    },
    _getLEDInfo (path) {
      const lightTypes = MARKERS_TYPE[path];
      return getLedMap().then(res => {
        if (res.code === '200') {
          this.map[path] = res.data.map(data => {
            const status = data.power;
            return {
              ...data,
              size: {width: 17, height: 32},
              status,
              url: lightTypes[status] && lightTypes[status].normal,
              current: lightTypes[status] && lightTypes[status].current,
              normal: lightTypes[status] && lightTypes[status].normal,
              zIndex: data.terminalPosition === 2 ? 1 : 2,
              position: {
                lng: +data.longitude,
                lat: +data.latitude
              }
            }
          });
        }
      });
    },
    _getAUDIOInfo (path) {
      const lightTypes = MARKERS_TYPE[path];
      return getAudioDeviceMapInfo().then(res => {
        if (res.code === '200') {
          this.map[path] = res.data.map(data => {
            const status = data.onlineStatus;
            return {
              ...data,
              size: {width: 17, height: 32},
              status,
              url: lightTypes[status] && lightTypes[status].normal,
              current: lightTypes[status] && lightTypes[status].current,
              normal: lightTypes[status] && lightTypes[status].normal,
              zIndex: data.terminalPosition === 2 ? 1 : 2,
              position: {
                lng: +data.longitude,
                lat: +data.latitude
              }
            }
          });
        }
      });
    },
    getLampStatus (data) {
      let status = 1;
      if (data.onlineStatus !== 1) {
        status = 3;
      }
      if (data.callAlarmStatus > 1) {
        status = 2;
      }
      return status || 1;
    },
    getAmbientStatus (data) {
      let status = 1;
      if (data.onlineStatus === 1) {
        if (data.alarmStatus === 0) {
          status = 1;
        } else {
          status = 2;
        }
      }
      if (data.onlineStatus === 2) {
        status = 3;
      }
      if (data.onlineStatus === 3) {
        status = 4;
      }
      return status;
    },
    _getAMBIENTInfo (path) {
      const ambientTypes = MARKERS_TYPE[path];
      return getAmbientMonitoringMap({}).then(res => {
        if (res.code === '200') {
          this.map[path] = res.data.map(data => {
            const status = this.getAmbientStatus(data);
            return {
              ...data,
              size: {width: 17, height: 32},
              status,
              url: ambientTypes[status] && ambientTypes[status].normal,
              current: ambientTypes[status] && ambientTypes[status].current,
              normal: ambientTypes[status] && ambientTypes[status].normal,
              // zIndex: data.terminalPosition === 2 ? 1 : 2,
              position: {
                lng: +data.longitude,
                lat: +data.latitude
              }
            }
          });
        }
      });
    },
    getCALLStatus (data) {
      let status = 1;
      if (data.onlineStatus === 1 && (data.alarmCallStatus === 2 || data.alarmCallStatus === 3)) {
        status = 2
      }
      if (data.onlineStatus === 1 && data.alarmCallStatus === 1) {
        status = 1;
      }
      if (data.onlineStatus === 2 || data.onlineStatus === 3) {
        status = 3;
      }
      return status;
    },
    _getCALLInfo (path) {
      const warnTypes = MARKERS_TYPE[path];
      return getAlarmCallMap({}).then(res => {
        if (res.code === '200') {
          this.map[path] = res.data.map(data => {
            const status = this.getCALLStatus(data);
            return {
              ...data,
              size: {width: 17, height: 32},
              status,
              url: warnTypes[status] && warnTypes[status].normal,
              current: warnTypes[status] && warnTypes[status].current,
              normal: warnTypes[status] && warnTypes[status].normal,
              // zIndex: data.terminalPosition === 2 ? 1 : 2,
              position: {
                lng: +data.longitude,
                lat: +data.latitude
              }
            }
          });
        }
      });
    },
    // 地图统计
    _screenStatisticsDtoMap () {
      let params = {
        area: '',
        city: '',
        type: null
      };
      screenStatisticsDtoMap(params).then(res => {
        const { data } = res;
        this.data_T = data;
      });
    },
    onLoadData () {
      this._screenStatisticsDtoMap();
      this._screenTerminalListMap();
      this._screenDayLampByWeek();
      this._screenEnergyConsump();
      this.changeAlarmTrend('2');
      this._screenOneHourAvgPm();
      this._generalView();
      // this._screenHourIndex_1();
      // this._screenHourIndex_2();
      this._screenTemperatureAndHumidity();
    },
    handleHome () {
      if (this.map.show) {
        this.map.show = false;
      }
    },
    handleChangeFrame (frame) {
      this.set_common({
        screenFrame: frame
      });
      this.activeFrame = frame;
      this.contentsHeader = !this.contentsHeader;
    },
    // 页面跳转
    handleAccessPage (name) {
      console.log(name, 'name')
      this.activeFrame = name
      this.$router.push({
        name: name
      })
    },
    _getAccessToken () {
      getAccessToken().then(res => {
        if (res.code === '200') {
          this.set_common({
            accessToken: res.data
          });
        }
      });
    },
    init () {
      this.onLoadData();
      this.onLoadId = setInterval(() => {
        if (this.openPage === 'bigScreen') {
          this.onLoadData();
        } else {
          this.onLoadId = null;
          clearInterval(this.onLoadId);
        }
      }, 30000);
    },
    handleCenterMap (val) {
      if (val.componentSubType === 'effectScatter') {
        this.handleChangeFrame('lightPoleMap')
      }
    },
    handleLightDetail (row) {
      // routePush({
      //   title: '远程控制',
      //   name: 'longRangControl',
      //   parames: {
      //     ...row
      //   },
      //   query: {
      //     activeNumber: row.serialNumber
      //   }
      // });
      const parames = {
        ...row
      }
      store.commit('set_common', {
        'longRangControl': parames
      });
      store.commit('set_menuTags', {
        icon: '',
        title: '远程控制',
        name: 'longRangControl'
      });
      const detailURL = this.$router.resolve({
        name: 'longRangControl',
        query: {
          activeNumber: row.serialNumber
        }
      })
      window.open(detailURL.href, '_blank')
    },
    handlePublishDetail (row) {
      // routePush({
      //   title: '一键控屏',
      //   name: 'fastScreen',
      //   parames: {
      //     ...row
      //   },
      //   query: {
      //     activeNumber: row.serialNumber
      //   }
      // });
      const parames = {
        ...row
      }
      store.commit('set_common', {
        'fastScreen': parames
      });
      store.commit('set_menuTags', {
        icon: '',
        title: '一键控屏',
        name: 'fastScreen'
      });
      const detailURL = this.$router.resolve({
        name: 'fastScreen',
        query: {
          activeNumber: row.serialNumber
        }
      })
      window.open(detailURL.href, '_blank')
    },
    handleSuperviseDetail (row) {
      // routePush({
      //   title: '智慧监测实时监控',
      //   name: 'superviseTimeMonitoring',
      //   parames: {
      //     ...row
      //   },
      //   query: {
      //     serialNumber: row.serialNumber
      //   }
      // });
      const parames = {
        ...row
      }
      store.commit('set_common', {
        'superviseTimeMonitoring': parames
      });
      store.commit('set_menuTags', {
        icon: '',
        title: '智慧监测实时监控',
        name: 'superviseTimeMonitoring'
      });
      const detailURL = this.$router.resolve({
        name: 'superviseTimeMonitoring',
        query: {
          serialNumber: row.serialNumber
        }
      })
      window.open(detailURL.href, '_blank')
    },
    handleWarnDetail (row) {
      // routePush({
      //   name: 'fastWarn',
      //   parames: {
      //     ...row
      //   },
      //   query: {
      //     serialNumber: row.serialNumber
      //   }
      // });
      const parames = {
        ...row
      }
      store.commit('set_common', {
        'fastWarn': parames
      });
      store.commit('set_menuTags', {
        icon: '',
        title: '',
        name: 'fastWarn'
      });
      const detailURL = this.$router.resolve({
        name: 'fastWarn',
        query: {
          serialNumber: row.serialNumber
        }
      })
      window.open(detailURL.href, '_blank')
    },
    handleBroadcastDetail (row) {
      // routePush({
      //   title: '智慧广播远程控制',
      //   name: 'broadcastTimeMonitoring',
      //   parames: {
      //     ...row
      //   },
      //   query: {
      //     activeNumber: row.serialNumber
      //   }
      // });
      const parames = {
        ...row
      }
      store.commit('set_common', {
        'broadcastTimeMonitoring': parames
      });
      store.commit('set_menuTags', {
        icon: '',
        title: '智慧广播远程控制',
        name: 'broadcastTimeMonitoring'
      });
      const detailURL = this.$router.resolve({
        name: 'broadcastTimeMonitoring',
        query: {
          activeNumber: row.serialNumber
        }
      })
      window.open(detailURL.href, '_blank')
    }
  },
  watch: {
    activeFrame (val) {
      if (this.activeFrame === 'index') {
        // this.getInit();
        this.init();
      } else {
        this.alarmTrendId = null;
        this.trendId = null;
        this.onLoadId = null;
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.activeFrame = this.common.screenFrame || 'index';
      if (this.activeFrame === 'index') {
        // this.getInit();
      }
      if (!this.common.accessToken) {
        this._getAccessToken();
      }
    });
  },
  created () {
    this.init();
    if (this.$route.query && this.$route.query.from == 'lightPoleDetail') {
      this.handleChangeFrame('longRangControl')
    }
  },
  destroyed () {
    this.set_common({
      screenFrame: 'index'
    });
    this.onLoadId && clearInterval(this.onLoadId);
    this.lightTime && clearInterval(this.lightTime);
    this.alarmTime && clearInterval(this.alarmTime);
    this.timer && clearInterval(this.timer);
    this.disktimer && clearInterval(this.disktimer);
  }
};
</script>
<style lang="less">
#bigScreen {
  height: 100%;
  min-width: 1200px;/*no*/
  padding: 20px 35px 42px 64px;
  background: url(~common/images/bigscreen/bg.png) no-repeat;
  background-size: 100% 100%;
  background-position: center;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  &::-webkit-scrollbar {
    width: 3px;
    background-color: transparent;
  }
  .inner-header{
    background-color: rgba(0,0,0,1);
    width: 100%;
    height: 50px;
    position: absolute;
    top: 0px;
    left: 0px;
  }

  .inner-nav{
    background-color: rgba(0,0,0,0.9);
    width: 100%;
    position: absolute;
    top: 50px;
    left: 0px;
    padding-top: 30px;
    padding-bottom: 80px;
    display: none;
  }
  .inner-nav a{
    display: inline-block;
    line-height: 50px;
    text-decoration: none;
    width: 80%;
    margin-left: 10%;
    color: #FFFFFF;
    border-bottom: solid 1px rgba(255,255,255,0.3);
    -webkit-transition: all 0.5s;
    -moz-transition: all 0.5s;
    -o-transition: all 0.5s;
    transition: all 0.5s;
    font-weight:300;
  }
  .inner-nav a:hover{
    color: rgba(255,255,255,0.4);
    border-bottom: solid 1px rgba(255,255,255,0.2);
  }
  .screenTitleBg{
    height: 72px;
    width: 100%;
    background: url(~common/images/bigscreen/title_bg.png) no-repeat;
    background-size: contain;
    background-position: center;
    padding-bottom: 12px;
    justify-content: space-between;
    align-items: flex-end;
  }

  .indexcharTitle{
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    >span{
      width: 62px;/*no*/
      height: 20px;/*no*/
      margin: 0 10px;/*no*/
      border: 1px solid #2184C9;/*no*/
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #47B3FF;
      cursor: pointer;
      transform: skewX(-45deg);
      >span{
        transform: skewX(45deg);
        font-size: 12px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: left;
        color: #ffffff;
        line-height: 17px;
      }
      &.is-active{
        background: #2D86A7;
        border: 1px solid #2FBFF8;
        font-size: 12px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #FFFFFF;
      }
    }
  }
  .srceen_content {
    height: calc(100% - 120px);
    display: flex;
    flex: 1;
    box-sizing: border-box;
    justify-content: space-between;
    width: 100%;
    >.el-row{
      width: 100%;
      >.el-col{
        height: 100%;
      }
    }
    .c_left {
      height: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .c_center {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .c_item_top, .c_item_bottom{
        display: flex;
        flex-direction: column;
      }
      .c_item_top {
        flex: 3;
        padding-top: 15px;/*no*/
      }
      .c_item_bottom{
        flex: 2;
        .border{
          display: none;
        }
      }
    }
    .c_right {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .c_left, .c_center, .c_right {
      >.el-row{
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
    }
    /**左边 */
    .indexl_item_1,
    .indexl_item_2,
    .indexl_item_3,
    .r_item_1,
    .r_item_2,
    .r_item_3 {
      width: 100%;
      padding: 0 10px 16px;
      margin-bottom: 16px;
      background: rgba(27, 99, 189, 0.134);
      // border: 1px solid;
      // border-image: linear-gradient(
      //     90deg,
      //     rgba(2, 54, 142, 0.36),
      //     rgba(102, 160, 255, 0.36)
      //   )
      //   1 1;
      .labers{
        min-width: 60%;
        margin: 0 auto;
      }
    }
    .indexMap{
      .item_title{
        position: absolute !important;
        top: 0;
        left: 0;
        right: 0;
      }
    }
    .border-box-content{
      padding-top: 35px;/*no*/
      display: flex;
      flex-direction: column;
    }
    .indexl_item_1 {
      display: flex;
      flex: 3;
      background: transparent !important;
      padding-left: 0;
      padding-right: 0;
      margin-right: -20px;/*no*/
      margin-top: -30px;/*no*/
      right: 0;
      .title-left{
        left: 30px;
      }
      .titleBg{
        left: 30px;
        width: calc(100% - 60px);
      }
      .title-center{
        left: 65px;
      }
      .title-right{
        left: auto;
        right: 30px;
      }
      .border{
        display: none;
      }
      .item_title{
        span{
          margin-left:140px !important;
        }
      }
      .border-box-content{
        width: calc(100% + 200px);
      }
      #l_bigchar_1 {
        height: 100%;
        margin-top: 20px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        overflow: hidden;
        // justify-content: space-between;
        .main{
          height: 60px;
          width: calc(50% - 15px);
          margin-right: 10px;
          background: url('~common/images/bigscreen/img2.png') no-repeat center;
          background-size: 100% 100%;
          padding:7px;
          margin-bottom: 10px;
          align-items: center;
          .icon{
            position: relative;
            width: 46px;
            height: 46px;
            margin-right: 5px;
             background: url('~common/images/bigscreen/img3.png') no-repeat center;
             background-size: 100% 100%;
             i{
               font-size: 30px;
               background-image: -webkit-linear-gradient(-90deg, #FFFFFF 20%, #C2FFF3 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
             }
             &::after, &::before{
               content: '';
                width: 126px;
                height: 1px;/*no*/
                background: #1570d9;
                position: absolute;
                right: -126px;
                bottom: 21px;/*no*/
             }
             &::before{
               width: 106px;
               right: -100px;
               bottom: 0;
             }
          }
          .info{
            height: 46px;
            flex: 1;
            justify-content: space-between;
            padding: 0px 0 3px;/*no*/
            .infoTitle{
              justify-content: space-between;
              font-size: 16px;
              font-family: PingFangSC, PingFangSC-Semibold;
              font-weight: 600;
              text-align: left;
              color: #ffffff;
            }
            .number{
              .unit{
                margin: 0 10px;
              }
              .last{
                color: #1570D9;
              }
            }
            .progress{
              position: relative;
              .validProgress{
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                left: 0;
                right: 0;
                z-index: 1;
              }
              .line{
                &::before{
                  content: none;
                }
              }
            }
          }
          &:nth-of-type(2n){
            margin-right: 0;
          }
          &:nth-of-type(1) {
            margin-left: 20px;
          }
          &:nth-of-type(3) {
            margin-left: 10px;
          }
          &:nth-of-type(5) {
            margin-bottom: 0;
          }
          &:last-child {
            // margin-right: 20px;/*no*/
            margin-bottom: 0;
          }
        }
        .labers{
          position: absolute;
          right: 0;
          top: 8px;
          >div{
            font-family:PingFangSC-Medium,PingFang SC;
            font-weight:500;
            color:rgba(239,247,255,1);
            font-size: 12px;
            margin-right: 10px;/*no*/
            padding-left: 20px;/*no*/
            position: relative;
            &::after{
              content: '';
              width: 14px;/*no*/
              height: 10px;/*no*/
              border-radius: 2px;/*no*/
              position: absolute;
              background: #ae2dd1;
              top: 50%;
              left: 0;
              transform: translateY(-50%);
            }
            &:last-child{
              &::after{
                background: #29366c;
                content: '';
                width: 14px;/*no*/
                height: 10px;/*no*/
                position: absolute;
                top: 50%;
                left: 0;
                transform: translateY(-50%);
              }
            }
          }
        }
      }
    }
    .indexl_item_2 {
      display: flex;
      flex: 4;
      .highcharts-container {
        // height: 150px !important;

      }
      .chartBg{
        position: relative;
        img {
          height: 49%;
          width: auto;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

      }
      .highcharts-plot-background{
        background: url(~common/images/bigscreen/img7.png) no-repeat center;
        background-size: auto 100%;
      }
      .border-box-content{
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .labers{
        min-width: 85%;
        .laberItem{
          color: #ffffff;
        }
      }
    }
    .indexl_item_3 {
      display: flex;
      flex: 4;
      // height: 314px;
      margin-bottom: 0;
      #l_bigchar_3 {
        // height: 214px;
        display: flex;
        flex: 1;
      }
      .border-box-content{
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .labers{
        min-width: 75%;
        .laberItem{
          color: #ffffff;
        }
      }
    }
    .r_item_2 {
      // height: 314px;
      display: flex;
      flex: 3;
      #r_bigchar_1 {
        height: 90px;
        margin-bottom: 15px;
      }
      .border-box-content{
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .center{
        height: calc(100% - 20PX);
        margin-top: 20px;
        .mainCenter{
          background: url(~common/images/bigscreen/img51.png) no-repeat center;
          background-size: auto 100%;
          padding-bottom: 20px;
          flex: 3;
          span{
            display: flex;
            text-align: center;
            &:first-child{
              color: #fff;
              font-size: 34px;
              font-family: PangMenZhengDao;
              text-align: left;
              color: #ffffff;
              line-height: 34px;
              letter-spacing: 1px;
            }
            &:last-child{
              font-size: 18px;
              font-family: PingFangSC, PingFangSC-Regular;
              font-weight: 400;
              text-align: left;
              color: #ffffff;
              line-height: 18px;
              letter-spacing: 1px;
              margin-top: 5px;
            }
          }
        }
        .mainFooter {
          margin-top: 12px;
          align-items: center;
          justify-content: center;
          .point{
            width: 8px;
            height: 8px;
            opacity: 1;
            background: #33ffea;
            border-radius: 50%;
          }
          .text{
            font-size: 16px;
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            text-align: left;
            color: #cbdcff;
            line-height: 22px;
            letter-spacing: 1px;
            margin-left: 12px;
            align-items: center;
            span{
              font-size: 18px;
              font-family: PingFangSC, PingFangSC-Semibold;
              font-weight: 600;
              text-align: left;
              color: #ffffff;
              line-height: 25px;
              letter-spacing: 1px;
              margin-left: 12px;
              margin-right: 10px;
            }
          }
        }
      }
      // .legend_content{
      //   bottom: -15px !important;/*no*/
      // }
    }
    .c_item_top{
      // align-items: center;
    }
    /**中间 */
    .c_item_1 {
      width: calc(100% - 20px);
      margin: 0 auto;
      user-select: none;
      // padding: 10px 15px;
      position: relative;
      background: linear-gradient(180deg,rgba(6,53,131,0.76), rgba(15,101,185,0.76));
      border: 1px solid #1777ff;
      // display: flex;
      // justify-content: space-between;
      &:before{
        content: '';
        width: 7px;
        height: 50px;
        background: url(~common/images/bigscreen/img5.png) no-repeat center;
        background-size: 100%;
        position: absolute;
        top: 50%;
        left: -6px;
        transform: translateY(-50%);
      }
      &:after{
        content: '';
        width: 7px;
        height: 50px;
        background: url(~common/images/bigscreen/img5.png) no-repeat center;
        background-size: 100%;
        position: absolute;
        top: 50%;
        right: -6px;
        transform: translateY(-50%) rotateY(-180deg);
      }
      .el-col{
        width: auto;
        min-width: 16.6%;
      }
      .c_item_1_count {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 10px 11px;
        .c_item_1_count_img {
          width: 40px;
          height: 40px;
          // margin-right: 10px;
          // background: rgba(81, 136, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          img{

          }

        }
        .c_item_1_count_val {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .c_item_1_count_val_1 {
            font-size: 14px;
            font-family: PingFangSC, PingFangSC-Semibold;
            font-weight: 600;
            text-align: left;
            color: #b5e3ff;
          }
          .c_item_1_count_val_2 {
            font-size: 18px;
            font-family: PingFangSC, PingFangSC-Semibold;
            font-weight: 600;
            text-align: left;
            color: #feffff;
          }
        }
        &.is-active{
          background: linear-gradient(180deg,#00205e 0%, #003373 97%);
        }
      }
      .homeIcon{
        position: absolute;
        right: 0px;/*no*/
        bottom: -38px;
        width: 28px;
        height: 28px;
        background: linear-gradient(180deg,rgba(39,171,255,0.54), rgba(17,114,255,0.54));
        cursor: pointer;
        z-index: 10000;
        i{
          font-size: 18px;
          background-image: linear-gradient(180deg, #FBFDFF 0%, #A1CEFF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
    }
    .c_item_2 {
      display: flex;
      flex: 1;
      position: relative;
      >.el-row{
        width: 100%;
        height: 100%;
        .el-col{
          height: 100%;
          display: flex;
          flex-direction: column;
        }
      }
      .c_item_2_title {
        position: absolute;
        top: 10px;/*no*/
        left: 10px;/*no*/
        user-select: none;
        // padding-left: 30px;
        font-size: 22px;
        font-family: PangMenZhengDao;
        color: rgba(255, 255, 255, 1);
        line-height: 25px;
        letter-spacing: 3px;
        background: linear-gradient(
          180deg,
          rgba(255, 255, 255, 1) 0%,
          rgba(152, 191, 254, 1) 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        z-index: 1;
      }
      #c_bigchar_1{
        height: 100%;
        // min-height: 550px;
      }
      #light-piller-layer{
        position: absolute;
        z-index: 1;
        pointer-events: none;
      }
      #icon-layer{
        position: absolute;
        z-index: 2;
        pointer-events: none;
      }
      .centerMap{
        height: 100%;
        margin: 10px 0;
        // min-height: 480px;
        >div:first-child:not(#lightMap){
          display: none;
        }
       }
    }
    .c_item_3 {
      // display: flex;
      // justify-content: space-around;
      margin-top: 12px;
      width: 100%;
      display: flex;
      flex: 1;
      .el-row{
        width: 100%;
        .el-col{
          height: 100%;
        }
      }
      .item_title_s{
        background: none;
      }
      // width: 868px;
      .c_item_3_1 {
        height: 100%;
                // width: 412px;
        position: relative;
        .legend_content {
          height: 38px;
          line-height: 38px;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          position: absolute;
          right: 0;
          top: 0;
          .wendu {
            display: inline-block;
            vertical-align: middle;
            font-size: 12px;
            height: 38px;
            line-height: 38px;
            margin-right: 32px;
            position: relative;
          }
          .shidu {
            display: inline-block;
            vertical-align: middle;
            font-size: 12px;
            height: 38px;
            line-height: 38px;
            position: relative;
          }
          .wendu::after {
            content: "";
            position: absolute;
            left: -20px;
            top: 20px;
            width: 14px;
            height: 6px;
            margin-top: -3px;
            background: #1FCE85;
          }
          .shidu::after {
            content: "";
            position: absolute;
            left: -20px;
            top: 20px;
            width: 14px;
            height: 6px;
            margin-top: -3px;
            background: #FFC55B;
          }
        }
        #c_bigchar_5 {
          min-height: 120px;
          display: flex;
          flex: 1;
        }
      }
      .c_item_3_2 {
        // width: 412px;
        // width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        .legend_content {
          height: 38px;
          line-height: 38px;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          position: absolute;
          right: 0;
          top: 0;
        }
        #c_bigchar_3 {
          user-select: none;
          width: 100%;
          max-width: 364px;
          // margin: 10px auto;/*no*/
          box-sizing: border-box;
          flex: 1;
          .lineTop, .lineBottom{
            width: 100%;
            height: 14px;
            border: 3px solid;
            border-image: linear-gradient(270deg, rgba(64,173,255,0.18), #75d6ff 50%, rgba(64,173,255,0.18)) 3 3;
            border-top: none;
            justify-content: space-around;
            align-items: flex-end;
            span{
              display: flex;
              width: 2px;/*no*/
              height: 7px;
              background: #34b8ff;
              bottom: 0;
              position: relative;
              &::after{
                content: '';
                width: 2px;/*no*/
                height: 7px;
                background: #34b8ff;
                position: absolute;
                right: 4px;/*no*/
              }
              &.is-active{
                width: 5px;
                height: 9px;
                background: url(~common/images/bigscreen/img61.png) no-repeat center;
                background-size: auto 100%;
              }
            }
          }
          .lineTop{
            border: none;
            border: 3px solid;
            border-image: linear-gradient(270deg, rgba(64,173,255,0.18), #75d6ff 50%, rgba(64,173,255,0.18)) 3 3;
            border-bottom: none;
            align-items: flex-start;
            &.is-active1, &.is-active6{
              &::before{
                top:-3px;
              }
            }
          }
          .lineTop, .lineBottom{
            position: relative;
            &.is-active1{
              &::before{
                content: '';
                width: 5px;
                height: 14px;
                position: absolute;
                left: -5px;
                background: url(~common/images/bigscreen/img61.png) no-repeat center;
                background-size: auto 100%;
              }
              &::after{
                left: -5px;
              }
            }
            &.is-active6{
              border-right: 5px solid #00ffdd;
              &::before{
                content: '';
                width: 5px;
                height: 14px;
                position: absolute;
                right: -5px;
                background: url(~common/images/bigscreen/img61.png) no-repeat center;
                background-size: auto 100%;
              }
              &::after{
                right: -5px;
              }
            }
          }
          .lineBottom{
            &.is-active1, &.is-active6{
              &::before{
                background: url(~common/images/bigscreen/img62.png) no-repeat center;
                background-size: auto 100%;
                bottom:-3px;
              }
            }
            span{
              &.is-active{
                background: url(~common/images/bigscreen/img62.png) no-repeat center;
                background-size: auto 100%;
              }
            }
          }
          .lineCenter{
            display: flex;
            flex: 1;
            height: calc(100% - 100px);
            min-height:64px;/*no*/
            background: linear-gradient(270deg,rgba(42,93,221,0.00) 10%, rgba(24,136,225,0.67) 36%, rgba(84,151,240,0.00) 79%);
            position:relative;
            #earth{
              width: 64px;/*no*/
              height: 100%;
              .a-enter-vr{
                display: none;
              }
              .a-canvas{
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
              }
              &.current1{
                position: absolute;
                left: -32px;/*no*/
              }
              &.current6{
                position: absolute;
                right: -32px;/*no*/
              }
            }
          }
          .bottonText{
            margin-top: 7px;
            justify-content: space-evenly;
            position: relative;
            div{
              span{
                text-align: center;
                display: flex;
                font-size: 12px;
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                color: #ffffff;
                line-height: 12px;
                justify-content: center;
                &:last-child{
                  margin-top: 5px;/*no*/
                }
              }
              &:first-child{
                position: absolute;
                left: -3%;/*no*/
              }
              &:last-child{
                position: absolute;
                right: -7%;/*no*/
              }
            }
          }
        }
      }
    }
    .c_item_4 {
      // display: flex;
      // justify-content: space-around;
      width: 100%;
      display: flex;
      flex: 1;
      // width: 868px;
      //   height: 200px;
      .el-row{
        width: 100%;
        height: 100%;
        .el-col{
          height: 100%;
        }
      }
      .item_title_s{
        background: none;
        span{
          // margin-left: 46px;
        }
        &::after{
            width: 5px;
              height: 14px;
              background: linear-gradient(180deg,#52a7f1, rgba(138,211,249,0.00));
              position: absolute;
              left: 2px;
              top: 50%;
              transform: translateY(-50%);
              content: "";
        }
      }
      .c_item_4_1 {
        height: 100%;
        // width: 412px;
        position: relative;
        .legend_content {
          height: 38px;
          line-height: 38px;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          position: absolute;
          right: 0;
          top: 0;
        }
        #c_bigchar_4 {
          min-height: 120px;
          display: flex;
          flex: 1;
        }
      }
      .c_item_4_2 {
        // width: 412px;
        // width: 100%;
        height: 100%;
        position: relative;
        .legend_content {
          height: 38px;
          line-height: 38px;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          position: absolute;
          right: 0;
          top: 0;
        }
        #c_bigchar_2 {
          min-height: 120px;
          display: flex;
          flex: 1;
        }
      }
    }
    .indexMap{
      .c_item_5, .item_title{
        position: relative;
        margin-bottom: 10px;/*no*/
        .time{
          position: absolute;
          right: 10px;/*no*/
          top: 50%;
          transform: translateY(-50%);
          font-size:14px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(255,255,255,1);
        }
      }
    }
    /**右边 */
    .r_item_1 {
      display: flex;
      flex: 4;
      margin-top: -30px;/*no*/
      .el-row{
        height: 100%;
        display: flex;
        align-items: center;
      }
      .videoContent{
        height: 100%;
        position: relative;
        overflow: hidden;
        #videoAddress{
          width: auto;
          position: absolute;
          top: -48px;/*no*/
          left: 10px;/*no*/
          right: 10px;/*no*/
          height: calc(100% + 96px);/*no*/
          bottom: -48px;/*no*/
        }
      }
    }
    .r_item_2 {
      // height: 128px;
      display: flex;
      flex: 3;
      position: relative;
      .legend_content {
        height: 38px;
        line-height: 38px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        position: absolute;
        right: 12px;
        bottom: 0;
        .yizhanyong {
          display: inline-block;
          vertical-align: middle;
          font-size: 12px;
          height: 38px;
          line-height: 38px;
          margin-right: 32px;
          position: relative;
        }
        .weizhanyong {
          display: inline-block;
          vertical-align: middle;
          font-size: 12px;
          height: 38px;
          line-height: 38px;
          position: relative;
        }
        .yizhanyong::after {
          content: "";
          position: absolute;
          left: -20px;
          top: 20px;
          width: 14px;
          height: 10px;
          margin-top: -5px;
          background: #f56c6c;
        }
        .weizhanyong::after {
          content: "";
          position: absolute;
          left: -20px;
          top: 20px;
          width: 14px;
          height: 10px;
          margin-top: -5px;
          background: #1a58a7;
        }
      }
    }
    .r_item_3 {
      // height: 293px;
      margin-bottom: 0;
      position: relative;
      display: flex;
      flex: 4;
      .violation_item {
        position: absolute;
        right: 26px;
        top: 22%;
        color: #fff;
        width: 169px;
        height: 183px;
        background: linear-gradient(
          180deg,
          rgba(12, 41, 101, 1) 0%,
          rgba(12, 36, 76, 0.46) 100%
        );
        border-top: 1px solid;
        border-left: 1px solid;
        border-image: linear-gradient(
            360deg,
            rgba(2, 54, 142, 0.36),
            rgba(102, 160, 255, 0.36)
          )
          1 1;
        .violation_item_info {
          padding-top: 11px;
          padding-left: 13px;
          .violation_item_info_label {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            line-height: 20px;
          }
          .violation_item_info_val {
            font-size: 18px;
            font-family: DINAlternate;
            font-weight: bold;
            color: rgba(255, 255, 255, 1);
            line-height: 21px;
            margin-bottom: 10px;
          }
        }
      }
      #r_bigchar_2 {
        // height: 240px;
        display: flex;
        flex: 1;
      }
      .labers{
        .laberItem{
          color: #ffffff;
        }
      }
    }
    .indexMap{
    /**模块标题 */
    .item_title {
      // width: 305px;
      height: 36px;/*no*/
      // background: linear-gradient(
      //   90deg,
      //   rgba(0, 41, 94, 1) 0%,
      //   rgba(27, 42, 96, 0) 100%
      // );
      // border-radius: 25px;
      position: relative;
      user-select: none;
      span {
        margin-left: 100px;
        font-size: 20px;
        line-height: 36px;/*no*/
        letter-spacing: 3px;
        background: linear-gradient(180deg,#ffffff, #69d3ff);
        font-size: 30px;
        font-family: PangMenZhengDao;
        text-align: left;
        color: #ffffff;
        letter-spacing: 1px;
        text-shadow: 0px 4px 4px 0px #002b7d;
        font-family: PangMenZhengDao;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    //   &::after {
    //   width: 54px;
    //   height: 22px;
    //   position: absolute;
    //   left: 17px;
    //   top: 8px;
    //   content: "";
    //   background: url(~common/images/bigscreen/item_bg_title.png) no-repeat;
    //   background-size: contain;
    //   background-position: center;
    // }
    }
    }
    .item_title_s {
      // width: 305px;
      height: 36px;
      line-height: 36px;
      background: linear-gradient(
        90deg,
        rgba(0, 41, 94, 1) 0%,
        rgba(27, 42, 96, 0) 100%
      );
      border-radius: 25px;
      position: relative;
      user-select: none;
      span {
        margin-left: 20px;
        font-size: 22px;
        line-height: 34px;
        letter-spacing: 3px;
        color: rgba(255, 255, 255, 1);
        background: linear-gradient(
          180deg,
          rgba(255, 255, 255, 1) 0%,
          rgba(152, 191, 254, 1) 100%
        );
        font-family: PangMenZhengDao;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      &::after {
      width: 5px;
      height: 14px;
      background: linear-gradient(180deg,#52a7f1, rgba(138,211,249,0.00));
      position: absolute;
      left: 2px;
      top: 50%;
      transform: translateY(-50%);
      content: "";
    }
    }
    .legend_content {
      user-select: none;
    }
    #lightPoleMap, #longRangControl, #securityMonitoring, #cameraEventList {
      width: 100%;
      height: 100%;
    }
    #cameraEventList >.el-row{
      height: 100%;
    }
  }
}

</style>
