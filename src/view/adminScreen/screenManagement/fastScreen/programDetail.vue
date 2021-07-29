<template>
  <div id="programDetail">
    <el-form :model="info" ref="ruleForm" :rules="rules" label-width="100px" label-position="left">
      <scrollView>
        <div class="flexRow listItems">
          <div
            class="item"
            v-for="(item, itemIndex) in fileLists"
            :key="item.source"
            @click.prevent.stop="editFile(item, itemIndex)"
          >
            <div class="flexCenter fullicon"  @click.prevent.stop="listTypePrew('full', item, itemIndex)">
              <i class="el-icon-full-screen"/>
            </div>
            <div class="flexRow flexCenter labers">
              <div
                v-for="iconItem in labers"
                :key="iconItem.id"
                class="flexCenter icon"
                @click.prevent.stop="listTypePrew(iconItem.id, item, itemIndex)"
              >
                <i :class="iconItem.icon" />
              </div>
            </div>
            <img
              :src="`${baseURL || config.baseURL.dev}/upload${item.source}`"
              v-if="item.mediaType === 1"
            />
            <video
              v-if="item.mediaType === 2"
              :src="`${baseURL || config.baseURL.dev}/upload${item.source}`"
              class="avatar video-avatar"
              controls="controls"
            >您的浏览器不支持视频播放</video>
            <div
              class="textTemplate"
              v-if="item.mediaType === 3"
            >
              {{item.source}}
            </div>
          </div>
          <div class="flexCloumn flexCenter resource_list">
            <div
              class="flexCenter"
              :class="item.class"
              v-for="(item, index) in resource"
              :key="index"
              @click="changeResType(index)"
            >
              上传{{item.name}}
            <i class="el-icon-top"></i>
            </div>
          </div>
        </div>
      </scrollView>
      <dialog-cont
        @on-cancel="dialogCancel"
        @on-confirm="dialogSubmit"
        :visible.sync="dialog.show"
        width="750px"
        :title="`上传${dialog.title}`"
        append-to-body
        customClass="programDetailDialog"
      >
        <div v-if="dialog.resourceType==1" class="imgFileList">
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
              <div class="flexCloumn flexCenter resource_img">
                <div class="upload_img">
                  上传图片
                  <i class="el-icon-top"></i>
                </div>
                <!-- <p class="limit">最多上传5张图片</p> -->
              </div>
            </template>
          </uploadFile>
          <el-row :gutter="10" class="marginTop">
            <el-col :span="24">
              <el-form-item label="特效类型：" prop="name">
                <el-radio-group v-model="info.type">
                  <el-radio
                    v-for="(item, index) in specialTypes"
                    :key="index"
                    :label="item.id"
                  >
                  {{item.name}}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="特效方向：" prop="name">
                <el-radio-group v-model="info.direction">
                  <el-radio
                    v-for="(item, index) in specialDirections"
                    :key="index"
                    :label="item.id"
                  >
                  {{item.name}}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="marginTop">
            <el-col :span="24">
              <el-form-item
                label="特效时间："
                prop="durationTime">
                <el-input v-model="info.durationTime">
                  <template slot="append">秒</template>
                </el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="24">
              <el-form-item label="图片更新时间：" prop="updateTime">
                <el-input v-model="info.updateTime">
                  <template slot="append">秒</template>
                </el-input>
              </el-form-item>
            </el-col> -->
          </el-row>
          <el-row :gutter="10" class="marginTop">
            <el-col :span="24">
              <el-form-item
                label="停留时间："
                prop="picStayTime">
                <el-input v-model="info.picStayTime">
                  <template slot="append">秒</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-if="dialog.resourceType==2" class="videoFileList">
          <uploadFile
            type="video"
            uploadUrl="/api/fileupload/upload"
            :fileList="fileList[2]"
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
          <el-row :gutter="10" class="marginTop">
            <el-col :span="24">
              <el-form-item label="视频缩放模式：" prop="name">
                <el-radio-group v-model="info.zoomType">
                  <el-radio
                    v-for="(item, index) in zoomTypes"
                    :key="index"
                    :label="item.id"
                  >
                  {{item.name}}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span=24>
              <el-form-item
                label="停留时间："
                prop="videoStayTime">
                <el-input v-model="info.videoStayTime">
                  <template slot="append">秒</template>
                </el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="24">
              <el-form-item label="图片更新时间：" prop="updateTime">
                <el-input v-model="info.updateTime">
                  <template slot="append">秒</template>
                </el-input>
              </el-form-item>
            </el-col> -->
          </el-row>
        </div>
        <div v-if="dialog.resourceType=='3'" class="textFileList">
          <div class="flexRow textMain">
            <!-- <TextDetail :styleLess="{
                fontSize: `${info.textSize}px`,
                color: info.textColor,
              }" ref="textDetail" :data="info.source"/> -->
          <div class="flexCenter resource_text">
            <!-- <div class="upload_video">
                选择模板
              <i class="el-icon-plus"></i>
            </div> -->
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入文字内容"
              v-model="info.source"
              :style="{
                fontSize: `${info.textSize}px`,
                color: info.textColor,
              }"
            >
            </el-input>
          </div>
          </div>
          <el-row :gutter="10" class="marginTop">
            <el-col :span="12">
              <el-form-item
                label="字体大小："
                prop="textSize">
                <el-input v-model="info.textSize">
                  <template slot="append">px</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="字体颜色："
                prop="textColor"
                >
                <el-input v-model="info.textColor" placeholder="(十六进制)">
                  <ColorPicker v-model="info.textColor" slot="prefix" v-on:change="headleChangeColor"/>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="marginTop">
            <el-col :span="24">
              <el-form-item
              label="滚动速度："
              prop="textSpeed">
                <el-input v-model="info.textSpeed">
                  <template slot="append">像素</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="marginTop">
            <el-col :span="12">
              <el-form-item label="滚动方向：" prop="direction">
                <el-radio-group v-model="info.direction">
                  <el-radio
                    v-for="(item, index) in rollDirections"
                    :key="index"
                    :label="item.id"
                  >
                  {{item.name}}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="播放模式：" prop="mode">
                <el-radio-group v-model="info.mode">
                  <el-radio
                    v-for="(item, index) in playModes"
                    :key="index"
                    :label="item.id"
                  >
                  {{item.name}}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="marginTop">
            <el-col :span="24">
              <el-form-item
              label="停留时间："
              prop="textStayTime">
                <el-input v-model="info.textStayTime">
                  <template slot="append">秒</template>
                </el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="24">
              <el-form-item label="图片更新时间：" prop="updateTime">
                <el-input v-model="info.updateTime">
                  <template slot="append">秒</template>
                </el-input>
              </el-form-item>
            </el-col> -->
          </el-row>
        </div>
      </dialog-cont>
      <el-dialog
        title="查看详情"
        :visible.sync="dialogFileVisible"
        width="550px"
        :before-close="handleClose"
        custom-class="ledDialogDetail"
      >
        <div class="content">
          <img
            :src="`${baseURL || config.baseURL.dev}/upload${dialogFile.source}`"
            v-if="dialogFile.mediaType === 1"
          />
          <video
            v-if="dialogFile.mediaType === 2"
            :src="`${baseURL || config.baseURL.dev}/upload${dialogFile.source}`"
            class="avatar video-avatar"
            controls="controls"
          >您的浏览器不支持视频播放</video>
          <div
            class="textTemplate"
            v-if="dialogFile.mediaType === 3"
          >
            {{dialogFile.source}}
          </div>
        </div>
      </el-dialog>
    </el-form>
  </div>
