const ExcelJS = require("exceljs");
const MSAN = require("../models/msan.model");
const RSU = require("../models/rsu.model");
const BatteryBank = require("../models/BatteryBank.model");
const ACUnit = require("../models/ACUnit.model");
const Generator = require("../models/Generator.model");
const ACLoad = require("../models/ACLoad.model");

// ================= DATE FORMAT FUNCTION =================
const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split("T")[0]; // 2026-02-04 format
};
// =======================================================

// ===== MSAN EXPORT =====
exports.exportMSAN = async (req, res) => {
  try {

    console.log("🔥 MSAN export route hit 🔥");

    const data = await MSAN.find();
    console.log("MSAN records found:", data.length);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("MSAN Data");

    /* ===== Columns ===== */

    sheet.columns = [
      { header: "MSAN Type", key: "msanType", width: 20 },
      { header: "Vendor", key: "vendor", width: 15 },
      { header: "MSAN Name", key: "msanName", width: 15 },
      { header: "Rectifier Type", key: "rectifierType", width: 18 },
      { header: "Working Modules", key: "workingRectifierModules", width: 18 },
      { header: "Faulty Modules", key: "faultyRectifierModules", width: 18 },
      { header: "Battery Type", key: "batteryType", width: 20 },
      { header: "Voltage", key: "voltage", width: 15 },
      { header: "Health", key: "health", width: 15 },
    ];

    /* ===== Header Style ===== */

    const headerRow = sheet.getRow(1);

    headerRow.eachCell((cell) => {

      cell.font = { bold: true };

      cell.alignment = {
        horizontal: "center",
        vertical: "middle"
      };

      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "C6E0B4" } // green
      };

      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      };

    });

    /* ===== Add Data ===== */

    data.forEach((d) => {

      const batteryType = d.battery?.map(b => b.type).join(", ") || "";
      const voltage = d.battery?.map(b => b.voltage).join(", ") || "";
      const health = d.battery?.map(b => b.health).join(", ") || "";

      sheet.addRow({
        msanType: d.msanType,
        vendor: d.vendor,
        msanName: d.msanName,
        rectifierType: d.rectifierType,
        workingRectifierModules: d.workingRectifierModules,
        faultyRectifierModules: d.faultyRectifierModules,
        batteryType: batteryType,
        voltage: voltage,
        health: health,
      });

    });

    /* ===== Data Row Style ===== */

    sheet.eachRow((row, rowNumber) => {

      if (rowNumber > 1) {

        row.eachCell((cell) => {

          cell.alignment = {
            horizontal: "center",
            vertical: "middle"
          };

          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" }
          };

        });

      }

    });

    /* ===== Send Excel ===== */

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=MSAN_DATA.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();

    console.log("✅ MSAN Excel sent to client");

  } catch (err) {

    console.log("MSAN EXPORT ERROR:", err);

    res.status(500).json({
      error: err.message
    });

  }
};

