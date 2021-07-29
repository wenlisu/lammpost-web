<template>
  <div
    class="table_header"
    :style="{
      background: (config['headerBGC'] && config['headerBGC']) || '#01274f'
    }"
  >
    <ul
      class="header_content"
      :style="{
        minHeight:
          (config['headerHeight'] && config['headerHeight'] + 'px') || 30 + 'px'
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
          textAlign: config['align'] || 'left'
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
      }
    },
    config: {
      type: Object,
      default: () => {
        return {
          itemWidth: [],
          align: "center",
          headerHeight: 30,
          headerBGC: "#01274f"
        };
      }
    }
  }
};
</script>

<style scoped>
.table_header {
  width: 100%;
  min-height: 30px;
  background: rgba(43, 61, 116, 0.36);
}
.header_content {
  display: flex;
  justify-content: space-around;
  align-items: center;
  min-height: 30px;
  padding: 0 20px;
}
.header_content li {
  font-size: 16px;
  font-family: PingFangSC;
  font-weight: 400;
  text-align: left;
  color: #9fade0;
  line-height: 30px;
  letter-spacing: 1px;
}
</style>
