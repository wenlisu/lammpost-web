<template>
  <div class="chart-wrap">
    <el-row class="box-1">
      <commonTitle title="报警器报警处理情况" />
      <handle />
    </el-row>
    <!-- <div class="box-1">
      
    </div> -->
    <el-row class="box-2">
      <commonTitle title="报警地区分布" />
      <regisonal />
    </el-row>
    <!-- <div class="box-2">
      <commonTitle title="报警地区分布" />
      <regisonal />
    </div> -->
  </div>
</template>

<script>
import commonTitle from "../../components/commonTitle";
import regisonal from "./chart/regisonal"
import handle from "./chart/handle"
export default {
  components: {
    commonTitle,
    handle,
    regisonal
  },
};
</script>

<style scoped lang="less">
.chart-wrap {
  width: 449px;
  height: 100%;
  padding-left: 30px;
  padding-top: 85px;
  background-image: url(../images/border_3.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .box-1 {
    height: 50%;
    width: 100%;
  }
  .box-2 {
    height: 50%;
    width: 100%;
  }
  /deep/.com-container {
    padding-top: 0;
  }
}
</style>