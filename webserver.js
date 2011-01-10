HOST = null;
PORT = 8080;

var mem = process.memoryUsage();
// every 10 seconds poll for the memory.
setInterval(function () {
  mem = process.memoryUsage();
}, 10*1000);


var sys = require('sys'),
    storage = require('./storage.js'),
    foo = require("./server"),
    url = require("url"),
    qs = require("querystring")

GRANULARITY = "neighborhood";

//web server handlers
foo.listen(Number(process.env.PORT || PORT), HOST);

foo.get("/", foo.staticHandler("index.html"));

foo.get("/hotspots", function (req, res) {
    var swLat = parseFloat(qs.parse(url.parse(req.url).query).swLat),
        swLng = parseFloat(qs.parse(url.parse(req.url).query).swLng),
        neLat = parseFloat(qs.parse(url.parse(req.url).query).neLat),
        neLng = parseFloat(qs.parse(url.parse(req.url).query).neLng);

    storage.getTweetsWithinViewPortInLast3Hours('tweets', {swLat: swLat, swLng: swLng, neLat: neLat, neLng: neLng}, function(data){
        sys.puts(data.length);
        sys.puts(typeof data[0]);
        res.simpleJSON(200, {data: data, rss: mem.rss}); 
    });
});

foo.get("/images/tweet.png", foo.staticHandler("images/tweet.png"));
foo.get("/images/red.gif", foo.staticHandler("images/red.gif"));

