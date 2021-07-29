<template>
  <div id="doorRight" :class="{ componentView: true, show: show }">
    <div class="part_1">
      <ChartTitle partTitle="门禁本月通过人员类型统计" />
      <DoorTypes />
    </div>
    <div class="parat_2">
      <ChartTitle partTitle="门禁进出消息" />
      <DoorMsg />
    </div>
  </div>
</template>

<script>
import ChartTitle from "../../components/chartTitle/index";
import DoorTypes from "../../components/door/types";
import DoorMsg from "../../components/door/msgTable";
export default {
  components: {
    ChartTitle,
    DoorTypes,
    DoorMsg,
  },
};
</script>

<style lang="less">
#doorRight {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .part_1 {
    width: 100%;
    height: 50%;
    overflow: hidden;
  }
  .parat_2 {
    width: 100%;
    height: 50%;
    overflow: hidden;
  }
}
</style>