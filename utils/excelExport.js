const ExcelJS = require("exceljs");

module.exports = async (res, data, fileName, columns) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(fileName);

  // Set column headers
  sheet.columns = columns;

  // Add data rows
  data.forEach(d => sheet.addRow(d));

  // Set headers to download file
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", `attachment; filename=${fileName}.xlsx`);

  await workbook.xlsx.write(res);
  res.end();
};