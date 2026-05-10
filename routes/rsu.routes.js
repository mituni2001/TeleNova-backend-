// routes/rsu.routes.js
const express = require("express");
const router  = express.Router();
const ctrl    = require("../controllers/rsu.controller");

// IMPORTANT: /delete/all MUST be registered BEFORE /:id
// to prevent Express treating "all" as a Mongo ObjectId

router.post  ("/",           ctrl.createRSU);
router.get   ("/",           ctrl.getAllRSU);
router.get   ("/:id",        ctrl.getRSUById);
router.put   ("/:id",        ctrl.updateRSU);
router.delete("/delete/all", ctrl.deleteAllRSU);
router.delete("/:id",        ctrl.deleteRSU);

module.exports = router;   