</template>
<script>
import {
  mapGetters
} from 'vuex';
import moment from 'moment';
import * as echarts from 'echarts'; // 引入echarts
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import ColorPicker from '@/components/colorPicker';
import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect';
import Flex from '@/components/flex';
import labers from '@/components/labers';
import searchForm from 'components/adminSearchForm/searchForm';
import FormItem from '@/components/adminFormItem';
import FormItemText from '@/components/formItemText/formItemText';
import card from 'view/lightPole/lightPoleStatistical/components/card';
import PageTable from '@/components/adminPage-table';
import PoleMap from '@/view/index/lightPoleMap/poleMap';
import echartData from '@/view/lightPole/lightPoleStatistical/components/echartData';
import uploadFile from '@/components/upload/uploadFile';
import dialogCont from '@/components/adminDialog';
import scrollView from '@/components/sideMenu/scrollView';
import TextDetail from './TextDetail';
import { routePush } from '@/util/util';
import config, { baseURL } from '@/config';
import { COMMON_TEMPLATE_SERVICE_TYPE } from '@/util/constants';
import {
  getGroupPolicy,
  getLamp,
  deleteByFileCode
} from 'api/index';
import {
  getDeviceModuleTree,
  getDetailByID
} from 'api/admin';
import {
  getSmokeDetectorSiteTree
} from 'api/smokeDetectorMap';
import 'swiper/swiper-bundle.css';

