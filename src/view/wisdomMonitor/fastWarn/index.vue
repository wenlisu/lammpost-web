<template>
  <pageMain idName="fastWarn" :currentTitleList="currentTitleList">
    <div class="fastWarn-wrap">
      <iframe
        v-bind:src="'static/alarmWeb/alarmWeb.html'"
        :style="{width: '100%', height: '100%'}"
        name="iframe"
        frameborder="0"
        allowfullscreen
        allow="autoplay"
        scrolling="no"
      ></iframe>
        <moveDialog
          @on-cancel="dialogCancel"
          @on-confirm="dialogSubmit"
          :visible.sync="dialog.show"
          :title="dialog.title"
        >
          <FormItem
            ref="formItem"
            :formItems="formItems"
            :rules="formRules"
            :disabled="inputDisabled"
            :isEdit="isEdit"
            :form="form"
            :labelWidth="'85px'"
            :midway="true"
          >
          </FormItem>
        </moveDialog>
    </div>
    <dialog-cont
      :visible.sync="dialogVisible"
      width="80%"
      :title="dialogTitle"
      append-to-body
      :bottomShow="false"
      :customClass="'videoDialog'"
    >
      <div class="flexCenter video">
          <iframe
            :src="alarmItem.cameraURL"
            width="100%"
            height="100%"
            allow="autoplay"
            border="0"
            scrolling="no"
            id="Detailysopen"
            ref="Detailysopen"
            allowfullscreen
        ></iframe>
        <el-drawer
          title="我是标题"
          :with-header="false"
          :visible.sync="drawer.show"
          :direction="drawer.direction"
          :before-close="handleCloseDrawer"
          :modal-append-to-body="false"
        >
          <div class="flexCloumn btnList">
            <div
              class="submitBtn"
              size="small"
              v-for="item in drawer.btnItems"
              :key="item.id"
              @mousedown="item.mousedown"
              @mouseup="item.mouseup"
            >
              <!-- <i class="iconfont icon-chaxun"></i> -->
              {{item.name}}
            </div>
          </div>
        </el-drawer>
        <div class="kongzhi-icon" @click="handleMore"><i class="iconfont icon-shexiangtoukongzhi-copy" /></div>
          <div class="flexRow videoInfo">
              <div class="flexCenter icon"><i class="iconfont icon-dengganditu" /></div>
              <div class="flexCloumn title">
                  <span>{{alarmItem.address}}</span>
                  <span>{{alarmItem.handleTime}}</span>
              </div>
          </div>
      </div>
    </dialog-cont>
  </pageMain>
</template>

<script>
import dialogCont from '@/components/adminDialog';
import moveDialog from '@/components/moveDialog';
import FormItem from '@/components/adminFormItem';
import pageMain from 'components/pageMain';
import { routePush, postData } from '@/util/util';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import {
  saveAlarmCallRecord
} from 'api/wisdomMonitor';

