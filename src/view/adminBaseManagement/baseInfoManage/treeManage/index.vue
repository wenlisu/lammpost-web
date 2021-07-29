<template>
  <div id="treeManage">
    <div class="accessSelect">
      <div class="info flexCloumn">
        <div class="flexRow infoInput">
          {{treeType === 'PARK' ? '社区园区' : '城市街道'}}组织树
        </div>
        <div class="infoTree">
          <el-tree
            class="filter-tree"
            :data="options"
            node-key="id"
            :props="defaultProps"
            :default-expand-all="treeExpandAll"
            :default-expanded-keys="treeExpandKeys"
            :load="loadNode"
            @node-click="nodeClick"
            highlight-current
            lazy
            ref="tree"
            :check-on-click-node="true"
            :auto-expand-parent="true"
            :current-node-key="currentNodeKey"
          >
          </el-tree>
        </div>
      </div>
    </div>
    <div class="flexCloumn timeMonitoringSelect">
      <header-title
        icon="iconfont icon-shouye"
        title="播控设备"
      >
        <search-form
          slot="searchBox"
          :searchItems="searchItems"
          @onSearch="onSearch"
          :addBtnVisible="true || $_hasOperation($options.name,'add')"
          addTitleBtn="新增节点"
          :addBtnDisabled="!currentNodeKey"
          @on-addBtn="showView();"
        />
      </header-title>
      <page-table
          col-align="center"
          operator-width="200"
          operator
          :selection="false"
          :data="tableData"
          :cols="tableCols"
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
          @current-change="onCurrentChange"
          @size-change="onPageSizeChange"
          :showPage="false"
        >
        <template
            slot-scope="scope"
            slot="operator"
          >
          <flex>
            <el-button
              type="text"
              icon="iconfont
              icon-xiugaii"
              title="绑定设备"
              @click="showEquipmentSelect('bind', {...scope.row})"
              v-if="true || $_hasOperation($options.name,'edit')">
            </el-button>
            <el-button
              type="text"
              icon="iconfont icon-jinyong"
              title="解绑设备"
              @click="showEquipmentSelect('dismiss', {...scope.row})"
              v-if="true || $_hasOperation($options.name,'edit')">
            </el-button>
            <el-button
              type="text"
              size="small"
              title="修改"
              :style="{marginRight: '10px'}"
              @click.prevent.stop="showView('edit', {
                ...scope.row
              })"
              v-if="true || $_hasOperation($options.name,'edit')">
              <i class="iconfont icon-bianji" style="fontSize: 20px; color: #2573f1"/>
            </el-button>
            <el-button
              type="text"
              size="small"
              title="详情"
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
                @click.prevent.stop="_deleteDeviceModuleTree({
                  ...scope.row
                })"
                v-if="true || ($_hasOperation($options.name,'edit'))">
                <i class="iconfont icon-shanchu" style="fontSize: 20px; color: #FF5736"/>
              </el-button>
          </flex>
        </template>
      </page-table>
    </div>
    <dialog-cont
      @on-cancel="dialogAddCancel"
      @on-confirm="dialogAddSubmit"
      :visible.sync="addDialog.show"
      width="550px"
      :title="addDialog.title"
      append-to-body
    >
      <FormItem
        ref="formItem"
        :formItems="formItems"
        :rules="formRules"
        :disabled="inputDisabled"
        :isEdit="isEdit"
        :form="form"
        :midway="midway"
        :labelWidth="'105px'"
        :key="Math.random()"
      >
        <template slot="parentNodeCode">
          <el-cascader
            :disabled="this.inputDisabled"
            v-model="form.parentNodeCode"
            :options="addDialog.options"
            :props="{ checkStrictly: true }"
            @change="handleParentChange"
            clearable></el-cascader>
        </template>
      </FormItem>
    </dialog-cont>
    <dialog-cont
      @on-cancel="dialogBindCancel"
      @on-confirm="dialogBindCancel"
      :visible.sync="equipment.show"
      width="1200px"
      :title="equipment.title"
      append-to-body
    >
      <bind :nodeData='equipment.nodeData' :key="Math.random()"/>
    </dialog-cont>
    <dialog-cont
      @on-cancel="dialogDisCancel"
      @on-confirm="dialogDisCancel"
      :visible.sync="dismiss.show"
      width="1200px"
      :title="dismiss.title"
      append-to-body
    >
      <dismiss :nodeData='dismiss.nodeData' :key="Math.random()"/>
    </dialog-cont>
  </div>
