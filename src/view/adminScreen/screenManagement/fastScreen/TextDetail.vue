/* eslint-disable camelcase */
<template>
    <div id='commonTemplateDetail'>
        <el-form
          ref="formData"
          id="formItem"
          :model="form"
          :label-width="'65px'"
        >
          <formItem
            :formItems="formItems"
            :form="form"
          >
            <template v-slot:a>
              <el-row :gutter="10" class="templateMain">
                <el-col :span="9">
                  <div class="container">
                  <search-form
                    :searchItems="searchItems"
                    @onSearch="onSearch"
                    :resetBtnShow="false"
                  />
                  <el-checkbox-group v-model="form.checkList" @change="handleCheckedCitiesChange">
                    <el-checkbox
                      v-for="item in checkBoxOption"
                      :key="item.id"
                      :label="item.name"
                    ></el-checkbox>
                  </el-checkbox-group>
                  </div>
                </el-col>
                <el-col :span="15">
                  <div class="container">
                    <span>显示屏文字编辑</span>
                    <quill-editor ref="myQuillEditor" v-model="form.keyWord" class="myQuillEditor" :options="editorOption"
                        @focus="onEditorFocus($event)" @blur="onEditorBlur($event)" @change="onEditorChange($event)"/>
                  </div>
                </el-col>
              </el-row>
            </template>
          </formItem>
        </el-form>
    </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor';
import headerTitle from 'components/headerTitle/headerTitle'
import dialogCont from '@/components/adminDialog';
import formItem from '@/components/adminFormItem/base';
import searchForm from 'components/adminSearchForm/searchForm';
import { COMMON_TEMPLATE_SERVICE_TYPE, COMMON_TEMPLATE_KEY_WORD } from '@/util/constants';
import {
  addTemplate,
  updateTemplate
} from 'api/controlStrategy';
const reg = '[^\u4e00-\u9fa5]';
export default {
  name: 'commonTemplateDetail',
  data () {
    const checkBoxKeyWord = this.$_useTypes(COMMON_TEMPLATE_KEY_WORD);
    const checkBoxServiceType = this.$_useTypes(COMMON_TEMPLATE_SERVICE_TYPE);
    return {
      title: '新增文字模板',
      checkBoxKeyWord,
      checkBoxServiceType,
      checkBoxOption: checkBoxKeyWord.options,
      searchItems: [{
        type: 'input',
        label: '',
        labelWidth: '0px',
        props: {
          placeholder: '模板名称',
          fieldName: 'keyWord',
          class: 'noBottom'
        }
      }],
      tableData: [],
      form: {
        checkList: [],
        keyWord: ''
      },
      formItems: [{
        label: '标题',
        prop: 'templateName',
        inputType: 'input',
        labelWidth: '85px',
        hide: true,
        span: 24
      }, {
        label: '配置关键词：',
        prop: 'a',
        inputType: 'custom',
        labelWidth: '85px',
        class: 'noBottom',
        span: 24
      }],
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
    styleLess: {},
    type: 'default'
  },
  computed: {
    editor () {
      return this.$refs.myQuillEditor.quill
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.type === 'single') {
        this.formItems[0].hide = false;
      } else {
        this.formItems[0].hide = true;
      }
      // this.getDataAllList(1, 10)
    })
  },
  components: {
    headerTitle,
    dialogCont,
    formItem,
    searchForm,
    quillEditor
  },
  watch: {
    data (val) {
      this.editData = val;
      if (val) {
        this.form = {
          ...this.form,
          ...this.data
        };
        this.form.keyWord = this.data.keyWord.join('<br>');
        this.setUnit(this.data.keyWord);
      }
    },
    styleLess (val) {
      if (val.fontSize) {
        this.editor.format('fontSize', val.fontSize);
      }
      if (val.color) {
        this.editor.format('color', val.color);
      }
    }
  },
  methods: {
    openedit () {
    },
    closeedit () {
      this.editshow = false;
      this.editData = {};
      this.form = {
        checkList: [],
        keyWord: ''
      };
    },
    canceledit (type) {
      this.closeedit();
      this.$emit('cancel', type);
    },
    confirmedit () {
      let apiMethod = addTemplate;
      let keyWord = this.editor.getText().split('\n');
      let message = '新增';
      const parames = {
        keyWord: keyWord.filter(kw => kw && kw !== ''),
        serviceType: COMMON_TEMPLATE_SERVICE_TYPE['文字'],
        templateName: this.form.templateName
      };
      if (this.editData.id) {
        apiMethod = updateTemplate;
        parames.id = this.editData.id;
        message = '修改';
      }
      return parames;
      // apiMethod(parames).then(res => {
      //   if (res.code === '200') {
      //     this.$notify({
      //       title: '成功',
      //       message: `${message}模板成功`,
      //       type: 'success',
      //       position: 'bottom-right'
      //     });
      //     this.canceledit('cancel');
      //   }
      // })
    },
    setUnit (keyWord) {
      this.units = {};
      this.form.checkList = keyWord.map(data => {
        const title = data.split('：')[0];
        this.units[title] = data.split('}')[1]
        return title;
      });
    },
    onSearch (val) {
      this.searchVal = {
        ...val
      }
      const checkBoxOptions = this.checkBoxKeyWord.options;
      this.checkBoxOption = val.keyWord ? checkBoxOptions.filter(this.createFilter(val.keyWord)) : checkBoxOptions;
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
      };
    },
    handleCheckedCitiesChange (val) {
      this.form.keyWord = '';
      this.form.checkList.map(checkItem => {
        // this.form.keyWord += `${checkItem}<br>`;
        const val = this.checkBoxKeyWord.values[checkItem];
        const unit = this.units[checkItem] ? this.units[checkItem] : '';
        const valText = val ? `${checkItem}：#{${this.checkBoxKeyWord.values[checkItem]}}${unit}<br>` : `${checkItem}<br>`;
        this.form.keyWord += valText;
      });
    },
    // 准备富文本编辑器
    onEditorReady (editor) {
    },
    // 富文本编辑器 失去焦点事件
    onEditorBlur (editor) {
    },
    // 富文本编辑器 获得焦点事件
    onEditorFocus (editor) {},
    // 富文本编辑器 内容改变事件
    onEditorChange (editor) {
      let keyWord = this.editor.getText().split('\n').filter(kw => kw && kw !== '');
      this.setUnit(keyWord);
    }
  }
}
</script>

