<template>
  <div class="UserManagement">
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
    <!-- 添加用户/编辑用户弹出框 -->
    <el-dialog
      :title="isAddUser == true ? '添加用户' : '编辑用户'"
      v-model="dialogFormVisible"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="ruleForm"
      >
        <el-form-item label="用户名称" prop="userName">
          <el-input
            placeholder="请输入用户名称"
            v-model="ruleForm.userName"
            maxlength="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户账号" prop="userAccount">
          <el-input
            placeholder="请输入用户账号"
            v-model="ruleForm.userAccount"
            :maxlength="8"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="isAddUser == true ? '用户密码' : '重置密码'"
          prop="userPassword"
        >
          <el-input
            placeholder="请输入密码"
            v-model="ruleForm.userPassword"
            type="password"
            show-password
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
    <!-- 添加用户/编辑用户弹出框 -->

    <!-- 绑定角色弹出框 -->
    <el-dialog title="绑定角色" v-model="bindRole">
      <div style="text-align: center">
        <el-transfer
          v-model="checkedRole"
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
          @left-check-change="leftCheckChang"
        >
        </el-transfer>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="bindRole = false">取 消</el-button>
          <el-button type="primary" @click="bindRoleFun()">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 绑定角色弹出框 -->

    <el-button type="primary" style="margin-bottom: 20px" @click="addUser()">
      添加用户
      <i class="el-icon-upload el-icon--right"></i>
    </el-button>
    <el-table
      :data="
        currenttableData.filter(
          (data) =>
            !search ||
            data.user_number.toLowerCase().includes(search.toLowerCase())
        )
      "
      :border="true"
      style="width: 100%"
    >
      <el-table-column label="用户账号" prop="user_number"> </el-table-column>
      <el-table-column label="用户名称" prop="user_name"> </el-table-column>
      <el-table-column label="绑定角色">
        <template #default="scope">
          <i class="el-icon-check"></i>
          <span style="margin-left: 10px">{{
            MappingRoleName(scope.row.user_role_id)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template #header>
          <el-input
            v-model="search"
            size="mini"
            placeholder="输入账号关键数字搜索"
          />
        </template>
        <template #default="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button size="mini" type="primary" @click="bindingRole(scope.$index, scope.row)"
            >绑定角色</el-button
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
    <!-- 分页器 -->
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
  name: "UserManagement",
  data() {
    // 校验方法
    var Account = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("账号不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(Number(value))) {
          callback(new Error("请输入数字值"));
        } else {
          callback();
        }
      }, 1000);
    };

    return {
      BreadcrumbList: [], // 标签栏
      tableData: [], // 所有数据
      currenttableData: [], // 当前页数据
      search: "",
      total: 0, //总条数
      pageSize: 10, // 默认每页打小
      currentPage: 1, // 当前页
      dialogFormVisible: false, // 添加/修改弹出框展示
      isAddUser: "", // 是否是添加用户
      EditUserId: "", // 编辑用户id
      bindRole: false, // 绑定角色弹出框
      data: [], // 角色所有数据
      checkedRole: [], // 绑定值：当前已选择角色（右边）
      renderFunc(h, option) {
        // 自定义渲染
        return h("span", null, option.key, " - ", option.label);
      },
      bindRoleList: [], // 绑定角色数组
      ruleForm: {
        userName: "",
        userAccount: "",
        userPassword: "",
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
        ],
        userAccount: [{ required: true, validator: Account, trigger: "blur" }],
        userPassword: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 穿梭组件左边选择/取消回调
    leftCheckChang(selectAll, value){
      // 选中角色大于等于1个时，其他选项 禁止选择
      if(selectAll.length >= 1){
        this.data.map(ele=>{
          if(ele.key == value){
            ele.disabled = false;
          } else{
            ele.disabled = true;
          }
        })
      } else{
        // 没有选中角色，所有可选
        this.data.map(ele=>{
          ele.disabled = false;
        })
      }
    },
    // 绑定函数
    bindRoleFun() {
      console.log(this.bindRoleList.length);
      if (this.bindRoleList.length > 1) {
        this.$message({ type: "error", message: "一个用户只能绑定一个角色" });
      } else {
        this.$fetch
          .bindRole({
            role_id: (this.bindRoleList.length == 0) ? -1 : this.bindRoleList[0],
            user_id: this.EditUserId,
          })
          .then((res) => {
            console.log(res);
            if (res.success) {
              this.bindRole = false;
              this.randerList();
              this.$message({ type: "success", message: res.message });
            }
          });
      }
    },
    // 绑定角色选择回调
    handleChange(value, direction, movedKeys) {  // eslint-disable-line no-unused-vars
      // 穿梭组件 左右 回调
      if(direction == 'left'){
        // 选择向左穿梭时，右边为空，左边全部为可选状态
        this.data.map(ele=>{
          ele.disabled = false;
        })
      } else{
        // 选择向右穿梭时，右边选中标签可操作，右边禁止选择（只能选择一个角色）
        this.data.map(ele=>{
          if(ele.key == value[0]){
            ele.disabled = false;
          } else{
            ele.disabled = true;
          }
        })
      }
      
      this.bindRoleList = value;
    },
    // 绑定角色弹出框
    bindingRole(index, row) {
      this.EditUserId = row.user_id;
      // 导入已选择id，row.user_role_id 不为-1时表示有绑定角色
      if (row.user_role_id != -1) {
        // 绑定已选择数据
        this.checkedRole = [row.user_role_id];
        // 绑定角色可操作（只能绑定一个角色），未绑定角色禁止选择
        this.data.map(ele=>{
          if(ele.key == row.user_role_id){
            ele.disabled = false;
          } else{
            ele.disabled = true;
          }
        })

      } else {
        // 没有绑定数据，赋值为空数组
        this.checkedRole = [];
      }
      this.bindRole = true;
    },
    // 编辑角色
    handleEdit(index, row) {
      console.log(index, row);
      this.dialogFormVisible = true;
      this.isAddUser = false;
      this.ruleForm.userName = row.user_name;
      this.ruleForm.userAccount = row.user_number;
      this.EditUserId = row.user_id;
    },
    // 添加用户弹出框
    addUser() {
      this.dialogFormVisible = true;
      this.isAddUser = true;
      this.ruleForm.userName = "";
      this.ruleForm.userAccount = "";
      this.ruleForm.userPassword = "";
    },
    // 删除角色
    handleDelete(index, row) {
      console.log(index, row);
      this.$confirm("确定删除该账号吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$fetch
            .userDelete({
              user_id: row.user_id,
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
    },
    // 修改每页大小
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.currenttableData = this.tableData.slice(
        (this.currentPage - 1) * val,
        this.currentPage * val
      );
    },
    // 修改当前页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currenttableData = this.tableData.slice(
        (val - 1) * this.pageSize,
        val * this.pageSize
      );
    },
    // 提交添加/编辑用户
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isAddUser) {
            this.$fetch
              .userAdd({
                user_name: this.ruleForm.userName,
                user_number: this.ruleForm.userAccount,
                user_pwd_md5: this.$md5(this.ruleForm.userPassword),
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
              .userEdit({
                user_id: this.EditUserId,
                user_name: this.ruleForm.userName,
                user_number: this.ruleForm.userAccount,
                user_pwd_md5: this.$md5(this.ruleForm.userPassword),
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
    // 渲染用户表格
    randerList() {
      this.$fetch.userList().then((res) => {
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
    MappingRoleName(roleId) {
      var MappingRoleName = '';
      this.data.forEach((RoleEle) => {
        if (roleId == RoleEle.key) {
          MappingRoleName = RoleEle.label;
          return false;
        }
      });
      return MappingRoleName;
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

    // 获取角色信息
    this.$fetch.roleList({}).then((res) => {
      if (res.success) {
        for (let i = 0; i < res.data.length; i++) {
          this.data.push({
            key: res.data[i].role_id,
            label: res.data[i].role_name,
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
.UserManagement {
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