</template>
<script>
import {
  mapGetters
} from 'vuex';
import moment from 'moment';
import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect';
import Flex from '@/components/flex';
import headerTitle from 'components/adminHeaderTitle/headerTitle';
import searchForm from 'components/adminSearchForm/searchForm';
import card from 'view/lightPole/lightPoleStatistical/components/card';
import PageTable from '@/components/adminPage-table';
import dialogCont from '@/components/adminDialog';
import FormItem from '@/components/adminFormItem';
import bind from './components/index';
import dismiss from './components/dismiss';
import { routePush } from '@/util/util';
import {
  getParkDeviceTree,
  deleteDeviceModuleTree,
  editDeviceModuleTree,
  getDeviceModuleTree
} from 'api/index';
import {
  getDetailByID,
  setThresholdValue
} from 'api/admin';
import 'swiper/swiper-bundle.css';

const onlineStatusType = {
  1: '在线',
  2: '故障',
  3: '离线'
};

const alarmStatusType = {
  1: '报警',
  0: '在线'
};

const statusPandType = {
  正常: 'normal',
  离线: 'normal',
  故障: 'malfunction',
  报警: 'alarm'
};

export default {
  name: 'treeManage',
  components: {
    Treeselect,
    Flex,
    card,
    PageTable,
    headerTitle,
    searchForm,
    dialogCont,
    FormItem,
    bind,
    dismiss
  },
  props: {
    type: {
      type: String,
      default: 'default'
    },
    currentData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      equipment: {
        show: false,
        title: '设备绑定',
        nodeData: {}
      },
      dismiss: {
        show: false,
        title: '解绑设备',
        nodeData: {}
      },
      treeType: 'PARK',
      node: undefined,
      resolve: undefined,
      midway: true,
      isEdit: true,
      inputDisabled: false,
      isDetail: false,
      treeExpandAll: false,
      treeExpandKeys: [],
      currentNodeKey: undefined,
      options: [{
        id: 1,
        label: '一级 1',
        children: null
      }],
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'leaf'
      },
      searchItems: [{
        type: 'input',
        label: '节点名称',
        props: {
          fieldName: 'nodeName'
        }
      }],
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      tableCols: [
        { label: '节点名称',
          prop: 'nodeName'
        },
        { label: '节点顺序',
          prop: 'sort'
        },
        { label: '上级节点',
          prop: 'parentNodeName'
        },
        { label: '创建时间',
          prop: 'createDate'
        }
      ],
      addDialog: {
        show: false,
        item: null,
        title: '新增节点',
        options: []
      },
      form: {

      },
      formItems: [{
        label: '序号',
        prop: 'sort',
        inputType: 'input',
        required: false,
        span: 24
      }, {
        label: '节点名称',
        prop: 'nodeName',
        inputType: 'input',
        required: false,
        span: 24
      }, {
        label: '上级节点',
        prop: 'parentNodeCode',
        inputType: 'custom',
        required: false,
        span: 24
      }, {
        label: '备注',
        prop: 'remark',
        inputType: 'textarea',
        required: false,
        span: 24
      }],
      formRules: {},
      currentNodeData: {}
    };
  },
  watch: {
    '$route.query': {
      deep: true,
      handler (newValue) {
        if (!newValue.activeNumber) {
          this.clearnData();
        } else {
          this.initData();
        }
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.filterList = [{
        id: '',
        name: '全部状态'
      }];
      this.treeExpandAll = false;
      this.sping = false;
      this.initData();
    });
  },
  computed: {
    ...mapGetters(['common', 'openPage']),
    routeName () {
      return this.$route.name
    }
  },
  methods: {
    showEquipmentSelect (dialogType, row) {
      if(dialogType == 'dismiss') {
        this.dismiss.show = true;
        this.dismiss.title = '解绑设备'
        this.dismiss.nodeData = {
          parkTreeCode: row.nodeCode,
          bindParkTree: 1,
          row: row
        };
      } else {
        this.equipment.show = true;
        this.equipment.title = '绑定设备'
        this.equipment.nodeData = {
          bindParkTree: 0,
          row: row
        };
      }
    },
    dialogBindCancel () {
      this.equipment.show = false;
      this.equipment.nodeData = {}
    },
    dialogDisCancel () {
      this.dismiss.show = false;
      this.dismiss.nodeData = {}
    },
    dialogAddCancel () {
      this.addDialog.show = false;
      this.$refs.formItem.resetForm();
      this.inputDisabled = false;
      this.isEdit = true;
      this.form = {};
      this.addDialog.item = null;
    },
    async dialogAddSubmit () {
      const formData = await this.$refs.formItem.getValue();
      let parentNodeCode = '';
      if(typeof formData.parentNodeCode == 'string') {
        parentNodeCode = formData.parentNodeCode;
      } else {
        parentNodeCode = formData.parentNodeCode[formData.parentNodeCode.length - 1];
      }
      const parames = {
        ...formData,
        sort: Number(formData.sort),
        parentNodeCode,
        treeType: this.treeType
      };
      editDeviceModuleTree(parames).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '设置成功',
            type: 'success',
            position: 'bottom-right'
          });
          this.dialogAddCancel();
          this.refreshData(this.currentNodeData);
          this.nodeClick(this.currentNodeData);
        }
      })
    },
    _deleteDeviceModuleTree (row) {
      let parames = [row.nodeCode]
      deleteDeviceModuleTree(parames).then(res => {
        if(res.code === '200') {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            position: 'bottom-right'
          })
          this.refreshData(this.currentNodeData);
          this.nodeClick(this.currentNodeData);
        }
      })
    },
    clearnData () {
      this.treeExpandAll = false;
      this.monitorId = '';
      this.currentNodeKey = '';
    },
    initData () {
    },
    async loadNode (node, resolve) {
      // 加载数据的方法里把node，reslove存起来
      // this.node = node;
      // this.resolve = resolve;
      // this.node.childNodes = [];
      console.log('node', node)
      if (node.level === 0) {
        const treeData = await this._getParkDeviceTree({
          parentNodeCode: '0',
          treeType: this.treeType
        }, {data: {optionsData: []}}, {parentData: []}, resolve);
        setTimeout(() => {
          this.treeExpandKeys = [treeData[0].nodeCode];
          this.$refs.tree.setCheckedKeys([treeData[0].nodeCode]);
        }, 500);
      }
      if (node.level > 0) {
        const nodeData = node.data;
        const treeData = await this._getParkDeviceTree({
          parentNodeCode: nodeData.nodeCode,
          treeType: this.treeType
        }, node, node.parent.data, resolve);
      }
    },
    // 当前点击的节点 当前点击节点的父节点id || 当前节点id, 当前点击节点的父节点数据, 当前点击节点下的所有子节点
    async mergeOption (nodeList, id, parentData, optionsData) {
      const list = nodeList.data ? nodeList.data.optionsData : nodeList.children;
      let listData = [];
      if (!list[0].children) {
        await list.map(pd => {
          if (pd.value === id) {
            listData = [{ ...pd, children: optionsData }];
          }
        });
      } else {
        await list.map(async pd => {
          let listd = pd;
          if ((parentData.parentData && parentData.parentData.length > 1) || nodeList.level === 4) {
            listd.children = await this.mergeOption(pd, id, parentData, nodeList.data.currentOptionsData);
          }
          if (nodeList.isLeaf) {
            listd.children = nodeList.data.currentOptionsData;
          }
          listData.push(listd);
        });
      }
      return listData;
    },
    /**
     * parentData: 当前展开的节点
     * parentOptionData: 当前展开节点的父节点数据
     */
    async _getParkDeviceTree (data, parentData, parentOptionData, resolve) {
      console.log(parentData, parentOptionData)
      let treeData = [];
      let parentOptionsData = [];
      await getParkDeviceTree(data).then(async res => {
        if (res.code === '200') {
          const optionsData = res.data.map(daItem => {
            return {
              value: daItem['nodeCode'],
              label: daItem['nodeName'],
              level: daItem['sort']
            }
          });
          // 当前层级的所有节点
          parentOptionsData = optionsData;
          if (parentData.data.optionsData.length !== 0) {
            // 
            parentOptionsData = await this.mergeOption(parentData, parentOptionData.id || parentData.data.id, parentOptionData, optionsData);
          }
          treeData = res.data.map(daItem => {
            const optionsParames = JSON.parse(JSON.stringify(parentOptionsData));
            return {
              id: daItem['nodeCode'],
              label: daItem['nodeName'],
              ...daItem,
              currentOptionsData: optionsData,
              parentData: optionsData,
              optionsData: optionsParames,
              children: null
            }
          });
          resolve(treeData);
          console.log('options',treeData)
        }
      });
      return treeData;
    },
    nodeClick (data) {
      console.log(data)
      this.currentNodeData = data;
      this.monitorId = data.type;
      this.currentNodeKey = data.id;
      this.addDialog.options = data.optionsData;
      const parames = {
        treeType: data.treeType,
        parentNodeCode: data.nodeCode
      };
      getDeviceModuleTree(parames).then(res => {
        if (res.code === '200') {
          this.tableData = res.data;
        }
      })
    },
    showView (type, item) {
      this.addDialog.show = true;
      if (type === 'detail') {
        this.isEdit = false;
        this.inputDisabled = true;
        this.addDialog.title = '查看节点'
      } else if(type === 'edit'){
        this.isEdit = true;
        this.inputDisabled = false;
        this.addDialog.title = '编辑节点'
      } else {
        this.isEdit = true;
        this.inputDisabled = false;
        this.addDialog.title = '新增节点'
      }
      console.log('item:',item)
      this.form = {
        ...item
      };
    },
    handleParentChange (item) {
      console.log('item', item);
    },
    onSearch (val) {
      this.searchVal = {
        ...val
      };
    },
    onAlarmListSearch (val) {
      this.alarmList.searchVal = {
        ...val,
        timeBegin: val.time && val.time[0],
        timeEnd: val.time && val.time[1]
      };
      delete this.alarmList.searchVal.time;
      this.onAlarmListCurrentChange(1);
    },
    _getSmokeDetectorAlarmForPage () {
      let parames = {
        data: {
          ...this.alarmList.searchVal
        },
        pageNo: Number(this.alarmList.page.current), // 查询的分页页码
        pageSize: Number(this.alarmList.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: ''
      };
      // getSmokeDetectorAlarmForPage(parames).then(res => {
      //   if (res.code === '200') {
      //     const {
      //       data,
      //       total
      //     } = res.data;
      //     this.alarmList.page.total = total;
      //     this.alarmList.tableData = data;
      //   }
      // });
    },
    onAlarmListCurrentChange (current) {
      this.alarmList.page.current = current;
      this._getSmokeDetectorAlarmForPage();
    },
    onAlarmListPageSizeChange (val) {
      this.alarmList.page.pageSize = val
      this.onAlarmListCurrentChange(1);
    },
    onAlarmListSelectionChange () {

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
    refreshData (id) {
      const node = this.$refs.tree.getNode(id)
      node.loaded = false
      // 主动调用展开节点方法，重新查询该节点下的所有子节点
      node.expand()
    }
  }
};
</script>
<style lang="less">
#treeManage{
  display: flex;
  flex-direction: row;
  .accessSelect{
    flex: 2;
    height: 100%;
    padding-right: 10px;/*no*/
    .info{
      height: 100%;
      background: #fff;
      .infoInput{
        padding: 10px 10px;/*no*/
        border-bottom: 1px solid rgba(238,238,238,1);/*no*/
        font-size: 14px;/*no*/
        font-weight: bold;
      }
      .infoTree{
        height: calc(100% - 61px);/*no*/
        padding-bottom: 20px;/*no*/
        .el-tree{
          height: 100%;
          overflow: auto;
          .el-tree-node__label{
            font-size: 12px;/*no*/
          }
          .el-tree-node__children{
            .is-expanded{
              .area{
                color: #2573F2 !important;
                font-weight: 600 !important;
                .building, .floor {
                  color: #2573F2 !important;
                }
              }
              .is-expanded{
                .building {
                  color: #2573F2 !important;
                  font-weight: 600 !important;
                }
                .is-expanded{
                  .floor {
                    color: #2574f2af !important;
                  }
                  .is-checked{
                    .device{
                      color: #2573F2 !important;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .timeMonitoringSelect{
    flex: 8;
  }
}

  @media (max-width: 1200px) {
    .swiper-button-next {
      right: 20px;
      transform: rotate(90deg);
    }

    .swiper-button-prev {
      left: 20px;
      transform: rotate(90deg);
    }
  }
</style>

