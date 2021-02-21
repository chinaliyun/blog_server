<template>
  <div class="page_root">
    <div class="header">
      <div class="form_wrapper">
        <div class="title_wrapper">
          <el-form>
            <el-form-item
              label="标题:"
              label-width="50px"
              label-position="left"
            >
              <el-input
                placeholder="请输入文章标题"
                v-model.trim="form.title"
              />
            </el-form-item>
          </el-form>
        </div>
        <div class="submit_wrapper">
          <el-form inline>
            <el-form-item>
              <el-button type="primary" @click="insertImg">
                插入图片
              </el-button>
              <input
                type="file"
                hidden
                ref="upload-input"
                @change="handlerUploadFileChange"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="preSubmit">
                发布
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <FixedDialog
      :visiable.sync="dialogVisiable"
      title="发布"
      @confirm="submitBlog"
    >
      <div class="slide_down">
        <el-form label-width="100px" label-position="left">
          <el-form-item label="发布到:">
            <el-select v-model="form.folder_id" placeholder="默认发布到未分类">
              <el-option
                v-for="item in folderDict"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标签:">
            <el-input
              v-model="labelFilterKeywords"
              placeholder="输入关键字可以搜索标签"
            />
          </el-form-item>
          <div class="tag_list">
            <div
              class="tag_item"
              v-for="tag in labelDictFilter"
              :key="tag.id"
              @click="toggleLabel(tag)"
            >
              <el-tag :type="tag.selected ? 'success' : 'info'" effect="dark">
                {{ tag.name }}
              </el-tag>
            </div>
          </div>
        </el-form>
      </div>
    </FixedDialog>
    <div class="editor_section">
      <div class="editor_wrapper">
        <Editor @onInput="editorChange" :default-value="form.content" />
      </div>
      <div class="preview_wrapper">
        <markdown-it-vue class="md-body" :content="html" />
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import * as http from "./api";
import Editor from "./editor";

