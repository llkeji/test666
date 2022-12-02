<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin: 10px 0">
      <!-- 头部 -->
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
        <el-button type="primary" @click="addGoodsDialogVisible = true"
          >添加商品</el-button
        >
      </div>
      <!-- 商品列表 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" min-width="300">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="160px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="edit(scope.row)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              @click="delGoods(scope.row.goods_id)"
              icon="el-icon-delete"
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
          :page-sizes="[5, 10, 20, 30, 50]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
    <!-- 添加 -->
    <el-dialog title="添加商品" :visible.sync="addGoodsDialogVisible">
      <el-form
        label-position="right"
        label-width="auto"
        :model="addForm"
        :rules="rules"
        ref="formRef"
        class="formBody"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="addForm.goods_name"> </el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="addForm.goods_price"> </el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="addForm.goods_number"> </el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="addForm.goods_weight"> </el-input>
        </el-form-item>
        <el-form-item label="商品图片">
          <div style="text-align: left">
            <el-upload
              class="upload-demo"
              :action="uploadUrl"
              :headers="headersObj"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addGoodsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addGoods">添 加</el-button>
      </div>
    </el-dialog>

    <!-- 编辑 -->
    <el-dialog title="编辑商品" :visible.sync="editGoodsDialogVisible">
      <el-form
        label-position="right"
        label-width="auto"
        :model="editForm"
        :rules="rules"
        ref="formRef"
        class="formBody"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editForm.goods_name"> </el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editForm.goods_price"> </el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="editForm.goods_number"> </el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editForm.goods_weight"> </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editGoodsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoods">添 加</el-button>
      </div>
    </el-dialog>

    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible">
      <el-form label-position="right">
        <el-form-item label="图片预览">
          <div class="box">
            <img :src="previewPath" style="width: 100%" />
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="previewVisible = false">取 消</el-button>
        <el-button type="primary" @click="previewVisible = false"
          >确 定</el-button
        >
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
        pagesize: 10, // 每页显示条数
      },
      // 分类总页数
      total: 0,
      // 数据列表
      goodsList: [],
      // 添加表单
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        pics: [],
      },
      // 图片上传地址
      uploadUrl: "http://shiyansong.cn:8888/api/private/v1/upload",
      // 请求头
      headersObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      // 编辑表单
      editForm: {},
      // 对话框
      addGoodsDialogVisible: false,
      editGoodsDialogVisible: false,
      previewVisible: false,
      // 图片预览路径
      previewPath: "",
      // 验证规则
      rules: {
        goods_name: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: ["blur", "change"],
          },
        ],
        goods_price: [
          {
            required: true,
            message: "请输入商品价格",
            trigger: ["blur", "change"],
          },
        ],
        goods_number: [
          {
            required: true,
            message: "请输入商品数量",
            trigger: ["blur", "change"],
          },
        ],
        goods_weight: [
          {
            required: true,
            message: "请输入商品重量",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  methods: {
    // 渲染列表
    getGoods() {
      this.$axios.get("goods", { params: this.queryInfo }).then((res) => {
        // console.log(res);
        if (res.data.meta.status !== 200) {
          this.$message.error(res.data.meta.msg);
          return;
        }
        this.$message.success(res.data.meta.msg);
        this.goodsList = res.data.data.goods;
        this.total = res.data.data.total;
      });
    },
    // 添加
    addGoods() {
      this.$refs.formRef.validate((val) => {
        if (!val) return;
        this.$axios.post("goods", this.addForm).then((res) => {
          // console.log(res);
          if (res.data.meta.status !== 201) {
            this.$message.error(res.data.meta.msg);
            return;
          }
          this.$message.success(res.data.meta.msg);
          // 成功隐藏弹框
          this.addGoodsDialogVisible = false;
          // 重新向服务器发送用户列表的请求，获取最新的数据
          this.getGoods();
          this.clear();
        });
      });
    },
    // 删除
    delGoods(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios.delete(`goods/${id}`).then((res) => {
            // console.log(res);
            if (res.data.meta.status !== 200) {
              this.$message.error(res.data.meta.msg);
              return;
            }
            this.$message.success(res.data.meta.msg);
            // 重新向服务器发送用户列表的请求，获取最新的数据
            this.getGoods();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 编辑
    edit(row) {
      this.editForm = row;
      this.editGoodsDialogVisible = true;
    },
    // 编辑提交
    editGoods() {
      this.$refs.formRef.validate((val) => {
        if (!val) return;
        this.$axios
          .put(`goods/${this.editForm.goods_id}`, this.editForm)
          .then((res) => {
            // console.log(res);
            if (res.data.meta.status !== 200) {
              this.$message.error(res.data.meta.msg);
              return;
            }
            this.$message.success(res.data.meta.msg);
            // 成功隐藏弹框
            this.editGoodsDialogVisible = false;
            // 重新向服务器发送用户列表的请求，获取最新的数据
            this.getGoods();
          });
      });
    },
    // 搜索
    search() {
      this.queryInfo.pagenum = 1;
      this.getGoods();
    },
    // 清空
    clear() {
      this.addForm = {
        goods_name: "",
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        pics: {},
      };
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getGoods();
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getGoods();
      // console.log(`当前页: ${val}`);
    },
    // 处理图片预览效果
    handlePreview(file) {
      // console.log(file);
      this.previewPath = file.url;
      this.previewVisible = true;
    },
    // 处理移除图片的操作
    handleRemove(file) {
      // 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path;
      // 从pics数组中，找到图片对应的索引值
      const i = this.addForm.pics.findIndex((x) => x.pic === filePath);
      //调用数组的splice方法，删除对应的图片
      this.addForm.pics.splice(i, 1);
      // console.log(this.addForm);
    },
    // 监听图片上传成功的事件
    handleSuccess(response) {
      // console.log(response);
      // 拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path };
      // 将图片信息对象push到pics数组中
      this.addForm.pics.push(picInfo);
    },
  },
  created() {
    this.getGoods();
  },
};
</script>
