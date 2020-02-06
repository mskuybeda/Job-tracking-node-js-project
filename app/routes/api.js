var express = require('express');
var Excel = require('exceljs');
const config = require('../config');
var router = express.Router();

print = function(res, data) {
    res.send(data);
};

const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

savePartNumber = async (data) => {
    let fileName = config.projectFolder + data.project;
    var workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(fileName);
    let sheet = workbook.getWorksheet(1);
    
    let shouldWriteFile = true;
    let error = '';
    if (data.new) {
        sheet.addRow([
            sheet.rowCount,      // A
            '',                  // B
            data.partNumber,     // C
            '',                  // D
            '',                  // E
            '',                  // F
            data.desc,           // G
            '',                  // H
            data.proj,           // I
            '',                  // J
            '',                  // K
            '',                  // L
            '',                  // M
            '', //data.supplier, // N
            '', //data.vendor,   // O
            '', //data.location, // P
            data.cut,            // Q
            data.lathe,          // R
            data.mill,           // S
            data.weld,           // T
            data.subcon,         // U
            data.assy            // V
        ]);
        var row = sheet.getRow(sheet.rowCount);
        for (let i = 1; i <= row.cellCount; i++) {
            let cell = row.getCell(i);
            let font = sheet.getRow(sheet.rowCount - 1).getCell(i).font;
            cell.border = {
                top: {style:'thin'},
                left: {style:'thin'},
                bottom: {style:'thin'},
                right: {style:'thin'}
            };
            cell.font = {
                name: font.name,
                family: font.family,
                color: { argb:'FFFF0F0F' },
                size: font.size,
                bold: font.bold,
                italic: font.italic,
                outline: font.outline,
                strike: font.strike,
                underline: font.underline,
                vertAlign: font.vertAlign
            };
        };
    }
    else {
        let values = sheet.getColumn(3).values;
        let index = values.indexOf(data.partNumber);
        if (index != -1) {
            var row = sheet.getRow(index);
            row.getCell('N').value = data.supplier;
            row.getCell('O').value = data.vendor;
            row.getCell('P').value = data.location;
            row.getCell('Q').value = data.cut;
            row.getCell('R').value = data.lathe;
            row.getCell('S').value = data.mill;
            row.getCell('T').value = data.weld;
            row.getCell('U').value = data.subcon;
            row.getCell('V').value = data.assy;
        }
        else {
            shouldWriteFile = false;
            error = 'Part number not found';
        }
    }
        
    if (shouldWriteFile) {
        error = '';
        let i = 0;
        do {
            await workbook.xlsx.writeFile(fileName).catch(err => error = (err.code == 'EBUSY') ? 'Cannot open file: file is busy or locked' : 'Other error');
            if (error.length == 0)
                break;
            i++;
            await snooze(100);
        } while (i < 5);
    }

    return (error.length == 0) ? 'ok' : error;
};

/* GET api page. */
router.get('/', function(req, res, next) {
    res.render('api', { 'data': {} });
  });

router.get('/getPartNumbers', function(req, res, next) {
    var data = {};
    let fileName = config.projectFolder + req.query.project;
    var workbook = new Excel.Workbook();
    workbook.xlsx.readFile(fileName)
    .then(function() {
        var sheet = workbook.getWorksheet(1);
        data = sheet.getColumn(3).values;
        data.splice(0, 2);
        print(res, data);
    });
});

router.post('/changePartNumber', async (req, res, next) => {
    req.body.new = false;
    let err = await savePartNumber(req.body);
    print(res, err);
});

router.post('/addPartNumber', async (req, res, next) => {
    req.body.new = true;
    let err = await savePartNumber(req.body);
    print(res, err);
});

module.exports = router;
