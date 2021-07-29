<template>
  <div class="instrumentAlarm">
    <div class="chart">
      <el-row :gutter="10">
        <el-col :span="12">
          <card title="仪表报警趋势统计">
            <div class="chart_1"></div>
          </card>
        </el-col>
        <el-col :span="12">
          <card title="告警状态分布">
            <div class="chart_2"></div>
          </card>
        </el-col>
      </el-row>
    </div>
    <div class="searchForm">
      <el-form :model="searchInfo" ref="form" label-width="100px" label-position="left">
        <card title="" :className="'adminCard basicsCard'">
          <el-row :gutter="10"> 
            <el-col :span="8" class="marginRight">
              <el-form-item label="时间:" label-width="80px" prop="dateNow">
                <el-date-picker
                  v-model="searchInfo.dateNow"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6" class="marginRight">
              <el-form-item label="告警设备:" label-width="80px" prop="serialNumber">
                <el-input v-model="searchInfo.serialNumber" placeholder="请输入告警设备"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" class="marginRight">
              <el-form-item label="告警状态:" label-width="80px" prop="serialNumber">
                <el-input v-model="searchInfo.alarmStatus" placeholder="请输入告警状态"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="marginRight">
              <el-form-item label="告警类型:" label-width="80px" prop="serialNumber">
                <el-input v-model="searchInfo.alarmType" placeholder="请输入告警类型"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" class="marginRight">
              <el-form-item label="告警级别:" label-width="80px" prop="serialNumber">
                <el-input v-model="searchInfo.alarmLevel" placeholder="请输入告警级别"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-button type="primary" size="small" @click="onSearch">查询</el-button>
              <el-button type="primary" size="small" @click="resetData">重置</el-button>
            </el-col>
          </el-row>
        </card>
      </el-form>
    </div>
    <div class="content-view">
      <div class="Modeltable">
        <page-table
          col-align="center"
          operator-width="110"
          :selection="true"
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
          <span>取消</span>
          </template>
        </page-table>
      </div>
    </div>
  </div>
</template>

<script>
import card from 'view/lightPole/lightPoleStatistical/components/card';
import PageTable from '@/components/adminPage-table';
export default {
  components: {
    card,
    PageTable
  },
  data () {
    return {
      searchInfo: {},
      // 分页
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      // 表格
      tableData: [],
      tableCols: [
        { label: '告警级别',
          prop: 'serialNumber'
        },
        { label: '告警类型',
          prop: 'installAddress'
        },
        { label: '告警设备',
          prop: 'readingValue'
        },
        { label: '告警时间',
          prop: 'beforeReadingTime'
        },
        { label: '告警状态',
          prop: 'readingTime'
        },
        { label: '操作',
          prop: ''
        }
      ]
    }
  },
  methods: {
    resetData () {
      this.searchInfo = {}
      this.onCurrentChange(1);
    },
    onSearch (val) {
      this.onCurrentChange(1);
    },
    getDataAllList () {},
    // 分页切换页面
    onCurrentChange (val) {
      this.page.current = val;
      this.getDataAllList()
    },
    onPageSizeChange (val) {
      this.page.pageSize = val
      this.onCurrentChange(1)
    }
  }
}
</script>

<style lang="less">
.instrumentAlarm {
  .chart {
    background: #ffffff;
  }
  .searchForm {
    margin-top: 10px;
    .el-button {
      margin-left: 10px;
      border-radius: 0px;
      height: 30px;
      line-height: 0;
    }
    .el-button--primary {
      background-color: #2573f1 !important;
      border-color: transparent;
      border-radius: none !important;
      border-radius: unset;
      min-width: 70px;
      font-size: 14px;
    }
  }
  .marginRight {
    margin-right: 20px;
  }
}
</style>