<template>
  <div class="detail-wrap">
    <div class="info-title">
      <div class="main-text">
        <div class="address">
          <span>{{ name }}</span>
        </div>
        <div class="detail-txt" @click="viewDetail">详情</div>
      </div>
    </div>
    <div class="cumulative-box">
      <div class="status crawed" v-if="femaleUseCount + maleUseCount > femaleSum + maleSum - 1">
        <div class="status-inner crawed-inner">
          <span>拥挤</span>
        </div>
      </div>
      <div class="status smooth" v-else>
        <div class="status-inner smooth-inner">
          <span>流畅</span>
        </div>
      </div>
      <div class="num">
        <p class="tip">今日累计</p>
        <p class="today-num">
          {{ Number(female["flowIn"] || 0) + Number(male["flowIn"] || 0) }}人
        </p>
      </div>
    </div>
    <div class="info-box">
      <div class="outer-box info-box-1">
        <div class="gif">
          <img src="../../images/man.gif" alt="" srcset="" />
        </div>
        <div class="sex-progress man">
          <span>男</span>
          <div class="progress-box">
            <el-progress
              :text-inside="false"
              :stroke-width="10"
              :percentage="maleStatus"
              :format="
                (percentage) => {
                  return this.format(percentage, 1);
                }
              "
            ></el-progress>
          </div>
          <p class="progress-text">{{`${maleUseCount}/${(male["pit"] && male["pit"].length) || 0}`}}</p>
        </div>
        <div class="info-text">
          <FormItemText :layout="manFormItems" labelWidth="0px" />
        </div>
      </div>
      <div class="outer-box info-box-2">
        <div class="gif">
          <img src="../../images/women.gif" alt="" srcset="" />
        </div>
        <div class="sex-progress women">
          <span>女</span>
          <div class="progress-box">
            <el-progress
              :text-inside="false"
              :stroke-width="10"
              :percentage="femaleStatus"
              :format="
                (percentage) => {
                  return this.format(percentage, 0);
                }
              "
            ></el-progress>
          </div>
          <p class="progress-text">{{ `${femaleUseCount}/${(female["pit"] && female["pit"].length) || 0}`}}</p>
        </div>
        <div class="info-text">
          <FormItemText :layout="womenFormItems" labelWidth="0px" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FormItemText from "@/components/formItemText";
