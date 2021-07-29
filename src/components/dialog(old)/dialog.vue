<template>
  <div id="diolog">
    <el-dialog
      class="_dialog"
      :close-on-click-modal="false"
      :append-to-body="appendToBody"
      :visible.sync="dialogVisible"
      :width="width"
      :title="title"
      @close="cancel"
      :center="true"
      @open="open"
    >
      <slot></slot>
      <div slot="footer" class="dialog-footer">
        <slot name="footerNew"></slot>
        <el-button
          type="primary"
          class="default f-12"
          @click="sure"
          title="确定"
          :disabled="$_loading"
          v-if="sureVisible"
        >确 定</el-button>
        <el-button
          class="default f-12"
          icon="el-icon-close"
          v-if="cancelVisible"
          @click="cancel"
          :disabled="$_loading"
          title="关闭"
        >关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data () {
    return {
      dialogVisible: false
    };
  },
  props: {
    // 弹窗显示
    visible: {
      type: Boolean,
      default: false
    },
    // Dialog 自身是否插入至 body 元素上。嵌套的 Dialog 必须指定该属性并赋值为 true
    appendToBody: {
      type: Boolean,
      default: false
    },
    // 弹窗宽度
    width: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '提示'
    },
    // 确定按钮是否显示
    sureVisible: {
      type: Boolean,
      default: true
    },
    // 取消钮是否显示
    cancelVisible: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    // 确定
    sure () {
      this.$emit('on-sure');
    },
    // 取消
    cancel () {
      this.dialogVisible = false;
      this.$emit('on-cancel');
    },
    // dialog 打开时
    open () {
      this.$emit('on-open');
    }
  },
  watch: {
    visible (newValue, oldValue) {
      this.dialogVisible = !!newValue;
    }
  }
};
</script>

<style lang="less">
.el-button.dialogBtn,
.el-button.dialogBtn:hover,
.el-button.dialogBtn:focus {
  background-color: #fff;
  color: #333;
  border-color: #ddd;
}
.el-button.dialogBtn {
  margin: 4px 3px 6px;
}
.footBtn {
  text-align: center;
  margin-top: 15px;
  i.el-icon-close {
    font-weight: bold;
  }
  .btn {
    margin-left: 16%;
  }
  .el-button {
    line-height: 23px;
    height: 30px;
  }

  .el-button + .el-button {
    margin-left: 3px;
  }
}

._dialog {
  .dialog-footer {
    text-align: right;
    position: relative;
    i.el-icon-close {
      font-weight: bold;
    }
    .el-button.default {
      width: 63px !important;
      height: 30px !important;
      line-height: 25px !important;
    }
  }
}
</style>
