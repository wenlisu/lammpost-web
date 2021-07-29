/* eslint-disable camelcase */
<template>
  <div id='useManage' >
    <div v-if="routeName === 'useManage'">
      <!-- 业务执行管理 -->
      <header-title
        icon="iconfont icon-shouye"
        title="业务执行管理"
      >
        <div
          slot="searchBox"
          class="flexRow searchInfo"
        >
          <div class="flexRow">
            <img class="icon" src="./images/img2.png"/>
            <div class="flexRow infoDetail">
              <div class="number">应用总数：<span>{{count}}</span>个</div>
            </div>
          </div>
          <search-form
            :searchItems="searchItems"
            @onSearch="onSearch"
            :addBtnVisible="true || $_hasOperation($options.name,'add')"
            @on-addBtn="showView('add');"
            :addTitleBtn="'创建应用'"
          />
        </div>
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
    <div v-if="routeName === 'useManagePage'">
      <Page />
    </div>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex';
import headerTitle from 'components/adminHeaderTitle/headerTitle'
import searchForm from 'components/adminSearchForm/searchForm';
import PageTable from '@/components/adminPage-table';
import Flex from '@/components/flex';
import { routePush } from '@/util/util';
import Page from './page';
import {
  getReportRelation,
  getReportRelationCount,
  deleteReportRelationDataModule,
  getReportRelationHandle
} from 'api/admin';
export default {
  name: 'useManage',
  data () {
    return {
      count: 0,
      searchVal: {},
      searchItems: [{
        type: 'input',
        label: '应用名称',
        props: {
          fieldName: 'relationName'
        }
      }],
      // 分页
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      selectList: [],
      tableData: [],
      tableCols: [
        { label: '应用ID',
          prop: 'code'
        },
        { label: '应用名称',
          prop: 'relationName'
        },
        { label: '最后更新时间',
          prop: 'createTime',
          minWidth: '120px'
        }
      ]
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.openPage === 'useManage') {
        this.getCount();
        this.onCurrentChange(1);
      }
    });
  },
  computed: {
    ...mapGetters(['openPage']),
    routeName () {
      return this.$route.name;
    }
  },
  components: {
    headerTitle,
    searchForm,
    PageTable,
    Flex,
    Page
  },
  methods: {
    // 日期选项
    onSearch (val) {
      this.searchVal = {
        ...val
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
      getReportRelation(data).then(res => {
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
      this.selectList = args.map(arg => arg.id);
    },
    getCount () {
      getReportRelationCount().then(res => {
        if (res.code === '200') {
          this.count = res.data;
        }
      });
    },
    showView (type, item) {
      if (type === 'del') {
        this.$confirm('此操作将永久删除该所选应用, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const codes = [item.code];
          deleteReportRelationDataModule(codes).then(res => {
            if (res.code === '200') {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                position: 'bottom-right'
              });
              this.onCurrentChange();
            }
          })
        }).catch(() => {
        });
      } else {
        routePush({
          title: '应用管理详情',
          name: 'useManagePage',
          parames: {
            ...item,
            toName: 'useManage'
          }
        });
      }
    }
  }
}
</script>

<style lang="less">
#useManage{
  .searchInfo{
    justify-content: space-between;
    >.flexRow{
      align-items: center;
      margin-right: 50px;/*no*/
      .icon{
        width: 33px;/*no*/
        height: 36px;/*no*/
        margin-right: 10px;/*no*/
      }
      .infoDetail{
        justify-content: space-between;
        .title{
          font-size:14px;/*no*/
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(90,90,90,1);
          text-align:left;
          padding-right: 10px;
        }
        .number{
          font-size:12px;/*no*/
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(70,70,70,1);/*no*/
          span{
            font-size:20px;/*no*/
            font-family:DINAlternate-Bold,DINAlternate;
            font-weight:bold;
            color:rgba(255,118,0,1);
            margin-right: 8px;
          }
        }
      }
    }
    #adminSearchForm{
      display: flex;
      flex: 1;
      align-items: center;
      .searchItem{
        line-height: 29px;
      }
      .el-form-item, .btnInfo, .hasbtnList{
        margin-bottom: 0;
      }
    }
  }
}
</style>
