<template>
  <div id="personnel-manage">
    <header-title title="人员管理">
      <search-form
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
        @onChange="onChange"
        :addBtnVisible="true || $_hasOperation($options.name,'add')"
        :delBtnVisible="false"
        @on-addBtn="addPerson"
      />
    </header-title>
          <!-- 表格 -->
    <div class="content-view">
      <div class="Modeltable">
        <page-table
          ref="pageTable"
          col-align="center"
          operator-width="110"
          operator
          :selection="true"
          :data="tableData"
          :cols="tableCols"
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
          highlightCurrentRow
          @current-change="onCurrentChange"
          @size-change="onPageSizeChange"
          @selection-change="onSelectionChange"
          @onSelect="select"
          @selectAll="selectAll"
          @row-current-change="onRowCurrentChange"
        >
          <template
            slot-scope="scope"
            slot="operator"
          >
          <flex>
            <el-button
              type="text"
              size="small"
              title="修改"
              :style="{marginRight: '10px'}"
              @click.prevent.stop="handleEdite({
                ...scope.row
              })"
              v-if="true || $_hasOperation($options.name,'edit')">
              <i class="iconfont icon-bianji" style="fontSize: 20px; color: #2573f1"/>
            </el-button>
            <el-button
              type="text"
              size="small"
              title="详情"
              :style="{marginRight: '10px'}"
              @click.prevent.stop="viewDetail({
                ...scope.row
              })"
              v-if="false || $_hasOperation($options.name,'detail')">
              <i class="iconfont icon-xiangqing" style="fontSize: 20px; color: #2573f1"/>
            </el-button>
            <el-button
              type="text"
              size="small"
              title="删除"
              @click.prevent.stop="handleDelete({
                ...scope.row
              })"
              v-if="true || ($_hasOperation($options.name,'edit'))">
              <i class="iconfont icon-shanchu" style="fontSize: 20px; color: #FF5736"/>
            </el-button>
          </flex>
          </template>
        </page-table>
      </div>
    </div>
    <!-- 新增人员 -->
    <dialog-cont
      @on-cancel="cancelNext"
      @on-confirm="confirmNext"
      :visible.sync="add.show"
      width="50%"
      :title="add.title"
      append-to-body
    >
      <FormItem
        ref="assign"
        :formItems="add.formItems"
        :form="add.form"
        :key="Math.random()"
      >
        <template v-slot:handleUser>
          <div class="flexRow selectProduct" @click="selectPerson()">
            <span>{{add.form.realName}}</span>
            <el-button type="text"><i class="el-icon-plus"/>选择</el-button>
          </div>
        </template>
      </FormItem>
    </dialog-cont>
    <!-- 人员选择 -->
    <dialog-cont
      @on-cancel="cancelSelect"
      @on-confirm="confirmSelect"
      :visible.sync="selecttion.show"
      width="80%"
      :title="selecttion.title"
      append-to-body
    >
      <selectTable @selection="getPersonInfo"/>
    </dialog-cont>
  </div>
</template>

