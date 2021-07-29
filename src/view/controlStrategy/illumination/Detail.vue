/* eslint-disable camelcase */
<template>
  <div id='illuminationDetail' >
    <el-radio-group v-model="tabId" @change="changeTabId" :disabled="!isAdd" v-if="false">
        <el-radio-button :label="1">
            组灯控制策略
        </el-radio-button>
        <el-radio-button :label="2">
            单灯控制策略
        </el-radio-button>
    </el-radio-group>
      <div
        class="headerTitle"
      >
        <search-form
          ref="searchBox"
          :searchItems="searchItems"
          :searchBtnShow="false"
          :seniorType="false"
        >
        <div class="my-autocomplete" slot="address">
          <treeselect :value="form.imei" @input="tressSelectInput" @select="tressSelectSelect"/>
          <!-- <el-autocomplete
            ref="addressInput"
            popper-class="my-autocomplete"
            v-model="form.address"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            @select="handleSelect"
            v-if="false"
          >
            <i
              class="el-icon-edit el-input__icon"
              slot="suffix"
              @click="handleIconClick">
            </i>
            <el-select v-model="form.area" @change="handleChangeArea" slot="prepend" placeholder="请选择">
              <el-option
                v-for="item in areaOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
            <template slot-scope="{ item }">
              <span class="addr">{{ item.address }}</span>
            </template>
          </el-autocomplete> -->
        </div>
        <div slot="light" v-if="false">
          <el-select
            v-model="form.imei"
            :placeholder="`请选择灯杆`"
            clearable
            multiple
            collapse-tags
            class="filter-item"
          >
            <el-option
              v-for="optionItem in searchItems[1].props.options"
              :key="optionItem.id"
              :label="optionItem.name || optionItem.text"
              :value="optionItem.id"
            />
          </el-select>
        </div>
        </search-form>
      </div>
    <div v-if="true">
      <!-- 智慧照明 -->
      <card title="灯杆照明控制策略">
        <flex align="start" justify="start">
            <div>道路名称：{{form.address && form.address.length > 0 && form.address.join(',')}}</div>
            <div>灯杆数量：{{form.imei && form.imei.length}}个</div>
            <div>任务状态：<el-switch
                v-model="form.status"
                active-color="#2870FF"
                inactive-color="#1C376D">
                </el-switch>
            </div>
        </flex>
        <div class="flexRow singContainer">
          <div class="flexRow container">
              <el-form
                ref="formData"
                id="formItem"
                class="flexCloumn"
                :model="form"
                :label-width="'1.133333rem'"
              >
              <box
                ref="boxItems"
                v-for="(item, index) in boxList"
                :key="index"
                :type="classType[item]"
                :title="`策略${numberType.types[item]}`"
                :label="lampPolicy.types[item]"
                :status="item"
                :form="form.lampPolicyDetailDto.find(dto => dto.policyStatus === item)"
              />
              </el-form>
          </div>
          <div class="hint">
            <div class="hintTitle">灯杆示意</div>
            <div class="flexCenter hintContent">
              <img src="./images/img6.png" />
              <span class="light">
                <img
                v-for="item in singLight.lightType"
                :key="item"
                src="./images/img7.png"
                />
              </span>
            </div>
            <div class="flexRow hintInfo">
              <div>
                <span class="flexCenter">当前时间为{{common.time}}</span>
                <span class="flexCenter" v-if="singLight.currentStage" >执行{{singLight.currentStage}}</span>
              </div>
              <div class="flexCloumn flexCenter">
                <svg width="17px" height="25px" viewBox="0 0 17 25" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <title>形状结合</title>
                  <desc>Created with Sketch.</desc>
                  <defs>
                      <linearGradient x1="50%" y1="0%" x2="50%" y2="98.7410262%" id="linearGradient-1">
                          <stop :stop-color="singLight.light[0]" offset="0%"></stop>
                          <stop :stop-color="singLight.light[1]" offset="100%"></stop>
                      </linearGradient>
                  </defs>
                  <g id="控制策略" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g id="智慧照明-单灯控制策略" transform="translate(-1851.000000, -760.000000)" fill="url(#linearGradient-1)" fill-rule="nonzero">
                          <g id="balance" transform="translate(1156.000000, 299.000000)">
                              <g id="bg">
                                  <g id="编组-12" transform="translate(527.000000, 451.000000)">
                                      <g id="编组-10">
                                          <g id="编组-11" transform="translate(165.000000, 11.000000)">
                                              <path d="M11.6441604,-0.428571429 C16.0616149,-0.428571429 19.6441604,3.26442857 19.6441604,7.82142857 C19.6441604,10.8214286 16.9648876,14.0599286 15.9852513,16.8799286 C14.5277967,21.0709286 14.7350694,23.5714286 11.6441604,23.5714286 C8.59834217,23.5714286 8.75979672,21.0589286 7.30306945,16.8626786 C6.32634217,14.0486786 3.64416035,10.8446786 3.64416035,7.82142857 C3.64416035,3.26442857 7.22525126,-0.428571429 11.6441604,-0.428571429 Z M13.2739785,20.7356786 L10.1917967,21.1339286 C10.568524,21.9836786 10.9074331,22.0714286 11.6441604,22.0714286 C12.5023422,22.0714286 12.8274331,21.9761786 13.2739785,20.7356786 L13.2739785,20.7356786 Z M13.9823422,18.3949286 L9.48197854,18.9746786 L9.48852399,18.9979286 C9.62301632,19.4745242 9.76802366,19.9478971 9.92343308,20.4176786 L9.92343308,20.4176786 L13.5292513,19.9534286 C13.6099785,19.6864286 13.6950694,19.3939286 13.7903422,19.0571786 C13.8499785,18.8486786 13.9183422,18.6161786 13.9823422,18.3949286 L13.9823422,18.3949286 Z M14.4710694,16.8214286 L8.82306945,16.8214286 C8.97987757,17.2958266 9.12898929,17.7728932 9.27034217,18.2524286 L9.27034217,18.2524286 L14.2150694,17.6156786 C14.2921604,17.3606786 14.3816149,17.0906786 14.4710694,16.8214286 L14.4710694,16.8214286 Z M12.259545,3.57142857 C9.71416035,3.57142857 7.64416035,5.64142857 7.64416035,8.18681319 C7.64416035,8.3992304 7.81635853,8.57142857 8.02877574,8.57142857 C8.24119295,8.57142857 8.41339112,8.3992304 8.41339112,8.18681319 C8.41339112,6.06604396 10.1387757,4.34065934 12.259545,4.34065934 C12.4719622,4.34065934 12.6441604,4.16846117 12.6441604,3.95604396 C12.6441604,3.74362674 12.4719622,3.57142857 12.259545,3.57142857 Z" id="形状结合"></path>
                                          </g>
                                      </g>
                                  </g>
                              </g>
                          </g>
                      </g>
                  </g>
                </svg>
                {{singLight.lightText}}
              </div>
            </div>
          </div>
        </div>
      </card>
    </div>
    <div v-if="false">
      <!-- 智慧照明 -->
      <card title="灯杆照明控制策略">
        <flex align="start" justify="start">
            <div>灯带名称：{{form.address}}</div>
            <div>照明开关：<el-switch
                v-model="form.status"
                active-color="#2870FF"
                inactive-color="#1C376D">
                </el-switch>
            </div>
        </flex>
        <div class="flexRow singContainer">
          <div class="flexRow container">
            <el-form
              ref="formData"
              id="formItem"
              class="flexCloumn"
              :model="form"
              :label-width="'80px'"
            >
              <box
                  v-for="(item, index) in singBoxList"
                  :key="index"
                  :type="classType[item]"
                  :title="`策略${numberType.types[item]}`"
                  :label="lampPolicy.types[item]"
                  :status="item"
                  :form="isAdd ? form.singLampPolicyDetailDto.find(dto => dto.policyStatus === item) : form.lampPolicyDetailDto.find(dto => dto.policyStatus === item)"
              />
              </el-form>
          </div>
        <div class="flexCenter hint">
          <div class="hintTitle">灯杆示意</div>
          <div class="flexCenter hintContent">
            <img src="./images/imgLight.png" />
            <span class="light">
              <img
              v-for="item in singLight.lightType"
              :key="item"
              src="./images/img7.png"
              />
            </span>
          </div>
          <div class="flexRow hintInfo">
            <div>
              <span class="flexCenter">当前时间为{{common.time}}</span>
              <span class="flexCenter" v-if="singLight.currentStage" >执行{{singLight.currentStage}}</span>
            </div>
            <div class="flexCloumn flexCenter">
              <svg width="17px" height="25px" viewBox="0 0 17 25" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 60 (88103) - https://sketch.com -->
                <title>形状结合</title>
                <desc>Created with Sketch.</desc>
                <defs>
                    <linearGradient x1="50%" y1="0%" x2="50%" y2="98.7410262%" id="linearGradient-1">
                        <stop :stop-color="singLight.light[0]" offset="0%"></stop>
                        <stop :stop-color="singLight.light[1]" offset="100%"></stop>
                    </linearGradient>
                </defs>
                <g id="控制策略" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="智慧照明-单灯控制策略" transform="translate(-1851.000000, -760.000000)" fill="url(#linearGradient-1)" fill-rule="nonzero">
                        <g id="balance" transform="translate(1156.000000, 299.000000)">
                            <g id="bg">
                                <g id="编组-12" transform="translate(527.000000, 451.000000)">
                                    <g id="编组-10">
                                        <g id="编组-11" transform="translate(165.000000, 11.000000)">
                                            <path d="M11.6441604,-0.428571429 C16.0616149,-0.428571429 19.6441604,3.26442857 19.6441604,7.82142857 C19.6441604,10.8214286 16.9648876,14.0599286 15.9852513,16.8799286 C14.5277967,21.0709286 14.7350694,23.5714286 11.6441604,23.5714286 C8.59834217,23.5714286 8.75979672,21.0589286 7.30306945,16.8626786 C6.32634217,14.0486786 3.64416035,10.8446786 3.64416035,7.82142857 C3.64416035,3.26442857 7.22525126,-0.428571429 11.6441604,-0.428571429 Z M13.2739785,20.7356786 L10.1917967,21.1339286 C10.568524,21.9836786 10.9074331,22.0714286 11.6441604,22.0714286 C12.5023422,22.0714286 12.8274331,21.9761786 13.2739785,20.7356786 L13.2739785,20.7356786 Z M13.9823422,18.3949286 L9.48197854,18.9746786 L9.48852399,18.9979286 C9.62301632,19.4745242 9.76802366,19.9478971 9.92343308,20.4176786 L9.92343308,20.4176786 L13.5292513,19.9534286 C13.6099785,19.6864286 13.6950694,19.3939286 13.7903422,19.0571786 C13.8499785,18.8486786 13.9183422,18.6161786 13.9823422,18.3949286 L13.9823422,18.3949286 Z M14.4710694,16.8214286 L8.82306945,16.8214286 C8.97987757,17.2958266 9.12898929,17.7728932 9.27034217,18.2524286 L9.27034217,18.2524286 L14.2150694,17.6156786 C14.2921604,17.3606786 14.3816149,17.0906786 14.4710694,16.8214286 L14.4710694,16.8214286 Z M12.259545,3.57142857 C9.71416035,3.57142857 7.64416035,5.64142857 7.64416035,8.18681319 C7.64416035,8.3992304 7.81635853,8.57142857 8.02877574,8.57142857 C8.24119295,8.57142857 8.41339112,8.3992304 8.41339112,8.18681319 C8.41339112,6.06604396 10.1387757,4.34065934 12.259545,4.34065934 C12.4719622,4.34065934 12.6441604,4.16846117 12.6441604,3.95604396 C12.6441604,3.74362674 12.4719622,3.57142857 12.259545,3.57142857 Z" id="形状结合"></path>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
              </svg>
              {{singLight.lightText}}
            </div>
          </div>
        </div>
        </div>
      </card>
    </div>
          <flex className="btnList">
        <el-button
            type="text"
            size="small"
            title="取消"
            :style="{marginRight: '10px'}"
            @click.prevent.stop="handleCancel"
            >
            取消
        </el-button>
        <el-button
            type="primary"
            size="small"
            title="保存"
            @click.prevent.stop="handleSave"
            >
            保存
        </el-button>
      </flex>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex';
