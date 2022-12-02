<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div class="box">
        <el-button type="primary" @click="addDialog = true">添加角色</el-button>
      </div>
      <template>
        <el-table :data="rolesData" stripe style="width: 100%" border>
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row v-for="item in scope.row.children" :key="item.id">
                <el-col :span="5"
                  ><el-tag>{{ item.authName }}</el-tag></el-col
                >
                <el-col :span="19">
                  <el-row v-for="item2 in item.children" :key="item2.id">
                    <el-col :span="8"
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
          <el-table-column type="index" label="#"> </el-table-column>
          <el-table-column prop="roleName" label="角色名称"> </el-table-column>
          <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="editShow(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                size="mini"
                @click="delRoles(scope.row.id)"
                >删除</el-button
              >
              <el-button
                type="warning"
                size="mini"
                @click="rightsShow(scope.row)"
                >分配权限</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
    <!-- 添加 -->
    <el-dialog title="添加角色" :visible.sync="addDialog">
      <el-form
        :model="addForm"
        label-width="auto"
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </div>
    </el-dialog>
    <!--  编辑 -->
    <el-dialog title="编辑角色" :visible.sync="editDialog">
      <el-form
        :model="editForm"
        label-width="auto"
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="rightsDialog">
      <div class="box">
        <el-tree
          :data="rightsData"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="checkedKeys"
          :props="defaultProps"
          ref="tree"
        >
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rightsDialog = false">取 消</el-button>
        <el-button type="primary" @click="setRights">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rolesData: [],
      addDialog: false,
      addForm: {
        roleName: "",
        roleDesc: "",
      },
      editDialog: false,
      editForm: {},
      rightsDialog: false,
      rightsData: [],
      defaultProps: {
        children: "children",
        label: "authName",
      },
      checkedKeys: [],
      roleId: "",
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    getRoles() {
      this.$axios.get("roles").then((res) => {
        // console.log(res);
        this.rolesData = res.data.data;
      });
    },
    addRoles() {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) return;
        this.$axios.post("roles", this.addForm).then((res) => {
          // console.log(res);
          if (res.data.meta.status !== 201)
            return this.$message.error(res.data.meta.msg);
          this.$message.success(res.data.meta.msg);
          this.getRoles();
          this.addDialog = false;
        });
      });
    },
    editShow(row) {
      this.editForm = row;
      this.editDialog = true;
    },
    editRoles() {
      this.$axios
        .put(`roles/${this.editForm.id}`, this.editForm)
        .then((res) => {
          // console.log(res);
          if (res.data.meta.status !== 200)
            return this.$message.error(res.data.meta.msg);
          this.$message.success(res.data.meta.msg);
          this.getRoles();
          this.editDialog = false;
        });
    },
    delRoles(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios.delete(`roles/${id}`).then((res) => {
            // console.log(res);
            if (res.data.meta.status !== 200)
              return this.$message.error(res.data.meta.msg);
            this.$message.success(res.data.meta.msg);
            this.getRoles();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    setRights() {
      let rightsID = this.$refs.tree
        .getCheckedKeys()
        .concat(this.$refs.tree.getHalfCheckedKeys())
        .join(",");
      // console.log(this.roleId, rightsID);
      this.$axios
        .post(`roles/${this.roleId}/rights`, { rids: rightsID })
        .then((res) => {
          // console.log(res);
          if (res.data.meta.status !== 200)
            return this.$message.error(res.data.meta.msg);
          this.$message.success(res.data.meta.msg);
          this.getRoles();
          this.rightsDialog = false;
        });
    },
    rightsShow(row) {
      this.checkedKeys = [];
      this.roleId = row.id;
      this.rightsDialog = true;
      this.$axios.get("rights/tree").then((res) => {
        // console.log(res);
        this.rightsData = res.data.data;
      });
      this.getKeys(row, this.checkedKeys);
    },
    getKeys(obj, arr) {
      if (!obj.children) {
        return arr.push(obj.id);
      }
      obj.children.forEach((item) => this.getKeys(item, arr));
    },
  },

  created() {
    this.getRoles();
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
</style>
