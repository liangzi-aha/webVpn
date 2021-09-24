<template>
  <div class="Login">
    <div class="navigation">
      <span class="web-font" style="font-size: 25px"> webVpn </span>
      <!-- <el-button icon="el-icon-truck" size="medium">登录</el-button> -->
    </div>
    <router-view></router-view>
    <div class="bg-gradient-default">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span class="animate__animated animate__backInLeft">
        <img :src="qiqi" alt="" />
      </span>
      <span>
        <img class="animate__animated animate__zoomInDown" :src="keli" alt="" />
      </span>
    </div>
  </div>
</template>

<script>
import qiqi from "../assets/img/qiqi.png";
import keli from "../assets/img/keli.png";

export default {
  name: "Login",
  components:{
    
  },
  data() {
    return {
      qiqi: qiqi,
      keli: keli
    };
  },
  mounted(){
    // this.$message('啦啦啦')
  }
};
</script>

<style scoped lang="scss">
.Login {
  .navigation {
    padding: 20px 0;
    color: white;
    line-height: 40px;
    overflow: hidden;
    span {
      float: left;
      margin-left: 100px;
    }
    button {
      float: right;
      margin-right: 100px;
    }
  }
  
  .bg-gradient-default {
    position: absolute;
    top: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    background: linear-gradient(87deg, #172b4d 0, #1a174d 100%) !important;
    & > span {
      height: 120px;
      width: 120px;
      border-radius: 50%;
      position: absolute;
    }
    & > :nth-child(1) {
      left: -4%;
      bottom: auto;
      background: rgba(255, 255, 255, 0.1);
    }
    & > :nth-child(2) {
      right: 4%;
      top: 10%;
      background: rgba(255, 255, 255, 0.1);
    }
    & > :nth-child(3) {
      top: 280px;
      right: 5.66666%;
      background: rgba(255, 255, 255, 0.1);
    }
    & > :nth-child(4) {
      top: 320px;
      right: 7%;
      background: rgba(255, 255, 255, 0.1);
    }
    & > :nth-child(5) {
      top: 38%;
      left: 1%;
      right: auto;
      background: rgba(255, 255, 255, 0.1);
    }
    & > :nth-child(6) {
      width: 200px;
      height: 200px;
      top: 44%;
      left: 10%;
      right: auto;
      background: rgba(255, 255, 255, 0.1);
    }
    & > :nth-child(7) {
      bottom: 50%;
      right: 36%;
      background: rgba(255, 255, 255, 0.1);
    }
    & > :nth-child(8) {
      bottom: 70px;
      right: 2%;
      background: rgba(255, 255, 255, 0.1);
    }
    & > :nth-child(9) {
      img {
        width: 180px;
      }
      top: 100px;
      left: 8%;
    }
    & > :nth-child(10) {
      img {
        width: 180px;
      }
      top: 480px;
      right: 8%;
    }
  }
}
</style>
