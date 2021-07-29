<template>
  <div id="formItem">
    <!-- 输入框 -->
    <el-input
      v-model="currentVal"
      v-bind="bindProps"
      v-on="bindEvents"
      :placeholder="item.props.placeholder || `请输入${item.label}`"
      @keyup.enter.native="handleFilter"
      v-if="item.type==='input'"
      class="input"
    />
    <!-- <el-autocomplete
        popper-class="my-autocomplete"
        v-model="currentVal"
        v-bind="bindProps"
        v-on="bindEvents"
        :fetch-suggestions="querySearch"
        placeholder="请输入内容"
        @select="handleSelect">
        <i
          class="el-icon-edit el-input__icon"
          slot="suffix"
          @click="handleIconClick">
        </i>
        <el-select v-model="searchVal.area" slot="prepend" placeholder="请选择">
          <el-option
          v-for="item in areaOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id"
          >
          </el-option>
        </el-select>
        <template slot-scope="{ item }">
          <div class="name">{{ item.value }}</div>
          <span class="addr">{{ item.address }}</span>
        </template>
      </el-autocomplete> -->
    <!-- 下拉选择器 -->
    <el-select
      v-model="currentVal"
      v-bind="bindProps"
      v-on="bindEvents"
      :placeholder="item.props.placeholder || `请选择${item.label}`"
      :clearable="item.props.clearable || true"
      :multiple="item.props.multiple || false"
      :collapse-tags="item.props.collapseTags || false"
      class="filter-item"
      v-if="item.type==='select'"
    >
      <el-option
        v-for="optionItem in item.props.options"
        :key="optionItem.id"
        :label="optionItem.name || optionItem.text"
        :value="optionItem.id"
      />
    </el-select>
    <!-- 单选 -->
    <el-radio-group
      v-if="item.type==='radio'"
      v-model="currentVal"
      v-bind="bindProps"
      v-on="bindEvents"
    >
      <el-radio
        v-for="ch in item.props.options"
        :label="ch.value || ch.id"
        :key="ch.value || ch.id"
      >
        {{ch.text || ch.name}}
      </el-radio>
    </el-radio-group>
    <!-- 单选按钮 -->
    <el-radio-group
      v-if="item.type==='radioButton'"
      v-model="currentVal"
      v-bind="bindProps"
      v-on="bindEvents"
      @change="item.change && item.change(item.props.fieldName)"
    >
      <el-radio-button
        v-for="ch in item.props.options"
        :label="ch.value || ch.id"
        :key="ch.value || ch.id"
      >
        {{ch.name || ch.text}}
      </el-radio-button>
    </el-radio-group>
    <!-- 复选框 -->
    <el-checkbox-group
      v-if="item.type==='checkbox'"
      v-model="currentVal"
      v-bind="bindProps"
      v-on="bindEvents"
    >
      <el-checkbox
        v-for="ch in item.props.options"
        :label="ch.id"
        :key="ch.id"
      >
        {{ch.name || ch.text}}
      </el-checkbox>
    </el-checkbox-group>
    <!-- 日期 -->
    <el-date-picker
      v-model="currentVal"
      v-bind="bindProps"
      v-on="bindEvents"
      :value-format="item.props.format || 'yyyy-MM-dd'"
      :type="item.props.type || 'daterange'"
      align="right"
      unlink-panels
      range-separator="至"
      :start-placeholder="item.props.startPlaceholder || '开始日期'"
      :end-placeholder="item.props.endPlaceholder || '结束日期'"
      :placeholder="item.placeholder"
      style="width: 100%"
      :picker-options="item.props.pickerOptions"
      :default-time="item.props.defaultTime ? item.props.defaultTime : item.props.type !== 'date' ? ['00:00:00', '23:59:59'] : '00:00:00'"
      v-if="item.type==='dataPicker'"
    ></el-date-picker>
      <el-time-picker
      :is-range="item.props.isRange"
      v-model="currentVal"
      v-bind="bindProps"
      v-on="bindEvents"
      range-separator="至"
      :start-placeholder="item.props.startPlaceholder || '开始日期'"
      :end-placeholder="item.props.endPlaceholder || '结束日期'"
      :placeholder="item.placeholder"
      v-if="item.type==='timePicker'">
    </el-time-picker>
  </div>
</template>
<script>
export default {
  props: {
    value: undefined,
    // 搜索组件
    item: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      checkBoxGroup: []
    }
  },
  created () {
    this.$emit('input', this.item.props.defaultValue || '')
  },
  computed: {
    // 双向绑定数据值
    currentVal: {
      get () {
        if (this.item.type === 'checkbox') {
          return this.value ? this.value : [];
        }
        // if (this.item.type === 'dataPicker') {
        //   return this.item.props.defaultValue ? this.item.props.defaultValue : '';
        // }
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    },
    // 绑定属性
    bindProps () {
      let obj = { ...this.item }
      // 移除冗余属性
      delete obj.label
      delete obj.prop
      delete obj.element
      delete obj.initValue
      delete obj.rules
      delete obj.events
      if (obj.type === 'select' || obj.type === 'checkbox') {
        delete obj.options
      }
      return obj
    },
    // 绑定方法
    bindEvents () {
      return this.item.events || {}
    }
  },
  methods: {
  }
}
</script>

<style lang="less">
#formItem{
  input{
    font-size:12px;/*no*/
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(230,236,255,1);
    background:rgba(34,44,81,0.5);
    border-radius:4px;/*no*/
    border:1px solid rgba(98,117,191,1);
  }
  .el-input{
    input{
      height: 30px;/*no*/
    }
  }
  .el-date-editor{
    .el-range-separator{
      font-size: 12px;/*no*/
      display: flex;
      align-items: center;
    }
  }
  .el-radio-group{
    >label{
      margin-right: 10px;
      line-height: 30px;/*no*/
      .el-radio__label{
        font-size: 12px;/*no*/
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #E6ECFF;
        padding-left: 10px;
      }
      &:not(:first-child){
        margin-left: 10px;
      }
    }
  }
  .el-date-editor{
    background: transparent;
    border: none;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
    padding-bottom: 0;
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
      flex: 1;
      background:rgba(34,44,81,1);
      border-radius:4px;
      border:1px solid rgba(98,117,191,1);
    }
  }
}
</style>
