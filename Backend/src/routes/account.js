const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController.js");
const verify = require("./verifyToken.js");

//router.get("/api/account/lst", blogController.allBlogPost);

/** Account */

router.get("/get/:userid", verify.auth, accountController.Get);
router.post("/add", verify.auth, accountController.Add);
router.put("/put/:userid", verify.auth, accountController.Put);
router.post("/chgpwd", verify.auth, accountController.ChgPwd);
router.get("/emailexist/:email/:userid?", verify.auth, accountController.EmailExist);
router.get("/profil/:userid", verify.auth, accountController.Profil);
router.get("/renew", verify.auth, accountController.ReNew);

router.delete("/del/:userid", accountController.Del);

router.post("/login", accountController.Login);
router.get("/maketoken", accountController.makeToken);
router.get("/validmail", verify.auth, accountController.validMail);

// pour les pertes de password ou de token plus valide pour valider son compte/email
router.get("/resendtoken/:email", verify.auth, accountController.ResendToken);
router.get("/resetpassword/:email", verify.auth, accountController.ResetPassword);
router.post("/newpassword", verify.auth, accountController.NewPassword);

/** end Account */

module.exports = router;
