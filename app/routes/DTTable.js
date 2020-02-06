var express = require('express');
var Excel = require('exceljs');
var router = express.Router();
const config = require('../config');

/* GET PickProject page. */
router.post('/', function(req, res, next) {
  var columns = ['Part Number', 'Supplier', 'Vendor'];
  var excelColumns = ['C', 'N', 'O'];
  var data = [];
  let fileName = config.projectFolder + req.body.project;

  if (req.body.cut == 'on') {
    columns.push('CUT');
    excelColumns.push('Q');
  }
  if (req.body.lathe == 'on') {
    columns.push('LATHE');
    excelColumns.push('R');
  }
  if (req.body.mill == 'on') {
    columns.push('MILL');
    excelColumns.push('S');
  }
  if (req.body.weld == 'on') {
    columns.push('WELD');
    excelColumns.push('T');
  }
  if (req.body.subcon == 'on') {
    columns.push('SUB-CON');
    excelColumns.push('U');
  }
  if (req.body.assy == 'on') {
    columns.push('ASSY');
    excelColumns.push('V');
  }

  var workbook = new Excel.Workbook();
  workbook.xlsx.readFile(fileName)
  .then(function() {
    var sheet = workbook.getWorksheet(1);
    for (var i = 1; i < sheet.rowCount; i++) {
      var row = sheet.getRow(i);
      var rowData = [];
      for (var j = 0; j < excelColumns.length; j++)
        rowData.push(row.getCell(excelColumns[j]));
      data.push(rowData);
    }
    res.render('DTTable', { title: 'DTTable', columns: columns, data: data });
  });
});

module.exports = router;
