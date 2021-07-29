<template>
  <div id="timedScreen">
    <el-form :model="programInfo" :rules="programInfo.rules" ref="ruleForm" label-width="100px" label-position="left">
      <card title="基本信息" :className="'adminCard basicsCard'" v-if="type !== 'template'">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="LED显示屏：" label-width="100px" prop="imeis">
              <treeselect :value="programInfo.imeis" @input="tressSelectInput" @select="tressSelectSelect" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="活动名称：" label-width="90px" prop="activityName" class="activityName">
              <el-autocomplete
                popper-class="timeScreen-autocomplete"
                v-model="programInfo.activityName"
                :fetch-suggestions="querySearch"
                placeholder="请输入内容"
                @select="handleSelect"
                ref="timeScreenAutoInput"
                >
                <template slot-scope="{ item }">
                  <div class="name" :class="`dom${item.index}`">
                    {{ item.name }}
                  </div>
                </template>
              </el-autocomplete>
                <span
                  class="select"
                  :style="'color: #66b1ff;cursor:pointer'"
                  @click.prevent.stop="handleIconClick"
                >
                  选择
                </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生效日期：" label-width="90px" prop="date">
              <el-date-picker
                v-model="programInfo.date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :value-format="'yyyy-MM-dd HH:mm:ss'"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="16">
            <el-form-item label="应用场景：" label-width="90px" prop="programScenario">
              <el-radio-group v-model="programInfo.programScenario">
                  <el-radio
                    v-for="(item, index) in policyTypes"
                    :key="index"
                    :label="item.id"
                  >
                  {{item.name}}
                  </el-radio>
                </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="LED屏数量：" label-width="90px" prop="name">
              {{form.number}}个
            </el-form-item>
          </el-col>
        </el-row>
      </card>
      <card title="开关信息" :className="'adminCard baseInfoCard'">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="开关屏：" label-width="80px" prop="power">
              <el-switch
                v-model="programInfo.power"
                :active-color="'#12BD69'"
                :inactive-color="'#e0e0e0'">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="2">
            <el-form-item label="显示亮度：" label-width="80px" prop="brightness">
              <el-slider
                v-model="programInfo.brightness"
              >
              </el-slider>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="2">
            <el-form-item label="音量：" label-width="80px" prop="volume">
              <el-slider
                v-model="programInfo.volume"
              >
              </el-slider>
            </el-form-item>
          </el-col>
        </el-row>
      </card>
      <card title="播放节目" :className="'adminCard admin1Card'">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="节目名称：" label-width="80px" prop="programName">
              <el-input v-model="programInfo.programName">
                <span
                  slot="suffix"
                  :style="'color: #66b1ff;cursor:pointer'"
                  @click="openTemplate"
                >
                  选择
                </span>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="播放时间：" label-width="90px" prop="time" class="time">
              <el-time-picker
                is-range
                v-model="programInfo.time"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
                format="HH:mm"
                value-format="HH:mm"
                >
              </el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分屏模式：" label-width="80px" prop="rectType">
              <el-radio-group v-model="programInfo.rectType">
                <el-radio
                  v-for="(item, index) in programInfo.policyType"
                  :key="index"
                  :label="item.id"
                >
                {{item.name}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="programDetail">
          <div class="title">{{ programInfo.rectType === 1 ? '全屏' : '四宫格'}}</div>
          <div class="content">
            <programDetail ref="fullScreen" v-if="programInfo.rectType === 1" :filesList="programInfo.fullScreen"/>
            <el-tabs
              v-model="screenActiveName"
              @tab-click="handleScreenActiveClick"
              v-if="programInfo.rectType === 2"
            >
              <el-tab-pane label="区域一" name="1">
                <programDetail ref="screen1" :filesList="programInfo.screen1"/>
              </el-tab-pane>
              <el-tab-pane label="区域二" name="2">
                <programDetail ref="screen2" :filesList="programInfo.screen2"/>
              </el-tab-pane>
              <el-tab-pane label="区域三" name="3">
                <programDetail ref="screen3" :filesList="programInfo.screen3"/>
              </el-tab-pane>
              <el-tab-pane label="区域四" name="4">
                <programDetail ref="screen4" :filesList="programInfo.screen4"/>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </card>
      <card title="背景音乐" :className="'adminCard backgroundContainer'" v-if="type !== 'template'">
        <scrollView>
          <uploadFile
            type="audio"
            uploadUrl="/api/fileupload/upload"
            :fileList="programInfo.videoList"
            @change="val => changeUploadFile(val)"
            :parames="{
              service_table: 'broadcast_policy',
              serviceCode: `${serviceCode}2`
            }"
            >
            <template v-slot:content>
              <div class="flexCloumn flexCenter resource_img">
                <div class="flexCenter upload_img">
                  上传音频
                  <i class="el-icon-top"></i>
                </div>
              </div>
            </template>
          </uploadFile>
        </scrollView>
      </card>
      <div class="flexRow flexCenter saveBtnList" v-if="type !== 'template'">
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
          保存
        </el-button>
      </div>
    </el-form>
    <dialog-cont
      @on-close="canceledit('close')"
      :title="`选择模板`"
      width="80%"
      :visible.sync="dialogVisible"
      :cancelShow="false"
      :confirmShow="false"
      :modal-append-to-body='false'
      ref="dialog"
    >
      <commonTemplate ref="commonTemplate" @select="handleSelelctTemplate" keyType="screen"/>
    </dialog-cont>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex';
