<template>
  <pageMain idName="chargeBaseInfo" :currentTitleList="currentTitleList">
    <div class="modules_1">
      <div class="modules_title">基本信息</div>
      <div>
        <el-row>
          <el-col :span="8">
            <span class="modules_1_val" @click="handleToDetail(batteryDetail)">灯杆名称：<span style="color: #409eff; cursor:pointer">{{batteryDetail.terminalName}}</span></span>
          </el-col>
          <el-col :span="8">
            <span class="modules_1_val">地址：{{batteryDetail.address}}</span>
          </el-col>
          <el-col :span="8">
            <div class="modules_1_val">
              充电状态：
              <div class="charge_status">
                <span>
                  <img v-if="batteryDetail.batteryInUse=='3'" src="~common/images/index/onLine.png" />
                  <img v-else src="~common/images/index/OFF.png" />充电中
                </span>
                <span>
                  <img v-if="batteryDetail.batteryInUse=='2'" src="~common/images/index/onLine.png" />
                  <img v-else src="~common/images/index/OFF.png" />空闲中
                </span>
                <span>
                  <img v-if="batteryDetail.batteryInUse=='0'" src="~common/images/index/onLine.png" />
                  <img v-else src="~common/images/index/OFF.png" />离线
                </span>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <span class="modules_1_val">总功率：{{batteryDetail.power}}KW</span>
          </el-col>
          <el-col :span="8">
            <span class="modules_1_val">充电单价：{{batteryDetail.price}}元/度</span>
          </el-col>
          <el-col :span="8">
            <div class="modules_1_val">
              支付方式：
              <div class="pay_methods">
                <span style="padding-right:75px">
                  <img v-if="batteryDetail.payWay=='1'" src="~common/images/index/onLine.png" />
                  <img v-else src="~common/images/index/OFF.png" />微信
                </span>
                <span>
                  <img v-if="batteryDetail.payWay=='2'" src="~common/images/index/onLine.png" />
                  <img v-else src="~common/images/index/OFF.png" />支付宝
                </span>
                <span>
                  <img v-if="batteryDetail.payWay=='3'" src="~common/images/index/onLine.png" />
                  <img v-else src="~common/images/index/OFF.png" />充电卡
                </span>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="modules_2" v-if="batteryDetail.batteryInUse=='3'">
      <div class="modules_title">当前车辆充电信息</div>
      <el-row>
          <el-col :span="8">
            <span class="modules_1_val">充电开始时间：{{batteryDetail.batteryBeginTime}}</span>
          </el-col>
          <el-col :span="8">
            <span class="modules_1_val">车牌号码：{{batteryDetail.batteryCarNo}}</span>
          </el-col>
          <!-- <el-col :span="8">
            <span class="modules_1_val">充电量：{{batteryDetail.batteryChargeValue}}%</span>
          </el-col> -->
      </el-row>
      <div class="modules_2_car">
      <div class="modules_content">
        <div class="charge_per">{{batteryStatusDetail.rate}}%</div>
        <div class="charge_car"  :class="batteryStatusDetail.rate == '100' ? 'full' : ''">
          <div class="item_left_1">
            <div class="charge_car_title">已充电量</div>
            <div class="charge_car_val">{{batteryStatusDetail.chargeValue}}度</div>
          </div>
          <!-- <div class="item_left_2">
            <div class="charge_car_title">可续航</div>
            <div class="charge_car_val">200KW</div>
          </div> -->
          <div class="item_left_3">
            <div class="charge_car_title">电枪温度</div>
            <div class="charge_car_val">{{batteryStatusDetail.gunTempreture}}℃</div>
          </div>
          <div class="item_right_1">
            <div class="charge_car_title">已充时长</div>
            <div class="charge_car_val">{{batteryStatusDetail.useTime}}分钟</div>
          </div>
          <div class="item_right_2">
            <div class="charge_car_title">预计剩余时长</div>
            <div class="charge_car_val">{{batteryStatusDetail.remainingTime}}分钟</div>
          </div>
          <div class="item_right_3">
            <div class="charge_car_title">产生费用</div>
            <div class="charge_car_val">{{batteryStatusDetail.price}}元</div>
          </div>
        </div>
      </div>
      </div>
    </div>
    <div class="modules_3">
    <div class="modules_title">历史使用记录</div>
      <div class="content-view">
        <div class="Modeltable">
          <page-table
            col-align="center"
            :data="tableData"
            :cols="tableCols"
            :page-current="page.current"
            :total="page.total"
            :page-size="page.pageSize"
            @current-change="onCurrentChange"
            @size-change="onPageSizeChange"
          ></page-table>
        </div>
      </div>
    </div>
  </pageMain>
