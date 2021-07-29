/* eslint-disable camelcase */
<template>
  <div id='entranceInOutEvent' >
    <!-- 进出事件查询 -->
    <header-title
      icon="iconfont icon-shouye"
      title="进出事件查询"
    >
      <search-form
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
        :addBtnVisible="$_hasOperation($options.name,'add')"
        @on-addBtn="openDialog('add');"
      />
    </header-title>

    <div class="content-view">
      <div class="Modeltable">
        <page-table
          col-align="center"
          operator-width="110"
          operator
          :selection="false"
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
              <i class="iconfont icon-xiangqing" style="fontSize: 20px; color: #2573f1"/>
            </el-button>
            <!-- <el-button
              type="text"
              size="small"
              title="删除"
              @click.prevent.stop="showView('del', {
                ...scope.row
              })"
              v-if="true || ($_hasOperation($options.name,'edit'))">
              <i class="iconfont icon-shanchu" style="fontSize: 20px; color: #FF5736"/>
            </el-button> -->
          </flex>
          </template>
        </page-table>
      </div>
    </div>
  </div>
</template>

<script>
import headerTitle from 'components/adminHeaderTitle/headerTitle'
import searchForm from 'components/adminSearchForm/searchForm';
import PageTable from '@/components/adminPage-table';
import Flex from '@/components/flex';
import {
  doorAccessLogGetOrder
} from 'api/entrance';
export default {
  name: 'entranceInOutEvent',
  data () {
    return {
      searchVal: {},
      searchItems: [{
        type: 'dataPicker',
        label: '时间',
        props: {
          fieldName: 'time'
        }
      }, {
        type: 'input',
        label: '访客姓名',
        props: {
          fieldName: 'name'
        }
      }, {
        type: 'input',
        label: '门禁点',
        props: {
          fieldName: 'address'
        }
      }, {
        type: 'select',
        label: '出入类型',
        props: {
          fieldName: 'accessType',
          options: [{
            id: 1,
            name: '进门'
          }, {
            id: 2,
            name: '出门'
          }]
        }
      }, {
        type: 'select',
        label: '事件类型',
        props: {
          fieldName: 'status',
          options: []
        }
      }],
      // 分页
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      tableCols: [
        { label: '时间',
          prop: 'createTime',
          minWidth: '110px'
        },
        { label: '访客姓名',
          prop: 'name'
        },
        { label: '人员编号',
          prop: 'imei'
        },
        { label: '卡号',
          prop: 'imei'
        },
        { label: '门禁点',
          prop: 'address'
        },
        { label: '验证方式',
          prop: 'imei'
        },
        { label: '出入类型',
          prop: 'entrance',
          render: (h, scope) => {
            const types = {
              1: '刷脸',
              2: '刷卡'
            };
            return (
              <div>{types[scope.row.entrance]}</div>
            )
          }
        },
        { label: '事件类型',
          prop: 'imei'
        }
      ]
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.onCurrentChange(1)
    })
  },
  components: {
    headerTitle,
    searchForm,
    PageTable,
    Flex
  },
  methods: {
    // 日期选项
    onSearch (val) {
      this.searchVal = {
        ...val,
        onTime: val.time && val.time[0],
        closeTime: val.time && val.time[1]
      };
      delete this.searchVal.time;
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
      doorAccessLogGetOrder(data).then(res => {
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
#entranceInOutEvent{
}
</style>
