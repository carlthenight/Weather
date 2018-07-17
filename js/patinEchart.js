
//加载Echart画图
function patainEchart(data) {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('chart-days'));

// 指定图表的配置项和数据
    var myChart = echarts.init(document.getElementById('chart-days'));
    // 指定图表的配置项和数据
    var option = {
        backgroundColor: "rgba(0,0,0,0.0)",
        color: ["#FCC370", "#94CCF9"],
        animation: !1,
        tooltip: {
            show: !1
        },
        xAxis: {
            type: "category",
            show: false,
            data:  ['','','','','','','',''],
            boundaryGap: ["45%", "45%"],
            scale: !0
        },
        yAxis: {
            type: 'value',
            show: false,
        },
        grid: {
            left:0,
            top:40,
            height: 174,
            width: 1200,
            borderWidth: "0px"
        },
        series: [{
            data:  [41, 44, 43, 41, 40, 41, 42, 41],
            type: 'line',
            smooth: true,
            symbol: "circle",
            symbolSize: 8,
            clipOverflow: !1,
            lineStyle: {
                normal: {
                    width: 3
                }
            },
            label: {
                normal: {
                    show: !0,
                    textStyle: {
                        fontSize: "18",
                        color: "#384C78"

                    },
                    distance: 10,
                    formatter: function(t) {
                        return 0 == t.dataIndex ? "{first|" + t.data + "\xb0}" : t.data + "\xb0"
                    },
                    rich: {
                        first: {
                            fontSize: "18",
                            color: "#C2C2C2"
                        }
                    }
                }
            }
        },

            {
                data: [29, 32, 30, 29, 28, 30, 31,30],
                type: 'line',
                smooth: true,
                symbol: "circle",
                symbolSize: 8,
                lineStyle: {
                    normal: {
                        width: 3
                    }
                },
                label: {
                    normal: {
                        show: !0,
                        position: "bottom",
                        textStyle: {
                            fontSize: "18",
                            fontFamily: "\u5fae\u8f6f\u96c5\u9ed1",
                            color: "#555555"
                        },
                        distance: 10,
                        formatter: function(t) {
                            return 0 == t.dataIndex ? "{first|" + t.data + "\xb0}" : t.data + "\xb0"
                        },
                        rich: {
                            first: {
                                fontSize: "18",
                                fontFamily: "\u5fae\u8f6f\u96c5\u9ed1",
                                color: "#C2C2C2"
                            }
                        }
                    }
                }
            }]
    };
    //绘制
    myChart.setOption(option);
}