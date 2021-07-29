<template>
  <el-container
  id="moveDialog"
   v-drag
   v-show="dialogVisible"
   >
    <el-header>
        <h2 v-html="title"></h2>
        <i class="el-icon-close" @click="closeDialog"/>
    </el-header>
    <el-main>
      <slot>这里是内容</slot>
    </el-main>
    <el-footer>
      <span class="dialog-footer">
        <el-button
            @click="closeDialog"
            class="button closeBtn"
        >关闭</el-button>
        <el-button
            type="primary"
            class="button submitBtn"
            @click="confirmDialog"
        >确定</el-button>
      </span>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  name: 'Window',
  props: {
    title: String,
    /** 弹窗显示 */
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      selectElement: '',
      dialogVisible: false,
      isOpen: false,
      isMove: false
    }
  },
  watch: {
    visible (newValue) {
      this.dialogVisible = !!newValue;
    }
  },
  computed: {
  },
  methods: {
    closeDialog (e) {
      this.$emit('on-cancel');
    },
    confirmDialog () {
      this.$emit('on-confirm');
    },
    searchDom (pathList, parent) {
      let resoure = false;
      pathList.map(path => {
        if (path === parent) {
          resoure = true;
        }
      });
      return resoure;
    }
  },
  directives: {
    drag (el, binding, vnode, oldVnode) {
      let oDiv = el // 当前元素
      // let self = this // 上下文
      // 禁止选择网页上的文字
      document.onselectstart = function () {
        return false
      }
      oDiv.onmousedown = async (e) => {
        let searchResoure = await vnode.context.searchDom(e.path, document.getElementById('adminFormItem'));
        if (searchResoure) {
          return false;
        }
        e.stopPropagation();
        // 鼠标按下，计算当前元素距离可视区的距离
        let disX = e.clientX - oDiv.offsetLeft
        let disY = e.clientY - oDiv.offsetTop
        document.onmousemove = (e) => {
          e.stopPropagation();
          // 通过事件委托，计算移动的距离
          let l = e.clientX - disX
          let t = e.clientY - disY
          // 移动当前元素
          oDiv.style.left = l + 'px'
          oDiv.style.top = t + 'px'
        }
        document.onmouseup = (e) => {
          e.stopPropagation();
          document.onmousemove = null
          document.onmouseup = null
        }
        // return false不加的话可能导致黏连，就是拖到一个地方时div粘在鼠标上不下来，相当于onmouseup失效
        return false
      }
    }
  }
}
</script>

<style lang="less" scoped>
#moveDialog {
    position: absolute;
    height: auto;
    width: 350px;/*no*/
    border: 1px;/*no*/
    bottom: 10px;/*no*/
    right: 10px;/*no*/
    border-radius: 2px;/*no*/

  .dialog-footer {
    text-align: right;
  }

  .el-main {
      flex: none;
    background-color: white;
    border: 1px solid #EBEEF5;/*no*/
    border-top: 0;
    border-bottom: 0;
  }

  .el-footer {
    background-color: white;
    text-align: right;
    border: 1px solid #EBEEF5;/*no*/
    border-top: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .dialog-footer{
        .button{
            padding: 10px 15px;/*no*/
            font-size:14px;/*no*/
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            &.submit{
            background:rgba(37,115,241,1);
            }
        }
        .closeBtn{
            margin-right: 10px !important;
            color: rgba(37,115,241,1);
        }
        .button.el-button--default {
            line-height: 10px;
            border: 1px solid #409eff !important;/*no*/
        }
        .button.el-button--primary{
            line-height: 10px;
            border: 1px solid #409eff !important;/*no*/
        }
    }
  }

  .el-header {
    background-color: white;
    color: #333;
    height: 50px !important;/*no*/
    border: 1px solid #EBEEF5;/*no*/
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    h2{
        line-height: 24px;/*no*/
        font-size: 14px;/*no*/
        color: #303133;
    }
    i{
        font-size: 14px;/*no*/
        cursor: pointer;
    }
  }

  .el-aside {
    color: #333;
  }
}

</style>
