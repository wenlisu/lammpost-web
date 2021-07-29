/* eslint-disable camelcase */
<template>
  <pageMain idName='wisdomWarn' :currentTitleList="currentTitleList">
    <div v-if="routeName == 'wisdomWarnDetail'">
      <Detail />
    </div>
    <div v-if="routeName == 'wisdomWarn'">
      <!-- 智慧报警 -->
      <header-title
        icon="iconfont icon-shouye"
        title="智慧报警"
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
              slot="imgList"
            >
              <el-image
                :src="watchImg"
                fit="'fill'"
                @click="() => handleServiceAddress(scope.row)"
              ></el-image>
            </template>
              <template
                slot-scope="scope"
                slot="operator"
              >
                <el-button
                  type="text"
                  size="small"
                  title="查看"
                  :style="{marginRight: '10px'}"
                  @click.prevent.stop="showView({
                    ...scope.row
                  })"
                  v-if="true || $_hasOperation($options.name,'detail')">
                    <i class="iconfont icon-xiangqing" style="fontSize: 20px; color: #2EDEF4"/>
                </el-button>
              </template>
            </page-table>
        </div>
      </div>
    </div>
    <el-dialog
      title="摄像头监控画面"
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
  </pageMain>
</template>

<script>
import {
  mapGetters
} from 'vuex';
import pageMain from 'components/pageMain';
import headerTitle from 'components/headerTitle/headerTitle'
import searchForm from 'components/searchForm/searchForm';
import PageTable from '@/components/page-table';
import { routePush } from '@/util/util';
import watchImg from '../../lightPole/lightPoleDetail/images/img2.png';
import Detail from './detail';
import {
  getEmergencyList
} from 'api/wisdomMonitor';
export default {
  name: 'wisdomWarn',
  data () {
    return {
      watchImg,
      searchVal: {},
      searchItems: [{
        type: 'input',
        label: '编号',
        labelWidth: '45px',
        props: {
          fieldName: 'recordNo'
        }
      }, {
        type: 'input',
        label: '报警灯杆',
        props: {
          fieldName: 'terminalName'
        }
      }, {
        span: 12,
        type: 'timePicker',
        label: '报警时间',
        props: {
          fieldName: 'time',
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
          isRange: true
        }
      }],
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      tableCols: [
        { label: '编号', prop: 'recordNo' },
        { label: '报警灯杆', prop: 'terminalName', minWidth: '150px' },
        { label: '摄像头ID', prop: 'serialNumber', minWidth: '150px' },
        { label: '呼叫设备ID', prop: 'emergencyNumber', minWidth: '150px' },
        { label: '摄像头监控画面', prop: 'imgList' },
        { label: '报警开始时间', prop: 'beginCallTime', minWidth: '120px' },
        { label: '报警截止时间', prop: 'endCallTime', minWidth: '120px' }
      ],
      currentTitleList: [{
        name: 'wisdomWarn',
        title: '智慧报警'
      }],
      dialogVisible: false,
      serviceAddress: ''
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.openPage === 'wisdomWarn') {
        this.getDataAllList();
      }
    })
  },
  watch: {
    routeName (val) {
      this.setBread(val);
    }
  },
  computed: {
    ...mapGetters(['common', 'openPage']),
    routeName () {
      this.setBread(this.$route.name);
      return this.$route.name
    }
  },
  components: {
    headerTitle,
    searchForm,
    PageTable,
    pageMain,
    Detail
  },
  methods: {
    setBread (val) {
      if (val === 'wisdomWarn') {
        this.currentTitleList = [{
          name: 'wisdomWarn',
          title: '智慧报警'
        }];
      } else {
        this.currentTitleList = [{
          name: 'wisdomWarn',
          title: '智慧报警'
        }, {
          name: 'wisdomWarnDetail',
          title: '报警详情'
        }];
      }
    },
    onSearch (val) {
      this.searchVal = {
        recordNo: val.recordNo,
        terminalName: val.terminalName,
        beginTimeFrom: val.time[0],
        beginTimeTo: val.time[1]
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
      getEmergencyList(data).then(res => {
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
    handleServiceAddress (row) {
      this.dialogVisible = true;
      this.serviceAddress = row.picOne;
      // window.open(this.form.serviceAddress);
    },
    showView (row) {
      let parames = {
        ...row,
        toName: 'wisdomWarn'
      };
      routePush({
        title: '报警详情',
        name: 'wisdomWarnDetail',
        parames
      });
    }
  }
}
</script>

<style lang="less">
#wisdomWarn{
  .comp-page-table{
    .el-image{
      width:16px;/*no*/
      height:11px;/*no*/
      cursor: pointer;
    }
  }
  .el-dialog{
    .el-dialog__body{
      padding: 0px;
      height: 309px;/*no*/
    }
  }
}
</style>
