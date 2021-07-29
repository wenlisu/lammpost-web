/* eslint-disable camelcase */
<template>
  <div id='timeScreenCommonTemplate'>
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
          @on-addBtn="showView('add', {});"
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
                v-if="(openPage === 'timeScreenCommonTemplate') || $_hasOperation($options.name,'detail')">
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
                v-if="(openPage !== 'timeScreenCommonTemplate') || ($_hasOperation($options.name,'edit'))">
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
      <Detail :show="editShow" :data="editData" @cancel="closeEdit" v-if="keyType !== 'screen'"/>
      <ProgramDetail :show="editShow" :data="editData" @cancel="closeEdit" v-if="keyType === 'screen'"/>
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
import Detail from './Detail';
import ProgramDetail from './programDetail';
import { COMMON_TEMPLATE_SERVICE_TYPE, COMMON_TEMPLATE_RECTTYPE_TYPE } from '@/util/constants';
import {
  getTemplate,
  deleteTemplate,
  selectTemplate
} from 'api/controlStrategy';
import {
  getScreenTemplate,
  selectLedProgramDetail,
  deleteNewTemplate
} from 'api/screen';
export default {
  name: 'timeScreenCommonTemplate',
  data () {
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
      screenSearchItems: [{
        type: 'input',
        label: '节目名称',
        labelWidth: '60px',
        props: {
          fieldName: 'programName'
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
            const { types } = this.$_useTypes(COMMON_TEMPLATE_SERVICE_TYPE);
            return <div>{types[scope.row.serviceType]}</div>;
          }
        }
      ],
      screenCols: [
        { label: '节目名称', prop: 'programName' },
        { label: '分屏模式',
          prop: 'sepMode',
          render: (h, scope) => {
            const { types } = this.$_useTypes(COMMON_TEMPLATE_RECTTYPE_TYPE);
            return <div>{types[scope.row.programRectType]}</div>
          }
        },
        { label: '媒体类型',
          prop: 'programMediaType'
        },
        { label: '创建时间',
          prop: 'programCreateTime',
          minWidth: '120px'
        }
      ],
      apiMethod: getTemplate,
      editShow: false,
      editData: {}
    }
  },
  props: {
    keyType: {
      type: String,
      default: 'screen'
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.keyType === 'screen') {
        this.tableCols = this.screenCols;
        this.apiMethod = getScreenTemplate;
        this.searchItems = this.screenSearchItems;
      };
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
    Flex,
    ProgramDetail
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
      getScreenTemplate(data).then(res => {
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
        case 'add':
          this.editShow = true;
          this.editData = {};
          break;
        case 'detail':
          if (this.keyType === 'screen') {
            selectLedProgramDetail(row.programCode).then(res => {
              if (res.code === '200') {
                this.editShow = true;
                this.editData = res.data;
              }
            });
          } else {
            selectTemplate({id: row.id, imei: null}).then(res => {
              if (res.code === '200') {
                this.editShow = true;
                this.editData = res.data;
              }
            });
          }
          break;
        case 'action':
          if (this.keyType === 'screen') {
            selectLedProgramDetail(row.programCode).then(res => {
              if (res.code === '200') {
                this.$emit('select', {...res.data});
              }
            });
          } else {
            selectTemplate({id: row.id, imei: null}).then(res => {
              if (res.code === '200') {
                this.$emit('select', {id: row.id, ...res.data});
              }
            });
          }
          break;
        case 'delete':
          let deleteApiMethod = '';
          let deleteParames = null;
          this.$confirm('此操作将永久删除该所选模板, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.keyType === 'screen') {
              deleteApiMethod = deleteNewTemplate;
              deleteParames = row.programCode;
            } else {
              deleteApiMethod = deleteTemplate;
              deleteParames = row.id;
            }
            deleteApiMethod(deleteParames).then(res => {
              if (res.code === '200') {
                this.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success',
                  position: 'bottom-right'
                });
                this.onCurrentChange(this.page.current);
              }
            });
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
#timeScreenCommonTemplate{}
</style>
