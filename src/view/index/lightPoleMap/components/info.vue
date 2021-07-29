<template>
  <div id="lightInfo">
    <el-row :gutter="10">
      <el-col
        v-for="item in items"
        :key="item.id"
        :style="{width: `${100 / items.length}%`}"
      >
        <div class="container" :class="item.class" :style="{cursor: item.click ? 'pointer' : 'auto'}" @click="item.click">
          <el-avatar :src="item.src || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"></el-avatar>
          <div class="flexCloumn info">
            <div class="title">{{item.name}}</div>
            <div class="number">{{item.value}}<span>{{item.unit}}</span></div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'lightInfo',
  data () {
    return {
      form: {
        a: ''
      },
      activeId: 1
    };
  },
  props: {
    items: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
    });
  },
  methods: {
  }
};
</script>

<style lang="less">
#lightInfo{
    >.el-row{
      justify-content: space-between;
      margin-bottom: 10px;/*no*/
    .el-col{
      .container{
        height: 104px;
        padding: 20px;
        background: rgba(53,77,145,0.49) url('../images/img5.png') no-repeat;
        background-size: 119px 32px;
        background-position: 95% 100%;
        border-radius:4px;/*no*/
        position: relative;
        .el-avatar{
          width:62px;
          height:62px;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          margin-top: -31px;
          left: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          /deep/i{
            font-size: 26px;
          }
        }
        &::after{
          content: '';
          width:8px;
          height:8px;
          box-shadow:2px 2px 5px 0px rgba(24,109,234,0.62);/*no*/
          position: absolute;
          top: 10px;
          left: 10px;
        }
        &.blue{
          .el-avatar{
            background:linear-gradient(138deg,rgba(0,92,234,1) 0%,rgba(71,192,230,1) 100%);
          }
          &::after{
            background:rgba(84,153,255,1);
            box-shadow:2px 2px 5px 0px rgba(24,109,234,0.62);/*no*/
          }
        }
        &.pink{
          .el-avatar{
            background:linear-gradient(138deg,rgba(255,56,123,1) 0%,rgba(255,116,151,1) 100%);
          }
          &::after{
            background:rgba(255,34,131,1);
            box-shadow:2px 2px 5px 0px rgba(237,15,129,0.26);/*no*/
          }
        }
        &.green{
          .el-avatar{
            background:linear-gradient(138deg,rgba(35,203,118,1) 0%,rgba(74,230,206,1) 100%);
          }
          &::after{
            background:rgba(6,237,233,1);
            box-shadow:2px 2px 5px 0px rgba(6,237,233,0.26);/*no*/
          }
        }
        &.orang{
          .el-avatar{
            background:linear-gradient(138deg,rgba(255,94,23,1) 0%,rgba(255,151,51,1) 100%);
          }
          &::after{
            background:rgba(255,150,43,1);
            box-shadow:2px 2px 5px 0px rgba(254,150,42,0.26);/*no*/
          }
        }
        &.purple{
          .el-avatar{
            background:linear-gradient(138deg, #9290FF 0%, #186DEA 100%);
          }
          &::after{
            background:linear-gradient(156deg,rgba(120,73,234,1) 0%,rgba(178,60,252,1) 100%);
            box-shadow:2px 2px 5px 0px rgba(120,73,234,0.26);/*no*/
          }
        }
        .info{
          height: 100%;
          padding-left: 110px;
          justify-content: space-between;
          .title{
            font-size:14px;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(204,215,248,1);
          }
          .number{
            font-size:34px;
            font-family:DINAlternate-Bold,DINAlternate;
            font-weight:bold;
            color:rgba(255,255,255,1);
            line-height:40px;
            letter-spacing:2px;
            text-shadow:0px 2px 4px rgba(24,15,63,1);/*no*/
            word-break: keep-all;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            span{
              font-size: 14px;
            }
          }
        }
      }
    }
  }
}
</style>
