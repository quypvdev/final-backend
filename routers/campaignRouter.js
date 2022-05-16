const router = require("express").Router();
const campaignCtrl = require("../controllers/campaignController");
const upload = require("../helpers/upload.multer");

router.post(
  "/create-campaign",
  upload.single("recfile"),
  campaignCtrl.createCampaign
);
router.get("/get-all-campaign", campaignCtrl.getAllCampaign);
router.get("/get-all-campaignActive", campaignCtrl.getAllCampaignActive);
router.get("/get-campaign/:id", campaignCtrl.getCampaignById);

router.patch(
  "/update-campaign/:id",
  upload.single("recfile"),
  campaignCtrl.updateCampaign
);
router.patch("/disable-campaign/:id", campaignCtrl.disableCampaign);
router.patch("/active-campaign/:id", campaignCtrl.activeCampaign);
router.patch("/update-campaign-disable", campaignCtrl.updateCampaignDisable);
router.get("/count-campaign-of-month", campaignCtrl.countCampaignOfMonth);

module.exports = router;
