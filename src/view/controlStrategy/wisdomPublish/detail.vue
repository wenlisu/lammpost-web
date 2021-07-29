-<template>
  <div id="wisdomPublishDetail">
    <div class="headerTitle">
      <search-form ref="searchBox" :searchItems="searchItems" :searchBtnShow="false" :seniorType="false">
        <div class="my-autocomplete" slot="address">
          <treeselect :value="form.imei" @input="tressSelectInput" @select="tressSelectSelect"/>
        </div>
      </search-form>
    </div>
    <div class="detail_content">
      <el-tabs v-model="activeName" @tab-click="changeTable" >
        <el-tab-pane label="LED显示屏" name="led"></el-tab-pane>
        <el-tab-pane label="广播" name="video"></el-tab-pane>
      </el-tabs>
      <div class="detail_form">
        <!-- <div class="modules_title">{{activeName == 'led' ? 'LED显示屏' : '广播'}}</div> -->
        <el-form :model="formcontent" ref="ruleForm" label-width="100px" label-position="left">
          <el-row>
            <el-col :span="10">
              <el-form-item label="组控开关：" prop="name" v-if="activeName === 'led'">
                <el-switch v-model="form.status" active-color="#2870FF"></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item :label="activeName === 'led' ? 'LED屏数量：' : '广播数量：'" prop="name">
                {{form.imei && form.imei.length}}{{'个'}}
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="场景：" prop="name">
                <el-radio-group v-model="formcontent.policyType">
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
            <el-col :span="14">
              <el-form-item label="显示亮度：" prop="name" v-if="activeName === 'led'">
                <el-slider
                  v-model="formcontent.brightness"
                  :format-tooltip="formatTooltip"
                  :show-tooltip="false"
                  @change="getBrightnessText"
                ></el-slider>
                <span class="brightText">{{formcontent.brightnessText}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="line"></div>
          <div class="resource_list" v-if="activeName === 'led'">
            <div
              :class="item.class"
              v-for="(item, index) in resource"
              :key="index"
              @click="changeResType(index)"
            >{{item.name}}</div>
          </div>
          <div class="resource_list" v-if="activeName === 'video'">
            <div
              class="active"
            >音频</div>
          </div>
          <div v-if="activeName === 'led' && resourceType==1" class="imgFileList">
            <uploadFile
              type="img"
              uploadUrl="/api/fileupload/upload"
              :fileList="fileList[1]"
              @change="val => changeUploadFile(val, 1)"
              :parames="{
                service_table: 'led_policy',
                serviceCode: `${serviceCode}1`
              }"
              >
              <template v-slot:content>
                <div class="flexCloumn flexCenter resource_img" v-if="fileList[1] && fileList[1].length < 5">
                  <div class="upload_img">
                    上传图片
                    <i class="el-icon-top"></i>
                  </div>
                  <p class="limit">最多上传5张图片</p>
                </div>
                <div v-else />
              </template>
            </uploadFile>
          </div>
          <div v-if="activeName === 'led' && resourceType==2" style="marginBottom: 10px">
            <uploadFile
              type="video"
              uploadUrl="/api/fileupload/upload"
              :fileList="fileList[2]"
              :limit="1"
              @change="val => changeUploadFile(val, 2)"
              :parames="{
                service_table: 'led_policy',
                serviceCode: `${serviceCode}2`
              }"
              >
              <template v-slot:content>
                <div class="flexCenter resource_video">
                  <div class="upload_video">
                    上传视频
                    <i class="el-icon-top"></i>
                  </div>
                </div>
              </template>
            </uploadFile>
          </div>
          <div v-if="activeName === 'led' && resourceType=='3'" style="marginBottom: 10px">
            <div class="flexRow textMain">
              <div class="textTemplate" v-if="word.keyWord && word.keyWord.length > 0">
                <div class="title">{{word.templateName}}</div>
                <ul>
                  <li
                  v-for="(item, index) in word.keyWord"
                  :key="index"
                  >
                    {{item}}
                  </li>
                </ul>
              </div>
            <div class="flexCenter resource_text" @click="handleTemplatePreview">
              <div class="upload_video">
                  选择模板
                <i class="el-icon-plus"></i>
              </div>
            </div>
            </div>
          </div>
          <div v-if="activeName === 'video'" style="marginBottom: 10px">
            <uploadFile
              type="audio"
              uploadUrl="/api/fileupload/upload"
              :fileList="fileList[3]"
              @change="val => changeUploadFile(val, 3)"
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
          <el-form-item label="播放时长：" prop="name" v-if="false">
            <selector
              v-model="formcontent.displayTime"
              :options="dateOptions"
              @mounted="dateMounted"
            />
          </el-form-item>
          <el-form-item label="播放方式：" prop="name" v-if="resourceType == 1 || resourceType == 2 || activeName === 'video'">
            <el-radio-group v-model="typeCommandList.find(item => item.policyContent === resourceType).displayWay">
              <el-radio :label="1" v-if="resourceType==1 || activeName === 'video'">循环播放</el-radio>
              <el-radio :label="2" v-if="resourceType==1 || activeName === 'video'">定时播放</el-radio>
              <el-radio :label="3" v-if="resourceType==1 || activeName === 'video'">插播</el-radio>
              <el-radio :label="4" v-if="resourceType==1 || activeName === 'video'">跟播</el-radio>
              <el-radio :label="5" v-if="resourceType==1 || activeName === 'video'">定时转播</el-radio>
              <el-radio :label="6" v-if="resourceType==2 || activeName === 'video'">循环轮播3次</el-radio>
              <el-radio :label="7" v-if="resourceType==2 || activeName === 'video'">循环轮播5次</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-row>
            <el-col :span="10">
              <el-form-item label="策略生效时间：" prop="name">
                <el-time-picker
                  is-range
                  v-model="typeCommandList.find(item => item.policyContent === resourceType).chooseDate"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  format="HH:mm"
                  value-format="HH:mm"
                >
                </el-time-picker>
                <!-- <selector
                  v-else
                  v-model="typeCommandList.find(item => item.policyContent === resourceType).onTime"
                  :options="onTimeOptions"
                  @mounted="dateMounted"
                /> -->
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="策略状态：" prop="name" style="margin-bottom:20px">
                <el-radio-group v-model="typeCommandList.find(item => item.policyContent === resourceType).policyStatus">
                  <el-radio :label="1">开启</el-radio>
                  <el-radio :label="2">关闭</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <div v-if="false">
            <el-button class="primary" size="mini">完成</el-button>
            <el-button class="primary" size="mini" @click="nextStep(resourceType)">下一步</el-button>
          </div>
        </el-form>
      </div>
      <div class="tools_btn">
        <el-button class="cancel_btn" size="mini" @click="cancel">取消</el-button>
        <el-button class="submit_btn" size="mini" @click="save">保存</el-button>
      </div>
    </div>
    <dialog-cont
      @on-close="canceledit('close')"
      :title="`选择模板`"
      width="80%"
      :visible.sync="dialogVisible"
      :cancelShow="false"
      :confirmShow="false"
      ref="dialog"
    >
    <commonTemplate ref="commonTemplate" @select="handleSelelctTemplate"/>
    </dialog-cont>
  </div>
