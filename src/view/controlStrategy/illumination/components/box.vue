<template>
  <div id="box" :class="[{'is-check': form && form.status}, type]">
    <div class="boxTitle">
      {{title}}
    </div>
    <div class="head">
      <el-checkbox v-model="form && form.status" v-if="form"></el-checkbox>
      <img src="../images/img4.png"/>
      <span class="flexCenter spanBtn">{{label}}</span>
    </div>
    <formItem
      :formItems="formItems"
      :form="form"
    />
  </div>
</template>

<script>
import formItem from '@/components/adminFormItem/base';
export default {
  name: 'box',
  data () {
    return {
      formItems: [{
        label: '开启时间',
        prop: 'onTime',
        inputType: 'timePicker',
        span: 24,
        hide: false
      }, {
        label: '关闭时间',
        prop: 'offTime',
        inputType: 'timePicker',
        span: 24,
        hide: false
      }, {
        label: '设置参数',
        prop: 'lightValue',
        inputType: 'select',
        span: 24,
        options: [{
          code: 10,
          value: '环境光强 < 10'
        }],
        hide: true
      }, {
        label: '节能控制',
        prop: 'savingStatus',
        inputType: 'radio',
        options: [
          {
            value: 1,
            name: '全亮'
          },
          {
            value: 2,
            name: '隔盏亮灯'
          }
        ],
        span: 24
      }, {
        label: '照明亮度',
        prop: 'lampStatus',
        inputType: 'radio',
        options: [
          {
            value: 1,
            name: '节能'
          },
          {
            value: 2,
            name: '中'
          },
          {
            value: 3,
            name: '高'
          }
        ],
        span: 24
      }]
    };
  },
  props: {
    type: {
      type: String,
      default: 'blue'
    },
    title: '',
    label: '',
    status: undefined,
    form: {
      status: undefined
    }
  },
  components: {
    formItem
  },
  watch: {
    form (val) {
      this.init(val);
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.status === 3) {
        this.formItems[0].hide = true;
        this.formItems[1].hide = true;
        this.formItems[2].hide = false;
      } else {
        this.formItems[0].hide = false;
        this.formItems[1].hide = false;
        this.formItems[2].hide = true;
      }
      this.init(this.form);
    });
  },
  methods: {
    init (form) {
    }
  }
};
</script>

<style lang="less">
#box{
  // padding: 10px 20px 60px;
  width:420px;
  height:auto;
  // background:rgba(33,48,97,1);
  // box-shadow:0px 2px 48px 1px rgba(23,27,41,0.43);
  border-radius:12px;
  border:1px solid rgba(25,30,48,1);
  position: relative;
  border-image: linear-gradient(180deg, #99c7ff, #f1f9ff) 1 1;
  // background: #252D47 url('../images/img1.png') no-repeat bottom;
  background-size: 100%;
  .head{
    display: flex;
    align-items: center;
    padding: 10px 25px;
    position: relative;
    >img{
      width: 118px;/*no*/
      height: 14px;/*no*/
      margin-left: 10px;/*no*/
    }
    .spanBtn{
      position: absolute;
      top: 20px;
      right: 24px;
      transform: translateY(-50%);
      padding:5px 14px;
      background:linear-gradient(318deg,rgba(29,91,250,1) 0%,rgba(29,144,250,1) 100%);
      border-radius:50px;
      font-size:14px;
      font-family:PingFangSC-Semibold,PingFang SC;
      font-weight:600;
      color:rgba(230,236,255,1);
      line-height:22px;
      text-shadow:0px 2px 4px rgba(15,26,109,0.5);
    }
  }
  /deep/.el-checkbox{
    line-height: 16px;
    .el-checkbox__input{
      .el-checkbox__inner{
        width: 16px;/*no*/
        height: 16px;/*no*/
        border-radius: 50%;
        // border: none;
        &::after{
          height: 7px;/*no*/
          width: 3px;/*no*/
          top: 50%;
          margin-top: -5px;/*no*/
          left: 4px;/*no*/
          margin-left: 2px;/*no*/
        }
      }
      &.is-checked{
        .el-checkbox__inner{
          background:rgba(18,187,171,1);
        }
      }
    }
  }
  .boxTitle {
    // width: 100%;
    // font-size:18px;
    // margin: 15px 0 25px;
    // font-family:PingFangSC-Semibold,PingFang SC;
    // font-weight:600;
    // color:rgba(230,236,255,1);
    // line-height:25px;
    // letter-spacing:1px;/*no*/
    // position: relative;
    padding: 7px 28px;/*no*/
    background: linear-gradient(270deg, rgba(200, 219, 255, 0) 0%, #E1EDFF 100%);
    border-radius: 1px;
    position: relative;
    font-size: 14px;/*no*/
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #393939;
    line-height: 20px;/*no*/
    &::before{
      content: '';
      width: 4px;/*no*/
      height: 14px;/*no*/
      background: #3471F5;
      position: absolute;
      top: 50%;
      left: 15px;/*no*/
      transform: translateY(-50%);
    }
    span{
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      padding:5px 14px;
      background:linear-gradient(318deg,rgba(29,91,250,1) 0%,rgba(29,144,250,1) 100%);
      border-radius:50px;
      font-size:14px;
      font-family:PingFangSC-Semibold,PingFang SC;
      font-weight:600;
      color:rgba(230,236,255,1);
      line-height:22px;
      text-shadow:0px 2px 4px rgba(15,26,109,0.5);
    }
  }
  &.yellow{
    // background-image: url('../images/img3.png');
    background-size: 100%;
    .boxTitle{
      span{
        background:linear-gradient(318deg,rgba(221,101,29,1) 0%,rgba(255,128,6,1) 100%);
      }
    }
  }
  &.greent{
    // background-image: url('../images/img2.png');
    background-size: 100%;
    .boxTitle{
      span{
      background:linear-gradient(318deg,rgba(14,209,152,1) 0%,rgba(35,242,175,1) 100%);
      }
    }
  }
  &.is-check{
    // background-color: #213061;
  }
}
</style>
