<template>
  <div id="cameraEventList">
    <el-breadcrumb separator="/" v-if="type !== 'template'">
      <el-breadcrumb-item :to="{path: '/smokeDetectorMap'}">智慧烟感</el-breadcrumb-item>
      <el-breadcrumb-item>烟感报警联动</el-breadcrumb-item>
    </el-breadcrumb>
      <dv-loading v-show="!initShow"></dv-loading>
      <el-row :gutter="10" v-show="initShow">
          <el-col :span="8">
            <div class="list">
              <card class="flexCloumn eventList" title="监控事件">
                    <search-form
                        :searchItems="searchItems"
                        @onSearch="onSearch"
                    >
                    <div class="flexRow my-autocomplete" slot="streetCode">
                      <treeselect :value="searchVal.streetCode" @input="tressSelectInput" @select="tressSelectSelect"/>
                    </div>
                    </search-form>
                    <ul class="infinite-list infoList" v-infinite-scroll="getList" :infinite-scroll-disabled="scrollDisable"
                    v-loading="loading"
                    style="overflow:auto">
                    <li
                        class="infinite-list-item"
                        v-for="(item, index) in list"
                        :key="index"
                        @click="openVideo(item)"
                    >
                    <div class="flexRow listItem" :class="alarmItem.alarmCode === item.alarmCode ? 'active' : ''">
                        <el-tag type="danger">{{item.eventTypeText}}</el-tag>
                        <!-- <video
                          :src="item.url"
                          class="avatar video-avatar"
                          controls="controls"

                        >您的浏览器不支持视频播放</video> -->
                        <!-- <div class="videoIframe" @click="playAlarmSnippet(item)">
                          <iframe
                            :src="item.url"
                            width="100%"
                            height="100%"
                            allow="autoplay"
                            border="0"
                            scrolling="no"
                            allowfullscreen
                        ></iframe>
                        </div> -->
                        <el-image
                            :src="item.captureURL[0]"
                            :preview-src-list="[item.captureURL[0]]">
                            <div slot="error" class="flexCloumn flexCenter image-error">
                              <i class="iconfont icon-jiazaishibai"></i>
                              <span>加载失败</span>
                            </div>
                        </el-image>
                        <!-- <img :src="item.imagePath"/> -->
                        <div class="flexCloumn info">
                            <div class="infoTitle">{{item.deviceName}}</div>
                            <el-tooltip class="item" effect="light" :content="item.address" placement="top">
                              <div class="flexRow time">
                                <span>发生位置：{{item.address}}</span>
                              </div>
                            </el-tooltip>
                            <div class="condition">
                                发生时间：{{item.alarmTime}}
                            </div>
                        </div>
                        <div class="flexRow playBack" @click="playAlarmSnippet(item)">
                            <div class="icon">
                              <i class="el-icon-caret-right" />
                            </div>
                            事件视频
                        </div>
                    </div>
                    </li>
                </ul>
                <p v-if="loading" class="flexCenter">加载中...</p>
                <p v-if="noMore" class="flexCenter">没有更多了</p>
              </card>
              </div>
          </el-col>
          <el-col :span="16" class="flexCloumn">
            <div class="flexCenter video">
                <iframe
                  :src="src"
                  width="100%"
                  height="100%"
                  allow="autoplay"
                  border="0"
                  scrolling="no"
                  id="ysopen"
                  ref="ysopen"
                  @load="handleIframeLoad"
                  allowfullscreen
              ></iframe>
              <el-drawer
                title="我是标题"
                :with-header="false"
                :visible.sync="drawer.show"
                :direction="drawer.direction"
                :before-close="handleCloseDrawer"
                :modal-append-to-body="false"
              >
                <div class="flexCloumn btnList">
                  <div
                    class="submitBtn"
                    size="small"
                    v-for="item in drawer.btnItems"
                    :key="item.id"
                    @mousedown="item.mousedown"
                    @mouseup="item.mouseup"
                  >
                    <!-- <i class="iconfont icon-chaxun"></i> -->
                    {{item.name}}
                  </div>
                </div>
              </el-drawer>
              <div class="kongzhi-icon" @click="handleMore"><i class="iconfont icon-shexiangtoukongzhi-copy" /></div>
              <div class="flexRow videoInfo">
                  <div class="flexCenter icon"><i class="iconfont icon-dengganditu" /></div>
                  <div class="flexCloumn title">
                      <span>{{alarmItem.address}}</span>
                      <span>{{time}}</span>
                  </div>
                  <!-- <div class="flexCenter playBack" @click="playBack(alarmItem)">
                      <i class="iconfont iconshipinhuifang" />
                      视频回放
                  </div>
                  <div class="flexCenter playBack more" @click="handleMore">
                      <i class="iconfont iconshipinhuifang" />
                      更多
                  </div> -->
              </div>
            </div>
            <card class="flexCloumn videoInfo" title="场景联动">
              <div class="flexRow videoTitle">
                <span></span>
                <span class="linkage" @click="handleLinkage">场景联动详情</span>
              </div>
                <el-row class="flexRow allContainer" :gutter="10">
                  <el-col :span="6">
                    <div class="flexCloumn info1" @click="openTableDialog('audioTable')">
                      <div class="flexRow">
                        <div class="flexCenter icon">
                          <i class="iconfont icon-xiaofangguangbo" />
                        </div>
                        <div class="flexCloumn infoDetail">
                          <span>广播器</span>
                          <span>{{(countInfo && countInfo.audioNum) || 0}}</span>
                        </div>
                      </div>
                      <div class="detailContent">
                        <scrollView>
                          <div class="detailContent">
                            <div
                              v-for="audioFile in countInfo.audioMediaDtoList"
                              :key="audioFile.fileCode"
                              class="audioContent"
                            >
                              <audioContainer
                                :file="{
                                  url: audioFile.fileUrl,
                                  name: audioFile.fileName,
                                  code: audioFile.fileCode
                                }"
                                :deleteShow="false"
                              />
                            </div>
                          </div>
                        </scrollView>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div class="flexCloumn info2" @click="openTableDialog('ledTable')">
                      <div class="flexRow">
                        <div class="flexCenter icon"><i class="iconfont icon-diannao" /></div>
                        <div class="flexCloumn infoDetail">
                          <span>LED屏</span>
                          <span>{{(countInfo && countInfo.ledNum) || 0}}</span>
                        </div>
                      </div>
                      <div class="detailContent">
                        <Effect :index-data="effextArray"/>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div class="flexCloumn info2" @click="openTableDialog('lightTable')">
                      <div class="flexRow">
                        <div class="flexCenter icon"><i class="iconfont icon-dengpao-tianchong" /></div>
                        <div class="flexCloumn infoDetail">
                        <span>照明灯</span>
                        <span>{{(countInfo && countInfo.lightsNum) || 0}}</span>
                        </div>
                      </div>
                      <div class="detailContent lampDetail">
                        <el-switch
                          :value="countInfo && countInfo.lampStatus === '1' ? true : false"
                          active-color="#2870FF"
                          inactive-color="#1C376D"
                          active-text="开"
                          inactive-text="关"
                          disabled>
                        </el-switch>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div class="flexRow info2" @click="openTableDialog('persionTable')">
                        <div class="flexCenter icon"><i class="iconfont icon-mingzi" /></div>
                        <div class="flexRow infoDetail">
                          <div class="flexCloumn">
                            <span>电话通知</span>
                            <span>{{(countInfo && countInfo.phoneNum) || 0}}</span>
                          </div>
                          <div class="flexCloumn">
                            <span>短信通知</span>
                            <span>{{(countInfo && countInfo.smsNum) || 0}}</span>
                          </div>
                        </div>
                    </div>
                  </el-col>
                </el-row>
            </card>
          </el-col>
      </el-row>
        <dialog-count
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        width="550px"
        appendToBody
        @on-close="dialogVisible = false"
        >
        <iframe
        :src="this.serviceAddress"
        id='dialogSrc'
        :style="{width: '100%', height: '100%'}"
        frameborder="0"
        allowfullscreen
        allow="autoplay"
        scrolling="no"
        ></iframe>
    </dialog-count>
    <dialog-count
      title="视频回放"
      :visible.sync="dialog.show"
      width="750px"
      appendToBody
      @on-close="dialogClose"
      custom-class='videoPlayBack'
      >
        <videoPlayBack :cameraId="dialog.cameraId" :src="dialog.src"/>
    </dialog-count>
    <dialog-count
      title="设备列表"
      :visible.sync="tableDialog.show"
      width="80%"
      appendToBody
      @on-close="tableDialogClose"
      custom-class='tableDialog'
      >
      <el-tabs v-model="tableDialog.activeId" type="card" @tab-click="handleTabClick">
          <el-tab-pane
            label="广播器"
            name="audioTable"
            lazy
          >
            <span slot="label"><i class="iconfont icon-chanpinxinxi"></i> 广播器</span>
            <div class="content">
            <search-form
                :searchItems="[]"
                :otherBtnVisible="true"
                :otherBtnLists="[{
                  label: '播放',
                  onClick: () => {

                  }
                }, {
                  label: '停播',
                  onClick: () => {

                  }
                }]"
              />
              <page-table
                col-align="center"
                selection
                :data="tableDialog.audioTable.tableData"
                :cols="tableDialog.audioTable.tableCols"
                :page-current="tableDialog.audioTable.page.current"
                :total="tableDialog.audioTable.page.total"
                :page-size="tableDialog.audioTable.page.pageSize"
                @current-change="onAudioListCurrentChange"
                @size-change="onAudioListPageSizeChange"
                @selection-change="onAudioSelectionChange"
              >
              <template slot="programInfoDto" class="audioContentList">
                <scrollView>
                  <div class="audioContentList">
                    <div
                      v-for="audioFile in countInfo.audioMediaDtoList"
                      :key="audioFile.fileCode"
                      class="audioContent"
                    >
                      <audioContainer
                        :file="{
                          url: audioFile.fileUrl,
                          name: audioFile.fileName,
                          code: audioFile.fileCode
                        }"
                        :deleteShow="false"
                      />
                    </div>
                  </div>
                </scrollView>
              </template>
              </page-table>
            </div>
          </el-tab-pane>
          <el-tab-pane
            label="LED屏"
            name="ledTable"
            lazy
          >
            <span slot="label"><i class="iconfont icon-chanpinxinxi"></i> LED屏</span>
            <div class="content">
            <search-form
                :searchItems="[]"
                :otherBtnVisible="true"
                :otherBtnLists="[{
                  label: '全部打开',
                  onClick: () => {

                  }
                }, {
                  label: '全部关闭',
                  onClick: () => {

                  }
                }]"
              />
              <page-table
                col-align="center"
                selection
                :data="tableDialog.ledTable.tableData"
                :cols="tableDialog.ledTable.tableCols"
                :page-current="tableDialog.ledTable.page.current"
                :total="tableDialog.ledTable.page.total"
                :page-size="tableDialog.ledTable.page.pageSize"
                @current-change="onLedListCurrentChange"
                @size-change="onLedListPageSizeChange"
                @selection-change="onLedSelectionChange"
              >
                <template slot="programInfoDto">
                  <Effect :index-data="effextArray"/>
                </template>
              </page-table>
            </div>
          </el-tab-pane>
          <el-tab-pane
            label="照明灯"
            name="lightTable"
            lazy
          >
            <span slot="label"><i class="iconfont icon-chanpinxinxi"></i> 照明灯</span>
            <div class="content">
            <search-form
                :searchItems="[]"
                :otherBtnVisible="true"
                :otherBtnLists="[{
                  label: '全部打开',
                  onClick: () => {

                  }
                }, {
                  label: '全部关闭',
                  onClick: () => {

                  }
                }]"
              />
              <page-table
                col-align="center"
                selection
                :data="tableDialog.lightTable.tableData"
                :cols="tableDialog.lightTable.tableCols"
                :page-current="tableDialog.lightTable.page.current"
                :total="tableDialog.lightTable.page.total"
                :page-size="tableDialog.lightTable.page.pageSize"
                @current-change="onLightListCurrentChange"
                @size-change="onLightListPageSizeChange"
                @selection-change="onLightSelectionChange"
              >
              </page-table>
            </div>
          </el-tab-pane>
          <el-tab-pane
            label="人员通知"
            name="persionTable"
            lazy
          >
            <span slot="label"><i class="iconfont icon-chanpinxinxi"></i> 人员通知</span>
            <div class="content">
            <search-form
                :searchItems="[]"
                :otherBtnVisible="true"
                :otherBtnLists="[{
                  label: '打电话',
                  onClick: () => {

                  }
                }, {
                  label: '发短信',
                  onClick: () => {

                  }
                }]"
              />
              <page-table
                col-align="center"
                selection
                :data="tableDialog.persionTable.tableData"
                :cols="tableDialog.persionTable.tableCols"
                :page-current="tableDialog.persionTable.page.current"
                :total="tableDialog.persionTable.page.total"
                :page-size="tableDialog.persionTable.page.pageSize"
                @current-change="onPersionListCurrentChange"
                @size-change="onPersionListPageSizeChange"
                @selection-change="onPersionSelectionChange"
              >
              </page-table>
            </div>
          </el-tab-pane>
      </el-tabs>
    </dialog-count>
  </div>
