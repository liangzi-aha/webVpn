<template>
  <div class="ResultManagement">
    <div class="labelNav">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item
          v-for="(item, index) in BreadcrumbList"
          :to="{ path: item.path }"
          :key="index"
          >{{ item.name }}</el-breadcrumb-item
        >
      </el-breadcrumb>
    </div>

    <el-button type="primary" style="margin-bottom: 20px" @click="addRole()">
      添加资源
      <i class="el-icon-upload el-icon--right"></i>
    </el-button>

    <!-- 添加资源/编辑资源弹出框 -->
    <el-dialog
      :title="isAddRes == true ? '添加资源' : '编辑资源'"
      v-model="dialogFormVisible"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="ruleForm"
      >
        <el-form-item label="资源名称" prop="resName">
          <el-input
            placeholder="请输入资源名称"
            v-model="ruleForm.resName"
          ></el-input>
        </el-form-item>
        <el-form-item label="资源代理url" prop="resUrl">
          <el-input
            placeholder="请输入资源代理url"
            v-model="ruleForm.resUrl"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
    <!-- 添加资源/编辑资源弹出框 -->

    <el-table
      :data="
        currenttableData.filter(
          (data) =>
            !search ||
            data.res_name.toLowerCase().includes(search.toLowerCase())
        )
      "
      style="width: 100%"
      :border="true"
    >
      <el-table-column label="资源名称" prop="res_name"> </el-table-column>
      <el-table-column label="资源代理url" prop="res_url"> </el-table-column>
      <el-table-column label="资源访问url" prop="chg_res_url"> </el-table-column>
      <el-table-column align="right">
        <template #header>
          <el-input
            v-model="search"
            size="mini"
            placeholder="输入资源名称搜索"
          />
        </template>
        <template #default="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >编辑名称</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        v-model:currentPage="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="sizes, prev, pager, next"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "ResultManagement",
  data() {

    var resUrl = (rule, value, callback) =>{  // eslint-disable-line no-unused-vars
      var reg= /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~/])+$/;   // eslint-disable-line no-unused-vars
      if(reg.test(value)){
        return callback();
      } else{
        return callback(new Error("输入错误，这不是一个网址"));
      }
    }

    return {
      BreadcrumbList: [],
      tableData: [], // 所有数据
      currenttableData: [], // 当前页数据
      search: "",
      total: 0, //总条数
      pageSize: 10,
      currentPage: 1,
      isAddRes: "", // 是否添加资源
      dialogFormVisible: false, // 是否展示 添加/编辑 弹出框
      EditRoleId: "", // 修改资源id
      ruleForm: {
        resName: "",
        resUrl: "",
      },
      rules: {
        resName: [
          { required: true, message: "请输入资源名称", trigger: "blur" },
        ],
        resUrl: [
          { required: true,  validator: resUrl, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 添加资源弹出框
    addRole() {
      this.dialogFormVisible = true;
      this.isAddRes = true;
      this.ruleForm.resName = "";
      this.ruleForm.resUrl = "";
    },
    // 编辑资源
    handleEdit(index, row) {
      this.dialogFormVisible = true;
      this.isAddRes = false;
      this.ruleForm.resName = row.res_name;
      this.ruleForm.resUrl = row.res_url;
      this.EditRoleId = row.res_id;
      console.log(index, row);
    },
    // 提交添加资源
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isAddRes) {
            this.$fetch
              .addResource({
                res_name: this.ruleForm.resName,
                res_url: this.ruleForm.resUrl,
              })
              .then((res) => {
                if (res.success) {
                  this.dialogFormVisible = false;
                  this.$message({ type: "success", message: res.message });
                  this.randerList();
                }
              });
          } else {
            this.$fetch
              .modResource({
                res_name: this.ruleForm.resName,
                res_url: this.ruleForm.resUrl,
                res_id: this.EditRoleId,
              })
              .then((res) => {
                if (res.success) {
                  this.dialogFormVisible = false;
                  this.$message({ type: "success", message: res.message });
                  this.randerList();
                }
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 删除资源
    handleDelete(index, row) {
      this.$confirm("确定删除该资源吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$fetch
            .delResource({
              res_id: row.res_id,
            })
            .then((res) => {
              if (res.success) {
                this.$message({ type: "success", message: res.message });
                this.randerList();
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
      console.log(index, row);
    },
    // 切换每页表格展示数量
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.currenttableData = this.tableData.slice(
        (this.currentPage - 1) * val,
        this.currentPage * val
      );
    },
    // 切换当前页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currenttableData = this.tableData.slice(
        (val - 1) * this.pageSize,
        val * this.pageSize
      );
    },
    // 渲染列表
    randerList() {
      this.$fetch.ResList().then((res) => {
        if (res.success) {
          this.total = res.data.length;
          this.tableData = res.data;
          // 默认展示第一页数据
          this.currenttableData = this.tableData.slice(
            (this.currentPage - 1) * this.pageSize,
            this.currentPage * this.pageSize
          );
        }
      });
    },
  },
  mounted() {
    // 获取路由meta上的 name 和 path
    this.$route.meta.path.map((ele, index) => {
      this.BreadcrumbList.push({
        name: this.$route.meta.name.split("/")[index],
        path: ele,
      });
    });

    // 渲染列表
    this.randerList();
  },
};
</script>

<style scoped lang="scss">
.ResultManagement {
  box-sizing: border-box;
  padding: 0 260px 120px 0;
  width: 100%;
  height: 100%;
  display: inline-block;
  overflow-y: scroll;
  .labelNav {
    padding-bottom: 30px;
  }
  .block{
    text-align: center;
    padding: 30px;
  }
}
</style>