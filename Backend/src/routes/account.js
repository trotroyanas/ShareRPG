const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController.js");
const verify = require("./verifyToken.js");

//router.get("/api/account/lst", blogController.allBlogPost);

/** Account */

router.get("/get/:userid", verify.auth, accountController.Get);
router.delete("/del/:cle_api/:userid", accountController.Del);
router.put("/put/:userid", verify.auth, accountController.Put);
router.post("/add", accountController.Add);
router.post("/check", accountController.Check);
router.post("/login", accountController.Login);

router.post("/chgpwd", verify.auth, accountController.ChgPwd);

/** end Account */

module.exports = router;
