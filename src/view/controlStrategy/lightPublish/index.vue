/* eslint-disable camelcase */
<template>
  <div id='lightPublish' >
    <!-- 业务执行管理 -->
    <header-title
      icon="iconfont icon-shouye"
      title="业务执行管理"
      :addBtnVisible="$_hasOperation($options.name,'add')"
      @on-addBtn="openDialog('add');"
    >
      <search-form
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
      />
    </header-title>

    <div class="content-view">
      <div class="Modeltable">
        <el-table
          border
          tooltip-effect="light"
          :data="modeTableData"
          class="f-13"
          style="width: 100%"
          @row-click="rowClick"
          :row-class-name="rowClassName"
        >
          <el-table-column prop="instanceCode" label="业务编码" width="180" show-overflow-tooltip>
            <template slot-scope="scope">
              <!-- 逐条 -->
              <div v-if="scope.row.executionWay === 1">
                <div
                  class="pos-r pl-25 text-overflow tx-left"
                  v-if="scope.row.targetDeviceDtoList && scope.row.childenSon_1"
                >
                  <i class="el-icon-caret-right f-blue f-14 pos-a" style="left:0;top:5px"></i>
                  {{scope.row.instanceCode}}
                </div>
                <div
                  class="pos-r pl-25 ml-15 text-overflow tx-left"
                  v-if="scope.row.instanceInstructionDtoList && scope.row.childenSon_2"
                >
                  <i class="el-icon-caret-right f-blue f-14 pos-a" style="left:0;top:5px"></i>
                  {{scope.row.targetDeviceName}}
                </div>
              </div>
              <!-- 一体 & 混合模式 -->
              <div v-if="scope.row.executionWay === 0 || scope.row.executionWay === 2">
                <div
                  class="pos-r pl-25 text-overflow tx-left"
                  v-if="scope.row.targetDeviceManufacturerDtoList && scope.row.childenSon_1"
                >
                  <i class="el-icon-caret-right f-blue f-14 pos-a" style="left:0;top:5px"></i>
                  {{scope.row.instanceCode}}
                </div>
                <div
                  class="pos-r pl-25 ml-15 text-overflow tx-left"
                  v-if="scope.row.instanceInstructionDtoList && scope.row.childenSon_2"
                >
                  <i class="el-icon-caret-right f-blue f-14 pos-a" style="left:0;top:5px"></i>
                  {{scope.row.targetDeviceManufacturer}}
                </div>
              </div>

              <div class="pos-r ml-30 text-overflow tx-left" v-if="scope.row.childenSon_3">
                <i class="iconfont icon-yuanquan f-12 pr-10" style="color:#4caae0"></i>
                {{scope.row.code}}
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="instanceName" label="业务名称" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <span
                class="f-blue"
                v-if="scope.row.childenSon_1"
                @click.prevent.stop="openDialog('show',{
                      index: scope.$index,
                      row: scope.row
                    })"
              >{{scope.row.instanceName}}</span>
              <span v-else>{{scope.row.instanceName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="productName" label="应用名称" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="scope.row.childenSon_3" class="text-overflow">{{scope.row.modelName}}</div>
              <div v-else class="text-overflow">{{scope.row.productName}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="executionWayName" label="执行模式" show-overflow-tooltip></el-table-column>
          <el-table-column prop="statusName" label="业务状态" show-overflow-tooltip></el-table-column>
          <el-table-column
            prop="executionResultName"
            label="业务结果"
            min-width="120"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{scope.row.executionResultName}}
              <i
                class="ml-5 iconfont"
                :class="_executionResultNameIcon(scope.row).icon"
                :style="_executionResultNameIcon(scope.row).style"
              ></i>
            </template>
          </el-table-column>
          <el-table-column prop="creationTime" label="创建时间" min-width="150" show-overflow-tooltip></el-table-column>

          <el-table-column label="操作" width="220">
            <template slot-scope="scope">
              <el-button
                type="primary"
                @click.prevent.stop="operationalEvents(scope.row,'threadId')"
                v-if="btnDisplay(scope.row,'threadId')"
                class="serviceBtn"
                title="业务追踪"
              >业务追踪</el-button>
              </span>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
          class="elPagination"
          background
          layout="total, prev, pager, next, jumper"
          :page-count="pagination.totalPageNo"
          :current-page.sync="pagination.pageNo"
          :total="pagination.total"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import headerTitle from 'components/headerTitle/headerTitle'
import searchForm from 'components/searchForm/searchForm';
import {
  // listInstancesByCondition,
} from 'api';
export default {
  name: 'lightPublish',
  data () {
    return {
      searchVal: {},
      searchItems: [{
        type: 'input',
        label: '业务名称：',
        props: {
          fieldName: 'instanceName'
        }
      }, {
        type: 'input',
        label: '应用产品：',
        props: {
          fieldName: 'productName'
        }
      }, {
        type: 'select',
        label: '业务状态：',
        props: {
          fieldName: 'status',
          placeholder: '业务状态选择',
          options: [{
            id: null,
            name: '全部'
          }, {
            id: 0,
            name: '待下发'
          }, {
            id: 1,
            name: '待执行'
          }, {
            id: 2,
            name: '执行中'
          }, {
            id: 3,
            name: '已完成'
          }, {
            id: 4,
            name: '已取消'
          }]
        }
      }, {
        type: 'select',
        label: '业务结果：',
        props: {
          fieldName: 'executionResult',
          placeholder: '业务结果选择',
          options: [{
            id: null,
            name: '全部'
          }, {
            id: 1,
            name: '待反馈'
          }, {
            id: 3,
            name: '部分成功'
          }, {
            id: 2,
            name: '全部成功'
          }, {
            id: 4,
            name: '失败'
          }]
        }
      }, {
        type: 'input',
        label: '业务编码：',
        props: {
          fieldName: 'instanceCode'
        }
      }, {
        span: 12,
        type: 'dataPicker',
        label: '业务日期：',
        props: {
          fieldName: 'dateNow',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.pickerOptions
        }
      }],
      modeTableData: [], // 列表数据
      // 分页
      pagination: {
        total: 0, // 一共多少条数据
        totalPageNo: 0, // 总页数
        pageNo: 1 // 当前页数
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getDataAllList(1, 10)
    })
  },
  components: {
    headerTitle,
    searchForm
  },
  methods: {
    // 日期选项
    pickerOptions () {
      return {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      };
    },
    onSearch (val) {
      this.searchVal = {
        ...val,
        beginDate: (val.dateNow && val.dateNow[0]) || '',
        endDate: (val.dateNow && val.dateNow[1]) || ''
      }
      this.getDataAllList(1);
    },
    // 获取所有/查询数据列表
    getDataAllList (pageNo = this.pagination.pageNo, pageSize, searchVal, _this = this) {
      let data = {
        data: {
          ...this.searchVal
        },
        pageNo: Number(pageNo), // 查询的分页页码
        pageSize: Number(pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: ''
      }
      listInstancesByCondition(data).then(res => {
        if (res.code === '200') {
          const d = res.data
          d.data.forEach(item => {
            _this.$set(item, 'childenSon_1', true)
          })
          _this.modeTableData = d.data
          _this.pagination.totalPageNo = d.totalPageNo
          _this.pagination.pageNo = d.pageNo
          _this.pagination.total = d.total
        }
      })
    },
    // 分页切换页面
    handleCurrentChange (val) {
      this.pagination.pageNo = val
      this.getDataAllList()
    },
  }
}
</script>

<style lang="less">
#lightPublish{}
</style>
