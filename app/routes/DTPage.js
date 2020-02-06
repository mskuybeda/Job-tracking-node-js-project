var express = require("express");
var router = express.Router();
const config = require('../config');
const fs = require('fs');

/* GET PickProject page. */
router.get("/", function(req, res, next) {
  var fileList = fs.readdirSync(config.projectFolder);
  fileList = fileList.filter(item => item[0] != '~');
  res.render("DTPage", { title: "DTPage", fileList });
});

module.exports = router;
