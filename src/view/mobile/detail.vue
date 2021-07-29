<template>
  <div id="mobile_mapDetail">
    <div class="head_title">
      <i class="el-icon-arrow-left" @click="goBack"></i>监控详情
    </div>
    <div class="video_content" :style="{height:videoHeight+'px'}">
      <iframe
        src="http://221.7.190.82:10800/play.html?channel=3&iframe=yes&aspect=640x360"
        width="100%"
        height="100%"
        allow="autoplay"
        border="0"
        scrolling="no"
        allowfullscreen
      ></iframe>
    </div>
    <div class="video_title">
      <span v-if="regionName">{{regionName}}</span>
      <!-- <i class="iconfont icon-quanping"></i> -->
    </div>
    <div class="event_list">
      <div class="infinite-list-wrapper" style="overflow:auto">
        <el-collapse
          v-model="activeName"
          accordion
          @change="handleChange"
          v-infinite-scroll="load"
          :infinite-scroll-disabled="disabled"
          :infinite-scroll-immediate="false"
          infinite-scroll-distance="50"
        >
          <el-collapse-item
            class="event_item"
            v-for="(item, index) in list"
            :key="index"
            :name="index"
          >
            <template slot="title">
              <div class="event_title">
                <i class="iconfont icon-shijian1"></i>
                {{item.cameraSceneRule}}
              </div>
            </template>
            <div class="event_content">
              <el-row>
                <el-col :span="12">
                  <div class="col_title">发生日期 ：</div>
                  {{item.eventHappenDate}}
                </el-col>
                <el-col :span="12">
                  <div class="col_title">发生时间 ：</div>
                  {{item.eventHappenTime}}
                </el-col>
                <el-col :span="24">
                  <div class="col_title">事 件：</div>
                  {{item.eventDescription}}
                </el-col>
                <el-col :span="24">
                  <div class="col_title">事件截图：</div>
                  <!-- <img class="event_img" src="http://img.pconline.com.cn/images/upload/upc/tx/photoblog/1106/09/c0/7937385_7937385_1307553615653.jpg" alt=""> -->
                  <!-- <div class="event_imglist"> -->
                  <div class="event_img" :style="`background-image:url(${item.imagePath})`"></div>
                  <!-- </div> -->
                </el-col>
              </el-row>
            </div>
          </el-collapse-item>
        </el-collapse>
        <p class="tipsText" v-if="loading">加载中...</p>
        <p class="tipsText" v-if="noMore">没有更多了</p>
      </div>
    </div>
  </div>
</template>
<script>
import { getEvents } from 'api/IBM';
export default {
  data () {
    return {
      activeName: 0,
      list: [],
      loading: false,
      currentIndex: 0,
      currentList: [],
      regionName: '',
      videoPath: ''
    };
  },
  computed: {
    videoHeight () {
      let height = document.body.offsetWidth / 1.4;
      return parseInt(height);
    },
    noMore () {
      return this.currentIndex >= 5;
    },
    disabled () {
      return this.loading || this.noMore;
    }
  },
  methods: {
    goBack () {
      this.$router.push({ name: 'monitorMap' });
    },
    handleChange (val) {
      this.regionName = this.list[val] && this.list[val].regionName;
      this.videoPath = this.list[val] && this.list[val].videoPath;
    },
    load () {
      this.loading = false;
      setTimeout(() => {
        this.currentIndex += 1;
        this.getList();
        this.loading = false;
      }, 3000);
    },
    getList () {
      const contentParames = {
        // regions: "12",
        // sceneId: "1",
        cameraIds: ["3"]
      };
      let params = {
        offset: 10,
        start: this.currentIndex,
        params: JSON.stringify(contentParames)
      };
      getEvents(params).then(res => {
        const { data } = res;
        this.currentList = data.content;
        if (data.content.length === 0) {
          this.loading = false;
        } else {
          this.list = this.list.concat(data.content);
          this.regionName = this.list[0].regionName;
          this.videoPath = this.list[0].videoPath;
        }
      });
    }
  },
  created () {
    document.body.style.minWidth = 'auto';
    document.getElementById('app').style.overflow = 'auto';
    // this.getList();
  }
};
</script>
<style lang="less" scoped>
#mobile_mapDetail {
  .head_title {
    background: #ff6701;
    text-align: center;
    height: 88px;
    font-size: 32px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: rgba(255, 255, 255, 1);
    line-height: 88px;
    position: relative;
    .el-icon-arrow-left {
      position: absolute;
      top: 23px;
      left: 30px;
    }
  }
  .video_content {
    // height: 386px;
    // background-color: #000;
    position: relative;
    // overflow: hidden;
    iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  }
  .video_title {
    padding: 17px 0 17px 43px;
    margin-top: -5px;
    width: 100%;
    font-size: 30px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: rgba(255, 255, 255, 1);
    // line-height: 30px;
    // padding-left: 43px;
    background: #000;
    position: relative;
    margin-top: -8px;
    // left: 0;
    // bottom: 17px;
    // position: absolute;
    span {
      &::after {
        content: "";
        width: 6px;
        height: 25px;
        background: linear-gradient(
          180deg,
          rgba(255, 160, 2, 1) 0%,
          rgba(255, 103, 1, 1) 100%
        );
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 1);
        border-radius: 3px;
        position: absolute;
        left: 27px;
        top: 25px;
      }
    }
    .icon-quanping {
      position: absolute;
      right: 25px;
      bottom: 17px;
      font-weight: normal;
    }
  }
  .event_list {
    padding: 20px 24px;
    height: calc(100% - 386px);
    background: #f5f5f5;
    /deep/.el-collapse {
      border: none;
    }
    /deep/.el-collapse-item,
    /deep/.el-collapse-item__wrap {
      border-radius: 17px;
      border: none;
    }
    .event_item {
      margin-bottom: 20px;
      border: none;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 6px 9px 0px rgba(205, 205, 205, 0.5);
      /deep/.el-collapse-item__header {
        padding: 0 22px;
        height: 88px;
        line-height: 88px;
        border-radius: 17px;
        border: none;
        .event_title {
          font-size: 30px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(62, 62, 62, 1);
        }
      }
      /deep/.el-collapse-item__header.is-active {
        border-bottom: 1px solid #e8e8e8 !important;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }
      .event_content {
        padding: 20px;
        font-size: 22px;
        color: #3e3e3e;
        // .el-collapse-item__content
        .col_title {
          display: inline-block;
          text-justify: distribute-all-lines;
          text-align-last: justify;
          min-width: 120px;
        }
        // .event_imglist {
        // display: inline-block;
        // vertical-align: top;
        // justify-content:space-around;
        .event_img {
          width: 166px;
          height: 166px;
          display: inline-block;
          vertical-align: top;
          // float: left;
          border-radius: 5px;
          margin-right: 20px;
          margin-bottom: 10px;
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
          &:last-child {
            margin-right: 0px;
          }
          // &::after {
          //   visibility: hidden;
          //   display: block;
          //   font-size: 0;
          //   content: " ";
          //   clear: both;
          //   height: 0;
          // }
        }
        // }
      }
      /deep/.el-col {
        margin-bottom: 14px;
      }
    }
  }
  .icon-shijian1 {
    padding: 10px 8px;
    color: #fff;
    background: linear-gradient(
      135deg,
      rgba(245, 155, 97, 1) 0%,
      rgba(248, 51, 51, 1) 100%
    );
    border-radius: 11px;
    margin-right: 5px;
  }
  .tipsText {
    font-size: 14px;
    color: #5e6d82;
    text-align: center;
  }
}
</style>
