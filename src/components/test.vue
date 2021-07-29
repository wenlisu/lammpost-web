<template>
  <div class="dv-border-box-1" :ref="ref">
    <div
      :class="`flexCenter title-center title`"
    >
      <div class='flyImg'>
        <span />
        <span />
        <span />
      </div>
    </div>
    <svg class="border" :width="width" :height="height">
      <polygon :fill="backgroundColor" :points="`10, 27 10, ${height - 27} 13, ${height - 24} 13, ${height - 21} 24, ${height - 11}
      38, ${height - 11} 41, ${height - 8} 73, ${height - 8} 75, ${height - 10} 81, ${height - 10}
      85, ${height - 6} ${width - 85}, ${height - 6} ${width - 81}, ${height - 10} ${width - 75}, ${height - 10}
      ${width - 73}, ${height - 8} ${width - 41}, ${height - 8} ${width - 38}, ${height - 11}
      ${width - 24}, ${height - 11} ${width - 13}, ${height - 21} ${width - 13}, ${height - 24}
      ${width - 10}, ${height - 27} ${width - 10}, 27 ${width - 13}, 25 ${width - 13}, 21
      ${width - 24}, 11 ${width - 38}, 11 ${width - 41}, 8 ${width - 73}, 8 ${width - 75}, 10
      ${width - 81}, 10 ${width - 85}, 6 85, 6 81, 10 75, 10 73, 8 41, 8 38, 11 24, 11 13, 21 13, 24`" />
    </svg>
    <svg
      :width="width"
      :height="`36px`"
      :class="`title titleBg`"
    >
    </svg>
      <svg
        width="24px"
        :height="`36px`"
        v-for="item in ['title-left', 'title-right']"
        :key="item"
        :class="`title ${item}`"
      >
        <polygon
          :fill="mergedColor[0]"
          points="6 0 7 0 2 9.40425926 2 25.6166574 7 36 6 36 0 25.6166574 0 9.40425926"
        >
          <animate
            attributeName="fill"
            :values="`${mergedColor[0]};${mergedColor[1]};${mergedColor[0]}`"
            dur="0.5s"
            begin="0s"
            repeatCount="indefinite"
          />
        </polygon>
        <polygon
          :fill="mergedColor[0]"
          points="12.7142857 3 14 3 8.57142857 11.717328 8.57142857 23.2976125 14 32.7142857 12.7142857 32.7142857 6 23.2976125 6 11.717328"
        >
          <animate
            attributeName="fill"
            :values="`${mergedColor[0]};${mergedColor[1]};${mergedColor[0]}`"
            dur="0.5s"
            begin="0s"
            repeatCount="indefinite"
          />
        </polygon>
        <rect xmlns="http://www.w3.org/2000/svg" id="矩形" fill="#FFBB1D" x="17" y="15" width="7" height="7">
          <animate
            attributeName="fill"
            dur="1s"
            begin="0s"
            repeatCount="indefinite"
          />
        </rect>
      </svg>
    <svg
      width="150px"
      :height="`${(height > 36) ? (height - 36) : height}px`"
      :key="item"
      v-for="(item) in border"
      :class="`${item} border`"
    >
    <polygon
        :fill="mergedColor[0]"
        :points="`0 0.871543943 6 13.8715439 6 245.214356 0 245.214356 0 237.765732 4.00441007 233.667218 4.04158909 26.6688643 0 17.3952692`"
      >
        <animate
          attributeName="fill"
          :values="`${mergedColor[0]};${mergedColor[1]};${mergedColor[0]}`"
          dur="0.5s"
          begin="0s"
          repeatCount="indefinite"
        />
      </polygon>
    </svg>
    <svg
      width="150px"
      height="28px"
      :key="item"
      v-for="(item) in ['left-bottom', 'right-bottom']"
      :class="`${item} border`"
    >
    <polygon
        :fill="mergedColor[1]"
        points="0 7.80209231e-14 6 7.80209231e-14 6 5.71197141 16.9281021 22.9486743 23 22.9486743 33 28 14.2055135 28 0 5.71197141"
      >
        <animate
          attributeName="fill"
          :values="`${mergedColor[1]};${mergedColor[0]};${mergedColor[1]}`"
          dur="0.5s"
          begin="0s"
          repeatCount="indefinite"
        />
      </polygon>
      <polygon
        :fill="mergedColor[0]"
        points="0 19 -1.02300113e-13 10 11.5 28 6 28"
      >
        <animate
          attributeName="fill"
          :values="`${mergedColor[0]};${mergedColor[1]};transparent`"
          dur="1s"
          begin="0s"
          repeatCount="indefinite"
        />
      </polygon>
    </svg>
    <div class="border-box-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import autoResize from '@/util/autoResize'
import { deepMerge } from '@jiaminghi/charts/lib/util/index'
import { deepClone } from '@jiaminghi/c-render/lib/plugin/util';
export default {
  name: 'DvBorderBox1',
  mixins: [autoResize],
  props: {
    color: {
      type: Array,
      default: () => ([])
    },
    backgroundColor: {
      type: String,
      default: 'transparent'
    }
  },
  data () {
    return {
      ref: 'border-box-1',
      border: ['left-top', 'right-top'],
      defaultColor: ['#4fd2dd', '#235fa7'],
      mergedColor: []
    }
  },
  watch: {
    color () {
      const { mergeColor } = this
      mergeColor()
    }
  },
  methods: {
    mergeColor () {
      const { color, defaultColor } = this
      this.mergedColor = deepMerge(deepClone(defaultColor, true), color || [])
    }
  },
  mounted () {
    const { mergeColor } = this
    mergeColor();
    this.$nextTick(() => {
    })
  }
}
</script>

<style lang="less">
.dv-border-box-1 {
  position: relative;
  width: 100%;
  height: 100%;
  .title{
    position: absolute;
    display: block;
    top: 0;
    left: 0;
  }
  .titleBg{
    background: linear-gradient(270deg,rgba(0,28,91,0.19) 0%, rgba(0,120,237,0.62) 48%, rgba(0,28,91,0.50));
  }
  .title-left{
    left: 0;
  }
  .title-center{
    left: 35px;
    width: 75px;
    height: 36px;/*no*/
    display: flex;
    .flyImg{
      width: 72px;
      height: 25px;
      background: url('~common/images/bigscreen/img1.png') no-repeat center 100%;
      background-size: 100% 100%;
      position: relative;
      span{
        position: absolute;
        left: 50%;
        top: calc((100% - 5px) / 2);
        width: 0;
        height: 2px;
        background-image: linear-gradient(to right, #00DBFD, #0760F6);
        &:nth-child(1){
          transform: translateY(4px) rotate(0deg);
          animation: line 0.5s linear 0.5s infinite alternate;
        }
        &:nth-child(2){
          transform: translateX(-2px) rotate(0deg);
          animation: line 0.5s linear 1s infinite alternate;
        }
        &:nth-child(3){
          transform: translateY(-4px) translateX(-4px) rotate(0deg);
          animation: line 0.5s linear 2.5s infinite alternate;
        }
      }
    }
  }
  @-moz-keyframes line {
    0% {
        width: 0;
    }
    100% {
        width: 17px;
    }
  }
  @-webkit-keyframes line {
      0% {
          width: 0;
      }
      100% {
          width: 17px;
      }
  }
  @keyframes line {
      0% {
          width: 0;
      }
      100% {
          width: 17px;
      }
  }
  .title-right{
    left: auto;
    right: 0;
    transform: rotateX(180deg) rotateY(180deg);
  }
  .border {
    position: absolute;
    display: block;
  }
  .left-top{
    left: 0;
    top: 26px;
  }
  .right-top {
    top: 26px;
    right: 0px;
    transform: rotateY(180deg);
  }
  .left-bottom {
    left: 0;
    bottom: 0px;
    transform: rotateX(0deg);/*no*/
  }
  .right-bottom {
    right: 0px;
    bottom: 0px;
    transform: rotateX(0deg) rotateY(180deg);/*no*/
  }
  .border-box-content {
    position: relative;
    width: 100%;
    height: 100%;
  }
}
</style>
