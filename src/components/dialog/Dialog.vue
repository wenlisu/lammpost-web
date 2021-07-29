<template>
<div id="dialog">
  <el-dialog
    :close-on-click-modal="closeOnClickModal"
    :append-to-body="appendToBody"
    :visible.sync="dialogVisible"
    :width="width"
    :title="title"
    :center="titleCenter"
    @close="onClose"
    @open="onOpen"
    :custom-class="customClass"
  >
    <slot />
    <div
      slot="footer"
      v-if="bottomShow"
    >
      <slot name="footer" />
      <flex :justify="footerAlignJustify">
        <el-button
          v-if="cancelShow"
          title="关闭"
          @click="onCancel"
        >
          取消
        </el-button>
        <el-button
          v-if="confirmShow"
          type="primary"
          title="确定"
          @click="onConfirm"
        >
          保存
        </el-button>
      </flex>
    </div>
  </el-dialog>
</div>
</template>

<script>
import Flex from '../flex';

export default {
  components: {
    flex: Flex
  },
  props: {
    /** 弹窗显示 */
    visible: {
      type: Boolean,
      default: false
    },
    /** Dialog 自身是否插入至 body 元素上。嵌套的 Dialog 必须指定该属性并赋值为 true */
    appendToBody: {
      type: Boolean,
      default: false
    },
    /** 标题是否居中显示 */
    titleCenter: {
      type: Boolean,
      default: true
    },
    /** 弹窗宽度 */
    width: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '提示'
    },
    /** 底部整块按钮是否显示 */
    bottomShow: {
      type: Boolean,
      default: true
    },
    /** 确定按钮是否显示 */
    confirmShow: {
      type: Boolean,
      default: true
    },
    /** 取消钮是否显示 */
    cancelShow: {
      type: Boolean,
      default: true
    },
    /** slot footer 对齐方式 */
    footerAlign: {
      type: String,
      default: 'right'
    },
    /** 是否可以通过点击 modal 关闭 Dialog */
    closeOnClickModal: {
      type: Boolean,
      default: false
    },
    customClass: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogVisible: false
    };
  },
  computed: {
    footerAlignJustify () {
      const { footerAlign } = this;
      if (!footerAlign) return 'center';
      const ALIGN = {
        left: 'flex-start',
        center: 'center',
        right: 'flex-end'
      };
      return ALIGN[footerAlign];
    }

  },
  watch: {
    visible (newValue) {
      this.dialogVisible = !!newValue;
    },
    dialogVisible (newValue) {
      this.emitUpdateVisible(newValue);
    }
  },
  methods: {
    /** 点击确定回调函数 */
    onConfirm () {
      this.$emit('on-confirm');
    },
    /** 点击取消回调函数 */
    onCancel () {
      this.dialogVisible = false;
      this.$emit('on-cancel');
    },
    /** 窗口关闭回调函数 */
    onClose () {
      this.$emit('on-cancel');
    },
    /** 窗口打开回调函数 */
    onOpen () {
      this.$emit('on-open');
    },
    emitUpdateVisible (val) {
      this.$emit('update:visible', val);
    }
  }
};
</script>
<style lang="less">
#dialog, .el-dialog__wrapper{
  color: red;
  .el-dialog--center{
    background:rgba(20,31,62,1);
    .el-dialog__header{
      // height: 40px;/*no*/
      background: transparent;
      border-bottom: 1px solid #3F4C70;/*no*/
      .el-dialog__title{
        font-size:14px;/*no*/
        line-height: 17px;/*no*/
        font-family:PingFangSC-Semibold,PingFang SC;
        font-weight:600;
        color:rgba(160,172,216,1);
      }
      button{
        i{
          color: #fff !important;
        }
      }
    }
    .el-dialog__body{
      background: transparent;
    }
    .el-dialog__footer{
      border-top: none;
      padding: 10px;/*no*/
      button{
        padding: 0;
        min-width:70px;/*no*/
        height:30px;/*no*/
        background:rgba(20,31,62,1);
        border-radius:4px;/*no*/
        border:1px solid rgba(52,114,255,1);/*no*/
        font-size:12px;/*no*/
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(52,114,255,1);
        &:last-child{
          background:linear-gradient(318deg,rgba(29,91,250,1) 0%,rgba(0,119,228,1) 100%);
          margin-left: 10px;/*no*/
          color:rgba(230,236,255,1);
        }
      }
    }
    &.smokerListDialog {
      background: transparent;
      .el-dialog__header{
        text-align: left;
        padding-left: 0;
        padding-right: 0;
        .el-dialog__title{
          padding-left: 15px;/*no*/
          position: relative;
          &:after{
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 7px;/*no*/
            height: 13px;/*no*/
            background: url(./images/img13.png) no-repeat center;
            background-size: 100% 100%;
          }
        }
        button{
          right: 0;
          width: 16px;/*no*/
          height: 16px;/*no*/
          background: linear-gradient(135deg, #5BE0FF 0%, #2FBDFE 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          i{
            font-size: 13px;/*no*/
          }
        }
      }
      .el-dialog__body{
        background: linear-gradient(135deg, rgba(24, 161, 193, 0.62) 0%, rgba(22, 139, 211, 0.56) 100%);
        border: 1px solid;
        border-image: linear-gradient(135deg, rgba(37, 216, 221, 1), rgba(55, 198, 255, 1)) 1 1;
        .searchItem{
          input{
            background: #1F6483 !important;
            border: 1px solid #55DBFF !important;/*no*/
          }
          .btnInfo {
            button{
              background: linear-gradient(140deg, #31D8E6 0%, #0CBEF3 100%);
              border-radius: 0;
              span{
                color: #fff;
                font-size: 14px;
              }
            }
          }
        }
        .comp-page-table{
          background: transparent;
          padding: 0;
          .el-table {
            border: 1px solid #2BA9CE;/*no*/
            .el-table__header-wrapper{
              background: linear-gradient(135deg, rgba(11, 87, 119, 0.71) 0%, rgba(3, 71, 126, 0.45) 100%);
              border-bottom: 1px solid #2BA9CE;/*no*/
              tr{
                th, div{
                  color: #FFFFFF;
                }
              }
            }
            .row{
              td {
                border-bottom: 1px solid;/*no*/
                border-image: linear-gradient(135deg, rgba(83, 193, 239, 1), rgba(57, 163, 236, 1)) 1 1;
              }
              &:last-child{
                td{
                  border-bottom: none;
                }
              }
            }
          }
          .pagination {
            .el-input__inner{
              background: linear-gradient(135deg, rgba(11, 87, 119, 0.71) 0%, rgba(21, 112, 165, 0.45) 100%);
              border: 1px solid;
              border-image: linear-gradient(135deg, rgba(83, 193, 239, 1), rgba(57, 163, 236, 1)) 1 1;
              color: #fff;
            }
            ul{
              li{
                background: linear-gradient(135deg, rgba(11, 87, 119, 0.71) 0%, rgba(21, 112, 165, 0.45) 100%);
                border: 1px solid;
                border-image: linear-gradient(135deg, rgba(83, 193, 239, 1), rgba(57, 163, 236, 1)) 1 1;
                color: #fff;
                &.active{
                  background: linear-gradient(135deg, #1CABE5 0%, #2A93FF 100%);
                  border: 1px solid;
                  border-image: linear-gradient(135deg, rgba(83, 193, 239, 1), rgba(57, 163, 236, 1)) 1 1;
                }
              }
            }
            button{
              background: linear-gradient(135deg, rgba(11, 87, 119, 0.71) 0%, rgba(21, 112, 165, 0.45) 100%);
              border: 1px solid;
              border-image: linear-gradient(135deg, rgba(83, 193, 239, 1), rgba(57, 163, 236, 1)) 1 1;
              i{
                color: #fff;
              }
            }
            .el-pagination__jump{
              color: #fff;
            }
          }
        }
        .el-input__suffix i{
          color: #fff;
        }
      }
    }
    &.lightPoleDialog {
      background: transparent;
      .el-dialog__header{
        text-align: left;
        padding-left: 0;
        padding-right: 0;
        border-bottom: unset;
        .el-dialog__title{
          padding-left: 15px;/*no*/
          position: relative;
          &:after{
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 7px;/*no*/
            height: 13px;/*no*/
            background: url(./images/img13.png) no-repeat center;
            background-size: 100% 100%;
          }
        }
        button{
          right: 0;
          width: 16px;/*no*/
          height: 16px;/*no*/
          background: #677094;
          display: flex;
          align-items: center;
          justify-content: center;
          i{
            font-size: 13px;/*no*/
          }
        }
      }
      .el-dialog__body{
        background: linear-gradient(135deg, rgba(22, 24, 48, 0.62) 0%, rgba(22, 24, 48, 0.56) 100%);
        border: 1px solid #3F4C70;
        // border-image: linear-gradient(135deg, rgba(22, 24, 48, 1) 0%, rgba(22, 24, 48, 1)) 1 1;
        // border-image: linear-gradient(135deg, rgba(37, 216, 221, 1), rgba(55, 198, 255, 1)) 1 1;
        .searchItem{
          input{
            background: #1F6483 !important;
            border: 1px solid #55DBFF !important;/*no*/
          }
          .btnInfo {
            button{
              background: linear-gradient(140deg, #31D8E6 0%, #0CBEF3 100%);
              border-radius: 0;
              span{
                color: #fff;
                font-size: 14px;
              }
            }
          }
        }
        #lightPoleDetail #card::after {
          background: unset;
        }
        .comp-page-table{
          background: transparent;
          padding: 0;
          .el-table {
            border: 1px solid #2BA9CE;/*no*/
            .el-table__header-wrapper{
              background: linear-gradient(135deg, rgba(11, 87, 119, 0.71) 0%, rgba(3, 71, 126, 0.45) 100%);
              border-bottom: 1px solid #2BA9CE;/*no*/
              tr{
                th, div{
                  color: #FFFFFF;
                }
              }
            }
            .row{
              td {
                border-bottom: 1px solid;/*no*/
                border-image: linear-gradient(135deg, rgba(83, 193, 239, 1), rgba(57, 163, 236, 1)) 1 1;
              }
              &:last-child{
                td{
                  border-bottom: none;
                }
              }
            }
          }
          .pagination {
            .el-input__inner{
              background: linear-gradient(135deg, rgba(11, 87, 119, 0.71) 0%, rgba(21, 112, 165, 0.45) 100%);
              border: 1px solid;
              border-image: linear-gradient(135deg, rgba(83, 193, 239, 1), rgba(57, 163, 236, 1)) 1 1;
              color: #fff;
            }
            ul{
              li{
                background: linear-gradient(135deg, rgba(11, 87, 119, 0.71) 0%, rgba(21, 112, 165, 0.45) 100%);
                border: 1px solid;
                border-image: linear-gradient(135deg, rgba(83, 193, 239, 1), rgba(57, 163, 236, 1)) 1 1;
                color: #fff;
                &.active{
                  background: linear-gradient(135deg, #1CABE5 0%, #2A93FF 100%);
                  border: 1px solid;
                  border-image: linear-gradient(135deg, rgba(83, 193, 239, 1), rgba(57, 163, 236, 1)) 1 1;
                }
              }
            }
            button{
              background: linear-gradient(135deg, rgba(11, 87, 119, 0.71) 0%, rgba(21, 112, 165, 0.45) 100%);
              border: 1px solid;
              border-image: linear-gradient(135deg, rgba(83, 193, 239, 1), rgba(57, 163, 236, 1)) 1 1;
              i{
                color: #fff;
              }
            }
            .el-pagination__jump{
              color: #fff;
            }
          }
        }
        .el-input__suffix i{
          color: #fff;
        }
      }
    }
  }
}

</style>
