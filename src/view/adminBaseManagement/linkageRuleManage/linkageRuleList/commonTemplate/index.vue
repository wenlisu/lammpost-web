/* eslint-disable camelcase */
<template>
  <div id='linkCommonTemplate'>
      <!-- 业务执行管理 -->
      <header-title
        icon="iconfont icon-shouye"
        title="业务执行管理"
      >
        <search-form
          slot="searchBox"
          :searchItems="searchItems"
          @onSearch="onSearch"
          :otherBtnVisible="true || $_hasOperation($options.name,'add')"
          :otherBtnLists="[{
            label: '新增LED',
            click: () => showView('detail', {templateTypeName: 'LED屏'})
          }, {
            label: '新增广播',
            click: () => showBroadcast()
          }, {
            label: '新增文字',
            click: () => showText()
          }]"
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
                v-if="(openPage !== 'linkageCommonTemplate') || ($_hasOperation($options.name,'edit'))">
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
      <Detail :show="editShow" :data="editData" @cancel="closeEdit" v-if="templateType === 'text'"/>
      <ProgramDetail :show="editShow" :data="editData" @cancel="closeEdit" v-if="templateType === 'led'"/>
      <BrocastDetail :show="editShow" :data="editData" @cancel="closeEdit" v-if="templateType === 'broadcast'"/>
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
// import Detail from '@/view/adminScreen/screenManagement/commonTemplate/Detail';
import Detail from './Detail';
import ProgramDetail from './programDetail';
import BrocastDetail from './brocastDetail';
import { COMMON_TEMPLATE_SERVICE_TYPE, COMMON_TEMPLATE_RECTTYPE_TYPE } from '@/util/constants';
import {
  getTemplate,
  deleteTemplate,
  deletTextTemplate,
  removeAudioTemplate,
  selectTemplate
} from 'api/controlStrategy';
import {
  getScreenTemplate,
  selectLedProgramDetail,
  deleteNewTemplate
} from 'api/screen';
import {
  getTaskTemplatePage
} from 'api/smokeDetectorMap';

export default {
  name: 'linkCommonTemplate',
  data () {
    return {
      templateType: undefined,
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
        { label: '节目名称', prop: 'templateName' },
        { label: '模板类型',
          prop: 'templateTypeName'
        },
        { label: '媒体类型',
          prop: 'mediaType'
        }, {
          label: '创建时间',
          prop: 'createTime'
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
    deviceType: ''
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
    Flex,
    ProgramDetail,
    BrocastDetail
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
          templateTypeCode: this.deviceType,
          ...this.searchVal
        },
        pageNo: Number(this.page.current), // 查询的分页页码
        pageSize: Number(this.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: ''
      }
      getTaskTemplatePage(data).then(res => {
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
          if (row.templateTypeName === 'LED屏') {
            this.templateType = 'led';
            selectLedProgramDetail(row.templateCode).then(res => {
              if (res.code === '200') {
                this.editShow = true;
                this.editData = res.data || {};
              }
            });
          } else if (row.templateTypeName === '文字') {
            this.templateType = 'text';
            selectTemplate({id: row.templateCode}).then(res => {
              if (res.code === '200') {
                this.editShow = true;
                this.editData = res.data || {};
              }
            });
          } else {
            this.showBroadcast();
            this.editData = { ...row };
          }
          break;
        case 'action':
          if (this.keyType === 'screen') {
            selectLedProgramDetail(row.templateCode).then(res => {
              if (res.code === '200') {
                this.$emit('select', {...res.data});
              }
            });
          } else {
            this.$emit('select', { ...row });
            // selectTemplate({id: row.id, imei: null}).then(res => {
            //   if (res.code === '200') {
            //     this.$emit('select', {id: row.id, ...res.data});
            //   }
            // });
          }
          break;
        case 'delete':
          let deleteApiMethod = '';
          let deleteParames = null;
          deleteParames = row.templateCode;
          this.$confirm('此操作将永久删除该所选模板, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (row.templateTypeName === 'LED屏') {
              deleteApiMethod = deleteTemplate;
            } else if (row.templateTypeName === '文字') {
              deleteApiMethod = deletTextTemplate;
            } else {
              deleteApiMethod = removeAudioTemplate;
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
    showBroadcast () {
      this.templateType = 'broadcast';
      this.editData = {};
      setTimeout(() => {
        this.editShow = true;
      }, 500);
    },
    showText () {
      this.templateType = 'text';
      setTimeout(() => {
        this.editShow = true;
      }, 500);
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
#linkCommonTemplate{
  .btnList{
    padding: 0 !important;
  }
}
</style>
