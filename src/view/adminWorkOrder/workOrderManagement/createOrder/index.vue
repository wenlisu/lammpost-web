<template>
  <div class="new-order">
    <card>
      <FormItem
        ref="newOrder"
        :formItems="orderItems"
        :isEdit="isEdit"
        :form="orderForm"
        :midway="midway"
      >
        <template slot="handlePics">
          <uploadFile
            type="img"
            uploadUrl="/api/fileupload/upload"
            @change="val => changeUploadFile(val)"
            :parames="{
              service_table: 'led_policy',
              serviceCode: `${serviceCode}1`
            }"
            >
            <template v-slot:content>
              <div class="flexCloumn flexCenter resource_img">
                <div class="upload_img">
                  上传图片
                  <i class="el-icon-top"></i>
                </div>
                <!-- <p class="limit">最多上传5张图片</p> -->
              </div>
            </template>
          </uploadFile>
        </template>
      </FormItem>
      <div class="button">
        <el-button class="reset-btn" @click="handleResetForm">
          取消
        </el-button>
        <el-button
          class="submit-btn"
          type="primary"
          :disabled="$_loading"
          @click="submit"
        >
          确定
        </el-button>
      </div>
    </card>
  </div>
</template>

<script>
import FormItem from '@/components/adminFormItem';
import card from 'view/lightPole/lightPoleStatistical/components/card';
import uploadFile from '@/components/upload/uploadFile';
import moment from 'moment';
import {
  editWorkOrder,
  getWorkOrderGroupUser,
  getWorkOrderLevel,
  getWorkOrderType
 } from 'api/order'
// import { delete } from 'vue/types/umd';
export default {
  components: {
    FormItem,
    card,
    uploadFile
  },
  data() {
    return {
      handlePics: [],
      params: {},
      orderItems: [
        {
          label: '工单标题',
          prop: 'orderTitle',
          inputType: 'input',
          required: true,
          span:24
        },{
          label: '工单类型',
          prop: 'orderType',
          inputType: 'select',
          required: true,
          span:12,
          options: []
        },{
          label: '工单级别',
          prop: 'orderLevel',
          inputType: 'select',
          required: true,
          span:12,
          options: []
        },{
          label: '报障人',
          prop: 'orderCreateUser',
          inputType: 'input',
          required: true,
          span:12
        },{
          label: '联系电话',
          prop: 'mobilePhone',
          inputType: 'input',
          required: true,
          span:12
        },{
          label: '位置',
          prop: 'faultPosition',
          inputType: 'input',
          required: true,
          span:12
        },{
          label: '报障时间',
          prop: 'orderCreateTime',
          inputType: 'datetimePicker',
          required: true,
          span:12
        },{
          label: '报障描述',
          prop: 'faultDesc',
          inputType: 'textarea',
          required: true,
          span:12
        },{
          label: '派单描述',
          prop: 'orderSendDesc',
          inputType: 'textarea',
          required: true,
          span:12
        },
        {
          label: '相关图片',
          prop: 'handlePics',
          inputType: 'custom',
          required: true,
          span:24
        },
        {
          label: '处理人',
          prop: 'handleUser',
          inputType: 'selectTree',
          required: true,
          span: 24,
          options: [],
          value: 'node',
          normalizer: (node) => { return this.formatterNode(node)}
        },
//         {
//           label: '要求完成时间',
//           prop: 'acceptPointOfTime',
//           inputType: 'datetimePicker',
//           required: true,
//           span:12
//         },
      ],
      orderForm: {
        handlePics: [],
        faultDesc: '',
        orderCreateTime: '',
        faultPosition: '',
        // orderNo: Math.random().toString(10).substr(2),
        
      },
      isEdit: true,
      midway: true,
      serviceCode: ''
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.serviceCode = moment().format('YYYYMMDDHHmmss');
    });
  },
  created () {
    if(this.$route.params) {
      this.params = this.$route.params
      this.orderForm.faultDesc = this.params.alarmContent,
      this.orderForm.orderCreateTime = this.params.alarmTime
      this.orderForm.faultPosition = this.params.address
    }
    this._getWorkOrderType()
    this._getWorkOrderLevel()
    this._getWorkOrderGroupUser()
  },
  methods: {
    async submit() {
      let formData = await this.$refs.newOrder.getValue();
      const params = {
        alarmNo: this.params.alarmNo,
        handleUser: formData.handleUser.userName,
        handleUserName: formData.handleUser.userRealName,
        ...formData
      }
      delete params.handleUser
      editWorkOrder(params).then(res => {
        if(res.code == '200') {
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            position: 'bottom-right'
          });
          this.$router.push({
            name: 'alarmManage'
          })
        }
      })
    },
    handleResetForm () {
      this.$_resetForm();
      this.$router.push({
        name: 'alarmManage'
      });
    },
    // 获取指派人
    _getWorkOrderGroupUser () {
      getWorkOrderGroupUser().then(res => {
        if(res.code == '200') {
          this.orderItems[10].options = res.data.map(item => {
            return {
              userRealName: item.groupName,
              userName: item.groupCode,
              groupUserDtoList: item.groupUserDtoList
            }
          })
        }
      }) 
    },
    // 图片上传
    async changeUploadFile(val) {
      this.orderForm.handlePics = val.map(item => {
        return item.url
      })
      // let pic = val.map(item => {
      //   return item.url
      // })
      // formData['handlePics'] = [...pic]
      // console.log(formData)
    },
    // treeselect 自定义键名
    formatterNode (node) {
      return {
        id: node.userName, // 键名转换，默认是label和children进行树状渲染
        label: node.userRealName,
        children: node.groupUserDtoList,
      }
    },
    // 工单类型
    _getWorkOrderType() {
      getWorkOrderType().then(res => {
        if(res.code == '200') {
          this.orderItems[1].options = res.data.map((item,index) => {
            return {
              name: item.value,
              id: index
            }
          })
        }
      })
    },
    // 工单级别
    _getWorkOrderLevel() {
      getWorkOrderLevel().then(res => {
        if(res.code == '200') {
          this.orderItems[2].options = res.data.map((item,index) => {
            return {
              name: item.value,
              id: index
            }
          })
        }
      })
    },
  }
}
</script>

<style lang="less">
.new-order {
  background: #fff;
  .button {
    text-align: center;
    margin-top: 20px;
  }
  .reset-btn {
    border: 1px solid rgba(37, 115, 241, 1);
    margin-right: 20px;
  }
  .submit-btn {
    background: rgba(37, 115, 241, 1);
  }
  .upload_img {
    margin: 0 auto;
    width: 113px;/*no*/
    height: 28px;/*no*/
    line-height: 28px;/*no*/
    padding-right:10px;/*no*/
    text-align: center;
    background: linear-gradient(135deg, #E9F3FF 0%, #E6F6FF 100%);
    border: 1px solid rgb(50, 109, 172);/*no*/
    border-radius: 50px;/*no*/
    font-size: 12px;/*no*/
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #2A60CD;
    position: relative;
    .el-icon-top {
      position: absolute;
      right: 19px;/*no*/
      top: 50%;
      transform: translateY(-50%);
      font-size: 14px;/*no*/
      color: #2A60CD;
      font-weight: bold;
    }
  }
}
</style>