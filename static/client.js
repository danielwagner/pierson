window.onload = function() {
  if (typeof window.EventSource == "undefined") {
    return;
  }
  var eventSource = new EventSource("/eventsource");
  
  eventSource.addEventListener('testsuitechange', function(e) {
    var el = document.getElementById("tests-script");
    if (el) {
      el.parentElement.removeChild(el);
    }
    el = document.createElement("script");
    el.id = "tests-script";
    el.type = "text/javascript";
    el.src = e.data + "?nocache=" + new Date().getTime();
    document.body.appendChild(el);
    
  }, false);
  
};