import MarkdownItVue from "markdown-it-vue";
import "markdown-it-vue/dist/markdown-it-vue.css";
export default {
  components: {
    Editor,
    MarkdownItVue
  },
  data() {
    return {
      dialogVisiable: false,
      labelFilterKeywords: "",
      labelDict: [],
      folderDict: [],
      form: {
        id: "",
        title: "",
        content: "",
        hash: "",
        html: "",
        folder_id: "",
        labels: []
      }
    };
  },
  computed: {
    html() {
      return this.form.content.replace(
        /\.\/images\/((.*?)\.(png|jpg|gif|jpeg))/g,
        `/static/blogs/${this.form.hash}/images/$1`
      );
    },
    labelDictFilter() {
      // 关键字过滤后的标签列表
      if (this.labelFilterKeywords === "") {
        return this.labelDict;
      }
      return this.labelDict.filter(item => {
        const reg = new RegExp(this.labelFilterKeywords);
        return reg.test(item.name);
      });
    }
  },

  async mounted() {
    // 获取最新的标签列表
    try {
      const res = await http.selectLabelList();
      this.labelDict = res.data.list.map(item => {
        return {
          ...item,
          selected: false
        };
      });
    } catch (e) {
      console.log(e);
    }
    // 获取所有的目录列表
    try {
      const res = await http.selectFolderList();
      this.folderDict = res.data.list;
    } catch (e) {
      console.log(e);
    }
    // 如果有hash，就是编辑文章，先获取文章详情
    const hash = this.$route.params.hash || "";
    if (hash) {
      try {
        const res = await http.selectBlogOne({
          id: hash
        });
        if (res.code !== 200) {
          this.$message.error(res.msg);
          return;
        }
        this.form.id = res.data.blog.id;
        this.form.title = res.data.blog.name;
        this.form.content = res.data.blog.content;
        this.form.hash = res.data.blog.hash;
        this.form.folder_id = parseInt(res.data.blog.folder_id, 10);
        if (res.data.blog.labels && res.data.blog.labels !== "") {
          this.form.labels = res.data.blog.labels.split(",");
          // 设置标签和目录的默认值
          this.labelDict = this.labelDict.map(item => {
            return {
              ...item,
              selected: res.data.blog.labels
                .split(",")
                .includes(String(item.id))
            };
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  },
  methods: {
    editorChange(data) {
      this.form.content = data.instance;
    },
    toggleLabel(item) {
      // 切换标签状态
      item.selected = !item.selected;
      this.labelFilterKeywords = "";
      // 实时更新form.labels的值
      this.form.labels = this.labelDict
        .filter(item => item.selected)
        .map(item => item.id);
    },
    async insertImg() {
      // 插入图片
      // this.selectedFile = '';
      this.$refs["upload-input"].value = "";
      this.$refs["upload-input"].click();
    },
    async handlerUploadFileChange(e) {
      // 上传文件发生变化
      console.log(e.target.files);
      const formData = new FormData();
      formData.append("name", e.target.files[0]);
      formData.append("type", "blog");
      formData.append("id", this.form.id);

      try {
        const res = await http.uploadFile(formData);
        this.form.id = res.data.blog.id;
        this.form.hash = res.data.blog.hash;
        this.form.content += `\n![](${res.data.path})`;
      } catch (e) {
        console.log(e);
      }
    },
    async submitBlog() {
      // 发布文章
      if (this.form.id === "") {
        // 如果没有ID就是新增
        try {
          let res;
          if (this.form.id) {
            res = await http.updateBlog(this.form);
          } else {
            res = await http.insertBlog(this.form);
          }
          if (res.code != 200) {
            this.$message.error(res.msg);
            return;
          }
          this.form.id = res.data.id + "";
        } catch (e) {
          console.log(e);
          this.$message.error("网路错误");
          return;
        }
      } else {
        // 如果有ID就是更新内容
        try {
          const res = await http.updateBlog(this.form);
          if (res.code != 200) {
            this.$message.error(res.msg);
            return;
          }
          this.form.content = res.data.content;
        } catch (e) {
          console.log(e);
          this.$message.error("网路错误");
          return;
        }
      }
      this.$message.success("发布成功");
      this.dialogVisiable = false;
    },
    async preSubmit() {
      if (this.form.title === "") {
        this.$message.error("标题不能为空");
        return;
      }
      if (this.form.content === "") {
        this.$message.error("内容不能为空");
        return;
      }
      this.dialogVisiable = true;
    },
    async submitBlog() {
      // 发布文章
      if (this.form.id === "") {
        // 如果没有ID就是新增
        try {
          const res = await http.insertBlog(this.form);
          if (res.code != 200) {
            this.$message.error(res.msg);
            return;
          }
          console.log(res);
          this.form.id = res.data.id + "";
        } catch (e) {
          console.log(e);
          this.$message.error("网路错误");
          return;
        }
      } else {
        // 如果有ID就是更新内容
        try {
          const res = await http.updateBlog(this.form);
          if (res.code != 200) {
            this.$message.error(res.msg);
            return;
          }
          this.form.content = res.data.content;
        } catch (e) {
          console.log(e);
          this.$message.error("网路错误");
          return;
        }
      }
      this.$message.success("发布成功");
      this.dialogVisiable = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.page_root {
  padding: 10px;
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  .header {
    .form_wrapper {
      display: flex;
      .title_wrapper {
        flex-grow: 1;
        margin-right: 10px;
      }
    }
  }
  .tag_list {
    display: flex;
    .tag_item {
      margin-right: 10px;
      cursor: pointer;
    }
  }
  .editor_section {
    flex-grow: 1;
    display: flex;
    overflow: hidden;
    > div {
      width: 50%;
      height: 100%;
      flex-grow: 1;
    }
    .editor_wrapper {
      border-right: 1px solid $border-color;
      border-left: 1px solid $border-color;
      border-top: 1px solid $border-color;
      .vue-codemirror {
        height: 100%;
      }

      .textarea {
        display: block;
        width: 100%;
        height: 100%;
        border: none;
        resize: none;
        &:focus {
          border: none;
          outline: none;
        }
      }
    }
    .preview_wrapper {
      border-right: 1px solid $border-color;
      border-top: 1px solid $border-color;
      padding: 10px;
      font-size: 16px;
      line-height: 1.4em;
      height: 100%;
      overflow-y: auto;
      ::v-deep {
        pre {
          margin: 0;
        }
      }
    }
  }
}
</style>
