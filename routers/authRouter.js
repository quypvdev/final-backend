const router = require("express").Router();
const authCtrl = require("../controllers/authController");

router.post("/login", authCtrl.login);
router.post("/refresh-token", authCtrl.refreshToken);
router.delete("/logout", authCtrl.logout);
router.post("/email-reset-password", authCtrl.emailResetPassword);
router.post("/reset-password", authCtrl.resetPassword);

module.exports = router;
