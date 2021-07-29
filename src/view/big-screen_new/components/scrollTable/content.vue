<template>
  <div class="table_content">
    <ul
      class="table_content_ul"
      :style="{
        minHeight: config['rowHeight'] ? config['rowHeight'] + 'px' : '60px',
        background: config[checkNum(index+1)] ? config[checkNum(index+1)] : 'rgba(255,255,255,0.04)'
      }"
    >
      <li
        v-for="(item, index) in data"
        :key="index"
        :style="{
          width:
            (config.columnWidth &&
              config.columnWidth.length &&
              config.columnWidth[index]) ||
            100 / data.length + '%',
          textAlign: config['align'] || 'left',
        }"
      >
        <div v-html="item" v-if="checkHtml(item)"></div>
        <span v-else>{{ item }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    // 行配置
    config: {
      type: Object,
      default: () => {
        return {
          columnWidth: [], // 列宽
          align: "center", // 对齐方式
          rowHeight: 60, // 行高
          oddRowBGC: "", //奇书行颜色
          evenRowBGC: "", //偶数行颜色
        };
      },
    },
    // 每一行数据
    data: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 行
    index: {
      type: Number,
      default: 0
    }
  },
  methods: {
    // 检测html标签
    checkHtml(htmlStr) {
      let reg = /<[^>]+>/g;
      return reg.test(htmlStr);
    },
    // 判断奇偶
    checkNum(num) {
      // console.log((num % 2 == 0) ? 'evenRowBGC' : 'oddRowBGC')
      return (num % 2 == 0) ? 'evenRowBGC' : 'oddRowBGC'
    }
  },
};
</script>

<style scoped>
.table_content .table_content_ul {
  display: flex;
  align-items: center;
  margin: 1px 0;
  padding: 0 20px;
}
.table_content .table_content_ul li {
  
}
.table_content .table_content_ul li span {
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: left;
  color: #ffffff;
}
</style>