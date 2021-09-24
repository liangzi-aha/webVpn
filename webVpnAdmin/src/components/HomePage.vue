<template>
  <div class="HomePage">
    <div style="margin-bottom: 30px">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item
          v-for="(item, index) in BreadcrumbList"
          :to="{ path: item.path }"
          :key="index"
          >{{ item.name }}</el-breadcrumb-item
        >
      </el-breadcrumb>
    </div>

    <el-row>
      <el-col id="myChart"></el-col>
    </el-row>
    <!-- <div id="myChart"></div> -->
    <!-- 和风天气预报插件 -->
    <!-- <iframe src="https://widget-page.qweather.net/h5/index.html?md=0123456&bg=1&lc=accu&key=86faa987095c46d384873c96505cbe12&v=_1630134658480" frameborder="0"></iframe> -->
  </div>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {
      BreadcrumbList: [],
      echartsContainer:'',
    };
  },
  methods: {
    randerTable() {
      if(this.echartsContainer != null && this.echartsContainer != "" && this.echartsContainer != undefined){
        console.log('销毁图表')
        this.echartsContainer.dispose(); 
      }

      console.log('渲染表格');

      this.echartsContainer = this.$echarts.init(document.getElementById("myChart"));
      // 绘制图表
      this.echartsContainer.setOption({
        title: {
          text: "未来一周气温变化",
          subtext: "纯属虚构",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["最高气温", "最低气温"],
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: "none",
            },
            dataView: { readOnly: false },
            magicType: { type: ["line", "bar"] },
            restore: {},
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value} °C",
          },
        },
        series: [
          {
            name: "最高气温",
            type: "line",
            data: [10, 11, 13, 11, 12, 12, 9],
            markPoint: {
              data: [
                { type: "max", name: "最大值" },
                { type: "min", name: "最小值" },
              ],
            },
            markLine: {
              data: [{ type: "average", name: "平均值" }],
            },
          },
          {
            name: "最低气温",
            type: "line",
            data: [1, -2, 2, 5, 3, 2, 0],
            markPoint: {
              data: [{ name: "周最低", value: -2, xAxis: 1, yAxis: -1.5 }],
            },
            markLine: {
              data: [
                { type: "average", name: "平均值" },
                [
                  {
                    symbol: "none",
                    x: "90%",
                    yAxis: "max",
                  },
                  {
                    symbol: "circle",
                    label: {
                      position: "start",
                      formatter: "最大值",
                    },
                    type: "max",
                    name: "最高点",
                  },
                ],
              ],
            },
          },
        ],
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

    this.$nextTick(()=>{
      // 渲染图表
      this.randerTable();
    })
  },
};
</script>

<style scoped lang="scss">
.HomePage {
  box-sizing: border-box;
  padding: 0 260px 120px 0;
  width: 100%;
  height: 100%;
  display: inline-block;
  overflow-y: scroll;
  iframe {
    width: 100%;
    height: 100%;
    margin: 20px 0;
  }
  #myChart {
    width: 800px;
    height: 800px;
  }
}
</style>