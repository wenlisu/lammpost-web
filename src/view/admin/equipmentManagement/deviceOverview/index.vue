/* eslint-disable camelcase */
<template>
  <div id='deviceOverview' >
    <el-row class="deviceContainer" :gutter="10">
      <el-col
        :span="8"
        v-for="(item, index) in tableData"
        :key="item.id"
      >
        <div class="flexRow main" @click="goEquipmentList(item.deviceCategoryNo)">
          <div class="flexCloumn flexCenter icon">
            <span class="flexCenter img" :class="`icon${index + 1}`">
              <i :class="`iconfont icon-${item.icon}`"/>
            </span>
            <span class="title">{{item.name}}</span>
          </div>
          <div class="flexCloumn info">
            <div class="title">
              设备数
              <span>{{item.deviceCount || 0}}</span>
            </div>
            <div class="flexRow infoItems">
              <div class="flexCloumn infoItem">
                <span>在线数</span>
                <span>{{item.onlineCount || 0}}</span>
              </div>
              <div class="flexCloumn infoItem">
                <span>离线数</span>
                <span>{{item.offlineCount || 0}}</span>
              </div>
              <div class="flexCloumn infoItem">
                <span>告警数</span>
                <span>{{item.warnCount || 0}}</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  generalView
} from 'api/admin';
import { routePush } from '@/util/util';
export default {
  name: 'deviceOverview',
  data () {
    return {
      tableData: [{
        id: 'LAMP',
        icon: 'dengpao-tianchong',
        name: '智慧照明'
      }, {
        id: 'BATTERY',
        icon: 'chongdianzhuang',
        name: '智慧充电'
      }, {
        id: 'WIFI',
        icon: 'wifi1',
        name: '智慧WIFI'
      }, {
        id: 'AMBIENT',
        icon: 'wuzhihuanjingjiance',
        name: '智慧环境监测'
      }, {
        id: 'CAMERA',
        icon: 'jiankong',
        name: '智慧监控'
      }, {
        id: 'CALL',
        icon: 'yingjiguangbo',
        name: '智慧报警'
      }, {
        id: 'LED',
        icon: 'diannao',
        name: '智慧LED显示屏'
      }, {
        id: 'AUDIO',
        icon: 'xiaofangguangbo',
        name: '智慧广播'
      }, {
        id: 'STATION',
        icon: 'jizhanxinhao',
        name: '微基站'
      }, {
        id: 'SMOKE_DETECTOR',
        icon: 'yangan',
        name: '烟感'
      }, {
        id: 'DOOR_ACCESS',
        icon: 'mensuo',
        name: '门禁'
      }, {
        id: 'WATER_METER',
        icon: 'shuibiao',
        name: '水表'
      }, {
        id: 'ELECTRICITY_METER',
        icon: 'dianbiao',
        name: '电表'
      }]
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getDataAllList()
    })
  },
  components: {
  },
  methods: {
    // 获取所有/查询数据列表
    getDataAllList () {
      generalView().then(res => {
        if (res.code === '200') {
          const tableData = this.tableData.map(data => {
            const findObj = res.data.find(da => da.deviceCategoryNo === data.id);
            return {
              ...data,
              ...findObj
            }
          });
          this.tableData = tableData;
        }
      });
    },
    goEquipmentList (deviceCategoryNo) {
      routePush({
        name: 'equipmentList',
        query: {
          deviceCategoryNo
        }
      });
    }
  }
}
</script>

