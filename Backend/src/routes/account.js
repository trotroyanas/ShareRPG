const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController.js");

//router.get("/api/account/lst", blogController.allBlogPost);

/** Account */

router.get("/get/:cle_api/:userId", accountController.Get);
router.post("/add", accountController.Add);
router.delete("/del/:cle_api/:userId", accountController.Del);
router.put("/put/:cle_api/:userId", accountController.Put);
router.post("/check", accountController.Check);
router.post("/login", accountController.Login);

/** end Account */



module.exports = router;