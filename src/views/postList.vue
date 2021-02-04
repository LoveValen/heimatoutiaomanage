<template>
  <div class="container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">文章管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>文章列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table :data="postList" :border="true" style="width: 100%">
        <el-table-column type="index" :index="postList.id"></el-table-column>
        <el-table-column prop="title" label="标题" width="360">
        </el-table-column>
        <el-table-column prop="type" label="类型" width="100">
        </el-table-column>
        <el-table-column prop="user.nickname" label="作者"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)"> 查看 </el-button>
            <el-button type="danger"> 编辑 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getPostList } from "@/apis/post.js";
export default {
  data() {
    return {
      postList: [],
      total: 0,
      pageSize: 2,
      currentPage: 1,
    };
  },
  methods: {
    async init() {
      let res = await getPostList({
        pageSize: this.pageSize,
        pageIndex: this.currentPage,
      });
      // console.log(res);
      this.postList = res.data.data;
      this.total = res.data.total;
    },
    handleClick(row) {
      console.log(row);
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.init();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.init();
    },
  },
  async mounted() {
    this.init();
  },
};
</script>

<style lang="less" scoped>
.container {
  .el-card {
    margin-top: 20px;
  }
  .el-pagination {
    text-align: center;
  }
}
</style>