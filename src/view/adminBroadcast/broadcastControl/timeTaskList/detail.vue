-<template>
  <div id="timeTaskDetail">
     <card
        title="基本信息"
        className="adminCard headerTitle"
      >
      <search-form ref="searchBox" :searchItems="searchItems" :searchBtnShow="false" :seniorType="false">
        <div class="flexRow my-autocomplete" slot="serialNumbers">
          <treeselect :value="form.serialNumbers" @input="tressSelectInput" @select="tressSelectSelect"/>
        </div>
        <div slot="number" style="font-size: 12px;color: #000">
          {{form.serialNumbers && form.serialNumbers.length}}
        </div>
      </search-form>
    </card>
    <card title="播放音频" className="adminCard detail_content">
      <div class="detail_form">
        <el-form :model="formcontent" ref="ruleForm" label-width="80px" label-position="left">
          <div class="audioMain" style="marginBottom: 10px">
            <uploadFile
              type="audio"
              uploadUrl="/api/fileupload/upload"
              :fileList="videoList"
              @change="val => changeUploadFile(val)"
              :parames="{
                service_table: 'broadcast_policy',
                serviceCode: `${serviceCode}2`
              }"
              >
              <template v-slot:content>
                <div class="flexCloumn flexCenter resource_img">
                  <div class="upload_img">
                    上传音频
                    <i class="el-icon-top"></i>
                  </div>
                </div>

              </template>
            </uploadFile>
          </div>
          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item label="播放方式：" prop="playMode" >
                <div class="flexRow playType">
                  <el-radio-group v-model="formcontent.playMode">
                    <el-radio :label="1">顺序播放</el-radio>
                    <el-radio :label="2">随机播放</el-radio>
                    <el-radio :label="3">循环</el-radio>
                  </el-radio-group>
                  <div v-if="formcontent.playMode === 3">
                  <el-input v-model="formcontent.loopCount" placeholder="请输入次数" ></el-input>
                  次
                  </div>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="任务类型：" prop="taskType">
                <div class="flexRow wordType">
                  <el-select v-model="formcontent.taskType" placeholder="请选择任务类型">
                    <el-option
                      v-for="item in [{
                        id: 1,
                        name: '单次任务'
                      }, {
                        id: 2,
                        name: '每日任务'
                      }, {
                        id: 3,
                        name: '每周任务'
                      }]"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <el-checkbox-group
                    v-model="formcontent.weekList"
                    v-if="formcontent.taskType === 3"
                  >
                    <el-checkbox
                      v-for="city in weekList.options"
                      :label="city.id"
                      :key="city.id"
                    >
                    {{city.name}}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="生效日期：" prop="date">
                <el-date-picker
                  type="date"
                  v-model="formcontent.beginDate"
                  placeholder="选择日期"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  v-show="formcontent.taskType === 1"
                >
                </el-date-picker>
                <el-date-picker
                  @focus="clickDateTime"
                  type="daterange"
                  v-model="formcontent.date"
                  placeholder="选择日期"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  v-show="formcontent.taskType !== 1"
                  :picker-options="pickerOptions"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="1">
              <el-form-item label="播放时间：" prop="time" style="margin-bottom:20px">
                <el-time-picker
                  is-range
                  v-model="formcontent.time"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围"
                  :format="'HH:mm'"
                  :value-format="'HH:mm'">
                </el-time-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!-- <div class="tools_btn">
        <el-button class="cancel_btn" size="mini" @click="cancel">取消</el-button>
        <el-button class="submit_btn" size="mini" @click="save">保存</el-button>
      </div> -->
    </card>
    <div class="flexRow flexCenter btnList">
          <el-button
              type="text"
              size="small"
              title="取消"
              :style="{marginRight: '10px'}"
              @click.prevent.stop="handleCancel"
              >
              取消
          </el-button>
          <el-button
              type="primary"
              size="small"
              title="保存"
              @click.prevent.stop="handleSave"
              >
              设置
          </el-button>
      </div>
  </div>
