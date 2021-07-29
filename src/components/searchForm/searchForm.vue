<template>
  <div id="searchForm">
    <el-form
      class="searchFrom"
      :label-width="labelWidth"
      :model="formData"
      ref="formRef"
    >
      <div style="width:100%;">
        <div class="searchItem">
          <template v-for="(item, index) in searchItem" >
            <el-form-item
              :key="`formItem${newKeys[index + 1]}`"
              class="form-group"
              :class="item.props.class"
              :label="item.label!=''?(item.label+(item.label.indexOf('：') > -1 ? '' : '：')):''"
              :label-width="`${!item.label ? '0px' : (item.labelWidth || labelWidth) }`"
              :prop="item.props.fieldName"
              :rules="item.props.rules"
              v-if="!item.hide && !(senior && index > 2)"
              :style="{width: item.props.width}"
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
          <div class="btnInfo text-center cl" v-if="searchItem.length > 0 && searchBtnShow">
            <el-button class="submitBtn f-12 cl f-l" size="small"
              @click="onSearch">
              <!-- <i class="iconfont icon-chaxun"></i> -->
              查询</el-button>
            <el-button class="seniorBtn f-12 cl f-l" size="small" v-if="searchItem.length > 3"
            @click="setSenior">
            <!-- <i class="iconfont icon-chaxun"></i> -->
            {{senior ? '高级查询' : '取消高级查询'}}
            </el-button>
            <el-button class="f-12 resetBtn cl f-l" size="small" @click="onReset" v-if="resetBtnShow">
              <!-- <i class="iconfont icon-reset"></i> -->
              重置</el-button>
          </div><div class="search" :class="addBtnVisible || otherBtnVisible? 'hasbtnList' : ''">
            <div class="btnList addBtn" @click="addBtn" v-if="addBtnVisible">
              <!-- <i class="iconfont icon-xinzeng f-12" v-if="addBtnIconfont"></i> -->
              <span class="pos-r">{{addTitleBtn}}</span>
            </div>
            <div class="btnList addBtn" @click="addBtn301" v-if="addBtnVisible301">
              <i class="iconfont icon-xinzeng f-12" v-if="addBtnIconfont"></i>
              <span class="pos-r">{{addTitleBtn301}}</span>
            </div>
            <div class="btnList delBtn" @click="delBtn" v-if="delBtnVisible">
              <i class="iconfont icon-shanchu f-12 "></i>
              <span class="pos-r">{{delTitleBtn}}</span>
            </div>
            <other-btn-list v-if="otherBtnVisible">
              <div class="btnList addBtn" v-for="(item, index) in otherBtnLists" :key="index" @click="() => item.onClick()">
                <!-- <i class="iconfont icon-shanchu f-12 "></i> -->
                <span class="pos-r">{{item.label}}</span>
              </div>
            </other-btn-list>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
import formItem from './formItem'
import searchFormTools from 'util/searchFormTools'
import otherBtnList from '../headerTitle/otherBtnList';
export default {
  props: {
    // label width
    labelWidth: {
      type: String,
      default: '70px'
    },
    // 所有的搜索组件
    searchItems: {
      type: Array,
      // required: true,
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
    addBtnVisible301: {
      type: Boolean,
      default: false
    },
    delBtnVisible: {
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
    searchBtnShow: {
      type: Boolean,
      default: true
    },
    resetBtnShow: {
      type: Boolean,
      default: true
    },
    an: Number,
    seniorType: {
      type: Boolean,
      default: null
    },
    searchChangeValue: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    searchItems: {
      deep: true,
      handler (val) {
        this.searchItemList = val;
        this.searchItem = this.searchItemList.filter(value => !value.hide);
        this.senior = this.seniorType !== null ? this.seniorType : this.searchItem.length > 2;
        // if (Object.keys(this.searchChangeValue).length === 0) {
        //   this.addInitValue();
        // }
      }
    },
    formData: {
      deep: true,
      handler (val) {
        this.$emit('onChange', val)
      }
    }
  },
  data () {
    return {
      formData: {},
      senior: true,
      searchItem: [],
      searchItemList: this.searchItems
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
    this.senior = this.seniorType !== null ? this.seniorType : this.searchItem.length > 2;
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
        this.$emit('onSearch', this.formData)
      });
      return this.formData;
    },
    onReset () {
      this.$refs.formRef.resetFields()
    },
    // 添加初始值
    addInitValue () {
      const obj = {};
      this.searchItem.forEach(v => {
        if (v.initValue !== undefined) {
          obj[v.props.fieldName] = v.initValue
        }
      });
      this.formData = obj;
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
#searchForm{
  display: inline-block;
  // float: left;
}
.searchFrom{
  // justify-content: flex-end;
  .el-row{
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: -10px;
    /deep/.el-col{
      margin-bottom: 10px;
      // margin-right: 10px;
      .el-form-item{
        margin-bottom: 0px;
      }
    }
  }
  .searchItem{

    label{
      height: 30px;/*no*/
      line-height: 33px;/*no*/
    }
  }
  .searchItem,.btnInfo{
    // overflow: hidden;
    display: inline-block;
    vertical-align: top;
  }
  .btnInfo{
    height: 30px;/*no*/
    margin-bottom: 10px;/*no*/
  }
  button{
    min-width:70px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    // margin-bottom: 10px;

  }
  .form-group{
    height: 30px;/*no*/
    margin-right: 10px;/*no*/
    margin-bottom: 10px;/*no*/
    float: left;
    position: relative;
    
    &.noBottom{
      margin-bottom: 0;
    }
    > label{
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      font-size:12px;/*no*/
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:#E6ECFF;
    }
    >div{
      line-height: 30px;/*no*/
    }
  }
  .submitBtn, .seniorBtn, .resetBtn{
    margin-left: 0px !important;
    margin-right: 10px;/*no*/
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

  .submitBtn, .seniorBtn, .resetBtn{
    padding: 0 13px;/*no*/
    min-width:70px;/*no*/
    height:30px;/*no*/
    background:linear-gradient(318deg,rgba(29,91,250,1) 0%,rgba(29,144,250,1) 100%);
    border-radius:4px;/*no*/
    line-height: 28px;/*no*/
    span{
      font-size:12px;/*no*/
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(230,236,255,1);
    }
  }
  .resetBtn{
    margin-left: 0 !important;
    margin-right: 10px;/*no*/
    background: #151B2E;
    border-radius: 4px;/*no*/
    border: 1px solid #3472FF;/*no*/
    span{
      color: #3472FF;
    }
    &:hover, &:focus, &:active{
      background-color: #fff;
    }
  }
  .search{
    height: 30px;/*no*/
    width: auto;
    display: inline-block;
    margin: 1px 0 5px 0px;/*no*/
    vertical-align: top;
    font-size: 0;
    .btnList {
      display: inline-block;
      width: auto;
      min-width: 70px;/*no*/
      padding: 0 13px;/*no*/
      height: 30px;/*no*/
      line-height: 30px;/*no*/
      text-align: center;
      background:linear-gradient(138deg,rgba(108,97,233,1) 0%,rgba(108,46,204,1) 100%);
      border-radius:4px;/*no*/
      font-size:12px;/*no*/
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(230,236,255,1);
      margin-right: 10px;/*no*/
      cursor: pointer;
      i {
        // margin-right: 8px;
      }
      &.delBtn {
        background: transparent;
        border-radius:4px;/*no*/
        border:1px solid rgba(52,114,255,1);/*no*/
        font-size:12px;/*no*/
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(52,114,255,1);
      }
      &:last-child{
        margin-right: 0;
      }
    }
    .addBtn {
    }
  }
}
</style>
