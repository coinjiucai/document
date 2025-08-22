<template>
  <div>
    <BaseDialog
      class="component-issuedDialog"
      :title="dialogTitle"
      center
      :visible.sync="visibleDialog"
      @close="handleCloseDialog"
      width="1200px"
      top="20vh"
    >
      <div class="flex-column" style="height: 550px">
        <div>
          <el-form
            inline
            ref="form" 
          >
            <el-form-item>
              <el-input
                clearable
                prefix-icon="el-icon-search"
                maxlength="20"
                v-model="searchValue" 
                placeholder="搜索"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="flex1 h0 flex-row">
          <div class="left h100p scroll-y">
            <div class="top" v-if="userList.length">
              <div 
                class="cell" 
                v-for="(v, index) in userList" 
                :key="index"
              >
                <span
                  v-if="!v.selected"
                  class="iconfont pointer"
                  style="color: #fff; font-size: 20px"
                  @click="changeSelected(v)"
                >&#xeb5e;</span>
                <span
                  v-else
                  class="iconfont pointer"
                  style="color: #fff; font-size: 20px"
                  @click="changeSelected(v)"
                >&#xe690;</span>
                <span style="margin-left: 10px">{{ v.realname }}</span>
              </div>
            </div>
            <div class="bottom">
              <div 
                class="block" 
                v-for="(item, index) in groupList" 
                :key="index"
              >
                <div 
                  :class="['block-top flex-row align-center justify-between pointer', { 'active': item.showChild }]" 
                  @click="clickGroup(item)"
                >
                  <div>{{ item.name }}</div>
                  <i class="el-icon-caret-right arrow"></i>
                </div>
                <div class="block-bottom" v-if="item.showChild && item.children.length">
                  <div 
                    class="block-cell" 
                    v-for="(it, i) in item.children" 
                    :key="i"
                  >
                    <span
                      v-if="!it.selected"
                      class="iconfont pointer"
                      style="color: #fff; font-size: 20px"
                      @click="changeGroupSelected(it)"
                    >&#xeb5e;</span>
                    <span
                      v-else
                      class="iconfont pointer"
                      style="color: #fff; font-size: 20px"
                      @click="changeGroupSelected(it)"
                      >&#xe690;</span>
                    <span style="margin-left: 10px">{{ it.userName }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="right h100p flex1 scroll-y">
            <el-tag
              class="mr10"
              v-for="tag in selectedList"
              :key="tag.id"
              closable
              type=""
              @close="closeTag(tag)"
            >
              {{tag.realname || tag.userName}}
            </el-tag>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button 
          type="primary" 
          :loading="saveLoading" 
          @click="handleSave"
        >确定</el-button>
        <el-button 
          type="info" 
          @click="handleCloseDialog"
        >取消</el-button>
      </div>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from "@/components/Base/BaseDialog";

export default {
  name: 'issuedDialog',
  components: { BaseDialog },
  data() {
    return {
      dialogTitle: '下发人员',
      visibleDialog: false,
      saveLoading: false,
      searchValue: '',
      userList: [],
      selectedList: [],
      groupList: [],
      currRecord: {},
    }
  },
  methods: {
    getGrounpList() {
      this.$api.basics.sysgroupPage({ pageNo: 1, pageSize: 9999, name: this.searchValue }).then(res => {
        let groupList = res?.result?.records || [];

        groupList.forEach(el => {
          el.children = [];
          el.showChild = false;
        });

        this.groupList = groupList;
      })
    },
    getGrouper(groupId) {
      return new Promise((resolve, reject) => {
        this.$api.basics.sysgroupuserList({ groupId }).then(res => {
          let list = res?.result || [];
          let selectedIds = this.selectedList.map(el => el.id);

          list.forEach(el => {
            el.id = el.userId;
            if (selectedIds.indexOf(el.id) > -1) {
              el.selected = true;
            } else {
              el.selected = false;
            }
          })
          resolve(list)
        }).catch(() => {
          resolve([]);
        })
      })
    },
    getUserList() {
      this.$api.basics.userList({ realname: this.searchValue, pageNumber: 1, pageSize: 99999 }).then(res => {
        let userList = res?.result?.records || [];
        let selectedIds = this.selectedList.map(el => el.id);

        userList.forEach(el => {
          
          if (selectedIds.indexOf(el.id) > -1) {
            el.selected = true;
          } else {
            el.selected = false;
          }
        });

        this.userList = userList;
      })
    },
    async clickGroup(val) {
      let id = val.id;
      let index = this.groupList.findIndex(el => el.id == id);
      this.groupList[index].showChild = !this.groupList[index].showChild;

      if (this.groupList[index].showChild) {
        if (!val.children.length) {
          let children = await this.getGrouper(id);
          
          this.$set(this.groupList[index], 'children', children);
        }
      }
    },
    show(row) {
      this.currRecord = row;
      this.getGrounpList();
      this.visibleDialog = true;
    },
    handleCloseDialog() {
      this.visibleDialog = false;
      this.reset();
    },
    reset() {
      this.saveLoading = false;
      this.searchValue = '';
      this.userList = [];
      this.selectedList = [];
      this.groupList = [];
      this.currRecord = {};
    },
    handleSave() {
      if (!this.selectedList.length) {
        this.$message.warning('请勾选人员');
        return;
      }
      
      this.saveLoading = true;
      this.$api.basics.xfQuestionnaire(this.currRecord.id, { ids: this.selectedList.map(el => el.id).join() }).then(res => {
        this.$message.success('下发成功');
        this.handleCloseDialog();
      }).finally(() => {
        this.saveLoading = false;
      })
    },
    handleSearch() {
      if (this.searchValue === '') {
        this.userList = [];
        this.getGrounpList();
        return;
      }

      this.getGrounpList();
      this.getUserList();
    },
    changeSelected(v) {
      let id = v.id;
      let index = this.userList.findIndex(el => el.id == id);
      let selected = !this.userList[index].selected;

      this.userList[index].selected = selected;

      this.groupList.forEach((el, i) => {
        let j = el.children.findIndex(elm => elm.id == id);

        if (j > -1) {
          this.$set(this.groupList[i].children[j], 'selected', selected);
        }
      })

      if (!selected) {
        let i = this.selectedList.findIndex(el => el.id == id);

        this.selectedList.splice(i, 1);
      } else {
        this.selectedList.push(this.userList[index]);
      }
    },
    closeTag(val) {
      let id = val.id;

      let index = this.selectedList.findIndex(el => el.id == id);

      this.selectedList.splice(index, 1);
      
      let i = this.userList.findIndex(el => el.id == id);

      if (i > -1) {
        this.userList[i].selected = false;
      };

      this.groupList.forEach((el, j) => {
        let k = el.children.findIndex(elm => elm.id == id);

        if (k > -1) {
          this.$set(this.groupList[j].children[k], 'selected', false);
        }
      })
    },
    changeGroupSelected(it) {
      let selected = !it.selected;
      
      this.groupList.forEach((el, i) => {
        let j = el.children.findIndex(elm => elm.id == it.id);

        if (j > -1) {
          this.$set(this.groupList[i].children[j], 'selected', selected);
        }
      })

      let k = this.userList.findIndex(el => el.id == it.id);

      if (k > -1) {
        this.$set(this.userList[k], 'selected', selected);
      }

      if (selected) {
        this.selectedList.push(it);
      } else {
        let index = this.selectedList.findIndex(el => el.id == it.id);

        this.selectedList.splice(index, 1);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.left {
  flex: 0 0 240px;
  width: 240px;
}
.right {
  margin-left: 15px;
  border: 1px solid #567cae;
  border-radius: 5px;
  padding: 15px;
}
.mr10 {
  margin-right: 10px;
}
.cell {
  margin-bottom: 10px;
}
.block + .block {
  border-top: 1px solid #033B6A;
}
.block-top {
  height: 30px;
  background: #567cae;
  padding: 0 10px;
  &.active {
    .arrow {
      transition: all 0.3s;
      transform: rotate(90deg);
    }
  }
}
.block-bottom {
  padding: 10px 30px;
}
.block-cell + .block-cell {
  margin-top: 10px;
}
</style>