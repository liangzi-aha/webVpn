<template>
  <div class="login_module">
    <div style="margin: 0 20px">
      <p class="web-font">webVpn</p>

      <!-- 管理员登录标签内容 -->
      <div class="login_content">
        <el-form
        :model="adminRuleForm"
        status-icon
        :rules="adminRules"
        ref="adminRuleForm"
        label-width="100px"
      >
        <el-form-item label-width="0" prop="adminAccount">
          <el-input
            placeholder="请输入管理员账号"
            v-model="adminRuleForm.adminAccount"
          >
            <template #prepend>
              <avatar style="width: 1em; height: 1em; margin-right: 8px" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label-width="0" prop="adminPassword">
          <el-input
            placeholder="请输入管理员密码"
            show-password
            autocomplete="new-password"
            v-model="adminRuleForm.adminPassword"
          >
            <template #prepend>
              <Promotion style="width: 1em; height: 1em; margin-right: 8px" />
            </template>
          </el-input>
        </el-form-item>
        <div style="overflow: hidden">
          <el-checkbox v-model="adminChecked" class="checkbox"
            >记住密码</el-checkbox
          >
        </div>
        <el-button
          class="login"
          size="medium"
          type="primary"
          @click="adminLogin('adminRuleForm')"
          >登录
        </el-button>
      </el-form>
      </div>
    </div>
    <div class="navTable">
      <!-- <span @click="forgetPassword()">忘记密码</span> -->
      <!-- <span><router-link to="/login/register">注册</router-link></span> -->
    </div>
  </div>
</template>


<script>
import { Avatar, Promotion } from "@element-plus/icons";

export default {
  name: "LoginCommon",
  components: {
    Avatar,
    Promotion,
  },
  data() {
    // 校验方法
    var Account = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("账号不能为空"));
      }
      setTimeout(() => {
        callback();
      }, 1000);
    };
    var Password = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };

    return {
      // 管理员表单数据
      adminRuleForm: {
        adminAccount: "",
        adminPassword: "",
      },
      // 管理员数据校验规则
      adminRules: {
        adminAccount: [{ validator: Account, trigger: "blur" }],
        adminPassword: [{ validator: Password, trigger: "blur" }],
      },
      adminChecked: false,
    };
  },
  mounted() {
    // 判断本地是否保存密码
    var adminAccount = this.$getCookie("adminAccount");
    if (adminAccount) {
      this.adminChecked = true;
      this.adminRuleForm.adminAccount =
        this.$token.verify(adminAccount).decoded.Account;
      this.adminRuleForm.adminPassword =
        this.$token.verify(adminAccount).decoded.password;
    }
  },
  methods: {
    // 管理员登录
    adminLogin(formName) {
      // 校验表单数据
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$fetch
            .adminLogin({
              name: this.adminRuleForm.adminAccount,
              pwd_md5: this.$md5(this.adminRuleForm.adminPassword),
            })
            .then((res) => {
              if (res.success) {
                this.$message({ message: "登录成功", type: "success" });
                // 调用记住密码功能
                if (this.adminChecked) {
                  this.rememberPassword("admin");
                } else {
                  this.$delCookie("adminAccount");
                }

                this.$router.push("/");
              }
            });
        }
      });
    },
    // 记住密码
    rememberPassword(type) {
      if (type == "admin") {
        // 管理员账号
        var adminToken = this.$token.create({
          Account: this.adminRuleForm.adminAccount,
          password: this.adminRuleForm.adminPassword,
          admin: true,
        });
        this.$setCookie("adminAccount", adminToken, 1);
      }
    },
  },
};
</script>

<style lang="scss">
.login_module {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 450px;
  height: 380px;
  margin: auto;
  background-color: #f4f5f7 !important;
  border-radius: 5px;
  padding: 15px 0;
  box-sizing: border-box;
  .login_content{
    margin-top: 40px;
  }
  p {
    text-align: center;
    padding: 15px 0 10px;
    margin-bottom: 10px;
    font-size: 30px;
  }
  .checkbox {
    float: left;
    vertical-align: middle;
    padding: 10px;
  }
  .login {
    display: block;
    margin: auto;
  }
  .navTable {
    position: absolute;
    bottom: -28px;
    color: white;
    width: 100%;
    & > span:nth-child(1) {
      float: left;
    }
    & > span:nth-child(2) {
      float: right;
    }
    a {
      text-decoration: none;
      color: #f4f5f7;
    }
  }
}
</style>