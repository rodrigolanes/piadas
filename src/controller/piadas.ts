var express = require("express");
var router = express.Router();
var db = require("../db/db");

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  next();
});
// define the home page route
router.get("/", function(req, res) {
  db.MongoDbConnect((err, db) => {
    if (err) console.error(err);
    db.collection("piadas")
      .find({})
      .toArray(function(err, results) {
        console.log("erro:", err);
        console.log("resultado:", results); // output all records
      });
  });
});
// define the about route
router.get("/about", function(req, res) {
  res.send("About birds");
});

module.exports = router;
