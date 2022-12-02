<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 角色列表 -->
    <el-card style="margin: 10px 0">
      <p style="text-align: left; margin: 10px 0">
        <el-button type="primary" @click="dialogFormVisible = true"
          >添加角色</el-button
        >
      </p>
      <el-table :data="rolesData" style="width: 100%">
        <!-- 展开项 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="item1 in scope.row.children" :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag>{{ item1.authName }}</el-tag>
              </el-col>
              <!-- 渲染二级权限 -->
              <el-col :span="19">
                <el-row v-for="item2 in item1.children" :key="item2.id">
                  <el-col :span="6"
                    ><el-tag type="success">{{
                      item2.authName
                    }}</el-tag></el-col
                  >
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column label="角色名称" prop="roleName"> </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="edit(scope.row.id)"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" @click="del(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              @click="showSetRole(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加角色对话框 -->
      <el-dialog title="添加角色" :visible.sync="dialogFormVisible">
        <el-form
          :label-position="labelPosition"
          label-width="auto"
          :model="rolesForm"
          :rules="rolesFormRules"
          ref="rolesFormRef"
          class="formBody"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="rolesForm.roleName"> </el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="rolesForm.roleDesc"> </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoles">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑角色对话框 -->
      <el-dialog title="编辑角色" :visible.sync="dialogEditVisible">
        <el-form
          :label-position="labelPosition"
          label-width="auto"
          :model="rolesEditForm"
          :rules="rolesFormRules"
          ref="rolesEditFormRef"
          class="formBody"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="rolesEditForm.roleName"> </el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="rolesEditForm.roleDesc"> </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogEditVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRoles">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 分配权限 -->
      <el-dialog title="分配权限" :visible.sync="dialogRolesVisible">
        <el-tree
          :data="rightsList"
          show-checkbox
          node-key="id"
          :default-checked-keys="defKeys"
          :props="rightsProps"
          ref="tree"
          default-expand-all
        >
        </el-tree>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogRolesVisible = false">取 消</el-button>
          <el-button type="primary" @click="allRights">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rolesData: [],
      dialogFormVisible: false,
      dialogEditVisible: false,
      dialogRolesVisible: false,
      labelPosition: "right",
      rolesForm: {
        roleName: "",
        roleDesc: "",
      },
      rolesEditForm: {},
      rolesFormRules: {
        roleName: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: ["blur", "change"],
          },
        ],
        roleDesc: [
          {
            required: true,
            message: "请输入角色描述",
            trigger: ["blur", "change"],
          },
        ],
      },
      rightsList: [],
      // 显示那些字段
      rightsProps: {
        children: "children",
        label: "authName",
      },
      roleId: "",
      // 默认选中的权限
      defKeys: [],
    };
  },
  created() {
    this.xr();
  },
  methods: {
    xr() {
      this.$axios.get("roles").then((res) => {
        // console.log(res);
        this.rolesData = res.data.data;
      });
    },
    addRoles() {
      this.$refs.rolesFormRef.validate((val) => {
        if (!val) return;
        this.$axios.post("roles", this.rolesForm).then((res) => {
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
    del(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios.delete(`roles/${id}`).then((res) => {
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
      // console.log(id);
      this.$axios.get(`roles/${id}`).then((res) => {
        console.log(res);
        this.rolesEditForm = res.data.data;
        this.dialogEditVisible = true;
      });
    },
    // 编辑用户
    editRoles() {
      // console.log(this.rolesEditForm);
      this.$refs.rolesEditFormRef.validate((val) => {
        if (!val) return;
        this.$axios
          .put(`roles/${this.rolesEditForm.roleId}`, this.rolesEditForm)
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
    // 分配权限 - 树形菜单渲染 - 打开模态框
    showSetRole(row) {
      this.defKeys = [];
      this.roleId = row.id;
      this.dialogRolesVisible = true;
      this.$axios.get("rights/tree").then((res) => {
        // console.log(res);
        this.rightsList = res.data.data;
      });
      /* 
        参数：
          row：当前角色所有的权限
          this.defKeys：数组（空的）
      */
      this.getLeafKeys(row, this.defKeys);
    },
    // 收集选中的权限，id
    getLeafKeys(obj, arr) {
      //当没有子节点时，把当前节点的id放入数组
      if (!obj.children) {
        return arr.push(obj.id);
      }
      // 递归自调用：把每个对象中 children 字段的值放到数组中
      obj.children.forEach((item) => this.getLeafKeys(item, arr));
    },
    // 分配权限
    allRights() {
      let arrStr = this.$refs.tree
        .getCheckedKeys()
        .concat(this.$refs.tree.getHalfCheckedKeys())
        .join(",");
      // console.log(this.roleId,arrStr);
      this.$axios
        .post(`roles/${this.roleId}/rights`, { rids: arrStr })
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
  },
};
</script>
<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.el-row {
  display: flex;
  align-items: center;
  /* border-top: 1px solid #ebeef5; */
  /* box-sizing: border-box; */
}
.el-row .el-tag {
  margin: 10px;
}
.formBody {
  padding: 5px 20px;
}
</style>
