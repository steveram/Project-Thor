var sys = require('sys'),
    Db = require('mongodb').Db,
    Server = require('mongodb').Server;

var Storage = exports;

var DB_NAME = 'alltweets',
    DB_ADDESS = '127.0.0.1',
    DB_PORT = 27017;

Storage.save = function(coll_name, data) {
  var client = new Db(DB_NAME, new Server(DB_ADDESS, DB_PORT, {auto_connect: true}));

  client.open(function(p_client) {
    client.collection(coll_name, function(err, collection) {
      collection.insert(data, function(err, docs) {
        sys.puts('inserted ' + JSON.stringify(data) + '.');
        client.close();
      });
    });
  });
}


Storage.getTweetsInLastHour = function(coll_name, callback){
  var client = new Db(DB_NAME, new Server(DB_ADDESS, DB_PORT, {auto_connect: true}));

  var SINCE = [3600000]; //60 minutes
  
  client.open(function(p_client) {
    client.collection(coll_name, function(err, collection) {
      collection.find({'created_at':{$gt : new Date(+ (new Date().getTime() - 3600000))}},function(err, cursor){
          cursor.toArray(function(err, docs) {
              sys.puts("Returned #" + docs.length + " documents");
              if(typeof callback == "function") callback(docs)
              client.close();
        });
      });
    });
  });
}

Storage.getTweetsWithinViewPortInLast3Hours = function(coll_name, location, callback){
  var client = new Db(DB_NAME, new Server(DB_ADDESS, DB_PORT, {auto_connect: true}));
  
  var box =[[location.swLat, location.swLng], [location.neLat, location.neLng]];
    
  client.open(function(p_client) {
    client.collection(coll_name, function(err, collection) {
      collection.find({"loc" : {"$within" : {"$box" : box}}, 'created_at':{$gt : new Date(+ (new Date().getTime() - 10800000))}}, {loc: 1, checkedin: 1, id: 1, place_type:1, full_name: 1},function(err, cursor){
          cursor.toArray(function(err, docs) {
              sys.puts("Returned #" + docs.length + " documents");
              if(typeof callback == "function") callback(docs)
              client.close(); 
        });
      });
    });
  });
}

Storage.removeTweetsNotInLast3Hours = function(coll_name){
    var client = new Db(DB_NAME, new Server(DB_ADDESS, DB_PORT, {auto_connect: true}));
  
  client.open(function(p_client) {
    client.collection(coll_name, function(err, collection) {
      collection.remove({'created_at':{$lt : new Date(+ (new Date().getTime() - 10800000))}},function(err, cursor){
            client.close();
      });
    });
  });
}

Storage.getTweet = function(coll_name, args, callback){
    var client = new Db(DB_NAME, new Server(DB_ADDESS, DB_PORT, {auto_connect: true}));
  
  client.open(function(p_client) {
    client.collection(coll_name, function(err, collection) {
      collection.find({"id": args.id}, {image: 1, user: 1, text: 1, created_at: 1},function(err, cursor){
      cursor.toArray(function(err, docs) {
             if(typeof callback == "function") callback(docs)
             client.close();
          })
      });
    });
  });
}