</template>
<script>
import {
  mapGetters
} from 'vuex';
import moment from 'moment';
import EZUIKit from 'ezuikit-js';
import store from '@/store';
import searchForm from '@/components/searchForm/searchForm';
import PageTable from '@/components/page-table';
import pageMain from '@/components/pageMain';
import audioContainer from '@/components/upload/audio';
import dialogCount from '@/components/dialog';
import scrollView from '@/components/sideMenu/scrollView';
import Effect from '@/view/index/publishPoleMap/components/effect';
import card from '@/view/lightPole/lightPoleStatistical/components/card';
import { getEvents } from 'api/IBM';
import { routePush, postData } from '@/util/util';
import { EVENT_LIST_TYPE, COMMON_TEMPLATE_SERVICE_TYPE } from '@/util/constants';
import warn from './images/warn.gif';
import img7 from './images/img7.png';
import img8 from './images/img8.png';
import img9 from './images/img9.png';
import img10 from './images/img10.png';
import countsInfo from './info';
import treeselect from './treeselect';
import videoPlayBack from '../videoPlayback';
import {
  getDeviceCount,
  getLinkageDeviceDetails,
  getLinkagePersonInfoDetails,
  getSmokeAlarmEvent,
  getLinkageEventEnums
} from '@/api/smokeDetectorMap';
import {
  getTaskTemplateInfo
} from '@/api/brocast';
import {
  selectLedProgramDetail
} from '@/api/screen';
import {
  selectTemplate
} from 'api/controlStrategy';
// const {Builder, By, Key, until} = require('selenium-webdriver');

