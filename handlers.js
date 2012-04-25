var fs = require('fs');

/*
var static = require('node-static');
var fileServer = new(static.Server)("./static", {
    cache: 600
});
*/

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

function tests(request, response) {
  fs.readFile('tests.js', function(err, data) {
    if (err) {
      console.error("Could not open file: %s", err);
      response.writeHead(500, {"Content-Type": "text/plain"});
      response.write("Internal Server Error");
    }
    else {
      response.writeHead(200, {"Content-Type": "application/javascript"});
      response.write(data);
    }
    response.end();
  });
}

/*
function serveStatic(request, response) {
  req.addListener('end', function() {
    fileServer.serve(req, res, function(err, result) {
      if (err) {
        console.error('Error serving %s - %s', req.url, err.message);
        if (err.status === 404 || err.status === 500) {
          file.serveFile(util.format('/%d.html', err.status), err.status, {}, req, res);
        } else {
          res.writeHead(err.status, err.headers);
          res.end();
        }
      } else {
        console.log('%s - %s', req.url, res.message);
      }
    });
  });
}
*/

function eventSource(request, response) {
  /*
  for (var key in request.headers) {
    console.log(key + ': ' + request.headers[key]);
  }
  */
  
  var fileName = "tests.js";
  
  console.log("watching", fileName);
  
  response.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive"
  });
  
  
  fs.watchFile(fileName, function (curr, prev) {
    var eventType = 'update';
    
    console.log("file changed");
    
    fs.readFile(fileName, function(err, data) {
      //console.log("file content\n", data.toString());
      var responseText = [
        'event:' + eventType,
        'data:' + curr.mtime
      ].join("\n") + "\n\n";
      response.write(responseText);
    });
    
  });
  
}

exports.notFound = notFound;
exports.index = index;
exports.eventsource = eventSource;
exports.tests = tests;
//exports.static = serveStatic;