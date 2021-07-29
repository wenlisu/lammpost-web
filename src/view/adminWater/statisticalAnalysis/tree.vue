<template>
  <div id="treeselect" :class="className">
    <Treeselect
      v-model="currentVal"
      :multiple="multiple"
      :always-open="false"
      :options="options"
      :value-consists-of="'ALL'"
      :value-format="multiple ? 'object' : 'id'"
      @select="selectOption"
    >
      <slot />
    </Treeselect>
  </div>
</template>

<script>
import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect';
import { getWaterMeterSiteTree } from 'api/admin'
export default {
  name: 'treeselect',
  components: {
    Treeselect
  },
  data () {
    return {
      options: [],
      parames: {
        "areaCode": "",
        "buildingCode": "",
        "floorCode": "",
        "parkCode": "",
        "streetCode": ""
      }
    };
  },
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    value: {
      type: [Array, String, Number],
      default: () => []
    },
    className: {
      type: String,
      default: ''
    },
    disableBranchNodes: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    // 双向绑定数据值
    currentVal: {
      get () {
        if (this.value instanceof Array) {
          const reg = /[\u4e00-\u9fa5]/g;
          const val = this.value.length > 0 ? this.value.filter(v => !reg.test(v.imei)) : null;
          this.setDom(val);
          return Array.from(new Set(val));
        }
        return this.value;
      },
      set (newVal) {
        if (newVal instanceof Array) {
          const reg = /[\u4e00-\u9fa5]/g;
          const val = newVal.filter(v => !reg.test(v.imei));
          this.$emit('input', Array.from(new Set(val)));
          this.setDom(val);
        } else {
          // this.$emit('input', newVal);
          return newVal
        }
      }
    }
  },
  watch: {
    value: {
      deep: true,
      handler (val) {
        // console.log('currentVal', val);
      }
    }
  },
  mounted () {
    this.$nextTick(async () => {
      getWaterMeterSiteTree(this.parames).then(async res => {
        if (res.code === '200') {
          // 区域
          res.data.map(async (data, index) => {
            // 小区
            let childrenRestaurants = await this.getTrees(data.areaCode);
            let children = [];
            await childrenRestaurants.map(async (item,i) => {
              // 楼栋信息
              let addressRestaurants = await this.getTrees(data.areaCode, item.parkCode);
              let floor = []
              // 楼层
              await addressRestaurants.map(async (i, j) => {
                let detail = []
                let  addressChildren =await this.getTrees(data.areaCode, item.parkCode, i.buildingCode);
                addressChildren.map(f => {
                  detail.push({
                    id: Math.random()*10 + f.floorCode,
                    label: f.floorName,
                    floorId: f.floorCode,
                    areaId: data.areaCode,
                    parkId: item.parkCode,
                    buildingId: i.buildingCode
                  })
                })
                floor.push({
                  id: Math.random()*10 + i.buildingCode,
                  label: i.buildingName,
                  children: detail,
                  buildingId: i.buildingCode,
                  areaId: data.areaCode,
                  parkId: item.parkCode,
                })
              })
              children.push({
                id: Math.random()*10 + item.parkCode,
                label: item.parkName,
                children: floor,
                parkId: item.parkCode,
                areaId: data.areaCode
              })
            })
            this.options.push({
              id: data.areaCode,
              label: data.areaName,
              children: children,
              areaId: data.areaCode,
            })
          })
        }
      });
    });
  },
  methods: {
    setDom (val) {
      setTimeout(() => {
        if (val && val.length > 2) {
          let domItems = document.getElementsByClassName('vue-treeselect__multi-value-item-container');
          domItems = Array.from(domItems);
          for (let i = 0; i < domItems.length; i++) {
            if (i === 0) {
              domItems[i].style.display = 'inline-block';
            }
            if (i === 2) {
              domItems[i].style.display = 'inline-block';
            }
            if (i > 2) {
              // domItems[i].style.display = 'none';
            }
          }
        }
      }, 50);
    },
    async loadOptions ({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        if (!parentNode.addressId) {
          const addressRestaurants = await this.loadAll(parentNode.id);
          parentNode.children = addressRestaurants.map(item => {
            return {
              ...item,
              areaId: parentNode.id,
              addressId: item.id
            }
          });
        } else {
          const addressRestaurants = await this.loadLamp(parentNode.id);
          parentNode.children = addressRestaurants.map(item => {
            return {
              ...item,
              areaId: parentNode.areaId,
              addressId: parentNode.addressId,
              lampId: item.id
            }
          });
        }
      }
    },
    selectOption (node, instanceId) {
      this.$emit('getNode', node)
    },
    async getTrees (areaCode, parkCode = '', buildingCode = '') {
      let parames = {
        "areaCode": areaCode,
        "buildingCode": buildingCode,
        "floorCode": "",
        "parkCode": parkCode,
        "streetCode": ""
      };
      let res = await getWaterMeterSiteTree(parames);
      if( res.code === '200' ) {
        const result = res.data;
        return result
      }
    },
  }
};
</script>

<style lang="less" scoped>
#treeselect{
  width: 100%;/*no*/
  height: 30px;/*no*/
  /deep/.vue-treeselect{
    height: 30px;/*no*/
    .vue-treeselect__control{
      height: 30px;/*no*/
      font-size:12px;/*no*/
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:#000;
      background:#fff;
      border-radius:4px;/*no*/
      border:1px solid #C0C4CC;
      .vue-treeselect__value-container{
      height: 30px;/*no*/
        .vue-treeselect__multi-value{
          height: 30px;/*no*/
          margin-bottom: 0px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .vue-treeselect__input-container{
          padding-top: 0;
        }
        .vue-treeselect__multi-value-item-container{
            height: 24px;/*no*/
            padding: 0;
          .vue-treeselect__multi-value-item{
            height: 24px;/*no*/
            line-height: 24px;/*no*/
            margin: 2px 0 2px 6px;
            padding: 0 20px 0 8px;
            background-color: #f4f4f5;
            border-color: #e9e9eb;
            color: #909399;
            position: relative;
            border-radius: 4px;/*no*/
            .vue-treeselect__multi-value-label{
              padding: 0;
            }
            .vue-treeselect__value-remove{
              display: inline-block;
              color: #909399;
              padding: 0;
              background-color: #C0C4CC;
              border-radius: 50%;
              height: 16px;/*no*/
              width: 16px;/*no*/
              line-height: 16px;/*no*/
              text-align: center;
              transform: scale(.8);
              position: absolute;
              top: 0;
              svg{
                width: 12px;
                height: 12px;
              }
            }
          }
        }
      }
    }
    .vue-treeselect__menu-container{
        z-index: 1002 !important;
      .vue-treeselect__menu{
        padding: 0;
        margin-top: 10px;/*no*/
        .vue-treeselect__list{
          .vue-treeselect__list-item{

          }
        }
      }
    }
  }
  &.adminTressSelect{
    /deep/.vue-treeselect{
      .vue-treeselect__control{
        border: 1px solid #ddd;
        background: #fff;
      }
    }
  }
}
</style>
