var express = require("express");
var Excel = require("exceljs");
var router = express.Router();
const config = require('../config');

/* GET PickProject page. */
router.get("/", function(req, res, next) {
  res.render("DAFViewForm", { title: "ViewForm" });
});

router.post("/", function(req, res, next) {
  let fileName = config.projectFolder + req.body.sellist1;
  let partNumber = req.body.sellist2;

  var data = {
    title: 'ViewForm',
    project: req.body.sellist1,
    partNumber: partNumber,
    supplier: '',
    vendor: '',
    location: '',
    cut: '',
    lathe: '',
    mill: '',
    weld: '',
    subcon: '',
    assy: ''
  };
  var workbook = new Excel.Workbook();
  workbook.xlsx.readFile(fileName)
  .then(function() {
    var sheet = workbook.getWorksheet(1);
    let values = sheet.getColumn(3).values;
    let index = values.indexOf(partNumber);
    if (index != -1) {
      let row = sheet.getRow(index);
      data.supplier = row.getCell('N');
      data.vendor = row.getCell('O');
      data.location = row.getCell('P');
      data.cut = row.getCell('Q');
      data.lathe = row.getCell('R');
      data.mill = row.getCell('S');
      data.weld = row.getCell('T');
      data.subcon = row.getCell('U');
      data.assy = row.getCell('V');
    }
    res.render("DAFViewForm", data);
  });
});

module.exports = router;
