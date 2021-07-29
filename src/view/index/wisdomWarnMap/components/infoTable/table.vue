<template>
  <div class="info-table">
    <div class="table-wrap">
      <tableHeader :header="header" :config="headerConfig" />
      <tableColumList
        :tabledata="newTableData"
        :config="columConfig"
        :allData="tableData"
      />
    </div>
  </div>
</template>

<script>
import tableHeader from "./header";
import tableColumList from "./columList";
import { getLocal } from "util/tool";
import {
  getAlarmPosition,
  getAlarmInfoList
} from '@/api/wisdomWarn'
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
      header: ["报警设备名称", "报警位置", "报警开始时间", "报警结束时间"],
      headerConfig: {
        headerHeight: 30,
        headerBGC: "transparent",
        fontSize: 16,
      },
      newTableData: [],
      columConfig: {
        fontSize: 16,
        rowHeight: 30,
        oddRowBGC: "rgba(51,69,124,0.58)", //奇书行颜色
        evenRowBGC: "rgba(32,49,102,0.58)", //偶数行颜色
      },
    };
  },
  created() {
    this._getAlarmRecord();
  },
  watch: {
    tableData: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        if (newValue.length) {
          // this.getData(newValue);
        }
      },
    },
  },
  mounted() {},
  methods: {
    getData(value) {
      // value.map((item) => {
      //   this.newTableData.push([
      //     item.toiletName,
      //     item.location,
      //     item.status == 1
      //       ? `<span style="color: #FF5D5D; font-size:22px">拥堵</span>`
      //       : `<span style="color: #45FFDB; font-size:22px">流畅</span>`,
      //   ]);
      // });
      value.map((item) => {
        this.newTableData.push([
          item.alarmName,
          item.installAddress,
          item.alarmTime,
          item.finishedTime,
        ]);
      });
    },
    _getAlarmRecord() {
      let data = {};
      getAlarmInfoList(data).then((res) => {
        if (res.code == 200) {
          let { data } = res;
          this.getData(data);
        }
      });
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
  height: calc(100% - 65px);

  .table-wrap {
    height: 100%;
    padding-top: 8px;
    /deep/.header_content li {
      // color: #61b1e1;
      // font-weight: 400;
    }
  }
}
</style>