import card from 'view/lightPole/lightPoleStatistical/components/card';
import uploadFile from '@/components/upload/uploadFile';
import { policyTypes } from '@/view/controlStrategy/wisdomPublish/util';
import commonTemplate from '../commonTemplate';
import dialogCont from '@/components/adminDialog';
import scrollView from '@/components/sideMenu/scrollView';
import config, { baseURL } from '@/config';
import programDetail from '../fastScreen/programDetail';
import treeselect from './treeselect';
import {
  getGroupPolicy,
  getLamp,
  deleteByFileCode
} from 'api/index';
import {
  addLedIotPark,
  selectLedSetting,
  selectRunningLedProgram,
  selectLedProgramDetail,
  updateProgramCode,
  getLedprogramTree
} from 'api/screen';
export default {
  name: 'timedScreen',
  data () {
    return {
      policyTypes,
      programInfo: {
        policyType: [{
          id: 1,
          name: '全屏'
        }, {
          id: 2,
          name: '四宫格'
        }],
        imeis: [],
        date: [],
        time: ['08:00', '18:00'],
        programScenario: 1,
        activityName: undefined,
        activityCode: undefined,
        programName: undefined,
        programTemplate: 0,
        power: true,
        brightness: 50,
        volume: 50,
        rectType: 1,
        videoList: [],
        fullScreen: {},
        screen1: {},
        screen2: {},
        screen3: {},
        screen4: {},
        rules: {
          activityName: [
            { required: true, message: '请输入活动名称', trigger: 'change' }
          ],
          imeis: [
            { required: true, message: '请选择LED屏', trigger: 'blur' }
          ],
          date: [
            { required: true, message: '请选择生效日期', trigger: 'blur' }
          ],
          time: [
            { required: true, message: '请选择播放时间', trigger: 'blur' }
          ]
        }
      },
      serviceCode: '',
      screenActiveName: '1',
      deviceInfo: {
        imei: undefined
      },
      form: {
        number: 0
      },
      dialogVisible: false,
      timeScreenDisabled: false,
      restaurants: []
    };
  },
  props: {
    type: {
      type: String,
      default: 'default'
    },
    programCode: {
      type: String,
      default: ''
    }
  },
  components: {
    programDetail,
    card,
    uploadFile,
    treeselect,
    commonTemplate,
    dialogCont,
    scrollView
  },
  watch: {
    '$route.query': {
      deep: true,
      handler (newValue) {
        if (!newValue.activeName) {
          this.clearnInfo();
        }
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.init();
    });
  },
  computed: {
    ...mapGetters(['common'])
  },
  methods: {
    init () {
      const query = this.$route.query;
      this.loadAll();
      this.deviceInfo = this.common['timedScreen'];
      if (query.activeName === 'led' && this.deviceInfo && this.deviceInfo.programCode) {
        this.initData();
      }
      console.log(this.type === 'template' && this.programCode)
      if (this.type === 'template' && this.programCode) {
        this.initData(this.programCode);
      }
    },
    initData (programCode = this.deviceInfo.programCode) {
      // const programCode = this.deviceInfo.programCode;
      selectLedProgramDetail(programCode).then(res => {
        if (res.code === '200') {
          this.assignment(res.data);
          this.programInfo.imeis = res.data.imeis.map(val => {
            return {
              imei: val,
              id: val
            }
          });
          this.form.number = this.programInfo.imeis.length;
        }
      });
    },
    async loadAll () {
      let restaurants = [];
      await getLedprogramTree({
        programScenario: 0
      }).then(res => {
        if (res.code === '200') {
          res.data.map(async data => {
            await getLedprogramTree({
              programScenario: data.programScenario
            }).then(childrenRes => {
              if (childrenRes.code === '200') {
                restaurants.push({
                  name: data.programScenarioDesc,
                  id: data.programScenario,
                  index: 1
                });
                if (childrenRes.data) {
                  childrenRes.data.map(dto => {
                    restaurants.push({
                      name: dto.activityName,
                      id: dto.activityCode,
                      imeis: dto.mapDtos.map(mapdto => {
                        return {
                          imei: mapdto.imei,
                          id: mapdto.imei
                        }
                      }),
                      date: (dto.beginDate && dto.endDate) ? [dto.beginDate, dto.endDate] : [],
                      programScenario: dto.programScenario,
                      index: 2
                    });
                  });
                }
              }
            });
          });
        }
      });
      this.restaurants = restaurants;
    },
    handleScreenActiveClick (tab) {
      this.screenActiveName = tab.name;
    },
    tressSelectInput (value) {
      console.log(value);
      this.programInfo.imeis = value.map(val => {
        return {
          imei: val.imei,
          id: val.imei || val.id,
          area: val.area,
          address: val.addressId
        }
      });
      this.form.number = this.programInfo.imeis.length;
    },
    tressSelectSelect (val) {
    },
    changeUploadFile (list) {
      const removeObj = this.programInfo.videoList.filter(obj => !list.some(obj1 => obj1.uid === obj.uid));
      if (removeObj[0] && removeObj[0].fileCode) {
        this.programInfo.videoList = list;
      } else {
        this.programInfo.videoList = list;
      }
    },
    async handleSave () {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          let apiMethod = addLedIotPark;
          const ledMusicAddCommands = [];
          this.programInfo.videoList && this.programInfo.videoList.map(videoFile => {
            ledMusicAddCommands.push({
              remark: videoFile.name,
              source: videoFile.path
            });
          });
          let ledRectAddCommands = [];
          const rectType = this.programInfo.rectType;
          if (rectType === 1) {
            const fullFiles = await this.$refs.fullScreen.getFileLists();
            ledRectAddCommands = [{
              rectType,
              ledMediaAddCommands: fullFiles
            }];
          } else {
            const screen1Files = await this.$refs.screen1.getFileLists();
            const screen2Files = await this.$refs.screen2.getFileLists();
            const screen3Files = await this.$refs.screen3.getFileLists();
            const screen4Files = await this.$refs.screen4.getFileLists();
            const hideOptions = {
              hight: 10,
              left: 10,
              top: 10,
              width: 10
            };
            ledRectAddCommands = [{
              ...hideOptions,
              rectType,
              ledMediaAddCommands: screen1Files
            }, {
              ...hideOptions,
              rectType,
              ledMediaAddCommands: screen2Files
            }, {
              ...hideOptions,
              rectType,
              ledMediaAddCommands: screen3Files
            }, {
              ...hideOptions,
              rectType,
              ledMediaAddCommands: screen4Files
            }]
          }
          let parames = {
            ...this.programInfo,
            imei: null,
            imeis: this.programInfo.imeis.map(ledValue => ledValue.imei),
            volume: this.stringToNumber(this.programInfo.volume),
            power: this.programInfo.power ? 1 : 0,
            brightness: this.stringToNumber(this.programInfo.brightness),
            programTemplate: this.stringToNumber(this.programInfo.programTemplate),
            beginDate: this.programInfo.date && this.programInfo.date[0],
            endDate: this.programInfo.date && this.programInfo.date[1],
            beginTime: this.programInfo.time && this.programInfo.time[0],
            endTime: this.programInfo.time && this.programInfo.time[1],
            ledMusicAddCommands,
            ledRectAddCommands,
            programName: this.programInfo.programName
          };
          delete parames.rules;
          delete parames.fullScreen;
          delete parames.screen1;
          delete parames.screen2;
          delete parames.screen3;
          delete parames.screen4;
          delete parames.date;
          delete parames.time;
          delete parames.policyType;
          delete parames.videoList;
          if (this.programInfo.programCode) {
            apiMethod = updateProgramCode;
          }
          apiMethod(parames, this.programInfo.programCode).then(res => {
            if (res.code === '200') {
              this.$notify({
                title: '成功',
                message: '保存成功',
                type: 'success',
                position: 'bottom-right'
              });
              // 更新获取LED设备详情的接口
              this.$emit('updateData', null)
              if (this.type !== 'template') {
                this.$router.push({
                  name: this.deviceInfo.toName
                });
              } else {
                this.$emit('cancel');
              }
              this.clearnInfo();
            }
          });
        } else {
          this.$notify.error({
            title: '失败',
            message: '请填写完整必填数据!!!',
            position: 'bottom-right'
          });
          return false;
        }
      });
    },
    handleCancel () {
      this.$router.push({
        name: this.deviceInfo.toName
      });
      this.clearnInfo();
    },
    stringToNumber (value) {
      return value ? +value : 0
    },
    openTemplate () {
      this.dialogVisible = true;
    },
    handleSelelctTemplate (item) {
      // this.clearnInfo();
      this.assignment({
        ...item,
        imeis: this.programInfo.imeis,
        power: this.programInfo.power ? 1 : 0
      });
      this.canceledit('cancel')
    },
    clearnInfo () {
      this.programInfo = {
        policyType: [{
          id: 1,
          name: '全屏'
        }, {
          id: 2,
          name: '四宫格'
        }],
        imei: null,
        imeis: [],
        date: [],
        time: ['08:00', '18:00'],
        programScenario: undefined,
        activityName: undefined,
        activityCode: undefined,
        programName: undefined,
        programTemplate: 0,
        power: true,
        brightness: 50,
        volume: 50,
        rectType: 1,
        videoList: [],
        fullScreen: {},
        screen1: {},
        screen2: {},
        screen3: {},
        screen4: {},
        rules: {
          activityName: [
            { required: true, message: '请输入活动名称', trigger: 'blur' }
          ],
          imei: [
            { required: true, message: '请选择LED屏', trigger: 'blur' }
          ],
          date: [
            { required: true, message: '请选择生效日期', trigger: 'blur' }
          ],
          time: [
            { required: true, message: '请选择播放时间', trigger: 'blur' }
          ]
        }
      };
    },
    assignment (item) {
      console.log('item', item);
      const rectType = item.ledRects[0].rectType;
      const videoList = item.ledMusics.map((musics, index) => {
        return {
          name: index,
          uid: musics.musicId,
          url: `${baseURL || config.baseURL.dev}/upload${musics.source}`,
          musicId: musics.musicId,
          fileCode: musics.musicCode,
          programCode: musics.programCode,
          path: musics.source
        }
      });
      this.programInfo = {
        ...this.programInfo,
        ...item,
        rectType,
        power: item.power === 1,
        programName: item.programName,
        date: [item.beginDate, item.endDate].filter(Boolean),
        time: (item.beginTime && item.endTime) ? [item.beginTime, item.endTime] : ['08:00', '18:00'],
        videoList
      };
      if (rectType === 1) {
        this.programInfo.fullScreen = item.ledRects[0];
      } else {
        this.programInfo.screen1 = item.ledRects[0];
        this.programInfo.screen2 = item.ledRects[1];
        this.programInfo.screen3 = item.ledRects[2];
        this.programInfo.screen4 = item.ledRects[3];
      }
    },
    closeedit () {
      this.dialogVisible = false;
    },
    canceledit (type) {
      this.closeedit();
    },
    querySearch (queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect (item) {
      if (item.index === 2) {
        this.programInfo = {
          ...this.programInfo,
          activityName: item.name,
          activityCode: item.id,
          imeis: item.imeis,
          date: item.date,
          programScenario: item.programScenario
        };
        this.timeScreenDisabled = true;
        this.form.number = this.programInfo.imeis.length;
      }
    },
    handleIconClick () {
      this.timeScreenDisabled = false;
      setTimeout(() => {
        this.$refs.timeScreenAutoInput.focus();
      }, 300);
    }
  }
};
</script>

