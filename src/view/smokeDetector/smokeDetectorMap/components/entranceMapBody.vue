<template>
  <div id="entranceMapBody">
    <div class="infoBody" id="map_container">
    </div>
    <dialog-cont
      @on-cancel="detailDialogCancel"
      @on-confirm="detailDialogSubmit"
      :visible.sync="detailDialog.show"
      :confirmShow="false"
      :cancelShow="false"
      width="750px"
      title="设备详情"
      append-to-body
      :customClass="'smokerListDialog'"
    >
      <el-row :gutter="10" class="entranceMapBodyDialog">
        <el-col :span="14" class="formItemContainer clearfix">
        <FormItemText
          :layout="detailDialog.formItems"
          labelWidth="0px"
        ></FormItemText>
        </el-col>
        <el-col :span="10" class="videoContainer clearfix">
          <el-image :src="`${baseURL || config.baseURL.dev}/upload/${detailDialog.closeupPic}`" fit="fill" :preview-src-list="[`${baseURL || config.baseURL.dev}/upload/${detailDialog.closeupPic}`]">
            <div slot="error" class="image-error">
              加载失败
            </div>
          </el-image>
        </el-col>
      </el-row>
    </dialog-cont>
  </div>
</template>

<script>
import dialogCont from '@/components/dialog';
import FormItemText from '@/components/formItemText/formItemText';
import config, { baseURL } from '@/config';
import { initMap } from '../common';
import chongqingJson from '../chongqing';
import {
  getDoorAccessDeviceDetails,
  getDoorAccessDeviceList
} from 'api/entrance';
export default {
  data () {
    return {
      config,
      baseURL,
      initOptions: {
        tilt: 60,
        heading: -45.3,
        center: [106.53103787361032, 29.56207993493262],
        zoom: 20,
        skyColors: [
          // 地面颜色
          'rgba(7, 12, 23, 0)',
          // 天空颜色
          'rgba(186, 211, 252, 0)'
        ],
        marks: [
          {
            center: [106.53145775193605, 29.563520208905977],
            serialNumber: 'a',
            onClick: (e) => this.getDetail(e)
          },
          { center: [106.53144217657614, 29.563233114176672],
            serialNumber: 'a',
            onClick: (e) => this.getDetail(e)
          },
          { center: [106.53143978349026, 29.563066526680505],
            serialNumber: 'a',
            onClick: (e) => this.getDetail(e)
          },
          { center: [106.5314584145262, 29.562749414890135],
            serialNumber: 'a',
            onClick: (e) => this.getDetail(e)
          },
          { center: [106.5314307617182, 29.56248811443563],
            serialNumber: 'a',
            onClick: (e) => this.getDetail(e)
          },
          { center: [106.53177154873534, 29.562241693120143],
            serialNumber: 'a',
            onClick: (e) => this.getDetail(e)
          },
          { center: [106.53210886290337, 29.562244659156878],
            serialNumber: 'a',
            onClick: (e) => this.getDetail(e)
          },
          { center: [106.53246259153849, 29.562245550263786],
            serialNumber: 'a',
            onClick: (e) => this.getDetail(e)
          },
          { center: [106.53302334294273, 29.562242200562576],
            serialNumber: 'a',
            onClick: (e) => this.getDetail(e)
          },
          { center: [106.53318361394058, 29.56222854359789],
            serialNumber: 'a',
            onClick: (e) => this.getDetail(e)
          },
          { center: [106.53349956415784, 29.562243142248814],
            serialNumber: 'a',
            onClick: (e) => this.getDetail(e)
          }
        ]
      },
      detailDialog: {
        show: false,
        closeupPic: null,
        formItems: [{
          id: 'deviceName',
          label: '设备名称',
          value: '',
          span: 12
        }, {
          id: 'accessTypeText',
          label: '通道类型',
          value: '',
          span: 24
        }, {
          id: 'serialNumber',
          label: '设备序列号',
          value: '',
          span: 12
        }, {
          id: 'address',
          label: '安装地址',
          value: '',
          span: 12
        }, {
          id: 'onLineStatusText',
          label: '设备在线状态',
          value: '',
          span: 24
        }, {
          id: 'authorizationNumber',
          label: '已授权人数',
          value: '',
          span: 12
        }, {
          id: 'devicePort',
          label: '设备端口',
          value: '',
          span: 12
        }, {
          id: 'ip',
          label: '设备ip',
          value: '',
          span: 12
        }]
      }
    };
  },
  mounted () {
    this.$nextTick(async () => {
      const parames = {
        data: {},
        pageNo: 1,
        pageSize: this.initOptions.marks.length
      };
      getDoorAccessDeviceList(parames).then(res => {
        if (res.code === '200') {
          const data = res.data.data;
          const marks = this.initOptions.marks.map((mark, index) => {
            const currentMark = data[index] ? data[index] : data[0];
            return {
              ...mark,
              serialNumber: currentMark.serialNumber
            }
          });
          const initOptions = {
            ...this.initOptions,
            marks
          };
          this.init(initOptions);
        }
      })
    });
  },
  watch: {
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  components: {
    dialogCont,
    FormItemText
  },
  methods: {
    init (initOptions) {
      var map = initMap(initOptions);

      var view = new mapvgl.View({
        map: map
      });
      var shaperLayer = new mapvgl.ShapeLayer({
        color: 'rgb(0, 255, 255)', // 面颜色
        style: 'gradual',
        opacity: 1.0 // 透明度
      });
      var data = chongqingJson;
      var polygons = [];
      var len = data.length;
      for (var i = 0; i < len; i++) {
        var line = data[i];
        var polygon = [];
        var pt = [line[1] * 512, line[2] * 512];
        for (var j = 3; j < line.length; j += 2) {
          pt[0] += line[j] / 100 / 2;
          pt[1] += line[j + 1] / 100 / 2;
          polygon.push([pt[0], pt[1]]);
        }

        polygons.push({
          geometry: {
            type: 'Polygon',
            coordinates: [polygon]
          },
          properties: {
            height: line[0] / 2
          }
        });
      }
      view.addLayer(shaperLayer);
      shaperLayer.setData(polygons);
    },
    getDetail (info) {
      getDoorAccessDeviceDetails(info.serialNumber).then(res => {
        if (res.code === '200') {
          const formItems = this.$_setItem(this.detailDialog.formItems, res.data);
          this.detailDialog.closeupPic = res.data.closeupPic;
          this.$set(this.detailDialog, 'formItems', formItems);
          this.detailDialog.show = true;
        }
      });
    },
    detailDialogCancel () {
      this.detailDialog.show = false;
      const formItems = this.detailDialog.formItems.map(formItems => {
        return {
          ...formItems,
          value: ''
        }
      });
      this.detailDialog.formItems = formItems;
      this.detailDialog.closeupPic = undefined;
    },
    detailDialogSubmit () {

    }
  }
};
</script>

<style lang="less" scoped>
#entranceMapBody{
  position: relative;
  width: 100%;
  height: 100%;
  .infoBody{
    position: absolute;
    left: 3%;
    right: 3%;
    top: 0%;
    bottom: 3%;
    z-index: 1;
  }
}
.entranceMapBodyDialog{
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  .videoContainer{
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    height: 100%;
    .el-image{
      width: 100%;
      height: 100%;
      background: rgba(245, 247, 250, 0.5);
      /deep/.image-error{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;/*no*/
        color: #fff;
        vertical-align: middle;
      }
    }
  }
}
</style>
