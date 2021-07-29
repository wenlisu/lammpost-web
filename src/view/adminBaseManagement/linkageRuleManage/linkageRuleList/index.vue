/* eslint-disable camelcase */
<template>
  <div id='linkageRuleList'>
    <div v-if="routeName == 'linkageRuleListDetail'">
      <Detail />
    </div>
    <div v-if="routeName == 'linkageRuleList'">
      <!-- 联动规则管理 -->
      <header-title
        icon="iconfont icon-shouye"
        title="联动规则管理"
      >
        <search-form
          slot="searchBox"
          :searchItems="searchItems"
          @onSearch="onSearch"
          :addBtnVisible="true || $_hasOperation($options.name,'add')"
          @on-addBtn="showView('add');"
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
                @click.prevent.stop="showView('detail', {
                  ...scope.row
                })"
                v-if="true || $_hasOperation($options.name,'detail')">
                <i class="iconfont icon-xiangqing" style="fontSize: 20px; color: #2573f1"/>
            </el-button>
            <el-button
              type="text"
              size="small"
              title="删除"
              @click.prevent.stop="showView('del', {
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
  </div>
</template>

<script>
import headerTitle from 'components/adminHeaderTitle/headerTitle'
import searchForm from 'components/adminSearchForm/searchForm';
import PageTable from '@/components/adminPage-table';
import Flex from '@/components/flex';
import Detail from './detail';
import { routePush } from '@/util/util';
import {
  deviceLinkage,
  devicedisable,
  deviceenable,
  deviceDeleteLinkage
} from 'api/admin';
import {
  getSceneLinkageList,
  getLinkageEventEnums,
  removeSceneLinkage
} from 'api/smokeDetectorMap';
export default {
  name: 'linkageRuleList',
  data () {
    return {
      searchVal: {},
      searchItems: [{
        type: 'input',
        label: '场景',
        props: {
          fieldName: 'sceneName'
        }
      }, {
        type: 'select',
        label: '事件类型',
        props: {
          fieldName: 'eventTypeText',
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
        { label: '场景',
          prop: 'sceneName'
        },
        { label: '事件类型',
          prop: 'eventTypeName'
        },
        { label: '持续时长',
          prop: 'durationTime'
        },
        { label: '最后更新时间',
          prop: 'lastUpdateTime'
        },
        { label: '启用状态',
          prop: 'enableStatus',
          render: (h, scoped) => {
            return (<div>
              {scoped.row.enableStatus ? <el-button type="text" onClick={() => { /** this.onStatus(scoped.row) */ }}>{scoped.row.enableStatus === 1 ? '禁用' : '开启'}</el-button> : ''}
            </div>);
          }
        }
      ]
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.$route.name === 'linkageRuleList') {
        getLinkageEventEnums().then(res => {
          if (res.code === '200') {
            this.searchItems[1].props.options = res.data;
          }
        });
        this.getDataAllList();
      }
    })
  },
  computed: {
    routeName () {
      return this.$route.name
    }
  },
  components: {
    headerTitle,
    searchForm,
    PageTable,
    Flex,
    Detail
  },
  methods: {
    // 日期选项
    onSearch (val) {
      this.searchVal = {
        ...val
        // instantUse: parseInt(val.instantUse, 10)
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
      getSceneLinkageList(data).then(res => {
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
    },
    onSelectionChange (args) {

    },
    showView (type, item) {
      if (type === 'del') {
        this.$confirm('此操作将永久删除该规则, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeSceneLinkage([item.sceneCode])
            .then(res => {
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
            .catch(() => {});
        });
      } else {
        routePush({
          title: '联动规则管理详情',
          name: 'linkageRuleListDetail',
          parames: {
            ...item,
            toName: 'linkageRuleList'
          }
        });
      }
    },
    onStatus (item) {
      console.log('item', item);
      let methodApi = devicedisable;
      let message = '禁用成功';
      if (item.status === 2) {
        methodApi = deviceenable;
        message = '启动成功';
      }
      methodApi(item.id).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message,
            type: 'success',
            position: 'bottom-right'
          });
          this.getDataAllList();
        }
      });
    }
  }
}
</script>

<style lang="less">
#linkageRuleList{}
</style>
