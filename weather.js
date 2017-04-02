var http = require('http');

var url = "http://api.openweathermap.org/data/2.5/weather?zip=28021,us&appid=85278d8f4b15c3cd088fbb1488845963&units=imperial";

var breakPoints = [
    { min: 100, red: 255, green: 0, blue: 0 },
    { min: 70, red: 255, green: 255, blue: 0 },
    { min: 50, red: 0, green: 255, blue: 0 },
    { min: 32, red: 0, green: 0, blue: 255 }
];

var myExport = {
    getTemperature: function (callback) {
        http.get(url, function (response) {
            var str = "";
            response.on("data", function (chunk) {
                str += chunk;
            });

            response.on("end", function () {
                var data = JSON.parse(str);
                console.log("Current temperature is: " + data.main.temp);
                if (callback) {
                    callback(data.main.temp);
                }
            });
        });
    },

    getTemperaturColors: function (callback) {
        myExport.getTemperature(function (temp) {
            temp = Math.round(temp);
            if (temp > breakPoints[0].min) {
                callback(breakPoints[0]);
                return;
            }
            else if (temp < breakPoints[breakPoints.length - 1].min){
                callback(breakPoints[breakPoints.length - 1]);
                return;
            }
            else{
                for (var i = 1; i < breakPoints.length; i++) {
                if (temp === breakPoints[i].min) {
                    callback(breakPoints[i]);
                    return;
                }
                if (temp > breakPoints[i].min) {
                    var minRange = breakPoints[i];
                    var maxRange = breakPoints[i - 1];
                    var returnObj = {
                        red: getBetweenColor(minRange.red, maxRange.red, temp, minRange.min, maxRange.min),
                        blue: getBetweenColor(minRange.blue, maxRange.blue, temp, minRange.min, maxRange.min),
                        green: getBetweenColor(minRange.green, maxRange.green, temp, minRange.min, maxRange.min)
                        };
                    callback(returnObj);
                    return;
                    }
                }                
            }
            
        });
    }
};

function getBetweenColor(colorStart, colorEnd, currentTemp, tempMin, tempMax) {
    if (colorStart === colorEnd){
        return colorStart;
    }
    var colorRange = Math.abs(colorStart - colorEnd);
    var tempRange = tempMax - tempMin;
    var colorSliceSize = colorRange / tempRange;
    var numOfColorIncrements;
    if (colorStart > colorEnd){
        numOfColorIncrements = tempMax - currentTemp;        
    }
    else{
        numOfColorIncrements = currentTemp - tempMin;        
    }
    return Math.round(colorSliceSize * numOfColorIncrements);
}

module.exports = myExport;