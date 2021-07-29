/* eslint-disable camelcase */
<template>
  <pageMain idName="wisdomPublish" :currentTitleList="currentTitleList">
    <div v-if="routeName == 'wisdomPublish'">
        <header-title icon="iconfont icon-shouye" title="智慧照明">
        <search-form
            slot="searchBox"
            :searchItems="searchItems"
            @onSearch="onSearch"
            :addBtnVisible="true || $_hasOperation($options.name,'add')"
            @on-addBtn="showView();"
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
                <template slot-scope="scope" slot="operator">
                  <flex style="justify-content: center;">
                    <el-button
                      type="text"
                      size="small"
                      title="修改"
                      :style="{marginRight: '10px'}"
                      @click.prevent.stop="showView({
                        ...scope.row
                      })"
                      v-if="true || $_hasOperation($options.name,'edit')">
                      <i class="iconfont icon-bianji" style="fontSize: 20px; color: #2EDEF4"/>
                    </el-button>
                    <el-button
                        type="text"
                        size="small"
                        title="查看"
                        :style="{marginRight: '10px'}"
                        @click.prevent.stop="showPage({
                        ...scope.row
                        })"
                        v-if="true || $_hasOperation($options.name,'detail')"
                    >
                        <i class="iconfont icon-xiangqing" style="fontSize: 20px; color: #2EDEF4" />
                    </el-button>
                    <el-button
                        type="text"
                        size="small"
                        title="删除"
                        @click.prevent.stop="handleDelBtnClick(scope.row)"
                        v-if="true || ($_hasOperation($options.name,'delete'))"
                    >
                        <i class="iconfont icon-shanchu" style="fontSize: 20px; color: #FF5736" />
                    </el-button>
                  </flex>
                </template>
              </page-table>
            </div>
        </div>
    </div>
    <div v-if="routeName == 'wisdomPublishDetail'">
      <Detail />
    </div>
    <div v-if="routeName == 'wisdomPublishPage'">
      <Page />
    </div>
  </pageMain>
</template>

<script>
import { mapGetters } from 'vuex';
import pageMain from 'components/pageMain';
import headerTitle from 'components/headerTitle/headerTitle';
import searchForm from 'components/searchForm/searchForm';
import PageTable from '@/components/page-table';
import Flex from '@/components/flex';
import radioType from 'components/radioType';
import { COMMON_TEMPLATE_SERVICE_TYPE } from '@/util/constants';
import { routePush } from '@/util/util';
import store from '@/store';
import Detail from './detail';
import Page from './page';
import { ledAdd,
  ledDelete,
  ledDetail,
  ledGet,
  ledUpdate } from 'api/led/index';
