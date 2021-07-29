-<template>
  <div id="wisdomPublishPage" class="flexRow">
    <div class="flexCloumn treeMain">
      <div class="flexRow flexCenter infoInput">
        策略
          <el-input
              placeholder="请搜索您要查找的策略"
              v-model="filterText"
            >
            <i slot="suffix" class="el-input__icon iconfont icon-xingzhuang"></i>
          </el-input>
        </div>
        <div class="infoTree">
          <el-tree
            :data="data"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            @node-click="nodeClick"
            iconClass="el-icon-caret-right iconClass"
            :show-checkbox="false"
            ref="tree"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <div :class="`labelIndex${data.index}`">
                <div class="flexRow labelContent">
                  <i class="iconfont" :class="`icon-${data.icon}`" :style="{display: data.index === 1 ? 'inline-block' : 'none'}"/>
                  <span>{{ node.label }}</span>
                </div>
                <span :style="{display: data.index != 1 ? 'block' : 'none'}">{{`${data.workTime}~${data.closeTime}`}}</span>
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
          <div class="titleItem" :class="resourceType === 1 && 'is-current'" @click="resourceType = 1">
            <div>图片</div>
            <div>{{typeCommandList.find(item => item.policyContent === 1).chooseDate}}</div>
          </div>
          <div class="titleItem" :class="resourceType === 2 && 'is-current'" @click="resourceType = 2">
            <div>视频</div>
            <div>{{typeCommandList.find(item => item.policyContent === 2).chooseDate}}</div>
          </div>
          <div class="titleItem" :class="resourceType === 3 && 'is-current'" @click="resourceType = 3">
            <div>文字</div>
            <div>{{typeCommandList.find(item => item.policyContent === 3).chooseDate}}</div>
          </div>
        </div>
        <div class="ledContent">
          <div
            class="flexCenter ledImgList"
            v-if="resourceType === 1"
          >
            <i class="el-icon-picture-outline" :style="{display: fileList[1][0] && fileList[1][0] ? 'none' : 'flex'}"></i>
            <img :src="ledImg || fileList[1][0]" :style="{display: fileList[1][0] && fileList[1][0] ? 'flex' : 'none'}"/>
            <ul class="flexRow" v-if="fileList[1].length > 0">
              <li
                v-for="(img, index) in fileList[1]"
                :key="index"
                :class="(ledImg || fileList[1][0]) === img && 'is-current'"
                @click="ledImg = img"
              >
                <img :src="img"/>
              </li>
            </ul>
          </div>
          <div class="flexCenter ledVideo" v-if="resourceType === 2">
            <i class="el-icon-video-camera" :style="{display: fileList[2][0] && fileList[2][0].url ? 'none' : 'flex'}"></i>
            <video :src="fileList[2][0] && fileList[2][0].url" controls="controls" class="avatar video-avatar" v-if="fileList[2][0] && fileList[2][0].url">您的浏览器不支持视频播放</video>
          </div>
          <div class="flexCenter ledTemplate" v-if="resourceType === 3">
            <i class="el-icon-document" :style="{display: word.keyWord && word.keyWord.length > 0 ? 'none' : 'flex'}"></i>
            <div class="textTemplate" v-if="word.keyWord && word.keyWord.length > 0">
              <div class="title">{{word.templateName}}</div>
              <ul>
                <li
                v-for="(item, index) in word.keyWord"
                :key="index"
                >
                  {{item}}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="policyInfo">
          <el-form ref="ruleForm" label-width="60px" label-position="left">
            <el-form-item label="策略状态：" prop="name" style="margin-bottom:10px">
              <el-radio-group v-model="typeCommandList.find(item => item.policyContent === resourceType).policyStatus">
                <el-radio :label="1">开启</el-radio>
                <el-radio :label="2">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="播放方式：" prop="name" v-if="resourceType == 1 || resourceType == 2 || activeName === 'video'">
              <el-radio-group v-model="typeCommandList.find(item => item.policyContent === resourceType).displayWay">
                <el-radio :label="1" v-if="resourceType==1 || activeName === 'video'">循环播放</el-radio>
                <el-radio :label="2" v-if="resourceType==1 || activeName === 'video'">定时播放</el-radio>
                <el-radio :label="3" v-if="resourceType==1 || activeName === 'video'">插播</el-radio>
                <el-radio :label="4" v-if="resourceType==1 || activeName === 'video'">跟播</el-radio>
                <el-radio :label="5" v-if="resourceType==1 || activeName === 'video'">定时转播</el-radio>
                <el-radio :label="6" v-if="resourceType==2 || activeName === 'video'">循环轮播3次</el-radio>
                <el-radio :label="7" v-if="resourceType==2 || activeName === 'video'">循环轮播5次</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="mapInfo">
        <dv-loading v-if="!baiduMapShow"></dv-loading>
        <div class="numberInfo" v-if="baiduMapShow">
          <span>{{form.number}}</span>个LED显示屏位置分布
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
import { LIGHT_TYPE } from '@/util/constants';
import { checkTimeBetween } from '@/util/util';
import config, { baseURL } from '@/config';
import commonTemplate from '../commonTemplate';
import { policyTypes } from './util';
import img7 from '@/view/index/lightPoleMap/images/img7.png';
import img8 from '@/view/index/lightPoleMap/images/img8.png';
import img9 from '@/view/index/lightPoleMap/images/img9.png';
import led1 from '@/common/images/markers/led1.png';
import led2 from '@/common/images/markers/led2.png';
import led3 from '@/common/images/markers/led3.png';
import img10 from '@/view/index/lightPoleMap/images/img10.png';
/** 灯杆状态 */
const lightTypes = {
  1: {
    normal: led1,
    current: led1
  },
  2: {
    normal: led2,
    current: led2
  },
  3: {
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
    BmGeolocation
  },
  data () {
    return {
      filterText: '',
      center: '广东',
      data: [],
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
      ledImg: null,
      zoom: 8,
      bmMarkers: [],
      baiduMapShow: false
    };
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted () {
    this.$nextTick(async () => {
      await this._publishDetail();
      const groupNo = this.common['wisdomPublishPage'] && this.common['wisdomPublishPage'].groupNo;
      this.getLedDetail(groupNo);
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
      if (!item.groupNo) return;
      this.getLedDetail(item.groupNo);
    },
    async _publishDetail () {
      await publishDetail().then(res => {
        if (res.code === '200') {
          const dataOptions = res.data.map(data => {
            const children = data.children.map((child, index) => {
              return {
                ...child,
                id: child.groupNo,
                index: 2,
                label: child.groupName
              }
            });
            return {
              id: data.policyType,
              label: data.policyTypeText,
              index: 1,
              icon: iconType[data.policyType],
              children: children.length > 0 ? children : null
            }
          });
          this.data = dataOptions;
        }
      });
    },
    setDefault (data) {
      this.form = {
        // address: data.address,
        // area: data.area,
        groupName: data.groupName,
        number: data.number,
        imei: data.lampAreaDtos.map(dto => {
          return {
            ...dto,
            id: dto.imei
          }
        })
      };
    },
    getStatus (data) {
      let status = data.lampStatus === 2 ? 3 : data.lampEquipStatus;
      if (data.lampEquipStatus === 2) {
        status = 2;
      }
      return status || 1;
    },
    _getInfo (lampAreaDtos) {
      const bmMarkers = lampAreaDtos.map((data, index) => {
        const status = this.getStatus(data);
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
    getLedDetail (groupNo) {
      const types = this.$_useTypes(LIGHT_TYPE).types;
      this.$refs.tree.setCheckedKeys([groupNo]);
      ledDetail(groupNo).then(res => {
        if (res.code === '200') {
          this.setDefault(res.data);
          this._getInfo(res.data.lampAreaDtos);
          this.typeCommandList = this.typeCommandList.map(list => {
            const findList = res.data.typeCommandList.find(flist => flist.policyContent === list.policyContent);
            if (list.policyContent === 1) {
              this.fileList[1] = findList && findList.picture ? findList.picture.map((pic, index) => {
                return `${baseURL || config.baseURL.dev}/upload` + pic.filePath;
              }) : [];
            } else if (list.policyContent === 2) {
              this.fileList[2] = findList && findList.video ? [{
                name: 'video',
                url: `${baseURL || config.baseURL.dev}/upload${findList.video && findList.video[0] && findList.video[0].filePath}`,
                path: findList.video && findList.video[0] && findList.video[0].filePath
              }] : [];
            } else if (list.policyContent === 3) {
              if (findList && findList.word) {
                selectTemplate({id: findList.word, imei: null}).then(selectRes => {
                  if (selectRes.code === '200') {
                    this.handleSelelctTemplate({id: findList.word, ...selectRes.data})
                  }
                });
              }
            }
            return {
              ...list,
              ...findList,
              chooseDate: (findList && findList.onTime && findList.offTime) ? `${findList.onTime}-${findList.offTime}` : '暂无'
            }
          });
        }
      });
    },
    handleSelelctTemplate (item) {
      this.word = {
        ...item
      };
    }
  }
};
</script>
<style lang="less">
#wisdomPublishPage {
  min-height: calc(100vh - 145px);
  >div{
    padding: 10px;/*no*/
    background:rgba(32,45,85,0.49);
    border-radius:4px;/*no*/
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
                background:rgba(34,44,84,1);
                border-radius:2px;/*no*/
                padding: 7px 13px !important;/*no*/
                padding-left: 30px !important;/*no*/
                position: relative;
                height: auto;
                &::after{
                  content: '';
                  width:4px;/*no*/
                  height:4px;/*no*/
                  background:#FFFFFF;
                  position: absolute;
                  left: 11px;/*no*/
                  top: 14px;/*no*/
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
            >.el-tree-node__children{
              .el-tree-node{
                &.is-checked .el-tree-node__content{
                  background:linear-gradient(135deg,rgba(81,135,243,1) 0%,rgba(47,77,193,1) 100%);
                  &::after{
                    background:rgba(0,207,255,1);
                  }
                  .custom-tree-node{
                    color:rgba(255,255,255,1);
                  }
                }
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
      .titleInfo{
        width: 100%;
        justify-content: space-between;
        margin-bottom: 5px;/*no*/
        .titleItem{
          width: 31%;
          padding: 7px 0;/*no*/
          background:rgba(32,44,89,1);
          border-radius:2px;/*no*/
          cursor: pointer;
          >div{
            text-align: center;
            font-size:14px;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(121,135,189,1);
            word-break: keep-all;
            &:first-child{
              font-size:14px;/*no*/
              font-family:PingFangSC-Semibold,PingFang SC;
              font-weight:600;
              margin-bottom: 4px;/*no*/
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
        margin-bottom: 10px;/*no*/
        .ledImgList{
          height: 100%;
          position: relative;
          border:1px solid #7987bd;
          overflow: hidden;
          i{
            font-size: 48px;
            color: #7987bd;
          }
          >img{
            width: 96%;
            height: auto;
          }
          ul{
            width: 100%;
            position: absolute;
            bottom: 0px;
            padding:8px 6px;/*no*/
            justify-content: space-between;
            li{
              width: 19%;
              height: 52px;
              background: #fff;
              position: relative;
              overflow: hidden;
              cursor: pointer;
              img{
                width: 100%;
                height: auto;
              }
              &::after{
                content: '';
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                background:rgba(5,5,5,0.5);
              }
              &.is-current{
                &::after{
                  content: none;
                }
              }
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
