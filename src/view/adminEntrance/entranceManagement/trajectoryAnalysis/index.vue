<template>
  <div id="entranceTrajectoryAnalysis">
  </div>
</template>

<script>
export default {
  data () {
    return {
    };
  },
  props: {
    listData: {
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    init () {
    }
  }
};
</script>

<style lang="less">
#entranceTrajectoryAnalysis{}
</style>
