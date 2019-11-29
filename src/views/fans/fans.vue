<template>
  <div>
    <div class="general">
      <el-card>
        <p>22,400</p>
        <span>粉丝数</span>
      </el-card>
      <el-card>
        <p>62,842</p>
        <span>粉丝阅读量</span>
      </el-card>
      <el-card>
        <p>1,852元</p>
        <span>粉丝收益</span>
      </el-card>
    </div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>粉丝概况</span>
      </div>
      <div class="text item">
        <div id="main" style="width:100%; height:400px"></div>
      </div>
    </el-card>
  </div>
</template>


<script>
// 在需要插入的组件中引入echarts图表文件
import echarts from "echarts";
export default {
  name: "Fans",
  // 由于mounted中，vue实例与div绑定并渲染完成，可以获得main占位符
  mounted() {
    this.paintPic();
  },
  methods: {
    //  设置echarts实例对象
    // 基于准备好的dom，初始化echarts实例
    paintPic() {
      var colors = ["#5793f3", "#333", "#675bba"];
      let myChart = echarts.init(document.getElementById("main"));
      myChart.setOption({
        color: colors,

        tooltip: {
          trigger: "none",
          axisPointer: {
            type: "cross"
          }
        },
        legend: {
          data: ["2019 粉丝量"]
        },
        grid: {
          top: 70,
          bottom: 50
        },
        xAxis: [
          {
            type: "category",
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: colors[1]
              }
            },
            axisPointer: {
              label: {
                formatter: function(params) {
                  return (
                    "粉丝量  " +
                    params.value +
                    (params.seriesData.length
                      ? "：" + params.seriesData[0].data
                      : "")
                  );
                }
              }
            },
            data: [
              "2019-1",
              "2019-2",
              "2019-3",
              "2019-4",
              "2019-5",
              "2019-6",
              "2019-7",
              "2019-8",
              "2019-9",
              "2019-10",
              "2019-11",
              "2019-12"
            ]
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "2019 粉丝量",
            type: "line",
            smooth: true,
            data: [
              399,
              595,
              811,
              787,
              483,
              692,
              236,
              466,
              554,
              1848,
              1030,
              2237
            ]
          }
        ]
      });
    }
  }
};
</script>

<style lang="less" scoped>
.el-card {
  box-shadow: none;
}
.general {
  width: 100%;
  display: flex;
  justify-content: space-between;
  text-align: center;
  margin-bottom: 20px;
  .el-card {
    width: 32%;
    p {
      font-weight: bold;
      font-size: 30px;
      margin: 20px 0;
      color: #409EFF;
    }
    span {
        font-size: 14px
    }
  }
}
</style>
