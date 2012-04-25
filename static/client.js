q.ready(function() {
  if (typeof window.EventSource == "undefined") {
    return;
  }
  var eventSource = new EventSource("/eventsource");
  
  /*
  eventSource.addEventListener('message', function(e) {
    console.log(e.data);
  }, false);

  eventSource.addEventListener('open', function(e) {
    console.log("Connected to event source");
  }, false);

  eventSource.addEventListener('error', function(e) {
    if (e.readyState == EventSource.CLOSED) {
    console.log("Event source connection closed");
    }
  }, false);
  */
  
  eventSource.addEventListener('testsuitechange', function(e) {
    var el = document.getElementById("tests-script");
    if (el) {
      el.parentElement.removeChild(el);
    }
    el = document.createElement("script");
    el.id = "tests-script";
    el.type = "text/javascript";
    el.src = e.data;
    document.body.appendChild(el);
    
  }, false);
  
});