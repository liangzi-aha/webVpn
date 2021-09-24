
<template>
  <div class="adminHome">
    <div class="home_nav">
      <div class="home_nav_top">
        <el-menu
          class="el-menu-demo"
          mode="horizontal"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <span class="web-font logo">webVpn</span>
          <el-sub-menu index="1">
            <template #title>
              <img class="defaultImgHead" :src="defaultImgHead" alt="" />
            </template>

            <el-menu-item index="1-1" @click="Logout()">退出登录</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="2">
            <template #title>友情链接</template>
            <el-menu-item index="2-1"><a href="https://www.bilibili.com" target="_blank">bilibili</a></el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>
      <div class="home_nav_left">
        <el-menu
          :uniqueOpened="true"
          :default-active="routerPath"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :collapse="false"
          :router="true"
        >
          <el-menu-item index="/admin">
            <Calendar style="width: 1.2em; height: 1.2em; margin-right: 8px" />
            <template #title>主题</template>
          </el-menu-item>
          <!-- <el-menu-item index="/admin/DomainManagement">
            <Baseball style="width: 1.2em; height: 1.2em; margin-right: 8px" />
            <template #title>域名管理</template>
          </el-menu-item> -->
          <el-menu-item index="/admin/ResultManagement">
            <Platform style="width: 1.2em; height: 1.2em; margin-right: 8px" />
            <template #title>资源管理</template>
          </el-menu-item>
          <el-menu-item index="/admin/roleManagement">
            <Bicycle style="width: 1.2em; height: 1.2em; margin-right: 8px" />
            <template #title>角色管理</template>
          </el-menu-item>
          <el-menu-item index="/admin/userManagement">
            <Avatar style="width: 1.2em; height: 1.2em; margin-right: 8px" />
            <template #title>用户管理</template>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="contentCenter">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import defaultImgHead from "../assets/img/keli.png";
import { Avatar, Bicycle, Platform,Calendar } from "@element-plus/icons";
      

export default {
  name: "adminHome",
  components: {
    Avatar,
    Bicycle,
    Platform,
    Calendar
  },
  data() {
    return {
      defaultImgHead,
      routerPath:''
    };
  },
  mounted(){
    console.log(this.$route.path)
    this.routerPath = this.$route.path
  },
  updated(){
    console.log(this.$route.path)
    this.routerPath = this.$route.path
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    // 退出登录
    Logout(){
      this.$fetch.admniOut({}).then(res=>{
        if(res.success){
          this.$message({type:'success',message: res.message});
          this.$delCookie('flwebvpn_admin_sessionid','.fengnever.icu');
          this.$router.push('/login');
        }
      })
    }
  },
};
</script>

<style scoped lang="scss">
.adminHome {
  height: 100%;
  overflow: hidden;
  .home_nav {
    height: 100%;
    overflow: hidden;
    .home_nav_left {
      height: 100%;
      float: left;
      width: 200px;
      & > ul {
        height: 100%;
      }
    }
    .home_nav_top {
      .logo {
        color: white;
        font-size: 30px;
        margin-left: 50px;
        line-height: 60px;
        display: inline-block;
      }
      .defaultImgHead {
        border-radius: 50%;
        width: 40px;
        border: solid 1px #c1b7b7;
        padding: 5px;
      }
      & > ul > li {
        float: right;
      }
    }
    .contentCenter {
      padding: 30px 40px;
      width: 100%;
      height: 100%;
      margin-left: 200px;
    }
  }
}
</style>>
