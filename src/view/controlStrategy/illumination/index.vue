/* eslint-disable camelcase */
<template>
  <div id='illumination'>
    <div v-if="routeName == 'illuminationDetail'">
      <Detail />
    </div>
    <div v-if="routeName == 'illumination'">
      <!-- 智慧照明 -->
      <header-title
        icon="iconfont icon-shouye"
        title="智慧照明"
      >
        <search-form
          slot="searchBox"
          :searchItems="searchItems"
          @onSearch="onSearch"
          :addBtnVisible="true || $_hasOperation($options.name,'add')"
          @on-addBtn="showView();"
        >
        <!-- <div class="my-autocomplete" slot="imei">
          <el-autocomplete
            ref="addressInput"
            popper-class="my-autocomplete"
            v-model="searchVal.address"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            @select="handleSelect"
          >
            <template slot-scope="{ item }">
              <span class="addr">{{ item.address }}</span>
            </template>
          </el-autocomplete>
        </div> -->
        </search-form>
      </header-title>

      <div class="content-view">
        <div class="Modeltable">
          <page-table
            col-align="left"
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
                @click.prevent.stop="showView({
                  ...scope.row
                })"
                v-if="true || $_hasOperation($options.name,'detail')">
                  <i class="iconfont icon-xiangqing" style="fontSize: 20px; color: #2EDEF4"/>
              </el-button>
              <el-button
                type="text"
                size="small"
                title="删除"
                @click.prevent.stop="handleDelBtnClick(scope.row)"
                v-if="true || ($_hasOperation($options.name,'delete'))">
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
import {
  mapGetters
} from 'vuex';
import pageMain from 'components/pageMain';
import headerTitle from 'components/adminHeaderTitle/headerTitle'
import searchForm from 'components/adminSearchForm/searchForm';
import PageTable from '@/components/adminPage-table';
import Flex from '@/components/flex';
import radioType from 'components/radioType';
import { GROUP_POLICY_TYPE } from '@/util/constants';
import { routePush } from '@/util/util';
import store from '@/store'
import Detail from './Detail';
import {
  policy,
  deletePolicy,
  getPolicyDetail
} from 'api/controlStrategy';
import {
  getGroupPolicy,
  getAllImei
} from 'api/index';
export default {
  name: 'illumination',
  data () {
    return {
      searchVal: {
        imei: '',
        address: ''
      },
      searchItems: [{
        type: 'input',
        labelWidth: '45px',
        label: '编号',
        props: {
          fieldName: 'groupNo'
        }
      }, {
        type: 'custom',
        label: '灯杆名称',
        props: {
          fieldName: 'imei'
        }
      }, {
        type: 'input',
        label: '策略名称',
        props: {
          fieldName: 'groupName'
        }
      }, {
        type: 'select',
        label: '区域',
        labelWidth: '45px',
        props: {
          fieldName: 'area',
          options: []
        }
      }, {
        type: 'select',
        label: '照明状态',
        props: {
          fieldName: 'status',
          options: [{
            id: 1,
            name: '开启'
          }, {
            id: 2,
            name: '关闭'
          }]
        }
      }, {
        type: 'select',
        label: '控制策略',
        props: {
          fieldName: 'policy',
          options: this.$_useTypes(GROUP_POLICY_TYPE).options
        },
        hide: true
      }],
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      tableCols: [
        { label: '编号',
          prop: 'groupNo'
        },
        { label: '策略名称',
          prop: 'groupName',
          minWidth: '150px'
        },
        { label: '所属区域',
          prop: 'area',
          render: (h, scope) => {
            return (
              <div>{scope.row.area && scope.row.area.join(',')}</div>);
          }
        },
        { label: '管辖灯杆数量', prop: 'number', minWidth: '80px' },
        { label: '开关状态',
          prop: 'status',
          render: (h, scope) => {
            return this.getRadiosType(scope.row.status);
          }
        },
        {
          label: '生效日期',
          prop: 'data',
          minWidth: '180px',
          render: (h, scope) => {
            return ((scope.row.workTime && scope.row.closeTime) ? <div>{scope.row.workTime}至{scope.row.closeTime}</div> : null);
          }
        },
        { label: '控制策略',
          prop: 'policyStatusList',
          minWidth: '100px',
          render: (h, scope) => {
            let statusList = scope.row.policyStatusList && scope.row.policyStatusList.length > 0 && scope.row.policyStatusList.map(policy => {
              return this.$_useTypes(GROUP_POLICY_TYPE).types[policy]
            });
            return (
              <div>{statusList && statusList.join(',')}</div>);
          }
        },
        { label: '创建时间',
          prop: 'creatTime',
          minWidth: '120px'
        }
      ],
      selectsList: [],
      currentTitleList: [{
        name: 'illumination',
        title: '智慧照明'
      }, {
        name: 'illumination',
        title: '照明控制'
      }],
      editData: {},
      restaurants: []
    }
  },
  mounted () {
    this.$nextTick(async () => {
      this.editData = this.common['illumination'];
      this.restaurants = await this.loadAll();
      if (this.editData && this.editData.address) {
      }
      if (this.openPage === 'illumination') {
        await getGroupPolicy().then(res => {
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
        if (this.$route.query && this.$route.query.imei) {
          this.searchVal.imei = this.$route.query.imei;
          const finObj = this.restaurants.find(item => item.imei === this.$route.query.imei);
          this.searchVal.address = finObj.address;
        }
        this.getDataAllList();
      }
    })
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
  components: {
    headerTitle,
    searchForm,
    Flex,
    PageTable,
    pageMain,
    Detail,
    radioType
  },
  methods: {
    setBread (val) {
      if (val === 'illumination') {
        this.currentTitleList = [{
          name: 'illumination',
          title: '智慧照明'
        }];
      } else {
        this.currentTitleList = [{
          name: 'illumination',
          title: '智慧照明'
        }, {
          name: 'illuminationDetail',
          title: '控制策略'
        }];
      }
    },
    getSwitch (type) {
      return (
        <el-switch
          active-color="#2870FF"
          inactive-color="#1C376D">
        </el-switch>
      );
    },
    getRadiosType (type) {
      let div = <radioType type="3" />;
      switch (type) {
        case 1:
          div = <radioType type="1" />;
          break;
        case 2:
          div = <radioType type="3" />;
          break;
        default:
      }
      return div;
    },
    onSearch (val) {
      this.searchVal = {

        ...this.searchVal,
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
      policy(data).then(res => {
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
    onCurrentChange (val) {
      this.page.current = val;
      this.getDataAllList()
    },
    onPageSizeChange (val) {
      this.page.pageSize = val
      this.onCurrentChange(1)
    },
    onSelectionChange (args) {
      this.selectsList = args.map(arg => {
        return {
          ...arg,
          approveUserId: arg.id
        }
      });
    },
    handleDelBtnClick (row) {
      this.$confirm('此操作将永久删除该所组策略, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePolicy(row.id).then(res => {
          if (res.code === '200') {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              position: 'bottom-right'
            });
            this.onCurrentChange(this.page.current);
          }
        }).catch(() => {
        });
      });
    },
    showView (row) {
      console.log(row)
      let parames = {
        ...row,
        toName: 'illumination'
      };
      if (row) {
        parames.imei = row.imei ? row.imei : row.groupNo
      };
      routePush({
        title: '智慧照明详情',
        name: 'illuminationDetail',
        parames
      });
    },
    loadAll () {
      return getAllImei().then(res => {
        if (res.code === '200') {
          let dataList = [];
          res.data.map(data => {
            dataList.push({
              ...data
            })
          });
          return dataList;
        }
      });
    },
    querySearch (queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.address.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect (item) {
      this.searchVal.imei = item.imei;
      this.searchVal.address = item.address;
    }
  }
}
</script>

<style lang="less">
#illumination{
  .my-autocomplete {
    /deep/.el-autocomplete {
      height:30px;/*no*/
      .el-input-group__prepend{
        background: transparent;
        border: none;
        width: 80px;/*no*/
        height: 30px;/*no*/
        padding: 0;
        input{
          border-top-right-radius: 0 !important;
          border-bottom-right-radius: 0 !important;
        }
        .el-select{
          height: 100%;
          margin:0;
        }
      }
      input{
        font-size:12px;/*no*/
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:#d9d9d9;
        // background:rgba(34,44,81,0.5);
        border-radius:4px;/*no*/
        // border:1px solid rgba(98,117,191,1);
      }
      >input{
        width: 250px;/*no*/
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
      }
    }
    li {
      line-height: normal;
      padding: 7px;

      .name {
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .addr {
        font-size: 12px;
        color: #b4b4b4;
      }

      .highlighted .addr {
        color: #ddd;
      }
    }
  }
}
</style>
