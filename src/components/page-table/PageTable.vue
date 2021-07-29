
<template>
  <div class="comp-page-table">
    <el-table
      ref="pageTable"
      v-loading="loading"
      :data="data"
      :element-loading-text="loadingText"
      :row-key="rowKey"
      :height="tableHeight"
      tooltip-effect="light"
      :empty-text="emptyText"
      v-bind="$attrs"
      @current-change="handleCurrentChange"
      @selection-change="onSelectionChange"
      header-row-class-name="header"
      :highlight-current-row="highlightCurrentRow"
      row-class-name="row"
      :border="border"
    >
      <el-table-column
        v-if="selection"
        :align="colAlign"
        type="selection"
        width="35"
        :selectable="selectable"
        label-class-name="selectionLabel"
        class-name="selectionLabel"
        :reserve-selection="reserveSelection"
      />
      <el-table-column
        v-if="data.length > 0 && !hideDefaultIndex"
        label="序号"
        type="index"
        width="60"
        label-class-name="indexLabel"
        :align="colAlign"
      />
      <el-table-column
        v-for="(col, index) in cols"
        :key="`col-${index}`"
        :label="col.label"
        :prop="col.prop"
        :align="col.align || colAlign"
        :fixed="col.fixed || false"
        :width="col.width"
        :min-width="col.minWidth || 80"
        :show-overflow-tooltip="showOverflowTooltip"
        :sortable="col.sortable || false"
        :sort-method="(a, b) => {
          if(col.sortable) {
            return +a[col.prop] > +b[col.prop] ? -1 : 1
          }
          return false
        }"
      >
        <template slot="header" slot-scope="{ column }">
          {{column.label}}<span class="after"/>
        </template>
        <template slot-scope="scope">
          <span v-if="!col.render && !col.custom">{{ getDataName(scope.row, col) }}</span>
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
        :label="operatorText"
        label-class-name="operatorLabel"
        class-name="operatorLabel"
        :width="operatorWidth"
        :align="colAlign"
      >
        <template slot-scope="scope">
          <div class="flexCenter">
            <slot
              name="operator"
              :row="scope.row"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div :style="pageWrapperStyle" v-if="showPage">
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
      default: 'sizes, prev, pager, next, jumper'
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
    operatorText: {
      type: String,
      default: '操作'
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
      type: Function,
      default: () => {
        return true
      }
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
    highlightCurrentRow: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: true
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
        padding: '20px 0'
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
    handleCurrentChange (val) {
      this.$emit('handle-current-change', val)
    },
    onPageSizeChange (val) {
      this.$emit('size-change', val);
    },
    onCurrentChange (val) {
      this.$emit('current-change', val);
    },
    onSelectionChange (args) {
      this.$emit('selection-change', args);
    },
    getDataName (scope, items) {
      return scope[items.prop]
    },
    onRowChange (rowItems, idx = 'id', bool = true) {
      rowItems.map(row => {
        const id = row[idx];
        const index = this.data.findIndex(data => data.id == id);
        if (index > -1) {
          this.$refs.pageTable.toggleRowSelection(this.data[index], bool);
        }
      });
    },
    onSetCurrentRow (id) {
      const index = this.data.findIndex(data => data.id == id);
      this.$refs.pageTable.setCurrentRow(this.data[index]);
    }
  }
};
</script>

<style lang="less">
.comp-page-table{
  background:rgba(32,45,85, 0.49);
  border-radius:4px;
  padding: 10px 30px 0;
  .el-table{
    border: none;
    background: transparent;
    &::after {
      content: none;
    }
    &::before, >div::before{
      content: none;
    }
    .el-table__empty-block{
      span{
        font-size: 12px;/*no*/
        color: #fff
      }
    }
    .header{
      background: transparent;
      th, .operatorLabel, .indexLabel, .selectionLabel{
        height: 55px;
        line-height: 55px;
        background: transparent;
        font-size:14px;
        font-family:PingFangSC-Semibold,PingFang SC;
        font-weight:600;
        color:rgba(0,139,234,1);
        border-bottom: none;
        border-color: transparent;
        .after{
          width: 1px;/*no*/
          position: absolute;
          background: transparent;
          right: 0;
          top: 0;
          bottom: 0;
          &:hover{
            background: #D9D9D9;
          }
        }
        .caret-wrapper{
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      .selectionLabel{
        .el-checkbox__inner{
          background: transparent;
          border-radius:4px;
          border:1px solid rgba(0,136,230,1);
        }
      }
    }
    .row{
      background: transparent;
      border-bottom:1px solid #3F4C70;/*no*/
      td, .operatorLabel, .indexLabel, .selectionLabel{
        height: 55px;
        border: none;
        border-bottom:1px solid #3F4C70;/*no*/
        background: transparent;
        font-size:12px;/*no*/
        font-family:PingFangSC-Semibold,PingFang SC;
        font-weight:600;
        color:rgba(255,255,255,1);
      }
      &:hover{
      background: transparent;
      td{
        background: transparent;
      }
      }
      /deep/.selectionLabel{
        .el-checkbox__inner{
          background: transparent;
          border-radius:4px;/*no*/
          border:1px solid rgba(137,137,137,1);/*no*/
        }
      }
      &.current-row {
        background: #3a5196;
      }
    }
    /deep/.el-table__body-wrapper {
      &::-webkit-scrollbar
        {
          width: 6px;
          height: 6px;
          background-color: transparent;
        }

      /*定义滚动条轨道 内阴影+圆角*/
      &::-webkit-scrollbar-track
      {
          -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
          border-radius: 10px;
          background-color: #324263;
      }

      /*定义滑块 内阴影+圆角*/
      &::-webkit-scrollbar-thumb
      {
          border-radius: 10px;
          -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
          background-color: #fff;
      }
    }
  }
  .pagination{
    ul{
      li{
        border: none;
        min-width: 24px;/*no*/
        height: 24px;/*no*/
        line-height: 22px !important;/*no*/
        background:rgba(50,66,99,1);
        border-radius:2px;/*no*/
        &.active{
          background:rgba(94,161,255,1) !important;
        }
      }
    }
    /deep/.btn-prev, .btn-next{
      border: none;
      width: 24px;/*no*/
      height: 24px;/*no*/
      background:rgba(50,66,99,1);
    }
    .el-pagination__jump, .el-pagination__sizes, .el-pagination__total{
      color: #919CB1;
      height: 24px;/*no*/
      line-height: 24px;/*no*/
      .el-input{
        height: 24px;/*no*/
        input{
          height: 24px !important;/*no*/
          background: transparent;
          border: 1px solid rgba(50,66,99,1);/*no*/
          color:rgba(145,156,177,1);
        }
      }
    }
    .el-pagination__jump, .el-pagination__sizes{
      line-height: 20px;
    }
  }
}
</style>
