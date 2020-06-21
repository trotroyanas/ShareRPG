const express = require("express");
const router = express.Router();
const accountController = require("../controllers/docmanController.js");
const verify = require("./verifyToken.js");

//router.get("/api/account/lst", blogController.allBlogPost);

/** Account */

router.post("/upload", verify.auth, accountController.Upload);

/** end Account */

module.exports = router;
