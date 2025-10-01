// routes/variantRoutes.js
const express = require("express");
const router = express.Router();

const variantController = require("../controllers/variantController");
const auth = require("../middleware/auth");
const allowRoles = require("../middleware/role");

// ✅ 6.4 Variant Detection (run detection) → User only
router.get(
  "/detect/:fileId",
  auth,
  allowRoles("User"),
  variantController.detectVariants
);

// ✅ Mutation Density (per chromosome) → User + Clinician
router.get(
  "/mutation-density/:fileId",
  auth,
  allowRoles("User", "Clinician"),
  variantController.getMutationDensity
);

// ✅ Region Metrics (SNPs, Indels, Homo/Hetero counts) → User + Clinician
router.get(
  "/region-metrics/:fileId",
  auth,
  allowRoles("User", "Clinician"),
  variantController.getRegionMetrics
);

module.exports = router;
