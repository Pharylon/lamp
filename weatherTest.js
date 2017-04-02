var weather = require("./weather");
weather.getTemperature = function(zip, callback){
    if (callback){
        callback(70);
    }    
}

weather.getTemperatureColors("28021", function(temp){
    console.log(temp);
});