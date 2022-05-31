const xlsx = require("xlsx");

const spreadsheet = xlsx.readFile('./MauUploadHD-TT78.xlsx');

const sheet = spreadsheet.Sheets['List_HD']; //sheet 1 is index 0

xlsx.utils.sheet_add_aoa(sheet, [
    [5, '', 'Nguyen Duy Y', '', 'Tan Binh', '', '', '', '', 3, 'VND', 1, 'Item1', '', 10, 10000, 100000, 10, 10000, 110000, 1, 110000, 1, 10000, 110000, 'Mot tram muoi nghin dong', 'ABD' ]
], {
    origin: 'A12'
});
 sheet['A12'].t = 's';
// sheet['C13'].v = 'Nguyen Duy Y';
// sheet['E13'].v = 'Tan Binh';
 sheet['J12'].t = 's';
// sheet['K13'].v = 'VND';
 sheet['L12'].t = 's';
// sheet['M13'].v = 'Item1';
// sheet['O13'].v = 10;
// sheet['P13'].v = 10000;
 sheet['U12'].t = 's';
 sheet['U11'].t = 's';
 sheet['U10'].t = 's';
 sheet['U9'].t = 's';
 sheet['U8'].t = 's';
 sheet['U7'].t = 's';
 sheet['U6'].t = 's';
 sheet['U5'].t = 's';
 sheet['U4'].t = 's';
 sheet['U3'].t = 's';
 sheet['U2'].t = 's';

xlsx.writeFile(spreadsheet, "output.xlsx");

const newSheet = xlsx.readFile('./output.xlsx');
console.log('')

