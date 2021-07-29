<template>
  <div id="callRight" :class="{ componentView: true, show: show }">
    <div class="part_3">
      <ChartTitle partTitle="报警器本年度报警情况分析" />
      <rightLine />
    </div>
    <div class="parat_4">
      <ChartTitle partTitle="报警器报警消息" />
      <ScrollTable />
    </div>
  </div>
</template>
<script>
import ChartTitle from "../../components/chartTitle/index";
import rightLine from "../../components/call/rightLine";
import ScrollTable from "../../components/call/scroll";
export default {
  data() {
    return {};
  },
  components: {
    ScrollTable,
    rightLine,
    ChartTitle
  },
  computed: {},
  methods: {},
  watch: {},
  mounted() {},
  created() {},
  destroyed() {}
};
</script>
<style lang="less">
#callRight {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .part_3 {
    width: 100%;
    height: 50%;
  }
  .parat_4 {
    width: 100%;
    height: 50%;
    overflow: hidden;
  }
}
</style>
