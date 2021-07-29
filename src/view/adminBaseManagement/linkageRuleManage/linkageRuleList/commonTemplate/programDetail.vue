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
    <div id='commonProgramTemplateDetail'>
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
import Details from '@/view/adminScreen/screenManagement/fastScreen';
export default {
  name: 'commonProgramTemplateDetail',
  data () {
    return {
      title: '新增LED模板',
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
      if (val) {
        setTimeout(() => {
          this.$refs.details.initTemplate();
        }, 500);
      }
    },
    data (val) {
      console.log('this.data', val)
      this.editData = {
        ...val,
        programTemplate: 1
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
#commonProgramTemplateDetail{
}
</style>
