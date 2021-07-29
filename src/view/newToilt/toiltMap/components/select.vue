<template>
  <div class="select-wrap">
    <TreeSelect :item="item" @getNode="getNodeInfo"> </TreeSelect>
  </div>
</template>

<script>
import TreeSelect from "./treeSelect";
import { queryNewCityToiletList, toiletList } from "api/toilt";
export default {
  components: {
    TreeSelect,
  },
  data() {
    return {
      item: {
        label: "要查看的公厕",
        options: [],
        load: (parentNode, callback) => {
          this._toiletList(parentNode, callback);
        },
      },
    };
  },
  created() {
    this._queryNewCityToiletList();
  },
  methods: {
    getNodeInfo(node) {
      this.$emit('mapZoom', node)
    },
    // treeselect 自定义键名
    formatterNode(node) {
      return {
        id: node.parkId, // 键名转换，默认是label和children进行树状渲染
        label: node.parkName,
        children: node.treeDeviceDtoList,
      };
    },
    async _toiletList(parentNode, callback) {
      let parames = {
        parkId: parentNode.id,
      };
      let res = await toiletList(parames);
      if (res.code == "200") {
        parentNode.children = res.data.map((item) => {
          return {
            ...item,
            label: item.toiletName,
            id: item.toiletId,
            parentId: parentNode.id,
            parentLabel: parentNode.label,
          };
        });
        callback();
      }
    },
    _queryNewCityToiletList() {
      queryNewCityToiletList({}).then((res) => {
        if (res.code == "200") {
          res.data.map((item) => {
            this.item.options.push({
              id: item.parkId,
              label: item.parkName,
              children: null,
            });
          });
        }
      });
    },
  },
};
</script>

<style scoped>
.select-wrap {
  margin-top: 5px;
}
</style>