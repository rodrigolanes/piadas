var express = require("express");
var router = express.Router();
import * as config from "config";

const Piada = require("../model/Piada");

const page_limit = config.get("Pagination.page_limit");

router.get("/", function(req, res, next) {
  const page = +req.query.page || 0;
  const limit = +req.query.limit || page_limit;

  const query = {};

  Piada.find(query)
    .skip(limit * page)
    .limit(limit)
    .exec(function(err, result) {
      Piada.countDocuments(query).exec((err, count) => {
        if (err) next(err);

        res.json({
          items: result,
          current_page: page + 1,
          page_size: result.length,
          pages: Math.ceil(count / limit),
          total: count
        });
      });
    });
});

router.get("/:id", function(req, res, next) {
  const id = req.params.id;

  Piada.findById(id, function(err, piada) {
    if (err) next(err);

    res.json(piada);
  });
});

router.get("/about", function(req, res) {
  res.send("About jokes");
});

module.exports = router;
