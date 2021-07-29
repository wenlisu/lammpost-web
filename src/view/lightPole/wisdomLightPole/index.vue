/* eslint-disable camelcase */
<template>
  <pageMain idName='wisdomLightPole' :currentTitleList="currentTitleList">
    <!-- 业务执行管理 -->
    <el-row :gutter="10" class="flexRow searchContainer">
      <el-col
        :span="6"
        class="flexRow"
        v-for="(item, index) in searchModule"
        :key="item.id"
      >
        <div class="flexRow main">
          <div class="icon flexCenter">
            <i class="iconfont" :class="`icon-${item.icon} icon${index+1}`" />
          </div>
          <div class="info flexCloumn">
            <div class="title">{{item.title}}</div>
            <div class="number flexRow">
              <div @click="() => onSearch({sensorTypeNo: item.id, [item.searchId]: 1})">在线<span>{{item.normal}}</span></div>
              <div @click="() => onSearch({sensorTypeNo: item.id,[item.searchId]: 2})">离线<span>{{item.abnormal}}</span></div>
            </div>
            <div class="progress">
              <electricLine :startColor="item.startColor" :endColor="item.endColor" :width="`${item.normal !== 0 ? parseInt((item.normal/(item.normal + item.abnormal)) * 100, 10) : 0}`" height="10" :className="'validProgress'" :click="() => onSearch({sensorTypeNo: item.id,[item.searchId]: 1})"/>
              <electricLine startColor="#F38257" endColor="#FF4D36" width="100" height="10" :click="() => onSearch({sensorTypeNo: item.id,[item.searchId]: 2})"/>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <header-title
      icon="iconfont icon-shouye"
      title="业务执行管理"
    >
      <search-form
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
      />
      <!-- :addBtnVisible="true || $_hasOperation($options.name,'add')"
        :delBtnVisible="true || $_hasOperation($options.name,'add')"
        @on-addBtn="openDialog('add');" -->
    </header-title>
    <div class="content-view">
      <div class="Modeltable">
        <page-table
          col-align="center"
          operator-width="80"
          operator
          :data="tableData"
          :cols="tableCols"
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
          @current-change="onCurrentChange"
          @size-change="onPageSizeChange"
          @selection-change="onSelectionChange"
        >
          <template
            slot-scope="scope"
            slot="operator"
          >
          <flex>
            <el-button
              type="text"
              size="small"
              title="查看"
              :style="{marginRight: '10px'}"
              @click.prevent.stop="showView('detail', {
                ...scope.row
              })"
              v-if="true || $_hasOperation($options.name,'detail')">
              <i class="iconfont icon-xiangqing" style="fontSize: 20px; color: #2EDEF4"/>
          </el-button>
          <el-button
              type="text"
              size="small"
              title="控制策略"
              @click.prevent.stop="showView('action', {
                ...scope.row
              })"
              v-if="true || ($_hasOperation($options.name,'edit'))">
              <i class="iconfont icon-celvekongzhi" style="fontSize: 20px; color: #FF5736"/>
          </el-button>
          </flex>
          </template>
        </page-table>
      </div>
    </div>
  </pageMain>
</template>

