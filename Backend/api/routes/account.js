const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController.js");

//router.get("/api/account/lst", blogController.allBlogPost);
router.post("/add", accountController.accountAdd);
//router.delete("/api/account/del/:userId", accountController.accountDel);
//router.put("/api/account/put/:userId", accountController.accountPut);
//router.put("/api/account/ver/:email", accountController.accountVer);

module.exports = router;