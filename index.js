var http = require("http");
var url = require("url");

var handlers = require("./handlers");

http.createServer(function(request, response) {
  var pathname = url.parse(request.url).pathname.substr(1);
  
  if (pathname in handlers) {
    handlers[pathname](request, response);
  }
  else if (pathname == "") {
    handlers.index(request, response);
  }
  else {
    handlers.notFound(request, response, pathname);
  }
}).listen(8888);
