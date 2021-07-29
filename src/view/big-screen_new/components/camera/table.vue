<template>
  <div class="resTableCont">
    <section class="table-cont">
      <el-table
        :data="modeTableData"
        class="custom-table hidden-tbody"
      >
        <el-table-column label="告警图片" prop="provinceName"></el-table-column>
        <el-table-column label="设备名"></el-table-column>
        <el-table-column label="告警类型"></el-table-column>
        <el-table-column label="告警时间" prop="normalNum"></el-table-column>
      </el-table>
      <vue-seamless-scroll
        :data="modeTableData"
        :class-option="defaultOption"
        v-if="modeTableData.length"
        class="auto-scorll-table"
      >
        <!-- <el-table :data="modeTableData" class="custom-table hidden-thead">
          <el-table-column
            label="序号"
            prop="id"
            width="100"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span class="">{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="省份名称"
            prop="provinceName"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="资源总数"
            prop="totalNum"
            align="left"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="增量" align="left" show-overflow-tooltip>
            <template slot-scope="scope">
              <p>
                {{
                  scope.row.totalNum && scope.row.previousNum
                    ? scope.row.totalNum - scope.row.previousNum
                    : 0
                }}
              </p>
            </template>
          </el-table-column>
          <el-table-column
            label="达标数"
            prop="normalNum"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="不达标数"
            prop="anomalNum"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="达标比例">
            <template slot-scope="scope">
              <el-progress
                class="pro_def"
                :stroke-width="10"
                :percentage="
                  GetPercent(scope.row.normalNum, scope.row.totalNum)
                "
              ></el-progress>
            </template>
          </el-table-column>
        </el-table> -->
      </vue-seamless-scroll>
    </section>
  </div>
</template>
<script>
// import pagination from "components/pagination/pagination";
// import { getProvinceount } from "api/guidePage/building";
import vueSeamlessScroll from "vue-seamless-scroll";

export default {
  components: {
    // pagination,
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
        pageSize: 10 // 每页显示条数
      },
      searchVal: {
        id: 50
      }
    };
  },
  created() {
    // this.getList();
  },
  mounted() {
    this.$nextTick(() => {});
  },
  methods: {
    GetPercent(num, total) {
      num = parseFloat(num);
      total = parseFloat(total);
      if (isNaN(num) || isNaN(total)) {
        return 0;
      }
      return total <= 0 ? 0 : Math.round((num / total) * 10000) / 100.0;
      // return total <= 0
      //   ? "0%"
      //   : Math.round((num / total) * 10000) / 100.0 + "%";
    },
    // 分页切换页面
    handleCurrentChange(val) {
      this.page.pageNo = val;
      // this.getList();
    }
    // 表格列表
    /* getList() {
      let province = this.$Cookies.get("province");
      getProvinceount('').then(res => {
        console.log(res, "++++res++++");
        if (res.code == 200) {
          const data = res.data;
          // const { data, total } = res.data;
          this.modeTableData = data;
          // this.page.total = total;
        }
      });
    } */
  }
};
</script>
<style lang="less" scoped>
@deep: ~">>>";
.resTableCont {
  width: 100%;
  height: 100%;
  .table-cont {
  }
  @{deep}.el-table {
    background: rgba(22, 3, 28, 0.26);
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
    }
    tr:last-child td {
      border: none;
    }
    th {
      color: #c0d2ff;
      border: none;
      &.is-leaf {
        border-bottom: 2px solid rgba(255, 255, 255, 0.12);
      }
    }
    td {
      font-size: 0.28rem;
      font-family: PingFangSC, PingFangSC-Semibold;
      color: #ffffff;
      line-height: 0.4rem;
    }
  }
  // 滚动表格样式start
  @{deep}.hidden-tbody.el-table {
    height: 1rem;
    box-sizing: border-box;
    tbody {
      //隐藏上面表格的tbody
      display: none;
      overflow: hidden;
    }
  }
  @{deep}.hidden-thead.el-table {
    border-top: none; //防止边框重叠
    thead {
      //隐藏下面表格的thead
      display: none;
      overflow: hidden;
    }
  }
  .auto-scorll-table {
    height: calc(100% - 1rem);
    overflow: hidden;
  }
  // 滚动表格样式end
  @{deep}.el-table__fixed-right::before {
    background: transparent;
  }
  @{deep}.el-table--enable-row-hover .el-table__body tr:hover > td {
    background: transparent;
  }
  @{deep}.el-progress-bar {
    width: 86%;
  }
  @{deep}.el-progress {
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
  @{deep}.el-progress-bar__inner {
    border-radius: 0px;
    background-position: 0 0, 0 0;
    background-size: 10px 10px, 100% 100%;
  }
  @{deep}.el-progress-bar__outer {
    background: #5e2d6d;
    border-radius: 0px;
    overflow: visible;
  }
  @{deep}.el-progress__text {
    font-size: 0.28rem;
    font-family: Helvetica;
    color: #ffffff;
  }
  @{deep}.el-button.is-disabled,
  @{deep}.el-button.is-disabled:focus,
  @{deep}.el-button.is-disabled:hover {
    color: #454545;
    background: #e6e6e6 !important;
  }
  @{deep}.el-checkbox__inner {
    margin-left: 0.2rem;
  }
}
@{deep}td {
  text-align: left !important;
}
</style>