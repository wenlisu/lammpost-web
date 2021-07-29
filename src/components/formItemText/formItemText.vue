<template>
  <div id="formItemText">
    <el-form
      ref="formData"
      :label-width="labelWidth"
      :style="styles"
    >
        <el-row>
          <el-col
            v-for="(item, index) in layout"
            :key="`item${index}`"
            :span="(item && item.span) || 12"
          >
            <el-form-item
              :prop="item && item.prop"
              :class="item.class"
              v-if="!item.hide"
            >
                <div>
                  <div v-if="!item.custom" :class="item.important && 'important'" :style="item.style" class="flexRow">
                    <span>{{item.label!=''?(item.label+(item.label.indexOf('：') > -1 ? '' : '：')):''}}</span>
                    <el-tooltip class="formItem value" effect="light" placement="top-start">
                      <div slot="content" v-if="item.value">{{item.value}}{{item.value ? item.unit : ''}}</div>
                      <span v-if="item.value">{{item.value}}{{item.value !== '' ? item.unit : ''}}</span>
                    </el-tooltip>
                  </div>
                  <div v-else :class="item.important && 'important'" class="flexRow" :style="item.style">
                    {{item.label!=''?(item.label+(item.label.indexOf('：') > -1 ? '' : '：')):''}}
                    <slot :name="item.id"></slot>
                  </div>
                </div>
            </el-form-item>
          </el-col>
        </el-row>
    </el-form>
    <!-- <div class="handle-footer" v-if="isEdit">
      <el-button class="reset-btn" @click="$_resetForm">
        取消
      </el-button>
      <el-button
        class="submit-btn"
        type="primary"
        :disabled="$_loading"
        @click="submitForm"
      >
        确定
      </el-button>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'formItemText',
  data () {
    return {
      //
    };
  },
  components: {
  },
  props: {
    layout: {
      type: Array,
      default () {
        return null
      }
    },
    isEdit: {
      type: Boolean,
      default () {
        return false
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    labelWidth: {
      type: String,
      default: '120px'
    },
    styles: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    'form': {
      deep: true,
      handler: function (nowVal, oldVal) {
      }
    },
    'layout': {
      deep: true,
      handler: function (nowVal, oldVal) {
        this.$set(this.layout, nowVal);
      }
    }
  },
  computed: {
  },
  methods: {
  },
  mounted () {
  }
};
</script>

<style lang="less">

#formItemText{
  .flexRow {
    font-size: 14px; /*no*/
  }
  .important{
    display: inline-block;
    line-height: 26px;
    padding: 0px 8px;
   background:linear-gradient(90deg,rgba(74,141,249,1) 0%,rgba(39,116,241,1) 100%);
    box-shadow:0px 2px 4px 0px rgba(216,211,211,0.5);
    border-radius:50px;
    color: #fff;
  }
  /deep/.comp-wrapper-header{
    padding: 0;
  }
  /deep/ .el-form-item {
    // height: 17px;/*no*/
    // line-height: 17px;/*no*/
    margin-bottom: 10px;/*no*/
    &.noBottom{
      margin-bottom: 0;
    }
    /deep/.el-form-item__label, .el-form-item__content{
      line-height: 17px;/*no*/
      font-size:12px;/*no*/
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(255,255,255,1);
      >div{
        >div{
          align-items: center;
        }
      }
      span{
        display: inline-block;
        word-break: keep-all;
      }
      .value{
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        padding-right: 10px;/*no*/
      }
    }
  }
}

</style>
