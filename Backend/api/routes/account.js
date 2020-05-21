const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController.js");

//router.get("/api/account/lst", blogController.allBlogPost);
router.post("/add", accountController.Add);
router.delete("/del/:userId", accountController.Del);
router.put("/put/:userId", accountController.Put);
router.post("/check", accountController.Check);

module.exports = router;