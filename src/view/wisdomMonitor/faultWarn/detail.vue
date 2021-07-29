/* eslint-disable camelcase */
<template>
  <div id='faultWarnDetail' >
    <card title="流程节点">
      <el-tabs v-model="activeTabs" @tab-click="handleClick">
        <el-tab-pane label="工单信息" name="1">
          <FormItemText
            :layout="gdItems"
            labelWidth="0px"
          >
          </FormItemText>
        </el-tab-pane>
        <el-tab-pane label="相关告警" name="2">
          <FormItemText
            :layout="jgItems"
            labelWidth="0px"
          >
          </FormItemText>
        </el-tab-pane>
      </el-tabs>
    </card>
    <card>
      <div class="flexRow nodeContainer">
        <div
          class="flexRow itemMainRow"
          v-for="(items, index) in nodeItems"
          :key="index"
        >
          <div
            class="flexRow itemMain"
            v-for="(item, idx) in items"
            :key="(index + 1) * (idx + 1)"
            :class="item.type === 'completeNode' ? 'lastNodeItem' : ''"
          >
            <div
              class="item"
            >
            <div class="flexCloumn info">
              <div class="flexRow">
                <span class="infoTitle">处理人：</span><span>{{item.dealer}}</span></div>
              <div class="flexRow"><span class="infoTitle">处理时间：</span><span>{{item.dealTime}}</span></div>
              <div class="flexRow"><span class="infoTitle">备注说明：</span><span>{{item.dealNote}}</span></div>
            </div>
            <div class="foot">
              {{getTitle(item.type)}}
            </div>
            </div>
          </div>
        </div>
      </div>
    </card>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex';
import FormItemText from '@/components/formItemText/formItemText';
import card from '@/view/lightPole/lightPoleStatistical/components/card';
import {
  getWorkOrderMgt
} from 'api/wisdomMonitor';
export default {
  name: 'faultWarnDetail',
  data () {
    return {
      activeTabs: '1',
      form: {
        a: 1
      },
      gdItems: [{
        id: 'orderNo',
        label: '工单编号',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'createTime',
        label: '创建时间',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'deadline',
        label: '处理时限',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'completeTime',
        label: '要求处理完成时间',
        value: '',
        unit: '',
        span: 8,
        class: 'noBottom'
      }],
      jgItems: [{
        id: 'alarmNo',
        label: '告警编号',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'serialNumber',
        label: '设备ID',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'deviceTypeText',
        label: '设备类型 ',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'alarmTypeText',
        label: '告警类型',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'alarmContent',
        label: '告警内容',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'alarmTime',
        label: '告警时间',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'alarmStatusText',
        label: '告警状态',
        value: '',
        unit: '',
        class: 'noBottom',
        span: 8
      }],
      nodeItems: [],
      nodeLength: 0
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.openPage === 'faultWarnDetail') {
        this.editData = this.common['faultWarnDetail'];
        this._getWorkOrderMgt(this.editData.alarmNo);
      }
    })
  },
  components: {
    card,
    FormItemText
  },
  computed: {
    ...mapGetters(['common', 'openPage'])
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event);
    },
    chunk (arr, size) {
      var objArr = [];
      var index = 0;
      var objArrLen = arr.length / size;
      for (var i = 0; i < objArrLen; i++) {
        var arrTemp = [];
        for (var j = 0; j < size; j++) {
          arrTemp[j] = arr[index++];
          if (index === arr.length) {
            break;
          }
        }
        if ((i + 1) % 2 === 0) {
          arrTemp = arrTemp.reverse();
        }
        objArr[i] = arrTemp;
      }
      return objArr;
    },
    getTitle (type) {
      let title = '故障处理节点';
      switch (type) {
        case 'checkNode':
          title = '故障核查节点';
          break;
        case 'completeNode':
          title = '处理完成节点';
          break;
        default:
      }
      return title;
    },
    setItem (items, data) {
      return items.map(item => {
        return {
          ...item,
          value: data[item.id]
        }
      })
    },
    _getWorkOrderMgt (alarmNo) {
      getWorkOrderMgt(alarmNo).then(async res => {
        if (res.code === '200') {
          this.gdItems = await this.setItem(this.gdItems, res.data);
          this.jgItems = await this.setItem(this.jgItems, res.data);
          const copeNodeItems = res.data.copeNode ? res.data.copeNode.map(item => {
            return {
              ...item,
              type: 'copeNode'
            }
          }) : [];
          this.nodeItems = [{...res.data.checkNode, type: 'checkNode'}, ...copeNodeItems, {...res.data.completeNode, type: 'completeNode'}];
          this.nodeLength = this.nodeItems.length;
          this.nodeItems = this.chunk(this.nodeItems, 5);
        /**
          copeNode: [{ 中间节点
            dealer: ''
            dealTime: '',
            dealNote: ''
          }, {
            dealer: ''
            dealTime: '',
            dealNote: ''
          }],
          checkNode: { 开始节点
            dealer: ''
            dealTime: '',
            dealNote: ''
          },
          completeNode: { 结束节点
            dealer: ''
            dealTime: '',
            dealNote: ''
          }
        */
        }
      })
    }
  }
}
</script>

