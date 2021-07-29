/* eslint-disable camelcase */
<template>
    <div id="screenPlayList">
        <header-title icon="iconfont icon-shouye" title="智慧照明">
        <search-form
            slot="searchBox"
            :searchItems="searchItems"
            @onSearch="onSearch"
            @onReset="onReset"
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
                    <!-- <el-button
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
                    </el-button> -->
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
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import headerTitle from 'components/adminHeaderTitle/headerTitle';
import searchForm from 'components/adminSearchForm/searchForm';
import PageTable from '@/components/adminPage-table';
import Flex from '@/components/flex';
import radioType from 'components/radioType';
import { COMMON_TEMPLATE_SERVICE_TYPE } from '@/util/constants';
import { routePush } from '@/util/util';
import store from '@/store';
import { ledAdd,
  ledDelete,
  ledDetail,
  ledGet,
  ledUpdate } from 'api/led/index';
import {
  getGroupPolicy
} from 'api/index';
import {
  getLed,
  deleteLed
} from 'api/screen';
import { policyTypes } from './util';
export default {
  name: 'screenPlayList',
  data () {
    return {
      startValue: {
        groupName: '',
        deviceName: '',
        time: ''
      },
      searchVal: {},
      searchItems: [
        {
          type: 'dataPicker',
          labelWidth: '45px',
          label: '时间',
          props: {
            fieldName: 'time',
            format: 'yyyy-MM-dd'
          },
          initValue: ''
        },
        {
          type: 'input',
          label: '活动名称',
          props: {
            fieldName: 'groupName'
          },
          initValue: ''
        },
        {
          type: 'input',
          label: 'LED屏名称',
          props: {
            fieldName: 'deviceName'
          },
          initValue: ''
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
            fieldName: 'power',
            options: [
              {
                id: 1,
                name: '开启'
              },
              {
                id: 0,
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
            return this.getRadiosType(scope.row.power);
          }
        },
        {
          label: '生效日期',
          prop: 'workTime',
          minWidth: '170px',
          render: (h, scope) => {
            return ((scope.row.workTime && scope.row.closeTime) ? <div>{scope.row.workTime}至{scope.row.closeTime}</div> : null);
          }
        },
        {
          label: '播放时段',
          prop: 'beginTime',
          minWidth: '120px',
          render: (h, scope) => {
            return ((scope.row.beginTime && scope.row.endTime) ? <div>{scope.row.beginTime}至{scope.row.endTime}</div> : null);
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
          minWidth: '80px'
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
  created () {
    let screenInfo = this.common[this.$route.name];
    this.searchVal['groupName'] = screenInfo.groupName ? screenInfo.groupName : '';
    this.searchVal['deviceName'] = screenInfo.value ? screenInfo.value : '';
    this.searchVal['time'] = [screenInfo.workTime ? screenInfo.workTime : '', screenInfo.closeTime ? screenInfo.closeTime : ''];
    const searchItems = this.searchItems.map(item => {
      return {
        ...item,
        initValue: this.searchVal[item.props.fieldName] ? this.searchVal[item.props.fieldName] : ''
      }
    });
    this.$set(this, 'searchItems', searchItems);
  },
  mounted () {
    this.$nextTick(() => {
      console.log(this.routeName)
      if (this.routeName === 'screenPlayList') {
        getGroupPolicy().then(res => {
          if (res.code === '200') {
            this.$set(this.searchItems[3], 'props', {
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
    radioType
  },
  computed: {
    ...mapGetters(['common', 'openPage']),
    ...mapMutations([
      'set_common'
    ]),
    routeName () {
      return this.$route.name
    }
  },
  watch: {
    routeName (val) {
    }
  },
  methods: {
    getRadiosType (type) {
      let div = <radioType type="3" style="justify-content: center; color: #000"/>;
      switch (type) {
        case 1:
          div = <radioType type="1" style="justify-content: center; color: #000"/>;
          break;
        case 2:
          div = <radioType type="3" style="justify-content: center; color: #000"/>;
          break;
        default:
      }
      return div;
    },
    onSearch (val) {
      this.searchVal = {
        ...val,
        power: val ? +val.power : '',
        workBeginTime: val && val.time && val.time[0],
        workEndTime: val && val.time && val.time[1]
      };
      delete this.searchVal.time;
      this.onCurrentChange(1);
    },
    onReset () {
      // this.set_common({
      //   ...this.common,
      //   screenPlayList: {}
      // });
      store.commit('set_common', {
        screenPlayList: {}
      });
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
      getLed(data).then(res => {
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
        deleteLed(row.programCode)
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
        toName: 'screenPlayList'
      };
      routePush({
        title: '定时定点播放',
        name: 'timedScreen',
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
#screenPlayList {
}
</style>
