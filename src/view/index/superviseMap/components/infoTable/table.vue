<template>
  <div class="info-table">
    <div class="table-wrap">
      <tableHeader :header="header" :config="headerConfig" />
      <tableColumList
        :tabledata="newTableData"
        :config="columConfig"
        :allData="tableData"
      />
    </div>
  </div>
</template>

<script>
import tableHeader from './header';
import tableColumList from './columList';
import { getLocal } from 'util/tool';
export default {
  components: {
    tableHeader,
    // content,
    tableColumList
  },
  props: {
    totalNum: {
      typeof: Number,
      default: () => {
        return 0;
      }
    },
    parkName: {
      typeof: String,
      default: () => {
        return '';
      }
    },
    tableData: {
      typeof: Array,
      default: () => {
        return [];
      }
    },
    status: {
      typeof: Number,
      default: 0
    }
  },
  data () {
    return {
      header: ['名称', '数值', '报警范围', '状态'],
      headerConfig: {
        headerHeight: 30,
        headerBGC: 'rgba(43,61,116,0.36)',
        fontSize: 12,
        itemWidth: ['25%', '30%', '32%', '18%']
      },
      newTableId: [
        {
          name: '温度',
          value: 'temperatureValue',
          lowValue: 'temperatureLowThreshold',
          maxValue: 'temperatureMaxThreshold',
          verifyValue: 'temperatureAlarm',
          unit: '℃'
        },
        {
          name: '湿度',
          value: 'humidityValue',
          lowValue: 'humidityLowThreshold',
          maxValue: 'humidityMaxThreshold',
          verifyValue: 'humidityAlarm',
          unit: '%'
        },
        {
          name: '噪声',
          value: 'noiseValue',
          lowValue: 'noiseLowThreshold',
          maxValue: 'noiseMaxThreshold',
          verifyValue: 'noiseAlarm',
          unit: '分贝'
        },
        {
          name: 'PM2.5',
          value: 'pmValue',
          lowValue: 'pmLowThreshold',
          maxValue: 'pmMaxThreshold',
          verifyValue: 'pmAlarm',
          unit: 'ug/m³'
        },
        {
          name: 'PM10',
          value: 'pmTenValue',
          lowValue: 'pmTenLowThreshold',
          maxValue: 'pmTenMaxThreshold',
          verifyValue: 'pmTenAlarm',
          unit: 'ug/m³'
        }
      ],
      newTableData: [],
      columConfig: {
        fontSize: 12,
        rowHeight: 30,
        oddRowBGC: 'rgba(51,69,124,0.58)', // 奇书行颜色
        evenRowBGC: 'rgba(32,49,102,0.58)', // 偶数行颜色
        columnWidth: ['25%', '30%', '32%', '18%']
      }
    };
  },
  watch: {
    tableData: {
      immediate: true,
      deep: true,
      handler (newValue, oldValue) {
        if (newValue !== oldValue) {
          this.getData(newValue);
        }
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getData(this.tableData);
    })
  },
  methods: {
    getData (value) {
      let newTableData = [];
      this.newTableId.map((item) => {
        newTableData.push([
          item.name,
          `${value[item.value] || 0}${item.unit}`,
          `${value[item.lowValue] || 0}${item.unit}-${value[item.maxValue] || 0}${item.unit}`,
          (!value[item.verifyValue] || value[item.verifyValue] === 0) ? '<div style="color: #45FFDB; font-size:12px; text-align: center">正常</div>' : (value[item.verifyValue] === 2 ? '<div style="color: #FF5D5D; font-size:12px; text-align: center;white-space:nowrap;">超上限</div>' : '<div style="color: #FF5D5D; font-size:12px; text-align: center;white-space:nowrap;">上限预警</div>')
        ]);
      });
      this.newTableData = newTableData;
      // this.newTableData = [
      //   [
      //     "公园公厕",
      //     "广东省佛山市顺德区解放路200号",
      //     `<span style="color: #45FFDB; font-size:22px">流畅</span>`,
      //   ],
      //   [
      //     "公园公厕",
      //     "广东省佛山市顺德区解放路200号",
      //     `<span style="color: #FF5D5D; font-size:22px">拥堵</span>`,
      //   ],
      // ];
    },
    showInfo (parames) {
      this.$emit('showInfo', parames);
    }
  }
};
</script>

<style lang="less" scoped>
.info-table {
  width: 100%;
  height: 100%;

  .table-wrap {
    height: calc(100% - 65px);
    padding-top: 8px;
    /deep/.header_content li {
      color: #9FADE0;
      font-weight: 400;
    }
  }
  .status {
    display: inline-block;
    width: 36px;
    height: 17px;
    background: #14c5a0;
    border-radius: 4px;
    text-align: center;
    &.alarm {
      background: #e4582f;
    }
  }
}
</style>
