/* eslint-disable camelcase */
<template>
  <dialog-cont
    @on-cancel="canceledit('close')"
    @on-close="canceledit('close')"
    @on-confirm="confirmedit"
    @on-open="openedit"
    :title="`${title}`"
    width="80%"
    :visible.sync="editshow"
    ref="dialog"
    :bottomShow="false"
    appendToBody
  >
    <div id='brocastDetail'>
      <Details
        ref="details"
        type="template"
        :currentData="editData"
        @submit="canceledit('cancel')"
        @cancel="canceledit('close')"
      />
    </div>
  </dialog-cont>
</template>

<script>
import dialogCont from '@/components/adminDialog';
import Details from '@/view/adminBroadcast/broadcastManagement/timeMonitoring';
export default {
  name: 'brocastDetail',
  data () {
    return {
      title: '新增广播模板',
      editshow: false,
      editData: {}
    }
  },
  props: {
    data: {},
    show: ''
  },
  mounted () {
    this.$nextTick(() => {
      // this.getDataAllList(1, 10)
    });
  },
  components: {
    dialogCont,
    Details
  },
  watch: {
    show (val) {
      this.editshow = val;
      this.editData = {
        ...this.data,
        isTemplate: 1
      };
    },
    data (val) {
      this.editData = {
        ...val,
        isTemplate: 1
      };
    }
  },
  methods: {
    openedit () {
    },
    closeedit () {
      this.editshow = false;
      this.editData = {};
      this.$refs.details.clearnInfo();
    },
    canceledit (type) {
      this.closeedit();
      this.$emit('cancel', type);
    },
    confirmedit () {
    }
  }
}
</script>

<style lang="less" scoped>
#brocastDetail{
  /deep/#card {
    background: #fff;
    margin: 0;
    padding: 40px 20px 20px;/*no*/
}
}
</style>
