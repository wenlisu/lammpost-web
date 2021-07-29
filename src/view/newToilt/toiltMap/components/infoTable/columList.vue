<template>
  <div class="table_colum">
    <div
      class="colum"
      v-for="(item, index) in tabledata"
      :key="index + item[0]"
      @click="mapPosition(allData[index]['regionId'], index)"
    >
      <tableColum
        :config="config"
        :data="item"
        :index="index"
        :reginID="allData[index]['regionId']"
      />
    </div>
  </div>
</template>

<script>
import tableColum from "./content";
import store from "@/store";
export default {
  components: {
    tableColum,
  },
  props: {
    // 所有数据
    allData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 表格数据
    tabledata: {
      type: Array,
      default: () => {
        return [];
      },
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
        };
      },
    },
  },
  data() {
    return {
      activeIndex: -1,
    };
  },
  watch: {
    tabledata(newValue, oldValue) {
      console.log(newValue);
    },
  },
  created() {
    console.log(store);
  },
  methods: {
    mapPosition(reginID,index) {
      store.commit("set_toiltReginID", reginID);
      this.activeIndex = index;
      console.log(this.allData[index])
      this.$emit('mapPosition', {
        id: this.allData[index]['toiletId'],
        label: this.allData[index]['toiletName'],
        ...this.allData[index]
      })
    },
  },
};
</script>

<style scoped>
.table_content {
  display: flex;
  flex-direction: column;
}
</style>