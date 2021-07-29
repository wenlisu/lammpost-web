<template>
  <div id="warmingNotice">
    <div class="searchBox">
      <search-form
        :searchItems="searchItems"
        :otherBtnVisible="false"
        @onSearch="onSearch"
      />
    </div>

    <div class="content-view">
      <div class="Modeltable">
        <page-table
          col-align="center"
          operator-width="150"
          :data="tableData"
          :cols="tableCols"
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
          @current-change="onCurrentChange"
          @size-change="onPageSizeChange"
          @selection-change="onSelectionChange"
        >
        </page-table>
      </div>
    </div>
  </div>
</template>

<script>
import searchForm from "components/adminSearchForm/searchForm";
import PageTable from "@/components/adminPage-table";
import FormItem from "@/components/adminFormItem";
import { queryWifiWarn } from "api/wifi";
export default {
  name: "devInfo",
  components: {
    searchForm,
    PageTable,
    FormItem,
  },
  data() {
    return {
      searchVal: {},
      // 分页
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      tableData: [
        {
          alarmTime: "2021/6/18 21:54:05",
          alarmType: "设备上线",
          content: "设备[AP-1](34-F7-16-0A-B0-1C)已上线。上次离线原因：设备重启",
        },
      ],
      tableCols: [
        {
          label: "告警时间",
          prop: "alarmTime",
        },
        {
          label: "告警类型",
          prop: "alarmName",
        },
        {
          label: "告警内容",
          prop: "alarmContent",
        },
      ],
      searchItems: [
        {
          type: "dataPicker",
          label: "告警事件",
          props: {
            fieldName: "alarmTimes"
          },
        },
      ],
    };
  },
  created() {
    this.getDataAllList()
  },
  methods: {
    // 查询
    onSearch(val) {
      this.searchVal = {
        ...val,
      };
      this.onCurrentChange(1);
    },
    // 获取所有/查询数据列表
    getDataAllList() {
      let data = {
        data: {
          startTime: this.searchVal.alarmTimes ? this.searchVal.alarmTimes[0] : "",
          endTime: this.searchVal.alarmTimes ? this.searchVal.alarmTimes[1] : "",
        },
        pageNo: Number(this.page.current), // 查询的分页页码
        pageSize: Number(this.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: "",
      };
      queryWifiWarn(data).then((res) => {
        if (res.code === "200") {
          const { data, total } = res.data;
          this.page.total = total;
          this.tableData = data;
        }
      });
    },
    // 分页切换页面
    onCurrentChange(val) {
      this.page.current = val;
      this.getDataAllList();
    },
    onPageSizeChange(val) {
      this.page.pageSize = val;
      this.onCurrentChange(1);
    },
    onSelectionChange() {},
  },
};
</script>

<style scoped lang="less">
#warmingNotice {
  .searchBox {
    background: #fff;
    padding: 20px;
    margin-bottom: 15px;
  }
}
</style>