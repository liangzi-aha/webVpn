import React from 'react';
import * as echarts from 'echarts';

export default class theme extends React.Component {

    componentDidMount() {
        var echartsContainer = echarts.init(document.getElementById("myChart"));
        // 绘制图表
        echartsContainer.setOption({
            tooltip: {
                trigger: "axis",
            },
            toolbox: {
                show: true,
                feature: {
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
    }


    render() {
        return (
            <div>
                <div id="myChart" style={{ width:'95%',height:'400px',margin: '20px 2.5% 0' }}></div>
            </div>
        )
    }
}