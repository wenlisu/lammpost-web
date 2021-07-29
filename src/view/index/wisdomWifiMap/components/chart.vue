<template>
  <div class="chart-wrap">
    <el-row class="box-1">
      <commonTitle title="AP负载量统计" />
      <regisonal :seriesData="seriesData"/>
    </el-row>
  </div>
</template>

<script>
import commonTitle from "../../components/commonTitle";
import regisonal from "./chart/regisonal";
import handle from "./chart/handle";
import { queryWifiApLoadStat } from "api/wifi";
export default {
  components: {
    commonTitle,
    handle,
    regisonal,
  },
  data() {
    return {
      seriesData: {}
    }
  },
  created() {
    this.getDataAllList()
  },
  methods: {
    getDataAllList() {
      let data = {
        data: {
          siteId: '',
        },
        // pageNo: Number(this.page.current || 0), // 查询的分页页码
        // pageSize: Number(this.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        // sorting: "",
      };
      queryWifiApLoadStat(data).then((res) => {
        if (res.code === "200") {
          const { data } = res;
          this.seriesData = data
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.chart-wrap {
  width: 100%;
  height: 100%;
  /deep/.common-box {
    padding-top: 16px;
    padding-bottom: 16px;
    padding-left: 23px;
    .txt {
      font-size: 28px;
      font-family: YouSheBiaoTiHei;
    }
  }
  .box-1 {
    height: 100%;
    width: 100%;
  }
}
</style>