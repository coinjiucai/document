<template>
  <div class="component-courseChapter full-block flex-column">
    <div class="title-wrap flex-row align-center justify-between">
      <div class="title">《{{ record.courseName }}》课程章节</div>
      <el-button
        type="primary"
        :disabled="!this.form"
        :loading="loading"
        @click="save"
        size="small"
        >保存</el-button
      >
    </div>
    <div class="container flex1 h0 flex-row">
      <div class="left h100p flex-column">
        <div class="label-wrap flex-row align-center justify-between">
          <div class="label">新建章节</div>
          <div class="op-wrap flex-row align-center">
            <div class="btn pointer color-error" @click="delChapter">删除</div>
            <div class="btn pointer" @click="openAddchapter('top')">+章节</div>
            <div class="btn pointer" @click="openAddchapter('sub')">
              +子章节
            </div>
          </div>
        </div>
        <div class="content-wrap flex1 h0 scroll-y">
          <el-tree
            ref="tree"
            node-key="id"
            highlight-current
            :data="treeList"
            :props="defaultProps"
            @node-click="clickTree"
          ></el-tree>
        </div>
      </div>
      <div class="right h100p flex1 w0 flex-column">
        <template v-if="form">
          <div class="block">
            <div class="label">标题：</div>
            <div class="block-content">
              <el-input
                clearable
                maxlength="100"
                placeholder="标题"
                v-model="form.title"
              ></el-input>
            </div>
          </div>
          <div class="block">
            <div class="label">章节简介：</div>
            <div class="block-content">
              <el-input
                clearable
                maxlength="200"
                placeholder="章节简介"
                type="textarea"
                :rows="4"
                v-model="form.introduction"
              ></el-input>
            </div>
          </div>
          <div class="block flex1 h0 flex-column">
            <div class="label flex-row align-center justify-between">
              <div>课件：</div>
              <el-button type="primary" @click="chooseFile" size="small"
                >上传课件</el-button
              >
              <input
                ref="fileInput"
                type="file"
                multiple
                style="display: none"
                accept="video/mp4,video/ogg, video/3gpp,.doc,.docx,.xls,.xlsx,.pdf,.ppt,.pptx,.txt"
                @change="changeFile"
              />
            </div>
            <div class="block-content flex1 h0" v-loading="kjLoading">
              <div class="courseware-wrap full-block scroll-y">
                <div
                  class="courseware-item flex-row align-center"
                  v-for="(item, index) in form.courseCoursewareList"
                  :key="index"
                >
                  <template v-if="!item.isEdit">
                    <div class="icon-file">
                      <img
                        class="full-block"
                        src="../../../../assets//images/icon_file_light.png"
                        alt=""
                      />
                    </div>
                    <el-tooltip
                      effect="dark"
                      :content="item.coursewareName"
                      placement="top-start"
                    >
                      <div class="name flex1 w0 nowrap">
                        {{ item.coursewareName }}
                      </div>
                    </el-tooltip>
                  </template>
                  <el-input
                    class="w0"
                    placeholder="请输入"
                    max="50"
                    v-model="item.realName"
                    style="width: calc(100% - 20px)"
                    v-else
                  ></el-input>
                  <div class="op-wrap flex-row align-center" style="wodtj">
                    <template v-if="!item.isEdit">
                      <div class="icon pointer" @click="editFile(index)">
                        <img
                          class="full-block"
                          src="../../../../assets//images/icon_edit.png"
                          alt=""
                        />
                      </div>
                      <div class="icon pointer" @click="delFile(index)">
                        <img
                          class="full-block"
                          src="../../../../assets//images/icon_close.png"
                          alt=""
                        />
                      </div>
                    </template>
                    <template v-else>
                      <div class="icon pointer" @click="editFileFinish(index)">
                        <img
                          class="full-block"
                          src="../../../../assets//images/icon_right.png"
                          alt=""
                        />
                      </div>
                      <div class="icon pointer" @click="cancelEditFile(index)">
                        <img
                          class="full-block"
                          src="../../../../assets//images/icon_close.png"
                          alt=""
                        />
                      </div>
                    </template>
                    <div
                      class="icon pointer"
                      @click="play(index)"
                      style="display: flex"
                    >
                      <span
                        class="iconfont"
                        style="font-size: 17px; color: #aeaeae"
                        >&#xe696;</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div class="full-block flex-center" v-else>
          <el-empty></el-empty>
        </div>
      </div>
    </div>

    <addChapter
      ref="addChapter"
      :addChapterType="addChapterType"
      :courseId="courseId"
      :treeList="treeList"
      @save="getZjList"
    />
    <previewFile ref="previewFile"></previewFile>
  </div>