import moment from 'moment';
import headerTitle from 'components/adminHeaderTitle/headerTitle'
import searchForm from 'components/adminSearchForm/searchForm';
import treeselect from 'components/treeselect';
import PageTable from '@/components/adminPage-table';
import Flex from '@/components/flex';
import { GROUP_POLICY_TYPE, NUMBER_TYPE, LIGHT_TYPE } from '@/util/constants';
import box from './components/box';
import card from 'view/lightPole/lightPoleStatistical/components/card';
import {
  getPolicyDetail,
  addPolicy,
  updatePolicy,
  getAddress,
  getSingAddress
} from 'api/controlStrategy';
import {
  getGroupPolicy,
  getLamp
} from 'api/index';
const lightTypes = {
  0: {
    start: '#ccc',
    end: '#909399'
  },
  1: {
    start: '#6DDF61',
    end: '#1183F6'
  },
  2: {
    start: '#DFC661',
    end: '#F65711'
  },
  3: {
    start: '#FFB89B',
    end: '#F62411'
  }
}
export default {
  name: 'illuminationDetail',
  data () {
    return {
      lightTypes,
      isAdd: false,
      editData: {},
      searchVal: {},
      areaOptions: [],
      searchItems: [{
        type: 'custom',
        label: '灯杆',
        labelWidth: '40px',
        initValue: undefined,
        props: {
          fieldName: 'address'
        },
        isLabel: true
      }, {
        type: 'input',
        label: '策略名称',
        labelWidth: '60px',
        span: '18',
        initValue: undefined,
        props: {
          fieldName: 'groupName'
        },
        isLabel: true
      }, {
        type: 'dataPicker',
        label: '生效日期',
        labelWidth: '60px',
        initValue: [],
        props: {
          fieldName: 'date',
          startPlaceholder: '生效日期',
          endPlaceholder: '关闭日期'
        },
        isLabel: true
      }],
      tabId: 1,
      form: {
        imei: [],
        address: [],
        groupName: '',
        number: '',
        lampPolicyDetailDto: []
      },
      lightOptions: [],
      singLight: {
        lightType: new Array(0),
        light: [lightTypes[0].start, lightTypes[0].end],
        lightText: '关闭',
        currentStage: '策略一'
      },
      boxList: [1, 2, 3],
      singBoxList: [1, 2, 3],
      classType: ['blue', 'greent', 'yellow'],
      lampPolicy: this.$_useTypes(GROUP_POLICY_TYPE),
      numberType: this.$_useTypes(NUMBER_TYPE),
      lightType: this.$_useTypes(LIGHT_TYPE),
      restaurants: [],
      currentArea: '',
      editAdd: false
    }
  },
  mounted () {
    this.$nextTick(async () => {
      if (this.openPage === 'illuminationDetail') {
        getGroupPolicy().then(res => {
          if (res.code === '200') {
            this.areaOptions = res.data.map(data => {
              return {
                id: data.id,
                name: data.area
              }
            });
          }
        });
        this.editData = this.common['illuminationDetail'];
        if (this.editData && this.editData.groupNo) {
          this.isAdd = false;
          const searchGroupNo = this.editData.groupNo;
          this.getDetail(searchGroupNo);
        } else {
          this.isAdd = true;
          // this.searchItems[1].hide = false;
          this.form = {
            lampPolicyDetailDto: this.getLampPolicyList(null),
            singLampPolicyDetailDto: this.getLampPolicyList(null)
          }
          if (this.editData && this.editData.imei) {
            this.editAdd = true;
            this.form.imei = [{
              address: this.editData.address,
              addressId: this.editData.address,
              imei: this.editData.imei,
              area: this.editData.area,
              id: this.editData.imei
            }];
            this.form.address = [this.editData.address];
            this.$set(this.form, 'address', [this.editData.address]);
            this.tabId = 2;
          }
        }
      }
    })
  },
  computed: {
    ...mapGetters(['common', 'openPage'])
  },
  components: {
    headerTitle,
    searchForm,
    card,
    Flex,
    box,
    treeselect
  },
  watch: {
    'form': {
      deep: true,
      handler: function (nowVal, oldVal) {
        let dtoList = nowVal.lampPolicyDetailDto;
        if (this.editData && this.editData.id) {
          dtoList = nowVal.lampPolicyDetailDto;
        }
        this.changeSingLight(dtoList)
      }
    }
  },
  methods: {
    changeSingLight (dtoList) {
      const dto = dtoList && dtoList.filter(item => {
        const base = item.status && item.offTime && item.onTime && item.lampStatus;
        const compare = moment(this.common.time, 'HH:mm:ss');
        const start = moment(item.onTime, 'HH:mm');
        const end = moment(item.offTime, 'HH:mm');
        if (base && compare.isBetween(start, end)) {
          return item
        }
      });
      if (dto && dto.length > 0) {
        this.singLight = {
          lightType: new Array(dto[0] && dto[0].lampStatus),
          light: [lightTypes[dto[0] && dto[0].lampStatus].start, lightTypes[dto[0] && dto[0].lampStatus].end],
          lightText: `${this.lightType.types[dto[0] && dto[0].lampStatus]}`,
          currentStage: `策略${this.numberType.types[dto[0] && dto[0].policyStatus]}`
        }
      }
    },
    changeTabId (val) {
      this.tabId = val;
      // this.searchItems[1].hide = val === 2;
      if (!this.editAdd) {
        this.form = {
          ...this.form,
          imei: [],
          address: []
        };
      } else {
        if (this.tabId === 2) {
          this.form.address = [this.editData.address];
          // this.form.address = this.editData.terminalName;
        } else if (this.tabId === 1) {
          this.form.address = this.editData.address;
        }
      }
      this.form = {
        ...this.form,
        groupName: ''
      };

      this.getNumber(this.form);
    },
    getDetail (searchImei) {
      if (!searchImei) return;
      getPolicyDetail(searchImei).then(async res => {
        if (res.code === '200') {
          this.changeTabId(res.data.relatedType);
          let searchItems = [...this.searchItems];
          searchItems[1].initValue = res.data.groupName;
          searchItems[2].initValue = [res.data.workTime, res.data.closeTime];
          if (this.tabId === 2) {
            this.changeSingLight(res.data.lampPolicyDetailDto)
          }
          this.searchItems = searchItems;
          const address = [];
          this.form = {
            ...res.data,
            imei: res.data.lampAreaDtos.map(dto => {
              if (address.indexOf(dto.address) < 0) {
                address.push(dto.address);
              }
              return {
                ...dto,
                id: dto.imei
              }
            }),
            status: res.data.status === 1,
            lampPolicyDetailDto: this.getLampPolicyList(res.data.lampPolicyDetailDto)
          };
          this.form.address = address;
          // this.restaurants = await this.loadAll(this.form.area);
          // this.setLightOptions(res.data.address);
        }
      })
    },
    getLampPolicyList (lampPolicyDetailDto) {
      return [1, 2, 3].map(item => {
        /** 1:存在，2：不存在 */
        const findItem = lampPolicyDetailDto && lampPolicyDetailDto.find(dto => dto.policyStatus === item);
        if (findItem) {
          return {
            savingStatus: 1,
            lampStatus: 1,
            status: true,
            ...findItem
          }
        }
        return {
          savingStatus: 1,
          lampStatus: 1,
          status: false,
          policyStatus: item
        }
      });
    },
    handleSave () {
      const data = this.$refs.searchBox.onSearch();
      let apiMethod = updatePolicy;
      let parames = {
        // address: this.form.address,
        // area: this.form.area,
        groupName: data.groupName,
        relatedType: +this.tabId,
        status: this.form.status ? 1 : 2,
        workTime: data.date && data.date[0],
        closeTime: data.date && data.date[1],
        lampAreaDtos: this.form.imei.map(imeiItem => {
          return {
            imei: imeiItem.imei,
            area: imeiItem.area,
            address: imeiItem.address
          }
        }),
        number: this.form.imei.length
      };
      let formLampPolicyDetailDto = JSON.parse(JSON.stringify(this.form.lampPolicyDetailDto));
      if (this.isAdd) {
        apiMethod = addPolicy;
        if (this.tabId === 1) {
          // parames.imei = this.form.light;
          // parames.number = parames.imei.length;
        }
        if (this.tabId === 2) {
          formLampPolicyDetailDto = JSON.parse(JSON.stringify(this.form.singLampPolicyDetailDto));
          if (this.editAdd) {
            // parames.imei = this.editData.imei;
          }
        }
      } else {
        parames.id = this.form.id;
        // parames.imei = Array.isArray(this.form.imei) ? this.form.imei : [this.form.imei];
      }
      // console.log(parames);
      let notifyinputErr = {
        // 'area': {
        //   rule: !this.form.area,
        //   message: '选择区域'
        // },
        // 'address': {
        //   rule: !this.form.address,
        //   message: '选择道路名称'
        // },
        'groupName': {
          rule: !data.groupName,
          message: '输入策略名称'
        },
        'workTime': {
          rule: !data.date[0],
          message: '选择生效时间'
        },
        'closeTime': {
          rule: !data.date[1],
          message: '选择关闭时间'
        }
      };
      let lampPolicyDetailDtoRules = [];
      let lampPolicyDetailDto = [];
      formLampPolicyDetailDto.map(dto => {
        if (dto.status) {
          const onTimeJudge = dto.policyStatus !== 3 && !dto.onTime;
          const offTimeJudge = dto.policyStatus !== 3 && !dto.offTime;
          const lightValueJudge = dto.policyStatus === 3 && !dto.lightValue;
          lampPolicyDetailDtoRules.push(onTimeJudge);
          lampPolicyDetailDtoRules.push(offTimeJudge);
          lampPolicyDetailDtoRules.push(lightValueJudge);
          delete dto.status;
          lampPolicyDetailDto.push(dto);
        }
      }).filter(Boolean);
      lampPolicyDetailDtoRules.push(lampPolicyDetailDto.length < 1);
      notifyinputErr['lampPolicyDetailDto'] = {
        rule: lampPolicyDetailDtoRules.includes(true),
        message: '检查策略值'
      }
      const inputerrArray = this.$_notifyError(notifyinputErr)
      if (inputerrArray.length !== 0) {
        return false;
      }
      parames.policies = lampPolicyDetailDto;
      delete parames.lampPolicyDetailDto;
      delete parames.singLampPolicyDetailDto;
      apiMethod(parames).then(res => {
        if (res.code === '200') {
          this.$router.push({
            name: this.editData.toName
          });
        }
      });
    },
    handleCancel () {
      this.$router.push({
        name: this.editData.toName
      });
    },
    querySearch (queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.address.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
      };
    },
    loadAll (area, address = '') {
      let api = getSingAddress;
      let parames = {
        area,
        address
      };
      if (this.tabId === 1) {
        api = getAddress;
      }
      return api(parames).then(res => {
        if (res.code === '200') {
          let dataList = [];
          res.data.map(data => {
            dataList.push({
              ...data
            })
          });
          return dataList;
        }
      });
    },
    loadLamp (address = '') {
      let api = getLamp;
      return api(address).then(res => {
        if (res.code === '200') {
          let dataList = [];
          res.data.map(data => {
            dataList.push({
              ...data,
              id: data.imei,
              name: data.address
            })
          });
          return dataList;
        }
      });
    },
    handleSelect (item) {
      this.form.imei = item.imei;
      this.form.address = item.address;
      this.getNumber(item);
    },
    async getNumber (item) {
      if (item.area && item.address) {
        const numberItems = await this.loadAll(item.area, item.address);
        this.$set(this.form, 'number', numberItems[0].number);
        if (this.tabId === 1) {
          // this.setLightOptions(item.address);
        } else {
          // this.$set(this.form, 'imei', [numberItems[0].imei]);
        }
      }
    },
    async setLightOptions (address) {
      const lampItems = await this.loadLamp(address);
      const lampItemsInitValue = lampItems.map(item => item.id);
      this.$set(this.form, 'imei', lampItemsInitValue);
      this.$set(this.searchItems[1].props, 'options', lampItems);
      this.$set(this.searchItems[1], 'initValue', lampItemsInitValue);
    },
    handleIconClick (ev) {
      console.log(ev);
    },
    async handleChangeArea (area) {
      this.restaurants = await this.loadAll(area);
      // console.log(area, area !== this.currentArea);
      if (area !== this.currentArea) {
        // this.form.address = '';
        this.currentArea = area;
      }
    },
    tressSelectInput (value) {
      const address = [];
      const imei = value.map(val => {
        if (address.indexOf(val.addressId) < 0) {
          address.push(val.addressId);
        }
        return {
          imei: val.imei,
          id: val.imei || val.id,
          area: val.area,
          address: val.address
        }
      });
      this.form = {
        ...this.form,
        imei,
        address
      };
    },
    tressSelectSelect (val) {
      // this.form.area = val.area;
      // this.form.address = val.address;
    }
  }
}
</script>