const onlineStatusType = {
  1: '在线',
  2: '故障',
  3: '离线'
};

const alarmStatusType = {
  1: '报警',
  0: '在线'
};

const statusPandType = {
  正常: 'normal',
  离线: 'normal',
  故障: 'malfunction',
  报警: 'alarm'
};

export default {
  name: 'programDetail',
  components: {
    Treeselect,
    Flex,
    FormItemText,
    card,
    PageTable,
    Swiper,
    SwiperSlide,
    echartData,
    searchForm,
    PoleMap,
    labers,
    FormItem,
    uploadFile,
    dialogCont,
    scrollView,
    ColorPicker,
    TextDetail
  },
  data () {
    return {
      rules: {},
      baseURL,
      config,
      resource: [
        { class: 'active', name: '图片', type: 1 },
        { class: '', name: '视频', type: 2 },
        { class: '', name: '文字', type: 3 }
      ],
      labers: [{
        id: 'prev',
        icon: 'el-icon-arrow-left'
      }, {
        id: 'next',
        icon: 'el-icon-arrow-right'
      }, {
        id: 'delete',
        icon: 'el-icon-delete'
      }],
      dialog: {
        show: false,
        title: '图片',
        type: 'add',
        resourceType: 1,
        itemIndex: 0
      },
      fileList: {
        1: [],
        2: [],
        3: []
      },
      programInfo: {
        bound: undefined,
        boundDto: undefined,
        programCode: undefined,
        rectCode: undefined,
        rectId: undefined,
        rectType: undefined
      },
      fileLists: [],
      serviceCode: '',
      specialTypes: [{
        id: 1,
        name: '直接显示'
      }, {
        id: 2,
        name: '整体平移'
      }, {
        id: 3,
        name: '整体旋转'
      }, {
        id: 4,
        name: '开合旋转'
      }, {
        id: 5,
        name: '分块旋转'
      }, {
        id: 6,
        name: '百叶窗'
      }],
      specialDirections: [{
        id: 1,
        name: '上'
      }, {
        id: 2,
        name: '下'
      }, {
        id: 3,
        name: '左'
      }, {
        id: 4,
        name: '右'
      }],
      zoomTypes: [{
        id: 1,
        name: '平铺'
      }, {
        id: 3,
        name: '缩放'
      }],
      rollDirections: [{
        id: 1,
        name: '纵向'
      }, {
        id: 2,
        name: '横向'
      }],
      playModes: [{
        id: 1,
        name: '静止'
      }, {
        id: 2,
        name: '滚动'
      }],
      dialogFileVisible: false,
      dialogFile: {},
      info: {
        textStayTime: undefined,
        videoStayTime: undefined,
        picStayTime: undefined,
        type: 1,
        direction: 1,
        durationTime: undefined,
        stayTime: undefined,
        updateTime: undefined,
        zoomType: 1,
        mode: 1,
        source: undefined,
        sourceObj: {},
        textSize: undefined,
        textColor: '#ff0000',
        textSpeed: undefined,
        mediaType: undefined
      }
    };
  },
  watch: {
    filesList (val) {
      this.init(val);
    },
    'dialog.show': {
      handler (newName, oldName) {
        // 消除v-if捯饬的校验提醒之间的影响
        if (this.$refs['ruleForm'] !== undefined) {
          this.$refs['ruleForm'].resetFields();
        }
      }
    }
  },
  props: {
    filesList: {
      type: Object,
      default: () => {}
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.init(this.filesList);
      this.serviceCode = moment().format('YYYYMMDDHHmmss');
    });
  },
  computed: {
  },
  methods: {
    init (filesList) {
      this.programInfo = filesList;
      this.fileLists = (filesList && filesList.ledMedias) ? filesList.ledMedias.map((medias, index) => {
        this.fileList[medias.mediaType] && this.fileList[medias.mediaType].push({
          name: index,
          uid: medias.mediaId || index,
          url: `${baseURL || config.baseURL.dev}/upload${medias.source}`,
          path: medias.source
        });
        return {
          ...medias,
          ...medias.convertEffectsDto,
          ...medias.metaDto
        }
      }) : [];
    },
    upRecord (arr, index) {
      if (index === 0) {
        return;
      }
      this.swapItems(arr, index, index - 1);
    },
    downRecord (arr, index) {
      if (index === arr.length - 1) {
        return;
      }
      this.swapItems(arr, index, index + 1);
    },
    swapItems (arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      return arr;
    },
    deleteRecord (arr, index) {
      arr.splice(index, 1);
    },
    fullRecord (item) {
      this.dialogFileVisible = true;
      this.dialogFile = item;
    },
    handleDeviceTabClick (e) {
    },
    changeResType (index) {
      let picRules = {
        durationTime: [{ required: true, message: '特效时间不能为空' }],
        picStayTime: [{ required: true, message: '停留时间不能为空' }]
      }
      let videoRules = {
        videoStayTime: [{ required: true, message: '停留时间不能为空' }]
      }
      let textRules = {
        textSize: [{ required: true, message: '字体大小不能为空' }],
        textSpeed: [{ required: true, message: '滚动速度不能为空' }],
        textStayTime: [{ required: true, message: '停留时间不能为空' }]
      }
      let ruleArr = [picRules, videoRules, textRules]
      this.resource.map((item, i) => {
        item.class = '';
        if (index === i) {
          item.class = 'active';
          this.clearnInfo();
          this.dialog.resourceType = item.type;
          this.dialog.show = true;
          this.dialog.type = 'add';
          this.dialog.title = item.name;
          this.rules = ruleArr[item.type - 1]
        }
      });
    },
    changeUploadFile (list, type) {
      const removeObj = this.fileList[type].filter(obj => list && !list.some(obj1 => obj1.uid === obj.uid));
      if (removeObj[0] && removeObj[0].fileCode) {
        // deleteByFileCode(removeObj[0].fileCode).then(res => {
        //   if (res.code === '200') {
        //     this.$notify({
        //       title: '成功',
        //       message: '删除成功',
        //       type: 'success',
        //       position: 'bottom-right'
        //     });
        //   }
        // });
        this.fileList[type] = list;
      } else {
        this.fileList[type] = list;
      }
    },
    dialogCancel () {
      this.clearnInfo();
      this.dialog.show = false;
    },
    dialogSubmit () {
      this.$refs['ruleForm'].validate(async (valid) => {
        if (valid) {
          // const textDetail = await this.$refs.textDetail.confirmedit();
          const dialogType = this.dialog.type;
          const fileList = this.fileList[this.dialog.resourceType];
          if (dialogType === 'add') {
            const imgOrVideoType = (this.dialog.resourceType === 1) || (this.dialog.resourceType === 2);
            let fileLists = [];
            if (imgOrVideoType) {
              fileList.map(file => {
                fileLists.push({
                  ...this.info,
                  mediaType: this.dialog.resourceType,
                  stayTime: this.stringToNumber(this.info.picStayTime || this.info.videoStayTime || this.info.textStayTime),
                  durationTime: this.stringToNumber(this.info.durationTime),
                  updateTime: this.stringToNumber(this.info.updateTime),
                  sourceObj: file,
                  // source: file.path || textDetail.keyWord
                  source: file.path
                });
              });
            } else {
              fileLists.push({
                ...this.info,
                mediaType: this.dialog.resourceType
              });
            }
            this.fileLists.push(...fileLists);
          } else {
            this.fileLists[this.dialog.itemIndex] = {
              ...this.info,
              mediaType: this.dialog.resourceType,
              stayTime: this.stringToNumber(this.info.stayTime),
              durationTime: this.stringToNumber(this.info.durationTime),
              updateTime: this.stringToNumber(this.info.updateTime),
              sourceObj: fileList[0],
              // source: fileList[0].path || textDetail.keyWord
              source: fileList[0].path
            }
          }
          this.dialogCancel();
        } else {
          this.$message({
            message: '请完善信息！',
            type: 'warning'
          });
          return false;
        }
      });
    },
    stringToNumber (value) {
      return value ? +value : 0
    },
    clearnInfo () {
      this.info = {
        picStayTime: undefined,
        videoStayTime: undefined,
        textStayTime: undefined,
        type: 1,
        direction: 1,
        durationTime: undefined,
        stayTime: undefined,
        updateTime: undefined,
        zoomType: 1,
        mode: 1,
        source: undefined,
        textSize: undefined,
        textColor: '#ff0000',
        textSpeed: undefined
      };
      this.fileList = {
        1: [],
        2: [],
        3: []
      };
    },
    editFile (item, itemIndex) {
      const { types } = this.$_useTypes(COMMON_TEMPLATE_SERVICE_TYPE);
      this.dialog.show = true;
      this.dialog.type = 'edit';
      this.dialog.title = types[item.mediaType];
      this.dialog.itemIndex = itemIndex;
      this.dialog.resourceType = item.mediaType;
      this.info = item;
      this.fileList[item.mediaType] = [item.sourceObj ? item.sourceObj : {
        name: 0,
        uid: item.mediaId || 0,
        url: `${baseURL || config.baseURL.dev}/upload${item.source}`,
        path: item.source
      }];
    },
    async listTypePrew (type, item, index) {
      if (type === 'prev') {
        await this.upRecord(this.fileLists, index);
      }
      if (type === 'next') {
        await this.downRecord(this.fileLists, index);
      }
      if (type === 'delete') {
        await this.deleteRecord(this.fileLists, index);
      }
      if (type === 'full') {
        await this.fullRecord(item);
      }
    },
    handleClose () {
      this.dialogFileVisible = false;
      this.dialogFile = {};
      this.clearnInfo();
    },
    getFileLists () {
      return this.fileLists;
    },
    headleChangeColor (val) {
      this.info.textColor = val;
    }
  }
};
</script>
<style lang="less">
.marginTop.el-row {
  margin-top: 15px;
}
#programDetail{
  .resource_list {
    width: 265px;/*no*/
    height: 264px;/*no*/
    border: 1px solid;/*no*/
    border-image: linear-gradient(135deg, rgba(141, 201, 235, 1), rgba(101, 151, 219, 1)) 1 1;
    div {
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
      margin-bottom: 10px;/*no*/
      .el-icon-top {
        position: absolute;
        right: 19px;/*no*/
        top: 50%;
        transform: translateY(-50%);
        font-size: 14px;/*no*/
        color: #2A60CD;
        font-weight: bold;
      }
      &:last-child{
        margin-bottom: 0;
      }
    }
  }
  .scrollView__nav-wrap{
    padding: 1px 30px;/*no*/
    .scrollView__nav-prev, .scrollView__nav-next{
      color: #ccc;
      font-size: 20px;/*no*/
    }
    .listItems{
      .item{
        width: 265px;/*no*/
        height: 264px;/*no*/
        background: #fff;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid;/*no*/
        margin-right: 10px;/*no*/
        border-image: linear-gradient(135deg, rgba(141, 201, 235, 1), rgba(101, 151, 219, 1)) 1 1;
        overflow: hidden;
        .fullicon{
          width: 25px;/*no*/
          height: 25px;/*no*/
          background: linear-gradient(135deg, rgba(0, 186, 255, 0.19) 0%, rgba(0, 132, 154, 0.6) 100%);
          position: absolute;
          top: 6px;/*no*/
          left: 6px;/*no*/
          i{
            font-size: 14px;/*no*/
            color: #fff;
          }
        }
        .labers{
          background: transparent;
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          padding: 7px;/*no*/
          .icon{
            width: 25px;/*no*/
            height: 25px;/*no*/
            background: rgba(0, 0, 0, 0.47);
            border-radius: 2px;/*no*/
            cursor: pointer;
            margin-right: 4px;/*no*/
            &:last-child{
              margin-right: 0;
            }
            i{
              font-size: 11px;/*no*/
              color: #fff
            }
          }
        }
        img, video{
          display: flex;
         width: 240px;/*no*/
         height: 160px;/*no*/
        }
        .textTemplate{
          width: 240px;/*no*/
          height: 160px;/*no*/
          padding: 10px;/*no*/
          overflow: auto;
          background:linear-gradient(171deg,rgba(21,173,182,1) 0%,rgba(49,72,219,1) 100%);
          box-shadow:0px 2px 9px 0px rgba(72,128,255,0.5);/*no*/
          border-radius:5px;/*no*/
          display: flex;
          flex-direction: column;
          font-size:12px;/*no*/
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(255,255,255,1);
        }
      }
    }
  }

}
.programDetailDialog{
  .imgFileList, .videoFileList, .textFileList{
    >div:first-child{
      margin-bottom: 20px;/*no*/
    }
    ul.el-upload-list{
      li{
        // margin: 0;
      }
    }
    .el-upload{
      align-items: flex-start;
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
    // margin-bottom: 10px;
    cursor: pointer;
    position: relative;
    .upload_img {
      margin: 0 auto;
      width: 113px;/*no*/
      height: 28px;/*no*/
      line-height: 28px;/*no*/
      padding-right:10px;/*no*/
      text-align: center;
      background: linear-gradient(135deg, #E9F3FF 0%, #E6F6FF 100%);
      border: 1px solid rgb(50, 109, 172);/*no*/
      border-radius: 50px;/*no*/
      font-size: 12px;/*no*/
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #2A60CD;
      position: relative;
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
    // width: 182px;
    // height: 152px;
    // border: 2px dashed rgba(44, 52, 58, 1);/*no*/
    // margin-bottom: 10px;
    cursor: pointer;
    .upload_video {
      margin: 0 auto;
      width: 113px;/*no*/
      height: 28px;/*no*/
      line-height: 28px;/*no*/
      padding-right:10px;/*no*/
      text-align: center;
      background: linear-gradient(135deg, #E9F3FF 0%, #E6F6FF 100%);
      border: 1px solid rgb(50, 109, 172);/*no*/
      border-radius: 50px;/*no*/
      font-size: 12px;/*no*/
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #2A60CD;
      position: relative;
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
    .el-textarea, textarea{
      width: 100%;
      height: 100%;
    }
  }
  .textMain{
    .textTemplate{
      min-width: 250px;/*no*/
      padding: 20px 35px 20px 18px;/*no*/
      background:linear-gradient(171deg,rgba(21,173,182,1) 0%,rgba(49,72,219,1) 100%);
      box-shadow:0px 2px 9px 0px rgba(72,128,255,0.5);/*no*/
      border-radius:5px;/*no*/
      margin-right: 10px;/*no*/
      display: flex;
      flex-direction: column;
      .title{
        font-size:14px;/*no*/
        font-family:PingFangSC-Semibold,PingFang SC;
        font-weight:600;
        color:rgba(255,255,255,1);
        // line-height:14px;
        text-shadow:0px 2px 4px rgba(17,118,111,0.5);/*no*/
        margin-bottom: 7px;/*no*/
      }
      ul{
        li{
          font-size:12px;/*no*/
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(255,255,255,1);
          padding: 6px 0;/*no*/
          // line-height:17px;
        }
      }
    }
    .resource_text{
      min-height: 152px;/*no*/
      height: auto;
      min-width: 250px;/*no*/
      padding: 20px 35px 20px 18px;/*no*/
      background:linear-gradient(171deg,rgba(21,173,182,1) 0%,rgba(49,72,219,1) 100%);
      box-shadow:0px 2px 9px 0px rgba(72,128,255,0.5);/*no*/
      border-radius:5px;/*no*/
      margin-right: 10px;/*no*/
      .el-textarea{
        background: transparent;
        border: none;
        font-size:12px;/*no*/
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(255,255,255,1);
        textarea{
          background: transparent;
          border: none;
          color: inherit;
          font-size: inherit;
        }
      }
    }
  }
  .limit {
    position: absolute;
    bottom: 20px;/*no*/
    left: 0;
    right: 0;
    margin: 0 auto;
    height: 17px;/*no*/
    font-size: 12px;/*no*/
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(116, 133, 145, 1);
    line-height: 17px;/*no*/
    text-align: center;
  }
  .el-input__prefix{
    display: flex;
    align-items: center;
  }
}
.ledDialogDetail{
  .content{
    img, video, .textTemplate{
      width: 100%;
      height: auto;
    }
    .textTemplate{
      width: 100%;
      height: 100%;
      padding: 10px;/*no*/
      overflow: auto;
      background:linear-gradient(171deg,rgba(21,173,182,1) 0%,rgba(49,72,219,1) 100%);
      box-shadow:0px 2px 9px 0px rgba(72,128,255,0.5);/*no*/
      border-radius:5px;/*no*/
      display: flex;
      flex-direction: column;
      font-size:12px;/*no*/
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(255,255,255,1);
    }
  }
}
</style>

