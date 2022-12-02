<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <el-card style="margin: 10px 0">
      <div class="box">
        <el-input
          placeholder="请输入内容"
          v-model="queryInfo.query"
          clearable
          @clear="search"
          style="width: 50%; margin-right: 20px"
        >
          <template slot="append">
            <el-button @click="search" class="el-icon-search"></el-button>
          </template>
        </el-input>
        <el-button type="primary" @click="dialogFormVisible = true"
          >添加用户</el-button
        >
      </div>
      <!-- 用户列表 -->
      <el-table :data="userList" min-height="auto">
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="changeState(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width=200>
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="edit(scope.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              @click="delUser(scope.row.id)"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
            <!-- 分配 -->
            <el-button
              type="warning"
              @click="setRoles(scope.row)"
              icon="el-icon-setting"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="box">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 3, 5]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form
        :label-position="labelPosition"
        label-width="auto"
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        class="formBody"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"> </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"> </el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"> </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile" maxlength="11" show-word-limit>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">添 加</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogEditVisible">
      <el-form
        :label-position="labelPosition"
        label-width="auto"
        :model="editForm"
        :rules="addFormRules"
        ref="editFormRef"
        class="formBody"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled> </el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"> </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile" maxlength="11" show-word-limit>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">修 改</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="dialogRolesVisible">
      <el-form ref="form" label-width="auto" style="text-align: left">
        <p>当前用户：{{ rolesForm.username }}</p>
        <p>当前角色：{{ rolesForm.role_name }}</p>
        <p>
          分配角色：
          <el-select v-model="rolesValue" placeholder="请选择角色">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRolesInfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    // 邮箱校验
    var checkEmail = (rule, value, callback) => {
      /* 
      rule： 校验规则
      value： 当前值
      callback： 回调函数
      */
      var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的邮箱"));
      }
    };
    // 手机校验
    var checkMobile = (rule, value, callback) => {
      var reg = /^1[3|4|5|7|8|9][0-9]\d{8}$/;
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的手机号"));
      }
    };
    return {
      // 请求用户列表的参数
      queryInfo: {
        query: "", // 搜索的关键字
        pagenum: 1, // 当前页码
        pagesize: 3, // 每页显示的条数
      },
      total: 0, // 总条数
      // 用户列表
      userList: [],
      // 添加用户的模态框
      dialogFormVisible: false,
      // 编辑用户的模态框
      dialogEditVisible: false,
      dialogRolesVisible: false,
      labelPosition: "right",
      // 添加用户的表单
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 编辑用户的表单
      editForm: {},
      rolesForm: {},
      rolesList: [],
      rolesValue: "",
      // 验证规则
      addFormRules: {
        username: [
          {
            required: true,
            message: "请输入账号",
            trigger: ["blur", "change"],
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: ["blur", "change"],
          },
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: ["blur", "change"],
          },
          { validator: checkEmail, trigger: ["blur", "change"] },
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机号",
            trigger: ["blur", "change"],
          },
          { validator: checkMobile, trigger: ["blur", "change"] },
        ],
      },
    };
  },
  created() {
    this.xr();
  },
  methods: {
    // 用户列表渲染
    xr() {
      this.$axios
        .get("users/", {
          params: this.queryInfo,
        })
        .then((res) => {
          // console.log(res);
          if (res.data.meta.status !== 200) {
            this.$message.error(res.data.meta.msg);
            return;
          }
          this.userList = res.data.data.users;
          this.total = res.data.data.total;
        });
    },
    // 添加用户
    addUser() {
      this.$refs.addFormRef.validate((val) => {
        if (!val) return;
        this.$axios.post("users", this.addForm).then((res) => {
          // console.log(res);
          if (res.data.meta.status !== 201) {
            this.$message.error(res.data.meta.msg);
            return;
          }
          this.$message.success(res.data.meta.msg);
          // 数据添加成功隐藏弹框
          this.dialogFormVisible = false;
          // 重新向服务器发送用户列表的请求，获取最新的数据
          this.xr();
        });
      });
    },
    // 删除用户
    delUser(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios.delete(`users/${id}`).then((res) => {
            if (res.data.meta.status !== 200) {
              this.$message.error(res.data.meta.msg);
              return;
            }
            this.$message.success(res.data.meta.msg);
            this.xr();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 显示编辑用户的模态框
    edit(id) {
      this.$axios.get(`users/${id}`).then((res) => {
        // console.log(res);
        this.editForm = res.data.data;
        this.dialogEditVisible = true;
      });
    },
    // 编辑用户
    editUser() {
      // 需要校验通过才能发送请求
      this.$refs.editFormRef.validate((val) => {
        if (!val) return;
        this.$axios
          .put(`users/${this.editForm.id}`, this.editForm)
          .then((res) => {
            // console.log(res);
            if (res.data.meta.status !== 200) {
              this.$message.error(res.data.meta.msg);
              return;
            }
            this.$message.success(res.data.meta.msg);
            this.xr();
            // 关闭模态框
            this.dialogEditVisible = false;
          });
      });
    },
    //切换状态
    changeState(state) {
      this.$axios
        .put(
          `/users/${state.id}/state/${state.mg_state}`
        )
        .then((res) => {
          // console.log(res);
          if (res.data.meta.status !== 200) {
            this.$message.error(res.data.meta.msg);
            return;
          }
          this.$message.success(res.data.meta.msg);
          this.xr();
        });
    },
    // 搜索
    search() {
      this.queryInfo.pagenum = 1;
      this.xr();
    },
    // 角色分配  数据回显
    setRoles(row) {
      // console.log(row);
      this.rolesForm = row;
      this.rolesValue = ''
      // 请求角色列表接口
      this.$axios.get("roles").then((res) => {
        // console.log(res);
        this.rolesList = res.data.data;
        // console.log(this.rolesList);
      });
      this.dialogRolesVisible = true;
    },
    // 分配角色
    setRolesInfo() {
      this.$axios
        .put(`users/${this.rolesForm.id}/role`, { rid: this.rolesValue })
        .then((res) => {
          // console.log(res);
          if (res.data.meta.status !== 200) {
            this.$message.error(res.data.meta.msg);
            return;
          }
          this.$message.success(res.data.meta.msg);
          this.xr();
          this.dialogRolesVisible = false;
        });
    },

    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.xr();
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.xr();
      // console.log(`当前页: ${val}`);
    },
  },
};
</script>
<style>
.formBody {
  padding: 5px 20px;
}
</style>
