<template>
  <pageMain idName="chargePileMonitor" :currentTitleList="currentTitleList">
    <div class="choose_val">
      <header-title icon="iconfont icon-shouye" title="充电桩监控">
        <search-form slot="searchBox" :searchItems="searchItems" @onSearch="onSearch" />
      </header-title>
    </div>
    <div class="monitor_table">
      <div
        class="monitor_item"
        v-for="(item, index) in list"
        :key="index"
        @click="goInfo(item.serialNumber)"
        :style="(((index+1)%5)==0)?'margin-right: 0px;':''"
      >
        <div :class="`monitor_item_content ${item.statusClass}`">
          <div class="item_left"></div>
          <div class="item_right">
            <div class="item_title">
              <span class="item_name">{{item.terminalName}}</span>
              <span class="item_btn">{{item.statusText}}</span>
            </div>
            <div style="position:absolute;bottom:0;width:100%">
              <div class="item_sub">
                <span class="item_name">充电量</span>
                <span class="item_percent">{{item.rate}}%</span>
              </div>
              <div class="item_per">
                <electricLine v-if="item.batteryInUse==='1'" startColor="#2a4a79" endColor="#455397" :width="item.rate" height="14" /><!--离线-->
                <electricLine v-if="item.batteryInUse==='2'" startColor="#2a4a79" endColor="#455397" :width="item.rate" height="14" /><!--空闲-->
                <electricLine v-if="item.batteryInUse==='3'" startColor="#d01a1a" endColor="#c11515" :width="item.rate" height="14" /><!--充电中-->
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div
        class="monitor_item"
        :style="(((index+1)%5)==0)?'margin-right: 0px;':''"
        v-for="(item, index) in 5"
        :key="index+'item_2'"
      >
        <div :class="`monitor_item_content status_2`">
          <div class="item_left"></div>
          <div class="item_right">
            <div class="item_title">
              <span class="item_name">充电桩1</span>
              <span class="item_btn">充电中</span>
            </div>
            <div class="item_sub">
              <span class="item_name">充电量</span>
              <span class="item_percent">45%</span>
            </div>
            <div class="item_per">
              <electricLine startColor="#d01a1a" endColor="#c11515" width="45" height="14" />
            </div>
          </div>
        </div>
      </div>
      <div
        class="monitor_item"
        :style="(((index+1)%5)==0)?'margin-right: 0px;':''"
        v-for="(item, index) in 5"
        :key="index+'item_3'"
      >
        <div :class="`monitor_item_content status_3`">
          <div class="item_left"></div>
          <div class="item_right">
            <div class="item_title">
              <span class="item_name">充电桩1</span>
              <span class="item_btn">空闲</span>
            </div>
            <div class="item_sub">
              <span class="item_name">充电量</span>
              <span class="item_percent">45%</span>
            </div>
            <div class="item_per">
              <electricLine startColor="#60db74" endColor="#138bb7" width="45" height="14" />
            </div>
          </div>
        </div>
      </div>
      <div
        class="monitor_item"
        :style="(((index+1)%5)==0)?'margin-right: 0px;':''"
        v-for="(item, index) in 5"
        :key="index+'item_4'"
      >
        <div :class="`monitor_item_content status_4`">
          <div class="item_left"></div>
          <div class="item_right">
            <div class="item_title">
              <span class="item_name">充电桩1</span>
              <span class="item_btn">离线</span>
            </div>
            <div class="item_sub">
              <span class="item_name">充电量</span>
              <span class="item_percent">45%</span>
            </div>
            <div class="item_per">
              <electricLine startColor="#2a4a79" endColor="#455397" width="45" height="14" />
            </div>
          </div>
        </div>
      </div> -->
    </div>
    <div :style="pageWrapperStyle">
      <el-pagination
        class="pagination"
        background
        layout="sizes, prev, pager, next, jumper"
        :pager-count="5"
        :current-page="page.current"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        :page-size="page.pageSize"
        :total="page.total"
        @current-change="onCurrentChange"
        @size-change="onPageSizeChange"
      />
    </div>
  </pageMain>
