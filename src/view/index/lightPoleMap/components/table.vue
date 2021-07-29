<template>
  <div id="lightTable">
    <el-form ref="form" :model="form">
        <el-autocomplete
          placeholder="请输入内容"
          v-model="form.address"
          popper-class="my-autocomplete"
          class="input-with-select"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          @select="handleSelect"
        >
        <el-button slot="append" icon="iconfont icon-xingzhuang" @click="search"></el-button>
        <template slot-scope="{ item }">
          <span class="addr" v-if="item.address">{{ item.address }}</span>
          <span class="addr" v-else>暂无匹配数据</span>
        </template>
        </el-autocomplete>
        <el-input placeholder="请输入内容" v-model="form.address" class="input-with-select" v-if="false">
        <el-button slot="append" icon="iconfont icon-xingzhuang" @click="search"></el-button>
        </el-input>
        <div class="dataList">
        <div class="flexRow title"><span class="flexCenter el-avatar">
          <i class="iconfont icon-lujingaa" />
          </span>{{title}}</div>
        <ul
            class="flexCloumn"
        >
            <li
            class="flexRow"
            :class="{active: activeId === item.imei}"
            v-for="(item, index) in tableData"
            :key="index"
            @click="cureent(item)"
            >
            <div class="flexCenter index">{{index + 1}}</div>
            <span class="adress"><p>{{type === 1 ? item.address: (item.terminalName || item.batteryName)}}</p></span>
            <span class="number">{{type === 1 ? item.usingPower : item.power}}度</span>
            </li>
        </ul>
        </div>
    </el-form>
  </div>
</template>

<script>
import {
  getAddress
} from 'api/controlStrategy';
export default {
  data () {
    return {
      form: {
        address: ''
      },
      restaurants: []
      // activeId: null
    };
  },
  props: {
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    title: '',
    type: {
      type: Number,
      default: 1
    },
    activeId: '',
    address: {
      type: String,
      default: ''
    }
  },
  mounted () {
    this.$nextTick(() => {
    });
  },
  watch: {
    address: {
      deep: true,
      handler (val) {
        console.log('val', val);
        this.form.address = val;
      }
    }
  },
  methods: {
    search () {
      this.$emit('onSearch', this.form);
    },
    cureent (item) {
      this.$emit('onCureent', item);
    },
    async querySearch (queryString, cb) {
      console.log(queryString)
      var restaurants = await this.loadAll('', queryString);
      // var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(restaurants);
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.address.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
      };
    },
    loadAll (area, address = '') {
      let parames = {
        area,
        address
      };
      return getAddress(parames).then(res => {
        if (res.code === '200') {
          let dataList = [];
          res.data.map(data => {
            dataList.push({
              ...data
            });
          });
          return dataList;
        }
      });
    },
    handleSelect (item) {
      this.form.address = item.address;
    }
  }
};
</script>

<style lang="less">
#lightTable{
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 11;
     /deep/.el-autocomplete, .el-input{
       width: 100%;
        input{
          height:50px;
          background:linear-gradient(180deg,rgba(22,24,48,0.94) 0%,rgba(22,24,48,0.81) 100%);
          box-shadow:0px 2px 4px 0px rgba(0,0,0,0.46);/*no*/
          border-radius:4px 0px 0px 4px;/*no*/
          border: none;
          font-size:12px;/*no*/
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(255,255,255,1);
        }
        .el-input-group__append{
          box-sizing: border-box;
          width:46px;
          height: 46px;
          background:linear-gradient(276deg,rgba(37,168,203,1) 0%,rgba(88,160,255,1) 100%);
          border-radius:0px 4px 4px 0px;/*no*/
          border: none;
          padding: 0 15px;
          /deep/i{
            font-size: 24px;
            color: #fff;
          }
        }
      }
      .dataList{
        min-width: 320px;
        margin-top: 10px;
        padding: 15px;
        padding-right: 1px;/*no*/
        background:linear-gradient(180deg,rgba(22,24,48,0.94) 0%,rgba(22,24,48,0.81) 100%);
        box-shadow:0px 4px 7px 0px rgba(2,7,31,0.69);
        border-radius:4px;
        .title{
          font-size:14px;
          font-family:PingFangSC-Semibold,PingFang SC;
          font-weight:600;
          color:rgba(255,255,255,1);
          line-height:12px;
          letter-spacing:1px;
          align-items: center;
          .el-avatar{
            display: flex;
            width:22px;/*no*/
            height:22px;/*no*/
            min-width: 18px;/*no*/
            min-height: 18px;/*no*/
            line-height: 14px;/*no*/
            margin-left:7px;
            background:linear-gradient(135deg,rgba(255,101,33,1) 0%,rgba(255,105,28,1) 100%);
            border-radius:50%;
            margin-right: 7px;
            /deep/i{
              display: flex;
              font-size: 11px;/*no*/
              color: #fff;
            }
          }
        }
        ul{
          margin-top: 16px;
          height: 342px;
          padding-right: 14px;
          overflow-y: auto;
          li{
            position: relative;
            width: 100%;
            padding:10px;/*no*/
            background:linear-gradient(270deg,rgba(52,88,197,0.32) 0%,rgba(70,83,147,0.44) 100%);
            border-radius:4px;
            margin-bottom: 5px;
            cursor: pointer;
            .index{
              padding: 0px 5px;
              background:rgba(18,159,247,1);
              border-radius:4px;/*no*/
              font-size:12px;/*no*/
              font-family:PingFangSC-Regular,PingFang SC;
              font-weight:400;
              color:rgba(255,255,255,1);
            }
            .adress{
              width: 220px;
              font-size:12px;/*no*/
              margin-left: 8px;
              margin-right: 90px;
              font-family:PingFangSC-Regular,PingFang SC;
              font-weight:400;
              color:rgba(255,255,255,1);
              p{
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
              }
            }
            .number{
              position: absolute;
              right: 10px;/*no*/
              top: 50%;
              transform: translateY(-50%);
              height: auto;
              padding: 1px 5px;/*no*/
              background:linear-gradient(135deg,rgba(9,166,208,1) 0%,rgba(10,101,212,1) 100%);
              border-radius:4px;/*no*/
              font-size:12px;/*no*/
              font-family:DINAlternate-Bold,DINAlternate;
              font-weight:bold;
              color:rgba(255,255,255,1);
            }
            &.active{
              background:linear-gradient(270deg,rgba(14,22,63,1) 0%,rgba(22,36,80,1) 100%);
              .index{
                background:rgba(247,18,141,1);
              }
              .number{
                background:linear-gradient(135deg,rgba(248,106,146,1) 0%,rgba(255,0,74,1) 100%);
              }
            }
          }
          &::-webkit-scrollbar {
            width: 3px;/*no*/
          }
        &::-webkit-scrollbar-thumb {
          border-radius: 10px;
          -webkit-box-shadow: inset 0 0 5px rgba(236,239,246,0.2);/*no*/
          background:#4A5B8F;
        }
        &::-webkit-scrollbar-track {
          -webkit-box-shadow: inset 0 0 5px rgba(236,239,246,0.2);/*no*/
          border-radius: 0;
          background:transparent;
        }
        }
      }
}
</style>