</template>
<script>
import {
  mapGetters
} from 'vuex';
import moment from 'moment';
import { getGroupPolicy, getLamp, deleteByFileCode } from 'api/index';
import {
  getPolicyDetail,
  addPolicy,
  updatePolicy,
  getAddress,
  getSingAddress,
  selectTemplate,
  updateBroadcast,
  addBroadcast,
  getBroadcastDetail
} from 'api/controlStrategy';
import {
  ledAdd,
  ledDelete,
  ledDetail,
  ledGet,
  ledUpdate
} from 'api/led/index';
import searchForm from 'components/searchForm/searchForm';
import selector from '@/components/selector';
import treeselect from '@/components/treeselect';
import upload from '@/components/upload/upload';
import uploadFile from '@/components/upload/uploadFile';
import dialogCont from '@/components/dialog';
import { LIGHT_TYPE } from '@/util/constants';
import { checkTimeBetween } from '@/util/util';
import config, { baseURL } from '@/config';
import commonTemplate from '../commonTemplate';
import { policyTypes } from './util';
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
    commonTemplate,
    dialogCont,
    treeselect
  },
  data () {
    return {
      policyTypes,
      dialogVisible: false,
      form: {
        address: [],
        groupName: '',
        imei: [],
        number: '',
        status: false
      },
      searchItems: [
        {
          type: 'custom',
          label: '灯杆',
          labelWidth: '45px',
          initValue: undefined,
          props: {
            fieldName: 'address'
          }
        },
        {
          type: 'input',
          label: '活动名称',
          initValue: undefined,
          props: {
            fieldName: 'groupName'
          }
        }, {
          type: 'dataPicker',
          label: '生效日期',
          initValue: [],
          props: {
            fieldName: 'date',
            startPlaceholder: '生效日期',
            endPlaceholder: '关闭日期'
          }
        }
      ],
      areaOptions: [],
      activeName: 'led',
      formcontent: {
        brightness: 0,
        brightnessText: '节能',
        policyType: null
        // displayTime: undefined
      },
      resource: [
        { class: 'active', name: '图片', type: 1 },
        { class: '', name: '视频', type: 2 },
        { class: '', name: '文字', type: 3 }
      ],
      resourceType: 1,
      selectorInstance: null,
      dateOptions: [
        { label: '10分钟', value: '1' },
        { label: '20分钟', value: '2' },
        { label: '30分钟', value: '3' },
        { label: '1小时', value: '4' },
        { label: '2小时', value: '5' }
      ],
      onTimeOptions: [
        { label: '立即', value: '立即' },
        { label: '01:00', value: '01:00' },
        { label: '02:00', value: '02:00' },
        { label: '03:00', value: '03:00' },
        { label: '04:00', value: '04:00' },
        { label: '05:00', value: '05:00' },
        { label: '06:00', value: '06:00' },
        { label: '07:00', value: '07:00' },
        { label: '08:00', value: '08:00' },
        { label: '09:00', value: '09:00' },
        { label: '10:00', value: '10:00' },
        { label: '11:00', value: '11:00' },
        { label: '12:00', value: '12:00' },
        { label: '13:00', value: '13:00' },
        { label: '14:00', value: '14:00' },
        { label: '15:00', value: '15:00' },
        { label: '16:00', value: '16:00' },
        { label: '17:00', value: '17:00' },
        { label: '18:00', value: '18:00' },
        { label: '19:00', value: '19:00' },
        { label: '20:00', value: '20:00' },
        { label: '21:00', value: '21:00' },
        { label: '22:00', value: '22:00' },
        { label: '23:00', value: '23:00' },
        { label: '24:00', value: '24:00' }
      ],
      typeCommandList: [{
        policyContent: 1,
        chooseDate: undefined,
        policyStatus: null,
        displayWay: null
      }, {
        policyContent: 2,
        chooseDate: undefined,
        policyStatus: null,
        displayWay: null
      }, {
        policyContent: 3,
        chooseDate: undefined,
        policyStatus: null,
        displayWay: null
      }, {
        policyContent: 4,
        chooseDate: undefined,
        policyStatus: null,
        displayWay: null
        // onTime: null
      }],
      word: {
        id: null,
        keyWord: [],
        templateName: ''
      },
      editData: {},
      fileList: {
        1: [],
        2: [],
        3: []
      },
      serviceCode: ''
    };
  },
  mounted () {
    this.$nextTick(async () => {
      this.getArea();
      this.activeName = this.$route.query.activeName;
      this.editData = this.common[queryName[this.activeName]];
      this.changeTable({ name: this.activeName });
      this.serviceCode = moment().format('YYYYMMDDHHmmss');
      if (this.editData && this.editData.id) {
        this.serviceCode = this.editData.groupNo || this.editData.teamNo;
        if (this.activeName === 'led' && this.editData.groupNo) {
          this.getLedDetail();
        } else if (this.editData.teamNo) {
          this.getVideoDetail();
        }
      }
    })
  },
  computed: {
    ...mapGetters(['common', 'openPage'])
  },
  methods: {
    setDefault (data) {
      let searchItems = this.searchItems.map(item => {
        return {
          ...item,
          initValue: data[item.props.fieldName]
        }
      });
      this.searchItems = searchItems;
      const address = [];
      this.form = {
        // address: data.address,
        // area: data.area,
        groupName: data.groupName,
        number: data.number,
        status: data.status === 1 || false,
        imei: data.lampAreaDtos.map(dto => {
          if (address.indexOf(dto.address) < 0) {
            address.push(dto.address);
          }
          return {
            ...dto,
            id: dto.imei
          }
        })
      };
      this.form.address = address;
      // this.setLightOptions(data.address);
    },
    getLedDetail () {
      const types = this.$_useTypes(LIGHT_TYPE).types;
      ledDetail(this.editData.groupNo).then(res => {
        if (res.code === '200') {
          this.setDefault(res.data);
          const brightness = res.data.typeCommandList[0].brightness;
          const policyType = res.data.typeCommandList[0].policyType;
          this.formcontent = {
            ...this.formcontent,
            brightness: Math.floor(brightness * 30),
            brightnessText: types[brightness],
            policyType
          };
          this.searchItems[2].initValue = [res.data.workTime, res.data.closeTime];
          this.typeCommandList = this.typeCommandList.map(list => {
            const findList = res.data.typeCommandList.find(flist => flist.policyContent === list.policyContent);
            if (list.policyContent === 1) {
              this.fileList[1] = findList && findList.picture ? findList.picture.map((pic, index) => {
                return {
                  name: index,
                  url: `${baseURL || config.baseURL.dev}/upload${pic.filePath}`,
                  fileType: pic.fileType,
                  fileCode: pic.fileCode,
                  path: pic.filePath
                }
              }) : [];
            } else if (list.policyContent === 2) {
              this.fileList[2] = findList && findList.video ? [{
                name: 'video',
                url: `${baseURL || config.baseURL.dev}/upload${findList.video && findList.video[0] && findList.video[0].filePath}`,
                path: findList.video && findList.video[0] && findList.video[0].filePath
              }] : [];
            } else if (list.policyContent === 3) {
              if (findList && findList.word) {
                selectTemplate({id: findList.word, imei: null}).then(selectRes => {
                  if (selectRes.code === '200') {
                    this.handleSelelctTemplate({id: findList.word, ...selectRes.data})
                  }
                });
              }
            }
            return {
              ...list,
              ...findList,
              chooseDate: (findList && findList.onTime && findList.offTime) ? [findList.onTime, findList.offTime] : undefined
            }
          });
        }
      });
    },
    getVideoDetail () {
      getBroadcastDetail(this.editData.teamNo).then(res => {
        if (res.code === '200') {
          this.setDefault({ ...res.data, groupName: res.data.teamName });
          this.fileList[3] = [{
            name: 'audio',
            url: `${baseURL || config.baseURL.dev}/upload${res.data.filePath}`,
            path: res.data.filePath
          }];
          this.formcontent = {
            ...this.formcontent,
            // displayTime: res.data.displayTime,
            policyType: res.data.displayType
          };
          this.resourceType = 4;
          this.searchItems[2].initValue = [res.data.workTime, res.data.closeTime];
          let typeCommandList = this.typeCommandList.map(list => {
            if (list.policyContent === this.resourceType) {
              return {
                policyContent: 4,
                displayWay: res.data.displayWay,
                // displayType: res.data.displayType,
                policyStatus: res.data.status,
                chooseDate: (res.data.onTime && res.data.offTime) ? [res.data.onTime, res.data.offTime] : undefined
              }
            }
            return list;
          });
          this.typeCommandList = typeCommandList;
        }
      });
    },
    dateMounted (instance) {
      this.selectorInstance = instance;
    },
    changeResType (index) {
      this.resource.map((item, i) => {
        item.class = '';
        if (index === i) {
          item.class = 'active';
          this.resourceType = item.type;
        }
      });
    },
    formatTooltip (val) {
      return val / 100;
    },
    getArea () {
      getGroupPolicy().then(res => {
        if (res.code === '200') {
          this.areaOptions = res.data.map(data => {
            return {
              id: data.id,
              name: data.area
            };
          });
        }
      });
    },
    handleSelect (item) {
      this.form.imei = item.imei;
      this.form.address = item.address;
      this.getNumber(item);
    },
    async getNumber (item) {
      if (item.area && item.address) {
        const numberItems = await this.loadAll(item.area, item.address);
        this.$set(this.form, 'number', numberItems[0].number);
        this.setLightOptions(item.address);
      }
    },
    async setLightOptions (address) {
      const lampItems = await this.loadLamp(address);
      const lampItemsInitValue = lampItems.map(item => item.id);
      this.$set(this.form, 'imei', lampItemsInitValue);
      this.$set(this.searchItems[1].props, 'options', lampItems);
      this.$set(this.searchItems[1], 'initValue', lampItemsInitValue);
    },
    changeTable (tab, event) {
      if (tab.name === 'video') {
        this.resourceType = 4
      } else {
        this.resourceType = 1
      }
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
    loadLamp (address = '') {
      let api = getLamp;
      return api(address).then(res => {
        if (res.code === '200') {
          let dataList = [];
          res.data.map(data => {
            dataList.push({
              ...data,
              id: data.imei,
              name: data.address
            })
          });
          return dataList;
        }
      });
    },
    querySearch (queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter (queryString) {
      return restaurant => {
        return (
          restaurant.address.toLowerCase().indexOf(queryString.toLowerCase()) >
          -1
        );
      };
    },
    handleIconClick (ev) {
      console.log(ev);
    },
    async handleChangeArea (area) {
      this.restaurants = await this.loadAll(area);
      // console.log(area, area !== this.currentArea);
      if (area !== this.currentArea) {
        // this.form.address = '';
        this.currentArea = area;
      }
    },
    handleTemplatePreview (file) {
      this.dialogVisible = true;
      setTimeout(() => {
        this.$refs.commonTemplate.selectCurrentRow(this.word.id)
      }, 500);
    },
    handleRemove () {

    },
    handleDownload (file) {
      console.log(file);
    },
    closeedit () {
      this.dialogVisible = false;
    },
    canceledit (type) {
      this.closeedit();
    },
    cancel () {
      this.formcontent = {
        brightness: 0,
        brightnessText: '节能',
        policyType: null
        // displayTime: undefined
      };
      this.typeCommandList = [{
        policyContent: 1,
        chooseDate: undefined,
        policyStatus: 1,
        displayWay: null
      }, {
        policyContent: 2,
        chooseDate: undefined,
        policyStatus: 1,
        displayWay: null
      }, {
        policyContent: 3,
        chooseDate: undefined,
        policyStatus: 1,
        displayWay: null
      }, {
        policyContent: 4,
        chooseDate: undefined,
        policyStatus: null,
        displayWay: null
      }];
      this.word = {
        id: null,
        keyWord: [],
        templateName: ''
      };
      this.fileList = {
        1: [],
        2: [],
        3: []
      };
      this.$router.push({
        name: this.editData.toName
      });
      this.editData = {};
    },
    save () {
      const searchData = this.$refs.searchBox.onSearch();
      let notifyinputErr = {
        // 'area': {
        //   rule: !this.form.area,
        //   message: '选择区域'
        // },
        // 'address': {
        //   rule: !this.form.address,
        //   message: '选择道路名称'
        // },
        'groupName': {
          rule: !searchData.groupName,
          message: '输入策略名称'
        },
        'workTime': {
          rule: searchData.date && !searchData.date[0],
          message: '选择生效时间'
        },
        'closeTime': {
          rule: searchData.date && !searchData.date[1],
          message: '选择关闭时间'
        },
        'policyType': {
          rule: !this.formcontent.policyType,
          message: '选择场景'
        }
      };
      if (this.activeName === 'led') {
        let ledApiMethod = ledAdd;
        let ledRules = [];
        let ledTimes = [];
        // notifyinputErr['brightness'] = {
        //   rule: this.formcontent.brightnessText,
        //   message: '选择亮度'
        // }
        let groupNo = '';
        let typeCommandList = this.typeCommandList.map(list => {
          let parames = {
            ...list,
            brightness: LIGHT_TYPE[this.formcontent.brightnessText],
            policyType: this.formcontent.policyType,
            onTime: list.chooseDate && list.chooseDate[0],
            offTime: list.chooseDate && list.chooseDate[1]
          }
          delete parames.chooseDate;
          if (parames.policyContent === 1) {
            parames.serviceCode = `${this.serviceCode}1`;
            const picture = this.fileList[1].map(file => file.path);
            const pictureJudge = parames.displayWay !== null && picture.length === 0;
            ledRules.push(pictureJudge);
          } else if (parames.policyContent === 2) {
            parames.serviceCode = `${this.serviceCode}2`;
            const video = this.fileList[2] && this.fileList[2][0] && this.fileList[2][0].path;
            const videoJudge = parames.displayWay !== null && !video;
            ledRules.push(videoJudge);
          } else if (parames.policyContent === 3) {
            parames.word = this.word.id;
            const wordJudge = parames.offTime && parames.onTime && !parames.word;
            ledRules.push(wordJudge);
          }
          const canPush = ((parames.offTime && parames.onTime) || parames.displayWay !== null);
          if (canPush) {
            ledTimes.push(list.chooseDate);
          }
          return canPush ? parames : null;
        });
        const ledTimesRules = [
          checkTimeBetween(ledTimes[0], ledTimes[1]),
          checkTimeBetween(ledTimes[0], ledTimes[2]),
          checkTimeBetween(ledTimes[1], ledTimes[2])
        ];
        notifyinputErr['ledTimesRules'] = {
          rule: ledTimesRules.includes(true),
          message: '检查时间是否冲突'
        };
        typeCommandList = typeCommandList.filter(Boolean);
        ledRules.push(typeCommandList.length < 1);
        let ledParames = {
          // address: this.form.address,
          // area: this.form.area,
          groupName: searchData.groupName,
          workTime: searchData.date && searchData.date[0],
          closeTime: searchData.date && searchData.date[1],
          lampAreaDtos: this.form.imei.map(imeiItem => {
            return {
              imei: imeiItem.imei,
              area: imeiItem.area,
              address: imeiItem.address
            }
          }),
          number: this.form.imei.length,
          status: this.form.status ? 1 : 2,
          serviceTable: 'led_policy',
          groupNo: this.serviceCode,
          typeCommandList
        };
        if (this.editData.id) {
          ledApiMethod = ledUpdate;
          ledParames.id = this.editData.id;
          ledParames.groupNo = this.editData.groupNo;
        }
        notifyinputErr['ledRules'] = {
          rule: ledRules.includes(true),
          message: '检查策略值'
        }
        const inputerrArray = this.$_notifyError(notifyinputErr)
        if (inputerrArray.length !== 0) {
          return false;
        }
        ledApiMethod(ledParames).then(res => {
          if (res.code === '200') {
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success',
              position: 'bottom-right'
            });
            this.cancel();
          }
        });
      } else {
        let videoApiMethod = addBroadcast;
        let videoRules = [];
        let videoParames = {
          // address: this.form.address,
          // area: this.form.area,
          teamName: searchData.groupName,
          lampAreaDtos: this.form.imei.map(imeiItem => {
            return {
              imei: imeiItem.imei,
              area: imeiItem.area,
              address: imeiItem.address
            }
          }),
          number: this.form.imei.length,
          workTime: searchData.date[0],
          closeTime: searchData.date[1],
          // displayTime: this.formcontent.displayTime,
          displayType: this.formcontent.policyType,
          serviceTable: 'broadcast_policy',
          serviceCode: `${this.serviceCode}2`,
          teamNo: this.serviceCode
        };
        const findVideo = this.typeCommandList[3];
        // const onTime = findVideo.onTime === '立即' ? moment().format('HH:mm') : findVideo.onTime
        videoParames = {
          ...videoParames,
          status: findVideo.policyStatus,
          onTime: findVideo.chooseDate && findVideo.chooseDate[0],
          offTime: findVideo.chooseDate && findVideo.chooseDate[1],
          displayWay: findVideo.displayWay,
          audio: this.fileList[3] && this.fileList[3][0] && this.fileList[3][0].path
        }
        videoRules.push(!videoParames.onTime || !videoParames.offTime);
        videoRules.push(!videoParames.displayWay);
        videoRules.push(!videoParames.displayType);
        videoRules.push(!videoParames.audio);
        notifyinputErr['videoRules'] = {
          rule: videoRules.includes(true),
          message: '检查策略值'
        }
        const inputerrArray = this.$_notifyError(notifyinputErr)
        if (inputerrArray.length !== 0) {
          return false;
        }
        if (this.editData.id) {
          videoApiMethod = updateBroadcast;
          videoParames.id = this.editData.id;
        }
        videoApiMethod(videoParames).then(res => {
          if (res.code === '200') {
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success',
              position: 'bottom-right'
            });
            this.cancel();
          }
        });
      }
    },
    handleSelelctTemplate (item) {
      this.word = {
        ...item
      };
      this.canceledit('cancel')
    },
    changeUploadFile (list, type) {
      const removeObj = this.fileList[type].filter(obj => !list.some(obj1 => obj1.uid === obj.uid));
      if (removeObj[0] && removeObj[0].fileCode) {
        deleteByFileCode(removeObj[0].fileCode).then(res => {
          if (res.code === '200') {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              position: 'bottom-right'
            });
            this.fileList[type] = list;
          }
        })
      } else {
        this.fileList[type] = list;
      }
    },
    getBrightnessText (val) {
      // 1-30: 30-60: 60-100
      const types = this.$_useTypes(LIGHT_TYPE).types;
      const number = Math.floor(val / 30) + 1;
      this.formcontent.brightnessText = types[number] || '高'
    },
    tressSelectInput (value) {
      const address = [];
      this.form.imei = value.map(val => {
        if (address.indexOf(val.addressId) < 0) {
          address.push(val.addressId);
        }
        return {
          imei: val.imei,
          id: val.imei || val.id,
          area: val.area,
          address: val.addressId
        }
      });
      this.form.address = address;
    },
    tressSelectSelect (val) {
      // this.form.area = val.area;
      // this.form.address = val.address;
    }
  }
};
</script>
<style lang="less" scoped>
#wisdomPublishDetail {
  .headerTitle {
    margin-bottom: 10px; /*no*/
    background: rgba(32, 45, 85, 0.49);
    border-radius: 4px;
    display: flex;
    padding: 20px 20px 10px;
    position: relative;
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 1px; /*no*/
      background: rgba(43, 126, 242, 1);
      border-radius: 1px; /*no*/
    }
  }
  .my-autocomplete {
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
        background: rgba(34, 44, 81, 0.5);
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
      background: rgba(22, 29, 55, 1)
        linear-gradient(
          276deg,
          rgba(37, 168, 203, 1) 0%,
          rgba(88, 160, 255, 1) 100%
        );
    }
    /deep/.el-tabs__nav-wrap::after {
      background-color: #192349;
      height: 1px;
    }

    .detail_form {
      color: #e6ecff;
      font-size: 12px;/*no*/
      padding: 20px 50px;
      background: rgba(32, 45, 85, 0.49);
      border-radius: 4px;
      .el-form-item__content{
        position: relative;
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
        color: #e6ecff;
        font-size: 12px;/*no*/
      }
      .el-form-item__content{
        margin-left: 70px !important;/*no*/
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
        background: #34437b;
        border-color: #34437b;
      }
      /deep/.is-checked /deep/.el-radio__inner {
        border-color: #2870ff;
        &::after{
          background: #2870ff;
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
        width: 122px;
        height: 25px !important;
        line-height: 25px !important;
        display: inline-block;
        /deep/.el-input__inner,
        .el-input__inner:focus {
          color: #e6ecff;
          border: 1px solid #6275bf !important;
          background: rgba(34, 44, 81, 1);
          border-radius: 4px;
          outline: none;
        }
        /deep/.el-input--suffix /deep/.el-input__inner {
          padding: 0 6px !important;/*no*/
          height: 25px !important;/*no*/
          line-height: 25px !important;/*no*/
        }
        .el-input__icon{
          height: 25px;
          line-height: 25px;
        }
      }
      .el-radio__inner {
        background-color: #202d55;
        border-color: #ffffff;
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
        .active {
          background: #1baacc;
        }
      }
      .imgFileList{
        ul.el-upload-list{
          li{
            margin-right: 10px;/*no*/
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
        width: 182px;
        height: 152px;
        background: rgba(15, 20, 41, 1);
        border-radius: 5px;
        // margin-bottom: 10px;
        cursor: pointer;
        position: relative;
        border: 2px dashed rgba(44, 52, 58, 1);
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
      .resource_video, .resource_text {
        width: 182px;
        height: 152px;
        background: rgba(15, 20, 41, 1);
        border-radius: 5px;
        border: 2px dashed rgba(44, 52, 58, 1);
        // margin-bottom: 10px;
        cursor: pointer;
        .upload_video {
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
          .el-icon-top, .el-icon-plus {
            position: absolute;
            right: 2px;
            top: 50%;
            transform: translateY(-50%);
            width: 26px;
            height: 26px;
            line-height: 26px;
            border-radius: 50%;
            font-size: 10px;
            background: rgba(56, 107, 225, 1);
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
  .line {
    background: #3f4c70;
    height: 1px;
    margin: 20px 0;
  }
  .primary {
    background: linear-gradient(
      318deg,
      rgba(29, 91, 250, 1) 0%,
      rgba(0, 119, 228, 1) 100%
    );
    border-radius: 4px;
    padding: 5px 15px;
    color: #e6ecff;
    font-size: 12px;
  }
  .tools_btn {
    text-align: center;
    margin-top: 30px;
    margin-bottom: 30px;
  }
  .submit_btn {
    background: linear-gradient(
      318deg,
      rgba(29, 91, 250, 1) 0%,
      rgba(0, 119, 228, 1) 100%
    );
    border-radius: 4px;
    padding: 8px 15px;
    color: #e6ecff;
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
    background: transparent;
      border: none;
      .el-input__icon{
        display: none;
      }
      .el-range-separator{
        width: auto;
        padding: 0 10px;/*no*/
        font-size:12px;/*no*/
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(230,236,255,1);
      }
    input{
      width: 45%;
      background:rgba(34,44,81,1);
      border-radius:4px;
      border:1px solid rgba(98,117,191,1);
      color:rgba(230,236,255,1);
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
}
</style>
