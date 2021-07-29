<template>
  <el-upload
    class="flexRow avatar-uploader el-upload--text"
    :action="uploadUrl"
    :show-file-list="false"
    :accept="accept"
    :data="{
      appCode: appCodes.appCode,
      ...parames,
    }"
    :on-success="handleVideoSuccess"
    :before-upload="beforeUploadVideo"
    :on-progress="progressShow ? uploadVideoProcess : () => {}"
    :on-remove="handleRemove"
    :multiple="multiple"
    :file-list="fileLists"
    :on-exceed="handleExceed"
    :disabled="disabled"
    list-type="picture-card"
    :limit="limit"
  >
    <div class="flexRow">
      <div class="flexRow img">
        <div
          v-for="imgFile in fileLists"
          :key="imgFile.url"
          class="imgContent"
          v-if="imgFile && imgFile.url && type === 'img'"
        >
          <img :src="imgFile.url" />
        </div>
      </div>
      <div class="flexRow video">
        <div
          v-for="videoFile in fileLists"
          :key="videoFile.url"
          class="videoContent"
          v-if="videoFile && videoFile.url && type === 'video'"
        >
          <video
            v-if="
              videoFile && videoFile.url != '' && !videoFlag && type === 'video'
            "
            :src="videoFile && videoFile.url"
            class="avatar video-avatar"
            controls="controls"
          >
            您的浏览器不支持视频播放
          </video>
          <span
            class="el-upload-list__item-actions"
            @click.prevent.stop="&quot;javascript;&quot;;"
          >
            <span
              class="el-upload-list__item-delete"
              @click.prevent.stop="handleRemove"
            >
              <i class="el-icon-delete" />
            </span>
          </span>
        </div>
      </div>
      <div class="flexRow audio">
        <div
          v-for="audioFile in fileLists"
          :key="audioFile.url"
          class="audioContent"
          @click.prevent.stop="&quot;javascript;&quot;;"
          v-if="audioFile && audioFile.url && type === 'audio'"
        >
          <audioContainer
            :file="audioFile"
            @handleRemove="(file) => handleAudioRemove(file, fileLists)"
          />
        </div>
      </div>
      <div class="flexCloumn contentContainer">
        <slot name="content">
          <img
            v-if="showVideoPath != '' && !videoFlag && type === 'img'"
            :src="showVideoPath"
            class="avatar video-avatar"
          />

          <i
            v-else-if="showVideoPath == '' && !videoFlag"
            class="el-icon-plus avatar-uploader-icon"
          ></i>
          <el-progress
            v-if="videoFlag == true"
            type="circle"
            :percentage="videoUploadPercent"
            style="margin-top: 30px"
          ></el-progress>
          <el-button
            class="video-btn"
            slot="trigger"
            size="small"
            v-if="isShowUploadVideo"
            type="primary"
            >选取文件</el-button
          >
        </slot>
        <el-progress
          v-if="progressShow && progressFlag"
          :percentage="loadProgress"
          :stroke-width="4"
        ></el-progress>
      </div>
    </div>
  </el-upload>
  <!-- <P v-if="isShowUploadVideo" class="text">请保证文件格式正确，且不超过20M</P> -->
