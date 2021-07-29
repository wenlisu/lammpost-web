/* eslint-disable camelcase */
<template>
  <div id='wisdomWarnDetail' >
    <card title="基本信息" className="baseInfo">
      <FormItemText
        :layout="formItems"
        labelWidth="0px"
      >
      <template v-slot:voice>
          <i class="iconfont icon-yuyinhujiao" :style="{fontSize: '25px', color: '#2EDEF4', marginTop: '10px', cursor: 'pointer'}" @click="handlePlayVoice"/>
        </template>
        <template v-slot:imgList>
          <div>摄像头监控画面：</div>
          <!-- <el-image
            v-for="(item, index) in [form.picOne, form.picTwo, form.picThree]"
            :key="index"
            :src="item"
            @click="$openPreview([item])"
            >
          </el-image> -->
          <!-- <video
            v-if="form.picOne"
            :src="form.picOne"
            class="avatar video-avatar"
            controls="controls"
            autoplay
          >您的浏览器不支持视频播放</video> -->
          <iframe
            :src="form.picOne"
            :style="{width: '100%', height: '100%'}"
            frameborder="0"
            allowfullscreen
            allow="autoplay"
            scrolling="no"
          ></iframe>
        </template>
        <template v-slot:terminalName>
          <el-button type="text" :style="{fontSize: '12px'}" @click="goLightDetail">{{form.terminalName}}</el-button>
        </template>
      </FormItemText>
    </card>
    <card title="历史报警记录" className="history">
        <page-table
            col-align="center"
            :data="tableData"
            :cols="tableCols"
            :page-current="page.current"
            :total="page.total"
            :page-size="page.pageSize"
            @current-change="onCurrentChange"
            @size-change="onPageSizeChange"
          >
          <template
              slot-scope="scope"
              slot="imgList"
            >
              <el-image
                src="../../lightPole/lightPoleDetail/images/img2.png"
                fit="'fill'"
                :preview-src-list="[scope.row.picOne, scope.row.picTwo, scope.row.picThree]"
              ></el-image>
            </template>
          </page-table>
    </card>
    <audio ref="audio" :src="form.voice" loop="loop" :style="{display: 'none'}"></audio>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex';
import FormItemText from '@/components/formItemText/formItemText';
import PageTable from '@/components/page-table';
import card from '@/view/lightPole/lightPoleStatistical/components/card';
import { routePush } from '@/util/util';
import {
  getHistoryRecord,
  getEmergencyDetail
} from 'api/wisdomMonitor';
export default {
  name: 'wisdomWarnDetail',
  data () {
    return {
      form: {
        srcList: [],
        voice: '',
        terminalName: ''
      },
      formItems: [
        {
          id: 'terminalName',
          label: '灯杆名称',
          custom: true,
          span: 8
        },
        {
          id: 'address',
          label: '地址',
          value: '',
          unit: '',
          span: 8
        },
        {
          id: 'serialNumber',
          label: '摄像头ID',
          value: '',
          unit: '',
          span: 8
        },
        {
          id: 'orderNo',
          label: '报警人',
          value: '',
          unit: '',
          span: 16
        },
        {
          id: 'beginCallTime',
          label: '报警开始时间',
          value: '',
          unit: '',
          span: 8
        },
        {
          id: 'endCallTime',
          label: '报警截止时间',
          value: '',
          unit: '',
          span: 16
        },
        {
          id: 'voice',
          label: '呼叫语音',
          custom: true,
          span: 12,
          class: 'voice'
        },
        {
          id: 'imgList',
          label: '',
          custom: true,
          span: 24,
          class: 'noBottom imgList'
        }
      ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      tableCols: [
        { label: '报警开始时间', prop: 'beginCallTime' },
        { label: '报警结束时间', prop: 'endCallTime' },
        { label: '报警监控画面', prop: 'imgList' }
      ]
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.openPage === 'wisdomWarnDetail') {
        this.editData = this.common['wisdomWarnDetail'];
        this.getDataAllList();
        this._getEmergencyDetail(this.editData.emergencyNumber);
      }
    })
  },
  components: {
    card,
    FormItemText,
    PageTable
  },
  computed: {
    ...mapGetters(['common', 'openPage'])
  },
  methods: {
    // 获取所有/查询数据列表
    getDataAllList () {
      let data = {
        data: {
          ...this.searchVal
        },
        pageNo: Number(this.page.current), // 查询的分页页码
        pageSize: Number(this.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: ''
      };
      getHistoryRecord(data).then(res => {
        if (res.code === '200') {
          const { data, total } = res.data;
          this.page.total = total;
          this.tableData = data;
        }
      });
    },
    onCurrentChange (val) {
      this.page.current = val;
      this.getDataAllList();
    },
    onPageSizeChange (val) {
      this.page.pageSize = val;
      this.onCurrentChange(1);
    },
    _getEmergencyDetail (emergencyNumber) {
      getEmergencyDetail(emergencyNumber).then(res => {
        if (res.code === '200') {
          this.form = {
            ...this.form,
            imei: res.data.imei,
            terminalName: res.data.terminalName,
            picOne: res.data.picOne,
            voice: res.data.voice
          }
          this.formItems = this.formItems.map(item => {
            return {
              ...item,
              value: res.data[item.id]
            }
          });
        }
      })
    },
    handlePlayVoice () {
      this.$refs.audio.play()
    },
    goLightDetail () {
      routePush({
        title: '灯杆详情',
        name: 'lightPoleDetail',
        parames: {
          imei: this.form.imei
        }
      });
    }
  }
}
</script>

<style lang="less">
#wisdomWarnDetail{
  .baseInfo{
    margin-bottom: 10px;/*no*/
    border-left: 3px solid #2B7EF2;
    border-radius: 1px;/*no*/
    #formItemText{
      padding:10px 20px;/*no*/
      .voice{
        margin-top: 10px;/*no*/
      }
      .imgList{
        iframe{
          width: 300px !important;/*no*/
          height: 170px !important;/*no*/
          margin-top: 15px;/*no*/
        }
      }
    }
  }
  .history{
    .comp-page-table{
      background: transparent;
    }
  }
  .el-dialog{
    .el-dialog__body{
      padding: 0px;
      height: 309px;/*no*/
    }
  }
}
</style>