<style lang="less">
#deviceOverview{
  .deviceContainer{
    .main{
      padding: 22px 26px;/*no*/
      background: #fff;
      box-shadow:0px 4px 6px 0px rgba(219,219,219,1);/*no*/
      border-radius:6px;/*no*/
      margin-bottom: 10px;/*no*/
      cursor: pointer;
      .icon{
        width: 106px;
        padding-right: 38px;
        .img{
          width:68px;
          height:68px;
          // background:linear-gradient(314deg,rgba(167,135,255,1) 0%,rgba(122,146,255,1) 100%);
          // box-shadow:0px 3px 7px 0px rgba(210,203,255,1);
          border-radius:26px;/*no*/
          i{
            font-size: 30px;/*no*/
          }
        }
        .title{
          margin-top: 16px;/*no*/
          font-size:14px;/*no*/
          font-family:PingFangSC-Semibold,PingFang SC;
          font-weight:600;
          color:rgba(40,40,40,1);
          word-break: keep-all;
        }
      }
      .info{
        flex: 1;
        .title{
          position: relative;
          width: 100%;
          padding:6px 20px;/*no*/
          background:linear-gradient(270deg,rgba(198,239,255,1) 0%,rgba(183,201,255,1) 100%);
          box-shadow:0px 4px 4px 0px rgba(232,245,254,1);/*no*/
          border-radius: 50px;/*no*/
          font-size:14px;/*no*/
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(45,45,45,1);
          span{
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right:20px;/*no*/
            font-size:24px;/*no*/
            font-family:DINAlternate-Bold,DINAlternate;
            font-weight:bold;
            color:rgba(15,60,117,1);
          }
        }
        .infoItems{
          margin-top: 24px;/*no*/
          justify-content: space-between;
          .infoItem{
            span{
              text-align: center;
              &:first-child{
                font-size:12px;/*no*/
                font-family:PingFangSC-Regular,PingFang SC;
                font-weight:400;
                color:rgba(80,80,80,1);
              }
              &:last-child{
                margin-top: 5px;/*no*/
                font-size:22px;/*no*/
                font-family:DINAlternate-Bold,DINAlternate;
                font-weight:bold;
                color:rgba(88,88,88,1);
              }
            }
            &:nth-of-type(2) {
              span{
                &:last-child{
                  color: #7F7F7F;
                }
              }
            }
            &:last-child{
              span{
                &:last-child{
                  color: #F15833;
                }
              }
            }
          }
        }
      }
    }
  }
  .icon1{
    background:linear-gradient(314deg,rgba(76,144,244,1) 0%,rgba(19,179,228,1) 100%);
    box-shadow:0px 3px 7px 0px rgba(203,233,255,1);
    i{
      background-image: -webkit-linear-gradient(-45deg, #FFFFFF 20%, #C9EBFF 60%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  .icon2{
    background:linear-gradient(314deg,rgba(167,135,255,1) 0%,rgba(122,146,255,1) 100%);
     box-shadow:0px 3px 7px 0px rgba(210,203,255,1);
    i{
      background-image: -webkit-linear-gradient(-45deg, #FFFFFF 20%, #EDE6FF 60%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  .icon3{
    background:linear-gradient(314deg,rgba(91,123,243,1) 0%,rgba(53,130,255,1) 100%);
     box-shadow:0px 3px 7px 0px rgba(203,233,255,1);
    i{
      background-image: -webkit-linear-gradient(-45deg, #FFFFFF 20%, #C9EBFF  60%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  .icon4{
    background:linear-gradient(314deg,rgba(99,186,255,1) 0%,rgba(87,220,193,1) 100%);
    box-shadow:0px 3px 7px 0px rgba(203,248,255,1);
    i{
      background-image: -webkit-linear-gradient(-45deg, #FFFFFF 20%, #C2F7FF 60%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  .icon5{
    background:linear-gradient(314deg,rgba(115,205,236,1) 0%,rgba(163,226,130,1) 100%);
     box-shadow:0px 3px 7px 0px rgba(188,252,243,1);
    i{
      background-image: -webkit-linear-gradient(-45deg, #FFFFFF 20%, #C2FFF3 60%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  .icon6 {
    background:linear-gradient(314deg,rgba(127,173,255,1) 0%,rgba(53,167,255,1) 100%);
     box-shadow:0px 3px 7px 0px rgba(203,233,255,1);
    i{
      background-image: -webkit-linear-gradient(-45deg, #FFFFFF 20%, #C9EBFF  60%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  .icon7{
    background:linear-gradient(314deg,rgba(91,91,243,1) 0%,rgba(53,96,255,1) 100%);
    box-shadow:0px 3px 7px 0px rgba(203,218,255,1);
    i{
      background-image: -webkit-linear-gradient(-45deg, #FFFFFF 20%, #D9E2FF 60%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  .icon8{
    background:linear-gradient(314deg,rgba(201,108,247,1) 0%,rgba(173,156,255,1) 100%);
     box-shadow:0px 3px 7px 0px rgba(226,203,255,1);
    i{
      background-image: -webkit-linear-gradient(-45deg, #FFFFFF 20%, #EDE6FF 60%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  .icon9 {
    background:linear-gradient(314deg,rgba(118,158,253,1) 1%,rgba(132,128,241,1) 100%);
    box-shadow:0px 3px 7px 0px rgba(203,223,251,1);
    i{
      background-image: -webkit-linear-gradient(-45deg, #FFFFFF 20%, #C9D0FF 60%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
    .icon10 {
    background:linear-gradient(314deg,#58B4FF 1%,#4192FF 100%);
    box-shadow:0px 3px 7px 0px rgba(203,223,251,1);
    i{
      background-image: -webkit-linear-gradient(-45deg, #FFFFFF 20%, #EEFBFF 60%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
    .icon11 {
    background:linear-gradient(314deg,#33BCFF 1%,#61B5FF 100%);
    box-shadow:0px 3px 7px 0px rgba(203,223,251,1);
    i{
      background-image: -webkit-linear-gradient(-45deg, #FFFFFF 20%, #EEFBFF 60%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
    .icon12 {
    background:linear-gradient(314deg,#33A0FF 1%,#1E86F8 100%);
    box-shadow:0px 3px 7px 0px rgba(203,223,251,1);
    i{
      background-image: -webkit-linear-gradient(-45deg, #FFFFFF 20%, #EEFBFF 60%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
    .icon13 {
    background:linear-gradient(314deg,#4FC5FF 1%,#5BD2F3 100%);
    box-shadow:0px 3px 7px 0px rgba(203,223,251,1);
    i{
      background-image: -webkit-linear-gradient(-45deg, #FFFFFF 20%, #DEF7FF 60%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}
</style>
