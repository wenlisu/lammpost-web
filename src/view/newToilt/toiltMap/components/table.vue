<template>
  <div id="toiltTable">
    <el-form ref="form" :model="form">
      <!-- <el-autocomplete
          placeholder="请输入内容"
          v-model="form.ledDeviceName"
          popper-class="my-autocomplete"
          class="input-with-select"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          @select="handleSelect"
        >
        <el-button slot="append" icon="iconfont icon-xingzhuang" @click="search"></el-button>
        <template slot-scope="{ item }">
          <span class="addr" v-if="item.ledDeviceName">{{ item.ledDeviceName }}</span>
          <span class="addr" v-else>暂无匹配数据</span>
        </template>
        </el-autocomplete> -->
      <!-- <el-input placeholder="请输入内容" v-model="form.ledDeviceName" class="input-with-select" v-if="false">
        <el-button slot="append" icon="iconfont icon-xingzhuang" @click="search"></el-button>
        </el-input> -->

      <div class="dataList">
        <i class="el-icon-close close-icon"></i>
        <div class="flexRow title">
          <p class="titleText">{{ title }}</p>
        </div>
        <ul class="tabsChange">
          <li
            :class="iaActive == index ? 'active' : 'noActive'"
            v-for="(item, index) in tabsChangeData"
            :key="index"
            @click="handleChangeTabs(index)"
          >
            <span>{{ item.name }}</span>
            <!-- <i class="el-icon-close"></i> -->
          </li>
        </ul>
        <div class="tabsList">
          <div class="tabsDrop">
            <span>广东省佛山市均安镇文化广场</span>
            <!-- <i class="el-icon-caret-bottom caret-icon"></i> -->
          </div>
          <div class="tableBox">
            <el-table :data="toiltTableData">
              <el-table-column prop="type" label="类型" align="center">
              </el-table-column>
              <el-table-column prop="all" label="总数" align="center">
              </el-table-column>
              <el-table-column
                prop="normal"
                label="正常"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="abnormal"
                label="异常"
                align="center"
              ></el-table-column>
            </el-table>
          </div>
          <div class="tableSearch">
            <el-input
              suffix-icon="el-icon-search"
              v-model="searchVal"
            ></el-input>
          </div>
          <!-- 列表 -->
          <div
            class="itemList"
            v-for="(item, idx) in toiltTableData"
            :key="'k' + idx"
          >
            <div class="flexBox">
              <div class="listLeft"></div>
              <div class="listRight">
                <p class="rTOP">
                  <span class="t1">{{ item.type }}</span>
                  <span class="t2" :class="curToiletStatus == 2 ? 't3' : ''">{{ curToiletStatus | toiletStatusChange }}</span>
                </p>
                <p class="rBottom">地址：{{item.address}}</p>
              </div>
            </div>
            <div class="itemLine"></div>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      iaActive: 0,
      tabsChangeData: [
        {
          name: "公厕汇总"
        },
       /*  {
          name: "车辆列表"
        },
        {
          name: "人员分布"
        } */
      ],
      form: {
        ledDeviceName: undefined,
        imei: undefined,
        power: undefined,
        volume: undefined,
        updateTime: undefined,
        brightness: undefined
      },
      restaurants: [],
      toiltTableData: [
        {
          /* status: 1 //流畅
          status: 2 //拥堵 */
          type: "公园公厕",
          all: 1,
          normal: 1,
          abnormal: 0,
          status: 1,
          address: "广东省佛山市顺德区永安路(均安镇文化广场)"
        },
      /*   {
          type: "商场公厕",
          all: 9,
          normal: 3,
          abnormal: 6,
          status: 2,
          address: "广州市越秀区中山五路219号"
        } */
      ],
      searchVal: ""
      // activeId: null
    };
  },
  props: {
    tableData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    curToiletStatus: {
      type: Number,
      default: 1
    },
    title: "",
    type: {
      type: Number,
      default: 1
    },
    activeId: "",
    ledDeviceName: "",
    imei: ""
  },
  created() {
    // console.log(this.$route.params.imei)
    // this.tableData.forEach((item, index) => {
    //   if (item.imei === this.$route.params.imei) {
    //     this.cureent(tableData[index])
    //   }
    // })
  },
  mounted() {
    this.$nextTick(() => {
      this.restaurants = this.tableData;
      console.log(this.tableData);
    });
  },
  watch: {
    ledDeviceName: {
      deep: true,
      handler(val) {
        this.form.ledDeviceName = val;
      }
    },
    imei: {
      deep: true,
      handler(val) {
        this.form.imei = val;
      }
    },
    tableData: {
      deep: true,
      handler(val) {
        this.restaurants = val;
        if (JSON.stringify(this.$route.params) !== "{}") {
          this.tableData.forEach((item, index) => {
            if (item.imei === this.$route.params.imei) {
              this.cureent(this.tableData[index]);
            } else {
              console.log("找不到该设备！");
            }
          });
        }
      }
    }
  },
  methods: {
    handleChangeTabs(index) {
      this.iaActive = index;
    },
    search() {
      this.$emit("onSearch", this.form);
    },
    cureent(item) {
      this.$emit("onCureent", item);
    },
    async querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.ledDeviceName
            .toLowerCase()
            .indexOf(queryString.toLowerCase()) > -1
        );
      };
    },
    handleSelect(item) {
      this.form = {
        ...item
      };
    }
  },
  filters: {
    toiletStatusChange(val) {
      switch (val) {
        case 1:
          return "流畅";
          break;
        case 2:
          return "拥堵";
        default:
          break;
      }
    }
  }
};
</script>

