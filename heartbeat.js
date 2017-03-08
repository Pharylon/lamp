var server = process.env.NODE_ENV === "development" ? "http://localhost:56027" : "http://pharylon.com"
var path = server + "/api/lamp/heartbeat";
var request = require('request');

var os = require('os');
var ifaces = os.networkInterfaces();

module.exports = function(){
  getIp(function(ip){
    if (!ip){
      return false;
    }
    var myPath = path + "?ip=" + ip;
    console.log("Sending heartbeat to " + myPath);
    request.get(myPath);
    return true;
  });  
}

function getIp(callback){
  Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;
  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }
    if (alias >= 1 && iface && iface.address) {
      // this single interface has multiple ipv4 addresses
      console.log(ifname + ':' + alias, iface.address);
      callback(iface.address);
    } else if (iface && iface.address) {
      // this interface has only one ipv4 adress
      console.log(ifname, iface.address);
      callback(iface.address);
    }
    ++alias;
  });
});
  return address;
}