export default {
  components: {
    FormItemText,
  },
  props: {
    detailData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  watch: {
    detailData: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        console.log(newValue);
        this.name = newValue["name"] || "";
        this.female = newValue["female"] || "";
        this.male = newValue["male"] || "";
        this.toildId = newValue["id"] || "";
        if (newValue["female"]) {
          this.womenFormItems.map((item) => {
            item.value = newValue.female[item.id] || item.value;
          });
          let hasUseCount = 0; //正在使用坑位
          newValue["female"]["pit"].map((item) => {
            if (item.state == 1) {
              hasUseCount += 1;
            }
          });
          this.femaleUseCount = hasUseCount;
          this.femaleSum = newValue["female"]["pit"].length;
          this.femaleStatus = Number(
            (hasUseCount / newValue["female"]["pit"].length) * 100
          ).toFixed(2);
        } else {
          this.femaleStatus = 0;
        }
        if (newValue["male"]) {
          this.manFormItems.map((item) => {
            item.value = newValue.male[item.id] || item.value;
          });
          let hasUseCount = 0; //正在使用坑位
          newValue["male"]["pit"].map((item) => {
            if (item.state == 1) {
              hasUseCount += 1;
            }
          });
          this.maleUseCount = hasUseCount;
          this.maleSum = newValue["male"]["pit"].length;
          this.maleStatus = Number(
            (hasUseCount / newValue["male"]["pit"].length) * 100
          ).toFixed(2);
        } else {
          this.maleStatus = 0;
        }
      },
    },
  },
  data() {
    return {
      name: "",
      toildId: "",
      female: {},
      male: {},
      femaleSum: 0,
      maleSum: 0,
      totalFlow: 0,
      maleStatus: 0,
      femaleStatus: 0,
      maleUseCount: 0,
      femaleUseCount: 0,
      manFormItems: [
        {
          id: "temperature",
          label: "温度",
          value: "",
          span: 8,
          unit:'℃'
        },
        {
          id: "humidity",
          label: "湿度",
          value: "",
          span: 8,
          unit:'%'
        },
        {
          id: "nh3",
          label: "氨气",
          value: "",
          span: 8,
          unit:'PPM'
        },
        {
          id: "h2s",
          label: "硫化氢",
          value: "",
          span: 8,
          unit:'PPM'
        },
        {
          id: "isStartText",
          label: "排风扇",
          value: "开",
          span: 8,
        },
        {
          id: "isEndText",
          label: "打扫次数",
          value: "5",
          span: 8,
        },
        {
          id: "agreePercentage",
          label: "保洁人员",
          value: "肖杰",
          span: 8,
        },
      ],
      womenFormItems: [
        {
          id: "temperature",
          label: "温度",
          value: "",
          span: 8,
          unit:'℃'
        },
        {
          id: "humidity",
          label: "湿度",
          value: "",
          span: 8,
          unit:'%'
        },
        {
          id: "nh3",
          label: "氨气",
          value: "",
          span: 8,
          unit:'PPM'
        },
        {
          id: "h2s",
          label: "硫化氢",
          value: "",
          span: 8,
          unit:'PPM'
        },
        {
          id: "isStartText",
          label: "排风扇",
          value: "开",
          span: 8,
        },
        {
          id: "isEndText",
          label: "打扫次数",
          value: "5",
          span: 8,
        },
        {
          id: "agreePercentage",
          label: "保洁人员",
          value: "肖岚",
          span: 8,
        },
      ],
    };
  },
  methods: {
    viewDetail() {
      this.$router.push({
        path: "/toiltDetail",
        query: {
          code: this.toildId,
        },
        params: {
          code: this.toildId
        }
      });
    },
    // 小数转分数 近似递归
    format(percentage, sex) {
      return ''
      // if (sex == 0 && this.female["pit"] && this.female["pit"].length) {
      //   return `${this.femaleUseCount}/${this.female["pit"].length}`;
      // }
      // if (sex == 1 && this.male["pit"] && this.male["pit"].length) {
      //   return `${this.maleUseCount}/${this.male["pit"].length}`;
      // }
      // var denominator = 100; //初始化分母
      // var numerator = percentage; //初始化分子
      // var bigger = 0;
      // function recursion() {
      //   bigger = denominator > numerator ? denominator : numerator;
      //   for (let i = bigger; i > 1; i--) {
      //     if (
      //       Number.isInteger(numerator / i) &&
      //       Number.isInteger(denominator / i)
      //     ) {
      //       numerator = numerator / i;
      //       denominator = denominator / i;
      //       recursion();
      //     }
      //   }
      // }
      // recursion();
      // return `${numerator}/${denominator}`;
    },
  },
};
</script>

