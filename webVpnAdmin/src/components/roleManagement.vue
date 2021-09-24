<template>
  <div class="roleManagement">
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
      添加角色
      <i class="el-icon-upload el-icon--right"></i>
    </el-button>

    <!-- 添加角色/编辑角色弹出框 -->
    <el-dialog
      :title="isAddRole == true ? '添加角色' : '编辑角色'"
      v-model="dialogFormVisible"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            placeholder="请输入角色名称"
            v-model="ruleForm.roleName"
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
    <!-- 添加角色/编辑角色弹出框 -->

    <!-- 绑定角色弹出框 -->
    <el-dialog title="绑定资源" v-model="bindRes">
      <div style="text-align: center">
        <el-transfer
          v-model="checkedRes"
          style="text-align: left; display: inline-block"
          filterable
          :render-content="renderFunc"
          :titles="['角色列表', '绑定角色']"
          :button-texts="['取消', '绑定']"
          :format="{
            // 列表顶部勾选状态文案
            noChecked: '${total}',
            hasChecked: '${checked}/${total}',
          }"
          :data="data"
          @change="handleChange"
        >
        </el-transfer>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="bindRes = false">取 消</el-button>
          <el-button type="primary" @click="bindResFun()">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 绑定角色弹出框 -->

    <el-table
      :data="
        currenttableData.filter(
          (data) =>
            !search ||
            data.role_name.toLowerCase().includes(search.toLowerCase())
        )
      "
      style="width: 100%"
      :border="true"
    >
      <el-table-column label="角色名称" prop="role_name"> </el-table-column>
      <el-table-column label="绑定资源">
        <template #default="scope">
          <i class="el-icon-check"></i>
          <span style="margin-left: 10px">{{
            MappingResourceName(scope.row.role_res_id_list)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template #header>
          <el-input
            v-model="search"
            size="mini"
            placeholder="输入角色名称搜索"
          />
        </template>
        <template #default="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >编辑名称</el-button
          >
          <el-button
            size="mini"
            type="primary"
            @click="resourceBundle(scope.$index, scope.row)"
            >资源绑定</el-button
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
  name: "roleManagement",
  data() {
    return {
      BreadcrumbList: [],
      tableData: [], // 所有数据
      currenttableData: [], // 当前页数据
      search: "",
      total: 0, //总条数
      pageSize: 10,
      currentPage: 1,
      isAddRole: "", // 是否添加角色
      dialogFormVisible: false, // 是否展示 添加/编辑 弹出框
      EditRoleId: "", // 修改角色id
      bindRes: false, // 绑定角色弹出框
      data: [], // 角色所有数据
      checkedRes: [], // 绑定值：当前已选择角色（右边）
      renderFunc(h, option) {
        // 自定义渲染
        return h("span", null, option.key, " - ", option.label);
      },
      bindResList: [], // 绑定角色数组
      ruleForm: {
        roleName: "",
      },
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 绑定函数
    bindResFun() {
      console.log(this.bindResList);
      this.$fetch
        .bindRes({
          role_res_id_list: this.checkedRes.toString(),
          role_id: this.EditRoleId,
        })
        .then((res) => {
          console.log(res);
          if (res.success) {
            this.bindRes = false;
            this.randerList();
            this.$message({ type: "success", message: res.message });
          }
        });
    },
    // 绑定资源选择回调
    handleChange(value, direction, movedKeys) {
      console.log(value, direction, movedKeys);
      this.bindResList = this.bindResList.concat(value);
    },
    // 绑定资源弹出框
    resourceBundle(index, row) {
      this.EditRoleId = row.role_id;
      // 导入已选择id
      console.log(row);
      if (row.role_res_id_list) {
        this.checkedRes = row.role_res_id_list.split(",").map(Number);
      } else {
        this.checkedRes = [];
      }
      this.bindRes = true;
    },
    // 添加角色弹出框
    addRole() {
      this.dialogFormVisible = true;
      this.isAddRole = true;
      this.ruleForm.roleName = "";
    },
    // 编辑角色
    handleEdit(index, row) {
      this.dialogFormVisible = true;
      this.isAddRole = false;
      this.ruleForm.roleName = row.role_name;
      this.EditRoleId = row.role_id;
      console.log(index, row);
    },
    // 提交添加角色
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isAddRole) {
            this.$fetch
              .addRole({
                role_name: this.ruleForm.roleName,
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
              .modRole({
                role_name: this.ruleForm.roleName,
                role_id: this.EditRoleId,
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
    // 删除角色
    handleDelete(index, row) {
      this.$fetch
        .roleBindUser({
          role_id: row.role_id,
        }).then((res) => {
          if (res.success && res.data.length > 0) {
            this.$message({
              type: "error",
              message:
                '角色"' +
                row.role_name +
                '"已绑定用户,请解除绑定用户在进行删除',
            });
          } else {
            this.$confirm("确定删除该角色吗?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                this.$fetch
                  .delRole({
                    role_id: row.role_id,
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
          }
        });
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
      this.$fetch.roleList().then((res) => {
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
    // 映射资源名称
    MappingResourceName(res) {
      var resList = res.split(",");
      var MappingResourceName = [];
      resList.forEach((element) => {
        this.data.forEach((resEle) => {
          if (element == resEle.key) {
            MappingResourceName.push(resEle.label);
          }
        });
      });

      return MappingResourceName;
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

    // 获取资源列表信息
    this.$fetch.ResList({}).then((res) => {
      if (res.success) {
        for (let i = 0; i < res.data.length; i++) {
          this.data.push({
            key: res.data[i].res_id,
            label: res.data[i].res_name,
            disabled: false,
          });
        }

        // 渲染列表
        this.randerList();
      }
    });
  },
};
</script>

<style scoped lang="scss">
.roleManagement {
  box-sizing: border-box;
  padding: 0 260px 120px 0;
  width: 100%;
  height: 100%;
  display: inline-block;
  overflow-y: scroll;
  .labelNav {
    padding-bottom: 30px;
  }
  .block {
    text-align: center;
    padding: 30px;
  }
}
</style>