// ===== RSU FULL EXPORT =====
exports.exportRSU = async (req, res) => {
  try {
    console.log("🔥 RSU Excel export started");

    const rsus = await RSU.find();
    const batteries = await BatteryBank.find();
    const acUnits = await ACUnit.find();
    const generators = await Generator.find();
    const acLoads = await ACLoad.find();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("RSU DATA");
   
      // --- Main Headers ---
    const mainHeaders = [
      { title: "Primary Rectifier", count: 13 },
      { title: "Secondary Rectifier", count: 12 },
      { title: "Eng Remark", count: 1 },
      { title: "Battery Bank 1", count: 6 },
      { title: "Battery Bank 2", count: 6 },
      { title: "Battery Bank 3", count: 5 },
      { title: "Battery Bank 4", count: 5 },
      { title: "AC Unit 1", count: 4 },
      { title: "AC Unit 2", count: 4 },
      { title: "AC Unit 3", count: 4 },
      { title: "Generator", count: 4 },
      { title: "AC Load", count: 4 }
    ];

    // --- Sub Headers ---
    const subHeaders = [
      // Primary Rectifier
      "RSU Name","Rectifier Type","Installed Date","Module Type","Working module Count","Faulty Module count","Module Capacity","DC Load (A)","Phase","Node 1","Node 2","Node 3","Node 4",
      // Secondary Rectifier
      "Rectifier Type","Installed Date","Module Type","Working module Count","Faulty Module count","Module Capacity","DC Load (A)","Phase","Node 1","Node 2","Node 3","Node 4",
      // Remark
      "Remark",
      // Battery Banks 1 & 2
      "Brand Name","Battery Type","Voltage","Capacity","Connected Rectifier","Health",
      "Brand Name","Battery Type","Voltage","Capacity","Connected Rectifier","Health",
      // Battery Banks 3 & 4
      "Battery Type","Voltage","Capacity","Connected Rectifier","Health",
      "Battery Type","Voltage","Capacity","Connected Rectifier","Health",
      // AC Units 1,2,3
      "Type","Inverter","Btu/h","Health",
      "Type","Inverter","Btu/h","Health",
      "Type","Inverter","Btu/h","Health",
      // Generator
      "Model","Capacity","Brand","ATS","Available",
      // AC Load
      "Ph1","Ph2","Ph3","N"
    ];

    // --- Row 1: Main Headers with merge & style ---
    let colPos = 1;
    mainHeaders.forEach(h => {
      const start = colPos;
      const end = colPos + h.count - 1;
      sheet.mergeCells(1, start, 1, end);
      const cell = sheet.getCell(1, start);
      cell.value = h.title;
      cell.font = { bold: true, size: 11 };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'C6E0B4' } };
      cell.border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
      colPos += h.count;
    });

    // --- Row 2: Sub Headers ---
    sheet.addRow(subHeaders);
    sheet.getRow(2).eachCell((cell) => {
      cell.font = { bold: true, size: 10 };
      cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E2EFDA' } };
      cell.border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
    });

    // --- Row 3 onwards: Map Data ---
    rsus.forEach((r, i) => {
      const b1 = batteries[i*4] || {};
      const b2 = batteries[i*4+1] || {};
      const b3 = batteries[i*4+2] || {};
      const b4 = batteries[i*4+3] || {};

      const ac1 = acUnits[i*3] || {};
      const ac2 = acUnits[i*3+1] || {};
      const ac3 = acUnits[i*3+2] || {};

      const gen = generators[i] || {};
      const acl = acLoads[i] || {};

      sheet.addRow([
        // Primary Rectifier
        r.rsuName, r.primaryRectifier?.type, formatDate(r.primaryRectifier?.installedDate), r.primaryRectifier?.moduleType, r.primaryRectifier?.workingCount, r.primaryRectifier?.faultyCount, r.primaryRectifier?.capacity, r.primaryRectifier?.dcLoad, r.primaryRectifier?.phase, r.primaryRectifier?.nodes?.[0], r.primaryRectifier?.nodes?.[1], r.primaryRectifier?.nodes?.[2], r.primaryRectifier?.nodes?.[3],
        // Secondary Rectifier
        r.secondaryRectifier?.type, formatDate(r.secondaryRectifier?.installedDate), r.secondaryRectifier?.moduleType, r.secondaryRectifier?.workingCount, r.secondaryRectifier?.faultyCount, r.secondaryRectifier?.capacity, r.secondaryRectifier?.dcLoad, r.secondaryRectifier?.phase, r.secondaryRectifier?.nodes?.[0], r.secondaryRectifier?.nodes?.[1], r.secondaryRectifier?.nodes?.[2], r.secondaryRectifier?.nodes?.[3],
        // Remark
        r.remark || "",
        // Battery Banks
        b1.brandName, b1.batteryType, b1.voltage, b1.ah, b1.connectedRectifier, b1.health,
        b2.brandName, b2.batteryType, b2.voltage, b2.ah, b2.connectedRectifier, b2.health,
        b3.batteryType, b3.voltage, b3.ah, b3.connectedRectifier, b3.health,
        b4.batteryType, b4.voltage, b4.ah, b4.connectedRectifier, b4.health,
        // AC Units
        ac1.type, ac1.inverter ? "Yes" : "No", ac1.btu, ac1.health,
        ac2.type, ac2.inverter ? "Yes" : "No", ac2.btu, ac2.health,
        ac3.type, ac3.inverter ? "Yes" : "No", ac3.btu, ac3.health,
        // Generator
        gen.model, gen.capacity, gen.brand, gen.ats ? "Yes" : "No", gen.available ? "Yes" : "No",
        // AC Load
        acl.phase1, acl.phase2, acl.phase3, acl.neutral
      ]);
    });

    // --- Style Data Rows ---
    sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if(rowNumber > 2){
        row.eachCell(cell => {
          cell.border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
          cell.alignment = { horizontal: "center", vertical: "middle" };
        });
      }
    });

    // --- Column Widths ---
    sheet.columns.forEach((col, index) => {
      if(index === 0) col.width = 20; // RSU Name wider
      else col.width = 15;
    });

    // --- Send Excel File ---
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=RSU_Inventory.xlsx");

    await workbook.xlsx.write(res);
    res.end();

    console.log("✅ RSU Excel sent to client");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating Excel file");
  }
};