<style lang="less">
#faultWarnDetail{
  .el-tabs{
    padding: 0 13px;
    .el-tabs__header{
      .el-tabs__nav-wrap{
        &::after{
          content: none;
        }
        .el-tabs__active-bar{
          background:linear-gradient(276deg,rgba(37,168,203,1) 0%,rgba(88,160,255,1) 100%);
        }
      }
      .el-tabs__item{
        width: 108px;/*no*/
        font-size:14px;/*no*/
        text-align: center;
        padding-right: 0;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(115,131,178,1);
        &.is-active{
          color: #FFFFFF;
        }
      }
    }
    .el-tabs__content{
      padding-top: 5px;/*no*/
      padding-bottom: 20px;/*no*/
      .radioGroup{
        label{
          margin-right: 23px;
          margin-left: 0px;
          /deep/.el-radio__input{
            .el-radio__inner{
              width: 9px;/*no*/
              height: 9px;/*no*/
              border: none;
              &::after{
                width: 3px;/*no*/
                height: 3px;/*no*/
              }
            }
          }
          /deep/.el-radio__label{
            padding-left: 4px;/*no*/
            font-size:12px;/*no*/
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(230,236,255,1);
          }
          &:last-child{
            margin-right: 0;
          }
        }
      }
    }
  }
  #card{
    &:last-child{
      margin-top: 10px;/*no*/
      padding-top: 50px;
    }
    .nodeContainer{
      padding: 10px 50px 40px;
      margin-bottom: -50px;
      flex-wrap: wrap;
      justify-content: flex-start;
      .itemMainRow{
        width: 100%;
        border-left: none;/*no*/
        border-right: 4px solid rgba(171, 171, 171, 0.18);/*no*/
        &:nth-of-type(2n) {
          justify-content: flex-end;
          border-right: none;
          border-left: 4px solid rgba(171, 171, 171, 0.18);/*no*/
        }
        &:first-child{
          .itemMain{
            &:first-child{
              .item{
                &::after{
                  background:linear-gradient(138deg,rgba(255,151,51,1) 0%,rgba(255,94,23,1) 100%);
                  box-shadow: 0 0 1px 4px rgba(255, 151, 51, 0.4), 0 0 1px 10px rgba(255, 151, 51, 0.1), 0 0 1px 16px rgba(255, 151, 51, 0.1);/*no*/
                }
              }
              .foot{
              background:linear-gradient(138deg,rgba(255,151,51,1) 0%,rgba(255,94,23,1) 100%);
              }
            }
          }
        }
        &:last-child{
          border: none;
          .itemMain{
            &.lastNodeItem{
            .item{
                &::after{
                  background:linear-gradient(138deg,rgba(35,203,118,1) 0%,rgba(74,230,206,1) 100%);
                  box-shadow: 0 0 1px 4px rgba(35, 203, 118, 0.4), 0 0 1px 10px rgba(35, 203, 118, 0.1), 0 0 1px 16px rgba(35, 203, 118, 0.1);/*no*/
                }
              }
              .foot{
              background:linear-gradient(138deg,rgba(0,200,172,1) 0%,rgba(17,194,104,1) 100%);
              }
            }
          }
        }
        .itemMain{
          min-width: 20%;
          // flex: 1;
          padding-top: 50px;
          padding-bottom: 50px;
          border-top: 4px solid rgba(171, 171, 171, 0.18);/*no*/
        }
      }

      .item{
        min-width: 200px;
        padding: 15px 15px 90px 12px;/*no*/
        padding-bottom: 90px;
        background:#23326B;
        box-shadow:0px 6px 10px 0px rgba(10,15,34,1);/*no*/
        border-image:linear-gradient(180deg, rgba(52,58,115,1), rgba(34,52,94,1)) 1 1;
        position: relative;
        margin:0 30px;
        border-radius: 10px;
        &::before{
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
            content: '';
            width: 0;
            height: 0;
            top: -10px;
            border-width: 0 15px 10px;
            border-style: solid;
            border-color: transparent transparent #23326B;
        }
        &::after{
            content: '';
          position: absolute;
          top: -60px;
          left: 50%;
          transform: translateX(-50%);
          width:12px;
          height:12px;
          border-radius: 50%;;
          background:linear-gradient(138deg,rgba(0,92,234,1) 0%,rgba(71,192,230,1) 100%);;
          box-shadow: 0 0 1px 4px rgba(0, 92, 234, 0.4), 0 0 1px 10px rgba(0, 92, 234, 0.1), 0 0 1px 16px rgba(0, 92, 234, 0.1);/*no*/
        }
        .info{
          font-size:12px;/*no*/
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(255,255,255,1);
          >div{
            margin-bottom: 5px;/*no*/
            .infoTitle{
              width: 80px;
              min-width: 80px;/*no*/
              max-width: 90px;/*no*/
            }
            span:not(.infoTitle){
              flex: 1;
            }
          }
        }
        .foot{
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          padding:10px 0;
          text-align: center;
          background:linear-gradient(138deg,rgba(15,190,245,1) 0%,rgba(0,92,234,1) 100%);
          font-size:16px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(255,255,255,1);
          line-height:22px;
          text-shadow:0px 1px 2px rgba(0,0,0,0.5);/*no*/
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
          overflow: hidden;
          &::before{
            position: absolute;
            left: 50%;
            content: '';
            width: 100%;
            height: 30px;
            transform: translateX(-50%) skewY(30deg);
            background: linear-gradient(138deg,rgba(255,255,255,0.15) 0%,rgba(255,255,255,0.3) 100%);
          }
          &::after{
            position: absolute;
            left: 50%;
            content: '';
            width: 100%;
            height: 10px;
            transform: translateX(-32%) skewY(30deg);
            background: linear-gradient(138deg,rgba(255,255,255,0.15) 0%,rgba(255,255,255,0.3) 100%);
          }
        }
      }
    }
  }
}
</style>