<style lang="less">
#toiltTable {
  position: absolute;
  top: 10px;
  left: 10px;
  .dataList {
    .tabsChange {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-left: 4px;
      margin-right: 4px;
      margin-top: 10px;
      li {
        padding: 6px;
        border-radius: 2px 2px 0px 0px;
        font-size: 14px;
        font-family: Adobe Heiti Std;
        font-weight: normal;
        text-align: center;
        line-height: 26px;
        border-right: 1px solid #0f2651;
        cursor: pointer;
      }
      .active {
        background: #27608d;
        color: #24e5ea;
      }
      .noActive {
        background: #172641;
        box-shadow: 0px 1px 3px 0px rgba(255, 255, 255, 0.3);
        color: #fefefe;
      }
    }
    position: relative;
    min-width: 333px;
    min-height: 592px;
    margin-top: 60px;
    margin-left: 75px;
    // padding: 15px;
    background: #0f2651;
    border: 1px solid #0d182d;
    opacity: 0.95;
    border-radius: 2px;
    .close-icon {
      position: absolute;
      right: 5px;
      top: 5px;
      color: #24e5ea;
      font-size: 20px;
    }
    .title {
      width: 125px;
      height: 36px;
      margin: 0 auto;
      margin-top: 15px;
      background: url("../images/img-tab.png") no-repeat;
      background-size: 100% 100%;
      background-position: center;
      font-size: 18px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #5cf4f5;
      line-height: 36px;
      .titleText {
        width: 100%;
        text-align: center;
      }
    }
    .tabsList {
      background: rgba(39, 96, 141, 0.5);
      margin-left: 4px;
      margin-right: 4px;
      padding: 0 10px;
      .tabsDrop {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        line-height: 34px;
        span {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #5cf4f5;
        }
        .caret-icon {
          font-size: 18px;
          color: #5cf4f5;
        }
      }
      .tableBox {
        /deep/.el-table {
          border: 1px solid #5cf4f5;
          background: #27608d;
        }
        /deep/.el-table th,
        .el-table tr {
          background: transparent;
        }
        /deep/.el-table th > .cell {
          color: #5cf4f5;
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
        }
        /deep/.el-table .cell {
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #fefefe;
        }
        /deep/.el-table td,
        .el-table th.is-leaf {
          border-bottom: none;
        }
        /deep/.el-table tbody tr:hover > td {
          background-color: transparent;
        }
      }
      .tableSearch {
        margin-top: 12px;
        /deep/.el-input__inner {
          border: 1px solid #5cf4f5;
          background: #27608d;
          color: #ffffff;
          .el-input__icon {
            color: #ffffff;
          }
        }
      }
      .itemList {
        margin-top: 12px;
        .flexBox {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .listLeft {
            width: 32px;
            height: 32px;
            background: url("../images/icon-person.png") no-repeat;
            background-size: 100% 100%;
            background-position: center;
          }
          .listRight {
            width: 100%;
            margin-left: 4px;
            .rTOP {
              display: flex;
              justify-content: space-between;
              align-items: center;
              .t1 {
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #5cf4f5;
              }
              .t2 {
                font-size: 12px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #0ad687;
              }
              .t3 {
                font-size: 12px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #fe3a20;
              }
            }
            .rBottom {
              font-size: 12px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: #ffffff;
              margin-top: 2px;
            }
          }
        }
        .itemLine {
          width: 100%;
          height: 1px;
          margin-top: 12px;
          background: linear-gradient(
            90deg,
            rgba(92, 244, 245, 0) 0%,
            rgba(92, 244, 245, 0.99) 49%,
            rgba(92, 244, 245, 0) 100%
          );
        }
      }
    }
    // ul {
    //   // margin-top: 16px;
    //   height: 342px;
    //   // padding-right: 14px;
    //   overflow-y: auto;
    //   li {
    //     position: relative;
    //     width: 100%;
    //     padding: 10px; /*no*/
    //     background: linear-gradient(
    //       270deg,
    //       rgba(52, 88, 197, 0.32) 0%,
    //       rgba(70, 83, 147, 0.44) 100%
    //     );
    //     border-radius: 4px;
    //     margin-bottom: 5px;
    //     cursor: pointer;
    //     .index {
    //       padding: 0px 5px;
    //       background: rgba(18, 159, 247, 1);
    //       border-radius: 4px; /*no*/
    //       font-size: 12px; /*no*/
    //       font-family: PingFangSC-Regular, PingFang SC;
    //       font-weight: 400;
    //       color: rgba(255, 255, 255, 1);
    //     }
    //     .adress {
    //       width: 220px;
    //       font-size: 12px; /*no*/
    //       margin-left: 8px;
    //       margin-right: 90px;
    //       font-family: PingFangSC-Regular, PingFang SC;
    //       font-weight: 400;
    //       color: rgba(255, 255, 255, 1);
    //       p {
    //         overflow: hidden;
    //         text-overflow: ellipsis;
    //         white-space: nowrap;
    //       }
    //     }
    //     .number {
    //       position: absolute;
    //       right: 10px; /*no*/
    //       top: 50%;
    //       transform: translateY(-50%);
    //       height: auto;
    //       padding: 1px 5px; /*no*/
    //       background: linear-gradient(
    //         135deg,
    //         rgba(9, 166, 208, 1) 0%,
    //         rgba(10, 101, 212, 1) 100%
    //       );
    //       border-radius: 4px; /*no*/
    //       font-size: 12px; /*no*/
    //       font-family: DINAlternate-Bold, DINAlternate;
    //       font-weight: bold;
    //       color: rgba(255, 255, 255, 1);
    //     }
    //     &.active {
    //       background: linear-gradient(
    //         270deg,
    //         rgba(14, 22, 63, 1) 0%,
    //         rgba(22, 36, 80, 1) 100%
    //       );
    //       .index {
    //         background: rgba(247, 18, 141, 1);
    //       }
    //       .number {
    //         background: linear-gradient(
    //           135deg,
    //           rgba(248, 106, 146, 1) 0%,
    //           rgba(255, 0, 74, 1) 100%
    //         );
    //       }
    //     }
    //   }
    //   &::-webkit-scrollbar {
    //     width: 3px; /*no*/
    //   }
    //       &::-webkit-scrollbar-thumb {
    //     border-radius: 10px;
    //     -webkit-box-shadow: inset 0 0 5px rgba(236, 239, 246, 0.2); /*no*/
    //     background: #4a5b8f;
    //   }
    //       &::-webkit-scrollbar-track {
    //     -webkit-box-shadow: inset 0 0 5px rgba(236, 239, 246, 0.2); /*no*/
    //     border-radius: 0;
    //     background: transparent;
    //   }
    // }
  }
}
</style>
