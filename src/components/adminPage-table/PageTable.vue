
<template>
  <div class="adminComp-page-table">
    <el-table
      :key="key"
      ref="pageTable"
      v-loading="loading"
      :data="data"
      :element-loading-text="loadingText"
      :row-key="rowKey"
      :height="tableHeight"
      tooltip-effect="light"
      :empty-text="emptyText"
      v-bind="$attrs"
      :highlight-current-row="highlightCurrentRow"
      :row-class-name="tableRowClassName"
      @selection-change="onSelectionChange"
      @current-change="onRowCurrentChange"
      @select="onSelect"
      @select-all="selectAll"
      :border="border"
      :load="load"
      :lazy="lazy"
      :tree-props="treeProps">
    >
      <el-table-column
        v-if="selection"
        align="left"
        type="selection"
        width="50"
        fixed="left"
        :selectable="selectable"
        :reserve-selection="reserveSelection"
      />
      <el-table-column
        v-if="expand"
        type="expand"
        fixed="left"
        :align="'left'"
      >
        <template slot-scope="scope">
          <div>
            <slot
              name="expand"
              :row="scope.row"
              :index="scope.$index"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="data.length > 0 && !hideDefaultIndex"
        label="序号"
        type="index"
        width="60"
        fixed="left"
        :align="'left'"
      >
       <template slot-scope="scope" >
          <span v-if="sortByBack">{{scope._self.data.length - scope.$index}}</span>
          <span v-else>{{scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(col, index) in cols"
        :key="`col-${index}`"
        :label="col.label"
        :prop="col.prop"
        :align="'left'"
        :fixed="col.fixed || false"
        :width="col.width"
        :min-width="col.minWidth || 80"
        :show-overflow-tooltip="showOverflowTooltip"
      >
        <template slot-scope="scope">
          <span v-if="!col.render && !col.custom">{{ getDataName(scope.row, col) }}</span>
          <span v-if="col.label === '报警范围'">{{ '[' + scope.row.alarmMinValue + '~' +  scope.row.alarmMaxValue + ']' }}</span>
          <slot
            :name="col.prop"
            :row="scope.row"
          />
          <lb-render :scope="scope"
            :render="col.render"
            v-if="col.render"
            >
          </lb-render>
        </template>
      </el-table-column>
      <el-table-column
        v-if="operator"
        label="操作"
        :width="operatorWidth"
        :align="'left'"
      >
        <template slot-scope="scope">
          <div class="operator">
            <slot
              name="operator"
              :row="scope.row"
              :index="scope.$index"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div :style="pageWrapperStyle" v-if="showPage" class="bg-f">
      <el-pagination
        class="pagination"
        background
        :layout="pageLayout"
        :pager-count="5"
        :current-page="pageCurrent"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        :total="total"
        @current-change="onCurrentChange"
        @size-change="onPageSizeChange"
      />
    </div>
  </div>
</template>

<script>
import LbRender from './lb-render'
/* eslint-disable vue/require-default-prop */
export default {
  name: 'PageTable',
  data () {
    return {
      key: Math.random()
    }
  },
  props: {
    data: {
      type: Array,
      default () {
        return [];
      }
    },
    cols: {
      type: Array,
      default () {
        return [];
        // e.g
        // [{
        //  label: '标题',
        //  prop: '字段名',
        //  minWidth: '100'
        // }]
      }
    },
    /** 每列文字的对齐方式 */
    colAlign: {
      type: String,
      default: 'left'
    },
    /** 当前分页页码 */
    pageCurrent: {
      type: Number,
      default: 1
    },
    /** 数据总量 */
    total: {
      type: Number,
      default: 0
    },
    /** 每页的数据数量 */
    pageSize: {
      type: Number,
      default: 10
    },
    /** 可选的每页数量 */
    pageSizes: {
      type: Array,
      default () {
        return [10, 20, 30, 40, 50, 100];
      }
    },
    /** 分页组件显示的子组件 */
    pageLayout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    /** 分页组件在页面中的对齐方式 */
    pageAlign: {
      type: String,
      default: 'center'
    },
    /** 是否显示操作列 */
    operator: {
      type: Boolean,
      default: false
    },
    /** 操作列的宽度 */
    operatorWidth: {
      type: [String, Number],
      default: 80
    },
    /** 是否多选 */
    selection: {
      type: Boolean,
      default: false
    },
    /** 是否显示加载动画 */
    loading: {
      type: Boolean,
      default: false
    },
    /** 当内容过长被隐藏时显示 tooltip */
    showOverflowTooltip: {
      type: Boolean,
      default: true
    },
    rowKey: [String, Function],
    /** type=selection时, 数据更新之后保留之前选中的数据 */
    reserveSelection: {
      type: Boolean,
      default: false
    },
    // eslint-disable-next-line vue/require-default-prop
    tableHeight: {
      type: [String, Number]
    },
    /** 当前行是否可选 */
    selectable: {
      type: [Function, Boolean],
      default: null
    },
    hideDefaultIndex: {
      type: Boolean,
      default: false
    },
    loadingText: {
      type: String,
      default: '数据加载中...'
    },
    showPage: {
      type: Boolean,
      default: true
    },
    /** 列是否能拖拉 */
    border: {
      type: Boolean,
      default: true
    },
    highlightCurrentRow: {
      type: Boolean,
      default: false
    },
    expand: {
      type: Boolean,
      default: false
    },
    lazy: {
      type: Boolean,
      default: false
    },
    load: {
      type: Function,
      default: null
    },
    treeProps: {
      type: [Object, Array]
    },
    sortByBack: {
      type: Boolean,
      default: false
    },
    tableRowClassName: {
      type: Function
    }
  },
  components: {
    LbRender
  },
  watch: {
    data (val) {
      // console.log('data', val)
    }
  },
  computed: {
    pageWrapperStyle () {
      const { pageAlign } = this;
      const ALIGN = {
        left: 'flex-start',
        center: 'center',
        right: 'flex-end'
      };
      return {
        display: 'flex',
        justifyContent: ALIGN[pageAlign],
        padding: '10px 0 20px',
        backgroundColor: '#FFFFFF'
      };
    },
    emptyText () {
      return this.loading ? '' : '暂无数据';
    }
  },
  mounted () {
    this.$emit('mounted', this.$refs.pageTable);
  },
  methods: {
    onPageSizeChange (val) {
      this.$emit('size-change', val);
    },
    onCurrentChange (val) {
      this.$emit('current-change', val);
    },
    onSelectionChange (args) {
      this.$emit('selection-change', args);
    },
    onSelect(selection, row) {
      this.$emit('onSelect',{selection, row})
    },
    selectAll(selection) {
      this.$emit('selectAll', selection)
    },
    onRowCurrentChange (val) {
      this.$emit('row-current-change', val);
    },
    onRowChange (rowItems, idx = 'id', bool = true) {
      console.log('111',rowItems,idx,this.data)
      rowItems.map(row => {
        const id = row[idx];
        const index = this.data.findIndex(data => data[idx] == id);
        console.log(id)
        console.log(index)
        if (index > -1) {
          this.$refs.pageTable.toggleRowSelection(this.data[index], bool);
        }
      });
    },
    onSetCurrentRow (id, idx = 'id') {
      const index = this.data.findIndex(data => data[idx] == id);
      this.$refs.pageTable.setCurrentRow(this.data[index]);
    },
    getDataName (scope, items) {
      return scope[items.prop]
    },
    toggleAllSelection () {
      this.$refs.pageTable.toggleAllSelection()
    },
    getPageTable () {
      this.$refs.pageTable.clearSelection();
      this.$refs.pageTable.setCurrentRow();
    },
    updateTable () {
      this.key = Math.random();
    }
  }
};
</script>

<style lang="less" scoped>
.adminComp-page-table{
  /deep/.el-table{
    border: none;
    &::after{
      content: none;
    }
    .el-table__header-wrapper{
      .el-table__header{
        width: 100% !important;
        border: none;
      }
    }
    tr{
      background-color: transparent;
      th{
        background: #F4F5FA;
        border-bottom: none;
        border-color: #D2D7F2;
        line-height: normal;
        font-size: 12px;/*no*/
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #434343;
        &:nth-last-of-type(2){
          border-right: none;
        }
      }
    }
    .operator{
      button{
        i{
          font-size: 18px;/*no*/
        }
      }
    }
  }
  .bg-f{
    background: #fff;
  }
  .flex-center {
    display: flex;
    justify-content: center;
  }
  /deep/ .el-button {
    margin-right: 10px;/*no*/
  }
}
</style>
