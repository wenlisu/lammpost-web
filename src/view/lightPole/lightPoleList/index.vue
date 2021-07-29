/* eslint-disable camelcase */
<template>
  <div id='lightPoleList'>
    <!-- 智慧灯杆列表 -->
    <header-title icon="iconfont icon-shouye" title="智慧灯杆列表">
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
        <page-table col-align="center" operator-width="110" operator :data="tableData" :cols="tableCols" :page-current="page.current"
          :total="page.total" :page-size="page.pageSize" @current-change="onCurrentChange" @size-change="onPageSizeChange"
          @selection-change="onSelectionChange">
          <template slot-scope="scope" slot="operator">
            <flex>
              <el-button type="text" size="small" title="查看" :style="{marginRight: '10px'}" @click.prevent.stop="showView('detail', {
                ...scope.row
              })"
                v-if="true || $_hasOperation($options.name,'detail')">
                <i class="iconfont icon-xiangqing" style="fontSize: 20px; color: #2EDEF4" />
              </el-button>
              <el-button type="text" size="small" title="控制策略" @click.prevent.stop="showView('action', {
                ...scope.row
              })"
                v-if="true || ($_hasOperation($options.name,'edit'))">
                <i class="iconfont icon-celvekongzhi" style="fontSize: 20px; color: #FF5736" />
              </el-button>
            </flex>
          </template>
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
  getTerminalDeviceStatusList,
  getTerminalList,
  getLampOnStatus,
  getAreaList,
  exportTerminalInfo
} from 'api/lightPole';
  /** 1:正常、2：故障 */
export default {
  name: 'lightPoleList',
  data () {
    return {
      searchVal: {},
      searchItems: [
        {
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
        },
        {
          type: 'select',
          label: '设备状态',
          props: {
            fieldName: 'lampEquipStatus',
            options: [{
              id: 1,
              name: '正常'
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
        label: '设备编号',
        prop: 'imei'
      },
      {
        label: '灯杆名称',
        prop: 'terminalName',
        minWidth: '150px'
      },
      {
        label: '灯号',
        prop: 'terminal',
        width: '100px'
      },
      {
        label: '所属道路',
        prop: 'installAddress'
      },
      {
        label: '区域',
        prop: 'area',
        width: '60px'
      },
      {
        label: '设备状态',
        prop: 'lampStatus',
        width: '100px',
        render: (h, scope) => {
          return this.getRadiosType(scope.row.lampStatus);
        }
      },
      {
        label: '总耗电量(度)',
        prop: 'usingPower',
        width: '120px',
        render: (h, scope) => {
          return (<div> {
            scope.row.usingPower
          }
              度 </div>);
        }
      },
      {
        label: '节能用电(度)',
        prop: 'savedPower',
        width: '120px',
        render: (h, scope) => {
          return <div> {
            scope.row.savedPower
          }
              度 </div>;
        }
      },
      {
        label: '累计照明次数',
        prop: 'lampOnRecord',
        width: '130px'
      },
      {
        label: '累计故障次数',
        prop: 'lampFaultRecord',
        width: '130px'
      },
      {
        label: '累计亮灯时长(h)',
        prop: 'onTotal',
        width: '140px'
      },
      {
        label: '累计故障时长(h)',
        prop: 'faultTotal',
        width: '140px'
      },
      {
        label: '最近更新时间',
        prop: 'updateTime',
        minWidth: '120px'
      }],
      selectsList: [],
      currentTitleList: [{
        name: 'wisdomLightPole',
        title: '智慧照明'
      }, {
        name: 'wisdomLightPole',
        title: '灯杆运行数据'
      }]
    }
  },
  mounted () {
    this.$nextTick(() => {
      // 设备状态
      getLampOnStatus().then(res => {
        if (res.code === '200') {
          this.$set(this.searchItems[4], 'props', {
            fieldName: 'lampEquipStatus',
            options: res.data.map(data => {
              return {
                id: data.key,
                name: data.value
              }
            })
          });
        }
      });
      // 区域
      getAreaList().then(res => {
        if (res.code === '200') {
          const data = res.data;
          this.$set(this.searchItems[3], 'props', {
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
    exportInfo () {
      exportTerminalInfo().then(res => {
        let blob = new Blob([res.data]);
        let url = window.URL.createObjectURL(blob);
        download(url, "灯杆运行数据.xls");
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

      this.onCurrentChange(1)
      // this.getDataAllList(1);
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
      getTerminalList(data).then(res => {
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
            title: '智慧照明详情',
            name: 'illuminationDetail',
            parames: {
              imei: row.imei,
              relatedType: row.relatedType,
              address: row.address,
              area: row.area,
              terminalName: row.terminalName
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
  #lightPoleList {
    .el-input__inner {
      color:#d9d9d9;
      // background: rgba(34, 44, 81, 0.5);
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
