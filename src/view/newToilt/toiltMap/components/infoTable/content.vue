<template>
  <div class="table_content">
    <ul
      class="table_content_ul"
      :style="{
        minHeight: config['rowHeight'] ? config['rowHeight'] + 'px' : '60px',
        background: toiltReginID == reginID ? 'rgba(29,69,129,0.70)' : (config[checkNum(index + 1)]
          ? config[checkNum(index + 1)]
          : 'rgba(255,255,255,0.04)')
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
          fontSize: (config.fontSize && config.fontSize) + 'px' || '14px',
        }"
      >
      <div v-html="item" v-if="checkHtml(item)"></div>
        <el-tooltip
          class="item"
          effect="dark"
          :content="item"
          placement="top-start"
          v-else
        >
          <span>{{ item }}</span>
        </el-tooltip>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    // 经纬度
    reginID: {
      typeof: String,
      default: () => {
        return ''
      }
    },
    isActiveIndex: {
      typeof: String,
      default: () => {
        return ''
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
      default: 0,
    },
  },
  computed: {
    ...mapGetters(['toiltReginID']),
  },
  data() {
    return {
      activeIndex: -1
    }
  },
  watch: {
    toiltReginID(newValue, oldValue) {
      console.log(newValue)
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
      // console.log(num % 2 == 0 ? "evenRowBGC" : "oddRowBGC");
      return num % 2 == 0 ? "evenRowBGC" : "oddRowBGC";
    },
    mapPosition() {
      console.log(11111)
      this.activeIndex = this.index
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
  cursor: pointer;
}
.table_content .table_content_ul li {
  
}
.table_content .table_content_ul li span {
  /* font-size: 14px; */
  display: inline-block;
  width: 100%;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: left;
  color: #ffffff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>