const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController.js");
const verify = require("./verifyToken.js");

//router.get("/api/account/lst", blogController.allBlogPost);

/** Account */

router.get("/get/:userid", verify.auth, accountController.Get);
router.delete("/del/:userid", accountController.Del);
router.put("/put/:userid", verify.auth, accountController.Put);
router.post("/add", accountController.Add);
router.post("/chgpwd", verify.auth, accountController.ChgPwd);

router.get("/profil/:userid", verify.auth, accountController.Profil);
router.get("/renew", verify.auth, accountController.ReNew);

router.post("/login", accountController.Login);
router.get("/emailexist/:email/:userid?", accountController.EmailExist);
/** end Account */

module.exports = router;
