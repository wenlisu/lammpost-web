/* eslint-disable camelcase */
<template>
  <pageMain idName='commonTemplate' :breadShow="false">
      <!-- 业务执行管理 -->
      <header-title
        icon="iconfont icon-shouye"
        title="业务执行管理"
      >
        <search-form
          slot="searchBox"
          :searchItems="searchItems"
          @onSearch="onSearch"
          :addBtnVisible="true || $_hasOperation($options.name,'add')"
          @on-addBtn="showView('detail', {});"
        />
      </header-title>

      <div class="content-view">
        <div class="Modeltable">
          <page-table
            ref="pageTable"
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
            highlightCurrentRow
          >
            <template
              slot-scope="scope"
              slot="operator"
            >
            <flex>
              <el-button
                type="text"
                size="small"
                title="详情"
                :style="{marginRight: '10px'}"
                @click.prevent.stop="showView('detail', {
                  ...scope.row
                })"
                v-if="true || $_hasOperation($options.name,'detail')">
                <i class="iconfont icon-xiangqing" style="fontSize: 20px; color: #2EDEF4"/>
              </el-button>
              <el-button
                type="text"
                size="small"
                title="选用"
                :style="{marginRight: '10px'}"
                @click.prevent.stop="showView('action', {
                  ...scope.row
                })"
                v-if="true || ($_hasOperation($options.name,'edit'))">
                <i class="iconfont icon-xingzhuangjiehe3" style="fontSize: 20px; color: #2EDEF4"/>
              </el-button>
                <el-button
                type="text"
                size="small"
                title="删除"
                @click.prevent.stop="showView('delete', {
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
      <Detail :show="editShow" :data="editData" @cancel="closeEdit" />
  </pageMain>
</template>

<script>
import {
  mapGetters
} from 'vuex';
import pageMain from 'components/pageMain';
import headerTitle from 'components/headerTitle/headerTitle'
import searchForm from 'components/searchForm/searchForm';
import PageTable from '@/components/page-table';
import Flex from '@/components/flex';
import Detail from './Detail';
import { COMMON_TEMPLATE_SERVICE_TYPE } from '@/util/constants';
import {
  getTemplate,
  deleteTemplate,
  selectTemplate
} from 'api/controlStrategy';
export default {
  name: 'commonTemplate',
  data () {
    const { types } = this.$_useTypes(COMMON_TEMPLATE_SERVICE_TYPE);
    return {
      searchVal: {},
      searchItems: [{
        type: 'input',
        label: '标题',
        labelWidth: '45px',
        props: {
          fieldName: 'templateName'
        }
      }],
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      tableCols: [
        { label: '标题', prop: 'templateName' },
        { label: '关键词',
          prop: 'keyWord',
          render: (h, scope) => {
            const str = scope.row.keyWord.map(key => {
              return key.split('：')[0];
            }).join(',');
            return <div>{str}</div>;
          }
        },
        { label: '服务类型',
          prop: 'serviceType',
          render: (h, scope) => {
            return <div>{types[scope.row.serviceType]}</div>;
          }
        }
      ],
      editShow: false,
      editData: {}
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getDataAllList(1, 10)
    })
  },
  computed: {
    ...mapGetters(['common', 'openPage']),
    routeName () {
      return this.$route.name
    }
  },
  components: {
    headerTitle,
    searchForm,
    PageTable,
    Detail,
    pageMain,
    Flex
  },
  methods: {
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
      getTemplate(data).then(res => {
        if (res.code === '200') {
          const {
            data,
            total
          } = res.data;
          this.page.total = total;
          this.tableData = data;
        }
      });
    },
    onCurrentChange (val) {
      this.page.current = val;
      this.getDataAllList()
    },
    onPageSizeChange (val) {
      this.page.pageSize = val
      this.onCurrentChange(1)
    },
    showView (type, row) {
      switch (type) {
        case 'detail':
          this.editShow = true;
          this.editData = row;
          break;
        case 'action':
          selectTemplate({id: row.id, imei: null}).then(res => {
            if (res.code === '200') {
              this.$emit('select', {id: row.id, ...res.data});
            }
          });
          break;
        case 'delete':
          this.$confirm('此操作将永久删除该所选模板, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deleteTemplate(row.id).then(res => {
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
          });
          break;
        default:
      }
    },
    closeEdit (type) {
      this.editShow = false;
      this.etidData = {};
      if (type === 'cancel') {
        this.getDataAllList();
      }
    },
    selectCurrentRow (id) {
      this.$refs.pageTable.onSetCurrentRow(id)
    }
  }
}
</script>

<style lang="less">
#commonTemplate{}
</style>