<style scoped lang="less">
.detail-wrap {
  width: 480px;
  // height: 567px;
  padding: 20px;
  background: linear-gradient(
    180deg,
    rgba(0, 82, 141, 0.15),
    rgba(0, 52, 97, 0.97)
  );
  border: 1px solid;
  border-image: linear-gradient(180deg, #04a8f3, rgba(85, 182, 255, 0.34)) 1 1;

  /*标题样式 start*/
  .info-title {
    .main-text {
      display: flex;
      justify-content: space-between;
      // margin-top: 30px;
    }
    .address {
      position: relative;
      span {
        font-size: 26px;
        font-family: YouSheBiaoTiHei;
        text-align: left;
        color: #ffffff;
        letter-spacing: 1px;
        text-shadow: 0px 2px 4px 0px #1c4696;
      }
      &::after {
        position: absolute;
        bottom: -8px;
        left: 0;
        content: "";
        display: inline-block;
        width: 100%;
        height: 8px;
        background-image: url(../../images/titleLine_2.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }
    .detail-txt {
      font-size: 16px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: left;
      color: #74d9ff;
      letter-spacing: 1px;
      cursor: pointer;
      &::after {
        content: "";
        display: inline-block;
        width: 8px;
        height: 8px;
        border: 1px solid #74d9ff;
        border-left: 1px solid transparent;
        border-bottom: 1px solid transparent;
        transform: rotate(45deg);
        margin-left: 6px;
      }
    }
  }
  /*标题样式 end*/

  .cumulative-box {
    display: flex;
    align-items: center;
    margin-top: 12px;
    .status {
      width: 165px;
      // height: 58px;
      padding: 7px 15px;
      margin-left: 14px;
      margin-right: 28px;
      text-align: center;

      .status-inner {
        width: 100%;
        height: 44px;
      }
      span {
        font-size: 20px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 600;
        line-height: 44px;
        letter-spacing: 1px;
        text-align: center;
      }
    }
    .smooth {
      background: linear-gradient(
        270deg,
        rgba(19, 34, 81, 0),
        rgba(19, 106, 186, 0.74) 54%,
        rgba(42, 70, 138, 0) 100%
      );
      border: 2px solid;
      border-image: linear-gradient(
          270deg,
          rgba(62, 201, 255, 0) 4%,
          #1ebfff 46%,
          rgba(29, 153, 255, 0) 91%
        )
        2 2;
    }
    .smooth-inner {
      background: linear-gradient(
        270deg,
        rgba(19, 34, 81, 0),
        rgba(74, 204, 255, 0.45) 53%,
        rgba(42, 70, 138, 0) 100%
      );
      border: 2px solid;
      border-image: linear-gradient(
          270deg,
          rgba(62, 201, 255, 0) 4%,
          #1ebfff 46%,
          rgba(29, 153, 255, 0) 91%
        )
        2 2;
      span {
        color: #45ffdb;
      }
    }
    .crawed {
      background: linear-gradient(
        270deg,
        rgba(255, 93, 93, 0),
        rgba(255, 93, 93, 0.45) 53%,
        rgba(255, 93, 93, 0) 100%
      );
      border: 2px solid;
      border-image: linear-gradient(
          270deg,
          rgba(255, 93, 93, 0) 4%,
          #ff5d5d 46%,
          rgba(255, 93, 93, 0) 91%
        )
        2 2;
    }
    .crawed-inner {
      background: linear-gradient(
        270deg,
        rgba(234, 84, 84, 0),
        rgba(234, 84, 84, 0.45) 53%,
        rgba(234, 84, 84, 0) 100%
      );
      border: 2px solid;
      border-image: linear-gradient(
          270deg,
          rgba(234, 84, 84, 0) 4%,
          #ea5454 46%,
          rgba(234, 84, 84, 0) 91%
        )
        2 2;
      span {
        color: #fd9797;
      }
    }
    .num {
      width: 143px;
      height: 93px;
      background-image: url(../../images/detailNum.png);
      background-size: 100% 100%;
      background-repeat: no-repeat;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      .tip {
        color: #ffffff;
        font-size: 14px;
        text-align: center;
      }
      .today-num {
        font-size: 30px;
        font-family: PangMenZhengDao;
        text-align: left;
        color: #ffffff;
        line-height: 34px;
        text-align: center;
      }
    }
  }

  .info-box {
    margin-top: 10px;
    width: 100%;
    .outer-box {
      width: 100%;
      height: 186px;
      background-image: url(../../images/detailBorder1.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      position: relative;
      padding-top: 14px;
      padding-left: 14px;
      padding-right: 21px;
    }
    .gif {
      width: 58px;
      height: 60px;
      position: absolute;
      left: -8px;
      top: -8px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .info-box-1 {
    }
    .info-box-2 {
      margin-top: 22px;
    }
    .sex-progress {
      width: calc(100% - 50px);
      display: flex;
      margin-left: 66px;
      margin-right: 45px;
      align-items: center;
      > span {
        color: #ffffff;
        font-size: 20px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        margin-right: 10px;
      }
      .progress-text {
        font-size: 18px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        color: #61b1e1;
      }
    }
    // 进度条
    .progress-box {
      // flex: 9;
      width: 252px;
      /deep/.el-progress-bar {
        width: 100%;
        padding-right: 10px;
        .el-progress-bar__outer {
          
          border-radius: 0%;
          background: rgba(9, 116, 185, 0.24);
        }
        .el-progress-bar__inner {
          border-radius: 0%;
          background: linear-gradient(
            270deg,
            #5befff,
            rgba(39, 167, 231, 0.64)
          );
        }
      }
      /deep/.el-progress__text {
        font-size: 18px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        color: #61b1e1;
      }
      
    }
    .sex-progress.women {
      /deep/.el-progress-bar {
        width: 100%;
        padding-right: 10px;
        .el-progress-bar__outer {
          border-radius: 0%;
          background: rgba(9, 116, 185, 0.24);
        }
        .el-progress-bar__inner {
          border-radius: 0%;
          background: linear-gradient(
            270deg,
            rgba(255, 180, 180, 0.84) 2%,
            rgba(255, 64, 52, 0.64)
          );
        }
      }
    }
    .info-text {
      margin-top: 14px;
      #formItemText {
        color: #ffffff;
      }
    }
  }
}
</style>