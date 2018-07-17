//原生JS写的切换
/*function nextHourWeartherPage() {
     if(document.getElementById("tq-weather").style.marginLeft=="" || document.getElementById("tq-weather").style.marginLeft=="0px" ){
         document.getElementById("tq-weather").style.marginLeft="-1100px";
     }else if(document.getElementById("tq-weather").style.marginLeft=="-1100px"){
         document.getElementById("tq-weather").style.marginLeft="-1400px";
     }else if(document.getElementById("tq-weather").style.marginLeft=="-300px"){
         document.getElementById("tq-weather").style.marginLeft="-1400px";
     }
 }
 function upHourWeartherPage() {
     if(document.getElementById("tq-weather").style.marginLeft=="-1400px" ){
         document.getElementById("tq-weather").style.marginLeft="-1100px";
     }else if(document.getElementById("tq-weather").style.marginLeft=="-300px" || document.getElementById("tq-weather").style.marginLeft=="-1100px"){
         document.getElementById("tq-weather").style.marginLeft="0px";
     }
 }*/
var timestart;
var timeend;
//jQuery Ready()
$(document).ready(function () {

    showCityInfo();
    //按时的天气翻页
    $("#btn-next").click(function () {
        if ($("#tq-weather").css("margin-left") == "" || $("#tq-weather").css("margin-left") == "0px") {
            $("#tq-weather").css("margin-left", "-1100px");
        } else if ($("#tq-weather").css("margin-left") == "-1100px") {
            $("#tq-weather").css("margin-left", "-1400px")
        } else if ($("#tq-weather").css("margin-left") == "-300px") {
            $("#tq-weather").css("margin-left", "-1400px")
        }
    });
    $("#btn-prev").click(function () {
        if ($("#tq-weather").css("margin-left") == "-1400px") {
            $("#tq-weather").css("margin-left", "-1100px")
        } else if ($("#tq-weather").css("margin-left") == "-300px" || $("#tq-weather").css("margin-left") == "-1100px") {
            $("#tq-weather").css("margin-left", "0px")
        }

    });


    //显示搜索热门城市
    $(".form-control").focus(function () {
        $("#tq-hot-city").css("display", "block");
    });

    $(".form-control").blur(function(){
        setTimeout(function(){
            // input框失去焦点，隐藏下拉框
            $(".form-control").val("");
            $("#tq-hot-city").css("display", "none");
            $("#ls-match").css("display", "none").empty();
        }, 150);
    });

    //监听搜索框变化
    var timeoutId = 0;
    $('.form-control').off('keyup').on('keyup', function (event) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(function () {
            var data = $(".form-control").val();
            if(data != ""){
                searchByName(data);
            }else{
                $("#ls-match").css("display", "none").empty();
                $("#tq-hot-city").css("display", "block");
            }
         }, 1000);
    });

    //绑定搜索栏地点点击事件
    $("#tq-search").on("click","li,#cur-location",function(){
        _cityName = $(this).attr("data-city")
        timestart =  new Date().getTime()
        //获取主模块天气信息
        getWeatherMain(_cityName);
        //获取天气质量
        getAqi(_cityName);
        //获取分时天气
        getDivisionWeather(_cityName)
        //获取七天天气
        getServenDayWeather(_cityName);
        $("#tq-hot-city").css("display", "none");
        $("#ls-match").css("display", "none").empty();
    });

});


//方法定义

/**ajax开始**/
/***********/
//搜索栏通过名字寻找城市
function searchByName(cityName){
    $.ajax({
        url:"http://localhost:8080/city/searchCity?cityName="+cityName,
        success:function (result) {
            $("#ls-match").css("display", "block");
            $("#tq-hot-city").css("display", "none");
            console.log(result);
            result = JSON.parse(result);
            var info=null;
            if (typeof(result) != "undefined" && result!="{\"data\":[]}") {
                for(var i=0;i<result.data.length;i++) {
                    info = result.data;
                    console.log("this is searchByName ajax:" +info[i].cityName);
                    $("#ls-match").append("<li class=\"item\" data-city=\""+ info[i].cityName + "\">" + info[i].cityName + "</li>")
                }
            }
        }
    });
}

//获取主模块天气信息
function getWeatherMain(_cityName) {
    $.ajax({
        url:"http://localhost:8080/weather/getByName?cityName="+ _cityName,
        success:function (result) {
            console.log("WeatherMain AJAX:" + _cityName);
            result = JSON.parse(result);
            //console.log(result.data.weatherMain.degree);
            mainInit(result,_cityName);
        }
    });
}


//获取天气质量
function  getAqi(_cityName) {
    $.ajax({
        url:"http://localhost:8080/weather/getAqi?cityName="+ _cityName,
        success:function (result) {
            console.log("aqi AJAX:" + _cityName);
            result = JSON.parse(result);
            //console.log(result.data.weatherMain.degree);
            aqiInit(result,_cityName);
        }
    });
}