<style lang="less">
.timeScreen-autocomplete{
  .el-scrollbar__view{
    li{
      .dom1{

      }
      .dom2{
        padding-left: 15px;/*no*/
        position: relative;
        font-size: 12px;/*no*/
        &::after{
          content: '';
          width: 4px;/*no*/
          height: 4px;/*no*/
          background: #ccc;
          border-radius: 50px;
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
        }
      }
    }
  }
}
#timedScreen{
  .basicsCard{
    .el-autocomplete{
      width: 100%;
      input{
        padding-right: 45px;/*no*/
      }
    }
    .el-radio-group{
      .el-radio{
        margin-right: 10px;/*no*/
        .el-radio__label{
          padding-left: 4px;/*no*/
        }
        +.el-radio{
          margin-left: 5px;/*no*/
        }
      }
    }
    .activityName{
      position: relative;
      .select{
        width: auto;
        position: absolute;
        top: 50%;
        right: 10px;/*no*/
        transform: translateY(-50%);
      }
    }
  }
  .baseInfoCard{
    .el-slider{
      .el-slider__runway{
        width: calc(100% - 10px);/*no*/
        margin: 12px 0;/*no*/
        margin-left: 10px;/*no*/
        .el-slider__button-wrapper{
          height: 30px;/*no*/
          width: 30px;/*no*/
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
  }
  .admin1Card{
    .programDetail{
      .title{
        font-size: 14px;/*no*/
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #3E3E3E;
        padding: 6px 0;
        border-bottom: 1px solid #D5D5D5;
      }
      .content{
        padding: 10px 0;/*no*/
      }
    }
  }
  .basicsCard, .admin1Card{
    .el-date-editor--timerange{
      .el-range-separator{
        width: auto;
      }
    }
  }
  .backgroundContainer{
    .scrollView__nav-wrap{
      .scrollView__nav-prev, .scrollView__nav-next{
        color: #ccc;
        font-size: 20px;/*no*/
      }
    }
    .resource_list {
      margin-bottom: 10px;/*no*/
      div {
        padding: 4px 18px;
        background: #232e53;
        border-radius: 2px;
        color: #fff;
        margin-right: 10px;
        display: inline-block;
        vertical-align: middle;
        cursor: pointer;
      }
    }
    .imgFileList, .videoFileList, .textFileList{
      >div:first-child{
        margin-bottom: 20px;/*no*/
      }
      ul.el-upload-list{
        li{
          margin-right: 10px;/*no*/
        }
      }
      .el-radio-group{
        .el-radio{
          margin-right: 10px;/*no*/
          .el-radio__label{
            padding-left: 4px;/*no*/
          }
        }
      }
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
      width: 265px;/*no*/
      height: 48px;/*no*/
      border: 1px solid;/*no*/
      border-image: linear-gradient(225deg, rgba(217, 234, 255, 1), rgba(187, 212, 255, 1)) 1 1;
      cursor: pointer;
      position: relative;
      .upload_img {
        width: 113px;/*no*/
        height: 28px;/*no*/
        background: linear-gradient(135deg, #E9F3FF 0%, #E6F6FF 100%);
        border: 1px solid rgb(50, 109, 172);/*no*/
        border-radius: 50px;/*no*/
        font-size: 12px;/*no*/
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #2A60CD;
        cursor: pointer;
        position: relative;
        padding-right:10px;/*no*/
        line-height: 1;
        .el-icon-top {
          position: absolute;
          right: 19px;/*no*/
          top: 50%;
          transform: translateY(-50%);
          font-size: 14px;/*no*/
          color: #2A60CD;
          font-weight: bold;
        }
      }
    }
    .resource_video, .resource_text {
      width: 182px;/*no*/
      height: 152px;/*no*/
      background: rgba(15, 20, 41, 1);
      border-radius: 5px;/*no*/
      border: 2px dashed rgba(44, 52, 58, 1);/*no*/
      // margin-bottom: 10px;
      cursor: pointer;
      .upload_video {
        margin: 0 auto;
        // margin-top: 72px;
        // margin-bottom: 15px;
        padding:0 40px;/*no*/
        height: 30px;/*no*/
        line-height: 30px;/*no*/
        text-align: center;
        background: rgba(72, 128, 255, 1);
        box-shadow: 0px 4px 7px 0px rgba(72, 128, 255, 0.5);/*no*/
        border-radius: 19px;/*no*/
        color: #fff;
        position: relative;
        .el-icon-top, .el-icon-plus {
          position: absolute;
          right: 2px;/*no*/
          top: 50%;
          transform: translateY(-50%);
          width: 26px;/*no*/
          height: 26px;/*no*/
          line-height: 26px;/*no*/
          border-radius: 50%;
          font-size: 10px;/*no*/
          background: rgba(56, 107, 225, 1);
          color: #fff;
        }
      }
      .el-textarea, textarea{
        width: 100%;
        height: 100%;
      }
    }
  }
  .saveBtnList{
    height: 70px;
    margin-top: 10px;/*no*/
    justify-content: center !important;
    align-items: center !important;
    button{
      padding: 8px 25px;/*no*/
      // background:rgba(21,27,46,1);
      border-radius:4px;/*no*/
      border:1px solid #ddd;
      color: #888;
      font-size:12px;/*no*/
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      background: #FFFFFF;
      border-radius: 1px;/*no*/
      border: 1px solid #2573F1;/*no*/
      font-size: 14px;/*no*/
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #2573F1;
      &.el-button--primary{
          background:#2573F1;
          color:rgba(230,236,255,1);
        box-shadow: 0px 2px 4px 0px #CDCDCD;/*no*/
      }
    }
  }
}
</style>