// 设备类型
const deviceTypes = {
  'audioTable': 'AUDIO',
  'ledTable': 'LED',
  'lightTable': 'LAMP'
};

export default {
  name: 'cameraEventList',
  data () {
    const { options } = this.$_useTypes(EVENT_LIST_TYPE);
    return {
      currentTitleList: [{
        name: 'smokeMap',
        title: '智慧烟感'
      }, {
        name: 'smokeAlarmLink',
        title: '烟感报警联动'
      }],
      src: undefined,
      initShow: false,
      channel: 1,
      loading: false,
      scrollDisable: false,
      searchVal: {
        streetCode: undefined
      },
      countInfo: {
        serialNumber: undefined,
        audioNum: undefined,
        lightsNum: undefined,
        phoneNum: undefined,
        smsnum: undefined,
        lednum: undefined,
        audioMediaDtoList: []
      },
      warn,
      searchItems: [{
        type: 'dataPicker',
        label: '',
        labelWidth: '0px',
        props: {
          fieldName: 'data',
          width: 'calc(50% - 10px)',
          prefixIcon: '',
          clearIcon: '',
          format: 'yyyy-MM-dd HH:mm:ss'
        }
      },{
        type: 'select',
        label: '',
        labelWidth: '0px',
        props: {
          fieldName: 'eventType',
          width: 'calc(50% - 10px)',
          options: [],
          placeholder: '请选择事件'
        }
      }, {
        type: 'custom',
        label: '',
        labelWidth: '0px',
        props: {
          fieldName: 'streetCode',
          width: '50%'
        }
      }],
      timer: null,
      time: '',
      list: [],
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      alarmItem: {
        alarmCode: undefined
      },
      currentIndex: 0,
      serviceAddress: '',
      dialogVisible: false,
      dialogTitle: '事件视频',
      moment,
      player: null,
      effextArray: [],
      dialog: {
        show: false,
        player: null,
        src: ''
      },
      tableDialog: {
        show: false,
        activeId: 'audioTable',
        audioTable: {
          selectsList: [],
          tableData: [],
          tableCols: [
            { label: '设备编号',
              prop: 'serialNumber'
            },
            { label: '设备名',
              prop: 'deviceName'
            },
            { label: '位置',
              prop: 'address',
              minWidth: '110px'
            },
            { label: '设备状态',
              prop: 'deviceStatusText'
            },
            { label: '播放开始时间',
              prop: 'beginTime'
            },
            { label: '播放节目',
              prop: 'programInfoDto',
              custom: true,
              minWidth: '150px'
            }
          ],
          page: {
            current: 1,
            pageSize: 10,
            total: 0,
            totalPageNo: 1
          }
        },
        ledTable: {
          selectsList: [],
          tableData: [],
          tableCols: [
            { label: '设备编号',
              prop: 'serialNumber'
            },
            { label: '设备名',
              prop: 'deviceName'
            },
            { label: '位置',
              prop: 'address',
              minWidth: '110px'
            },
            { label: '设备状态',
              prop: 'deviceStatusText'
            },
            { label: '播放开始时间',
              prop: 'beginTime'
            },
            { label: '播放节目',
              prop: 'programInfoDto',
              custom: true,
              minWidth: '150px'
            }
          ],
          page: {
            current: 1,
            pageSize: 10,
            total: 0
          }
        },
        lightTable: {
          selectsList: [],
          tableData: [],
          tableCols: [
            { label: '设备编号',
              prop: 'serialNumber'
            },
            { label: '设备名',
              prop: 'deviceName'
            },
            { label: '位置',
              prop: 'address',
              minWidth: '110px'
            },
            { label: '设备状态',
              prop: 'deviceStatusText'
            },
            { label: '执行时间',
              prop: 'beginTime'
            }
          ],
          page: {
            current: 1,
            pageSize: 10,
            total: 0
          }
        },
        persionTable: {
          selectsList: [],
          tableData: [],
          tableCols: [
            { label: '人员姓名',
              prop: 'userName'
            },
            { label: '联系电话',
              prop: 'phone'
            },
            { label: '职务',
              prop: 'position'
            },
            { label: '通知情况',
              prop: 'informType',
              minWidth: '110px',
              render: (h, scoped) => {
                if (scoped.row.informType.length == 1 && scoped.row.informType.includes('1')) {
                  return <div>电话</div>
                }
                if (scoped.row.informType.length == 1 && scoped.row.informType.includes('2')) {
                  return <div>短信</div>
                }
                if (scoped.row.informType.length == 2) {
                  return <div><span>电话</span><br></br><span>短信</span></div>
                }
              }
            },
            { label: '通知时间',
              prop: 'beginTime'
            }
          ],
          page: {
            current: 1,
            pageSize: 10,
            total: 0
          }
        }
      },
      drawer: {
        show: false,
        direction: 'rtl',
        btnItems: [{
          id: 'a',
          name: '上转',
          mousedown: () => {
            this.handleDeviceContral(0);
          },
          mouseup: () => {
            this.handleDeviceContral(0, 'stop');
          }
        }, {
          id: 'b',
          name: '下转',
          mousedown: () => {
            this.handleDeviceContral(1);
          },
          mouseup: () => {
            this.handleDeviceContral(1, 'stop');
          }
        }, {
          id: 'c',
          name: '左转',
          mousedown: () => {
            this.handleDeviceContral(2);
          },
          mouseup: () => {
            this.handleDeviceContral(2, 'stop');
          }
        }, {
          id: 'd',
          name: '右转',
          mousedown: () => {
            this.handleDeviceContral(3);
          },
          mouseup: () => {
            this.handleDeviceContral(3, 'stop');
          }
        }, {
          id: 'e',
          name: '左上转',
          mousedown: () => {
            this.handleDeviceContral(4);
          },
          mouseup: () => {
            this.handleDeviceContral(4, 'stop');
          }
        }, {
          id: 'f',
          name: '左下转',
          mousedown: () => {
            this.handleDeviceContral(5);
          },
          mouseup: () => {
            this.handleDeviceContral(5, 'stop');
          }
        }, {
          id: 'g',
          name: '放大',
          mousedown: () => {
            this.handleDeviceContral(8);
          },
          mouseup: () => {
            this.handleDeviceContral(8, 'stop');
          }
        }, {
          id: 'h',
          name: '缩小',
          mousedown: () => {
            this.handleDeviceContral(9);
          },
          mouseup: () => {
            this.handleDeviceContral(9, 'stop');
          }
        }, {
          id: 'i',
          name: '近聚焦',
          mousedown: () => {
            this.handleDeviceContral(10);
          },
          mouseup: () => {
            this.handleDeviceContral(10, 'stop');
          }
        }, {
          id: 'j',
          name: '远聚焦',
          mousedown: () => {
            this.handleDeviceContral(11);
          },
          mouseup: () => {
            this.handleDeviceContral(11, 'stop');
          }
        }]
      }
    };
  },
  props: {
    type: {
      type: String,
      default: 'default'
    }
  },
  computed: {
    ...mapGetters(['common']),
    noMore () {
      return this.page.current >= this.page.totalPageNo
    }
  },
  components: {
    searchForm,
    countsInfo,
    videoPlayBack,
    audioContainer,
    Effect,
    treeselect,
    PageTable,
    pageMain,
    dialogCount,
    card,
    scrollView
  },
  created () {

  },
  mounted () {
    this.$nextTick(async () => {
      this.init();
      this.src = `https://open.ys7.com/ezopen/h5/iframe_se?url=ezopen://RPUENL@open.ys7.com/E63112920/1.live&autoplay=0&audio=1&accessToken=${this.common.accessToken}&templete=2`;
      this.player = new EZUIKit.EZUIPlayer('ysopen');
      this.player.play();
      // setTimeout(() => {
      //   const ysopen = this.$refs.ysopen;
      //   const panelTop = ysopen.contentWindow.document.getElementsByClassName('panel-top');
      //   const myModal = ysopen.contentWindow.document.getElementsById('myModal');
      //   console.log('myModal', myModal);
      //   console.log('panelTop', ysopen.contentWindow, panelTop);
      //   console.log('ysopen');
      //   console.dir(ysopen);
      // }, 500);
    });
  },
  watch: {
    // $route (to, from) {

    // }
  },
  methods: {
    handleIframeLoad (i) {
      // const ysopen = this.$refs.ysopen;
      // console.dir('ysopen', ysopen);
      // const panelTop = ysopen.contentWindow.document.getElementsByClassName('panel-top');
      // // const myModal = ysopen.contentWindow.document.getElementsById('myModal');
      // // console.log('myModal', myModal);
      // console.log('panelTop', ysopen.contentWindow, panelTop);
      // console.dir(ysopen);
    },
    async init () {
      this.scrollDisable = false;
      this.initShow = false;
      this.timer = setInterval(this.changeTime, 1000);
      this.channel = '1';
      this.list = [];
      this.currentIndex = 0;
      await this.load();
      this.initShow = true;
      this.$forceUpdate();
      this.getLinkageEventEnums()
    },
    onSearch (val) {
      this.list = [];
      this.page.current = 1;
      this.searchVal = {
        ...val,
        eventId: +val.eventId,
        beginDate: val.data && val.data[0],
        endDate: val.data && val.data[1],
        streetCode: this.searchVal.streetCode ? this.searchVal.streetCode.map(streeCode => streeCode.nodeCode) : ''
      };
      delete this.searchVal.data;
      this.getList();
    },
    getLinkageEventEnums () {
      getLinkageEventEnums().then(res => {
        if (res.code === '200') {
          this.searchItems[1]['props'].options = res.data
          // 一键报警页跳转
          if (this.$route.query == '烟雾报警') {
            this.searchItems[1].initValue = 'SMOKE_DETECTOR'
            this.searchVal['eventType'] = 'SMOKE_DETECTOR'
            this.getList();
          }
        }
      })
    },
    load () {
      this.loading = true;
      this.getList();
    },
    loadCount (serialNumber, alarmCode, eventType) {
      const params = {
        serialNumber: serialNumber,
        alarmCode: alarmCode,
        eventType: eventType
      }
      getDeviceCount(params).then(res => {
        if (res.code === '200') {
          this.countInfo = res.data;
          if (res.data.audioTaskTemplate) {
            // this._getTaskTemplateInfo(res.data.audioTaskTemplateId)
            this.countInfo.audioMediaDtoList = res.data.audioTaskTemplate.audioMediaList && res.data.audioTaskTemplate.audioMediaList.map(medio => {
              const path = medio.fileUrl.split('upload')[1];
              return {
                ...medio,
                path: path
              }
            });
          }
          // if (res.data.ledTemplateDto) {
            if (res.data.ledTaskTemplate === 1) {
              // this._selectLedProgramDetail(res.data.ledTaskTemplateId)
              this.effextArray = res.data.ledProgramInfoDto.ledRects && res.data.ledProgramInfoDto.ledRects[0].ledMedias.map(medias => {
                const { types } = this.$_useTypes(COMMON_TEMPLATE_SERVICE_TYPE);
                return {
                  ...medias,
                  Type: types[medias.mediaType],
                  Src: medias.source
                }
              });
              console.log(this.effextArray)
            } else {
              const keyWord = res.data.ledTemplateDto.keyWord.join('<br />');
              this.effextArray = [{
                Type: '文字',
                Src: keyWord
              }];
              
              // selectTemplate({id: res.data.ledTaskTemplateId}).then(templateRes => {
              //   if (templateRes.code === '200') {
              //     const keyWord = templateRes.data.keyWord.join('<br />');
              //     this.effextArray = [{
              //       Type: '文字',
              //       Src: keyWord
              //     }];
              //   }
              // });
            }
          // }
        }
      })
    },
    _getTaskTemplateInfo (taskCode) {
      getTaskTemplateInfo(taskCode).then(res => {
        if (res.code === '200') {
          this.countInfo.audioMediaDtoList = res.data.audioMediaList && res.data.audioMediaList.map(medio => {
            const path = medio.fileUrl.split('upload')[1];
            return {
              ...medio,
              path: path
            }
          });
        }
      });
    },
    _selectLedProgramDetail (id) {
      selectLedProgramDetail(id).then(res => {
        if (res.code === '200') {
          this.effextArray = res.data.ledRects && res.data.ledRects[0].ledMedias.map(medias => {
            const { types } = this.$_useTypes(COMMON_TEMPLATE_SERVICE_TYPE);
            return {
              ...medias,
              Type: types[medias.mediaType],
              Src: medias.source
            }
          });
        }
      })
    },
    changeTime () {
      this.time = moment().format('YYYY-MM-DD HH:mm:ss')
    },
    openVideo (item) {
      console.log('openVideo', item)
      if (this.alarmItem.alarmCode !== item.alarmCode) {
        this.alarmItem = item;
        this.src = item.url;
        this.countInfo.audioMediaDtoList = [];
        this.effextArray = [];
        if (this.countInfo.serialNumber !== item.serialNumber) {
          this.loadCount(item.serialNumber, item.alarmCode, item.eventCode);
          this.countInfo.serialNumber = item.serialNumber;
        }
      }
    },
    playBack (item) {
      const today = moment().format('YYYYMMDD');
      this.dialog.show = true;
      this.dialog.src = `https://open.ys7.com/ezopen/h5/iframe_se?url=ezopen://RPUENL@open.ys7.com/${item.deviceBindCode}/1.rec&autoplay=1&accessToken=${this.common.accessToken}&begin=${today}&end=${today}`;
      this.dialog.player = new EZUIKit.EZUIPlayer('dialogSrc');
      this.dialog.player.play();
    },
    playAlarmSnippet (item) {
      console.log('playAlarmSnippet', item)
      const today = item.alarmTime;
      const beginDate = moment(today).subtract(5, 'seconds').format('YYYYMMDDHHmmss');
      const endDate = moment(today).add(5, 'seconds').format('YYYYMMDDHHmmss');
      this.dialog.show = true;
      this.dialog.src = `https://open.ys7.com/ezopen/h5/iframe_se?url=ezopen://RPUENL@open.ys7.com/${item.deviceBindCode}/1.rec&autoplay=1&accessToken=${this.common.accessToken}&begin=${beginDate}&end=${endDate}`;
      this.dialog.player = new EZUIKit.EZUIPlayer('dialogSrc');
      this.dialog.player.play();
      if (this.countInfo.serialNumber !== item.serialNumber) {
        this.loadCount(item.serialNumber, item.alarmCode, item.eventCode);
        this.countInfo.serialNumber = item.serialNumber;
      }
    },
    dialogClose () {
      this.dialog.show = false;
      this.dialog.src = undefined;
    },
    openDialog (item) {
      this.dialogVisible = true;
      this.serviceAddress = item.videoPath;
    },
    getList () {
      let params = {
        data: {
          ...this.searchVal
        },
        pageNo: Number(this.page.current), // 查询的分页页码
        pageSize: Number(this.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: ''
      };
      if (this.scrollDisable || (this.page.current !== 0 && (this.page.current > this.page.totalPageNo))) {
        return;
      }
      getSmokeAlarmEvent(params).then(res => {
        if (res.code === '200') {
          this.page.current = this.page.current + 1;
          const { data, total, totalPageNo } = res.data;
          this.page.total = total;
          this.page.totalPageNo = totalPageNo;
          this.loading = false;
          // if (data.length === 0) {
          //   this.loading = false;
          //   this.scrollDisable = true;
          // } else {
          //   this.list = this.list.concat(data);
          //   if (data.length < 10) {
          //     this.scrollDisable = true;
          //   }
          // }
          this.list = this.list.concat(data.map(data => {
            return {
              ...data
              // address: '汕尾市海丰县碧桂园小区'
            }
          }));
          if (!this.alarmItem.alarmCode) {
            this.openVideo(this.list[0]);
          }
        }
      });
    },
    tressSelectInput (value) {
      this.searchVal.streetCode = value;
    },
    tressSelectSelect (val) {
      // console.log('val', val);
      // this.form.serialNumbers = val.serialNumbers;
    },
    handleMore () {
      this.drawer.show = true;
    },
    handleCloseDrawer () {
      this.drawer.show = false;
    },
    async handleDeviceContral (direction, type = 'start') {
      const parames = {
        speed: 1,
        direction,
        deviceSerial: this.alarmItem.deviceBindCode
      };
      const res = await postData(`api/lapp/device/ptz/${type}`, parames);
    },
    handleLinkage () {
      // routePush({
      //   title: '场景联动详情',
      //   name: 'linkageRuleListDetail',
      //   parames: {
      //     sceneCode: this.countInfo.sceneCode
      //   }
      // })
      const parames = {
        sceneCode: this.countInfo.sceneLinkageCode
      }
      store.commit('set_common', {
        'linkageRuleListDetail': parames
      });
      const detailUrl = this.$router.resolve({
        name: 'linkageRuleListDetail'
      })
      window.open(detailUrl.href, '_blank')
    },
    handleTabClick (e) {
      if (e.name === 'audioTable' && this.tableDialog.audioTable.tableData.length === 0) {
        this.onAudioListCurrentChange(1);
      }
      if (e.name === 'ledTable' && this.tableDialog.ledTable.tableData.length === 0) {
        this.onLedListCurrentChange(1);
      }
      if (e.name === 'lightTable' && this.tableDialog.lightTable.tableData.length === 0) {
        this.onLightListCurrentChange(1);
      }
      if (e.name === 'persionTable' && this.tableDialog.persionTable.tableData.length === 0) {
        this.onPersionListCurrentChange(1);
      }
    },
    openTableDialog (activeId) {
      this.tableDialog.show = true;
      this.tableDialog.activeId = activeId;
      switch (activeId) {
        case 'audioTable':
          this.onAudioListCurrentChange(1);
          break;
        case 'ledTable':
          this.onLedListCurrentChange(1);
          break;
        case 'lightTable':
          this.onLightListCurrentChange(1);
          break;
        case 'persionTable':
          this.onPersionListCurrentChange(1);
          break;
        default:
      }
    },
    tableDialogClose () {
      this.tableDialog.show = false;
      this.tableDialog.activeId = undefined;
    },
    async getTableDataAllList (parames, type = 1, tableType) {
      let apiMethod = type === 2 ? getLinkagePersonInfoDetails : getLinkageDeviceDetails;
      let tableData = [];
      let pageTotal = 0;
      let data = {
        data: {
          ...parames,
          sceneLinkageCode: this.countInfo.sceneLinkageCode,
          alarmCode:this.alarmItem.alarmCode
        },
        pageNo: Number(this.tableDialog[tableType].page.current), // 查询的分页页码
        pageSize: Number(this.tableDialog[tableType].page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: ''
      };
      return apiMethod(data).then(res => {
        const { data, total } = res.data;
        pageTotal = total;
        tableData = data;
        if (res.code === '200') {
          if (type === 2) {
            const positionTable = [];
            data.map(item => {
              positionTable.push(...item.list)
            })
            return {
              total: pageTotal,
              tableData: positionTable
            }
          }
          return {
            total: pageTotal,
            tableData: tableData
          }
        }
      });
    },
    async onAudioListCurrentChange (val) {
      this.tableDialog.audioTable.page.current = val;
      const { total, tableData } = await this.getTableDataAllList({
        deviceType: deviceTypes['audioTable'],
        serialNumber: this.alarmItem.serialNumber
      }, 1, 'audioTable');
      // console.log(total, tableData);
      this.tableDialog.audioTable.page.total = total;
      this.tableDialog.audioTable.tableData = tableData;
    },
    onAudioListPageSizeChange (val) {
      this.tableDialog.audioTable.page.pageSize = val;
      this.onAudioListCurrentChange(1);
    },
    onAudioSelectionChange (args) {
      console.log('args', args)
      this.tableDialog.audioTable.selectsList = args.map(arg => {
        return {
          serialNumber: arg.serialNumber,
          alarmNo: arg.alarmNo,
          alarmType: arg.alarmType,
          ambientCode: arg.ambientCode
        }
      });
    },
    async onLedListCurrentChange (val) {
      this.tableDialog.ledTable.page.current = val;
      const { total, tableData } = await this.getTableDataAllList({
        deviceType: deviceTypes['ledTable'],
        serialNumber: this.alarmItem.serialNumber
      }, 1, 'ledTable');
      this.tableDialog.ledTable.page.total = total;
      this.tableDialog.ledTable.tableData = tableData;
    },
    onLedListPageSizeChange (val) {
      this.tableDialog.ledTable.page.pageSize = val;
      this.onLedListCurrentChange(1);
    },
    onLedSelectionChange (args) {
      this.tableDialog.ledTable.selectsList = args.map(arg => {
        return {
          serialNumber: arg.serialNumber,
          alarmNo: arg.alarmNo,
          alarmType: arg.alarmType,
          ambientCode: arg.ambientCode
        }
      });
    },
    async onLightListCurrentChange (val) {
      this.tableDialog.lightTable.page.current = val;
      const { total, tableData } = await this.getTableDataAllList({
        deviceType: deviceTypes['lightTable'],
        serialNumber: this.alarmItem.serialNumber
      }, 1, 'lightTable');
      this.tableDialog.lightTable.page.total = total;
      this.tableDialog.lightTable.tableData = tableData;
    },
    onLightListPageSizeChange (val) {
      this.tableDialog.lightTable.page.pageSize = val;
      this.onLightListCurrentChange(1);
    },
    onLightSelectionChange (args) {
      this.tableDialog.lightTable.selectsList = args.map(arg => {
        return {
          serialNumber: arg.serialNumber,
          alarmNo: arg.alarmNo,
          alarmType: arg.alarmType,
          ambientCode: arg.ambientCode
        }
      });
    },
    async onPersionListCurrentChange (val) {
      this.tableDialog.persionTable.page.current = val;
      const { total, tableData } = await this.getTableDataAllList({
        serialNumber: this.alarmItem.serialNumber
      }, 2, 'persionTable');
      this.tableDialog.persionTable.page.total = total;
      this.tableDialog.persionTable.tableData = tableData;
    },
    onPersionListPageSizeChange (val) {
      this.tableDialog.persionTable.page.pageSize = val;
      this.onPersionListCurrentChange(1);
    },
    onPersionSelectionChange (args) {
      this.tableDialog.persionTable.selectsList = args.map(arg => {
        return {
          serialNumber: arg.serialNumber,
          alarmNo: arg.alarmNo,
          alarmType: arg.alarmType,
          ambientCode: arg.ambientCode
        }
      });
    }
  },
  beforeDestroy () {
    this.timer && clearInterval(this.timer);
  },
  destroyed () {
    this.player.stop();
  }
};
</script>
<style lang="less" scoped>
#cameraEventList {
  .el-breadcrumb{
    background: #0C0F1A;
    padding:0 10px 10px;/*no*/
    /deep/.el-breadcrumb__item{
      span{
        color: #fff !important;
        font-size: 12px;/*no*/
      }
    }
  }
    .my-autocomplete {
      /deep/#treeselect{
        width: 350px;
        .vue-treeselect__control{
          background: #222C51;
          border-radius: 4px;/*no*/
          border: 1px solid #6275BF;/*no*/
        }
      }
    }
    .el-row{
        height: calc(100% - 25px);/*no*/
        .el-col{
            height: 100%;
            overflow: hidden;
            &.el-col-16{
              display: flex;
              flex-direction: column;
                .video{
                    width: 100%;
                    // height: 600px;/*no*/
                    height: calc(100% - 280px);
                    // flex: 1;
                    background: #FFFFFF;
                    position: relative;
                    .kongzhi-icon {
                      position: absolute;
                      bottom: 14px;/*no*/
                      right: 115px;/*no*/
                      i {
                        display: inline-block;
                        width: 18px;
                        height: 18px;
                        color: #fff;
                        cursor: pointer;
                      }
                    }
                    .videoInfo{
                        position: absolute;
                        bottom: 5px;/*no*/
                        left: 5px;
                        right: 400px;
                        padding: unset;
                        background: unset;
                        align-items: center;
                        .icon{
                          width:38px;
                          height:38px;
                          background:linear-gradient(135deg, #09a6d0 0%, #0a65d4 100%);
                          border-radius:6px;
                          margin-right: 10px;/*no*/
                          i{
                              font-size: 21px;
                              color: #fff;
                          }
                        }
                        .title{
                            span{
                                font-size:16px;
                                font-family:PingFangHK-Semibold,PingFangHK;
                                font-weight:600;
                                color:rgba(255,255,255,1);
                                &:last-child{
                                    font-size:12px;/*no*/
                                    font-family:PingFangSC-Regular,PingFang SC;
                                    font-weight:400;
                                    color:rgba(255,255,255,1);
                                }
                            }
                        }
                        .playBack{
                            width: 90px;/*no*/
                            position: absolute;
                            top: 50%;
                            transform: translateY(-50%);
                            right: 120px;/*no*/
                            background:linear-gradient(135deg, #09a6d0 0%, #0a65d4 100%);
                            box-shadow:0px 5px 9px 0px rgba(47,47,47,1);/*no*/
                            border-radius:50px;/*no*/
                            font-size:14px;/*no*/
                            font-family:PingFangSC-Semibold,PingFang SC;
                            // font-weight:600;
                            color:rgba(255,255,255,1);
                            padding: 8px 15px;
                            text-shadow:0px 2px 4px rgba(47,47,47,1);/*no*/
                            cursor: pointer;
                            i{
                                font-size: 20px;
                                color: #fff;
                                margin-right: 3px;
                            }
                            &.more{
                              right: 15px;/*no*/
                              background:linear-gradient(135deg, #09a6d0 0%, #0a65d4 100%);
                            }
                        }
                    }
                    .v-modal{
                      display: none;
                    }
                    .el-drawer__wrapper{
                      position: absolute;
                      /deep/.el-drawer__container{
                        >div{
                          width: 103px !important;/*no*/
                        }
                      }
                      .el-drawer__body{
                        .btnList{
                          padding: 15px;/*no*/
                          >div{
                            cursor: pointer;
                            padding: 0 13px;/*no*/
                            min-width:70px;/*no*/
                            height:30px;/*no*/
                            background:linear-gradient(318deg,rgba(29,91,250,1) 0%,rgba(29,144,250,1) 100%);
                            border-radius:4px;/*no*/
                            line-height: 28px;/*no*/
                            font-size:12px;/*no*/
                            font-family:PingFangSC-Regular,PingFang SC;
                            font-weight:400;
                            color:rgba(230,236,255,1);
                            margin-bottom: 10px;/*no*/
                            text-align: center;
                            span{
                              font-size:12px;/*no*/
                              font-family:PingFangSC-Regular,PingFang SC;
                              font-weight:400;
                              color:rgba(230,236,255,1);
                            }
                          }
                        }
                      }
                    }
                }
                .videoInfo{
                  display: flex;
                  flex: 1;
                  background: transparent;
                  border-radius:4px;
                  padding: 10px 0 0;/*no*/
                  /deep/.cardTitle{
                    left: 0 !important;
                  }
                  .videoTitle{
                    justify-content: space-between;
                    margin-bottom: 10px;/*no*/
                    span{
                      font-size:12px;/*no*/
                      font-family:PingFangSC-Semibold,PingFang SC;
                      font-weight:600;
                      color:#fff;
                      padding:0 10px;/*no*/
                      &.linkage{
                        cursor: pointer;
                      }
                    }
                  }
                }
                .allContainer{
                    height: 250px;
                    min-height: 150px;/*no*/
                    width: 100%;/*no*/
                    .el-col{
                       >div{
                         cursor: pointer;
                          height: 100%;
                          width: 100%;
                          background:rgba(32, 45, 85, 0.49);
                          border-radius:5px;/*no*/
                          padding: 20px;
                          .icon{
                            width: 68px;
                            height: 68px;
                            background: #2A3D7B;
                            border-radius: 16px;
                            margin-right: 20px;
                            i{
                              font-size: 35px;
                              color:#77B2FF;
                            }
                          }
                          .infoDetail{
                            flex: 1;
                              height: 68px;
                              justify-content: space-between;
                              >div{
                              justify-content: space-between;
                              }
                              span{
                                &:first-child{
                                  font-size: 14px;
                                  font-family: PingFangSC-Semibold, PingFang SC;
                                  font-weight: 600;
                                  line-height: 1;
                                  color: #FFFFFF;
                                  display: flex;
                                  align-items: center;
                                }
                                &:last-child{
                                  font-size: 32px;
                                  line-height: 1;
                                  font-family: DINAlternate-Bold, DINAlternate;
                                  font-weight: bold;
                                  color: #4EBFFF;
                                  display: flex;
                                  align-items: center;
                                }
                              }
                          }
                          &:first-child{
                          }
                          .detailContent{
                            width: 100%;
                            display: flex;
                            flex: 1;
                            height: calc(100% - 68px);
                            flex-direction: row;
                            align-items: center;
                            padding:10px 0;/*no*/
                            &.lampDetail{
                              justify-content: center;
                            }
                            /deep/.el-switch__label{
                              display: none;
                            }
                            /deep/.el-switch__label.is-active{
                              display: block;
                            }
                            .audioContent{
                              margin-right: 10px;/*no*/
                              .tsp-audio{
                              width: 260px;/*no*/
                              }
                            }
                          }
                        }
                    }
                }
            }
            &.el-col-8{
                .list{
                    height: 100%;
                    background: rgba(32, 45, 85, 0.49);
                    // border-radius: 4px;/*no*/
                    padding: 0 10px 20px;/*no*/
                    p{
                      color: #fff;
                      font-size: 12px;/*no*/
                    }
                    #card{
                      height: 100%;
                      background: transparent;
                    }
                    #adminSearchForm{
                        margin-top: 20px;
                        margin-bottom: 15px;
                        /deep/.el-form-item{
                          // margin-right: 0;
                          .el-select {
                            input{
                              width: 200px;
                            }
                          }
                          .el-date-editor{
                            width: 300px;
                          }
                        }
                        /deep/.btnInfo {
                          margin-bottom: 0px;
                          // float: right;
                        }
                        /deep/.el-button{
                          min-width: 54px !important;
                          padding: 9px 15px;
                        }
                        button{
                          background: linear-gradient(318deg, #1d5bfa 0%, #1d90fa 100%);
                        }
                    }
                    .infoList{
                        overflow: auto;
                        padding-right: 1px;/*no*/
                        .listItem{
                            padding: 10px;/*no*/
                            background:rgba(39, 55, 98, 1);
                            border-radius:6px;/*no*/
                            position: relative;
                            margin-bottom: 10px;/*no*/
                            position: relative;
                            cursor: pointer;
                            &.active {
                              border:1px solid #f2fbff;/*no*/
                            }
                            .el-tag{
                              position: absolute;
                              top: 0;
                              right: 0;
                              height: 25px;/*no*/
                              line-height: 25px;/*no*/
                              border-radius:3px;/*no*/
                              background: rgba(32, 45, 85, 1);
                              border-color: transparent;
                              color:#E6ECFF;
                            }
                            .el-image-viewer__close {
                              color: #fff;
                            }
                            .videoIframe{
                              width:120px;
                              height:80px;
                              margin-right: 15px;/*no*/
                              cursor: pointer;
                            }
                            .el-image{
                              width: 169px;
                              height: 112px;
                              margin-right: 15px;
                              border-radius: 3px;
                              img{
                                width: 100%;
                                height: 100%;
                              }
                              /deep/.image-error{
                                width: 100%;
                                height: 100%;
                                background: #374C83;
                                border: 1px solid #4D65A4;/*no*/
                                i{
                                  font-size: 26px;
                                  color: #97ABDF;
                                  margin-bottom: 8px;/*no*/
                                }
                                span{
                                  font-size: 12px;
                                  font-family: PingFangSC-Regular, PingFang SC;
                                  font-weight: 400;
                                  color: #FFFFFF;
                                }
                              }
                            }
                            .warn{
                              position: absolute;
                              top: 14px;/*no*/
                              left: 14px;/*no*/
                              padding: 2px 3px;/*no*/
                              background:rgba(0,0,0,0.75);
                              border-radius:3px;
                              img{
                                width: auto;
                              }
                            }
                            .info{
                                width: calc(100% - 135px);
                                .infoTitle{
                                    font-size:16px;/*no*/
                                    font-family:PingFangSC-Semibold,PingFang SC;
                                    font-weight:600;
                                    color:#E6ECFF;
                                    margin-bottom: 10px;/*no*/
                                }
                                .time{
                                    font-size:12px;/*no*/
                                    font-family:PingFangSC-Regular,PingFang SC;
                                    font-weight:400;
                                    color:#E6ECFF;
                                    margin-bottom: 4px;/*no*/
                                    span{
                                      width: 100%;
                                      padding-right: 40%;
                                      overflow: hidden;
                                      text-overflow:ellipsis;
                                      white-space: nowrap;
                                    }
                                }
                                .condition{
                                    font-size:12px;/*no*/
                                    font-family:PingFangSC-Regular,PingFang SC;
                                    font-weight:400;
                                    color:#E6ECFF;
                                    overflow: hidden;
                                    text-overflow:ellipsis;
                                    white-space: nowrap;
                                    padding-right: 30%;
                                    span{
                                        font-size:12px;/*no*/
                                        font-family:PingFangSC-Regular,PingFang SC;
                                        font-weight:400;
                                        color:rgba(255,255,255,1);
                                        border-radius:4px;
                                        padding: 3px 8px;
                                        background:rgba(189,192,195,1);
                                        &.active{
                                            background:rgba(86,165,240,1);
                                        }
                                        &.wait{
                                            background:#129ff7;
                                        }
                                    }
                                }
                            }
                            .playBack{
                                position: absolute;
                                right: 10px;/*no*/
                                bottom: 10px;/*no*/
                                padding: 7px 10px;
                                background: linear-gradient(318deg, #1197FF 0%, #4AA9FF 100%);
                                border-radius: 3px;/*no*/
                                font-size: 12px;
                                font-family: PingFangSC-Semibold, PingFang SC;
                                font-weight: 600;
                                color: #E6ECFF;
                                cursor: pointer;
                                display: flex;
                                align-items: center;
                                .icon{
                                  width: 19px;/*no*/
                                  height: 14px;/*no*/
                                  border-radius: 6px;/*no*/
                                  background: #FFFFFF;
                                  display: flex;
                                  align-items: center;
                                  justify-content: center;
                                  margin-right: 5px;/*no*/
                                  i{
                                    font-size: 6px;/*no*/
                                    color: #1197FF;
                                  }
                                }
                            }
                        }
                      &::-webkit-scrollbar {
                          width: 2px;/*no*/
                        }
                      &::-webkit-scrollbar-thumb {
                        border-radius: 10px;
                        -webkit-box-shadow: inset 0 0 5px rgba(236,239,246,0.2);/*no*/
                        background:#ececec;
                      }
                      &::-webkit-scrollbar-track {
                        -webkit-box-shadow: inset 0 0 5px rgba(236,239,246,0.2);/*no*/
                        border-radius: 0;
                        background:transparent;
                      }
                    }
                }
            }
        }
    }
      .el-dialog__wrapper{
    display: flex;
    align-items: center;
    justify-content: center;
  }
    /deep/.videoPlayBack{
        margin: 0 !important;

    }
}
.tableDialog{
  #tab-ledTable, .el-tabs__item span{
    color: #fff;
  }
  .el-tabs__item{
    &.is-active span{
      color:#409EFF;
    }
  }
  .audioContentList{
    display: flex;
    flex-direction: row;
    // overflow-x: auto;
    .audioContent{
      margin-right: 10px;/*no*/
      .tsp-audio{
        width: 260px;/*no*/
      }
    }
  }
}
@media screen and (max-width: 1000px) {
  .el-dialog__wrapper{
    display: flex;
    align-items: center;
    justify-content: center;
  }
      /deep/.videoPlayBack{
        margin: 0 !important;
    }
}
    @keyframes turn{
      0%{-webkit-transform:rotate(0deg);}
      25%{-webkit-transform:rotate(90deg);}
      50%{-webkit-transform:rotate(180deg);}
      75%{-webkit-transform:rotate(270deg);}
      100%{-webkit-transform:rotate(360deg);}
    }
</style>
