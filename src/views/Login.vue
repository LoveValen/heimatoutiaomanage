<template>
  <div class="login">
    <div class="container">
      <el-card class="box-card">
        <div class="top">
          <img src="../assets/avatar.png" alt="" class="avatar" />
          <!-- <div class="avatar"></div> -->
        </div>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm">
          <el-form-item prop="username">
            <el-input
              v-model="ruleForm.username"
              autocomplete="off"
              placeholder="请输入用户名"
            >
              <i slot="prefix" class="el-input__icon el-icon-s-custom"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              v-model="ruleForm.password"
              autocomplete="off"
              placeholder="请输入密码"
            >
              <i slot="prefix" class="el-input__icon el-icon-lock"></i>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm(ruleForm)"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import { userLogin } from "@/apis/user.js";
export default {
  data() {
    return {
      ruleForm: {
        username: "13800138000",
        password: "123",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 16,
            message: "长度在 3 到 16 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    submitForm(formData) {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          try {
            let res = await userLogin(formData);
            if (res.status == 200) {
              this.$message({
                showClose: true,
                message: "登录成功!",
                type: "success",
              });
              // 保存token
              localStorage.setItem("managetoken", res.data.data.token);
              // 页面跳转
              this.$router.push({ name: "index" });
            } else {
              this.$message({
                showClose: true,
                message: "用户名或密码错误",
                type: "error",
              });
              return false;
            }
          } catch {
            this.$message({
              showClose: true,
              message: "用户名或密码错误",
              type: "error",
            });
          }
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  background-color: tomato;
  .container {
    width: 450px;
    height: 300px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .box-card {
      .el-card__body {
        height: 100%;
      }
      .el-button {
        width: 100%;
      }
      .top {
        width: 100%;
        height: 80px;
        .avatar {
          position: absolute;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 88px;
          height: 88px;
          // background: url("../assets/avatar.png") 0 0 no-repeat;
          // background-size: 100%;
          background-color: tomato;
          border: 10px solid #fff;
          border-radius: 50%;
          box-shadow: 0 1px 5px #ccc;
          overflow: hidden;
        }
      }
    }
  }
}
</style>