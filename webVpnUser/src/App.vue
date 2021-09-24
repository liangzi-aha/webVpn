<template>
  <router-view/>
</template>

<style lang="scss">
*{
  margin: 0;
  padding: 0;
}
// 修改加载动画
.el-loading-spinner{
  background: url('../public/static/gif/webVpn.gif') no-repeat 50% 50% !important;
  // background-size: 50% !important;
}
.el-loading-spinner .circular{
  opacity: 0 !important;
}
.el-loading-text{
  color: rgb(179, 170, 170) !important;
}
// 修改加载动画
a{
  text-decoration: none;
  color: white;
}
html,body,#app{
  width: 100%;
  height: 100%;
}
// iconFont 字体
@font-face {
  font-family: "webfont";
  font-display: swap;
  src: url('../public/static/iconFont/webfont.eot'); /* IE9 */
  src: url('../public/static/iconFont/webfont.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('../public/static/iconFont/webfont.woff2') format('woff2'),
  url('../public/static/iconFont/webfont.woff') format('woff'), /* chrome、firefox */
  url('../public/static/iconFont/webfont.ttf') format('truetype'), /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
  url('../public/static/iconFont/webfont.svg#webfont') format('svg'); /* iOS 4.1- */
}

.web-font {
  font-family: "webfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