//获取分时天气预报
function getDivisionWeather(_cityName) {
    $.ajax({
        url:"http://localhost:8080/weather/getDivisionWeather?cityName="+ _cityName,
        success:function (result) {
            console.log("DivisionWeather AJAX:" + _cityName);
            result = JSON.parse(result);
            console.log(result);
            divisionWeatherInit(result, _cityName);
        }
    });
}

//获取七天天气预报
function getServenDayWeather(_cityName) {
    $.ajax({
        url:"http://localhost:8080/weather/getSevenDays?cityName="+ _cityName,
        success:function (result) {
            console.log("SevenDaysWeather AJAX:" + _cityName);
            result = JSON.parse(result);
            console.log(result);
            sevenDayWeatherInit(result, _cityName);
        }
    });
}

/***********/
/**ajax结束**/

/**init模块开始**/
/***********/
//主模块数据初始化
function mainInit(_data,_cityName) {
    $("#txt-cur-location,#cur-location").text(_cityName);

    //取出值
    var info = _data.data.weatherMain;

    var txt_pub_time = info.update_time;
    var txt_temperature = info.degree;
    var txt_name = info.weather;
    var txt_wind = info.wind_direction + "  " + info.wind_power;
    var txt_humidity = info.humidity;

    //判断天气图片类型
    //图片地址:  ./img/day/02.png
    var current_weather_src = "./img/day/" + imgPicker(txt_name) + ".png";

    $("#txt-pub-time").text("中央气象台  "+ txt_pub_time +"发布");
    $("#txt-temperature").text(txt_temperature + "°");
    $("#txt-name").text(txt_name);
    $("#txt-wind").text(txt_wind + "级");
    $("#txt-humidity").text("湿度  " + txt_humidity + "%");
    $("#tq-current-weather img").attr("src",current_weather_src);

    console.log("MaininitDone");
}

//天气质量初始化
function aqiInit(_data,_cityName) {
    console.log("get into the AqiInit and cityName = "  + _cityName );

    //取出值
    var info = _data.data.aqi;

    var aqi_level = info.aqi_level;
    var info_aqi = info.aqi + " " + info.aqi_name;
    var header_aqi = "空气质量指数 "+ info.aqi + " " + " " + info.aqi_name;
    var co = info.co;
    var no2 = info.no2;
    var pm10 = info.pm10;
    var pm2 = info.pm2;
    var so2 = info.so2;

    $("#tq-aqi").removeClass().addClass("air-level"+ aqi_level);
    $(".info-aqi").text(info_aqi);
    $(".header").text(header_aqi);
    $("#tb-detail").empty().append(
        "<table id=\"tb-detail\"><tbody><tr class=\"line1\"><td><p class=\"val\">"+ pm2 +"</p><p class=\"titl\">PM2.5</p></td><td class=\"nth-2\"><p class=\"val\">" + pm10 +"</p><p class=\"titl\">PM10</p></td><td><p class=\"val\">" + so2 +"</p><p class=\"titl\">SO2</p></td></tr><tr><td><p class=\"val\">" + no2 + "</p><p class=\"titl\">NO2</p></td><td class=\"nth-2\"></td><td><p class=\"val\">" + co +"</p><p class=\"titl\">CO</p></td></tr></tbody></table>"
    );

    console.log("aqiInitDone");

}
//分时天气初始化
function divisionWeatherInit(_data,_cityName) {

    var info = _data.data.divisionWeather;

    var divisionWindowRoot = $("#ls-weather-hour");

    divisionWindowRoot.empty();

    for(var i=0;i<info.length;i++){
        //判断天气图片类型
        //图片地址:  ./img/day/02.png
        var weather = info[i].weather;
        var current_weather_src = "./img/day/" + imgPicker(weather) + ".png";

        divisionWindowRoot.append("<li class=\"item\"><p class=\"txt-time\">" + info[i].weather_time.substr(3,2) + ":00</p><img src=\""+ current_weather_src +"\" alt=\""+ weather +"\" title=\"" + weather + "\" class=\"icon\"><p class=\"txt-degree\">" + info[i].temperature + "°</p></li>"
        );
    }

    timeend = new Date().getTime();
    console.log("DivisionWeatherInitDone");
    var timeuse = timeend-timestart;
    console.log("loading time is:"+ timeuse);
}

