/* eslint-disable camelcase */
<template>
  <div id='timeTaskList' >
    <div v-if="routeName === 'timeTaskList'">
      <!-- 定时任务 -->
      <header-title
        icon="iconfont icon-shouye"
        title="定时任务"
      >
        <search-form
          slot="searchBox"
          :searchItems="searchItems"
          @onSearch="onSearch"
          :addBtnVisible="true || $_hasOperation($options.name,'add')"
          @on-addBtn="showView();"
          :otherBtnVisible="true"
          :otherBtnLists="[{
            label: '刷新',
            click: () => onSearch({})
          }, {
            label: '播放',
            disabled: selectsList.length === 0,
            click: () => _setTaskPlayStop(1)
          }, {
            label: '停止',
            disabled: selectsList.length === 0,
            click: () => _setTaskPlayStop(0)
          }, {
            label: '开启',
            disabled: selectsList.length === 0,
            click: () => _setTaskDisable(1)
          }, {
            label: '禁用',
            disabled: selectsList.length === 0,
            click: () => _setTaskDisable(0)
          }]"
        />
      </header-title>

      <div class="content-view">
        <div class="Modeltable">
          <page-table
            col-align="center"
            operator-width="110"
            operator
            selection
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
            <flex>
              <el-button
                type="text"
                size="small"
                title="查看"
                :style="{marginRight: '10px'}"
                @click.prevent.stop="showView({
                  ...scope.row
                })"
                v-if="true || $_hasOperation($options.name,'detail')">
                <i class="iconfont icon-xiangqing" style="fontSize: 20px; color: #2573f1"/>
              </el-button>
              <el-button
                type="text"
                size="small"
                title="删除"
                @click.prevent.stop="handleDelete({
                  ...scope.row
                })"
                v-if="true || ($_hasOperation($options.name,'edit'))">
                <i class="iconfont icon-shanchu" style="fontSize: 20px; color: #FF5736"/>
              </el-button>
            </flex>
            </template>
          </page-table>
        </div>
      </div>
    </div>
    <div v-if="routeName == 'timeTaskDetail'">
        <Detail />
      </div>
  </div>
</template>

<script>
import headerTitle from 'components/adminHeaderTitle/headerTitle'
import searchForm from 'components/adminSearchForm/searchForm';
import PageTable from '@/components/adminPage-table';
import Flex from '@/components/flex';
import { routePush } from '@/util/util';
import { WEEK_LIST_TYPE } from '@/util/constants';
import Detail from './detail';
import {
  getTerminalDeviceStatusList,
  setTaskPlayStop,
  setTaskDisable,
  removeAudioPlayTaskByTaskCode
} from 'api/brocast';
export default {
  name: 'timeTaskList',
  data () {
    const weekList = this.$_useTypes(WEEK_LIST_TYPE);
    return {
      weekList,
      searchVal: {},
      searchItems: [{
        type: 'input',
        label: '任务名称',
        props: {
          fieldName: 'taskName',
          width: '180px'
        }
      }, {
        type: 'input',
        label: '广播器名称',
        props: {
          fieldName: 'deviceName',
          width: '180px'
        }
      }, {
        type: 'select',
        label: '运行状态',
        props: {
          fieldName: 'playStatus',
          options: [{
            id: 1,
            name: '播放中'
          }, {
            id: 0,
            name: '已停止'
          }, {
            id: 2,
            name: '等待运行'
          }]
        }
      }, {
        type: 'select',
        label: '任务状态',
        props: {
          fieldName: 'taskStatus',
          options: [{
            id: 1,
            name: '开启'
          }, {
            id: 0,
            name: '禁用'
          }]
        }
      }],
      // 分页
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      selectsList: [],
      tableData: [],
      tableCols: [
        { label: '任务名称',
          prop: 'taskName',
          minWidth: '80px'
        },
        { label: '广播器名称',
          prop: 'deviceName',
          minWidth: '80px'
        },
        { label: '广播器数量',
          prop: 'audioCount'
        },
        { label: '运行状态',
          prop: 'playStatusText'
        },
        { label: '任务状态',
          prop: 'taskStatusText'
        },
        { label: '播放属性',
          prop: 'playModeText'
        },
        { label: '定时属性',
          prop: 'taskType',
          minWidth: '200px',
          render: (h, scope) => {
            return <div>{this.getTaskTypeText(scope)}</div>
          }
        },
        { label: '创建时间',
          prop: 'createDate',
          minWidth: '100px'
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
    Flex,
    Detail
  },
  computed: {
    // ...mapGetters(['common', 'openPage']),
    routeName () {
      return this.$route.name
    }
  },
  methods: {
    getTaskTypeText (scope) {
      const taskTypes = {
        1: '单次任务',
        2: '每日任务',
        3: '每周任务'
      };
      const taskTypeT = taskTypes[scope.row.taskType];
      const dateT = scope.row.taskType !== 1 ? `${scope.row.beginDate}至${scope.row.endDate}` : `${scope.row.beginDate}`;
      const timeT = `从${scope.row.beginTime}开始，至${scope.row.endTime}结束`;
      let weekT = '';
      if (scope.row.taskType === 3 && scope.row.weekList && scope.row.weekList.length > 0) {
        weekT = '每';
        scope.row.weekList.map(week => {
          weekT = `${weekT}${this.weekList.types[week]},`
        });
      }
      return `${taskTypeT}, ${dateT}, ${weekT} ${timeT}`
    },
    // 日期选项
    onSearch (val) {
      console.log('val', val);
      this.searchVal = {
        ...val
      }
      if (val.playStatus !== '') {
        this.searchVal.playStatus = +val.playStatus
      }
      if (val.taskStatus !== '') {
        this.searchVal.taskStatus = +val.taskStatus
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
      getTerminalDeviceStatusList(data).then(res => {
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
    // 数量选择搜索
    onPageSizeChange (val) {
      this.page.pageSize = val
      this.onCurrentChange(1)
    },
    // 多选列表
    onSelectionChange (args) {
      this.selectsList = args.map(arg => arg.taskCode)
    },
    // 查看详情
    showView (item) {
      routePush({
        title: '定时任务详情',
        name: 'timeTaskDetail',
        parames: {
          ...item,
          toName: 'timeTaskList'
        }
      });
    },
    // 删除
    handleDelete (row) {
      console.log('row', row);
      this.$confirm('此操作将永久删除该定时任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeAudioPlayTaskByTaskCode([row.taskCode]).then(res => {
          if (res.code === '200') {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              position: 'bottom-right'
            });
            this.getDataAllList();
          }
        })
      })
    },
    _setTaskPlayStop (playStatus) {
      const parames = {
        playStatus: playStatus,
        taskCodes: this.selectsList
      }
      setTaskPlayStop(parames).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '设置成功',
            type: 'success',
            position: 'bottom-right'
          });
          this.getDataAllList();
        }
      })
    },
    _setTaskDisable (taskStatus) {
      const parames = {
        taskStatus: taskStatus,
        taskCodes: this.selectsList
      }
      setTaskDisable(parames).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '设置成功',
            type: 'success',
            position: 'bottom-right'
          });
          this.getDataAllList();
        }
      })
    }
  }
}
</script>

<style lang="less">
#timeTaskList{}
</style>
