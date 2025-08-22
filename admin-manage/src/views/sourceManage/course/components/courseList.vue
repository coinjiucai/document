<template>
  <div class="component-courseList full-block flex-column">
    <div class="list flex1 h0 scroll-y">
      <template v-if="list.length">
        <div class="item flex-row" v-for="(item, index) in list" :key="index">
          <el-checkbox
            class="checkbox"
            v-model="item.check"
            :disabled="item.courseState == 2"
            @change="changeCheck(item)"
          ></el-checkbox>

          <div class="img-warp">
            <img
              class="full-block"
              :src="getFullUrl(item.logo)"
              alt=""
              style="object-fit: cover"
            />
          </div>
          <div class="content-wrap flex1 w0">
            <div class="title-wrap flex-row align-center">
              <div class="title nowrap">{{ item.courseName }}</div>
              <div
                :class="`tag-wrap flex-center ${getStatusClass(
                  item.courseState
                )}`"
                v-if="getStatus(item.courseState)"
              >
                <span>{{ getStatus(item.courseState) }}</span>
              </div>
            </div>
            <div class="desc">{{ item.introduction }}</div>
            <div class="date-wrap">
              分类：{{ item.classifyName }}|有效时间：{{ getTime(item) }}
            </div>
            <div class="difficulty-wrap flex-row align-center">
              <div class="txt">难度</div>
              <el-rate disabled :max="3" :value="item.courseLevel"></el-rate>
            </div>
            <div class="op-wrap flex-row align-center">
              <div
                class="txt pointer"
                @click="openAddCourse(item)"
                v-if="!readOnly"
              >
                编辑
              </div>
              <div class="txt del pointer" @click="handleDel(item.id)">
                删除
              </div>
            </div>
          </div>
        </div>
      </template>
      <div class="full-block flex-center" v-else>
        <el-empty></el-empty>
      </div>
    </div>
    <div class="flex-row justify-end" v-if="list.length">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.pageNo"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        :page-size="pageInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { courseStatus } from '@/com/global_data';
import Browser from '@/utils/browser';
export default {
  name: 'component-courseList',
  props: {
    pageInfo: {
      type: Object,
      default: () => ({
        classifyId: '',
        courseName: '',
        courseState: '',
        pageNo: 1,
        pageSize: 10
      })
    },
    list: {
      type: Array,
      default: () => []
    },
    total: {
      type: Number,
      default: 0
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    getTime() {
      return (val) => {
        if (val) {
          if (val.courseType == 1) {
            return '永久';
          } else if (val.courseType == 2) {
            return `${val.startTime || ''}至${val.endTime || ''}`;
          } else {
            return '暂无';
          }
        }
      };
    },
    getStatus() {
      return (val) => {
        let tg = this.courseStatus.find((el) => el.value == val);

        return tg?.label || '';
      };
    },
    getStatusClass() {
      return (val) => {
        if (val == 0) {
          return 'wks';
        } else if (val == 1) {
          return 'jxz';
        } else if (val == 2) {
          return 'ywc';
        }
      };
    }
  },
  data() {
    return {
      courseStatus,
      isChecked: true
    };
  },
  methods: {
    getFullUrl(val) {
      return Browser.getFullUrl(val);
    },
    handleSizeChange(val) {
      this.$emit('handleSizeChange', val);
    },
    handleCurrentChange(val) {
      this.$emit('handleCurrentChange', val);
    },
    handleDel(ids) {
      this.$emit('handleDel', ids);
    },
    openAddCourse(val) {
      this.$emit('openAddCourse', val.id);
    },
    changeCheck(item) {
      const selectLimit = this.$attrs.selectLimit;
      if (selectLimit == 1) {
        this.list.forEach((el) => {
          el.check = false;
        });
        item.check = true;
      }
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.component-courseList {
  .list {
    margin-bottom: 20px;
    .item {
      padding: 26px 20px 26px 58px;
      position: relative;
      background: rgba(41, 130, 103, 0.1);
      // border-top: 1px solid #ffffff;
      .checkbox {
        position: absolute;
        top: 50%;
        left: 20px;
        transform: translateY(-50%);
      }
      .img-warp {
        width: 232px;
        height: 136px;
        flex: 0 0 232px;
        margin-right: 24px;
      }
      .content-wrap {
        .title-wrap {
          margin-bottom: 10px;
          max-width: calc(100% - 145px);
          .title {
            color: #ffffff;
            font-size: 20px;
            line-height: 1;
            width: calc(100% - 60px);
          }
          .tag-wrap {
            width: 60px;
            height: 22px;
            color: #fff;
            font-size: 16px;
            line-height: 1;
            margin-left: 8px;
            &.wks {
              background: #3b92d3;
            }
            &.jxz {
              background: #01cfa1;
            }
            &.ywc {
              background: #e6a23c;
            }
          }
        }
        .desc {
          height: 49px;
          font-size: 18px;
          line-height: 24px;
          color: #ffffff;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 12px;
        }
        .date-wrap {
          color: rgba(255, 255, 255, 0.5);
          font-size: 18px;
        }
        .difficulty-wrap {
          position: absolute;
          top: 26px;
          right: 20px;
          .txt {
            margin-right: 10px;
          }
        }
        .op-wrap {
          position: absolute;
          right: 20px;
          bottom: 26px;
          .txt {
            color: #29aa76;
            font-size: 18px;
          }
          .del {
            color: #de3f3f;
          }
          .txt + .txt {
            margin-left: 34px;
          }
        }
      }
    }
    .item + .item {
      margin-top: 20px;
    }
  }
}
</style>
