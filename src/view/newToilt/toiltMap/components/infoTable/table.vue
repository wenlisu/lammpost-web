<template>
  <div class="info-table">
    <div class="info-title">
      <div class="main-text">
        <div class="address">
          <img src="../../images/address.png" alt="" />
          <span>{{ parkName }}</span>
        </div>
        <div class="num">{{ totalNum }}个</div>
      </div>
    </div>
    <div class="table-wrap">
      <tableHeader :header="header" :config="headerConfig" />
      <tableColumList
        :tabledata="newTableData"
        :config="columConfig"
        :allData="tableData"
        @mapPosition="showInfo"
      />
    </div>
  </div>
</template>

<script>
import tableHeader from "./header";
import tableColumList from "./columList";
import { getLocal } from "util/tool";
export default {
  components: {
    tableHeader,
    // content,
    tableColumList,
  },
  props: {
    totalNum: {
      typeof: Number,
      default: () => {
        return 0;
      },
    },
    parkName: {
      typeof: String,
      default: () => {
        return "";
      },
    },
    tableData: {
      typeof: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      header: ["名称", "地址", "状态"],
      headerConfig: {
        headerHeight: 38,
        itemWidth: ["30%", "60%", "10%"],
        headerBGC: "transparent",
        fontSize: 16,
      },
      newTableData: [],
      columConfig: {
        rowHeight: 38,
        oddRowBGC: "rgba(255,255,255,0.04)",
        evenRowBGC: "rgba(255,255,255,0.10)",
        columnWidth: ["30%", "60%", "10%"],
        fontSize: 16,
        oddRowBGC: "linear-gradient(180deg,#061b42, #03264a)", //奇书行颜色
        evenRowBGC: "linear-gradient(180deg,#061b42, #03264a)", //偶数行颜色
      },
    };
  },
  watch: {
    tableData: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        console.log(newValue);
        if (newValue.length) {
          this.getData(newValue);
        }
      },
    },
  },
  mounted() {
    // this.getData();
  },
  methods: {
    getData(value) {
      console.log("aaa", value);
      value.map((item) => {
        this.newTableData.push([
          item.toiletName,
          item.location,
          item.status == 1
            ? `<span style="color: #FF5D5D; font-size:16px">拥堵</span>`
            : `<span style="color: #45FFDB; font-size:16px">流畅</span>`,
        ]);
      });
      // this.newTableData = [
      //   [
      //     "公园公厕",
      //     "广东省佛山市顺德区解放路200号",
      //     `<span style="color: #45FFDB; font-size:22px">流畅</span>`,
      //   ],
      //   [
      //     "公园公厕",
      //     "广东省佛山市顺德区解放路200号",
      //     `<span style="color: #FF5D5D; font-size:22px">拥堵</span>`,
      //   ],
      // ];
    },
    showInfo(parames) {
      this.$emit("showInfo", parames);
    },
  },
};
</script>

<style lang="less" scoped>
.info-table {
  width: 100%;
  height: 100%;
  /*标题样式 start*/
  .info-title {
    .main-text {
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
    }
    .address {
      position: relative;
      width: 350px;
      img {
        width: 24px;
        height: 24px;
      }
      span {
        font-size: 20px;
        font-family: YouSheBiaoTiHei;
        text-align: left;
        color: #ffffff;
        letter-spacing: 1px;
        text-shadow: 0px 2px 4px 0px #1c4696;
      }
      &::after {
        position: absolute;
        bottom: -8px;
        left: 0;
        content: "";
        display: inline-block;
        width: 100%; 
        height: 8px;
        background-image: url(../../../images/title_line.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }
    .num {
      padding: 0 20px;
      height: 28px;
      line-height: 28px;
      background: linear-gradient(
        270deg,
        rgba(19, 34, 81, 0),
        rgba(74, 204, 255, 0.45) 53%,
        rgba(42, 70, 138, 0) 100%
      );
      border: 1px solid;
      border-image: linear-gradient(
          270deg,
          rgba(62, 201, 255, 0) 4%,
          #1ebfff 46%,
          rgba(29, 153, 255, 0) 91%
        )
        1 1;
      border-radius: 9px;
      font-size: 16px;
      font-family: PingFangSC, PingFangSC-Semibold;
      font-weight: 600;
      text-align: left;
      color: #ffffff;
      letter-spacing: 1px;
    }
  }
  /*标题样式 end*/

  .table-wrap {
    height: calc(100% - 65px);
    padding-top: 8px;
    /deep/.header_content li {
      color: #61b1e1;
      font-weight: 400;
    }
  }
}
</style>