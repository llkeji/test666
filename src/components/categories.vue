<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin: 10px 0">
      <!-- 头部 -->
      <div class="box">
        <el-button type="primary" @click="openDialog">添加分类</el-button>
      </div>
      <!-- 分类表格区域 -->
      <tree-table
        :data="cateCheckList"
        :columns="columns"
        border
        show-index
        :selection-type="false"
        class="treeTable"
        :expand-type="false"
        index-text="#"
      >
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-circle-check"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i class="el-icon-circle-close" v-else></i>
        </template>
        <template slot="isOld" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-edit"
            type="primary"
            @click="edit(scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            icon="el-icon-delete"
            type="danger"
            @click="del(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页 -->
      <div class="box">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 3, 5, 7]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>

    <!-- 添加分类 -->
    <el-dialog title="添加分类" :visible.sync="dialogCateVisible">
      <el-form
        ref="add"
        label-width="auto"
        style="text-align: left"
        :rules="rules"
        :model="addForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"> </el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            @change="parentCate"
            :options="CateList"
            :props="cateProps"
            clearable
            style="width: 100%"
            v-model="selectedKeys"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCateVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑分类 -->
    <el-dialog title="编辑分类" :visible.sync="dialogEditVisible">
      <el-form
        ref="edit"
        label-width="auto"
        style="text-align: left"
        :rules="rules"
        :model="editForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"> </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 查询参数
      queryInfo: {
        pagenum: 1, // 当前页码
        pagesize: 5, // 每页显示条数
      },
      // 分类总页数
      total: 0,
      // 所有分类数据
      cateCheckList: [],
      // 选中的
      selectedKeys: [],
      // 添加表单
      addForm: {
        cat_pid: 0,
        cat_name: "",
        cat_level: 0,
      },
      editForm: {},
      CateList: [],
      cateProps: {
        value: "cat_id", //分类ID
        label: "cat_name", //分类名称
        children: "children", //子分类
        checkStrictly: true, //显示单选
        expandTrigger: "hover", //展开触发方式
      },
      // 对话框
      dialogCateVisible: false,
      dialogEditVisible: false,
      // 配置项
      columns: [
        {
          label: "分类名称", //表头的名字
          prop: "cat_name", //渲染的数据字段
        },
        {
          label: "是否有效",
          prop: "cat_deleted",
          type: "template", //html中的类型
          template: "isOk", //和html中的模板名字一致
        },
        {
          label: "排序",
          prop: "cat_level",
          type: "template",
          template: "isOld",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],
      // 校验规则
      rules: {
        cat_name: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.xr();
  },
  methods: {
    // 渲染
    xr() {
      this.$axios.get("categories", { params: this.queryInfo }).then((res) => {
        // console.log(res);
        // if (res.data.meta.status !== 200)
        //   return this.$message.error(res.data.meta.msg);
        // this.$message.success(res.data.meta.msg);
        this.cateCheckList = res.data.data.result;
        this.total = res.data.data.total;
      });
    },
    // 打开添加分类对话框
    openDialog() {
      this.$axios.get("categories", { type: 2 }).then((res) => {
        // console.log(res);
        this.dialogCateVisible = true;
        this.CateList = res.data.data;
      });
    },
    // 分类改变的时候触发函数
    parentCate() {
      if (this.selectedKeys.length === 0) {
        this.addForm.cat_pid = 0;
        this.addForm.cat_level = 0;
      } else {
        this.addForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1];
        this.addForm.cat_level = this.selectedKeys.length;
      }
    },
    // 添加分类
    add() {
      this.$refs.add.validate((val) => {
        if (!val) return;
        this.$axios.post("categories", this.addForm).then((res) => {
          // console.log(res);
          if (res.data.meta.status !== 201)
            return this.$message.error(res.data.meta.msg);
          this.$message.success(res.data.meta.msg);
          this.dialogCateVisible = false;
          this.xr();
          this.clear();
        });
      });
    },
    // 删除分类
    del(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios.delete(`categories/${id}`).then((res) => {
            // console.log(res);
            if (res.data.meta.status !== 200)
              return this.$message.error(res.data.meta.msg);
            this.$message.success(res.data.meta.msg);
            this.dialogCateVisible = false;
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
    // 打开编辑分类对话框
    edit(row) {
      this.editForm = row;
      this.dialogEditVisible = true;
    },
    // 编辑分类
    editCate() {
      this.$refs.edit.validate((val) => {
        if (!val) return;
        this.$axios
          .put(`categories/${this.editForm.cat_id}`, this.editForm)
          .then((res) => {
            // console.log(res);
            if (res.data.meta.status !== 200)
              return this.$message.error(res.data.meta.msg);
            this.$message.success(res.data.meta.msg);
            this.dialogEditVisible = false;
            this.xr();
          });
      });
    },
    // 清空
    clear() {
      (this.addForm = {
        cat_pid: 0,
        cat_name: "",
        cat_level: 0,
      }),
        (this.selectedKeys = []);
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