export default {
  name: 'fastWarn',
  data () {
    return {
      currentTitleList: [
        {
          name: 'wisdomWarnMap',
          title: '智慧报警'
        },
        {
          name: 'fastWarn',
          title: '一键报警'
        }
      ],
      // src: 'https://39.99.142.215:8088/',
      alarmWeb: '',
      getPageUrl: 'static/alarmWeb/alarmWeb.html',
      inputDisabled: false,
      isEdit: true,
      form: {
        callUser: undefined,
        callUserTel: undefined,
        callContent: undefined
      },
      options: [],
      formItems: [{
        label: '报警人名称',
        prop: 'callUser',
        inputType: 'input',
        required: true,
        span: 24
      }, {
        label: '联系电话',
        prop: 'callUserTel',
        inputType: 'input',
        required: true,
        span: 24
      }, {
        label: '报警描述',
        prop: 'callContent',
        inputType: 'textarea',
        minRows: 2,
        maxlength: 200,
        required: true,
        span: 24
      }],
      formRules: {},
      dialog: {
        show: false,
        title: '记录警情'
      },
      clientid: null,
      deviceId: null,
      alarmItem: {},
      dialogVisible: false,
      dialogTitle: '报警监控',
      drawer: {
        show: false,
        direction: 'rtl',
        btnItems: [{
          id: 'a',
          name: '上转',
          mousedown: () => {
            this.handleDeviceContral(0);
          },
          mouseup: () => {
            this.handleDeviceContral(0, 'stop');
          }
        }, {
          id: 'b',
          name: '下转',
          mousedown: () => {
            this.handleDeviceContral(1);
          },
          mouseup: () => {
            this.handleDeviceContral(1, 'stop');
          }
        }, {
          id: 'c',
          name: '左转',
          mousedown: () => {
            this.handleDeviceContral(2);
          },
          mouseup: () => {
            this.handleDeviceContral(2, 'stop');
          }
        }, {
          id: 'd',
          name: '右转',
          mousedown: () => {
            this.handleDeviceContral(3);
          },
          mouseup: () => {
            this.handleDeviceContral(3, 'stop');
          }
        }, {
          id: 'e',
          name: '左上转',
          mousedown: () => {
            this.handleDeviceContral(4);
          },
          mouseup: () => {
            this.handleDeviceContral(4, 'stop');
          }
        }, {
          id: 'f',
          name: '左下转',
          mousedown: () => {
            this.handleDeviceContral(5);
          },
          mouseup: () => {
            this.handleDeviceContral(5, 'stop');
          }
        }, {
          id: 'g',
          name: '放大',
          mousedown: () => {
            this.handleDeviceContral(8);
          },
          mouseup: () => {
            this.handleDeviceContral(8, 'stop');
          }
        }, {
          id: 'h',
          name: '缩小',
          mousedown: () => {
            this.handleDeviceContral(9);
          },
          mouseup: () => {
            this.handleDeviceContral(9, 'stop');
          }
        }, {
          id: 'i',
          name: '近聚焦',
          mousedown: () => {
            this.handleDeviceContral(10);
          },
          mouseup: () => {
            this.handleDeviceContral(10, 'stop');
          }
        }, {
          id: 'j',
          name: '远聚焦',
          mousedown: () => {
            this.handleDeviceContral(11);
          },
          mouseup: () => {
            this.handleDeviceContral(11, 'stop');
          }
        }]
      }
    };
  },
  components: {
    dialogCont,
    FormItem,
    moveDialog,
    pageMain
  },
  computed: {
    ...mapGetters(['common'])
  },
  watch: {
    '$route.query': {
      deep: true,
      handler (newValue) {
        console.log('newValue', newValue);
        if (!newValue.serialNumber) {
          this.clearnData();
        } else {
          this.autoClick();
        }
      }
    }
  },
  created () {
    window['vueDefinedMyProp'] = (receiveParams) => {
      this.receiveParamsFromHtml(receiveParams)
    };
    window['historyList'] = () => {
      this.goHistoryList()
    };
    window['goSmokeAlarmLink'] = () => {
      this.goSmokeAlarmLink()
    }
    window['getMonitorVideo'] = (data) => {
      this.getMonitorVideo(data)
    }
    window['autoClick'] = () => {
      this.autoClick()
    };
    window['clearnFastWarn'] = () => {
      this.clearnFastWarn()
    };
    window['setFastWarnStatus'] = (deviceId) => {
      this.setFastWarnStatus(deviceId)
    };
    window['saveAlarmCallRecord'] = (deviceId) => {
      this._saveAlarmCallRecord(deviceId)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.init();
      // this.dialog.show = true;
    });
  },
  methods: {
    ...mapMutations([
      'set_common'
    ]),
    init () {
    },
    clearnData () {

    },
    handleMore () {
      this.drawer.show = true;
    },
    handleCloseDrawer () {
      this.drawer.show = false;
    },
    async handleDeviceContral (direction, type = 'start') {
      const parames = {
        speed: 1,
        direction,
        deviceSerial: this.alarmItem.deviceBindCode
      };
      const res = await postData(`api/lapp/device/ptz/${type}`, parames);
    },
    autoClick () {
      const query = this.$route.query;
      if (query.serialNumber) {
        this.initData(query.serialNumber);
      }
    },
    initData (serialNumber) {
      setTimeout(() => {
        window.frames['iframe'].setDeviceListDbClick(serialNumber);
      }, 500)
    },
    receiveParamsFromHtml ({clientid, deviceId}) {
      this.clientid = clientid;
      this.deviceId = deviceId;
      this.dialog.show = true;
      this.dialog.title = '记录警情';
      const fastWarn = this.common.fastWarn && this.common.fastWarn[deviceId];
      if (fastWarn) {
        this.form = {
          callUser: fastWarn.callUser,
          callUserTel: fastWarn.callUserTel,
          callContent: fastWarn.callContent
        };
      }
    },
    goHistoryList () {
      routePush({
        name: 'historyWarn'
      });
    },
    goSmokeAlarmLink () {
      routePush({
        name: 'smokeAlarmLink',
        query: '烟雾报警'
      });
    },
    getMonitorVideo (data) {
      this.dialogVisible = true
      console.log('video', data)
      this.alarmItem = data
    },
    invokeHtmlMethod (allFastWarn, deviceId, clientid) {
      window.frames['iframe'].setTableValue(allFastWarn, deviceId, clientid)
    },
    dialogCancel () {
      this.dialog.show = false;
      this.deviceId = null;
      this.clientid = null;
      this.$refs.formItem.resetForm();
      this.inputDisabled = false;
      this.isEdit = true;
      this.form = {
        callUser: undefined,
        callUserTel: undefined,
        callContent: undefined
      };
    },
    async dialogSubmit (val) {
      const formData = await this.$refs.formItem.getValue();
      const parames = {
        ...formData,
        serialNumber: this.deviceId
      };
      const fastWarn = this.common['fastWarn'];
      saveAlarmCallRecord(parames).then(res => {
        if (res.code === '200') {
          const allFastWarn = {
            ...fastWarn,
            [this.deviceId]: {
              ...formData,
              callTime: res.data.callTime,
              status: 1
            }
          };
          this.set_common({
            fastWarn: allFastWarn
          });
          this.invokeHtmlMethod(allFastWarn, this.deviceId, this.clientid);
          this.dialogCancel();
        }
      });
    },
    _saveAlarmCallRecord (deviceId) {
      this.deviceId = deviceId.deviceId;
      const parames = {
        callUser: '',
        callUserTel: '',
        callContent: '',
        serialNumber: this.deviceId
      };
      saveAlarmCallRecord(parames).then(res => {
        if (res.code === '200') {
        }
      })
    },
    setFastWarnStatus (deviceId) {
      const allFastWarn = this.common['fastWarn'];
      let newFastWarn = { ...allFastWarn };
      newFastWarn[deviceId].status = 1;
      this.set_common({
        fastWarn: newFastWarn
      });
    },
    clearnFastWarn () {
      const allFastWarn = this.common['fastWarn'];
      let newFastWarn = {};
      if (allFastWarn) {
        Object.keys(allFastWarn).map(fw => {
          if (allFastWarn[fw].status !== 1) {
            newFastWarn[fw] = allFastWarn[fw]
          }
        });
        this.set_common({
          fastWarn: newFastWarn
        });
      }
    }
  }
};
</script>

