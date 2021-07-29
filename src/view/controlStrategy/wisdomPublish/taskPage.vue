-<template>
  <div id="wisdomPublishTaskPage">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{path: '/publishPoleMap'}">智慧发布</el-breadcrumb-item>
      <el-breadcrumb-item>播放任务</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="flexRow mainContent">
      <div class="flexCloumn treeMain">
        <div class="flexRow flexCenter infoInput">
          活动
            <el-input
                placeholder="请搜索您要查找的活动"
                v-model="filterText"
              >
              <i slot="suffix" class="el-input__icon iconfont icon-xingzhuang"></i>
            </el-input>
          </div>
          <div class="infoTree">
            <el-tree
              :data="data"
              node-key="id"
              :default-expanded-keys="expandedKeys"
              :default-checked-keys="checkedKeys"
              :filter-node-method="filterNode"
              :load="loadNode"
              :props="defaultProps"
              @node-click="nodeClick"
              iconClass="el-icon-caret-right iconClass"
              :show-checkbox="false"
              :check-on-click-node="true"
              :auto-expand-parent="true"
              lazy
              ref="tree"
            >
              <span
              class="custom-tree-node"
              slot-scope="{ node, data }"
              :class="node.data.id === activityCode && 'is-current'"
              >
                <div :class="`labelIndex${data.index}`">
                  <div class="flexRow labelContent">
                    <i class="iconfont" :class="`icon-${data.icon}`" :style="{display: data.index === 1 ? 'inline-block' : 'none'}"/>
                    <span>{{ node.label }}</span>
                  </div>
                  <span class="dataSpan" :style="{display: data.index != 1 ? 'block' : 'none', fontSize: '12px'}">{{`${data.beginDate}~${data.endDate}`}}</span>
                </div>
                <!--  -->
              </span>
            </el-tree>
          </div>
      </div>

      <div
        class="flexRow pushInfo"
      >
        <div class="ledInfo">
          <div class="titleInfo flexRow">
            <scrollView>
              <div class="flexRow">
                <div
                  class="titleItem"
                  @click="handleChangeProgram(item)"
                  v-for="item in programData"
                  :key="item.programCode"
                  :class="item.programCode === programActiveId && 'is-current'"
                >
                  <div>{{`${item.beginTime}-${item.endTime}`}}</div>
                  <div>{{item.programName}}</div>
                </div>
              </div>
            </scrollView>
          </div>
          <div class="flexCloumn ledContent">
            <div class="screenTitle" v-if="!!programType">{{ programType === 1 ? '全屏' : '四宫格'}}</div>
            <div class="flexRow splitScreenTitle">
              <div
                v-for="(item) in [{
                  id: 0,
                  name: '区域一'
                }, {
                  id: 1,
                  name: '区域二'
                }, {
                  id: 2,
                  name: '区域三'
                }, {
                  id: 3,
                  name: '区域四'
                }]"
                :key="item.id"
                @click="handleChangeEffArray(item.id)"
                v-if="!!programType && programType !== 1"
                class="titleItem"
              >
                {{item.name}}
              </div>
            </div>
            <div class="flexCenter ledImgList">
              <Effect :index-data="effextArray"/>
            </div>
            <scrollView>
              <div class="flexRow breviarylist">
                <div
                  class="breviaryItem"
                  v-for="item in effextArray"
                  :key="item.Src"
                >
                  <img :src="`${baseURL || config.baseURL.dev}/upload${item.Src}`" v-if="item.mediaType === 1"/>
                  <video :src="`${baseURL || config.baseURL.dev}/upload${item.Src}`" controls="controls" class="avatar video-avatar" v-if="item.mediaType === 2">您的浏览器不支持视频播放</video>
                  <div class="textTemplate" v-if="item.mediaType === 3">
                    <div class="textContent">
                      {{item.Src}}
                    </div>
                  </div>
                </div>
              </div>
            </scrollView>
          </div>
        </div>
        <div class="mapInfo">
          <dv-loading v-if="!baiduMapShow"></dv-loading>
          <div class="numberInfo" v-if="baiduMapShow">
            <span>{{bmMarkers.length}}</span>个LED显示屏位置分布
          </div>
          <baidu-map ref="map" class="bm-view" ak="ZyKWZjnDOAUE4WEq9Qu9SMT4b9v8iUGM" :center="center" :zoom="zoom" :scroll-wheel-zoom="true" @ready="handler" @zoomend="onZoomend" :class="baiduMapShow && 'readyMap'">
            <bm-marker
              v-for="(item, index) in bmMarkers"
              :key="`${index}+${item.id}`"
              :position="item.position"
              :icon="{url: item.url, size: item.size}"
              :zIndex="item.zIndex"
              :dragging="false"
              @click="onClickMarker(item)"
              :top="item.zIndex === 2 ? true : false"
              :title="item.terminalName"
            >
            </bm-marker>
            <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_LEFT" :showAddressBar="true" :autoLocation="true" v-if="baiduMapShow"></bm-geolocation>
          </baidu-map>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  mapGetters
} from 'vuex';
import store from '@/store';
import moment from 'moment';
import {BmGeolocation, BmMarker} from 'vue-baidu-map-v3/components';
import { getGroupPolicy, getLamp } from 'api/index';
import {
  selectTemplate
} from 'api/controlStrategy';
import {
  ledDetail,
  publishDetail
} from 'api/led/index';
import {
  getLedprogramTree
} from 'api/screen';
import { checkTimeBetween } from '@/util/util';
import config, { baseURL } from '@/config';
import commonTemplate from '../commonTemplate';
import { policyTypes } from './util';
import pageMain from 'components/pageMain';
import led1 from '@/common/images/markers/led1.png';
import led3 from '@/common/images/markers/led3.png';
import Effect from '@/view/index/publishPoleMap/components/effect';
import scrollView from '@/components/sideMenu/scrollView';
import img7 from '@/view/index/lightPoleMap/images/img7.png';
import img8 from '@/view/index/lightPoleMap/images/img8.png';
import img9 from '@/view/index/lightPoleMap/images/img9.png';
import img10 from '@/view/index/lightPoleMap/images/img10.png';
import { COMMON_TEMPLATE_SERVICE_TYPE, LIGHT_TYPE } from '@/util/constants';
/** 灯杆状态 */
const lightTypes = {
  1: {
    normal: led1,
    current: led1
  },
  0: {
    normal: led3,
    current: led3
  }
};
const iconType = {
  1: 'zhengcexuanchuan',
  2: 'wenhuachuanbo',
  3: 'gongyi',
  4: 'yingjimeiti',
  5: 'jiaotongzhiyin'
}
export default {
  components: {
    BmMarker,
    BmGeolocation,
    scrollView,
    Effect,
    pageMain
  },
  data () {
    return {
      currentTitleList: [
        {
          name: 'publishPoleMap',
          title: '智慧发布地图'
        },
        {
          name: 'wisdomPublishTaskPage',
          title: '播放任务'
        }
      ],
      filterText: '',
      center: '广东',
      data: [],
      config,
      baseURL,
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'leaf'
      },
      resourceType: 1,
      activeName: 'led',
      word: {
        id: null,
        keyWord: [],
        templateName: ''
      },
      typeCommandList: [{
        policyContent: 1,
        chooseDate: undefined,
        policyStatus: null,
        displayWay: null
      }, {
        policyContent: 2,
        chooseDate: undefined,
        policyStatus: null,
        displayWay: null
      }, {
        policyContent: 3,
        chooseDate: undefined,
        policyStatus: null,
        displayWay: null
      }, {
        policyContent: 4,
        chooseDate: undefined,
        policyStatus: null,
        displayWay: null
        // onTime: null
      }],
      form: {
        groupName: '',
        number: '',
        imei: []
      },
      fileList: {
        1: [],
        2: [],
        3: []
      },
      activityCode: null,
      programData: [],
      programActiveId: null,
      programType: null,
      effextArray: [],
      ledImg: null,
      zoom: 8,
      bmMarkers: [],
      baiduMapShow: false,
      expandedKeys: [],
      checkedKeys: []
    };
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted () {
    this.$nextTick(async () => {
      const groupNo = this.common['wisdomPublishTaskPage'] && this.common['wisdomPublishTaskPage'].groupNo;
    });
  },
  computed: {
    ...mapGetters(['common', 'openPage'])
  },
  methods: {
    handler ({ BMap, map }) {
      let mapStyle = {style: 'midnight'};
      setTimeout(async () => {
        map.setMapStyleV2({
          styleId: '02b81ab7cd95f6aece86c3500bf9b3cf'
        });
        this.baiduMapShow = true;
      }, 550);
    },
    onZoomend ({target}) {
      this.zoom = target.Na;
    },
    filterNode (value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    nodeClick (item, node, self) {
      if (node.level === 2) {
        this.activityCode = node.data.id;
        this._getInfo(item.mapDtos);
        this.getDetail(item.programDtos);
      }
      // if (!item.groupNo) return;
      // this.getLedDetail(item.groupNo);
    },
    loadNode (node, resolve) {
      if (node.level === 0) {
        getLedprogramTree({
          programScenario: 0
        }).then(res => {
          if (res.code === '200') {
            const treeData = res.data.map((daItem, index) => {
              if (index === 0) {
                this.expandedKeys = [daItem['programScenario']]
              }
              return {
                id: daItem['programScenario'],
                label: daItem['programScenarioDesc'],
                icon: iconType[daItem.programScenario],
                index: 1,
                ...daItem,
                children: null
              }
            });
            resolve(treeData)
          }
        })
      }
      if (node.level === 1) {
        getLedprogramTree({
          programScenario: node.data.programScenario
        }).then(res => {
          if (res.code === '200') {
            const treeData = res.data.map((daItem, index) => {
              if (index === 0) {
                this.checkedKeys = [daItem['activityCode']];
                this.activityCode = daItem['activityCode'];
                this._getInfo(daItem.mapDtos);
                this.getDetail(daItem.programDtos);
              }
              return {
                id: daItem['activityCode'],
                label: daItem['activityName'],
                ...daItem,
                leaf: true
              }
            });
            console.log('treeData', treeData);
            resolve(treeData)
          }
        })
      }
    },
    async getDetail (dtos) {
      this.programData = dtos;
      this.programActiveId = dtos[0].programCode;
      this.programType = dtos[0].ledRects[0].rectType;
      const effextArray = await this.getEffext(dtos[0].ledRects[0].ledMedias)
      this.effextArray = effextArray;
    },
    getEffext (items) {
      return items.map(medias => {
        const { types } = this.$_useTypes(COMMON_TEMPLATE_SERVICE_TYPE);
        return {
          ...medias,
          Type: types[medias.mediaType],
          Src: medias.source
        }
      });
    },
    async handleChangeEffArray (index) {
      const currentProgramData = this.programData.find(data => data.programCode === this.programActiveId);
      const effextArray = await this.getEffext(currentProgramData.ledRects[index].ledMedias);
      this.effextArray = effextArray;
    },
    _getInfo (lampAreaDtos) {
      const bmMarkers = lampAreaDtos.map((data, index) => {
        const status = data.power;
        return {
          ...data,
          size: {width: 17, height: 32},
          status,
          url: lightTypes[status] && lightTypes[status].normal,
          zIndex: data.terminalPosition === 2 ? 1 : 2,
          position: {
            lng: +data.longitude,
            lat: +data.latitude
          }
        }
      });
      this.bmMarkers = bmMarkers;
      this.zoom = 14;
      const centerData = lampAreaDtos[parseInt((lampAreaDtos.length / 2), 10)];
      this.center = {
        lng: +centerData.longitude,
        lat: +centerData.latitude
      };
    },
    async handleChangeProgram (item) {
      console.log('item', item);
      if (this.programActiveId !== item.programCode) {
        this.programActiveId = item.programCode;
        const effextArray = await this.getEffext(item.ledRects[0].ledMedias)
        this.effextArray = effextArray;
      }
    }
  }
};
</script>
<style lang="less">
#wisdomPublishTaskPage {
  .mainContent {
    height: calc(100% - 25px);
  }
  min-height: calc(100vh - 145px);
  >div{
    padding: 10px;/*no*/
    background:rgba(32,45,85,0.49);
    border-radius:4px;/*no*/
  }
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
  .treeMain{
    flex: 1;
    margin-right: 10px;/*no*/
    .infoInput{
      font-size:12px;/*no*/
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(230,236,255,1);
      word-break: keep-all;
      margin-bottom: 10px;/*no*/
      .el-input{
        display: flex;
        margin-left: 10px;/*no*/
        input{
          height: 32px;/*no*/
          border-radius:4px;/*no*/
          background: transparent;
          border:1px solid rgba(71,85,138,1);/*no*/
          padding: 8px 12px;/*no*/
          font-weight:400;
          color: #fff;
          &::-webkit-input-placeholder { /* WebKit browsers */
              color: #5065A4;
          }
          &:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
              color: #5065A4;
          }
          &::-moz-placeholder { /* Mozilla Firefox 19+ */
              color: #5065A4;
          }
          &:-ms-input-placeholder { /* Internet Explorer 10+ */
              color: #5065A4;
          }
        }
        .el-input__suffix{
          right: 12px;/*no*/
          .el-input__icon{
            font-size: 16px;/*no*/
          }
        }
      }
    }
    .infoTree{
      width: 100%;
      .el-tree{
        width: 100%;
        background: transparent;
        >.el-tree-node{
          background:rgba(49,60,103,1);
          border-radius:4px;/*no*/
          margin-bottom: 10px;/*no*/
          &:hover, &:active, &:focus{
           .el-tree-node__content{
              background: #313c67;
            }
          }
          .el-tree-node__content{
            padding: 13px !important;/*no*/
            height: 42px;/*no*/
            &
            .iconClass{
              position: absolute;
              right: 13px;/*no*/
            }
            .custom-tree-node{
              width: 100%;
              font-size:14px;/*no*/
              font-family:PingFangSC-Regular,PingFang SC;
              font-weight:400;
              color:rgba(121,135,189,1);
              .labelContent{
                span{
                  overflow: hidden;
                }
              }
              i{
                font-size: 17px;
                background-image: -webkit-linear-gradient(-45deg, #F0F3FF 20%, #C5D2FF 60%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin-right: 8px;/*no*/
                line-height: 20px;/*no*/
              }
            }
          }
          >.el-tree-node__children{
            >.el-tree-node{
              padding: 0 10px 0;/*no*/
              margin-bottom: 5px;/*no*/
              .el-tree-node__content{
                padding: 0 !important;
                height: auto;
                .custom-tree-node{
                  padding: 7px 13px !important;/*no*/
                  padding-left: 30px !important;/*no*/
                  border-radius:2px;/*no*/
                  background:rgba(34,44,84,1);
                  position: relative;
                  &::after{
                    content: '';
                    width:4px;/*no*/
                    height:4px;/*no*/
                    background:#FFFFFF;
                    position: absolute;
                    left: 11px;/*no*/
                    top: 14px;/*no*/
                  }
                  &.is-current{
                    background:linear-gradient(135deg,rgba(81,135,243,1) 0%,rgba(47,77,193,1) 100%);
                    color:rgba(255,255,255,1);
                     &::after{
                      background:rgba(0,207,255,1);
                    }
                  }
                }
              }
              &:last-child{
                margin-bottom: 10px;/*no*/
              }
            }
          }
          &.is-expanded{
            >.el-tree-node__content{
              i{
                background-image: -webkit-linear-gradient(-45deg, #E3F8FF 20%, #7CD4FF 60%);
              }
            }
          }
        }
      }
    }
  }
  .pushInfo{
    flex: 6;
    .ledInfo{
      flex: 2;
      width: 40%;
      .titleInfo{
        width: 100%;
        justify-content: space-between;
        margin-bottom: 5px;/*no*/
        .scrollView__nav{
        }
        .titleItem{
          width: 100px;/*no*/
          padding: 7px;/*no*/
          background:rgba(32,44,89,1);
          border-radius:2px;/*no*/
          cursor: pointer;
          margin-right: 10px;/*no*/
          overflow: hidden;
          &:last-child{
            margin-right: 0;
          }
          >div{
            font-size:14px;/*no*/
            font-family:PingFangSC-Semibold,PingFang SC;
            font-weight:600;
            margin-bottom: 4px;/*no*/
            word-break: keep-all;
            text-align: center;
            color:rgba(121,135,189,1);
            &:first-child{
              font-size:14px;
              font-family:PingFangSC-Regular,PingFang SC;
              font-weight:400;
            }
          }
          &.is-current{
            background:linear-gradient(318deg,rgba(0,143,209,1) 0%,rgba(47,174,247,1) 100%);
            >div{
              color: #fff;
            }
          }
        }
      }
      .ledContent{
        height: 60%;
        position: relative;
        .splitScreenTitle{
          .titleItem{
            font-size: 12px;/*no*/
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #fff;
            padding: 0 20px;/*no*/
            &:first-child{
              padding-left: 0;
            }
          }
        }
        .screenTitle{
          padding-bottom: 5px;/*no*/
          border-bottom: 1px solid #2e3d6b;/*no*/
          font-size: 12px;/*no*/
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #fff;
        }
        .ledImgList{
          flex: 1;
          position: relative;
          border:1px solid #7987bd;
          overflow: hidden;
          i{
            font-size: 48px;
            color: #7987bd;
          }
          /deep/#wrpaBox{
            display: flex;
            width: 240px;/*no*/
            height: 160px;/*no*/
          }
        }
        .scrollView__nav-wrap{
          position: absolute;
          left: 0;
          right: 0;
          bottom: 6px;/*no*/
          height: 52px;
          .scrollView__nav-scroll, .scrollView__nav{
            width: 100%;
            height: 100%;
          }
        }
        .breviarylist{
          width: 100%;
          height: 52px;
          position: absolute;
          bottom: 0px;
          padding:0px 6px;/*no*/
          justify-content: space-between;
          .breviaryItem{
            width: 70px;
            height: 100%;
            position: relative;
            overflow: hidden;
            margin-right: 10px;/*no*/
            display: flex;
            align-items: center;
            justify-content: center;
            img{
              width: 100%;
              height: auto;
              transform: scale(0.7);
            }
            video{
              width: 96%;
              transform: scale(0.7);
            }
            .textTemplate{
              width: 100%;
              height: 100%;
              padding: 5px;/*no*/
              background:linear-gradient(171deg,rgba(21,173,182,1) 0%,rgba(49,72,219,1) 100%);
              box-shadow:0px 2px 9px 0px rgba(72,128,255,0.5);/*no*/
              border-radius:5px;
              display: flex;
              flex-direction: column;
              color: #fff;
              .textContent{
                transform: scale(0.5);
              }
            }
            &:last-child{
              margin-right: 0;
            }
          }
        }
        .ledVideo{
          width: 100%;
          height: 100%;
          border:1px solid #7987bd;
          i{
            font-size: 48px;
            color: #7987bd;
          }
          video{
            width: 96%;
          }
        }
        .ledTemplate{
          width: 100%;
          height: 100%;
          border:1px solid #7987bd;
          i{
            font-size: 48px;
            color: #7987bd;
          }
          .textTemplate{
            width: 96%;
            height: 98%;
            padding: 20px 35px 20px 18px;
            background:linear-gradient(171deg,rgba(21,173,182,1) 0%,rgba(49,72,219,1) 100%);
            box-shadow:0px 2px 9px 0px rgba(72,128,255,0.5);/*no*/
            border-radius:5px;
            display: flex;
            flex-direction: column;
            .title{
              font-size:14px;
              font-family:PingFangSC-Semibold,PingFang SC;
              font-weight:600;
              color:rgba(255,255,255,1);
              // line-height:14px;
              text-shadow:0px 2px 4px rgba(17,118,111,0.5);
              margin-bottom: 7px;
            }
            ul{
              li{
                font-size:12px;/*no*/
                font-family:PingFangSC-Regular,PingFang SC;
                font-weight:400;
                color:rgba(255,255,255,1);
                padding: 6px 0;
                // line-height:17px;
              }
            }
          }
        }
      }
      .policyInfo{
        .el-radio-group{
          .el-radio{
            margin-left:0;
            margin-bottom: 3px;/*no*/
            .el-radio__input{
              .el-radio__inner{
                width: 12px;/*no*/
                height: 12px;/*no*/
                border-color: #FFFFFF;
                background: transparent;
              }
            }
            &.is-checked{
              .el-radio__inner{
                border-color: #1890ff;
                &::after{
                  background: #1890ff;
                }
              }
            }
          }
        }
        /deep/.el-form-item__label,
        .el-form-item__content{
          line-height: 14px;/*no*/
        }
        /deep/.el-form-item__label,
        /deep/.el-radio .el-radio__label,
        /deep/.el-checkbox {
          width: auto !important;
          color: #e6ecff;
          font-size: 12px;/*no*/
        }
      }
    }
    .mapInfo{
      flex: 5;
      width: 60%;
      padding-left: 10px;/*no*/
      position: relative;
      .numberInfo{
        position: absolute;
        z-index: 1;
        left: 50%;
        top: 10px;/*no*/
        transform: translateX(-50%);
        background:linear-gradient(318deg,rgba(62,83,138,1) 0%,rgba(47,62,125,1) 100%);
        border-radius:2px;/*no*/
        padding: 5px 7px;/*no*/
        font-size:14px;/*no*/
        font-family:PingFangSC-Semibold,PingFang SC;
        font-weight:600;
        color:rgba(255,255,255,1);
        span{
          background:linear-gradient(318deg,rgba(0,100,196,1) 0%,rgba(13,155,236,1) 100%);
          border-radius:2px;
          font-size:19px;/*no*/
          font-family:DINAlternate-Bold,DINAlternate;
          font-weight:bold;
          color:rgba(255,255,255,1);
          margin-right: 5px;/*no*/
          padding: 2px 8px;/*no*/
        }
      }
      .bm-view {
        width: 100%;
        height: 100%;
        position: relative;
        visibility: hidden;
        &.readyMap{
          visibility: visible;
        }
      }
    }
  }
}
</style>
