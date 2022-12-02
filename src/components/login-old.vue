<template>
  <div>
    <div class="kj">
      <div class="tx">
        <!-- <el-avatar :size="80" :src="circleUrl"></el-avatar> -->
        <el-avatar shape="circle" :size="120" :src="circleUrl"></el-avatar>
      </div>
      <el-form
        :label-position="labelPosition"
        label-width="auto"
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
      >
        <el-form-item label="账号" prop="username">
          <el-input v-model="loginForm.username">
            <i slot="prefix" class="el-icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password">
            <i slot="prefix" class="el-icon-edit-outline"></i>
          </el-input>
        </el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button type="info" @click="get">获取</el-button>
      </el-form>
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
      loginFormRules: {
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
      this.$refs.loginFormRef.validate((val) => {
        if (!val) return;
        this.$axios
          .post(
            "login",
            this.loginForm
          )
          .then((res) => {
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
            this.$router.push("/home");
          });
      });
    },
    get(){
      this.loginForm={
        username:"admin",
        password:"123456"
      }
    }
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
.tx {
  width: 100%;
  position: absolute;
  top: -60px;
  left: 0;
}
.tx .el-avatar {
  border: 10px solid rgb(255, 255, 255);
  box-shadow: 1px 1px 5px 1px gray;
  background: #ededed;
}
.kj {
  width: 380px;
  padding: 80px;
  padding-top: 100px;
  background: rgb(226, 226, 226);
  margin: 100px auto;
  position: relative;
  border-radius: 15px;
  box-shadow: 1px 1px 5px 1px white;
}
.kj .el-form-item{
  line-height: 60px
}
.kj .el-input{
  line-height: 60px;
}
</style>