<style lang="less">
#fastWarn{
  #pageMain{
    height: 100%;
    .el-breadcrumb[data-v-44fbfd0a]{
      background: unset;
      .el-breadcrumb__item{
        span {
          color: #0C0F1A !important;
        }
      }
    }
  }
  .fastWarn-wrap{
    height: 100%;
  }
  height: 100%;
  background: #fff !important;
  .fixed{
    position:fixed;
    background: #fff;
  }
}

.video{
    position: relative;
    width: 100%;
    height: 700px;/*no*/
    background:transparent;
    position: relative;
    margin-bottom: 10px;/*no*/
    .kongzhi-icon {
      position: absolute;
      bottom: 14px;/*no*/
      right: 115px;/*no*/
      i {
        display: inline-block;
        width: 18px;
        height: 18px;
        color: #fff;
        cursor: pointer;
      }
    }
    .videoInfo{
        position: absolute;
        bottom: 5px;
        left: 5px;
        right: 400px;/*no*/
        padding: unset;
        // background:rgba(0,0,0,0.5);
        align-items: center;
        .icon{
            width:38px;
            height:38px;
            background:linear-gradient(135deg, #09a6d0 0%, #0a65d4 100%);
            border-radius:6px;
            margin-right: 10px;/*no*/
            i{
                font-size: 21px;
                color: #fff;
            }
        }
        .title{
            span{
                font-size:16px;
                font-family:PingFangHK-Semibold,PingFangHK;
                font-weight:600;
                color:rgba(255,255,255,1);
                &:last-child{
                    font-size:12px;/*no*/
                    font-family:PingFangSC-Regular,PingFang SC;
                    font-weight:400;
                    color:rgba(255,255,255,1);
                }
            }
        }
        .playBack{
            width: 90px;/*no*/
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 120px;/*no*/
            background:linear-gradient(135deg, #09a6d0 0%, #0a65d4 100%);
            box-shadow:0px 5px 9px 0px rgba(47,47,47,1);/*no*/
            border-radius:50px;/*no*/
            font-size:14px;/*no*/
            font-family:PingFangSC-Semibold,PingFang SC;
            // font-weight:600;
            color:rgba(255,255,255,1);
            padding: 8px 15px;
            text-shadow:0px 2px 4px rgba(47,47,47,1);/*no*/
            cursor: pointer;
            i{
                font-size: 20px;
                color: #fff;
                margin-right: 3px;
            }
            &.more{
              right: 15px;/*no*/
              background:linear-gradient(135deg, #09a6d0 0%, #0a65d4 100%);
            }
        }
    }
    .v-modal{
      display: none;
    }
    .el-drawer__wrapper{
      position: absolute;
      /deep/.el-drawer__container{
        >div{
          width: 103px !important;/*no*/
        }
      }
      .el-drawer__body{
        overflow-y: auto;
        .btnList{
          padding: 15px;/*no*/
          >div{
            cursor: pointer;
            padding: 0 13px;/*no*/
            min-width:70px;/*no*/
            height:30px;/*no*/
            background:linear-gradient(318deg,rgba(29,91,250,1) 0%,rgba(29,144,250,1) 100%);
            border-radius:4px;/*no*/
            line-height: 28px;/*no*/
            font-size:12px;/*no*/
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(230,236,255,1);
            margin-bottom: 10px;/*no*/
            text-align: center;
            span{
              font-size:12px;/*no*/
              font-family:PingFangSC-Regular,PingFang SC;
              font-weight:400;
              color:rgba(230,236,255,1);
            }
          }
        }
      }
    }
  }
</style>
