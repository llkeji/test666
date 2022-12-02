<template>
  <div class="bg">
    <div class="login">
      <h1>后台管理系统</h1>
      <el-form
        label-position="right"
        label-width="auto"
        :model="loginForm"
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item label="" prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="login">登录</el-button>
      <el-button type="info" @click="get">获取</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      circleUrl: "./favicon.ico",
      sizeList: ["large", "medium", "small"],
      labelPosition: "right",
      // 登录表单的数据
      loginForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  methods: {
    // 登录方法
    login() {
      // 校验
      this.$refs.ruleForm.validate((val) => {
        if (!val) return;
        this.$axios.post("login", this.loginForm).then((res) => {
          // console.log(res);
          // 登录失败
          if (res.data.meta.status !== 200) {
            this.$message.error(res.data.meta.msg);
            return;
          }
          // 登录成功
          this.$message.success(res.data.meta.msg);
          // 把登录成功拿到的token(令牌)存储到本地，因为考虑到安全性，所以把token临时存放在sessionStorage
          window.sessionStorage.setItem("token", res.data.data.token);
          this.$router.push("/");
        });
      });
    },
    get() {
      this.loginForm = {
        username: "admin",
        password: "123456",
      };
    },
  },
};
</script>

<style>
.bg {
  width: 100%;
  height: 100%;
  background-color: rgb(43, 43, 43);
  padding-top: 100px;
  box-sizing: border-box;
}
.login {
  width: 400px;
  margin: 100px auto;
  background-color: #fff;
  border: 1px solid red;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 1px 1px 10px #ccc;
}
.login h1 {
  margin-bottom: 30px;
}
</style>
