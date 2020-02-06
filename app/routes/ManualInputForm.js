var express = require("express");
var Excel = require("exceljs");
var router = express.Router();
const config = require('../config');

/* GET PickProject page. */
router.get("/", function(req, res, next) {
  res.render("ManualInputForm", { title: "ManualInputForm" });
});

router.post("/", function(req, res, next) {
  let data = {
    title: 'ManualInputForm',
    project: req.body.sellist1,
    newField: 0
  };
  res.render("ManualInputForm", data);
});

module.exports = router;