<script>
import card from 'view/lightPole/lightPoleStatistical/components/card';
import searchForm from 'components/adminSearchForm/searchForm';
import PageTable from '@/components/adminPage-table';
import headerTitle from 'components/adminHeaderTitle/headerTitle';
import FormItem from '@/components/adminFormItem';
import dialogCont from '@/components/adminDialog';
import selectTable from './selectTable'
import Flex from '@/components/flex';
import {
  editWorkOrderGroup,
  deleteWorkOrderGroup,
  getWorkOrderGroupUser,
  getWorkOrderGroupUserForPage
} from 'api/order'
export default {
  components: {
    selectTable,
    card,
    searchForm,
    PageTable,
    headerTitle,
    FormItem,
    dialogCont,
    Flex
  },
  data() {
    return {
      selecttion: {
        show: false,
        title: '选择人员'
      },
      add: {
        title: '新增维护人员',
        show: false,
        formItems: [
          {
            label: '维护人员姓名',
            prop: 'handleUser',
            inputType: 'custom',
            required: true,
            span:24,
          },{
            label: '联系电话',
            prop: 'mobile',
            inputType: 'input',
            required: true,
            span:24,
          },{
            label: '职务',
            prop: 'group',
            inputType: 'select',
            required: true,
            obj: true,
            span: 24,
            options: []
          }
        ],
        form: {
          handleUser: '',
          mobile: ''
        }
      },
      page: {
        current: 1,
        total: null,
        pageSize: null
      },
      tableData: [],
      tableCols: [
        {
          label: '人员姓名',
          prop: 'userRealName'
        },{
          label: '性别',
          prop: 'orderTitle'
        },{
          label: '联系电话',
          prop: 'mobilePhone'
        },{
          label: '职务',
          prop: 'groupName'
        }
      ],
      searchItems: [{
          type: 'input',
          label: '人员姓名',
          props: {
            fieldName: 'userRealName'
          }
        },{
          type: 'select',
          label: '职务',
          obj: true,
          props: {
            fieldName: 'group',
            options: []
          },
          initValue: {
            id: '-1',
            name: '所有职务'
          }
        }
      ],
      selectsList: []
    }
  },
  created() {
    this._getWorkOrderGroupUser()
    this.onCurrentChange(1)
  },
  methods: {
    cancelSelect () {
      this.selecttion.show = false
    },
    confirmSelect () {
      this.selecttion.show = false
    },
    getPersonInfo (val) {
      this.add.form['mobile'] = val.mobile ? val.mobile : ''
      this.add.form['handleUser'] = val.username ? val.username : ''
      this.add.form['realName'] = val.realName ? val.realName : ''
    },
    selectPerson () {
      this.selecttion.show = true
    },
    handleEdite(row) {
      this.add.title = '编辑维护人员'
      this.add.form = {
        handleUser: row.userName,
        mobile: row.mobilePhone,
        group: {
          name: row.groupName,
          id: row.groupCode
        }
      }
      this.add.show = true
    },
    // 删除人员
    handleDelete(row) {
      const params = {
        groupCode: row.groupCode,
        userName: [row.userName]
      }
      deleteWorkOrderGroup(params).then(res => {
        if(res.code == '200') {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            position: 'bottom-right'
          });
          this.onCurrentChange(1)
        }
      })
    },
    // 获取职务
    _getWorkOrderGroupUser () {
      getWorkOrderGroupUser().then(res => {
        if(res.code == '200') {
          this.searchItems[1].props.options = res.data.map(item => {
            return {
              name: item.groupName,
              id: item.groupCode
            }
          })
          this.add.formItems[2].options = this.searchItems[1].props.options
        }
      }) 
    },
    cancelNext () {
      this.add.show = false
      this.add.form = {}
    },
    async confirmNext () {
      const data = await this.$refs.assign.getValue()
      const params = {
        groupCode: data.group.id,
        userName: [data.handleUser]
      }
      this._editWorkOrderGroup(params)
      
    },
    _editWorkOrderGroup (params) {
      editWorkOrderGroup(params).then(res => {
        if(res.code == '200') {
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            position: 'bottom-right'
          });
          this.onCurrentChange(1)
          this.add.show = false
          this.add.form = {
            handleUser: '',
            mobile: ''
          }
        }
      })
    },
    addPerson () {
      this.add.show = true
    },
    onSearch (val) {
      this.searchVal = {
        ...val,
        groupName: val.group.name,
        groupCode: val.group.id
      };
      delete this.searchVal.group
      this.onCurrentChange(1);
    },
    onCurrentChange (val) {
      this.page.current = val;
      this.getDataAllList()
    },
    onChange () {},
    getDataAllList () {
      let data = {
        data: {
          ...this.searchVal
        },
        pageNo: Number(this.page.current), // 查询的分页页码
        pageSize: Number(this.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: ''
      }
      getWorkOrderGroupUserForPage(data).then(res => {
        if (res.code === '200') {
          const {
            data,
            total
          } = res.data;
          this.page.total = total;
          this.tableData = data;
          console.log('data', this.tableData)
        }
      })
    },
    onPageSizeChange (val) {
      this.page.pageSize = val
      this.onCurrentChange(1)
    },
    select(obj) {
      if (obj.selection.length > 1) {
        let del_row = obj.selection.shift()
        this.selectsList = obj.selection
        this.$refs.pageTable.$refs.pageTable.toggleRowSelection(del_row, false)
      } else {
        this.selectsList = obj.selection
      }
    },
    selectAll(selection){
      if (selection.length > 1) {
        selection.length = 1
      }
      this.selectsList = obj.selection
    },
    onRowCurrentChange () {},
    onSelectionChange () {}
  }
}
</script>

<style lang="less">
#personnel-manage {
}
.selectProduct{
    position: relative;
    height: 30px;/*no*/
    padding:0 46px 0 10px;/*no*/
    border-radius:4px;/*no*/
    border:1px solid #d9d9d9;/*no*/
    align-items: center;
    justify-content: space-between;
    font-size:12px;/*no*/
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(98,98,98,1);
    span{
      width: 100%;
      overflow: hidden;
      word-break: keep-all;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    button{
      font-size:12px;/*no*/
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(38,90,202,1);
      padding: 0;
      height: 100%;
      display: flex;
      align-items: center;
      position: absolute;
      top: 0;
      right: 10px;/*no*/
      i{
        font-size: 10px;/*no*/
        color: #265ACA;
      }
    }
  }
</style>