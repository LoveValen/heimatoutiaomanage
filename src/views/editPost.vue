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
          :file-list="postList.cover"
            :action="axios.defaults.baseURL + '/upload'"
            :headers="getToken()"
            list-type="picture-card"
            :on-remove="handleRemove"
            :on-success="handlePictureUpload"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
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
import { editPost,getPost } from "@/apis/post.js";
import {getCategories} from '@/apis/category.js';
export default {
  components: { VueEditor },
  data() {
    return {
      axios,
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
    let cates = await getCategories();
    this.categories = cates.data.data.slice(2);
    let res = await getPost(this.$route.query.id);
    // 已选的栏目
    this.checkedCategories = res.data.data.categories.map((value)=>{
      return value.id;
    });
    this.postList.cover = res.data.data.cover.map((value)=>{
      if(value.url.indexOf('http') == -1){
        value.url = axios.defaults.baseURL + value.url;
      }
      value.uid = value.id;
      return{
        value
      }
    });
    this.postList = res.data.data;
    this.$refs.vueEditor.editor.root.innerHTML = res.data.data.content; // 填写当前富文本框的内容
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
          // console.log(this.postList);
          let res = await editPost(this.$route.query.id,this.postList);
          if (res.data.message == "文章编辑成功") {
            this.$message({
              showClose: true,
              message: "文章编辑成功",
              type: "success",
            });
          }
          this.$router.push({ path: "postlist" });
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

    handleRemove(file,fileList) {
      // 第二个参数可以接收到删除后的文件列表
      // 直接赋值给用做文件列表的this.postList.cover即可
      this.postList.cover = fileList;
      this.$message({
              showClose: true,
              message: "删除成功!",
            });
    },
    handlePictureUpload(response,file) {
      // 这里应该将当前的封面放入 postList 当中
      // 接口文档要求的数据是 [{id:**}]
      // 由于这个用来postList.cover的数据不仅仅只用来发送 api 请求，
      // 也会用来渲染上传组件，单单一个 id 就不够，还要有这个 file 用来显示
      file.id = response.data.id;
      // console.log(response, file, fileList);
      this.postList.cover.push(file);
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