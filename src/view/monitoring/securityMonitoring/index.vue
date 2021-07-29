<template>
  <div id="securityMonitoring">
    <el-row :gutter="10" class="rowWrap">
      <el-col :span="4" class="colLeft">
        <div class="list">
          <el-row :gutter="10" class="firstRow">
            <el-col :span="6">摄像头:</el-col>
            <el-col :span="18">
              <el-input
                placeholder="请选择摄像头"
                v-model="filterText">
              </el-input>
            </el-col>
          </el-row>
          <el-tree
          :data="defaultOptions"
          :props="defaultProps"
          node-key="id"
          ref='tree'
          :default-expand-all="treeExpandAll"
          :default-expanded-keys="treeExpandKeys"
          :filter-node-method="filterNode"
          :load="loadNode"
          @node-click="nodeClick"
          highlight-current
          lazy
          :check-on-click-node="true"
          :auto-expand-parent="true"
          :current-node-key="currentNodeKey"
          ></el-tree>
        </div>
      </el-col>
      <el-col :span="20" class="colRight">
        <el-scrollbar style="height:100%">
          <div :class="{'video': srcItem.length !== 1, 'video_1': srcItem.length == 1}">
            <el-col :span="12"
              v-for="(item, index) in srcItem"
              :key="index"
              class="iframeItem"
              >
                <iframe
                  :src="item.url"
                  width="100%"
                  height="100%"
                  allow="autoplay"
                  border="0"
                  scrolling="no"
                  id="ysopen"
                  ref="ysopen"
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
                <div class="closeVideo" @click="closeVideo(index)">
                  <i>X</i>
                </div>
                <div class="kongzhi-icon" @click="handleMore(item.serialNumber)"><i class="iconfont icon-shexiangtoukongzhi-copy" /></div>
                <div class="flexRow videoInfo">
                    <div class="flexCenter icon"><i class="iconfont icon-dengganditu" /></div>
                    <div class="flexCloumn title">
                        <span>{{item.address}}</span>
                        <span>{{time}}</span>
                    </div>
                </div>
            </el-col>
            </div>
            <div>
              <p class="title">告警消息</p>
              <search-form
                slot="searchBox"
                :searchItems="searchItems"
                @onSearch="onSearch"
              />
              <div class="Modeltable">
                <page-table
                col-align="center"
                operator
                :data="tableData"
                :cols="tableCols"
                :page-current="page.current"
                :total="page.total"
                :page-size="page.pageSize"
                @current-change="onCurrentChange"
                @size-change="onPageSizeChange"
              >
                <template
                  slot-scope="scope"
                  slot="operator"
                >
                <flex justify='center'>
                  <el-button
                    type="text"
                    size="small"
                    title="查看"
                    :style="{marginRight: '10px'}"
                    @click.prevent.stop="showPush({
                      ...scope.row
                    })"
                    v-if="true || $_hasOperation($options.name,'detail')">
                    <i class="iconfont icon-xiangqing" style="fontSize: 20px; color: #2573f1"/>
                  </el-button>
                </flex>
                </template>
              </page-table>
              </div>
            </div>
        </el-scrollbar>
      </el-col>
    </el-row>
    <el-dialog
      title="视频回放"
      :visible.sync="dialog.show"
      width="750px"
      center
      @close="dialogClose"
      custom-class='videoPlayBack'
      >
        <videoPlayBack :src="dialog.src"/>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment';