</template>
<script>
import {
  mapGetters
} from 'vuex';
import pageMain from 'components/pageMain';
import selector from '@/components/selector';
import electricLine from '@/components/electricLine';
import { addressList, batteryList } from 'api/smartCharge/index';
import headerTitle from 'components/headerTitle/headerTitle';
import searchForm from 'components/searchForm/searchForm';
export default {
  components: {
    selector,
    electricLine,
    headerTitle,
    searchForm,
    pageMain
  },
  data () {
    return {
      searchVal: {},
      searchItems: [
        {
          type: 'select',
          label: '区域',
          props: {
            fieldName: 'adress',
            options: []
          }
        },
        {
          type: 'radio',
          label: '充电桩状态',
          labelWidth: '85px',
          initValue: '0',
          props: {
            fieldName: 'inUse',
            options: [
              {
                id: '0',
                name: '全部'
              },
              {
                id: '1',
                name: '离线'
              },
              {
                id: '2',
                name: '空闲'
              },
              {
                id: '3',
                name: '充电中'
              }
            ]
          }
        }
      ],
      page: {
        current: 1,
        pageSize: 20,
        total: 0
      },
      list: [],
      editData: {},
      currentTitleList: [{
        name: 'chargePileMonitor',
        title: '充电桩监控'
      }]
    };
  },
  computed: {
    ...mapGetters(['common']),
    pageWrapperStyle () {
      const ALIGN = {
        left: 'flex-start',
        center: 'center',
        right: 'flex-end'
      };
      return {
        display: 'flex',
        justifyContent: ALIGN['center'],
        padding: '20px 0'
      };
    }
  },
  methods: {
    goInfo (val) {
      this.$router.push({ name: 'chargeBaseInfo', query: { serialNumber: val } });
    },
    onSearch (val) {
      this.searchVal = {
        ...val
      };
      this.onCurrentChange(1);
    },
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
        data: {
          ...this.searchVal
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize
      };
      if (params.data.inUse === '0') {
        delete params.data.inUse;
      }
      batteryList(params).then(res => {
        const { pageNo, total, data } = res.data;
        this.page.current = pageNo;
        this.page.total = total;
        data.map(item => {
          if (item.batteryInUse === '1') {
            item.statusText = '离线'
            item.statusClass = 'status_4'
          } else if (item.batteryInUse === '2') {
            item.statusText = '空闲'
            item.statusClass = 'status_3'
          } if (item.batteryInUse === '3') {
            item.statusText = '充电中'
            item.statusClass = 'status_2'
          }
        })
        this.list = data;
      });
    },
    _addressList () {
      addressList('').then((res) => {
        // console.log(res);
        const { data } = res
        this.searchItems[0].props.options = data
      })
    }
  },
  created () {
    this.editData = this.common['chargePileMonitor'] || {};
    if (this.editData && this.editData.inUse) {
      this.searchItems[1].initValue = this.editData.inUse
    }
    this.searchVal = {
      inUse: this.editData.inUse
    };
    this._addressList();
    this.getList();
  }
};
</script>
<style lang="less" scoped>
#chargePileMonitor {
  overflow: auto;
  color: #e6ecff;
  user-select: none;
  .choose_val {
    padding: 0 0 10px 0;
    .tit {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      padding-right: 10px;
    }
    .el-select {
      width: 110px;
      height: 30px;
      display: inline-block;
      /deep/.el-input__inner,
      .el-input__inner:focus {
        color: #e6ecff;
        border: 1px solid #6275bf !important;
        background: rgba(34, 44, 81, 1);
        border-radius: 4px;
        outline: none;
      }
    }
  }
  .monitor_table {
    overflow: hidden;
    // display: flex;
    // flex-flow: row wrap;
    // align-content: flex-start;
    // justify-content: space-around;
    .monitor_item {
      width: 19%;
      float: left;
      height: 104px;
      margin-right: 1.25%;
      margin-bottom: 10px;
      box-sizing: border-box;
      // flex: 0 0 19%;
      .monitor_item_content {
        padding: 12px 14px;
        background: url(~common/images/smartCharge/monitor_bg.png) no-repeat;
        background-size: 100% 100%;
        display: flex;
        .item_left {
          width: 77px;
          height: 79px;
          // display: inline-block;
          // vertical-align: top;
        }
      }
      .status_1 .item_left {
        background: url(~common/images/smartCharge/monitor_order.png) no-repeat;
        background-size: contain;
        background-position: center;
      }
      .status_2 .item_left {
        background: url(~common/images/smartCharge/monitor_charging.png)
          no-repeat;
        background-size: contain;
        background-position: center;
      }
      .status_3 .item_left {
        background: url(~common/images/smartCharge/monitor_idle.png) no-repeat;
        background-size: contain;
        background-position: center;
      }
      .status_4 .item_left {
        background: url(~common/images/smartCharge/monitor_offline.png)
          no-repeat;
        background-size: contain;
        background-position: center;
      }

      .item_right {
        // display: inline-block;
        // vertical-align: top;
        margin-left: 19px;
        width: 76%;
        position: relative;
        .item_title {
          display: flex;
          justify-content: space-between;
          .item_name {
            font-size: 14px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: rgba(255, 255, 255, 1);
            text-shadow: 0px 2px 4px rgba(13, 16, 46, 0.82);
            width: 160px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .item_btn {
            padding: 1px 10px;
            word-break: keep-all;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            border-radius: 9px;
          }
        }
        .item_sub {
          display: flex;
          justify-content: space-between;
          // padding-top: 24px;
          padding-bottom: 6px;
          .item_name {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(230, 236, 255, 1);
          }
          .item_percent {
            font-size: 12px;
            font-family: DINAlternate;
            font-weight: bold;
            color: rgba(255, 255, 255, 1);
          }
        }
        .item_per {
          width: 100%;
          padding: 2px 2px;
          background: rgba(31, 53, 102, 1);
          border-radius: 2px;
        }
      }
      .status_1 .item_btn {
        background: rgba(17, 82, 197, 1);
      }
      .status_2 .item_btn {
        background: rgba(205, 100, 15, 1);
      }
      .status_3 .item_btn {
        background: rgba(133, 187, 70, 1);
      }
      .status_4 .item_btn {
        background: rgba(55, 67, 108, 1);
      }
    }
  }
  .pagination {
    ul {
      li {
        border: none;
        width: 24px; /*no*/
        height: 24px; /*no*/
        line-height: 22px !important; /*no*/
        background: rgba(50, 66, 99, 1);
        border-radius: 2px; /*no*/
        &.active {
          background: rgba(94, 161, 255, 1) !important;
          line-height: 24px !important; /*no*/
        }
      }
    }
    /deep/.btn-prev,
    /deep/.btn-next {
      border: none;
      width: 24px; /*no*/
      height: 24px; /*no*/
      background: rgba(50, 66, 99, 1);
    }
    /deep/.el-pagination__jump,
    /deep/.el-pagination__sizes,
    /deep/.el-pagination__total {
      color: #919cb1;
      height: 24px; /*no*/
      line-height: 24px; /*no*/
      /deep/.el-input {
        height: 24px; /*no*/
        /deep/input {
          height: 24px !important; /*no*/
          background: transparent;
          border: 1px solid rgba(50, 66, 99, 1); /*no*/
          color: rgba(145, 156, 177, 1);
        }
      }
    }
    /deep/.el-pagination__jump,
    /deep/.el-pagination__sizes {
      line-height: 20px;
    }
  }
}
</style>
