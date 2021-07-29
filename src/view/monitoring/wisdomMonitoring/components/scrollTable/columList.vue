<template>
  <div class="table_colum">
    <div class="colum" v-for="(item, index) in tabledata" :key="index">
      <tableColum :config="config" :data="item" :index="index" />
    </div>
  </div>
</template>

<script>
import tableColum from "./content";
export default {
  components: {
    tableColum,
  },
  props: {
    // 表格数据
    tabledata: {
      type: Array,
      default: () => {
        return []
      }
    },
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
        }
      }
    }
  },
  data() {
    return {
      
    };
  },
};
</script>

<style scoped>
.table_content {
  display: flex;
  flex-direction: column;
}
</style>