</template>
<script>
import pageMain from 'components/pageMain';
import { batteryMonitorDetail, batteryMonitorHistory, batteryStatusMonitorDetail } from 'api/smartCharge/index';
import PageTable from '@/components/page-table';
import radioType from 'components/radioType';
import { routePush } from '@/util/util';
export default {
  components: { PageTable, radioType, pageMain },
  data () {
    return {
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      tableCols: [
        { label: '灯杆名称', prop: 'terminalName' },
        { label: '充电开始时间', prop: 'beginTime', width: '150px' },
        { label: '充电结束时间', prop: 'endTime', width: '150px' },
        { label: '充电时长（小时）', prop: 'useTime' },
        { label: '充电量（度）', prop: 'chargeValue' },
        // { label: '充电枪位', prop: 'area' },
        { label: '收入（元）', prop: 'price' },
        { label: '车牌号', prop: 'carNo' },
        { label: '支付方式', prop: 'payWayText' }
      ],
      batteryDetail: {
        terminalName: '',
        address: '',
        batteryInUse: '',
        power: '',
        price: '',
        payWay: '',
        batteryBeginTime: '',
        batteryCarNo: '',
        batteryChargeValue: ''
      },
      batteryStatusDetail: {
        rate: '',
        chargeValue: '',
        gunTempreture: '',
        useTime: '',
        remainingTime: '',
        price: ''
      },
      currentTitleList: [{
        name: 'chargePileMonitor',
        title: '充电桩监控'
      }, {
        name: 'chargeBaseInfo',
        title: '充电桩详情'
      }]
    };
  },
  methods: {
    // 分页切换页面
    onCurrentChange (val) {
      this.page.current = val;
      this.getList();
    },
    onPageSizeChange (val) {
      this.page.pageSize = val;
      this.onCurrentChange(1);
    },
    getList () {
      let params = {
        'data': {
          ...this.$route.query
        },
        'pageNo': this.page.current,
        'pageSize': this.page.pageSize
      }
      batteryMonitorHistory(params).then((res) => {
        const { pageNo, total, data } = res.data;
        this.page.current = pageNo;
        this.page.total = pageNo;
        this.tableData = data;
      })
    },
    // 基本信息
    getInfo () {
      let query = this.$route.query.serialNumber
      batteryMonitorDetail(query).then((res) => {
        const { data } = res
        this.batteryDetail = data
      })
    },
    // 充电状态
    _batteryStatusMonitorDetail () {
      let query = this.$route.query.serialNumber
      batteryStatusMonitorDetail(query).then((res) => {
        const { data } = res
        this.batteryStatusDetail = data
      })
    },
    handleToDetail (row) {
      routePush({
        title: '灯杆详情',
        name: 'lightPoleDetail',
        parames: {
          imei: row.imei
        }
      });
    }
  },
  mounted () {
    this.getInfo()
    this._batteryStatusMonitorDetail()
    this.getList()
  }
};
</script>
<style lang="less" scoped>
#chargeBaseInfo {
  .modules_1 {
    background: rgba(32, 45, 85, 0.49);
    border-left: 3px solid rgba(43, 126, 242, 1);
    margin-bottom: 10px;
    padding: 20px;
    .modules_1_val {
      margin-bottom: 15px;
      font-size: 12px;/*no*/
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
    }
  }
  .modules_3{
    background: rgba(32, 45, 85, 0.49);
    margin-bottom: 10px;
    padding: 20px;
    .modules_title{margin-bottom: 0;}
    .comp-page-table{
        background: rgba(32, 45, 85, 0);
    }
  }
  .modules_2 {
    background: rgba(32, 45, 85, 0.49);
    border-left: 3px solid rgba(43, 126, 242, 1);
    margin-bottom: 10px;
    padding: 20px 20px 0 20px;
    color: rgba(255, 255, 255, 1);
    .modules_2_car{
      padding: 100px 0 135px 0;
    }
    .charge_per {
      text-align: center;
      font-size: 36px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(7, 236, 233, 1);
      text-shadow: 0px 0px 7px rgba(255, 255, 255, 0.5);
    }
    .charge_car {
      width: 493px;
      height: 215px;
      margin: 0 auto;
      background: url(~common/images/smartCharge/charge_car.gif) no-repeat;
      background-size: contain;
      position: relative;
      &.full{
      background: url(~common/images/smartCharge/full_car.png) no-repeat;
      background-size: contain;
      }
      .item_left_1,
      .item_left_2,
      .item_left_3,
      .item_right_1,
      .item_right_2,
      .item_right_3 {
        position: absolute;
        width: 210px;
        padding: 13px 0;
        text-align: center;
        background: linear-gradient(
          269deg,
          rgba(34, 36, 77, 0.5) 0%,
          rgba(23, 43, 99, 0.5) 50%,
          rgba(35, 35, 74, 0.5) 100%
        );
        box-shadow: 0px 5px 6px 0px rgba(0, 0, 0, 1);
        .charge_car_title {
          margin-bottom: 7px;
          height: 25px;
          line-height: 25px;
          position: relative;
        }
        .charge_car_val {
            height: 25px;
            line-height: 25px;
          position: relative;
        }
      }
      .item_left_1 {
        left: -428px;
        top: -92px;
        border-left:  2px solid rgba(7, 236, 233, 1);
        &::after {
          position: absolute;
          content: "";
          width: 200px;
          right: -224px;
          top: 50%;
          margin-top: -11.5px;
          height: 23px;
          background: url(~common/images/index/jd.gif) no-repeat center;
          background-size: 100% 100%;
          border-top-left-radius: 10px;
          border-bottom-left-radius: 10px;
        }
        .charge_car_title {
          &::after {
            width: 14px;
            height: 14px;
            content: "";
            border-top: 2px solid #0eece9;
            border-right: 2px solid #0eece9;
            border-top-right-radius: 5px;
            position: absolute;
            right: 10px;
            top: -5px;
          }
        }
        .charge_car_val {
          &::after {
            width: 14px;
            height: 14px;
            content: "";
            border-bottom: 2px solid #0eece9;
            border-right: 2px solid #0eece9;
            border-bottom-right-radius: 5px;
            position: absolute;
            right: 10px;
            bottom: -5px;
          }
        }
      }
      .item_left_2 {
        left: -498px;
        top: 50%;
        margin-top: -40px;
        border-left:  2px solid rgba(7, 236, 233, 1);
        &::after {
          position: absolute;
          content: "";
          width: 200px;
          right: -224px;
          top: 50%;
          margin-top: -11.5px;
          height: 23px;
          background: url(~common/images/index/jd.gif) no-repeat center;
          background-size: 100% 100%;
          border-top-left-radius: 10px;
          border-bottom-left-radius: 10px;
        }
        .charge_car_title {
          &::after {
            width: 14px;
            height: 14px;
            content: "";
            border-top: 2px solid #0eece9;
            border-right: 2px solid #0eece9;
            border-top-right-radius: 5px;
            position: absolute;
            right: 10px;
            top: -5px;
          }
        }
        .charge_car_val {
          &::after {
            width: 14px;
            height: 14px;
            content: "";
            border-bottom: 2px solid #0eece9;
            border-right: 2px solid #0eece9;
            border-bottom-right-radius: 5px;
            position: absolute;
            right: 10px;
            bottom: -5px;
          }
        }
      }
      .item_left_3 {
        left: -428px;
        bottom: -92px;
        border-left: 2px solid rgba(7, 236, 233, 1);
        &::after {
          position: absolute;
          content: "";
          width: 200px;
          right: -224px;
          top: 50%;
          margin-top: -11.5px;
          height: 23px;
          background: url(~common/images/index/jd.gif) no-repeat center;
          background-size: 100% 100%;
          border-top-left-radius: 10px;
          border-bottom-left-radius: 10px;
        }
        .charge_car_title {
          &::after {
            width: 14px;
            height: 14px;
            content: "";
            border-top: 2px solid #0eece9;
            border-right: 2px solid #0eece9;
            border-top-right-radius: 5px;
            position: absolute;
            right: 10px;
            top: -5px;
          }
        }
        .charge_car_val {
          &::after {
            width: 14px;
            height: 14px;
            content: "";
            border-bottom: 2px solid #0eece9;
            border-right: 2px solid #0eece9;
            border-bottom-right-radius: 5px;
            position: absolute;
            right: 10px;
            bottom: -5px;
          }
        }
      }
      .item_right_1 {
        right: -428px;
        top: -92px;
        border-right:  2px solid rgba(7, 236, 233, 1);
        &::after {
          position: absolute;
          content: "";
          width: 200px;
          left: -224px;
          top: 50%;
          margin-top: -11.5px;
          height: 23px;
          background: url(~common/images/index/jd.gif) no-repeat center;
          background-size: 100% 100%;
          transform: rotate(180deg);
          border-top-right-radius: 10px;
          border-bottom-right-radius: 10px;
        }
        .charge_car_title {
          &::after {
            width: 14px;
            height: 14px;
            content: "";
            border-top: 2px solid #0eece9;
            border-left: 2px solid #0eece9;
            border-top-left-radius: 5px;
            position: absolute;
            left: 10px;
            top: -5px;
          }
        }
        .charge_car_val {
          &::after {
            width: 14px;
            height: 14px;
            content: "";
            border-bottom: 2px solid #0eece9;
            border-left: 2px solid #0eece9;
            border-bottom-left-radius: 5px;
            position: absolute;
            left: 10px;
            bottom: -5px;
          }
        }
      }
      .item_right_2 {
        right: -498px;
        top: 50%;
        margin-top: -40px;
        border-right:  2px solid rgba(7, 236, 233, 1);
        &::after {
          position: absolute;
          content: "";
          width: 200px;
          left: -224px;
          top: 50%;
          margin-top: -11.5px;
          height: 23px;
          background: url(~common/images/index/jd.gif) no-repeat center;
          background-size: 100% 100%;
          transform: rotate(180deg);
          border-top-right-radius: 10px;
          border-bottom-right-radius: 10px;
        }
        .charge_car_title {
          &::after {
            width: 14px;
            height: 14px;
            content: "";
            border-top: 2px solid #0eece9;
            border-left: 2px solid #0eece9;
            border-top-left-radius: 5px;
            position: absolute;
            left: 10px;
            top: -5px;
          }
        }
        .charge_car_val {
          &::after {
            width: 14px;
            height: 14px;
            content: "";
            border-bottom: 2px solid #0eece9;
            border-left: 2px solid #0eece9;
            border-bottom-left-radius: 5px;
            position: absolute;
            left: 10px;
            bottom: -5px;
          }
        }
      }
      .item_right_3 {
        right: -428px;
        bottom: -92px;
        border-right:  2px solid rgba(7, 236, 233, 1);
        &::after {
          position: absolute;
          content: "";
          width: 200px;
          left: -224px;
          top: 50%;
                   margin-top: -11.5px;
          height: 23px;
        background: url(~common/images/index/jd.gif) no-repeat center;
          transform: rotate(180deg);
          background-size: 100% 100%;;
          border-top-right-radius: 10px;
          border-bottom-right-radius: 10px;
        }
        .charge_car_title {
          &::after {
            width: 14px;
            height: 14px;
            content: "";
            border-top: 2px solid #0eece9;
            border-left: 2px solid #0eece9;
            border-top-left-radius: 5px;
            position: absolute;
            left: 10px;
            top: -5px;
          }
        }
        .charge_car_val {
          &::after {
            width: 14px;
            height: 14px;
            content: "";
            border-bottom: 2px solid #0eece9;
            border-left: 2px solid #0eece9;
            border-bottom-left-radius: 5px;
            position: absolute;
            left: 10px;
            bottom: -5px;
          }
        }
      }
    }
  }
  .modules_title {
    position: relative;
    padding-left: 36px;
    font-size: 14px;/*no*/
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    margin-bottom: 20px;
  }
  .modules_title::after {
    width: 26px;
    height: 13px;
    content: "";
    position: absolute;
    left: 0px;
    top: 50%;
    margin-top: -6.5px;
    background: url(~common/images/smartCharge/tit_bg.png) no-repeat;
    background-size: contain;
  }
  .charge_status,
  .pay_methods {
    font-size: 12px; /*no*/
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    display: inline-block;
    img {
      width: 14px;
      height: 14px;
      margin-right: 5px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      padding-right: 60px;
    }
  }
}
</style>
