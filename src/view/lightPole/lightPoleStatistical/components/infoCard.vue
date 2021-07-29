<template>
  <div id="lightInfo-new">
    <el-row :gutter="10">
      <el-col
        v-for="item in items"
        :key="item.id"
        :style="{ width: `${100 / items.length}%` }"
      >
        <div
          class="container"
          :class="item.class"
          :style="{ cursor: item.click ? 'pointer' : 'auto' }"
          @click="item.click"
        >
          <div class="pos bcg"></div>
          <div class="pos bcg-linear" :class="item.class"></div>
          <div class="pos content-info">
            <div class="avater-box">
              <p class="deviceName">{{ item.device }}</p>
              <el-avatar
                :src="
                  item.src ||
                  'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
                "
                v-if="item.src"
              ></el-avatar>
              <el-avatar :icon="item.icon" v-else></el-avatar>
            </div>
            <div class="coloum-box">
              <div class="flexCloumn info">
                <div class="title">正常</div>
                <div class="number">
                  {{ item.normal }}
                </div>
              </div>
              <div class="flexCloumn info errorInfo">
                <div class="title error">离线</div>
                <div class="number">
                  {{ item.error }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "lightInfo",
  data() {
    return {
      form: {
        a: "",
      },
      activeId: 1,
    };
  },
  props: {
    items: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  mounted() {
    this.$nextTick(() => {});
  },
  methods: {},
};
</script>

<style lang="less">
#lightInfo-new {
  > .el-row {
    justify-content: space-between;
    margin-bottom: 10px; /*no*/
    .el-col {
      .container {
        height: 104px;
        // padding: 20px;
        background-size: 167px 40px;
        background-repeat: no-repeat;
        background-position: 95% 100%;
        border-radius: 4px; /*no*/
        position: relative;
        border: 1px solid;
        .avater-box {
          position: absolute;
          top: 50%;
          margin-top: -31px;
          // left: 45px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .deviceName {
          font-size: 14px;
          font-family: PingFangSC, PingFangSC-Medium;
          font-weight: 500;
          color: #eff7ff;
          margin-bottom: 10px;
          text-shadow: 0px 2px 4px 0px rgba(13, 39, 74, 0.87);
        }
        .el-avatar {
          width: 36px;
          height: 36px;
          line-height: 36px;
          border-radius: 50%;
          /deep/i {
            
          }
          .iconfont {
            font-size: 20px;
          }
        }
        .pos {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .bcg {
          background: #161d37;
        }
        .bcg-linear {
          opacity: 0.61;
          &.blue {
            background: linear-gradient(
              313deg,
              rgba(70, 118, 255, 0) 66%,
              rgba(81, 106, 229, 0.61)
            );
          }
          &.lightBule {
            background: linear-gradient(
              313deg,
              rgba(70, 118, 255, 0) 66%,
              rgba(83, 124, 255, 0.55) 99%
            );
          }
          &.green {
            background: linear-gradient(
              313deg,
              rgba(70, 118, 255, 0) 66%,
              rgba(81, 229, 185, 0.55) 99%
            );
          }
          &.cyan {
            background: linear-gradient(
              313deg,
              rgba(70, 118, 255, 0) 66%,
              rgba(81, 229, 224, 0.55) 99%
            );
          }
          &.orang {
            background: linear-gradient(
              313deg,
              rgba(70, 118, 255, 0) 66%,
              rgba(229, 176, 81, 0.55) 99%
            );
          }
          &.purple {
            background: linear-gradient(
              313deg,
              rgba(70, 118, 255, 0) 66%,
              rgba(156, 125, 255, 0.55) 99%
            );
          }
          &.deepOrange {
            background: linear-gradient(
              313deg,
              rgba(70, 118, 255, 0) 66%,
              rgba(229, 132, 81, 0.55) 99%
            );
          }
          &.painters {
            background: linear-gradient(
              313deg,
              rgba(70, 118, 255, 0) 66%,
              rgba(32, 255, 248, 0.55) 99%
            );
          }
        }
        .content-info {
          padding: 20px;
        }

        &.blue {
          border: 1px solid;
          border-image: linear-gradient(
              128deg,
              #898cff 23%,
              rgba(22, 100, 213, 0) 72%
            )
            1 1;
          background-image: url("../images/blue.png");
          .el-avatar {
            background: rgba(81, 106, 229, 1);
          }
        }
        &.lightBule {
          background-image: url("../images/lightBule.png");
          border-image: linear-gradient(
              128deg,
              #5191ff 23%,
              rgba(22, 100, 213, 0) 72%
            )
            1 1;
          .el-avatar {
            background: rgba(79, 120, 255, 1);
          }
        }
        &.green {
          background-image: url("../images/green.png");
          border-image: linear-gradient(
              128deg,
              #51e5e4 23%,
              rgba(22, 100, 213, 0) 72%
            )
            1 1;
          .el-avatar {
            background: rgba(100, 211, 141, 1);
          }
        }
        &.cyan {
          background-image: url("../images/cyan.png");
          border-image: linear-gradient(
              128deg,
              #51a5e5 23%,
              rgba(22, 100, 213, 0) 72%
            )
            1 1;
          .el-avatar {
            background: rgba(45, 193, 171, 1);
          }
        }
        &.orang {
          border-image: linear-gradient(
              128deg,
              #e58351 23%,
              rgba(22, 100, 213, 0) 72%
            )
            1 1;
          background-image: url("../images/orang.png");
          .el-avatar {
            background: rgba(214, 151, 0, 1);
          }
        }
        &.purple {
          background-image: url("../images/purple.png");
          border-image: linear-gradient(
              128deg,
              #a068ff 23%,
              rgba(22, 100, 213, 0) 72%
            )
            1 1;
          .el-avatar {
            background: rgba(125, 124, 255, 1);
          }
        }
        &.deepOrange {
          background-image: url("../images/deepOrange.png");
          border-image: linear-gradient(
              128deg,
              #e58c51 23%,
              rgba(22, 100, 213, 0) 72%
            )
            1 1;
          .el-avatar {
            background: rgba(230, 119, 56, 1);
          }
        }
        &.painters {
          background-image: url("../images/painters.png");
          border-image: linear-gradient(
              128deg,
              #51e5e3 23%,
              rgba(22, 100, 213, 0) 72%
            )
            1 1;
          .el-avatar {
            background: rgba(73, 214, 252, 1);
          }
        }
        .coloum-box {
          padding-left: 80px;
          display: flex;
          height: 100%;
          width: 100%;
          margin-top: 0.07rem;
          justify-content: space-between;
        }
        .info {
          height: 100%;
          justify-content: space-between;
          align-items: center;
          .title {
            font-size: 10px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(130, 252, 255, 1);
            transform: scale(0.9);
            &.error {
              color: rgba(255, 140, 87, 1);
            }
          }
          .number {
            font-size: 22px;
            font-family: DINAlternate-Bold, DINAlternate;
            font-weight: bold;
            color: rgba(255, 255, 255, 1);
            line-height: 40px;
            letter-spacing: 2px;
            word-break: keep-all;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            span {
              font-size: 14px;
            }
          }
          &.errorInfo {
            // margin-left: 39px;
          }
        }
      }
    }
  }
}
</style>