import {
  getGroupPolicy
} from 'api/index';
import { policyTypes } from './util';
export default {
  name: 'wisdomPublish',
  data () {
    return {
      searchVal: {},
      searchItems: [
        {
          type: 'input',
          labelWidth: '45px',
          label: '编号',
          props: {
            fieldName: 'id'
          }
        },
        {
          type: 'input',
          label: '活动名称',
          props: {
            fieldName: 'groupName'
          }
        },
        {
          type: 'select',
          label: '区域',
          labelWidth: '45px',
          props: {
            fieldName: 'area',
            options: []
          }
        },
        {
          type: 'select',
          label: '开关状态',
          props: {
            fieldName: 'status',
            options: [
              {
                id: 1,
                name: '开启'
              },
              {
                id: 2,
                name: '关闭'
              }
            ]
          }
        }
      ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      tableCols: [
        { label: '编号', prop: 'groupNo' },
        { label: '活动名称', prop: 'groupName', minWidth: '100px' },
        { label: '所属区域',
          prop: 'area',
          render: (h, scope) => {
            return (
              <div>{scope.row.area instanceof Array ? scope.row.area.join(',') : scope.row.area}</div>);
          }
        },
        { label: '管辖LED屏数量', prop: 'number', minWidth: '80px' },
        {
          label: '开关状态',
          prop: 'status',
          render: (h, scope) => {
            return this.getRadiosType(scope.row.status);
          }
        },
        {
          label: '生效日期',
          prop: 'data',
          minWidth: '170px',
          render: (h, scope) => {
            return ((scope.row.workTime && scope.row.closeTime) ? <div>{scope.row.workTime}至{scope.row.closeTime}</div> : null);
          }
        },
        { label: '场景',
          prop: 'policyType',
          render: (h, scoped) => {
            const types = policyTypes.find(type => type.id === (scoped.row.policyType || 0));
            return (<div>{types && types.name}</div>);
          }
        },
        {
          label: '控制策略',
          prop: 'policyContent',
          minWidth: '80px',
          render: (h, scope) => {
            let statusList =
              scope.row.policyContent &&
              scope.row.policyContent.length > 0 &&
              scope.row.policyContent.map(policy => {
                return this.$_useTypes(COMMON_TEMPLATE_SERVICE_TYPE).types[policy];
              });
            return <div>{statusList && statusList.join(',')}</div>;
          }
        },
        { label: '创建时间',
          prop: 'createTime',
          minWidth: '120px'
        }
      ],
      selectsList: [],
      currentTitleList: [
        {
          name: 'wisdomPublish',
          title: '智慧LED屏'
        }
      ]
    };
  },
  mounted () {
    this.$nextTick(() => {
      if (this.routeName === 'wisdomPublish') {
        getGroupPolicy().then(res => {
          if (res.code === '200') {
            this.$set(this.searchItems[2], 'props', {
              fieldName: 'area',
              options: res.data.map(data => {
                return {
                  id: data.id,
                  name: data.area
                }
              })
            });
          }
        });
        this.getDataAllList()
      }
    });
  },
  components: {
    headerTitle,
    searchForm,
    Flex,
    PageTable,
    pageMain,
    Detail,
    Page,
    radioType
  },
  computed: {
    ...mapGetters(['common', 'openPage']),
    routeName () {
      this.setBread(this.$route.name);
      return this.$route.name
    }
  },
  watch: {
    routeName (val) {
      this.setBread(val);
    }
  },
  methods: {
    setBread (val) {
      if (val === 'wisdomPublish') {
        this.currentTitleList = [{
          name: 'wisdomPublish',
          title: '智慧LED屏'
        }];
      } else {
        this.currentTitleList = [{
          name: 'wisdomPublish',
          title: '智慧LED屏'
        }, {
          name: val,
          title: '信息发布'
        }];
      }
    },
    getRadiosType (type) {
      let div = <radioType type="3" style="justify-content: center;"/>;
      switch (type) {
        case 1:
          div = <radioType type="1" style="justify-content: center;"/>;
          break;
        case 2:
          div = <radioType type="3" style="justify-content: center;"/>;
          break;
        default:
      }
      return div;
    },
    onSearch (val) {
      this.searchVal = {
        ...val
      };
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
      };
      ledGet(data).then(res => {
        if (res.code === '200') {
          const { data, total } = res.data;
          this.page.total = total;
          this.tableData = data;
        }
      });
    },
    onCurrentChange (val) {
      this.page.current = val;
      this.getDataAllList();
    },
    onPageSizeChange (val) {
      this.page.pageSize = val;
      this.onCurrentChange(1);
    },
    onSelectionChange (args) {
      this.selectsList = args.map(arg => {
        return {
          ...arg,
          approveUserId: arg.id
        };
      });
    },
    handleDelBtnClick (row) {
      this.$confirm('此操作将永久删除该所组策略, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ledDelete(row.id)
          .then(res => {
            if (res.code === '200') {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                position: 'bottom-right'
              });
              this.onCurrentChange(this.page.current);
            }
          })
          .catch(() => {});
      });
    },
    showView (row) {
      let parames = {
        ...row,
        toName: 'wisdomPublish'
      };
      routePush({
        title: '信息发布详情',
        name: 'wisdomPublishDetail',
        parames,
        query: {
          activeName: 'led'
        }
      });
    },
    showPage (row) {
      let parames = {
        ...row,
        toName: 'wisdomPublish'
      };
      routePush({
        title: '信息发布详情',
        name: 'wisdomPublishPage',
        parames,
        query: {
          activeName: 'led'
        }
      });
    }
  }
};
</script>

<style lang="less">
#wisdomPublish {
}
</style>