import PageTable from '@/components/page-table';
import searchForm from 'components/searchForm/searchForm';
import videoPlayBack from '../videoPlayback';
import { routePush, postData } from '@/util/util';
import Flex from '@/components/flex';
import {
  getCameraURLList,
  getCameraAlarmEventEnum,
  getCameraAlarmList,
  getCameraEventPage
} from '@/api/smokeDetectorMap';
import {
  getTerminalTree
} from 'api/index';
import {
  mapGetters
} from 'vuex';
export default {
  components: {
    PageTable,
    searchForm,
    videoPlayBack,
    Flex
  },
  computed: {
    ...mapGetters(['common']),
    time () {
      return this.common.timeDay
    }
  },
  data() {
    return {
      alarmTypeOptions: [],
      tableCols: [
        { 
          label: '告警图片', 
          prop: 'alarmPicURL',
          align: 'center',
          render: (h, scope) => {
            return <div class='imgBox'><img src={scope.row.alarmPicURL}></img></div>
          }
        },
        { label: '告警编号', prop: 'alarmCode' },
        { label: '设备名', prop: 'cameraName' },
        { label: '告警类型', prop: 'alarmTypeName' },
        { label: '告警消息状态', prop: 'alarmStatusText' },
        { label: '告警时间', prop: 'alarmTime' }
      ],
      tableData: [],
      searchItems: [
        {
          type: 'dataPicker',
          label: '告警时间',
          labelWidth: '70px',
          props: {
            fieldName: 'alarmTime',
            format: 'yyyy-MM-dd hh:mm:ss'
          }
        },
        {
          type: 'select',
          label: '告警类型',
          labelWidth: '70px',
          props: {
            fieldName: 'alarmType',
            options: []
          }
        },
        {
          type: 'select',
          label: '告警消息状态',
          labelWidth: '100px',
          props: {
            fieldName: 'alarmStatus',
            options: [
              {
                name: '已读',
                id: 1
              },
              {
                name: '未读',
                id: 0
              }
            ]
          }
        }
      ],
      srcItem: [],
      filterText: '',
      monitorId: '',
      deviceInfo: [],
      currentNodeKey: undefined,
      treeExpandAll: false,
      treeExpandKeys: [],
      defaultOptions: [{
        id: 1,
        label: '一级 1',
        children: null
      }],
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'leaf'
      },
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      dialog: {
        show: false,
        src: ''
      },
      drawer: {
        show: false,
        direction: 'rtl',
        currentDev: '',
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
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    } 
  },
  created () {
    // 事件类型下拉数据
    getCameraAlarmEventEnum().then(res => {
      if(res.code == '200') {
        this.searchItems[1].props.options = res.data
        this.alarmTypeOptions = res.data
      }
    })
    // 告警消息列表
    this._getCameraAlarmList({})
  },
  mounted () {
    this.$nextTick(() => {
      // let myframe = document.getElementById('ysopen').contentWindow.document.getElementById('capturePicture');
      // myframe.style.display = 'none'
    })
  },
  methods: {
    showPush(row) {
      // this.$router.push({
      //   name: 'cameraEvent',
      //   params: row
      // })
      const queryInfo = {
        alarmCode: row.alarmCode,
        serialNumber: row.serialNumber,
        cameraName: row.cameraName
      }
      const cameraURL = this.$router.resolve({
        path: `/monitoring/cameraEvent`,
        query: queryInfo
      })
      console.log(cameraURL)
      window.open(cameraURL.href, '_blank')
    },
    playBack (code) {
      const today = moment().format('YYYYMMDD');
      this.dialog.show = true;
      this.dialog.src = `https://open.ys7.com/ezopen/h5/iframe_se?url=ezopen://RPUENL@open.ys7.com/${code}/at.avol532y60wkdmohbfm4fphn0dms4ia1-9rhtue5jit-0cys088-wsjd2hrmi=${today}&end=${today}`;
    },
    // 更多
    handleMore (devCode) {
      this.drawer.show = true;
      this.drawer.currentDev = devCode
    },
    dialogClose () {
      this.dialog.show = false;
    },
    // 关闭遮罩
    handleCloseDrawer () {
      this.drawer.show = false;
    },
    // 控制摄像头
    async handleDeviceContral (direction, type = 'start') {
      const parames = {
        speed: 1,
        direction,
        deviceSerial: this.drawer.currentDev
      };
      const res = await postData(`api/lapp/device/ptz/${type}`, parames);
    },
    // 关闭视频
    closeVideo (index) {
      this.srcItem.splice(index,1)
    },
    onCurrentChange (val) {
      this.page.current = val;
      this._getCameraAlarmList();
    },
    onPageSizeChange (val) {
      this.page.pageSize = val;
      this.onCurrentChange(1);
    },
    onSearch (val) {
      this._getCameraAlarmList(val)
    },
    // 告警消息列表
    _getCameraAlarmList (data = {}) {
      let params = {
        data: {
          alarmStatus: data.alarmStatus ? data.alarmStatus : 0,
          alarmTypeID: data.alarmType ? data.alarmType : '',
          beginDate: data.alarmTime ? data.alarmTime[0] : '',
          endDate: data.alarmTime ? data.alarmTime[1] : ''
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        sorting: ""
      }
      if(data.alarmType) {
        this.alarmTypeOptions.forEach(async item => {
          if(item.id == data.alarmType) {
            params.data['alarmTypeName'] = await item.name
          }
        })
      }
      getCameraAlarmList(params).then(res => {
        if(res.code == '200') {
          this.tableData = res.data.data;
          this.page.total = res.data.total;
        }
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
        if(res.code = "200") {
          if(this.srcItem.length == 4) {
            return;
          } else if(this.srcItem.length == 0) {
            res.data.length >4 ? this.srcItem.push(...res.data.slice(0,4)) : this.srcItem.push(...res.data)
          }else {
            res.data.map(item => {
              this.srcItem.map(src => {
                if(item.serialNumber == src.serialNumber) {
                  this.srcItem = this.srcItem;
                } else if(this.srcItem.length < 4) {
                  this.srcItem.push(src)
                } else {
                  this.srcItem = this.srcItem;
                }
              })
            })
          }
        }
      })
    },
    // 点击节点页面跳转
    jumpTo (data) {
      this.$router.push({
        name: 'cameraEvent',
        params: data
      })
    },
    nodeClick (data) {
      let params = {
        imei: "",
        streetCode: '',
        serialNumber: ''
      }
      if (data.type === 'device') {
        // this.clearnInfo();
        this.deviceInfo = {
          name: data.label,
          address: null,
          area: data.area,
          city: data.city,
          imei: data.imei,
          serialNumber: data.serialNumber
        };
        params.serialNumber = data.serialNumber;
        params.streetCode = '';
        params.imei = '';
        this._getCameraURLList(params)
      }
      if (data.type === 'address') {
        // this.clearnInfo();
        this.deviceInfo = {
          name: data.label,
          address: data.address,
          streetCode: data.streetCode,
          area: data.area,
          city: data.city,
          imei: data.imei,
          serialNumber: data.serialNumber
        };
        params.serialNumber = '';
        params.streetCode = data.streetCode;
        params.imei = '';
        this._getCameraURLList(params)
      }
      if (data.type === 'imei') {
        // this.clearnInfo();
        this.deviceInfo = {
          name: data.label,
          address: data.address,
          areaCode: data.areaCode,
          area: data.area,
          city: data.city,
          imei: data.imei
        };
        params.streetCode = '';
        params.imei = data.imei;
        this._getCameraURLList(params)
      }
      this.monitorId = data.type;
      this.currentNodeKey = data.id;
      
    },
    async loadNode (node, resolve) {
      const activeNumber = this.$route.query.activeNumber;
      if (node.level === 0) {
        const tree0 = await this._getTerminalTree({
          'address': '',
          'area': '',
          'city': '',
          'imei': ''
        }, 'city', 'city', 'city', resolve);
        if (!activeNumber) {
          this.treeExpandKeys = [tree0[0].id];
        }
      }
      if (node.level === 1) {
        const tree1 = await this._getTerminalTree({
          city: node.data.city,
          cityCode: node.data.cityCode
        }, 'area', 'area', 'area', resolve);
        if (!activeNumber) {
          this.treeExpandKeys = [ ...this.treeExpandKeys, tree1[0].id ];
        }
      }
      if (node.level === 2) {
        const tree2 = await this._getTerminalTree({
          city: node.data.city,
          area: node.data.area,
          cityCode: node.data.cityCode,
          areaCode: node.data.areaCode
        }, 'address', 'address', 'address', resolve);
        if (!activeNumber) {
          this.treeExpandKeys = [ ...this.treeExpandKeys, tree2[0].id ];
        }
      }
      if (node.level === 3) {
        const tree3 = await this._getTerminalTree({
          city: node.data.city,
          area: node.data.area,
          cityCode: node.data.cityCode,
          areaCode: node.data.areaCode,
          address: node.data.address
        }, 'imei', 'terminalName', 'imei', resolve);
        if (!activeNumber) {
          this.treeExpandKeys = [ ...this.treeExpandKeys, tree3[0].id ];
        }
      }
      if (node.level === 4) {
        getTerminalTree({
          city: node.data.city,
          area: node.data.area,
          cityCode: node.data.cityCode,
          areaCode: node.data.areaCode,
          address: node.data.address,
          imei: node.data.imei,
          deviceTypeNo: 'CAMERA'
        }).then(res => {
          if (res.code === '200') {
            const treeData = res.data.map(daItem => {
              return {
                id: daItem['serialNumber'],
                label: daItem['deviceModuleName'],
                type: 'device',
                city: node.data.city,
                area: node.data.area,
                address: node.data.address,
                imei: node.data.imei,
                ...daItem,
                leaf: true
              }
            });
            resolve(treeData);
            if (!activeNumber) {
              this.treeExpandKeys = [ ...this.treeExpandKeys, treeData[0].id ];
              this.$refs.tree.setCheckedKeys([treeData[0].id]);
              this.nodeClick({
                ...treeData[0],
                type: 'address',
                id: treeData[0].serialNumber
              });
            }
          }
        })
      }
      if (node.level === 5) {
        resolve([])
      }
    },
    async _getTerminalTree (data, id, label, type, resolve) {
      let treeData = [];
      await getTerminalTree({
        ...data,
        deviceTypeNo: 'CAMERA'
      }).then(res => {
        if (res.code === '200') {
          treeData = res.data.map(daItem => {
            return {
              id: daItem[id],
              label: daItem[label],
              type: type,
              ...data,
              ...daItem
            }
          });
          resolve(treeData)
        }
      });
      return treeData;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      console.log(data);
    }
  }
}
</script>

<style lang="less">
#securityMonitoring {
  height: 100%;
  /deep/.el-scrollbar__view {
    height: 100% !important;
  }
  /deep/.el-scrollbar__wrap {
    overflow-x: hidden !important;
  }
  .iframeItem {
    height: 400px;/*no*/
    position: relative;
    margin-bottom: 10px;
    box-sizing: content-box;
    // padding-bottom: 60px;
    background: #fff;
    &[style] {
      padding-left: unset !important;
      padding-right: unset !important;
    }
    .closeVideo {
      position: absolute;
      top: 0;
      right: 11px;
      i {
        display: inline-block;
        color: #0a65d4;
        cursor: pointer;
        font-weight: bold;
        font-size: 18px /*no*/;
      }
    }
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
    .el-drawer__wrapper{
      position: absolute;
      /deep/.el-drawer__container{
        >div{
          width: 103px !important;/*no*/
          overflow: auto;
          &::-webkit-scrollbar {
            width: 4px;
            height: 4px;
          }
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
  .rowWrap {
    height: 100%;
  }
  .colLeft, .colRight {
    height: 100%;
    .el-scrollbar__wrap{
      overflow-x: hidden;
    }
  }
  .colLeft {
    .list {
      height: 100%;
      background: #202D55;
    }
    .firstRow {
      padding: 15px 10px;
      text-align: center;
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #fff;
      .el-input__inner {
        width: 190px;
        height: 30px;
        color: #fff;
        background: #222C51;
        border-radius: 4px;
        border: 1px solid #6275BF;
        font-size: 12px;
      }
    }
    .el-tree {
      background: #202D55;
      margin: 0 10px;
      width: calc(100% - 20px);
      padding: 10px;
      >.el-tree-node {
        border-radius: 4px;
        background: #213775;
        >.el-tree-node__content {
          background: #304785;
          font-size: 14px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #FFFFFF;
          line-height: 20px;
          letter-spacing: 1px;
          margin-bottom: 10px;
        }
      }
    }
    .el-tree-node__content {
      height: 38px;
      border-radius: 4px;
      margin: 5px 10px;
      position: relative;
    }
    .el-tree-node__expand-icon {
      position: absolute;
      right: 10px;
    }
    .el-tree-node__content:hover {
      background-color: #213775;
    }
    .el-tree-node:focus>.el-tree-node__content {
      background-color: #213775;
      color: #FFFFFF;
    }
    .el-tree-node .el-tree-node__children .el-tree-node__label {
      color: #FFFFFF;
      font-size: 14px;
      font-weight: 400;
    }
    .el-tree-node__content span.is-leaf + span.el-tree-node__label {
      font-size: 12px;
    }
    .el-tree-node.is-expanded.is-focusable {
      background: #3F579A;
    }
    .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
      background-color: #213775;
    }
    .el-tree > .el-tree-node.is-expanded.is-focusable > .el-tree-node__content,.el-tree-node.is-expanded.is-focusable {
      background: #3F579A;
    }
    .el-tree-node.is-expanded.is-focusable {
      margin-bottom: 10px;
      border-radius: 4px;
    }
    .el-tree-node.is-expanded>.el-tree-node__children {
      background: #3F579A;
      border-radius: 4px;
    }
  }
  
  .video {
    // height: calc(100% - 250px);
    display: flex;
    flex-wrap: wrap;
  }
  .video_1 {
    // height: calc(100% - 250px);
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  .title{
    font-size:16px;
    font-family:PingFangHK-Semibold,PingFangHK;
    font-weight:600;
    color:rgba(255,255,255,1);
    margin-bottom: 10px;
    span:last-child {
      font-size: 12px;
      font-weight: 400;
    }
  }
  .hideDiv {
    // display: none;
  }
  .videoInfo{
    position: absolute;
    bottom: 5px;
    left: 5px;
    right: 400px;
    // height: 50px;
    // background:rgba(0,0,0,0.5);
    align-items: center;
    // padding: 10px 15px;/*no*/
    .title{
      font-size:16px;
      font-family:PingFangHK-Semibold,PingFangHK;
      font-weight:600;
      color:rgba(255,255,255,1);
      margin-bottom: 0;
      span:last-child {
        font-size: 12px;
        font-weight: 400;
      }
    }
    .kongzhi-icon {

    }
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
  .videoInfo-f {
    
  }
  // .videoInfo-f:hover .hideDiv {
  //   display: block;
  // }
  .imgBox {
    img {
      width: 70px;
    }
  }
}

</style>
