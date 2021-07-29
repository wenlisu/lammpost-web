<template>
  <div id="smokeAlarmLink">
      <dv-loading v-if="!initShow"></dv-loading>
      <el-row :gutter="10" v-if="initShow">
          <el-col :span="8">
              <div class="flexCloumn list">
                  <span class="title">监控事件</span>
                    <search-form
                        :searchItems="searchItems"
                        @onSearch="onSearch"
                    >
                      <div class="flexRow my-autocomplete" slot="streetCode">
                        <treeselect :value="searchVal.streetCode" @input="tressSelectInput" @select="tressSelectSelect"/>
                      </div>
                    </search-form>
                    <ul class="infinite-list infoList" v-infinite-scroll="getList" :infinite-scroll-disabled="scrollDisable" style="overflow:auto">
                    <li
                        class="infinite-list-item"
                        v-for="(item, index) in list"
                        :key="index"
                        @click="openVideo(item)"
                    >
                    <div class="flexRow listItem" :class="alarmItem.alarmCode === item.alarmCode ? 'active' : ''">
                        <el-tag type="danger">{{item.alarmType}}</el-tag>
                        <!-- <video
                          :src="item.url"
                          class="avatar video-avatar"
                          controls="controls"

                        >您的浏览器不支持视频播放</video> -->
                        <!-- <div class="videoIframe" @click="playAlarmSnippet(item)">
                          <iframe
                            :src="item.videoURL"
                            width="100%"
                            height="100%"
                            allow="autoplay"
                            border="0"
                            scrolling="no"
                            allowfullscreen
                        ></iframe>
                        </div> -->
                        <el-image
                            :src="item.picURL"
                            :preview-src-list="[item.picURL]">
                        </el-image>
                        <!-- <img :src="item.imagePath"/> -->
                        <div class="flexCloumn info">
                            <div class="infoTitle">{{item.deviceName}}</div>
                            <div class="flexRow time">
                                <span>发生位置：{{item.address}}</span>
                            </div>
                            <div class="condition">
                                发生时间：{{item.alarmTime}}
                            </div>
                        </div>
                        <div class="flexRow playBack" @click="playAlarmSnippet(item)">
                            <i class="iconfont iconshijianshipin" />
                            事件视频
                        </div>
                    </div>
                    </li>
                </ul>
              </div>
          </el-col>
          <el-col :span="16" class="flexCloumn">
            <el-scrollbar style="height:100%">
              <div class="flexCenter video">
                <!-- <iframe
                    :src="srcc"
                    width="100%"
                    height="100%"
                    allow="autoplay"
                    border="0"
                    scrolling="no"
                    id="Detailysopen"
                    ref="Detailysopen"
                    allowfullscreen
                ></iframe> -->
                  <iframe
                    :src="src"
                    width="100%"
                    height="100%"
                    allow="autoplay"
                    border="0"
                    scrolling="no"
                    id="Detailysopen"
                    ref="Detailysopen"
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
              <div class="flexCloumn videoInfo">
                <!-- <div class="flexRow videoTitle">
                  <span>场景联动</span>
                  <span class="linkage" @click="handleLinkage">场景联动详情</span>
                </div> -->
                <div class="linkageDetail">
                  <div class="leftRow allContainer">
                    <div class="el-col">
                      <div class="flexRow">
                        <div class="flexCenter icon"><img src="./images/img3.png" /></div>
                        <div class="flexRow infoDetail">
                          <span>全部事件</span>
                          <span>{{(countInfo && countInfo.allEvents) || 0}}</span>
                        </div>
                      </div>
                      <!-- <div class="infoDetail"></div> -->
                    </div>
                    <div class="el-col">
                      <div class="flexRow">
                        <div class="flexCenter icon"><img src="./images/img3.png" /></div>
                        <div class="flexRow infoDetail">
                          <span>今日事件</span>
                          <span>{{(countInfo && countInfo.todayEvents) || 0}}</span>
                        </div>
                      </div>
                      <!-- <div class="infoDetail"></div> -->
                    </div>
                  </div>
                  <div class="flexRow allContainer rightRow">
                    <div>
                      <el-col :span="24">
                        <div class="flexCloumn info1" @click="false && openTableDialog('audioTable')">
                          <div class="flexRow">
                            <div class="flexCenter icon"><img src="./images/img3.png" /></div>
                            <div class="flexRow infoDetail">
                              <span>入侵侦测</span>
                              <span>{{(countInfo && countInfo.intrusionDetectionCount) || 0}}个</span>
                            </div>
                          </div>
                          <div class="detailContent">
                            <div
                              v-for="audioFile in []"
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
                        </div>
                      </el-col>
                      <el-col :span="24">
                        <div class="flexCloumn info2" @click="false && openTableDialog('ledTable')">
                          <div class="flexRow">
                            <div class="flexCenter icon"><img src="./images/img4.png" /></div>
                            <div class="flexRow infoDetail">
                              <span>越界侦测</span>
                              <span>{{(countInfo && countInfo.intrusionDetectionCount) || 0}}个</span>
                            </div>
                          </div>
                          <div class="detailContent">
                            <Effect :index-data="effextArray"/>
                          </div>
                        </div>
                      </el-col>
                    </div>
                    <div>
                      <el-col :span="24">
                        <div class="flexRow info2" @click="false && openTableDialog('lightTable')">
                            <div class="flexCenter icon"><img src="./images/img4.png" /></div>
                            <div class="flexRow infoDetail">
                            <span>区域侦测</span>
                            <span>{{(countInfo && countInfo.areaDetectionCount) || 0}}个</span>
                            </div>
                        </div>
                      </el-col>
                      <el-col :span="24">
                        <div class="flexRow info2" @click="false && openTableDialog('persionTable')">
                            <div class="flexCenter icon"><img src="./images/img4.png" /></div>
                            <div class="flexCloumn infoDetail">
                              <div class="flexRow">
                                <span>物品侦测</span>
                                <span>{{(countInfo && countInfo.itemsDetectionCount) || 0}}个</span>
                              </div>
                            </div>
                        </div>
                      </el-col>
                    </div>
                  </div>
                </div>
              </div>
            </el-scrollbar>
          </el-col>
      </el-row>
        <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        width="550px"
        center
        @close="dialogVisible = false"
        >
        <iframe
        :src="this.serviceAddress"
        :style="{width: '100%', height: '100%'}"
        frameborder="0"
        allowfullscreen
        allow="autoplay"
        scrolling="no"
        ></iframe>
    </el-dialog>
    <el-dialog
      title="视频回放"
      :visible.sync="dialog.show"
      width="750px"
      center
      @close="dialogClose"
      custom-class='videoPlayBack'
      >
        <videoPlayBack :cameraId="dialog.cameraId" :src="dialog.src"/>
    </el-dialog>
    <el-dialog
      title="设备列表"
      :visible.sync="tableDialog.show"
      width="750px"
      center
      @close="tableDialogClose"
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
    </el-dialog>
  </div>
