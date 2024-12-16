const router = require("express").Router();
const {
  getAllData,
  getDataById,
  createNewData,
  updateExistingData,
  deleteDataById,
  checkingExistingEvaluation,
  evaluationData,
  getEvaluationsByMajor,
  getDownloadEvaluations,
  downloadEvaluationPDF
} = require("../controller/controllerEvaluations");

router.get("/", getAllData);
router.get("/id/:id", getDataById);
router.post("/", createNewData);
router.put("/:id", updateExistingData);
router.delete("/:id", deleteDataById);
router.post("/check", checkingExistingEvaluation);
router.get("/data", evaluationData);
router.get("/major", getEvaluationsByMajor);
router.get("/check/:id", getDownloadEvaluations);
router.get("/download/:id", downloadEvaluationPDF);

module.exports = router;
