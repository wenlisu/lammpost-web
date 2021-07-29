<template>
  <div id="center">
    <div
      class="list"
      v-for="(col, index) in list"
      :key="`col-${col.id}${index}`"
    >
      <IuminousBox :title="col.name" :value="col.value" :unit="col.unit" />
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import IuminousBox from "../components/luminousBox";

export default {
  data() {
    return {};
  },
  components: {
    IuminousBox
  },
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapGetters(["bigScreenNew"])
  },
  methods: {
    getInit() {}
  },
  watch: {},
  mounted() {
    this.$nextTick(() => {
      this.getInit();
    });
  },
  created() {},
  destroyed() {}
};
</script>
<style lang="less">
#center {
  height: auto;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 32%);
  grid-column-gap: 10px;
  grid-row-gap: 10px;
  justify-items: center;
  .list {
    background: linear-gradient(
      270deg,
      rgba(36, 60, 114, 0),
      rgba(19, 83, 134, 0.72) 80%,
      rgba(74, 111, 170, 0)
    );
    border: 1px solid;
    border-image: linear-gradient(
        270deg,
        rgba(81, 217, 250, 0),
        #28b1f2 79%,
        rgba(40, 177, 242, 0)
      )
      1 1;
    // z-index: 905;
    .luminousBox {
    }
  }
}
</style>
