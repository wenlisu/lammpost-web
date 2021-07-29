/* eslint-disable camelcase */
<template>
  <div id='equipment'>
      <header-title
        icon="iconfont icon-shouye"
        title="wifi设备管理"
      >
        <search-form
          slot="searchBox"
          :searchItems="searchItems"
          @onSearch="onSearch"
        />
      </header-title>

      <div class="content-view">
        <div class="Modeltable">
          <page-table
            col-align="center"
            operator-width="110"
            operator
            operatorText="用户信息"
            :data="tableData"
            :cols="tableCols"
            :page-current="page.current"
            :total="page.total"
            :page-size="page.pageSize"
            @current-change="onCurrentChange"
            @size-change="onPageSizeChange"
          >
            <template slot-scope="scope" slot="operator">
              <el-button
                  type="text"
                  size="small"
                  title="详细信息"
                  @click.prevent.stop="showView({
                  ...scope.row
                  })"
                  v-if="true || $_hasOperation($options.name,'detail')"
              >
                  <i class="iconfont icon-xiangqing" style="fontSize: 20px; color: #2EDEF4" />
              </el-button>
            </template>
          </page-table>
        </div>
      </div>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex';
import headerTitle from 'components/headerTitle/headerTitle'
import searchForm from 'components/searchForm/searchForm';
import PageTable from '@/components/page-table';
import card from '@/view/lightPole/lightPoleStatistical/components/card';
import { routePush } from '@/util/util';
import {
  apDeviceMgt
} from 'api/wisdomMonitor';
import {
  getLampOnStatus
} from 'api/lightPole';
export default {
  name: 'equipment',
  data () {
    return {
      searchVal: {},
      searchItems: [{
        type: 'input',
        label: '编号',
        labelWidth: '45px',
        props: {
          fieldName: 'serialNumber'
        }
      }, {
        type: 'input',
        label: 'WIFI设备名称',
        labelWidth: '100px',
        props: {
          fieldName: 'apName'
        }
      }, {
        type: 'select',
        label: '设备状态',
        props: {
          fieldName: 'wifiStatus',
          options: []
        }
      }],
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      tableCols: [
        { label: '编号', prop: 'serialNumber', minWidth: '150px' },
        { label: 'WIFI设备名称', prop: 'apName' },
        { label: '灯杆名称', prop: 'address', minWidth: '150px' },
        { label: '网络模式', prop: 'mode' },
        { label: 'IP地址', prop: 'ipAddress' },
        { label: '子网掩码', prop: 'mask' },
        { label: '当前在线人数', prop: 'wifiConnectionCount' },
        { label: '今日认证用户数', prop: 'todayConnectionCount' },
        { label: '人均流量(GB)', prop: 'perCapitalFlow' },
        { label: 'WIFI设备状态', prop: 'wifiStatusText' }
      ]
    }
  },
  mounted () {
    this.$nextTick(() => {
      getLampOnStatus().then(res => {
        if (res.code === '200') {
          this.$set(this.searchItems[2], 'props', {
            fieldName: 's_lamp',
            options: res.data.map(data => {
              return {
                id: data.key,
                name: data.value
              }
            })
          });
        }
      });
      this.getDataAllList();
    })
  },
  computed: {
    ...mapGetters(['common', 'openPage'])
  },
  components: {
    headerTitle,
    searchForm,
    PageTable,
    card
  },
  methods: {
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
      };
      apDeviceMgt(data).then(res => {
        if (res.code === '200') {
          const { data, total } = res.data;
          this.page.total = total;
          this.tableData = data;
        }
      });
    },
    onCurrentChange (val) {
      this.page.current = val;
      this.getDataAllList();
    },
    onPageSizeChange (val) {
      this.page.pageSize = val;
      this.onCurrentChange(1);
    },
    showView (row) {
      let parames = {
        ...row,
        toName: 'wisdomWifi'
      };
      if (row) {
        parames.imei = row.imei ? row.imei : row.groupNo
      };
      routePush({
        name: 'wisdomWifiUserTraffic',
        parames
      });
    }
  }
}
</script>

<style lang="less">
#equipment{
}
</style>
