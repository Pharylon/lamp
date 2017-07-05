var fs = require('fs');

var saveFileLoc = "~/.lampConfig";
if (process.env.APPDATA) {
    saveFileLoc = process.env.APPDATA + "\\.lampConfig";
}

var settings = null;

module.exports = {
    getSettings: function (callback) {
        if (settings) {
            callback(settings);
        }
        else {
            fs.readFile(saveFileLoc, function (err, data) {
                if (err) {
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
                return console.log(err);
            }
            settings = newSettings;
            if (callback){
                callback(newSettings);
            }            
        });
    },
}
