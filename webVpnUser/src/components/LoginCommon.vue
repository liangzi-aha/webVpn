<template>
  <div class="login_module">
    <div style="margin: 0 20px">
      <p class="web-font">webVpn</p>

      <div class="login_content">
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
        >
          <el-form-item label-width="0" prop="account">
            <el-input
              placeholder="请输入账号"
              v-model="ruleForm.account"
              maxlength="8"
            >
              <template #prepend>
                <avatar style="width: 1em; height: 1em; margin-right: 8px" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label-width="0" prop="password">
            <el-input
              placeholder="请输入密码"
              show-password
              autocomplete="new-password"
              v-model="ruleForm.password"
            >
              <template #prepend>
                <Promotion style="width: 1em; height: 1em; margin-right: 8px" />
              </template>
            </el-input>
          </el-form-item>
          <div style="overflow: hidden">
            <el-checkbox v-model="checked" class="checkbox"
              >记住密码</el-checkbox
            >
          </div>
          <el-button
            class="login"
            size="medium"
            type="primary"
            @click="login('ruleForm')"
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
        if (!Number.isInteger(Number(value))) {
          callback(new Error("请输入数字值"));
        } else {
          callback();
        }
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
      // 普通用户表单数据
      ruleForm: {
        account: "",
        password: "",
      },
      // 用户校验规则
      rules: {
        account: [{ validator: Account, trigger: "blur" }],
        password: [{ validator: Password, trigger: "blur" }],
      },
      checked: false,
    };
  },
  mounted() {

    // 判断本地是否保存密码
    var userAccount = this.$getCookie("userAccount");
    if (userAccount) {
      this.checked = true;
      this.ruleForm.account = this.$token.verify(userAccount).decoded.Account;
      this.ruleForm.password = this.$token.verify(userAccount).decoded.password;
    }
  },
  methods: {
    // 普通用户登录
    login(formName) {
      // 校验表单数据
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("普通用户登录");
          // 发送请求
          this.$fetch
            .login({
              user_number: this.ruleForm.account,
              user_pwd_md5: this.$md5(this.ruleForm.password),
            })
            .then((res) => {
              if (res.success) {
                this.$message({ message: "登录成功", type: "success" });
                this.$setCookie('user_id',res.data.user_id,1);
                // 调用记住密码功能
                if (this.checked) {
                  this.rememberPassword("user");
                } else {
                  this.$delCookie("userAccount");
                }
                this.$router.push("/");
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 记住密码
    rememberPassword(type) {
      if (type == "user") {
        var userToken = this.$token.create({
          Account: this.ruleForm.account,
          password: this.ruleForm.password,
        });
        this.$setCookie("userAccount", userToken, 1);
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