</template>

<script>
import addChapter from '@/views/sourceManage/course/components/addChapter';
import previewFile from '@/components/ElFileUpload/previewFile.vue';
export default {
  name: 'courseChapter',
  components: {
    addChapter,
    previewFile
  },
  props: {
    record: {
      type: Object,
      default: () => ({})
    },
    courseId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      defaultProps: {
        children: 'childrenList',
        label: 'title'
      },
      treeList: [],
      form: '',
      rules: {
        name: { required: true, message: '请输入活动名称', trigger: 'blur' }
      },
      currTree: '',
      addChapterType: 'top',
      loading: false,
      kjLoading: false
    };
  },
  mounted() {
    this.getZjList();
  },
  methods: {
    cancelEditFile(index) {
      const item = this.form.courseCoursewareList[index];

      const realName = item.coursewareName.slice(0, item.lastIndex);
      this.$set(this.form.courseCoursewareList[index], 'realName', realName);
      this.$set(this.form.courseCoursewareList[index], 'isEdit', false);
    },
    editFile(index) {
      const courseCoursewareList = this.form.courseCoursewareList;

      courseCoursewareList[index].isEdit = !courseCoursewareList[index].isEdit;

      this.$set(this.form, 'courseCoursewareList', courseCoursewareList);
    },
    editFileFinish(index) {
      const item = this.form.courseCoursewareList[index];

      if (item.realName === item.coursewareName.slice(0, item.lastIndex)) {
        this.$set(this.form.courseCoursewareList[index], 'isEdit', false);
        return;
      }

      if (!item.realName) {
        const realName = item.coursewareName.slice(0, item.lastIndex);
        this.$set(this.form.courseCoursewareList[index], 'realName', realName);

        return this.$message.warning('文件名称不能为空');
      } else {
        const coursewareName = `${item.realName}${item.coursewareName.slice(
          item.lastIndex
        )}`;

        this.kjLoading = true;

        this.$api.source
          .importKj({
            ...item,
            coursewareName
          })
          .then(() => {
            this.$set(
              this.form.courseCoursewareList[index],
              'coursewareName',
              coursewareName
            );
            this.$set(
              this.form.courseCoursewareList[index],
              'lastIndex',
              coursewareName.lastIndexOf('.')
            );
            this.$set(this.form.courseCoursewareList[index], 'isEdit', false);
          })
          .finally(() => {
            this.kjLoading = false;
          });
      }
    },
    delFile(index) {
      const courseCoursewareList = this.form.courseCoursewareList;

      courseCoursewareList.splice(index, 1);

      this.$set(this.form, 'courseCoursewareList', courseCoursewareList);
    },
    chooseFile() {
      this.$refs.fileInput.click();
    },
    getZjList() {
      this.$api.source.getZjList({ id: this.courseId }).then((res) => {
        this.treeList = res?.result || [];

        if (this.treeList.length) {
          this.clickTree(this.treeList[0]);

          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(this.treeList[0].id);
          });
        } else {
          this.currTree = '';
          this.form = '';
        }
      });
    },
    getZjDesc() {
      this.$api.source.getZjDesc(this.currTree.id).then((res) => {
        const form = res?.result || {};

        form.courseCoursewareList = form.courseCoursewareList || [];

        form.courseCoursewareList.forEach((el) => {
          el.isEdit = false;

          const lastIndex = el.coursewareName.lastIndexOf('.');
          const realName = el.coursewareName.slice(0, lastIndex);

          el.lastIndex = lastIndex;
          el.realName = realName;
        });

        this.form = form;
      });
    },
    save() {
      this.loading = true;
      const param = JSON.parse(JSON.stringify(this.form));

      param.courseCoursewareList.forEach((el) => {
        delete el.isEdit;
        delete el.realName;
        delete el.lastIndex;
        el.courseId = this.courseId;
      });

      this.$api.source
        .addZj(param)
        .then((res) => {
          this.$message.success('保存成功');
          this.getZjDesc();
          this.getZjList();
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async changeFile(e) {
      this.kjLoading = true;
      const list = [];
      const files = e.target.files;

      for (let i = 0; i < files.length; i++) {
        const item = files[i];

        const url = await this.importFile(item);
        const result = await this.importKj({
          url,
          coursewareName: item.name,
          courseId: this.courseId
        });

        const lastIndex = item.name.lastIndexOf('.');
        const realName = item.name.slice(0, lastIndex);

        list.push({
          ...result,
          lastIndex,
          realName,
          isEdit: false
        });
      }
      this.kjLoading = false;
      const courseCoursewareList = this.form.courseCoursewareList;
      courseCoursewareList.push(...list);

      this.$set(this.form, 'courseCoursewareList', courseCoursewareList);

      this.$refs.fileInput.value = '';
    },
    importFile(file) {
      return new Promise((resolve) => {
        const formData = new FormData();

        formData.append('file', file);

        this.$api.source.importFile(formData).then((res) => {
          resolve(res.message);
        });
      });
    },
    importKj(param) {
      return new Promise((resolve) => {
        this.$api.source.importKj(param).then((res) => {
          resolve(res?.result || {});
        });
      });
    },
    addTopZj() {},
    openAddchapter(type) {
      this.addChapterType = type;
      let value = '';

      if (type == 'sub') {
        if (!this.currTree) {
          this.$message.warning('请先选择一个章节');
          return;
        }
        value = this.currTree.id;
      }

      this.$refs.addChapter.show(value);
    },
    delChapter() {
      if (!this.currTree) {
        this.$message.warning('请选中需要删除的章节');
        return;
      }
      this.$confirm('确认删除？', '提示', { type: 'warning' }).then(() => {
        this.$api.source.delZj({ id: this.currTree.id }).then((res) => {
          this.$message.success('删除成功');
          this.getZjList();
        });
      });
    },
    clickTree(val) {
      this.currTree = val;
      this.getZjDesc();
    },
    play(index) {
      const item = this.form.courseCoursewareList[index];
      const file = {
        name: item.coursewareName,
        fileUrl: item.url
      };
      this.$refs.previewFile.show(file);
    }
  }
};
</script>

<style lang="scss" scoped>
.component-courseChapter {
  .container {
    .left {
      width: 384px;
      flex: 0 0 384px;
      border: 1px solid #79b1e9;
      margin-right: 20px;
      .label-wrap {
        height: 35px;
        line-height: 1;
        border-bottom: 1px solid #79b1e9;
        padding: 0 15px;
        .label {
          color: #fff;
          font-size: 16px;
        }
        .op-wrap {
          .btn {
            color: #3aa7e2;
          }
          .color-error {
            color: red;
          }
          .btn + .btn {
            margin-left: 16px;
          }
        }
      }
      .content-wrap {
        .item {
          padding: 10px 13px 10px 0;
          border-bottom: 1px solid #8197bd;
          position: relative;
          .icon-wrap {
            width: 16px;
            height: 16px;
            margin-right: 10px;
          }
          .name {
            color: #aab9cf;
            font-size: 18px;
          }
          .icon-close {
            width: 14px;
            height: 14px;
            position: absolute;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
          }
        }
        &.fileList-wrap {
          padding: 0 20px;
        }
      }
    }
    .right {
      // padding: 0 10px 0 0;
      .block {
        .label {
          margin-bottom: 15px;
        }
        .block-content {
          .courseware-wrap {
            padding: 14px;
            border: 1px solid #567cae;
            flex-wrap: wrap;
            .courseware-item {
              height: 44px;
              padding: 0 80px 0 16px;
              background: #3e5c81;
              color: #fff;
              position: relative;
              .icon-file {
                flex: 0 0 12px;
                width: 12px;
                height: 16px;
                margin-right: 10px;
              }
              .name {
                color: #ffffff;
                font-size: 18px;
              }
              .op-wrap {
                position: absolute;
                top: 50%;
                right: 16px;
                transform: translateY(-50%);
                margin-left: 20px;
                .icon {
                  width: 16px;
                  height: 16px;
                }
                .icon + .icon {
                  margin-left: 14px;
                }
              }
            }
            .courseware-item + .courseware-item {
              margin-top: 15px;
            }
          }
        }
      }
      .block + .block {
        margin-top: 15px;
      }
    }
  }
}
</style>
