<template>
  <div id="treeselect" :class="className">
    <Treeselect
      v-model="currentVal"
      :multiple="multiple"
      :always-open="false"
      :options="options"
      :value-consists-of="'ALL'"
      @select="selectOption"
      :showCount="true"
      :disable-branch-nodes="disableBranchNodes"
      placeholder="请选择对应LED屏"
      :value-format="multiple ? 'object' : 'id'"
      :disabled="disabled"
    >
      <slot />
    </Treeselect>
  </div>
</template>

<script>
import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect';
import {
  getGroupPolicy,
  getLamp
} from 'api/index';
import {
  getAddress,
  getSingAddress
} from 'api/controlStrategy';
export default {
  name: 'treeselect',
  components: {
    Treeselect
  },
  data () {
    return {
      options: []
    };
  },
  props: {
    multiple: {
      type: Boolean,
      default: true
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
          const val = this.value.length > 0 ? this.value.filter(v => v.imei && !reg.test(v.imei)) : null;
          this.setDom(val);
          return Array.from(new Set(val));
        }
        return this.value;
      },
      set (newVal) {
        if (newVal instanceof Array) {
          const reg = /[\u4e00-\u9fa5]/g;
          const val = newVal.filter(v => v.imei && !reg.test(v.imei));
          this.$emit('input', Array.from(new Set(val)));
          this.setDom(val);
        } else {
          this.$emit('input', newVal);
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
      getGroupPolicy().then(async res => {
        if (res.code === '200') {
          res.data.map(async (data) => {
            const childrenRestaurants = await this.loadAll(data.id);
            let children = [];
            await childrenRestaurants.map(async (item) => {
              const addressRestaurants = await this.loadLamp(item.id);
              let addressChildren = [];
              await addressRestaurants.map(lampItem => {
                addressChildren.push({
                  ...lampItem,
                  areaId: data.id,
                  addressId: item.id,
                  lampId: lampItem.id
                });
              });
              children.push({
                ...item,
                areaId: data.id,
                addressId: item.id,
                children: addressChildren
              });
            });
            this.options.push({
              area: data.area,
              areaId: data.id,
              id: data.id,
              label: data.area,
              children: children
            });
          });
        }
      });
    });
  },
  methods: {
    setDom (val) {
      console.log('val',val)
      setTimeout(() => {
        if (val && val.length > 2) {
          let domItems = document.getElementsByClassName('vue-treeselect__multi-value-item-container');
          domItems = Array.from(domItems);
          for (let i = 0; i < domItems.length; i++) {
            if (i === 0) {
              domItems[i].style.display = 'inline-block';
              // const spanItem = domItems[i].getElementsByClassName('vue-treeselect__multi-value-label');
              // const innerHtml = spanItem[0].getAttribute('data-html');
              // if (innerHtml) {
              //   spanItem[0].innerHTML = innerHtml
              // }
            }
            if (i === 2) {
              domItems[i].style.display = 'inline-block';
              // const spanItem = domItems[i].getElementsByClassName('vue-treeselect__multi-value-label');
              // spanItem[0].setAttribute('data-html', spanItem[0].innerHTML);
              // spanItem[0].innerHTML = `+${val.length - 1}`
            }
            if (i > 2) {
              // domItems[i].style.display = 'none';
            }
          }
        }
      }, 50);
    },
    async loadOptions ({ action, parentNode, callback }) {
      console.log(action, parentNode)
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
      let address = node.address;
      if (!address) {
        address = node.children[0].address
      }
      console.log({area: node.area, address})
      this.$emit('select', {area: node.area, address});
    },
    loadAll (area, address = '') {
      let api = getAddress;
      let parames = {
        area,
        address
      };
      return api(parames).then(res => {
        if (res.code === '200') {
          let dataList = [];
          res.data.map(data => {
            dataList.push({
              ...data,
              label: data.address
            })
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
              label: data.address
            })
          });
          return dataList;
        }
      });
    }
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