<style lang="less" scoped>
#illuminationDetail{
  #treeselect[data-v-374ca9ac] .vue-treeselect .vue-treeselect__control {
    height: 30px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #e6ecff;
    background: #fff;
    border-radius: 4px;
    border: 0.013333rem solid #d2d6de;
  }
  .headerTitle{
    // margin-bottom: 10px;/*no*/
    // background:rgba(32,45,85, 0.49);
    background: #fff;
    border-radius:4px;
    display: flex;
    padding: 20px 20px 10px;
    position: relative;
    &::before{
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 1px;/*no*/
      background:rgba(43,126,242,1);
      border-radius:1px;/*no*/
    }
    .el-form-item.form-group:nth-child(2) #adminFormItem{
      width: 300px;
      .filter-item-input {
        max-width: unset;
      }
      .filter-item-input.el-input[style] {
        max-width: unset !important;
      }
    }
  }
    >.el-radio-group{
        display: flex;
        flex-direction: row;
        margin-bottom: 10px; /*no*/
        >label{
            height: 40px;/*no*/
            width: 120px;/*no*/
            margin-right: 10px;/*no*/
            span{
                box-sizing: border-box;
                padding: 0;
                width: 100%;
                height: 100%;
                font-size:14px;/*no*/
                font-family:PingFangSC-Regular,PingFang SC;
                font-weight:400;
                color:rgba(255,255,255,1);
                background:rgba(38,53,111,1);
                border-radius:4px;
                border: none;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                box-shadow: none;
            }
            &.is-active{
                span{
                    background:linear-gradient(318deg,rgba(29,91,250,1) 0%,rgba(29,144,250,1) 100%);
                }
            }
        }
    }
    #card{
        margin-top: 10px;/*no*/
        padding-top: 60px;
        // background: transparent;
        .c--flex{
            font-size:12px;/*no*/
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            // color:rgba(255,255,255,1);
            >div{
                margin-right: 60px;
                &:last-child{
                    margin-right: 0;
                }
                .el-switch{
                    height: 17px;/*no*/
                    line-height: 17px;/*no*/
                    >span{
                        height: 100%;
                        &::after{
                            left: 2px;
                            height: 13px;/*no*/
                            width: 13px;/*no*/
                        }
                    }
                    &.is-checked{
                        span{
                            &::after{
                                margin-left: 23px;/*no*/
                            }
                        }
                    }
                }
            }
        }
        .container{
            margin-top: 20px;/*no*/
            flex-flow: wrap;
            #box{
                margin-right: 10px;/*no*/
                width: calc(25% - 8px);/*no*/
                margin-bottom: 10px;/*no*/
                &:nth-of-type(5n) {
                    margin-right: 0;
                }
            }
        }
        .singContainer{
          margin-top: 20px;/*no*/
          .container{
            width: 60%;
            flex-flow: wrap;
            margin-right: 10px;/*no*/
            margin-top: 0;
            #box{
                margin-right: 10px;/*no*/
                width: calc(33.3% - 6.66px);/*no*/
                margin-bottom: 10px;/*no*/
                &:nth-of-type(3n) {
                    margin-right: 0;
                }
            }
          }
          .hint{
            padding: 20px;
            width: 25%;
            // background:rgba(37,45,71,1);
            // box-shadow:0px 2px 48px 1px rgba(23,27,41,0.43);/*no*/
            // border-radius:12px;
            // border:1px solid rgba(25,30,48,1);
            position: relative;
            margin-bottom: 10px;/*no*/
            display: flex;
            justify-content: flex-end;
            .hintTitle{
              position: absolute;
              bottom: 0;
              left: 180px;
              font-size:14px;
              font-family:PingFangSC-Semibold,PingFang SC;
              font-weight:600;
              color:rgba(160,172,216,1);
            }
            .hintInfo{
              width: 207px;/*no*/
              height: auto;
              background:linear-gradient(180deg,rgba(22,24,48,0.81) 0%,rgba(22,24,48,0.81) 100%);
              border-radius:4px;/*no*/
              position: absolute;
              right: -120px;
              padding: 12px 17px;
              >div{
                width: 20%;
                font-size:12px;/*no*/
                font-family:PingFangSC-Regular,PingFang SC;
                font-weight:400;
                color:rgba(230,236,255,1);
                &:first-child{
                  width: 80%;
                  border-right:1px solid #272A53;/*no*/
                  margin-right: 20px;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: space-around;
                }
                span{
                  width: 100%;
                  // height: 100%;
                  justify-content: flex-start;
                  white-space: nowrap;
                  overflow: hidden;
                }
                svg{
                  margin-bottom: 5px;
                }
              }
            }
            .hintContent{
              display: inline-block;
              position: relative;
              img{
                width: auto;
                height: 100%;
              }
              .light{
                position: absolute;
                top: 50%;
                left: 50%;
                margin-top: -129%;
                margin-left: -98%;
                display: inline-block;
                width: 114px;
                height: 130px;
                img{
                  width: 100%;
                  height: 100%;
                  position: absolute;
                  top: 0;
                  left: 0;
                }
              }
            }
          }
        }
    }
    /deep/.btnList{
        margin-top: 30px;
        justify-content: center !important;
        align-items: center !important;
        button{
            padding: 7px 25px;
            // background:rgba(21,27,46,1);
            // border-radius:4px;/*no*/
            border:1px solid rgba(52,114,255,1);
            // font-size:12px;/*no*/
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(52,114,255,1);
            &.el-button--primary{
                background:linear-gradient(318deg,rgba(29,91,250,1) 0%,rgba(29,144,250,1) 100%);
                color:rgba(230,236,255,1);
            }
        }
    }
    #formItem{
  // .comp-wrapper-header{
  //   padding: 0;
  // }
  .el-form-item {
    height: 25px !important;/*no*/
    margin-bottom: 12px;
    label{
      min-width: 85px;/*no*/
      font-size:12px;/*no*/
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      line-height: 25px;/*no*/
      // color:rgba(230,236,255,1);
      color: #000;
    }
    .el-date-editor{
      input{
        width: 100%;
      }
    }
    .el-form-item__content{
      height: 25px;/*no*/
      line-height: 25px;/*no*/
    }
    .el-input{
      width: 100% !important;
      input{
        height: 25px !important;/*no*/
      }
    }
  }
  .el-input-number{
    width: 100%;
    display: block;
    line-height: 33px;
    height: 35px;
    >span{
      height: 17.5px;
      display: flex;
      align-items: center;
      justify-content: center;
      &.el-input-number__increase{
        top: 2px;
      }
    }
    .el-input{
      input{
        text-align: left;
      }
    }
  }
  .radioGroup{
    width: 100%;
    text-align: left;
  }
}
.container{
  #formItem{
  .el-form-item, .el-form-item__content, .el-form-item__content > div{
    height: auto !important;
    min-height: 25px;
    margin-right: 10px;
  }
  }
}
.my-autocomplete {

  /deep/.el-input-group {
    height:30px;/*no*/
    .el-input-group__prepend{
      background: transparent;
      border: none;
      width: 80px;/*no*/
      height: 30px;/*no*/
      padding: 0;
      input{
        border-top-right-radius: 0 !important;
        border-bottom-right-radius: 0 !important;
      }
      .el-select{
        height: 100%;
        margin:0;
      }
    }
    input{
      font-size:12px;/*no*/
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(230,236,255,1);
      background:rgba(34,44,81,0.5);
      border-radius:4px;/*no*/
      border:1px solid rgba(98,117,191,1);
    }
    >input{
      width: 250px;/*no*/
      border-top-left-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
    }
  }
  li {
    line-height: normal;
    padding: 7px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .addr {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}
.multipleLight{
  .el-select__tags{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    span{
      display: flex;
    }
  }
  .el-input{
    input{
      width: 250px !important;/*no*/
      font-size:12px;/*no*/
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(230,236,255,1);
      background:rgba(34,44,81,0.5);
      border-radius:4px;/*no*/
      border:1px solid rgba(98,117,191,1);
    }
  }
}
}
</style>
