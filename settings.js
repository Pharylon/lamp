var fs = require('fs');
var path = require("path");

var saveFileLoc = path.join(__dirname, "settings.json");
//if (process.env.APPDATA) {
//    saveFileLoc = process.env.APPDATA + "\\.lampConfig";
//}

console.log("Settings file location is: " + saveFileLoc);

var settings = null;

module.exports = {
    getSettings: function (callback) {
        if (settings) {
            callback(settings);
        }
        else {
            fs.readFile(saveFileLoc, function (err, data) {
                if (err) {
                    console.log("Error reading settings: ", err);
                    callback(false);
                }
                else{
                    settings = JSON.parse(data);
                    callback(settings);
                }                
            })
        }
    },

    saveSettings: function (newSettings, callback) {
        var json = JSON.stringify(newSettings);
        fs.writeFile(saveFileLoc, json, function (err) {
            if (err) {
                return console.log("Error saving settings: ", err);
            }
            settings = newSettings;
            if (callback){
                callback(newSettings);
            }            
        });
    },
}
