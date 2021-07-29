/* eslint-disable camelcase */
<template>
  <div id='ruleManagement'>
    <div v-if="routeName == 'ruleManageEdit'">
      <Detail />
    </div>
    <div v-if="routeName == 'ruleManagement'">
      <!-- 业务执行管理 -->
      <header-title
        icon="iconfont icon-shouye"
        title="规则管理"
      >
        <search-form
          slot="searchBox"
          :searchItems="searchItems"
          @onSearch="onSearch"
          :addBtnVisible="true || $_hasOperation($options.name,'add')"
          @on-addBtn="showView('add');"
          :delBtnVisible="false"
          @on-delBtn="showView('del')"
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
export default {
  name: 'ruleManagement',
  data () {
    return {
      searchVal: {},
      searchItems: [{
        type: 'input',
        label: '规则名称',
        props: {
          fieldName: 'ruleName'
        }
      }, {
        type: 'select',
        label: '立即生效状态',
        labelWidth: '110px',
        props: {
          width: '140px',
          fieldName: 'instantUse',
          options: [{
            id: 1,
            name: '是'
          }, {
            id: 2,
            name: '否'
          }]
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
        { label: '规则名称',
          prop: 'ruleName'
        },
        { label: '是否立即生效',
          prop: 'instantUse',
          render: (h, scoped) => {
            return <div>{scoped.row.instantUse === 1 ? '是' : '否'}</div>;
          }
        },
        { label: '生效时间',
          prop: 'onTime',
          render: (h, scoped) => {
            const timeType = scoped.row.timeStatus === 1 ? '一直生效' : (scoped.row.onTime && scoped.row.closeTime ? `${scoped.row.onTime}至${scoped.row.closeTime}` : '');
            return <div>{timeType}</div>;
          }
        },
        { label: '最后更新时间',
          prop: 'updateTime'
        },
        { label: '状态',
          prop: 'status',
          render: (h, scoped) => {
            return (<div>
              {scoped.row.status ? <el-button type="text" onClick={() => { this.onStatus(scoped.row) }}>{scoped.row.status === 1 ? '禁用' : '开启'}</el-button> : ''}
            </div>);
          }
        }
      ]
    }
  },
  mounted () {
    this.$nextTick(() => {
      console.log(this.$route.name);
      if (this.$route.name === 'ruleManagement') {
        this.getDataAllList()
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
        ...val,
        instantUse: parseInt(val.instantUse, 10)
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
      deviceLinkage(data).then(res => {
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
          let parames = {
            id: item.id,
            type: 'LINKAGE'
          }
          deviceDeleteLinkage(parames)
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
          title: '设备联动规则详情',
          name: 'ruleManageEdit',
          parames: {
            ...item,
            toName: 'ruleManagement'
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
#ruleManagement{}
</style>
