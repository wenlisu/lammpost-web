<template>
  <div
    class="table_header"
    :style="{
      background: (config['headerBGC'] && config['headerBGC']) || '#01274f',
    }"
  >
    <ul
      class="header_content"
      :style="{
        minHeight:
          (config['headerHeight'] && config['headerHeight'] + 'px') ||
          60 + 'px',
      }"
    >
      <li
        v-for="(item, index) in header"
        :key="index"
        :style="{
          width:
            (config['itemWidth'] &&
              config.itemWidth.length &&
              config.itemWidth[index]) ||
            100 / header.length + '%',
          textAlign: config['align'] || 'left',
        }"
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    header: {
      type: Array,
      default: () => {
        return [];
      },
    },
    config: {
      type: Object,
      default: () => {
        return {
          itemWidth: [],
          align: "center",
          headerHeight: 60,
          headerBGC: "#01274f",
        };
      },
    },
  },
};
</script>

<style scoped>
.table_header {
  width: 100%;
  min-height: 50px;
  background: #01274f;
  box-shadow: 0px 0px 8px 0px #00656c inset;
}
.header_content {
  display: flex;
  justify-content: space-around;
  align-items: center;
  min-height: 50px;
  padding: 0 20px;
}
.header_content li {
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Semibold;
  font-weight: 600;
  color: #c0d2ff;
}
</style>