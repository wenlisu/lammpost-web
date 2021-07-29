<template>
  <div class="ammeterPaymentAlarm">
    <div class="info-card">
      <el-row :gutter="10" class="list">
        <el-col :span="8">
          <div class="content">
            <div class="main-title">总</div>
            <ul>
              <li class="title">总用户数</li>
              <li class="charge">439户</li>
            </ul>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="content">
            <div class="main-title">未</div>
            <ul>
              <li class="title">未缴费用户</li>
              <li class="charge">19户</li>
            </ul>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="content">
            <div class="main-title">已</div>
            <ul>
              <li class="title">已缴费用户</li>
              <li class="charge">388户</li>
            </ul>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="searchForm">
      <el-form :model="searchInfo" ref="form" label-width="100px" label-position="left">
        <card title="" :className="'adminCard basicsCard'">
          <el-row :gutter="10">
            <el-col :span="8" class="marginRight">
              <el-form-item label="月份:" label-width="80px" prop="dateNow">
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
              <el-form-item label="水表编码:" label-width="80px" prop="serialNumber">
                <el-input v-model="searchInfo.serialNumber" placeholder="请输入告警设备"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" class="marginRight">
              <el-form-item label="缴费用户:" label-width="80px" prop="serialNumber">
                <el-input v-model="searchInfo.alarmStatus" placeholder="请输入告警状态"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="marginRight">
              <el-form-item label="位置:" label-width="80px" prop="serialNumber">
                <treeselect :value="searchInfo.location" @getNode="getParams"></treeselect>
              </el-form-item>
            </el-col>
            <el-col :span="6" class="marginRight">
              <el-form-item label="缴费状态:" label-width="80px" prop="serialNumber">
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
import treeselect from '../../waterTreeSelect';
export default {
  components: {
    card,
    PageTable,
    treeselect
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
        { label: '月份',
          prop: 'serialNumber'
        },
        { label: '电表编码',
          prop: 'installAddress'
        },
        { label: '位置',
          prop: 'readingValue'
        },
        { label: '应付金额(元)',
          prop: 'beforeReadingTime'
        },
        { label: '缴费金额(元)',
          prop: 'readingTime'
        },
        { label: '欠费(元)',
          prop: ''
        },
        { label: '缴费用户',
          prop: ''
        },
        { label: '用户联系电话',
          prop: ''
        },
        { label: '缴费方式',
          prop: ''
        },
        { label: '缴费时间',
          prop: ''
        },
        { label: '截止缴费时间',
          prop: ''
        },
        { label: '缴费状态',
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
.ammeterPaymentAlarm {
  .chart {
    background: #ffffff;
  }
  .list {
    margin-top: 10px;/*no*/
    .content {
      display: flex;
      background: #fff;
      padding: 10px 15px;/*no*/
      align-items: center;
      .main-title {
        width: 50px;
        height: 50px;
        background: #409eff;
        border-radius: 100px;
        text-align: center;
        line-height: 50px;
        font-size: 20px;
        color: #fff;
        margin-right: 20px;
      }
      ul {
        text-align: center;
        line-height: 40px;
        .title {
          font-size: 14px;
        }
        .charge {
          font-size: 20px;
        }
      }
    }
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
