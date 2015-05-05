var MongoClient = require('mongodb').MongoClient, 
assert = require('assert');
//connection uri
var uri = "mongodb://localhost:27017/firstapp"

MongoClient.connect(uri, function(err, db){
    assert.equal(null, err);
    console.log("Connected correctly to server");

    db.close();
});


var insertDocuments = function(db, cb){
    //we don't need to explicitly create a collection 
    var collection = db.collection('myCollection');
    collection.insertMany([
        {"mongodb": "is just awesome"},
        {"nodejs": "so awesome"}
        ], function(err, result){
            assert.equal(null, err);
            //inserted 2 documents
            assert.equal(2, result.result.n);
            //invoke callback
            cb(result);
        });
}

var removeDocument = function(db, cb){
    var collection = db.collection("myCollection");
    collection.removeOne( {"users": "nleite"},
        function( err, result){
            assert.equal(null, err);
            assert.equal(1, result.result.n);
            console.log("purged the @nleite contaminated data!");
            cb(result);
    });
}


var updateDocument = function(db, cb){
    var collection = db.collection("myCollection");
    collection.updateOne( {"mongodb": "is just awesome"},
        {$set: {"users": ["nleite"]}}, function( err, result){
            assert.equal(null, err);
            assert.equal(1, result.result.n);
            console.log("Cool, just updated");
            cb(result);
    });
}

var findAllDocuments = function(db, cb){
    var collection = db.collection('myDocuments');
    //or collection.find()
    collection.find({}).toArray(function(err, docs){
        assert.equal(err, null);
        assert.equal(1, docs.length);

        console.log("Gotcha! found "+ docs.length);
        console.dir(docs);
        cb(docs);
    });
}



var insertDifferentShapes = function(db, cb){
    var doc1 = {"name": "Norberto", "talks": [
        {"nodejs":10}, {"java":15}, {"python":11}]};
    var doc2 = {"name": "Bryan", "webinars": 30};
    var coll = db.collection("content")
    coll.insertMany( [doc1, doc2], function(err, result){
        assert.equal(err, null);
        assert.equal(2, result.result.n);

        console.log("Sweet, inserted "+ result.result.n);
        cb(result);
    });
}


var insertSuperImportant = function(db, cb){
    var customer = {"name": "Manny Delgado", "age": 14};
    var coll = db.collection("customers");

    var writeConcern = {"w": "majority"};

    col.insertOne( customer, writeConcern, function(err, result){
        assert.equal(err, null);
        assert.equal(1, result.result.n);

        console.log("Inserted super important record");
        cb(result);
    });
}


var updateNormal = function(skuId, db, cb){
    var coll = db.collection("products");

    var incrementLike = {$set: {$inc:{ "like": 1 }}};
    var query = {"sku_id": skuId};

    coll.updateOne( query, incrementLike, function(err, result){
        assert.equal(err, null);
        assert.equal(1, result.result.n);

        console.log("Update relaxed operation");
        cb(result);
    });
}


var readNearest = function(db, cb){
    var rp = ReadPreference.NEAREST;

    var coll = db.collection("products", {ReadPreference:rp});

    var query = {"color": "water melon green"};
    collection.find(query, rp).toArray(function(err, docs){
        assert.equal(err, null);
        assert.equal(1, docs.length);

        console.log("So many products: "+ docs.length);
        console.dir(docs);
        cb(docs);
    });
}


var aggregateAvgAgeGender = function( db, cb){
    //{age:XX, name:"user name", gender: "M/F"}
    var pipeline = [
        {$match:{"age": {"$gt": 18}}},
        {$group: { "_id": "$gender", avg_age: {"$avg": "$age"}}},
        {$project:{"ID": "$_id", }}
    ];
    var coll = db.collection("users");
    coll.aggregate(pipeline, function( err, cursor){
        assert.equal(err, null);
        cursor.forEach( function(x){
            console.log("Gender " + x._id + " age average of " + x.avg_age)});
        cb(cursor);
    });
}



MongoClient.connect(uri, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  insertDocuments(db, function() {
    db.close();
  });
});


MongoClient.connect(uri, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  aggregateAvgAgeGender(db, function() {
    db.close();
  });
});





