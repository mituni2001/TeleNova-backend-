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


/* ── RSU EXPORT  GET /api/export/rsu ───────────────────────── */
exports.exportRSU = async (_req, res) => {
  try {
    console.log("📊 RSU export started");
    const records = await RSU.find().sort({ createdAt: -1 }).lean();
    console.log(`   Found ${records.length} RSU records`);

    const wb   = new ExcelJS.Workbook();
    wb.creator = "TeleNova";
    wb.created = new Date();
    const ws   = wb.addWorksheet("RSU Data", {
      views: [{ state: "frozen", ySplit: 2 }],
    });

    /* Row 1: group headers */
    const groups = [
      { label: "RSU Name",            cols: 1,  color: "FF1A3A6B" },
      { label: "Primary Rectifier",   cols: 11, color: "FF1E4E7A" },
      { label: "Secondary Rectifier", cols: 11, color: "FF1A3A6B" },
      { label: "Battery Bank 1",      cols: 6,  color: "FF2E6B4F" },
      { label: "Battery Bank 2",      cols: 6,  color: "FF256040" },
      { label: "Battery Bank 3",      cols: 6,  color: "FF1D5035" },
      { label: "Battery Bank 4",      cols: 6,  color: "FF164028" },
      { label: "AC Unit 1",           cols: 4,  color: "FF6B3A1A" },
      { label: "AC Unit 2",           cols: 4,  color: "FF5A3015" },
      { label: "AC Unit 3",           cols: 4,  color: "FF49260F" },
      { label: "Generator",           cols: 5,  color: "FF4A1A5A" },
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

    /* Row 2: sub-headers */
    const rectSH = [
      "Rect Type", "Installed Date", "Module Type",
      "Working", "Faulty", "Total Modules",
      "Capacity (A)", "DC Load (A)", "Load %", "Phase", "Connected Nodes",
    ];
    const bbSH = ["Brand", "Type", "Voltage", "Capacity (Ah)", "Connected Rect", "Health"];
    const acSH = ["Type", "Inverter", "BTU/h", "Health"];

    const subHeaders = [
      "RSU Name",
      ...rectSH, ...rectSH,
      ...bbSH, ...bbSH, ...bbSH, ...bbSH,
      ...acSH, ...acSH, ...acSH,
      "Model", "Capacity", "Brand", "ATS", "Available",
      "Ph1 (A)", "Ph2 (A)", "Ph3 (A)", "Neutral (A)",
    ];

    const shColors = [
      "FF2D6A9F",
      ...Array(11).fill("FF1E4E7A"), ...Array(11).fill("FF1A3A6B"),
      ...Array(6).fill("FF2E6B4F"),  ...Array(6).fill("FF256040"),
      ...Array(6).fill("FF1D5035"),  ...Array(6).fill("FF164028"),
      ...Array(4).fill("FF6B3A1A"),  ...Array(4).fill("FF5A3015"),
      ...Array(4).fill("FF49260F"),
      ...Array(5).fill("FF4A1A5A"),
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

    /* data row helpers */
    const rectCols = (r) => {
      if (!r) return Array(11).fill("—");
      const total = (r.modules?.working || 0) + (r.modules?.faulty || 0);
      return [
        fmt(r.type), fmtDate(r.installedDate), fmt(r.moduleType),
        r.modules?.working ?? "—", r.modules?.faulty ?? "—",
        total || "—", r.capacity ?? "—", r.dcLoad ?? "—",
        loadPct(r.dcLoad, r.capacity), fmt(r.phase),
        (r.connectedNodes || []).filter(Boolean).join(" / ") || "—",
      ];
    };

    const bankCols = (b) => {
      if (!b || !b.brand) return Array(6).fill("—");
      return [fmt(b.brand), fmt(b.batteryType), fmt(b.voltage),
              b.ah || "—", fmt(b.connectedRectifier), fmt(b.health)];
    };

    const acCols = (u) => {
      if (!u || !u.type) return Array(4).fill("—");
      return [fmt(u.type), fmtBool(u.inverter), u.btu || "—", fmt(u.health)];
    };

    /* data rows */
    records.forEach((rec, rowIdx) => {
      const bb = rec.batteryBanks || [];
      const au = rec.acUnits      || [];
      const gn = rec.generator    || {};
      const al = rec.acLoad       || {};

      const rowData = [
        rec.rsuName,
        ...rectCols(rec.primaryRectifier),
        ...rectCols(rec.secondaryRectifier),
        ...bankCols(bb[0]), ...bankCols(bb[1]),
        ...bankCols(bb[2]), ...bankCols(bb[3]),
        ...acCols(au[0]),   ...acCols(au[1]),  ...acCols(au[2]),
        fmt(gn.model), fmt(gn.capacity), fmt(gn.brand),
        fmtBool(gn.ats), fmtBool(gn.available),
        fmt(al.phase1), fmt(al.phase2), fmt(al.phase3), fmt(al.neutral),
      ];

      const row = ws.addRow(rowData);
      row.height = 18;
      const bg   = rowIdx % 2 === 0 ? "FFF0F4FA" : "FFFFFFFF";
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: bg } };
        cell.font      = { size: 10 };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border    = {
          top: { style: "hair" }, left: { style: "hair" },
          bottom: { style: "hair" }, right: { style: "hair" },
        };
      });
      const nc     = row.getCell(1);
      nc.font      = { bold: true, size: 10 };
      nc.alignment = { vertical: "middle", horizontal: "left" };
    });

    /* column widths */
    [
      22,
      16, 12, 14, 8, 8, 8, 10, 10, 8, 12, 30,
      16, 12, 14, 8, 8, 8, 10, 10, 8, 12, 30,
      12, 10, 8, 10, 16, 8,
      12, 10, 8, 10, 16, 8,
      12, 10, 8, 10, 16, 8,
      12, 10, 8, 10, 16, 8,
      16, 8, 10, 8,
      16, 8, 10, 8,
      16, 8, 10, 8,
      14, 10, 12, 6, 6,
      8, 8, 8, 8,
    ].forEach((w, i) => { ws.getColumn(i + 1).width = w; });

    await sendWorkbook(res, wb, "RSU_DATA.xlsx");
    console.log("✅ RSU export done");
  } catch (err) {
    console.error("❌ RSU export error:", err);
    if (!res.headersSent) res.status(500).json({ error: err.message });
  }
};   