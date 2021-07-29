<template>
  <div class="resTableCont">
    <section>
      <el-table :data="modeTableData" class="hidden-tbody">
        <el-table-column prop="alarmPicURL" label="告警图片"></el-table-column>
        <el-table-column prop="cameraName" label="设备名"></el-table-column>
        <el-table-column
          prop="alarmTypeName"
          label="告警类型"
        ></el-table-column>
        <el-table-column prop="alarmTime" label="告警时间"></el-table-column>
      </el-table>

      <vueSeamlessScroll
        :data="modeTableData"
        :class-option="defaultOption"
        class="auto-scorll-table"
      >
        <el-table
          :data="modeTableData"
          :row-class-name="tableRowClassName"
          class="hidden-thead"
        >
          <el-table-column prop="alarmPicURL" label="告警图片">
            <template slot-scope="scope">
              <img
                v-if="scope.row.alarmPicURL"
                :src="scope.row.alarmPicURL"
                alt=""
              />
            </template>
          </el-table-column>
          <el-table-column prop="cameraName" label="设备名"></el-table-column>
          <el-table-column
            prop="alarmTypeName"
            label="告警类型"
          ></el-table-column>
          <el-table-column prop="alarmTime" label="告警时间"></el-table-column>
        </el-table>
      </vueSeamlessScroll>
    </section>
  </div>
</template>
<script>
import vueSeamlessScroll from "vue-seamless-scroll";
// import { cameraAlarmList } from "@/api/screen/newIndex";
import { getLocal } from "util/tool";
export default {
  components: {
    vueSeamlessScroll
  },
  props: {
    id: ""
  },
  watch: {
    id() {}
  },
  filters: {
    formatRate(value) {
      if (!value) return 0;
      return parseFloat(value);
    }
  },
  computed: {
    defaultOption() {
      return {
        step: 0.5, // 数值越大速度滚动越快
        limitMoveNum: 5, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 2000 // 单步运动停止的时间(默认值1000ms)
      };
    }
  },
  data() {
    return {
      modeTableData: [], //表格数据
      page: {
        pageNo: 1, // 当前所在页数
        total: 0, // 一共多少条
        totalPageNo: 1, // 一共多少页
        pageSize: 100 // 每页显示条数
      },
      searchVal: {
        id: 50
      }
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    this.$nextTick(() => {});
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return "warning-row";
      } else {
        return "success-row";
      }
      return "";
    },
    // 分页切换页面
    handleCurrentChange(val) {
      this.page.pageNo = val;
      this.getList();
    },
    // 表格列表
    getList() {
      this.modeTableData = getLocal("bigScreenNew")["cameraAlarmList"]["data"];
      /* let data = {
        data: {},
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        sorting: "string"
      };
      cameraAlarmList(data).then(res => {
        if (res.code == 200) {
          const data = res.data.data;
          this.modeTableData = data;
        }
      }); */
    }
  }
};
</script>
<style lang="less" scoped>
/deep/.hidden-thead {
  background: rgba(255, 255, 255, 0);
  color: #ffffff;
  &::before,
  tbody td:first-child::after {
    background: transparent;
  }
  th,
  tr {
    height: 50px;
  }
  tr,
  .has-gutter {
    tr {
      background: #01274f;
      box-shadow: 0px 0px 8px 0px #00656c inset;
    }
  }
  tr:last-child td {
    border: none;
  }
  th {
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Semibold;
    font-weight: 600;
    color: #c0d2ff;
    border: none;
    &.is-leaf {
      border-bottom: 2px solid rgba(255, 255, 255, 0.04);
    }
  }
  td {
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Semibold;
    color: #ffffff;
    line-height: 14px;
  }
}
/deep/.hidden-tbody {
  height: 50px;
  tr {
    background: #01274f;
    box-shadow: 0px 0px 8px 0px #00656c inset;
    th {
      height: 50px;
      color: #c0d2ff;
      font-size: 14px;
      font-family: PingFangSC, PingFangSC-Semibold;
      font-weight: 600;
      background: #01274f;
      // box-shadow: 0px 0px 8px 0px #00656c inset;
    }
  }
}
/deep/.el-table__body {
  background: rgba(255, 255, 255, 0.1);
}
/deep/.hidden-tbody.el-table {
  height: 50px;
  box-sizing: border-box;
  /deep/.el-table__header-wrapper {
    /deep/tr {
      background: #01274f;
      box-shadow: 0px 0px 8px 0px #00656c inset;
    }
  }
  /deep/tbody {
    //隐藏上面表格的tbody
    display: none;
    overflow: hidden;
  }
}
.auto-scorll-table {
  height: calc(100% - 50px);
  overflow: hidden;
}
.hidden-thead.el-table {
  border-top: none; //防止边框重叠
  /deep/thead {
    //隐藏下面表格的thead
    display: none;
    overflow: hidden;
  }
  /deep/.warning-row {
    background: rgba(255, 255, 255, 0.04);
  }

  /deep/.success-row {
    background: rgba(255, 255, 255, 0.1);
  }
}
// 滚动表格样式end
/deep/.el-table__fixed-right::before {
  background: transparent;
}
/deep/.el-table--enable-row-hover .el-table__body tr:hover > td {
  background: transparent;
}
/deep/.el-progress-bar {
  width: 86%;
}
/deep/.el-progress {
  &.pro_top {
    .el-progress-bar__inner {
      background: linear-gradient(270deg, #ff5723, #d2641b);
    }
  }
  &.pro_def {
    .el-progress-bar__inner {
      background: linear-gradient(270deg, #e352a8, #941bd2);
    }
  }
}
/deep/.el-progress-bar__inner {
  border-radius: 0px;
  background-position: 0 0, 0 0;
  background-size: 10px 10px, 100% 100%;
}
/deep/.el-progress-bar__outer {
  background: #5e2d6d;
  border-radius: 0px;
  overflow: visible;
}
/deep/.el-progress__text {
  font-size: 0.28rem;
  font-family: Helvetica;
  color: #ffffff;
}
/deep/.el-button.is-disabled,
/deep/.el-button.is-disabled:focus,
/deep/.el-button.is-disabled:hover {
  color: #454545;
  background: #e6e6e6 !important;
}
/deep/.el-checkbox__inner {
  margin-left: 0.2rem;
}
</style>