<style lang="less" scoped>
#commonTemplateDetail{
  /deep/.el-col-24{
    &:last-child{
      /deep/.el-form-item__content{
        >div{
          width: 100%;
          height: auto;
          .el-col-9{
            // min-height: 100%;
            // height: 100%;
            .container{
              height: 100%;
              border-radius:4px;/*no*/
              padding: 0 10px !important;/*no*/
            }
            #searchForm{
              width: 100%;
              .el-form-item{
                width: calc(100% - 80px);/*no*/
              }
            }
            /deep/.searchItem{
              display: flex;
              flex-direction: row;
              >div{
                margin-bottom: 0;
                width: auto;
                button{
                  margin-right: 0px;
                  &.resetBtn {
                    display: none;
                  }
                }
              }
            }
            .el-checkbox-group{
              display: flex;
              flex-direction: column;
              .el-checkbox{
                .el-checkbox__input{
                  .el-checkbox__inner{
                    border-color:#efefef;
                    background:#efefef;
                    border-radius:4px;
                  }
                }
                &.is-checked{
                    .el-checkbox__inner{
                      background:rgba(40,112,255,1);
                    }
                    .el-checkbox__label{
                      color: #000;
                    }
                  }
              }
            }
          }
          .el-col-15{
            .container{
              height: 100%;
              border-radius:4px;/*no*/
              padding: 0 10px !important;/*no*/
              >span{
                display: inline-block;
                font-size:12px;/*no*/
                font-family:PingFangSC-Regular,PingFang SC;
                font-weight:400;
                color:#000;
                margin-bottom: 10px;/*no*/
              }
            }

            .myQuillEditor{
              height: calc(100% - 40px);/*no*/
              .ql-toolbar{
                border: none;
                background: #e0e0e0;
                border-top-left-radius: 4px;/*no*/
                border-top-right-radius: 4px;/*no*/
                button.ql-active{
                  background: #1d5bfa;
                  color:#000;
                  .ql-stroke{
                      stroke: #000;
                    }
                    .ql-fill{
                      fill: #000;
                    }
                }
                .ql-size, .ql-header, .ql-font{
                  color: #055CBB;
                  .ql-stroke{
                    stroke: #055CBB;
                  }
                }
              }
              .ql-container{
                height: calc(100% - 136px);/*no*/
                background: #efefef;
                border: none;
                border-bottom-left-radius: 4px;/*no*/
                border-bottom-right-radius: 4px;/*no*/
                .ql-editor {
                  // height: 450px;
                    color:#000;
                  p{
                    color:#000;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .templateMain{
    display: flex;
    flex-direction: row;
    .el-col{
      float: none;
      height: 8rem;
    }
  }
}
</style>
