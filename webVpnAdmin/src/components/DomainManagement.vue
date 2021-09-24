<template>
  <div class="DomainManagement">
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
    
    <div class="DomainManagement_center">
      <el-input
        placeholder="请输入登录域名"
        v-model="input1"
        style="width: 50%"
      >
        <template #prepend>Http://</template>
        <template #append>.com</template>
      </el-input>
      <el-button style="margin-left: 20px" type="primary">保存/编辑</el-button>

      <div class="upFile">
          <!-- 上传域名证书文件 -->
        <el-upload
          class="upload"
          ref="upload"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          :auto-upload="false"
          :multiple="false"
          :limit="1"
        >
          <template #trigger>
            <el-button size="small" type="primary">选取文件</el-button>
          </template>
          <el-button
            style="margin-left: 10px"
            size="small"
            type="success"
            @click="submitUpload"
            >上传到服务器</el-button
          >
          <template #tip>
            <div class="el-upload__tip">上传域名证书文件</div>
          </template>
        </el-upload>
        <!-- 上传域名私钥文件 -->
        <el-upload
          class="upload"
          ref="upload"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          :auto-upload="false"
          :multiple="false"
          :limit="1"
        >
          <template #trigger>
            <el-button size="small" type="primary">选取文件</el-button>
          </template>
          <el-button
            style="margin-left: 10px"
            size="small"
            type="success"
            @click="submitUpload"
            >上传到服务器</el-button
          >
          <template #tip>
            <div class="el-upload__tip">上传域名私钥文件</div>
          </template>
        </el-upload>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DomainManagement",
  data() {
    return {
      BreadcrumbList: [], // 面包屑数据
      fileList: [], // 上传图片信息
    };
  },
  mounted() {
    // 获取路由meta上的 name 和 path
    this.$route.meta.path.map((ele, index) => {
      this.BreadcrumbList.push({
        name: this.$route.meta.name.split("/")[index],
        path: ele,
      });
    });
  },
  methods: {
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
  },
};
</script>

<style scoped lang="scss">
.DomainManagement {
  box-sizing: border-box;
  padding: 0 260px 120px 0;
  width: 100%;
  height: 100%;
  display: inline-block;
  overflow-y: scroll;
  .DomainManagement_center {
    margin: 20px 0;
    border: solid 1px #d4cece;
    box-sizing: border-box;
    padding: 40px;
    width: 100%;
    .upFile {
      width: 50%;
      margin-top: 30px;
      .upload {
        padding: 15px 10px;
        border: solid 1px #cac4c4;
        margin-bottom: 10px;
      }
    }
  }
}
</style>