<script>
import pageMain from 'components/pageMain';
import headerTitle from 'components/headerTitle/headerTitle'
import searchForm from 'components/searchForm/searchForm';
import radioType from 'components/radioType';
import PageTable from '@/components/page-table';
import Flex from '@/components/flex';
import electricLine from '@/components/electricLine';
import { routePush } from '@/util/util';
import {
  getTerminalDeviceStatusList,
  getLampOnStatus
} from 'api/lightPole';
import {
  generalView
} from 'api/admin';
/** 1:正常、2：故障 */
export default {
  name: 'wisdomLightPole',
  data () {
    return {
      searchModule: [{
        id: 'LAMP',
        icon: 'dengpao-tianchong',
        title: '照明灯',
        startColor: '#5EC890',
        endColor: '#97E69C',
        normal: 100,
        abnormal: 365,
        searchId: 's_lamp'
      }, {
        id: 'BATTERY',
        icon: 'chongdianzhuang',
        title: '充电桩',
        startColor: '#58DEF4',
        endColor: '#24AECB',
        normal: 100,
        abnormal: 365,
        searchId: 's_battery'
      }, {
        id: 'CAMERA',
        icon: 'jiankong',
        title: '监控视频',
        startColor: '#5EC890',
        endColor: '#97E69C',
        normal: 100,
        abnormal: 365,
        searchId: 's_video'
      }, {
        id: 'AMBIENT',
        icon: 'wuzhihuanjingjiance',
        title: '环境监测器',
        startColor: '#58DEF4',
        endColor: '#24AECB',
        normal: 100,
        abnormal: 365,
        searchId: 's_wind'
      }, {
        id: 'LED',
        icon: 'diannao',
        title: 'LED显示屏',
        startColor: '#5EC890',
        endColor: '#97E69C',
        normal: 100,
        abnormal: 365,
        searchId: 's_led'
      }, {
        id: 'AIRING',
        icon: 'xiaofangguangbo',
        title: '广播器',
        startColor: '#58DEF4',
        endColor: '#24AECB',
        normal: 100,
        abnormal: 365,
        searchId: 's_broadcast'
      }, {
        id: 'CALL',
        icon: 'yingjiguangbo',
        title: '报警器',
        startColor: '#5EC890',
        endColor: '#97E69C',
        normal: 100,
        abnormal: 365,
        searchId: 's_call'
      }, {
        id: 'WIFI',
        icon: 'wifi1',
        title: '智能WIFI',
        startColor: '#58DEF4',
        endColor: '#24AECB',
        normal: 100,
        abnormal: 365,
        searchId: 's_wifi'
      }],
      searchVal: {},
      searchItems: [{
        type: 'input',
        label: '编号',
        labelWidth: '45px',
        props: {
          fieldName: 'imei'
        }
      }, {
        type: 'input',
        label: '灯杆名称',
        props: {
          fieldName: 'terminalName'
        }
      }],
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      tableCols: [
        { label: '设备编号',
          prop: 'imei'
        },
        { label: '灯杆名称',
          prop: 'terminalName',
          minWidth: '150px'
        },
        { label: '灯号', prop: 'terminalNumberText' },
        { label: '所属道路', prop: 'address' },
        { label: '区域', prop: 'area' },
        { label: '监控视频',
          prop: 'cameraOnlineStatus',
          render: (h, scope) => {
            return this.getRadiosType(scope.row.cameraOnlineStatus);
          }
        },
        { label: '照明灯',
          prop: 'lampOnlineStatus',
          render: (h, scope) => {
            return this.getRadiosType(scope.row.lampOnlineStatus);
          }
        },
        { label: '智能WIFI',
          prop: 'swifiText',
          render: (h, scope) => {
            return this.getRadiosType(scope.row.swifi);
          }
        },
        { label: '充电桩',
          prop: 'sbatteryText',
          render: (h, scope) => {
            return this.getRadiosType(scope.row.sbattery);
          }
        },
        { label: '广播',
          prop: 'audioOnlineStatus',
          render: (h, scope) => {
            return this.getRadiosType(scope.row.audioOnlineStatus);
          }
        },
        { label: 'LED显示屏',
          prop: 'ledOnlineStatus',
          minWidth: '100px',
          render: (h, scope) => {
            return this.getRadiosType(scope.row.ledOnlineStatus);
          }
        },
        { label: '紧急呼叫',
          prop: 'callOnlineStatus',
          render: (h, scope) => {
            return this.getRadiosType(scope.row.callOnlineStatus);
          }
        },
        { label: '环境监测',
          prop: 'ambientOnlineStatus',
          render: (h, scope) => {
            return this.getRadiosType(scope.row.ambientOnlineStatus);
          }
        }
      ],
      selectsList: [],
      currentTitleList: [
        {
          name: 'lightPoleMap',
          title: '智慧灯杆'
        },
        {
        name: 'wisdomLightPole',
        title: '灯杆能耗分析'
        }
      ]
    }
  },
  mounted () {
    this.$nextTick(() => {
      // getLampOnStatus().then(res => {
      //   if (res.code === '200') {
      //     this.$set(this.searchItems[2], 'props', {
      //       fieldName: 's_lamp',
      //       options: res.data.map(data => {
      //         return {
      //           id: data.key,
      //           name: data.value
      //         }
      //       })
      //     });
      //   }
      // });
      this.getDataAllList();
      this._generalView()
    })
  },
  components: {
    headerTitle,
    PageTable,
    searchForm,
    Flex,
    radioType,
    pageMain,
    electricLine
  },
  computed: {
    routeName () {
      return this.$route.name
    }
  },
  methods: {
    getRadiosType (type) {
      let div = <radioType type="3" text="离线"/>;
      switch (type) {
        case 1:
          div = <radioType type="1" text="在线"/>;
          break;
        // case 2:
        //   div = <radioType type="2" text="离线"/>;
        //   break;
        default:
      }
      return div;
    },
    _generalView () {
      generalView().then(res => {
        if (res.code === '200') {
          const tableData = this.searchModule.map(data => {
            const findObj = res.data.find(da => da.deviceCategoryNo === data.id);
            return {
              ...data,
              normal: findObj ? findObj.onlineCount : 0,
              abnormal: findObj ? findObj.offlineCount : 0
            }
          });
          this.searchModule = tableData;
        }
      });
    },

    onSearch (val) {
      this.searchVal = {
        ...val
      }
      this.onCurrentChange(1);
    },
    // 获取所有/查询数据列表
    getDataAllList () {
      let data = {
        data: {
          ...this.searchVal
        },
        pageNo: Number(this.page.current), // 查询的分页页码
        pageSize: Number(this.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: ''
      }
      getTerminalDeviceStatusList(data).then(res => {
        if (res.code === '200') {
          const {
            data,
            total
          } = res.data;
          this.page.total = total;
          this.tableData = data;
        }
      })
    },
    onCurrentChange (val) {
      this.page.current = val;
      this.getDataAllList()
    },
    onPageSizeChange (val) {
      this.page.pageSize = val
      this.onCurrentChange(1)
    },
    onSelectionChange (args) {
      this.selectsList = args.map(arg => {
        return {
          ...arg,
          approveUserId: arg.id
        }
      });
    },
    showView (type, row) {
      switch (type) {
        case 'detail':
          routePush({
            title: '灯杆详情',
            name: 'lightPoleDetail',
            parames: row
          });
          break;
        case 'action':
          routePush({
            name: 'illumination',
            parames: {
              address: row.address,
              terminalNumberText: row.terminalNumberText
            }
          });
          break;
        default:
      }
    }
  }
}
</script>

<style lang="less">
#wisdomLightPole{
  .searchContainer{
    flex-wrap: wrap;
    .el-col > .main{
      width: 100%;
      padding: 11px 18px;/*no*/
      background:rgba(32,45,85,0.5);
      margin-bottom: 10px;/*no*/
      align-items: center;
      .icon{
        width:72px;
        height:72px;
        margin-right: 15px;
        background: url(./images/img1.png) no-repeat center;
        background-size: 100% 100%;
        i{
          font-size: 24px;
          background-image: -webkit-linear-gradient(-45deg, #F0F2FF 20%, #AECAFF 60%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
      .info{
        display: flex;
        flex: 1;
        .title{
          font-size:14px;
          font-family:PingFangSC-Medium,PingFang SC;
          font-weight:500;
          color:rgba(239,247,255,1);
          line-height:17px;
          text-shadow:0px 2px 4px rgba(13,39,74,0.87);
          margin-bottom: 12px;/*no*/
        }
        .number{
          justify-content: space-between;
          margin-bottom: 5px;/*no*/
          div{
            display: flex;
            font-size:12px;/*no*/
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(131,154,220,1);
            line-height:17px;
            cursor: pointer;
            span{
              font-size:14px;
              font-family:DINAlternate-Bold,DINAlternate;
              font-weight:bold;
              color:rgba(244,133,101,1);
              margin-left: 5px;/*no*/
            }
          }
        }
        .progress{
          padding: 5px;/*no*/
          background:rgba(35,51,93,1);
          position: relative;
          #electricLine{
            cursor: pointer;
          }
          .validProgress{
            position: absolute;
            right: 0;
            left: 5px;/*no*/
            z-index: 1;
          }
        }
      }
    }
  }
}
</style>
