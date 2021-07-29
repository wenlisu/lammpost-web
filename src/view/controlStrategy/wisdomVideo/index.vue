/* eslint-disable camelcase */
<template>
  <pageMain idName="wisdomVideo" :currentTitleList="currentTitleList" >
    <div v-if="routeName == 'wisdomVideo'">
        <header-title icon="iconfont icon-shouye" title="智慧广播">
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
                        title="查看"
                        :style="{marginRight: '10px'}"
                        @click.prevent.stop="showView({
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
    <div v-if="routeName == 'wisdomVideoDetail'">
      <Detail />
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
import Detail from '../wisdomPublish/detail';
import {
  deleteBroadcast,
  getBroadcast
} from 'api/controlStrategy';
import {
  getGroupPolicy
} from 'api/index';
import { policyTypes } from '../wisdomPublish/util';

export default {
  name: 'wisdomVideo',
  data () {
    return {
      searchVal: {},
      searchItems: [
        {
          type: 'input',
          labelWidth: '45px',
          label: '编号',
          props: {
            fieldName: 'groupNo'
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
        { label: '编号', prop: 'teamNo' },
        { label: '活动名称', prop: 'teamName', minWidth: '100px' },
        { label: '所属区域',
          prop: 'area',
          render: (h, scope) => {
            return (
              <div>{scope.row.area instanceof Array ? scope.row.area.join(',') : scope.row.area}</div>);
          }
        },
        { label: '管辖广播器数量', prop: 'number', minWidth: '80px' },
        {
          label: '生效日期',
          prop: 'data',
          minWidth: '180px',
          render: (h, scope) => {
            return ((scope.row.workTime && scope.row.closeTime) ? <div>{scope.row.workTime}至{scope.row.closeTime}</div> : null);
          }
        },
        { label: '场景',
          prop: 'policyType',
          render: (h, scoped) => {
            const types = policyTypes.find(type => type.id === scoped.row.displayType);
            return (<div>{types ? types.name : scoped.row.number}</div>);
          }
        },
        { label: '创建时间', prop: 'createTime', minWidth: '120px' }
      ],
      selectsList: [],
      currentTitleList: []
    };
  },
  mounted () {
    this.$nextTick(() => {
      if (this.routeName === 'wisdomVideo') {
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
            })
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
      if (val === 'wisdomVideo') {
        this.currentTitleList = [
          {
            name: 'publishPoleMap',
            title: '智慧发布'
          },
          {
            name: 'wisdomVideo',
            title: '智慧广播'
          }
        ];
      } else {
        this.currentTitleList = [
          {
            name: 'publishPoleMap',
            title: '智慧发布'
          },
          {
          name: 'wisdomVideo',
          title: '智慧广播'
          },
          {
            name: 'wisdomVideoDetail',
            title: '信息发布'
          }
        ];
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
      getBroadcast(data).then(res => {
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
        deleteBroadcast(row.id)
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
        toName: 'wisdomVideo'
      };
      if (row) {
      };
      routePush({
        title: '智慧广播详情',
        name: 'wisdomVideoDetail',
        parames,
        query: {
          activeName: 'video'
        }
      });
    }
  }
};
</script>

<style lang="less">
#wisdomVideo {
}
</style>
