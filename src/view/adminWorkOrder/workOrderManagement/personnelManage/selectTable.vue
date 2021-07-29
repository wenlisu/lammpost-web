<template>
  <div class="container">
    <header-title>
      <search-form
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
        />
    </header-title>

    <page-table
      :data="tableData"
      :cols="tableCols"
      col-align="left"
      highlightCurrentRow=true
      :page-current="page.current"
      :total="page.total"
      :page-size="page.pageSize"
      @current-change="onCurrentChange"
      @size-change="onPageSizeChange"
      @row-current-change="handleCurrentChange"
    >
    </page-table>
  </div>
</template>

<script>
import Flex from '@/components/flex';
import PageTable from '@/components/adminPage-table';
import dialogCont from '@/components/adminDialog';
import headerTitle from '@/components/adminHeaderTitle/headerTitle';
import searchForm from '@/components/adminSearchForm/searchForm';
import { 
  userList, 
  resetPassword, 
  cancelUser, 
  enableUser, 
  listRolesByUsername, 
  addUserRoles, 
  deleteRole,
  disableRole 
  } from '@/api';

export default {
  name: 'user_management',
  components: {
    PageTable,
    dialogCont,
    Flex,
    headerTitle,
    searchForm,
  },
  data () {
    return {
      tableCols: [
        { label: '用户名称', prop: 'username' },
        { label: '真实姓名', prop: 'realName' },
        { label: '性别', prop: 'sexText', minWidth: '50px' },
        { label: '邮箱', prop: 'email' },
        { label: '手机号', prop: 'mobile', minWidth: '150px' }
      ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],

      searchVal: {
        username: '',
        realName: '',
        sex: ''
      },
      searchItems: [
        {
          type: 'input',
          label: '用户姓名：',
          props: {
            placeholder: '请输入用户姓名',
            fieldName: 'username'
          }
        },
        {
          type: 'input',
          label: '真实姓名：',
          props: {
            placeholder: '请输入真实姓名',
            fieldName: 'realName'
          }
        },
        {
          type: 'select',
          label: '性别：',
          labelWidth: '45px',
          props: {
            fieldName: 'sex',
            placeholder: '性别选择',
            options: [
              // { name: '全部', id: '' },
              { name: '男', id: 1 },
              { name: '女', id: 0 }
            ]
          }
        }
      ],
      editShow: false,
      editData: {},
      dialog: {
        // view: false, // 添加用户
        // title: "添加用户", // 弹窗标题
        // stateType: "add", // 弹窗的模式
        getUserInfo: {}, // (添加/修改/查看)当前窗口打开的用户行
        // remove: false, // 删除提示窗口
        userRole: false, // 配置用户角色弹窗
        delRole: false // 删除角色
      }
    };
  },
  methods: {
    handleCurrentChange (val) {
        this.$emit('selection', val)
    },
    openDialog (type, id) {
      this.editShow = !this.editShow;
      if (type) {
        this.editData = { id: id, type: 'edit' };
      } else {
        this.editData = {};
      }
    },
    onSearch (val) {
      this.searchVal = {
        username: val.username ? val.username : '',
        realName: val.realName ? val.realName : '',
        sex: val.sex ? val.sex : ''
      };
      this.handleSearch();
    },
    getList () {
      const param = {
        data: this.searchVal,
        pageNo: this.page.current,
        pageSize: this.page.pageSize
      };
      userList(param).then(res => {
        const { data, total } = res.data;
        this.page.total = total;
        this.tableData = data;
      });
    },
    // 点击删除
    handleAction (row) {
      this.dialog.delRole = true;
      this.dialog.getUserInfo = {
        id: row.id,
        index: row.$index,
        row: row
      };
    },
    // 删除用户
    removeSure () {
      let { id } = this.dialog.getUserInfo.row;
      deleteRole({ id }).then(res => {
        if (res.code === '200') {
          this.getList();
          this.$notify({
            type: 'success',
            title: '成功',
            message: '角色删除成功',
            position: 'bottom-right'
          });
          this.dialog.delRole = false;
        }
      });
    },
    // 重置用户密码
    resetPW (username) {
      resetPassword(username).then(res => {
        if (res.code === '200') {
          this.$notify({
            type: 'success',
            title: '成功',
            message: '重置密码成功',
            position: 'bottom-right'
          });
        }
      });
    },
    // 禁用
    off (row) {
      console.log(row)
      let { username } = row;
      if(row.enabled) {
        enableUser(username, 0).then(res => {
          if (res.code === '200') {
              this.$notify({
                type: 'success',
                title: '成功',
                message: '用户已禁用',
                position: 'bottom-right'
              });
              this.getList();
            }
        })
      }
    },
    // 禁用启用
    enabledUser (row) {
      let username = row.username;
      if (!row.enabled) {
        enableUser(username, 1).then(res => {
          if (res.code === '200') {
            this.$notify({
              type: 'success',
              title: '成功',
              message: '用户启用成功',
              position: 'bottom-right'
            });
            this.getList();
          }
        });
      }
    },
    // 配置用户角色
    setRole (info) {
      listRolesByUsername(info.row.username).then(res => {
        if (res.code === '200') {
          const list = Object.assign({}, { userRoleList: res.data }, info);
          this.dialog.userRole = true;
          this.dialog.getUserInfo = list;
        }
      });
    },
    // 配置用户角色 弹窗按确定
    subFromUserRole () {
      if (this.dialog.userRole && this.$refs.userRole) {
        let userFrom = this.$refs.userRole;
        userFrom.subUserRole();
      }
    },
    // 得到用户配置角色的数据
    getUserRoleList (role) {
      const { username, rolesList } = role;
      addUserRoles({ rolesList, username }).then(res => {
        if (res.code === '200') {
          this.dialog.userRole = false;
          this.$notify({
            title: '成功',
            message: '配置用户角色成功',
            type: 'success',
            position: 'bottom-right'
          });
        }
      });
    },
    onConfirm () {},
    onCurrentChange (val) {
      this.page.current = val;
      this.getList();
    },
    onPageSizeChange (val) {
      this.page.pageSize = val;
      this.onCurrentChange(1);
    },
    handleSearch () {
      this.editShow = false;
      this.onCurrentChange(1);
    }
  },
  created () {
    this.getList();
  }
};
</script>

<style lang="less" scoped>
// .container {
//   padding: 20px !important;
// }
</style>
