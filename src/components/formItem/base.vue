<template>
  <el-row>
    <el-col
      v-for="(item, index) in formItems"
      :key="`item-${index}`"
      :span="(item && item.span) || 12"
    >
      <el-form-item :class="item.class" :label="item.label!=''?(item.label+(item.label.indexOf('：') > -1 ? '' : '：')):''" :label-width="item.labelWidth" :prop="item && item.prop" v-if="!item.hide">
          <div v-if="item.value && !item.prop" class="textItem">{{item.value}}</div>
          <div v-else>
            <!-- 输入框 -->
            <template v-if="item && item.inputType === 'input'">
              <el-input
                v-model="form[item.prop]"
                :disabled="disabled || item.disabled"
                :placeholder="item.placeholder ? item.placeholder : `请输入${item.label}`"
                @input="change($event)"
              />
            </template>
            <template v-if="item && item.inputType === 'textarea'">
              <el-input
                v-model="form[item.prop]"
                type="textarea"
                :placeholder="item.placeholder ? item.placeholder : `请输入${item.label}`"
                :disabled="disabled || item.disabled"
                :autosize="{
                  minRows: 3
                }"
                @input="change($event)"
              >
              </el-input>
            </template>
            <!-- 数字输入框 -->
            <template v-if="item && item.inputType === 'inputNumber'">
              <el-input-number
                v-model="form[item.prop]"
                controls-position="right"
                :min="1"
                :disabled="disabled || item.disabled"
                :placeholder="item.placeholder ? item.placeholder : `请输入${item.label}`"
              ></el-input-number>
            </template>
            <!-- 选择框 -->
            <template v-if="item && item.inputType === 'select'">
              <el-select
                v-model="form[item.prop]"
                :placeholder="item.placeholder ? item.placeholder : `请选择${item.label}`"
                :disabled="disabled || item.disabled"
                :multiple="item.multiple || false"
              >
                <el-option
                  v-for="(option, oIndex) in item.options"
                  :label="option.value"
                  :value="option.code"
                  :key="`select-${oIndex}`"
                />
              </el-select>
            </template>
            <!-- 选择框 -->
            <template v-if="item && item.inputType === 'switch'">
              <el-switch
                v-model="form[item.prop]"
                active-color="#2870FF"
                inactive-color="#1C376D">
              </el-switch>
            </template>
            <template v-if="item && item.inputType === 'dataPicker'">
              <el-date-picker
                v-model="form[item.prop]"
                type="date"
                :placeholder="item.placeholder ? item.placeholder : `请选择${item.label}`"
                :disabled="disabled"
                :value-format="item.format || 'yyyy-MM-dd HH:mm:ss'"
              >
              </el-date-picker>
            </template>
            <template v-if="item && item.inputType === 'daterange'">
              <el-date-picker
                v-model="form[item.prop]"
                type="daterange"
                range-separator="至"
                :start-placeholder="`请选择开始日期`"
                :end-placeholder="`请选择结束日期`"
                :disabled="(item.disabled !== undefined || item.disabled !== null) ? item.disabled : disabled"
                :format="item.format || 'yyyy 年 MM 月 dd 日  HH 时 mm 分 ss 秒'"
                :value-format="item.formatValue || 'yyyy-MM-dd HH:mm:ss'"
              >
              </el-date-picker>
            </template>
            <template v-if="item && item.inputType === 'timePicker'">
              <el-time-picker
                :is-range="item.range || false"
                :arrow-control="false"
                v-model="form[item.prop]"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
                :disabled="(item.disabled !== undefined || item.disabled !== null) ? item.disabled : disabled"
                :format="item.format || 'HH:mm'"
                :value-format="item.formatValue || 'HH:mm'"
              />
            </template>
            <template v-if="item && item.inputType === 'radio'" >
              <el-radio-group
                class="radioGroup"
                v-model="form[item.prop]"
                :disabled="(item.disabled !== undefined || item.disabled !== null) ? item.disabled : disabled"
              >
                <el-radio
                  v-for="ch in item.options"
                  :label="ch.value || ch.id"
                  :key="ch.value || ch.id"
                >
                  {{ch.text || ch.name}}
                </el-radio>
              </el-radio-group>
            </template>
            <template v-if="item && item.inputType === 'checkbox'" >
              <el-checkbox-group
                class="checkBoxGroup"
                v-model="form[item.prop]"
              >
                <el-checkbox
                  v-for="ch in item.options"
                  :key="ch.value || ch.id"
                  :label="ch.text || ch.name"
                  :disabled="(item.disabled !== undefined || item.disabled !== null) ? item.disabled : false"
                >
                </el-checkbox>
              </el-checkbox-group>
            </template>
            <template v-if="item && item.inputType === 'editor'" >
              <quill-editor ref="myQuillEditor" v-model="form[item.prop]" class="myQuillEditor" :options="editorOption"
                  @focus="onEditorFocus($event)" @blur="onEditorBlur($event)" @change="onEditorChange($event)" />
            </template>
            <template v-if="item && item.inputType === 'custom'">
            <slot :name="item.prop"></slot>
            </template>
          </div>
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data () {
    return {
      unChange: true,
      editorOption: {
        theme: 'snow',
        placeholder: '请输入正文'
      }
      // form: JSON.parse(JSON.stringify(this.form))
    };
  },
  components: {
  },
  props: {
    form: {
      type: Object,
      default  () {
        return {}
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    formItems: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    'form': {
      deep: true,
      handler: function (nowVal, oldVal) {
        // this.$$emit('change', nowVal);
        // this.form = JSON.parse(JSON.stringify(nowVal));
      }
    }
  },
  computed: {
  },
  methods: {
    change (e) {
      this.$forceUpdate()
    },
    // 准备富文本编辑器
    onEditorReady (editor) {},
    // 富文本编辑器 失去焦点事件
    onEditorBlur (editor) {},
    // 富文本编辑器 获得焦点事件
    onEditorFocus (editor) {},
    // 富文本编辑器 内容改变事件
    onEditorChange (editor) {
      console.log('sssdddds');
    }
  },
  mounted () {
    var $this = this;
  }
};
</script>

<style lang="less" scoped>
.textItem{
  text-align: left;
  height: 34.4px;
  line-height: 33px;
}
/deep/.el-form-item{
  margin-bottom: 20px;
  &.noBottom{
    margin-bottom: 0;
  }
  label{
    font-size:12px;/*no*/
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(255,255,255,1);
  }
  .el-date-editor.el-input{
    width: auto;
  }
  input{
    font-size:12px;/*no*/
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(230,236,255,1);
    background:rgba(34,44,81,0.5);
    border-radius:4px;/*no*/
    border:1px solid rgba(98,117,191,1);
  }
    .el-switch{
      height: 17px;/*no*/
      line-height: 17px;/*no*/
      >span{
          height: 100%;
          &::after{
              left: 2px;
              height: 13px;/*no*/
              width: 13px;/*no*/
          }
      }
      &.is-checked{
          span{
              &::after{
                  margin-left: 23px;/*no*/
              }
          }
      }
  }
  >div{
    display: flex;
    align-items: center;
    >div{
      height: 25px;/*no*/
      line-height: 25px;/*no*/
    }
  }
}
  .myQuillEditor {
    height: auto;
    /deep/.ql-container{
      height: 350px;
    }
  }
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
</style>
