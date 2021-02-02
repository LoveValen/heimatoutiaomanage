<template>
  <div class="container">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <!-- <el-header></el-header> -->
        <h1 class="logo" @click="$router.push({ name: 'welcome' })"></h1>
        <el-menu
          class="el-menu-vertical-demo"
          :router="true"
          @open="handleOpen"
          @close="handleClose"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <!-- 用户管理 -->
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="1-1">
              <i class="el-icon-user"></i>
              用户列表
            </el-menu-item>
          </el-submenu>
          <!-- 文章管理 -->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>文章管理</span>
            </template>
            <el-menu-item index="postlist">
              <i class="el-icon-reading"></i>
              文章列表
            </el-menu-item>
            <el-menu-item index="2-2">
              <i class="el-icon-reading"></i>
              文章发布
            </el-menu-item>
          </el-submenu>
          <!-- 栏目管理 -->
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>栏目管理</span>
            </template>
            <el-menu-item index="3-1">
              <i class="el-icon-files"></i>
              栏目列表
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 头部 -->
        <el-header>
          <i class="el-icon-s-fold"></i>
          <span>黑马头条后台管理系统</span>
          <div class="right">
            <span>欢迎你：</span>
            <el-button type="danger" plain>退出</el-button>
          </div>
        </el-header>
        <!-- 主体内容 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  .el-container {
    height: 100%;

    .el-header,
    .el-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #b3c0d1;
      color: #333;
      font-size: 24px;
      .right {
        font-size: 16px;
      }
    }

    .el-aside {
      background-color: #d3dce6;
      color: #333;
      height: 100%;
      .logo {
        width: 100%;
        height: 60px;
        // height: 100%;
        background: url("../assets/logo.png") 0 0 no-repeat;
        background-size: auto 100%;
        background-color: #b3c0d1;
        cursor: pointer;
      }
    }

    .el-main {
      background-color: #e9eef3;
      color: #333;
      height: 100%;
    }

    body > .el-container {
      margin-bottom: 40px;
    }
  }
}
</style>