<template>
  <div class="container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">文章管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>文章发布</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-form
        ref="postList"
        :model="postList"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="postList.title"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="postList.type">
            <el-radio :label="1">文章</el-radio>
            <el-radio :label="2">视频</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 富文本框 -->
        <el-form-item label="内容" prop="content" v-if="postList.type == 1">
          <VueEditor :config="config" ref="vueEditor" />
        </el-form-item>
        <el-form-item label="内容" prop="content" v-if="postList.type == 2">
          <el-upload
            :action="axios.defaults.baseURL + '/upload'"
            :on-success="fileSuccess"
            :headers="getToken()"
            multiple
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <!-- 文章类别选择 -->
        <el-form-item label="类别" prop="categories">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
          >
            全选
          </el-checkbox>
          <div style="margin: 15px 0"></div>
          <el-checkbox-group
            v-model="checkedCategories"
            @change="handleCheckedCategoriesChange"
          >
            <el-checkbox
              v-for="category in categories"
              :label="category.id"
              :key="category.id"
            >
              {{ category.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <!-- 封面 -->
        <el-form-item label="封面" prop="cover">
          <el-upload
            :action="axios.defaults.baseURL + '/upload'"
            :headers="getToken()"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handlePictureUpload"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm"> 提交 </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import VueEditor from "vue-word-editor";
import "quill/dist/quill.snow.css";
import axios from "@/utils/request.js";
import { addPostList } from "@/apis/post.js";
import { getCategories } from "@/apis/category.js";
export default {
  components: { VueEditor },
  data() {
    return {
      axios,
      dialogImageUrl: "", // 本地预览图片
      dialogVisible: false,
      checkAll: false, // 全选框
      checkedCategories: [], // 选择的栏目
      categories: [], // 所有栏目
      currentCategories: [],
      isIndeterminate: false, //全选框的未确定状态
      postList: {
        title: "", // 文章标题
        type: 1, // 类型
        content: "", // 文章内容
        cover: [], // 文章封面
        categories: [], // 文章分类
      },
      rules: {
        title: [
          {
            required: true,
            message: "标题不能为空",
            trigger: "blur",
          },
        ],
      },
      config: {
        // 上传图片的配置
        uploadImage: {
          url: axios.defaults.baseURL + "/upload",
          name: "file",
          headers: this.getToken(),
          // res是结果，insert方法会把内容注入到编辑器中，res.data.url是资源地址
          uploadSuccess(res, insert) {
            insert(axios.defaults.baseURL + res.data.data.url);
          },
        },
        // 上传视频的配置
        uploadVideo: {
          url: axios.defaults.baseURL + "/upload",
          name: "file",
          headers: this.getToken(),
          uploadSuccess(res, insert) {
            insert(axios.defaults.baseURL + res.data.data.url);
          },
        },
      },
    };
  },
  async mounted() {
    let res = await getCategories();
    // console.log(res);
    this.categories = res.data.data.slice(2);
    // console.log(this.categories);
  },
  methods: {
    getToken() {
      return { Authorization: localStorage.getItem("managetoken") };
    },
    // 提交表单
    submitForm() {
      this.$refs.postList.validate(async (valid) => {
        if (valid) {
          if (this.postList.type == 1) {
            this.postList.content = this.$refs.vueEditor.editor.root.innerHTML;
          }
          console.log(this.checkedCategories);
          for (let i = 0; i < this.checkedCategories.length; i++) {
            this.postList.categories[i] = { id: this.checkedCategories[i] };
          }
          console.log(this.postList);
          let res = await addPostList(this.postList);
          if (res.data.message == "文章发布成功") {
            this.$message({
              showClose: true,
              message: "文章发布成功",
              type: "success",
            });
          }
          this.$router.push({ name: "postlist" });
        } else {
          return false;
        }
      });
    },
    // 文件上传成功时的钩子
    fileSuccess(response) {
      // console.log(response, file, fileList);
      if (response.message == "文件上传成功") {
        this.postList.content = response.data.url;
      }
    },
    // 选择栏目 ==> 全选框
    handleCheckAllChange(val) {
      this.checkedCategories = val ? this.categories.map((val) => val.id) : [];
      this.isIndeterminate = false;
    },
    // 选择栏目 ==> 各个栏目框
    handleCheckedCategoriesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.categories.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.categories.length;
    },

    handleRemove(file) {
      // console.log(file, fileList);
      this.postList.cover = this.postList.cover.filter((val) => {
        if (file.response.data.id != val.id) return val;
      });
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handlePictureUpload(response) {
      // console.log(response, file, fileList);
      this.postList.cover.push({ id: response.data.id });
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  .box-card {
    margin-top: 20px;
  }
}
</style>