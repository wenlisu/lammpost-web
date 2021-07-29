/* eslint-disable camelcase */
<template>
  <div id="productMain">
    <el-row class="flexRow mainContainer" :gutter="10">
      <el-col
      :span="8"
      class="content"
      v-for="(item, index) in tableData"
      :key="`${item.id} - ${index}`"
      >
        <div
          @click.prevent.stop="goProductPage(item)"
          :class="{
            'active': item.productNo === productNo
          }"
        >
          <div class="title">
            {{item.productName}}<span>{{item.deviceTypeName}}</span>
            <div class="flexRow tools" v-if="toolsShow">
              <div class="flexCenter detail" @click.prevent.stop="creatProduct(item.id)"><i class="iconfont icon-bianji1" /></div>
              <div class="flexCenter del" @click.prevent.stop="delProduct(item.id)"><i class="iconfont icon-shanchu1" /></div>
            </div>
          </div>
          <FormItemText
            :layout="[{
              id: 'terminalName',
              label: '平台类型',
              value: item.platformName,
              span: 12
            }, {
              id: 'terminalName',
              label: '通信协议',
              value: item.protocolName,
              span: 12
            }, {
              id: 'terminalName',
              label: '创建时间',
              value: item.createTime,
              class: 'noBottom',
              span: 12
            }, {
              id: 'deviceCount',
              label: '设备总数',
              custom: true,
              class: 'noBottom',
              span: 12
            }]"
            labelWidth="0px"
          >
            <template v-slot:deviceCount>
              <el-tooltip class="productTotel" effect="light" placement="top-start">
                <div slot="content">{{item.deviceCount}}</div>
                <div class="productTotel">{{item.deviceCount}}</div>
              </el-tooltip>
            </template>
          </FormItemText>
        </div>
      </el-col>
    </el-row>
    <el-pagination
      @size-change="onPageSizeChange"
      @current-change="onCurrentChange"
      :current-page.sync="page.current"
      :page-size="page.pageSize"
      layout="total, prev, pager, next"
      :total="page.total">
    </el-pagination>
  </div>
</template>

<script>
import Flex from '@/components/flex';
import FormItemText from '@/components/formItemText/formItemText';
import dialogCont from '@/components/adminDialog';
import FormItem from '@/components/adminFormItem';
import Page from './page';
import { routePush } from '@/util/util';
import {
  getDeviceProductForPage,
  getDeviceProductParam,
  deleteDeviceProduct,
  insertDeviceProduct,
  updateDeviceProduct,
  getDeviceProductDtl
} from 'api/admin';
import {
  getSensorTypeSelectList,
  getDeviceTypeSelectList
} from 'api/index';
export default {
  name: 'productManagement',
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    page: {},
    toolsShow: {
      type: Boolean,
      default: true
    },
    productNo: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // productNo: null,
      // 分页
      tableCols: [
        { label: '设备编号',
          prop: 'imei'
        }
      ]
    }
  },
  mounted () {
    this.$nextTick(() => {
      // this.productNo = null;
    })
  },
  computed: {
    routeName () {
      return this.$route.name
    }
  },
  components: {
    Flex,
    FormItemText,
    dialogCont,
    FormItem,
    Page
  },
  methods: {
    // 分页切换页面
    onCurrentChange (val) {
      this.$emit('onCurrentChange', val);
    },
    onPageSizeChange (val) {
      this.$emit('onPageSizeChange', val);
    },
    goProductPage (item) {
      this.$emit('goProductPage', item);
    },
    creatProduct (id, inputDisabled = false) {
      this.$emit('creatProduct', {id, inputDisabled});
    },
    delProduct (id) {
      this.$emit('delProduct', id);
    }
  }
}
</script>

<style lang="less">
  #productMain{
    margin-top: 10px;/*no*/
    .mainContainer{
      flex-wrap: wrap;
      margin-bottom: 15px;/*no*/
      .content {
        > div{
          margin: 0 0 10px 0;/*no*/
          padding: 10px;/*no*/
          background:rgba(255,255,255,1);
          box-shadow:0px 4px 6px 0px rgba(221,221,221,1);/*no*/
          cursor: pointer;
          &.active{
            border: 1px solid #4373df;/*no*/
          }
          .title{
            font-size:14px;/*no*/
            font-family:PingFangSC-Semibold,PingFang SC;
            font-weight:600;
            color:rgba(80,80,80,1);
            position: relative;
            margin-bottom: 15px;/*no*/
            span{
              padding: 1px 7px;/*no*/
              font-size:12px; /*no*/
              font-family:PingFangSC-Regular,PingFang SC;
              font-weight:400;
              color:rgba(255,255,255,1);
              background:linear-gradient(270deg,rgba(40,134,228,1) 0%,rgba(67,115,223,1) 100%);
              box-shadow:0px 2px 4px 0px rgba(107,190,238,0.5);/*no*/
              border-radius:9px;/*no*/
              margin-left: 10px;/*no*/
            }
            .tools{
              position: absolute;
              top: 50%;
              right: 0;
              transform: translateY(-50%);
              >div{
                width:18px;/*no*/
                height:18px;/*no*/
                background:rgba(240,249,255,1);
                border-radius:3px;/*no*/
                cursor: pointer;
                i{
                  font-size: 11px;/*no*/
                  color: #4171E2;
                }
                &.del{
                  margin-left: 5px;/*no*/
                  background:rgba(255,245,240,1);
                  i{
                    color: #F96B55;
                  }
                }
              }
            }
          }
          #formItemText{
            .el-form-item__content{
              color: #505050;
              font-size:12px;/*no*/
              font-family:PingFangSC-Regular,PingFang SC;
              font-weight:400;
            }
            .productTotel{
              display: inline-block;
              font-size:17px;/*no*/
              font-family:DINAlternate-Bold,DINAlternate;
              font-weight:bold;
              color:rgba(217,79,7,1);
              line-height:20px;/*no*/
              letter-spacing:1px;/*no*/
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
            }
          }
        }
        &:nth-of-type(2n) {
          .title{
            span{
              background:linear-gradient(270deg,rgba(22,168,172,1) 0%,rgba(74,202,151,1) 100%);
            }
          }
        }
      }
    }
    .el-pagination{
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }
  }
</style>
