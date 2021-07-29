<template>
  <div id="adminSearchForm">
    <el-form
      class="adminSearchForm"
      :label-width="labelWidth"
      :model="formData"
      ref="formRef"
    >
      <div style="width:100%;">
        <div class="searchItem">
          <template v-for="(item, index) in searchItem" :span="item.span || 6">
            <el-form-item
              :key="`formItem${newKeys[index + 1]}`"
              class="form-group"
              :label="item.type === 'radio' || item.isLabel ? item.label + '：' : ''"
              :label-width="item.type === 'radio' || item.isLabel  ? item.labelWidth : ``"
              :prop="item.props.fieldName"
              :rules="item.props.rules"
              v-if="!item.hide && !(senior && index > 4)"
            >
              <form-item
                v-model="formData[item.props.fieldName]"
                :item="item"
              />
              <template v-if="item && item.type === 'custom'">
               <slot :name="item.props.fieldName">
              </slot>
              </template>
            </el-form-item>
          </template>
          <div class="btnInfo text-center cl search" v-if="searchItem.length > 0 && searchBtnShow">
            <el-button class="submitBtn f-12 cl f-l" size="small"
              @click="onSearch" :disabled="$_loading">
              <!-- <i class="iconfont icon-chaxun"></i> -->
              查询</el-button>
            <el-button class="seniorBtn f-12 cl f-l" size="small" v-if="searchItem.length > 5"
            @click="setSenior">
            <!-- <i class="iconfont icon-chaxun"></i> -->
            {{senior ? '高级查询' : '取消高级查询'}}
            </el-button>
            <el-button class="f-12 resetBtn cl f-l" size="small" @click="onReset">
              <!-- <i class="iconfont icon-reset"></i> -->
              重置</el-button>
              <el-button class="btnList addBtn" :disabled="addBtnDisabled" @click="addBtn" v-if="addBtnVisible">
              <!-- <i class="iconfont icon-xinzeng f-12" v-if="addBtnIconfont"></i> -->
              <span class="pos-r">{{addTitleBtn}}</span>
            </el-button>
            <el-button class="btnList addBtn" @click="addBtn301" v-if="addBtnVisible301">
              <!-- <i class="iconfont icon-xinzeng f-12" v-if="addBtnIconfont"></i> -->
              <span class="pos-r">{{addTitleBtn301}}</span>
            </el-button>
            <el-button
              class="btnList delBtn"
              @click="delBtn"
              v-if="delBtnVisible"
              :disabled="delBtnDisabled"
            >
              <!-- <i class="iconfont icon-shanchu f-12 "></i> -->
              <span class="pos-r">{{delTitleBtn}}</span>
            </el-button>
          </div>
          <div class="flexRow search" :class="addBtnVisible || delBtnVisible || otherBtnVisible? 'hasbtnList' : ''">
            <el-button
              class="btnList addBtn"
              v-for="(item, index) in otherBtnLists"
              :key="index" @click="() => {item.click();}"
              :disabled="item.disabled || false"
              v-if="otherBtnVisible"
            >
              <!-- <i class="iconfont icon-xinzeng f-12" v-if="addBtnIconfont"></i> -->
              <span class="pos-r">{{item.label}}</span>
            </el-button>
            <!-- <other-btn-list :anBoolean="anBoolean" v-if="otherBtnVisible">
              <ul>
                <li v-for="(item, index) in otherBtnLists" :key="index" @click="() => {anBoolean = 1; item.click(); }">{{item.label}}</li>
              </ul>
            </other-btn-list> -->
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
import formItem from './formItem';
import searchFormTools from 'util/searchFormTools';
import otherBtnList from './otherBtnList';
export default {
  props: {
    // label width
    labelWidth: {
      type: String,
      default: '0px'
    },
    // 所有的搜索组件
    searchItems: {
      type: Array,
      required: true,
      default: () => []
    },
    addTitleBtn: {
      type: String,
      default: '新增'
    },
    addTitleBtn301: {
      type: String,
      default: '新增'
    },
    delTitleBtn: {
      type: String,
      default: '删除'
    },
    search: {
      type: Boolean,
      default: true
    },
    // 添加按钮显示
    addBtnVisible: {
      type: Boolean,
      default: false
    },
    addBtnDisabled: {
      type: Boolean,
      default: false
    },
    addBtnVisible301: {
      type: Boolean,
      default: false
    },
    delBtnVisible: {
      type: Boolean,
      default: false
    },
    delBtnDisabled: {
      type: Boolean,
      default: false
    },
    // 是否显示查询按钮
    otherBtnVisible: {
      type: Boolean,
      default: false
    },
    otherBtnLists: {
      type: Array,
      default: null
    },
    addBtnIconfont: {
      type: Boolean,
      default: true
    },
    searchChangeValue: {
      type: Object,
      default: () => {
        return {}
      }
    },
    searchBtnShow: {
      type: Boolean,
      default: true
    },
    an: Number
  },
  data () {
    return {
      formData: {},
      senior: true,
      searchItem: [],
      searchItemList: this.searchItems,
      anBoolean: 0
    }
  },
  watch: {
    searchItems: {
      deep: true,
      handler (val) {
        this.searchItemList = val;
        // this.searchItem = this.searchItemList.filter(value => !value.hide);
        this.senior = this.seniorType !== null ? this.seniorType : this.searchItem.length > 5;
        if (Object.keys(this.searchChangeValue).length === 0) {
          this.addInitValue();
        } else {
          this.formData = Object.assign(this.formData, this.searchChangeValue);
        }
      }
    },
    formData: {
      deep: true,
      handler (val) {
        if (JSON.stringify(this.formItem) !== JSON.stringify(val)) {
          this.$emit('onChange', val)
        }
      }
    },
    searchChangeValue: {
      deep: true,
      handler (val) {
        if (JSON.stringify(this.formData) !== JSON.stringify(val)) {
          this.formData = JSON.parse(JSON.stringify({...this.formData, ...val}));
        }
      }
    }
  },
  computed: {
    newKeys () {
      return this.searchItem.map(v => {
        return searchFormTools.createUniqueString()
      })
    }
  },
  created () {
    this.searchItem = this.searchItemList.filter(value => !value.hide);
    this.senior = this.searchItem.length > 3;
    this.addInitValue();
  },
  methods: {
    // 校验
    onValidate (callback) {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          callback()
        }
      })
    },
    // 搜索按钮传给父组件
    onSearch () {
      this.onValidate(() => {
        let formData = {};
        Object.keys(this.formData).map(data => {
          if (this.formData[data] !== '-1') {
            formData[data] = this.formData[data];
          }
        });
        this.$emit('onSearch', formData);
        this.$forceUpdate();
      });
      return this.formData;
    },
    onReset () {
      // this.formData = {};
      this.$refs.formRef.resetFields();
      this.$emit('onReset', true);
    },
    // 添加初始值
    async addInitValue () {
      let obj = {}
      await this.searchItem.forEach(v => {
        obj[v.props.fieldName] = v.initValue ? v.initValue : undefined;
      });
      // this.formData = obj;
    },
    forceUpdate () {
      this.addInitValue();
      this.$forceUpdate();
    },
    setSenior () {
      this.senior = !this.senior;
      if (this.senior) {
        this.searchItem.map((item, index) => {
          if (index > 1) {
            delete this.formData[item.props.fieldName];
          }
        });
      }
    },
    // 点击新增按钮
    addBtn () {
      this.$emit('on-addBtn', true);
    },
    delBtn () {
      this.$emit('on-delBtn', true);
    },
    addBtn301 () {
      this.$emit('on-addBtn301', true);
    }
  },
  components: {
    formItem,
    otherBtnList
  }
}
</script>
<style lang="less">
#adminSearchForm{
  width: 100%;
  // display: inline-block;
  // float: left;
}
.adminSearchForm{
  // justify-content: flex-end;
  .el-row{
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: -10px;/*no*/
    /deep/.el-col{
      margin-bottom: 10px;/*no*/
      // margin-right: 10px;
      .el-form-item{
        margin-bottom: 0px;
      }
    }
  }
  .searchItem{
    width: 100%;
    // margin-left: 20px;
    label{
      height: 30px;/*no*/
      line-height: 30px;/*no*/
      font-size: 12px;/*no*/
      // font-family: PingFangSC-Semibold, PingFang SC;
      // font-weight: 600;
      color: #000;
    }
  }
  .searchItem,.btnInfo{
    // overflow: hidden;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .btnInfo{
    margin-bottom: 10px;/*no*/
  }
  button{
    min-width:70px;/*no*/
    font-size:14px !important;/*no*/
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    // margin-bottom: 10px;
    border-radius: 0 !important;

  }
  .form-group{
    margin-right: 10px;/*no*/
    float: left;
  }
  .submitBtn, .seniorBtn, .resetBtn{
    margin-left: 0px !important;
    margin-right: 10px;/*no*/
    background:rgba(37,115,241,1) !important;
    color: #fff;
    &:hover, &:focus, &:active{
      color: #fff;
    }
    span{
      vertical-align: middle;
      i{
        vertical-align: inherit;
      }
    }
  }
  .resetBtn{
    margin-left: 0px !important;
    margin-right: 10px;/*no*/
    // background:rgba(247,247,247,1);
    // background-color: #fff;
    // border:1px solid rgba(192,192,192,1);
    // color:rgba(77,77,77,1);
    &:hover, &:focus, &:active{
      background-color: #fff;
    }
  }
  .submitBtn, .seniorBtn, .resetBtn{
    height:30px;/*no*/
    line-height: 0;
    span{
      line-height: 14px;/*no*/
    }
  }
  .search{
    display: inline-block;
    margin: 0px 0 10px 0px;/*no*/
    vertical-align: middle;
    font-size: 0;
    .btnList {
      min-width: 70px;/*no*/
      background: rgba(37, 115, 241, 1);
      font-size: 14px;/*no*/
      color: #fff;
      // cursor: pointer;
      display: inline-block;
      vertical-align: middle;
      text-align: center;
      // flex-direction: row;
      // align-items: center;
      // justify-content: center;
      margin-right: 10px;/*no*/
      margin-left: 0;
      box-sizing: border-box;
      height: 30px;/*no*/
      line-height: 30px;/*no*/
      i {
        // margin-right: 8px;
      }
      &.delBtn {
        margin-left: 0;
        padding: 0;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(37, 115, 241, 1);/*no*/
        color: rgba(37, 115, 241, 1);
        &.is-disabled{
          color: #fff;
          border: 1px solid #b9b9b9;/*no*/
        }
      }
      &.is-disabled{
        background: #b9b9b9;
      }
    }
    .addBtn {
      height: 30px;/*no*/
      line-height: 30px;/*no*/
      padding: 0;
    }
  }
}
</style>
