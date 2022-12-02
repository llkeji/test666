<template>
  <el-container style="height: 100%">
    <el-header style="font-size: 12px">
      <h1>
        <span
          ><el-avatar
            :size="60"
            src="./logo.png"
          ></el-avatar
        ></span>
        <span>电商管理系统</span>
      </h1>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <el-container>
      <el-aside
        style="background-color: #545c64"
        :width="isCollapse ? '64px' : '210px'"
      >
        <el-button
          style="width: 100%"
          @click="isCollapse = !isCollapse"
          size="mini"
          type="info"
          >|||</el-button
        >
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :default-active="this.$route.path"
          router
          :collapse="isCollapse"
          class="el-menu-vertical-demo"
          unique-opened
          style="border: none"
        >
          <el-submenu
            :index="item.order + ''"
            v-for="(item, index) in menuitem"
            :key="index"
          >
            <template slot="title">
              <i :class="icon[index]"></i>
              <span slot="title">{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + menuC.path"
              v-for="(menuC, idx) in item.children"
              :key="idx"
              style="text-align: left"
            >
              <i class="el-icon-menu"></i>
              <span slot="title">{{ menuC.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuitem: [],
      isCollapse: false,
      icon: [
        "el-icon-s-custom",
        "el-icon-s-opportunity",
        "el-icon-s-goods",
        "el-icon-s-order",
        "el-icon-s-data",
      ],
    };
  },
  created() {
    setTimeout(() => {
      this.$axios.get("menus").then((res) => {
        this.menuitem = res.data.data;
      });
    }, 500);
  },
  methods: {
    // 退出登录
    logout() {
      this.$confirm("是否继续退出?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "退出成功!",
          });
          // 清除token
          window.sessionStorage.removeItem("token");
          // 跳转登录页面
          this.$router.push("/login");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出",
          });
        });
    },
  },
};
</script>

<style>
.el-header {
  background-color: #373d41;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-header h1 {
  color: white;
  display: flex;
  align-items: center;
}
.el-avatar {
  height: 20px;
  vertical-align: top;
  margin-right: 15px;
}

.el-aside {
  color: #333;
  /* overflow: auto; */
  text-align: left;
}
</style>