</template>
<script>
import {
  mapGetters
} from 'vuex';
import moment from 'moment';
import { getGroupPolicy, getLamp, deleteByFileCode } from 'api/index';
import {
  editAudioPlayTask,
  getAudioPlayTaskDtl
} from 'api/brocast';
import headerTitle from 'components/adminHeaderTitle/headerTitle'
import searchForm from 'components/adminSearchForm/searchForm';
import selector from '@/components/selector';
import card from '@/view/lightPole/lightPoleStatistical/components/card';
import treeselect from './treeselect';
import upload from '@/components/upload/upload';
import uploadFile from '@/components/upload/uploadFile';
import dialogCont from '@/components/dialog';
import { LIGHT_TYPE, WEEK_LIST_TYPE } from '@/util/constants';
import { checkTimeBetween } from '@/util/util';
import config, { baseURL } from '@/config';
// import commonTemplate from '../commonTemplate';
import { policyTypes } from '@/view/controlStrategy/wisdomPublish/util';
const queryName = {
  'led': 'wisdomPublishDetail',
  'video': 'wisdomVideoDetail'
};
export default {
  components: {
    searchForm,
    selector,
    upload,
    uploadFile,
    card,
    dialogCont,
    treeselect,
    headerTitle
  },
  data () {
    const weekList = this.$_useTypes(WEEK_LIST_TYPE);
    return {
      weekList: weekList,
      policyTypes,
      dialogVisible: false,
      form: {
        serialNumbers: []
      },
      searchItems: [
        {
          type: 'input',
          label: '任务名称',
          labelWidth: '60px',
          isLabel: true,
          initValue: undefined,
          props: {
            fieldName: 'taskName',
            width: '200px'
          }
        }, {
          type: 'custom',
          label: '广播器',
          labelWidth: '60px',
          isLabel: true,
          initValue: undefined,
          props: {
            fieldName: 'serialNumbers'
          }
        }, {
          type: 'custom',
          label: '广播器数量',
          labelWidth: '80px',
          isLabel: true,
          initValue: undefined,
          props: {
            fieldName: 'number'
          }
        }, {
          type: 'checkbox',
          label: '任务状态',
          labelWidth: '70px',
          isLabel: true,
          initValue: [1],
          props: {
            fieldName: 'taskStatus',
            options: [{
              id: 1,
              name: '启用'
            }]
          }
        }
      ],
      serviceCode: '',
      formcontent: {
        date: [],
        beginDate: undefined,
        time: undefined,
        taskType: 1,
        playMode: 1,
        loopCount: undefined,
        weekList: []
      },
      videoList: [],
      timeOptionRange: '',
      pickerOptions: {
        onPick: time => {
          // 当第一时间选中才设置禁用
          if (time.minDate && !time.maxDate) {
            this.timeOptionRange = time.minDate;
          }
          if (time.maxDate) {
            this.timeOptionRange = null;
          }
        },
        disabledDate: time => {
          const timeOptionRange = this.timeOptionRange;
          const secondNum = 60 * 60 * 24 * 7 * 1000;
          // 当前日期的前7天、后7天不可选
          if (this.formcontent.taskType === 3 && timeOptionRange) {
            return ((time.getTime() < timeOptionRange.getTime() && time.getTime() > timeOptionRange.getTime() - secondNum) || (time.getTime() > timeOptionRange.getTime() && time.getTime() <
            timeOptionRange.getTime() + secondNum));
          }
          return false;
        }
      }
    };
  },
  watch: {
    formcontent (val) {
      // console.log('val', val)
    }
  },
  mounted () {
    this.$nextTick(async () => {
      this.serviceCode = moment().format('YYYYMMDDHHmmss');
      this.editData = this.common['timeTaskDetail'];
      if (this.editData && this.editData.taskCode) {
        this.getInfo()
      }
    })
  },
  computed: {
    ...mapGetters(['common', 'openPage'])
  },
  methods: {
    changeUploadFile (list) {
      const removeObj = this.videoList.filter(obj => !list.some(obj1 => obj1.uid === obj.uid));
      if (removeObj[0] && removeObj[0].fileCode) {
        deleteByFileCode(removeObj[0].fileCode).then(res => {
          if (res.code === '200') {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              position: 'bottom-right'
            });
            this.videoList = list;
          }
        })
      } else {
        this.videoList = list;
      }
      console.log('this.videoList', this.videoList);
    },
    tressSelectInput (value) {
      this.form.serialNumbers = value;
    },
    tressSelectSelect (val) {
      // console.log('val', val);
      // this.form.serialNumbers = val.serialNumbers;
    },
    getInfo () {
      getAudioPlayTaskDtl(this.editData.taskCode).then(res => {
        if (res.code === '200') {
          let searchItems = [...this.searchItems];
          searchItems[0].initValue = res.data.taskName;
          searchItems[3].initValue = [res.data.taskStatus];
          this.searchItems = searchItems;
          this.form.serialNumbers = res.data.audioDeviceDtoList && res.data.audioDeviceDtoList.length > 0 ? res.data.audioDeviceDtoList.map(device => {
            return {
              ...device,
              serialNumber: device.serialNumber,
              imei: device.imei,
              id: device.serialNumber
            }
          }) : [];
          this.formcontent = {
            ...res.data,
            date: res.data.beginDate ? [`${res.data.beginDate} 00:00:00`, `${res.data.endDate} 00:00:00`] : [],
            time: res.data.beginTime ? [res.data.beginTime, res.data.endTime] : [],
            weekList: res.data.weekList ? res.data.weekList : []
          };
          this.videoList = res.data.audioMediaList && res.data.audioMediaList.map(medio => {
            const path = medio.fileUrl.split('upload')[1];
            return {
              code: medio.fileCode,
              url: medio.fileUrl,
              name: medio.fileName,
              path: path
            }
          })
        }
      })
    },
    async handleSave () {
      let message = '新增成功';
      const data = await this.$refs.searchBox.onSearch();
      const parames = {
        ...this.formcontent,
        ...data,
        loopCount: +this.formcontent.loopCount,
        taskStatus: data.taskStatus[0],
        playStatus: 1,
        beginTime: this.formcontent.time && this.formcontent.time[0],
        endTime: this.formcontent.time && this.formcontent.time[1],
        audioDeviceCommandList: this.form.serialNumbers.map(da => {
          return {
            city: da.city,
            street: da.street,
            area: da.area,
            serialNumber: da.serialNumber,
            imei: da.imei
          }
        }),
        mediaCommandList: this.videoList.map(ls => {
          return {
            fileCode: ls.code,
            fileUrl: ls.path,
            fileName: ls.name
          }
        }),
        isTimer: 0
      };
      if (parames.taskType !== 1) {
        parames.beginDate = parames.date[0];
        parames.endDate = parames.date[1];
      }
      if (parames.taskType !== 3) {
        parames.weekList = [];
      }
      if (this.editData.taskCode) {
        parames.taskCode = this.editData.taskCode;
        message = '修改成功';
      }
      delete parames.number;
      delete parames.date;
      delete parames.time;
      delete parames.audioMediaList;
      delete parames.audioDeviceDtoList;
      delete parames.weeks;
      delete parames.serialNumbers;
      editAudioPlayTask(parames).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: message,
            type: 'success',
            position: 'bottom-right'
          });
          this.$router.push({
            name: this.editData.toName
          });
        }
      });
    },
    handleCancel () {
      this.$router.push({
        name: this.editData.toName
      });
    },
    clickDateTime () {
      // this.pickerOptions.disabledDate = time => {
      //   console.log('time2', time, this.formcontent.date);
      //   const startTime = this.formcontent.date[0];
      //   if (startTime) {
      //     const nextDate = new Date(startTime);
      //     nextDate.setDate(startTime.getDate() + 7);
      //     return (
      //       time.getTime() > Date.now + (7 * 24 * 3600) || time.getTime() < nextDate.getTime()
      //     )
      //   } else {
      //     return time.getTime() < Date.now()
      //   }
      // }
    }
  }
};
</script>
<style lang="less">
#timeTaskDetail {
  .headerTitle{
    margin-bottom: 10px;/*no*/
    // background:rgba(32,45,85, 0.49);
    background: #fff;
    border-radius:4px;
    display: flex;
    padding: 20px 20px 10px;
    position: relative;
    &::before{
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 2px;/*no*/
      background:rgba(43,126,242,1);
      border-radius:1px;/*no*/
    }
  }
  .adminSearchForm{
    .vue-treeselect__control{
      color: #000 !important;
      background: #fff !important;
      border-color:#d2d6de !important;
    }
    .my-autocomplete{
      .number{
        margin-left: 15px;/*no*/
        margin-right: 10px;/*no*/
      }
    }
  }
  .my-autocomplete {
    #treeselect{
      width: 350px;/*no*/
    }
    /deep/.el-input-group {
      height: 30px; /*no*/
      .el-input-group__prepend {
        background: transparent;
        border: none;
        width: 80px; /*no*/
        height: 30px; /*no*/
        padding: 0;
        input {
          border-top-right-radius: 0 !important;
          border-bottom-right-radius: 0 !important;
        }
        .el-select {
          height: 100%;
          margin: 0;
        }
      }
      input {
        font-size: 12px; /*no*/
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(230, 236, 255, 1);
        // background: rgba(34, 44, 81, 0.5);
        border-radius: 4px; /*no*/
        border: 1px solid rgba(98, 117, 191, 1);
      }
      > input {
        width: 250px;/*no*/
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
      }
    }
    li {
      line-height: normal;
      padding: 7px;

      .name {
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .addr {
        font-size: 12px;
        color: #b4b4b4;
      }

      .highlighted .addr {
        color: #ddd;
      }
    }
  }
  .detail_content {
    /deep/.el-tabs__item {
      // height:20px;
      font-size: 14px;/*no*/
      padding: 0 26px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(115, 131, 178, 1);
    }
    /deep/.el-tabs__item.is-active {
      color: rgba(255, 255, 255, 1);
    }
    /deep/.el-tabs__active-bar {
      //   width:122px;
      // padding: 0 26px;
      height: 2px;
    }
    /deep/.el-tabs__nav-wrap::after {
      background-color: #192349;
      height: 1px;
    }

    .detail_form {
      color: #000;
      font-size: 12px;/*no*/
      padding: 10px 0 0;/*no*/
      background: #fff;
      border-radius: 4px;
      .el-form-item{
        margin-bottom: 15px;/*no*/
      }
      .audioMain{
        .audio {
          .audioContent{
            width: 300px;/*no*/
          }
        }
      }
      .el-form-item__content{
        position: relative;
        align-items: center;
        .brightText{
          font-size: 12px;/*no*/
          position: absolute;
          left: 2.8rem;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      .modules_title {
        position: relative;
        padding-left: 36px;
        font-size: 14px;/*no*/
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #a0acd8;
        margin-bottom: 20px;
      }
      .modules_title::after {
        width: 26px;
        height: 13px;
        content: "";
        position: absolute;
        left: 0px;
        top: 50%;
        margin-top: -6.5px;
        background: url(~common/images/smartCharge/tit_bg.png) no-repeat;
        background-size: contain;
      }
      .el-switch{
        .el-switch__core{
          height: 17px;/*no*/
          &::after{
            width: 13px;/*no*/
            height: 13px;/*no*/
          }
        }
        &.is-checked{
          .el-switch__core{
            &::after{
              margin-left: -13px;/*no*/
            }
          }
        }
      }

      /deep/.el-radio {
        margin-right: 20px;
        margin-left: 0;
      }
      /deep/.el-form-item__label,
      /deep/.el-radio .el-radio__label,
      /deep/.el-checkbox {
        width: auto !important;
        color: #000;
        font-size: 12px;/*no*/
      }
      .el-radio__label{
        padding-left: 6px;
      }
      .el-radio__inner{
        width: 12px;/*no*/
        height: 12px;/*no*/
        &::after{
          width: 5px;/*no*/
          height: 5px;/*no*/
        }
      }
      /deep/.el-checkbox__inner {
        // background: #34437b;
        // border-color: #34437b;
      }
      /deep/.is-checked /deep/.el-radio__inner {
        border-color: #2870ff;
        &::after{
          background: #fff;
        }
      }
      /deep/.el-slider__runway {
        width: 192px;
        height: 6px;
        background: rgba(38, 48, 55, 1);
        border-radius: 5px;
      }
      /deep/.el-slider__bar {
        height: 6px;
        background: rgba(29, 214, 176, 1);
        border-radius: 5px;/*no*/
      }
      /deep/.el-slider__button {
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 2px 10px 0px rgba(29, 214, 176, 1);/*no*/
        border-color: rgba(29, 214, 176, 1);
      }
      /deep/.el-select {
        // width: 150px;/*no*/
        // height: 25px !important;
        // line-height: 25px !important;
        display: inline-block;
        /deep/.el-input__inner,
        .el-input__inner:focus {
          color: #000;
          // border: 1px solid #6275bf !important;
          // background: rgba(34, 44, 81, 1);
          border-radius: 4px;
          outline: none;
        }
        /deep/.el-input--suffix /deep/.el-input__inner {
          padding: 0 6px !important;/*no*/
          // height: 25px !important;/*no*/
          // line-height: 25px !important;/*no*/
        }
        .el-input__icon{
          height: 25px;
          line-height: 25px;
        }
      }
      .el-radio__inner {
        // background-color: #202d55;
        // border-color: #ffffff;
      }
      .el-upload-list{
        .el-upload-list__item{
          width: auto;
          height: auto;
        }
        .el-upload-list__item-thumbnail{
          width: 182px;
          height: 152px;
        }
      }
      .el-upload--picture-card{
        background: transparent;
          width: auto;
          height: auto;
          border-radius: 0;
          border: 2px dashed rgba(44, 52, 58, 1);
        }
      .resource_img {
        width: 182px;
        height: 152px;
        background: #fff;
        border-radius: 5px;
        // margin-bottom: 10px;
        cursor: pointer;
        position: relative;
        border: 2px dashed #d2d6de;/*no*/
        .upload_img {
          margin: 0 auto;
          // margin-top: 72px;
          // margin-bottom: 15px;
          padding:0 40px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          background: rgba(72, 128, 255, 1);
          box-shadow: 0px 4px 7px 0px rgba(72, 128, 255, 0.5);/*no*/
          border-radius: 19px;
          color: #fff;
          position: relative;
          .el-icon-top {
            position: absolute;
            right: 2px;
            top: 50%;
            transform: translateY(-50%);
            width: 26px;
            height: 26px;
            line-height: 26px;
            border-radius: 50%;
            background: rgba(56, 107, 225, 1);
            font-size: 10px;
            color: #fff;
          }
        }
      }
      .textMain{
        .textTemplate{
            min-width: 250px;
            padding: 20px 35px 20px 18px;
            background:linear-gradient(171deg,rgba(21,173,182,1) 0%,rgba(49,72,219,1) 100%);
            box-shadow:0px 2px 9px 0px rgba(72,128,255,0.5);/*no*/
            border-radius:5px;
            margin-right: 10px;/*no*/
            display: flex;
            flex-direction: column;
            .title{
              font-size:14px;
              font-family:PingFangSC-Semibold,PingFang SC;
              font-weight:600;
              color:rgba(255,255,255,1);
              // line-height:14px;
              text-shadow:0px 2px 4px rgba(17,118,111,0.5);
              margin-bottom: 7px;
            }
            ul{
              li{
                font-size:12px;/*no*/
                font-family:PingFangSC-Regular,PingFang SC;
                font-weight:400;
                color:rgba(255,255,255,1);
                padding: 6px 0;
                // line-height:17px;
              }
            }
          }
        .resource_text{
          width: 200px;
          min-height: 152px;
          height: auto;
          // width: auto;
        }
      }

      .limit {
        position: absolute;
        bottom: 20px;
        left: 0;
        right: 0;
        margin: 0 auto;
        height: 17px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(116, 133, 145, 1);
        line-height: 17px;
        text-align: center;
      }
    }
  }
  .primary {
    background: linear-gradient(
      318deg,
      rgba(29, 91, 250, 1) 0%,
      rgba(0, 119, 228, 1) 100%
    );
    border-radius: 4px;
    padding: 5px 15px;
    color: #000;
    font-size: 12px;
  }
  .btnList{
    height: 70px;
    margin-top: 10px;/*no*/
    background: #fff;
    justify-content: center !important;
    align-items: center !important;
    button{
      padding: 7px 25px;/*no*/
      // background:rgba(21,27,46,1);
      border-radius:4px;/*no*/
      border:1px solid #ddd;
      color: #888;
      font-size:12px;/*no*/
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      &.el-button--primary{
          background:linear-gradient(318deg,rgba(29,91,250,1) 0%,rgba(29,144,250,1) 100%);
          color:rgba(230,236,255,1);
          border-color: #1d5bfa;
      }
    }
  }
  .submit_btn {
    background: linear-gradient(
      318deg,
      rgba(29, 91, 250, 1) 0%,
      rgba(0, 119, 228, 1) 100%
    );
    border-radius: 4px;
    padding: 8px 15px;
    color: #000;
    font-size: 12px;
  }
  .cancel_btn {
    padding: 7px 15px;
    background: rgba(21, 27, 46, 1);
    border-radius: 4px;
    border: 1px solid rgba(52, 114, 255, 1);
    color: #3472ff;
    font-size: 12px;
  }
  .el-date-editor{
    max-width: 380px;/*no*/
    // background: transparent;
      // border: none;
      .el-input__icon{
        display: none;
      }
      .el-range-separator{
        width: auto;
        padding: 0 10px;/*no*/
        font-size:12px;/*no*/
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:#000;
      }
    input{
      // width: 45%;
      flex: 1;
      // background:rgba(34,44,81,1);
      border-radius:4px;
      // border:1px solid rgba(98,117,191,1);
      color:#000;
    }
  }
  .multipleLight{
  .el-select__tags{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    span{
      display: flex;
    }
  }
  .el-input{
    input{
      width: 250px;/*no*/
      font-size:12px;/*no*/
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(230,236,255,1);
      background:rgba(34,44,81,0.5);
      border-radius:4px;/*no*/
      border:1px solid rgba(98,117,191,1);
    }
  }
  }
  .playType{
    .el-radio-group{
      height: 30px;/*no*/
      display: flex;
      align-items: center;
    }
    .el-input{
      max-width: 150px;/*no*/
      margin-right: 15px;/*no*/
    }
  }
  .wordType{
    .el-checkbox-group{
      margin: 0 15px;/*no*/
      display: flex;
      flex-direction: row;
      .el-checkbox{
        display: flex;
        flex-direction: row;
        align-items: center;
      }
    }
  }
}
</style>