//七天天气初始化
function sevenDayWeatherInit(_data,_cityName) {

    //获取数据
    var info = _data.data.sevenDaysWeather;

    console.log(info);

    //获取七天天气根节点
    var sevenDaysRoot = $("#ls-weather-day");

    sevenDaysRoot.empty();

    var hight = new Array();
    var low = new Array();
    for(var i=0;i<info.length;i++){
        var item;
        if(i==0){
            item ="item first";
        }else if(i==1){
            item ="item second";
        }else{
            item ="item";
        }

        var weather_day  = info[i].weather_day;
        var weather_night = info[i].weather_night;
        var weather_src_day = "./img/day/" + imgPicker(weather_day) + ".png";
        var weather_src_night = "./img/night/" + imgPicker(weather_night) + ".png"

        var date = info[i].date;
        var date_name = getDateName(date);
        console.log("返回"+ date_name);

        var wind_info = info[i].wind_direction + " " + info[i].wind_power + "级";
        hight[i]= info[i].temperature_High;
        low[i] = info[i].temperature_Low;
        sevenDaysRoot.append("<li class=\""+ item +"\"><p class=\"day\">"+ date_name +"</p><p class=\"date\">07月"+ date + "日</p><div class=\"tq-daytime\"><p class=\"weather\">"+ weather_day +"</p><img class=\"icon\" src=\""+ weather_src_day + "\"alt=\"" + weather_day + "\" title=\"" + weather_day + "\"></div><div class=\"tq-night\"><img class=\"icon\" src=\"" + weather_src_night + "\" alt=\""+ weather_night + "\" title=\""+ weather_night +"\"><p class=\"weather\">" + weather_night+ "</p></div><p class=\"wind\">" + wind_info + "</p></li>"
        );
    }
    //把高低分开放到echarData中.

    var echartData = new Array();
    echartData[0] =  hight;
    echartData[1] =  low;
    patainEchart(echartData);
    console.log("SevenDaysWeatherInitDone");
}

function FirstInit(_cityName) {

    _cityName = _cityName.substr(0,_cityName.length-1)

    console.log(_cityName);
    getWeatherMain(_cityName);
    //获取天气质量
    getAqi(_cityName);
    //获取分时天气
    getDivisionWeather(_cityName)
    //获取七天天气
    getServenDayWeather(_cityName);

}

function showCityInfo() {
    //实例化城市查询类
    var citysearch = new AMap.CitySearch();
    //自动获取用户IP，返回当前城市
    citysearch.getLocalCity(function(status, result) {
        if (status === 'complete' && result.info === 'OK') {
            if (result && result.city && result.bounds) {
                var cityinfo = result.city;
                console.log(cityinfo);
                FirstInit(cityinfo);
            }
        } else {
            console.log(result.info);
        }
    });
}

/***********/
/**init模块结束**/

//返回日期
function getDateName(_date) {
    var dayName = ["昨天","今天","明天"];
    var weekday=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];

    //昨天的日期
    var day1 = new Date();
    day1.setDate(day1.getDate() - 1);
    var yesterday = day1.getDate();
    //今天的日期
    var day2 = new Date();
    var today = day2.getDate();
    //明天的日期
    var day3 = new Date();
    day3.setDate(day3.getDate() + 1);
    var tomorrow = day3.getDate();
    //将_data装入 Date();
    var day4 = new Date();
    day4.setDate(_date);
    var defaultDate = day4.getDay();

    console.log("昨天"+typeof(yesterday)+"今天"+typeof(today)+"明天"+typeof(tomorrow)+"defaDate"+typeof(defaultDate)+"传入:"+typeof(_date));

    console.log("-昨天:"+yesterday+"-今天:"+today+"-明天:"+tomorrow+"-defaDate:"+defaultDate+"-传入:"+_date);

    _date = parseInt(_date);

    switch (_date){
        case yesterday :
            return dayName[0];
        break;

        case today :
            return dayName[1];
        break;

        case tomorrow :
            return dayName[2];
        break;

        default :
            return weekday[defaultDate];
        break;
    }
}

//返回图片标志;
function imgPicker(_weather) {
    switch (_weather){
        case "晴" :
            return "00";
            break;
        case "多云" :
            return "01";
            break;
        case "阴" :
            return "02";
            break;
        case "阵雨" :
            return "03";
            break;
        case "雷阵雨" :
            return "04";
            break;
        case "雷阵雨伴有冰雹" :
            return "05";
            break;
        case "雨夹雪" :
            return "06";
            break;
        case "小雨" :
            return "07";
            break;
        case "中雨" :
            return "08";
            break;
        case "大雨" :
            return "09";
            break;
        case "暴雨" :
            return "10";
            break;
        case "大暴雨" :
            return "11";
            break;
        case "特大暴雨" :
            return "12";
            break;
        case "阵雪" :
            return "13";
            break;
        case "小雪" :
            return "14";
            break;
        case "中雪" :
            return "15";
            break;
        case "大雪" :
            return "16";
            break;
        case "暴雪" :
            return "17";
            break;
        case "雾" :
            return "18";
            break;
        case "冻雨" :
            return "19";
            break;
        case "沙尘暴" :
            return "20";
            break;
        case "小到中雨" :
            return "21";
            break;
        case "中到大雨" :
            return "22";
            break;
        case "大到暴雨" :
            return "23";
            break;
        case "暴到大暴雨" :
            return "24";
            break;
        case "大暴到特大暴雨" :
            return "25";
            break;
        case "小到中雪" :
            return "26";
            break;
        case "中到大雪" :
            return "27";
            break;
        case "大到暴雪" :
            return "28";
            break;
        case "浮尘" :
            return "29";
            break;
        case "扬沙" :
            return "30";
            break;
        case "强沙尘暴" :
            return "31";
            break;
        case "霾" :
            return "32";
            break;
        default:
            return "";
            break;
    }
}

//加载Echart画图
function patainEchart(_data) {
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
            data:  _data[0],
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
                data: _data[1],
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

