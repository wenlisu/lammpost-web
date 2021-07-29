<template>
  <colorPicker v-model="color" v-on:change="headleChangeColor"/>
</template>
<script>
import Vue from 'vue'
import vcolorpicker from 'vcolorpicker'
Vue.use(vcolorpicker)
export default {
  data () {
    return {
      color: '#ff0000'
    }
  },
  props: {
    value: {
      type: String,
      default: '#ff0000'
    }
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    headleChangeColor (val) {
      this.$emit('change', val);
    }
  }
}
</script>
