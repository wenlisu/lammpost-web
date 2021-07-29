/* eslint-disable camelcase */
<template>
  <div id='lightPoleDayAnalysis'>
    <!-- 智慧灯杆日分析 Monthly analysis -->
    <header-title icon="iconfont icon-shouye" title="智慧灯杆日分析">
      <search-form
        slot="searchBox"
        :searchItems="searchItems"
        :otherBtnVisible="true"
        @onSearch="onSearch"
        :otherBtnLists="[
          {
            label: '导出',
            click: () => exportInfo()
          }
        ]"
      />
    </header-title>

    <div class="content-view">
      <div class="Modeltable">
        <!-- operator-width="110" operator -->
        <page-table col-align="center" :data="tableData" :cols="tableCols" :page-current="page.current"
          :total="page.total" :page-size="page.pageSize" @current-change="onCurrentChange" @size-change="onPageSizeChange"
          @selection-change="onSelectionChange">
<!--          <template slot-scope="scope" slot="operator">
            <flex>
              <el-button type="text" size="small" title="查看" :style="{marginRight: '10px'}" @click.prevent.stop="showView('edit', {
                ...scope.row
              })"
                v-if="true || $_hasOperation($options.name,'detail')">
                <i class="iconfont icon-xiangqing" style="fontSize: 20px; color: #2EDEF4" />
              </el-button>
            </flex>
          </template> -->
        </page-table>
      </div>
    </div>
  </div>
</template>

<script>
import pageMain from 'components/pageMain';
import headerTitle from 'components/adminHeaderTitle/headerTitle'
import searchForm from 'components/adminSearchForm/searchForm';
import radioType from 'components/radioType';
import PageTable from '@/components/adminPage-table';
import Flex from '@/components/flex';
import { download } from '@/util/util';
import {
  routePush
} from '@/util/util';
import {
  getLampOnStatus,
  getAreaList,
  exportConsumptionAnalysis
} from 'api/lightPole';
import {
  lampDayStatistics
} from 'api/lightPoleStatistical';

  /** 1:正常、2：故障 */
export default {
  name: 'lightPoleDayAnalysis',
  data () {
    return {
      searchVal: {},
      searchItems: [{
        type: 'dataPicker',
        label: '日期',
        labelWidth: '45px',
        props: {
          fieldName: 'date',
          format: 'yyyy-MM-dd'
          // formatValue: 'yyyy-MM-dd'
        }
      },
      {
        type: 'input',
        label: '编号',
        labelWidth: '45px',
        props: {
          fieldName: 'terminal'
        }
      }, {
        type: 'input',
        label: '灯杆名称',
        props: {
          fieldName: 'terminalName'
        }
      },
      {
        type: 'input',
        label: '道路',
        props: {
          fieldName: 'address'
        }
      }, {
        type: 'select',
        label: '区域',
        props: {
          fieldName: 'area',
          options: [{
            id: 1,
            name: '开启'
          }, {
            id: 2,
            name: '关闭'
          }, {
            id: 3,
            name: '故障'
          }]
        }
      }
      ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      tableCols: [{
        label: '日期',
        prop: 'date'
      }, {
        label: '编号',
        prop: 'terminal'
      },
      {
        label: '灯杆名称',
        prop: 'terminalName'
      },
      {
        label: '所属道路',
        prop: 'installAddress'
      },
      {
        label: '区域',
        prop: 'area'
      },
      {
        label: '总耗电量(度)',
        prop: 'usingPower',
        width: '90px',
        render: (h, scope) => {
          return <div>{scope.row.usingPower}度</div>;
        }
      },
      {
        label: '节能用电(度)',
        prop: 'savedPower',
        width: '90px',
        render: (h, scope) => {
          return <div>{scope.row.savedPower}度</div>;
        }
      },
      {
        label: '照明次数',
        prop: 'isOnRecords'
      },
      {
        label: '故障次数',
        prop: 'isFaultRecords'
      },
      {
        label: '亮灯时长(h)',
        prop: 'onTotal',
        width: '90px'
      },
      {
        label: '故障时长(h)',
        prop: 'faultTotal',
        width: '90px'
      },
      {
        label: '亮灯率',
        prop: 'isOnRecordsRate',
        render: (h, scope) => {
          return <div>{scope.row.isOnRecordsRate}%</div>;
        }
      },
      {
        label: '故障率',
        prop: 'isFaultRecordsRate',
        width: '90px',
        render: (h, scope) => {
          return <div>{scope.row.isFaultRecordsRate}%</div>;
        }
      },
      {
        label: '节能时长(h)',
        width: '90px',
        prop: 'isOnRecords'
      },
      {
        label: '中照明时长(h)',
        prop: 'isOnRecords',
        width: '100px'
      },
      {
        label: '高照明时长(h)',
        prop: 'isOnRecords',
        width: '100px'
      }
        // {
        //   label: '大气压',
        //   prop: 'satmosphereText',
        //   render: (h, scope) => {
        //     return this.getRadiosType(scope.row.satmosphere);
        //   }
        // },
      ],
      selectsList: [],
      currentTitleList: [{
        name: 'illumination',
        title: '智慧照明'
      }, {
        name: 'illumination',
        title: '日节能用电分析'
      }]
    }
  },
  mounted () {
    this.$nextTick(() => {
      getAreaList().then(res => {
        if (res.code === '200') {
          const data = res.data;
          this.$set(this.searchItems[4], 'props', {
            // placeholder: '请选择区域',
            fieldName: 'area',
            options: data.map(data => {
              return {
                id: data.id,
                name: data.area
              }
            })
          });
        }
      });
      this.getDataAllList(1, 10)
    })
  },
  components: {
    headerTitle,
    PageTable,
    searchForm,
    Flex,
    radioType,
    pageMain
  },
  methods: {
    exportInfo() {
      exportConsumptionAnalysis(1).then(res => {
        let blob = new Blob([res.data]);
        let url = window.URL.createObjectURL(blob);
        download(url, "灯杆能耗(日).xls");
      })
    },
    getRadiosType (type) {
      let div = <radioType type = "3" />;
      switch (type) {
        case 1:
          div = <radioType type = "1" />;
          break;
        case 2:
          div = <radioType type = "2" />;
          break;
        default:
      }
      return div;
    },
    onSearch (val) {
      let parames = {
        ...val,
        startDate: (val.date && val.date[0]) || '',
        endDate: (val.date && val.date[1]) || ''
      }
      delete parames.date;
      this.searchVal = parames
      // this.getDataAllList(1);
      this.onCurrentChange(1)
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
      lampDayStatistics(data).then(res => {
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
      routePush({
        title: '灯杆详情',
        name: 'lightPoleDetail',
        parames: row
      });
    }
  }
}
</script>

<style lang="less">
  #lightPoleDayAnalysis {
    .el-input__inner {
      color: #d9d9d9;
      // background: rgba(34, 44, 81, 0.5);
      // border: 1px solid rgba(98, 117, 191, 1);
    }

    .el-range-input {
      border: none;
    }

    .el-date-editor {
      .el-range-separator {
        color: #ffffff;
      }
    }
  }
</style>
