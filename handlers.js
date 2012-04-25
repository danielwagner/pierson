var fs = require('fs');
var util = require("util");

var static = require('node-static');
var fileServer = new(static.Server)("", {
  cache: 600
});

function notFound(request, response) {
  response.writeHead(404, {"Content-Type": "text/plain"});
  response.write('not found.');
  response.end();
}
  
function index(request, response) {
  fs.readFile('index.html', function(err, data) {
    if (err) {
      console.error("Could not open file: %s", err);
      response.writeHead(500, {"Content-Type": "text/plain"});
      response.write("Internal Server Error");
    }
    else {
      response.writeHead(200, {"Content-Type": "text/html"});
      response.write(data);
    }
    response.end();
  });
}

function serveStatic(request, response) {
  request.addListener('end', function() {
    fileServer.serve(request, response, function(err, result) {
      if (err) {
        console.error('Error serving %s - %s', request.url, err.message);
        if (err.status === 404 || err.status === 500) {
          fileServer.serveFile(util.format('/%d.html', err.status), err.status, {}, request, response);
        } else {
          response.writeHead(err.status, err.headers);
          response.end();
        }
      } else {
        console.log('%s - %s', request.url, response.message);
      }
    });
  });
}

function eventSource(request, response) {
  /*
  for (var key in request.headers) {
    console.log(key + ': ' + request.headers[key]);
  }
  */
  
  var fileName = "static/tests.js";
  
  console.log("watching", fileName);
  
  response.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive"
  });
  
  fs.watchFile(fileName, function (curr, prev) {
    var eventType = 'update';
    
    console.log(fileName, "changed");
    
    var responseText = [
        'event:' + eventType,
        'data:' + fileName
      ].join("\n") + "\n\n";
      response.write(responseText);
  });
  
}

exports.notFound = notFound;
exports.index = index;
exports.eventsource = eventSource;
exports.static = serveStatic;