const ExcelJS = require("exceljs");
const MSAN = require("../models/msan.model");
const RSU = require("../models/RSU.model");


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



// ── Helper functions ──
const fmt = (val) => (val !== undefined && val !== null ? String(val) : "—");
const fmtDate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "—");
const fmtBool = (val) => (val === true ? "Yes" : val === false ? "No" : "—");
const loadPct = (dcLoad, capacity) => {
  const dc = Number(dcLoad), cap = Number(capacity);
  if (!cap || cap === 0) return "0.0";
  return ((dc / cap) * 100).toFixed(1);
};

// ── Workbook sender ──
const sendWorkbook = async (res, wb, filename) => {
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  await wb.xlsx.write(res);
  res.end();
};

/* ── RSU EXPORT (template match) ──────────── */
exports.exportRSU = async (_req, res) => {
  try {
    console.log("📊 RSU export started");
    const records = await RSU.find().sort({ createdAt: -1 }).lean();
    console.log(`   Found ${records.length} RSU records`);

    const wb = new ExcelJS.Workbook();
    wb.creator = "TeleNova";
    wb.created = new Date();
    const ws = wb.addWorksheet("RSU Data", {
      views: [{ state: "frozen", ySplit: 2 }],
    });

    // Group headers (row 1)
    const groups = [
      { label: "RSU Name",            cols: 1,  color: "FF1A3A6B" },
      { label: "Primary Rectifier",   cols: 12, color: "FF1E4E7A" },
      { label: "Secondary Rectifier", cols: 12, color: "FF1A3A6B" },
      { label: "Battery Bank 1",      cols: 6,  color: "FF2E6B4F" },
      { label: "Battery Bank 2",      cols: 6,  color: "FF256040" },
      { label: "Battery Bank 3",      cols: 5,  color: "FF1D5035" },
      { label: "Battery Bank 4",      cols: 5,  color: "FF164028" },
      { label: "AC Unit 1",           cols: 4,  color: "FF6B3A1A" },
      { label: "AC Unit 2",           cols: 4,  color: "FF5A3015" },
      { label: "AC Unit 3",           cols: 4,  color: "FF49260F" },
      { label: "Generator",           cols: 4,  color: "FF4A1A5A" },
      { label: "AC Load",             cols: 4,  color: "FF1A3A5A" },
    ];

    let col = 1;
    for (const g of groups) {
      if (g.cols > 1) ws.mergeCells(1, col, 1, col + g.cols - 1);
      const c = ws.getCell(1, col);
      c.value     = g.label;
      c.font      = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
      c.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: g.color } };
      c.alignment = { horizontal: "center", vertical: "middle" };
      c.border    = {
        top: { style: "medium" }, left: { style: "medium" },
        bottom: { style: "medium" }, right: { style: "medium" },
      };
      col += g.cols;
    }

    // Sub-headers (row 2)
    const subHeaders = [
      "RSU Name",
      // Primary Rectifier (12)
      "Rectifier Type","Installed Date","Module Type",
      "Working module Count","Faulty Module count",
      "Module Capacity","DC Load (A)","Phase",
      "Connected Node 1","Connected Node 2","Connected Node 3","Connected Node 4",
      // Secondary Rectifier (12)
      "Rectifier Type","Installed Date","Module Type",
      "Working module Count","Faulty Module count",
      "Module Capacity","DC Load (A)","Phase",
      "Connected Node 1","Connected Node 2","Connected Node 3","Connected Node 4",
      // Battery Bank 1 (6)
      "Brand Name","Battery Type","battery voltage","Capacity","Connected Rectifier","Health",
      // Battery Bank 2 (6)
      "Brand Name","Battery Type","battery voltage","Capacity","Connected Rectifier","Health",
      // Battery Bank 3 (5 – no Brand)
      "Battery Type","battery voltage","Capacity","Connected Rectifier","Health",
      // Battery Bank 4 (5)
      "Battery Type","battery voltage","Capacity","Connected Rectifier","Health",
      // AC Units (3×4)
      "Type","Inverter","Btu/h","Health",
      "Type","Inverter","Btu/h","Health",
      "Type","Inverter","Btu/h","Health",
      // Generator (4)
      "Model","Capasity","Brand","ATS Available",
      // AC Load (4)
      "Ph1","Ph2","Ph3","N",
    ];

    const shColors = [
      "FF2D6A9F",
      ...Array(12).fill("FF1E4E7A"), ...Array(12).fill("FF1A3A6B"),
      ...Array(6).fill("FF2E6B4F"),  ...Array(6).fill("FF256040"),
      ...Array(5).fill("FF1D5035"),  ...Array(5).fill("FF164028"),
      ...Array(4).fill("FF6B3A1A"),  ...Array(4).fill("FF5A3015"),
      ...Array(4).fill("FF49260F"),
      ...Array(4).fill("FF4A1A5A"),
      ...Array(4).fill("FF1A3A5A"),
    ];

    subHeaders.forEach((h, i) => {
      const c = ws.getCell(2, i + 1);
      c.value     = h;
      c.font      = { bold: true, color: { argb: "FFFFFFFF" }, size: 10 };
      c.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: shColors[i] } };
      c.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      c.border    = {
        top: { style: "thin" }, left: { style: "thin" },
        bottom: { style: "medium" }, right: { style: "thin" },
      };
    });

    ws.getRow(1).height = 22;
    ws.getRow(2).height = 36;

    // Data helpers
    const rectCols = (r) => {
      if (!r) return Array(12).fill("—");
      const nodes = r.connectedNodes || ["", "", "", ""];
      return [
        fmt(r.type), fmtDate(r.installedDate), fmt(r.moduleType),
        fmt(r.modules?.working), fmt(r.modules?.faulty),
        fmt(r.capacity), fmt(r.dcLoad), fmt(r.phase),
        fmt(nodes[0]), fmt(nodes[1]), fmt(nodes[2]), fmt(nodes[3]),
      ];
    };

    const bankCols = (b, idx) => {
      if (!b) return idx <= 2 ? Array(6).fill("—") : Array(5).fill("—");
      if (idx <= 2) {
        return [fmt(b.brand), fmt(b.batteryType), fmt(b.voltage), fmt(b.ah), fmt(b.connectedRectifier), fmt(b.health)];
      } else {
        return [fmt(b.batteryType), fmt(b.voltage), fmt(b.ah), fmt(b.connectedRectifier), fmt(b.health)];
      }
    };

    const acCols = (u) => {
      if (!u || !u.type) return Array(4).fill("—");
      return [fmt(u.type), fmtBool(u.inverter), fmt(u.btu), fmt(u.health)];
    };

    records.forEach((rec, rowIdx) => {
      const bb = rec.batteryBanks || [];
      const au = rec.acUnits || [];
      const gn = rec.generator || {};
      const al = rec.acLoad || {};

      const rowData = [
        rec.rsuName,
        ...rectCols(rec.primaryRectifier),
        ...rectCols(rec.secondaryRectifier),
        ...bankCols(bb[0],1), ...bankCols(bb[1],2),
        ...bankCols(bb[2],3), ...bankCols(bb[3],4),
        ...acCols(au[0]), ...acCols(au[1]), ...acCols(au[2]),
        fmt(gn.model), fmt(gn.capacity), fmt(gn.brand),
        fmtBool(gn.ats),
        fmt(al.phase1), fmt(al.phase2), fmt(al.phase3), fmt(al.neutral),
      ];

      const row = ws.addRow(rowData);
      row.height = 18;
      const bg = rowIdx % 2 === 0 ? "FFF0F4FA" : "FFFFFFFF";
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: bg } };
        cell.font      = { size: 10 };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border    = {
          top: { style: "hair" }, left: { style: "hair" },
          bottom: { style: "hair" }, right: { style: "hair" },
        };
      });
      const nc = row.getCell(1);
      nc.font      = { bold: true, size: 10 };
      nc.alignment = { vertical: "middle", horizontal: "left" };
    });

    // Column widths
    [
      22,
      16,12,14,10,10,12,10,12,12,12,12,12,
      16,12,14,10,10,12,10,12,12,12,12,12,
      12,10,8,10,16,8,
      12,10,8,10,16,8,
      10,8,10,16,8,
      10,8,10,16,8,
      14,8,10,8,
      14,8,10,8,
      14,8,10,8,
      14,10,12,12,
      8,8,8,8,
    ].forEach((w, i) => { ws.getColumn(i + 1).width = w; });

    await sendWorkbook(res, wb, "RSU_DATA.xlsx");
    console.log("✅ RSU export done");
  } catch (err) {
    console.error("❌ RSU export error:", err);
    if (!res.headersSent) res.status(500).json({ error: err.message });
  }
};