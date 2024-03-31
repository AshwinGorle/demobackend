const express = require("express");
const issuedBookController = require("./../Controller/issuedBookController");

const router = express.Router();

router.route("/").post(issuedBookController.checkIssuedBooks);
router.route("/return").post(issuedBookController.returnBook);
router.route("/statistics").get(issuedBookController.statistics);
module.exports = router;