</template>
<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import moment from "moment";
import config, { baseURL } from "@/config";
import audioContainer from "./audio";
export default {
  props: {
    type: {
      type: String,
      default: "",
    }, // 上传的文件类型
    uploadUrl: {
      type: String,
      default: "",
    }, // 你要上传视频到你后台的地址
    fileList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    parames: {
      type: Object,
      default: () => {},
    },
    limit: {
      type: Number,
      default: undefined,
    },
    progressShow: {
      type: Boolean,
      default: true,
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  // 初始化参数
  data() {
    console.log('this.fileList', this.fileList);
    return {
      videoFlag: false, // 是否显示进度条
      videoUploadPercent: "", // 进度条的进度，
      isShowUploadVideo: false, // 显示上传按钮
      showVideoPath: false,
      accept: "",
      fileLists: this.fileList,
      serviceCode: "",
      loadProgress: 0, // 动态显示进度条
      progressFlag: false, // 关闭进度条
    };
  },
  computed: {
    ...mapGetters([
      'appCodes'
    ]),
    propsUpdates() {
      const { type } = this;
      return { type };
    },
  },
  components: {
    audioContainer,
  },
  watch: {
    propsUpdates: {
      deep: true,
      handler(newval, oldval) {
        this.initAccept(newval.type);
      },
    },
    fileList: {
      deep: true,
      handler(newval, oldval) {
        this.fileLists = newval;
      },
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initAccept(this.propsUpdates.type);
    });
  },
  methods: {
    initAccept(type) {
      if (type === "img") {
        this.accept = ".jpg, .bmp, .png, .JPG, .JPEG";
      } else if (type === "video") {
        this.accept = ".mp4";
      } else if (type === "audio") {
        this.accept = ".mp3";
      }
    },
    // 上传前回调
    beforeUploadVideo(file) {
      if (this.type === "video") {
        const isLt20M = file.size / 1024 / 1024 < 20;
        // if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb'].indexOf(file.type) === -1) {
        //   // 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb'
        //   this.$message.error('请上传正确的视频格式');
        //   return false;
        // }
        if (!isLt20M) {
          this.$message.error("上传视频大小不能超过20MB哦!");
          return false;
        }
        this.isShowUploadVideo = false;
      }
    },
    // 进度条
    uploadVideoProcess(event, file, fileList) {
      this.videoFlag = true;
      this.videoUploadPercent = file.percentage.toFixed(0) * 1;
      this.progressFlag = true; // 显示进度条
      this.loadProgress = this.videoUploadPercent; // 动态获取文件上传进度
      console.log("loadProgress", this.loadProgress);
      if (this.loadProgress >= 100) {
        this.loadProgress = 100;
        setTimeout(() => {
          this.progressFlag = false;
        }, 1000); // 一秒后关闭进度条
      }
    },

    // 上传成功回调
    handleVideoSuccess(res, file) {
      console.log(res, file);
      this.isShowUploadVideo = true;
      this.videoFlag = false;
      this.videoUploadPercent = 100;
      this.loadProgress = 100;
      setTimeout(() => {
        this.progressFlag = false;
      }, 1000);
      // debugger
      if (res.code === "200") {
        const fileDataPath = res.data.split(":");
        let filename = fileDataPath[1].replace(/\\/g, "/");
        console.log("filename", filename);
        this.showVideoPath = `${
          baseURL || config.baseURL.dev
        }/upload${filename}`;
        if (this.type === "img") {
          this.fileLists.push({
            name: fileDataPath[0],
            path: filename,
            url: this.showVideoPath,
            code: this.serviceCode,
          });
        } else {
          this.fileLists.push({
            name: fileDataPath[0],
            path: filename,
            url: this.showVideoPath,
            code: this.serviceCode,
          });
        }
        this.$emit("change", this.fileLists);
        // this.videoForm.showVideoPath = res.data.uploadUrl;
      } else if (res.res == "1") {
        this.fileLists.push({
          name: res.file,
          path: res.file,
          url: res.file,
          code: this.serviceCode,
        });
        this.$emit("change", this.fileLists);
      } else {
        this.$message.error("上传失败，请重新上传！");
      }
      console.log('this.fileLists', this.fileLists)
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    handleRemove(file, fileList) {
      console.log("fileList", fileList);
      this.fileLists = fileList;
      this.$emit("change", this.fileLists);
    },
    handleAudioRemove(file, fileList) {
      const list = fileList.map((fl) => {
        if (fl.uid !== file.uid) {
          return {
            ...fl,
          };
        }
      });
      this.fileLists = list.filter((m) => m);
      console.log("list", list);
      this.$emit("change", this.fileLists);
    },
    uuid() {
      this.serviceCode = moment().format("YYYYMMDDHHmmss");
      return this.serviceCode;
    },
  },
};
</script>
<style lang="less">
.avatar-uploader {
  ul {
    li {
      margin: 0;
      margin-right: 10px; /*no*/
    }
  }
}
.el-upload {
  background: transparent;
}
.contentContainer {
  background: #fbfdff;
  .el-progress {
    width: 100%;
    line-height: 5px;
    .el-progress-bar {
      margin-right: 0;
      padding-right: 0;
      .el-progress-bar__outer {
        background: linear-gradient(270deg, #1bc3a3 0%, #52e5ee 100%);
        .el-progress-bar__inner {
          border-radius: 0;
        }
      }
    }
    .el-progress__text {
      font-size: 12px !important; /*no*/
    }
  }
}
.avatar-uploader .el-upload {
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  align-items: center;
  border: none !important;
  // flex-wrap: wrap;
  .scrollView__nav-wrap {
    .scrollView__nav-prev,
    .scrollView__nav-next {
      color: #ccc;
      font-size: 20px; /*no*/
    }
  }
  .img,
  .video,
  .audio {
    // flex-wrap: wrap;
    line-height: 1 !important;
    .audioContent {
      border: 1px solid; /*no*/
      border-image: linear-gradient(
          225deg,
          rgba(217, 234, 255, 1),
          rgba(187, 212, 255, 1)
        )
        1 1;
      padding: 6px; /*no*/
      margin-right: 10px; /*no*/
      audio {
        width: 0;
        height: 0;
        visibility: hidden;
      }
    }
  }
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.video-avatar {
  width: 400px;
  height: 200px;
}
</style>