</template>
<script>
import {
  mapGetters
} from 'vuex';
import moment from 'moment';
import EZUIKit from 'ezuikit-js';
import searchForm from '@/components/adminSearchForm/searchForm';
import PageTable from '@/components/adminPage-table';
import audioContainer from '@/components/upload/audio';
import Effect from '@/view/index/publishPoleMap/components/effect';
import { getEvents } from 'api/IBM';
import { routePush, postData } from '@/util/util';
import { EVENT_LIST_TYPE } from '@/util/constants';
import warn from './images/warn.gif';
import img7 from './images/img7.png';
import img8 from './images/img8.png';
import img9 from './images/img9.png';
import img10 from './images/img10.png';
import countsInfo from './info';
import treeselect from './treeselect';
import videoPlayBack from '../videoPlayback';
import Flex from '@/components/flex';
import {
  getDeviceCount,
  getLinkageDeviceDetails,
  getLinkagePersonInfoDetails,
  getSmokeAlarmEvent,
  getCameraEventPage,
  getCameraEventStat,
  getCameraURLList
} from '@/api/smokeDetectorMap';
// const {Builder, By, Key, until} = require('selenium-webdriver');

// 设备类型
const deviceTypes = {
  'audioTable': 'AUDIO',
  'ledTable': 'LED',
  'lightTable': 'LAMP'
};

