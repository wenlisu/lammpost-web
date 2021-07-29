<template>
  <treeselect
    :alwaysOpen="item.aO || false"
    :style="{ maxWidth: item.width ? item.width : '100%' }"
    :multiple="item.multiple || false"
    :options="item.options"
    :clearable="item.clearable || false"
    :disable-branch-nodes="item.disableBranch || true"
    :normalizer="
      (node) => {
        return formatterNode(node, item.normalizer);
      }
    "
    :auto-load-root-options="true"
    :placeholder="item.placeholder ? item.placeholder : `请选择${item.label}`"
    :valueFormat="item.value || id"
    :load-options="loadOptions"
    @select="selectOption"
    v-model="preForm[item.prop]"
  >
    <!-- <div slot="before-list">1</div> -->
  </treeselect>
</template>

<script>
import treeselect from "@riophae/vue-treeselect";
import { queryNewCityToiletList, toiletList } from "api/toilt";
export default {
  components: {
    treeselect,
  },
  props: {
    item: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      preForm: {},
    };
  },
  methods: {
    selectOption (node, instanceId) {
      console.log(node)
      this.$emit('getNode', node)
    },
    // 自定义健名
    formatterNode(node, fun) {
      if (fun) {
        if (typeof fun == "function") {
          return fun(node);
        } else {
          return;
        }
      }
    },
    // 懒加载
    loadOptions({ action, parentNode, callback, instanceId }) {
      if (action == "LOAD_CHILDREN_OPTIONS") {
        this.item.load(parentNode, callback)
      }
    },
  },
};
</script>

<style>
</style>