/* eslint-disable camelcase */
<template>
  <dialog-cont
    @on-cancel="canceledit('close')"
    @on-close="canceledit('close')"
    @on-confirm="confirmedit"
    @on-open="openedit"
    :title="`${title}`"
    width="80%"
    :visible.sync="editshow"
    ref="dialog"
    appendToBody
  >
    <div id='commonTemplateDetail'>
      <el-form :model="info" ref="ruleForm" :rules="rules" label-width="100px" label-position="left">
          <div class="flexRow textMain">
            <!-- <TextDetail :styleLess="{
                fontSize: `${info.textSize}px`,
                color: info.textColor,
              }" ref="textDetail" :data="info.source" type="single"/> -->
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
      </el-form>
    </div>
  </dialog-cont>
</template>

<script>
import ColorPicker from '@/components/colorPicker';
import TextDetail from '../fastScreen/TextDetail';
import headerTitle from 'components/headerTitle/headerTitle'
import dialogCont from '@/components/adminDialog';
import formItem from '@/components/adminFormItem/base';
import searchForm from 'components/adminSearchForm/searchForm';
import { COMMON_TEMPLATE_SERVICE_TYPE, COMMON_TEMPLATE_KEY_WORD } from '@/util/constants';
import {
  addTemplate,
  updateTemplate
} from 'api/controlStrategy';
import {
  addLedIotPark,
  updateLedIotPark
} from 'api/screen';
const reg = '[^\u4e00-\u9fa5]';
export default {
  name: 'commonTemplateDetail',
  data () {
    const checkBoxKeyWord = this.$_useTypes(COMMON_TEMPLATE_KEY_WORD);
    const checkBoxServiceType = this.$_useTypes(COMMON_TEMPLATE_SERVICE_TYPE);
    return {
      title: '新增模板',
      checkBoxKeyWord,
      checkBoxServiceType,
      checkBoxOption: checkBoxKeyWord.options,
      type: null,
      rules: {},
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
      },
      editshow: false,
      editData: {},
      editorOption: {
        theme: 'snow'
      },
      units: {}
    }
  },
  props: {
    data: {},
    show: ''
  },
  computed: {
    editor () {
      return this.$refs.myQuillEditor.quill
    }
  },
  mounted () {
    this.$nextTick(() => {
      // this.getDataAllList(1, 10)
    })
  },
  components: {
    headerTitle,
    dialogCont,
    formItem,
    searchForm,
    ColorPicker,
    TextDetail
  },
  watch: {
    show (val) {
      this.editData = this.data;
      this.editshow = val;
    }
  },
  methods: {
    openedit () {
    },
    closeedit () {
      this.editshow = false;
      this.editData = {};
      this.info = {
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
      };
    },
    canceledit (type) {
      this.closeedit();
      this.$emit('cancel', type);
    },
    confirmedit () {

    },
    stringToNumber (value) {
      return value ? +value : 0
    },
    headleChangeColor (val) {
      this.info.textColor = val;
    }
  }
}
</script>

<style lang="less" scoped>
#commonTemplateDetail{
.marginTop.el-row {
  margin-top: 15px;
}
}
</style>