export default {
  name: 'smokeAlarmLink',
  data () {
    const { options } = this.$_useTypes(EVENT_LIST_TYPE);
    return {
      initSerialNum: '',
      srcc: 'http://hls01open.ys7.com/openlive/f01018a141094b7fa138b9d0b856507b.hd.m3u8',
      src: `https://open.ys7.com/ezopen/h5/iframe_se?url=ezopen://RPUENL@open.ys7.com/E63112920/1.live&accessToken=${this.common.accessToken}&templete=2`,
      initShow: false,
      channel: 1,
      loading: false,
      scrollDisable: false,
      searchVal: {
        streetCode: undefined,
        deviceName: ''
      },
      countInfo: {
        serialNumber: undefined,
        audioNum: undefined,
        lightsNum: undefined,
        phoneNum: undefined,
        smsnum: undefined,
        lednum: undefined
      },
      warn,
      searchItems: [{
        type: 'dataPicker',
        label: '日期',
        labelWidth: '45px',
        span: 15,
        props: {
          fieldName: 'data',
          prefixIcon: '',
          clearIcon: '',
          format: 'yyyy-MM-dd HH:mm:ss'
        }
      }, {
        type: 'select',
        label: '事件',
        labelWidth: '45px',
        span: 9,
        props: {
          fieldName: 'eventId',
          options: options
        }
      }, {
        type: 'input',
        label: '设备名称',
        initValue: '',
        labelWidth: '45px',
        span: 9,
        props: {
          fieldName: 'deviceName'
        }
      }, {
        type: 'custom',
        label: '位置',
        labelWidth: '45px',
        span: 12,
        props: {
          fieldName: 'streetCode'
        }
      }],
      timer: null,
      // time: '',
      list: [],
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      alarmItem: {
        alarmCode: undefined,
        serialNumber: undefined
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
              prop: 'programInfoDto'
            }
          ],
          page: {
            current: 1,
            pageSize: 10,
            total: 0
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
              prop: 'programInfoDto'
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
              prop: 'alarmTime',
              minWidth: '110px'
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
      },
      lampPower: {

      },
      ysplayer: null
    };
  },
  computed: {
    ...mapGetters(['common']),
    time () {
      return this.common.timeDay
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
    Flex
  },
  created () {
    // 获取路由中的参数并初始化视频地址
    if (JSON.stringify(this.$route.params) !== JSON.stringify({})) {
      this.alarmItem.alarmCode = this.$route.params.alarmCode
      this.alarmItem.serialNumber = this.$route.params.serialNumber
      this.searchVal.deviceName = this.$route.params.cameraName
      this.searchItems[2].initValue = this.$route.params.cameraName
      console.log('initValue', this.searchItems[2].initValue)
      let parames = {
        imei: '',
        streetCode: '',
        serialNumber: this.$route.params.serialNumber
      }
      this._getCameraURLList(parames)
    }
    this.loadCount()
  },
  mounted () {
    this.$nextTick(async () => {
      this.init();
    });
  },
  beforeDestroy () {
    clearInterval(this.timer);
  },
  watch: {
    $route (to, from) {
      // this.init()
    }
  },
  methods: {
    async init () {
      this.scrollDisable = false;
      this.initShow = false;
      this.channel = '1';
      this.list = [];
      this.currentIndex = 0;
      await this.load();
      this.initShow = true;
      this.$forceUpdate();
      this.ysplayer = new EZUIKit.EZUIPlayer('Detailysopen');
      this.ysplayer.play();
    },
    resize () {
      window.onresize(() => {

      })
    },
    // 视频地址
    _getCameraURLList (data) {
      let params = {
        imei: data.imei,
        streetCode: data.streetCode,
        serialNumber: data.serialNumber
      }
      getCameraURLList(params).then(res => {
        if (res.code === '200') {
          this.src = res.data[0].url
          this.alarmItem.address = res.data[0].address
          this.alarmItem.url = res.data[0].url
        }
      })
    },
    onSearch (val) {
      this.page.current = 1;
      this.list = []
      this.searchVal = {
        ...val,
        eventCode: +val.eventId,
        beginDate: val.data && val.data[0],
        endDate: val.data && val.data[1],
        streetCode: this.searchVal.streetCode ? this.searchVal.streetCode.map(streeCode => streeCode.nodeCode) : []
      };
      delete this.searchVal.data;
      this.getList();
    },
    load () {
      this.loading = false;
      this.getList();
    },
    loadCount (serialNumber = '') {
      getCameraEventStat(serialNumber).then(res => {
        if (res.code === '200') {
          this.countInfo = res.data;
        }
      })
    },
    // changeTime () {
    //   this.time = moment().format('YYYY-MM-DD HH:mm:ss')
    // },
    openVideo (item) {
      this.alarmItem = item;
      this.src = item.videoURL;
      this.player = this.$refs.ysopen.contentWindow;
      this.player.postMessage('play', 'https://open.ys7.com/ezopen/h5/iframe') /* 播放 */
      console.log('this.countInfo.serialNumber !== item.serialNumber', this.countInfo.serialNumber !== item.serialNumber);
      if (this.countInfo.serialNumber !== item.serialNumber) {
        this.loadCount(item.serialNumber);
        this.countInfo.serialNumber = item.serialNumber;
      }
    },
    playBack (item) {
      const today = moment().format('YYYYMMDD');
      this.dialog.show = true;
      this.dialog.src = `https://open.ys7.com/ezopen/h5/iframe_se?url=ezopen://RPUENL@open.ys7.com/${item.serialNumber}/at.avol532y60wkdmohbfm4fphn0dms4ia1-9rhtue5jit-0cys088-wsjd2hrmi=${today}&end=${today}`;
    },
    playAlarmSnippet (item) {
      const today = item.alarmTime;
      const beginDate = moment().subtract(5, 'seconds').format('YYYYMMDDHHmmss');
      const endDate = moment().add(5, 'seconds').format('YYYYMMDDHHmmss');
      this.dialog.show = true;
      this.dialog.src = item.videoURL;
      this.loadCount(item.serialNumber);
      this.countInfo.serialNumber = item.serialNumber;
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
      if (this.scrollDisable) {
        return;
      }
      getCameraEventPage(params).then(res => {
        if (res.code === '200') {
          this.page.current += 1;
          const { data, total } = res.data;
          this.page.total = total;
          if (data.length === 0) {
            this.loading = false;
            this.scrollDisable = true;
          } else {
            this.list = this.list.concat(data);
            if (data.length < 10) {
              this.scrollDisable = true;
            }
          }
          // this.list = data.map(data => {
          //   return {
          //     ...data
          //     // address: '汕尾市海丰县碧桂园小区'
          //   }
          // });
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
      routePush({
        title: '场景联动详情',
        name: 'linkageRuleListDetail',
        parames: {
          sceneCode: this.countInfo.sceneCode
        }
      })
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
          ...parames
        },
        pageNo: Number(this.tableDialog[tableType].page.current), // 查询的分页页码
        pageSize: Number(this.tableDialog[tableType].page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: ''
      };
      return apiMethod(data).then(res => {
        if (res.code === '200') {
          const { data, total } = res.data;
          pageTotal = total;
          tableData = data;
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
      this.tableDialog.audioTable.page.total = total;
      this.tableDialog.audioTable.tableData = tableData;
    },
    onAudioListPageSizeChange (val) {
      this.tableDialog.audioTable.page.pageSize = val;
      this.onAudioListCurrentChange(1);
    },
    onAudioSelectionChange (args) {
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
  destroyed () {
    this.player.stop();
  }
};
</script>
<style lang="less" scoped>
#smokeAlarmLink {
    /deep/.el-scrollbar__view {
      height: 100% !important;
    }
    /deep/.el-scrollbar__wrap {
      overflow-x: hidden !important;
    }
    .my-autocomplete {
      #treeselect{
        width: 350px;
      }
    }
    .el-row{
        height: calc(100% - 25px);
        .el-col{
            height: 100%;
            overflow: hidden;
            &.el-col-16{
                .video{
                    width: 100%;
                    height: 575px;/*no*/
                    // height: calc(100% - 250px);
                    background: #FFFFFF;
                    position: relative;
                    margin-bottom: 10px;/*no*/
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
                        // height: 500px !important;
                        position: absolute;
                        bottom: 5px;
                        left: 5px;
                        right: 400px;/*no*/
                        // padding: 10px 15px;/*no*/
                        // background:rgba(0,0,0,0.5);
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
                  // background:rgba(255,255,255,1);
                  // box-shadow:0px 2px 4px 0px rgba(213,213,213,0.5);
                  border-radius:4px;
                  // padding: 15px;/*no*/
                  .videoTitle{
                    justify-content: space-between;
                    margin-bottom: 10px;/*no*/
                    span{
                      font-size:12px;/*no*/
                      font-family:PingFangSC-Semibold,PingFang SC;
                      font-weight:600;
                      color:rgba(26,26,26,1);
                      padding:0 10px;/*no*/
                      &:first-child{
                        font-size:14px;/*no*/
                        border-left: 4px solid #129ff7;/*no*/
                      }
                      &.linkage{
                        cursor: pointer;
                      }
                    }
                  }
                  .linkageDetail{
                    display: flex;
                    .leftRow {
                      height: 250px;
                      flex: 1;
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      justify-content: center;
                      margin-right: 10px;
                    }
                    .rightRow {
                      height: 250px;
                      flex: 2;
                    }
                  }
                }
                .allContainer{
                    background: #fff;
                    padding: 20px;
                    height: 180px;
                    width: 100%;/*no*/
                    .el-col{
                      height: unset;
                      margin-bottom: 15px;
                      width: 100%;
                      display: flex;
                      justify-content: center;
                       >div{
                         cursor: pointer;
                          width: 80%;
                          background:rgba(255,255,255,1);
                          box-shadow:0px 3px 6px 0px rgba(242,229,229,0.5);
                          border-radius:10px;
                          border:1px solid #add3e2;/*no*/
                          padding: 10px;
                          .icon{
                            width:60px;
                            height:60px;
                            background:#add3e2;
                            border-radius:8px;
                            margin-right: 20px;
                            img{
                              width: 34px;
                              height: 31px;
                            }
                          }
                          .infoDetail{
                            width: calc(100% - 60px);
                              height: 60px;
                              justify-content: space-between;
                              >div{
                              justify-content: space-between;
                              }
                              span{
                                &:first-child{
                                  font-size:14px;
                                  font-family:PingFangSC-Regular,PingFang SC;
                                  font-weight:400;
                                  color:rgba(100,100,100,1);
                                  display: flex;
                                  align-items: center;
                                }
                                &:last-child{
                                  font-size:22px;
                                  font-family:DINAlternate-Bold,DINAlternate;
                                  font-weight:bold;
                                  color:rgba(57,57,57,1);
                                  display: flex;
                                  align-items: center;
                                }
                              }
                          }
                          &:first-child{
                              // margin-bottom: 17px;
                              .icon{
                                  background:#f2fbff;
                              }
                          }
                        }
                    }
                }

            }
            &.el-col-8{
                .list{
                    height: 100%;
                    background: #fff;
                    padding: 15px;/*no*/
                    .title{
                        font-size:14px;/*no*/
                        font-family:PingFangSC-Semibold,PingFang SC;
                        font-weight:600;
                        color:rgba(26,26,26,1);
                        padding:0 10px;/*no*/
                        border-left: 4px solid #129ff7;/*no*/
                    }
                    #adminSearchForm{
                        margin-top: 20px;
                        margin-bottom: 15px;
                        /deep/.el-form-item{
                          // margin-right: 0;
                          .el-select {
                            input{
                              // width: 200px;
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
                            background:#fff;
                            box-shadow:0px 0px 9px 0px rgba(255,255,255,1);/*no*/
                            border-radius:3px;
                            border:1px solid rgba(236,236,236,1);/*no*/
                            position: relative;
                            margin-bottom: 10px;/*no*/
                            position: relative;
                            cursor: pointer;
                            &.active {
                              background:#f2fbff;
                            }
                            .el-tag{
                              position: absolute;
                              top: 0;
                              right: 0;
                              height: 25px;/*no*/
                              line-height: 25px;/*no*/
                              border-radius:3px;
                            }
                            .videoIframe{
                              width:120px;
                              height:80px;
                              margin-right: 15px;
                              cursor: pointer;
                            }
                            .el-image{
                                width:120px;
                                height:80px;
                                margin-right: 15px;
                                img{
                                    width: 100%;
                                    height: 100%;
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
                                justify-content: space-between;
                                .infoTitle{
                                    font-size:16px;
                                    font-family:PingFangSC-Semibold,PingFang SC;
                                    font-weight:600;
                                    color:rgba(69,69,69,1);
                                }
                                .time{
                                    font-size:12px;
                                    font-family:PingFangSC-Regular,PingFang SC;
                                    font-weight:400;
                                    color:rgba(69,69,69,1);
                                    span{
                                      width: 100%;
                                      padding-right: 30%;
                                      overflow: hidden;
                                      text-overflow:ellipsis;
                                      white-space: nowrap;
                                    }
                                }
                                .condition{
                                    font-size:12px;
                                    font-family:PingFangSC-Regular,PingFang SC;
                                    font-weight:400;
                                    color:rgba(69,69,69,1);
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
                                top: 50%;
                                right: 10px;/*no*/
                                transform: translateY(-10%);
                                padding: 10px 11px;
                                background:linear-gradient(135deg, #09a6d0 0%, #0a65d4 100%);
                                box-shadow:0px 2px 4px 0px #c0d0ff;/*no*/
                                border-radius:6px;/*no*/
                                font-size:12px;
                                font-family:PingFangSC-Semibold,PingFang SC;
                                font-weight:600;
                                color:rgba(255,255,255,1);
                                line-height:17px;
                                cursor: pointer;
                                i{
                                    font-size: 13px;
                                    color: #fff;
                                    margin-right: 6px;
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
