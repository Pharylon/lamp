
var path = require('path');
var devEnvironment = process.env.NODE_ENV === "development";
var pythonFile = path.join("python", devEnvironment ? "print.py" : "lamp.py");
var PythonShell = require('python-shell');


//Set color to red at boot
PythonShell.run(pythonFile, { args: [255, 0, 2] }, function(){});

module.exports = function(red, green, blue){
    PythonShell.run(pythonFile, { args: [red, green, blue] }, function (err, results) {
        if (err){
        console.error(err);
        }
        else{
        // results is an array consisting of messages collected during execution
        console.log('results: %j', results);
        }              
    });
};