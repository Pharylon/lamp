module.exports = function getMimeType(url){
  if (url.indexOf(".") === -1){
    return "text/plain";
  }
  else{
    var split = url.split('.');
    var extension = split[split.length - 1];
    if (extension === "js"){
      return "text/javascript";
    }
    if (extension === "html"){
      return "text/html";
    }
    if (extension === "css"){
      return "text/css";
    }
    return "text/plain"
  }
  
}