const Excel = require('exceljs');
const config = require('./config');
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));
const cellStyleBorder = {
    top: {style:'thin'},
    left: {style:'thin'},
    bottom: {style:'thin'},
    right: {style:'thin'}
};
function cellStyleFont(font) {
    return {
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
}};

var tasks = [];
console.log(this);
this.on('message', task => { 
    console.log('Task:');
    console.log(task);
    console.log('=============================================');
    tasks.push(task);
});

const run = async () => {
    while (true) {
        if (tasks.length > 0) {
            task = tasks.shift(0);
            let fileName = config.projectFolder + task.project;
            let workbook = new Excel.Workbook();
            await workbook.xlsx.readFile(fileName);
            let sheet = workbook.getWorksheet(1);

            if (task.hasOwnProperty('new')) {
                // add new row
                sheet.addRow([
                    sheet.rowCount,         // A
                    '',                     // B
                    task.partNumber,        // C
                    '',                     // D
                    '',                     // E
                    '',                     // F
                    task.desc,              // G
                    '',                     // H
                    task.proj,              // I
                    '',                     // J
                    '',                     // K
                    '',                     // L
                    '',                     // M
                    '', //task.supplier,    // N
                    '', //task.vendor,      // O
                    '', //task.location,    // P
                    task.cut,               // Q
                    task.lathe,             // R
                    task.mill,              // S
                    task.weld,              // T
                    task.subcon,            // U
                    task.assy               // V
                ]);
                let row = sheet.getRow(sheet.rowCount);
                for (let i = 1; i <= row.cellCount; i++) {
                    let cell = row.getCell(i);
                    let font = sheet.getRow(sheet.rowCount - 1).getCell(i).font;
                    cell.border = cellStyleBorder;
                    cell.font = cellStyleFont(font);
                };
            }
            else {
                // change existing row
                let values = sheet.getColumn(3).values;
                let index = values.indexOf(task.partNumber);
                if (index != -1) {
                    var row = sheet.getRow(index);
                    row.getCell('N').value = task.supplier;
                    row.getCell('O').value = task.vendor;
                    row.getCell('P').value = task.location;
                    row.getCell('Q').value = task.cut;
                    row.getCell('R').value = task.lathe;
                    row.getCell('S').value = task.mill;
                    row.getCell('T').value = task.weld;
                    row.getCell('U').value = task.subcon;
                    row.getCell('V').value = task.assy;
                }
            }
            await workbook.xlsx.writeFile(fileName);
      }
      else
        await snooze(1000);
  }
};

run();
