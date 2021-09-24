<template>
  <div class="userResource">
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

    <el-table
      :data="
        currenttableData.filter(
          (data) =>
            !search ||
            data.res_name.toLowerCase().includes(search.toLowerCase())
        )
      "
      :border="true"
      style="width: 100%"
    >
      <el-table-column label="资源名称" prop="res_name"> </el-table-column>
      <el-table-column label="资源url" prop="chg_res_url"> </el-table-column>
      <el-table-column align="right">
        <template #header>
          <el-input
            v-model="search"
            size="mini"
            placeholder="输入资源名称搜索"
          />
        </template>
        <template #default="scope">
          <el-button size="mini" type="primary">
            <a
              :href="scope.row.chg_res_url"
              target="_blank"
              rel="noopener noreferrer"
            >
              跳转url
            </a>
          </el-button>
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
  name: "userResource",
  data() {
    return {
      BreadcrumbList: [], // 标签栏
      tableData: [], // 所有数据
      currenttableData: [], // 当前页数据
      search: "",
      total: 0, //总条数
      pageSize: 10, // 默认每页打小
      currentPage: 1, // 当前页
      data: [], // 用户资源所有数据
    };
  },
  methods: {
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
    // 渲染用户表格
    randerList() {
      this.$fetch
        .user_get_resource({
          user_id: Number(this.$getCookie('user_id')),
        })
        .then((res) => {
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
      var MappingRoleName = "";
      this.data.forEach((RoleEle) => {
        if (roleId == RoleEle.key) {
          MappingRoleName = RoleEle.label;
          return false;
        }
      });
      return MappingRoleName;
    }
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
.userResource {
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